<template>
  <div class="page-content">
    <el-row :gutter="20" style="margin-left: 15px">
      <el-upload
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        :http-request="(option) => handleUpload(option.file)"
      >
        <el-button type="primary" icon="Upload"> 上传知识库文件 </el-button>
      </el-upload>
    </el-row>

    <table-bar
      :showTop="false"
      @search="searchKnowledgeBaseFile"
      @reset="resetForm()"
      @changeColumn="(list) => (knowledgeBaseFileColumns.values = list)"
      :columns="knowledgeBaseFileColumns"
      style="margin-top: 20px"
    >
      <template #top>
        <el-form
          :model="searchKnowledgeBaseFileForm"
          ref="searchKnowledgeBaseFileFormRef"
          label-width="100px"
        >
          <el-row :gutter="20">
            <form-input
              label="文件名称"
              prop="original_name"
              v-model="searchKnowledgeBaseFileForm.original_filename"
            />
            <form-input
              label="文件类型"
              prop="file_type"
              v-model="searchKnowledgeBaseFileForm.file_type"
            />
            <form-input
              label="上传用户"
              prop="create_user"
              v-model="searchKnowledgeBaseFileForm.create_user"
            />
          </el-row>
          <el-col :span="8">
            <el-form-item label="上传时间范围" prop="time_range">
              <el-date-picker
                v-model="searchKnowledgeBaseFileForm.time_range"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </template>
    </table-bar>

    <art-table
      :data="KnowledgeBaseFileTableData"
      :currentPage="KnowledgeBaseFileCurrentPage"
      :pageSize="KnowledgeBaseFilePageSize"
      :total="KnowledgeBaseFileTotal"
      @update:currentPage="handleAgentPageChange"
      @update:pageSize="handleAgentPageSizeChange"
    >
      <template #default>
        <el-table-column label="ID" prop="id" v-if="knowledgeBaseFileColumns[0].show" />
        <el-table-column
          label="文件名"
          prop="original_filename"
          v-if="knowledgeBaseFileColumns[1].show"
        />
        <el-table-column
          label="文件类型"
          prop="file_type"
          v-if="knowledgeBaseFileColumns[2].show"
        />
        <el-table-column label="文件大小" prop="file_size" v-if="knowledgeBaseFileColumns[3].show">
          <template #default="{ row }">
            {{ formatFileSize(row.file_size) }}
          </template>
        </el-table-column>
        <el-table-column
          label="上传用户"
          prop="create_user"
          v-if="knowledgeBaseFileColumns[4].show"
        />
        <el-table-column
          label="上传时间"
          prop="created_at"
          v-if="knowledgeBaseFileColumns[5].show"
        />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-link type="primary" :href="scope.row.file_path" target="_blank">
              下载原文件
            </el-link>
          </template>
        </el-table-column>
      </template>
    </art-table>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { FormInstance } from 'element-plus'
  import { KnowledgeBaseService } from '@/api/knowledgeBaseFile'
  import { filterEmptyParams } from '@/utils/utils'
  import { KnowledgeBaseFile } from '@/types/knowledgeBase'

  onMounted(async () => {
    await fetchKnowledgeBaseFileTableData()
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const KnowledgeBaseFileTableData = ref<KnowledgeBaseFile[]>([])
  const KnowledgeBaseFileCurrentPage = ref(1)
  const KnowledgeBaseFilePageSize = ref(10)
  const KnowledgeBaseFileTotal = ref(0)

  const fetchKnowledgeBaseFileTableData = async () => {
    const params = {
      page: KnowledgeBaseFileCurrentPage.value,
      size: KnowledgeBaseFilePageSize.value,
      ...filterEmptyParams(searchKnowledgeBaseFileForm)
    }
    const res = await KnowledgeBaseService.getFilePage({ data: JSON.stringify(params) })
    KnowledgeBaseFileTableData.value = res.data.data
    KnowledgeBaseFileTotal.value = res.data.total
  }

  const handleAgentPageChange = (page: number) => {
    KnowledgeBaseFileCurrentPage.value = page
    fetchKnowledgeBaseFileTableData()
  }
  const handleAgentPageSizeChange = (size: number) => {
    KnowledgeBaseFilePageSize.value = size
    KnowledgeBaseFileCurrentPage.value = 1
    fetchKnowledgeBaseFileTableData()
  }

  const searchKnowledgeBaseFileFormRef = ref<FormInstance>()
  const searchKnowledgeBaseFileForm = reactive({
    original_filename: '',
    file_type: '',
    create_user: '',
    time_range: ''
  })

  const resetForm = () => {
    Object.assign(searchKnowledgeBaseFileForm, {
      name: '',
      description: '',
      modelID: '',
      systemPrompt: ''
    })
  }

  const searchKnowledgeBaseFile = () => {
    KnowledgeBaseFileCurrentPage.value = 1
    fetchKnowledgeBaseFileTableData()
  }

  const knowledgeBaseFileColumns = reactive([
    { name: 'ID', key: 'id', show: false },
    { name: '文件名', key: 'original_filename', show: true },
    { name: '文件类型', key: 'file_type', show: true },
    { name: '文件大小', key: 'file_size', show: true },
    { name: '上传用户', key: 'create_user', show: true },
    { name: '上传时间', key: 'created_at', show: true }
  ])

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
  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await KnowledgeBaseService.uploadKnowledgeBaseFile(formData)
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
