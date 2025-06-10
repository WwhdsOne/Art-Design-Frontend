<template>
  <div class="chat-container">
    <div class="chat-window">
      <div v-for="(msg, index) in messages" :key="index" class="chat-message">
        <span class="role">{{ msg.role }}:</span>
        <span class="content">{{ msg.content }}</span>
      </div>
    </div>

    <div class="chat-input">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="请输入内容..." />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useUserStore } from '@/store/modules/user.js'

  const userInput = ref('')
  const messages = ref([{ role: 'system', content: '欢迎使用 DeepSeek Chat！' }])
  let currentAiMessage = ref(null) // 当前正在接收的AI消息引用

  async function fetchStream(url, token, data) {
    // 创建一个新的AI消息对象
    const aiMessage = { role: 'ai', content: '' }
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
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // 按行拆分，逐条处理
      let lines = buffer.split('\n')
      buffer = lines.pop() // 保留不完整部分给下次循环

      for (const line of lines) {
        if (line.trim()) {
          // 处理SSE格式的数据
          // 假设格式为 "data: 内容"
          if (line.startsWith('data: ')) {
            const content = line.substring(6).trim()
            // 跳过空数据和结束标记
            if (content && content !== '[DONE]') {
              // 实时更新AI消息内容
              currentAiMessage.value.content += content
            }
          }
        }
      }
    }

    // 处理最后剩余的buffer
    if (buffer.trim()) {
      if (buffer.startsWith('data: ')) {
        const content = buffer.substring(6).trim()
        if (content && content !== '[DONE]') {
          currentAiMessage.value.content += content
        }
      }
    }

    console.log('流式读取结束')
    currentAiMessage.value = null // 重置当前消息引用
  }

  const sendMessage = () => {
    if (!userInput.value.trim()) return

    const question = userInput.value
    messages.value.push({ role: 'user', content: question })
    userInput.value = ''

    const { accessToken } = useUserStore()
    // todo待后续调整为灵活选择的ID
    fetchStream('/api/aimodel/chat-completion', accessToken, {
      prompt: question,
      id: '47851401207874706'
    })
  }
</script>

<style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    padding: 1rem;
    margin: 0 auto;
    border: 1px solid #ddd;
  }

  .chat-window {
    flex: 1;
    max-height: 400px;
    margin-bottom: 1rem;
    overflow-y: auto;
    border-bottom: 1px solid #ccc;
  }

  .chat-message {
    margin: 0.5rem 0;
  }

  .role {
    margin-right: 0.5rem;
    font-weight: bold;
  }

  .chat-input {
    display: flex;
    gap: 0.5rem;
  }

  input {
    flex: 1;
    padding: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
  }
</style>
