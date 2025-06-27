import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

export class AIModelService {
  // 获取模型分页 - 直接接收 JSON 字符串
  static getPage(options: { data: string }): Promise<PaginationResult<any>> {
    return request.post({
      url: '/api/ai/model/page',
      data: options.data
    })
  }

  // 对话
  static chatCompletionStream(options: { data: string }): Promise<any> {
    return request.post({
      url: '/api/ai/model/chat-completion',
      data: options.data
    })
  }

  // 获取精简模型信息
  static getSimpleModelList(): Promise<any> {
    return request.get({
      url: '/api/ai/model/getSimpleModelList'
    })
  }

  // 新增模型
  static create(options: { data: string }): Promise<BaseResult> {
    return request.post({
      url: '/api/ai/model/create',
      data: options.data
    })
  }

  // 上传模型icon
  static uploadIcon(formData: FormData): Promise<BaseResult> {
    return request.post({
      url: '/api/ai/model/uploadIcon',
      data: formData
    })
  }
}
