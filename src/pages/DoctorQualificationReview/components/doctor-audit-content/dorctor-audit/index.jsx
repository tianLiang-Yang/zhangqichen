import React from 'react'
import styles from './index.less'
import { Checkbox, Input, Radio, message } from 'antd';
import defaluteImage from '@/img/defalute_header.jpg'
import { AppColor } from '@/utils/ColorCommom';
import { connect } from 'dva';
import { handleEmptyStr, isEmpty, handleImageUrl } from '@/utils/utils'
import { OPRATE_SEE_DETIALS, OPRATE_AUDIT_DATA, OPRATE_CANCEL_AUDIT, OPRATE_HANDLE_DATA } from '../../../help/Colums'

const { TextArea } = Input;

@connect(({ doctorQualificationReview, user }) => ({
    doctorQualificationReview,
    currentRole: user.currentUser,
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
      radioValue: 0, // 单选框 默认值
      inputValue: '', // 输入框
      disablePass: false, // 通过审核radio是否可选
      visiablepass: false,
      disableRejected: false, // 驳回审核radio是否可选
      visiableReject: false,
      disableInput: false, // input输入框是否可选
      disableChecked: false,
      checkedValue: false,
      visiableChecked: false, // 复选框是否可见  true - 不可选中 false -可选中
      clickableCofimButton: true, // 确定按钮 true -可点击啊 false - 不可点击
      clickableCancleButton: false, // 取消按钮 true -可点击啊 false - 不可点击
      visiableCancle: false, // 取消认证是否可见
      placeHolder: '请在此输入原因',
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
      type: 'doctorQualificationReview/fetchDoctorDetial',
      payload: {
        userId: id,
        cb: this.setData,
      },
    });
  }

  /**
   *  OPRATE_SEE_DETIALS = 1; // 查看详情
      OPRATE_AUDIT_DATA = 2; // 审核
      OPRATE_CANCEL_AUDIT = 3; // 取消认证
      OPRATE_HANDLE_DATA = 4; // 业务处理
   */
  updateUI = () => {
    console.log('dialogControl', this.props)
    const { dialogControl } = this.props;
    switch (Number(dialogControl)) {
      case OPRATE_SEE_DETIALS: // 1 - 查看（公用）
        this.setState({
          disablePass: true,
          disableRejected: true,
          disableInput: true,
          clickableCofimButton: false,
          disableChecked: true,
          clickableCancleButton: false,
          visiableChecked: true,
          visiableCancle: true,
          visiablepass: true,
          visiableReject: true,
        })
          break
      case OPRATE_AUDIT_DATA: // 审核
        this.setState({
          visiablepass: true,
          visiableReject: true,
          visiableChecked: true,
          disableChecked: false,
        })
        break
      case OPRATE_CANCEL_AUDIT: // 取消认证
        this.setState({
          visiableCancle: true,
        })
        break
      case OPRATE_HANDLE_DATA: // 业务处理
        this.setState({
          visiablepass: true,
          visiableReject: true,
          disableChecked: false,
          visiableChecked: true,
          placeHolder: '请输入原因',
        })
        break
      default:
        break
    }
  }

  // 设置数据
  setData = (res) => {
    const { data = {} } = res;
    const { dialogControl } = this.props;
    const { cancelVerifyType } = data;
    let inputValue = '';
    if (dialogControl === OPRATE_SEE_DETIALS) {
      inputValue = isEmpty(data.cancelDesc) ? handleEmptyStr(data.verifyDesc) : data.cancelDesc
      // if (data.status == 2) {}
      this.setState({
        // eslint-disable-next-line no-nested-ternary
        radioValue: Number(cancelVerifyType === 1
          ?
          4 // 取消资质审核
          :
          cancelVerifyType === 2 ? 5 : data.status), // 1 - 通过 2 -驳回 5 -取消资质审核和身份审核
        inputValue,
      })
    }
      this.setState({ checkedValue: data.isAllowAsk === 0 })
  }

  // 单选框
  onRadioChange = e => {
    const { value } = e.target;
    this.setState({
      // eslint-disable-next-line no-nested-ternary
      placeHolder: value === 2
        ? '请在此输入通过原因'
        : value === 3 ? '请在此输入驳回原因' : '请在此输入取消原因' })
    this.setState({
      radioValue: value,
    });
  };

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
  onConfirmClick = (res) => {
    const { radioValue, inputValue, checkedValue } = this.state;
    const { dialogControl , currentRole} = this.props;
    const data = res;
    const { dispatch, userId } = this.props;
    console.log('updateAuditStatusd', radioValue)
    if (dialogControl !== OPRATE_HANDLE_DATA) {
      if (radioValue === 0) {
        message.info('请选择当前操作状态');
        return;
      }
    }
    if (isEmpty(inputValue)&&radioValue!==2) {
      message.info('操作原因不能为空');
      return;
    }
    dispatch({
      type: 'doctorQualificationReview/updateAuditStatus',
      payload: {
        buUserDrverifyAnnexUrlList: data.buUserDrverifyAnnexUrlList,
        // eslint-disable-next-line no-nested-ternary
        cancelVerifyType: radioValue === 4 ? 1 : radioValue === 5 ? 2 : data.cancelVerifyType,
        // eslint-disable-next-line no-nested-ternary
        isAllowAsk: radioValue === 2 ? 1:checkedValue ? 0 : 1,
        // eslint-disable-next-line no-nested-ternary,max-len
        status: radioValue === 0 ? data.status : radioValue === 4 || radioValue === 5 ? 4 : radioValue,
        userId,
        // todo worker为临时值
        worker: currentRole.orgUserName,
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
    if (type === 1) { // 右边信息
       return {
         姓名: handleEmptyStr(data.realname),
         出生日期: handleEmptyStr(data.birthday),
         职称: handleEmptyStr(data.protitleDic),
         所属机构: handleEmptyStr(data.orgIdDic),
         证件类型: handleEmptyStr(data.cardTypeDic),
         证件证号: handleEmptyStr(data.cardNo),
         擅长: handleEmptyStr(data.expertIn),
       }
    }
      return {
        性别: handleEmptyStr(data.sexDic),
        年龄: handleEmptyStr(data.age),
        所在地: handleEmptyStr(data.provinceDic) + handleEmptyStr(data.cityDic),
        所在部门: handleEmptyStr(data.deptIdDic),
        职业医生证号: handleEmptyStr(data.drNvqNo),
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
    const { buUserDrverifyAnnexUrlList = [] } = doctorAduit;
    if (buUserDrverifyAnnexUrlList.length === 0) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 1; i++) {
        buUserDrverifyAnnexUrlList.push('')
      }
    }
     return buUserDrverifyAnnexUrlList.map((item) =>
        <div className = { styles.photoDiv }>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            className = { styles.photo }
            src = { handleImageUrl(item)}
            onClick = { () => this.props.zoomImage(handleImageUrl(item)) }/>
        </div>);
  }

  onImageLoadError = () => {
    document.getElementById('imgHeader').src = defaluteImage;
  }

  render() {
    const {
      inputValue,
      radioValue,
      disablePass,
      disableRejected,
      disableInput,
      visiableChecked,
      visiableCancle,
      visiableReject,
      visiablepass,
      disableChecked,
      clickableCofimButton,
      clickableCancleButton,
      placeHolder,
      checkedValue,
    } = this.state;
    console.log('render', radioValue, typeof radioValue)
    const { doctorAduit = {} } = this.props.doctorQualificationReview;
    return (
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
            <div className={ styles.small_title } >审核结果</div>
            <div>
              <div className={ styles.selectDiv }>
                <Radio.Group onChange = { this.onRadioChange } value = { Number(radioValue) }>
                  <Radio value={2}
                         style={{ display: visiablepass ? ' inline-block' : 'none' }}
                         disabled = { disablePass }>审核通过</Radio>
                  <Radio value={3}
                         style={{ display: visiableReject ? ' inline-block' : 'none' }}
                         disabled = { disableRejected }>驳回审核</Radio>
                  <Radio value={4}
                         disabled = { disableChecked }
                         style={{ display: visiableCancle ? 'inline-block' : 'none' }}>取消资质认证</Radio>
                  <Radio value={5}
                         disabled = { disableChecked }
                         style={{ display: visiableCancle ? 'inline-block' : 'none' }}>取消资质认证和身份认证</Radio>
                </Radio.Group>
                { visiableChecked ?
                  <Checkbox
                    disabled={ disableChecked }
                    checked={ checkedValue }
                    onChange = { this.onCheck }>禁止申请</Checkbox>
                  :
                  <span></span>
                }
              </div>
              <TextArea
                disabled={ disableInput }
                style = {{ marginTop: 5, marginBottom: 5 }}
                rows={3}
                value = { handleEmptyStr(inputValue) }
                onChange = { this.onInputChange }
                placeholder = {placeHolder}
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
                  borderColor: clickableCancleButton ? AppColor.Green : AppColor.Gray,
                  color: clickableCancleButton ? AppColor.Green : AppColor.Gray,
                }}
                className={ styles.button} >
                取消
              </div>
            </div>
          </div>
       </div>
    )
  }
}
export default DoctorAudit;
