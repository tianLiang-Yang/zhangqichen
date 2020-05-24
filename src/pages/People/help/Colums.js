import { AppColor } from '@/utils/ColorCommom';
import { Divider } from 'antd';
import React from 'react';
import {getlimitStr} from "@/utils/utils";
import styles from "@/pages/UserManager/mobile-manage/index.less";
import IconFont from "@/components/IconFont";
// eslint-disable-next-line import/no-duplicates
import { FLAG_EDIT, FLAG_SEE, FLAG_RELEASE, FLAG_DELETE, FLAG_NO_USER, FLAG_USER } from "@/utils/utils";


const manageListColumns = ( handleData, status ) => [
  {
    title: '名称',
    dataIndex: 'throngName',
    key: 'throngName',
    width:'180px'
  },
  { title: '所属分类',
    dataIndex: 'typeName',
    key: 'typeName',
  },
  { title: '创建方式', dataIndex: '创建方式', key: '创建方式' },
  { title: '属性',
    dataIndex: 'throngProperty',
    key: '属性',
    render: (text) => (
      <span>{text === 'S'? '静态' : '动态'}  </span>
    )
  },
  { title: '控制类型',
    dataIndex: 'controlType',
    key: 'controlType' ,
    render: (text) => (
      <span>{Number(text) === 1 ? '正向群' : '反向群'}</span>
    )},
  { title: '人数', dataIndex: 'userSum', key: 'userSum' },
  { title: '创建时间', dataIndex: 'ctstamp', key: 'ctstamp', width:'15%'},
  {
    title: '操作',
    key: '操作',
    render: (text, record) => (
      <div>
        <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
          <span onClick={() => handleData(record, FLAG_SEE)}>查看</span>
          <Divider type="vertical" />
          <span onClick={() => handleData(record, FLAG_EDIT)}>修改</span>
           <Divider type="vertical" />
          <span onClick={() => handleData(record, FLAG_DELETE)}>删除</span>

          {
            // useflag（0-未启用1-使用）
            // eslint-disable-next-line no-nested-ternary
            Number(status) === 0 ?
              <span>
              <Divider type="vertical" />
              <span onClick={() => handleData(record, FLAG_RELEASE)}>发布</span>
              </span>
              :
              Number(status) === 1 ?
                <span>
                  <Divider type="vertical" />
                  <span onClick={() => handleData(record, FLAG_NO_USER)}>停用</span>
                </span>
                :
                <span>
                  <Divider type="vertical" />
                  <span onClick={() => handleData(record, FLAG_USER)}>启用</span>
                </span>
          }


        </span>

      </div>
    ),
  },
];



const userColumns = ( )  => [
  {
    title: '注册号',
    dataIndex: 'userNo',
    key: '注册号',
  },
  {
    title: '用户昵称',
    dataIndex: 'userNick',
    key: '用户昵称',
    width: '8%',
    render: (text) => (
      <span title={ text }>
            { getlimitStr(9, text) }
          </span>
    ),
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
    title: '用户类型',
    dataIndex: 'userType',
    key: '用户类型',
    render: (text) => (
      // 用户类型 1-公众 2-医生用户
      <span title={ text }>
            { text === 2 ? '医生用户' : '公众' }
          </span>
    ),
  },
  {
    title: '医生类型',
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
    title: '所属机构',
    dataIndex: 'orgIdDic',
    key: '所属机构',
    render: (text) => (
      <span title={ text }>
            { getlimitStr(14, text) }
          </span>
    ),
  },
  {
    title: '职业',
    dataIndex: '职业',
    key: '职业',
    render: (text) => (
      <span title={ text }>
            { getlimitStr(8, text) }
          </span>
    ),
  },
  {
    title: '所在城市',
    dataIndex: 'cityDic',
    key: '所在城市',
    render: (text) => (
      <span title={ text }>
            { getlimitStr(8, text) }
          </span>
    ),
  },
]

const userDeleteColumns = ( handleData)  => {
  const list = userColumns()
  list.push(
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      width: '13%',
      render: (text, record) => (
        <span className={styles.oprationItem} style={{cursor: 'pointer'}}>
            <a onClick={() => handleData(record)}>删除</a>
          </span>
      )
    }
  )
  return list;
}



//




export {
  manageListColumns, userColumns, userDeleteColumns
}
