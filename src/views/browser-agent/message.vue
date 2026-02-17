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
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-input
              label="会话ID"
              prop="conversation_id"
              v-model="searchForm.conversation_id"
            />
            <form-select
              label="状态"
              prop="state"
              v-model="searchForm.state"
              :options="stateOptions"
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
        <el-table-column label="ID" prop="id" min-width="220px" v-if="columns[0].show" />
        <el-table-column
          label="会话ID"
          prop="conversation_id"
          min-width="220px"
          v-if="columns[1].show"
        />
        <el-table-column
          label="任务内容"
          prop="content"
          min-width="300px"
          show-overflow-tooltip
          v-if="columns[2].show"
        />
        <el-table-column label="状态" prop="state" v-if="columns[3].show" min-width="120px">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.state)">
              {{ getTagText(scope.row.state) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="created_at"
          min-width="180px"
          sortable
          v-if="columns[4].show"
        >
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button type="primary" link @click="openActionDialog(scope.row)">
              查看操作序列
            </el-button>
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog v-model="actionDialogVisible" title="操作序列" width="80%">
      <el-table :data="actionList" v-loading="actionLoading">
        <el-table-column label="序号" width="80px">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="动作类型" prop="action_type" width="120px">
          <template #default="scope">
            <el-tag :type="getActionTypeTagType(scope.row.action_type)">
              {{ getActionTypeText(scope.row.action_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100px">
          <template #default="scope">
            <el-tag :type="getActionTagType(scope.row.status)">
              {{ getActionTagText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="URL" prop="url" min-width="200px" show-overflow-tooltip />
        <el-table-column label="选择器" prop="selector" min-width="150px" show-overflow-tooltip />
        <el-table-column label="输入值" prop="value" min-width="120px" show-overflow-tooltip />
        <el-table-column label="执行时间(ms)" prop="execution_time" width="120px" />
        <el-table-column
          label="错误信息"
          prop="error_message"
          min-width="200px"
          show-overflow-tooltip
        />
        <el-table-column label="创建时间" prop="created_at" width="180px">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { FormInstance } from 'element-plus'
  import { onMounted, ref } from 'vue'
  import { MessageItem, ActionItem } from '@/types/browserAgent'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'
  import { formatDate } from '@/utils/format'

  const tableData = ref<MessageItem[]>([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  const actionDialogVisible = ref(false)
  const actionList = ref<ActionItem[]>([])
  const actionLoading = ref(false)

  type TagType = 'info' | 'primary' | 'success' | 'warning' | 'danger'

  const stateOptions = [
    { value: '', label: '全部' },
    { value: 'running', label: '执行中' },
    { value: 'finished', label: '已完成' },
    { value: 'error', label: '已失败' }
  ]

  const stateTagMap: Record<string, { text: string; type: TagType }> = {
    running: { text: '执行中', type: 'warning' },
    finished: { text: '已完成', type: 'success' },
    error: { text: '已失败', type: 'danger' }
  }

  const getTagText = (state: string): string => {
    return stateTagMap[state]?.text || state
  }

  const getTagType = (state: string): TagType => {
    return stateTagMap[state]?.type || 'info'
  }

  const getActionTagType = (status: string): TagType => {
    const map: Record<string, TagType> = {
      success: 'success',
      running: 'warning',
      failed: 'danger',
      pending: 'info'
    }
    return map[status] || 'info'
  }

  const getActionTagText = (status: string): string => {
    const map: Record<string, string> = {
      success: '成功',
      running: '执行中',
      failed: '失败',
      pending: '等待'
    }
    return map[status] || status
  }

  const getActionTypeText = (actionType: string): string => {
    const map: Record<string, string> = {
      goto: '跳转',
      click: '点击',
      input: '输入',
      select: '选择',
      scroll: '滚动',
      wait: '等待',
      close_browser: '关闭'
    }
    return map[actionType] || actionType
  }

  const getActionTypeTagType = (actionType: string): TagType => {
    const map: Record<string, TagType> = {
      goto: 'primary',
      click: 'success',
      input: 'warning',
      select: 'info',
      scroll: 'info',
      wait: 'info',
      close_browser: 'danger'
    }
    return map[actionType] || 'info'
  }

  const openActionDialog = async (row: MessageItem) => {
    actionDialogVisible.value = true
    actionLoading.value = true
    try {
      const res = await BrowserAgentDashboardService.getActions(row.id)
      actionList.value = res.data
    } catch (error) {
      console.error('Failed to fetch actions:', error)
      actionList.value = []
    } finally {
      actionLoading.value = false
    }
  }

  const fetchTableData = async () => {
    const res = await BrowserAgentDashboardService.getMessagePage({
      conversation_id: searchForm.conversation_id ? Number(searchForm.conversation_id) : undefined,
      state: searchForm.state || undefined,
      page: currentPage.value,
      size: pageSize.value
    })
    tableData.value = res.data.data
    total.value = res.data.total
    pageSize.value = res.data.size
    currentPage.value = res.data.page
  }

  onMounted(() => {
    fetchTableData()
  })

  const handleCurrentPageChange = (val: number) => {
    currentPage.value = val
    fetchTableData()
  }

  const handlePageSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
    fetchTableData()
  }

  const search = () => {
    currentPage.value = 1
    fetchTableData()
  }

  const columns = reactive([
    { name: 'ID', show: true },
    { name: '会话ID', show: true },
    { name: '任务内容', show: true },
    { name: '状态', show: true },
    { name: '创建时间', show: true }
  ])

  const searchFormRef = ref<FormInstance>()
  const searchForm = reactive({
    conversation_id: '',
    state: ''
  })

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  const changeColumn = (list: any) => {
    columns.values = list
  }
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
  }
</style>
