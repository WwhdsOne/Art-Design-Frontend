<template>
  <div class="page-content">
    <el-row :gutter="20" style="margin-left: 15px">
      <el-button @click="showModel">添加供应商</el-button>
    </el-row>
    <table-bar
      :showTop="false"
      @search="searchProvider"
      @reset="resetForm()"
      @changeColumn="(list) => (providerColumns.values = list)"
      :columns="providerColumns"
      style="margin-top: 20px"
    >
      <template #top>
        <el-form :model="searchProviderForm" ref="searchProviderFormRef" label-width="100px">
          <el-row :gutter="20">
            <form-input label="供应商名称" prop="name" v-model="searchProviderForm.name" />
          </el-row>
          <el-row>
            <form-select
              label="是否启用"
              prop="enabled"
              v-model="searchProviderForm.enabled"
              :options="enabledOptions"
            />
          </el-row>
        </el-form>
      </template>
    </table-bar>

    <art-table
      :data="providerTableData"
      :currentPage="providerCurrentPage"
      :pageSize="providerPageSize"
      :total="providerTotal"
      @update:currentPage="handleProviderPageChange"
      @update:pageSize="handleProviderPageSizeChange"
    >
      <template #default>
        <el-table-column label="ID" prop="id" width="100" v-if="providerColumns[0].show" />
        <el-table-column label="名称" prop="name" v-if="providerColumns[1].show" />
        <el-table-column label="base url" prop="base_url" v-if="providerColumns[2].show" />
        <el-table-column label="启用状态" prop="enabled" width="100" v-if="providerColumns[3].show">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="速率限制" prop="max_rate_limit" v-if="providerColumns[4].show" />
        <el-table-column label="创建时间" prop="created_at" v-if="providerColumns[5].show" />
        <el-table-column label="更新时间" prop="updated_at" v-if="providerColumns[7].show" />
      </template>
    </art-table>

    <el-dialog v-model="visible" title="新增供应商信息" width="600px" align-center>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="API 基础地址" prop="base_url">
          <el-input v-model="form.base_url" />
        </el-form-item>
        <el-form-item label="API 密钥" prop="api_key">
          <el-input v-model="form.api_key" />
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch v-model="form.enabled" />
        </el-form-item>
        <el-form-item label="最大请求速率限制" prop="max_rate_limit">
          <el-input-number
            v-model="form.max_rate_limit"
            :min="0"
            :step="10"
            placeholder="单位：次/分钟，0表示无限制"
          />
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
  import { AIProviderService } from '@/api/aiProvider'
  import { AIProvider } from '@/types/aiProvider'

  onMounted(() => {
    fetchProviderTableData()
  })

  const visible = ref(false)
  const showModel = () => {
    visible.value = true
  }
  const rules = {
    name: [
      { required: true, message: '请输入供应商名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    base_url: [{ required: true, message: '请输入调用 API 的基础地址', trigger: 'blur' }]
  }

  // 如果你要重置表单内容
  const resetForm = () => {
    Object.assign(form, {
      name: '',
      base_url: '',
      api_key: '',
      enabled: true,
      max_rate_limit: 0
    })
  }

  const formRef = ref()

  const submitForm = async () => {
    try {
      await formRef.value.validate() // 验证成功才会继续
      await AIProviderService.create({ data: JSON.stringify(form.value) })
      ElMessage.success('供应商创建成功')
      visible.value = false
      await fetchProviderTableData()
      resetForm()
    } catch (err) {
      // 这里 catch 的可能是验证失败，也可能是请求失败
      if (err instanceof Error) {
        ElMessage.error(err.message)
        ElMessage.error('创建失败，请重试')
      }
      // 如果是校验失败，Element Plus 不会抛出 Error 类型，可以忽略
    }
  }
  const form = ref({
    name: '',
    base_url: '',
    api_key: '',
    enabled: true,
    max_rate_limit: 0
  })

  const providerTableData = ref<AIProvider[]>([])
  const providerCurrentPage = ref(1)
  const providerPageSize = ref(10)
  const providerTotal = ref(0)

  const fetchProviderTableData = async () => {
    const params = {
      page: providerCurrentPage.value,
      size: providerPageSize.value,
      name: searchProviderForm.name || undefined,
      enabled: searchProviderForm.enabled === '' ? undefined : searchProviderForm.enabled
    }

    const res = await AIProviderService.getPage({ data: JSON.stringify(params) })
    providerTableData.value = res.data.data
    providerTotal.value = res.data.total
    providerCurrentPage.value = res.data.page
    providerPageSize.value = res.data.size
  }

  const handleProviderPageChange = (page: number) => {
    providerCurrentPage.value = page
    fetchProviderTableData()
  }
  const handleProviderPageSizeChange = (size: number) => {
    providerPageSize.value = size
    providerCurrentPage.value = 1
    fetchProviderTableData()
  }

  const searchProvider = () => {
    providerCurrentPage.value = 1
    fetchProviderTableData()
  }

  // 搜索表单
  const searchProviderFormRef = ref<FormInstance>()
  const searchProviderForm = reactive({
    name: '',
    enabled: ''
  })

  const providerColumns = reactive([
    { name: 'ID', key: 'id', show: false },
    { name: '供应商名称', key: 'name', show: true },
    { name: 'API 基础地址', key: 'base_url', show: true },
    { name: '启用状态', key: 'enabled', show: true },
    { name: '最大速率限制', key: 'max_rate_limit', show: true },
    { name: '创建时间', key: 'created_at', show: true },
    { name: '创建人', key: 'created_by', show: false },
    { name: '更新时间', key: 'updated_at', show: true },
    { name: '更新人', key: 'updated_by', show: false }
  ])

  // 启用选项
  const enabledOptions = [
    { label: '全部', value: '' },
    { label: '启用', value: true },
    { label: '禁用', value: false }
  ]
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
  }
</style>
