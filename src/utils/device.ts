/**
 * 设备 ID 工具函数
 * 用于生成和缓存设备 ID
 */

const DEVICE_ID_KEY = 'cloudbase_device_id'

/**
 * 生成唯一设备 ID
 */
function generateDeviceId(): string {
  // 使用时间戳 + 随机数生成唯一 ID
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 15)
  const randomStr2 = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomStr}-${randomStr2}`
}

/**
 * 获取设备 ID
 * 如果缓存中不存在，则生成新的并缓存
 */
export function getDeviceId(): string {
  try {
    // 尝试从 localStorage 读取
    const cachedId = localStorage.getItem(DEVICE_ID_KEY)
    if (cachedId) {
      return cachedId
    }

    // 生成新的设备 ID
    const deviceId = generateDeviceId()

    // 缓存到 localStorage
    localStorage.setItem(DEVICE_ID_KEY, deviceId)

    return deviceId
  } catch {
    // 如果 localStorage 不可用，使用 sessionStorage
    try {
      const cachedId = sessionStorage.getItem(DEVICE_ID_KEY)
      if (cachedId) {
        return cachedId
      }

      const deviceId = generateDeviceId()
      sessionStorage.setItem(DEVICE_ID_KEY, deviceId)
      return deviceId
    } catch {
      // 如果都不可用，返回一个基于时间戳的临时 ID
      console.warn('无法使用存储，使用临时设备 ID')
      return generateDeviceId()
    }
  }
}

/**
 * 清除设备 ID（用于测试或重置）
 */
export function clearDeviceId(): void {
  try {
    localStorage.removeItem(DEVICE_ID_KEY)
    sessionStorage.removeItem(DEVICE_ID_KEY)
  } catch (error) {
    console.error('清除设备 ID 失败:', error)
  }
}
