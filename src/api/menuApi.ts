import { fourDotsSpinnerSvg } from '@/assets/svg/loading'
import { MenuListType } from '@/types/menu'
import { processRoute } from '@/utils/menu'
import { ElLoading } from 'element-plus'
import request from '@/utils/http'
import { BaseResult } from '@/types/axios'

// 菜单接口
export class menuService {
  // 获取菜单列表，模拟网络请求
  // 获取菜单列表，模拟网络请求
  static getMenuList(): Promise<{ menuList: MenuListType[]; closeLoading: () => void }> {
    // 启动加载动画
    const loading = ElLoading.service({
      lock: true,
      background: 'rgba(0, 0, 0, 0)',
      svg: fourDotsSpinnerSvg,
      svgViewBox: '0 0 40 40'
    })

    // 发送请求并处理数据
    return request
      .get<BaseResult<MenuListType[]>>({ url: '/api/menu/list' })
      .then((res) => {
        // 处理后的菜单数据
        if (res.code !== 200) {
          return {
            menuList: [],
            closeLoading: () => loading.close()
          }
        }
        const processedMenuList: MenuListType[] = res.data.map((item) => processRoute(item))
        return {
          menuList: processedMenuList,
          closeLoading: () => loading.close()
        }
      })
      .catch((error) => {
        // 处理错误情况
        loading.close()
        throw error
      })
  }
}
