import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'

// export async function getAllClassList(params) {
//   return request(`${BaseUrl}/classroom/ClassType/getTreeList`, {
//     params,
//   });
// }


// 课堂列表的接口
export async function fetchList(data) {
  return request.post(`${BaseUrl}/classroom/Class/getList`, {
    data
  });
}

// 课堂课程列表的接口
export async function fetchChildList(data) {
  return request.post(`${BaseUrl}/classroom/ClassCourse/getList`, {
    data
  });
}

//   课堂删除
export async function ClassDelete(params) {
  return request.put(`${BaseUrl}/classroom/Class/delete`, {
    params,
  });
}


// 课堂发布
export async function classRelease(data,) {
  return request.post(`${BaseUrl}/classroom/Class/release`, {
    data
  });
}

// 课程发布
export async function classCourseRelease(data,) {
  return request.post(`${BaseUrl}/classroom/ClassCourse/release`, {
    data
  });
}

// 课程下架
export async function classCourseDown (data,) {
  return request.post(`${BaseUrl}/classroom/Class/updateManualCancel`, {
    data
  });
}


// 课堂取消
export async function classCancle (data,) {
  return request.post(`${BaseUrl}/classroom/Class/cancel`, {
    data
  });
}



