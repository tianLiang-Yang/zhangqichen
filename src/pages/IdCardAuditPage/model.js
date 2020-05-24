import { fetchList, fetchStatistics, fetchDoctorDetial, fetchDoctorHistory, updateAuditStatus } from './service';
import { message } from 'antd';
import { TAB_PASS } from './help/Colums'

const Model = {
  namespace: 'idCardQualification',
  state: {
    isLoadding: false,
    // 已通过
    passResult: {
      data: {
        object: [],
      },
    },
    // 已取消
    cancleResult: {
      data: {
        object: [],
      },
    },
    // 资质审核统计数据
    userDrverifyCount: {
    },
    // 医生资质审核信息
    doctorAduit: {},
    // 历史记录
    doctorAduitHistroy: {
      data: {
        object: [],
      },
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'toLoadding', payload: true });
      const data = yield call(fetchList, payload);
      try {
        if (data.code === 200) {
          yield put({
            type: 'queryList',
            payload: data,
            flag: payload.status,
          });
          yield put({ type: 'toLoadding', payload: false });
        }
      } catch (e) {
        console.log(e)
      }
    },
    *fetchStatics({ payload }, { call, put }) {
      const data = yield call(fetchStatistics, payload);
      if (data.code === 200) {
        yield put({
          type: 'toStatics',
          payload: data,
        });
      }
    },
    *fetchDoctorDetial({ payload }, { call, put }) {
      const { cb, ...rest } = payload;
      const data = yield call(fetchDoctorDetial, rest);
      yield put({
        type: 'queryDoctor',
        payload: data.data,
        flag: payload.flag,
      });
      if (cb != null) { cb(data) }
    },
    *fetchDoctorHistory({ payload }, { call, put }) {
      yield put({ type: 'toLoadding', payload: true });
      const data = yield call(fetchDoctorHistory, payload);
      try {
        if (data.code === 200) {
          yield put({
            type: 'queryDoctorHistroy',
            payload: data,
            flag: payload.flag,
          });
          yield put({ type: 'toLoadding', payload: false });
        }
      } catch (e) {
        console.log(e)
      }
    },
    *updateAuditStatus({ payload }, { call }) {
      const { cb, ...rest } = payload;
      const data = yield call(updateAuditStatus, rest);
      try {
        if (data.code === 200) {
          message.info('操作成功')
          if (cb !== null) { cb() }
        } else {
          message.error(data.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
  reducers: {
    queryList(state, action) {
      const flag = Number(action.flag);
      if (flag === TAB_PASS) {
        return { ...state, passResult: action.payload };
      }
        return { ...state, cancleResult: action.payload };
    },
    toStatics(state, action) {
      return { ...state, userDrverifyCount: action.payload };
    },
    toLoadding(state, action) {
      return { ...state, isLoadding: action.payload };
    },
    queryDoctor(state, action) {
      return { ...state, doctorAduit: action.payload };
    },
    queryDoctorHistroy(state, action) {
      return { ...state, doctorAduitHistroy: action.payload };
    },
  },
};
export default Model;
