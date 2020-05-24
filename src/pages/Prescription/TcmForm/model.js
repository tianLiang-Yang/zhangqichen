import { message } from 'antd';
import { fakeSubmitForm, getTcm, updateTcm, } from './service';

const Model = {
  namespace: 'prescriptionAndTcmForm',
  state: {},
  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },

    *getTcm({ payload }, { call }) {
      const data = yield call(getTcm, payload.data);
      payload.callback(data);
    },

    *updateTcm({ payload }, { call }) {
      const data = yield call(updateTcm, payload.data);
      payload.callback(data);
    },
  },
};
export default Model;
