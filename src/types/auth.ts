// 用户信息接口
export interface UserInfo {
  _id?: string
  email?: string
  phone?: string
  username: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  status: 'active' | 'inactive' | 'banned'
}

// 登录请求接口
export interface LoginRequest {
  email?: string
  phone?: string
  password: string
}

// 注册请求接口
export interface RegisterRequest {
  email?: string
  phone?: string
  password: string
  username: string
  verificationCode: string
}

// 重置密码请求接口
export interface ResetPasswordRequest {
  email?: string
  phone?: string
  newPassword: string
  verificationCode: string
}

// 验证码请求接口
export interface VerificationCodeRequest {
  email?: string
  phone?: string
  type: 'register' | 'login' | 'reset'
}

// 认证响应接口
export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: UserInfo
    token: string
  }
  error?: string
}

// JWT payload 接口
export interface JWTPayload {
  userId: string
  email?: string
  phone?: string
  iat: number
  exp: number
}