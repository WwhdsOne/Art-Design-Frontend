import request from '@/utils/http'
import { PaginationResult } from '@/types/axios'

// 日志接口
export class OperationLogService {
  // 获取日志分页 - 直接接收 JSON 字符串
  static getOperationLogPage(options: { data: string }): Promise<PaginationResult<any>> {
    return request.post({
      url: '/api/operationLog/page',
      data: options.data
    })
  }
}
