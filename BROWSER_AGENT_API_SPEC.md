# Browser Agent 仪表盘后端接口文档

## 概述

本文档为后端开发提供 Browser Agent 仪表盘的完整接口规范，包含管理员和普通用户两套接口。

**基础路径**: `/api/browser-agent/dashboard`

**认证方式**: Bearer Token (所有接口需登录)

---

## 一、管理员接口

### 1.1 概览统计（Banner）

**适配组件**: `Banner.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/summary
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "todayTasks": 1286,
    "todayGrowth": "+35%",
    "successRate": 94,
    "successGrowth": "+5%"
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | todayTasks | number | 今日任务数 | | todayGrowth | string | 较昨日增长率 | | successRate | number | 成功率（百分比） | | successGrowth | string | 成功率增长 |

---

### 1.2 周任务量

**适配组件**: `WeeklyTaskVolume.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/weekly-task-volume
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "volume": 8600,
    "growth": "+12%",
    "chartData": [85, 120, 95, 140, 110, 125, 90]
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | volume | number | 周任务总量 | | growth | string | 周环比增长 | | chartData | number[] | 7天数据（周一到周日） |

---

### 1.3 周任务成功率

**适配组件**: `WeeklyTaskSuccessRate.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/weekly-task-success-rate
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "rate": 94,
    "growth": "+3%",
    "chartData": [88, 91, 89, 93, 90, 95, 94]
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | rate | number | 当前成功率（百分比） | | growth | string | 周环比增长 | | chartData | number[] | 7天成功率数据 |

---

### 1.4 总任务量

**适配组件**: `TotalTaskVolume.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/total-task-volume
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "total": 8920,
    "totalAll": 45600,
    "distribution": [
      { "value": 7500, "name": "已完成" },
      { "value": 850, "name": "进行中" },
      { "value": 570, "name": "已失败" }
    ]
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | total | number | 当前总任务量 | | totalAll | number | 历史总任务数 | | distribution | array | 状态分布数据 | | distribution[].value | number | 数量 | | distribution[].name | string | 状态名称 |

---

### 1.5 任务分类

**适配组件**: `TaskClassification.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/task-classification
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "distribution": [
      { "value": 35, "name": "电商任务" },
      { "value": 40, "name": "表单填写" },
      { "value": 25, "name": "数据采集" }
    ]
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | distribution | array | 分类分布数据 | | distribution[].value | number | 占比（百分比） | | distribution[].name | string | 分类名称 |

---

### 1.6 周操作量

**适配组件**: `WeeklyOperationVolume.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/weekly-operation-volume
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "volume": 15200,
    "growth": "+8%",
    "chartData": [120, 180, 150, 200, 170, 190, 160]
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | volume | number | 周操作总量 | | growth | string | 周环比增长 | | chartData | number[] | 7天数据 |

---

### 1.7 周操作成功率

**适配组件**: `WeeklyOperationSuccessRate.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/weekly-operation-success-rate
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "rate": 92,
    "growth": "+2%",
    "chartData": [85, 88, 86, 90, 89, 93, 92]
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | rate | number | 当前成功率（百分比） | | growth | string | 周环比增长 | | chartData | number[] | 7天成功率数据 |

---

### 1.8 活跃会话数

**适配组件**: `ActiveSessions.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/active-sessions
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "count": 1286,
    "growth": "+2.5%",
    "chartData": [95, 110, 102, 125, 98, 145, 130]
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | count | number | 活跃会话数 | | growth | string | 周环比增长 | | chartData | number[] | 7天数据 |

---

### 1.9 年度任务统计

**适配组件**: `AnnualTaskStats.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/annual-task-stats?year=2026
```

**参数** | 参数 | 类型 | 必填 | 默认值 | 说明 | |------|------|------|--------|------| | year | int | 否 | 当前年份 | 查询年份 |

**响应示例**

```json
{
  "code": 200,
  "data": {
    "year": 2026,
    "monthlyData": [580, 720, 650, 890, 780, 920, 850, 960, 880, 1020, 950, 1100],
    "quarterData": [1950, 2590, 2690, 3070]
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | year | number | 统计年份 | | monthlyData | number[] | 12个月任务数（1月-12月） | | quarterData | number[] | 4个季度任务数（Q1-Q4） |

---

### 1.10 热门任务列表

**适配组件**: `HotTaskList.vue`

**请求**

```
GET /api/browser-agent/dashboard/admin/hot-task-list?limit=6
```

**参数** | 参数 | 类型 | 必填 | 默认值 | 说明 | |------|------|------|--------|------| | limit | int | 否 | 6 | 返回条数，最大 10 |

**响应示例**

```json
{
  "code": 200,
  "data": [
    {
      "name": "淘宝搜索商品",
      "category": "电商任务",
      "avgTime": 12.5,
      "execCount": 1423,
      "successRate": 95,
      "color": "primary"
    },
    {
      "name": "自动填写表单",
      "category": "办公自动化",
      "avgTime": 8.2,
      "execCount": 892,
      "successRate": 88,
      "color": "success"
    }
  ]
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | name | string | 任务名称 | | category | string | 任务分类 | | avgTime | number | 平均耗时（秒） | | execCount | number | 执行次数 | | successRate | number | 成功率（百分比） | | color | string | 颜色类型：primary/success/warning/error/info/secondary |

---

## 二、普通用户接口

### 2.1 用户概览统计

**适配组件**: `UserBanner.vue`

**请求**

```
GET /api/browser-agent/dashboard/user/summary
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "sessionCount": 128,
    "sessionGrowth": "+10%",
    "successRate": 94,
    "successGrowth": "+3%"
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | sessionCount | number | 用户会话数 | | sessionGrowth | string | 周环比增长 | | successRate | number | 成功率 | | successGrowth | string | 成功率增长 |

---

### 2.2 用户周任务量

**适配组件**: `UserWeeklyTaskVolume.vue`

**请求**

```
GET /api/browser-agent/dashboard/user/weekly-task-volume
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "volume": 256,
    "growth": "+15%",
    "chartData": [28, 42, 35, 50, 38, 45, 32]
  }
}
```

---

### 2.3 用户周任务成功率

**适配组件**: `UserWeeklyTaskSuccessRate.vue`

**请求**

```
GET /api/browser-agent/dashboard/user/weekly-task-success-rate
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "rate": 92,
    "growth": "+5%",
    "chartData": [88, 90, 87, 92, 89, 94, 92]
  }
}
```

---

### 2.4 用户任务概述

**适配组件**: `UserTaskOverview.vue`

**请求**

```
GET /api/browser-agent/dashboard/user/task-overview
```

**响应示例**

```json
{
  "code": 200,
  "data": {
    "sessionCount": 128,
    "taskCount": 456,
    "successRate": 94,
    "weekGrowth": "+15%",
    "chartData": {
      "xAxis": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      "data": [160, 100, 150, 80, 190, 100, 175]
    }
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | sessionCount | number | 总会话数 | | taskCount | number | 总任务数 | | successRate | number | 成功率（百分比） | | weekGrowth | string | 周同比 | | chartData.xAxis | string[] | X轴标签 | | chartData.data | number[] | 柱状图数据 |

---

### 2.5 用户任务趋势

**适配组件**: `UserTaskTrend.vue`

**请求**

```
GET /api/browser-agent/dashboard/user/task-trend?year=2026
```

**参数** | 参数 | 类型 | 必填 | 默认值 | 说明 | |------|------|------|--------|------| | year | int | 否 | 当前年份 | 查询年份 |

**响应示例**

```json
{
  "code": 200,
  "data": {
    "year": 2026,
    "growth": "+15%",
    "monthlyData": [50, 25, 40, 20, 70, 35, 65, 30, 35, 20, 40, 44]
  }
}
```

**字段说明** | 字段 | 类型 | 说明 | |------|------|------| | year | number | 统计年份 | | growth | string | 年增长 | | monthlyData | number[] | 12个月任务数 |

---

## 三、TypeScript 类型定义

```typescript
// ===== 管理员接口类型 =====

// 1.1 概览统计
interface AdminSummary {
  todayTasks: number
  todayGrowth: string
  successRate: number
  successGrowth: string
}

// 1.2 周任务量 / 1.6 周操作量
interface VolumeData {
  volume: number
  growth: string
  chartData: number[]
}

// 1.3 周任务成功率 / 1.7 周操作成功率
interface RateData {
  rate: number
  growth: string
  chartData: number[]
}

// 1.4 总任务量
interface TotalTaskVolume {
  total: number
  totalAll: number
  distribution: DistributionItem[]
}

interface DistributionItem {
  value: number
  name: string
}

// 1.5 任务分类
interface TaskClassification {
  distribution: DistributionItem[]
}

// 1.8 活跃会话数
interface ActiveSessions {
  count: number
  growth: string
  chartData: number[]
}

// 1.9 年度任务统计
interface AnnualTaskStats {
  year: number
  monthlyData: number[]
  quarterData: number[]
}

// 1.10 热门任务列表
interface HotTaskItem {
  name: string
  category: string
  avgTime: number
  execCount: number
  successRate: number
  color: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary'
}

// ===== 用户接口类型 =====

// 2.1 用户概览统计
interface UserSummary {
  sessionCount: number
  sessionGrowth: string
  successRate: number
  successGrowth: string
}

// 2.4 用户任务概述
interface UserTaskOverview {
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
interface UserTaskTrend {
  year: number
  growth: string
  monthlyData: number[]
}
```

---

## 四、API 调用示例

```typescript
// api/browser-agent/dashboard.ts
import request from '@/utils/request'

// ===== 管理员接口 =====
export const getAdminSummary = () =>
  request.get<AdminSummary>('/api/browser-agent/dashboard/admin/summary')

export const getAdminWeeklyTaskVolume = () =>
  request.get<VolumeData>('/api/browser-agent/dashboard/admin/weekly-task-volume')

export const getAdminWeeklyTaskSuccessRate = () =>
  request.get<RateData>('/api/browser-agent/dashboard/admin/weekly-task-success-rate')

export const getAdminTotalTaskVolume = () =>
  request.get<TotalTaskVolume>('/api/browser-agent/dashboard/admin/total-task-volume')

export const getAdminTaskClassification = () =>
  request.get<TaskClassification>('/api/browser-agent/dashboard/admin/task-classification')

export const getAdminWeeklyOperationVolume = () =>
  request.get<VolumeData>('/api/browser-agent/dashboard/admin/weekly-operation-volume')

export const getAdminWeeklyOperationSuccessRate = () =>
  request.get<RateData>('/api/browser-agent/dashboard/admin/weekly-operation-success-rate')

export const getAdminActiveSessions = () =>
  request.get<ActiveSessions>('/api/browser-agent/dashboard/admin/active-sessions')

export const getAdminAnnualTaskStats = (year?: number) =>
  request.get<AnnualTaskStats>('/api/browser-agent/dashboard/admin/annual-task-stats', {
    params: { year }
  })

export const getAdminHotTaskList = (limit = 6) =>
  request.get<HotTaskItem[]>('/api/browser-agent/dashboard/admin/hot-task-list', {
    params: { limit }
  })

// ===== 用户接口 =====
export const getUserSummary = () =>
  request.get<UserSummary>('/api/browser-agent/dashboard/user/summary')

export const getUserWeeklyTaskVolume = () =>
  request.get<VolumeData>('/api/browser-agent/dashboard/user/weekly-task-volume')

export const getUserWeeklyTaskSuccessRate = () =>
  request.get<RateData>('/api/browser-agent/dashboard/user/weekly-task-success-rate')

export const getUserTaskOverview = () =>
  request.get<UserTaskOverview>('/api/browser-agent/dashboard/user/task-overview')

export const getUserTaskTrend = (year?: number) =>
  request.get<UserTaskTrend>('/api/browser-agent/dashboard/user/task-trend', { params: { year } })
```

---

## 五、接口清单汇总

### 管理员接口（10个）

| 序号 | 接口路径                                 | 说明         |
| ---- | ---------------------------------------- | ------------ |
| 1.1  | GET /admin/summary                       | 概览统计     |
| 1.2  | GET /admin/weekly-task-volume            | 周任务量     |
| 1.3  | GET /admin/weekly-task-success-rate      | 周任务成功率 |
| 1.4  | GET /admin/total-task-volume             | 总任务量     |
| 1.5  | GET /admin/task-classification           | 任务分类     |
| 1.6  | GET /admin/weekly-operation-volume       | 周操作量     |
| 1.7  | GET /admin/weekly-operation-success-rate | 周操作成功率 |
| 1.8  | GET /admin/active-sessions               | 活跃会话数   |
| 1.9  | GET /admin/annual-task-stats             | 年度任务统计 |
| 1.10 | GET /admin/hot-task-list                 | 热门任务列表 |

### 用户接口（5个）

| 序号 | 接口路径                           | 说明             |
| ---- | ---------------------------------- | ---------------- |
| 2.1  | GET /user/summary                  | 用户概览统计     |
| 2.2  | GET /user/weekly-task-volume       | 用户周任务量     |
| 2.3  | GET /user/weekly-task-success-rate | 用户周任务成功率 |
| 2.4  | GET /user/task-overview            | 用户任务概述     |
| 2.5  | GET /user/task-trend               | 用户任务趋势     |
