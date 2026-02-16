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
        <el-form :model="searchForm" ref="searchFormRef" label-width="90px">
          <el-row :gutter="20">
            <form-input label="操作人ID" prop="operator_id" v-model="searchForm.operator_id" />
            <form-input label="请求路径" prop="path" v-model="searchForm.path" />
            <form-select
              label="请求方式"
              prop="method"
              v-model="searchForm.method"
              :options="methodOptions"
            />
            <form-select
              label="状态"
              prop="status"
              v-model="searchForm.status"
              :options="statusOptions"
            />
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="时间区间">
                <el-date-picker
                  v-model="searchForm.timeRange"
                  type="datetimerange"
                  value-format="YYYY-MM-DDTHH:mm:ssZ"
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择时间范围"
                />
              </el-form-item>
            </el-col>
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
        <el-table-column label="ID" prop="id" min-width="220px" />
        <el-table-column label="操作人ID" prop="operator_iD" min-width="220px" />
        <el-table-column label="请求方式" prop="method" width="100" />
        <el-table-column label="请求路径" prop="path" min-width="220" />
        <el-table-column label="状态" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 200 ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="耗时(ms)" prop="latency" width="120" />
        <el-table-column label="IP" prop="ip" min-width="150" />
        <el-table-column label="浏览器" prop="browser" min-width="140" />
        <el-table-column label="系统" prop="os" min-width="140" />
        <el-table-column label="创建时间" prop="created_at" min-width="220px" sortable>
          <template #default="scope">
            <!-- 使用 dayjs 格式化 -->
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="详情" width="100">
          <template #default="scope">
            <el-button type="primary" link @click="openDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </template>
    </art-table>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="日志详情" width="60%">
      <pre class="log-detail">{{ currentDetail }}</pre>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { FormInstance } from 'element-plus'
  import { OperationLogService } from '@/api/operationLogApi'
  import { formatDate } from '@/utils/format'

  /* ================= 基础分页数据 ================= */

  const tableData = ref<any[]>([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  /* ================= 查询表单 ================= */

  const searchFormRef = ref<FormInstance>()

  const searchForm = reactive({
    operator_id: '',
    path: '',
    method: '',
    status: '',
    timeRange: [] as string[]
  })

  const methodOptions = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' }
  ]

  const statusOptions = [
    { label: '成功', value: 200 },
    { label: '失败', value: 500 }
  ]

  /* ================= 表格列控制 ================= */

  const columns = reactive([
    { name: 'ID', show: true },
    { name: '操作人ID', show: true },
    { name: '请求方式', show: true },
    { name: '请求路径', show: true },
    { name: '状态', show: true },
    { name: '耗时', show: true },
    { name: 'IP', show: true },
    { name: '浏览器', show: true },
    { name: '系统', show: true },
    { name: '创建时间', show: true }
  ])

  const changeColumn = (list: any) => {
    columns.values = list
  }

  /* ================= 数据获取 ================= */

  const fetchTableData = async () => {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      operator_id: Number(searchForm.operator_id) || 0,
      path: searchForm.path,
      method: searchForm.method,
      status: Number(searchForm.status) || 0,
      start_time: searchForm.timeRange?.[0] ?? null,
      end_time: searchForm.timeRange?.[1] ?? null
    }

    const res = await OperationLogService.getOperationLogPage({
      data: JSON.stringify({ ...params })
    })
    tableData.value = res.data.data
    total.value = res.data.total
    pageSize.value = res.data.size
    currentPage.value = res.data.page
  }

  /* ================= 生命周期 ================= */

  onMounted(() => {
    fetchTableData()
  })

  /* ================= 分页 ================= */

  const handleCurrentPageChange = (val: number) => {
    currentPage.value = val
    fetchTableData()
  }

  const handlePageSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
    fetchTableData()
  }

  /* ================= 搜索 ================= */

  const search = () => {
    currentPage.value = 1
    fetchTableData()
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  /* ================= 详情 ================= */

  const detailVisible = ref(false)
  const currentDetail = ref('')

  const openDetail = (row: any) => {
    currentDetail.value = JSON.stringify(row, null, 2)
    detailVisible.value = true
  }
</script>

<style scoped lang="scss">
  .page-content {
    width: 100%;
    height: 100%;
  }

  .log-detail {
    max-height: 500px;
    padding: 16px;
    overflow: auto;
    background: #f6f8fa;
    border-radius: 6px;
  }
</style>
