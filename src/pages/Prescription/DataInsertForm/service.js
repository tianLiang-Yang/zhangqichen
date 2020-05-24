import request from '@/utils/request';
import { PrescriptionUrl } from '@/utils/Constant'

export async function fakeSubmitForm(params) {
  return request(`${PrescriptionUrl}/prescription/manager/insertCompleteModal`, {
    method: 'POST',
    data: params,
  });
}
