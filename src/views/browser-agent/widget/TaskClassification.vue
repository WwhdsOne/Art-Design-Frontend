<template>
  <div class="card art-custom-card sales-card" style="height: 26rem">
    <div class="card-header">
      <p class="title">任务分类</p>
      <p class="subtitle">按任务类型</p>
    </div>
    <RingChart
      v-if="data.distribution.length"
      :data="data.distribution"
      :color="['#4C87F3', '#EDF2FF', '#8BD8FC']"
      :radius="['43%', '60%']"
      height="18rem"
      :showLabel="false"
      :borderRadius="0"
      :showLegend="true"
    ></RingChart>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'
  import type { DistributionItem } from '@/types/browserAgent'

  const data = reactive({
    distribution: [] as DistributionItem[]
  })

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getAdminTaskClassification()
      data.distribution = res.data.distribution
    } catch (error) {
      console.error('Failed to fetch task classification:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>
