import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/AppleStyleHome.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 添加全局前置守卫，用于调试路由
router.beforeEach((to, from, next) => {
  console.log('Routing to:', to.path)
  console.log('Base URL:', import.meta.env.BASE_URL)
  next()
})

export default router
