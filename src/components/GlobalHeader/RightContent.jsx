import React from 'react';
import { connect } from 'dva';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import NoticeIcon from '@/components/NoticeIcon';
import styles from './index.less';

const GlobalHeaderRight = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }
  // console.log('GlobalHeaderRight', props.settings.UppelevelUrl)
  const pathName = props.history.location.pathname; // 当前路由
  const { breadcrumb } = props;
  const title = '内蒙后台管理系统'
  if (pathName === '/') {
    // title = '首页'
  } else {
     // title = breadcrumb[pathName].name === 'undefined' ? '首页' : breadcrumb[pathName].name;
  }
  // console.log('GlobalHeaderRight', breadcrumb, pathName)
  return (
    <div className={className}>
      <span style={{ marginLeft: '10px' }}>
         {title}
      </span>
      <span>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="德佑健康"
        dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
        onSearch={value => {
          console.log('input', value);
        }}
        onPressEnter={value => {
          console.log('enter', value);
        }}
      />
      {/* 消息 */}
      <NoticeIcon/>

      {/* <Tooltip title="使用文档"> */}
      {/*  <a* /}
      {/*    target="_blank" */}
      {/*    href="https://pro.ant.design/docs/getting-started" */}
      {/*    rel="noopener noreferrer" */}
      {/*    className={styles.action} */}
      {/*  > */}
      {/*    <Icon type="question-circle-o" /> */}
      {/*  </a> */}
      {/* </Tooltip> */}
      <Avatar />
      {/* <SelectLang className={styles.action} /> */}
      </span>
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
