export interface AIProvider {
  // 供应商ID
  id: string

  // 供应商名称
  name: string

  // 调用 API 的基础地址
  base_url: string

  // API 密钥（前端一般不展示）
  api_key: string

  // 是否启用
  enabled: boolean

  // 最大请求速率限制（次/分钟）
  max_rate_limit: number

  // 创建时间（建议后端返回 ISO 字符串或时间戳）
  created_at: string

  // 创建者ID
  created_by: string

  // 更新时间
  updated_at: string

  // 更新者ID
  updated_by: string
}
