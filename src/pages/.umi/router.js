import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from 'D:/星愿/zhangqichen/src/pages/.umi/LocaleWrapper.jsx';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: require('../../layouts/UserLayout').default,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: require('../user/login').default,
        exact: true,
      },
      {
        name: 'forgetPw',
        path: '/user/forgetpw',
        component: require('../user/ForgetPw').default,
        exact: true,
      },
      {
        name: '注册页',
        icon: 'smile',
        path: '/user/userregister',
        component: require('../user/UserRegister').default,
        exact: true,
      },
      {
        name: '二维码登录',
        icon: 'smile',
        path: '/user/qrcodePage',
        component: require('../user/QrcodePage').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: require('../../layouts/SecurityLayout').default,
    routes: [
      {
        path: '/',
        component: require('../../layouts/BasicLayout').default,
        routes: [
          {
            path: '/',
            redirect: '/usermanager',
            exact: true,
          },
          {
            icon: 'dashboard',
            path: '/welcome',
            name: '首页',
            component: require('../Welcome').default,
            exact: true,
            routes: [
              {
                name: '管理员',
                path: '/review/doctorqualificationreview',
                component: require('../DoctorQualificationReview').default,
                exact: true,
              },
              {
                name: '医生',
                path: '/review/idcardauditpage',
                component: require('../IdCardAuditPage').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/admin',
            icon: 'crown',
            component: require('../Admin').default,
            authority: ['admin'],
            exact: true,
          },
          {
            name: '用户管理',
            icon: 'team',
            path: '/usermanager',
            component: require('../UserManager').default,
            exact: true,
          },
          {
            name: '审批管理',
            icon: 'form',
            path: '/review',
            routes: [
              {
                name: '医生资质审核',
                path: '/review/doctorqualificationreview',
                component: require('../DoctorQualificationReview').default,
                exact: true,
              },
              {
                name: '身份证审批',
                path: '/review/idcardauditpage',
                component: require('../IdCardAuditPage').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '健康处方',
            icon: 'heart',
            path: '/prescription',
            routes: [
              {
                name: '中医疾病',
                path: '/prescription/tcm',
                component: require('../Prescription/TcmForm').default,
                exact: true,
              },
              {
                name: '西医疾病',
                path: '/prescription/disease',
                component: require('../Prescription/DiseaseForm').default,
                exact: true,
              },
              {
                name: '处方',
                path: '/prescription/healthpre',
                component: require('../Prescription/HealthPreForm').default,
                exact: true,
              },
              {
                name: '关键词',
                path: '/prescription/keyword',
                component: require('../Prescription/KeywordPage').default,
                exact: true,
              },
              {
                name: '数据录入',
                path: '/prescription/insert',
                component: require('../Prescription/DataInsertForm').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '健康教育管理',
            icon: 'read',
            path: '/education',
            routes: [
              {
                name: '课堂分类设置',
                path: '/education/classificationsetting',
                component: require('../Education/ClassificationSettingPage')
                  .default,
                exact: true,
              },
              {
                name: '课程课堂管理',
                path: '/education/manage',
                component: require('../Education/ManagePage').default,
                exact: true,
              },
              {
                path: '/education/editpage/:data',
                component: require('../Education/EditPage').default,
                exact: true,
              },
              {
                path: '/education/editClassRoompage/:data',
                component: require('../Education/EditClassRoomPage').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '健康咨询管理',
            icon: 'profile',
            path: '/infomation',
            routes: [
              {
                name: '健康咨询管理',
                path: '/infomation/managepage',
                component: require('../infomation/ManagePage').default,
                exact: true,
              },
              {
                name: '资讯来源设置',
                path: '/infomation/sourceset',
                component: require('../infomation/sourceSet').default,
                exact: true,
              },
              {
                name: '资讯分类设置',
                path: '/infomation/classset',
                component: require('../infomation/ClassSetPage').default,
                exact: true,
              },
              {
                name: '查询表格',
                path: '/infomation/infomanage',
                component: require('../infomation/InfoManagePage').default,
                exact: true,
              },
              {
                name: '热点推荐管理',
                path: '/infomation/hotrecommend',
                component: require('../infomation/HotRecommend').default,
                exact: true,
              },
              {
                path: '/infomation/editinfomation/:key',
                component: require('../infomation/EditinfomationPage').default,
                exact: true,
              },
              {
                name: '资讯明细管理',
                icon: 'smile',
                path: '/infomation/detialmanagelist',
                component: require('../infomation/DetialManagelistPage')
                  .default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '基础字典',
            icon: 'file-search',
            path: '/basedictionary',
            component: require('../BaseDictionary').default,
            exact: true,
          },
          {
            name: '标准列表',
            icon: 'smile',
            path: '/listbasiclist',
            component: require('../ListBasicList').default,
            exact: true,
          },
          {
            name: '人群管理',
            icon: 'user',
            path: '/people',
            routes: [
              {
                name: '人群分类设置',
                path: '/people/settingpage',
                component: require('../People/SettingPage').default,
                exact: true,
              },
              {
                name: '人群管理',
                path: '/people/managepage',
                component: require('../People/ManagePage').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '健康管理',
            icon: 'smile',
            path: '/healthManage',
            routes: [
              {
                name: '家医服务管理',
                icon: 'smile',
                path: '/healthManage/homeDoctorSigning',
                component: require('../HealthManage/HomeDoctorSigning').default,
                exact: true,
              },
              {
                icon: 'smile',
                path: '/healthManage/EditHomeDoctorPage/:key',
                component: require('../HealthManage/HomeDoctorSigning/EditHomeDoctorPage')
                  .default,
                exact: true,
              },
              {
                icon: 'smile',
                path: '/healthManage/EditServiceTeamPage/:key',
                component: require('../HealthManage/HomeDoctorSigning/EditServiceTeamPage')
                  .default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            name: '统计分析',
            icon: 'line-chart',
            path: '/Statistics',
            routes: [
              {
                name: '慢病分析',
                path: '/Statistics/chronick',
                component: require('../Statistics/ChronickDisease').default,
                exact: true,
              },
              {
                name: '健康人群分析',
                path: '/Statistics/HealthPeople',
                component: require('../Statistics/HealthPeople').default,
                exact: true,
              },
              {
                name: '评论分析',
                path: '/Statistics/Comment',
                component: require('../Statistics/Comment').default,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            component: require('../404').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('D:/星愿/zhangqichen/node_modules/_umi-build-dev@1.18.5@umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
