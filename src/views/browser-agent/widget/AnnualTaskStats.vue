<template>
  <div class="card art-custom-card yearly-card" style="height: 28.2rem">
    <div class="card-header">
      <p class="title">年度任务统计</p>
      <p class="subtitle">{{ data.year }}年月度统计</p>
    </div>

    <BarChart
      v-if="data.monthlyData.length"
      :showAxisLabel="true"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="data.monthlyData"
      :xAxisData="months"
      barWidth="20px"
      height="16rem"
    />
    <div class="quarter-stats">
      <div class="quarter-item">
        <p class="value">{{ data.quarterData[0] }}</p>
        <span class="label">Q1</span>
      </div>
      <div class="quarter-item">
        <p class="value">{{ data.quarterData[1] }}</p>
        <span class="label">Q2</span>
      </div>
      <div class="quarter-item">
        <p class="value">{{ data.quarterData[2] }}</p>
        <span class="label">Q3</span>
      </div>
      <div class="quarter-item">
        <p class="value">{{ data.quarterData[3] }}</p>
        <span class="label">Q4</span>
      </div>
    </div>
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
    year: new Date().getFullYear(),
    monthlyData: [] as number[],
    quarterData: [0, 0, 0, 0]
  })

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getAdminAnnualTaskStats()
      data.year = res.data.year
      data.monthlyData = res.data.monthlyData
      data.quarterData = res.data.quarterData
    } catch (error) {
      console.error('Failed to fetch annual task stats:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>

<style lang="scss" scoped>
  .quarter-stats {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;

    .quarter-item {
      text-align: center;

      .value {
        font-size: 18px;
        font-weight: 500;
        color: var(--art-gray-900);
      }

      .label {
        font-size: 12px;
        color: var(--art-gray-500);
      }
    }
  }
</style>
