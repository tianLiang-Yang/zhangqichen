import { Tabs, Card, Modal, Input } from 'antd';
import React from 'react'
import DoctorAuditContent from './components/doctor-audit-content';
import CommonTable from './components/common-table'
import * as Colums from '@/pages/DoctorQualificationReview/help/Colums';
import styles from './index.less';
import { connect } from 'dva';
import { handleEmptyStr, isEmpty } from '@/utils/utils';
import ReasonFromModal from '@/components/ui/reason-from-modal';

const { confirm } = Modal;
const { TabPane } = Tabs;
const { Search } = Input;
const TabsList = [
  { name: '待审批', key: '1' },
  { name: '已通过', key: '2' },
  { name: '已驳回', key: '3' },
  { name: '已取消', key: '4' },
  ];

@connect(({ doctorQualificationReview , user }) =>
   ({
    doctorQualificationReview,
     currentUser: user.currentUser,
  }),
)

/**
 * 医生资质审核
 */
class DoctorQualificationReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 1,
      current: undefined, // 点击当前一条数据值
      isModalVisable: false, // 是否弹出资质审核框
      isShowImg: false, // 是否展示图片
      currentImgUrl: '', // 点击当前的图片地址
      dialogControl: '1', // 1 - 查看（公用） ，2 - 审核（通过），3 - 取消认证 ，4 - 业务处理
      reasonVisiable: false, // 限制申请 和 循序申请
    };
  }

  componentDidMount() {

  }

  // 底部统计数据
  getStatisticsReq() {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorQualificationReview/fetchStatics',
      payload: {},
    });
  }

  // 输入框搜索
  handleInputSearch = value => {
    this.child.onChanageKeyWord(value);
  };

  // 输入框输入监听
  chanageInput = e => {
    const { value } = e.target;
    if (isEmpty(value)) {
      this.child.onChanageKeyWord('');
    }
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  /**
   * Tab 页选择事件
   * @param key
   */
  tabCallback = key => {
    console.log(key);
    this.setState({
      tabKey: key,
    },()=>{
      this.child.updateList();
    })

  };

  /**
   * zoomImag 放大图片
   * @param url
   */
  zoomImage = url => {
    // console.log("zoomImage",url)
    this.setState({ currentImgUrl: url, isShowImg: true });
  };

  /**
   * handleAduitDialog 资质审核操作处理
   * @param url
   */
  handleAduitDialog = (record, dialogControl) => {
    this.setState({ current: record },
      () => {
        // eslint-disable-next-line max-len
        if (dialogControl === Colums.OPRATE_LIMIT_AUDIT || dialogControl === Colums.OPRATE_CANCAL_LiMIT) {
          this.setState({ reasonVisiable: true });
        } else {
          this.setState({ dialogControl, isModalVisable: true });
        }
      })
  };

  /**
   * getColums 获取表头
   *  flag // 1-待审核 2-已通过  4-已驳回 3-已取消
   * @returns { colums }
   */
  getColums = (flag) => {
    let colums = null;
    switch (Number(flag)) {
      case 1:
        colums = Colums.WattingColumns(this.handleAduitDialog);
        break;
      case 2:
        colums = Colums.PassColumns(this.handleAduitDialog);
        break
      case 3:
        colums = Colums.RejectColumns(this.handleAduitDialog);
        break;
      case 4:
        colums = Colums.CancelledColumns(this.handleAduitDialog)
        break
      default:
        break
    }
    return colums;
  }

  /**
   * 获取列表数据http请求
   */
  getTableList = (page, pageSize, flag, keyWord) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'doctorQualificationReview/fetch',
      payload: {
        size: pageSize,
        page,
        status: this.state.tabKey, // 身份状态（1-待审批2-认证通过3-申请驳回4-认证被取消
        keyword: keyWord,
      },
    });
    this.getStatisticsReq();
  }

  /**
   * 列表数据返回结果
   *  flag // 1-待审核 2-已通过  4-已驳回 3-已取消
   */
  getResultData = (flag) => {
    let result = {};
    const {
      wattingResult,
      passResult,
      rejectedResult,
      cancleResult,
       } = this.props.doctorQualificationReview;
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
      case 4:
        result = cancleResult;
        break
      default:
        result = [];
        break
    }
    return result;
  }

  rightBottomUI = (userDrverifyCount) => {
    const { data } = userDrverifyCount;
    return <div style={{ display: data === {} ? 'none' : 'block' }}>
              医师总数：<span> { handleEmptyStr(data.doctorCount) } 人 </span> ，
              其中待审核<span> { handleEmptyStr(data.waitDrverify) } 人 </span>，
              已审核<span> { handleEmptyStr(data.havaDrverify) } 人 </span>，
              已驳回<span> { handleEmptyStr(data.regectDrverify) }人 </span>，
              违规封号<span> { handleEmptyStr(data.illegalCount) } 人 </span>
          </div>
  }

  // 关闭dialog
  closeDialog = (type) => {
    if (type === 1) {
      this.child.updateList();
    }
    this.setState({ isModalVisable: false });
  }

  handleReasonCancel = () => {
    this.setState({
      reasonVisiable: false,
    });
  };

  handleReasonConfirm = (fieldsValue) => {
    const { statusDesc } = fieldsValue;
    const { dispatch,currentUser } = this.props;
    const { current = {} } = this.state;
    dispatch({
      type: 'doctorQualificationReview/updateAuditStatus',
      payload: {
        cancelVerifyType: current.cancelVerifyType,
        isAllowAsk: Number(current.isAllowAsk) === 1 ? 0 : 1,
        // eslint-disable-next-line no-nested-ternary,max-len
        status: current.status,
        userId: current.userId,
        // todo worker为临时值
        worker: currentUser.orgUserName,
        workerDesc: statusDesc,
        cb: () => { this.child.updateList(); },
      },
    });
    this.setState({
      reasonVisiable: false,
    });
  }


  render() {
    // tab 页面
    const TabPanes = TabsList.map((item) => {
      const result = this.getResultData(item.key);
      const { userDrverifyCount, isLoadding } = this.props.doctorQualificationReview;
      const panes = <TabPane tab = { item.name } key = { item.key }>
                      <CommonTable
                        flag = { item.key }
                        isLoadding = { isLoadding }
                        result = { result }
                        rightBottomUI = { this.rightBottomUI(userDrverifyCount) }
                        Colums = { this.getColums(item.key) }
                        getTableList = {this.getTableList}
                        onChlidRef = { this.onChlidRef }
                        key={ item.key }/>
                    </TabPane>;
      return panes;
    });
    const { dialogControl, isModalVisable, current = {}, reasonVisiable } = this.state;
    return (
      <Card>
        <div className={ styles.main }>
          <div className={ styles.InputContent }>
            <div>
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
            className={ styles.MyTabs }
            animated = {false}
            defaultActiveKey = { TabsList[0].key }
            onChange={ this.tabCallback }>
            {TabPanes}
          </Tabs>
          <ReasonFromModal
            title = { Number(current.isAllowAsk) === 1 ? '限制申请' : '取消限申' }
            label = { Number(current.isAllowAsk) === 1 ? '限制申请原因' : '取消限申原因'}
            visiable = { reasonVisiable }
            handleReasonCancel = {this.handleReasonCancel}
            handleReasonConfirm = {this.handleReasonConfirm}
          />
          <Modal
            title="医生资质认证审核"
            visible={ isModalVisable }
            onCancel={() => {
              this.setState({ isModalVisable: false });
            }}
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="60vw"
            style={{
              top: 20,
              bottom: 20,
            }}
            bodyStyle={{ overflow: 'scroll', height: '85vh' }}
            wrapClassName="report-modal-wrap"
          >
            <DoctorAuditContent
              userId = { current.userId }
              closeDialog={ this.closeDialog }
              dialogControl = { dialogControl } // 控制dialog的 展示样子
              zoomImage={this.zoomImage} />
          </Modal>
          <Modal
            title="查看图片"
            visible={this.state.isShowImg}
            onCancel={() => {
              this.setState({ isShowImg: false });
            }}
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="40vw"
            style={{
              top: 20,
              bottom: 20,
            }}
            bodyStyle={{ overflow: 'scroll', height: '50vh' }}
            wrapClassName="wrap-to-img"
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img style={{ width: '100%' }} src={this.state.currentImgUrl} />
          </Modal>
        </div>
      </Card>
    );
  }
}

export default DoctorQualificationReview;
