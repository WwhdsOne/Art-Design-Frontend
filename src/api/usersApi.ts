import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'
import { UserInfo } from '@/types/store'

export class UserService {
  // 登录接口
  static login(options: { body: string }): Promise<BaseResult> {
    const data = JSON.parse(options.body)
    return request.post({
      url: '/api/auth/login',
      data
    })
  }

  // 注册接口
  static register(options: { body: string }): Promise<BaseResult> {
    const data = JSON.parse(options.body)
    return request.post({
      url: '/api/auth/register',
      data
    })
  }

  // 获取用户信息
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

  // 获取用户分页
  static getUserPage(options: { body: string }): Promise<PaginationResult<any>> {
    const data = JSON.parse(options.body)
    return request.post({
      url: '/api/user/page',
      data
    })
  }

  // 更新用户
  static updateUser(options: { body: string }): Promise<BaseResult> {
    const data = JSON.parse(options.body)
    return request.post({
      url: '/api/user/update',
      data
    })
  }

  // 更新密码
  static updatePassword(options: { body: string }): Promise<BaseResult> {
    const data = JSON.parse(options.body)
    return request.post({
      url: '/api/user/updatePassword',
      data
    })
  }

  static uploadAvatar(formData: FormData): Promise<BaseResult> {
    return request.post({
      url: '/api/user/uploadAvatar',
      data: formData // ✅ 把 formData 作为请求体
    })
  }
}
