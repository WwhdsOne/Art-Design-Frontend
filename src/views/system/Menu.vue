<template>
  <div class="page-content">
    <el-row :gutter="20" style="margin-left: 15px">
      <el-button v-auth="'add'" @click="showModel('menu', null, true)" v-ripple>添加菜单</el-button>
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
                        <el-button size="small" type="primary" @click="showModel('button', item)"
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
            <button-table type="add" v-auth="'add'" @click="showModel('menu')" />
            <button-table type="edit" v-auth="'edit'" @click="showDialog('edit', scope.row)" />
            <button-table type="delete" v-auth="'delete'" @click="deleteMenu(scope.row)" />
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="700px" align-center>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="菜单类型">
          <el-radio-group v-model="labelPosition" :disabled="disableMenuType">
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
              <el-form-item label="菜单名称" prop="title">
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
              <el-form-item label="图标" prop="icon">
                <icon-selector :iconType="iconType" :defaultIcon="form.meta.icon" width="229px" />
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
              <el-form-item label="是否显示" prop="isHide">
                <el-switch v-model="form.meta.isHide" />
              </el-form-item>
            </el-col>
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
            <el-col :span="12">
              <el-form-item label="主容器显示" prop="isInMainContainer">
                <el-switch v-model="form.meta.isInMainContainer" />
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
              <el-form-item label="权限标识" prop="authLabel">
                <el-input v-model="form.authLabel" placeholder="权限标识"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="权限排序" prop="authSort" style="width: 100%">
                <el-input-number
                  v-model="form.authSort"
                  style="width: 100%"
                  @change="handleChange"
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
  import { useMenuStore } from '@/store/modules/menu'
  import { ElMessage, ElMessageBox, ElPopover, FormInstance, FormRules } from 'element-plus'
  import { IconTypeEnum } from '@/enums/appEnum'
  import { formatMenuTitle } from '@/utils/menu'
  import { menuService } from '@/api/menuApi'
  import { onMounted } from 'vue'
  import { ref } from 'vue'

  const tableData = ref<any[]>([])
  onMounted(async () => {
    await fetchTableData()
  })

  const fetchTableData = async () => {
    // ✅ 注意这里加了括号和 await
    tableData.value = computed(() => useMenuStore().getMenuList).value
  }
  const dialogVisible = ref(false)
  const form = reactive({
    name: '',
    component: '',
    path: '',
    sort: 1,
    parentID: '', // 如果需要
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
      authCode: '',
      isInMainContainer: false
    },
    // 权限 (修改这部分)
    authName: '',
    authLabel: '',
    authIcon: '',
    authSort: 1
  })

  const resetForm = () => {
    formRef.value?.resetFields()
    Object.assign(form, {
      name: '',
      component: '',
      path: '',
      sort: 1,
      parentID: '', // 如果需要
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
      // 权限 (修改这部分)
      authName: '',
      authLabel: '',
      authIcon: '',
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
    icon: [{ required: true, message: '请选择图标', trigger: 'blur' }],
    title: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
    // 修改这部分
    authName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    authLabel: [{ required: true, message: '请输入权限权限标识', trigger: 'blur' }]
  })
  const isEdit = ref(false)
  const formRef = ref<FormInstance>()
  const dialogTitle = computed(() => {
    const type = labelPosition.value === 'menu' ? '菜单' : '权限'
    return isEdit.value ? `编辑${type}` : `新建${type}`
  })

  const showDialog = (type: string, row: any) => {
    showModel('menu', row, true)
  }

  const handleChange = () => {
    fetchTableData()
  }

  const submitForm = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          // const params =
          //   labelPosition.value === 'menu'
          //     ? {
          //         title: form.title,
          //         path: form.path,
          //         name: form.name,
          //         icon: form.icon,
          //         sort: form.sort,
          //         parentID: form.parentID,
          //         keepAlive: form.keepAlive,
          //         isHide: form.isHide,
          //         link: form.link
          //       }
          //     : {
          //         parentID: form.parentID,
          //         title: form.authName,
          //         name: form.authLabel,
          //         icon: form.authIcon,
          //         sort: form.authSort
          //       }

          if (isEdit.value) {
            // await menuStore.updateMenu(params)
          } else {
            // await menuStore.addMenu(params)
          }

          ElMessage.success(`${isEdit.value ? '编辑' : '新增'}成功`)
          dialogVisible.value = false
          // 刷新列表
          // await menuStore.getMenuList()
        } catch {
          ElMessage.error(`${isEdit.value ? '编辑' : '新增'}失败`)
        }
      }
    })
  }

  const showModel = (type: string, row?: any, lock: boolean = false) => {
    dialogVisible.value = true
    labelPosition.value = type
    isEdit.value = false
    lockMenuType.value = lock
    resetForm()

    if (row) {
      isEdit.value = true
      nextTick(() => {
        // 回显数据
        if (type === 'menu') {
          // 菜单数据回显
          // console.log(row.meta)
          form.name = formatMenuTitle(row.meta.title)
          form.path = row.path
          form.meta.icon = row.meta.icon
          form.sort = row.meta.sort || 1
          form.meta.keepAlive = row.meta.keepAlive
          form.meta.isHide = row.meta.isHide || true
          form.meta.link = row.meta.link
          form.meta.isIframe = row.meta.isIframe || false
        } else {
          // 权限按钮数据回显
          form.authName = row.title
          form.authLabel = row.auth_mark
          form.authIcon = row.icon || ''
          form.authSort = row.sort || 1
        }
      })
    }
  }

  const deleteMenu = async (row: any) => {
    try {
      // 只有权限的code字段不为空
      if (!row.code || row.code === '') {
        await ElMessageBox.confirm('确定要删除该权限吗？删除后无法恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        await ElMessageBox.confirm('确定要删除该菜单吗？删除后无法恢复', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
      await menuService.deleteMenu(row.id).then((res) => {
        if (res.code === 200) {
          ElMessage.success('删除成功')
        } else {
          ElMessage.error('删除失败')
        }
      })
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
      }
    }
  }

  // 修改计算属性，增加锁定控制参数
  const disableMenuType = computed(() => {
    // 编辑权限时锁定为权限类型
    if (isEdit.value && labelPosition.value === 'button') return true
    // 编辑菜单时锁定为菜单类型
    if (isEdit.value && labelPosition.value === 'menu') return true
    // 顶部添加菜单按钮时锁定为菜单类型
    return !!(!isEdit.value && labelPosition.value === 'menu' && lockMenuType.value)
  })

  // 添加一个控制变量
  const lockMenuType = ref(false)
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
