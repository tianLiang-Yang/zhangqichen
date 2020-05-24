import React from 'react';
import {Card, Divider, Modal, Switch} from 'antd';
import styles from './index.less';
import { AppColor } from '@/utils/ColorCommom';
import CommonTable from './components/common-table'


import IconFont from '@/components/IconFont';
import EditClass from './components/EditClass';
import { connect } from "dva";
import { FLAG_ADD, FLAG_EDIT, FLAG_DELETE, FLAG_SEE, FLAG_NO_USER } from "@/utils/utils";
import { TopTitle2 } from "@/components/ui/TopTitle";

@connect(({ peopleModule , user }) =>
  ({
    peopleModule,
    currentUser: user.currentUser,
  }),
)

class SettingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      isVisiable: false,
      flag: 10004, // 默认为添加 1002 - 查看， 1003 - 修改
      id: 0,
      checked:false,
    };
  }

  componentDidMount() {
  }

  getTableList = (page, pageSize, flag, keyWord) =>{
    const { dispatch } = this.props;
    const { checked } = this.state;
    const param1 = { pageSize, pageNum: page}
    const param2 = { pageSize, pageNum: page,isRelease:1,}
    dispatch({
      type: 'peopleModule/getPeopleClassList',
      payload: checked ? param2 : param1,
    });
  };

  onChlidRef = (ref) => {
    this.child = ref;
  }

  /**
   * 操作
   * @param record
   * @param flag
   */
  handleAduitDialog = (record, flag) => {
    this.setState({ id: record.throngTypeId})
    console.log(record, flag);
    if(flag === FLAG_DELETE){  // 删除
      Modal.confirm({
        title: '删除分类',
        content: '确定删除该条分类吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.deleteItem(record),
      });
    }else if(flag === FLAG_NO_USER){ // 停用下架
      Modal.confirm({
        title: '下架分类',
        content: '确定下架该条分类吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.downSelft(record),
      });
    }else{
      this.setState({  isVisiable: true, flag})
    }
  };

// 下架
  downSelft = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'peopleModule/updateClass',
      payload: {
        data:{
          throngTypeId: record.throngTypeId,
          isRelease: 2
        },
        cb: () =>{
          this.child.updateList()
        }
      },
    });
  };

  // 删除
  deleteItem = record => {
    const { dispatch } = this.props;
    record.useflag = 0;
    dispatch({
      type: 'peopleModule/deleteClassById',
      payload: {
        data:{
          id: record.throngTypeId,
        },
        cb: () =>{
          this.child.updateList()
        }
      },
    });
  };

  // 更新列表
  updateList = () =>{
    this.child.updateList()
  }

  // 添加分类
  Add = () => {
    this.setState({  isVisiable: true, flag: FLAG_ADD, id: 0})
    this.child.updateList()
  };

  // 关闭弹出框
  handleCancel = () =>{
    this.setState({
      isVisiable: false,
    })
  }

  // 控制是否显示已发布课堂分类
  onSwitchChange = (checked) => {
    this.setState({checked},()=>{
      this.child.updateListFrom0()
    })
  }

  // 添加完成
  onResult = () =>{
    this.setState({  isVisiable: false })
    this.child.updateList()
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  render() {
    const { flag } = this.state;
    const { isLoadding, peopleClassListResult = {}}  = this.props.peopleModule;
    const columns = [
      { title: '人群分类名称', dataIndex: 'throngTypeName', key: 'throngTypeName' },
      { title: '权重', dataIndex: 'weight', key: 'weight' },
      { title: '创建时间', dataIndex: 'ctstamp', key: 'ctstamp'},
      { title: '更新时间', dataIndex: 'utstamp', key: 'utstamp' },
      { title: '状态',
        dataIndex: 'isRelease',
        key: 'isRelease',
        render: (text) => (
          // （0-未发布 1-已发布2-已下架）',
          // eslint-disable-next-line no-nested-ternary
          <span style={{ color: Number(text) === 0 ? AppColor.Gray : Number(text) === 1 ? AppColor.Green : AppColor.Red , cursor: 'pointer' }}>
            {/* eslint-disable-next-line no-nested-ternary */}
            { Number(text) === 0 ? '未发布':Number(text) === 1 ? '已发布' : '已停用'}
          </span>
        ),},
      {
        title: '操作',
        key: '操作',
        render: (text, record) => (
          <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
            <span onClick={() => this.handleAduitDialog(record, FLAG_SEE)}>查看</span>
            <Divider type="vertical" />
            <span onClick={() => this.handleAduitDialog(record, FLAG_EDIT)}>修改</span>
            <Divider type="vertical" />
            <span onClick={() => this.handleAduitDialog(record, FLAG_DELETE)}>删除</span>
             <Divider type="vertical" />
            <span onClick={() => this.handleAduitDialog(record, FLAG_NO_USER)}>下架</span>
          </span>
        ),
      },
    ];

    const rightUI =   <div className={styles.HLayout}>
                        <Switch style={{ marginRight:8 }} defaultChecked={false} onChange={ this.onSwitchChange } />
                        <span style={{color:AppColor.Green,marginRight:20}}>只显示已发布分类人群</span>
                        <div>
                          <IconFont type="iconiconjia" style={{ fontSize: 18 }} onClick={this.Add} />
                        </div>
                      </div>

    return (
      <Card>
        <div>
          <div className={styles.topLayout}>
            <TopTitle2 {...{ title: '人群分类设置' , rightUI}} />

          </div>
          <div>
            <CommonTable
              flag = { 1 }
              isLoadding = { isLoadding }
              result = { peopleClassListResult }
              Colums = {  columns }
              getTableList = {this.getTableList}
              onChlidRef={ this.onChlidRef }
            />
          </div>
          <Modal
             title="人群分类设置"
             destroyOnClose // 关闭时销毁 Modal 里的子元素
             maskClosable={false} // 点击遮照能不能关闭Modal
             footer={null} // 底部按钮
             width="50vw"
             style={{
               top: 20, bottom: 20,
             }}
             bodyStyle={{ overflow: "scroll", height: "60vh" }}
             visible={ this.state.isVisiable }
             onCancel={ this.handleCancel } >
            {
                <EditClass id = { this.state.id } flag = { flag } onResult = { this.onResult }/>
            }
          </Modal>
        </div>
      </Card>
    );
  }
}

export default SettingPage;
