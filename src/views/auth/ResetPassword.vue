<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="auth-card" :loading="authStore.isLoading">
      <v-card-title class="text-center">
        <h2 class="text-h4 font-weight-bold">重置密码</h2>
      </v-card-title>
      
      <v-card-text>
        <v-form @submit.prevent="handleResetPassword">
          <!-- 重置方式选择 -->
          <v-radio-group v-model="resetType" row hide-details>
            <v-radio label="邮箱重置" value="email"></v-radio>
            <v-radio label="手机号重置" value="phone"></v-radio>
          </v-radio-group>

          <!-- 邮箱输入 -->
          <v-text-field
            v-if="resetType === 'email'"
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

          <!-- 验证码输入 -->
          <div class="d-flex align-center mt-4">
            <v-text-field
              v-model="form.verificationCode"
              label="验证码"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-shield-account"
              variant="outlined"
              class="flex-grow-1"
            ></v-text-field>
            <v-btn
              color="primary"
              variant="outlined"
              class="ml-2"
              :loading="sendingCode"
              :disabled="!canSendCode || countdown > 0"
              @click="sendVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
            </v-btn>
          </div>

          <!-- 新密码输入 -->
          <v-text-field
            v-model="form.newPassword"
            label="新密码"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.password]"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            class="mt-4"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>

          <!-- 确认新密码 -->
          <v-text-field
            v-model="form.confirmPassword"
            label="确认新密码"
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.confirmPassword]"
            prepend-inner-icon="mdi-lock-check"
            variant="outlined"
            class="mt-4"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
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

          <!-- 成功提示 -->
          <v-alert
            v-if="resetSuccess"
            type="success"
            density="compact"
            class="mt-4"
          >
            密码重置成功！请使用新密码登录。
          </v-alert>

          <!-- 操作按钮 -->
          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            class="mt-6"
            :loading="authStore.isLoading"
            :disabled="resetSuccess"
          >
            {{ resetSuccess ? '重置成功' : '重置密码' }}
          </v-btn>
        </v-form>

        <!-- 底部链接 -->
        <div class="text-center mt-4">
          <router-link to="/auth/login" class="text-decoration-none">
            返回登录
          </router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { ResetPasswordRequest, VerificationCodeRequest } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const resetType = ref<'email' | 'phone'>('email')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const resetSuccess = ref(false)

const form = reactive<ResetPasswordRequest & { confirmPassword: string }>({
  email: '',
  phone: '',
  newPassword: '',
  confirmPassword: '',
  verificationCode: ''
})

// 计算属性
const canSendCode = computed(() => {
  if (resetType.value === 'email') {
    return form.email && rules.email(form.email) === true
  } else {
    return form.phone && rules.phone(form.phone) === true
  }
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
  },
  confirmPassword: (v: string) => {
    if (!v) return true
    return v === form.newPassword || '两次输入的密码不一致'
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  sendingCode.value = true
  authStore.error = null

  try {
    const request: VerificationCodeRequest = {
      type: 'reset'
    }

    if (resetType.value === 'email') {
      request.email = form.email
    } else {
      request.phone = form.phone
    }

    const success = await authStore.sendVerificationCode(request)
    
    if (success) {
      // 开始倒计时
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  } finally {
    sendingCode.value = false
  }
}

// 处理重置密码
const handleResetPassword = async () => {
  // 清除之前的错误
  authStore.error = null

  // 构建重置密码请求
  const resetRequest: ResetPasswordRequest = {
    newPassword: form.newPassword,
    verificationCode: form.verificationCode
  }

  if (resetType.value === 'email') {
    resetRequest.email = form.email
  } else {
    resetRequest.phone = form.phone
  }

  const success = await authStore.resetPassword(resetRequest)
  
  if (success) {
    resetSuccess.value = true
    
    // 3秒后跳转到登录页
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
  }
}

// 组件挂载时初始化认证状态
onMounted(async () => {
  await authStore.initializeAuth()
})
</script>

<style scoped>
.auth-card {
  max-width: 450px;
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