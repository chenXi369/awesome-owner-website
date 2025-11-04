<template>
  <div class="apple-style-home">
    <!-- 背景保持原有的 Spline 动画 -->
    <div class="background-animation">
      <SplineView :scene="sceneUrl" class="spline-background" />
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 用户导航栏 -->
      <nav class="user-navbar">
        <div class="nav-content">
          <div class="nav-brand">
            <h2 class="brand-title">辰のblog</h2>
          </div>
          <div class="nav-actions">
            <UserNav />
          </div>
        </div>
      </nav>

      <!-- 主标题区域 -->
      <section class="hero-section animate-on-scroll">
        <div class="hero-content">
          <h1 class="main-title">辰のblog</h1>
          <div class="cta-buttons">
            <button
              class="cta-button inline-flex items-center justify-center whitespace-nowrap rounded-full border border-border bg-transparent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              @click="scrollToFeatures"
            >
              探索更多
            </button>
            <RouterLink
              to="/articles"
              class="cta-button inline-flex items-center justify-center whitespace-nowrap rounded-full border border-border bg-transparent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              查看文章
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- 特性展示区域 -->
      <section class="features-section animate-on-scroll" ref="featuresSection">
        <div class="section-header">
          <h2 class="section-title">创新特性</h2>
          <p class="section-description">体验前所未有的视觉享受</p>
        </div>

        <div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <div class="feature-card">
            <div class="feature-icon">
              <span class="inline-block h-10 w-10 rounded-full bg-white/20" />
            </div>
            <h3 class="feature-title">流畅动画</h3>
            <p class="feature-description">基于 Spline 的高性能 3D 动画引擎</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <span class="inline-block h-10 w-10 rounded-full bg-white/20" />
            </div>
            <h3 class="feature-title">精美设计</h3>
            <p class="feature-description">遵循现代设计语言，细节精致</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <span class="inline-block h-10 w-10 rounded-full bg-white/20" />
            </div>
            <h3 class="feature-title">响应式布局</h3>
            <p class="feature-description">适配各种设备，完美呈现</p>
          </div>
        </div>
      </section>

      <!-- 作品展示区域 -->
      <section class="portfolio-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">精选作品</h2>
          <p class="section-description">探索我的创意世界</p>
        </div>

        <div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="item in portfolioItems" :key="item.id" class="portfolio-card">
            <img :src="item.image" alt="" class="h-[200px] w-full object-cover" />
            <div class="p-4">
              <div class="mb-1 text-lg font-semibold">{{ item.title }}</div>
              <div class="mb-3 text-sm opacity-80">{{ item.description }}</div>
              <div class="flex justify-end">
                <button class="text-sm text-primary hover:underline">查看详情</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式区域 -->
      <section class="contact-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">联系我</h2>
          <p class="section-description">期待与您的合作</p>
        </div>

        <div class="mx-auto max-w-3xl text-center">
          <ContactDialog v-if="showContactDialog" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { RouterLink } from 'vue-router'
import UserNav from '@/components/UserNav.vue'

// 动态导入组件
const SplineView = defineAsyncComponent(() => import('./components/SplineView.vue'))
const ContactDialog = defineAsyncComponent(() => import('./components/ContactDialog.vue'))

defineOptions({
  name: 'AppleStyleHome',
})

const sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
const featuresSection = ref(null)
const showContactDialog = ref(true)

// 作品数据
const portfolioItems = ref([
  {
    id: 1,
    title: '3D 动画项目',
    description: '基于 Spline 的交互式 3D 场景',
    image: 'https://picsum.photos/seed/p1/400/200',
  },
  {
    id: 2,
    title: 'UI 设计作品',
    description: '现代化界面设计案例',
    image: 'https://picsum.photos/seed/p2/400/200',
  },
  {
    id: 3,
    title: '动态网站',
    description: '融合动画效果的响应式网站',
    image: 'https://picsum.photos/seed/p3/400/200',
  },
])

const scrollToFeatures = () => {
  if (featuresSection.value) {
    ;(featuresSection.value as HTMLElement).scrollIntoView({
      behavior: 'smooth',
    })
  }
}

onMounted(() => {
  // 初始化滚动动画
  initScrollAnimations()
})

const initScrollAnimations = () => {
  // 滚动触发动画
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    },
  )

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
}
</script>

<style scoped lang="less">
.apple-style-home {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: #000000;
}

.spline-background {
  width: 100%;
  height: 100%;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  background: transparent !important;
}

.user-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.brand-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.user-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.brand-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  color: white;
  background: transparent !important;
}

/* 调试样式，用于检查元素是否正确显示 */
* {
  /* 临时添加边框以便调试 */
  /* border: 1px solid red; */
}

.hero-content {
  max-width: 800px;
}

.main-title {
  font-size: 4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: -0.03em;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.cta-button {
  border-radius: 30px;
  font-weight: 500;
  text-transform: none;
  padding: 0 2rem;
}

.features-section,
.portfolio-section,
.contact-section {
  padding: 6rem 2rem;
  color: white;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.2rem;
  font-weight: 300;
  opacity: 0.8;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
}

.feature-icon {
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.feature-description {
  font-size: 1rem;
  font-weight: 300;
  opacity: 0.8;
}

.portfolio-card {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  color: white;
}

.contact-section {
  background: rgba(255, 255, 255, 0.1);
}

.contact-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  color: white;
}

// 响应式设计
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-section,
  .portfolio-section,
  .contact-section {
    padding: 4rem 1rem;
  }
}
</style>
