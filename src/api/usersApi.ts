import request from '@/utils/http'
import AppConfig from '@/config'
import { BaseResult } from '@/types/axios'
import { UserInfo } from '@/types/store'
import avatar from '@imgs/user/avatar.png'

export class UserService {
  // 模拟登录接口
  static login(options: { body: string }): Promise<BaseResult> {
    const data = JSON.parse(options.body)
    return request.post({
      url: '/api/auth/login',
      data
    })
  }

  // 获取用户信息
  static getUserInfo(): Promise<BaseResult<UserInfo>> {
    return request.get({
      url: '/api/user/info'
    })
  }
}
