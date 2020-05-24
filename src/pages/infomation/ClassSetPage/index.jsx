import React from 'react';
import {Card, Table, Divider, Modal} from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';
import { AppColor } from '@/utils/ColorCommom';
import {
  OPRATE_LIMIT_AUDIT,
  OPRATE_SEE_DETIALS,
} from '@/pages/DoctorQualificationReview/help/Colums';
import IconFont from '@/components/IconFont';
import EditClass from "@/pages/infomation/ClassSetPage/components/EditClass";

class ClassSetPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      isVisiable: false,
    };
  }

  NestedTable = () => {};

  /**
   * 操作
   * @param record
   * @param flag
   */
  handleAduitDialog = (record, flag) => {
    console.log(record, flag);
  };

  // 添加分类
  Add = () => {
    this.setState({  isVisiable: true })
  };

  // 关闭弹出框
  handleCancel = () =>{
    this.setState({
      isVisiable: false,
    })
  }

  render() {
    const expandedRowRender = () => {
      const columns = [
        { title: '资讯分类名称', dataIndex: '资讯分类名称', key: '资讯分类名称' },
        { title: '资讯分类属性', dataIndex: '资讯分类属性', key: '资讯分类属性' },
        { title: '次级', dataIndex: '次级', key: '次级' },
        { title: '权重', dataIndex: '权重', key: '权重' },
        { title: '创建时间', dataIndex: '创建时间', key: '创建时间' },
        { title: '更新时间', dataIndex: '更新时间', key: '更新时间' },
        { title: '状态', dataIndex: '状态', key: '状态' },
        {
          title: '操作',
          key: '操作',
          render: (text, record) => (
            <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
              <span onClick={() => this.handleAduitDialog(record, OPRATE_SEE_DETIALS)}>查看</span>
              <Divider type="vertical" />
              <span onClick={() => this.handleAduitDialog(record, OPRATE_SEE_DETIALS)}>修改</span>
              <Divider type="vertical" />
              {/* eslint-disable-next-line max-len */}
              <span onClick={() => this.handleAduitDialog(record, OPRATE_SEE_DETIALS)}>删除</span>
              <Divider type="vertical" />
              {Number(record.isAllowAsk) === 1 ? (
                // eslint-disable-next-line max-len
                <span onClick={() => this.handleAduitDialog(record, OPRATE_LIMIT_AUDIT)}>停用</span>
              ) : (
                // eslint-disable-next-line max-len
                <span onClick={() => this.handleAduitDialog(record, OPRATE_CANCAL_LiMIT)}>
                  启用
                </span>
              )}
            </span>
          ),
        },
      ];

      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          资讯分类名称: '养生保健',
          资讯分类属性: '公共资讯',
          次级: '1',
          权重: '1',
          创建时间: '2014-12-24 23:12:00',
          更新时间: '2014-12-24 23:12:00',
          状态: '停用',
          title: 'Jack',
        });
      }
      return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    const columns = [
      { title: '资讯分类名称', dataIndex: '资讯分类名称', key: '资讯分类名称' },
      { title: '资讯分类属性', dataIndex: '资讯分类属性', key: '资讯分类属性' },
      { title: '次级', dataIndex: '次级', key: '次级' },
      { title: '权重', dataIndex: '权重', key: '权重' },
      { title: '创建时间', dataIndex: '创建时间', key: '创建时间' },
      { title: '更新时间', dataIndex: '更新时间', key: '更新时间' },
      { title: '状态', dataIndex: '状态', key: '状态' },
      {
        title: '操作',
        key: '操作',
        render: (text, record) => (
          <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
            <span onClick={() => this.handleAduitDialog(record, OPRATE_SEE_DETIALS)}>查看</span>
            <Divider type="vertical" />
            <span onClick={() => this.handleAduitDialog(record, OPRATE_SEE_DETIALS)}>修改</span>
            <Divider type="vertical" />
            {/* eslint-disable-next-line max-len */}
            <span onClick={() => this.handleAduitDialog(record, OPRATE_SEE_DETIALS)}>删除</span>
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
    for (let i = 0; i < 3; ++i) {
      data.push({
        资讯分类名称: '养生保健',
        资讯分类属性: '公共资讯',
        次级: '1',
        权重: '1',
        创建时间: '2014-12-24 23:12:00',
        更新时间: '2014-12-24 23:12:00',
        状态: '停用',
        title: 'Jack',
      });
    }

    const rightUI = <div>
                      <IconFont type="iconiconjia" style={{ fontSize: 18 }} onClick={this.Add} />
                    </div>

    return (
      <Card>
        <div>
          <TopTitle2 {...{ title: '资讯分类设置', rightUI }} />
          <div>
            <Table
              className="components-table-demo-nested"
              columns={columns}
              expandedRowRender={expandedRowRender}
              dataSource={data}
            />
          </div>
          <Modal
            title="资讯分类设置"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
             maskClosable={false} // 点击遮照能不能关闭Modal
             footer={null} // 底部按钮
             width="50vw"
             style={{
               top: 20, bottom: 20,
             }}
             bodyStyle={{overflow: "scroll", height: "90vh"}}
             visible={this.state.isVisiable}
             onCancel={this.handleCancel} >
            <EditClass/>
          </Modal>
        </div>
      </Card>
    );
  }
}

export default ClassSetPage;
