import React from 'react';
import {Form, Radio, Switch, Row, Col, DatePicker, Affix, Input, Divider, Button, message} from 'antd';
import styles from './index.less';
import {connect} from "dva";

const FormItem = Form.Item;
const { TextArea } = Input;


const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};

const formItemLayout2 = {
  labelCol: { span: 2},
  wrapperCol: { span: 22},
};


@connect(({ eduAddModule,infomationModule }) =>
  ({
    eduAddModule,
    infomationModule,
  }),
)

class AuditNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      releaseType: 1, // 发布
      nominateIsRelease: 1,
      cancleValue: 1, // 取消
      hotcancleValue: 1, // 热门取消
      releaseTime: undefined,
      nominateReleaseTime: undefined,
      cancelTime: undefined,
      nominateCancelTime:undefined,
      isRecommondCheck: true ,// 是否是热门推荐

    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'eduAddModule/getBaThrongList',
    //   payload:{},
    //   htmlText:''
    // });
  }


  onCheckChange = (checked) => {
    this.setState({ isRecommondCheck: checked})
    console.log('onCheckChange',`switch to ${checked}`);
  }

  componentDidMount() {
  }

  // 审核状态
  onAuditChange = (e) =>{
    this.setState({ radioValue: Number(e.target.value) })
  }

  // 发布方式
  onChangeRelease = (e) => {
    this.setState({ releaseType: e.target.value })
  }

  // 热门发布方式
  onHotChangeRelease = (e) => {
    this.setState({ nominateIsRelease: e.target.value })
  }


  // 发布时间
  onReleaseTimeChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({ releaseTime: dateString })
  }

  // 发布时间
  onHotReleaseTimeChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({ nominateReleaseTime: dateString })
  }



  // 有限期
  onCancelTimeChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({ cancelTime: dateString })
  }

  // 热门有限期
  onHotCancelTimeChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({ nominateCancelTime: dateString })
  }

  // 有效期
  onChangeRadioCancle = (e) => {
    this.setState({ cancleValue: e.target.value })
  }

  // 有效期
  onHotChangeRadioCancle = (e) => {
    this.setState({ hotcancleValue: e.target.value })
  }

  // 提交审核
  auditNewsHttp = () => {
    const { dispatch } = this.props;
    const { isRecommondCheck, releaseTime, nominateReleaseTime,nominateCancelTime , cancleValue, cancelTime,hotcancleValue} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          releaseTime,
          nominateReleaseTime,
          nominateCancelTime: Number(hotcancleValue) === 1 ? '' :nominateCancelTime ,
          cancelTime: Number(cancleValue) === 1 ? '' :cancelTime ,
          isNominate: isRecommondCheck ? 1 : 0,
          isReleaseNominate: 1, // 0未发布,1发布,2已下架
          isRelease:1,
        }
        data.newsId = this.props.id;
        console.log("审核===",data)
        dispatch({
          type:'infomationModule/releaseNewById',
          payload:{
            data,
            cb:()=>{
              this.props.onReleaseRelust()
            }
          },
        });
      }
    });
  }


  render() {

    const { radioValue , releaseType, isRecommondCheck, nominateIsRelease} = this.state;

    const {form: { getFieldDecorator } } = this.props;
    return (
      <div className={styles.main}>

        <Form>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout2} label="发布方式">
                {getFieldDecorator('releaseType', {
                  initialValue: releaseType,
                  rules: [
                    {
                      required: radioValue === 2,
                    },
                  ],
                })(
                  // 0：暂不发布 1-立即发布 2-延期发
                  <div className={styles.HLayout}>
                    <div style={{marginBottom:24}}>
                      <Radio.Group style={{ marginLeft: 25}} name="radiogroup"  onChange={this.onChangeRelease} defaultValue={ 1 }>
                        <Radio value={1} >立即发布</Radio>
                        <Radio value={2} >预约发布</Radio>
                      </Radio.Group>
                    </div>
                    <div> <DatePicker onChange={ this.onReleaseTimeChange } /></div>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <div  style={{marginTop:-20}}>
            <Row>
              <Col span={24} >
                <FormItem {...formItemLayout2} label="有效期限">
                  {getFieldDecorator('有效期限', {
                    rules: [
                      {
                      },
                    ],
                  })(
                    <div className={styles.HLayout}>
                      <div style={{marginBottom:24}}>
                        <Radio.Group style={{ marginLeft: 25}}name="radiogroup"  onChange={this.onChangeRadioCancle} defaultValue={ 1 }>
                          <Radio value={1} >无限期</Radio>
                          <Radio value={2} >
                            截止日期
                          </Radio>
                        </Radio.Group>
                      </div>
                      <div><DatePicker onChange={ this.onCancelTimeChange } /></div>
                    </div>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="热门推荐">
                {getFieldDecorator('isNominate')(
                <div>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    defaultChecked = { isRecommondCheck }
                    onChange={this.onCheckChange}
                  />
                </div>
                )}
              </FormItem>
            </Col>
          </Row>

          <div>

          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout2} label="发布方式">
                {getFieldDecorator('releaseTypeNominate', {
                  initialValue: nominateIsRelease,
                  rules: [
                    {
                      required: isRecommondCheck && radioValue === 2,
                    },
                  ],
                })(
                  // 0：暂不发布 1-立即发布 2-延期发
                  <div className={styles.HLayout}>
                    <div style={{marginBottom:24}}>
                      <Radio.Group style={{ marginLeft: 25}} name="radiogroup" disabled = { !isRecommondCheck } onChange={this.onHotChangeRelease} defaultValue={ 1 }>
                        <Radio value={1} >立即发布</Radio>
                        <Radio value={2} >预约发布</Radio>
                      </Radio.Group>
                    </div>
                    <div> <DatePicker  disabled = { !isRecommondCheck }  onChange={ this.onHotReleaseTimeChange } /></div>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <div  style={{marginTop:-20}}>
            <Row>
              <Col span={24} >
                <FormItem {...formItemLayout2} label="有效期限">
                  {getFieldDecorator('有效期限', {
                    rules: [
                      {
                      },
                    ],
                  })(
                    <div className={styles.HLayout}>
                      <div style={{marginBottom:24}}>
                        <Radio.Group
                          disabled = { !isRecommondCheck }
                          style={{ marginLeft: 25}}name="radiogroup"
                           onChange={this.onHotChangeRadioCancle}
                          defaultValue={ 1 }>
                          <Radio value={1} >无限期</Radio>
                          <Radio value={2} >
                            截止日期
                          </Radio>
                        </Radio.Group>
                      </div>
                      <div><DatePicker  disabled = { !isRecommondCheck }  onChange={ this.onHotCancelTimeChange } /></div>
                    </div>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          </div>
            <Divider/>
            <div className={styles.CLayout}>
               <Button onClick={this.auditNewsHttp} style={{width: 100, marginLeft: 20}} type="primary"  shape="round">提交</Button>
            </div>
        </Form>
      </div>
    );
  }
}

export default  Form.create()(AuditNews);
