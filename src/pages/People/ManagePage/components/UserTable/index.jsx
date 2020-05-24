import React from 'react';
import {Table, Modal, LocaleProvider, Pagination, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import { AppColor } from '@/utils/ColorCommom';
import request from "@/utils/request";
import { BaseUrl } from "@/utils/Constant";
import { userColumns, userDeleteColumns } from '../../../help/Colums'
import {connect} from "dva";
import { FLAG_ADD, FLAG_SEE, isEmpty, PEOPLE_LOCAL, PEOPLE_NET_ALL, PEOPLE_NET_ID} from '@/utils/utils'
import UtilStyle from '@/utils/utils.less'


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
      size: 8,
      total:0,
      list:[],
      isLoadding: false,
      selectedRowKeys: [], // 添加时候选中的数据
      selectedStaticRowKeys: [], // 查询时候选中的数据
      fromValue:{},
    };
  }

  componentWillMount () {
    const { selectStaticList = []} = this.props.peopleModule
    const selectedRowKeys = []
    if(selectStaticList.length>0){ // 标表示已经选过用户列表了
      for (let i= 0 ; i < selectStaticList.length; i++){
        selectedRowKeys.push(selectStaticList.key)
      }
    }
    this.props.onChlidRef(this)
    this.requestListHttp();
  }

  // 设置查询条件
  setFromValue = (fromValue) => {
    this.setState({fromValue},() => {
      this.requestListHttp();
    })
  }

  // 选择后更新列表
  afterSelect = () => {
    this.setState({ size: 5 },() => {
      // message.info(`你好${this.state.size}`)
      this.requestListHttp();
    })
  }

  // 获取用户列表通过人群id
  getListById(){
    if(isEmpty(this.props.throngId)){
      return
    }
    this.setState({ isLoadding: true ,size: 5},
      ()=>{
        const { page, size, fromValue } = this.state;
        const self = this;
        request.get(`${BaseUrl}/manage/health/BaUserController/data/getDetail`, {
          params: {
            page,
            size,
            throngId: this.props.throngId,
            ... fromValue
          }
        })
          .then(function (response) {
            console.log('获取用户列表通过人群id',response);
            try{
              if(response.code === 200){
                self.setState({
                  list: Array.isArray(response.data.object ) ? response.data.object : [],
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

  // 获取所有的移动端列表
  getAllList(){
    this.setState({ isLoadding: true })
    const { page, size, fromValue } = this.state;
    const self = this;
    request.get(`${BaseUrl}/manage/health/BaUserController/data/getUser`, {
      params: {
        page,
        size,
        throngId: isEmpty(this.props.throngId) ? '' : this.props.throngId ,
        ... fromValue
      }
    })
      .then(function (response) {
        console.log('获取所有的移动端列表',response);
        try{
          if(response.code === 200){
            self.setState({
              list: Array.isArray(response.data.object ) ? response.data.object : [],
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

  // 更新列表
  requestListHttp = () => {
    const { show } = this.props
    console.log('获取', show )
    if(show === PEOPLE_LOCAL) this.getListById()
    if(show === PEOPLE_NET_ALL)  this.getAllList();
    if(show === PEOPLE_NET_ID) this.getListById()
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
    console.log('onShowSizeChange page', current)
      this.setState({
        page:1, size,
      },()=>{
        //   网络请求
        this.requestListHttp()
      })
  }

  /**
   * 处理数据操作
   * @param record
   * @param flag
   */
  handleSomeOpearts = ( record) =>{
        Modal.confirm({
          title: '删除',
          content: '确定删除该用户吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(record),
        });
  }

  // 删除当前数据
  deleteItem = (record) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'peopleModule/deleteBaThrongUser',
      payload:
        {
          data:{
            tuId: record.tuId,
          },
          cb:() => { this.requestListHttp() }
        },
    });
  }

  onSelectChange = (selectedRowKeys, rows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys,rows);
    this.setState({ selectedRowKeys });
    // 保存选中的列表
    const { selectStaticList = []} = this.props.peopleModule
    const allList = selectStaticList.concat(rows)
    const noRepeatList = [...new Set(allList)] // 去重后存储的列表
    const { dispatch } = this.props;
    const newList = []
    // eslint-disable-next-line no-plusplus
    for(let i = 0; i < selectedRowKeys.length; i++){
      // eslint-disable-next-line no-plusplus
      for(let j = 0; j < noRepeatList.length; j++){
        if(selectedRowKeys[i] === noRepeatList[j].key){
          newList.push( noRepeatList[j])
        }
      }
    }
    dispatch({
      type: 'peopleModule/UpdateSelectStaticListRes',
      payload:
        {
          data:newList,
          // cb:() => { this.requestListHttp() }
        },
    });
  };

  onStaticSelectChange = (selectedRowKeys, rows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys,rows);
    this.setState({ selectedStaticRowKeys:selectedRowKeys });
    // 保存选中的列表
    const { dispatch } = this.props;
    dispatch({
      type: 'peopleModule/toUpdateSelectDeleteListRes',
      payload:rows,
    });
  };

  render() {
    const { show, flag } = this.props;
    const { selectedRowKeys, selectedStaticRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys: PEOPLE_NET_ALL === show ? selectedRowKeys :  selectedStaticRowKeys,
      onChange: PEOPLE_NET_ALL === show ? this.onSelectChange : this.onStaticSelectChange,
    };
    const { page, size , total, list, isLoadding } = this.state;
    let columns = []
    if(show === PEOPLE_NET_ALL || flag === FLAG_SEE )
      columns = userColumns()
    else
      columns = userDeleteColumns(this.handleSomeOpearts)

    const bottomRightUI = <div>用户总数：<span style={{color: AppColor.Green}}>{ total }个</span></div>;
    return (
        <div className={ UtilStyle.MySmallTable }>
            <Table
              rowSelection={ show === PEOPLE_NET_ALL ? rowSelection : null}
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
