<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="auth-card" :loading="authStore.isLoading">
      <v-card-title class="text-center">
        <h2 class="text-h4 font-weight-bold">注册账号</h2>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleRegister">
          <!-- 注册方式选择 -->
          <v-radio-group v-model="registerType" row hide-details>
            <v-radio label="邮箱注册" value="email"></v-radio>
            <v-radio label="手机号注册" value="phone"></v-radio>
          </v-radio-group>

          <!-- 用户名输入 -->
          <v-text-field
            v-model="form.username"
            label="用户名"
            :rules="[rules.required, rules.username]"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            class="mt-4"
          ></v-text-field>

          <!-- 邮箱输入 -->
          <v-text-field
            v-if="registerType === 'email'"
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

          <!-- 确认密码 -->
          <v-text-field
            v-model="form.confirmPassword"
            label="确认密码"
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.confirmPassword]"
            prepend-inner-icon="mdi-lock-check"
            variant="outlined"
            class="mt-4"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
          ></v-text-field>

          <!-- 错误提示 -->
          <v-alert v-if="authStore.error" type="error" density="compact" class="mt-4">
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
            注册
          </v-btn>
        </v-form>

        <!-- 底部链接 -->
        <div class="text-center mt-4">
          <router-link to="/auth/login" class="text-decoration-none">
            已有账号？立即登录
          </router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 表单数据
const registerType = ref<'email' | 'phone'>('email')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
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
