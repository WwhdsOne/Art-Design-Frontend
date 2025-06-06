import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { UserInfo } from '@/types/store'

export class UserService {
  // 登录接口 - 直接接收 JSON 字符串
  static login(options: { data: string }): Promise<BaseResult> {
    // ✅ 直接使用 options.data 字符串
    return request.post({
      url: '/api/auth/login',
      data: options.data
    })
  }

  // 注册接口 - 直接接收 JSON 字符串
  static register(options: { data: string }): Promise<BaseResult> {
    // ✅ 直接使用 options.data 字符串
    return request.post({
      url: '/api/auth/register',
      data: options.data
    })
  }

  // 获取用户信息 - 保持不变
  static getUserInfo(): Promise<BaseResult<UserInfo>> {
    return request.get({
      url: '/api/user/info'
    })
  }

  static logout() {
    return request.post({
      url: '/api/auth/logout'
    })
  }

  // 获取用户分页 - 直接接收 JSON 字符串
  static getUserPage(options: { data: string }): Promise<PaginationResult<any>> {
    return request.post({
      url: '/api/user/page',
      data: options.data
    })
  }

  // 更新用户 - 直接接收 JSON 字符串
  static updateUser(options: { data: string }): Promise<BaseResult> {
    return request.post({
      url: '/api/user/update',
      data: options.data
    })
  }

  // 更新密码 - 直接接收 JSON 字符串
  static updatePassword(options: { data: string }): Promise<BaseResult> {
    // ✅ 直接使用 options.data 字符串
    return request.post({
      url: '/api/user/changePassword',
      data: options.data
    })
  }

  // 上传头像 - 保持不变，因为 FormData 需要特殊处理
  static uploadAvatar(formData: FormData): Promise<BaseResult> {
    // 对于 FormData，通常不需要设置 Content-Type，浏览器/Axios 会处理
    return request.post({
      url: '/api/user/uploadAvatar',
      data: formData
    })
  }

  // 重置为初始密码（使用路径参数）
  static resetPassword(options: { id: string }): Promise<BaseResult> {
    return request.post({
      url: `/api/user/resetPassword/${options.id}`
    })
  }

  // 调整用户状态
  static changeStatus(options: { data: string }): Promise<BaseResult> {
    return request.post({
      url: `/api/user/changeStatus`,
      data: options.data
    })
  }

  static getUserRole(options: { data: number }): Promise<BaseResult> {
    return request.post({
      url: `/api/user/getUserRole/${options.data}` // 将 data 拼接到 URL 路径中
    })
  }

  // 更新角色对应的菜单
  static updateUserRole(options: { data: any }): Promise<BaseResult> {
    // ✅ 直接使用 options.data 字符串
    return request.post({
      url: '/api/user/updateUserRoleBinding',
      data: options.data
    })
  }
}
