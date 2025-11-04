/**
 * 腾讯云 CloudBase 数据模型 API 封装
 * 提供数据模型的 CRUD 操作
 */
import { CloudBaseAPI } from './cloudbase-api'
import type {
  CloudBaseConfig,
  CloudBaseResponse,
  QueryOptions,
  PaginationResponse,
  CreateDataRequest,
  UpdateDataRequest,
  DeleteDataRequest,
  ModelOperationResult,
  BatchOperationResult,
  QueryCondition,
} from '../types/cloudbase'

/**
 * 数据模型 API 客户端
 */
export class CloudBaseModelAPI {
  private api: CloudBaseAPI

  constructor(config: CloudBaseConfig) {
    this.api = new CloudBaseAPI(config)
  }

  /**
   * 构建查询条件
   */
  private buildWhereClause(where?: QueryCondition[] | Record<string, any>): any {
    if (!where) {
      return {}
    }

    // 如果是数组格式（QueryCondition[]）
    if (Array.isArray(where)) {
      const conditions: Record<string, any> = {}
      where.forEach((condition) => {
        const { field, op, value } = condition
        if (!conditions[field]) {
          conditions[field] = {}
        }
        conditions[field][op] = value
      })
      return conditions
    }

    // 如果是对象格式
    return where
  }

  /**
   * 构建排序参数
   */
  private buildOrderByClause(
    orderBy?: string | { field: string; order: 'asc' | 'desc' }[],
  ): string {
    if (!orderBy) {
      return ''
    }

    if (typeof orderBy === 'string') {
      return orderBy
    }

    return orderBy.map((item) => `${item.field} ${item.order}`).join(',')
  }

  /**
   * 构建查询参数
   */
  private buildQueryParams(options: QueryOptions = {}): Record<string, any> {
    const params: Record<string, any> = {}

    // 查询条件
    if (options.where) {
      params.where = this.buildWhereClause(options.where)
    }

    // 排序
    if (options.orderBy) {
      params.orderBy = this.buildOrderByClause(options.orderBy)
    }

    // 分页参数
    if (options.pageSize !== undefined) {
      params.pageSize = options.pageSize
    }
    if (options.page !== undefined) {
      params.page = options.page
    }
    if (options.limit !== undefined) {
      params.limit = options.limit
    }
    if (options.offset !== undefined) {
      params.offset = options.offset
    }

    // 字段选择
    if (options.select && options.select.length > 0) {
      params.select = options.select.join(',')
    }
    if (options.exclude && options.exclude.length > 0) {
      params.exclude = options.exclude.join(',')
    }

    return params
  }

  /**
   * 创建数据
   * @param modelName 数据模型名称
   * @param data 要创建的数据（可以是单个对象或数组）
   */
  public async create<T = any>(
    modelName: string,
    data: T | T[],
  ): Promise<CloudBaseResponse<ModelOperationResult & { ids?: string[] }>> {
    const request: CreateDataRequest<T> = {
      data: Array.isArray(data) ? data : [data],
    }

    return this.api.post<ModelOperationResult & { ids?: string[] }>(
      `/model/v1/${modelName}`,
      request,
    )
  }

  /**
   * 查询数据列表
   * @param modelName 数据模型名称
   * @param options 查询选项
   */
  public async find<T = any>(
    modelName: string,
    options: QueryOptions = {},
  ): Promise<CloudBaseResponse<PaginationResponse<T>>> {
    const params = this.buildQueryParams(options)
    return this.api.get<PaginationResponse<T>>(`/model/v1/${modelName}`, params)
  }

  /**
   * 根据 ID 查询单个数据
   * @param modelName 数据模型名称
   * @param id 数据 ID
   */
  public async findById<T = any>(modelName: string, id: string): Promise<CloudBaseResponse<T>> {
    return this.api.get<T>(`/model/v1/${modelName}/${id}`)
  }

  /**
   * 更新数据
   * @param modelName 数据模型名称
   * @param id 数据 ID（单个更新时）
   * @param data 更新数据
   * @param where 更新条件（批量更新时使用）
   */
  public async update<T = any>(
    modelName: string,
    idOrData: string | Partial<T>,
    data?: Partial<T>,
    where?: QueryCondition[] | Record<string, any>,
  ): Promise<CloudBaseResponse<ModelOperationResult>> {
    // 如果第一个参数是字符串，则为单个更新
    if (typeof idOrData === 'string') {
      const request: UpdateDataRequest<T> = {
        data: data || {},
      }
      return this.api.put<ModelOperationResult>(`/model/v1/${modelName}/${idOrData}`, request)
    }

    // 否则为批量更新
    const request: UpdateDataRequest<T> = {
      data: idOrData,
      where: where ? this.buildWhereClause(where) : undefined,
    }
    return this.api.put<ModelOperationResult>(`/model/v1/${modelName}`, request)
  }

  /**
   * 删除数据
   * @param modelName 数据模型名称
   * @param id 数据 ID（单个删除时）
   * @param where 删除条件（批量删除时使用）
   */
  public async delete(
    modelName: string,
    idOrWhere?: string | QueryCondition[] | Record<string, any>,
  ): Promise<CloudBaseResponse<ModelOperationResult>> {
    // 如果第一个参数是字符串，则为单个删除
    if (typeof idOrWhere === 'string') {
      return this.api.delete<ModelOperationResult>(`/model/v1/${modelName}/${idOrWhere}`)
    }

    // 否则为批量删除
    const request: DeleteDataRequest = {
      where: idOrWhere ? this.buildWhereClause(idOrWhere) : undefined,
    }
    return this.api.delete<ModelOperationResult>(`/model/v1/${modelName}`, {
      data: request,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  /**
   * 统计数量
   * @param modelName 数据模型名称
   * @param where 查询条件
   */
  public async count(
    modelName: string,
    where?: QueryCondition[] | Record<string, any>,
  ): Promise<CloudBaseResponse<{ count: number }>> {
    const params: Record<string, any> = {}
    if (where) {
      params.where = this.buildWhereClause(where)
    }
    return this.api.get<{ count: number }>(`/model/v1/${modelName}/count`, params)
  }

  /**
   * 批量创建数据
   * @param modelName 数据模型名称
   * @param dataList 数据列表
   */
  public async createBatch<T = any>(
    modelName: string,
    dataList: T[],
  ): Promise<CloudBaseResponse<ModelOperationResult & { ids?: string[] }>> {
    return this.create<T>(modelName, dataList)
  }

  /**
   * 批量更新数据
   * @param modelName 数据模型名称
   * @param data 更新数据
   * @param where 更新条件
   */
  public async updateBatch<T = any>(
    modelName: string,
    data: Partial<T>,
    where: QueryCondition[] | Record<string, any>,
  ): Promise<CloudBaseResponse<ModelOperationResult>> {
    return this.update<T>(modelName, data, undefined, where)
  }

  /**
   * 批量删除数据
   * @param modelName 数据模型名称
   * @param where 删除条件
   */
  public async deleteBatch(
    modelName: string,
    where: QueryCondition[] | Record<string, any>,
  ): Promise<CloudBaseResponse<ModelOperationResult>> {
    return this.delete(modelName, where)
  }

  /**
   * 设置 Access Token
   */
  public setAccessToken(token: string): this {
    this.api.setAccessToken(token)
    return this
  }

  /**
   * 设置环境 ID
   */
  public setEnvId(envId: string): this {
    this.api.setEnvId(envId)
    return this
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<CloudBaseConfig>): this {
    this.api.updateConfig(config)
    return this
  }

  /**
   * 获取底层的 CloudBaseAPI 实例（用于自定义请求）
   */
  public getAPI(): CloudBaseAPI {
    return this.api
  }
}
