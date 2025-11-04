/**
 * 腾讯云 CloudBase HTTP API 封装
 * 基于 axios 的二次封装，提供通用的 HTTP 请求能力
 */
import axios, { AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type {
  CloudBaseConfig,
  RequiredCloudBaseConfig,
  CloudBaseResponse,
  TokenResponse,
} from '../types/cloudbase'

/**
 * CloudBase HTTP API 客户端
 */
export class CloudBaseAPI {
  private instance: AxiosInstance
  private config: RequiredCloudBaseConfig
  private tokenCache: {
    token: string
    expiresAt: number
  } | null = null

  constructor(options: CloudBaseConfig) {
    // 合并配置
    this.config = {
      baseURL: 'https://api.cloudbase.cn',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    } as RequiredCloudBaseConfig

    // 创建 axios 实例
    this.instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })

    // 设置拦截器
    this.setupInterceptors()
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // 添加认证 Token
        const token = await this.getAccessToken()
        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
        }

        // 添加环境 ID
        if (this.config.envId) {
          config.headers = config.headers || {}
          config.headers['X-CloudBase-EnvId'] = this.config.envId
        }

        // 添加 API Key（如果使用 API Key 认证）
        if (this.config.apiKey && !token) {
          config.headers = config.headers || {}
          config.headers['X-CloudBase-API-Key'] = this.config.apiKey
        }

        return config
      },
      (error: AxiosError) => {
        console.error('❌ 请求拦截器错误:', error)
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 统一处理响应数据
        const data = response.data as CloudBaseResponse

        // 检查业务错误码
        if (data.code !== undefined && data.code !== 0) {
          const error = new Error(data.message || `API 错误: ${data.code}`)
          ;(error as any).code = data.code
          ;(error as any).requestId = data.requestId
          return Promise.reject(error)
        }

        return response
      },
      (error: AxiosError) => {
        // 处理 HTTP 错误
        if (error.response) {
          const status = error.response.status
          const data = error.response.data as any

          const errorMessage = data?.message || data?.error || error.response.statusText
          const errorCode = data?.code || status

          const apiError = new Error(`HTTP ${status}: ${errorMessage}`) as Error & {
            code: number
            requestId?: string
          }
          apiError.code = errorCode
          apiError.requestId = data?.requestId

          // Token 过期，清除缓存
          if (status === 401) {
            this.tokenCache = null
          }

          return Promise.reject(apiError)
        } else if (error.request) {
          return Promise.reject(new Error('网络错误，请检查网络连接'))
        } else {
          return Promise.reject(error)
        }
      },
    )
  }

  /**
   * 获取 Access Token
   * 如果配置了 accessToken 直接返回，否则通过 API Key 和 Secret Key 获取
   */
  private async getAccessToken(): Promise<string | null> {
    // 如果配置了 accessToken，直接使用
    if (this.config.accessToken) {
      return this.config.accessToken
    }

    // 如果使用 API Key/Secret Key 认证
    if (this.config.apiKey && this.config.secretKey) {
      // 检查缓存
      if (this.tokenCache && this.tokenCache.expiresAt > Date.now()) {
        return this.tokenCache.token
      }

      try {
        // 获取新的 Token
        const response = await axios.post<CloudBaseResponse<TokenResponse>>(
          `${this.config.baseURL}/auth/v1/getAccessToken`,
          {
            apiKey: this.config.apiKey,
            secretKey: this.config.secretKey,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const tokenData = response.data.data
        if (tokenData?.accessToken) {
          const expiresAt = tokenData.expiresAt || Date.now() + tokenData.expiresIn * 1000
          this.tokenCache = {
            token: tokenData.accessToken,
            expiresAt,
          }
          return tokenData.accessToken
        }
      } catch (error) {
        console.error('获取 Access Token 失败:', error)
      }
    }

    return null
  }

  /**
   * 设置 Access Token
   */
  public setAccessToken(token: string): this {
    this.config.accessToken = token
    this.tokenCache = null
    return this
  }

  /**
   * 设置环境 ID
   */
  public setEnvId(envId: string): this {
    this.config.envId = envId
    return this
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<CloudBaseConfig>): this {
    Object.assign(this.config, config)
    if (config.accessToken) {
      this.tokenCache = null
    }
    return this
  }

  /**
   * GET 请求
   */
  public async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: InternalAxiosRequestConfig,
  ): Promise<CloudBaseResponse<T>> {
    const response = await this.instance.get<CloudBaseResponse<T>>(url, {
      params,
      ...config,
    })
    return response.data
  }

  /**
   * POST 请求
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ): Promise<CloudBaseResponse<T>> {
    const response = await this.instance.post<CloudBaseResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * PUT 请求
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ): Promise<CloudBaseResponse<T>> {
    const response = await this.instance.put<CloudBaseResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * PATCH 请求
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig,
  ): Promise<CloudBaseResponse<T>> {
    const response = await this.instance.patch<CloudBaseResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * DELETE 请求
   */
  public async delete<T = any>(
    url: string,
    config?: InternalAxiosRequestConfig,
  ): Promise<CloudBaseResponse<T>> {
    const response = await this.instance.delete<CloudBaseResponse<T>>(url, config)
    return response.data
  }

  /**
   * 获取原始 axios 实例（用于特殊场景）
   */
  public getInstance(): AxiosInstance {
    return this.instance
  }
}
