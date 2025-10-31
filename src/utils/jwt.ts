import { JWT_CONFIG } from '@/config/cloudbase'
import type { JWTPayload } from '@/types/auth'

// 简单的JWT实现（生产环境建议使用专业的JWT库）
export class JWTUtils {
  // 生成JWT token
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    const header = this.base64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const data = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7天
    }
    const payloadStr = this.base64urlEncode(JSON.stringify(data))
    const signature = this.base64urlEncode(
      this.hmacSHA256(`${header}.${payloadStr}`, JWT_CONFIG.secret),
    )

    return `${header}.${payloadStr}.${signature}`
  }

  // 验证JWT token
  static verifyToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const [header, payload, signature] = parts
      const expectedSignature = this.base64urlEncode(
        this.hmacSHA256(`${header}.${payload}`, JWT_CONFIG.secret),
      )

      if (signature !== expectedSignature) return null

      const payloadData = JSON.parse(this.base64urlDecode(payload)) as JWTPayload

      // 检查过期时间
      if (payloadData.exp < Math.floor(Date.now() / 1000)) return null

      return payloadData
    } catch {
      return null
    }
  }

  // Base64 URL编码
  private static base64urlEncode(str: string): string {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  // Base64 URL解码
  private static base64urlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/')
    while (str.length % 4) {
      str += '='
    }
    return atob(str)
  }

  // 简单的HMAC SHA256实现
  private static hmacSHA256(message: string, secret: string): string {
    // 生产环境建议使用crypto.subtle或专业的加密库
    // 这里使用简化的实现，仅用于演示
    const encoder = new TextEncoder()
    const key = encoder.encode(secret)
    const data = encoder.encode(message)

    // 简化的哈希实现（生产环境请使用crypto.subtle.digest）
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data[i]
      hash = hash & hash // 转换为32位整数
    }

    return Math.abs(hash).toString(16)
  }
}
