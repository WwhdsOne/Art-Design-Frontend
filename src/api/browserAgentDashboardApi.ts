import request from '@/utils/http'
import { BaseResult } from '@/types/axios'
import {
  AdminSummary,
  VolumeData,
  RateData,
  TotalTaskVolume,
  TaskClassification,
  ActiveSessions,
  AnnualTaskStats,
  HotTaskItem,
  UserSummary,
  UserTaskOverview,
  UserTaskTrend,
  MessageQuery,
  MessagePageData,
  ActionItem
} from '@/types/browserAgent'

export class BrowserAgentDashboardService {
  // ===== 管理员接口 =====

  // 1.1 概览统计
  static getAdminSummary(): Promise<BaseResult<AdminSummary>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/summary'
    })
  }

  // 1.2 周任务量
  static getAdminWeeklyTaskVolume(): Promise<BaseResult<VolumeData>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/weekly-task-volume'
    })
  }

  // 1.3 周任务成功率
  static getAdminWeeklyTaskSuccessRate(): Promise<BaseResult<RateData>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/weekly-task-success-rate'
    })
  }

  // 1.4 总任务量
  static getAdminTotalTaskVolume(): Promise<BaseResult<TotalTaskVolume>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/total-task-volume'
    })
  }

  // 1.5 任务分类
  static getAdminTaskClassification(): Promise<BaseResult<TaskClassification>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/task-classification'
    })
  }

  // 1.6 周操作量
  static getAdminWeeklyOperationVolume(): Promise<BaseResult<VolumeData>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/weekly-operation-volume'
    })
  }

  // 1.7 周操作成功率
  static getAdminWeeklyOperationSuccessRate(): Promise<BaseResult<RateData>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/weekly-operation-success-rate'
    })
  }

  // 1.8 活跃会话数
  static getAdminActiveSessions(): Promise<BaseResult<ActiveSessions>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/active-sessions'
    })
  }

  // 1.9 年度任务统计
  static getAdminAnnualTaskStats(year?: number): Promise<BaseResult<AnnualTaskStats>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/annual-task-stats',
      params: { year }
    })
  }

  // 1.10 热门任务列表
  static getAdminHotTaskList(limit = 6): Promise<BaseResult<HotTaskItem[]>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/hot-task-list',
      params: { limit }
    })
  }

  // ===== 用户接口 =====

  // 2.1 用户概览统计
  static getUserSummary(): Promise<BaseResult<UserSummary>> {
    return request.get({
      url: '/api/browser-agent/dashboard/user/summary'
    })
  }

  // 2.2 用户周任务量
  static getUserWeeklyTaskVolume(): Promise<BaseResult<VolumeData>> {
    return request.get({
      url: '/api/browser-agent/dashboard/user/weekly-task-volume'
    })
  }

  // 2.3 用户周任务成功率
  static getUserWeeklyTaskSuccessRate(): Promise<BaseResult<RateData>> {
    return request.get({
      url: '/api/browser-agent/dashboard/user/weekly-task-success-rate'
    })
  }

  // 2.4 用户任务概述
  static getUserTaskOverview(): Promise<BaseResult<UserTaskOverview>> {
    return request.get({
      url: '/api/browser-agent/dashboard/user/task-overview'
    })
  }

  // 2.5 用户任务趋势
  static getUserTaskTrend(year?: number): Promise<BaseResult<UserTaskTrend>> {
    return request.get({
      url: '/api/browser-agent/dashboard/user/task-trend',
      params: { year }
    })
  }

  // 3. 用户任务分页查询

  static getMessagePage(params: MessageQuery): Promise<BaseResult<MessagePageData>> {
    return request.post({
      url: '/api/browser-agent/dashboard/admin/messages',
      data: params
    })
  }

  // 4. 获取操作动作列表
  static getActions(messageId: string): Promise<BaseResult<ActionItem[]>> {
    return request.get({
      url: '/api/browser-agent/dashboard/admin/actions',
      params: { message_id: messageId }
    })
  }
}
