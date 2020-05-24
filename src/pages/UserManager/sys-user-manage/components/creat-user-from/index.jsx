import React from 'react';
import styles from './index.less';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Cascader,
  Button,
} from 'antd';
import { connect } from 'dva';
import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'
import AreaSelect from '../../../components/area-select';
import { isEmpty, handleEmptyStr } from '@/utils/utils'
import moment from 'moment';

/**
 * 必填，用户名、性别、所属机构、所属科室、真实姓名、密码、所在地（省、市）
 */

const { Option } = Select;
const { TextArea } = Input;

@connect(({ userManage , user}) =>
  ({
    userManage,
    currentUser: user.currentUser,
    clickable: userManage.clickable
  }),
)
class AddSysUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deptList: [],
      peovinceOptions:[],
    }
  }

  componentDidMount() {
    const { dispatch, id } = this.props;
    if (id !== null) { // 编辑
      dispatch({
        type: 'userManage/getSysMainData',
        payload: {
          orgUserId: id,
          cb: (userDetial) => {
            const { data } = userDetial
            data.province
          }
        },
      })
    }
    dispatch({
      type: 'userManage/fetchDicList',
      payload: {
         dictCodeList: ['sex', 'protitle'],
        // keyword: '',
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

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    console.log('loadData',selectedOptions)
    targetOption.loading = true;
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchCityList',
      payload: {
        provinceid:  targetOption.value,
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

  getAreaValue = (detial) => {
    return [detial.province, detial.city]
  }

  handleSubmit = e => {
    if(!this.props.clickable) return
    e.preventDefault();
    const { dispatch, id } = this.props;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        console.log('Received values of form: ', fieldsValue);
        const areas = fieldsValue.area;
        const values = {
          ...fieldsValue,
          birthday: isEmpty(fieldsValue.birthday) ? '' : fieldsValue.birthday.format('YYYY-MM-DD'),
          province:areas.length>0 ? areas[0] : '',
          city: areas.length>1 ? areas[1] : '',
          orgUserId: id,
          creator: this.props.currentUser.orgUserName,
        };
        if (id !== null) values.orgUserId = id;

        dispatch({
          type: id === null ? 'userManage/AddSysUser' : 'userManage/updateSysUser',
          param: values,
          cb: this.props.toUpdateSysUserTable,
        });
      } else {
        console.log('Received values of err: ', err);
      }
    });
  };

  // 机构下拉列表
  chronickSwlwctOption = () => {
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

  // 角色下拉
  roleOption = () => {
    const roleList = this.props.userManage.roleRes.data;
    // eslint-disable-next-line max-len
    return roleList.map((item) => <Option key= { item.orgRoleid } value= { item.orgRoleid } >{ item.orgRolename }</Option>)
  }

  roleinitValue = (data) => {
    if (data.syOrgroleMainList !== undefined) {
      // eslint-disable-next-line no-empty-pattern
      const arr = [];
      data.syOrgroleMainList.forEach((item) => {
        arr.push(item.orgRoleid)
      })
      console.log('roleinitValue', arr)
      return arr;
    }
    return [];
  }


  // 慢病Select选择监听
  handleChronickChanage = (value) => {
    console.log(`机构的选中处理selected ${value}`);
    this.fetchDeptList({ orgId: value });
  }

  // 机构下拉列表
  chronickSwlwctOption = () => {
    const orgList = this.props.userManage.orgRes.data;
    // eslint-disable-next-line max-len
    return orgList.map((item) => <Option key = { item.orgId } value = { item.orgId } >{ item.orgName }</Option>)
  }

  //  角色是选择
  handleRoleChange = (value) => {
    console.log(`selected ${value}`);
  }


  render() {
    // eslint-disable-next-line prefer-const
      let { queryArr = {}, userDetial: { data = {} } } = this.props.userManage;
      console.log('添加用户', queryArr.sex)
      const { form: { getFieldDecorator }, id } = this.props;
      if (id === null) data = {};
      const { peovinceOptions } = this.state
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '86',
      })(
        <Select style={{ width: 70 }}>
          <Option value="86">+86</Option>
          <Option value="87">+87</Option>
        </Select>,
      );
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      return (
        <div className={ styles.main }>
          <Form className={ styles.myFrom } {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="用户名">
              {getFieldDecorator('orgUserName', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ],
                initialValue: handleEmptyStr(data.orgUserName),
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
            <Form.Item label="昵称">
              {getFieldDecorator('nick', {
                rules: [
                  {
                    message: '请输入昵称',
                  },
                ],
                initialValue: handleEmptyStr(data.nick),
              })(<Input />)}
            </Form.Item>
            <Form.Item label="性别">
              {getFieldDecorator('sex', {
                rules: [
                  {
                    required: true,
                    message: '请选性别',
                  },
                ],
                initialValue: data.sex === undefined ? '1' : data.sex,
              })(
                <Select>
                  {
                    isEmpty(queryArr.sex) ?
                      null
                      :
                      queryArr.sex.map((item) =>
                        <Option
                          key={item.value}
                          value={item.value}>
                          {item.label}
                         </Option>)
                  }
                </Select>)}
            </Form.Item>
            <Form.Item label="出生日期">
              {getFieldDecorator('birthday', {
                rules: [{ type: 'object', required: false, message: '请选择出生日期' }],
                initialValue: id === null ? '' : moment(handleEmptyStr(data.birthday)),
              })(<DatePicker />)}
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
            <Form.Item label="手机号">
              {getFieldDecorator('mobile', {
                rules: [{ message: '请输入手机号' }],
                initialValue: handleEmptyStr(data.mobile),
              })(<Input disabled = { handleEmptyStr(data.isMobileVerify) === 1} addonBefore={prefixSelector} style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="座机号">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    message: '请输入座机号',
                  },
                ],
                initialValue: handleEmptyStr(data.phone),
              })(<Input />)}
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
                  <Select disabled = { handleEmptyStr(data.userId) === 1} onChange = { this.handleChronickChanage } placeholder="请选择机构" >
                    { this.chronickSwlwctOption() }
                  </Select>)}
            </Form.Item>
            <Form.Item label="所在部门">
              {getFieldDecorator('deptId', {
                rules: [
                  {
                    required: true,
                    message: '请先选择科室',
                  },
                ],
                initialValue: handleEmptyStr(data.deptId),
              })(<Select disabled = { handleEmptyStr(data.userId) === 1} placeholder="请先选择机构" >
                { this.deptOption(data) }
                </Select>)}
            </Form.Item>
            <Form.Item label="绑定角色">
              {getFieldDecorator('orgRoleidList', {
                rules: [
                  {
                    required: true,
                    message: '请选择角色',
                  },
                ],
                initialValue: this.roleinitValue(data),
              })(<Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择角色"
                onChange = {this.handleRoleChange}
              >
                { this.roleOption() }
              </Select>)}
            </Form.Item>
            <Form.Item label="所在地">
              {getFieldDecorator('area', {
                initialValue: data ? [data.province, data.city] : []
              })(<Cascader
                options={ peovinceOptions }
                loadData={ this.loadData }
                changeOnSelect
              />)}
            </Form.Item>
            <Form.Item label = "擅长" >
              {getFieldDecorator('expertIn', {
                rules: [
                  {
                    required: false,
                    message: '请输入擅长描述',
                    min: 5,
                  },
                ],
                initialValue: handleEmptyStr(data.expertIn),
              })(<TextArea rows={4} placeholder="请输入至少五个请输入擅长描述" />)}
            </Form.Item>
            <Form.Item label = "密码" hasFeedback style={{ display: id == null ? 'block' : 'none' }}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: id === null,
                    message: '请输入密码',
                  },
                ],
              })(<Input.Password />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout} >
              <Button type="primary" htmlType="submit">
                { id === null ? '添加新用户' : '修改用户信息' }
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
    }
  }

  export default Form.create()(AddSysUser);
