<template>
  <div class="page-content">
    <div class="header-row">
      <h1 class="title">Mnist数字识别</h1>
      <el-upload
        class="upload-btn"
        action="string"
        :http-request="handleImageUpload"
        :show-file-list="false"
        :before-upload="beforeImageUpload"
        >上传图片</el-upload
      >
    </div>
    <div class="list">
      <ul class="offset">
        <li
          class="mnist-card"
          v-for="item in dataList"
          :key="item.id"
          :style="{ backgroundColor: randomColor() }"
        >
          <div class="mnist-card-left">
            <img :src="item.image" alt="mnist image" class="mnist-image" />
            <p class="created-at">
              🕒 {{ dayjs(item.created_at).format('YYYY年MM月DD日 HH:mm') }}
            </p>
          </div>
          <div class="mnist-card-right">
            <p class="mnist-label">识别结果: {{ item.label !== null ? item.label : '未识别' }}</p>
            <button
              class="recognize-btn"
              :disabled="item.label !== null"
              @click.stop="handleRecognize(item)"
            >
              {{ item.label !== null ? '已识别' : '识别' }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { MnistService } from '@/api/mnistApi'
  import { MnistImageData } from '@/api/model/mnistModel'
  import type { UploadProps } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload.d'

  import dayjs from 'dayjs'

  const dataList = ref<MnistImageData[]>([])

  // 修改 handleImageUpload 方法定义
  const handleImageUpload = (options: UploadRequestOptions): Promise<any> => {
    const formData = new FormData()
    formData.append('file', options.file)

    // 返回 Promise，符合 http-request 类型要求
    return new Promise((resolve, reject) => {
      MnistService.uploadImage(formData)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('上传成功')
            getDataList()
            resolve(res) // 成功时 resolve
          } else {
            ElMessage.error('上传失败')
            reject(new Error('上传失败'))
          }
        })
        .catch((err) => {
          ElMessage.error('上传出错')
          reject(err) // 异常处理并 reject
        })
    })
  }

  const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (
      rawFile.type !== 'image/jpeg' &&
      rawFile.type !== 'image/png' &&
      rawFile.type !== 'image/gif' &&
      rawFile.type !== 'image/webp' &&
      rawFile.type !== 'image/avif'
    ) {
      ElMessage.error('上传图片格式错误，请上传 jpg、png、gif、webp、avif 格式的图片')
      return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error('上传图片大小不能超过 2MB')
      return false
    }
    return true
  }

  const handleRecognize = (item: MnistImageData) => {
    console.log(item)
    MnistService.submitTask(item.id, item.image).then((res) => {
      if (res.code === 200) {
        ElMessage.success('识别任务提交成功')

        // 提交成功后，等待1秒后重新查询该条数据
        let attempts = 0
        const maxAttempts = 3

        const checkRecognition = () => {
          MnistService.getMnistById(item.id).then((res) => {
            if (res.code === 200 && res.data) {
              if (res.data.label !== null) {
                // 更新 item 的属性
                Object.assign(item, res.data)
                ElMessage.success('识别成功')
              } else {
                attempts++
                if (attempts < maxAttempts) {
                  setTimeout(checkRecognition, 1000)
                } else {
                  ElMessage.error('识别失败')
                }
              }
            } else {
              attempts++
              if (attempts < maxAttempts) {
                setTimeout(checkRecognition, 1000)
              } else {
                ElMessage.error('识别失败')
              }
            }
          })
        }

        // 开始第一次查询
        checkRecognition()
      }
      item.label = res.data.label
    })
  }

  const getDataList = () => {
    MnistService.getMnistList().then((res) => {
      dataList.value = res.data
    })
  }

  onMounted(() => {
    getDataList()
  })

  const colorList = reactive([
    '#D8F8FF',
    '#FDDFD9',
    '#FCE6F0',
    '#D3F8F0',
    '#FFEABC',
    '#F5E1FF',
    '#E1E6FE'
  ])

  let lastColor: string | null = null

  const randomColor = () => {
    let newColor: string

    do {
      const index = Math.floor(Math.random() * colorList.length)
      newColor = colorList[index]
    } while (newColor === lastColor)

    lastColor = newColor
    return newColor
  }
</script>

<style lang="scss" scoped>
  .page-content {
    background-color: transparent !important;
    box-shadow: none !important;

    .title {
      margin-top: 20px;
      font-size: 36px;
      font-weight: 500;
    }

    .list {
      margin-top: 40px;

      .offset {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + 16px);
      }
    }

    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 16px;
      margin-top: 20px;
      margin-bottom: 20px;

      /* 增加右边内边距 */
    }

    .upload-btn {
      padding: 8px 16px;
      margin-right: 8px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      background-color: #409eff;
      border: none;
      border-radius: 4px;
      transition: background-color 0.3s ease;

      /* 增加右边外边距，给按钮自己留空 */

      &:hover {
        background-color: #66b1ff;
      }

      &:active {
        background-color: #337ecc;
      }
    }

    .mnist-card {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: calc(25% - 16px);
      padding: 16px;
      margin: 0 16px 16px 0;
      font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      font-weight: 500;
      cursor: pointer;
      background-color: #eae2cb;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .mnist-card-left {
        .mnist-image {
          width: 80px;
          height: 80px;
          margin-bottom: 8px;
          object-fit: contain;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .created-at {
          max-width: 100%; // 防止溢出
          font-size: 10px; // 缩小字体
          line-height: 1; // 更紧凑的行高
          color: #aaa; // 更轻的颜色
          text-align: center; // 居中显示
          word-break: break-all; // 避免长字符串溢出
        }
      }

      .mnist-card-right {
        position: relative;
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        height: 100%;

        .mnist-label {
          margin-bottom: 8px;
          font-size: 14px;
          color: #333;
        }

        .recognize-btn {
          position: absolute;
          right: 0;
          bottom: 0;
          padding: 4px 12px;
          font-size: 12px;
          color: white;
          cursor: pointer;
          background-color: #409eff;
          border: none;
          border-radius: 4px;
          transition: 0.3s ease;

          &:disabled {
            color: #999;
            cursor: not-allowed;
            background-color: #dcdfe6;
          }

          &:hover:not(:disabled) {
            background-color: #66b1ff;
          }
        }
      }
    }
  }

  /* 响应式布局 */
  @media screen and (max-width: $device-notebook) {
    .page-content {
      .mnist-card {
        width: calc(25% - 16px); // 原为 25%
      }
    }
  }

  @media screen and (max-width: $device-ipad-pro) {
    .page-content {
      .mnist-card {
        width: calc(50% - 16px); // 原为 33.333%
      }
    }
  }

  @media screen and (max-width: $device-ipad) {
    .page-content {
      .mnist-card {
        width: calc(100% - 16px); // 原为 50%
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .page-content {
      .mnist-card {
        width: calc(100% - 16px);
      }
    }
  }

  /* 暗色模式 */
  .dark {
    .page-content {
      .mnist-card {
        color: #333 !important;
      }
    }
  }
</style>
