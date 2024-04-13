<template>
  <Docker />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <BrowserInfo />
</template>
<script setup lang="ts">
  import Docker from "./components/toast/Docker.vue";
  import BrowserInfo from "./components/toast/BrowserInfo.vue";
</script>