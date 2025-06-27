import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

export class AIProviderService {
  // 获取供应商分页 - 直接接收 JSON 字符串
  static getPage(options: { data: string }): Promise<PaginationResult<any>> {
    return request.post({
      url: '/api/ai/provider/page',
      data: options.data
    })
  }

  // 新建供应商
  static create(options: { data: string }): Promise<BaseResult> {
    return request.post({
      url: '/api/ai/provider/create',
      data: options.data
    })
  }

  // 获取简易供应商信息用于创建模型
  static getSimpleList(): Promise<BaseResult> {
    return request.get({
      url: '/api/ai/provider/simpleList'
    })
  }
}
