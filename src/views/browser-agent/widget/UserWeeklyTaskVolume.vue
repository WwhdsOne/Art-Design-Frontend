<template>
  <div class="card art-custom-card" style="height: 13.3rem">
    <div class="card-header">
      <p class="title" style="font-size: 24px"
        >{{ data.volume }}<i class="iconfont-sys text-success">&#xe8d5;</i></p
      >
      <p class="subtitle">周任务量</p>
    </div>

    <BarChart
      v-if="data.chartData.length"
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="data.chartData"
      barWidth="18px"
      height="7rem"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'

  const data = reactive({
    volume: 0,
    chartData: [] as number[]
  })

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getUserWeeklyTaskVolume()
      data.volume = res.data.volume
      data.chartData = res.data.chartData
    } catch (error) {
      console.error('Failed to fetch user weekly task volume:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>
