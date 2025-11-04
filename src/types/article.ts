// types/article.ts

// 文章列表响应接口
export interface ArticleListResponse {
  code: number
  message: string
  data: {
    records: Article[]
    total: number
    pageSize: number
    pageNumber: number
  }
}

// 文章接口
export interface Article {
  id: string
  title: string
  content?: string
  excerpt?: string
  coverImage?: string
  tags?: string[]
  category?: string
  author?: string
  publishTime?: string
  updateTime?: string
  status?: 'published' | 'draft' | 'archived'
  readCount?: number
  likeCount?: number
  commentCount?: number
}

// 文章列表请求参数
export interface ArticleListRequest {
  pageSize?: number
  pageNumber?: number
  category?: string
  tag?: string
  keyword?: string
  status?: 'published' | 'draft' | 'archived'
}
