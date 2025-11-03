// lib/wechat-cloud-api.ts
import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type {
  WechatCloudConfig,
  RequiredWechatCloudConfig,
  WechatResponse,
  DatabaseQueryRequest,
  DatabaseUpdateRequest,
  DatabaseQueryResponse,
  DatabaseUpdateResponse,
  FileUploadResponse,
  FileDownloadRequest,
  CloudFunctionRequest,
} from '../types/wechat-cloud'

export class WechatCloudAPI {
  private instance: AxiosInstance
  private config: RequiredWechatCloudConfig

  constructor(options: WechatCloudConfig) {
    this.config = {
      baseURL: 'https://api.weixin.qq.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      ...options,
    } as RequiredWechatCloudConfig

    this.instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })

    this.setupInterceptors()
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(`🚀 发送 ${config.method?.toUpperCase()} 请求到: ${config.url}`)

        // 添加 access_token 参数
        if (
          this.config.accessToken &&
          (config.url?.includes('database') || config.url?.includes('dbfile'))
        ) {
          config.params = {
            ...config.params,
            access_token: this.config.accessToken,
          }
        }

        return config
      },
      (error: any) => {
        console.error('❌ 请求拦截器错误:', error)
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('✅ 请求成功:', response.status)
        return response
      },
      (error: any) => {
        console.error('❌ 响应拦截器错误:', error)
        return Promise.reject(error)
      },
    )
  }

  /**
   * 处理响应数据
   */
  private handleResponse<T>(response: AxiosResponse): WechatResponse<T> {
    const data: WechatResponse<T> = response.data

    // 检查微信 API 错误码
    if (data.errcode && data.errcode !== 0) {
      throw new Error(`微信云API错误: ${data.errmsg} (${data.errcode})`)
    }

    return data
  }

  /**
   * 处理错误
   */
  private handleError(error: any): never {
    if (error.response) {
      // 服务器返回错误状态码
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`)
    } else if (error.request) {
      // 请求发送失败
      throw new Error('网络错误，请检查网络连接')
    } else {
      // 其他错误
      throw new Error(error.message)
    }
  }

  /**
   * 设置访问令牌
   */
  public setAccessToken(token: string): this {
    this.config.accessToken = token
    return this
  }

  /**
   * 设置环境ID
   */
  public setEnv(env: string): this {
    this.config.env = env
    return this
  }

  /**
   * 数据库查询
   */
  public async databaseQuery<T = any>(
    query: string,
  ): Promise<WechatResponse<DatabaseQueryResponse & T>> {
    const request: DatabaseQueryRequest = {
      env: this.config.env,
      query,
    }

    const response = await this.instance.post('/tcb/databasequery', request)
    return this.handleResponse<DatabaseQueryResponse & T>(response)
  }

  /**
   * 数据库更新
   */
  public async databaseUpdate(query: string): Promise<WechatResponse<DatabaseUpdateResponse>> {
    const request: DatabaseUpdateRequest = {
      env: this.config.env,
      query,
    }

    const response = await this.instance.post('/tcb/databaseupdate', request)
    return this.handleResponse<DatabaseUpdateResponse>(response)
  }

  /**
   * 获取访问令牌
   */
  public async getAccessToken(
    appId: string,
    appSecret: string,
  ): Promise<WechatResponse<{ access_token: string; expires_in: number }>> {
    return this.instance.get('/cgi-bin/token', {
      params: {
        grant_type: 'client_credential',
        appid: appId,
        secret: appSecret,
      },
    })
  }

  /**
   * 上传文件
   */
  public async uploadFile(cloudPath: string): Promise<WechatResponse<FileUploadResponse>> {
    return this.instance.post('/tcb/uploadfile', {
      env: this.config.env,
      path: cloudPath,
    })
  }

  /**
   * 批量下载文件
   */
  public async batchDownloadFile(
    fileList: FileDownloadRequest[],
  ): Promise<
    WechatResponse<{ file_list: Array<{ fileid: string; download_url: string; status: number }> }>
  > {
    return this.instance.post('/tcb/batchdownloadfile', {
      env: this.config.env,
      file_list: fileList,
    })
  }

  /**
   * 调用云函数
   */
  public async invokeCloudFunction<T = any>(
    functionName: string,
    data: any,
  ): Promise<WechatResponse<{ resp_data: string } & T>> {
    const request: CloudFunctionRequest = {
      env: this.config.env,
      function_name: functionName,
      data: JSON.stringify(data),
    }

    return this.instance.post('/tcb/invokecloudfunction', request)
  }

  /**
   * 获取数据库迁移状态
   */
  public async getDatabaseMigrateStatus(
    jobId: number,
  ): Promise<WechatResponse<{ status: string; record_success: number; record_fail: number }>> {
    return this.instance.post('/tcb/databasemigratequery', {
      env: this.config.env,
      job_id: jobId,
    })
  }
}
