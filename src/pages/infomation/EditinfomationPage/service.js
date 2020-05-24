import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'

//  查询想咨询分类多级列表
export async function getNewsTypeList(params) {
  return request(`${BaseUrl}/news/health/baNewsType/getNewsTypeList/select`, {
    params,
  });
}





