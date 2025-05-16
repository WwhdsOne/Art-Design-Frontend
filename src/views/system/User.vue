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
      selection
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
          width="300px"
          v-if="columns[0].show"
        >
          <div class="user" style="display: flex; align-items: center">
            <img class="avatar" :src="scope.row.avatar" />
            <div>
              <p class="user-name">{{ scope.row.realname }}</p>
              <p class="email">{{ scope.row.email }}</p>
            </div>
          </div>
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
        <el-table-column label="创建日期" prop="created_at" sortable v-if="columns[5].show" />
        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <button-table type="edit" @click="showDialog('edit', scope.row)" />
            <button-table type="delete" @click="deleteUser" />
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="账号状态" prop="status">
          <el-select v-model="formData.status">
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { FormInstance } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import type { FormRules } from 'element-plus'
  import { UserService } from '@/api/usersApi'
  import { onMounted } from 'vue'
  const tableData = ref<any[]>([])
  const currentPage = ref(1)
  const pageSize = ref(5)
  const total = ref(0)

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

  const dialogType = ref('add')
  const dialogVisible = ref(false)

  const formData = reactive({
    status: '启用'
  })

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
    { name: '创建日期', show: true }
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

  const showDialog = (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type
    console.log(row)

    // if (type === 'edit' && row) {
    //   formData.username = row.username
    //   formData.phone = row.mobile
    //   formData.sex = row.sex === 1 ? '男' : '女'
    // } else {
    //   formData.username = ''
    //   formData.phone = ''
    //   formData.sex = '男'
    // }
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

  const getTagType = (status: string) => {
    switch (status) {
      case '1':
        return 'success'
      case '2':
        return 'info'
      case '3':
        return 'warning'
      case '4':
        return 'danger'
      default:
        return 'info'
    }
  }

  const buildTagText = (status: number) => {
    let text = ''

    if (status === 1) {
      text = '启用'
    } else if (status === 0) {
      text = '禁用'
    }
    return text
  }

  const rules = reactive<FormRules>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }]
  })

  const formRef = ref<FormInstance>()

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
      }
    })
  }
</script>

<style lang="scss" scoped>
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
