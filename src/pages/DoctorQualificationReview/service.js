import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'

export async function fetchList(params) {
  return request.get(`${BaseUrl}/manage/health/BuUserDrverifyController/list/page`, {
    params,
    credentials: 'same-origin',
  });
}

// 统计
export async function fetchStatistics() {
  return request.get(`${BaseUrl}/manage/health/BuUserDrverifyController/data/getBuUserDrverifyCount`);
}

// 资质审核详情
export async function fetchDoctorDetial(params) {
  return request(`${BaseUrl}/manage/health/BuUserDrverifyController/data/getBuUserDrverifyDetail`, {
    params,
  });
}

export async function fetchDoctorHistory(params) {
  return request(`${BaseUrl}/manage/health/BuUserDrverifyHistoryController/list/page`, {
    params,
  });
}

// 修改医师资质认证
export async function updateAuditStatus(params) {
  return request.post(`${BaseUrl}/manage/health/BuUserDrverifyHistoryController/insert/buUserDrverifyHistory`, {
    data: params,
  });
}
