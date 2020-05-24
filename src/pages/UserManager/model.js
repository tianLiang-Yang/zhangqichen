import { fetchMoblieList, fetchUserInfo, fetchSysUserList, AddSysUser, resetPw, deleteSysUser,
  getSysMainData, openMobileAccount, stopMobileAccount, buOrguserStatus, updateSysUserInfo, fetchSysHistoryList, deleteMobileUser, addDoctor } from './service';
import { fetchOrgList, fetchRoleList, fetchProvinceList, fetchCityList, fetchDicList, fetchDicOtherList } from '@/services/dic'
import { message } from 'antd';

const Model = {
  namespace: 'userManage',
  state: {
    clickable: true,
    isLoadding: false,
    // 移动端用户管理
    mobileRes: {
      data: {
        object: [],
      },
    },
    // 系统用户管理
    systemUserRes: {
      data: {
        object: [],
      },
    },
    // 系统用户详情数据
    userDetial: {},
    // 系统用户历史记录
    sysHistory: {
      data: {
        object: [],
      },
    },
    orgRes: { // 机构列表
      data: [],
    },
    roleRes: { // 角色列表
      data: [],
    },
    // 字典表
    queryArr: {},
    // 省列表
    provinceList: [],
    // 市列表
    cityList: [],
    // 证件类型
    authTypeList:[]
  },
  effects: {
    // 查询移动端用户列表
    *fetchMoblieList({ payload }, { call, put }) {
      const data = yield call(fetchMoblieList, payload);
      try {
        if (data.code === 200) {
          yield put({
            type: 'toMoblieList',
            payload: data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 起号
    *openMobileAccount({ payload }, { call }) {
      const { cb, ...reset } = payload
      try {
        const data = yield call(openMobileAccount, reset);
        if (data.code === 200) {
          if(cb) cb()
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 封号
    *stopMobileAccount({ payload }, { call }) {
      const { cb, ...reset } = payload
      try {
        const data = yield call(stopMobileAccount, reset);
        if (data.code === 200) {
          if(cb) cb()
        }
      } catch (e) {
        console.log(e);
      }

    },
    // 移动端添加医生
    *addDoctor({ payload }, { call }) {
      try {
        const data = yield call(addDoctor, payload.data);
        if (data.code === 200) {
         const {cb} = payload
          if(cb) cb()
        }else if(data.code === 603){
          message.info('用户名或手机号已存在')
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 查询移动端用户详情
    *fetchUserInfo({ payload }, { call, put }) {
      const data = yield call(fetchUserInfo, payload);
      console.log('fetchUserInfo', data)
      try {
        if (data.code === 200) {
          yield put({
            type: 'toUserInfo',
            payload: data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 查询证件类型
    *fetchDicOtherList({ payload }, { call, put }) {
      const data = yield call(fetchDicOtherList, payload.data);
      try {
        if(data){
          yield put({
            type: 'toAuthTypeList',
            payload: Array.isArray(data) ? data : [],
          });
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 查询系统用户列表
    *fetchSysUserList({ payload }, { call, put }) {
      yield put({ type: 'toLoadding', payload: true });
      const data = yield call(fetchSysUserList, payload);
      try {
          if (data.code === 200) {
            yield put({
              type: 'toSysUserList',
              payload: data,
            });
          }
        } catch (e) {
          console.log(e);
        }
      yield put({ type: 'toLoadding', payload: false });
    },
    // 查询系统用户历史操作记录
    *fetchSysHistoryList({ payload }, { call, put }) {
      yield put({ type: 'toLoadding', payload: true });
      console.log('查询系统用户历史操作记录', payload)
      const data = yield call(fetchSysHistoryList, payload);
      try {
        if (data.code === 200) {
          yield put({
            type: 'toSysHistoryList',
            payload: data,
          });
        }
      } catch (e) {
        console.log(e);
      }
      yield put({ type: 'toLoadding', payload: false });
    },
    // 添加系统用户
    *AddSysUser({ cb, param }, { call, put }) {
      try {
        message.destroy();
        yield put({ type: 'toClickable', payload: false });
        const data = yield call(AddSysUser, param);
        if (data.code === 200) {
          message.success('成功添加用户')
          if (cb != null) { cb() }
        } else {
          message.error(data.msg)
        }
        yield put({ type: 'toClickable', payload: true });
      } catch (e) {
        console.log(e);
        yield put({ type: 'toClickable', payload: true });
      }
    },
    // 修改系统用户
    *updateSysUser({ cb, param }, { call }) {
      message.destroy();
      const data = yield call(updateSysUserInfo, param);
      try {
        if (data.code === 200) {
          message.success('修改用户操作成功')
          if (cb != null) { cb() }
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除系统用户
    *deleteSysUser({ payload }, { call }) {
      message.destroy();
      const { cb, ...rest } = payload;
      const data = yield call(deleteSysUser, rest);
      try {
        if (data.code === 200) {
          if (cb) { cb(1) }
          message.success('成功删除用户')
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
    *deleteMobileUser({ payload }, { call }) {
      message.destroy();
      const { cb, ...rest } = payload;
      const data = yield call(deleteMobileUser, rest);
      try {
        if (data.code === 200) {
          if (cb) { cb(1) }
          message.success('成功删除用户')
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 重置用户密码
    *resetPw({ payload }, { call }) {
      message.destroy();
      const { cb, orgUserId } = payload;
      const data = yield call(resetPw, orgUserId);
      try {
        if (data.code === 200) {
          if (cb != null) { cb(2) }
          message.success('重置密码成功')
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 封号和起号
    *buOrguserStatus({ payload }, { call }) {
      const { cb, ...reset } = payload;
      const data = yield call(buOrguserStatus, reset);
      try {
        if (data.code === 200) {
          if (cb != null) { cb(2) }
          message.destroy();
          if (payload.beforeStatus === 1) {
            message.success('封号操作成功')
          } else {
            message.success('启号操作成功')
          }
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取主要信息
    *getSysMainData({ payload }, { call, put }) {
      const data = yield call(getSysMainData, payload);
      try {
        if (data.code === 200) {
          yield put({
            type: 'toSysMainData',
            payload: data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 查询机构列表
    *fetchOrgList({ payload }, { call, put }) {
      const data = yield call(fetchOrgList, payload);
      try {
        if (data.code === 200) {
          yield put({
            type: 'toOrgList',
            payload: data,
          });
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 查询角色列表
    *fetchRoleList({ payload }, { call, put }) {
      const data = yield call(fetchRoleList, payload);
      try {
        if (data.code === 200) {
          yield put({
            type: 'toRoleList',
            payload: data,
          });
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 查询省列表
    *fetchProvinceList({ payload }, { call, put }) {
      const { cb, ...reset } = payload
      const data = yield call(fetchProvinceList, reset);
      try {
        if (data.code === 200) {
          yield put({
            type: 'toProvinceList',
            payload:data,
          });
          if(cb)cb(data.data)
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 查询市
    *fetchCityList({ payload }, { call, put }) {
      const { cb, ...reset } = payload
      const data = yield call(fetchCityList, reset);
      try {
        if (data.code === 200) {
          yield put({
            type: 'toCityList',
            payload: data.data,
          });
          if(cb) cb(data.data)
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 查字典
    *fetchDicList({ payload }, { call, put }) {
      const data = yield call(fetchDicList, payload);
      try {
        if (data.code === 200) {
          yield put({
            type: 'toDicList',
            payload: data.data,
          });
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  reducers: {

    // 证件类型
    toAuthTypeList(state, action) {
      return { ...state, authTypeList: action.payload };
    },
    // 是否可点击
    toClickable(state, action) {
      return { ...state, clickable: action.payload };
    },
    // 查询移动端用户列表
    toMoblieList(state, action) {
      return { ...state, mobileRes: action.payload };
    },

    // 查询系统用户列表
    toSysUserList(state, action) {
      return { ...state, systemUserRes: action.payload };
    },
    toLoadding(state, action) {
      return { ...state, isLoadding: action.payload };
    },
    // 系统用户详情
    toSysMainData(state, action) {
      return { ...state, userDetial: action.payload };
    },
    // 移动用户详情
    toUserInfo(state, action) {
      return { ...state, userDetial: action.payload };
    },
    // 查询机构列表
    toOrgList(state, action) {
      return { ...state, orgRes: action.payload };
    },
    // 查询角色列表
    toRoleList(state, action) {
      return { ...state, roleRes: action.payload };
    },
    // 查询省
    toProvinceList(state, action) {
      return { ...state, provinceList: action.payload.data };
    },
    // 查询市
    toCityList(state, action) {
      return { ...state, cityList: action.payload };
    },
    // 查字典
    toDicList(state, action) {
      return { ...state, queryArr: action.payload };
    },
    // 系统用户历史操作记录
    toSysHistoryList(state, action) {
      return { ...state, sysHistory: action.payload };
    },

  },
};
export default Model;
