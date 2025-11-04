/**
 * 腾讯云 CloudBase HTTP API 类型定义
 */

/**
 * CloudBase API 配置
 */
export interface CloudBaseConfig {
  /** 环境 ID */
  envId: string
  /** API Key */
  apiKey?: string
  /** Secret Key */
  secretKey?: string
  /** Access Token（如果已有，可跳过认证） */
  accessToken?: string
  /** 基础 URL，默认: https://api.cloudbase.cn */
  baseURL?: string
  /** 请求超时时间（毫秒），默认: 10000 */
  timeout?: number
  /** 自定义请求头 */
  headers?: Record<string, string>
}

/**
 * 必需的 CloudBase 配置
 */
export type RequiredCloudBaseConfig = Required<
  Pick<CloudBaseConfig, 'envId' | 'baseURL' | 'timeout'>
> &
  Pick<CloudBaseConfig, 'apiKey' | 'secretKey' | 'accessToken' | 'headers'>

/**
 * CloudBase API 响应结构
 */
export interface CloudBaseResponse<T = any> {
  /** 错误码，0 表示成功 */
  code?: number
  /** 错误信息 */
  message?: string
  /** 响应数据 */
  data?: T
  /** 请求 ID */
  requestId?: string
}

/**
 * 分页参数
 */
export interface PaginationParams {
  /** 每页数量 */
  pageSize?: number
  /** 页码，从 1 开始 */
  page?: number
  /** 偏移量 */
  offset?: number
  /** 限制数量 */
  limit?: number
}

/**
 * 分页响应
 */
export interface PaginationResponse<T = any> {
  /** 数据列表 */
  list: T[]
  /** 总数 */
  total: number
  /** 当前页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 查询条件
 */
export interface QueryCondition {
  /** 字段名 */
  field: string
  /** 操作符 */
  op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'exists'
  /** 值 */
  value: any
}

/**
 * 查询选项
 */
export interface QueryOptions extends PaginationParams {
  /** 查询条件 */
  where?: QueryCondition[] | Record<string, any>
  /** 排序字段 */
  orderBy?: string | { field: string; order: 'asc' | 'desc' }[]
  /** 返回字段 */
  select?: string[]
  /** 排除字段 */
  exclude?: string[]
}

/**
 * 创建数据请求
 */
export interface CreateDataRequest<T = any> {
  /** 数据内容 */
  data: T | T[]
}

/**
 * 更新数据请求
 */
export interface UpdateDataRequest<T = any> {
  /** 更新数据 */
  data: Partial<T>
  /** 更新条件（用于批量更新） */
  where?: QueryCondition[] | Record<string, any>
}

/**
 * 删除数据请求
 */
export interface DeleteDataRequest {
  /** 删除条件 */
  where?: QueryCondition[] | Record<string, any>
}

/**
 * 数据模型操作结果
 */
export interface ModelOperationResult {
  /** 影响的行数 */
  affected?: number
  /** 创建的文档 ID 列表 */
  ids?: string[]
}

/**
 * 批量操作结果
 */
export interface BatchOperationResult {
  /** 成功数量 */
  success: number
  /** 失败数量 */
  fail: number
  /** 详情 */
  details?: Array<{
    id?: string
    success: boolean
    error?: string
  }>
}

/**
 * 认证 Token 响应
 */
export interface TokenResponse {
  /** Access Token */
  accessToken: string
  /** Token 过期时间（秒） */
  expiresIn: number
  /** 过期时间戳 */
  expiresAt?: number
}
