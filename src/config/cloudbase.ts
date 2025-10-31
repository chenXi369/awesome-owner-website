import cloudbase from '@cloudbase/js-sdk'

// 腾讯云开发配置
export const cloudbaseConfig = {
  env: import.meta.env.VITE_CLOUDBASE_ENV_ID || 'your-env-id', // 从环境变量获取
  region: import.meta.env.VITE_CLOUDBASE_REGION || 'ap-shanghai' // 从环境变量获取
}

// 初始化云开发
export const app = cloudbase.init(cloudbaseConfig)

// 获取数据库引用
export const db = app.database()

// 获取认证实例
export const auth = app.auth()

// 用户集合名称
export const USER_COLLECTION = 'users'

// JWT token 配置
export const JWT_CONFIG = {
  secret: import.meta.env.VITE_JWT_SECRET || 'your-jwt-secret-key', // 从环境变量获取
  expiresIn: '7d'
}