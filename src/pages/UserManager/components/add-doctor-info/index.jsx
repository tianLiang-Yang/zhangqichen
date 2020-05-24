import React from 'react';
import styles from './index.less';
import {
  Form,
  Row,
  Col, Tabs, Button, message
} from 'antd';

import { connect } from 'dva';
import BaseInfo from './base-info'
import Authentication from './authentication'
import utilStyle from '@/utils/utils.less'
import {Divider} from "antd/es";
import UserAvatar from '@/components/UserAvatar';

const { TabPane } = Tabs;

@connect(({ userManage , user}) =>
  ({
    userManage,
    currentUser: user.currentUser,
    queryArr: userManage.queryArr

  }),
)
class AddDoctorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photoUrl:'',
      baseInfo: null,
      authenticationInfo: null,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'userManage/fetchDicList',
      payload: {
        dictCodeList: ['sex'],
        // keyword: '',
      },
    });
  }

  onBaseChild = (ref) =>{
    this.baseChild = ref
  }

  onAuthChild = (ref) =>{
    this.authChild = ref
  }

  // 头像上传图片回调
  handleImageChange = (photoUrl) =>{
     this.setState({ photoUrl })
  }

  commit = () => {
    const { dispatch } = this.props;
    // const { photoUrl } = this.state;

    const baseData =  this.baseChild.handleSubmit()
    const authData =  this.authChild.handleSubmit()
    console.log('data result',baseData,authData)

    if(baseData && authData){
      const data =  { ...baseData, ...authData}
      // if(photoUrl){
      //   data.photoUrl = photoUrl
      // }
      console.log('datadatadatadatadata', data )
      dispatch({
        type: 'userManage/addDoctor',
        payload: {
          data,
          cb:()=>{
            this.props.handleAddDoctor()
          }
        },
      })
    }else{
      if (!baseData)   message.warn('请检查基本信息是否填写完整')
      if (!authData)   message.warn('请检查认证信息是否填写完整')
    }

  }

  render() {
      return (
        <Form onSubmit={this.handleSubmit}>
        <div className={ `${styles.main}`}>
          <Row>
            <Col span={3}>
              {/*<div className={ styles.backgroundImageBox}>*/}
              {/*  <UserAvatar handleImageChange = { this.handleImageChange }/>*/}
              {/*</div>*/}
            </Col>
            <Col span={18}>
              <Tabs
                onChange={this.onTabCallback}
                className={ styles.MyTabs }
                animated = {false}
                defaultActiveKey = {1}>
                <TabPane tab = "基本信息" key = { 1 }>
                  <BaseInfo queryArr = { this.props.queryArr }onBaseChild = { this.onBaseChild } />
                </TabPane>
                <TabPane tab = "认证信息" key = { 2 }>
                  <Authentication onAuthChild = { this.onAuthChild }
                  />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
          <div className={ `${ utilStyle.BotttomLayout2} ` }>
            <div>
              <Button onClick={() => this.commit()} style={{width: 100, marginLeft: 20}} type="primary"
                      shape="round">确定</Button>
              <div>
                <Button onClick={() => this.props.handleCancleAddDialog()} style={{width: 100, marginLeft: 20}} shape="round">取消</Button>
              </div>
            </div>
          </div>
        </div>
        </Form>
      );
    }
  }

export default Form.create()(AddDoctorInfo);
