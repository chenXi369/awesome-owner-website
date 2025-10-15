<template>
  <div>
    <!-- 触发弹窗的按钮 -->
    <v-btn 
      variant="outlined" 
      color="white" 
      size="large" 
      class="contact-button"
      @click="dialog = true"
    >
      <slot name="button-text">联系我</slot>
    </v-btn>

    <!-- 联系弹窗 -->
    <v-dialog
      v-model="dialog"
      max-width="500px"
      persistent
    >
      <v-card class="contact-dialog-card">
        <v-card-title class="contact-dialog-title">
          <span>联系我</span>
          <v-btn
            icon
            @click="dialog = false"
            class="close-button"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="contactForm.name"
              label="姓名"
              outlined
              clearable
              :rules="nameRules"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="contactForm.email"
              label="邮箱"
              outlined
              clearable
              :rules="emailRules"
              required
            ></v-text-field>
            
            <v-textarea
              v-model="contactForm.message"
              label="留言"
              outlined
              rows="4"
              :rules="messageRules"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="contact-dialog-actions">
          <v-btn 
            color="primary" 
            block 
            size="large"
            :loading="sending"
            @click="submitForm"
          >
            发送消息
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const dialog = ref(false)
const formValid = ref(false)
const sending = ref(false)
const form = ref(null)

// 表单数据
const contactForm = reactive({
  name: '',
  email: '',
  message: ''
})

// 验证规则
const nameRules = [
  (v: string) => !!v || '姓名不能为空',
  (v: string) => (v && v.length <= 20) || '姓名不能超过20个字符'
]

const emailRules = [
  (v: string) => !!v || '邮箱不能为空',
  (v: string) => /.+@.+\..+/.test(v) || '邮箱格式不正确'
]

const messageRules = [
  (v: string) => !!v || '留言不能为空',
  (v: string) => (v && v.length <= 200) || '留言不能超过200个字符'
]

// 提交表单
const submitForm = async () => {
  // 这里可以添加表单验证逻辑
  if (!formValid.value) return
  
  sending.value = true
  
  // 模拟发送请求
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 重置表单
  contactForm.name = ''
  contactForm.email = ''
  contactForm.message = ''
  
  sending.value = false
  dialog.value = false
  
  // 显示成功消息
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