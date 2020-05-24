import React from 'react';
import {Form, Input, Divider, Button, Row, Col, message} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import UtilStyle from '@/utils/utils.less'
import { isEmpty, handleEmptyStr, FLAG_ADD, FLAG_EDIT, FLAG_SEE, PEOPLE_NET_ALL } from "@/utils/utils";
import UserTable from "./UserTable";

const formItemLayout = {
  labelCol: { span: 8},
  wrapperCol: { span: 16},
};

@connect(({ healthHomeDoctorModule }) =>
  ({
    healthHomeDoctorModule,
  }),
)
class SelectPeople extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectList: []
    };
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  handleSubmit = () => {
    const { selectList } = this.state;
    if(selectList.length === 0){
      message.warn('您还未选择团队成员')
      return
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/AddTeamUser',
      payload:
        {
          data :{
            drParamList: this.state.selectList , // list用户ids
            orgTeamId:  this.props.orgTeamId, // // 169633090434629632
          },
          cb: () =>{
            this.props.onTeamMumberkDestory();
          }
        },
    });

  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  // 查询
  handleFromQuery = () => {

    this.props.form.validateFields((err, values) => {
      console.log('fromValue  handleFromQuery',values)
      this.child.setFromValue(values)
    });
  }

  // 重置查询条件
  handleReset = () =>{
    this.props.form.resetFields();
    this.props.form.validateFields((err, values) => {
      this.child.setFromValue(values)
    });
  }

  // 监听复选框选中的行
  onRowSelectListener = (list) =>{
    this.setState({ selectList:  list})
  }


  render() {
    const {form: { getFieldDecorator }} = this.props;
    return (
      <div className={`${ styles.main } ${ UtilStyle }`}>
        <Form>
          <Row>
            <Col span={5}>
              <Form.Item  { ...formItemLayout } label="注册号">
                {getFieldDecorator('userNo', {
                })(<Input rows={4} placeholder="请输入注册号" />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item  { ...formItemLayout } label="姓名">
                {getFieldDecorator('realName', {
                })(<Input  placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item  { ...formItemLayout } label="手机号">
                {getFieldDecorator('mobile', {
                })(<Input  placeholder="请输入手机号" />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item  { ...formItemLayout } label="身份证">
                {getFieldDecorator('cardNo', {
                })(<Input placeholder="请输入身份证号" />)}
              </Form.Item>
           </Col>
            <Col span={4}>
              <div className={styles.HLayout}>
                <Button style={{marginLeft:10}} type="primary" onClick={ this.handleFromQuery }>查询</Button>
                <Button style={{marginLeft:10}} onClick={ this.handleReset }> 重置</Button>
              </div>
            </Col>
          </Row>
        </Form>
        <UserTable
          onChlidRef = { this.onChlidRef }
          orgTeamId = { this.props.orgTeamId }
          onRowSelectListener = { this.onRowSelectListener }
        />
        <Divider/>
        <div className={styles.HCenter}>
          <Button style={{width:100}} type="primary"  shape="round" onClick={ this.handleSubmit }>选择</Button>
        </div>
      </div>
    );
  }
}

export default  Form.create()(SelectPeople);
