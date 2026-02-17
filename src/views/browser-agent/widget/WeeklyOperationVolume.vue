<template>
  <div class="card art-custom-card" style="height: 11rem">
    <div class="card-header">
      <p class="title" style="font-size: 24px"
        >{{ formatVolume(data.volume) }}<i class="iconfont-sys text-success">&#xe8d5;</i></p
      >
      <p class="subtitle">周操作量</p>
    </div>

    <BarChart
      v-if="data.chartData.length"
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="data.chartData"
      barWidth="16px"
      height="4rem"
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

  const formatVolume = (volume: number) => {
    if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'k'
    }
    return volume
  }

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getAdminWeeklyOperationVolume()
      data.volume = res.data.volume
      data.chartData = res.data.chartData
    } catch (error) {
      console.error('Failed to fetch weekly operation volume:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>
