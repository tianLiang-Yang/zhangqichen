import React from 'react';
import {Card, Divider, Modal, Switch} from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';
import { AppColor } from '@/utils/ColorCommom';
import CommonTable from './components/common-table'
import { CourseAttrs } from '@/utils/map/DictionaryUtil'


import IconFont from '@/components/IconFont';
import EditClass from './components/EditClass';
import EditDetialClass from './components/EditDetialClass'
import {connect} from "dva";
import {FLAG_ADD, FLAG_DELETE, FLAG_NO_USER, FLAG_RELEASE, handleEmptyStr, toTimestr} from "@/utils/utils";

@connect(({ eduClassModule , user }) =>
  ({
    eduClassModule,
    currentUser: user.currentUser,
  }),
)

class ClassificationSettingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const param1 = { size: pageSize, page}
    const param2 = { size: pageSize, page,isRelease:1,}
    dispatch({
      type: 'eduClassModule/getClassListPage',
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
    this.setState({ id: record.classTypeId})
    console.log(record, flag);
    if(flag === FLAG_DELETE){  // 删除
      Modal.confirm({
        title: '删除课程分类',
        content: '确定删除该条课程分类吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.deleteItem(record),
      });
    }else if( flag === FLAG_RELEASE || flag === FLAG_NO_USER) {
      Modal.confirm({
        title: `${flag === FLAG_RELEASE ? '发布' : '下架'}课程分类`,
        content: `确定立即${flag === FLAG_RELEASE ? '发布' : '下架'}该条课程分类吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.downAndRelease(record,flag),
      });
    }else{
      this.setState({ isVisiable: true, flag})
    }
  };

  // 删除
  deleteItem = record => {
    const { dispatch } = this.props;
    record.useflag = 0;
    console.log('删除',record)
    dispatch({
      type: 'eduClassModule/updateData',
      payload: {
        data:record,
        cb:this.updateList
      },
    });
  };

  downAndRelease = (record,mflag) => {
    const { dispatch } = this.props;
    dispatch({
      type: `eduClassModule/${ mflag ===FLAG_RELEASE ? 'updateManualRelease' : 'updateManualCancele'}`,
      payload: {
        id: record.classTypeId,
        cb:this.updateList
      },
    });

  }

  // 更新列表
  updateList = () =>{
    this.child.updateList()
  }

  // 添加分类
  Add = () => {
    this.setState({  isVisiable: true, flag: FLAG_ADD, id: 0})
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


// {CourseAttrs[item]
  render() {
    const { flag } = this.state;
    const { isLoadding, listResult = {} } = this.props.eduClassModule;
    const columns = [
      { title: '课程分类名称', dataIndex: 'classTypeName', key: 'classTypeName' },
      { title: '课程分类属性', dataIndex: 'typeProperty', key: 'typeProperty',
        render: (text) => (
          <span >
            {CourseAttrs[text]}
          </span>
        ),},
      { title: '所属人群', dataIndex: '所属人群', key: '所属人群' },
      { title: '次级', dataIndex: 'level', key: 'level' },
      { title: '权重', dataIndex: 'weight', key: 'weight' },
      { title: '创建时间', dataIndex: 'ctstamp', key: 'ctstamp', render: (text) => (
          <span >
            {toTimestr(handleEmptyStr(text))}
          </span>
        ), },
      { title: '更新时间', dataIndex: 'utstamp', key: 'utstamp' , render: (text) => (
          <span >
            {text ? toTimestr(text) : ""}
          </span>
        ),},
      { title: '状态',
        dataIndex: 'isRelease',
        key: 'isRelease',
        render: (text) => (
          // （0-未发布 1-已发布2-已下架）',
          // eslint-disable-next-line no-nested-ternary
          <span style={{ color: Number(text) === 0 ? AppColor.Gray : Number(text) === 1 ? AppColor.Green : AppColor.Red , cursor: 'pointer' }}>
            {/* eslint-disable-next-line no-nested-ternary */}
            { Number(text) === 0 ? '未发布':Number(text) === 1 ? '已发布' : '已下架'}
          </span>
        ),},
      {
        title: '操作',
        key: '操作',
        width:'16%',
        render: (text, record) => (
          <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
            <span onClick={() => this.handleAduitDialog(record, 1002)}>查看</span>
            <Divider type="vertical" />
            <span onClick={() => this.handleAduitDialog(record, 1003)}>修改</span>
            <Divider type="vertical" />
            {/* eslint-disable-next-line max-len */}
            <span onClick={() => this.handleAduitDialog(record, FLAG_DELETE)}>删除</span>
             <Divider type="vertical" />
            {/* eslint-disable-next-line max-len */}
            <span onClick={() => this.handleAduitDialog(record,
              Number(record.isRelease) === 1 ? FLAG_NO_USER : FLAG_RELEASE  )}>
              { Number(record.isRelease) === 1? '下架' : '发布'}
            </span>
          </span>
        ),
      },
    ];
    const rightUI =  <div className={styles.HLayout}>
                        <Switch style={{ marginRight:8 }} defaultChecked={false} onChange={ this.onSwitchChange } />
                        <span style={{color:AppColor.Green,marginRight:20}}>只显示已发布课堂分类</span>
                        <div>
                          <IconFont type="iconiconjia" style={{ fontSize: 18 }} onClick={this.Add} />
                        </div>
                      </div>;


    return (
      <Card>
        <div>
          <div className={styles.topLayout}>
            <TopTitle2 {...{ title: '课程分类设置' , rightUI}} />

          </div>
          <div>
            <CommonTable
              flag = { 1 }
              isLoadding = { isLoadding }
              result = { listResult }
              Colums = {  columns }
              getTableList = {this.getTableList}
              onChlidRef = { this.onChlidRef }
            />
          </div>
          <Modal
            title="课堂分类设置"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
             maskClosable={false} // 点击遮照能不能关闭Modal
             footer={null} // 底部按钮
             width="50vw"
             style={{
               top: 20, bottom: 20,
             }}
             bodyStyle={{ overflow: "scroll", height: "90vh" }}
             visible={ this.state.isVisiable }
             onCancel={ this.handleCancel } >
            {
              flag === 1002
                ?
                <EditDetialClass id = { this.state.id } flag = {flag}/>
                :
                <EditClass id = { this.state.id } flag = {flag} onResult = {this.onResult} />
            }

          </Modal>
        </div>
      </Card>
    );
  }
}

export default ClassificationSettingPage;
