/**
 * 认证服务
 * 处理匿名登录等认证相关操作
 */
import axios from 'axios'
import type { AxiosError } from 'axios'
import type { AnonymousSignInResponse } from '../types/auth'

/**
 * 认证服务类
 */
export class AuthService {
  private baseURL: string

  constructor(envId: string) {
    // 构建 CloudBase Gateway API 地址
    this.baseURL = `https://${envId}.api.tcloudbasegateway.com`
  }

  /**
   * 匿名登录
   * @param deviceId 设备 ID
   */
  async anonymousSignIn(deviceId: string): Promise<AnonymousSignInResponse> {
    try {
      const response = await axios.post<AnonymousSignInResponse>(
        `${this.baseURL}/auth/v1/signin/anonymously`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Device-Id': deviceId,
          },
        },
      )

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>

      if (axiosError.response) {
        const status = axiosError.response.status
        const data = axiosError.response.data
        const message = data?.message || data?.error || `HTTP ${status} 错误`
        throw new Error(`匿名登录失败: ${message}`)
      } else if (axiosError.request) {
        throw new Error('网络错误，请检查网络连接')
      } else {
        throw new Error(`匿名登录失败: ${axiosError.message}`)
      }
    }
  }

  /**
   * 刷新 Token
   * @param refreshToken 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<AnonymousSignInResponse> {
    try {
      const response = await axios.post<AnonymousSignInResponse>(
        `${this.baseURL}/auth/v1/token/refresh`,
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>

      if (axiosError.response) {
        const status = axiosError.response.status
        const data = axiosError.response.data
        const message = data?.message || data?.error || `HTTP ${status} 错误`
        throw new Error(`刷新 Token 失败: ${message}`)
      } else if (axiosError.request) {
        throw new Error('网络错误，请检查网络连接')
      } else {
        throw new Error(`刷新 Token 失败: ${axiosError.message}`)
      }
    }
  }
}
