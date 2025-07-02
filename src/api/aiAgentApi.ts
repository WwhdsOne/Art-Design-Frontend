import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

export class AIAgentService {
  // 获取模型分页 - 直接接收 JSON 字符串
  static getPage(options: { data: string }): Promise<PaginationResult<any>> {
    return request.post({
      url: '/api/ai/agent/page',
      data: options.data
    })
  }

  // 新增智能体
  static create(options: { data: string }): Promise<BaseResult> {
    return request.post({
      url: '/api/ai/agent/create',
      data: options.data
    })
  }

  // 上传智能体文件
  static uploadAgentDocument(formData: FormData, agentId: string): Promise<BaseResult> {
    return request.post({
      url: `/api/ai/agent//uploadAgentDocument/${agentId}`,
      data: formData
    })
  }

  // 获取精简智能体信息
  static getSimpleAgentList(): Promise<any> {
    return request.get({
      url: '/api/ai/agent/simpleList'
    })
  }
}
