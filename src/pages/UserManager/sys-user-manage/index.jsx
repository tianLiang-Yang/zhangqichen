import React from 'react';
import CommonTable from '../../../components/common-table';
import { connect } from 'dva';
import { getlimitStr } from '@/utils/utils';
import moment from 'moment';
import styles from './index.less';
import { AppColor } from '@/utils/ColorCommom';
import IconFont from '@/components/IconFont';
import { Divider, Dropdown, Icon, Menu, Modal } from 'antd';
import { pageSize } from '@/utils/Constant'
import ReasonFromModal from '../../../components/ui/reason-from-modal'
import UserDetial from '../components/user-detial' // 查看详情
import HistoryList from '../components/common-history-list'


@connect(({ userManage, user }) =>
  ({
    userManage,
    currentUser: user.currentUser,
  }),
  )

class SysUserManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: pageSize,
      reasonVisiable: false,
      userDetialVisible: false,
      historyVisiable: false,
      current: undefined,
      orgId: '',
      keyword: '',
    };
  }

  componentDidMount() {
    this.props.onRefChild(this)
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchRoleList',
      payload: {
      },
    });
  }


  // 获取系统用户列表
  getTableList = (page, size, orgId, keyword) => {
    this.setState({ page, size });
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchSysUserList',
      payload: {
        page,
        size,
        orgId,
        keyword,
      },
    });
  }

  // 修改 当前页面Table 例如点击封号后
  updateTablePage= () => {
    const { page, size, orgId, keyword } = this.state;
    this.getTableList(page, size, orgId, keyword);
  }

  // 父组件更新子组件
  parenttoUpdateChildByParam = (orgId, keyword) => {
    this.setState({
      orgId,
      keyword,
      page: 1,
    }, () => {
      this.updateTablePage();
    })
  }

  handleReasonCancel = () => {
    this.setState({
      reasonVisiable: false,
    });
  };

  handleReasonConfirm = (fieldsValue) => {
    console.log(fieldsValue)
    const { dispatch, currentUser } = this.props;
    const { current } = this.state;
    dispatch({
      type: 'userManage/buOrguserStatus',
      payload: {
        beforeStatus: 1,
        afterStatus: 0,
        statusDesc: fieldsValue.statusDesc,
        orgUserId: current.orgUserId,
        cb: this.callBackListener,
        worker: currentUser.orgUserName,
      },
    });
    this.setState({
      reasonVisiable: false,
    });
  }

  // 起号或者封号
  openOrClose = (currentItem) => {
    if (currentItem.status === 0) {
      const { dispatch, currentUser } = this.props;
      const { current } = this.state;
      dispatch({
        type: 'userManage/buOrguserStatus',
        payload: {
          beforeStatus: 0,
          afterStatus: 1,
          orgUserId: current.orgUserId,
          worker: currentUser.orgUserName,
          cb: this.callBackListener,
        },
      });
      return;
    }
    console.log(currentItem)
    this.setState({ reasonVisiable: true })
  }

  // 查看用户详情
  openDetial = (record) => {
    this.setState({
      userDetialVisible: true,
      current: record,
    })
  }

  // 处理下拉框
  handleDropdown = (key, currentItem) => {
    this.setState({ current: currentItem },
      () => {
        if (key === 'edit') {
         this.props.handleOpenModel(currentItem.orgUserId)
        } else if (key === 'delete') {
          Modal.confirm({
            title: '删除用户',
            content: `确定删除该${currentItem.orgUserName}吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              const { dispatch } = this.props;
              dispatch({
                type: 'userManage/deleteSysUser',
                payload: {
                  orgUserId: currentItem.orgUserId,
                  cb: this.callBackListener,
                },
              });
            },
          });
        } else if (key === 'openOrClose') {
          this.openOrClose(currentItem);
        }
    })
  };

  // 重置密码
  againPw = (record) => {
    if (record.isMobileVerify === 0) { // "手机验证标志（0-未验证 1-已验证）isMobileVerify
      Modal.confirm({
        title: '重置密码',
        content: '确定重置该用户的密码吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          console.log(record.orgUserId)
          const { dispatch } = this.props;
          dispatch({
            type: 'userManage/resetPw',
            payload: {
              orgUserId: record.orgUserId,
              cb: this.callBackListener,
            },
          });
        },
      });
    }
  }

  callBackListener = () => {
  //  type = 1删除, type =2 重置密码
    this.updateTablePage();
  }

  // 表格更多按钮的封装
   MoreBtn = (record) => {
    console.log('表格更多按钮的封装', record)
     return (
       <Dropdown
         overlay={
           <Menu onClick={({ key }) => this.handleDropdown(key, record)}>
             <Menu.Item key="edit">编辑</Menu.Item>
             <Menu.Item key="delete">删除</Menu.Item>
             <Menu.Item key="openOrClose">{ record.status === 1 ? '封号' : '启号' }</Menu.Item>
           </Menu>
         }
       >
         <a>
           更多 <Icon type="down" />
         </a>
       </Dropdown>
     );
   }

   getRoleList = () => {
     const { roleRes: { data = [] } } = this.props.userManage;
     const arr = [];
     // eslint-disable-next-line array-callback-return
     data.forEach((item) => {
       arr.push({
         text: item.orgRolename, value: item.orgRolename,
       })
     })
     return arr;
   }

  render() {
    const { reasonVisiable, userDetialVisible, historyVisiable, current = {} } = this.state;
    const { systemUserRes, isLoadding } = this.props.userManage;
    const columns = [
      {
        title: '注册号',
        dataIndex: 'orgUserNo',
        key: '注册号',
      },
      {
        title: '昵称',
        dataIndex: 'nick',
        key: '昵称',
        width: '8%',
        render: (text) => (
          <span title={ text }>
            { getlimitStr(9, text) }
          </span>
        ),
      },
      {
        title: '用户名',
        dataIndex: 'orgUserName',
        key: '用户名',
        width: '5%',
        render: (text) => (
          <span title={ text }>
            { getlimitStr(9, text) }
          </span>
        ),
      },
      {
        title: '性别',
        dataIndex: 'sexDic',
        key: '性别',
        width: '4%',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: '年龄',
        width: '4%',
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        key: '真实姓名',
        render: (text) => (
          <span title={ text }>
            { getlimitStr(4, text) }
          </span>
        ),
      },
      {
        title: '所属机构',
        dataIndex: 'orgIdDic',
        key: '所属机构',
      },
      {
        title: '所属部门',
        dataIndex: 'deptIdDic',
        key: '所属部门',
        render: (text) => (
          <span title={ text }>
            { getlimitStr(8, text) }
          </span>
        ),
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: '手机号',
        width: '9%',
      },
      {
        title: '注册时间',
        dataIndex: 'ctstamp',
        key: '注册时间',
        width: '8%',
        render: (text) => (
          <div>
            { moment(text).format('YYYY-MM-DD HH:mm') }
          </div>
        ),
      },
      {
        title: '角色',
        dataIndex: 'roledesc',
        key: '角色',
        width: '8%',
        filters: this.getRoleList(),
        // eslint-disable-next-line consistent-return
        onFilter: (value, record) => {
          console.log('onFilter', value)
          const { roledesc } = record;
          if (roledesc.includes(value)) {
            return record;
          }
        },
        render: (text) => (
          <span title={ text }>
            { getlimitStr(9, text) }
          </span>
        ),
      },
      {
        title: '状态',
        dataIndex: '状态',
        key: '状态',
        width: '6%',
        filters: [{ text: '正常', value: 1 }, { text: '封号', value: 0 }],
        // eslint-disable-next-line consistent-return
        onFilter: (value, record) => {
          console.log('onFilter', value)
          const { status } = record;
          if (status === value) {
            return record;
          }
        },
        render: (text, record) => ( // 1-正常 0-封号
          <div>
            { record.status === 1 ? '正常' : <span style={{ color: AppColor.Red }}>封号</span> }
          </div>
        ),
      },
      {
        title: '操作历史',
        dataIndex: 'isStatusHis',
        key: '操作历史',
        width: '7%',
        render: (text, record) => ( // 是否存在状态变更历史（0-否1-是）
          <span>
          { text === 1 ?
            <IconFont
            onClick={() => { this.setState({ historyVisiable: true, current: record }) }}
            style={{ color: AppColor.Green, fontSize: '15px' }}
            type="iconhtmal5icon34"/>
            :
            <span>——</span>}
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: '操作',
        key: '操作',
        width: '16%',
        render: (text, record) => {
          const color = record.isMobileVerify === 1 ? AppColor.Gray : AppColor.Green;
          return ( // /* isMobileVerify 手机验证标志（0-未验证 1-已验证）*/
            <span className={styles.oprationItem} style={{ cursor: 'pointer' }}>
            <a onClick = { () => this.openDetial(record) }>查看</a>
            <Divider type="vertical" />
            <a
              onClick = { () => this.againPw(record)}
              style = {{ color }} >
              重置密码
            </a>
            <Divider type="vertical" />
              { this.MoreBtn(record) }
          </span>
          )
        },
      },
    ]
    return (
      <div>
        <CommonTable
          bottomRightUI = {
            <span>
              <span style={{ color: AppColor.Gray2 }}>
                管理系统用户总数：
              </span>
              { systemUserRes.data.total }个
            </span>
          }
          isLoadding = { isLoadding }
          columns = { columns }
          result={ systemUserRes }
          getTableList = { this.getTableList }
        />
        <ReasonFromModal
          title = { current.status === 1 ? '封号' : '启号' }
          label = { current.status === 1 ? '封号原因' : '启号原因'}
          // status = {current.status === 1}
          visiable = { reasonVisiable }
          handleReasonCancel = {this.handleReasonCancel}
          handleReasonConfirm = {this.handleReasonConfirm}
        />
        <Modal
          title="操作历史记录"
          visible={ historyVisiable }
          onCancel={() => {
            this.setState({ historyVisiable: false });
          }}
          destroyOnClose // 关闭时销毁 Modal 里的子元素
          maskClosable={false} // 点击遮照能不能关闭Modal
          footer={null} // 底部按钮
          width="55vw"
          style={{
            top: 20,
            bottom: 20,
          }}
          bodyStyle={{ overflow: 'scroll', height: '81vh' }}
          wrapClassName="mobile-history-modal-wrap"
        >

          <HistoryList id = { current.orgUserId }/>
        </Modal>

        <Modal
          title="用户信息"
          visible={ userDetialVisible }
          onCancel={() => {
            this.setState({ userDetialVisible: false });
          }}
          destroyOnClose // 关闭时销毁 Modal 里的子元素
          maskClosable={false} // 点击遮照能不能关闭Modal
          footer={null} // 底部按钮
          width="55vw"
          style={{
            top: 20,
            bottom: 20,
          }}
          bodyStyle={{ overflow: 'scroll', height: '81vh' }}
          wrapClassName="mobile-user-modal-wrap"
        >
          <UserDetial flag = "sys" id = { current.orgUserId }/>
        </Modal>
      </div>
    );
  }
}

export default SysUserManage;
