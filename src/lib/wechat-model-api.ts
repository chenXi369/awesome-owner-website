// lib/wechat-model-api.ts
import { WechatCloudAPI } from './wechat-cloud-api'
import type {
  WechatCloudConfig,
  QueryOptions,
  WechatResponse,
  DatabaseQueryResponse,
  DatabaseUpdateResponse,
} from '../types/wechat-cloud'

export class WechatModelAPI {
  private api: WechatCloudAPI

  constructor(config: WechatCloudConfig) {
    this.api = new WechatCloudAPI(config)
  }

  /**
   * 创建命令操作符
   */
  public cmd(command: string, value: any): Record<string, any> {
    return {
      [command]: value,
    }
  }

  /**
   * 创建文档
   */
  public async create<T = any>(
    collection: string,
    data: T,
  ): Promise<WechatResponse<DatabaseQueryResponse & { id_list: string[] }>> {
    const query = `db.collection("${collection}").add({data: ${JSON.stringify(data)}})`
    return this.api.databaseQuery<{ id_list: string[] }>(query)
  }

  /**
   * 查询文档
   */
  public async find<T = any>(
    collection: string,
    options: QueryOptions = {},
  ): Promise<WechatResponse<DatabaseQueryResponse & { data: T[] }>> {
    let query = `db.collection("${collection}")`

    // 添加查询条件
    if (options.where && Object.keys(options.where).length > 0) {
      query += `.where(${JSON.stringify(options.where)})`
    }

    // 添加排序
    if (options.orderBy) {
      const { field, order = 'asc' } = options.orderBy
      query += `.orderBy("${field}", "${order}")`
    }

    // 添加分页
    if (options.limit) {
      query += `.limit(${options.limit})`
    }

    if (options.skip) {
      query += `.skip(${options.skip})`
    }

    query += '.get()'

    return this.api.databaseQuery<DatabaseQueryResponse & { data: T[] }>(query)
  }

  /**
   * 根据ID查询单个文档
   */
  public async findById<T = any>(
    collection: string,
    id: string,
  ): Promise<WechatResponse<DatabaseQueryResponse & { data: T[] }>> {
    const query = `db.collection("${collection}").doc("${id}").get()`
    return this.api.databaseQuery<DatabaseQueryResponse & { data: T[] }>(query)
  }

  /**
   * 更新文档
   */
  public async update<T = any>(
    collection: string,
    id: string,
    data: Partial<T>,
  ): Promise<WechatResponse<DatabaseUpdateResponse>> {
    const query = `db.collection("${collection}").doc("${id}").update({data: ${JSON.stringify(data)}})`
    return this.api.databaseUpdate(query)
  }

  /**
   * 替换文档（完全替换）
   */
  public async replace<T = any>(
    collection: string,
    id: string,
    data: T,
  ): Promise<WechatResponse<DatabaseUpdateResponse>> {
    const query = `db.collection("${collection}").doc("${id}").set({data: ${JSON.stringify(data)}})`
    return this.api.databaseUpdate(query)
  }

  /**
   * 删除文档
   */
  public async delete(
    collection: string,
    id: string,
  ): Promise<WechatResponse<{ deleted: number }>> {
    const query = `db.collection("${collection}").doc("${id}").remove()`
    return this.api.databaseQuery<{ deleted: number }>(query)
  }

  /**
   * 统计文档数量
   */
  public async count(
    collection: string,
    where: Record<string, any> = {},
  ): Promise<WechatResponse<{ count: number }>> {
    let query = `db.collection("${collection}")`

    if (Object.keys(where).length > 0) {
      query += `.where(${JSON.stringify(where)})`
    }

    query += '.count()'

    return this.api.databaseQuery<{ count: number }>(query)
  }

  /**
   * 聚合查询
   */
  public async aggregate<T = any>(
    collection: string,
    pipeline: any[],
  ): Promise<WechatResponse<DatabaseQueryResponse & { data: T[] }>> {
    const query = `db.collection("${collection}").aggregate(${JSON.stringify(pipeline)}).end()`
    return this.api.databaseQuery<DatabaseQueryResponse & { data: T[] }>(query)
  }

  /**
   * 设置访问令牌
   */
  public setAccessToken(token: string): this {
    this.api.setAccessToken(token)
    return this
  }

  /**
   * 设置环境ID
   */
  public setEnv(env: string): this {
    this.api.setEnv(env)
    return this
  }
}
