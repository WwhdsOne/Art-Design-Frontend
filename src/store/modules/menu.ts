import { defineStore } from 'pinia'
import { MenuListType } from '@/types/menu'

interface MenuState {
  menuList: MenuListType[]
  menuWidth: string
}
interface MenuState {
  menuList: MenuListType[]
  menuWidth: string
}

export const useMenuStore = defineStore(
  'menuStore', // <-- Store 的 ID 现在作为第一个参数
  {
    state: (): MenuState => ({
      menuList: [],
      menuWidth: ''
    }),
    getters: {
      getMenuList(): MenuListType[] {
        return this.menuList
      }
    },
    actions: {
      // 推荐为 `list` 参数提供更具体的类型，而不是 `[]`
      setMenuList(list: MenuListType[]) {
        this.menuList = list
      },
      setMenuWidth(width: string) {
        this.menuWidth = width
      }
    }
  }
)
