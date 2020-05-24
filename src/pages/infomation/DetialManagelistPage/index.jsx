import React from 'react';
import {Card, Table, Divider, Button, Menu,
  Dropdown, Icon , Input, Row, Col,Tabs} from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';
import { AppColor } from '@/utils/ColorCommom';
import IconFont from '@/components/IconFont';
import { getHelpColumns } from './help/Colums'
import CommonTable from "@/pages/DoctorQualificationReview/components/common-table";
import {connect} from "dva";
import {handleEmptyStr} from "@/utils/utils";

const { Search } = Input;
const { TabPane } = Tabs;
const TabsList = [
  { name: '未发布', key: '1' },
  { name: '已发布', key: '2' },
  { name: '已下架', key: '3' },
];

@connect(({ infomationManage }) =>
  ({
    infomationManage,
  }),
)


class DetialManagelistPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      current: undefined, // 当前数据
    };
  }

  componentDidMount() {
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  /**
   * 操作
   * @param record
   * @param flag
   */
  handleAduitDialog = (record, flag) => {
    console.log(record, flag);
  };

  Add = () => {};

  // 输入框搜索
  handleInputSearch = value => {
    this.child.onChanageKeyWord(value);
  };

  // 底部移除按钮
  handleMenuClick = (e) => {
    console.log('click', e);
  }
  /**
   * getColums 获取表头
   *  flag // 1-待审核 2-已通过  4-已驳回 3-已取消
   * @returns { colums }
   */
  getColums = (flag) => {
    const  colums = getHelpColumns(this.handleColumsOprate,flag);

    return colums;
  }


  /**
   * handleAduitDialog 资质审核操作处理
   * @param url
   */
  handleColumsOprate = (record, dialogControl) => {
    this.setState({ current: record },
      () => {
      })
  };

  /**
   * 获取列表数据http请求
   */
  getTableList = (page, pageSize, flag) => {
    const { dispatch } = this.props;
    const params = {'你好':'你好'};
    dispatch({
      type: 'infomationManage/fetch',
      payload: {
        size: pageSize,
        page,
        status: flag, // 身份状态（1-待审批2-认证通过3-申请驳回4-认证被取消
        ...params
      },
    });
  }

  /**
   * 列表数据返回结果
   *  flag // 1-待审核 2-已通过  4-已驳回 3-已取消
   */
  getResultData = (flag) => {
    let result = {};
    const {
      wattingResult = {},
      passResult = {},
      rejectedResult ={},
    } = this.props.infomationManage;
    switch (Number(flag)) {
      case 1:
        result = wattingResult;
        break
      case 2:
        result = passResult;
        break
      case 3:
        result = rejectedResult;
        break
      default:
        result = [];
        break
    }
    return result;
  }

  rightBottomUI = (userDrverifyCount) => {
    const menu = (
      <Menu onClick={ this.handleMenuClick }>
        <Menu.Item key="1">移除</Menu.Item>
      </Menu>
    );
    return <div className={styles.RightBottomBox}>
      <div>
        资讯总个数:&nbsp;&nbsp;<span style={{color:AppColor.Green}}>{userDrverifyCount}个</span>
      </div>
      <Dropdown overlay={menu}>
        <Button>
          移除 <Icon type="down" />
        </Button>
      </Dropdown>
    </div>
  }


  render() {

    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    // tab 页面
    const TabPanes = TabsList.map((item) => {
      const result = this.getResultData(item.key);
      const {  isLoadding } = this.props.infomationManage;
      const panes = <TabPane tab = { item.name } key = { item.key }>
        <CommonTable
          flag = { item.key }
          isLoadding = { isLoadding }
          result = { result }
          rowSelection={rowSelection}
          rightBottomUI = { this.rightBottomUI(11) }
          Colums = { this.getColums(item.key) }
          getTableList = {this.getTableList}
          onChlidRef = { this.onChlidRef }
          key={ item.key }/>
      </TabPane>;
      return panes;
    });


    const leftColumns = [
      { title: '资讯分类名称', dataIndex: '资讯分类名称', key: '资讯分类名称',  render: (text, record) => (
          <span style={{ color: AppColor.Gray2, cursor: 'pointer' }}>
            <span >养生保健</span>
            <Divider type="vertical" />
            <span>公共资讯</span>
            <Divider type="vertical" />
            {/* eslint-disable-next-line max-len */}
            <span >120</span>
            </span>
        ),},
    ];

    const expandedRowRender = () => {
      const columns = [
        { title: '资讯分类名称', dataIndex: '资讯分类名称', key: '资讯分类名称' ,
          render: (text, record) => (
            <span style={{ color: AppColor.Gray2, cursor: 'pointer' }}>
            <span >养生保健</span>
            <Divider type="vertical" />
            <span>公共资讯</span>
            <Divider type="vertical" />
              {/* eslint-disable-next-line max-len */}
              <span >120</span>
            </span>
          ),},
      ];
      const data = [];
      for (let i = 0; i < 5; ++i) {
        data.push({
          资讯分类名称: '养生保健',
          资讯分类属性: '公共资讯',
          阅读: '120',
        });
      }
      return <Table columns={columns} dataSource={data} pagination={false} />;
    };


    const leftData = [];
    for (let i = 0; i < 6; ++i) {
      leftData.push({
        资讯分类名称: '养生保健',
        资讯分类属性: '公共资讯',
        阅读: '120',
      });
    }

    const data = [];
    for (let i = 0; i <5; i++) {
      data.push({
        key: i,
        资讯名称: `北京疾控中心 ${i}`,
        作者: '赵丽颖',
        资讯来源: `手动流入 ${i}`,
        所属分类: '疾控资讯',
        搜索关键字: '赵丽颖',
        阅读: '10002',
        回复: '1000',
        点赞: '11',
        转发: '133',
        权重: '133',
        状态: '停用',
        发布时间: '2014-12-24 23:12:00',
      });
    }

    const rightUI = <div className={styles.rightLayout}>
                        <div className={styles.rightChildLayout}>
                          <IconFont type="iconiconjia" style={{ fontSize: 18 }} onClick={this.Add} />
                          <div className={styles.InputContent}>
                            <div>
                                      <span style={{ paddingLeft: '30px' }}>
                                        <Search
                                          showSearch
                                          // value={searchValue}
                                          size="normal"
                                          shape="round"
                                          placeholder="输入资讯名称、关键字或快速查询"
                                          style={{ width: 324 }}
                                          onChange={this.chanageInput}
                                          onSearch={value => this.handleInputSearch(value)}
                                        />
                                      </span>
                            </div>
                          </div>
                        </div>
                        <span style={{ marginLeft: 8 }}>
                                  {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                                </span>
                        <div>
                        </div>
                      </div>

    return (
      <Card>
        <div className={styles.main}>
          <div className={styles.topLayout}>
            <TopTitle2 {...{ title: '资讯明细管理', rightUI }} />

          </div>
          <div>
            <Row>
              <Col span={5}>
                <div className={styles.BorderLeftBox}>
                    <Table
                      className="components-table-demo-nested"
                      columns={leftColumns}
                      expandedRowRender={expandedRowRender}
                      dataSource={leftData}
                    />
                </div>
              </Col>
              <Col span={19}>
                <div className={styles.BorderRightBox}>
                  <Tabs
                    className={ styles.MyTabs }
                    animated = {false}
                    defaultActiveKey = { TabsList[0].key }
                    onChange={ this.tabCallback }>
                    {TabPanes}
                  </Tabs>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    );
  }
}

export default DetialManagelistPage;
