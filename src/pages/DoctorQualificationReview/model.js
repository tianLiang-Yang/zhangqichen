import { fetchList, fetchStatistics, fetchDoctorDetial, fetchDoctorHistory, updateAuditStatus } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'doctorQualificationReview',
  state: {
    isLoadding: false,
    // 待审核
    wattingResult: {
      data: {
        object: [],
      },
    },
    // 已通过
    passResult: {
      data: {
        object: [],
      },
    },
    // 已驳回
    rejectedResult: {
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
      data: {
      },
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
      console.log('updateAuditStatus', rest)
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
      if (flag === 1) {
        return { ...state, wattingResult: action.payload };
      }
      if (flag === 2) {
        return { ...state, passResult: action.payload };
      }
      if (flag === 3) {
        return { ...state, rejectedResult: action.payload };
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
