import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'global', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/models/global.js').default) });
app.model({ namespace: 'login', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/models/login.js').default) });
app.model({ namespace: 'setting', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/models/user.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/user/UserRegister/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/UserManager/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/DoctorQualificationReview/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/IdCardAuditPage/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/Prescription/TcmForm/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/Prescription/DiseaseForm/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/Prescription/HealthPreForm/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/Prescription/KeywordPage/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/Prescription/DataInsertForm/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/Education/ClassificationSettingPage/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/Education/ManagePage/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/Education/EditPage/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/infomation/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/infomation/EditinfomationPage/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/infomation/DetialManagelistPage/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/BaseDictionary/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/ListBasicList/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/People/model.js').default) });
app.model({ namespace: 'model', ...(require('C:/Users/汁舞猪/Desktop/zhangqichen/zhangqichen/src/pages/HealthManage/HomeDoctorSigning/model.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
