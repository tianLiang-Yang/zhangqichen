import { AppColor } from '@/utils/ColorCommom';
import {Checkbox, Divider} from 'antd';
import React from 'react';
import styles from './index.less'
// eslint-disable-next-line import/no-duplicates
import {getlimitStr, isEmpty, handleEmptyStr, FLAG_RELEASE, FLAG_NO_USER, FLAG_DELETE, FLAG_EDIT} from "@/utils/utils";
// eslint-disable-next-line import/no-duplicates
import defalureImage from '@/img/defalute_failure.png'
import styleUtil from '@/utils/utils.less'

export const DETLE = 'delete' // 移除
export const SET_MASTER = 'setMaster' // 设置签约主体
export const CANCLE_MASTER = 'cancleMaster' // 取消签约主体
export const SET_LEADER = 'setLeader' // 设置团队长
export const CANCLE_LEADER = 'setLeader' // 取消团队长
export const SEND = 'send' // 发送

const OrgColumns = ( handleData ) => [
  {
    title: '机构名称',
    dataIndex: 'orgName',
    key: 'orgName',
    width:'70%'
  },
  { title: '是否开通',
    dataIndex: 'optvalue',
    key: 'optvalue',
    render: (text) => (
      <div>
        {
          Number(text) === 0 ?
          <span style={{ color: AppColor.Gray3 }}>未开通</span>
          :
          <span style={{ color: AppColor.Green2 }}>已开通</span>
        }
      </div>
    ),
  },
  {
    title: '操作',
    key: '操作',
    render: (text, record) => (
      <div style={{ color: AppColor.Green, cursor: 'pointer' }}  onClick={() => handleData(record)}>
        选择
      </div>
    ),
  },
];

export const TeamChildColumns = ( handleData ) => [
  {
    title: '服务项目信息',
    dataIndex: '服务项目信息',
    key: '服务项目信息',
    width:'40%',
    render: (text, record) => (
      <div className={ styles.Box }>
        <div>
          <img style={{ width:50, height:50 }} alt="" src={ record.imagetbUrl } />
        </div>
        <div style={{ marginLeft:10}}>
          <div style={{ color: AppColor.Green,fontSize: 13 }}>{ record.orgTeamName }</div>
          <div style={{ color: AppColor.Gray,fontSize: 14,marginTop:3 }}>{ record.osProjectDesc }</div>
        </div>
      </div>
    )
  },
  { title: '原价',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },
  { title: '优惠',
    dataIndex: 'preferPrice',
    key: 'preferPrice',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },
  { title: '优惠后价格',
    dataIndex: 'trulyPrice',
    key: 'trulyPrice',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },

  { title: '创建时间', dataIndex: 'ctstamp', key: 'ctstamp', width:'15%'},
  {
    title: '操作',
    key: '操作',
    render: (text, record) => (
      <span style={{ cursor: 'pointer', color: AppColor.Green }}>
        <span onClick={() => handleData(record, DETLE)}>删除</span>
      </span>
    ),
  },
];

export const HomeServiceChildColumns = ( handleData ) => [
  {
    title: '服务项目信息',
    dataIndex: '服务项目信息',
    key: '服务项目信息',
    width:'40%',
    render: (text, record) => (
      <div className={ styles.Box }>
        <div>
          <img className={ styleUtil.imgStyleCenter } style={{ width:50, height:50 }} alt="" src={ record.imagetbUrl } />
        </div>
        <div style={{ marginLeft:10}}>
          <div style={{ color: AppColor.Green,fontSize: 13 }}>{ record.osProjectName }</div>
          <div style={{ color: AppColor.Gray,fontSize: 14,marginTop:3 }}>{ record.osProjectDesc }</div>
        </div>
      </div>
    )
  },
  { title: '原价',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },
  { title: '优惠',
    dataIndex: 'preferPrice',
    key: 'preferPrice',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },
  { title: '优惠后价格',
    dataIndex: 'trulyPrice',
    key: 'trulyPrice',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },

  { title: '创建时间', dataIndex: 'ctstamp', key: 'ctstamp', width:'15%'},
  {
    title: '操作',
    key: '操作',
    render: (text, record) => (
      <span style={{ cursor: 'pointer', color: AppColor.Green }}>
        <span onClick={() => handleData(record, DETLE)}>删除</span>
      </span>
    ),
  },
];

const ServiceChildProColumns = ( handleData ) => [
  {
    title: '项目信息',
    dataIndex: 'osProjectName',
    key: 'osProjectName',
    render: (text, record) => (
      <div className={styles.HLayout}>
        <div>
          <div>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img className={styles.imgStyle} src ={ isEmpty(record.imagetbUrl)? defalureImage : handleEmptyStr(record.imagetbUrl) }/>
          </div>
        </div>
        <div style={{marginLeft:10}}>
          <div  style={{ color: AppColor.Green }}> {getlimitStr(60, record.osProjectName) }</div>
          <div>
            { getlimitStr(60, record.osProjectDesc) }
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '服务包价格',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: '9%',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },
  {
    title: '创建时间',
    dataIndex: 'ctstamp',
    key: 'ctstamp',
    width: '12%',
  },
  {
    title: '操作',
    key: '操作',
    width: '7%',
    render: (text, record) => (
      <div style={{ color: AppColor.Green, cursor: 'pointer' }}  onClick={() => handleData(record)}>
        删除
      </div>
    ),
  },
];

const HomeServiceColumns = ( handleData ) => [
  {
    title: '服务包信息',
    dataIndex: 'throngName',
    key: 'throngName',
    width:'40%',
    render: (text, record) => (
      <div className={ styles.Box }>
        <div>
          <img style={{ width:50, height:50 }} alt="" src={ record.imagetbUrl } />
        </div>
        <div style={{ marginLeft:10}}>
          <div style={{ color: AppColor.Green,fontSize: 13 }}>{ record.osPackName }</div>
          <div style={{ color: AppColor.Gray,fontSize: 14,marginTop:3 }}>{ record.osPackDesc }</div>
        </div>
      </div>
    )
  },
  { title: '原价',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },
  { title: '优惠',
    dataIndex: 'preferPrice',
    key: 'preferPrice',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },
  { title: '优惠后价格',
    dataIndex: 'trulyPrice',
    key: 'trulyPrice',
    render: (text) => (
      <span>
        ¥ &nbsp;{text}
      </span>
    ),
  },

  { title: '创建时间', dataIndex: 'ctstamp', key: 'ctstamp', width:'15%'},
  { title: '状态',
    dataIndex: 'isRelease',
    key: 'isRelease' ,
    filters: [{ text: '已发布', value: 1 }, { text: '未发布', value: 0 }],
    // eslint-disable-next-line consistent-return
    onFilter: (value, record) => {
      const type = record.isRelease;
      if (Number(type) === Number(value)) {
        return record;
      }
    },
    render: (text) => (
      <span>{
        Number(text) === 1 ?
          <span style={{color: AppColor.Green2}}>发布</span>
          :
          '未发布'
      }
       </span>
    )},
  {
    title: '操作',
    key: '操作',
    render: (text, record) => (
      <div>
        <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
          <span onClick={() => handleData(record, FLAG_EDIT)}>修改</span>
           <Divider type="vertical" />
          <span onClick={() => handleData(record, FLAG_DELETE)}>删除</span>

          {
              Number(record.isRelease) === 1 ?
                <span>
                  <Divider type="vertical" />
                  <span onClick={() => handleData(record, FLAG_NO_USER)}>下架</span>
                </span>
                :
                <span>
                  <Divider type="vertical" />
                  <span onClick={() => handleData(record, FLAG_RELEASE)}>发布</span>
                </span>
          }
        </span>

      </div>
    ),
  },
];

const getTeamUserStr = (list) => {

  let str = ''
  for (let i = 0; i < list.length ; i++) {
    str += `${list[i].drName  }( ${ list[i].drType === 2 ? '健管师' : '普通医生' })、`
  }
  return getlimitStr(48,list.length === 0 ? '':str.slice(0,str.length-1))
}

export const TeamManageColumns = ( handleData ) => [
  {
    title: '团队信息',
    dataIndex: 'throngName',
    key: 'throngName',
    width:'56%',
    render: (text, record) => (
      <div className={ styles.Box }>
        <div>
          <img className={ styleUtil.imgStyleCenter } style={{ width:50, height:50 }} alt="" src={ record.imageUrl } />
        </div>
        <div style={{ marginLeft:10}}>
          <div style={{ color: AppColor.Green,fontSize: 13 }}>{ record.orgTeamName }</div>
          <div style={{ color: AppColor.Gray,fontSize: 14,marginTop:3 }}>{ getTeamUserStr(record.teamMemberList) }</div>
        </div>
      </div>
    )
  },

  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width:'15%'},
  { title: '状态',
    dataIndex: 'isRelease',
    key: 'isRelease' ,
    filters: [{ text: '已发布', value: 1 }, { text: '未发布', value: 0 }],
    // eslint-disable-next-line consistent-return
    onFilter: (value, record) => {
      const type = record.isRelease;
      if (Number(type) === Number(value)) {
        return record;
      }
    },
    render: (text) => (
      <span>{
        Number(text) === 1 ?
          <span style={{color: AppColor.Green2}}>发布</span>
          :
          '未发布'
      }
       </span>
    )},
  {
    title: '操作',
    key: '操作',
    render: (text, record) => (
      <div>
        <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
          <span onClick={() => handleData(record, FLAG_EDIT)}>修改</span>
           <Divider type="vertical" />
          <span onClick={() => handleData(record, FLAG_DELETE)}>删除</span>

          {
            // useflag（0-未启用1-使用）
            // eslint-disable-next-line no-nested-ternary
              Number(record.isRelease) === 1 ?
                <span>
                  <Divider type="vertical" />
                  <span onClick={() => handleData(record, FLAG_NO_USER)}>下架</span>
                </span>
                :
                <span>
                  <Divider type="vertical" />
                  <span onClick={() => handleData(record, FLAG_RELEASE)}>发布</span>
                </span>
          }


        </span>

      </div>
    ),
  },
];

export const userColumns = ( )  => [
  {
    title: '注册号',
    dataIndex: 'userNo',
    key: '注册号',
  },
  {
    title: '用户姓名',
    dataIndex: 'realName',
    key: '用户姓名',
    render: (text) => (
      <span title={ text }>
            { getlimitStr(5, text) }
          </span>
    ),
  },
  {
    title: '性别',
    dataIndex: 'sexDic',
    key: '性别',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: '年龄',
  },
  {
    title: '医生类别',
    dataIndex: 'drType',
    key: 'drType',
    render: (text) => (
      // 医生类型 1-普通医生 2-健管师
      <span title={ text }>
            { text === 2 ? '健管师' : '普通医生' }
          </span>
    ),
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '身份证号',
    dataIndex: 'cardNo',
    key: 'cardNo',
  },
]



export const teamColumns = ( )  => [

  {
    title: '用户',
    dataIndex: 'realName',
    key: '用户',
    width:'28%',
    render: (text,record) => (
      <div>
        <div className={styles.Box}>
          <span style={{ marginRight:10, color: AppColor.Green, fontSize:15 }}>{ record.drName }</span>
          <span style={{
            display: Number(record.isMaster !== 0) ? 'block' : ' none',
            color: AppColor.Origin,
          }}>
            签约主体
          </span>
          <span>
          <Divider type="vertical" style={{ display: Number(record.isLeader !== 0) && Number(record.isMaster !== 0)? 'block' : ' none'}} />
           </span>
          <span style={{
            display: Number(record.isLeader !== 0) ? 'block' : 'none',
            color: AppColor.Origin,
          }}>
            团队长
          </span>
        </div>
        <div style={{marginTop:5}}>
          <span >{ record.sex }</span>
          <Divider type="vertical"/>
          <span >{ record.age }</span>
          <Divider type="vertical"/>
          <span >{ Number(record.drType) === 2 ? '健管师' : '普通医生'  }</span>
          <Divider type="vertical"/>
          <span >{ record.protitle }</span>
        </div>
      </div>
    ),
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '创建时间',
    dataIndex: 'ctstamp',
    key: '创建时间',
  },
  {
    title: '短信',
    dataIndex: 'isSent',
    key: '短信',
    // render: (text) => (
    //   <span title={ text } style={{ fontSize:14, color: Number(text) === 0 ? AppColor.Origin : AppColor.Green2}}>
    //         { Number(text) === 0 ? '未发' : '已发' }
    //   </span>
    // ),
  },

]

export const teamEditColumns = ( handleData )  => {
  const last =
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      width: '28%',
      render: (text, record) => (
        <div className={ styles.Box} style={{ cursor: 'pointer', color: AppColor.Green }}>
          <span>
            <a onClick={() => handleData(record, DETLE)}>移除</a>
          </span>
          <Divider style={{ display:  Number(record.isLeader !== 0) ? 'none' : 'block'}} type="vertical"/>
          <span>
            <a onClick={() => handleData(record, Number(record.isLeader !== 0) ? CANCLE_LEADER : SET_LEADER )}>
                 {
                   Number(record.isLeader !== 0)
                     ?
                     ''
                     :
                     '设置团队长'
                 }
            </a>
          </span>
          <Divider type="vertical"/>
          <span>
            <a onClick={() => handleData(record, Number(record.isMaster !== 0) ? CANCLE_MASTER : SET_MASTER )}>
              {
                Number(record.isMaster !== 0)
                  ?
                  '取消签约主体'
                  :
                  '设置签约主体'
              }
            </a>
          </span>
          <Divider type="vertical"/>
          <span>
            <a onClick={() => handleData(record, SEND)}>发送</a>
          </span>
        </div>
      )
    }
  const list =  teamColumns();
  list.push(last)
  return list
}

export const teamManageColumns = ( handleData )  => {
  const last =
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      width: '20%',
      render: (text, record) => (
        <div className={ styles.Box} style={{ cursor: 'pointer', color: AppColor.Green }}>
          <span>
            <a onClick={() => handleData(record, DETLE)}>移除</a>
          </span>
        </div>
      )
    }
  const list =  teamColumns();
  list.push(last)
  return list
}
export {
  HomeServiceColumns, OrgColumns, ServiceChildProColumns
}
