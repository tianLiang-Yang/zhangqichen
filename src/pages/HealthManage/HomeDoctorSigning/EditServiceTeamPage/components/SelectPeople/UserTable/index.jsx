import React from 'react';
import {Table, LocaleProvider, Pagination} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import { AppColor } from '@/utils/ColorCommom';
import request from "@/utils/request";
import { BaseUrl } from "@/utils/Constant";
import { userColumns } from '../../../../../help/Colums'
import {connect} from "dva";
import UtilStyle from '@/utils/utils.less'
import {getOrgData} from "@/utils/sessionUtil";


@connect(({ peopleModule }) =>
  ({
    peopleModule,
    throngId : peopleModule.throngId,
  }),
)
// 封装资讯列表
class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: 7,
      total:0,
      list:[],
      isLoadding: false,
      selectedRowKeys: [], // 添加时候选中的数据
    };
  }

  componentWillMount () {
    this.props.onChlidRef(this)
    const { selectStaticList = []} = this.props.peopleModule
    const selectedRowKeys = []
    if(selectStaticList.length>0){ // 标表示已经选过用户列表了
      for (let i= 0 ; i < selectStaticList.length; i++){
        selectedRowKeys.push(selectStaticList.key)
      }
    }
    // this.props.onChlidRef(this)
    this.requestListHttp();
  }

  // 设置查询条件
  setFromValue = (fromValue) => {
    this.setState({fromValue},() => {
      this.requestListHttp();
    })
  }

  // 获取用户列表通过人群id
  getListById(){
    const orgData = getOrgData();
    this.setState({ isLoadding: true },
      ()=>{
        const { page, size, fromValue } = this.state;
        console.log('fromValue',fromValue)
        const self = this;
        request.get(`${BaseUrl}/manage/user/search/list/page`, {
          params: {
            orgId: orgData.orgId,
            orgTeamId: this.props.orgTeamId,
            page,
            size,
            ... fromValue
          }
        })
          .then(function (response) {
            try{
              const resList =  Array.isArray(response.data.object ) ? response.data.object : [];
              const newList =  []
              for (let i = 0; i < resList.length; i++) {
                newList.push({  ...resList[i], key: resList[i].userId})
              }
              if(response.code === 200){
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
    })
  }

  // 更新列表
  requestListHttp = () => {
   this.getListById()
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
        this.requestListHttp()
      })
  }

  /** [onShowSizeChange 页面数据多少改变] */
  onShowSizeChange = (current, size) => {
      this.setState({
        page:1, size,
      },()=>{
        //   网络请求
        this.requestListHttp()
      })
  }


  // 选择
  onSelectChange = (selectedRowKeys, rows) => {
    this.setState({ selectedRowKeys });
    // 保存选中的列表
    const { selectStaticList = []} = this.props.peopleModule
    const allList = selectStaticList.concat(rows)
    const noRepeatList = [...new Set(allList)] // 去重后存储的列表
    const newList = []
    // eslint-disable-next-line no-plusplus
    for(let i = 0; i < selectedRowKeys.length; i++){
      // eslint-disable-next-line no-plusplus
      for(let j = 0; j < noRepeatList.length; j++){
        if(selectedRowKeys[i] === noRepeatList[j].key){
          newList.push( {
            drId: noRepeatList[j].userId ,
            isLeader: 0,
            isMaster: 0,
          })
        }
      }
    }
    console.log('selectedRowKeys list: ', newList);
   //  实时回调给父级
   this.props.onRowSelectListener(newList)
  };


  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys ,
      onChange: this.onSelectChange,
    };
    const { page, size , total, list, isLoadding } = this.state;
    const columns = userColumns()
    const bottomRightUI = <div>用户总数：<span style={{color: AppColor.Green}}>{ total }个</span></div>;
    return (
        <div className={ UtilStyle.MySmallTable }>
            <Table
              rowSelection={ rowSelection }
              className="components-table-demo-nested"
              columns={columns}
              dataSource={ list }
              loading={ isLoadding }
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
                pageSize = { size }
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

export default UserTable;
