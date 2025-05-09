import request from '@/utils/http'
import { BaseResult } from '@/types/axios'
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
}
