import { message } from 'antd';
import { fakeSubmitForm, getDisease, getTableSetting, updateDisease, } from './service';

const Model = {
  namespace: 'prescriptionAndDiseaseForm',
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

    *getDisease({ payload }, { call }) {
      const data = yield call(getDisease, payload.data);
      payload.callback(data);
    },

    *updateDisease({ payload }, { call }) {
      const data = yield call(updateDisease, payload.data);
      payload.callback(data);
    },
  },
};
export default Model;
