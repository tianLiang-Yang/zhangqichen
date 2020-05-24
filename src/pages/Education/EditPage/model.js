import { getClassListPage, addBaseInfo, updateData, ClassCourseDelete, getBaThrongList,
 CourseUSubmit, classCourseInsert, getChildList, childCourseUpdate, classCourseDetial,
  ClassCourseCheck, fetchClassRoomInfo, classCourseInfoDetialById,
} from './service';
import { message } from "antd";

const Model = {
  namespace: 'eduAddModule',
  state: {
    isClickable:true,
    courseId:'', // 课堂ID
    childList:[], // 子课程列表
    ThrongList:[], // 人群列表
    allList:[], //
    ctstamp:'',
    coverImgUrl:'', // 封面缩略图图片
    classRoomInfo: {} ,// 课堂的基本信息
    classCourseDetial:{} // 课程基本信息
  },
  effects: {
    // 查看课堂详情
    *classCourseDetial({payload}, {call}) {
      try {
        const response = yield call(classCourseDetial, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb( response.data) }
        }else{
          message.error(response.msg)
        }
        // eslint-disable-next-line no-empty
      }catch (e) {
      }
    },
    // 查看课程详情
    *classCourseInfoDetialById({payload}, { call, put }) {
      try {
        const response = yield call(classCourseInfoDetialById, payload.data);
        if (response.code === 200) {
          const { cb } = payload;
          if (cb) { cb( response.data) }
          yield put({ type: 'toclassCourseDetial', payload:  response?.data || response.data });
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
          yield put({type: 'toSaveId', payload: response.data.classId ,});
          yield put({type: 'toCtstampstate', payload: response.data ,});
        }else{
          message.error(response.msg)
        }
        yield put({type: 'toIsClickable', payload: true});
      }catch (e) {
        yield put({type: 'toIsClickable', payload: true});
      }
    },
    *updateClassId({payload}, { put}) {
      yield put({type: 'toSaveId', payload ,});
    },
    *updateData({payload}, { call, put }) {
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
    *fetchClassRoomInfoByclassId({payload}, {call, put}) {
      try {
        const response = yield call(fetchClassRoomInfo, payload.data);
        if (response.code === 200) {
          yield put({
            type: 'toClassRoomInfo',
            payload: response.data ? response.data : {},
          });
          const { cb } = payload
          if(cb) cb(response.data ? response.data : {})
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log('getChildList',e)
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
          if (cb) { cb( Array.isArray(response.data ) ? response.data : []) }
        }else{
          message.error(response.msg)

        }
      }catch (e) {
        console.log('getChildList',e)
      }
    },
    // 课程审核
    *ClassCourseCheck({payload}, { call, put }) {
      try {
        yield put({type: 'toIsClickable', payload: false});
        const response = yield call(ClassCourseCheck, payload.data);
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
      return { ...state, courseId: action.payload};
    },
    toCtstampstate(state, action) {
      return { ...state, ctstamp:action.payload.ctstamp };
    },
    toClassCourseDetial(state, action) {
      return { ...state, classCourseDetial:action.payload };
    },
    toClassRoomInfo(state, action) {
      return { ...state, classRoomInfo:action.payload };
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
