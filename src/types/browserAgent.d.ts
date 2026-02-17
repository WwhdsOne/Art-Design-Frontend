// ===== 管理员接口类型 =====

// 1.1 概览统计
export interface AdminSummary {
  todayTasks: number
  todayGrowth: string
  successRate: number
  successGrowth: string
}

// 1.2 周任务量 / 1.6 周操作量 / 2.2 用户周任务量
export interface VolumeData {
  volume: number
  growth: string
  chartData: number[]
}

// 1.3 周任务成功率 / 1.7 周操作成功率 / 2.3 用户周任务成功率
export interface RateData {
  rate: number
  growth: string
  chartData: number[]
}

// 1.4 总任务量
export interface TotalTaskVolume {
  total: number
  totalAll: number
  distribution: DistributionItem[]
}

export interface DistributionItem {
  value: number
  name: string
}

// 1.5 任务分类
export interface TaskClassification {
  distribution: DistributionItem[]
}

// 1.8 活跃会话数
export interface ActiveSessions {
  count: number
  growth: string
  chartData: number[]
}

// 1.9 年度任务统计
export interface AnnualTaskStats {
  year: number
  monthlyData: number[]
  quarterData: number[]
}

// 1.10 热门任务列表
export interface HotTaskItem {
  name: string
  category: string
  avgTime: number
  execCount: number
  successRate: number
  color: string
}

// ===== 用户接口类型 =====

// 2.1 用户概览统计
export interface UserSummary {
  sessionCount: number
  sessionGrowth: string
  successRate: number
  successGrowth: string
}

// 2.4 用户任务概述
export interface UserTaskOverview {
  sessionCount: number
  taskCount: number
  successRate: number
  weekGrowth: string
  chartData: {
    xAxis: string[]
    data: number[]
  }
}

// 2.5 用户任务趋势
export interface UserTaskTrend {
  year: number
  growth: string
  monthlyData: number[]
}
