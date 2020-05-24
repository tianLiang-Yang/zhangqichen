import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'

// 左边字典值list
export async function fetchList(params) {
  console.log('左边字典值list', params)
  return request.get('/api/fetchList', { params })
}

// 详情list
export async function fetchDetialList(params) {
  return request.get('/api/fetchDetialList', { params });
}
