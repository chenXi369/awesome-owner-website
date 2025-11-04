<template>
  <div class="article-detail-page">
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
          <RouterLink
            to="/articles"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            文章列表
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="article-detail-main">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <span class="ml-3 text-muted-foreground text-lg">正在加载文章...</span>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="text-center py-20">
        <div class="text-red-500 mb-6">
          <svg class="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p class="text-xl font-medium mb-4">{{ error }}</p>
        </div>
        <Button @click="loadArticle" variant="outline" size="lg">重新加载</Button>
      </div>

      <!-- 文章详情 -->
      <div v-else-if="article" class="article-content">
        <!-- 文章头部 -->
        <header class="article-header">
          <!-- 返回按钮 -->
          <div class="mb-6">
            <Button
              variant="ghost"
              size="sm"
              @click="$router.back()"
              class="inline-flex items-center text-muted-foreground hover:text-foreground"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              返回
            </Button>
          </div>

          <!-- 文章标题 -->
          <h1 class="article-title">{{ article.title }}</h1>

          <!-- 文章元信息 -->
          <div class="article-meta">
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <Avatar class="h-6 w-6">
                  <AvatarFallback
                    class="bg-gradient-to-br from-primary to-accent-foreground text-white text-xs"
                  >
                    辰
                  </AvatarFallback>
                </Avatar>
                <span>{{ article.author || '辰のblog' }}</span>
              </div>
              <span class="opacity-50">•</span>
              <span>{{ formattedDate }}</span>
              <span class="opacity-50">•</span>
              <span>{{ readTime }} 分钟阅读</span>
              <span class="opacity-50">•</span>
              <span>{{ article.readCount || 0 }} 阅读</span>
            </div>
          </div>

          <!-- 文章标签 -->
          <div v-if="article.tags && article.tags.length > 0" class="article-tags mt-4">
            <Badge v-for="tag in article.tags" :key="tag" variant="secondary" class="mr-2 mb-2">
              {{ tag }}
            </Badge>
          </div>
        </header>

        <!-- 文章封面 -->
        <div v-if="article.coverImage" class="article-cover mb-8">
          <img
            :src="article.coverImage"
            :alt="article.title"
            class="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        <!-- 文章内容 -->
        <article class="article-body">
          <div v-html="article.content" class="prose prose-lg max-w-none"></div>
        </article>

        <!-- 文章底部信息 -->
        <footer class="article-footer mt-12 pt-8 border-t">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <span>发布于 {{ publishDate }}</span>
              </div>
              <span
                v-if="article.updateTime && article.updateTime !== article.publishTime"
                class="flex items-center gap-2"
              >
                <span class="opacity-50">•</span>
                <span>更新于 {{ updateDate }}</span>
              </span>
            </div>

            <!-- 互动按钮 -->
            <div class="flex items-center gap-4">
              <Button variant="ghost" size="sm" class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {{ article.likeCount || 0 }}
              </Button>
              <Button variant="ghost" size="sm" class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {{ article.commentCount || 0 }}
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Avatar from '@/components/ui/Avatar.vue'
import AvatarFallback from '@/components/ui/AvatarFallback.vue'
import { useAuthStore } from '@/stores/auth'
import { ArticleService } from '@/services/article'
import type { Article } from '@/types/article'

defineOptions({
  name: 'ArticleDetailView',
})

const route = useRoute()
const authStore = useAuthStore()

const article = ref<Article | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// 创建文章服务实例
const articleService = new ArticleService(authStore.envId)

// 计算属性
const formattedDate = computed(() => {
  if (!article.value) return '未知日期'
  return formatDate(article.value.updatedAt || article.value.publishTime)
})

const publishDate = computed(() => {
  if (!article.value?.publishTime) return '未知日期'
  return formatDate(article.value.publishTime)
})

const updateDate = computed(() => {
  if (!article.value?.updateTime) return '未知日期'
  return formatDate(article.value.updateTime)
})

const readTime = computed(() => {
  if (!article.value?.content) return 1
  return Math.max(1, Math.ceil(article.value.content.length / 200))
})

// 格式化日期函数
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

// 加载文章详情
const loadArticle = async () => {
  try {
    isLoading.value = true
    error.value = null

    const articleId = route.params.id as string
    if (!articleId) {
      throw new Error('文章ID不存在')
    }

    // 确保用户已登录
    if (!authStore.isAuthenticated) {
      await authStore.anonymousSignIn()
    }

    const articleData = await articleService.getArticleById(articleId)
    article.value = articleData
  } catch (err: any) {
    console.error('加载文章详情失败:', err)
    error.value = err.message || '加载文章失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadArticle()
})
</script>

<style scoped lang="less">
.article-detail-page {
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

.article-detail-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
}

.article-header {
  margin-bottom: 2rem;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 1rem 0;
  background: linear-gradient(135deg, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-meta {
  margin: 1.5rem 0;
}

.article-tags {
  .badge {
    background: var(--muted);
    color: var(--muted-foreground);

    &:hover {
      background: var(--accent);
      color: var(--accent-foreground);
    }
  }
}

.article-cover {
  img {
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
}

.article-body {
  line-height: 1.8;
  font-size: 1.125rem;

  :deep(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin: 2rem 0 1rem;
    color: var(--foreground);
  }

  :deep(h2) {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem;
    color: var(--foreground);
  }

  :deep(h3) {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem;
    color: var(--foreground);
  }

  :deep(p) {
    margin: 1rem 0;
    color: var(--foreground);
  }

  :deep(a) {
    color: var(--primary);
    text-decoration: underline;

    &:hover {
      color: var(--primary-foreground);
    }
  }

  :deep(blockquote) {
    border-left: 4px solid var(--primary);
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: var(--muted-foreground);
  }

  :deep(code) {
    background: var(--muted);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
  }

  :deep(pre) {
    background: var(--muted);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5rem 0;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(ul),
  :deep(ol) {
    margin: 1rem 0;
    padding-left: 2rem;
  }

  :deep(li) {
    margin: 0.5rem 0;
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5rem 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;

    th,
    td {
      border: 1px solid var(--border);
      padding: 0.75rem;
      text-align: left;
    }

    th {
      background: var(--muted);
      font-weight: 600;
    }
  }
}

.article-footer {
  border-color: var(--border);
}

// 响应式设计
@media (max-width: 768px) {
  .article-detail-main {
    padding: 1rem 1rem 2rem;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-body {
    font-size: 1rem;

    :deep(h1) {
      font-size: 1.75rem;
    }

    :deep(h2) {
      font-size: 1.5rem;
    }

    :deep(h3) {
      font-size: 1.25rem;
    }
  }

  .nav-container {
    padding: 1rem;
  }

  .article-meta {
    .flex {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

  .article-footer {
    .flex {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
  }
}

@media (max-width: 480px) {
  .article-title {
    font-size: 1.75rem;
  }

  .article-detail-main {
    padding: 0.5rem 0.5rem 1rem;
  }
}
</style>
