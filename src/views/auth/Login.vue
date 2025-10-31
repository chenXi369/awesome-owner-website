<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="auth-card" :loading="authStore.isLoading">
      <v-card-title class="text-center">
        <h2 class="text-h4 font-weight-bold">登录</h2>
      </v-card-title>
      
      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <!-- 邮箱/手机号切换 -->
          <v-radio-group v-model="loginType" row hide-details>
            <v-radio label="邮箱登录" value="email"></v-radio>
            <v-radio label="手机号登录" value="phone"></v-radio>
          </v-radio-group>

          <!-- 邮箱输入 -->
          <v-text-field
            v-if="loginType === 'email'"
            v-model="form.email"
            label="邮箱地址"
            type="email"
            :rules="[rules.required, rules.email]"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            class="mt-4"
          ></v-text-field>

          <!-- 手机号输入 -->
          <v-text-field
            v-else
            v-model="form.phone"
            label="手机号码"
            type="tel"
            :rules="[rules.required, rules.phone]"
            prepend-inner-icon="mdi-phone"
            variant="outlined"
            class="mt-4"
          ></v-text-field>

          <!-- 密码输入 -->
          <v-text-field
            v-model="form.password"
            label="密码"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.password]"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            class="mt-4"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>

          <!-- 错误提示 -->
          <v-alert
            v-if="authStore.error"
            type="error"
            density="compact"
            class="mt-4"
          >
            {{ authStore.error }}
          </v-alert>

          <!-- 操作按钮 -->
          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            class="mt-6"
            :loading="authStore.isLoading"
          >
            登录
          </v-btn>
        </v-form>

        <!-- 底部链接 -->
        <div class="text-center mt-4">
          <router-link to="/auth/register" class="text-decoration-none">
            还没有账号？立即注册
          </router-link>
          <br>
          <router-link to="/auth/reset-password" class="text-decoration-none">
            忘记密码？
          </router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const loginType = ref<'email' | 'phone'>('email')
const showPassword = ref(false)

const form = reactive<LoginRequest>({
  email: '',
  phone: '',
  password: ''
})

// 表单验证规则
const rules = {
  required: (v: string) => !!v || '此项为必填项',
  email: (v: string) => {
    if (!v) return true
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || '请输入有效的邮箱地址'
  },
  phone: (v: string) => {
    if (!v) return true
    const pattern = /^1[3-9]\d{9}$/
    return pattern.test(v) || '请输入有效的手机号码'
  },
  password: (v: string) => {
    if (!v) return true
    return v.length >= 6 || '密码长度至少6位'
  }
}

// 处理登录
const handleLogin = async () => {
  // 清除之前的错误
  authStore.error = null

  // 构建登录请求
  const loginRequest: LoginRequest = {
    password: form.password
  }

  if (loginType.value === 'email') {
    loginRequest.email = form.email
  } else {
    loginRequest.phone = form.phone
  }

  const success = await authStore.login(loginRequest)
  
  if (success) {
    // 登录成功，跳转到首页
    router.push('/')
  }
}

// 组件挂载时初始化认证状态
onMounted(async () => {
  await authStore.initializeAuth()
  
  // 如果已经登录，跳转到首页
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.auth-card {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

.fill-height {
  min-height: 100vh;
}

@media (max-width: 600px) {
  .auth-card {
    margin: 16px;
    max-width: none;
  }
}
</style>