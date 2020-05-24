import request from '@/utils/request';
import { PrescriptionUrl } from '@/utils/Constant';

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function searchKeyword(params) {
  return request(`${PrescriptionUrl}/prescription/manager/search`, {
    params,
  });
}
