<template>
  <div>
    <!-- 触发弹窗的按钮 -->
    <button
      class="contact-button inline-flex items-center justify-center whitespace-nowrap rounded-full border border-border bg-transparent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      @click="dialog = true"
    >
      <slot name="button-text">联系我</slot>
    </button>

    <!-- 联系弹窗 -->
    <div v-if="dialog" class="fixed inset-0 z-[2000] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="dialog = false" />
      <div class="contact-dialog-card relative w-[90%] max-w-[500px] rounded-2xl bg-white/10 p-0 text-white backdrop-blur-lg">
        <div class="contact-dialog-title">
          <span>联系我</span>
          <button class="close-button inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10" @click="dialog = false">✕</button>
        </div>

        <div class="px-6 pb-6">
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label class="mb-1 block text-sm opacity-90">姓名</label>
              <input v-model="contactForm.name" type="text" required
                class="block w-full rounded-md border border-border bg-transparent px-3 py-2 text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div class="mb-4">
              <label class="mb-1 block text-sm opacity-90">邮箱</label>
              <input v-model="contactForm.email" type="email" required
                class="block w-full rounded-md border border-border bg-transparent px-3 py-2 text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div class="mb-6">
              <label class="mb-1 block text-sm opacity-90">留言</label>
              <textarea v-model="contactForm.message" rows="4" required
                class="block w-full rounded-md border border-border bg-transparent px-3 py-2 text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <button type="submit" :disabled="sending"
              class="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50">
              {{ sending ? '发送中...' : '发送消息' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const dialog = ref(false)
const sending = ref(false)

// 表单数据
const contactForm = reactive({
  name: '',
  email: '',
  message: ''
})

function validate() {
  if (!contactForm.name || contactForm.name.length > 20) return false
  if (!contactForm.email || !/.+@.+\..+/.test(contactForm.email)) return false
  if (!contactForm.message || contactForm.message.length > 200) return false
  return true
}

// 提交表单
const submitForm = async () => {
  if (!validate()) return
  sending.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  contactForm.name = ''
  contactForm.email = ''
  contactForm.message = ''
  sending.value = false
  dialog.value = false
  console.log('消息已发送')
}
</script>

<style scoped lang="less">
.contact-button {
  border-radius: 30px;
  font-weight: 500;
  text-transform: none;
  padding: 0 2rem;
}

.contact-dialog-card {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  color: white;
}

.contact-dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 500;
  padding: 1rem 1.5rem;
}

.close-button {
  margin: 0;
}

.contact-dialog-actions {
  padding: 0 1.5rem 1.5rem;
}
</style>
