import React from 'react';
import { Card, Table, Divider, Input } from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';
import { AppColor } from '@/utils/ColorCommom';
import IconFont from '@/components/IconFont';
import {
  OPRATE_LIMIT_AUDIT,
  OPRATE_SEE_DETIALS,
} from '@/pages/DoctorQualificationReview/help/Colums';

const { Search } = Input;
class HostRecommend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    };
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

  render() {
    const columns = [
      {
        title: '资讯名称',
        dataIndex: '资讯名称',
        key: '资讯名称',
        render: (text, record) => (
          <div className={styles.tableName}>
            <div className={styles.headImg}></div>
            <div>{text}</div>
          </div>
        ),
      },
      {
        title: '资讯来源',
        dataIndex: '资讯来源',
        key: '资讯来源',
      },
      {
        title: '作者',
        dataIndex: '作者',
        key: '作者',
        width: '6%',
      },
      {
        title: '阅读',
        dataIndex: '阅读',
        key: '阅读',
      },
      {
        title: '回复',
        dataIndex: '回复',
        key: '回复',
      },
      {
        title: '点赞',
        dataIndex: '点赞',
        key: '点赞',
      },
      {
        title: '转发',
        dataIndex: '转发',
        key: '转发',
      },
      {
        title: '推荐',
        dataIndex: '推荐',
        key: '推荐',
      },
      {
        title: '发布日期',
        dataIndex: '发布日期',
        key: '发布日期',
      },
      {
        title: '状态',
        dataIndex: '状态',
        key: '状态',
      },
      {
        title: '操作',
        key: '操作',
        width: '15%',
        render: (text, record) => (
          <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
            <span onClick={() => this.handleAduitDialog(record, OPRATE_SEE_DETIALS)}>查看</span>
            <Divider type="vertical" />
            <span onClick={() => this.handleAduitDialog(record, OPRATE_SEE_DETIALS)}>修改</span>
            <Divider type="vertical" />
            {/* eslint-disable-next-line max-len */}
            <span onClick={() => this.handleAduitDialog(record, OPRATE_SEE_DETIALS)}>移除</span>
            <Divider type="vertical" />
            {Number(record.isAllowAsk) === 1 ? (
              // eslint-disable-next-line max-len
              <span onClick={() => this.handleAduitDialog(record, OPRATE_LIMIT_AUDIT)}>停用</span>
            ) : (
              // eslint-disable-next-line max-len
              <span onClick={() => this.handleAduitDialog(record, OPRATE_CANCAL_LiMIT)}>启用</span>
            )}
          </span>
        ),
      },
    ];

    const data = [];
    for (let i = 0; i < 46; i++) {
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
        推荐: '133',
        状态: '停用',
        发布日期: '2014-12-24 23:12:00',
      });
    }

    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
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
                                          placeholder="输入热点名称、关键字或快速查询"
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
            <TopTitle2 {...{ title: '热点推荐管理', rightUI }} />
          <div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
          </div>
        </div>
      </Card>
    );
  }
}

export default HostRecommend;
