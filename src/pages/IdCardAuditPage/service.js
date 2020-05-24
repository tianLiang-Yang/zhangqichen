import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'

// 列表分页
export async function fetchList(params) {
  return request.get(`${BaseUrl}/manage/health/BuUserIdverifyController/list/page`, {
    params,
  });
}

// 统计
export async function fetchStatistics() {
  return request.get(`${BaseUrl}/manage/health/BuUserIdverifyController/data/getBuUserIdverifyCount`);
}

// 资质审核详情
export async function fetchDoctorDetial(params) {
  return request(`${BaseUrl}/manage/health/BuUserIdverifyController/data/getBuUserIdverifyDetail`, {
    params,
  });
}

// 历史记录
export async function fetchDoctorHistory(params) {
  return request(`${BaseUrl}/manage/health/BuUserIdverifyHistoryController/list/page`, {
    params,
  });
}

// 修改身份认证
export async function updateAuditStatus(params) {
  return request.post(`${BaseUrl}/manage/health/BuUserIdverifyHistoryController/insert/buUserDrverifyHistory`, {
    data: params,
  });
}
