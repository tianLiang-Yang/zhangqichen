import { fetchList, fetchDetialList } from './service';

const Model = {
  namespace: 'baseDictionary',
  state: {
    isLoadding: false,
    // 待审核
    dictionaryRes: {
      data: {
        object: [],
      },
    },
    dictionaryListRes: {
      data: {
        object: [],
      },
    },
  },
  effects: {
    *fetchDictionaryRes({ payload }, { call, put }) {
      yield put({ type: 'toLoadding', payload: true });
      const data = yield call(fetchList, payload);
      try {
        if (data.code === 200) {
          yield put({
            type: 'queryList',
            payload: data,
          });
          yield put({ type: 'toLoadding', payload: false });
        }
      } catch (e) {
        console.log(e)
      }
    },
    *fetchDetialListbyId({ payload }, { call, put }) {
      console.log('fetchDictionaryRes', payload)
      yield put({ type: 'toLoadding', payload: true });
      const data = yield call(fetchDetialList, payload);
      console.log('fetchDictionaryRes', data)
      if (data.code === 200) {
        yield put({
          type: 'toDetialList',
          payload: data,
        });
      }
      yield put({ type: 'toLoadding', payload: false });
    },
  },
  reducers: {
    queryList(state, action) {
        return { ...state, dictionaryRes: action.payload };
    },
    toDetialList(state, action) {
      console.log('queryList', action.payload)
      return { ...state, dictionaryListRes: action.payload };
    },
  },
};
export default Model;
