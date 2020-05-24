import { message } from 'antd';
import { fakeSubmitForm, searchKeyword } from './service';

const Model = {
  namespace: 'prescriptionAndKeywordPage',
  state: {},
  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },

    *searchKeyword({ payload }, { call }) {
      const data = yield call(searchKeyword, payload.data);
      payload.callback(data);
    },
  },
};
export default Model;
