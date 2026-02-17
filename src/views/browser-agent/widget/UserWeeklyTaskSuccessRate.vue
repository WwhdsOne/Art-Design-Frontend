<template>
  <div class="card art-custom-card" style="height: 13.3rem">
    <div class="card-header">
      <p class="title" style="font-size: 24px"
        >{{ data.rate }}%<i class="iconfont-sys text-success">&#xe8d5;</i></p
      >
      <p class="subtitle">周任务成功率</p>
    </div>

    <LineChart
      v-if="data.chartData.length"
      :showAreaColor="true"
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="data.chartData"
      height="7rem"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'

  const data = reactive({
    rate: 0,
    chartData: [] as number[]
  })

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getUserWeeklyTaskSuccessRate()
      data.rate = res.data.rate
      data.chartData = res.data.chartData
    } catch (error) {
      console.error('Failed to fetch user weekly task success rate:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>
