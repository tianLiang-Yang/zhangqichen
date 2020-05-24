import { getNewsTypeList } from './service';
import { message } from "antd";

const Model = {
  namespace: 'editinfomation',
  state: {
    typeSelectList:[],
  },
  effects: {

    *getNewsTypeList({payload}, {call, put}) {
      try {
        const response = yield call(getNewsTypeList, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          yield put({
            type: 'toNewsTypeList',
            payload: Array.isArray(response.data ) ? response.data : [],
          });
          if (cb !== null) { cb( Array.isArray(response.data ) ? response.data : []) }
        }else{
          message.error(response.msg)

        }
      }catch (e) {
        console.log('getChildList',e)
      }
    },


  },

  reducers: {
    toNewsTypeList(state, action) {
      return { ...state, typeSelectList: action.payload };
    },
  },
};
export default Model;
