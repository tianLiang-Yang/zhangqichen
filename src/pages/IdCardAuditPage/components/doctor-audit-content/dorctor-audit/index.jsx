import React from 'react'
import styles from './index.less'
import { Checkbox, Input, message, Form } from 'antd';
import defaluteImage from '@/img/defalute_header.jpg'
import { AppColor } from '@/utils/ColorCommom';
import { connect } from 'dva';
import {handleEmptyStr, handleImageUrl, isEmpty} from '@/utils/utils'
import { OPRATE_HANDLE_DATA, OPRATE_SEE_DETIALS, OPRATE_CANCEL_AUDIT, TAB_CANCLE } from '../../../help/Colums'

const { TextArea } = Input;

@connect(({ idCardQualification, user }) => ({
  idCardQualification,
   currentUser: user.currentUser,
  }))

/**
 * 医生资质审核
 */
class DoctorAudit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      data: {},
      inputValue: '', // 输入框
      disableInput: false, // input输入框是否可选
      disableChecked: false,
      checkedValue: false,
      visiableChecked: false, // 复选框是否可见  true - 不可选中 false -可选中
      clickableCofimButton: true, // 确定按钮 true -可点击啊 false - 不可点击
      placeHolder: '请在此输入取消原因',
    }
  }

  // 渲染过后 执行一次
  componentWillMount() {
    this.updateUI();
    const { userId } = this.props;
    this.getDoctorAuditInfo(userId);
  }

  /**
   * 获取列表数据http请求
   */
  getDoctorAuditInfo = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'idCardQualification/fetchDoctorDetial',
      payload: {
        userId: id,
        cb: this.setData,
      },
    });
  }

  /**
      OPRATE_CANCEL_AUDIT  // 取消认证
      OPRATE_HANDLE_DATA // 业务处理 重置认证
   */
  updateUI = () => {
    console.log('dialogControl', this.props)
    const { dialogControl, currentTab } = this.props;
    switch (Number(dialogControl)) {
      case OPRATE_SEE_DETIALS: // 1 - 查看（公用）
        this.setState({
          disableInput: true,
          clickableCofimButton: false,
          disableChecked: true,
          visiableChecked: currentTab === TAB_CANCLE,
        })
          break
      case OPRATE_CANCEL_AUDIT: // 取消认证
        this.setState({
          visiableChecked: true,
        })
        break
      case OPRATE_HANDLE_DATA: // 业务处理
        this.setState({
          disableChecked: false,
          visiableChecked: true,
          placeHolder: '请在此输入操作原因',
        })
        break
      default:
        break
    }
  }

  // 设置数据
  setData = (res) => {
    const { data = {} } = res;
    const { currentTab, dialogControl } = this.props;
    console.log(' this.props', this.props)
    // eslint-disable-next-line no-empty
    if (TAB_CANCLE === currentTab && OPRATE_SEE_DETIALS === dialogControl) {
      this.setState({ inputValue: data.cancelDesc })
    }
    this.setState({ checkedValue: data.isAllowAsk === 0 })
  }

  // 禁止申请
  onCheck = (e) => {
    console.log(`checked = ${e.target.checked}`);
    this.setState({ checkedValue: e.target.checked })
  }

  // 输入框监听
  onInputChange = ({ target: { value } }) => {
    this.setState({ inputValue: value });
  };

  // 确认点击
  onConfirmClick = (data) => {
    const { dialogControl } = this.props;
    if (dialogControl === OPRATE_SEE_DETIALS) return;
    const { inputValue, checkedValue } = this.state;
    const { dispatch, userId, currentUser } = this.props;
    if (isEmpty(inputValue)) {
      message.info('当前原因不能为空');
      return;
    }
    dispatch({
      type: 'idCardQualification/updateAuditStatus',
      payload: {
        buUserIdverifyAnnexUrlList: data.buUserIdverifyAnnexUrlList,
        isAllowAsk: checkedValue ? 0 : 1,
        status: dialogControl === OPRATE_CANCEL_AUDIT ? 4 : data.status,
        userId,
        worker: currentUser.orgUserName,
        workerDesc: inputValue,
        cb: this.confirmCallBack,
      },
    });
  }

  // 修改信息后的回调
  confirmCallBack = () => {
    this.props.closeDialog(1);
  }

  // 取消
  onCancleClick = () => {
    this.props.closeDialog(0);
  }

  // 生成基础信息的展示数据
  getBaseInfo = (data, type) => {
    console.log('生成基础信息的展示数据', data)
    if (type === 1) { // 右边信息
       return {
         姓名: handleEmptyStr(data.realname),
         出生日期: handleEmptyStr(data.birthday),
         所属机构: handleEmptyStr(data.orgIdDic),
         身份证号: handleEmptyStr(data.cardNo),
       }
    }
      return {
        性别: handleEmptyStr(data.sexDic),
        年龄: handleEmptyStr(data.age),
        所在部门: handleEmptyStr(data.deptIdDic),
      }
  }

  // 返回基础信息的UI
  getBaseInfoUI = (data, type) => {
    if (undefined === data) return <div></div>;
    const baseInfoObj = this.getBaseInfo(data, type);
    const baseInfoDiv = Object.keys(baseInfoObj).map((key) =>
            <div className = { styles.info_item } >
              <div>{ key }:</div>
               <div>{ baseInfoObj[key] }</div>
            </div>)
    return baseInfoDiv;
  }


  getImageUI = (doctorAduit) => {
    const { buUserIdverifyAnnexUrlList = [] } = doctorAduit;
    if (buUserIdverifyAnnexUrlList.length === 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 1; i++) {
        buUserIdverifyAnnexUrlList.push('')
      }
    }
     return buUserIdverifyAnnexUrlList.map((item) =>
        <div className = { styles.photoDiv }>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            className = { styles.photo }
            src = { handleImageUrl(item) }
            onClick = { () => this.props.zoomImage(handleImageUrl(item)) }/>
        </div>);
  }

  onImageLoadError = () => {
    document.getElementById('imgHeader').src = defaluteImage;
  }

  render() {
    const { dialogControl, currentTab } = this.props;
    const {
      inputValue,
      disableInput,
      visiableChecked,
      disableChecked,
      clickableCofimButton,
      placeHolder,
      checkedValue,
    } = this.state;
    const { doctorAduit = {} } = this.props.idCardQualification;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
       <div className = { styles.main }>
          <div>
            <img
              id="imgHeader"
              onError = { this.onImageLoadError }
              src={ handleImageUrl(doctorAduit.photoUrlDic) }
              alt = "医生照片"/>
            <div>
              <div className = { styles.layout_info }>
                { this.getBaseInfoUI(doctorAduit, 1) }
              </div>
              <div className = { styles.layout_info }>
                { this.getBaseInfoUI(doctorAduit, 2) }
              </div>
            </div>
          </div>
          <div>
            <div className={styles.small_title} >资格图片</div>
            <div>
              { this.getImageUI(doctorAduit) }
            </div>
          </div>
          <div>
            <div>
              <span className={ styles.small_title } >
                {
                  // eslint-disable-next-line no-nested-ternary
                  dialogControl === OPRATE_CANCEL_AUDIT ? '取消原因'
                    :
                    currentTab === TAB_CANCLE ? '操作原因' : '取消原因'}
              </span>
              <span>
              { visiableChecked ?
              <Checkbox
                disabled={ disableChecked }
                checked={ checkedValue }
                onChange = { this.onCheck }>禁止申请</Checkbox>
              :
              <span></span>
            }</span></div>
            <div>
              <div className={ styles.selectDiv }>

              </div>
              <TextArea
                disabled={ disableInput }
                style = {{ marginTop: 5, marginBottom: 5 }}
                rows={ 3 }
                value = { handleEmptyStr(inputValue) }
                onChange = { this.onInputChange }
                placeholder = { placeHolder }
              />
            </div>
          </div>
          {/* 确定取消按钮 */}
          <div>
            <div>
              <div
                onClick={ () => this.onConfirmClick(doctorAduit) }
                style={{ backgroundColor: clickableCofimButton ? AppColor.Green : AppColor.Gray }}
                className={ styles.button }>
                确定
              </div>
              <div
                onClick={ this.onCancleClick }
                style={{
                  borderColor: AppColor.Green,
                  color: AppColor.Green,
                }}
                className={ styles.button} >
                取消
              </div>
            </div>
          </div>
       </div>
      </Form>
    )
  }
}
export default Form.create()(DoctorAudit);
