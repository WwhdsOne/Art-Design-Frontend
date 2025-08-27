<template>
  <div class="page-content">
    <el-row :gutter="20" style="margin-left: 15px">
      <el-button @click="showModel">创建知识库</el-button>
    </el-row>

    <table-bar
      :showTop="false"
      @reset="resetForm()"
      @changeColumn="(list) => (Columns.values = list)"
      :columns="Columns"
      style="margin-top: 20px"
    >
    </table-bar>

    <art-table
      :data="TableData"
      :currentPage="CurrentPage"
      :pageSize="PageSize"
      :total="Total"
      @update:currentPage="handlePageChange"
      @update:pageSize="handlePageSizeChange"
    >
      <template #default>
        <el-table-column label="知识库名称" prop="name" v-if="Columns[0].show" />
        <el-table-column label="描述" prop="description" v-if="Columns[1].show" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <button-table type="edit" />
            <button-table type="delete" @click="deleteKnowledgeBase(scope.row)" />
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog v-model="visible" title="创建知识库" width="600px" align-center>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="文件ID" prop="ID">
          <el-select
            v-model="form.files"
            multiple
            filterable
            remote
            reserve-keyword
            collapse-tags
            collapse-tags-tooltip
            placeholder="请输入文件名搜索"
            :remote-method="remoteSearchFiles"
            :loading="loading"
            style="width: 100%"
            ref="fileSelect"
            popper-class="file-select-dropdown"
            value-key="id"
            @visible-change="handleFileSelectVisible"
          >
            <el-option
              v-for="file in fileOptions"
              :key="file.id"
              :label="file.original_filename"
              :value="file"
            />
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="系统提示词" prop="systemPrompt">-->
        <!--          <el-input v-model="form.systemPrompt" type="textarea" />-->
        <!--        </el-form-item>-->
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
  import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
  import { KnowledgeBaseService } from '@/api/knowledgeBaseFile'
  import { KnowledgeBase, KnowledgeBaseFile } from '@/types/knowledgeBase'

  const visible = ref(false)
  const showModel = () => (visible.value = true)

  const rules = {
    name: [{ required: true, message: '请输入智能体名称', trigger: 'blur' }]
  }

  const form = ref<KnowledgeBase>({
    id: '',
    name: '',
    description: '',
    files: []
  })

  const resetForm = () => {
    form.value = {
      id: '',
      name: '',
      description: '',
      files: []
    }
  }

  const formRef = ref<FormInstance>()
  const submitForm = async () => {
    await formRef.value?.validate()
    const param = {
      name: form.value.name,
      description: form.value.description,
      file_ids: form.value.files.map((file) => file.id)
    }
    await KnowledgeBaseService.create({ data: JSON.stringify(param) })
    ElMessage.success('知识库创建成功')
    visible.value = false
    await fetchTableData()
    resetForm()
  }

  const TableData = ref<KnowledgeBase[]>([])
  const CurrentPage = ref(1)
  const PageSize = ref(10)
  const Total = ref(0)

  const fetchTableData = async () => {
    const params = {
      page: CurrentPage.value,
      size: PageSize.value
    }
    const res = await KnowledgeBaseService.getKnowledgeBasePage({ data: JSON.stringify(params) })
    TableData.value = res.data
    Total.value = res.data.total
  }

  const handlePageChange = (page: number) => {
    CurrentPage.value = page
    fetchTableData()
  }
  const handlePageSizeChange = (size: number) => {
    PageSize.value = size
    CurrentPage.value = 1
    fetchTableData()
  }

  const Columns = reactive([
    { name: '名称', key: 'name', show: true },
    { name: '描述', key: 'description', show: true }
  ])

  onMounted(fetchTableData)

  const fileOptions = ref<KnowledgeBaseFile[]>([])
  const loading = ref(false)
  const knowledgeBaseFilePage = ref(1)
  const knowledgeBaseFilePageSize = ref(20)
  const hasMore = ref(true)
  const filename = ref('')

  const remoteSearchFiles = async (query: string) => {
    filename.value = query
    knowledgeBaseFilePage.value = 1
    fileOptions.value = []
    hasMore.value = true
    await fetchFiles()
  }

  const fetchFiles = async () => {
    if (!hasMore.value || loading.value) return
    loading.value = true
    const params = {
      page: knowledgeBaseFilePage.value,
      size: knowledgeBaseFilePageSize.value,
      original_filename: filename.value
    }
    try {
      const res = await KnowledgeBaseService.getFilePage({ data: JSON.stringify(params) })
      if (res.data.data && res.data.data.length > 0) {
        fileOptions.value.push(...res.data.data)
        console.log('fileOptions', res.data.data)
        knowledgeBaseFilePage.value++
      } else {
        hasMore.value = false
      }
    } finally {
      loading.value = false
    }
    console.log('fileOptions', fileOptions.value)
  }

  // 监听下拉滚动
  onMounted(() => {
    nextTick(() => {
      const dropdown = document.querySelector('.model-select-dropdown .el-select-dropdown__wrap')
      if (dropdown) {
        dropdown.addEventListener('scroll', () => {
          const { scrollTop, scrollHeight, clientHeight } = dropdown
          if (scrollTop + clientHeight >= scrollHeight - 5) {
            fetchFiles()
          }
        })
      }
    })
  })

  const handleFileSelectVisible = (visible: boolean) => {
    if (visible) {
      // 第一次点开时触发加载
      if (fileOptions.value.length === 0) {
        remoteSearchFiles('') // 可以传空字符串，表示加载全部/第一页
      }
    }
  }

  const deleteKnowledgeBase = async (row: any) => {
    try {
      let confirmMessage = '确定要删除该知识库吗？删除后无法恢复'

      await ElMessageBox.confirm(confirmMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await KnowledgeBaseService.delete(row.id).then((res) => {
        if (res.code === 200) {
          ElMessage.success('删除成功')
          fetchTableData() // Refresh data after successful deletion
        } else {
          ElMessage.error(res.message)
        }
      })
    } catch (error: any) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败: ' + error.message || error)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
  }
</style>
