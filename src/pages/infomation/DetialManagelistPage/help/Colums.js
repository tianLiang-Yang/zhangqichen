import { AppColor } from '@/utils/ColorCommom';
import { Divider } from 'antd';
import React from 'react';
import CommonStyle from '@/pages/DoctorQualificationReview/index.less';
import styles from "@/pages/infomation/DetialManagelistPage/index.less";

// 1 - 未上架 ，2 - 已上架，3 -已下架
export const OPRATE_SEE_DETIALS = 1; // 查看详情
export const OPRATE_AUDIT_DATA = 2; // 审核
export const OPRATE_CANCEL_AUDIT = 3; // 取消认证
export const OPRATE_HANDLE_DATA = 4; // 业务处理
export const OPRATE_LIMIT_AUDIT = 5; // 限制申请
// eslint-disable-next-line @typescript-eslint/camelcase
export const OPRATE_CANCAL_LiMIT = 6; // 取消限制申请
/**
 * WattingColumns 待审核
 * @param handleColumsOprate
 * @returns {*[]}
 * @constructor
 */
const getHelpColumns = (handleColumsOprate,flag) =>  [
  {
    title: '资讯名称',
    dataIndex: '资讯名称',
    key: '资讯名称',
    width:'20%',
    render: (text, record) => (
      <div className={styles.tableName}>
        <div style={{width:50,height:50}}>
          <div className={styles.headImg}></div>
          <div className={styles.hintCircle}>大</div>
        </div>

        <div>{text}</div>
      </div>
    ),
  },
  {
    title: '阅读',
    dataIndex: '阅读',
    key: '阅读',
  },
  {
    title: '回复',
    dataIndex: '回复',
    key: '回复',
  },
  {
    title: '点赞',
    dataIndex: '点赞',
    key: '点赞',
  },
  {
    title: '转发',
    dataIndex: '转发',
    key: '转发',
  },
  {
    title: '权重',
    dataIndex: '权重',
    key: '权重',
  },
  {
    title: '发布时间',
    dataIndex: '发布时间',
    key: '发布时间',
  },
  {
    title: '状态',
    dataIndex: '状态',
    key: '状态',
  },
  {
    title: '操作',
    key: '操作',
    width: '15%',
    render: (text, record) => (
      <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
            <span onClick={() => handleColumsOprate(record, OPRATE_SEE_DETIALS)}>查看</span>
            <Divider type="vertical" />
            <span onClick={() => handleColumsOprate(record, OPRATE_SEE_DETIALS)}>修改</span>
            <Divider type="vertical" />
        {/* eslint-disable-next-line max-len */}
        <span onClick={() => handleColumsOprate(record, OPRATE_SEE_DETIALS)}>移除</span>
            <Divider type="vertical" />
        {Number(record.isAllowAsk) === 1 ? (
          // eslint-disable-next-line max-len
          <span onClick={() => handleColumsOprate(record, OPRATE_LIMIT_AUDIT)}>停用</span>
        ) : (
          // eslint-disable-next-line max-len
          <span onClick={() => handleColumsOprate(record, OPRATE_CANCAL_LiMIT)}>启用</span>
        )}
          </span>
    ),
  },
];


export {
  getHelpColumns,
}
