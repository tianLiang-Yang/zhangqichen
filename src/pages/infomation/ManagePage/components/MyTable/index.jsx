import React from 'react';
import { Table, Modal, LocaleProvider, Pagination} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import { AppColor } from '@/utils/ColorCommom';
import request from "@/utils/request";
import { BaseUrl } from "@/utils/Constant";
import AuditNews from '../AuditNews'
import { manageListColumns,
         OPRATE_DETELET,
         OPRATE_TOP,
         OPRATE_RELEASE,
         OPRATE_EDIT,
       } from '../../help/Colums'
import {connect} from "dva";
import AddText from "@/pages/Education/EditPage/components/VideoShow/AddText";

@connect(({ infomationModule }) =>
  ({
    infomationModule,
  }),
)
// 封装资讯列表
class MyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: 5,
      total:0,
      list:[],
      isLoadding: true,
      isVisiableRelease: false,
      current: undefined
    };
  }

  componentWillMount () {
    // this.props.onChlidRef(this)
    this.requestNewManageListHttp();
  }

  onReleaseRelust = () =>{
    this.setState({isVisiableRelease: false})
    this.requestNewManageListHttp()
  }

  /**
   * 请求资讯管理列表数据
   */
  requestNewManageListHttp = () => {
    this.setState({ isLoadding: true })
    const { page, size } = this.state;
    const self = this;
    request.get(`${BaseUrl}/news/health/baNews/list/page`, {
      params: {

        pageNum : page,
        pageSize: size,
        status: this.props.status,
        keyword:'',
      }
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
    console.log('handleSomeOpearts',record)
    switch (flag) {
      case OPRATE_DETELET:
        Modal.confirm({
          title: '删除该条资讯吗',
          content: '确定删除该条课程分类吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(record),
        });
        break;
      case OPRATE_RELEASE:
        this.setState({ current:record,isVisiableRelease: true})
        break
      default:
        break;
    }
  }

  // 删除当前数据
  deleteItem = (record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'infomationModule/deleteNewById',
      payload: {
        data:{
          newsId:record.newsId
        },
        cb: () => {
          this.requestNewManageListHttp()
        }
      },
    });
  }

  render() {
    const { page, size , total, list, isLoadding, isVisiableRelease, current } = this.state;
    const columns = manageListColumns(this.handleSomeOpearts, this.props.status);
    const bottomRightUI = <div>资讯总数：<span style={{color: AppColor.Green}}>{ total }个</span></div>;
    return (
        <div>
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
          <AuditNews id={ current ? current.newsId : 0 } onReleaseRelust ={this.onReleaseRelust }/>
          </Modal>
          </div>
    );
  }
}

export default MyTable;
