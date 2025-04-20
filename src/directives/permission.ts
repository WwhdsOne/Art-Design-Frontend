import { router } from '@/router'
import { App, Directive } from 'vue'

/**
 * 权限指令
 * 用法：
 * <el-button v-auth="'add'">按钮</el-button>
 */
const authDirective: Directive = {
  // 在绑定元素的父组件被挂载后调用
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 从当前路由的 meta 信息中获取权限列表，如果没有则默认为空数组
    // authList 结构示例: [{ auth_mark: 'add' }, { auth_mark: 'edit' }]
    const authList = (router.currentRoute.value.meta.authList as Array<{ auth_mark: string }>) || []

    // 检查当前绑定的权限值是否存在于权限列表中
    // binding.value 是指令的绑定值，例如 v-auth="'add'" 中的 'add'
    const hasPermission = authList.some((item) => item.auth_mark === binding.value)

    // 如果没有权限，则从 DOM 中移除该元素
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  }
}

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective)
}
