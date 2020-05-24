import {isEmpty} from "@/utils/utils";

export const SESSION_ORGDATA = 'SESSION_ORGDATA' // 机构信息 - 家已签约


/**
 * 存储当前选中的机构
 * @param data
 */
export function setOrgData(data) {
  localStorage.setItem(SESSION_ORGDATA,JSON.stringify(data))
}

export function getOrgData() {
  const data = localStorage.getItem(SESSION_ORGDATA)
  if(isEmpty(data)){
    return null
  }
    return JSON.parse(data)
}


/**
 * 存储当前选中的课程
 * @param data
 */
export function setCurrentClassCourse(data) {
  sessionStorage.setItem(SESSION_ORGDATA,data ? JSON.stringify(data): null)
}

export function getCurrentClassCourse() {
  const data = sessionStorage.getItem(SESSION_ORGDATA)
  if(data){
    return JSON.parse(data)
  }
  return null
}


