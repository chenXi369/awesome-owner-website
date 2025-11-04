<template>
  <div class="relative w-full overflow-hidden rounded-lg bg-black/[0.96]">
    <div
      class="absolute flex w-full flex-col items-center justify-center gap-2 p-8 text-center font-heading text-white"
    >
      <span class="text-4xl font-semibold"> 辰のblog </span>
    </div>
    <div class="flex">
      <SplineView :scene="sceneUrl" class="mt-24 size-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 更新导入的组件名
import SplineView from './components/SplineView.vue'

// 添加组件名称
defineOptions({
  name: 'HomeView',
})

const sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
</script>

<style scoped>
.size-full {
  width: 100%;
  height: calc(100vh - 6rem);
}
</style>
