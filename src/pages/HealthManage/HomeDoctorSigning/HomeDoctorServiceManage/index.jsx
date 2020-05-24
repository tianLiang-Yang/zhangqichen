import React from 'react';
import {Table, Modal, LocaleProvider, Pagination, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import { AppColor } from '@/utils/ColorCommom';
import request from "@/utils/request";
import { BaseUrl } from "@/utils/Constant";
import utilStyle from '@/utils/utils.less'
import {
  FLAG_EDIT,
  FLAG_RELEASE,
  FLAG_DELETE,
  FLAG_NO_USER,
  expanedeStyle
} from "@/utils/utils";
import { HomeServiceColumns, HomeServiceChildColumns} from "../../help/Colums";
import { connect } from "dva";
import {getOrgData} from "@/utils/sessionUtil";

@connect(({ healthHomeDoctorModule }) =>
  ({
    healthHomeDoctorModule,
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
      childList:[],
      isLoadding: false,
      ischildLoadding: true,
      isVisiableRelease: false,
      expandedRowKeys:[],
    };
  }

  componentWillMount () {
    this.props.onChlidHomeDoctorRef(this)
    const orgData = getOrgData();
    if(orgData)
        this.requestHomeDoctorListHttp();
  }

  /**
   * 请求人群管理列表数据
   * @page 指定请求哪一页
   */
  requestHomeDoctorListHttp = (page) =>{
    this.setState({ page }, ()=>{
      this.requestHomeDoctorListHttp()
    })
  }


  /**
   * 请求人群管理列表数据
   */
  requestHomeDoctorListHttp = () => {
    this.setState({ isLoadding: true })
    const { page, size } = this.state;
    const self = this;
    const orgData = getOrgData()
    if(!orgData){
      return
    }
    const params = {
      page,
      size,
      orgId: orgData.orgId,
    }
      request.get(`${BaseUrl}/fdsserve/manage/serve/pack/list`, {
        params
      })
      .then(function (response) {
        console.log(response);
        try{
          if(response.code === 200){
            const responseList =  Array.isArray(response.data.object ) ? response.data.object : [];
            const newList = []
            for (let i = 0; i < responseList.length; i++) {
              newList.push({...responseList[i], key:responseList[i].osPackId})
            }
            self.setState({
              list: newList,
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
        this.requestHomeDoctorListHttp();
      })
  }

  /** [onShowSizeChange 页面数据多少改变] */
  onShowSizeChange = (current, size) => {
      this.setState({
        page:1, size,
      },()=>{
        //   网络请求
        this.requestHomeDoctorListHttp();
      })
  }

  /**
   * 处理数据操作
   * @param record
   * @param flag
   */
  handleSomeOpearts = ( record, flag) =>{
    switch (flag) {
      case FLAG_NO_USER:
      case FLAG_RELEASE:
      case FLAG_DELETE:
        Modal.confirm({
          // eslint-disable-next-line no-nested-ternary
          title:  FLAG_NO_USER === flag ? '下架' : FLAG_RELEASE === flag ? '发布' : '删除',
          // eslint-disable-next-line no-nested-ternary
          content: FLAG_NO_USER === flag ? '是否停下架该服务包？' : FLAG_RELEASE === flag ? '是否立即发布？' : '是否删除该服务包',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.releaseOrDown(flag,record)
        });
        break
      case FLAG_EDIT:
        this.props.onModifySerVicePack(record)
        break;
      default:
        break;
    }
  }

  // 下架或发布服务包
  releaseOrDown = (flag,record) => {
    const { dispatch } = this.props;
    dispatch({
      // eslint-disable-next-line no-nested-ternary
      type: flag === FLAG_RELEASE ?
        'healthHomeDoctorModule/releaseServicePack' :
        flag === FLAG_DELETE ? 'healthHomeDoctorModule/deleteServicePack' : 'healthHomeDoctorModule/downServicePack',
      payload: {
        data:{
          osPackId: record.osPackId
        },
        cb: () => {
          this.requestHomeDoctorListHttp()
        }
      },
    });
  }

  // 点击展开图标
  onExpandTable = (expanded,record) =>{
    expanedeStyle(8);
    // const { expandedRowKeys } = this.state;
    if(expanded){
      this.setState({ expandedRowKeys: [ record.key ] })
    }else {
      this.setState({ expandedRowKeys: [] });
    }
    const self = this
    // 获取子服务包
    request.get(`${BaseUrl}/fdsserve/manage/pack/project/list?osPackId=${record.osPackId}`, {
    })
      .then(function (response) {
        console.log(response);
        try{
          if(response.code === 200){
            self.setState({
              childList: Array.isArray(response.data) ? response.data : [],
              ischildLoadding: false
            })
          }
        }catch (e) {
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteChildItem = (record) =>{
    const { dispatch } = this.props;
    const value = { osProjectId: record.osProjectId }
    dispatch({
      type: 'healthHomeDoctorModule/deleteProChildSer',
      payload: {
        data:value,
        cb: () => {
          this.requestHomeDoctorListHttp()
        }
      },
    });

  }

  ExpandUI = () =>{
    const { childList, ischildLoadding } = this.state;
    const columns = HomeServiceChildColumns(this.deleteChildItem)
    return <div className={ `${ utilStyle.MySmallTableHeader } ${utilStyle.MyExpandedFirstThTd}`  }>
              <Table
                columns={ columns }
                dataSource={ childList }
                loading={ ischildLoadding }
                pagination={ false }
              />
           </div>
  }

  render() {

    const { page, size , total, list, isLoadding, isVisiableRelease, expandedRowKeys } = this.state;
    const columns = HomeServiceColumns(this.handleSomeOpearts);
    const bottomRightUI = <div>资讯总数：<span style={{color: AppColor.Green}}>{ total }个</span></div>;
    return (
        <div className={ `${utilStyle.MyExpandedTable} ${ utilStyle.MySmallTable }` }>
            <Table
              indentSize={0}
              className="components-table-demo-nested"
              columns={columns}
              dataSource={ list }
              loading={ isLoadding }
              expandedRowKeys = { expandedRowKeys }
              onExpand = { this.onExpandTable }
              expandedRowRender={record => this.ExpandUI(record)}
              // expandedRowRender={record => <p style={{ margin: 0 }}>{ record.osPackDesc }</p>}
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
