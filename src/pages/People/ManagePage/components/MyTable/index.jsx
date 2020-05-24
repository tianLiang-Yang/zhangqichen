import React from 'react';
import {Table, Modal, LocaleProvider, Pagination, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import { AppColor } from '@/utils/ColorCommom';
import utilStyles from '@/utils/utils.less'
import request from "@/utils/request";
import { BaseUrl, PageSize } from "@/utils/Constant";
import {  FLAG_ADD, FLAG_EDIT, FLAG_SEE, FLAG_RELEASE, FLAG_USER,FLAG_DELETE, FLAG_NO_USER } from "@/utils/utils";
import { manageListColumns, } from "../../../help/Colums";
import {connect} from "dva";

@connect(({ peopleModule }) =>
  ({
    peopleModule,
  }),
)
// 封装资讯列表
class MyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: PageSize,
      total:0,
      list:[],
      isLoadding: true,
      isVisiableRelease: false,
      id:0,
      throngTypeId:"",
    };
  }

  componentWillMount () {
    this.props.onChlidPeopleRef(this)
    this.requestNewManageListHttp();
  }

  setupdateListByHrongTypeId = (state) => {
    // this.setState({throngTypeId:id},()=>{
      this.requestNewManageListHttp(state)
    // })
   }

  /**
   * 请求人群管理列表数据
   */
  requestNewManageListHttp = (state) => {
    this.setState({ isLoadding: true })

    const { page, size, throngTypeId } = state || this.state ;
    const { status } = this.props;
    const self = this;
    const params = {
      pageNum : page,
      pageSize: size,
      throngTypeId,
      keyword:'',
    }
    if(status === '2')
      params.useflag = 0
    else
      params.isRelease = status
    request.get(`${BaseUrl}/usergroup/health/baThrong/getBaThrongList/page`, {
      params
    })
      .then(function (response) {
        console.log(response);
        try{
          if(response.code === 200){
              self.setState({
                list:Array.isArray(response.data.records ) ? response.data.records : [],
                total: response.data.total,
                isLoadding: false
              })
          }
        }catch (e) {
          console.log('资讯管理',e)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /**
   * [onPageChange 选择某一页事件]
   * @param  {[type]} page     [选中页]
   * @param  {[type]} pageSize [当前页容量]
   * @return {[type]}          [undefined]
   */
  onPageChange = (page, pageSize) => {
    console.log('onPageChange page', page)
      this.setState({
        page,
        size:pageSize,
      },()=>{
        //   网络请求课
        this.requestNewManageListHttp();
      })
  }

  /** [onShowSizeChange 页面数据多少改变] */
  onShowSizeChange = (current, size) => {
    console.log('onShowSizeChange page', current)
      this.setState({
        page:1, size,
      },()=>{
        //   网络请求
        this.requestNewManageListHttp();
      })
  }

  /**
   * 处理数据操作
   * @param record
   * @param flag
   */
  handleSomeOpearts = ( record, flag) =>{
    switch (flag) {
      case FLAG_DELETE:
        Modal.confirm({
          title: '删除',
          content: '确定删除该条人群吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(record),
        });
        break;
      case FLAG_USER:
      case FLAG_NO_USER:
      case FLAG_RELEASE:
        Modal.confirm({
          // eslint-disable-next-line no-nested-ternary
          title: FLAG_NO_USER === flag ? '停用' : FLAG_USER === flag ? '启用' : '发布',
          // eslint-disable-next-line no-nested-ternary
          content: FLAG_NO_USER === flag ? '是否停用该人群？' : FLAG_USER === flag ? '是否启用该人群？' : '是否立即发布？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.updatePeopleStatus(flag,record)
        });
        break
      case FLAG_EDIT:
        this.props.operatePeopleDialog(record, flag,this.state)
        break;
      case FLAG_SEE:
        this.props.operatePeopleDialog(record, flag,this.state)
        break;
      default:
        break;
    }
  }

  // 删除当前数据
  deleteItem = (record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'peopleModule/deletePeopleById',
      payload: {
        data:{
          throngId:record.throngId
        },
        cb: () => {
          this.requestNewManageListHttp()
        }
      },
    });
  }

  // 修改人群的状态 发布 停用 启用
  updatePeopleStatus = (flag,record) =>{
    const { dispatch } = this.props;
    const value = { throngId: record.throngId }
    // useflag（0-未启用1-使用）isRelease是否发布（0未发布1发布2下架）
    if(flag === FLAG_NO_USER) value.useflag = 0
    if(flag === FLAG_USER) value.useflag = 1
    if(flag === FLAG_RELEASE) value.isRelease = 1
    dispatch({
      type: 'peopleModule/updateBaThrong',
      payload: {
        data:value,
        cb: () => {
          this.requestNewManageListHttp()
        }
      },
    });
  }

  render() {

    const { page, size , total, list, isLoadding, isVisiableRelease } = this.state;
    const columns = manageListColumns(this.handleSomeOpearts, this.props.status);
    const bottomRightUI = <div>资讯总数：<span style={{color: AppColor.Green}}>{ total }个</span></div>;
    return (
        <div className={ utilStyles.MySmallTable }>
            <Table
              className="components-table-demo-nested"
              columns={columns}
              dataSource={ list }
              loading={ isLoadding }
              // rowSelection={rowSelection}
              pagination={ false }
            />
          <div className={ styles.PaginationBottom }>
            <div>
              { bottomRightUI !== null ? bottomRightUI : '' }
            </div>
            {/* eslint-disable-next-line @typescript-eslint/camelcase */}
            <LocaleProvider locale={ zh_CN }>
              <Pagination
                size = "small"
                total = { total }
                current = { page }
                defaultPageSize = { size }
                showSizeChanger
                onShowSizeChange = { this.onShowSizeChange }
                onChange = { this.onPageChange }
                showQuickJumper />
            </LocaleProvider>
          </div>
          <Modal
            title="发布"
            visible={ isVisiableRelease }
            onCancel={() => {
              this.setState({ isVisiableRelease: false });
            }}
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="50vw"
            style={{
              top: 60,
              bottom: 10,
            }}
            bodyStyle={{ overflow: 'scroll', height: '60vh' }}
            wrapClassName="report-modal-wrap"
          >
          </Modal>
          </div>
    );
  }
}

export default MyTable;
