import request from '@/utils/http'
import { BaseResult } from '@/types/axios'
import { MnistImageData } from './model/mnistModel'

export class MnistService {
  // 获取数字识别列表
  static getMnistList() {
    return request.get<BaseResult<MnistImageData[]>>({
      url: `/api/digitPredict/list`
    })
  }

  // 上传需要被识别的图片
  static uploadImage(formData: FormData): Promise<BaseResult> {
    return request.post({
      url: '/api/digitPredict/upload',
      data: formData
    })
  }

  // 提交识别任务
  static submitTask(id: string, image: string): Promise<BaseResult> {
    return request.post({
      url: '/api/digitPredict/predict',
      data: {
        id,
        image
      }
    })
  }

  // 根据ID查询
  static getMnistById(id: string): Promise<BaseResult<MnistImageData>> {
    return request.get({
      url: `/api/digitPredict/get/${id}`
    })
  }
}
