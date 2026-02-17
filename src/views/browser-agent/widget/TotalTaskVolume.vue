<template>
  <div class="card art-custom-card" style="height: 26rem">
    <div class="card-header">
      <p class="title" style="font-size: 24px">{{ data.total.toLocaleString() }}</p>
      <p class="subtitle">总任务量</p>
    </div>
    <RingChart
      v-if="data.distribution.length"
      :data="data.distribution"
      :color="['#4C87F3', '#93F1B4', '#8BD8FC']"
      :radius="['48%', '65%']"
      height="16rem"
      :showLabel="false"
      :borderRadius="0"
      :showLegend="true"
    ></RingChart>
    <div class="icon-text-widget" style="margin-top: 10px">
      <div class="item">
        <div class="icon">
          <i class="iconfont-sys">&#xe718;</i>
        </div>
        <div class="content">
          <p>{{ data.totalAll.toLocaleString() }}</p>
          <span>总任务数</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'
  import type { DistributionItem } from '@/types/browserAgent'

  const data = reactive({
    total: 0,
    totalAll: 0,
    distribution: [] as DistributionItem[]
  })

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getAdminTotalTaskVolume()
      data.total = res.data.total
      data.totalAll = res.data.totalAll
      data.distribution = res.data.distribution
    } catch (error) {
      console.error('Failed to fetch total task volume:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>
