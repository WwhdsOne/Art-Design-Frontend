<template>
  <div class="page-content">
    <el-row :gutter="20" style="margin-left: 15px">
      <el-button @click="showModel">添加智能体</el-button>
    </el-row>

    <table-bar
      :showTop="false"
      @search="searchAIAgent"
      @reset="resetForm()"
      @changeColumn="(list) => (agentColumns.values = list)"
      :columns="agentColumns"
      style="margin-top: 20px"
    >
      <template #top>
        <el-form :model="searchAgentForm" ref="searchAgentFormRef" label-width="100px">
          <el-row :gutter="20">
            <form-input label="智能体名称" prop="name" v-model="searchAgentForm.name" />
          </el-row>
        </el-form>
      </template>
    </table-bar>

    <art-table
      :data="agentTableData"
      :currentPage="agentCurrentPage"
      :pageSize="agentPageSize"
      :total="agentTotal"
      @update:currentPage="handleAgentPageChange"
      @update:pageSize="handleAgentPageSizeChange"
    >
      <template #default>
        <el-table-column label="ID" prop="id" v-if="agentColumns[0].show" />
        <el-table-column label="名称" prop="name" v-if="agentColumns[1].show" />
        <el-table-column label="描述" prop="description" v-if="agentColumns[2].show" />
        <el-table-column label="模型ID" prop="modelID" v-if="agentColumns[3].show" />
        <el-table-column label="系统提示词" prop="systemPrompt" v-if="agentColumns[4].show" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-upload
              :show-file-list="false"
              :before-upload="handleBeforeUpload"
              :http-request="(option) => handleUpload(scope.row.id, option.file)"
            >
              <el-button type="primary" icon="Upload"> 上传知识库文件 </el-button>
            </el-upload>
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog v-model="visible" title="新增智能体" width="600px" align-center>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="模型ID" prop="modelID">
          <el-select
            v-model="form.modelID"
            placeholder="请选择模型"
            filterable
            @visible-change="onModelSelectVisible"
          >
            <el-option
              v-for="model in modelOptions"
              :key="model.id"
              :label="model.model"
              :value="model.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="系统提示词" prop="systemPrompt">
          <el-input v-model="form.systemPrompt" type="textarea" />
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
  import { ref, reactive, onMounted } from 'vue'
  import { FormInstance } from 'element-plus'
  import { AIAgentService } from '@/api/aiAgentApi'
  import { AIAgent } from '@/types/aiAgent'
  import { AIModelService } from '@/api/aiModelApi'

  const visible = ref(false)
  const showModel = () => (visible.value = true)

  const modelOptions = ref<{ id: string; model: string }[]>([])

  const onModelSelectVisible = async (visible: boolean) => {
    if (visible) {
      const res = await AIModelService.getSimpleModelList()
      modelOptions.value = res.data
    }
  }

  const rules = {
    name: [{ required: true, message: '请输入智能体名称', trigger: 'blur' }],
    modelID: [{ required: true, message: '请输入模型ID', trigger: 'blur' }],
    systemPrompt: [{ required: true, message: '请输入系统提示词', trigger: 'blur' }]
  }

  const form = ref<AIAgent>({
    name: '',
    description: '',
    modelID: '',
    systemPrompt: ''
  })

  const resetForm = () => {
    Object.assign(form.value, {
      name: '',
      description: '',
      modelID: '',
      systemPrompt: ''
    })
  }

  const formRef = ref<FormInstance>()
  const submitForm = async () => {
    await formRef.value?.validate()
    await AIAgentService.create({ data: JSON.stringify(form.value) })
    ElMessage.success('智能体创建成功')
    visible.value = false
    await fetchAgentTableData()
    resetForm()
  }

  const agentTableData = ref<AIAgent[]>([])
  const agentCurrentPage = ref(1)
  const agentPageSize = ref(10)
  const agentTotal = ref(0)

  const fetchAgentTableData = async () => {
    const params = {
      page: agentCurrentPage.value,
      size: agentPageSize.value,
      name: searchAgentForm.name || undefined
    }
    const res = await AIAgentService.getPage({ data: JSON.stringify(params) })
    agentTableData.value = res.data.data
    agentTotal.value = res.data.total
  }

  const handleAgentPageChange = (page: number) => {
    agentCurrentPage.value = page
    fetchAgentTableData()
  }
  const handleAgentPageSizeChange = (size: number) => {
    agentPageSize.value = size
    agentCurrentPage.value = 1
    fetchAgentTableData()
  }

  const searchAgentFormRef = ref<FormInstance>()
  const searchAgentForm = reactive({
    name: ''
  })

  const searchAIAgent = () => {
    agentCurrentPage.value = 1
    fetchAgentTableData()
  }

  const agentColumns = reactive([
    { name: 'ID', key: 'id', show: false },
    { name: '名称', key: 'name', show: true },
    { name: '描述', key: 'description', show: true },
    { name: '模型ID', key: 'modelID', show: true },
    { name: '系统提示词', key: 'systemPrompt', show: true }
  ])

  onMounted(fetchAgentTableData)

  // 上传前校验
  const handleBeforeUpload = (file: File) => {
    const isAllowedType = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(file.type)
    const isLt10M = file.size / 1024 / 1024 < 10

    if (!isAllowedType) {
      ElMessage.error('仅支持上传 PDF、TXT 或 DOCX 文件')
      return false
    }
    if (!isLt10M) {
      ElMessage.error('文件大小不能超过 100MB')
      return false
    }
    return true
  }

  // 自定义上传处理
  const handleUpload = async (agentId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await AIAgentService.uploadAgentDocument(formData, agentId)
    if (res.code === 200) {
      ElMessage.success('文件上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  }
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
  }
</style>
