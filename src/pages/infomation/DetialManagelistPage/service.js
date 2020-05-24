import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'


export async function fetchList(params) {
  return request('/api/fetchList', {
    params,
  });
}

// 修改医师资质认证
export async function updateAuditStatus(params) {
  return request.post(`${BaseUrl}/manage/health/BuUserDrverifyHistoryController/insert/buUserDrverifyHistory`, {
    data: params,
  });
}
