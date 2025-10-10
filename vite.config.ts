import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  base: '/website/',
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 如需使用可计算样式（如 darken、lighten 等），建议开启 :cite[1]:cite[3]
        // 在这里定义全局 Less 变量
        modifyVars: {
          'primary-color': '#1DA57A', // 例如，覆盖 Ant Design 的主色 :cite[1]
          'link-color': '#1DA57A',
          'border-radius-base': '2px',
        },
        // 或者，通过 additionalData 引入全局文件
        // additionalData: `@import '@/assets/styles/variables.less';` :cite[3]
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
