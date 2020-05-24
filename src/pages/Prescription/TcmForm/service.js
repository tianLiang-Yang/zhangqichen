import request from '@/utils/request';
import { PrescriptionUrl } from '@/utils/Constant';

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function getTcm(params) {
  return request(`${PrescriptionUrl}/prescription/manager/tcm/get`, {
    method: 'GET',
    params,
  });
}

export async function updateTcm(params) {
  return request(`${PrescriptionUrl}/prescription/manager/tcm/update`, {
    method: 'POST',
    data: params,
  });
}
