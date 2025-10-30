import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  base: '/website-owner-website/',
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#1DA57A',
          'link-color': '#1DA57A',
          'border-radius-base': '2px',
        },
      },
    },
    // 启用 CSS 压缩
    postcss: {
      plugins: [
        // 可以添加其他 PostCSS 插件
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 构建优化配置
  build: {
    // 启用压缩
    minify: 'esbuild',
    // 启用 CSS 压缩
    cssMinify: true,
    // 分块策略优化
    rollupOptions: {
      output: {
        // 分割 chunks
        manualChunks: {
          // 将 Vue 相关库打包到一个 chunk
          vue: ['vue', 'vue-router', 'pinia'],
          // 将 UI 库打包到一个 chunk
          ui: ['vuetify'],
          // 将 Spline 相关库打包到一个 chunk
          spline: ['@splinetool/runtime'],
          // 将 Material Design Icons 打包到一个 chunk
          mdi: ['@mdi/font/css/materialdesignicons.css'],
        },
      },
    },
    // 禁用 sourcemap 以减小体积
    sourcemap: false,
    // 设置 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
    // 启用模块预加载
    modulePreload: true,
  },
  // 预加载优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vuetify', '@vueuse/core', '@splinetool/runtime'],
    // 排除某些依赖以避免重复打包
    exclude: ['@mdi/font'],
  },
})
