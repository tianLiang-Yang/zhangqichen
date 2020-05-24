import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'


/**
 *  添加服务包
 * @param data
 * @returns {Promise<any>}
 */
export async function addServicePack(data) {
  return request.post(`${BaseUrl}/fdsserve/manage/serve/pack/insert`, {
    data
  });
}

/**
 * 获取服务包详情
 * @param data
 * @returns {Promise<any>}
 */
export async function getManageServePackInfo(params) {
  return request(`${BaseUrl}/fdsserve/manage/serve/pack/info`, {
    params,
  });
}


/**
 *  修改服务包
 * @param data
 * @returns {Promise<any>}
 */
export async function updateServicePack(data) {
  return request.post(`${BaseUrl}/fdsserve/manage/serve/pack/update`, {
    data
  });
}

/**
 *  添加服务包 子项目
 * @param data
 * @returns {Promise<any>}
 */
export async function addServiceChildProject(data) {
  return request.post(`${BaseUrl}/fdsserve/manage/pack/project/insert`, {
    data
  });
}

/**
 * 服务包 项目列表
 * @param data
 * @returns {Promise<any>}
 */
export async function getServiceProList(params) {
  return request(`${BaseUrl}/fdsserve/manage/serve/pack/list`, {
    params,
  });
}

/**
 * 添加服务包 子项目列表
 * @param data
 * @returns {Promise<any>}
 */
export async function getServiceChildProList(params) {
  return request(`${BaseUrl}/fdsserve/manage/pack/project/list`, {
    params,
  });
}

/**
 *
 删除机构服务包子项目
 * @param data
 * @returns {Promise<any>}
 */
export async function deleteProChildSer(data) {
  return request.delete(`${BaseUrl}/fdsserve/manage/pack/project/delete`, {
    data,
  });
}

/**
 * 发布 服务包
 * @param
 * @returns {Promise<any>}
 */
export async function releaseServicePack(data) {
  return request.put(`${BaseUrl}/fdsserve/manage/serve/pack/open`, {
    data,
  });
}


/**
 * 下架 服务包
 * @param
 * @returns {Promise<any>}
 */
export async function downServicePack(data) {
  return request.put(`${BaseUrl}/fdsserve/manage/serve/pack/forbid`, {
    data,
  });
}

/**
 * 删除服务包
 * @param
 * @returns {Promise<any>}
 */
export async function deleteServicePack(data) {
  return request.post(`${BaseUrl}/fdsserve/manage/serve/pack/delete`, {
    data,
  });
}


/**
 *  获取机构家医服务明细
 * @param data
 * @returns {Promise<any>}
 */
export async function getOrgSerInfo(params) {
  return request(`${BaseUrl}/fdsserve/manage/fds/service/info`, {
    params,
  });
}

/**
 *  增加服务机构
 * @param data
 * @returns {Promise<any>}
 */
export async function addOrgService(data) {
  return request.post(`${BaseUrl}/fdsserve/manage/fds/service/insert`, {
    data
  });
}

/**
 *  修改你服务机构
 * @param data
 * @returns {Promise<any>}
 */
export async function updateOrgService(data) {
  return request.post(`${BaseUrl}/fdsserve/manage/fds/service/update`, {
    data
  });
}

/**
 *
  创建团队
 * @param data
 * @returns {Promise<any>}
 */
export async function CreateTeam(data) {
  return request.post(`${BaseUrl}/fdsserve/manage/team/create`, {
    data
  });
}

/**
 *
 修改团队
 * @param data
 * @returns {Promise<any>}
 */
export async function updateTeam(data) {
  return request.put(`${BaseUrl}/fdsserve/manage/team/update`, {
    data
  });
}

/**
 *
 发布团队
 * @param data
 * @returns {Promise<any>}
 */
export async function OpenTeam(data) {
  return request.put(`${BaseUrl}/fdsserve/manage/team/open`, {
    data
  });
}

/**
 *
 下架团队
 * @param data
 * @returns {Promise<any>}
 */
export async function forbirdTeam(data) {
  return request.put(`${BaseUrl}/fdsserve/manage/team/forbid`, {
    data
  });
}


/**
 *  获取团队成员列表
 * @param data
 * @returns {Promise<any>}
 */
export async function getTeamUserList(params) {
  return request(`${BaseUrl}/fdsserve/manage/team/member/list`, {
    params,
  });
}



/**
 *
 删除团队
 * @param data
 * @returns {Promise<any>}
 */
export async function deleteTeam(data) {
  return request.delete(`${BaseUrl}/fdsserve/manage/team/delete`, {
    data,
  });
}

/**
 *
 删除团队服务包
 * @param data
 * @returns {Promise<any>}
 */
export async function deleteTeamPack(data) {
  return request.delete(`${BaseUrl}/fdsserve/manage/serve/pack/delete/team/pack`, {
    data,
  });
}




/**
 *  新增团队成员
 * @param data
 * @returns {Promise<any>}
 */
export async function AddTeamUser(data) {
  return request.post(`${BaseUrl}/fdsserve/manage/team/member/insert`, {
    data
  });
}

/**
 *
  删除团队成员
 * @param data
 * @returns {Promise<any>}
 */
export async function deleteTeamUser(data) {
  return request.delete(`${BaseUrl}/fdsserve/manage/team/member/delete`, {
    data,
  });
}


/**
 *
 获取团队可选服务包列表
 * @param data
 * @returns {Promise<any>}
 */
export async function getSerPackSelectList(params) {
  return request.get(`${BaseUrl}/fdsserve/manage/serve/pack/select/list`, {
    params,
  });
}

/**
 *
 修改团队勾选的机构服务包
 * @param data
 * @returns {Promise<any>}
 */
export async function updateTeamPack(data) {
  return request.put(`${BaseUrl}/fdsserve/manage/serve/pack/update/team/pack`, {
    data,
  });
}

/**
 *
 获取团队已经选择的服务包列表
 * @param data
 * @returns {Promise<any>}
 */
export async function getSelectPackList(params) {
  return request.get(`${BaseUrl}/fdsserve/manage/serve/pack/selected/list`, {
    params,
  });
}

/**
 *
 设置团队长
 * @param data
 * @returns {Promise<any>}
 */
export async function teamAddLeader(data) {
  return request.put(`${BaseUrl}/fdsserve/manage/team/member/add/leader`, {
    data,
  });
}

/**
 *
 添加签约主体
 * @param data
 * @returns {Promise<any>}
 */
export async function teamAddMaster(data) {
  return request.put(`${BaseUrl}/fdsserve/manage/team/member/add/master`, {
    data,
  });
}


/**
 *
 取消签约主体
 * @param data
 * @returns {Promise<any>}
 */
export async function teamcancleMaster(data) {
  return request.put(`${BaseUrl}/fdsserve/manage/team/member/cancel/master`, {
    data,
  });
}


