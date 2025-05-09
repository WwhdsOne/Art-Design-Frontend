// 导入必要的依赖
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { LanguageEnum } from '@/enums/appEnum'
import { router, setPageTitle } from '@/router'
import { UserInfo } from '@/types/store'
import { useSettingStore } from './setting'
import { useWorktabStore } from './worktab'
import { getSysStorage } from '@/utils/storage'
import { MenuListType } from '@/types/menu'

/**
 * 用户状态管理
 * 使用 Pinia Setup 方式定义 Store
 */
export const useUserStore = defineStore('userStore', () => {
  // 状态定义
  const language = ref<LanguageEnum>(LanguageEnum.ZH) // 当前语言
  const isLogin = ref(false) // 登录状态
  /*
    当 rememberPassword 为 true 时，为登录时启用记住密码
    用户输入的密码会更新到 savedPassword 中
  */
  const rememberPassword = ref(false) // 是否记住密码
  const savedPassword = ref('') // 已保存的密码
  const savedUsername = ref('') // 已保存的用户名
  const info = ref<Partial<UserInfo>>({}) // 用户信息
  const searchHistory = ref<MenuListType[]>([]) // 搜索历史记录
  const accessToken = ref('') // 访问令牌

  // 计算属性
  const getUserInfo = computed(() => info.value) // 获取用户信息
  const getSettingState = computed(() => useSettingStore().$state) // 获取设置状态
  const getWorktabState = computed(() => useWorktabStore().$state) // 获取工作区状态

  // 操作方法
  /**
   * 初始化状态
   * 从本地存储中恢复用户状态
   */
  function initState() {
    let sys = getSysStorage()
    if (sys) {
      sys = JSON.parse(sys)
      const {
        info: userInfo,
        isLogin: loginStatus,
        language: lang,
        searchHistory: history,
        rememberPassword: remberPwd,
        savedPassword: pwd,
        savedUsername: username
      } = sys.user

      // 恢复各项状态，使用空值兜底
      info.value = userInfo || {}
      isLogin.value = loginStatus || false
      rememberPassword.value = remberPwd || false
      language.value = lang || LanguageEnum.ZH
      searchHistory.value = history || []
      savedPassword.value = pwd || ''
      savedUsername.value = username || ''
      accessToken.value = sessionStorage.getItem('accessToken') || ''
    }
  }

  /**
   * 保存用户数据到本地存储
   */
  function saveUserData() {
    saveStoreStorage({
      user: {
        info: info.value,
        isLogin: isLogin.value,
        language: language.value,
        rememberPassword: rememberPassword.value,
        savedPassword: savedPassword.value,
        savedUsername: savedUsername.value,
        searchHistory: searchHistory.value,
        worktab: getWorktabState.value,
        setting: getSettingState.value
      }
    })
  }

  /**
   * 设置用户信息
   * @param userInfo 用户信息对象
   */
  function setUserInfo(userInfo: UserInfo) {
    info.value = userInfo
  }

  /**
   * 设置登录状态
   * @param status 登录状态
   */
  function setLoginStatus(status: boolean) {
    isLogin.value = status
  }

  /**
   * 设置系统语言
   * @param lang 语言枚举值
   */
  function setLanguage(lang: LanguageEnum) {
    setPageTitle(router.currentRoute.value)
    language.value = lang
  }

  /**
   * 设置搜索历史
   * @param list 搜索历史列表
   */
  function setSearchHistory(list: Array<MenuListType>) {
    searchHistory.value = list
  }

  /**
   * 设置锁屏状态
   * @param status 锁屏状态
   */
  function setLockStatus(status: boolean) {
    rememberPassword.value = status
  }

  /**
   * 设置锁屏密码
   * @param password 锁屏密码
   */
  function setsavedPassword(password: string) {
    savedPassword.value = password
  }

  /**
   * 设置访问令牌
   * @param token 访问令牌
   * @param rToken 可选的刷新令牌
   */
  function setToken(token: string) {
    accessToken.value = token
    sessionStorage.setItem('accessToken', token)
    saveUserData()
  }

  /**
   * 退出登录
   * 清除用户状态并跳转到登录页
   */
  function logOut() {
    setTimeout(() => {
      // 重置所有状态
      info.value = {}
      isLogin.value = false
      accessToken.value = ''
      sessionStorage.removeItem('accessToken')
      useWorktabStore().opened = []
      saveUserData()
      sessionStorage.removeItem('iframeRoutes')
      router.push('/login')
    })
  }

  // 返回所有状态和方法
  return {
    // 状态
    language,
    isLogin,
    rememberPassword,
    savedPassword,
    savedUsername,
    info,
    searchHistory,
    accessToken,
    // 计算属性
    getUserInfo,
    getSettingState,
    getWorktabState,
    // 操作方法
    initState,
    saveUserData,
    setUserInfo,
    setLoginStatus,
    setLanguage,
    setSearchHistory,
    setLockStatus,
    setsavedPassword,
    setToken,
    logOut
  }
})

/**
 * 初始化版本信息
 * @param version 版本号
 */
function initVersion(version: string) {
  const vs = localStorage.getItem('version')
  if (!vs) {
    localStorage.setItem('version', version)
  }
}

/**
 * 数据持久化存储
 * 将数据保存到本地存储，并支持版本控制
 * @param newData 要存储的新数据
 */
function saveStoreStorage<T>(newData: T) {
  const version = import.meta.env.VITE_VERSION
  initVersion(version)
  const vs = localStorage.getItem('version') || version
  const storedData = JSON.parse(localStorage.getItem(`sys-v${vs}`) || '{}')

  // 合并新数据与现有数据
  const mergedData = { ...storedData, ...newData }
  localStorage.setItem(`sys-v${vs}`, JSON.stringify(mergedData))
}
