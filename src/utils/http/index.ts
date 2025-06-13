import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import EmojiText from '../emojo'

const axiosInstance = axios.create({
  timeout: 15000,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  },
  transformResponse: [
    (data, headers) => {
      const contentType = headers['content-type']
      if (contentType?.includes('application/json')) {
        try {
          return JSON.parse(data)
        } catch {
          return data
        }
      }
      return data
    }
  ]
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const { accessToken } = useUserStore()
    if (accessToken) {
      request.headers.set('Authorization', accessToken)
    }

    // 设置 POST 请求 Content-Type
    if (request.method?.toLowerCase() === 'post' && !(request.data instanceof FormData)) {
      request.headers.set('Content-Type', 'application/json')
    }

    return request
  },
  (error) => {
    ElMessage.error(`服务器异常！${EmojiText[500]}`)
    return Promise.reject(error)
  }
)

// 响应拦截器（删除刷新 Token 相关逻辑）
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse | Promise<AxiosResponse> => {
    const { data } = response
    const userStore = useUserStore()

    switch (data.code) {
      case 200:
        return response

      case 401:
        ElMessage.error('登录已过期，请重新登录')
        userStore.logOut()
        return Promise.reject(new Error('登录已过期'))

      default:
        ElMessage.error(`${data.message || '请求错误'}`)
        return Promise.reject(new Error(data.message || '请求错误'))
    }
  },
  (error) => Promise.reject(error)
)

// 请求函数
async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  // POST 请求时，如果只传 params 则转换为 data
  if (config.method?.toUpperCase() === 'POST' && config.params && !config.data) {
    config.data = config.params
    config.params = undefined
  }

  try {
    const res = await axiosInstance.request<T>(config)
    return res.data
  } catch (e) {
    return Promise.reject(e)
  }
}

// API 集合（仅 GET / POST）
const api = {
  get<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'GET' })
  },
  post<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'POST' })
  }
}

export default api
