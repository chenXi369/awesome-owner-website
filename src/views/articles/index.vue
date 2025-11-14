<template>
  <div class="articles-page">
    <!-- 导航栏 -->
    <nav class="articles-navbar">
      <div class="nav-container">
        <RouterLink to="/" class="brand-link">
          <h2 class="brand-title">辰のblog</h2>
        </RouterLink>
        <div class="nav-actions">
          <RouterLink
            to="/"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            首页
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="articles-main">
      <!-- 页面标题 -->
      <header class="page-header">
        <h1 class="page-title">文章列表</h1>
        <p class="page-description">分享技术见解与生活感悟</p>
      </header>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span class="ml-3 text-muted-foreground">正在加载文章...</span>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p class="text-lg font-medium">{{ error }}</p>
        </div>
        <Button @click="loadArticles" variant="outline"> 重新加载 </Button>
      </div>

      <!-- 文章列表 -->
      <div v-else class="articles-container">
        <!-- 文章卡片 -->
        <Card
          v-for="article in articles"
          :key="article._id"
          class="article-card group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
        >
          <RouterLink :to="`/articles/${article._id}`">
            <!-- 文章图片 -->
            <div class="article-image-wrapper">
              <div class="article-image-placeholder">
                <span class="image-icon">📝</span>
              </div>
            </div>

            <CardContent class="!p-6">
              <!-- 文章元信息 -->
              <div class="article-meta">
                <span class="text-sm text-muted-foreground">{{
                  transformArticleForDisplay(article).formattedDate
                }}</span>
                <span class="text-muted-foreground opacity-50">·</span>
                <span class="text-sm text-muted-foreground"
                  >{{ transformArticleForDisplay(article).readTime }} 分钟阅读</span
                >
              </div>

              <!-- 文章标题 -->
              <CardTitle class="mb-3 mt-2">{{ article.title }}</CardTitle>

              <!-- 文章摘要 -->
              <CardDescription class="mb-4 line-clamp-3">
                <div v-html="transformArticleForDisplay(article).excerpt"></div>
              </CardDescription>

              <!-- 文章标签 -->
              <div class="mb-4 flex flex-wrap gap-2">
                <Badge
                  v-for="tag in transformArticleForDisplay(article).tags"
                  :key="tag"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ tag }}
                </Badge>
              </div>

              <!-- 文章底部信息 -->
              <CardFooter class="flex items-center justify-between border-t pt-4 px-0">
                <div class="flex items-center gap-3">
                  <Avatar class="h-8 w-8">
                    <AvatarFallback
                      class="bg-gradient-to-br from-primary to-accent-foreground text-white"
                    >
                      辰
                    </AvatarFallback>
                  </Avatar>
                  <span class="text-sm font-medium">{{
                    transformArticleForDisplay(article).author
                  }}</span>
                </div>
                <RouterLink :to="`/articles/${article._id}`">
                  <Button variant="ghost" size="sm" class="text-primary">
                    阅读更多
                    <span class="ml-1">→</span>
                  </Button>
                </RouterLink>
              </CardFooter>
            </CardContent>
          </RouterLink>
        </Card>

        <!-- 空状态 -->
        <div v-if="articles.length === 0" class="col-span-full text-center py-12">
          <svg
            class="w-16 h-16 mx-auto mb-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p class="text-lg font-medium text-muted-foreground">暂无文章</p>
          <p class="text-sm text-muted-foreground mt-2">这里还没有发布任何文章</p>
        </div>
      </div>

      <!-- 分页 -->
      <div
        v-if="!isLoading && !error && articles.length > 0"
        class="flex items-center justify-center gap-4 mt-8"
      >
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.pageNumber <= 1"
          @click="handlePageChange(pagination.pageNumber - 1)"
        >
          上一页
        </Button>
        <span class="text-sm text-muted-foreground">
          第 {{ pagination.pageNumber }} 页，共 {{ pagination.totalPages }} 页
        </span>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.pageNumber >= pagination.totalPages"
          @click="handlePageChange(pagination.pageNumber + 1)"
        >
          下一页
        </Button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardFooter from '@/components/ui/CardFooter.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Avatar from '@/components/ui/Avatar.vue'
import AvatarFallback from '@/components/ui/AvatarFallback.vue'
import { useAuthStore } from '@/stores/auth'
import { ArticleService } from '@/services/article'
import type { Article } from '@/types/article'

defineOptions({
  name: 'ArticlesView',
})

const authStore = useAuthStore()
const articles = ref<Article[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const pagination = ref({
  pageSize: 10,
  pageNumber: 1,
  total: 0,
  totalPages: 0,
})

// 创建文章服务实例
const articleService = new ArticleService(authStore.envId)

// 加载文章列表
const loadArticles = async () => {
  try {
    isLoading.value = true
    error.value = null

    // 确保用户已登录
    if (!authStore.isAuthenticated) {
      await authStore.anonymousSignIn()
    }

    const response = await articleService.getArticleList({
      pageSize: pagination.value.pageSize,
      pageNumber: pagination.value.pageNumber,
      status: 'published',
    })

    articles.value = response.data.records.filter((e) => {
      return e.isLaunch
    })
    pagination.value.total = response.data.total
    pagination.value.totalPages = Math.ceil(response.data.total / pagination.value.pageSize)
  } catch (err: any) {
    console.error('加载文章失败:', err)
    error.value = err.message || '加载文章失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 分页处理
const handlePageChange = (newPageNumber: number) => {
  if (newPageNumber < 1 || newPageNumber > pagination.value.totalPages) return

  pagination.value.pageNumber = newPageNumber
  loadArticles()
}

// 转换文章数据为前端显示格式
const transformArticleForDisplay = (article: Article) => {
  // 格式化日期
  const formatDate = (timestamp?: number | string) => {
    if (!timestamp) return '未知日期'

    // 处理时间戳：如果是数字且小于1e12，认为是秒级时间戳，否则认为是毫秒级
    let date: Date
    if (typeof timestamp === 'number') {
      date = timestamp < 1e12 ? new Date(timestamp * 1000) : new Date(timestamp)
    } else {
      date = new Date(timestamp)
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) return '无效日期'

    // 格式化为年月日 时:分:秒
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
  }

  return {
    id: article._id,
    title: article.title,
    excerpt: article.content || '暂无摘要',
    date: article.updatedAt || article.publishTime,
    formattedDate: formatDate(article.updatedAt || article.publishTime),
    readTime: Math.max(1, Math.ceil((article.content?.length || 0) / 200)),
    tags: article.tags || [],
    author: article.author || '辰のblog',
  }
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped lang="less">
.articles-page {
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
}

.articles-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.dark .articles-navbar {
  background: rgba(0, 0, 0, 0.8);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-link {
  text-decoration: none;
  color: inherit;

  &:hover {
    opacity: 0.8;
  }
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, var(--primary), var(--accent-foreground));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.articles-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 4rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--foreground), var(--muted-foreground));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: 1.25rem;
  color: var(--muted-foreground);
  margin: 0;
}

.articles-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.article-card {
  overflow: hidden;
}

.article-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--muted), var(--accent));
}

.article-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--muted);
}

.image-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

// 响应式设计
@media (max-width: 768px) {
  .articles-main {
    padding: 2rem 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .articles-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .nav-container {
    padding: 1rem;
  }

  .article-image-wrapper {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .page-header {
    margin-bottom: 2rem;
  }

  .articles-container {
    gap: 1rem;
  }
}
</style>
