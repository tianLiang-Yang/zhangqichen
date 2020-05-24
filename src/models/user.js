import { queryCurrent, query as queryUsers } from '@/services/user';
import { getSysMainData } from '@/pages/UserManager/service'
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(getSysMainData, payload);
      try {
        if (response.code === 200) {
          yield put({
            type: 'saveCurrentUser',
            payload: response.data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
