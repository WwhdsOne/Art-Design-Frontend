<template>
  <div class="page-content user">
    <div class="content">
      <div class="left-wrap">
        <div class="user-wrap box-style">
          <img class="bg" src="@imgs/user/bg.png" />
          <div>
            <el-upload
              action="string"
              :http-request="handleAvatarUpload"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <div class="avatar" :style="{ backgroundImage: `url(${form.avatar})` }"></div>
            </el-upload>
          </div>
          <h2 class="name">{{ form.realname }}</h2>
          <p class="des">{{ form.introduction }}</p>
          <div class="outer-info">
            <div>
              <i class="iconfont-sys">&#xe72e;</i>
              <span>{{ form.email }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe608;</i>
              <span>{{ form.occupation }}</span>
            </div>
            <!-- 地址 -->
            <div>
              <i class="iconfont-sys">&#xe736;</i>
              <span>{{ form.address }}</span>
            </div>
            <!-- 职业 -->
            <div>
              <i class="iconfont-sys">&#xe811;</i>
              <span>{{ form.occupation }}</span>
            </div>
          </div>
          <div class="lables">
            <h3>标签</h3>
            <div>
              <div v-for="item in form.tags" :key="item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-wrap">
        <div class="info box-style">
          <h1 class="title">基本设置</h1>

          <el-form
            :model="form"
            class="form"
            ref="ruleFormRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <el-row>
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="form.realname" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="性别" prop="sex" class="right-input">
                <el-select v-model="form.gender" placeholder="Select" :disabled="!isEdit">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="昵称" prop="nikeName">
                <el-input v-model="form.nickname" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email" class="right-input">
                <el-input v-model="form.email" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="form.phone" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="地址" prop="address" class="right-input">
                <el-input v-model="form.address" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="职业" prop="occupation">
                <el-input v-model="form.occupation" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <div class="lables">
              <div class="tag-title">标签</div>
              <el-input
                v-if="isEdit"
                v-model="inputTag"
                class="tag-editor"
                @keyup.enter="handleTagInputEnter"
                placeholder="输入标签后回车"
                clearable
              >
                <template #prepend>
                  <div class="tag-list">
                    <el-tag
                      v-for="(tag, index) in form.tags"
                      :key="tag"
                      closable
                      @close="removeTag(index)"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </template>
              </el-input>

              <div v-else class="tag-readonly">
                <el-tag v-for="tag in form.tags" :key="tag" style="margin-right: 8px">
                  {{ tag }}
                </el-tag>
              </div>
            </div>

            <el-form-item label="个人介绍" prop="des" :style="{ height: '130px' }">
              <el-input type="textarea" :rows="4" v-model="form.introduction" :disabled="!isEdit" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" v-ripple @click="edit">
                {{ isEdit ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>

        <div class="info box-style" style="margin-top: 20px">
          <h1 class="title">更改密码</h1>

          <el-form
            :model="pwdForm"
            class="form"
            label-width="86px"
            label-position="top"
            ref="rulePwdFormRef"
            :rules="pwdRules"
          >
            <el-form-item label="当前密码" prop="password">
              <el-input v-model="pwdForm.oldPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwdForm.newPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="pwdForm.confirmPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" v-ripple @click="editPwd">
                {{ isEditPwd ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/modules/user'
  import type { UploadProps } from 'element-plus'
  import { FormInstance, FormRules } from 'element-plus'
  import { UserService } from '@/api/usersApi'
  import type { UploadRequestOptions } from 'element-plus/es/components/upload/src/upload.d'

  const userStore = useUserStore()
  const userInfo = computed(() => userStore.getUserInfo).value

  const isEdit = ref(false)
  const isEditPwd = ref(false)
  const date = ref('')
  const form = reactive({
    id: userInfo.id,
    realname: userInfo.realname,
    nickname: userInfo.nickname,
    gender: userInfo.gender,
    email: userInfo.email,
    phone: userInfo.phone,
    address: userInfo.address,
    avatar: userInfo.avatar,
    introduction: userInfo.introduction,
    occupation: userInfo.occupation,
    tags: userInfo.tags
  })

  // 修改 handleAvatarUpload 方法定义
  const handleAvatarUpload = (options: UploadRequestOptions): Promise<any> => {
    const formData = new FormData()
    formData.append('file', options.file)
    console.log(formData.get('file'))

    // 返回 Promise，符合 http-request 类型要求
    return new Promise((resolve, reject) => {
      UserService.uploadAvatar(formData)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('上传成功')
            form.avatar = res.data
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

  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
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

  const resetUserInfo = () => {
    form.realname = userInfo.realname
    form.nickname = userInfo.nickname
    form.gender = userInfo.gender
    form.email = userInfo.email
    form.phone = userInfo.phone
    form.address = userInfo.address
    form.avatar = userInfo.avatar
    form.introduction = userInfo.introduction
    form.occupation = userInfo.occupation
    form.tags = userInfo.tags
  }

  const pwdForm = reactive({
    id: userInfo.id,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const resetPwdForm = () => {
    pwdForm.oldPassword = ''
    pwdForm.newPassword = ''
    pwdForm.confirmPassword = ''
  }

  const validateStrongPassword = (password: string): boolean => {
    const hasNumber = /[0-9]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasSpecial = /[!@#%&(){};':",.<>?]/.test(password)
    const minLength = 8

    return hasNumber && hasUpper && hasLower && hasSpecial && password.length >= minLength
  }

  const validatePass = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('密码不能为空'))
    } else if (!validateStrongPassword(value)) {
      callback(new Error('密码应包含数字、大写字母、小写字母、特殊字符，且不少于8位'))
    } else {
      if (pwdForm.confirmPassword !== '') {
        rulePwdFormRef.value?.validateField('confirmPassword')
      }
      callback()
    }
  }

  const validateConfirmPass = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入新密码'))
    } else if (value !== pwdForm.newPassword) {
      callback(new Error('两次输入密码不一致'))
    } else {
      callback()
    }
  }

  const validateCurrentPass = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请输入当前密码'))
    } else {
      callback()
    }
  }

  const rulePwdFormRef = ref<FormInstance>()

  const pwdRules = reactive<FormRules>({
    password: [{ required: true, validator: validateCurrentPass, trigger: 'blur' }],
    newPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
    confirmPassword: [{ required: true, validator: validateConfirmPass, trigger: 'blur' }]
  })

  const inputTag = ref('')

  const handleTagInputEnter = () => {
    const value = inputTag.value.trim()
    if (value && form.tags && !form.tags.includes(value)) {
      form.tags.push(value)
    }
    inputTag.value = ''
  }

  const removeTag = (index: number) => {
    if (form.tags) {
      form.tags.splice(index, 1)
    }
  }

  const ruleFormRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    realName: [
      { required: true, message: '请输入真实姓名', trigger: 'blur' },
      { max: 50, message: '长度不能超过 50 个字符', trigger: 'blur' }
    ],
    nikeName: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 5, max: 24, message: '长度在 5 到 24 个字符', trigger: 'blur' }
    ],
    email: [
      { required: false, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
      { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }
    ],
    mobile: [
      { required: false, message: '请输入手机号码', trigger: 'blur' },
      { pattern: /^\+?[1-9]\d{1,14}$/, message: '请输入有效的手机号码', trigger: 'blur' },
      { max: 30, message: '长度不能超过 30 个字符', trigger: 'blur' }
    ],
    address: [
      { required: true, message: '请输入地址', trigger: 'blur' },
      { max: 256, message: '长度不能超过 256 个字符', trigger: 'blur' }
    ],
    sex: [
      { type: 'array', required: true, message: '请选择性别', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value && value !== 1 && value !== 2) {
            callback(new Error('性别只能选择 1 或 2'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
    // 其他字段根据需要添加校验规则
  })

  const options = [
    {
      value: 1,
      label: '男'
    },
    {
      value: 2,
      label: '女'
    }
  ]
  onMounted(() => {
    getDate()
  })

  const getDate = () => {
    const d = new Date()
    const h = d.getHours()
    let text = ''

    if (h >= 6 && h < 9) {
      text = '早上好'
    } else if (h >= 9 && h < 11) {
      text = '上午好'
    } else if (h >= 11 && h < 13) {
      text = '中午好'
    } else if (h >= 13 && h < 18) {
      text = '下午好'
    } else if (h >= 18 && h < 24) {
      text = '晚上好'
    } else if (h >= 0 && h < 6) {
      text = '很晚了，早点睡'
    }

    date.value = text
  }

  const edit = () => {
    isEdit.value = !isEdit.value
    // 保存后进行更新操作
    if (!isEdit.value) {
      UserService.updateUser({
        data: JSON.stringify(form)
      }).then((res) => {
        if (res.code === 200) {
          ElMessage.success('更新成功')
        } else {
          ElMessage.error('更新失败')
          resetUserInfo()
        }
      })
    }
  }

  const editPwd = () => {
    isEditPwd.value = !isEditPwd.value
    if (!isEditPwd.value) {
      UserService.updatePassword({
        data: JSON.stringify(pwdForm)
      }).then((res) => {
        if (res.code === 200) {
          ElMessage.success('修改密码成功')
        } else {
          resetPwdForm()
          ElMessage.error('修改密码失败')
        }
      })
    }
  }
</script>

<style lang="scss">
  .user {
    .icon {
      width: 1.4em;
      height: 1.4em;
      overflow: hidden;
      vertical-align: -0.15em;
      fill: currentcolor;
    }
  }
</style>

<style lang="scss" scoped>
  .lables {
    margin-bottom: 15px;

    .tag-title {
      margin-bottom: 10px;
      font-size: 15px;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }

    .tag-editor {
      width: 100%;

      .el-input__wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    }

    .tag-readonly {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .page-content {
    width: 100%;
    height: 100%;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    $box-radius: calc(var(--custom-radius) + 4px);

    .box-style {
      border: 1px solid var(--art-border-color);
    }

    .content {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .left-wrap {
        width: 450px;
        margin-right: 25px;

        .user-wrap {
          position: relative;
          height: 600px;
          padding: 35px 40px;
          overflow: hidden;
          text-align: center;
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .avatar {
            position: relative;

            /* ✅ 关键 */
            z-index: 10;
            display: inline-block;
            width: 80px;
            height: 80px;
            margin-top: 120px;
            overflow: hidden;
            background-position: center;

            /* 替换为 form.avatar */
            background-size: cover;
            border: 2px solid #fff;
            border-radius: 50%;
          }

          .avatar:hover::after {
            position: absolute;

            /* ✅ 关键：让伪元素完全覆盖 .avatar */
            top: 0;
            left: 0;
            display: flex;
            align-items: center;

            /* ✅ 垂直居中 */
            justify-content: center;
            width: 100%;
            height: 100%;
            font-family: iconfont-sys, sans-serif;
            font-size: 28px;
            color: white;
            pointer-events: none;
            content: '\e6f8';

            /* ✅ 水平居中 */
            background-color: rgb(0 0 0 / 40%);
            border-radius: 50%;
            opacity: 0.8;
          }

          .camera-icon {
            z-index: 30;
            font-size: 20px;
            color: white;
          }

          .name {
            margin-top: 20px;
            font-size: 22px;
            font-weight: 400;
          }

          .des {
            margin-top: 20px;
            font-size: 14px;
          }

          .outer-info {
            width: 300px;
            margin: auto;
            margin-top: 30px;
            text-align: left;

            > div {
              margin-top: 10px;

              span {
                margin-left: 8px;
                font-size: 14px;
              }
            }
          }

          .lables {
            margin-top: 40px;

            h3 {
              font-size: 15px;
              font-weight: 500;
            }

            > div {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              margin-top: 15px;

              > div {
                padding: 3px 6px;
                margin: 0 10px 10px 0;
                font-size: 12px;
                background: var(--art-main-bg-color);
                border: 1px solid var(--art-border-color);
                border-radius: 2px;
              }
            }
          }
        }
      }

      .right-wrap {
        flex: 1;
        overflow: hidden;
        border-radius: $box-radius;

        .info {
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .title {
            padding: 15px 25px;
            font-size: 20px;
            font-weight: 400;
            color: var(--art-text-gray-800);
            border-bottom: 1px solid var(--art-border-color);
          }

          .form {
            box-sizing: border-box;
            padding: 30px 25px;

            > .el-row {
              .el-form-item {
                width: calc(50% - 10px);
              }

              .el-input,
              .el-select {
                width: 100%;
              }
            }

            .right-input {
              margin-left: 20px;
            }

            .el-form-item-right {
              display: flex;
              align-items: center;
              justify-content: end;

              .el-button {
                width: 110px !important;
              }
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: $device-ipad-vertical) {
    .page-content {
      .content {
        display: block;
        margin-top: 5px;

        .left-wrap {
          width: 100%;
        }

        .right-wrap {
          width: 100%;
          margin-top: 15px;
        }
      }
    }
  }
</style>
