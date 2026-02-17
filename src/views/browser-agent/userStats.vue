<template>
  <div class="ecommerce">
    <el-row :gutter="20">
      <el-col :sm="24" :md="24" :lg="16">
        <UserBanner />
      </el-col>
      <el-col :sm="12" :md="12" :lg="4">
        <UserWeeklyTaskVolume />
      </el-col>
      <el-col :sm="12" :md="12" :lg="4">
        <UserWeeklyTaskSuccessRate />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :sm="24" :md="24" :lg="12">
        <UserTaskOverview />
      </el-col>
      <el-col :sm="24" :md="24" :lg="12" class="no-margin-bottom">
        <UserTaskTrend />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import UserBanner from './widget/UserBanner.vue'
  import UserWeeklyTaskVolume from './widget/UserWeeklyTaskVolume.vue'
  import UserWeeklyTaskSuccessRate from './widget/UserWeeklyTaskSuccessRate.vue'
  import UserTaskOverview from './widget/UserTaskOverview.vue'
  import UserTaskTrend from './widget/UserTaskTrend.vue'
</script>

<style lang="scss" scoped>
  .ecommerce {
    :deep(.card) {
      box-sizing: border-box;
      padding: 20px;
      background-color: var(--art-main-bg-color);
      border-radius: var(--custom-radius);

      .card-header {
        padding-bottom: 15px;

        .title {
          font-size: 18px;
          font-weight: 500;
          color: var(--art-gray-900);

          i {
            margin-left: 10px;
          }
        }

        .subtitle {
          font-size: 14px;
          color: var(--art-gray-500);
        }
      }
    }

    .no-margin-bottom {
      margin-bottom: 0 !important;
    }

    .el-col {
      margin-bottom: 20px;
    }
  }
</style>
