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
}
