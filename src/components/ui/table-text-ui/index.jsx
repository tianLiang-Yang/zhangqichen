import React from 'react';
import styles from './index.less';

/**
 *   公共table 相同样式
 */
// eslint-disable-next-line max-len
const TableTextUI = ({ param1, param2 }) => (
  <div>
    <div>{param1 || '可显示'}</div>
    <div>{param2 || '1'}</div>
  </div>
);
export default TableTextUI;
