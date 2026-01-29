<template>
  <div class="page-content">
    <el-row :gutter="20" style="margin-left: 15px">
      <el-button @click="showModel">添加模型</el-button>
    </el-row>
    <table-bar
      :showTop="false"
      @search="search"
      @changeColumn="changeColumn"
      @reset="resetSearchForm"
      :columns="columns"
      style="margin-top: 20px"
    >
      <template #top>
        <!--        <el-col>-->
        <!--          <el-button type="primary" @click="visible = true">添加模型</el-button>-->
        <!--        </el-col>-->
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-input label="模型名称" prop="model" v-model="searchForm.model" />
            <form-input label="提供商" prop="provider" v-model="searchForm.provider" />
            <form-input label="模型官方ID" prop="modelId" v-model="searchForm.modelId" />
          </el-row>
          <el-row>
            <form-select
              label="是否启用"
              prop="enabled"
              v-model="searchForm.enabled"
              :options="enabledOptions"
            />
          </el-row>
        </el-form>
      </template>
    </table-bar>

    <art-table
      :data="tableData"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
      @update:currentPage="handleCurrentPageChange"
      @update:pageSize="handlePageSizeChange"
    >
      <template #default>
        <el-table-column label="ID" prop="id" width="150" v-if="columns[0].show" />
        <el-table-column label="模型名称" prop="model" width="150" v-if="columns[1].show" />
        <el-table-column label="提供商" prop="provider" width="150" v-if="columns[2].show" />
        <el-table-column label="模型官方ID" prop="model_id" width="150" v-if="columns[3].show" />
        <el-table-column label="图标" prop="icon" width="100" v-if="columns[4].show">
          <template #default="{ row }">
            <el-image
              :src="row.icon"
              fit="contain"
              style="width: 32px; height: 32px"
              :preview-src-list="[row.icon]"
              preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="API 路径" prop="api_path" v-if="columns[5].show" />
        <el-table-column
          label="百万token输入"
          prop="price_prompt_per_1m"
          width="150"
          v-if="columns[6].show"
        />
        <el-table-column
          label="百万token输入(缓存)"
          prop="price_prompt_cached_per_1m"
          width="180"
          v-if="columns[7].show"
        />
        <el-table-column
          label="百万token输出"
          prop="price_completion_per_1m"
          width="150"
          v-if="columns[8].show"
        />
        <el-table-column label="币种" prop="currency" width="100" v-if="columns[9].show" />
        <el-table-column label="是否启用" prop="enabled" width="100" v-if="columns[10].show">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'" disable-transitions>
              {{ row.enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="最大上下文Token数"
          prop="max_context_tokens"
          width="150"
          v-if="columns[11].show"
        />
        <el-table-column
          label="最大输入Token数"
          prop="max_generate_tokens"
          width="150"
          v-if="columns[13].show"
        />
        <el-table-column
          label="最大生成Token数"
          prop="max_generate_tokens"
          width="150"
          v-if="columns[14].show"
        />
        <el-table-column label="模型类型" prop="model_type" width="120" v-if="columns[12].show" />

        <!--        <el-table-column fixed="right" label="操作" width="150">-->
        <!--          <template #default="scope">-->
        <!--            <el-button size="mini" type="primary" @click="editModel(scope.row)">编辑</el-button>-->
        <!--            <el-button size="mini" type="danger" @click="deleteModel(scope.row)">删除</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </template>
    </art-table>
    <el-dialog v-model="visible" title="新增模型信息" width="800px" align-center>
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="180px"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模型名称" prop="model">
              <el-input v-model="form.model" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型提供商" prop="provider">
              <el-select
                v-model="form.provider"
                placeholder="请选择供应商"
                filterable
                clearable
                @visible-change="handleProviderDropdown"
              >
                <el-option
                  v-for="item in providerOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="API 基础地址" prop="api_path">
              <el-input v-model="form.api_path" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型官方ID" prop="model_id">
              <el-input v-model="form.model_id" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模型图标 URL" prop="icon">
              <el-upload
                class="icon-uploader"
                action="#"
                :http-request="handleIconUpload"
                :show-file-list="false"
                :before-upload="beforeImageUpload"
              >
                <template #default>
                  <img v-if="form.icon" :src="form.icon" class="uploaded-icon" />
                  <div v-else class="upload-placeholder">
                    <el-icon><Plus /></el-icon>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="百万token输入价格" prop="price_prompt_per_1m">
              <el-input-number v-model="form.price_prompt_per_1m" :step="0.001" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="百万token输入(缓存)价格" prop="price_prompt_cached_per_1m">
              <el-input-number v-model="form.price_prompt_cached_per_1m" :step="0.001" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="百万token输出价格" prop="price_completion_per_1m">
              <el-input-number v-model="form.price_completion_per_1m" :step="0.001" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="币种" prop="currency">
              <el-select v-model="form.currency" placeholder="选择币种">
                <el-option label="人民币 (CNY)" value="CNY" />
                <el-option label="美元 (USD)" value="USD" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="enabled">
              <el-switch v-model="form.enabled" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最大上下文长度" prop="max_context_tokens">
              <el-input-number v-model="form.max_context_tokens" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大生成长度" prop="max_generate_tokens">
              <el-input-number v-model="form.max_generate_tokens" :min="1" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="模型类型" prop="model_type">
              <el-select v-model="form.model_type" placeholder="选择模型类型">
                <el-option
                  v-for="item in modelTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { FormInstance, UploadProps, UploadRequestOptions } from 'element-plus'
  import { AIModel } from '@/types/aiModel'
  import { AIModelService } from '@/api/aiModelApi'
  import { AIProviderService } from '@/api/aiProvider'
  import { Plus } from '@element-plus/icons-vue'

  const form = ref({
    model: '',
    provider: '',
    api_path: '',
    api_key: '',
    model_id: '',
    icon: '',
    price_prompt_per_1m: 0,
    price_prompt_cached_per_1m: 0,
    price_completion_per_1m: 0,
    currency: 'CNY',
    enabled: true,
    max_context_tokens: 0,
    max_generate_tokens: 0,
    model_type: 'chat'
  })

  const rules = {
    model: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
    provider: [{ required: true, message: '请输入模型提供商', trigger: 'blur' }],
    api_path: [{ required: true, message: '请输入 API 路径', trigger: 'blur' }],
    api_key: [{ required: true, message: '请输入 API 密钥', trigger: 'blur' }],
    price_prompt_per_1m: [{ required: true, message: '请输入输入 token 单价', trigger: 'change' }],
    price_prompt_cached_per_1m: [
      { required: true, message: '请输入缓存输入单价', trigger: 'change' }
    ],
    price_completion_per_1m: [
      { required: true, message: '请输入输出 token 单价', trigger: 'change' }
    ],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
    max_context_tokens: [{ required: true, message: '请输入最大上下文长度', trigger: 'change' }],
    max_generate_tokens: [{ required: true, message: '请输入最大生成长度', trigger: 'change' }],
    model_type: [{ required: true, message: '请选择模型类型', trigger: 'change' }]
  }

  interface SimpleAIProvider {
    id: string
    name: string
  }

  const providerOptions = ref<SimpleAIProvider[]>([])
  const handleProviderDropdown = async (visible: boolean) => {
    if (visible) {
      const res = await AIProviderService.getSimpleList()
      if (res.code === 200) {
        providerOptions.value = res.data
      } else {
        ElMessage.error(res.message)
      }
    }
  }

  // 分页数据
  const tableData = ref<AIModel[]>([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  // 搜索表单
  const searchFormRef = ref<FormInstance>()
  const searchForm = reactive({
    model: '',
    provider: '',
    modelId: '',
    enabled: ''
  })

  const resetSearchForm = () => {
    searchFormRef.value?.resetFields()
  }

  // 启用选项
  const enabledOptions = [
    { label: '全部', value: '' },
    { label: '启用', value: true },
    { label: '禁用', value: false }
  ]

  // 加载 AI 模型表格数据
  const fetchTableData = async () => {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      model: searchForm.model === '' ? undefined : searchForm.model,
      provider: searchForm.provider === '' ? undefined : searchForm.provider,
      model_id: searchForm.modelId === '' ? undefined : searchForm.modelId,
      enabled: searchForm.enabled === '' ? undefined : searchForm.enabled
    }

    const res = await AIModelService.getPage({ data: JSON.stringify(params) })
    tableData.value = res.data.data
    total.value = res.data.total
    currentPage.value = res.data.page
    pageSize.value = res.data.size
  }

  // 分页事件
  const handleCurrentPageChange = (page: number) => {
    currentPage.value = page
    fetchTableData()
  }
  const handlePageSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    fetchTableData()
  }

  // 搜索和重置
  const search = () => {
    currentPage.value = 1
    fetchTableData()
  }
  const resetForm = () => {
    Object.assign(form, {})
  }

  const columns = reactive([
    { name: 'ID', key: 'id', show: false },
    { name: '模型名称', key: 'model', show: true },
    { name: '模型提供商', key: 'provider', show: true },
    { name: '模型官方ID', key: 'model_id', show: true },
    { name: '图标', key: 'icon', show: true },
    { name: 'API 地址', key: 'api_path', show: true },
    { name: '百万token输入', key: 'price_prompt_per_1m', show: true },
    { name: '百万token输入(缓存)', key: 'price_prompt_cached_per_1m', show: false },
    { name: '百万token输出', key: 'price_completion_per_1m', show: true },
    { name: '货币', key: 'currency', show: true },
    { name: '启用状态', key: 'enabled', show: true },
    { name: '最大上下文 Tokens', key: 'max_context_tokens', show: true },
    { name: '模型类型', key: 'model_type', show: true },
    { name: '最大输入Token数', key: 'max_generate_tokens', show: false },
    { name: '最大生成token数', key: 'max_generate_tokens', show: false }
  ])

  const changeColumn = (list: any) => {
    columns.values = list
  }

  const visible = ref(false)
  const showModel = () => {
    visible.value = true
  }
  const formRef = ref()

  const modelTypeOptions = [
    { label: '对话模型', value: 'chat' },
    { label: '向量模型', value: 'embedding' },
    { label: '多模态模型', value: 'multimode' },
    { label: '精排模型', value: 'rerank' }
  ]

  const submitForm = async () => {
    await formRef.value.validate() // 验证成功才会继续
    const res = await AIModelService.create({ data: JSON.stringify(form.value) })
    if (res.code === 200) {
      ElMessage.success('模型创建成功')
      visible.value = false
      resetForm()
      await fetchTableData()
    } else {
      ElMessage.error('创建失败，请重试')
    }
  }

  const handleIconUpload = (options: UploadRequestOptions): Promise<any> => {
    const formData = new FormData()
    formData.append('file', options.file)

    return new Promise((resolve, reject) => {
      AIModelService.uploadIcon(formData) // 替换成你的接口
        .then((res) => {
          if (res.code === 200) {
            form.value.icon = res.data // 回填图片地址
            ElMessage.success('图标上传成功')
            resolve(res)
          } else {
            ElMessage.error('上传失败')
            reject(new Error('上传失败'))
          }
        })
        .catch((err) => {
          ElMessage.error('上传出错')
          reject(err)
        })
    })
  }

  const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
      rawFile.type
    )
    if (!isValidType) {
      ElMessage.error('仅支持 jpg、png、gif、webp')
      return false
    }
    if (rawFile.size / 1024 / 1024 > 1) {
      ElMessage.error('上传图片大小不能超过 1MB')
      return false
    }
    return true
  }

  // 操作按钮事件（示例）
  // todo 模型删除和模型信息更新
  // const editModel = (row: AIModel) => {
  //   ElMessage.info(`编辑模型: ${row.model}`)
  // }
  // const deleteModel = (row: AIModel) => {
  //   ElMessageBox.confirm(`确定删除模型 ${row.model}？`, '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   })
  //     .then(() => {
  //       // 调用删除接口
  //       ElMessage.success('删除成功')
  //       fetchTableData()
  //     })
  //     .catch(() => {})
  // }

  // 组件挂载时加载数据
  onMounted(() => {
    fetchTableData()
  })
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
  }

  .icon-uploader {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
  }

  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    font-size: 28px;
    color: #999;
  }

  .uploaded-icon {
    width: 60px;
    height: 60px;
    object-fit: contain;
  }
</style>
