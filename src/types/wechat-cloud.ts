// types/wechat-cloud.ts
export interface WechatCloudConfig {
  env: string
  accessToken?: string
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

export type RequiredWechatCloudConfig = Required<WechatCloudConfig>

export interface DatabaseQueryRequest {
  env: string
  query: string
}

export interface DatabaseUpdateRequest {
  env: string
  query: string
}

export interface WechatResponse<T = any> {
  errcode?: number
  errmsg?: string
  data?: T
}

export interface DatabaseQueryResponse {
  pager?: {
    Total: number
  }
  data: any[]
}

export interface DatabaseUpdateResponse {
  matched: number
  modified: number
}

export interface CreateResult {
  _id: string
}

export interface QueryOptions {
  where?: Record<string, any>
  orderBy?: {
    field: string
    order: 'asc' | 'desc'
  }
  limit?: number
  skip?: number
}

export interface FileUploadResponse {
  url: string
  token: string
  authorization: string
  file_id: string
  cos_file_id: string
}

export interface FileDownloadRequest {
  fileid: string
  max_age: number
}

export interface CloudFunctionRequest {
  env: string
  function_name: string
  data: string
}
