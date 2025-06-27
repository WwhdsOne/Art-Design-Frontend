<template>
  <div class="chat-wrapper">
    <!-- 左侧历史会话栏 -->
    <aside class="chat-history">
      <div class="history-section" v-for="(group, label) in groupedSessions" :key="label">
        <h4>{{ label }}</h4>
        <ul>
          <!--          <li-->
          <!--            v-for="session in group"-->
          <!--            :key="session.id"-->
          <!--            @click="loadSession(session)"-->
          <!--            :class="{ active: currentSession?.id === session.id }"-->
          <!--          >-->
          <!--            {{ session.title || '未命名对话' }}-->
          <!--          </li>-->
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

      <div class="model-selector">
        <el-form-item prop="model">
          <el-select
            v-model="selectedModelId"
            placeholder="请选择模型"
            clearable
            filterable
            style="width: 25%; margin-top: 5px; margin-bottom: 5px"
          >
            <el-option
              v-for="model in models"
              :key="model.id"
              :label="model.model"
              :value="model.id"
            >
              <div style="display: flex; align-items: center; justify-content: space-between">
                <span>{{ model.model }}</span>
                <img
                  v-if="model.icon"
                  :src="model.icon"
                  alt="icon"
                  style="width: 16px; height: 16px; margin-left: 8px"
                />
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="chat-input-wrapper">
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

          <div class="chat-tools">
            <!--            <el-button text icon="el-icon-lightning">推理</el-button>-->
            <!--            <el-button text icon="el-icon-time">沉思</el-button>-->
            <!--            <el-button text icon="el-icon-connection">联网</el-button>-->
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
  import { ref, computed, nextTick, onMounted } from 'vue'
  import { useUserStore } from '@/store/modules/user.js'
  import { AIModelService } from '@/api/aiModelApi.js'
  import 'github-markdown-css/github-markdown.css'
  import { AIMessages, SimpleAIModel } from '@/types/aiModel'
  import Prism from 'prismjs'
  import { useMarkdown } from '@/utils/markdown'
  import DOMPurify from 'dompurify'

  const md = useMarkdown()

  const userInput = ref('')
  const messages = ref([{ role: 'system', content: '欢迎使用 Chat！' }])
  const currentAiMessage = ref<AIMessages | null>(null)
  const chatWindow = ref<HTMLDivElement>()

  // const currentSession = ref(null)

  const selectedModelId = ref()

  onMounted(() => {
    fetchModelList()
  })

  // 模拟可选模型列表，可从后端接口获取
  const models = ref<SimpleAIModel[]>([])
  const fetchModelList = () => {
    AIModelService.getSimpleModelList().then((res) => {
      if (res.code === 200) {
        models.value = res.data
        selectedModelId.value = models.value[0]?.id
      }
    })
  }

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

  // 模拟历史会话数据（真实项目应从 API 获取）
  const allSessions = ref([
    { id: 's1', title: '今天的对话', timestamp: new Date() },
    { id: 's2', title: '三天前对话', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: 's3', title: '十天前对话', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: 's4', title: '一月前对话', timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  ])

  const groupedSessions = computed(() => {
    const now = Date.now()
    return {
      今天: allSessions.value.filter((s) => now - s.timestamp.getTime() < 24 * 60 * 60 * 1000),
      '7天内': allSessions.value.filter(
        (s) =>
          now - s.timestamp.getTime() >= 24 * 60 * 60 * 1000 &&
          now - s.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
      ),
      '30天内': allSessions.value.filter(
        (s) =>
          now - s.timestamp.getTime() >= 7 * 24 * 60 * 60 * 1000 &&
          now - s.timestamp.getTime() < 30 * 24 * 60 * 60 * 1000
      ),
      更早: allSessions.value.filter((s) => now - s.timestamp.getTime() >= 30 * 24 * 60 * 60 * 1000)
    }
  })

  const fetchStream = async (url: string, token: string, data: any) => {
    const aiMessage = { role: 'assistant', content: '' }
    messages.value.push(aiMessage)
    currentAiMessage.value = aiMessage

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
      let messages = buffer.split('\n\n')
      buffer = messages.pop() || '' // 留下最后可能未完整的数据

      for (const msg of messages) {
        const lines = msg.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace(/^data:\s?/, '') // 提取 JSON 字符串
            if (jsonStr && jsonStr !== '[DONE]') {
              try {
                const parsed = JSON.parse(jsonStr)
                const content = parsed.v || ''
                if (content) {
                  // 换行前加两个空格，方便 Markdown 渲染换行
                  rawContent += content.replace(/\n/g, '  \n')
                  currentAiMessage.value.content = DOMPurify.sanitize(md.render(rawContent))
                  scrollToBottom()
                }
              } catch (e) {
                console.error('JSON 解析失败:', e)
              }
            }
          }
        }
      }
    }

    // 处理剩下的 buffer 内容
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
    if (!userInput.value.trim()) return

    const question = userInput.value
    messages.value.push({ role: 'user', content: question })
    userInput.value = ''

    const { accessToken } = useUserStore()
    scrollToBottom()

    fetchStream('/api/ai/model/chat-completion', accessToken, {
      messages: messages.value,
      id: selectedModelId.value
    })
  }

  // function loadSession(session) {
  //   currentSession.value = session
  //   // 在真实项目中：从后端拉取该 session 的 message 列表
  //   messages.value = [{ role: 'system', content: `已加载对话：${session.title}` }]
  // }
</script>

<style>
  .chat-wrapper {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background-color: var(--art-main-bg-color);
  }

  .chat-history {
    width: 150px;
    padding: 1rem;
    overflow-y: auto;
    background-color: var(--art-main-bg-color);
    border-right: 1px solid #ddd;
  }

  .chat-history h4 {
    margin: 1rem 0 0.5rem;
  }

  .chat-history ul {
    padding: 0;
    list-style: none;
  }

  .chat-history li {
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    border-radius: 4px;
  }

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
</style>
