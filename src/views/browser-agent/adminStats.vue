<template>
  <div class="ecommerce">
    <el-row :gutter="20">
      <el-col :sm="24" :md="24" :lg="16">
        <Banner />
      </el-col>
      <el-col :sm="12" :md="12" :lg="4">
        <WeeklyTaskVolume />
      </el-col>
      <el-col :sm="12" :md="12" :lg="4">
        <WeeklyTaskSuccessRate />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :sm="12" :md="12" :lg="8">
        <TotalTaskVolume />
      </el-col>
      <el-col :sm="12" :md="12" :lg="8">
        <TaskClassification />
      </el-col>
      <el-col :sm="24" :md="24" :lg="8">
        <el-row :gutter="20">
          <el-col :sm="24" :md="12" :lg="12">
            <WeeklyOperationVolume />
          </el-col>
          <el-col :sm="24" :md="12" :lg="12">
            <WeeklyOperationSuccessRate />
          </el-col>
          <el-col :span="24" class="no-margin-bottom">
            <ActiveSessions />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :sm="24" :md="12" :lg="8">
        <AnnualTaskStats />
      </el-col>
      <el-col :sm="24" :md="24" :lg="16" class="no-margin-bottom">
        <HotTaskList />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import Banner from './widget/Banner.vue'
  import TotalTaskVolume from './widget/TotalTaskVolume.vue'
  import WeeklyTaskVolume from './widget/WeeklyTaskVolume.vue'
  import WeeklyTaskSuccessRate from './widget/WeeklyTaskSuccessRate.vue'
  import TaskClassification from './widget/TaskClassification.vue'
  import AnnualTaskStats from './widget/AnnualTaskStats.vue'
  import WeeklyOperationVolume from './widget/WeeklyOperationVolume.vue'
  import WeeklyOperationSuccessRate from './widget/WeeklyOperationSuccessRate.vue'
  import ActiveSessions from './widget/ActiveSessions.vue'
  import HotTaskList from './widget/HotTaskList.vue'
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

    :deep(.icon-text-widget) {
      display: flex;
      justify-content: space-around;

      .item {
        display: flex;
        align-items: center;

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          margin-right: 10px;
          line-height: 42px;
          color: var(--main-color);
          background-color: var(--el-color-primary-light-9);
          border-radius: 8px;

          i {
            font-size: 20px;
          }
        }

        .content {
          p {
            font-size: 18px;
          }

          span {
            font-size: 14px;
          }
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
