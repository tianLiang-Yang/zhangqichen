import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'

// 机构列表
export async function fetchOrgList(params) {
  return request.get(`${BaseUrl}/manage/health/BaOrganizationController/list/getList`, {
    params,
  });
}
// 角色列表
export async function fetchRoleList(params) {
  return request.get(`${BaseUrl}/manage/health/SyOrgroleController/list/getList`, {
    params,
  });
}

// 省列表
export async function fetchProvinceList(params) {
  return request.get(`${BaseUrl}/manage/health/BaAreaController/list/getProvinceListByKeyword`, {
    params,
  });
}

// 市列表
export async function fetchCityList(params) {
  return request.get(`${BaseUrl}/manage/health/BaAreaController/list/getCityListByProvinceidAndKeyword`, {
    params,
  });
}

// 字典
export async function fetchDicList(params) {
  return request.get(`${BaseUrl}/manage/health/BaDatadictController/list/getBaDatadictVoListByDictCodeList`, {
    params,
  });
}

// 字典
export async function fetchDicOtherList(params) {
  return request.get(`${BaseUrl}/manage/health/BaDatadictController/list/dict/code`, {
    params,
  });
}

