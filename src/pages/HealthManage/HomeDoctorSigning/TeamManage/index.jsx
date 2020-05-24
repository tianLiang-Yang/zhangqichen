import React from 'react';
import {Table, Modal, LocaleProvider, Pagination} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import defaultImage from '@/img/defalute_failure.png'
import { AppColor } from '@/utils/ColorCommom';
import request from "@/utils/request";
import { BaseUrl } from "@/utils/Constant";
import {
  FLAG_EDIT,
  FLAG_SEE,
  FLAG_RELEASE,
  FLAG_USER,
  FLAG_DELETE,
  FLAG_NO_USER,
  expanedeStyle
} from "@/utils/utils";
import { teamManageColumns, TeamManageColumns,} from "../../help/Colums";
import { connect } from "dva";
import {getOrgData} from "@/utils/sessionUtil";
import utilStyle from "@/utils/utils.less";

@connect(({ healthHomeDoctorModule }) =>
  ({
    teamUserList: healthHomeDoctorModule.teamUserList,
    teamSelectPackList: healthHomeDoctorModule.teamSelectPackList,
  }),
)

// 请求人团队列表
class MyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: 5,
      total:0,
      list:[],
      isLoadding: false,
      isVisiableRelease: false,
      expandedRowKeys:[],
      teamUserList:[],
      teamSelectPackList:[],
    };
  }

  componentWillMount () {
    this.props.onChlidTeamRef(this)
    this.requestTeamListHttp();
  }


  /**
   * 请求人团队列表
   *  @page 指定请求哪一页
   */
  requestTeamListHttp = (page) => {
    this.setState({ page }, ()=>{
      this.requestTeamListHttp()
    })
  }

  /**
   * 请求人团队列表
   */
  requestTeamListHttp = () => {
    const orgData = getOrgData();
    if(!orgData)
      return
    this.setState({ isLoadding: true })
    const { page, size } = this.state;
    const self = this;
    const params = {
      orgId: orgData.orgId,
      page,
      size,
    }
    request.get(`${BaseUrl}/fdsserve/manage/team/list`, {
      params
    })
      .then( (response) => {
        try{
          if(response.code === 200){
            const responseList =  Array.isArray(response.data.object ) ? response.data.object : [];
            const newList = []
            for (let i = 0; i < responseList.length; i++) {
              newList.push({...responseList[i], key: responseList[i].orgTeamId})
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
        this.requestTeamListHttp();
      })
  }

  /** [onShowSizeChange 页面数据多少改变] */
  onShowSizeChange = (current, size) => {
      this.setState({
        page:1, size,
      },()=>{
        //   网络请求
        this.requestTeamListHttp();
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
          title: FLAG_NO_USER === flag ? '下架' : '发布',
          // eslint-disable-next-line no-nested-ternary
          content: FLAG_NO_USER === flag ? '是否立即下架？' : '是否立即发布？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.updatePeopleStatus(flag,record)
        });
        break
      case FLAG_EDIT:
        this.props.onModifyTeam(record)
        break;
      case FLAG_SEE:
        this.props.operatePeopleDialog(record, flag)
        break;
      default:
        break;
    }
  }

  // 修改人群的状态 发布下架
  updatePeopleStatus = (flag,record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: flag === FLAG_NO_USER ?  'healthHomeDoctorModule/forbirdTeam' : 'healthHomeDoctorModule/OpenTeam',
      payload: {
        data:{
          orgTeamId: record.orgTeamId
        },
        cb: () => {
          this.requestTeamListHttp()
        }
      },
    });
  }


  // 删除当前数据
  deleteItem = (record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/deleteTeam',
      payload: {
        data:{
          orgTeamId:record.orgTeamId
        },
        cb: () => {
          this.requestTeamListHttp()
        }
      },
    });
  }

  // 点击展开图标
  onExpandTable = (expanded,record) =>{
    expanedeStyle()
    if(expanded){
      this.setState({ expandedRowKeys: [ record.key ] })
    }else {
      this.setState({ expandedRowKeys: [] });
    }
    this.getTeamUserList(record)
    this.getSelectPackList(record)
  }

  ExpandUI = () =>{
    const columns2 = teamManageColumns(this.deleteChildItem)
    const { teamSelectPackList, teamUserList = [] } = this.state
    const packServiceUI = teamSelectPackList.map((item) =>
      <div className={ styles.Box }>
        <div >
          <img
            id = {`img${item.osPackId}`}
            ystyle={{ width:50, height:50 }}
            alt="" src={ item.imagetbUrl }
            onError={ () => {
              document.getElementById(`img${item.osPackId}`).src = defaultImage
            }} />
        </div>
      </div>)
    return <div className={ `${ utilStyle.MySmallTableHeader } ${utilStyle.MyExpandedFirstThTd}` }>
              <Table dataSource={teamUserList} columns={columns2}  pagination={ false } />
              <div className={styles.TableBox}>团队家医服务包</div>
               {
                packServiceUI
               }
           </div>
  }

  getTeamUserList = (record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/getTeamUserList',
      payload:{
        orgTeamId: record.orgTeamId,
        cb:(teamUserList)=>{
          this.setState({ teamUserList})
        }
      },
    });
  }

  // 获取团队已经选择的服务包列表
  getSelectPackList = (record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/getSelectPackList',
      payload:{
        orgTeamId: record.orgTeamId,
        cb: ( teamSelectPackList ) => {
          this.setState({ teamSelectPackList })
        }
      },
    });
  }

  render() {
    const { page, size , total, list, isLoadding, expandedRowKeys, isVisiableRelease } = this.state;
    const columns = TeamManageColumns(this.handleSomeOpearts, this.props.status);
    const bottomRightUI = <div>资讯总数：<span style={{color: AppColor.Green}}>{ total }个</span></div>;
    return (
          <div className={ `${utilStyle.MyExpandedTable} ${ utilStyle.MySmallTable }` }>
            <Table
              columns={columns}
              dataSource={ list }
              loading={ isLoadding }
              expandedRowKeys = { expandedRowKeys }
              onExpand = { this.onExpandTable }
              expandedRowRender={ record => this.ExpandUI(record)}
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
          </div>
    );
  }
}

export default MyTable;
