import request from '@/utils/request';
import { PrescriptionUrl } from '@/utils/Constant';

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
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

export async function getDisease(params) {
  return request(`${PrescriptionUrl}/prescription/manager/disease/get`, {
    method: 'GET',
    params,
  });
}

export async function updateDisease(params) {
  return request(`${PrescriptionUrl}/prescription/manager/disease/update`, {
    method: 'POST',
    data: params,
  });
}