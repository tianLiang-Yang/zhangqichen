import { message } from 'antd';
import { fakeSubmitForm, getHealthPre, updateHealthPre, getTableSetting, } from './service';

const Model = {
  namespace: 'prescriptionAndHealthPreForm',
  state: {},
  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },

    *getTableSetting({ payload }, { call }) {
      const data = yield call(getTableSetting, payload.data);
      payload.callback(data);
    },

    *getHealthPre({ payload }, { call }) {
      const data = yield call(getHealthPre, payload.data);
      payload.callback(data);
    },

    *updateHealthPre({ payload }, { call }) {
      const data = yield call(updateHealthPre, payload.data);
      payload.callback(data);
    },
  },
};
export default Model;
