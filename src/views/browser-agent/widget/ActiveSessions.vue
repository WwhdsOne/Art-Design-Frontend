<template>
  <div v-if="loading">加载中...</div>
  <LineChartCard
    v-else
    class="margin-bottom-0"
    :value="data.count"
    label="活跃会话数"
    :percentage="parseFloat(data.growth)"
    :height="13.5"
    :chartData="data.chartData"
    :showAreaColor="true"
  />
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'

  const data = reactive({
    count: 0,
    growth: '0',
    chartData: [] as number[]
  })

  const loading = ref(true)

  const fetchData = async () => {
    loading.value = true
    try {
      const res = await BrowserAgentDashboardService.getAdminActiveSessions()
      data.count = res.data.count
      data.growth = res.data.growth.replace('+', '')
      data.chartData = res.data.chartData
    } catch (error) {
      console.error('Failed to fetch active sessions:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>
