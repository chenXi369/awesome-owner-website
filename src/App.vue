<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  // 初始化动画效果
  initAnimations()

  // 匿名登录
  await handleAnonymousLogin()
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

/**
 * 处理匿名登录
 */
const handleAnonymousLogin = async () => {
  try {
    // 检查是否已登录
    if (authStore.isAuthenticated) {
      // 如果 Token 即将过期，尝试刷新
      if (authStore.isTokenExpired()) {
        await authStore.autoRefreshToken()
      }
      return
    }

    // 检查环境 ID 是否设置
    if (!authStore.envId) {
      console.warn('⚠️ 环境 ID 未设置，无法进行匿名登录')
      // 你可以在这里设置环境 ID，例如：
      // authStore.setEnvId('your-env-id')
      return
    }

    // 执行匿名登录
    await authStore.anonymousSignIn()
  } catch (error) {
    console.error('❌ 匿名登录失败:', error)
    // 这里可以根据需要处理错误，例如显示错误提示
  }
}
</script>

<template>
  <div class="transparent-background">
    <main class="transparent-background">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="less">
.transparent-background {
  background: transparent;
}
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
