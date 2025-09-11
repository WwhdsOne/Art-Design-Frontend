<template>
  <div class="chat-wrapper">
    <!-- 左侧历史会话栏 -->
    <aside class="chat-history">
      <!-- 新聊天按钮 -->
      <div class="new-session" @click="startNewSession">
        <span class="icon">&#xe626;</span> 新聊天
      </div>

      <div class="history-section" v-for="(group, label) in groupedSessions" :key="label">
        <h4>{{ label }}</h4>
        <ul>
          <li
            v-for="session in group"
            :key="session.id"
            @click="loadSession(session)"
            :class="{ active: currentSession?.id === session.id }"
          >
            {{ session.title }}
          </li>
        </ul>
      </div>
    </aside>

    <!-- 右侧聊天主界面 -->
    <div class="chat-container">
      <div class="chat-window" ref="chatWindow">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['chat-message', msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai']"
        >
          <!-- 如果是用户消息，直接用纯文本 -->
          <template v-if="msg.role === 'user'">
            <span>{{ msg.content }}</span>
          </template>

          <!-- 如果是 AI 消息，渲染带 markdown-body 的 HTML -->
          <template v-else>
            <div class="markdown-body" v-html="msg.content"></div>
          </template>
        </div>
      </div>

      <div class="model-selector" style="display: flex; gap: 10px">
        <el-form-item prop="model">
          <el-select
            v-model="selectedModelId"
            placeholder="请选择模型"
            clearable
            filterable
            style="width: 220px; margin-top: 5px; margin-bottom: 5px"
          >
            <el-option
              v-for="model in models"
              :key="model.id"
              :label="model.model"
              :value="model.id"
            >
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                "
              >
                <div style="display: flex; gap: 6px; align-items: center">
                  <span>{{ model.model }}</span>
                  <el-tag size="small" type="info">{{ model.model_type }}</el-tag>
                </div>
                <img
                  v-if="model.icon"
                  :src="model.icon"
                  alt="icon"
                  style="width: 16px; height: 16px"
                />
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="KnowledgeBase">
          <el-select
            v-model="selectedKnowledgeBaseId"
            placeholder="请选择知识库"
            clearable
            filterable
            style="width: 150px; margin-bottom: 5px"
          >
            <el-option
              v-for="KnowledgeBase in knowledgeBases"
              :key="KnowledgeBase.id"
              :label="KnowledgeBase.name"
              :value="KnowledgeBase.id"
            />
          </el-select>
        </el-form-item>
      </div>

      <div class="chat-input-wrapper">
        <!-- 图片预览区 -->
        <div v-if="uploadedImages.length" class="chat-image-preview">
          <div v-for="(img, index) in uploadedImages" :key="index" class="preview-item">
            <img :src="img" alt="preview" class="preview-img" />
            <el-icon class="remove-icon" @click="removeImage(index)">
              <Close />
            </el-icon>
          </div>
        </div>
        <!-- 输入框 -->

        <textarea
          ref="textareaRef"
          v-model="userInput"
          @input="adjustHeight"
          @keydown="handleKeydown"
          class="chat-textarea"
          placeholder="和我聊聊天吧"
          rows="1"
        />

        <!-- 底部工具栏 + 发送按钮 -->
        <div class="chat-toolbar">
          <!-- 左下角：工具todo -->

          <div class="chat-tools" style="display: flex; gap: 10px">
            <!-- 仅在选中的模型支持 multimode 时显示 -->
            <el-button text>
              <el-upload
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :http-request="(option) => handleUpload(option.file)"
              >
                <el-button type="primary" icon="Upload"> 上传图片 </el-button>
              </el-upload>
            </el-button>

            <!--            <el-button text @click="onThink">-->
            <!--              <el-icon><Timer /></el-icon> 沉思-->
            <!--            </el-button>-->

            <!--            <el-button text @click="onConnect">-->
            <!--              <el-icon><Link /></el-icon> 联网-->
            <!--            </el-button>-->
          </div>

          <!-- 右下角：发送 -->
          <div class="chat-send-button" @click="sendMessage">
            <img src="https://chatglm.cn/img/send.6d617ab7.svg" alt="发送" class="send-icon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { useUserStore } from '@/store/modules/user.js'
  import { AIModelService } from '@/api/aiModelApi.js'
  import 'github-markdown-css/github-markdown.css'
  import { AIMessages, SimpleAIModel } from '@/types/aiModel'
  import Prism from 'prismjs'
  import { useMarkdown } from '@/utils/markdown'
  import DOMPurify from 'dompurify'
  import { KnowledgeBaseService } from '@/api/knowledgeBaseFile'
  import { Conversation } from '@/types/conversation'
  import { Close } from '@element-plus/icons-vue'

  const md = useMarkdown()

  const userInput = ref('')
  const messages = ref<AIMessages[]>([])
  const currentAiMessage = ref<AIMessages | null>(null)
  const currentSession = ref<Conversation | null>(null)
  const chatWindow = ref<HTMLDivElement>()
  const uploadedImages = ref<string[]>([])

  onMounted(() => {
    fetchModelList()
    fetchKnowledgeBases()
    fetchHistoryConversations()
  })

  const selectedKnowledgeBaseId = ref()
  const selectedModelId = ref()

  // 可选模型列表，从后端接口获取
  const models = ref<SimpleAIModel[]>([])
  const fetchModelList = () => {
    AIModelService.getSimpleModelList().then((res) => {
      if (res.code === 200) {
        models.value = res.data
        selectedModelId.value = models.value[0]?.id
      }
    })
  }

  // 可选智能体列表，从后端接口获取
  const knowledgeBases = ref<{ id: number; name: string }[]>([])

  const fetchKnowledgeBases = async () => {
    // 替换为实际接口
    KnowledgeBaseService.getSimpleList().then((res) => {
      if (res.code === 200) {
        knowledgeBases.value = res.data
      }
    })
  }

  // 模拟历史会话数据（真实项目应从 API 获取）
  const allSessions = ref<Conversation[]>([])

  const startNewSession = () => {
    currentSession.value = null // 重置当前会话
    // 如果有聊天内容，也可以同时清空
    messages.value = []
  }

  const fetchHistoryConversations = () => {
    AIModelService.getHistoryConversation().then((res) => {
      if (res.code === 200) {
        allSessions.value = res.data
      }
    })
  }

  // 根据时间分组
  const groupedSessions = computed(() => {
    const groups: Record<string, typeof allSessions.value> = {}

    // 分组
    allSessions.value.forEach((s) => {
      const date = new Date(s.created_at) // 后端字段 create_at
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // 月份 0-11
      const key = `${year}-${month.toString().padStart(2, '0')}`

      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(s)
    })

    // 排序月份
    const sortedKeys = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1))

    // 构造有序对象
    const sortedGroups: Record<string, typeof allSessions.value> = {}
    sortedKeys.forEach((key) => {
      sortedGroups[key] = groups[key]
    })

    return sortedGroups
  })

  const textareaRef = ref<HTMLTextAreaElement | null>(null)

  function adjustHeight() {
    const el = textareaRef.value
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // 插入 \n 到光标处
        e.preventDefault()
        insertNewlineAtCursor()
      } else {
        // 普通 Enter，发送消息
        e.preventDefault()
        sendMessage()
      }
    }
  }

  // 插入换行符在光标处
  function insertNewlineAtCursor() {
    const textarea = document.activeElement as HTMLTextAreaElement
    if (!textarea) return

    const { selectionStart, selectionEnd } = textarea
    const value = userInput.value
    userInput.value = value.slice(0, selectionStart) + '\n' + value.slice(selectionEnd)

    // 重新设置光标位置
    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = selectionStart + 1
    })
  }

  // 自动滚动到底部
  function scrollToBottom() {
    nextTick(() => {
      if (chatWindow.value) {
        chatWindow.value.scrollTop = chatWindow.value.scrollHeight
      }
    })
  }

  const fetchStream = async (url: string, token: string, data: any) => {
    // 先占位一个 AI 消息
    const aiMessage = { role: 'assistant', content: '' }
    messages.value.push(aiMessage)
    currentAiMessage.value = aiMessage
    // 清空预览区图片
    uploadedImages.value = []
    // let isNewConversation = false

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token
      },
      body: JSON.stringify(data)
    })

    if (!response.body) {
      console.error('浏览器不支持 ReadableStream')
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer: string = ''
    let rawContent = '' // 存储原始 markdown 内容

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // 按双换行分割完整消息
      let messagesChunk = buffer.split('\n\n')
      buffer = messagesChunk.pop() || '' // 留下最后可能未完整的数据

      for (const msg of messagesChunk) {
        const lines = msg.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace(/^data:\s?/, '')
            if (jsonStr && jsonStr !== '[DONE]') {
              try {
                const parsed = JSON.parse(jsonStr)

                // 正常 AI 内容
                const content = parsed.v || ''
                if (content) {
                  rawContent += content.replace(/\n/g, '  \n')
                  currentAiMessage.value.content = DOMPurify.sanitize(md.render(rawContent))
                  scrollToBottom()
                }
                // 第一条消息可能是 meta 类型，返回 conversationID
                else if (!currentSession.value?.id && parsed.id) {
                  // 创建新会话对象
                  const newSession: Conversation = {
                    id: parsed.id,
                    title: parsed.title,
                    created_at: parsed.created_at || new Date().toISOString()
                  }

                  // 插入到会话列表最前面
                  allSessions.value.unshift(newSession)

                  // 设置为当前会话
                  currentSession.value = newSession
                }
              } catch (e) {
                console.error('JSON 解析失败:', e)
              }
            }
          }
        }
      }
    }

    // 处理剩余 buffer
    if (buffer.trim().startsWith('data: ')) {
      const jsonStr = buffer.replace(/^data:\s?/, '')
      if (jsonStr && jsonStr !== '[DONE]') {
        try {
          const parsed = JSON.parse(jsonStr)
          const content = parsed.v || ''
          if (content) {
            rawContent += content.replace(/\n/g, '  \n')
            currentAiMessage.value.content = DOMPurify.sanitize(md.render(rawContent))
            scrollToBottom()
          }
        } catch (e) {
          console.error('剩余数据 JSON 解析失败:', e)
        }
      }
    }

    currentAiMessage.value = null
    Prism.highlightAll()
  }

  const sendMessage = () => {
    const input = userInput.value.trim()
    if (!input) return

    messages.value.push({ role: 'user', content: input })
    userInput.value = ''

    const { accessToken } = useUserStore()
    scrollToBottom()

    const history = messages.value.map((msg) => ({
      role: msg.role,
      content: msg.content
    }))
    console.log('conversation', currentSession.value?.id)
    // 模型接口
    fetchStream('/api/ai/model/chat-completion', accessToken, {
      messages: history,
      id: selectedModelId.value,
      knowledge_base_id: selectedKnowledgeBaseId.value,
      conversation_id: currentSession.value?.id,
      files: uploadedImages.value
    })
  }

  function loadSession(session: Conversation) {
    currentSession.value = session
    AIModelService.getHistoryConversationMessages(session.id).then((res) => {
      messages.value = res.data.map((msg) => ({
        ...msg,
        content: msg.role === 'assistant' ? md.render(msg.content) : msg.content
      }))
      scrollToBottom()
    })
  }

  // 上传前校验
  const handleBeforeUpload = (file: File) => {
    const isAllowedType = [
      'image/jpeg', // jpg、jpeg
      'image/png', // png
      'image/gif', // gif
      'image/webp', // webp
      'image/bmp', // bmp
      'image/svg+xml' // svg
    ].includes(file.type)

    const isLt10M = file.size / 1024 / 1024 < 10

    if (!isAllowedType) {
      ElMessage.error('仅支持上传 JPG、PNG、GIF、WEBP、BMP 或 SVG 图片')
      return false
    }

    if (!isLt10M) {
      ElMessage.error('上传图片大小不能超过 10MB')
      return false
    }
    return true
  }

  // 自定义上传处理
  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await AIModelService.uploadChatFile(formData)
    if (res.code === 200) {
      ElMessage.success('文件上传成功')
      uploadedImages.value.push(res.data)
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  }

  const removeImage = (index: number) => {
    uploadedImages.value.splice(index, 1)
  }
</script>

<style>
  .chat-wrapper {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background-color: var(--art-main-bg-color);
  }

  .chat-history {
    width: 200px;
    padding: 1rem;
    overflow-y: auto;
    background-color: var(--art-main-bg-color);
    border-right: 1px solid #ddd;
  }

  /* 分组标题 */
  .chat-history h4 {
    margin: 1rem 0 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  /* 列表和列表项统一设置 */
  .chat-history ul,
  .chat-history li {
    padding: 0;
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    list-style: none !important; /* 去掉圆点 */
  }

  /* 列表项样式 */
  .chat-history li {
    display: flex; /* 支持垂直居中 */
    align-items: center;
    height: 40px; /* 固定高度，每行一样高 */
    padding: 0 0.5rem; /* 水平内边距 */
    line-height: 40px; /* 垂直居中文字 */
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  /* 鼠标悬停和激活状态 */
  .chat-history li.active,
  .chat-history li:hover {
    background-color: var(--art-text-gray-300);
  }

  .chat-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    max-width: 100%; /* 确保容器不会无限扩展 */
    padding: 1rem;
  }

  .chat-window {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 80vh;
    padding: 10px;
    overflow-y: auto;
  }

  /* 公共气泡样式 */
  .chat-message {
    position: relative;
    display: inline-block;
    max-width: 60%;
    padding: 10px 15px;
    overflow-wrap: break-word;
    border-radius: 15px;
    box-shadow: 0 2px 6px rgb(0 0 0 / 15%);
  }

  /* 用户消息：右侧 */
  .chat-message-user {
    margin-left: auto; /* 右对齐 */
    color: white;
    white-space: pre-wrap; /* ← 关键点 */
    background-color: #4f93ff;
    border-bottom-right-radius: 0;
  }

  /* AI消息：左侧，允许最大宽度100% */
  .chat-message-ai {
    max-width: 100%;
    margin-right: auto; /* 左对齐 */
    color: black;
    background-color: var(--art-main-bg-color);
    border-bottom-left-radius: 0;
  }

  .chat-input-wrapper {
    display: flex;
    flex-direction: column;
    width: 98%;
    padding: 12px;
    background: var(--art-main-bg-color);
    border: 1px solid #ddd;
    border-radius: 12px;
  }

  .chat-textarea {
    width: 98%;
    max-height: calc(1.5em * 5); /* 最多 5 行 */
    padding: 8px;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.5; /* 行高用来计算最大高度 */
    resize: none;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .chat-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
  }

  .chat-tools {
    display: flex;
    gap: 8px;
  }

  .chat-send-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    cursor: pointer;
    background-color: transparent;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }

  .chat-send-button:hover {
    background-color: #e6f0ff; /* 鼠标悬停时淡蓝背景 */
  }

  .chat-send-button:hover .send-icon {
    filter: brightness(1.2); /* 或者让图标更亮 */
    transform: scale(1.15); /* 悬停时放大 */
  }

  .send-icon {
    width: 35px;
    height: 35px;
    transition:
      transform 0.2s ease,
      filter 0.2s ease;
  }

  input {
    flex: 1;
    padding: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
  }

  .model-selector {
    margin-bottom: 0;
  }

  .model-selector select {
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  ul,
  ol {
    padding-left: 1.5em; /* 确保缩进正常 */
    list-style: revert !important; /* 恢复默认样式 */
  }

  ul {
    list-style-type: disc; /* 实心圆点 */
  }

  ol {
    list-style-type: decimal; /* 数字 */
  }

  .new-session {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    color: var(--art-text-gray-500);
    cursor: pointer;
    border-radius: 4px;
    transition:
      background-color 0.2s,
      color 0.2s;
  }

  .new-session .icon {
    margin-right: 0.3rem;
    font-family: iconfont-sys, serif; /* Project id 3682552 */
    font-size: 16px;
  }

  .new-session:hover {
    color: var(--art-text-gray-900);
    background-color: var(--art-main-bg-color);
  }

  .chat-image-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .preview-item {
    position: relative;
    width: 80px;
    height: 80px;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 保证比例填充 */
  }

  .remove-icon {
    position: absolute;
    top: 2px;
    right: 2px;
    padding: 2px;
    font-size: 14px;
    color: white;
    cursor: pointer;
    background: rgb(0 0 0 / 50%);
    border-radius: 50%;
  }
</style>
