import React from 'react';
import styles from './index.less';
import {AppColor} from "@/utils/ColorCommom";

/**
 *   公共ttitle
 */
// eslint-disable-next-line max-len
export const TopTitle = ({ title }) => (
  <div>
    <div className={styles.TopTitleClassFirst}>{title}</div>
  </div>
);

/**
 *   公共ttitle
 */
// eslint-disable-next-line max-len
export const TopTitle2 = ({ title , rightUI }) => (
  <div className={styles.Box}>
    <div className={styles.TopTitleClass}>{title}</div>
    <div  className={styles.RightTitleClass}>{rightUI || ''}</div>
  </div>
);

/**
 *   公共ttitle
 */
// eslint-disable-next-line max-len
export const TopTitle3 = ({ title ,span, rightUI }) => (
  <div className={styles.Box}>
    <div style={{ color:AppColor.Green }} className={styles.TopTitleClass}>{title}<span className={styles.SpanStyle}>{ span }</span></div>
    <div  className={styles.RightTitleClass}>{rightUI || ''}</div>
  </div>
);
