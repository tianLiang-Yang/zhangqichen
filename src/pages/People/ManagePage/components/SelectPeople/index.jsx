import React from 'react';
import {Form, Input, Divider, Button, Row, Col, message} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import UtilStyle from '@/utils/utils.less'
import { isEmpty, handleEmptyStr, FLAG_ADD, FLAG_EDIT, FLAG_SEE, PEOPLE_NET_ALL } from "@/utils/utils";
import UserTable from "@/pages/People/ManagePage/components/UserTable";

const formItemLayout = {
  labelCol: { span: 8},
  wrapperCol: { span: 16},
};

@connect(({ peopleModule }) =>
  ({
    peopleModule,
    throngId: peopleModule.throngId
  }),
)
class SelectPeople extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  componentDidMount() {
    // this.submit();
    const { flag } = this.props;
    if(flag!== FLAG_ADD){
      // dispatch({
      //   type: 'eduClassModule/queryDetial',
      //   payload: {
      //     data: {
      //     classTypeId: id,
      //     },
      //     cb:this.callbackDetial,
      //   },
      // });
    }
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }


  handleSubmit = () => {
    const { selectStaticList =[]} = this.props.peopleModule;
    if(selectStaticList.length === 0){
      message.warn('您还未选择用户')
      return
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'peopleModule/addStaticUser',
      payload:
        {
          userIds: this.getUserIdArray(selectStaticList) , // list用户ids
          throngId: this.props.throngId,// 人群id
          cb: () =>{
            this.props.afterSelectShowStaticDialog(this.props.flag);
          }
        },
    });

  }

  getUserIdArray = (list) =>{
    const newList = []
    for(let i = 0 ; i< list.length; i++){
      newList.push(list[i].userId)
    }
    return Array.from(new Set(newList))
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  // 查询
  handleFromQuery = () => {
    this.props.form.validateFields((err, values) => {
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


  render() {
    const { flag } = this.props;
    const {form: { getFieldDecorator }} = this.props;
    return (
      <div className={`${ styles.main } ${ UtilStyle.myFromItem }`}>
        <Form>
          <Row>
            <Col span={5}>
              <Form.Item  { ...formItemLayout } label="注册号">
                {getFieldDecorator('userNo', {
                })(<Input rows={4} placeholder="请输入注册号" />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item  { ...formItemLayout } label="昵称">
                {getFieldDecorator('userNick', {
                })(<Input  placeholder="请输入昵称" />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item  { ...formItemLayout } label="姓名">
                {getFieldDecorator('realName', {
                })(<Input  placeholder="请输入姓名" />)}
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
          flag = { flag }
          show = { PEOPLE_NET_ALL }
          onChlidRef = { this.onChlidRef }
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
