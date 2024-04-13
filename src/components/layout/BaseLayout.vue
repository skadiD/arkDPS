<template>
  <Tools />
  <main class="overflow-x-hidden h-screen w-full flex flex-col">
    <Header />
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="absolute bottom-2 right-0 left-0 text-center opacity-40">arkATK - skadiD © 2024</div>

    <div class="drawer-content flex-1 mx-4 mb-4">
      <router-view />
    </div>
    <div class="drawer-side z-50">
      <label for="drawer" class="drawer-overlay" />
      <div class="menu p-4 w-72 h-dvh bg-base-100 text-base-content flex flex-col flex-nowrap items-center">
        <span class="text-3xl text-center font-bold">明日方舟<br>集成战略计算器</span>
        <div class="divider my-2" />
        <ul class="w-full text-lg space-y-2">
          <li><router-link to="/" :class="{'bg-info': router.currentRoute.value.name === '首页'}">首页</router-link></li>
        </ul>
        <div class="flex flex-1" />
        <div class="text-white/50">
          <p>思路构建：@异端Mogeko 桑</p>
          <p>精神支柱：@qwerdvd、@hanyuwei70</p>
          <p>最终攻克：@skadiD</p>
          <p>构建版本：202404070247</p>
        </div>
       <button class="btn btn-info btn-block btn-outline">Github</button>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
  import Header from "./Header.vue";
  import Tools from "./Tools.vue";
  import {useRouter} from "vue-router";

  const router = useRouter()
</script>
