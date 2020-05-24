import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'

//  根据课程Id查询所有子课程的接口
export async function getChildList(params) {
  return request(`${BaseUrl}/classroom/ClassCourse/getListByClassId`, {
    params,
  });
}

export async function getClassListPage(params) {
  return request(`${BaseUrl}/classroom/ClassType/getList`, {
    params,
  });
}

// 添加基础信息
export async function addBaseInfo(data) {
  return request.post(`${BaseUrl}/classroom/Class/insert`, {
    data
  });
}

//   设置课堂封面及其编辑其他
export async function updateData(data) {
  return request.post(`${BaseUrl}/classroom/Class/update`, {
    data
  });
}

//   课堂添加
export async function classCourseInsert(data) {
  return request.post(`${BaseUrl}/classroom/ClassCourse/insert`, {
    data
  });
}


//   课堂查看
export async function classCourseDetial(params) {
  return request.get(`${BaseUrl}/classroom/Class/getDetail`, {
    params
  });
}

//   课堂修改
export async function childCourseUpdate(data) {
  return request.post(`${BaseUrl}/classroom/ClassCourse/update`, {
    data
  });
}


//   课堂提交
export async function CourseUSubmit(data) {
  return request.post(`${BaseUrl}/classroom/Class/submit`, {
    data
  });
}

// 获取人群列表
export async function getBaThrongList(params) {
  return request(`${BaseUrl}/usergroup/health/baThrong/getBaThrongList`, {
    params,
  });
}


//   课程提交
export async function ClassCourseDelete(params) {
  return request.put(`${BaseUrl}/classroom/ClassCourse/delete`, {
    params,
  });
}





