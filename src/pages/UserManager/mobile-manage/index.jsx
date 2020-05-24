import React from 'react'
import styles from './index.less';
import { connect } from 'dva';
import CommonTable from '@/components/common-table';
import {Divider, Form, Input, message, Modal} from 'antd';
import { AppColor } from '@/utils/ColorCommom';
import iconId from '@/img/manage_id.png';
import iconDoctor from '@/img/manage_doctor_id.png'
import IconFont from '@/components/IconFont';
import { getlimitStr } from '@/utils/utils';
// 用户信息
import MobilieUserInfo from '../components/user-detial';

const { confirm } = Modal;

@connect(({ userManage }) =>
  ({
    userManage,
  }),
)

/**
 * 移动端用户管理
 */
class MobileManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAccountVisible: false, // 封号或开启弹出框判断
      isClickOpenOrClose: false, // true - 点击启号  false - 点击封号
      current: undefined,
      page: 0,
      size: 8,
    // 查看用户详情的逻辑
      isDetialVisebile: false,
      orgId: '',
      keyword : '',
    };
  }

  componentDidMount() {
    this.props.onMobileRefChild(this)
  }

  // 获取移动端用户列表
  getTableList = (page, size) => {
    this.setState({ page, size });
    const { dispatch } = this.props;
    const { orgId, keyword } = this.state
    dispatch({
      type: 'userManage/fetchMoblieList',
      payload: {
        page,
        size,
        orgId,
        keyword,
      },
    });
  }

  // 查看
  openDetial = (record) => {
    this.setState({
      isDetialVisebile: true,
      current: record,
    })
  }

  // 删除
  delete = (record) => {
    const self = this;
    confirm({
      title: '删除账号',
      content: `确定要删除${record.userNick}?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const {dispatch} = self.props
        dispatch({
          type: 'userManage/deleteMobileUser',
          payload:{
            userId: record.userId,
            cb:()=>{
              self.updateTableRow();
            }
            }
        });
      },
    });
  }

  // 修改 当前页面Table的某一行 例如点击封号后
  updateTableRow = () => {
    const { page, size } = this.state;
    this.getTableList(page, size);
  }

  // 封号或启封
  openOrClose = (record) => {

    confirm({
      title: Number(record.useflag) !== 1 ? '启号' : '封号',
      content: `确定要${  Number(record.useflag) !== 1 ? '启号' : '封号'}改用户?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: ( ) =>{
        const {dispatch} = this.props
        dispatch({
          type: `userManage/${ Number(record.useflag) !== 1 ? 'openMobileAccount' : 'stopMobileAccount' }`,
          payload:{
            userId: record.userId,
            cb:()=>{
              this.updateTableRow();
            }
          }
        });
      },
    });
  }

  // 父组件更新子组件
  parenttoUpdateChildByParam = (orgId, keyword) => {
    this.setState({
      orgId,
      keyword,
      page: 1,
    }, () => {
      const  { page, size } = this.state
      this.getTableList(page,size)
    })
  }

  // 表头=>展示认证逻辑
  showAuthenticationUI = (record) => {
    let ui = '未认证';
    if (record.isIdVerify !== 0 && record.isDoctorVerify !== 0) {
      ui = <div>
        <img src={iconId} alt="身份证"/>
        <span>&nbsp;<img src={iconDoctor} alt="医师认证"/></span>
      </div>
    } else {
        if (record.isIdVerify !== 0) {
          ui = <img src={iconId} alt="身份证"/>
        }
        if (record.isDoctorVerify !== 0) {
          ui = <img src={ iconDoctor } alt="医师认证"/>
        }
    }
    return ui
  }




  render() {
    // tab 页面
    const { isAccountVisible, isClickOpenOrClose, isDetialVisebile, current = {} } = this.state;
    const { mobileRes = {} } = this.props.userManage;
    const modalFooter =
       {
        okText: '保存',
        onOk: this.handleSubmit,
        onCancel: this.handleCancel,
      };
    const columns = [
      {
        title: '注册号',
        dataIndex: 'userNo',
        key: '注册号',
      },
      {
        title: '昵称',
        dataIndex: 'userNick',
        key: '昵称',
        width: '8%',
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
            { getlimitStr(5, text) }
          </span>
        ),
      },
      {
        title: '所属机构',
        dataIndex: 'orgIdDic',
        key: '所属机构',
        render: (text) => (
          <span title={ text }>
            { getlimitStr(8, text) }
          </span>
        ),
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
        width: '10%',
      },
      {
        title: '注册时间',
        dataIndex: 'ctstamp',
        key: '注册时间',
        width: '12%',
      },
      {
        title: '认证',
         dataIndex: '认证',
        key: '认证',
        width: '6%',
        render: (text, record) => (
          <span className = {styles.AuthenticationUI}> { this.showAuthenticationUI(record)}</span>
        ),
      },
      {
        title: '状态',
        dataIndex: 'useflag',
        key: '状态',
        width: '5%',
        render: (text, record) => (
          <div>
            {  Number(record.useflag) === 0 ? <span style={{ color: AppColor.Red }}>封号</span> : '正常' }
          </div>
        ),
      },
      {
        title: '操作历史',
        dataIndex: 'isStatusHis',
        key: '操作历史',
        width: '7%',
        render: (text) => (
          <span>
          { Number(text) !== 0 ? <IconFont style={{ color: AppColor.Green, fontSize: '15px' }} type="iconhtmal5icon34"/> : <span>——</span>}
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: '操作',
        key: '操作',
        width: '13%',
        render: (text, record) => (
          <span className={styles.oprationItem} style={{ cursor: 'pointer' }}>
            <a onClick = { () => this.openDetial(record) }>查看</a>
            <Divider type="vertical" />
            <a onClick={ () => this.delete(record) }>删除</a>
             <Divider type="vertical" />
            <a onClick={ () => this.openOrClose(record) }>
              { Number(record.useflag) !== 1 ? '启号' : '封号' }
            </a>
          </span>
        ),
      },
    ]
    return (
        <div className={ styles.main }>
          <CommonTable
            bottomRightUI = {
              <span>
              <span style={{ color: AppColor.Gray2 }}>
               移动端用户总数：
              </span>
                 { mobileRes.data.total }个
            </span>
            }
            columns = { columns }
            result={ mobileRes }
            getTableList = { this.getTableList }
            />
          <Modal
            title="用户信息"
            visible={ isDetialVisebile }
            onCancel={() => {
              this.setState({ isDetialVisebile: false });
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
          <MobilieUserInfo
            id={ current.userId }
          />
          </Modal>
        </div>
    );
  }
}

export default Form.create()(MobileManage);
