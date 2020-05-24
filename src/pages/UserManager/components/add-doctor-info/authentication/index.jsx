import React from 'react';
import {
  Form,
  Input,
  Select,
  Switch,
  Radio,
} from 'antd';
import { connect } from 'dva';
import { isEmpty, handleEmptyStr } from '@/utils/utils'
import utilStyle from "@/utils/utils.less";
import config from './config'

/**
 * 必填，用户名、性别、所属机构、所属科室、真实姓名、密码、所在地（省、市）
 */

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};


@connect(({ userManage , user}) =>
  ({
    userManage,
    currentUser: user.currentUser,
  }),
)
class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      certificateFlag: false, // 是否通过认证
      isSendMeassage: false, // 是否发送短信
      isRequiredDoctorBumber: false, // 是否必医师证件号
      isRequiredDoctorPhoto: false, // 是否必须医师证件照片
    }
  }

  componentDidMount() {
     this.props.onAuthChild(this)
    const {dispatch} = this.props;
    dispatch({
      type: 'userManage/fetchDicList',
      payload: {
        dictCodeList: ['protitle'],
      },
    });
  }


  // 提交
  handleSubmit = () => {
    let values = null;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
         values = {
          ...fieldsValue,
           certificateFlag: fieldsValue.certificateFlag ? 1 : 0
        };
      }else{
        values = null
      }
    });
    return values
  };

  onSwitchAuthenticationChange = (checked) => {
    this.setState({
      certificateFlag: checked,
      isRequiredDoctorBumber: !!checked,
      isRequiredDoctorPhoto: !!checked,
    })
  }

  onSwitchMessageChange = (checked) => {
    this.setState({ isSendMeassage: checked })
  }


  render() {
    // eslint-disable-next-line prefer-const
      let { queryArr = {}, userDetial: { data = {} } } = this.props.userManage;
      const {  certificateFlag, isSendMeassage, isRequiredDoctorBumber, isRequiredDoctorPhoto  } = this.state
      const { form: { getFieldDecorator }, id } = this.props;
      data = {};
      return (
        <div className={ `${utilStyle.myFromItem} ${utilStyle.myLineBoderFrom}` }>
          <Form  {...formItemLayout} >
            <Form.Item label="医生类型">
              {getFieldDecorator('drType', {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue:  data.drType? data.drType : 1,
              })( <Radio.Group  >
                    <Radio value={1}>医师</Radio>
                    <Radio value={2}>健管师</Radio>
                  </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="擅长">
              {getFieldDecorator('expertIn', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的擅长',
                  },
                ],
                initialValue: handleEmptyStr(data.expertIn),
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职称">
              {getFieldDecorator('protitle', {
                rules: [
                  {
                    required: true,
                    message: '请选择职称',
                  },
                ],
                initialValue: handleEmptyStr(data.protitle),
              })(<Select disabled = { handleEmptyStr(data.userId) === 1}>
                {
                  isEmpty(queryArr.protitle) ?
                    null
                    :
                    queryArr.protitle.map((item) => <Option
                      key={item.value}
                      value={item.value}>
                      {item.label}
                    </Option>)
                }
              </Select>)}
            </Form.Item>
            <Form.Item label="执证医师证号">
              {getFieldDecorator('drNvqNo', {
                rules: [
                  {
                    required: true,
                    message: '请输入执证医师证号',
                  },
                ],
                initialValue: handleEmptyStr(data.drNvqNo),
              })(<Input />)}
            </Form.Item>

            <Form.Item label="">
              {getFieldDecorator('certificateFlag', {
                initialValue: certificateFlag
              })(
               <span>
                 <Switch
                   checked={ certificateFlag }
                   onChange={ this.onSwitchAuthenticationChange }
                 />
                 &nbsp;&nbsp; &nbsp;是否通过医师资格认证
               </span>
                )}
            </Form.Item>
            <Form.Item label="">
              {getFieldDecorator('isSend', {
                initialValue: true
              })(
                <span>
                  <Switch
                    checked={ isSendMeassage }
                    onChange={ this.onSwitchMessageChange }/>
                  &nbsp;&nbsp; &nbsp;是否发送短信通知
                </span>
              )}
            </Form.Item>
          </Form>
        </div>
      );
    }
  }

export default Form.create()(Authentication);
