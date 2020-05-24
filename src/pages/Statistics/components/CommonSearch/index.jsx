import React from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Cascader, message, Button, Tabs, Divider,
} from 'antd';
import { connect } from 'dva';
import request from '@/utils/request';
import { BaseUrl } from '@/utils/Constant'
import { isEmpty, handleEmptyStr } from '@/utils/utils'
import utilStyle from '@/utils/utils.less'
import moment from "moment";
import echartCircle from '@/img/echart_circle.jpg'
import echartLine from '@/img/echart_line.jpg'
import styles from './index.less'

/**
 * 所有地区，所属机构、日期选择 、 医生
 */

const { Option } = Select;

const { RangePicker } = DatePicker;


const formItemLayout = {
  labelCol: { span: 5},
  wrapperCol: { span: 18},
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
    }
  }

  componentDidMount() {
     const { dispatch } = this.props
    dispatch({
      type: 'userManage/fetchOrgList',
      payload: {
        keyword: '',
        oneStyle: styles.selectButton,
        twoStyle: styles.unSelectButton,
      },
    });
    this.setState({
      oneStyle: styles.selectButton,
      twoStyle: styles.unSelectButton,
    })
  }


  onProviceSelectChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  // 机构下拉列表
  orgOption = () => {
    const orgList = this.props.userManage.orgRes.data;
    // eslint-disable-next-line max-len
    return orgList.map((item) => <Option key = { item.orgId } value = { item.orgId } >{ item.orgName }</Option>)
  }

  /**
   * 慢病下拉列表Option
   * @returns {*[]}
   */
  chronickOption = () => {
    const orgList = this.props.userManage.orgRes.data;
    // eslint-disable-next-line max-len
    return orgList.map((item) => <Option key = { item.orgId } value = { item.orgId } >{ item.orgName }</Option>)
  }

  // 查询
  handleFromQuery = () => {

    this.props.form.validateFields((err, values) => {
      // console.log('fromValue  handleFromQuery',values,  moment(values.date[0]).format('YYYY-MM-DD'))
      this.props.updateChart(values)
    });
  }

  // 重置查询条件
  handleReset = () =>{
    this.props.form.resetFields();
    this.props.form.validateFields((err, values) => {
      this.props.updateChart(values)
    });
  }

  /**
   * 性别 和 年龄 点击事件
   * @param key
   */
  onButtonClick = (key) => {
    message.info(`key:${key}`)
    if(key === 1){
      this.setState({
        oneStyle: styles.selectButton,
        twoStyle: styles.unSelectButton,
      })
      this.props.tabOnclick(key)
    }else{
      this.setState({
        twoStyle : styles.selectButton,
        oneStyle: styles.unSelectButton,
      })
      this.props.tabOnclick(key)
    }
  }


  render() {
    // eslint-disable-next-line prefer-const
      const { form: { getFieldDecorator },  } = this.props;
      const { twoStyle, oneStyle } = this.state
      return (
        <div className={ `${utilStyle.myFromItem} ${utilStyle.myRadioBoderFrom}` }>
          <Form  {...formItemLayout} >
            <Row>
              <Col span={7}>
                <Form.Item label="地区">
                  {getFieldDecorator('deptId', {
                  })(<Select placeholder="请先选择所在机构" >
                  </Select>)}
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="选择机构" >
                  {getFieldDecorator('orgId', {
                  })(
                    <Select placeholder="请选择机构" >
                      { this.orgOption() }
                    </Select>)}
                </Form.Item>
              </Col>

              <Col span={7}>
                <Form.Item label="选择日期">
                  {getFieldDecorator('date', {
                  })( <RangePicker/>)}
                </Form.Item>
              </Col>
              <Col span={3}>
                <div className={utilStyle.HLayout}>
                  <Button style={{marginLeft:10}} type="primary" onClick={ this.handleFromQuery }>查询</Button>
                  <Button style={{marginLeft:10}} onClick={ this.handleReset }> 重置</Button>
                </div>
              </Col>
            </Row>
            <Divider/>
            <Row>
              <Col span={7}>
                <div style={{display: this.props.isNoSelectChronick ? 'none' : 'block'}}>
                  <Form.Item label="慢病类型" >
                    {getFieldDecorator('chronickType', {
                    })(
                      <Select placeholder="请选择慢病类型" >
                        { this.chronickOption() }
                      </Select>)}
                  </Form.Item>
                </div>
              </Col>
              <Col  span = { 8 } >
                <div  style={{display: this.props.isNoTabButton ? 'none' : 'block'}}>
                  <div className={ styles.TabBox}>
                    <div className={ oneStyle } onClick={ () => this.onButtonClick(1) }>性别</div>
                    <div className={ twoStyle }  onClick={ () =>  this.onButtonClick(2) }>年龄</div>
                  </div>
                </div>
              </Col>

              <Col  span = { 9 } >
                <div className={ styles.rightBox }>
                  <div className={ styles.ImageBox }>
                    <img src={ echartCircle } alt="" onClick={ this.props.onEchartIconChanage(1) }/>
                    <img src={ echartLine } onClick={ this.props.onEchartIconChanage(2) } alt=""/>
                  </div>
                </div>

              </Col>

            </Row>
          </Form>
        </div>
      );
    }
  }

export default Form.create()(BaseInfo);
