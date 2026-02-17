<template>
  <div class="card art-custom-card" style="height: 26rem">
    <div class="card-header">
      <p class="title">任务趋势</p>
      <p class="subtitle">今年增长 {{ data.growth }}</p>
    </div>
    <LineChart
      v-if="data.monthlyData.length"
      :showAreaColor="true"
      :showAxisLabel="true"
      :showAxisLine="false"
      :showSplitLine="true"
      :data="data.monthlyData"
      :xAxisData="months"
      height="18rem"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'

  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月'
  ]

  const data = reactive({
    growth: '',
    monthlyData: [] as number[]
  })

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getUserTaskTrend()
      data.growth = res.data.growth
      data.monthlyData = res.data.monthlyData
    } catch (error) {
      console.error('Failed to fetch user task trend:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>
