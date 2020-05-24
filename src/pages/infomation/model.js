import { releaseNewById, deleteNewById } from './service';
import { message } from "antd";

const Model = {
  namespace: 'infomationModule',
  state: {
   newManageList:[],
  },
  effects: {

    *deleteNewById({payload}, {call, put}) {
      try {
        const response = yield call(deleteNewById, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if(cb) cb()
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log('资讯管理---》',e)
      }
    },

    // 查询移动端用户详情
    *releaseNewById({ payload }, { call }) {
      try {
        const response = yield call(releaseNewById, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if(cb) cb()
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log('资讯管理---》',e)
      }
    },

  },

  reducers: {
    toNewsManageList(state, action) {
      return { ...state, newManageList: action.payload };
    },
  },
};
export default Model;
