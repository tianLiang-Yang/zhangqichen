import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'


// 查看详情
export async function queryDetial(params) {
  return request(`${BaseUrl}/classroom/ClassType/getDetail`, {
    params,
  });
}

export async function getAllClassList(params) {
  return request(`${BaseUrl}/classroom/ClassType/getTreeList`, {
    params,
  });
}

export async function getClassListPage(params) {
  return request(`${BaseUrl}/classroom/ClassType/getList`, {
    params,
  });
}
// 添加分类
export async function addClass(data) {
  return request.post(`${BaseUrl}/classroom/ClassType/insert`, {
    data
  });
}

// 修改分类
export async function updateData(data) {
  return request.post(`${BaseUrl}/classroom/ClassType/update`, {
    data
  });
}

// 下架分类
export async function updateManualCancele(id) {
  return request.post(`${BaseUrl}/classroom/ClassType/updateManualCancel`, {
    data:{
      classTypeId: id
    }
  });
}

// 发布分类
export async function updateManualRelease(id) {
  return request.post(`${BaseUrl}/classroom/ClassType/release`, {
    data:{
      classTypeId: id
    }
  });
}



export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: { ...restParams, method: 'update' },
  });
}
