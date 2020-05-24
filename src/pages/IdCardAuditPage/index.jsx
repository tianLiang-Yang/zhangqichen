import { Tabs, Card, Modal, Input } from 'antd';
import React from 'react'
import AuditContent from './components/doctor-audit-content';
import CommonTable from '@/components/ui/common-table'
import * as Colums from './help/Colums';
import styles from './index.less';
import { connect } from 'dva';
import { handleEmptyStr, isEmpty } from '@/utils/utils';

const { confirm } = Modal;
const { TabPane } = Tabs;
const { Search } = Input;
const TabsList = [
  { name: '已通过', key: Colums.TAB_PASS },
  { name: '已取消', key: Colums.TAB_CANCLE },
];

@connect(({ idCardQualification }) =>
  ({
    idCardQualification,
  }),
)

  /**
   * 医生资质审核
   */
class IDCardAudit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: Colums.TAB_PASS,
      current: undefined, // 点击当前一条数据值
      isModalVisable: false, // 是否弹出资质审核框
      isShowImg: false, // 是否展示图片
      currentImgUrl: '', // 点击当前的图片地址
      dialogControl: '1', // 1 - 取消认证 ，2 - 重置认证
    };
  }

  componentDidMount() {
  }

  // 底部统计数据
  getStatisticsReq() {
    const { dispatch } = this.props;
    dispatch({
      type: 'idCardQualification/fetchStatics',
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
    this.setState({ currentTab: Number(key) })
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
   * zoomImag 资质审核弹出框处理
   * @param url
   */
  handleAduitDialog = (record, dialogControl) => {
    this.setState({ current: record },
      () => {
        // eslint-disable-next-line max-len
        if (dialogControl === Colums.OPRATE_LIMIT_AUDIT || dialogControl === Colums.OPRATE_CANCAL_LiMIT) {
          const content = dialogControl === Colums.OPRATE_LIMIT_AUDIT ? '限制申请' : '取消限申';
          confirm({
            title: content,
            content: `确定要对改用户${content}?`,
            onOk() {
              console.log('OK');
            },
          });
        } else {
          this.setState({ dialogControl, isModalVisable: true });
        }
      })
  };

  /**
   * getColums 获取表头
   *  flag //1已通过 2-已取消
   * @returns { colums }
   */
  getColums = (flag) => {
    let colums = null;
    switch (Number(flag)) {
      case Colums.TAB_PASS:
        colums = Colums.PassColumns(this.handleAduitDialog);
        break;
      case Colums.TAB_CANCLE:
        colums = Colums.CancelledColumns(this.handleAduitDialog);
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
      type: 'idCardQualification/fetch',
      payload: {
        size: pageSize,
        page,
        status: flag, // 身份状态（1-待审批2-认证通过3-申请驳回4-认证被取消
        keyword: keyWord,
      },
    });
    this.getStatisticsReq();
  }

  /**
   * 列表数据返回结果
   *  flag // 2-已通过  3-已取消
   */
  getResultData = (flag) => {
    let result = {};
    const {
      passResult,
      cancleResult,
    } = this.props.idCardQualification;
    console.log('getResultData',this.props.idCardQualification)
    switch (Number(flag)) {
      case Colums.TAB_PASS:
        result = passResult;
        break
      case Colums.TAB_CANCLE:
        result = cancleResult;
        break
      default:
        result = [];
        break
    }
    return result;
  }

  rightBottomUI = (userDrverifyCount) => {
    const { data = {} } = userDrverifyCount;
    return <div style={{ display: data === {} ? 'none' : 'block' }}>
      医师总数：<span> { handleEmptyStr(data.userCount) } 人 </span> ，
      已通过<span> { handleEmptyStr(data.havaDrverify) } 人 </span>，
      已取消<span> { handleEmptyStr(data.cancelCount) }人 </span>，
    </div>
  }

  // 关闭dialog
  closeDialog = (type) => {
    if (type === 1) {
      this.child.updateList();
    }
    this.setState({ isModalVisable: false });
  }

  render() {
    // tab 页面
    const TabPanes = TabsList.map((item) => {
      const result = this.getResultData(item.key);
      const { userDrverifyCount, isLoadding } = this.props.idCardQualification;
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
    const { dialogControl, isModalVisable, current = {} } = this.state;
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
          <Modal
            title="个人身份认证"
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
            <AuditContent
              userId = { current.userId }
              closeDialog = { this.closeDialog }
              dialogControl = { dialogControl } // 控制dialog的 展示样子
              currentTab = { this.state.currentTab }
              zoomImage = {this.zoomImage} />
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

export default IDCardAudit;
