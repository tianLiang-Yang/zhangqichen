import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'

// 移动用户列表
export async function fetchMoblieList(params) {
  return request.get(`${BaseUrl}/manage/health/BaUserController/list/page`, {
    params,
  });
}

// 系统用户列表
export async function fetchSysUserList(params) {
  return request.get(`${BaseUrl}/manage/health/BaOrguserController/list/page`, {
    params,
  });
}

// 删除系统用户
export async function deleteSysUser(params) {
  return request.delete(`${BaseUrl}/manage/health/BaOrguserController/deleteData/delete`, {
    params,
  });
}

// 添加系统用户
export async function AddSysUser(params) {
  return request.post(`${BaseUrl}/manage/health/BaOrguserController/insert/baOrguser`, { data: params },
  );
}
// 重置用户密码
export async function resetPw(params) {
  return request.put(`${BaseUrl}/manage/health/BaOrguserController/updata/resetPassword`, { data: params },
  );
}

// 系统用户详情
export async function getSysMainData(params) {
  return request.get(`${BaseUrl}/manage/health/BaOrguserController/data/getMainData`, {
    params,
  });
}

// 移动端用户详情
export async function fetchUserInfo(params) {
  return request.get(`${BaseUrl}/manage/health/BaUserController/data/getMainData`, {
    params,
  });
}


// 添加医生
export async function addDoctor(data) {
  return request.post(`${BaseUrl}/manage/health/BaUserController/add/doctor`, {
    data,
  });
}


// 删除移动端用户
export async function deleteMobileUser(params) {
  return request.delete(`${BaseUrl}/manage/health/BaUserController/deleteData/delete`, {
    params,
  });
}


// 移动端用户起号
export async function openMobileAccount(params) {
  return request.delete(`${BaseUrl}/manage/health/BaUserController/openData/open`, {
    params,
  });
}
// 移动端用户封号
export async function stopMobileAccount(params) {
  return request.delete(`${BaseUrl}/manage/health/BaUserController/stopData/stop`, {
    params,
  });
}



// 封号 或 封号 系统用户
export async function buOrguserStatus(params) {
  return request.post(`${BaseUrl}/manage/health/BuOrguserStatusHistoryController/insert/buOrguserStatusHistory`, {
    data: params,
  });
}

// 修改系统用户信息
export async function updateSysUserInfo(params) {
  return request.put(`${BaseUrl}/manage/health/BaOrguserController/updata/baOrguser`, {
    data: params,
  });
}

// 获取系统用户历史记录
export async function fetchSysHistoryList(params) {
  return request(`${BaseUrl}/manage/health/BuOrguserStatusHistoryController/list/page`, {
     params,
  });
}
