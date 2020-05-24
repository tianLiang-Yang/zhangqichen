import React from 'react';
import {Table, LocaleProvider, Pagination, Switch, Input, message} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import UtilStyles from '@/utils/utils.less';
import { AppColor } from '@/utils/ColorCommom';
import request from "@/utils/request";
import { BaseUrl } from "@/utils/Constant";
import { OrgColumns, } from '../../../help/Colums';
import { connect } from "dva";
import {setOrgData} from "@/utils/sessionUtil";

const { Search } = Input;

@connect(({ healthHomeDoctorModule }) =>
  ({
    healthHomeDoctorModule,
  }),
)
// 封装资讯列表
class OrgSelectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: 7,
      total:0,
      list:[],
      isLoadding: true,
      switchType: false,
      searchValue: '',
    };
  }

  componentWillMount () {
    this.requestOrgListHttp();
  }


  /**
   * 请求机构管理列表数据
   */
  requestOrgListHttp = () => {
    this.setState({ isLoadding: true })
    const { page, size, switchType, searchValue  } = this.state;
    const self = this;
    const params = {
      optcode:'FDSSERVE',
      page,
      size,
      type: switchType ? 2 : 1 , // 型（1：所有，2：未开通）
      keyword: searchValue,
    }
    request.get(`${BaseUrl}/manage/health/BaOrganizationController/fds/search/org`, {
      params
    })
      .then(function (response) {
        console.log(response);
        try{
            self.setState({
              list:Array.isArray(response.data.object ) ? response.data.object : [],
              total: response.data.total,
              isLoadding: false
            })
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
        this.requestOrgListHttp();
      })
  }

  /** [onShowSizeChange 页面数据多少改变] */
  onShowSizeChange = (current, size) => {
    console.log('onShowSizeChange page', current)
      this.setState({
        page:1, size,
      },()=>{
        //   网络请求
        this.requestOrgListHttp();
      })
  }

  /**
   * 处理数据操作
   * @param record
   * @param flag
   */
  handleSomeOpearts = ( record) =>{
    // 将选择的机构数据信息存起来

    this.props.onOrgSelectDestory(record)
  }

  // 是否只显示已开通
  onSwitchChange = (checked) => {
    this.setState({ switchType: checked },() => {
      this.requestOrgListHttp()
    })

  }

  handleInputSearch = (value) => {
    this.setState({
      page: 0,
      searchValue: value
    },()=>{
      //   网络请求课
      this.requestOrgListHttp();
    })
  }

  render() {
    const { page, size , total, list, isLoadding, switchType, searchValue } = this.state;
    const columns = OrgColumns(this.handleSomeOpearts);
    const bottomRightUI = <div>机构总数：<span style={{color: AppColor.Green}}>{ total }个</span></div>;
    return (
        <div className={ UtilStyles.MySmallTable }>
          <div className={styles.TopLayout}>
            <div>
              <Switch checked={ switchType } onChange={ this.onSwitchChange }/>
              <div>只显示未开通家医签约机构</div>
            </div>
            <Search
              showSearch
              // value ={ searchValue }
              size = "normal"
              shape="round"
              placeholder="输入机构名称"
              style = {{ width: 324 }}
              onSearch = { value => this.handleInputSearch(value) }
            />
          </div>
            <Table
              style={{ marginTop: 10 }}
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
          </div>
    );
  }
}

export default OrgSelectList;
