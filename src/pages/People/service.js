import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'


/**
 * 人群分类 添加分类
 * @param data
 * @returns {Promise<any>}
 */
export async function addClass(data) {
  return request.post(`${BaseUrl}/usergroup/health/baThrongType/insertBaThrongType`, {
    data
  });
}


/**
 * 人群分类 修改分类
 * @param data
 * @returns {Promise<any>}
 */
export async function updateClass(data) {
  return request.put(`${BaseUrl}/usergroup/health/baThrongType/updateBaThrongType`, {
    data,
  });
}



/**
 * 人群分类 获取人群分类列表
 * @param data
 * @returns {Promise<any>}
 */
export async function getPeopleClassListSelect(params) {
  return request(`${BaseUrl}/usergroup/health/baThrongType/getBaThrongTypeList/select`, {
    params,
  });
}

/**
 * 人群分类 查看详情
 * @param data
 * @returns {Promise<any>}
 */
export async function queryClassDetial(params) {
  return request(`${BaseUrl}/usergroup/health/baThrongType/getBaThrongTypeDetail`, {
    params,
  });
}

/**
 * 人群分类列表
 * @param data
 * @returns {Promise<any>}
 */
export async function getPeopleClassList(params) {
  return request(`${BaseUrl}/usergroup/health/baThrongType/getBaThrongTypeList/page`, {
    params,
  });
}

/**
 * 人群分类删除
 * @param data
 * @returns {Promise<any>}
 */
export async function deleteClassById(params) {
  return request.delete(`${BaseUrl}/usergroup/health/baThrongType/deleteBaThrongType`, {
    params,
  });
}

/**
 * 人群管理 添加动态人群
 * @param data
 * @returns {Promise<any>}
 */
export async function addDynnmicPeoole(data) {
  return request.post(`${BaseUrl}/usergroup/health/baThrong/insertBaThrongD`, {
    data
  });
}

/**
 * 人群管理 添加静态人群人员
 * @param data
 * @returns {Promise<any>}
 */
export async function addStaticUser(data) {
  return request.post(`${BaseUrl}/usergroup/health/baThrongUser/insertBaThrongUser`, {
    data
  });
}

/**
 * 人群静态 修改
 * @param data
 * @returns {Promise<any>}
 */
export async function updateBaThrongS(data) {
  return request.put(`${BaseUrl}/usergroup/health/baThrong/updateBaThrongS`, {
    data,
  });
}

/**
 * 人群动态 修改
 * @param data
 * @returns {Promise<any>}
 */
export async function updateBaThrongD(data) {
  return request.put(`${BaseUrl}/usergroup/health/baThrong/updateBaThrongD`, {
    data,
  });
}


/**
 * 人群管理 添加静态人群
 * @param data
 * @returns {Promise<any>}
 */
export async function addStaticPeoole(data) {
  return request.post(`${BaseUrl}/usergroup/health/baThrong/insertBaThrongS`, {
    data
  });
}

/**
 * 人群 修改人群状态 发布 停用
 * @param data
 * @returns {Promise<any>}
 */
export async function updateBaThrong(data) {
  return request.put(`${BaseUrl}/usergroup/health/baThrong/updateBaThrong`, {
    data,
  });
}



/**
 * 人群 查看详情
 * @param data
 * @returns {Promise<any>}
 */
export async function queryPeopleDetial(params) {
  return request(`${BaseUrl}/usergroup/health/baThrong/getBathrongDetail`, {
    params,
  });
}


/**
 * 人群删除
 * @param data
 * @returns {Promise<any>}
 */
export async function deletePeopleById(params) {
  return request.delete(`${BaseUrl}/usergroup/health/baThrong/deleteBaThrong`, {
    params,
  });
}

/**
 * 静态人群删除人员
 * @param data
 * @returns {Promise<any>}
 */
export async function deleteBaThrongUser(params) {
  return request.delete(`${BaseUrl}/usergroup/health/baThrongUser/deleteBaThrongUser`, {
    params,
  });
}

// 分割 =====================================================


export async function getClassListPage(params) {
  return request(``, {
    params,
  });
}


// 修改分类
export async function updateData(data) {
  return request.post(`${BaseUrl}/classroom/ClassType/update`, {
    data
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
