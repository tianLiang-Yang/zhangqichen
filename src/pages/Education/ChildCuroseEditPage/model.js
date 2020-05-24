import { getClassListPage, addBaseInfo, updateData, ClassCourseDelete, getBaThrongList,
 CourseUSubmit, classCourseInsert, getChildList, childCourseUpdate, classCourseDetial
} from './service';
import { message } from "antd";

const Model = {
  namespace: 'eduAddModule',
  state: {
    isClickable:true,
    courseId:'',
    childList:[],
    ThrongList:[],
    allList:[],
    ctstamp:'',
    coverImgUrl:'',
  },
  effects: {
    // 查看课堂详情
    *classCourseDetial({payload}, {call}) {
      try {
        const response = yield call(classCourseDetial, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb( response.data) }
          message.info(response.msg)
        }else{
          message.error(response.msg)
        }
        // eslint-disable-next-line no-empty
      }catch (e) {
      }
    },
    * addBaseInfoHttp({payload}, {call, put}) {
      try {
        const response = yield call(addBaseInfo, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb( response.data) }
          message.info(response.msg)
          yield put({type: 'toSaveId', payload: response.data ,});
          yield put({type: 'toCtstampstate', payload: response.data ,});
        }else{
          message.error(response.msg)
        }
        yield put({type: 'toIsClickable', payload: true});
      }catch (e) {
        yield put({type: 'toIsClickable', payload: true});
      }
    },
    * updateData({payload}, { call, put }) {
      try {
        yield put({type: 'toIsClickable', payload: false});
        const response = yield call(updateData, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb !== null) { cb() }
        }else{
          message.error(response.msg)
        }
        yield put({type: 'toIsClickable', payload: true});
      }catch (e) {
        yield put({type: 'toIsClickable', payload: true});
      }
    },

    *getChildList({payload}, {call, put}) {
      try {
        const response = yield call(getChildList, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          yield put({
            type: 'toChildList',
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

    *classCourseInsert({payload}, { call, put }) {
      try {
        yield put({type: 'toIsClickable', payload: false});
        const response = yield call(classCourseInsert, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb !== null) { cb() }
        }else{
          message.error(response.msg)
        }
        yield put({type: 'toIsClickable', payload: true});
      }catch (e) {
        yield put({type: 'toIsClickable', payload: true});
      }
    },

    *tochildCourseUpdate({payload}, { call, put }) {
      try {
        yield put({ type: 'toIsClickable', payload: false});
        const response = yield call(childCourseUpdate, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if(cb)  cb();
        }
        else{
          message.error(response.msg)
        }
        yield put({ type: 'toIsClickable', payload: true});
      }catch (e) {
        yield put({ type: 'toIsClickable', payload: true});
      }
    },

    *CourseUSubmit({payload}, { call, put }) {
      try {
        yield put({ type: 'toIsClickable', payload: false});
        const response = yield call(CourseUSubmit, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          message.info('提交审核结果成功')
          if (cb !== null) { cb() }
        }else{
          message.error(response.msg)
        }
        yield put({ type: 'toIsClickable', payload: true });
      }catch (e) {
        yield put({ type: 'toIsClickable', payload: true });
      }
    },

    *getBaThrongList({payload}, {call, put}) {
      try {
        const response = yield call(getBaThrongList, payload);
        if (response.code === 200) {
          yield put({type: 'toLoadding', payload: false });
          yield put({
            type: 'toBaThrongList',
            payload: Array.isArray(response.data) ? response.data : [] ,
          });
        }
      }catch (e) {
        console.log('tochildCourseUpdate',e)
      }
    },

    * getClassListPage({payload}, {call, put}) {
      try {
        yield put({type: 'toLoadding', payload: true });
        const response = yield call(getClassListPage, payload);
        if (response.code === 200) {
          yield put({type: 'toLoadding', payload: false });
          yield put({
            type: 'toClassListPage',
            payload: response.data ,
          });
        }
      }catch (e) {
        console.log('tochildCourseUpdate',e)
      }
    },

    *ClassCourseDelete({payload}, {call}) {
      try {
        const { cb, ...rest } = payload;
        const response = yield call(ClassCourseDelete, rest);
        if (response.code === 200) {
          if(cb)  cb();
        }
      }catch (e) {
        console.log('tochildCourseUpdate',e)
      }
    },


    *updateCoverImage({payload}, {put}) {
      try {
        yield put({
          type: 'toCoverImg',
          payload: payload.data,
        });
      }catch (e) {
        console.log('tochildCourseUpdate',e)
      }
    },
  },

  reducers: {

    toIsClickable(state, action) {
      return { ...state, isClickable: action.payload};
    },

    toSaveId(state, action) {
      return { ...state, courseId: action.payload.classId};
    },
    toCtstampstate(state, action) {
      return { ...state, ctstamp:action.payload.ctstamp };
    },

    toChildList(state, action) {
      return { ...state, childList: action.payload };
    },
    toQueryDetial(state, action) {
      return { ...state, detialData: action.payload };
    },
    queryList(state, action) {
      return { ...state, allList: action.payload };
    },
    toBaThrongList(state, action) {
      return { ...state, ThrongList: action.payload };
    },
    toClassListPage(state, action) {
      return { ...state, listResult: action.payload };
    },
    toLoadding(state, action) {
      return { ...state, isLoadding: action.payload };
    },
    toCoverImg(state, action) {
      return { ...state, coverImgUrl: action.payload};
    },
  },
};
export default Model;
