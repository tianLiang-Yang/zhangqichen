import { AppColor } from '@/utils/ColorCommom';
import { Divider } from 'antd';
import React from 'react';
import styles from "@/pages/Education/components/MyTable3/index.less";
import { sourceTypes } from '@/utils/map/DictionaryUtil'
import {
  toTimestr2,
  isEmpty,
  handleEmptyStr,
  getlimitStr,
  FLAG_SEE,
  FLAG_RELEASE,
  FLAG_SUBMIT,
  FLAG_CANCLE, FLAG_NO_USER, FLAG_DELETE, FLAG_EDIT, FLAG_REPUBLISH, FLAG_AUDIT, deleteLastChart, FLAG_DELAY_RELEASE
} from '@/utils/utils'
import defalureImage from '@/img/defalute_failure.png'
import utilStyle from '@/utils/utils.less'

export const TABLE_KEY_NO_COMMIT = '0'; // 未提交
export const TABLE_KEY_NO_AUDIT = '1'; // 未审核
export const TABLE_KEY_WATTING_REALEASE = '4'; // 待发布
export const TABLE_KEY_NO_PASS = '3'; // 已驳回
export const TABLE_KEY_REALEASE = '5'; // 已发布
export const TABLE_KEY_DOWN = '6'; // 已下架

// 1 - 查看（公用） ，2 - 审核（通过），3 - 取消认证 ，4 - 业务处理
export const OPRATE_SEE_DETIALS = 1; // 查看详情
export const OPRATE_DETELET = 2; // 删除
// eslint-disable-next-line @typescript-eslint/camelcase
export const OPRATE_CANCAL_LiMIT = 6; // 取消限制申请

const TableTextUI = ( param1, content ) => (
    <div>
    <div>{param1 === 1 ? '可显示' : '不显示'}</div>
    <div style={{ display: 'flex', justifyContent: 'center', color: AppColor.Green }}>
      { param1 === 1 ? content : '-' }
    </div>
  </div>
    )


const getStrContent = (flag) => {
  console.log('getStrContent第二部',flag)
  let content = '';
  switch (Number(flag)) {
    case 4:
      content = "审核"
      break
    case 3:
      content = "驳回"
      break
    case 5:
      content = "发布"
      break
    case 6:
      content = "下架"
      break
    default:
      content = "创建"
      break
  }
  return content;
}

const getStrChildContent = (flag) => {
  console.log('getStrContent第二部',flag)
  let content = '';
  switch (Number(flag)) {
    case 4:
      content = "创建"
      break
    case 3:
      content = "创建"
      break
    case 5:
      content = "创建"
      break
    case 6:
      content = "下架"
      break
    default:
      console.log("getStrContent全走这了",Number(flag))
      content = "创建"
      break
  }
  return content;
}

const SelectClassCourseColumns = ( handleSelect  ) => [
  { title: '课程基本信息',
    dataIndex: 'className',
    key: '课程基本信息',
    render:(text) => (
      <span className={ utilStyle.textOverflow } title={ text }>
        {
          getlimitStr(15,text)
        }
      </span>)
  },
  { title: '分类栏目', dataIndex: 'classTypeName', key: 'classTypeName' ,
    render:(text) => (
      <span className={ utilStyle.textOverflow } title={ text }>
        {
          getlimitStr(11,deleteLastChart(text))
        }
      </span>)},
  { title: '搜素关键字', dataIndex: 'keyword', key: 'keyword' },
  { title: '资料类型', dataIndex: 'resourceType', key: 'resourceType',
    render:(text,record) => (
      <span>
        {
          sourceTypes[record.resourceType]
        }
      </span>)
  },
  { title: '时长', dataIndex: 'duration', key: 'duration',
    render:(text,record) => (
      <span>
        { record.resourceType === 1 ? `${(record.duration/60).toFixed(2)}分钟` : '' }
      </span>)
  },
  { title: '课程个数', dataIndex: 'count', key: 'count',
    render:(text,record) => (
      <span>
        { record.counts ?  record.counts: 0  }个子课程
      </span>)
  },
  { title: '讲师', dataIndex: 'lecturer', key: 'lecturer',
    render:(text) => (
      <span className={ utilStyle.textOverflow } title={ text }>
        {
          getlimitStr(6,text)
        }
      </span>)
  },
  { title: '创建人', dataIndex: 'createUserName', key: 'createUserName',
    render:(text,record) => (
      <span>
        {  handleEmptyStr(record.createUserName) }
      </span>)
  },
  { title: '创建时间', dataIndex: 'ctstamp', key: 'ctstamp',
    render:(text,record) => (
      <span>
        {  toTimestr2(handleEmptyStr(toTimestr2(record.ctstamp))) }
      </span>)
  },
  {
    title: '操作',
    key: '操作',
    render: (text, record) =>
       (
        <div style = {{ color: AppColor.Green, cursor: 'pointer' }} onClick={ () => handleSelect(record) }>
         选择
        </div>
      ) ,
  },
];

// 获取人群
const getThrong = (list) =>{
  let throngs = '';
  for(let i = 0; i<list.length; i++)
    throngs += `${list[i].throngName } 、`
  return throngs.slice(0,throngs.length-1);
}


const parentColumns = ( handleClassDialog, flag ) => [
  { title: '课程基本信息',
    dataIndex: '课程基本信息',
    key: '课程基本信息',
    width:'27%',
    render: (text, record) =>(
      <div className={styles.HLayout}>
        <div>
          <div className={styles.imgStyle}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img   className={styles.imgSrcStyle} src ={ isEmpty(record.imagetbUrl)? defalureImage : handleEmptyStr(record.imagetbUrl) }/>
          </div>
          <div className={styles.hintStyle}></div>
        </div>
        <div style={{marginLeft:6}}>
          <div className={ utilStyle.textOverflow }  title={ handleEmptyStr(record.className) } style={{ color: AppColor.Green }}>
            { getlimitStr(14,record.className) }
          </div>
          <div>
            <span >所属人群：</span>
            <span style={{ color: AppColor.Green }} title={ handleEmptyStr(deleteLastChart(record.throngName)) }>
              { record.throngName ? getlimitStr(10, deleteLastChart(record.throngName)) : '所有人群' }
            </span>
          </div>
          <div>
            <span >{ sourceTypes[record.resourceType] }</span>
            {
              record.resourceType === 1 ? <Divider type="vertical" />:''
            }
            <span >{ record.resourceType === 1 ? (record.duration/60).toFixed(2) : '' }分钟</span>
            <Divider type="vertical" />
            <span >{ record.counts ?  record.counts : 0 }个子课程</span>
          </div>
          <div style={{display: Number(record.isNominate) === 0? 'none':'block'}}>
            <span >热门推荐</span>
            <Divider type="vertical" />
            <span > { record.nominateCancelTime ? `${ toTimestr2(record.nominateCancelTime)}到期` : '无限期' }</span>
          </div>
        </div>

      </div>
    ),
  },
  { title: '分类栏目', dataIndex: 'classTypeName', key: 'classTypeName',
    render:(text) => (<span title= { deleteLastChart(text) }>{ getlimitStr(6,deleteLastChart(text))}</span>) },
  { title: '搜素关键字', dataIndex: 'keyword', key: 'keyword' },
  { title: '讲师', dataIndex: 'lecturer', key: 'lecturer',
  render:(text) => (<span title= { text }>{ getlimitStr(4,text)}</span>)
  },
  { title: '访问', dataIndex: '访问', key: '访问' , render: (text,record) => (<span>{ TableTextUI(record.isVisit,handleEmptyStr(record.visitNum)) }</span>)},
  { title: '学习', dataIndex: '学习', key: '学习' , render: (text,record) => (<span>{ TableTextUI(record.isStudy,handleEmptyStr(record.studyNum)) }</span>)},
  { title: '回复', dataIndex: '回复', key: '回复' , render: (text,record) => (<span>{ TableTextUI(record.isRelay,handleEmptyStr(record.relayNum)) }</span>)},
  { title: '点赞', dataIndex: '点赞', key: '点赞', render: (text,record) => (<span>{ TableTextUI(record.isLike,handleEmptyStr(record.likeNum)) }</span>) },
  { title: '点赞', dataIndex: '点赞', key: '转发', render: (text,record) => (<span>{ TableTextUI(record.isReply,handleEmptyStr(record.replyNum)) }</span>) },
  { title: getStrContent(flag), dataIndex: 'checker', key: 'checker' ,
    render: (text,record) => {
    console.log(' handleEmptyStr(record.cancelType)) ', typeof handleEmptyStr(record.cancelType))
    // `cancel_type` tinyint(2) DEFAULT NULL COMMENT '下架类型 1-手动下架 2-到期自动下架',
    return(
      <div>
        <div>{ handleEmptyStr(record.createUserName)}</div>
        <div>{ toTimestr2(handleEmptyStr(toTimestr2(record.ctstamp)))} </div>
        <div title={ Number(flag) === 6 ? handleEmptyStr(record.cancelDesc) : handleEmptyStr(record.checkerDesc) }
             style={{
               display: Number(flag) === 6 || Number(flag) === 3 ? 'block' : 'none',
               color: Number(flag) === 3 || (Number(flag) === 6 && handleEmptyStr(record.cancelType)=== 1)  ? AppColor.Red: AppColor.Origin
          }}>
          {
            // eslint-disable-next-line no-nested-ternary
            Number(flag) === 6 ?
              handleEmptyStr(record.cancelType)=== 1 ? getlimitStr(6,handleEmptyStr(record.cancelDesc)) : '到期下架'
              :
              getlimitStr(6,handleEmptyStr(record.checkerDesc))
          }
        </div>
     </div>)
  }},
  {
    title: '操作',
    key: '操作',
    render: (text, record) =>{
      const mflag = Number(flag)
      return (
      <div >
        <div>
                <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
                  <span onClick={() => handleClassDialog(record, FLAG_SEE)}>查看</span>
                  <Divider type="vertical" />
                  {
                    // eslint-disable-next-line no-nested-ternary
                    mflag === 0 || mflag === 1? // 未提交 和 未审核
                      <span onClick={() => handleClassDialog(record, FLAG_EDIT)}>修改</span>
                      :
                      // eslint-disable-next-line no-nested-ternary
                      mflag === 4 ? // 待发布
                        <span onClick={() => handleClassDialog(record, FLAG_RELEASE)}>发布</span>
                        :
                        // eslint-disable-next-line no-nested-ternary
                        mflag === 3 ? // 待发布
                          <span onClick={() => handleClassDialog(record, FLAG_CANCLE)}>取消</span>
                          :
                          mflag === 6 ? // 已下架
                            <span
                              style={{ color: handleEmptyStr(record.cancelType)=== 1 ? AppColor.Gray3 : AppColor.Green}}
                              onClick={() =>  handleEmptyStr(record.cancelType)=== 1 ? null : handleClassDialog(record, FLAG_DELAY_RELEASE)}
                            >
                              延期
                            </span>
                            :
                            <span onClick={() => handleClassDialog(record, FLAG_NO_USER)}>下架</span>

                  }

                </span>
        </div>
        <div style={{ display:  mflag === 5 || mflag === 3 ? 'none': 'block'}}>
            <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
              <span onClick={() => handleClassDialog(record, FLAG_DELETE)}>删除</span>
              <Divider type="vertical" />
              {
                // eslint-disable-next-line no-nested-ternary
                mflag === 0 ?
                  <span onClick={() => handleClassDialog(record, FLAG_SUBMIT)}>提交</span>
                  :
                  // eslint-disable-next-line no-nested-ternary
                  mflag === 6 ?
                    <span onClick={() => handleClassDialog(record, FLAG_REPUBLISH)}>重发</span>
                    :
                    mflag === 1 ?
                      <span onClick={() => handleClassDialog(record, FLAG_AUDIT)}>审核</span>
                      :
                      <span onClick={() => handleClassDialog(record, FLAG_CANCLE)}>取消</span>
              }
            </span>
        </div>

      </div>
    )} ,
  },
];

/**
 *
 * 子课堂
 */
const childColumns = (parentRecord,handleOprating,flag,isAppend) =>  [
  { title: '节次', width: '10%', dataIndex: 'seqno', key: 'seqno' },
  { title: '子课程基本信息',  width: '17%',dataIndex: '子课程基本信息', key: '子课程基本信息',
    render: (text, record) => (
      <div>
        <div>
          <span >标题：{ handleEmptyStr(record.courseName) }</span>
        </div>
        <div>
          <span>{ sourceTypes[record.resourceType] }</span>
          {
           record.resourceType === 1 ? <Divider type="vertical" />:''
          }
          <span >{ record.resourceType === 1 ? (record.duration/60).toFixed(2) : '' }分钟</span>
        </div>
      </div>
    )},
  { title: '所属课程', dataIndex: 'courseName', key: 'courseName' },
  { title: '讲师', dataIndex: 'lecturer', key: 'lecturer',render:(text) => (<span>{ getlimitStr(4,text)}</span>) },
  { title: '访问', dataIndex: 'visitNum', key: 'visitNum' },
  { title: '学习', dataIndex: '学习', key: '学习' },
  { title: '回复', dataIndex: 'relayNum', key: 'relayNum' },
  { title: '点赞', dataIndex: 'likeNum', key: 'likeNum' },
  { title: '转发', dataIndex: 'replyNum', key: 'replyNum' },
  { title: getStrChildContent(flag), dataIndex: 'lecturer', key: 'lecturer',
    render: (text, record) => (
      <div>
        <div>{ handleEmptyStr(record.createUserName)} </div>
        <div>{ toTimestr2(handleEmptyStr(toTimestr2(record.ctstamp)))}</div>
      </div>
    )
  },
  {
    title: '操作',
    key: '操作',
    render: (text, record) =>{
      const mflag = Number(flag)
      console.log('isAppend',isAppend)
      return (
        <div >
          <div>
                <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
                  <span onClick={() => handleOprating(record, FLAG_SEE)}>查看</span>
                  <span style={{ visibility: mflag === 6 || mflag === 5 || (isAppend === 0 && mflag === 4) ?'hidden':'visible'}} >
                  <Divider type="vertical" />

                  {
                    // eslint-disable-next-line no-nested-ternary
                    mflag === 0 || mflag === 1? // 未提交 和 未审核
                      <span onClick={() => handleOprating(record, FLAG_EDIT)}>修改</span>
                      :
                      // eslint-disable-next-line no-nested-ternary
                      mflag === 4 ? // 待发布
                        <span onClick={() => handleOprating(record, FLAG_RELEASE)}>发布</span>
                        :
                        // eslint-disable-next-line no-nested-ternary
                        mflag === 3 ? // 待发布
                          <span onClick={() => handleOprating(record, FLAG_CANCLE)}>取消</span>
                          :
                          mflag === 6 ? // 已下架
                            <span
                              style={{ color: handleEmptyStr(record.cancelType)=== 1 ? AppColor.Gray3 : AppColor.Green}}
                              onClick={() =>  handleEmptyStr(record.cancelType)=== 1 ? null : handleOprating(record, FLAG_DELAY_RELEASE)}
                            >
                              延期
                            </span>
                            :
                            <span/>

                  }
                  </span>

                </span>
          </div>
          <div style={{ display:  mflag === 5 || mflag === 3 || mflag === 6 || (isAppend === 0 && mflag)? 'none': 'block'}}>
            <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
              <span
                style={{ color:  mflag === 4 ? AppColor.Gray :  AppColor.Green}}
                onClick={() =>  mflag === 4 ? handleOprating(record, FLAG_DELETE) : null}>删除</span>
              <span  style={{ visibility: isAppend === 0 ? 'hidden':'visible'}} >
              <Divider type="vertical" />
              {
                // eslint-disable-next-line no-nested-ternary
                mflag === 0 ?
                  <span onClick={() => handleOprating(record, FLAG_SUBMIT)}>提交</span>
                  :
                  // eslint-disable-next-line no-nested-ternary
                  mflag === 6 ?
                    <span onClick={() => handleOprating(record, FLAG_REPUBLISH)}>重发</span>
                    :
                    mflag === 1 ?
                      <span onClick={() => handleOprating(record, FLAG_AUDIT)}>审核</span>
                      :
                      <span onClick={() => handleOprating(record, FLAG_CANCLE)}>取消</span>
              }
              </span>
            </span>
          </div>

        </div>
      )}
  },
];;

/**
 *
 * 子课堂
 */
const CommonChildColumns = () => [
  { title: '节次', dataIndex: 'seqno', key: 'seqno' },
  { title: '子课程基本信息', dataIndex: '子课程基本信息', key: '子课程基本信息',
    render: (text, record) => (
      <div>
        <div>
          <span >标题：{  record.className }</span>
        </div>
        <div>
          <span >{ sourceTypes[record.resourceType] }</span>
          {
            record.resourceType === 1 ? <Divider type="vertical" />:''
          }
          <span >{ record.resourceType === 1 ? (record.duration/60).toFixed(2) : '' }分钟</span>
        </div>
      </div>
    )},
  { title: '所属课程', dataIndex: 'courseName', key: 'courseName' },
  { title: '讲师', dataIndex: 'lecturer', key: 'lecturer', render:(text) => (<span>{ getlimitStr(4,text)}</span>) },
  { title: '访问', dataIndex: 'visitNum', key: 'visitNum' },
  { title: '学习', dataIndex: '学习', key: '学习' },
  { title: '回复', dataIndex: 'relayNum', key: 'relayNum' },
  { title: '点赞', dataIndex: 'likeNum', key: 'likeNum' },
  { title: '转发', dataIndex: 'replyNum', key: 'replyNum' },
  { title: '创建', dataIndex: 'lecturer', key: 'lecturer',
    render: (text, record) => (
      <div>
        {TableTextUI(handleEmptyStr(record.createUserName),toTimestr2(handleEmptyStr(record.ctstamp)))}
      </div>
    )
  },
];




export {
  childColumns, parentColumns, CommonChildColumns, SelectClassCourseColumns
}
