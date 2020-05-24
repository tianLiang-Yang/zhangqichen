import React from 'react';
import {
  Table,
  Modal,
  DatePicker ,
  LocaleProvider,
  Pagination,
  message,
  Input,
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import { AppColor } from '@/utils/ColorCommom';

import { childColumns, parentColumns, TABLE_KEY_NO_COMMIT, TABLE_KEY_NO_AUDIT,
          TABLE_KEY_WATTING_REALEASE, TABLE_KEY_NO_PASS, TABLE_KEY_REALEASE, TABLE_KEY_DOWN
        } from '../../ManagePage/help/Colums'
import {connect} from "dva";
import {
  FLAG_AUDIT,
  FLAG_CANCLE, FLAG_DELAY_RELEASE,
  FLAG_DELETE,
  FLAG_EDIT, FLAG_NO_USER,
  FLAG_RELEASE, FLAG_REPUBLISH,
  FLAG_SEE,
  FLAG_SUBMIT,
  toTimestr
} from "@/utils/utils";
import utilStyle from "@/utils/utils.less";
import {Form} from "@ant-design/compatible";
import moment from "moment";
import AddVideo from "@/pages/Education/EditPage/components/VideoShow/AddVideo";
import AddText from "@/pages/Education/EditPage/components/VideoShow/AddText";

const { TextArea } = Input

/**
 * 一级课堂
 */
@connect(({ eduManageModule , user }) =>
  ({
    eduManageModule,
    currentUser: user.currentUser,
  }),
)

class MyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parentPage: 1, // 课程列表的页码
      parentSize:5,  // 课程列表的每页数
      childPage: 1, // 课堂列表的页码
      childSize:10, // 课堂列表的每页数
      radioValue:1, // 1 - 初始课程 2 - 追加子课程
      tabKey:'0',
      searchValue:{}, // 搜索条件
      expandedRowKeys:[],
      visibleDown: false, // 下架弹出框
      visibleDelayDate: false, // 延期弹出框控制
      cancelTime: undefined, // 延期时间
      record: undefined, // 当前数据
      visiableTextAdd: false, // 是否弹出添加图文的弹出框（修改和查看用）
      visiableVideoAdd: false, // 是否弹出添加视频的弹出框（修改和查看用）
      typeShow: 0, // 0- 添加 1 - 修改 2-查看
    };
  }

  componentWillMount () {
    this.props.onChlidRef(this)
    this.setState({ radioValue: this.props.chanageVisibleValue },()=>{
      this.updateList();
    })
  }

  onTabKeyChanage = (key) => {
    this.setState({ tabKey:key },()=>{
      this.updateList();
    })

  }

  /**
   * 点击搜索按钮查询售后父组件触发这个方法，
   * 用于更新列表
   * @param searchValue 查询条件的集合
   */
  updataSearchList = (searchValue) =>{
    this.setState({ searchValue },()=>{
      this.updateList()
    })
  }

  /**
   * 更新列表
   * @param searchValue 查询条件的集合
   */
  updateList(){
    const { tabKey,searchValue } = this.state;
    this.getData(searchValue,tabKey)
  }

  /**
   * 日期选择监听器
   * @param date
   * @param dateString
   */
  onDelayReleaseDateChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({ cancelTime: dateString })
  }

  // 子课程相关处理
  handleOprating = (record, flag) =>{
    console.log('record,flag',record,flag)
    this.setState({ record },() => {
      console.log('recordrecordrecord 1', record)
      switch (flag) {
        case FLAG_NO_USER: // 下架
          this.setState({ visibleDown: true })
          break
        case FLAG_RELEASE: // 发布
        case FLAG_DELETE: // 删除
          this.deleteOrReleaseClassCourse(record)
          break
        case FLAG_EDIT: // 修改
        case FLAG_SEE: // 查看
          this.setState({
            visiableTextAdd: Number(record.resourceType) === 3 , // 是否弹出添加图文的弹出框（修改和查看用）
            visiableVideoAdd: Number(record.resourceType) === 1 , // 是否弹出添加视频的弹出框（修改和查看用）
            typeShow: flag === FLAG_EDIT ? 1 : 2 , // 0- 添加 1 - 修改 2-查看
            record
          })
          break
        case FLAG_AUDIT: // 审核
        case FLAG_SUBMIT: // 提交
          this.props.toPushAppendEditPage({ id: record.classId, courseId: record.courseId,type: flag});
          break
        case FLAG_CANCLE: // 取消
          this.cancleCourse(record)
          break
        case FLAG_DELAY_RELEASE: // 延期发布
          this.setState({ visibleDelayDate: true})
          break
        default:
          break
      }
    })
  }

  // 子课程取消
  cancleCourse = (record) => {
    const {dispatch} = this.props
    dispatch({
      type:'eduAddModule/tochildCourseUpdate',
      payload:{
        data:{
          courseId:record.courseId,
          status: '1'
        },
        cb:()=>{
          this.updateList()
        }
      },
    });
  }


  /**
   * 课堂操作
   * @param record
   * @param flag
   */
  handleClassDialog = (record, flag) => {
    this.setState({ record },() => {
      switch (flag) {
        case FLAG_NO_USER: // 下架
          this.setState({ visibleDown: true })
          break
        case FLAG_RELEASE: // 发布
          this.props.toPushEditPage({ id: record.classId, type: flag});
          break
        case FLAG_DELETE: // 删除
          this.deleteOrReleaseClass(record,flag)
          break
        case FLAG_EDIT: // 修改
        case FLAG_SEE: // 查看
        case FLAG_AUDIT: // 审核
        case FLAG_SUBMIT: // 提交
          this.props.toPushEditPage({ id: record.classId, type: flag});
          break
        case FLAG_CANCLE: // 取消
        case FLAG_REPUBLISH: // 重发
          this.cancleOrResetClass(record,flag)
          break
        case FLAG_DELAY_RELEASE: // 延期发布
          this.setState({ visibleDelayDate: true})
          break
        default:
          break
      }
    })

  };

  /**
   * 延期发布
   */
  handleDelayRelease = () => {
    message.info('00')
    const { dispatch } = this.props;
    const { record, cancelTime } = this.state
    dispatch({
      type: 'eduAddModule/updateData',
      payload:{
        data:{
          classId: record.classId,
          // `status` '0' COMMENT '状态：（0-未提交；1-待审核；2-审核通过；3-审核驳回；4-待发布；
          // 5-已发布；6-已下架）',
          status: 4,
          // `release_type` tinyint(2) DEFAULT NULL COMMENT '发布类型 1-立即发布 2-延期发布',
          releaseType: 2,
          cancelTime // 延期时间
        },
        cb:()=>{
          this.updateList();
          this.setState({ visibleDelayDate: false})
        }
      },
    });
  }

  //  下架 课程
  handleClassCourseDown = () => {
    const { record } = this.state
    console.log('recordrecordrecord', record)
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'eduManageModule/classCourseDown',
        payload:{
          classId: record.classId,
          cancelDesc: fieldsValue.cancelDesc,
          cb:()=>{
            this.updateList();
            this.setState({ visibleDown: false })
          }
        },
      });
    });
  }

  // 取消 重发 课程
  cancleOrResetClass = (record,flag) => {
    Modal.confirm({
      title: `${ flag === FLAG_CANCLE ? '取消' : '重发' }`,
      content: `是否立即${ flag === FLAG_CANCLE ? '取消' : '重发' }该课程？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: flag === FLAG_CANCLE ? 'eduManageModule/classCancle' : 'eduAddModule/updateData' ,
          payload:{
            data:{
              classId: record.classId,
              // `status` '0' COMMENT '状态：（0-未提交；1-待审核；2-审核通过；3-审核驳回；4-待发布；
              // 5-已发布；6-已下架）',
              status: flag === 6 ? 5 : 1, // 取消操作不需要
            },
            cb:()=>{
              this.updateList();
            }
          },
        });
      }
    });
  }

  // 查看修改或添加子课程后的回调
  addCourseListener = () => {
    this.updateList()
    this.cancleDialog()
  }

  cancleDialog = () => {
    this.setState({
      visiableTextAdd: false ,
      visiableVideoAdd: false,
    })
  }

  // 课程 删除 发布 课程
  deleteOrReleaseClassCourse = (record,flag) => {
    Modal.confirm({
      title: `${ flag === FLAG_RELEASE ? '发布' : '删除' }`,
      content: `是否立即${ flag === FLAG_RELEASE ? '发布' : '删除' }该课程？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: `eduManageModule/${ flag === FLAG_RELEASE ? 'classCourseRelease':'ClassDelete'}`,
          payload:{
            classId:record.classId,
            // 下面的两个属性为发布时使用
            releaseType:1,
            releaseTimeDesc: toTimestr(Date.parse(new Date())),
            cb:()=>{
              this.updateList();
            }
          },
        });
      }
    });
  }

  // 课堂 删除 发布 课程
  deleteOrReleaseClass = (record,flag) => {
    console.log('recordrecordrecord 1', FLAG_RELEASE,flag)
    Modal.confirm({
      title: `${ flag === FLAG_RELEASE ? '发布' : '删除' }`,
      content: `是否立即${ flag === FLAG_RELEASE ? '发布' : '删除' }该课程？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: `eduManageModule/${ flag === FLAG_RELEASE ? 'classRelease':'ClassDelete'}`,
          payload:{
            classId:record.classId,
            // 下面的两个属性为发布时使用
            releaseType:1,
            releaseTimeDesc: toTimestr(Date.parse(new Date())),
            cb:()=>{
              this.updateList();
            }
          },
        });
      }
    });
  }

  /**
   * 下架弹出框的内容
   * @returns {*}
   */
   getModalContent = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...this.formLayout} label="">
          {getFieldDecorator('cancelDesc', {
            rules: [
              {
                message: '请输入至少五个字符的下架原因！',
                min: 5,
              },
            ],
          })(<TextArea rows={4} placeholder="请输入至少五个字符的下架原因" />)}
        </Form.Item>
      </Form>
    );
  };

  // 单选按钮事件
  onChildRadioChange = (value) => {
    console.log(`tabletable onChildRadioChange to ${value}`);
    this.setState({ radioValue: value },()=>{
      this.updateList();
    })
  }

  /**
   * [onPageChange 选择某一页事件]
   * @param  {[type]} page     [选中页]
   * @param  {[type]} pageSize [当前页容量]
   * @return {[type]}          [undefined]
   */
  onPageChange = (page, pageSize) => {
    const { radioValue } = this.state;
    console.log('onPageChange page', page)
    if(radioValue ===1){
      this.setState({
        parentPage:page, parentSize:pageSize,
      },()=>{
        //   网络请求课程课堂
        this.updateList();
      })
    } else {
      this.setState({
        childPage:page, childSize:pageSize,
      },()=>{
      //   网络请求追加课堂
        this.updateList();
      })
    }
  }

  /** [onShowSizeChange 页面数据多少改变] */
  onShowSizeChange = (current, size) => {
    console.log('onShowSizeChange page', current)
    const {  radioValue} = this.state;
    if(radioValue ===1){
      this.setState({
        parentPage:1, parentSize:size,
      },()=>{
        //   网络请求
        this.updateList();
      })
    } else {
      this.setState({
        childPage:1, childSize:size,
      },()=>{
        //   网络请求
        this.updateList();
      })
    }
  }

  // 获取列表数据
  getData = (searchValue) =>{
    const { dispatch } = this.props;
    const { radioValue, parentPage, parentSize, childPage, childSize, tabKey } = this.state;
    dispatch({
      type:  radioValue === 2 ? 'eduManageModule/fetchChildList' : 'eduManageModule/fetchList',
      payload: {
        data:{
          page: radioValue === 2 ? childPage : parentPage,
          size: radioValue === 2 ? childSize : parentSize,
          status: tabKey,
          ...searchValue,
          isAppend: radioValue === 2 ? 1 : 0
        },
        cb:()=>{

        }
      },
    });
  }

  // 追加子课程数据
  getChildColumsData = (tabKey) => {
    const { noCommitListChildResult, noAuditListChildResult,noPassListChildResult, WattingListChildResult
    } = this.props.eduManageModule
    let columsData = {}
    if (tabKey === TABLE_KEY_NO_PASS) {
      columsData = noPassListChildResult
    }else if(tabKey === TABLE_KEY_WATTING_REALEASE) {
      columsData = WattingListChildResult
    }else if(tabKey === TABLE_KEY_NO_COMMIT){
      columsData = noCommitListChildResult
    }else if(tabKey === TABLE_KEY_NO_AUDIT){
      columsData = noAuditListChildResult
    }
    return columsData
  }

  /**
   * getColums 获取表头对应的数据
   * @returns { columsData }
   */
  getParentColumsData = (tabKey) => {
    const { noCommitListResult, noAuditListResult, wattingReleaseListResult
      ,noPassListResult, releaseListResult, downListResult,
    } = this.props.eduManageModule
    let columsData = {}
    switch (tabKey) {
      case TABLE_KEY_NO_COMMIT:
         columsData = noCommitListResult
        break
      case TABLE_KEY_NO_AUDIT:
        columsData = noAuditListResult
        break
      case TABLE_KEY_WATTING_REALEASE:
        columsData = wattingReleaseListResult
        break
      case TABLE_KEY_NO_PASS:
        columsData = noPassListResult
        break
      case TABLE_KEY_REALEASE:
        columsData = releaseListResult
        break
      case TABLE_KEY_DOWN:
        columsData = downListResult
        break
      default:
        break
    }
    return columsData
  }

  // 点击展开图标
  onExpandTable = (expanded,record) =>{
    console.log('expandedRowKeys', record.key, expanded)
    if(expanded){
      this.setState({ expandedRowKeys: [ record.key ] })
    }else {
      this.setState({ expandedRowKeys: [] });
    }
    console.log('expandedRowKeys', record.key, expanded)
  }

  addKeyToList = (list) => {
    const newList = []
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < list.length; i++) {
      newList.push({... list[i], key:list[i].classId })
    }
    return newList
  }

  DefineTable =  () => {
    const { expandedRowKeys, parentSize, childSize , radioValue, parentPage, childPage, tabKey } = this.state;
    const columsData = radioValue === 1 ?   this.getParentColumsData(tabKey) : this.getChildColumsData(tabKey)
    // 判断当前显示数据
    const bottomRightUI =
      <div>课程总数：<span style={{color: AppColor.Green}}>
        { columsData.total ? columsData.total : 0} 个</span>
      </div>;
    // 初始课程子课程
    const expandedRowRender = (record) => {
      const childList = childColumns(record,this.handleOprating,tabKey,radioValue === 1 ? 0 : 1);
      return <div className={ `${ utilStyle.MySmallTableHeader } ${utilStyle.MyExpandedFirstThTd}`}>
              <Table columns={ childList } dataSource={record.list} pagination={false} />
             </div>
    };
    let parentList=[];
    let childList=[];
    if(radioValue === 1){
      parentList = this.getParentColumsData(tabKey).object ?   this.getParentColumsData(tabKey).object : []
    }else{
      childList = this.getChildColumsData(tabKey).object ?   this.getChildColumsData(tabKey).object : []
    }
   return  <div  className={`${ utilStyle.MyCourseSmallTable }`}>
             <div style={{ display: radioValue === 1 ? 'block':'none'}}>
               <Table
                 columns={ parentColumns(this.handleClassDialog,tabKey) }
                 dataSource={ parentList}
                 expandedRowRender={ radioValue === 2 ? null : record => expandedRowRender(record)}
                 expaneddRowKeys = { expandedRowKeys }
                 onExpand = { this.onExpandTable }
                 pagination={ false }
               />
             </div>
             <div  style={{ display: radioValue !== 1 ? 'block':'none'}}>
               <Table
                 columns={ childColumns("", this.handleOprating, tabKey) }
                 dataSource={childList}
                 pagination={ false }
               />
             </div>
            <div className={ styles.PaginationBottom }>
              <div>
                { bottomRightUI !== null ? bottomRightUI : '' }
              </div>
              {/* eslint-disable-next-line @typescript-eslint/camelcase */}
              <LocaleProvider locale={ zh_CN }>
                <Pagination
                  size = "small"
                  total = { columsData.total ? columsData.total : 0 }
                  current = { radioValue === 1 ? parentPage : childPage }
                  defaultPageSize = { radioValue === 1 ? parentSize : childSize}
                  showSizeChanger
                  onShowSizeChange = { this.onShowSizeChange }
                  onChange = { this.onPageChange }
                  showQuickJumper />
              </LocaleProvider>
            </div>
          </div>
  }

   disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }



  render() {
    const { visibleDown, visibleDelayDate, visiableTextAdd, visiableVideoAdd, radioValue, record, typeShow } = this.state
    const modalFooter =
       {
        okText: '保存',
        onOk: () => this.handleClassCourseDown()  ,
        onCancel: () => { this.setState({ visibleDown: false}) }
      };
    return (
     <div>
       { this.DefineTable()}

       <Modal
         title= "下架原因"
         width={640}
         bodyStyle={{
               padding: '28px 28px',
          }}
         destroyOnClose
         visible={ visibleDown }
         {...modalFooter}
       >
         { this.getModalContent()}
       </Modal>

       <Modal
         title= "选择延期日期"
         width={500}
         bodyStyle={{
           padding: '28px 28px',
           height:200
         }}
         onOk={ () => this.handleDelayRelease()}
         onCancel={ () => this.setState({ visibleDelayDate: false })}
         destroyOnClose
         visible={ visibleDelayDate }
       >
         <DatePicker
           style={{width:260}}
           showToday={false}
           disabledDate={ (current)=> current && current < moment().endOf('day')}
           onChange={ this.onDelayReleaseDateChange } />
       </Modal>

       <Modal
         title="编辑子课堂"
         visible={ visiableVideoAdd }
         onCancel={() => {
           this.setState({ visiableVideoAdd: false , typeShow: 0});
         }}
         destroyOnClose // 关闭时销毁 Modal 里的子元素
         maskClosable={false} // 点击遮照能不能关闭Modal
         footer={null} // 底部按钮
         width="60vw"
         style={{
           top: 20,
           bottom: 20,
         }}
         bodyStyle={{ overflow: 'scroll', height: '85vh' }}
         wrapClassName="report-modal-wrap"
       >
         <AddVideo
           isAppend = { radioValue === 1 ? 0 : 1 }
           current = { record }
           typeShow = { typeShow }
           addCourseListener = { this.addCourseListener }
           cancleDialog = { this.cancleDialog }
         />
       </Modal>
       <Modal
         title="编辑子课堂"
         visible={ visiableTextAdd }
         onCancel={() => {
           this.setState({ visiableTextAdd: false , typeShow: 0});
         }}
         destroyOnClose // 关闭时销毁 Modal 里的子元素
         maskClosable={false} // 点击遮照能不能关闭Modal
         footer={null} // 底部按钮
         width="80vw"
         style={{
           top: 10,
           bottom: 10,
         }}
         bodyStyle={{ overflow: 'scroll', height: '90vh' }}
         wrapClassName="report-modal-wrap"
       >
         <AddText
           isAppend = {  radioValue === 1 ? 0 : 1  }
           current = { record }
           typeShow = { typeShow }
           addCourseListener = { this.addCourseListener }
           cancleDialog = { this.cancleDialog }
         />
       </Modal>
     </div>
    );
  }
}

export default Form.create()(MyTable);
