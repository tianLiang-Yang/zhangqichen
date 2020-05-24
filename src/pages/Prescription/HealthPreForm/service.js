import request from '@/utils/request';
import { PrescriptionUrl } from '@/utils/Constant';

export async function fakeSubmitForm(params) {
  return request('/api/prescription/manger/pre/update', {
    method: 'POST',
    data: params,
  });
}

export async function getTableSetting(params) {
  return request(`${PrescriptionUrl}/prescription/manager/table/get`, {
    method: 'GET',
    params,
  });
}

export async function getHealthPre(params) {
  return request(`${PrescriptionUrl}/prescription/manager/pre/getByName`, {
    method: 'POST',  
    data: params,
  });
}

export async function updateHealthPre(params) {
  return request(`${PrescriptionUrl}/prescription/manager/pre/update`, {
    method: 'POST',  
    data: params,
  });
}

