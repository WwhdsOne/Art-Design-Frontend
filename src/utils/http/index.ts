import axios, { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import EmojiText from '../emojo'
import { BaseResult } from '@/types/axios'
const axiosInstance = axios.create({
  timeout: 15000,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 300,

  // ✅ 不要 transformRequest，axios 内部会自动处理 JSON / FormData
  transformRequest: undefined,

  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    // ✅ post 这块别设置固定 Content-Type，或者设置后在拦截器里覆盖
    post: {}
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

      // 仅当数据不是 FormData 时，才设置为 application/json

      if (!(request.data instanceof FormData)) {
        request.headers.set('Content-Type', 'application/json')
      }
    }

    return request
  },
  (error) => {
    ElMessage.error(`服务器异常！ ${EmojiText[500]}`)
    return Promise.reject(error)
  }
)

let isRefreshing = false // 是否正在刷新token的标志
let requests: ((token: string) => void)[] = [] // 等待token刷新后重新发送的请求队列
let hasShownSessionExpired = false // 防止多次弹窗

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    const data = response.data
    const userStore = useUserStore()
    const code = data.code

    if (code === 200) {
      hasShownSessionExpired = false
      return response
    } else if (code === 401) {
      if (!hasShownSessionExpired) {
        ElMessage.error('登录已过期,请重新登录')
        hasShownSessionExpired = true
      }
      // 清除用户信息
      userStore.logOut()
      return Promise.reject(new Error('登录已过期')) as Promise<AxiosResponse>
    } else if (code === 402) {
      const originalRequest = response.config
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const refreshResponse = await api.get<BaseResult>({
            url: '/api/auth/refreshToken/' + userStore.getUserInfo.id
          })

          if (refreshResponse.code === 200) {
            // 存储新token
            userStore.setToken(refreshResponse.data)
            // 更新请求头
            originalRequest.headers.Authorization = userStore.accessToken

            // 执行所有等待的请求
            requests.forEach((cb) => cb(userStore.accessToken))
            requests = []

            // 重新发送当前请求
            return axiosInstance.request(originalRequest)
          }
        } catch (error) {
          console.log(error)
          ElMessage.error('刷新token失败,请重新登录')
          userStore.logOut()
          return Promise.reject(new Error('刷新token失败')) as Promise<AxiosResponse>
        } finally {
          isRefreshing = false
        }
      } else {
        // 正在刷新token，将请求加入队列
        return new Promise((resolve) => {
          requests.push((token: string) => {
            originalRequest.headers.Authorization = token
            resolve(axiosInstance.request(originalRequest))
          })
        })
      }
    } else {
      const errorMessage = data.message
      ElMessage.error(
        errorMessage
          ? `${errorMessage} ${EmojiText[500]}`
          : `请求超时或服务器异常！${EmojiText[500]}`
      )
      return Promise.reject(
        new Error(errorMessage || '请求超时或服务器异常')
      ) as Promise<AxiosResponse>
    }
    return Promise.reject(new Error(`未知错误代码: ${code}`)) as Promise<AxiosResponse>
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 请求
async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  // 对 POST | PUT 请求特殊处理
  if (config.method?.toUpperCase() === 'POST' || config.method?.toUpperCase() === 'PUT') {
    // 如果已经有 data，则保留原有的 data
    if (config.params && !config.data) {
      config.data = config.params
      config.params = undefined // 使用 undefined 而不是空对象
    }
  }

  try {
    const res = await axiosInstance.request<T>({ ...config })
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      // 可以在这里处理 Axios 错误
    }
    return Promise.reject(e)
  }
}

// API 方法集合
const api = {
  get<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'GET' }) // GET 请求
  },
  post<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'POST' }) // POST 请求
  },
  put<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'PUT' }) // PUT 请求
  },
  del<T>(config: AxiosRequestConfig): Promise<T> {
    return request({ ...config, method: 'DELETE' }) // DELETE 请求
  }
}

export default api
