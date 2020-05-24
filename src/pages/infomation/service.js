import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'

//  资讯管理 查询列表
export async function getNewsManagerList(params) {
  return request(`${BaseUrl}/news/health/baNews/list/page`, {
    params,
  });
}

//  删除资讯
export async function deleteNewById(params) {
  return request.delete(`${BaseUrl}/news/health/baNews/news/delete`, {
    params,
  });
}


// 发布
export async function releaseNewById(params) {
  return request.post(`${BaseUrl}/news/health/baNews/release`, {
    data: params,
  });
}







