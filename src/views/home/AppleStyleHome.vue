<template>
  <div class="apple-style-home">
    <!-- 背景保持原有的 Spline 动画 -->
    <div class="background-animation">
      <SplineView :scene="sceneUrl" class="spline-background" />
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 主标题区域 -->
      <section class="hero-section animate-on-scroll">
        <div class="hero-content">
          <h1 class="main-title">辰辰</h1>
          <p class="subtitle">Build spline animations with style.</p>
          <div class="cta-buttons">
            <v-btn variant="outlined" color="white" size="large" class="cta-button" @click="scrollToFeatures">
              探索更多
            </v-btn>
          </div>
        </div>
      </section>

      <!-- 特性展示区域 -->
      <section class="features-section animate-on-scroll" ref="featuresSection">
        <div class="section-header">
          <h2 class="section-title">创新特性</h2>
          <p class="section-description">体验前所未有的视觉享受</p>
        </div>

        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <div class="feature-card">
                <div class="feature-icon">
                  <v-icon size="x-large" color="white">mdi-animation</v-icon>
                </div>
                <h3 class="feature-title">流畅动画</h3>
                <p class="feature-description">基于 Spline 的高性能 3D 动画引擎</p>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="feature-card">
                <div class="feature-icon">
                  <v-icon size="x-large" color="white">mdi-palette</v-icon>
                </div>
                <h3 class="feature-title">精美设计</h3>
                <p class="feature-description">遵循现代设计语言，细节精致</p>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div class="feature-card">
                <div class="feature-icon">
                  <v-icon size="x-large" color="white">mdi-responsive</v-icon>
                </div>
                <h3 class="feature-title">响应式布局</h3>
                <p class="feature-description">适配各种设备，完美呈现</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 作品展示区域 -->
      <section class="portfolio-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">精选作品</h2>
          <p class="section-description">探索我的创意世界</p>
        </div>

        <v-container>
          <v-row>
            <v-col cols="12" md="6" lg="4" v-for="item in portfolioItems" :key="item.id">
              <v-card class="portfolio-card" elevation="8">
                <v-img :src="item.image" height="200" cover></v-img>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-subtitle>{{ item.description }}</v-card-subtitle>
                <v-card-actions>
                  <v-btn color="primary" variant="text">
                    查看详情
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 联系方式区域 -->
      <section class="contact-section animate-on-scroll">
        <div class="section-header">
          <h2 class="section-title">联系我</h2>
          <p class="section-description">期待与您的合作</p>
        </div>
        
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="6" class="text-center">
              <ContactDialog />
            </v-col>
          </v-row>
        </v-container>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 保持现有的导入方式，Vue 3 script setup 会自动处理组件导出
import SplineView from './components/SplineView.vue'

defineOptions({
  name: 'AppleStyleHome',
})

const sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
const featuresSection = ref(null)

// 作品数据
const portfolioItems = ref([
  {
    id: 1,
    title: '3D 动画项目',
    description: '基于 Spline 的交互式 3D 场景',
    image: 'https://picsum.photos/seed/p1/400/200'
  },
  {
    id: 2,
    title: 'UI 设计作品',
    description: '现代化界面设计案例',
    image: 'https://picsum.photos/seed/p2/400/200'
  },
  {
    id: 3,
    title: '动态网站',
    description: '融合动画效果的响应式网站',
    image: 'https://picsum.photos/seed/p3/400/200'
  }
])

const scrollToFeatures = () => {
  if (featuresSection.value) {
    (featuresSection.value as HTMLElement).scrollIntoView({
      behavior: 'smooth'
    })
  }
}

const submitForm = () => {
  // 表单提交逻辑
  console.log('表单已提交')
}

onMounted(() => {
  // 初始化滚动动画
  initScrollAnimations()
})

const initScrollAnimations = () => {
  // 滚动触发动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  })

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;

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
