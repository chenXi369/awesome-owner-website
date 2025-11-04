/**
 * 认证相关类型定义
 */

/**
 * 匿名登录请求参数
 * 注意：device_id 通过请求头 X-Device-Id 传递，不需要在请求体中
 * 此类型已不再使用，保留用于文档说明
 */

/**
 * 匿名登录响应
 */
export interface AnonymousSignInResponse {
  /** Token 类型 */
  token_type: string
  /** 访问令牌 */
  access_token: string
  /** 刷新令牌 */
  refresh_token: string
  /** 过期时间（秒） */
  expires_in: number
  /** 权限范围 */
  scope: string
  /** 用户标识 */
  sub: string
  /** 用户组 */
  groups: string[]
}

/**
 * 缓存的 Token 信息
 */
export interface CachedTokenInfo {
  /** Token 类型 */
  tokenType: string
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken: string
  /** 过期时间戳 */
  expiresAt: number
  /** 权限范围 */
  scope: string
  /** 用户标识 */
  sub: string
  /** 用户组 */
  groups: string[]
  /** 缓存时间 */
  cachedAt: number
}

/**
 * 认证状态
 */
export interface AuthState {
  /** 是否已登录 */
  isAuthenticated: boolean
  /** 当前用户信息 */
  user: {
    sub: string
    groups: string[]
  } | null
  /** Token 信息 */
  token: CachedTokenInfo | null
  /** 是否正在登录 */
  isLoading: boolean
}
