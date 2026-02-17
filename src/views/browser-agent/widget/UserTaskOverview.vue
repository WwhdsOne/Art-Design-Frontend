<template>
  <div class="card art-custom-card" style="height: 26rem">
    <div class="card-header">
      <p class="title">我的任务概述</p>
      <p class="subtitle">本周数据</p>
    </div>
    <div class="overview-content">
      <div class="stats-row">
        <div class="stat-item">
          <p class="value">{{ data.sessionCount }}</p>
          <span class="label">总会话数</span>
        </div>
        <div class="stat-item">
          <p class="value">{{ data.taskCount }}</p>
          <span class="label">总任务数</span>
        </div>
        <div class="stat-item">
          <p class="value">{{ data.successRate }}%</p>
          <span class="label">成功率</span>
        </div>
        <div class="stat-item">
          <p class="value">{{ data.weekGrowth }}</p>
          <span class="label">周同比</span>
        </div>
      </div>
      <BarChart
        v-if="data.chartData.data.length"
        :showAxisLabel="false"
        :showAxisLine="false"
        :showSplitLine="true"
        :data="data.chartData.data"
        :xAxisData="data.chartData.xAxis"
        barWidth="24px"
        height="10rem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive } from 'vue'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'

  const data = reactive({
    sessionCount: 0,
    taskCount: 0,
    successRate: 0,
    weekGrowth: '',
    chartData: {
      xAxis: [] as string[],
      data: [] as number[]
    }
  })

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getUserTaskOverview()
      data.sessionCount = res.data.sessionCount
      data.taskCount = res.data.taskCount
      data.successRate = res.data.successRate
      data.weekGrowth = res.data.weekGrowth
      data.chartData = res.data.chartData
    } catch (error) {
      console.error('Failed to fetch user task overview:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>

<style lang="scss" scoped>
  .overview-content {
    .stats-row {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .value {
          font-size: 24px;
          font-weight: 600;
          color: var(--art-gray-900);
        }

        .label {
          font-size: 13px;
          color: var(--art-gray-500);
        }
      }
    }
  }
</style>
