import { AppColor } from '@/utils/ColorCommom';
import { Divider } from 'antd';
import React from 'react';
import { getlimitStr } from '@/utils/utils';

// 1 - 已通过 ，2 - 已取消，3 - 取消认证 ，4 - 重置认证
export const TAB_PASS = 2; // 已通过
export const TAB_CANCLE = 4; // 已取消
export const OPRATE_CANCEL_AUDIT = 5; // 取消认证
export const OPRATE_SEE_DETIALS = 7; // 查看
export const OPRATE_HANDLE_DATA = 8; // 业务处理

/**
 * PassColumns 已通过
 * @param handleAduitDialog
 * @returns {*[]}
 * @constructor
 */
const PassColumns = (handleAduitDialog) => [
  {
    title: '注册号',
    dataIndex: 'userNo',
    key: '注册号',
  },
  {
    title: '医生姓名',
    dataIndex: 'realname',
    key: '医生姓名',
    render: (text) => (
      <span title={ text }>
            { getlimitStr(9, text) }
          </span>
    ),
  },
  {
    title: '性别',
    width: '6%',
    dataIndex: 'sexDic',
    key: '性别',
  },
  {
    title: '年龄',
    width: '6%',
    dataIndex: 'age',
    key: '年龄',
  },
  {
    title: '身份证类型',
    dataIndex: 'cardTypeDic',
    key: '身份证类型',
  },
  {
    title: '身份证号',
    dataIndex: 'cardNo',
    key: '身份证号',
    width: '13%',
    render: (text) => (
      <span title={ text }>
            { text }
      </span>
    ),
  },
  {
    title: '类型',
    dataIndex: 'verifyTimes',
    key: '类型',
    filters: [{ text: '首次认证', value: '1' }, { text: '重新认证', value: '2' }],
    // eslint-disable-next-line consistent-return
    onFilter: (value, record) => {
      console.log('类型onFilter', record.verifyTimes);
      const type = record.verifyTimes;
      if (type === Number(value)) {
        return record;
      }
    },
    render: (text) => (
      <div>
        {
          Number(text) === 1 ?
            <span style={{ color: AppColor.Blue }}>• 首次申请</span>
            :
            <span style={{ color: AppColor.Yellow }}>• 驳回重申</span>
        }
      </div>
    ),
  },
  {
    title: '认证时间',
    dataIndex: 'verifyTime',
    width: '15%',
    key: '申请通过时间',
  },
  {
    title: '审核人',
    dataIndex: 'verifier',
    key: '审核人',
  },
  {
    title: '操作',
    dataIndex: '操作',
    key: '操作',
    render: (text, record) => (
      <span style = {{ color: AppColor.Green, cursor: 'pointer' }}>
        <a onClick = { () => handleAduitDialog(record, OPRATE_SEE_DETIALS) }>查看</a>
        <Divider type="vertical" />
         <a onClick = { () => handleAduitDialog(record, OPRATE_CANCEL_AUDIT) }>取消认证</a>
      </span>
    ),
  },
];
/**
 * CancelledColumns 已取消
 * @param handleAduitDialog
 * @returns {*[]}
 * @constructor
 */
const CancelledColumns = (handleAduitDialog) => [
  {
    title: '注册号',
    dataIndex: 'userNo',
    key: '注册号',
    width: '9%',
  },
  {
    title: '医生姓名',
    dataIndex: 'realname',
    key: '医生姓名',
    width: '8%',
    render: (text) => (
      <span title={ text }>
            { getlimitStr(9, text) }
          </span>
    ),
  },
  {
    title: '性别',
    dataIndex: 'sexDic',
    width: '4%',
    key: '性别',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: '年龄',
    width: '4%',
  },
  {
    title: '身份证类型',
    dataIndex: 'cardTypeDic',
    key: '身份证类型',
    width: '7%',
  },
  {
    title: '身份认证号',
    dataIndex: 'cardNo',
    key: '身份认证号',
    width: '13%',
  },
  {
    title: '认证时间',
    dataIndex: 'verifyTime',
    key: '认证时间',
    width: '10%',
  },
  {
    title: '认证人',
    dataIndex: 'verifier',
    key: '认证人',
    width: '7%',
  },
  {
    title: '取消时间',
    dataIndex: 'cancelTime',
    key: '申请时间',
    width: '10%',
  },
  {
    title: '取消人',
    dataIndex: 'canceler',
    key: '取消人',
    width: '8%',
  },
  {
    title: '取消原因',
    dataIndex: 'cancelDesc',
    key: '取消原因',
    render: (text) => (
      <span title={ text }>
            { getlimitStr(12, text) }
          </span>
    ),
  },
  {
    title: '操作',
    dataIndex: '操作',
    key: '操作',
    render: (text, record) => (
      <span style = {{ color: AppColor.Green, cursor: 'pointer' }}>
        <a onClick = { () => handleAduitDialog(record, OPRATE_SEE_DETIALS) } >查看</a>
        <Divider type="vertical" />
        <a onClick = { () => handleAduitDialog(record, OPRATE_HANDLE_DATA)}>业务处理</a>
      </span>
    ),
  },
];
export {
  CancelledColumns, PassColumns,
}
