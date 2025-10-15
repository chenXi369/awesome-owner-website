<template>
  <div style="width: 100%; height: 100vh;">
    <h1>测试 Spline View</h1>
    <SplineView :scene="sceneUrl" style="width: 100%; height: 80vh;" />
  </div>
</template>

<script setup lang="ts">
import SplineView from './components/SplineView.vue'

const sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
</script>
