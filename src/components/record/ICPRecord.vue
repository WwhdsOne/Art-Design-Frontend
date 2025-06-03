<template>
  <div class="record-footer">
    <a target="_blank" :href="recordLink" class="record-link">
      {{ record }}
    </a>
    &nbsp; {{ `© ${year} ${author}` }}
  </div>
</template>

<script setup lang="ts">
  const year = new Date().getFullYear()
  const author = 'Wwhds'
  const record = '京ICP备2025120689号-1'
  const recordLink = 'https://beian.miit.gov.cn/'
</script>

<style scoped>
  .record-footer {
    padding: 10px 0;
    color: #5c6b77;
    text-align: center;
    background-color: var(--art-main-bg-color);
  }

  .record-link {
    color: #5c6b77;
  }
</style>
