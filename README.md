## 关于 Art Design Frontend

Art Design Frontend 是一款现代化的前端管理系统，专注于提供优秀的用户体验和高效开发体验。基于 Vue 3 + TypeScript + Vite + Element Plus 技术栈，采用现代化的开发理念，提供美观、实用的前端界面，帮助开发者快速构建高质量的后台管理系统。

## 项目特点

- 现代化技术栈：Vue 3 + TypeScript + Vite + Element Plus
- AI 智能集成：支持 AI 模型、智能代理、知识库管理等功能
- 丰富的组件库：内置多种业务组件模板和常用工具
- 多种主题模式：支持浅色、暗黑、系统主题，可自定义主题
- 完善的权限管理：路由级别鉴权、侧边栏菜单鉴权、鉴权指令
- 优秀的代码规范：集成 ESLint、Prettier、Stylelint、Husky 等工具
- 移动端适配：响应式设计，支持多终端访问

## 技术栈

### 核心框架

- **开发框架**：Vue 3、TypeScript、Vite、Element Plus
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **UI 组件库**：Element Plus

### 工具库

- **网络请求**：Axios
- **图表可视化**：ECharts
- **富文本编辑器**：WangEditor
- **Markdown 渲染**：Markdown-it、Prism.js
- **工具函数**：Day.js、crypto-js、mitt

### 代码规范

- **代码检查**：ESLint、Prettier、Stylelint
- **提交规范**：Commitizen、cz-git
- **Git Hooks**：Husky、lint-staged

## 主要功能

### AI 模块

- AI 对话聊天
- AI 智能代理
- 知识库管理
- AI 模型配置
- 提供商管理

### 系统管理

- 用户管理
- 角色管理
- 菜单管理
- API 管理
- 操作日志

### 仪表盘

- 电商数据统计
- 控制台概览
- 数据分析看板

### 工具组件

- 富文本编辑器
- 视频播放器
- Excel 导入导出
- 二维码生成
- 图片裁剪
- 拖拽排序
- 文字滚动
- 水印功能
- 图标选择器

### 基础功能

- 登录注册
- 忘记密码
- 用户中心
- 多标签页
- 全局搜索
- 全局面包屑
- 锁屏功能
- 主题切换
- 多语言支持

### 特色功能

- MNIST 数字识别
- 内联页面(Iframe)
- 更新日志
- 403/404/500 异常页面

## 快速开始

### 安装依赖

```bash
# 使用 pnpm 安装（推荐）
pnpm install

# 如果安装失败，尝试跳过脚本
pnpm install --ignore-scripts
```

### 本地开发

```bash
# 启动开发服务器
pnpm dev
```

### 生产构建

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm serve
```

### 代码规范

```bash
# 运行 ESLint 检查
pnpm lint

# 自动修复代码
pnpm fix

# 运行 Prettier 格式化
pnpm lint:prettier

# 运行 Stylelint 检查
pnpm lint:stylelint

# 提交代码
pnpm commit
```

## 项目结构

```
art-design-frontend/
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── plugins/       # 插件配置
│   ├── router/        # 路由配置
│   ├── store/         # 状态管理
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   └── views/         # 页面视图
├── public/            # 公共静态资源
├── package.json       # 项目配置
└── vite.config.ts     # Vite 配置
```

## 浏览器支持

- Chrome (最新版本)
- Safari (最新版本)
- Firefox (最新版本)
- Edge (最新版本)

## 相关项目

- **后端项目**：[Art Design Backend](https://github.com/WwhdsOne/Art-Design-Backend)

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。
