import React from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Cascader, message,
} from 'antd';
import { connect } from 'dva';
import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'
import { isEmpty, handleEmptyStr } from '@/utils/utils'
import utilStyle from '@/utils/utils.less'
import moment from "moment";

/**
 * 必填，用户名、性别、所属机构、所属科室、真实姓名、密码、所在地（省、市）
 */

const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};


const formItemLayout3 = {
  labelCol: { span: 9},
  wrapperCol: { span: 14},
};

@connect(({ userManage , user}) =>
  ({
    userManage,
    currentUser: user.currentUser,
    authTypeList: userManage.authTypeList
  }),
)
class BaseInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deptList: [], // 科室id
      peovinceOptions:[], // 级联的options
    }
  }


  onProviceSelectChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

   onChange = (date, dateString) => {
    console.log('onChangeonChange',date.valueOf(), dateString);
  }


  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    console.log('loadData',selectedOptions)
    targetOption.loading = true;
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchCityList',
      payload: {
        provinceid: targetOption.value,
        cb:(list)=>{
          const newList = []
          for (let i = 0; i < list.length ; i++) {
            newList.push({
              value: list[i].areaId,
              label: list[i].areaName,
            })
          }
          targetOption.loading = false;
          targetOption.children = newList
          this.setState({
            // eslint-disable-next-line react/no-access-state-in-setstate
            peovinceOptions: [...this.state.peovinceOptions],
          });
        }
      },
    });
  }


  componentDidMount() {
    this.props.onBaseChild(this)
    const { dispatch } = this.props
    dispatch({
      type: 'userManage/fetchDicOtherList',
      payload: {
        data:{
          dictCode:'CARDTYPE'
        },
      },
    })
    dispatch({
      type: 'userManage/fetchProvinceList',
      payload: {
        keyword: '',
        cb : (provinceList)=>{
          const newList = []
          for (let i = 0; i < provinceList.length ; i++) {
            newList.push({
              value: provinceList[i].areaId,
              label: provinceList[i].areaName,
              isLeaf: false,
            })
          }
          this.setState({ peovinceOptions: newList },()=>
          {
            console.log('peovinceOptions',this.state.peovinceOptions, newList)
          })

        }
      },
    });
    dispatch({
      type: 'userManage/fetchOrgList',
      payload: {
        keyword: '',
      },
    });
    dispatch({
      type: 'userManage/fetchRoleList',
      payload: {
        // orgId: '',
        // keyword: '',
      },
    });
  }

// 科室列表
  fetchDeptList =(params) => {
    request.get(`${BaseUrl}/manage/health/BaDepartmentController/list/getList`, { params })
      .then((response) => {
        if (response.code === 200) {
          this.setState({
            deptList: response.data,
          });
        }
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
  }




  handleSubmit = () => {
    let values = null
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        if(fieldsValue.area.length<2){
          message.warn('请选择市')
          return
        }
         values = {
          ...fieldsValue,
          province:fieldsValue.area[0],
          birthday: fieldsValue.birthday.valueOf(),
          city: fieldsValue.area[1],
        };
      }else{
        values =  null
      }
    });
    return values
  };

  // 机构下拉列表
  orgOption = () => {
    const orgList = this.props.userManage.orgRes.data;
    // eslint-disable-next-line max-len
    return orgList.map((item) => <Option key = { item.orgId } value = { item.orgId } >{ item.orgName }</Option>)
  }

  // 科室下拉列表
  deptOption = (data) => {
    const { deptList } = this.state;
    if (deptList.length === 0) {
      return <Option key= { data.deptId } value= { data.deptId } >{ data.deptIdDic }</Option>;
    }
    // eslint-disable-next-line max-len
    return deptList.map((item) => <Option key= { item.deptId } value= { item.deptId } >{ item.deptName }</Option>)
  }


  // 机构的选中处理
  handleChronickSelectChanage = (value) => {
    console.log(`机构的选中处理selected ${value}`);
    this.fetchDeptList({ orgId: value });
  }

  render() {
    // eslint-disable-next-line prefer-const
      let { userDetial: { data = {} } } = this.props.userManage;
      const { authTypeList = [] } = this.props
      const { peovinceOptions } = this.state;
      const { form: { getFieldDecorator },  } = this.props;
      data = {};
      const { queryArr = {}} = this.props
      console.log('queryArr',queryArr)

      return (
        <div className={ `${utilStyle.myFromItem} ${utilStyle.myLineBoderFrom}` }>
          <Form  {...formItemLayout} >
            <Form.Item label="手机号">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ],
                initialValue: handleEmptyStr(data.phone),
              })(<Input />)}
            </Form.Item>
            <Form.Item label="昵称">
              {getFieldDecorator('userNick', {
                rules: [
                  {
                    required: true,
                    message: '请输入昵称',
                  },
                ],
                initialValue: handleEmptyStr(data.userNick),
              })(<Input />)}
            </Form.Item>
            <Form.Item label="真实姓名">
              {getFieldDecorator('realName', {
                rules: [
                  {
                    required: true,
                    message: '请输入真实姓名',
                  },
                ],
                initialValue: handleEmptyStr(data.realName),
              })(<Input />)}
            </Form.Item>
            <Form.Item label="身份证件类型">
              {getFieldDecorator('cardType', {
                rules: [
                  {
                    required: true,
                    message: '身份证件类型',
                  },
                ],
                initialValue: data.cardType === undefined ? '' : data.cardType,
              })(
                <Select>
                  {
                    authTypeList.map((item)=>
                      <Option
                       key={item.value}
                       value={item.value}>
                        { item.label }
                      </Option>)
                  }

                </Select>)}
            </Form.Item>
            <Form.Item label="证件号">
              {getFieldDecorator('cardNo', {
                rules: [
                  {
                    required: true,
                    message: '请输入证件号',
                  },
                ],
                initialValue: handleEmptyStr(data.cardNo),
              })(<Input />)}
            </Form.Item>
            <Row>
              <Col span={10}>
                <Form.Item { ... formItemLayout3 } label="出生日期">
                  {getFieldDecorator('birthday', {
                    rules: [{ type: 'object', required: true, message: '请选择出生日期' }],
                    initialValue: data.birthday ?  moment(handleEmptyStr(data.birthday)) : '',
                  })(<DatePicker  />)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item { ... formItemLayout3 }  label="性别">
                {getFieldDecorator('sex', {
                  rules: [
                    {
                      required: true,
                      message: '请选性别',
                    },
                  ],
                  initialValue: data.sex ? '' : data.sex,
                })(
                  <Select>
                          <Option
                            key={1}
                            value={1}>
                            男
                          </Option>
                    <Option
                      key={2}
                      value={2}>
                      女
                    </Option>
                  </Select>)}
              </Form.Item>
              </Col>
            </Row>
            <Form.Item label="所在地">
              {getFieldDecorator('area', {
                rules: [
                  {
                    required: true,
                    message: '请选择所在地',
                  },
                ],
              })( <Cascader
                    options={ peovinceOptions }
                    loadData={ this.loadData }
                    onChange={ this.onProviceSelectChange }
                    changeOnSelect
                   />
              )}
            </Form.Item>
            <Form.Item label="所在机构" >
              {getFieldDecorator('orgId', {
                rules: [
                  {
                    required: true,
                    message: '请选择机构',
                  },
                ],
                initialValue: handleEmptyStr(data.orgId),
                })(
                  <Select onChange = { this.handleChronickSelectChanage } placeholder="请选择机构" >
                    { this.orgOption() }
                  </Select>)}
            </Form.Item>
            <Form.Item label="请先选择科室">
              {getFieldDecorator('deptId', {
                rules: [
                  {
                    required: true,
                    message: '请先选择科室',
                  },
                ],
                initialValue: handleEmptyStr(data.deptId),
              })(<Select disabled = { handleEmptyStr(data.userId) === 1} placeholder="请先选择所在机构" >
                { this.deptOption(data) }
                </Select>)}
            </Form.Item>

            <div className={utilStyle.myTextInputLineBoderFrom}>
              <Form.Item >
                {getFieldDecorator('drInfo', {
                  rules: [
                    {
                      required: false,
                      message: '医生简介（200字以内）',
                      min: 5,
                      max:200
                    },
                  ],
                  initialValue: handleEmptyStr(data.drInfo),
                })(<TextArea rows={4} placeholder="医生简介（200字以内）" />)}
              </Form.Item>
            </div>
          </Form>
        </div>
      );
    }
  }

export default Form.create()(BaseInfo);
