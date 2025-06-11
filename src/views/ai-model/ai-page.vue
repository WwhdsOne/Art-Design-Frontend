<template>
  <div class="page-content">
    <table-bar
      :showTop="false"
      @search="search"
      @reset="resetForm(searchFormRef)"
      @changeColumn="changeColumn"
      :columns="columns"
    >
      <template #top>
        <!--        <el-col>-->
        <!--          <el-button type="primary" @click="visible = true">添加模型</el-button>-->
        <!--        </el-col>-->
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-input label="模型名称" prop="model" v-model="searchForm.model" />
            <form-input label="提供商" prop="provider" v-model="searchForm.provider" />
            <form-input label="模型ID" prop="modelId" v-model="searchForm.modelId" />
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
        <el-table-column label="模型ID" prop="model_id" width="150" v-if="columns[3].show" />
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
        <el-table-column label="API 基础地址" prop="base_url" v-if="columns[5].show" />
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
        <el-table-column label="模型类型" prop="model_type" width="120" v-if="columns[12].show" />

        <!--        <el-table-column fixed="right" label="操作" width="150">-->
        <!--          <template #default="scope">-->
        <!--            <el-button size="mini" type="primary" @click="editModel(scope.row)">编辑</el-button>-->
        <!--            <el-button size="mini" type="danger" @click="deleteModel(scope.row)">删除</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </template>
    </art-table>
    <el-dialog v-model="visible" title="新增模型信息" width="600px" align-center>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item label="模型名称" prop="model">
          <el-input v-model="form.model" />
        </el-form-item>
        <el-form-item label="模型提供商" prop="provider">
          <el-input v-model="form.provider" />
        </el-form-item>
        <el-form-item label="API 基础地址" prop="base_url">
          <el-input v-model="form.base_url" />
        </el-form-item>
        <el-form-item label="API 密钥" prop="api_key">
          <el-input v-model="form.api_key" />
        </el-form-item>
        <el-form-item label="模型接口标识" prop="model_id">
          <el-input v-model="form.model_id" />
        </el-form-item>
        <el-form-item label="模型图标 URL" prop="icon">
          <el-input v-model="form.icon" />
        </el-form-item>
        <el-form-item label="输入 token 单价" prop="price_prompt_per_1m">
          <el-input-number v-model="form.price_prompt_per_1m" :step="0.001" :min="0" />
        </el-form-item>
        <el-form-item label="命中缓存输入单价" prop="price_prompt_cached_per_1m">
          <el-input-number v-model="form.price_prompt_cached_per_1m" :step="0.001" :min="0" />
        </el-form-item>
        <el-form-item label="输出 token 单价" prop="price_completion_per_1m">
          <el-input-number v-model="form.price_completion_per_1m" :step="0.001" :min="0" />
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-select v-model="form.currency" placeholder="选择币种">
            <el-option label="人民币 (CNY)" value="CNY" />
            <el-option label="美元 (USD)" value="USD" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch v-model="form.enabled" />
        </el-form-item>
        <el-form-item label="最大上下文长度" prop="max_context_tokens">
          <el-input-number v-model="form.max_context_tokens" :min="1" />
        </el-form-item>
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
  import { FormInstance } from 'element-plus'
  import { AIModel } from '@/types/aiModel'
  import { AIModelService } from '@/api/aiModelApi'

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
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  const columns = reactive([
    { name: 'ID', key: 'id', show: false },
    { name: '模型名称', key: 'model', show: true },
    { name: '模型提供商', key: 'provider', show: true },
    { name: '模型 ID', key: 'model_id', show: true },
    { name: '图标', key: 'icon', show: true },
    { name: 'API 地址', key: 'base_url', show: false },
    { name: '百万token输入', key: 'price_prompt_per_1m', show: true },
    { name: '百万token输入(缓存)', key: 'price_prompt_cached_per_1m', show: false },
    { name: '百万token输出', key: 'price_completion_per_1m', show: true },
    { name: '货币', key: 'currency', show: true },
    { name: '启用状态', key: 'enabled', show: true },
    { name: '最大上下文 Tokens', key: 'max_context_tokens', show: true },
    { name: '模型类型', key: 'model_type', show: true },
    { name: '最大输入Token数', key: 'max_generate_tokens', show: false }
  ])

  const changeColumn = (list: any) => {
    columns.values = list
  }

  const visible = ref(false)
  const formRef = ref()

  const form = ref({
    model: '',
    provider: '',
    base_url: '',
    api_key: '',
    model_id: '',
    icon: '',
    price_prompt_per_1m: 0,
    price_prompt_cached_per_1m: 0,
    price_completion_per_1m: 0,
    currency: 'CNY',
    enabled: true,
    max_context_tokens: 2048,
    model_type: 'chat'
  })

  const rules = {
    model: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
    provider: [{ required: true, message: '请输入模型提供商', trigger: 'blur' }],
    base_url: [{ required: true, message: '请输入 API 基础地址', trigger: 'blur' }],
    api_key: [{ required: true, message: '请输入 API 密钥', trigger: 'blur' }],
    model_id: [{ required: true, message: '请输入模型接口标识', trigger: 'blur' }],
    price_prompt_per_1m: [{ required: true, message: '请输入输入 token 单价', trigger: 'change' }],
    price_prompt_cached_per_1m: [
      { required: true, message: '请输入缓存输入单价', trigger: 'change' }
    ],
    price_completion_per_1m: [
      { required: true, message: '请输入输出 token 单价', trigger: 'change' }
    ],
    currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
    max_context_tokens: [{ required: true, message: '请输入最大上下文长度', trigger: 'change' }],
    model_type: [{ required: true, message: '请选择模型类型', trigger: 'change' }]
  }

  const modelTypeOptions = [
    { label: '对话模型', value: 'chat' },
    { label: '向量模型', value: 'embedding' },
    { label: '多模态模型', value: 'multimodal' }
  ]

  const submitForm = () => {
    console.log('submitForm')
  }

  // 操作按钮事件（示例）
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
</style>
