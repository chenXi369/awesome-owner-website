import { auth, db, USER_COLLECTION } from '@/config/cloudbase'
import { JWTUtils } from '@/utils/jwt'
import type {
  UserInfo,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerificationCodeRequest,
  AuthResponse
} from '@/types/auth'

export class AuthService {
  // 发送验证码
  static async sendVerificationCode(request: VerificationCodeRequest): Promise<AuthResponse> {
    try {
      // 检查用户是否已存在（注册时）
      if (request.type === 'register') {
        const existingUser = await this.findUserByEmailOrPhone(request.email, request.phone)
        if (existingUser) {
          return {
            success: false,
            message: request.email ? '邮箱已被注册' : '手机号已被注册'
          }
        }
      }

      // 模拟发送验证码（生产环境需要集成短信/邮件服务）
      const code = Math.random().toString().slice(2, 8)
      
      // 存储验证码到本地存储（生产环境应存储到数据库）
      const key = request.email ? `code_${request.email}` : `code_${request.phone}`
      localStorage.setItem(key, JSON.stringify({
        code,
        type: request.type,
        timestamp: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 1000 // 10分钟过期
      }))

      console.log(`验证码发送成功: ${code} (测试环境)`)
      
      return {
        success: true,
        message: '验证码发送成功'
      }
    } catch (error) {
      return {
        success: false,
        message: '验证码发送失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  // 用户注册
  static async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      // 验证验证码
      const codeValid = await this.verifyVerificationCode(
        request.email || request.phone!,
        request.verificationCode,
        'register'
      )
      
      if (!codeValid) {
        return {
          success: false,
          message: '验证码错误或已过期'
        }
      }

      // 检查用户是否已存在
      const existingUser = await this.findUserByEmailOrPhone(request.email, request.phone)
      if (existingUser) {
        return {
          success: false,
          message: request.email ? '邮箱已被注册' : '手机号已被注册'
        }
      }

      // 创建用户
      const userData: Omit<UserInfo, '_id'> = {
        username: request.username,
        email: request.email,
        phone: request.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      }

      // 使用云开发认证注册
      const authResult = await auth.signUpWithEmailAndPassword(
        request.email,
        request.password
      )

      // 存储用户信息到数据库
      const result = await db.collection(USER_COLLECTION).add(userData)
      
      const user: UserInfo = {
        ...userData,
        _id: result.id
      }

      // 生成JWT token
      const token = JWTUtils.generateToken({
        userId: result.id,
        email: request.email,
        phone: request.phone
      })

      // 清除验证码
      this.clearVerificationCode(request.email || request.phone!)

      return {
        success: true,
        message: '注册成功',
        data: { user, token }
      }
    } catch (error) {
      return {
        success: false,
        message: '注册失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  // 用户登录
  static async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      // 查找用户
      const user = await this.findUserByEmailOrPhone(request.email, request.phone)
      if (!user) {
        return {
          success: false,
          message: '用户不存在'
        }
      }

      // 使用云开发认证登录
      const loginResult = await auth.signInWithEmailAndPassword(
        request.email || request.phone!,
        request.password
      )

      // 更新最后登录时间
      await db.collection(USER_COLLECTION).doc(user._id!).update({
        lastLoginAt: new Date(),
        updatedAt: new Date()
      })

      // 生成JWT token
      const token = JWTUtils.generateToken({
        userId: user._id!,
        email: user.email,
        phone: user.phone
      })

      return {
        success: true,
        message: '登录成功',
        data: { user, token }
      }
    } catch (error) {
      return {
        success: false,
        message: '登录失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  // 重置密码
  static async resetPassword(request: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      // 验证验证码
      const codeValid = await this.verifyVerificationCode(
        request.email || request.phone!,
        request.verificationCode,
        'reset'
      )
      
      if (!codeValid) {
        return {
          success: false,
          message: '验证码错误或已过期'
        }
      }

      // 查找用户
      const user = await this.findUserByEmailOrPhone(request.email, request.phone)
      if (!user) {
        return {
          success: false,
          message: '用户不存在'
        }
      }

      // 使用云开发认证更新密码
      await auth.updatePassword(request.newPassword)

      // 清除验证码
      this.clearVerificationCode(request.email || request.phone!)

      return {
        success: true,
        message: '密码重置成功'
      }
    } catch (error) {
      return {
        success: false,
        message: '密码重置失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  // 验证token
  static async verifyToken(token: string): Promise<UserInfo | null> {
    try {
      const payload = JWTUtils.verifyToken(token)
      if (!payload) return null

      const user = await db.collection(USER_COLLECTION).doc(payload.userId).get()
      return user.data[0] as UserInfo || null
    } catch {
      return null
    }
  }

  // 根据邮箱或手机号查找用户
  private static async findUserByEmailOrPhone(email?: string, phone?: string): Promise<UserInfo | null> {
    try {
      let query = db.collection(USER_COLLECTION)
      
      if (email) {
        query = query.where({ email })
      } else if (phone) {
        query = query.where({ phone })
      } else {
        return null
      }

      const result = await query.get()
      return result.data[0] as UserInfo || null
    } catch {
      return null
    }
  }

  // 验证验证码
  private static async verifyVerificationCode(identifier: string, code: string, type: string): Promise<boolean> {
    try {
      const key = identifier.includes('@') ? `code_${identifier}` : `code_${identifier}`
      const stored = localStorage.getItem(key)
      
      if (!stored) return false
      
      const codeData = JSON.parse(stored)
      
      if (codeData.code !== code || codeData.type !== type || Date.now() > codeData.expiresAt) {
        return false
      }
      
      return true
    } catch {
      return false
    }
  }

  // 清除验证码
  private static clearVerificationCode(identifier: string): void {
    const key = identifier.includes('@') ? `code_${identifier}` : `code_${identifier}`
    localStorage.removeItem(key)
  }
}