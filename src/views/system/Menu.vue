<template>
  <div class="page-content">
    <el-row :gutter="20" style="margin-left: 15px">
      <el-button v-auth="'add'" @click="showModel('menu', null)" v-ripple>添加菜单</el-button>
    </el-row>

    <art-table :data="tableData">
      <template #default>
        <el-table-column label="菜单名称">
          <template #default="scope">
            {{ formatMenuTitle(scope.row.meta?.title) }}
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由" />
        <el-table-column label="权限" width="180">
          <template #default="scope">
            <el-row :gutter="20">
              <el-col :span="24">
                <div style="display: flex; flex-wrap: wrap; gap: 10px">
                  <component
                    v-for="(item, index) in scope.row.meta.authList"
                    :key="item.id || index"
                    :is="ElPopover"
                    placement="top-start"
                    trigger="click"
                  >
                    <template #default>
                      <div
                        style="
                          display: flex;
                          gap: 4px;
                          justify-content: flex-end;
                          margin: 0;
                          text-align: right;
                        "
                      >
                        <el-button
                          size="small"
                          type="primary"
                          @click="showModel('button', item, scope.row.id)"
                          >编辑</el-button
                        >
                        <el-button size="small" type="danger" @click="deleteMenu(item)"
                          >删除</el-button
                        >
                      </div>
                    </template>
                    <template #reference>
                      <el-button class="small-btn">{{ item.name }}</el-button>
                    </template>
                  </component>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="编辑时间" prop="date">
          <template #default="scope">
            <span v-if="scope.row.update_at">{{ scope.row.update_at }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <button-table
              type="add"
              v-auth="'add'"
              @click="showModel('menu', null, scope.row.id)"
            />
            <button-table type="edit" v-auth="'edit'" @click="showModel('menu', scope.row)" />
            <button-table type="delete" v-auth="'delete'" @click="deleteMenu(scope.row)" />
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="700px" align-center>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="菜单类型">
          <el-radio-group v-model="labelPosition">
            <el-radio-button value="menu" label="menu">菜单</el-radio-button>
            <el-radio-button value="button" label="button">权限</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <template v-if="labelPosition === 'menu'">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="组件名称" prop="name">
                <el-input v-model="form.name" placeholder="组件名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="form.component" placeholder="组件路径" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="meta.title">
                <el-input v-model="form.meta.title" placeholder="菜单名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="路由地址" prop="path">
                <el-input v-model="form.path" placeholder="路由地址" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="图标" prop="meta.icon">
                <icon-selector :iconType="iconType" v-model="form.meta.icon" width="229px" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="菜单排序" prop="sort">
                <el-input-number v-model="form.sort" :min="1" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="外部链接" prop="link">
                <el-input v-model="form.meta.link" placeholder="https://..." />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="标签页隐藏" prop="isHideTab">
                <el-switch v-model="form.meta.isHideTab" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="页面缓存" prop="keepAlive">
                <el-switch v-model="form.meta.keepAlive" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否内嵌" prop="isIframe">
                <el-switch v-model="form.meta.isIframe" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="文本徽标" prop="showTextBadge">
                <el-input v-model="form.meta.showTextBadge" placeholder="文本徽标内容" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示徽标" prop="showBadge">
                <el-switch v-model="form.meta.showBadge" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="主容器显示" prop="isInMainContainer">
                <el-switch v-model="form.meta.isInMainContainer" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="不显示在菜单栏" prop="isHide" label-width="120px">
                <el-switch v-model="form.meta.isHide" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="labelPosition === 'button'">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="权限名称" prop="authName">
                <el-input v-model="form.authName" placeholder="权限名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限标识" prop="authCode">
                <el-input v-model="form.authCode" placeholder="权限标识"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="权限排序" prop="authSort" style="width: 100%">
                <el-input-number
                  v-model="form.authSort"
                  style="width: 100%"
                  :min="1"
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm()"> 确 定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElPopover, FormInstance, FormRules } from 'element-plus'
  import { IconTypeEnum } from '@/enums/appEnum'
  import { formatMenuTitle } from '@/utils/menu'
  import { menuService } from '@/api/menuApi'
  import { computed, nextTick, onMounted, reactive, ref } from 'vue' // Added missing imports

  const tableData = ref<any[]>([])
  onMounted(async () => {
    await fetchTableData()
  })

  const fetchTableData = async () => {
    menuService.getAllMenus().then((res) => {
      if (res.code === 200) {
        tableData.value = res.data
      }
    })
  }
  const dialogVisible = ref(false)
  const form = reactive({
    id: null, // Add an ID field for editing
    name: '',
    component: '',
    path: '',
    sort: 1,
    parentID: '',
    meta: {
      title: '',
      icon: '',
      showBadge: false,
      showTextBadge: '',
      isHide: false,
      isHideTab: false,
      link: '',
      isIframe: false,
      keepAlive: true,
      isInMainContainer: false
    },
    authName: '',
    authCode: '',
    authSort: 1
  })

  const resetForm = () => {
    formRef.value?.resetFields()
    Object.assign(form, {
      id: null,
      name: '',
      component: '',
      path: '',
      sort: 1,
      parentID: '',
      meta: {
        title: '',
        icon: '',
        showBadge: false,
        showTextBadge: '',
        isHide: false,
        isHideTab: false,
        link: '',
        isIframe: false,
        keepAlive: false,
        isInMainContainer: false
      },
      authName: '',
      authCode: '',
      authSort: 1
    })
  }
  const iconType = ref(IconTypeEnum.UNICODE)

  const labelPosition = ref('menu')
  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入组件名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
    'meta.icon': [{ required: true, message: '请选择图标', trigger: 'blur' }],
    'meta.title': [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
    authName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    authCode: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
  })
  const isEdit = ref(false)
  const formRef = ref<FormInstance>()
  const dialogTitle = computed(() => {
    const type = labelPosition.value === 'menu' ? '菜单' : '权限'
    return isEdit.value ? `编辑${type}` : `新建${type}`
  })

  const submitForm = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          if (labelPosition.value === 'menu') {
            const params = {
              id: form.id, // Include ID for editing
              name: form.name,
              component: form.component,
              path: form.path,
              sort: form.sort,
              parentID: form.parentID || '-1',
              meta: {
                title: form.meta.title,
                icon: form.meta.icon,
                showBadge: form.meta.showBadge,
                showTextBadge: form.meta.showTextBadge,
                isHide: form.meta.isHide,
                isHideTab: form.meta.isHideTab,
                link: form.meta.link,
                isIframe: form.meta.isIframe,
                keepAlive: form.meta.keepAlive,
                isInMainContainer: form.meta.isInMainContainer
              },
              type: form.parentID ? 2 : 1 // Assuming 1 for menu
            }
            if (isEdit.value) {
              await menuService.updateMenu({ data: JSON.stringify(params) }).then((res) => {
                if (res.code === 200) {
                  ElMessage.success(res.message)
                  dialogVisible.value = false
                  resetForm()
                  fetchTableData()
                } else {
                  ElMessage.error(res.message)
                }
              })
            } else {
              await menuService.createMenu({ data: JSON.stringify(params) }).then((res) => {
                if (res.code === 200) {
                  ElMessage.success(res.message)
                  dialogVisible.value = false
                  resetForm()
                  fetchTableData()
                } else {
                  ElMessage.error(res.message)
                }
              })
            }
          } else {
            // labelPosition.value === 'button'
            const params = {
              id: form.id, // Include ID for editing
              parentID: form.parentID,
              title: form.authName,
              sort: form.authSort,
              authCode: form.authCode,
              type: 3 // Assuming 3 for button/permission
            }
            if (isEdit.value) {
              await menuService.updateAuth({ data: JSON.stringify(params) }).then((res) => {
                if (res.code === 200) {
                  ElMessage.success(res.message)
                  dialogVisible.value = false
                  resetForm()
                  fetchTableData()
                } else {
                  ElMessage.error(res.message)
                }
              })
            } else {
              await menuService.createAuth({ data: JSON.stringify(params) }).then((res) => {
                if (res.code === 200) {
                  ElMessage.success(res.message)
                  dialogVisible.value = false
                  resetForm()
                  fetchTableData()
                } else {
                  ElMessage.error(res.message)
                }
              })
            }
          }
        } catch (error) {
          console.error('Submission error:', error)
          ElMessage.error(`${isEdit.value ? '编辑' : '新增'}失败`)
        }
      }
    })
  }

  const showModel = (type: string, row?: any, parentID?: string) => {
    resetForm() // Always reset form first
    dialogVisible.value = true
    labelPosition.value = type
    isEdit.value = !!row // Set isEdit based on whether a row is provided

    // Set parentID if provided (for adding sub-menus/permissions)
    if (parentID) {
      form.parentID = parentID
    } else if (row && row.parentID) {
      // If editing a sub-item, retain its parentID
      form.parentID = row.parentID
    } else {
      form.parentID = '' // Clear parentID if no parent is specified
    }

    nextTick(() => {
      if (row) {
        form.id = row.id // Populate ID for editing
        if (type === 'menu') {
          form.name = row.name // Use row.name directly
          form.path = row.path
          form.sort = row.sort || 1 // Use row.sort
          form.component = row.component
          if (row.meta) {
            form.meta.title = row.meta.title
            form.meta.icon = row.meta.icon
            form.meta.showBadge = row.meta.showBadge || false
            form.meta.showTextBadge = row.meta.showTextBadge || ''
            form.meta.isHide = row.meta.isHide || false
            form.meta.isHideTab = row.meta.isHideTab || false
            form.meta.link = row.meta.link || ''
            form.meta.isIframe = row.meta.isIframe || false
            form.meta.keepAlive = row.meta.keepAlive || false
            form.meta.isInMainContainer = row.meta.isInMainContainer || false
            // Make sure authList is also carried over for menu editing if it exists
            if (row.meta.authList) {
              ;(form.meta as any).authList = row.meta.authList
            }
          }
        } else {
          // type === 'button' (permission)
          form.authName = row.name
          form.authCode = row.authCode
          form.authSort = row.sort || 1
        }
      }
    })
  }

  const deleteMenu = async (row: any) => {
    try {
      let confirmMessage
      if (row.type === 3) {
        // Assuming type 3 is for permissions
        confirmMessage = '确定要删除该权限吗？删除后无法恢复'
      } else {
        // Assuming type 1 for menus
        confirmMessage = '确定要删除该菜单吗？删除后无法恢复'
      }

      await ElMessageBox.confirm(confirmMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await menuService.deleteMenu(row.id).then((res) => {
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
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      overflow: hidden;
      vertical-align: -8px;
      fill: currentcolor;
    }

    :deep(.small-btn) {
      height: 30px !important;
      padding: 0 10px !important;
      font-size: 12px !important;
    }
  }
</style>
