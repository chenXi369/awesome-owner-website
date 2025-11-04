import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/AppleStyleHome.vue'),
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('@/views/articles/index.vue'),
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/articles/Detail.vue'),
  },
  // {
  //   path: '/auth',
  //   redirect: '/auth/login',
  //   children: [
  //     {
  //       path: 'login',
  //       name: 'login',
  //       component: () => import('@/views/auth/Login.vue'),
  //       meta: { requiresGuest: true },
  //     },
  //     {
  //       path: 'register',
  //       name: 'register',
  //       component: () => import('@/views/auth/Register.vue'),
  //       meta: { requiresGuest: true },
  //     },
  //     {
  //       path: 'reset-password',
  //       name: 'reset-password',
  //       component: () => import('@/views/auth/ResetPassword.vue'),
  //       meta: { requiresGuest: true },
  //     },
  //   ],
  // },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
