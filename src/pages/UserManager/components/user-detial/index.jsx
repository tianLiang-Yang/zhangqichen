import React from 'react';
import styles from './index.less';
import { Row, Col, Divider, Input, Form, Button } from 'antd';
import { connect } from 'dva';
import defaluteImage from '@/img/defalute_header.jpg'
import { AppColor } from '@/utils/ColorCommom';
import {isEmpty, handleEmptyStr, handleImageUrl} from '@/utils/utils';
import iconId from '@/img/manage_id.png';
import iconDoctor from '@/img/manage_doctor_id.png'
import IconFont from '@/components/IconFont';

const { TextArea } = Input;
const FormItem = Form.Item;

@connect(({ userManage }) =>
  ({
    userManage,
  }),
)
class UserDetial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const { dispatch, id, flag = "mobile" } = this.props;
    if (flag === 'sys') {
      dispatch({
        type: 'userManage/getSysMainData',
        payload: {
          orgUserId: id,
        },
      })
    }else{
      dispatch({
        type: 'userManage/fetchUserInfo',
        payload: {
          userId: id,
        },
      })
    }
  }

  onImageLoadError = () => {
    console.log('onImageLoadError', 'onImageLoadError');
    document.getElementById('imgHeader').src = defaluteImage;
  }

  // 编辑和添加角色表单提交
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    // const id = current ? current.id : '';
    form.validateFields((err, fieldsValue) => {
      console.log('validateFields', fieldsValue)
      if (err) return;
        dispatch({
          type: 'userManage/updateRole',
          param: fieldsValue,
        });
    });
    this.setState({
    });
  };


  // 生成基础信息的展示数据
  getBaseInfo = (data, type) => {
    const { flag ="mobile" } = this.props;
    if (type === 1) {
      return {
        注册号: flag === 'sys' ? data.orgUserNo: data.userNo,
        姓名: data.realName,
        出生日期: flag === 'sys' ? data.birthday : data.birthdayDic,
        职称: data.protitleDic,
        手机号: data.mobile,
        座机电话: data.phone,
        // 身份证号: data.身份证号,
        擅长: data.expertIn,
      }
    }
    if (type === 2) {
      const myData =  {
        昵称: flag === 'sys' ? data.nick : data.userNick ,
        性别: data.sexDic,
        年龄: data.age,
        所在地: data.provinceDic + data.cityDic,
        所属机构: data.orgIdDic,
        所在部门: data.deptIdDic,
      }
      if(flag !== 'sys') myData.职业医生证号 = data.drNvqNo
      return myData
    }
    if (type === 3) {
      return {
        注册时间: data.ctstamp,
        最后登录时间: flag === 'syd' ? data.loginTime :  data.logintime,
      }
    }
    if (type === 4) {
      return {
        注册IP: flag === 'sys' ? data.createIp :  data.createip,
        最后更新时间: data.utstamp,
      }
    }
    if(flag === 'sys'){
      return {
        最后登录IP:  flag === 'sys' ? data.loginIp : data.loginip,
        登录次数: `${data.dayLogintimes}/${data.totalLogintimes}`,
      }
    }
    return {
      最后登录IP:  flag === 'sys' ? data.loginIp : data.loginip,
    }

  }

  // 返回基础信息的UI
  getBaseInfoUI = (data, type) => {
    console.log('用户详情', data);
    const baseInfoObj = this.getBaseInfo(data, type);
    const baseInfoDiv = Object.keys(baseInfoObj).map((key) =>
      <div key = { key } className = { styles.info_item } >
        <div>{ key }:</div>
        <div>  { baseInfoObj[key] }</div>
      </div>)
    return baseInfoDiv;
  }

  // From
  FromContent = (data) => {
    const { form: { getFieldDecorator } } = this.props;
    return (
        <FormItem {...this.formLayout} >
          {getFieldDecorator('statusDesc', {
            rules: [
              {
                required: true,
                message: '',
                min: 1,
              },
            ],
            initialValue: isEmpty(data.statusDesc) ? '当前用户状态为正常' : handleEmptyStr(data.statusDesc),
          })(<TextArea disabled rows={4} placeholder="" />)}
        </FormItem>
    );
  }

  // 头像下的展示
  belowofPhoto = (data) => {
    const { flag } = this.props;
    return flag !== 'sys' ?
      <div>
        <div>
          <span>
            <img src={iconId} alt=""/>&nbsp;&nbsp;实名认证&nbsp;&nbsp;
            <IconFont
              className={styles.IconFont}
              style = {{ color: data.isId ? AppColor.Green2 : AppColor.Red }}
              type={ data.isId ? 'iconquerenduigougouhao' : 'iconcuocha_kuai'}
            />
          </span>
        </div>
        <div>
          <span>
            <img src={iconDoctor} alt=""/>&nbsp;&nbsp;医师资质认证&nbsp;&nbsp;
            <IconFont
              className={styles.IconFont}
              style = {{ color: data.isDoctorId ? AppColor.Green2 : AppColor.Red }}
              type = { data.isDoctorId ? 'iconquerenduigougouhao' : 'iconcuocha_kuai'}
            />
         </span>
        </div>
      </div>
      :
      <span></span>
  }

  render() {
    const { flag } = this.props;
    const { userDetial: { data = {} } } = this.props.userManage;
    return (
      <Form onSubmit={this.handleSubmit}>
      <div className = { styles.main }>
        <div>
          <Row>
            <Col span={6}>
              <div className = { styles.userInfo }>
                <img
                   id = "imgHeader"
                   onError = { this.onImageLoadError }
                   src = { handleEmptyStr(data.photoUrlDic ) }
                   alt="头像"
                />
                { this.belowofPhoto(data) }
                <div style = {{ color: flag === 'sys' ? AppColor.Green : AppColor.Blue }}>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  当前状态：{ isEmpty(data.status) ? '' : data.status === 0 ? '封号' : '正常'}
                </div>
                <div style = {{ color: AppColor.Gray, display: flag !== 'sys' ? 'none' : 'block' }}>
                  创建人：{ handleEmptyStr(data.creator) }
                </div>
              </div>
            </Col>
            <Col span={8} >{ this.getBaseInfoUI(data, 1)}</Col>
            <Col span={1} />
            <Col span={8} >{ this.getBaseInfoUI(data, 2)}</Col>
            <Col span={1} />
          </Row>
        </div>
        <Divider />
        <div>
          <Row style = {{ color: AppColor.Green }}>
            <Col span={8} >{this.getBaseInfoUI(data, 3)}</Col>
            <Col span={8} >{this.getBaseInfoUI(data, 4)}</Col>
            <Col span={8} >{this.getBaseInfoUI(data, 5)}</Col>
          </Row>
        </div>
        <div style={{ paddingTop: '10px' }}>
          { this.FromContent(data) }
        </div>
        <Divider />
        <div className={styles.CenterLayout}>
          <Button
            type="primary"
            shape="round"
            onClick = {this.handleSubmit}
            style={{ width: '120px' }}
          >
            关闭
          </Button>
        </div>
      </div>
      </Form>
    );
  }
}

export default Form.create()(UserDetial);
