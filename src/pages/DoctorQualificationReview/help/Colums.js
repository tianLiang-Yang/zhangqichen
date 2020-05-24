import { AppColor } from '@/utils/ColorCommom';
import { Divider } from 'antd';
import React from 'react';
import CommonStyle from '@/pages/DoctorQualificationReview/index.less';

// 1 - 查看（公用） ，2 - 审核（通过），3 - 取消认证 ，4 - 业务处理
export const OPRATE_SEE_DETIALS = 1; // 查看详情
export const OPRATE_AUDIT_DATA = 2; // 审核
export const OPRATE_CANCEL_AUDIT = 3; // 取消认证
export const OPRATE_HANDLE_DATA = 4; // 业务处理
export const OPRATE_LIMIT_AUDIT = 5; // 限制申请
// eslint-disable-next-line @typescript-eslint/camelcase
export const OPRATE_CANCAL_LiMIT = 6; // 取消限制申请
/**
 * WattingColumns 待审核
 * @param handleAduitDialog
 * @returns {*[]}
 * @constructor
 */
const WattingColumns = (handleAduitDialog) => [
  {
    title: '注册号',
    dataIndex: 'userNo',
    key: '注册号',
    width: '10%',
  },
  {
    title: '医生姓名',
    dataIndex: 'realname',
    key: '医生姓名',
    width: '10%',
  },
  {
    title: '性别',
    dataIndex: 'sexDic',
    width: '7%',
    key: '性别',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: '年龄',
    width: '7%',
  },
  {
    title: '职称',
    dataIndex: 'protitleDic',
    key: '职称',
    width: '14%',
  },
  {
    title: '类型',
    dataIndex: 'verifyTimes',
    key: '类型',
    width: '11%',
    filters: [{ text: '首次申请', value: '1' }, { text: '驳回重申', value: '2' }],
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
    title: '申请时间',
    dataIndex: 'applyTime',
    key: '申请时间',
    width: '15%',
  },
  {
    title: '最迟审核时间',
    dataIndex: 'lastApplyTime',
    key: '最迟审核时间',
    width: '15%',
    sorter: (a, b) => a.lastApplyTime > b.lastApplyTime,
    // sorter: (a, b) => {return },
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '操作',
    dataIndex: '操作',
    key: '操作',
    render: (text, record) => (
      <span style = {{ color: AppColor.Green, cursor: 'pointer' }}>
        <a onClick = { () => handleAduitDialog(record, OPRATE_SEE_DETIALS) } >查看</a>
        <Divider type="vertical" />
        <a onClick = { () => handleAduitDialog(record, OPRATE_AUDIT_DATA)}>审核</a>
      </span>
    ),
  },
];

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
    width: '10%',
  },
  {
    title: '医生姓名',
    dataIndex: 'realname',
    key: '医生姓名',
    width: '10%',
  },
  {
    title: '性别',
    dataIndex: 'sexDic',
    width: '7%',
    key: '性别',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: '年龄',
    width: '8%',
  },
  {
    title: '职称',
    dataIndex: 'protitleDic',
    key: '职称',
    width: '13%',
  },

  {
    title: '申请时间',
    dataIndex: 'applyTime',
    key: '申请时间',
    width: '14%',
  },
  {
    title: '申请通过时间',
    dataIndex: 'verifyTime',
    key: '申请通过时间',
    width: '14%',
  },
  {
    title: '审核人',
    dataIndex: 'verifier',
    key: '审核人',
    width: '8%',
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
 * PassColumns 已驳回
 * @param handleAduitDialog
 * @returns {*[]}
 * @constructor
 */
const RejectColumns = (handleAduitDialog) => [
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
  },
  {
    title: '性别',
    dataIndex: 'sexDic',
    width: '5%',
    key: '性别',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: '年龄',
    width: '5%',
  },
  {
    title: '职称',
    dataIndex: 'protitleDic',
    key: '职称',
    width: '12%',
  },

  {
    title: '申请时间',
    dataIndex: 'applyTime',
    key: '申请时间',
    width: '9%',
  },
  {
    title: '申请驳回时间',
    dataIndex: 'verifyTime',
    key: '申请驳回时间',
    width: '12%',
  },
  {
    title: '审核人',
    dataIndex: 'verifier',
    key: '审核人',
    width: '9%',
  },
  {
    title: '驳回原因',
    dataIndex: 'verifyDesc',
    key: '驳回原因',
    width: '14%',
    render: (text) => (
      <div title={text} className={CommonStyle.TextLimmit2} style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
        {text}
      </div>
    ),
  },
  {
    title: '限申',
    dataIndex: 'isAllowAsk',
    key: '限申',
    width: '5%',
    render: (text, record) => (
      <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
        {
          Number(record.isAllowAsk) === 0 ? // 是否允许申请（0-否 1-是）
            <span>是</span>
            :
            <span>否</span>
        }
      </div>
    ),
  },
  {
    title: '操作',
    dataIndex: '操作',
    key: '操作',
    render: (text, record) => (
      <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
            <span onClick = { () => handleAduitDialog(record, OPRATE_SEE_DETIALS) }>查看</span>
            <Divider type = "vertical" />
        {
          Number(record.isAllowAsk) === 1 ?
            <span onClick= { () => handleAduitDialog(record, OPRATE_LIMIT_AUDIT) }>限制申请</span>
            :
            <span onClick= { () => handleAduitDialog(record, OPRATE_CANCAL_LiMIT) }>取消限申</span>
        }
          </span>
    ),
  },
];

/**
 * CancelledColumns 已通过
 * @param
 * @returns {*[]}
 * @constructor
 */
const CancelledColumns = (handleAduitDialog) => [
  {
    title: '注册号',
    dataIndex: 'userNo',
    key: '注册号',
    width: '11%',
  },
  {
    title: '医生姓名',
    dataIndex: 'realname',
    key: '医生姓名',
    width: '8%',
  },
  {
    title: '性别',
    dataIndex: 'sexDic',
    width: '6%',
    key: '性别',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: '年龄',
    width: '6%',
  },
  {
    title: '职称',
    dataIndex: 'protitleDic',
    key: '职称',
    width: '11%',
  },
  {
    title: '封号时间',
    dataIndex: 'cancelTime',
    key: '封号时间',
    width: '14%',
  },
  {
    title: '操作员',
    dataIndex: 'canceler',
    key: '操作员',
    width: '8%',
  },
  {
    title: '封号原因',
    dataIndex: 'cancelDesc',
    key: '封号原因',
    width: '20%',
    render: (text) => (
      <div title={text} className = { CommonStyle.TextLimmit2 }>
        {text}
      </div>
    ),
  },
  {
    title: '操作',
    dataIndex: '操作',
    key: '操作',
    render: (text, record) => (
      <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
        <a onClick={ () => handleAduitDialog(record, OPRATE_SEE_DETIALS) }>查看</a>
        <Divider type="vertical" />
        <a onClick={ () => handleAduitDialog(record, OPRATE_HANDLE_DATA) }>业务处理</a>
      </span>
    ),
  },
];
export {
   WattingColumns, PassColumns, RejectColumns, CancelledColumns,
}
