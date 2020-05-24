import { AppColor } from '@/utils/ColorCommom';
import { Divider } from 'antd';
import React from 'react';
import styles from "@/pages/Education/components/MyTable3/index.less";
import { sourceTypeList } from '@/utils/map/DictionaryUtil'
import { toTimestr, isEmpty , handleEmptyStr } from '@/utils/utils'
import defalureImage from '@/img/defalute_failure.png'

export const OPRATE_DETELET = 'delete'; // 删除当前记录
export const OPRATE_TOP = 'top'; // 置顶
export const OPRATE_RELEASE= 'release'; // 发布
export const OPRATE_EDIT= 'edit'; // 修改
export const OPRATE_CNACLE_RELEASE= 'noRelease'; // 下架
export const OPRATE_DELAY= 'delay'; // 延期

const TableTextUI = ( param1, content ) => (
    <div style={{ color: AppColor.Green }}>
    <div>{param1 === 1 ? '可显示' : '不显示'}</div>
    <div>{ param1 === 1 ? content : '-' }</div>
  </div>
    )

// 获取人群
const getThrong = (list) =>{
  let throngs = '';
  for(let i = 0; i<list.length; i++)
     throngs += `${list[i].throngName } 、`
  return throngs.slice(0,throngs.length-1);
}

// 获取分类栏目
const getType = (list) =>{
  let throngs = '';
  for(let i = 0; i<list.length; i++)
    throngs += `${list[i].typeName } 、`
  return throngs.slice(0,throngs.length-1);
}



const manageListColumns = ( handleData, status ) => [
  {
    title: '资讯名称',
    dataIndex: '资讯名称',
    key: '资讯名称',
    width:'345px',
    render: (text, record) => (
      <div className={styles.HLayout}>
        <div style={{width:115}}>
          <div className={styles.imgStyle}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img className={styles.imgSrcStyle}
                 src ={ isEmpty(record.imagetbUrl1)? defalureImage : handleEmptyStr(record.imagetbUrl1) }/>
          </div>
          <div className={styles.hintStyle}>大</div>
        </div>
        <div style={{marginLeft:6,width:200}}>
          <div  style={{ color: AppColor.Gray3,  textDecoration: 'underline' }}>
            {/* eslint-disable-next-line no-nested-ternary */}
            「<span  style={{ color: AppColor.Red}}>{ record.resourceType === 2 ? '视频' :  record.resourceType === 1 ?'图文' : '外链'}</span>」
            { record.newsTitle }
          </div>
          <div>
            来源：<span style={{color:AppColor.Green}}>
            { record.newsSourceId ? sourceTypeList[ record.newsSourceId] : '暂无'}
            </span>
            <Divider type="vertical" />
            作者：<span style={{color:AppColor.Green}} >{ record.authorName }</span>
          </div>
          <div style={{display: isEmpty(record.cancelTime)? 'none':'block'}}>
            <span > { toTimestr(handleEmptyStr(record.cancelTime))}到期</span>
          </div>
        </div>

      </div>
    ),
  },
  { title: '分类栏目',
    dataIndex: '分类栏目',
    key: '分类栏目',
    width:'7%',
    render: (text,record) => (
      <span>{ getType(record.typeList) }</span>
    )
  },
  { title: '搜素关键字', dataIndex: 'keyword', key: 'keyword' },
  { title: '分发人群',
    dataIndex: 'throngList',
    key: '分发人群',
    width:'7%',
    render: (text,record) => (
      <span>{ getThrong(record.throngList) }</span>
    )
  },
  { title: '访问', dataIndex: '访问', key: '访问' , render: (text,record) => (<span>{ TableTextUI(record.isVisit,handleEmptyStr(record.visitSum)) }</span>)},
  { title: '学习', dataIndex: '阅读', key: '阅读' , render: (text,record) => (<span>{ TableTextUI(record.readSum,handleEmptyStr(record.readSum)) }</span>)},
  { title: '回复', dataIndex: '回复', key: '回复' , render: (text,record) => (<span>{ TableTextUI(record.isRelay,handleEmptyStr(record.relayNum)) }</span>)},
  { title: '点赞', dataIndex: '点赞', key: '点赞', render: (text,record) => (<span>{ TableTextUI(record.isLike,handleEmptyStr(record.likeNum)) }</span>) },
  { title: '点赞', dataIndex: '点赞', key: '转发', render: (text,record) => (<span>{ TableTextUI(record.isReply,handleEmptyStr(record.replyNum)) }</span>) },
  { title: '创建', dataIndex: 'ctstamp', key: '创建', width:'7%'},
  {
    title: '操作',
    key: '操作',
    render: (text, record) => (
      <div>
        <div>
                <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
                  <span onClick={() => handleData(record, OPRATE_TOP)}>置顶</span>
                  <Divider type="vertical" />
                  <span onClick={() => handleData(record, OPRATE_EDIT)}>修改</span>
                </span>
        </div>
        <div>
                <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
                  <span onClick={() => handleData(record, OPRATE_DETELET)}>删除</span>
                  <Divider type="vertical" />
                  <span onClick={() => handleData(record, OPRATE_RELEASE)}>发布</span>
                </span>
        </div>

      </div>
    ),
  },
];



export {
  manageListColumns,
}
