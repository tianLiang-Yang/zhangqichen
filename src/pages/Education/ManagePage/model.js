import { fetchList, fetchChildList, ClassDelete, classCourseDown, classCourseRelease, classCancle, classRelease } from './service';
import {  TABLE_KEY_NO_COMMIT, TABLE_KEY_NO_AUDIT,
       TABLE_KEY_WATTING_REALEASE, TABLE_KEY_NO_PASS, TABLE_KEY_REALEASE,
      }  from './help/Colums'
import {addKeyToList} from "@/utils/utils";
import {message} from "antd";

const Model = {
  namespace: 'eduManageModule',
  state: {
    isLoadding:true,
    noCommitListResult: { // 未提交
      object:[]
    },
    noAuditListResult: { // 未审核
      object:[]
    },
    wattingReleaseListResult: { // 待发布
      object:[]
    },
    noPassListResult: { // 未通过
      object:[]
    },
    releaseListResult: { // 已发布
      object:[]
    },
    downListResult: { // 已下架
      object:[]
    },
    noCommitListChildResult:{ // 追加子课程 未提交
      object:[]
    },
    noAuditListChildResult:{ // 追加子课程 未审核
      object:[]
    },
    WattingListChildResult:{ // 追加子课程 待发布
      object:[]
    },
    noPassListChildResult:{ // 追加子课程 已驳回
      object:[]
    },
    resourceType: 1 , // 1 - 视频 3 - 图文
  },
  effects: {
    * fetchList({payload}, {call, put}) {
      try{
      yield put({type: 'toLoadding', payload: true});
      const response = yield call(fetchList, payload.data);
      if (response.code === 200) {
        const myData = response.data
        if(response.data.object){
          myData.object = addKeyToList(response.data.object)
        }
        yield put({
          type: 'queryList',
          payload: { data: myData, tableKey: payload.data.status } ,
        });
        yield put({type: 'toLoadding', payload: false});
      }
      }catch (e) {
        yield put({type: 'toLoadding', payload: false});
      }
    },

    * classCancle({payload}, {call, put}) {
      yield put({type: 'toLoadding', payload: true});
      const response = yield call(classCancle, payload.data);
      if (response.code === 200) {
        const { cb } = payload
        if(cb) cb()
      }else{
        message.warn(response.msg)
      }
    },
    * fetchChildList({payload}, {call, put}) {
      yield put({type: 'toLoadding', payload: true});
      const response = yield call(fetchChildList, payload.data);
      if (response.code === 200) {
        const myData = response.data
        if(response.data.object){
          myData.object = addKeyToList(response.data.object)
        }
        yield put({
          type: 'queryChildList',
          payload: { data:myData, tableKey: payload.data.status } ,
        });
        yield put({type: 'toLoadding', payload: false});
      }
    },
    * ClassDelete({payload}, {call}) {
      try {
        const { cb, ...rest } = payload;
        const response = yield call(ClassDelete, rest);
        if (response.code === 200) {
          if(cb)  cb();
        }
      }catch (e) {
        console.log('tochildCourseUpdate',e)
      }
    },
    // 修改当前添加的课程类型
    * chanageResourceType({payload}, {put}) {
        yield put({type: 'toChanageResourceType', payload: payload.data});
    },
    // 课程发布
    *classCourseRelease({payload}, {call}) {
      try {
        const { cb, ...rest } = payload;
        const response = yield call(classCourseRelease, rest);
        if (response.code === 200) {
          if(cb)  cb();
        }
      }catch (e) {
        console.log('tochildCourseUpdate',e)
      }
    },
    *classRelease({payload}, {call}) {
      try {
        const { cb, ...rest } = payload;
        const response = yield call(classRelease, rest);
        if (response.code === 200) {
          if(cb)  cb();
        }
      }catch (e) {
        console.log('tochildCourseUpdate',e)
      }
    },
    // 课程下架
    *classCourseDown({payload}, {call}) {
      try {
        const { cb, ...rest } = payload;
        const response = yield call(classCourseDown, rest);
        if (response.code === 200) {
          if(cb)  cb();
        }
      }catch (e) {
        console.log('tochildCourseUpdate',e)
      }
    },
  },



  reducers: {
    queryList(state, action) {
      const tabkey = action.payload.tableKey
      console.log("queryList action", tabkey, typeof tabkey)
      const {data} = action.payload
      if(tabkey === TABLE_KEY_NO_COMMIT){
        console.log("queryList action2",data)
        return { ...state, noCommitListResult: data};
      }
      if(tabkey === TABLE_KEY_NO_AUDIT)
        return { ...state, noAuditListResult: data};
      if(tabkey === TABLE_KEY_WATTING_REALEASE)
        return { ...state, wattingReleaseListResult:data };
      if(tabkey === TABLE_KEY_NO_PASS)
        return { ...state, noPassListResult: data };
      if(tabkey === TABLE_KEY_REALEASE)
        return { ...state, releaseListResult: data };
      return { ...state, downListResult: data }
    },

    queryChildList(state, action) {
      const tabkey = action.payload.tableKey
      const {data} = action.payload
      if(tabkey === "4"){
        return { ...state, WattingListChildResult: data };
      }
      if ( tabkey === "0") {
        return { ...state, noCommitListChildResult : data}
      }
      if( tabkey === "1"){
        return { ...state, noAuditListChildResult : data}
      }
        return { ...state, noPassListChildResult: data };
    },

    toLoadding(state, action) {
      return { ...state, isLoadding: action.payload };
    },

    toChanageResourceType(state, action) {
      return { ...state, resourceType: action.payload };
    },
  },
};
export default Model;
