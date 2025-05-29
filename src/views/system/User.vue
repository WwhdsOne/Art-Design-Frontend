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
            <form-input label="姓名" prop="name" v-model="searchForm.realname" />
            <form-input label="手机号" prop="phone" v-model="searchForm.phone" />
            <form-input label="邮箱" prop="email" v-model="searchForm.email" />
            <form-input label="账号" prop="account" v-model="searchForm.username" />
          </el-row>
          <el-row :gutter="20">
            <form-select
              label="性别"
              prop="sex"
              v-model="searchForm.gender"
              :options="sexOptions"
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
        <el-table-column
          label="用户名"
          prop="avatar"
          #default="scope"
          width="200px"
          v-if="columns[0].show"
        >
          <div class="user" style="display: flex; align-items: center">
            <img class="avatar" :src="scope.row.avatar" alt="头像" />
            <div>
              <p class="user-name">{{ scope.row.username }}</p>
              <p>{{ scope.row.realname }}</p>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
          show-overflow-tooltip
          width="200"
          v-if="columns[6].show"
        >
        </el-table-column>
        <el-table-column label="手机号" prop="phone" v-if="columns[1].show" />
        <el-table-column
          label="性别"
          prop="gender"
          #default="scope"
          sortable
          v-if="columns[2].show"
        >
          {{ scope.row.gender === 1 ? '男' : '女' }}
        </el-table-column>
        <el-table-column label="状态" prop="status" v-if="columns[4].show">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">
              {{ buildTagText(scope.row.status) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="role" v-if="columns[3].show">
          <template #default="scope">
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="role-tags">
                  <el-tag v-for="(role, index) in scope.row.roles" :key="index" type="success">
                    {{ role.name }}
                  </el-tag>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="created_at" sortable v-if="columns[5].show" />
        <el-table-column label="最后更新日期" prop="updated_at" sortable v-if="columns[6].show" />
        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-dropdown :hide-on-click="false">
              <template #default>
                <button-table type="edit" />
              </template>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="onResetPassword(scope.row)">
                    重置密码
                  </el-dropdown-item>
                  <el-dropdown-item @click="() => openStatusDialog(scope.row)">
                    调整状态
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <button-table type="delete" @click="deleteUser()" />
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog v-model="statusDialogVisible" title="调整用户状态" width="30%">
      <el-form :model="form">
        <el-form-item label="用户状态" label-width="80px">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option
              v-for="item in userStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitStatusChange">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { FormInstance } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { UserService } from '@/api/usersApi'
  import { onMounted } from 'vue'
  import { ref } from 'vue'
  const tableData = ref<any[]>([])
  const currentPage = ref(1)
  const pageSize = ref(5)
  const total = ref(0)

  const statusDialogVisible = ref(false)

  const form = reactive({
    id: 1,
    status: 1
  })

  const userStatusOptions = [
    { label: '启用', value: 1, tagType: 'info' },
    { label: '禁用', value: 2, tagType: 'danger' },
    { label: '审核中', value: 3, tagType: 'warning' }
  ]

  const buildTagText = (status: number): string => {
    const match = userStatusOptions.find((option) => option.value === status)
    return match ? match.label : '未知状态'
  }

  const getTagType = (status: number): string => {
    const match = userStatusOptions.find((option) => option.value === status)
    return match ? match.tagType : 'info'
  }

  function openStatusDialog(row: any) {
    form.status = row.status
    form.id = row.id
    statusDialogVisible.value = true
  }

  function submitStatusChange() {
    statusDialogVisible.value = false
    UserService.changeStatus({
      data: JSON.stringify({
        id: form.id,
        status: form.status
      })
    }).then((res) => {
      if (res.code === 200) {
        fetchTableData()
        ElMessage.success(res.message)
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  const onResetPassword = (row: any) => {
    ElMessageBox.confirm(`确定要为用户名为 ${row.username} 的用户重置密码？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        handleResetPassword(row.id)
      })
      .catch(() => {
        // 用户点击取消，不做处理
      })
  }
  const handleResetPassword = async (id: string) => {
    await UserService.resetPassword({ id }).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.message)
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  // 数据获取逻辑提取成函数
  const fetchTableData = async () => {
    const res = await UserService.getUserPage({
      data: JSON.stringify({
        page: currentPage.value,
        size: pageSize.value,
        ...searchForm,
        gender: Number(searchForm.gender)
      })
    })
    tableData.value = res.data.data
    total.value = res.data.total
    pageSize.value = res.data.size
    currentPage.value = res.data.page
  }

  // 初始化
  onMounted(() => {
    fetchTableData()
  })

  // 翻页处理
  const handleCurrentPageChange = (val: number) => {
    currentPage.value = val
    fetchTableData()
  }

  // 每页条数改变
  const handlePageSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
    fetchTableData()
  }

  // 搜索处理
  const search = () => {
    currentPage.value = 1
    fetchTableData()
  }

  const sexOptions = [
    {
      value: 0,
      label: '未知'
    },
    {
      value: 1,
      label: '男'
    },
    {
      value: 2,
      label: '女'
    }
  ]

  const columns = reactive([
    { name: '用户名', show: true },
    { name: '手机号', show: true },
    { name: '性别', show: true },
    { name: '角色', show: true },
    { name: '状态', show: true },
    { name: '创建日期', show: true },
    { name: '最后更新时间', show: true },
    { name: '邮箱', show: true }
  ])

  const searchFormRef = ref<FormInstance>()
  const searchForm = reactive({
    username: '',
    realname: '',
    phone: '',
    email: '',
    gender: ''
  })

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  const deleteUser = () => {
    ElMessageBox.confirm('确定要注销该用户吗？', '注销用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('注销成功')
    })
  }

  const changeColumn = (list: any) => {
    columns.values = list
  }
</script>

<style lang="scss" scoped>
  .role-tags {
    display: flex;
    flex-wrap: wrap;
  }

  .page-content {
    width: 100%;
    height: 100%;

    .user {
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 6px;
      }

      > div {
        margin-left: 10px;

        .user-name {
          font-weight: 500;
          color: var(--art-text-gray-800);
        }
      }
    }
  }
</style>
