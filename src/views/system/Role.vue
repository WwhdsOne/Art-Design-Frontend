<template>
  <div class="page-content">
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-input v-model="searchForm.name" placeholder="角色名称"></el-input>
      </el-col>
      <div style="width: 12px"></div>
      <el-col :xs="24" :sm="12" :lg="6" class="el-col2">
        <el-button v-ripple @click="fetchTableData()">搜索</el-button>
        <el-button @click="showDialog('add')" v-ripple>新增角色</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData">
      <template #default>
        <el-table-column label="角色名称" prop="name" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="角色码" prop="code" />
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'primary' : 'info'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-row>
              <button-more
                :list="[
                  { key: 'permission', label: '菜单权限' },
                  { key: 'edit', label: '编辑角色' },
                  { key: 'delete', label: '删除角色' }
                ]"
                @click="buttonMoreClick($event, scope.row)"
              />
            </el-row>
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="30%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit(formRef)">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="permissionDialog" title="菜单权限" width="30%">
      <div style="max-height: 500px; overflow-y: auto">
        <el-tree
          ref="menuTreeRef"
          :data="menuList"
          show-checkbox
          :default-expand-all="true"
          node-key="id"
          :props="defaultProps"
          :check-strictly="true"
        />
        <!-- 父子不关联！！！ 记得写文档总结 -->
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permissionDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitRoleMenuBinding()">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ButtonMoreItem } from '@/components/Form/ButtonMore.vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage, ElMessageBox, ElTree } from 'element-plus'

  import { onMounted } from 'vue'
  import { RoleService } from '@/api/roleApi'
  import { RoleInfo } from '@/types/store'

  const tableData = ref<any[]>([])
  const currentPage = ref(1)
  const pageSize = ref(5)
  const total = ref(0)

  const searchForm = reactive({
    name: ''
  })

  // 数据获取逻辑提取成函数
  const fetchTableData = async () => {
    const res = await RoleService.getRolePage({
      data: JSON.stringify({
        page: currentPage.value,
        size: pageSize.value,
        ...searchForm
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

  const dialogVisible = ref(false)
  const permissionDialog = ref(false)
  const formRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度最多为 10 个字符', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请输入角色码', trigger: 'blur' },
      { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
  })

  const form = reactive({
    id: '',
    name: '',
    description: '',
    code: '',
    status: true
  })

  const dialogType = ref('add')

  const showDialog = (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      form.id = row.id
      form.name = row.name
      form.description = row.description
      form.status = row.status === 1
      form.code = row.code
    } else {
      form.id = ''
      form.name = ''
      form.description = ''
      form.code = ''
      form.status = true
    }
  }

  const buttonMoreClick = (item: ButtonMoreItem, row: RoleInfo) => {
    if (item.key === 'permission') {
      showPermissionDialog(row.id)
    } else if (item.key === 'edit') {
      showDialog('edit', row)
    } else if (item.key === 'delete') {
      deleteRole(row.id)
    }
  }

  // const menuList = computed(() => useMenuStore().getMenuList)
  interface SimpleMenu {
    id: string
    title: string
    children?: SimpleMenu[]
    parent_id: string
  }
  const menuList = ref<SimpleMenu[]>([]) // 菜单树
  const menuTreeRef = ref<InstanceType<typeof ElTree>>()

  const checkedKeys = ref([]) // 选中的 key
  const currentRoleID = ref('')
  const showPermissionDialog = async (roleID: number) => {
    permissionDialog.value = true
    currentRoleID.value = String(roleID)
    try {
      const res = await RoleService.getRoleMenu({ data: roleID })
      // 转换 id 为字符串（如果你后端是字符串形式）
      menuList.value = res.data.menus
      checkedKeys.value = res.data.has_menu_ids
      // 等待 DOM 更新后再调用 setCheckedKeys
      nextTick(() => {
        menuTreeRef.value?.setCheckedKeys(checkedKeys.value)
      })
    } catch (error) {
      console.error('加载角色权限失败', error)
    }
  }

  const handleSubmitRoleMenuBinding = async () => {
    RoleService.updateRoleMenu({
      data: {
        role_id: currentRoleID.value,
        menu_ids: menuTreeRef.value?.getCheckedKeys()
      }
    }).then((res) => {
      if (res.code === 200) {
        ElMessage.success('权限绑定成功')
        permissionDialog.value = false
      }
    })
  }

  // el-tree 显示配置项
  const defaultProps = {
    children: 'children',
    label: 'title' // 注意是 title，不是 name
  }

  const deleteRole = (roleID: number) => {
    ElMessageBox.confirm('确定删除该角色吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(() => {
        // 在这里调用删除角色的函数
        RoleService.deleteRoleByID({
          data: roleID
        }).then((res) => {
          if (res.code === 200) {
            fetchTableData()
            ElMessage.success('删除成功')
          }
        })
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
  }

  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate((valid) => {
      if (valid) {
        const message = dialogType.value === 'add' ? '新增成功' : '修改成功'
        if (dialogType.value === 'add') {
          RoleService.createRole({
            data: JSON.stringify({
              name: form.name,
              description: form.description,
              code: form.code,
              status: form.status ? 1 : 2
            })
          }).then((res) => {
            if (res.code === 200) {
              fetchTableData()
              ElMessage.success(message)
              dialogVisible.value = false
              formEl.resetFields()
            }
          })
        } else {
          RoleService.updateRole({
            data: JSON.stringify({
              id: form.id,
              name: form.name,
              description: form.description,
              code: form.code,
              status: form.status ? 1 : 2
            })
          }).then((res) => {
            if (res.code === 200) {
              fetchTableData()
              ElMessage.success(message)
              dialogVisible.value = false
              formEl.resetFields()
            } else {
              ElMessage.error('更新失败')
            }
          })
        }
      }
    })
  }

  const formatDate = (date: string) => {
    return new Date(date)
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      .replace(/\//g, '-')
  }
</script>

<style lang="scss" scoped>
  .page-content {
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      overflow: hidden;
      vertical-align: -8px;
      fill: currentcolor;
    }
  }
</style>
