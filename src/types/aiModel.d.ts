export type AIModel = {
  id: string // int64 在 JSON 中序列化为字符串
  model: string
  provider: string
  base_url: string
  api_key: string
  model_id: string
  icon: string

  price_prompt_per_1m: string // decimal 类型，建议用 string 表示
  price_prompt_cached_per_1m: string
  price_completion_per_1m: string

  currency: string
  enabled: boolean
  max_context_tokens: number
  model_type: string
}
