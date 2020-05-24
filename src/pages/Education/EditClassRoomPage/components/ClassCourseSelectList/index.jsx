import React from 'react';
import {Table, LocaleProvider, Pagination, Switch, Input, message, Form, Row, Col, Button, TreeSelect} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import UtilStyles from '@/utils/utils.less';
import { AppColor } from '@/utils/ColorCommom';
import request from "@/utils/request";
import { BaseUrl } from "@/utils/Constant";
import { SelectClassCourseColumns, } from "../../../ManagePage/help/Colums";
import { connect } from "dva";

const formItemLayout = {
  labelCol: { span: 8},
  wrapperCol: { span: 16},
};

@connect(({ healthHomeDoctorModule, eduClassModule }) =>
  ({
    healthHomeDoctorModule,
    eduClassModule,
  }),
)
// 封装资讯列表
class ClassCourseSelectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: 9,
      total:0,
      list:[],
      isLoadding: true,
      switchType: false,
      searchValue: '',
    };
  }

  componentWillMount () {
    this.requestListHttp();
    this.getAllList()
  }

  /**
   * 获取上级课程分类
   */
  getAllList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eduClassModule/getAllClassList',
      payload: {},
    });
  }

  /**
   * 请求机构管理列表数据
   */
  requestListHttp = () => {
    this.setState({ isLoadding: true })
    const { page, size, searchValue = "" } = this.state;
    const self = this;
    request.post(`${BaseUrl}/classroom/Class/getListWithSelect`, {
      data:{
        page,
        size,
        ...searchValue,
        //  `resource_type` '资源类型：1-视频 2-音频，3-图文 4-文件 ）',
        resourceType: this.props.resourceType,
      }
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
        this.requestListHttp();
      })
  }

  /** [onShowSizeChange 页面数据多少改变] */
  onShowSizeChange = (current, size) => {
    console.log('onShowSizeChange page', current)
      this.setState({
        page:1, size,
      },()=>{
        //   网络请求
        this.requestListHttp();
      })
  }

  /**
   * 处理数据操作
   * @param record
   * @param flag
   */
  handleSomeOpearts = ( record) =>{
    // 将选择的机构数据信息存起来
    this.props.onSelectResult(record)

  }

  // 课堂分分类列表
  handleAllClassData = () => {
    const { allList = []} = this.props.eduClassModule;
    const treeList = JSON.parse(JSON.stringify(allList)
      .replace(/classTypeName/g,"title")
      .replace(/list/g,"children")
      .replace(/classTypeId/g,"value"));
    console.log('handleAllClassData',treeList)
    return treeList;
  }

  // 查询
  handleFromQuery = () => {
    this.props.form.validateFields((err, values) => {
      this.setState({ searchValue: values},()=>{
         this.requestListHttp()
      })
    });
  }

  // 重置查询条件
  handleReset = () =>{
    this.props.form.resetFields();
    this.props.form.validateFields((err, values) => {
      this.setState({ searchValue: values},()=>{
        this.requestListHttp()
      })
    });
  }



  render() {
    const {form: { getFieldDecorator }} = this.props;
    const { page, size , total, list, isLoadding } = this.state;
    const columns = SelectClassCourseColumns(this.handleSomeOpearts);
    const bottomRightUI = <div>机构总数：<span style={{color: AppColor.Green}}>{ total }个</span></div>;
    return (
        <div className={ UtilStyles.MySmallTable }>
          <div className={  `${UtilStyles.myFromItem} ${ styles.TopLayout }` }>
            <Form>
              <Row>
                <Col span={8}>
                  <Form.Item   {...formItemLayout} label="分类栏目">
                    {getFieldDecorator('classTypeIds', {
                      initialValue: []
                    })(
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={this.state.classValues}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择所属分类"
                        treeData={this.handleAllClassData()}
                        allowClear
                        multiple
                        treeDefaultExpandAll
                      />)}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item  { ...formItemLayout } label="课程标题">
                    {getFieldDecorator('className', {
                    })(<Input  placeholder="请输入课程标题" />)}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item  { ...formItemLayout } label="搜索关键字">
                    {getFieldDecorator('keyword', {
                    })(<Input  placeholder="请输入搜索关键字" />)}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <div className={styles.HLayout}>
                    <Button style={{marginLeft:10}} type="primary" onClick={ this.handleFromQuery }>查询</Button>
                    <Button style={{marginLeft:10}} onClick={ this.handleReset }> 重置</Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
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
          </div>
    );
  }
}

export default Form.create()(ClassCourseSelectList);
