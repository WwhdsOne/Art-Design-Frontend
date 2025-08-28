import request from '@/utils/http'
import { BaseResult, PaginationResult } from '@/types/axios'

export class KnowledgeBaseService {
  // 获取知识库文件分页
  static getFilePage(options: { data: string }): Promise<PaginationResult<any>> {
    return request.post({
      url: '/api/knowledgeBase/file/page',
      data: options.data
    })
  }

  // 上传知识库文件
  static uploadKnowledgeBaseFile(formData: FormData): Promise<BaseResult> {
    return request.post({
      url: `/api/knowledgeBase/file/upload`,
      data: formData
    })
  }

  // 获取知识库分页
  static getKnowledgeBasePage(options: { data: string }): Promise<PaginationResult<any>> {
    return request.post({
      url: '/api/knowledgeBase/page',
      data: options.data
    })
  }

  // 新建知识库
  static create(options: { data: string }): Promise<BaseResult> {
    return request.post({
      url: '/api/knowledgeBase/create',
      data: options.data
    })
  }

  // 删除知识库
  static delete(id: string): Promise<BaseResult> {
    return request.post({
      url: `/api/knowledgeBase/delete/${id}`
    })
  }

  // 根据知识库ID获取知识库文件列表
  static getFileListByKnowledgeBaseID(id: string): Promise<PaginationResult<any>> {
    return request.get({
      url: `/api/knowledgeBase/${id}/files`
    })
  }

  static getSimpleList(): Promise<BaseResult> {
    return request.get({
      url: `/api/knowledgeBase/simpleList`
    })
  }

  static update(options: { data: string }): Promise<BaseResult> {
    return request.post({
      url: '/api/knowledgeBase/update',
      data: options.data
    })
  }
}
