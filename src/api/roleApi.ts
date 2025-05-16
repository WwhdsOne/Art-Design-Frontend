import request from '@/utils/http'
import { BaseResult } from '@/types/axios'

// 角色接口
export class RoleService {
  // 获取角色列表
  static getRolePage(options: { data: string }): Promise<BaseResult> {
    // ✅ 直接使用 options.data 字符串
    return request.post({
      url: '/api/role/page',
      data: options.data
    })
  }

  // 更新角色
  static updateRole(options: { data: string }): Promise<BaseResult> {
    // ✅ 直接使用 options.data 字符串
    return request.post({
      url: '/api/role/update',
      data: options.data
    })
  }

  // 新增角色
  static createRole(options: { data: string }): Promise<BaseResult> {
    // ✅ 直接使用 options.data 字符串
    return request.post({
      url: '/api/role/create',
      data: options.data
    })
  }

  // 根据ID删除角色
  static deleteRoleByID(options: { data: number }): Promise<BaseResult> {
    return request.post({
      url: `/api/role/delete/${options.data}` // 将 data 拼接到 URL 路径中
    })
  }
}
