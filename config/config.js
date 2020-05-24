import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  history: 'hash',
  // 默认是 browser
  targets: {
    ie: 11,
  },
  base: './',
  publicPath: './',
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'forgetPw',
          path: '/user/forgetpw',
          component: './user/ForgetPw',
        },
        {
          name: '注册页',
          icon: 'smile',
          path: '/user/userregister',
          component: './user/UserRegister',
        },
        {
          name: '二维码登录',
          icon: 'smile',
          path: '/user/qrcodePage',
          component: './user/QrcodePage',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          // authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/usermanager',
            },
            {
              icon: 'dashboard',
              path: '/welcome',
              name: '首页',
              component: './Welcome',
            },
            {
              path: '/admin',
              // name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
            },
            {
              name: '用户管理',
              icon: 'team',
              path: '/usermanager',
              component: './UserManager',
            },
            {
              name: '审批管理',
              icon: 'form',
              path: '/review',
              routes: [
                {
                  name: '医生资质审核',
                  path: '/review/doctorqualificationreview',
                  component: './DoctorQualificationReview',
                },
                {
                  name: '身份证审批',
                  path: '/review/idcardauditpage',
                  component: './IdCardAuditPage',
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
                  component: './Prescription/TcmForm',
                },
                {
                  name: '西医疾病',
                  path: '/prescription/disease',
                  component: './Prescription/DiseaseForm',
                },
                {
                  name: '处方',
                  path: '/prescription/healthpre',
                  component: './Prescription/HealthPreForm',
                },
                {
                  name: '关键词',
                  path: '/prescription/keyword',
                  component: './Prescription/KeywordPage',
                },
                {
                  name: '数据录入',
                  path: '/prescription/insert',
                  component: './Prescription/DataInsertForm',
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
                  component: './Education/ClassificationSettingPage',
                },
                {
                  name: '课程课堂管理',
                  path: '/education/manage',
                  component: './Education/ManagePage',
                },
                {
                  // name: '添加课程视频',
                  path: '/education/editpage/:data',
                  component: './Education/EditPage',
                },
                {
                  // name: '追加子课堂视频',
                  path: '/education/editClassRoompage/:data',
                  component: './Education/EditClassRoomPage',
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
                  // icon: 'smile',
                  path: '/infomation/managepage',
                  component: './infomation/ManagePage',
                },
                {
                  name: '资讯来源设置',
                  path: '/infomation/sourceset',
                  component: './infomation/sourceSet',
                },
                {
                  name: '资讯分类设置',
                  path: '/infomation/classset',
                  component: './infomation/ClassSetPage',
                },
                {
                  name: '查询表格',
                  path: '/infomation/infomanage',
                  component: './infomation/InfoManagePage',
                },
                {
                  name: '热点推荐管理',
                  path: '/infomation/hotrecommend',
                  component: './infomation/HotRecommend',
                },
                {
                  // name: '添加资讯',
                  path: '/infomation/editinfomation/:key',
                  component: './infomation/EditinfomationPage',
                },
                {
                  name: '资讯明细管理',
                  icon: 'smile',
                  path: '/infomation/detialmanagelist',
                  component: './infomation/DetialManagelistPage',
                },
              ],
            },
            {
              name: '基础字典',
              icon: 'file-search',
              path: '/basedictionary',
              component: './BaseDictionary',
            },
            {
              name: '标准列表',
              icon: 'smile',
              path: '/listbasiclist',
              component: './ListBasicList',
            },
            {
              name: '人群管理',
              icon: 'user',
              path: '/people',
              routes: [
                {
                  name: '人群分类设置',
                  // icon: 'smile',
                  path: '/people/settingpage',
                  component: './People/SettingPage',
                },
                {
                  name: '人群管理',
                  // icon: 'smile',
                  path: '/people/managepage',
                  component: './People/ManagePage',
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
                  component: './HealthManage/HomeDoctorSigning',
                },
                {
                  // name: '家医服务',
                  icon: 'smile',
                  path: '/healthManage/EditHomeDoctorPage/:key',
                  component: './HealthManage/HomeDoctorSigning/EditHomeDoctorPage',
                },
                {
                  // name: '团队',
                  icon: 'smile',
                  path: '/healthManage/EditServiceTeamPage/:key',
                  component: './HealthManage/HomeDoctorSigning/EditServiceTeamPage',
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
                  component: './Statistics/ChronickDisease',
                },
                {
                  name: '健康人群分析',
                  path: '/Statistics/HealthPeople',
                  component: './Statistics/HealthPeople',
                },
                {
                  name: '评论分析',
                  path: '/Statistics/Comment',
                  component: './Statistics/Comment',
                },

              ]
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': '#1DA57A',
    // 全局主色
    'font-size-base': '13px',
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  proxy: {
    '/api/': {
      target: 'http://localhost:8093/',
      changeOrigin: true,
      pathRewrite: {
        '^/api/': '',
      },
    },
  },
};
