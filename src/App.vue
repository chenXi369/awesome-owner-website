<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  // 初始化认证状态
  await authStore.initializeAuth()
  
  // 初始化动画效果
  initAnimations()
})

const initAnimations = () => {
  // 检查是否支持 Intersection Observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    )

    // 观察所有需要动画的元素
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })
  }
}
</script>

<template>
  <v-app style="background: transparent !important">
    <v-main style="background: transparent !important">
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped lang="less">
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
}

.animate-in {
  opacity: 1;
  transform: translateY(0);
}
</style>
