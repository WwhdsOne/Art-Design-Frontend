export type Role = {
  id: string // 来自 json:"id,string"，表示是字符串类型
  name: string
  code: string
  description: string
  status: number // int8 对应 number
  created_at: string // carbon.DateTime 可序列化为 ISO 日期字符串
}

export type SimpleRole = {
  id: string
  name: string
}
