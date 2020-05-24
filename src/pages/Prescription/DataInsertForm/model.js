import { message } from 'antd';
import { fakeSubmitForm } from './service';

const Model = {
  namespace: 'prescriptionAndDataInsertForm',
  state: {},
  effects: {
    *submitAdvancedForm({ payload }, { call }) {
      const data = yield call(fakeSubmitForm, payload.data);
      payload.callback(data);
      message.success('提交成功');
    },
  },
};
export default Model;
