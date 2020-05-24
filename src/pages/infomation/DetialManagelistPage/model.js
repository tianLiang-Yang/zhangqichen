import { fetchList, } from './service';
// import { message } from 'antd';

const Model = {
  namespace: 'infomationManage',
  state: {
    isLoadding: false,
    // 未上架
    wattingResult: {
      data: {
        object: [],
      },
    },
    // 已上架
    passResult: {
      data: {
        object: [],
      },
    },
    // 已下架
    rejectedResult: {
      data: {
        object: [],
      },
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      console.log("管理明细--",payload)
      yield put({ type: 'toLoadding', payload: true });
      const data = yield call(fetchList, payload);
      console.log("管理明细--yield",data)
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
    toLoadding(state, action) {
      return { ...state, isLoadding: action.payload };
    },
  },
};
export default Model;
