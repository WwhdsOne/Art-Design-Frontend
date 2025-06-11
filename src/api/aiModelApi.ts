import request from '@/utils/http'
import { PaginationResult } from '@/types/axios'

export class AIModelService {
  // 获取模型分页 - 直接接收 JSON 字符串
  static getPage(options: { data: string }): Promise<PaginationResult<any>> {
    return request.post({
      url: '/api/aimodel/page',
      data: options.data
    })
  }

  // 对话
  static chatCompletionStream(options: { data: string }): Promise<any> {
    return request.post({
      url: '/api/aimodel/chat-completion',
      data: options.data
    })
  }

  // 获取精简模型信息
  static getSimpleModelList(): Promise<any> {
    return request.get({
      url: '/api/aimodel/getSimpleModelList'
    })
  }
}
