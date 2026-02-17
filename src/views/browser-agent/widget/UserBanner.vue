<template>
  <BasicBanner
    class="banner"
    :title="`欢迎回来 ${nickname}`"
    :showButton="false"
    backgroundColor="var(--el-color-primary-light-9)"
    titleColor="var(--art-gray-900)"
    subtitleColor="#666"
    style="height: 13.3rem"
    :backgroundImage="bannerCover"
    :showDecoration="false"
    imgWidth="18rem"
    imgBottom="-7.5rem"
    @click="handleBannerClick"
  >
    <div class="banner-slot">
      <div class="item">
        <p class="title"
          >{{ data.sessionCount }}<i class="iconfont-sys text-success">&#xe8d5;</i></p
        >
        <p class="subtitle">我的会话</p>
      </div>
      <div class="item">
        <p class="title"
          >{{ data.successRate }}%<i class="iconfont-sys text-success">&#xe8d5;</i></p
        >
        <p class="subtitle">成功率</p>
      </div>
    </div>
  </BasicBanner>
</template>

<script setup lang="ts">
  import bannerCover from '@imgs/login/lf_icon2.png'
  import { useUserStore } from '@/store/modules/user'
  import { ref, onMounted, reactive } from 'vue'
  import { BrowserAgentDashboardService } from '@/api/browserAgentDashboardApi'

  const userStore = useUserStore()
  const nickname = ref(userStore.getUserInfo.nickname)
  const handleBannerClick = () => {}

  const data = reactive({
    sessionCount: 0,
    successRate: 0
  })

  const fetchData = async () => {
    try {
      const res = await BrowserAgentDashboardService.getUserSummary()
      data.sessionCount = res.data.sessionCount
      data.successRate = res.data.successRate
    } catch (error) {
      console.error('Failed to fetch user summary:', error)
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>

<style lang="scss" scoped>
  .banner {
    .banner-slot {
      display: flex;

      .item {
        margin-right: 30px;

        &:first-of-type {
          padding-right: 30px;
          border-right: 1px solid var(--art-gray-300);
        }

        .title {
          font-size: 30px;
          color: var(--art-gray-900) !important;

          i {
            position: relative;
            top: -10px;
            margin-left: 10px;
            font-size: 16px;
          }
        }

        .subtitle {
          margin-top: 4px;
          font-size: 14px;
          color: var(--art-gray-700) !important;
        }
      }
    }
  }
</style>
