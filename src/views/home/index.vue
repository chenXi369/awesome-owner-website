<template>
  <div class="relative w-full overflow-hidden rounded-lg bg-black/[0.96]">
    <div
      class="absolute flex w-full flex-col items-center justify-center gap-2 p-8 text-center font-heading text-white"
    >
      <span class="text-4xl font-semibold"> 辰辰 </span>
      <span class="font-sans font-light">Build spline animations with style.</span>
      <audio :href="musicSrc" :src="musicSrc" autoplay controls></audio>
    </div>
    <div class="flex">
      <Spline :scene="sceneUrl" class="mt-24 size-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Spline from './components/Spline.vue'

const sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
const musicSrc = ref('./blog-bg.mp3')
</script>

<style scoped>
.size-full {
  width: 100%;
  height: calc(100vh - 6rem);
}
</style>
