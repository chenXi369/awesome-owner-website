/**
 * 认证 Store
 * 管理用户认证状态和 Token
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDeviceId } from '../utils/device'
import { AuthService } from '../services/auth'
import type { CachedTokenInfo, AuthState } from '../types/auth'

const TOKEN_CACHE_KEY = 'cloudbase_auth_token'
// 注意：环境 ID 不应缓存到客户端，只从环境变量读取，避免信息泄露

/**
 * 从 localStorage 读取 Token
 */
function loadTokenFromCache(): CachedTokenInfo | null {
  try {
    const cached = localStorage.getItem(TOKEN_CACHE_KEY)
    if (!cached) return null

    const tokenInfo = JSON.parse(cached) as CachedTokenInfo

    // 检查是否过期
    if (tokenInfo.expiresAt && tokenInfo.expiresAt < Date.now()) {
      // Token 已过期，清除缓存
      localStorage.removeItem(TOKEN_CACHE_KEY)
      return null
    }

    return tokenInfo
  } catch (error) {
    console.error('读取 Token 缓存失败:', error)
    return null
  }
}

/**
 * 保存 Token 到 localStorage
 */
function saveTokenToCache(tokenInfo: CachedTokenInfo): void {
  try {
    localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(tokenInfo))
  } catch (error) {
    console.error('保存 Token 缓存失败:', error)
  }
}

/**
 * 清除 Token 缓存
 */
function clearTokenCache(): void {
  try {
    localStorage.removeItem(TOKEN_CACHE_KEY)
  } catch (error) {
    console.error('清除 Token 缓存失败:', error)
  }
}

/**
 * 获取环境 ID
 * 仅从环境变量读取，不缓存到客户端，避免信息泄露
 * 注意：环境 ID 是敏感信息，不应存储在 localStorage 或其他客户端存储中
 */
function getEnvId(): string {
  // 只从环境变量读取（需要在 .env 文件中设置 VITE_CLOUDBASE_ENV_ID）
  const envIdFromEnv = import.meta.env.VITE_CLOUDBASE_ENV_ID

  // 清除可能存在的旧缓存（安全措施）
  try {
    localStorage.removeItem('cloudbase_env_id')
  } catch {
    // 忽略清除错误
  }

  return envIdFromEnv || ''
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const isAuthenticated = ref(false)
  const user = ref<{ sub: string; groups: string[] } | null>(null)
  const token = ref<CachedTokenInfo | null>(null)
  const isLoading = ref(false)
  const envId = ref(getEnvId())

  // 认证服务实例
  let authService: AuthService | null = null

  // 计算属性
  const authState = computed<AuthState>(() => ({
    isAuthenticated: isAuthenticated.value,
    user: user.value,
    token: token.value,
    isLoading: isLoading.value,
  }))

  /**
   * 初始化认证服务
   */
  function initAuthService() {
    if (!envId.value) {
      console.warn('环境 ID 未设置，请先设置环境 ID')
      return
    }
    authService = new AuthService(envId.value)
  }

  /**
   * 设置环境 ID
   * 注意：环境 ID 不缓存到客户端，仅用于运行时设置
   */
  function setEnvId(newEnvId: string) {
    envId.value = newEnvId
    // 不保存到 localStorage，避免信息泄露
    initAuthService()
  }

  /**
   * 将登录响应转换为缓存的 Token 信息
   */
  function transformTokenResponse(response: {
    token_type: string
    access_token: string
    refresh_token: string
    expires_in: number
    scope: string
    sub: string
    groups: string[]
  }): CachedTokenInfo {
    const now = Date.now()
    const expiresAt = now + response.expires_in * 1000

    return {
      tokenType: response.token_type,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresAt,
      scope: response.scope,
      sub: response.sub,
      groups: response.groups,
      cachedAt: now,
    }
  }

  /**
   * 更新 Token 信息
   */
  function updateToken(tokenInfo: CachedTokenInfo) {
    token.value = tokenInfo
    user.value = {
      sub: tokenInfo.sub,
      groups: tokenInfo.groups,
    }
    isAuthenticated.value = true
    saveTokenToCache(tokenInfo)
  }

  /**
   * 匿名登录
   */
  async function anonymousSignIn(): Promise<void> {
    if (!envId.value) {
      throw new Error('环境 ID 未设置，请先设置环境 ID')
    }

    if (!authService) {
      initAuthService()
    }

    if (!authService) {
      throw new Error('认证服务初始化失败')
    }

    isLoading.value = true

    try {
      // 获取设备 ID
      const deviceId = getDeviceId()

      // 调用匿名登录接口
      const response = await authService.anonymousSignIn(deviceId)

      // 转换并保存 Token
      const tokenInfo = transformTokenResponse(response)
      updateToken(tokenInfo)

      console.log('✅ 匿名登录成功', {
        sub: tokenInfo.sub,
        expiresAt: new Date(tokenInfo.expiresAt).toLocaleString(),
      })
    } catch (error) {
      console.error('❌ 匿名登录失败:', error)
      isAuthenticated.value = false
      user.value = null
      token.value = null
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 刷新 Token
   */
  async function refreshToken(): Promise<void> {
    if (!token.value) {
      throw new Error('没有可刷新的 Token')
    }

    if (!authService) {
      initAuthService()
    }

    if (!authService) {
      throw new Error('认证服务初始化失败')
    }

    try {
      const response = await authService.refreshToken(token.value.refreshToken)
      const tokenInfo = transformTokenResponse(response)
      updateToken(tokenInfo)
      console.log('✅ Token 刷新成功')
    } catch (error) {
      console.error('❌ Token 刷新失败:', error)
      // 刷新失败，清除认证状态
      logout()
      throw error
    }
  }

  /**
   * 检查 Token 是否过期
   */
  function isTokenExpired(): boolean {
    if (!token.value) return true
    // 提前 5 分钟判断为过期，用于刷新
    return token.value.expiresAt < Date.now() + 5 * 60 * 1000
  }

  /**
   * 自动刷新 Token（如果需要）
   */
  async function autoRefreshToken(): Promise<void> {
    if (isTokenExpired() && token.value) {
      try {
        await refreshToken()
      } catch (error) {
        console.error('自动刷新 Token 失败:', error)
      }
    }
  }

  /**
   * 登出
   */
  function logout(): void {
    isAuthenticated.value = false
    user.value = null
    token.value = null
    clearTokenCache()
    console.log('✅ 已登出')
  }

  /**
   * 从缓存恢复认证状态
   */
  function restoreAuth(): void {
    const cachedToken = loadTokenFromCache()
    if (cachedToken) {
      token.value = cachedToken
      user.value = {
        sub: cachedToken.sub,
        groups: cachedToken.groups,
      }
      isAuthenticated.value = true

      // 如果 Token 即将过期，尝试刷新
      if (isTokenExpired()) {
        autoRefreshToken().catch((error) => {
          console.error('恢复认证时刷新 Token 失败:', error)
          // 如果刷新失败，清除认证状态
          logout()
        })
      }
    }
  }

  // 初始化
  initAuthService()
  restoreAuth()

  return {
    // 状态
    isAuthenticated,
    user,
    token,
    isLoading,
    envId,
    authState,
    // 方法
    setEnvId,
    anonymousSignIn,
    refreshToken,
    autoRefreshToken,
    logout,
    restoreAuth,
    isTokenExpired,
  }
})
