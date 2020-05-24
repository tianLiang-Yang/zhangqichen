import { getClassListPage, addClass, getAllClassList, updateData, queryDetial,
  updateManualCancele, updateManualRelease,
} from './service';
import { message } from "antd";

const Model = {
  namespace: 'eduClassModule',
  state: {
    isLoadding:true,
    listResult: {},
    allList:[],
    detialData: {},
  },
  effects: {
    * getAllClassList({payload}, {call, put}) {
      try {
        const response = yield call(getAllClassList, payload.data);
        if (response.code === 200) {
          yield put({
            type: 'queryList',
            payload: Array.isArray(response.data) ? response.data : [],
          });
        }
      }catch (e) {
        console.log(e)
      }
    },

    * fetchAddClass({ payload }, { call, put }) {
      try {
        const response = yield call(addClass, payload.data);
        const { cb } = payload;
        if (response.code === 200) {
          if (cb !== null) { cb(true) }
        }else{
          if (cb !== null) { cb(false) }
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    * updateManualRelease({payload}, {call, put}) {
      try{
        const response = yield call(updateManualRelease, payload.id);
        if (response.code === 200) {
          yield put({
            type: 'toQueryDetial',
            payload: response.data ,
          });
          const { cb } = payload;
          if (cb !== null) { cb() }
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    * updateManualCancele({payload}, {call, put}) {
      try{
        const response = yield call(updateManualCancele, payload.id);
        if (response.code === 200) {
          yield put({
            type: 'toQueryDetial',
            payload: response.data ,
          });
          const { cb } = payload;
          if (cb !== null) { cb() }
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    * queryDetial({payload}, {call, put}) {
      try{
      const response = yield call(queryDetial, payload.data);
        if (response.code === 200) {
          yield put({
            type: 'toQueryDetial',
            payload: response.data ,
          });
          const { cb } = payload;
          if (cb !== null) { cb() }
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },

    * updateData({payload}, {call, put}) {
      const response = yield call(updateData, payload.data);
      const { cb } = payload;
      if (response.code === 200) {
        if (cb !== null) { cb(true) }
      }else{
        if (cb !== null) { cb(false) }
        message.error(response.msg)
      }
    },

    * getClassListPage({payload}, {call, put}) {
      yield put({type: 'toLoadding', payload: true });
      const response = yield call(getClassListPage, payload);
      if (response.code === 200) {
        yield put({type: 'toLoadding', payload: false });
        yield put({
          type: 'toClassListPage',
          payload: response.data ,
        });
      }
    },
  },

  reducers: {
    toQueryDetial(state, action) {
      return { ...state, detialData: action.payload };
    },
    queryList(state, action) {
      return { ...state, allList: action.payload };
    },

    toClassListPage(state, action) {
      return { ...state, listResult: action.payload };
    },

    toLoadding(state, action) {
      return { ...state, isLoadding: action.payload };
    },
  },
};
export default Model;
