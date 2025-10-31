import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthService } from '@/services/authService'
import type { UserInfo, LoginRequest, RegisterRequest, ResetPasswordRequest, VerificationCodeRequest } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<UserInfo | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userInfo = computed(() => user.value)

  // 从本地存储加载认证状态
  const loadAuthState = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  // 保存认证状态到本地存储
  const saveAuthState = (newToken: string, newUser: UserInfo) => {
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(newUser))
    token.value = newToken
    user.value = newUser
  }

  // 清除认证状态
  const clearAuthState = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    token.value = null
    user.value = null
    error.value = null
  }

  // 发送验证码
  const sendVerificationCode = async (request: VerificationCodeRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await AuthService.sendVerificationCode(request)
      if (!result.success) {
        error.value = result.message
        return false
      }
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '发送验证码失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 用户注册
  const register = async (request: RegisterRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await AuthService.register(request)
      if (!result.success) {
        error.value = result.message
        return false
      }
      
      if (result.data) {
        saveAuthState(result.data.token, result.data.user)
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '注册失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 用户登录
  const login = async (request: LoginRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await AuthService.login(request)
      if (!result.success) {
        error.value = result.message
        return false
      }
      
      if (result.data) {
        saveAuthState(result.data.token, result.data.user)
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '登录失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 重置密码
  const resetPassword = async (request: ResetPasswordRequest) => {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await AuthService.resetPassword(request)
      if (!result.success) {
        error.value = result.message
        return false
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '密码重置失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // 用户登出
  const logout = () => {
    clearAuthState()
  }

  // 验证token
  const verifyToken = async () => {
    if (!token.value) return false
    
    try {
      const userInfo = await AuthService.verifyToken(token.value)
      if (!userInfo) {
        clearAuthState()
        return false
      }
      
      user.value = userInfo
      return true
    } catch {
      clearAuthState()
      return false
    }
  }

  // 初始化认证状态
  const initializeAuth = async () => {
    loadAuthState()
    if (token.value) {
      await verifyToken()
    }
  }

  return {
    // 状态
    user,
    token,
    isLoading,
    error,
    
    // 计算属性
    isAuthenticated,
    userInfo,
    
    // 方法
    loadAuthState,
    saveAuthState,
    clearAuthState,
    sendVerificationCode,
    register,
    login,
    resetPassword,
    logout,
    verifyToken,
    initializeAuth
  }
})