import {Card, Tabs, Input, Modal, Select, message} from 'antd';
import React from 'react'
import styles from './index.less';
import MobileManage from './mobile-manage';
import SysUserManage from './sys-user-manage';
import AddSysUser from './sys-user-manage/components/creat-user-from'
import AddDoctorInfo from './components/add-doctor-info'
import IconFont from '@/components/IconFont';
import { AppColor } from '@/utils/ColorCommom';
import { connect } from 'dva';
import { isEmpty } from '@/utils/utils';
import MobilieUserInfo from "@/pages/UserManager/components/user-detial";

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

@connect(({ userManage }) =>
  ({
    userManage,
  }),
)
/**
 * 用户管理
 */
class UserManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visiable: false,
      addDoctorVisiable: false,
      isShowSysUi: true,
      keyword: '',
      orgId: '0',
      id: null, // 用户id 系统用户修改用户信息的时候需要用到
      tabKey: '1',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'userManage/fetchOrgList',
      payload: {
        keyword: '',
      },
    });
  }

  // 将子view的作用域赋给父view
  onRefChild = (ref) => {
    this.sysChild = ref
  }

  // 将子view的作用域赋给父view
  onMobileRefChild = (ref) => {
    this.mobileChild = ref
  }

  // 添加用户后回调
  toUpdateSysUserTable = () => {
    this.setState({ visiable: false })
    this.toUpdateSysChild();
  }

  // 搜索框
  handleInputSearch = (value) => {
    console.log(value)
    this.setState({ keyword: value },
      () => {
      const { isShowSysUi } = this.state;
      if (isShowSysUi) { this.toUpdateSysChild(); }
      })
  }

  // 输入框输入监听
  chanageInput = e => {
    const { value } = e.target;
    if (isEmpty(value)) {
      this.setState({ keyword: '' },
        () => {
          const { isShowSysUi } = this.state;
          if (isShowSysUi) { this.toUpdateSysChild(); }
        })
    }
  }


  // 机构选择
  onOrgSelect = (value) => {
    this.setState({ orgId: value },
      () => {
        this.toUpdateSysChild();
      })
    // console.log(`selected ${value}`);
  }

  // 更新系统用户管理
  toUpdateSysChild = () => {
    const { orgId, keyword } = this.state;
    if(this.sysChild)
       this.sysChild.parenttoUpdateChildByParam(orgId, keyword);
    if(this.mobileChild){
      this.mobileChild.parenttoUpdateChildByParam(orgId, keyword);
    }
  }

  // 点击
  handleOpenModel = (id) => {
    const { tabKey } = this.state
    if(tabKey === "1"){
      this.setState({ addDoctorVisiable: true })
    }else{
      this.setState({ visiable: true, id })
    }

  }

  // tab点击事件
  onTabCallback = (key) => {
    this.setState({ tabKey: key })
    // this.setState({ isShowSysUi: key === '2' })
  }

  handleAddDoctor = () =>{
    this.setState({addDoctorVisiable:false})
    const { page, size} = this.state
    this.getTableList(page, size)

  }

  handleCancleAddDialog = () => {
    this.setState({addDoctorVisiable:false})
  }

  render() {
    // tab 页面
    const { visiable, isShowSysUi, id, addDoctorVisiable } = this.state;
    const { orgRes: { data = [] } } = this.props.userManage;
    return (
      <Card>
        <div className={ styles.main }>
          <div className={ styles.InputContent }>
            <div >
              <span className={ styles.IconContent } style={{ visibility: isShowSysUi ? 'visible' : 'hidden' }}>
                <IconFont
                  type = "iconxian-buguize-chuangjianyonghu"
                  style = {{ color: AppColor.Green, fontSize: '25px'}}
                  onClick = { () => this.handleOpenModel(null) }
                />
              </span>
              <span style={{ marginLeft: 40, visibility: isShowSysUi ? 'visible' : 'hidden' }} >
                 <Select
                   onChange = { this.onOrgSelect }
                   style={{ width: 220, borderTop: 0 }}
                   placeholder="请选择机构名称" >
                   {
                     // eslint-disable-next-line max-len
                     data.map((item) => <Option key = { item.orgId } value = { item.orgId } >{ item.orgName }</Option>)
                   }
                 </Select>
              </span>
              <span style={{ paddingLeft: '30px' }}>
                <Search
                  showSearch
                  // value={searchValue}
                  size = "normal"
                  shape="round"
                  placeholder="请输入注册号或者真实姓名快速搜索"
                  style = {{ width: 324 }}
                  onChange = { this.chanageInput }
                  onSearch = { value => this.handleInputSearch(value) }
                />
              </span>
            </div>
          </div>
            <Tabs
              onChange={this.onTabCallback}
              className={ styles.MyTabs }
              animated = {false}
              defaultActiveKey = "1">
              <TabPane tab = "移动端用户" key = "1">
                <MobileManage onMobileRefChild = { this.onMobileRefChild} />
              </TabPane>
              <TabPane tab = "管理系统用户" key = "2">
                <SysUserManage
                  onRefChild = { this.onRefChild }
                  handleOpenModel = { this.handleOpenModel }
                 />
              </TabPane>
            </Tabs>
          <Modal
            title = { id !== null ? '编辑用户信息' : '' +
              '' }
            visible={ visiable }
            onCancel={() => {
              this.setState({ visiable: false });
            }}
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="55vw"
            style={{
              top: 20,
              bottom: 20,
            }}
            bodyStyle = {{ overflow: 'scroll', height: '81vh' }}
            wrapClassName = "mobile-user-modal-wrap"
          >
            <AddSysUser id = { id } toUpdateSysUserTable = { this.toUpdateSysUserTable }/>
          </Modal>

          <Modal
            title = { id !== null ? '编辑用户信息' : '' +
              '' }
            visible={ addDoctorVisiable }
            onCancel={() => {
              this.setState({ addDoctorVisiable: false });
            }}
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="55vw"
            style={{
              top: 20,
              bottom: 20,
            }}
            bodyStyle = {{ overflow: 'scroll', height: '86vh' }}
            wrapClassName = "mobile-user-modal-wrap"
          >
            <AddDoctorInfo
              handleAddDoctor={ this.handleAddDoctor }
              handleCancleAddDialog = { this.handleCancleAddDialog }
            />
          </Modal>
        </div>
      </Card>
    );
  }
}

export default UserManage;
