import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant';
export async function fakeAccountLogin(params) {
  return request(`${BaseUrl}/manage/health/BaOrguserController/loginManage`, {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`${BaseUrl}/manage/verification/getVerificationCode/loginManage?phone=${mobile}`);
}
