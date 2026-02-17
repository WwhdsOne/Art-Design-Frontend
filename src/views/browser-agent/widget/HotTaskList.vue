<template>
  <div class="card art-custom-card" style="height: 27.8rem">
    <div class="card-header">
      <p class="title">热门任务排行</p>
      <p class="subtitle">本月执行情况</p>
    </div>
    <div class="table">
      <el-scrollbar style="height: 21.55rem">
        <art-table :data="tableData" :pagination="false" style="margin-top: 0 !important">
          <template #default>
            <el-table-column label="任务名称" prop="product" width="220px">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <div class="task-icon" :style="{ backgroundColor: getColorBg(scope.row.color) }">
                    <i class="iconfont-sys" v-html="scope.row.icon"></i>
                  </div>
                  <div class="product-info">
                    <div class="product-name">{{ scope.row.name }}</div>
                    <div class="product-category">{{ scope.row.category }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="平均耗时（毫秒）" prop="price">
              <template #default="scope">
                <span class="price">{{ scope.row.avgTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="执行次数" prop="execCount" />
            <el-table-column label="成功率" width="240">
              <template #default="scope">
                <el-progress
                  :percentage="scope.row.pro"
                  :color="getColorStyle(scope.row.color)"
                  :stroke-width="4"
                />
              </template>
            </el-table-column>
          </template>
        </art-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'
  import type { HotTaskItem } from '@/types/browserAgent'

  interface TableItem extends HotTaskItem {
    pro: number
    icon: string
  }

  const tableData = reactive<TableItem[]>([])

  const iconMap: Record<string, string> = {
    primary: '&#xe718;',
    success: '&#xe70c;',
    warning: '&#xe813;',
    error: '&#xe6f2;',
    info: '&#xe806;',
    secondary: '&#xe6fb;'
  }

  const getColorBg = (color: string) => {
    const map: Record<string, string> = {
      primary: 'var(--el-color-primary-light-9)',
      success: 'var(--el-color-success-light-9)',
      warning: 'var(--el-color-warning-light-9)',
      error: 'var(--el-color-danger-light-9)',
      info: 'var(--el-color-info-light-9)',
      secondary: 'var(--el-color-primary-light-9)'
    }
    return map[color] || map.primary
  }

  const getColorStyle = (color: string) => {
    const map: Record<string, string> = {
      primary: 'rgb(var(--art-primary))',
      success: 'rgb(var(--art-success))',
      warning: 'rgb(var(--art-warning))',
      error: 'rgb(var(--art-error))',
      info: 'rgb(var(--art-info))',
      secondary: 'rgb(var(--art-secondary))'
    }
    return map[color] || map.primary
  }

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getAdminHotTaskList()
      tableData.length = 0
      res.data.forEach((item) => {
        tableData.push({
          ...item,
          pro: 0,
          icon: iconMap[item.color] || iconMap.primary
        })
      })
      addAnimation()
    } catch (error) {
      console.error('Failed to fetch hot task list:', error)
    }
  }

  const addAnimation = () => {
    setTimeout(() => {
      for (let i = 0; i < tableData.length; i++) {
        tableData[i].pro = tableData[i].successRate
      }
    }, 100)
  }

  onMounted(() => {
    fetchData()
  })
</script>

<style lang="scss" scoped>
  .table {
    width: 100%;

    .card-header {
      padding-left: 25px !important;
    }

    .task-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 6px;

      i {
        font-size: 24px;
        color: var(--main-color);
      }
    }

    .product-info {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
    }

    .product-name {
      font-weight: 500;
    }

    .product-category {
      font-size: 12px;
      color: #64748b;
    }

    .price {
      font-weight: 600;
    }
  }
</style>
