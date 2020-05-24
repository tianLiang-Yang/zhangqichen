import { getPeopleClassListSelect, addClass, getPeopleClassList,
  queryClassDetial, deleteClassById, updateClass ,
  addDynnmicPeoole, deletePeopleById, queryPeopleDetial, addStaticPeoole,
  updateBaThrong, addStaticUser, deleteBaThrongUser, updateBaThrongS, updateBaThrongD
} from './service';
import { message } from "antd";

const Model = {
  namespace: 'peopleModule',
  state: {
    isLoadding:true,
    peopleClassListResult:[],
    peopleClassDetial:{},

    PeopleDetial: {}, // 人群详情

    selectStaticList: [], // 选中的静态人群
    selectStaticDeleteList: [], // 选中删除的静态人群
    listResult: {},
    allList:[],
    detialData: {},
  //  开始 ----

  //   静态人群添加
    throngId: undefined,
  },
  effects: {
    // 人群分类
    * AddClassHttp({payload}, {call}) {
      try {
        const response = yield call(addClass, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    *updateBaThrongD({payload}, {call}) {
      try {
        const response = yield call(updateBaThrongD, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    *updateBaThrongS({payload}, {call}) {
      try {
        const response = yield call(updateBaThrongS, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    *updateClass({payload}, {call}) {
      try {
        const response = yield call(updateClass, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    * getPeopleClassListSelect({payload}, {call, put}) {
      const response = yield call(getPeopleClassListSelect, payload.data);
      if (response.code === 200) {
        yield put({
          type: 'toPeopleClassListSelect',
          payload: Array.isArray(response.data) ? response.data : [],
        });
      }
    },
    * getPeopleClassList({payload}, {call, put}) {
      yield put({type: 'toLoadding', payload: true });
      const response = yield call(getPeopleClassList, payload);
      if (response.code === 200) {
        yield put({type: 'toLoadding', payload: false });
        yield put({
          type: 'toPeopleClassListResult',
          payload: response.data ,
        });
      }
    },
    * queryClassDetial({payload}, {call, put}) {
      const response = yield call(queryClassDetial, payload.data);
      if (response.code === 200) {
        yield put({
          type: 'toQueryClassDetial',
          payload: response.data ,
        });
        const { cb } = payload;
        if (cb) { cb() }
      }else{
        message.error(response.msg)
      }
    },
    *deleteClassById({payload}, {call}) {
      const response = yield call(deleteClassById, payload.data);
      try{
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    *updateBaThrong({payload}, {call}) {
      try {
        const response = yield call(updateBaThrong, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    // ----------------分群管理--------------
    *addStaticPeoole({payload}, {call, put }) {
      try {
        const response = yield call(addStaticPeoole, payload.data);
        if (response.code === 200) {
          yield put({type: 'toThrongId', payload: response.data });
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },

    *addStaticUser({payload}, {call}) {
      try {
        const response = yield call(addStaticUser, payload);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },

    *addDynnmicPeoole({payload}, {call}) {
      try {
        const response = yield call(addDynnmicPeoole, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    *deletePeopleById({payload}, {call}) {
      const response = yield call(deletePeopleById, payload.data);
      try{
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    *deleteBaThrongUser({payload}, {call}) {
      const response = yield call(deleteBaThrongUser, payload.data);
      try{
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb() }
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    *queryPeopleDetial({payload}, {call, put}) {
      const response = yield call(queryPeopleDetial, payload.data);
      if (response.code === 200) {
        yield put({
          type: 'toQueryPeopleDetial',
          payload: response.data ,
        });
      }
    },
    * UpdateSelectStaticListRes({payload}, {put}) {
      try {
        yield put({
          type: 'toUpdateSelectStaticListRes',
          payload: payload.data,
        });
        const { cb } = payload;
        if(cb) cb()
      }catch (e) {
        console.log(e)
      }
    },
    * UpdateSelectDeleteListRes({payload}, {put}) {
      yield put({
        type: 'toUpdateSelectDeleteListRes',
        payload,
      });
    },
    *updateLoadding({payload}, { put}) {
      yield put({type: 'toLoadding', payload });
     },
    *updateThrongId({payload}, { put}) {
      yield put({type: 'toThrongId', payload });
    },

  },

  reducers: {
    toThrongId(state, action) {
      return { ...state, throngId: action.payload };
    },
    toPeopleClassListSelect(state, action) {
      return { ...state, peopleClassList: action.payload };
    },
    toQueryClassDetial(state, action) {
      return { ...state, peopleClassDetial: action.payload };
    },
    toPeopleClassListResult(state, action) {
      return { ...state, peopleClassListResult: action.payload };
    },
    toQueryPeopleDetial(state, action) {
      return { ...state, PeopleDetial: action.payload };
    },

    toLoadding(state, action) {
      return { ...state, isLoadding: action.payload };
    },
    toUpdateSelectStaticListRes(state, action) {
      return { ...state, selectStaticList: action.payload };
    },
    toUpdateSelectDeleteListRes(state, action) {
      return { ...state, selectStaticDeleteList: action.payload };
    },
  },
};
export default Model;
