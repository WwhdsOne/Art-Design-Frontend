export interface KnowledgeBaseFile {
  id: string // 主键ID（后端返回 string，避免大整数精度丢失）
  original_filename: string // 用户上传时的文件名
  file_type: string // 文件类型(pdf/docx/txt)
  file_size: number // 文件大小(字节)
  file_path: string // 存储路径
  create_user: string // 创建人用户名
  created_at: string // 创建时间（ISO 字符串）
}
