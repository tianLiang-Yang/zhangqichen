import { addServicePack, updateServicePack, addServiceChildProject, getServiceChildProList,
         releaseServicePack, getOrgSerInfo, addOrgService, updateOrgService,
         getServiceProList, getTeamUserList, AddTeamUser, CreateTeam,deleteTeamUser,
         updateTeam, OpenTeam, getSerPackSelectList, updateTeamPack, deleteProChildSer,
         getSelectPackList, teamAddLeader, teamAddMaster, teamcancleMaster, downServicePack,
         deleteServicePack, deleteTeam, deleteTeamPack, getManageServePackInfo, forbirdTeam
        } from './service';
import { message } from "antd";

const Model = {
  namespace: 'healthHomeDoctorModule',
  state: {
    isLoadding: false,
    servicePackChildProList: [], // 服务包子项目列表
    isClickable: true, // 是否可点击
    orgServiceInfo: null, // 机构服务详情
    teamUserList: [], // 团队成员列表
    servicePackSelectList: [], // 获取团队可选服务包列表
    teamSelectPackList:[], // 获取团队已经选择的服务包列表
    ServePackInfo:null,  // 服务包详情
  },
  effects: {
    // 修改机构服务
    * updateOrgService({payload}, {call}) {
      try {
        const { cb, ...reset } = payload
        const response = yield call( updateOrgService, reset.data);
        if (response.code === 200) {
          if(cb) cb()
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 添加机构服务
    *addOrgService({payload}, {call}) {
      try {
        const { cb, ...reset } = payload
        const response = yield call( addOrgService, reset.data);
        if (Number(response.code)  === 200) {
          if(cb) cb()
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 添加服务包
    * addServicePack({payload}, {call,put}) {
      try {
        yield put({ type:'toIsClickable', payload: false })
        const response = yield call( addServicePack, payload.data);
        if (Number(response.code) === 200) {
          message.success(response.msg)
          const { cb } = payload;
          if (cb) { cb(response) }
        }else{
          message.error(response.msg)
        }
        yield put({ type:'toIsClickable', payload: true })
      }catch (e) {
        console.log(e)
      }
    },

    // 下架家医团队
    * forbirdTeam({payload}, { call }) {
      try {
        const { cb, ...reset } =  payload
        const response = yield call( forbirdTeam, reset.data);
        if (Number(response.code) === 200) {
          message.success(response.msg)
          if(cb) cb(response.data)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 获取服务包详情
    * getManageServePackInfo({payload}, { call, put }) {
      try {
        const { cb, ...reset } =  payload
        const response = yield call( getManageServePackInfo, reset);
        if (Number(response.code) === 200) {
          message.success(response.msg)
          yield put({
            type: 'toGetManageServePackInfo',
            payload: response.data,
          });
          if(cb) cb(response.data)
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 修改服务包
    * updateServicePack({payload}, {call,put}) {
      try {
        const response = yield call( updateServicePack, payload.data);
        if (Number(response.code) === 200) {
          message.success(response.msg)
          const { cb } = payload;
          if (cb) { cb(response) }
        }else{
          message.error(response.msg)
        }
        yield put({ type:'toIsClickable', payload: true })
      }catch (e) {
        console.log(e)
      }
    },
    // 添加子服务包
    * addServiceChildProject({payload}, {call,put}) {
      try {
        yield put({ type:'toIsClickable', payload: false })
        const response = yield call( addServiceChildProject, payload.data);
        if (Number(response.code) === 200) {
          const { cb } = payload;
          if (cb) { cb() }
          message.success(response.msg)
        }else{
          message.error(response.msg)
        }
        yield put({ type:'toIsClickable', payload: true })
      }catch (e) {
        console.log(e)
      }
    },

    * getServiceChildProList({payload}, {call, put}) {
      try {
        yield put({ type:'toLoadding', payload: true })
        const response = yield call(getServiceChildProList, payload);
        if (Number(response.code)  === 200) {
          yield put({
            type: 'toServicePackChildProList',
            payload: Array.isArray(response.data) ? response.data : [],
          });
          yield put({ type:'toLoadding', payload: false })
        }
      }catch (e) {
        console.log(e)
      }
    },
    * getServiceProList({payload}, {call, put}) {
      try {
        yield put({ type:'toLoadding', payload: true })
        const response = yield call(getServiceProList, payload);
        if (Number(response.code)  === 200) {
          yield put({
            type: 'toServicePackChildProList',
            payload: Array.isArray(response.data) ? response.data : [],
          });
          yield put({ type:'toLoadding', payload: false })
        }
      }catch (e) {
        console.log(e)
      }
    },
    //  获取团队可选服务包列表
    * getSerPackSelectList({payload}, {call, put}) {
      try {
        yield put({ type:'toLoadding', payload: true })
        const response = yield call(getSerPackSelectList, payload);
        if (Number(response.code)  === 200) {
          yield put({
            type: 'toSerPackSelectList',
            payload: Array.isArray(response.data) ? response.data : [],
          });
          yield put({ type:'toLoadding', payload: false })
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 获取团队已经选择的服务包列表
    * getSelectPackList({payload}, {call, put}) {
      try {
        yield put({ type:'toLoadding', payload: true })
        const { cb, ...reset } = payload
        const response = yield call(getSelectPackList, reset);
        if (Number(response.code)  === 200) {
          yield put({
            type: 'toSelectPackList',
            payload: Array.isArray(response.data) ? response.data : [],
          });
          if(cb){cb( Array.isArray(response.data) ? response.data : [])}
          yield put({ type:'toLoadding', payload: false })
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 发布服务包
    * releaseServicePack({payload}, {call,put}) {
      try {
        yield put({ type:'toIsClickable', payload: false })
        const response = yield call(releaseServicePack, payload.data);
        if (Number(response.code)  === 200) {
          message.info(response.msg)
          const { cb } = payload;
          if(cb) cb()
        }else{
          message.error(response.msg)
        }
        yield put({ type:'toIsClickable', payload: true })
      }catch (e) {
        console.log(e)
      }
    },
    // 删除团队
    * deleteTeam({ payload }, { call,  }) {
      const { cb, ...reset } = payload
      try {
        const response = yield call(deleteTeam,reset.data);
        if (Number(response.code)  === 200) {
          if(cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 删除团队服务包
    * deleteTeamPack({ payload }, { call, }) {
      const { cb, ...reset } = payload
      try {
        const response = yield call(deleteTeamPack,reset.data);
        if (Number(response.code)  === 200) {
          if(cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 获取机构服务包详情
    * getOrgSerInfo({ payload }, { call, put }) {
      try {
        const response = yield call(getOrgSerInfo, payload.data);
        if (Number(response.code)  === 200) {
          yield put({ type:'toOrgSerInfo', payload: response.data})
          const { cb } = payload
          if(cb) cb(response.data )
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 创建团队
    *CreateTeam({ payload }, { call,put }) {
      yield put({ type:'toIsClickable', payload: false })
      try {
        const response = yield call(CreateTeam, payload.data);
        if (Number(response.code)  === 200) {
          const { cb } = payload
          if(cb) cb(response)
          message.success('基本信息保存成功')
          yield put({ type:'toIsClickable', payload: true })
        }else{
          message.error(response.msg)
          yield put({ type:'toIsClickable', payload: true })
        }

      }catch (e) {
        console.log(e)
      }
    },
    // 发布团队
    *OpenTeam({ payload }, { call, put }) {
      yield put({ type:'toIsClickable', payload: false })
      try {
        const response = yield call(OpenTeam, payload.data);
        if (Number(response.code)  === 200) {
          const { cb } = payload
          if(cb) cb()
          message.success('发布成功')
        }else{
          message.error(response.msg)
        }
        yield put({ type:'toIsClickable', payload: true })
      }catch (e) {
        console.log(e)
      }
    },
    // 修改团队信息
    *updateTeam({ payload }, { call,put }) {
      yield put({ type:'toIsClickable', payload: false })
      try {
        const response = yield call(updateTeam, payload.data);
        if (Number(response.code)  === 200) {
          const { cb } = payload
          if(cb) cb(response)
          message.success('基本信息保存成功')
        }else{
          message.error(response.msg)
        }
        yield put({ type:'toIsClickable', payload: true })
      }catch (e) {
        console.log(e)
      }
    },

    *AddTeamUser({ payload }, { call }) { // 新增团队成员
      try {
        const response = yield call(AddTeamUser, payload.data);
        if (Number(response.code)  === 200) {
          const { cb } = payload
          if(cb) cb(response.data)
          message.success('新增团队成员成功')
        }else{
          message.error(response.msg)
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 获取团队成员列表
    *getTeamUserList({ payload }, { call, put }) {
      try {
        const { cb, ...reset } = payload
        const response = yield call(getTeamUserList, reset);
        if (Number(response.code)  === 200) {
          yield put({ type:'toTeamUserList', payload: Array.isArray(response.data) ? response.data: [] })
          if(cb) cb( Array.isArray(response.data) ? response.data: [] )
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 删除团队成员
    *deleteTeamUser({ payload }, { call }) {
      try {
        const response = yield call(deleteTeamUser, payload.data);
        if (Number(response.code)  === 200) {
          const {cb} = payload
          if (cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 修改团队勾选的机构服务包
    *updateTeamPack({ payload }, { call }) {
      try {
        const response = yield call(updateTeamPack, payload.data);
        if (Number(response.code)  === 200) {
          const {cb} = payload
          if (cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 删除机构服务包子项目
    *deleteProChildSer({ payload }, { call }) {
      try {
        const response = yield call(deleteProChildSer, payload.data);
        if (Number(response.code)  === 200) {
          const {cb} = payload
          if (cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 设置团队长
    *teamAddLeader({ payload }, { call }) {
      try {
        const response = yield call(teamAddLeader, payload.data);
        if (Number(response.code)  === 200) {
          const {cb} = payload
          if (cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 设置签约主体
    *teamAddMaster({ payload }, { call }) {
      try {
        const response = yield call(teamAddMaster, payload.data);
        if (Number(response.code)  === 200) {
          const {cb} = payload
          if (cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 取消签约主体
    *teamcancleMaster({ payload }, { call }) {
      try {
        const response = yield call(teamcancleMaster, payload.data);
        if (Number(response.code)  === 200) {
          const {cb} = payload
          if (cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 下架服务包
    *downServicePack({ payload }, { call }) {
      try {
        const response = yield call(downServicePack, payload.data);
        if (Number(response.code)  === 200) {
          const {cb} = payload
          if (cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 删除服务包
    *deleteServicePack({ payload }, { call }) {
      try {
        const response = yield call(deleteServicePack, payload.data);
        if (Number(response.code)  === 200) {
          const {cb} = payload
          if (cb) cb()
        }
      }catch (e) {
        console.log(e)
      }
    },
    // 清空团队添加页面的列表 （逻辑需要）
    *toChanageTeamList({ payload }, { put}) {
      try {
        yield put({ type:'toTeamUserList', payload: [] })
        yield put({ type:'toSelectPackList', payload:  [] })
        yield put({ type:'toSerPackSelectList', payload:  [] })
      }catch (e) {
        console.log(e)
      }
    },

  },


  reducers: {
    toServicePackChildProList(state, action) {
      return { ...state, servicePackChildProList: action.payload };
    },
    toLoadding(state, action) {
      return { ...state, isLoadding: action.payload };
    },
    toIsClickable(state, action) {
      return { ...state, isClickable: action.payload };
    },
    toOrgSerInfo(state, action) {
      return { ...state, orgServiceInfo: action.payload };
    },
    toTeamUserList(state, action) {
      return { ...state, teamUserList: action.payload };
    },
    toSerPackSelectList(state, action) {
      return { ...state, servicePackSelectList: action.payload };
    },
    toSelectPackList(state, action) {
      return { ...state, teamSelectPackList: action.payload };
    },
    toGetManageServePackInfo(state, action) {
      return { ...state, ServePackInfo: action.payload };
    },
  },
};
export default Model;
