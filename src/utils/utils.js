import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { BaseUrl } from '@/utils/Constant'
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return false;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const FLAG_ADD = 'add' // 添加
export const FLAG_EDIT = 'edit' // 编辑 修改
export const FLAG_SUBMIT = 'submit' // 提交
export const FLAG_SEE = 'see' // 查看
export const FLAG_DELETE = 'delete' // 查看
export const FLAG_NO_USER = 'nouse' // 停用 下架
export const FLAG_USER = 'use' //  启用
export const FLAG_RELEASE = 'release' // 发布
export const FLAG_CANCLE = 'cancle' // 取消
export const FLAG_AUDIT = 'audit' // 取消
export const FLAG_REPUBLISH = 'republish' // 重发
export const FLAG_DELAY_RELEASE = 'delayRealse' // 延期发布

// 人群
export const PEOPLE_LOCAL = 'togetLocalList' //  获取本地数据
export const PEOPLE_NET_ALL = 'togetNetList' // 获取网络全部数据
export const PEOPLE_NET_ID = 'togetNetListById' // 获取网络全部数据根据ID查询

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

/**
 * @param limit 限制字数
 * @param str
 */
export const getlimitStr = (limit, str) => {
  if (str === null || undefined === str) {
    return '';
  }
  if (str.length > limit) {
    return `${str.slice(0, limit)}...`;
  }
    return str;
}

export const expanedeStyle = (col = 5) =>{
  setTimeout(()=>{
    const trs = document.getElementsByClassName('ant-table-expanded-row ant-table-expanded-row-level-1');
    for (let i = 0; i < trs.length; i++) {
      if(trs[i]){
        const tds =trs[i].getElementsByTagName("td")
        const td2 = tds[1]
        td2.colSpan = `${col}`
      }
    }
  },50)

}

/**
 * 对象是否为空
 * @param str
 */
export const isEmpty = (obj) => {
  if (obj === null || undefined === obj || obj === '' || obj === 'null') {
    return true;
  }
  return false;
}

/**
 * 对象是否为空，并返回值
 * @param str
 */
export const handleEmptyStr = (obj) => {
  if (obj === null || undefined === obj) {
    if (isNumber(obj)) {
      return 0;
    }
    return '';
  }
  return obj;
}

// export const handleImageUrl = (url) => `${BaseUrl}/manage${handleEmptyStr(url)}`

export const handleImageUrl = (url) => handleEmptyStr(url)

function isNumber(num) {
  const regPos = / ^\d+$/; // 非负整数
  const regNeg = /^\-[1-9][0-9]*$/; // 负整数
  if (regPos.test(num) || regNeg.test(num)) {
    return true;
  }
    return false;
}


// 时间类比较
export const commpareDate = (starttime, endTime) => {
  // 时间类比较
  const start = new Date(Date.parse(starttime));
  const end = new Date(Date.parse(endTime));
  // 进行比较
  return start > end
}
// 时间戳
export const commpareTime = (starttime, endTime) => {
  // 时间类比较
  const start = Date.parse(starttime);
  const end = new Date.parse(endTime);
  // 进行比较
  return start > end
}

// 保存上级路径
export const SaveUperrUrl = (props, url) => {
  const { dispatch } = props;
  dispatch({
    type: 'settings/chanageUppelevelUrl',
    payload: {
      url,
    },
  });
}

/**
 * 时间戳 转 时间字符串
 * @param {Number} time_stamp 10位数的时间戳（秒值：1404958872）
 * @returns {String} 时间字符串 （格式"2014-07-10 10:21:12"）
 */
// eslint-disable-next-line @typescript-eslint/camelcase
export const toTimestr = date => {
  const time = new Date(date );
  const Y = time.getFullYear()
  const M = (time.getMonth() + 1).toString().padStart(2, '0')
  const D = time.getDate().toString().padStart(2, '0')
  const h = time.getHours().toString().padStart(2, '0')
  const m = time.getMinutes().toString().padStart(2, '0')
  const s = time.getSeconds().toString().padStart(2, '0')
  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}

/**
 * 时间戳 转 时间字符串
 */
export const toTimestr2 = date => {
  const time = new Date(date );
  const Y = time.getFullYear()
  const M = (time.getMonth() + 1).toString().padStart(2, '0')
  const D = time.getDate().toString().padStart(2, '0')
  return `${Y}/${M}/${D}`
}




/**
 * 指定h获取数组的前几位
 * @returns {[]}
 */
export const getArrayOfIndex = (count, array) => {
  const newList = []
  for (let i = 0; i < array.length ; i++) {
    if( count > i){
      newList.push(array[i])
    }
  }
  return newList
}


/**
 * 指定删除数组的元素
 * @returns {[]}
 */
export const deleteArrayOfIndex = (index, array) => {
  const newList = []
  for (let i = 0; i < array.length ; i++) {
    if( index !== i){
      newList.push(array[i])
    }
  }
  return newList
}

/**
 * 指定删除数组的元素
 * @returns {[]}
 */
export const deleteLastChart = (value) => {
  if(value)
    return value.substr(0, value.length-1)
  return ''
}

// 添加keyList
export const addKeyToList = (list) => {
  const newList = []
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < list.length; i++) {
    newList.push({... list[i], key:list[i].classId })
  }
  return newList
}




export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
