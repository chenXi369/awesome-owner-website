// services/article.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import type { ArticleListResponse, ArticleListRequest, Article } from '@/types/article'

/**
 * 文章服务类
 * 用于调用文章相关的 API 接口
 */
export class ArticleService {
  private baseURL: string
  private modelName: string

  constructor(envId: string, modelName: string = 'blog_tpl_post') {
    this.modelName = modelName
    this.baseURL = `https://${envId}.api.tcloudbasegateway.com/v1/model/prod`
  }

  /**
   * 获取文章列表
   */
  async getArticleList(params: ArticleListRequest = {}): Promise<ArticleListResponse> {
    const authStore = useAuthStore()

    // 确保有有效的 token
    await authStore.autoRefreshToken()

    if (!authStore.token?.accessToken) {
      throw new Error('未找到有效的访问令牌，请先登录')
    }

    const url = `${this.baseURL}/${this.modelName}/list`

    try {
      const response = await axios.get(url, {
        params: {
          pageSize: params.pageSize || 10,
          pageNumber: params.pageNumber || 1,
          ...(params.category && { category: params.category }),
          ...(params.tag && { tag: params.tag }),
          ...(params.keyword && { keyword: params.keyword }),
          ...(params.status && { status: params.status }),
        },
        headers: {
          Authorization: `Bearer ${authStore.token.accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })

      return response.data
    } catch (error: any) {
      console.error('获取文章列表失败:', error)

      if (error.response) {
        // 服务器返回错误状态码
        throw new Error(
          `HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`,
        )
      } else if (error.request) {
        // 请求发送失败
        throw new Error('网络错误，请检查网络连接')
      } else {
        // 其他错误
        throw new Error(error.message || '获取文章列表失败')
      }
    }
  }

  /**
   * 获取单个文章详情
   */
  async getArticleById(id: string): Promise<Article> {
    const authStore = useAuthStore()

    // 确保有有效的 token
    await authStore.autoRefreshToken()

    if (!authStore.token?.accessToken) {
      throw new Error('未找到有效的访问令牌，请先登录')
    }

    const url = `${this.baseURL}/${this.modelName}/${id}/get`

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authStore.token.accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      })

      return response.data.data.record
    } catch (error: any) {
      console.error('获取文章详情失败:', error)

      if (error.response) {
        throw new Error(
          `HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`,
        )
      } else if (error.request) {
        throw new Error('网络错误，请检查网络连接')
      } else {
        throw new Error(error.message || '获取文章详情失败')
      }
    }
  }

  /**
   * 转换 API 返回的文章数据为前端需要的格式
   */
  transformArticleData(article: Article): any {
    return {
      id: article._id,
      title: article.title,
      excerpt: article.excerpt || article.content?.substring(0, 150) + '...' || '暂无摘要',
      date: article.publishTime
        ? new Date(article.publishTime).toISOString().split('T')[0]
        : '未知日期',
      readTime: this.calculateReadTime(article.content || ''),
      tags: article.tags || [],
      coverImage: article.coverImage,
      author: article.author || '辰のblog',
    }
  }

  /**
   * 计算阅读时间（基于字数估算）
   */
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200 // 平均每分钟阅读字数
    const wordCount = content.length
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  }
}
