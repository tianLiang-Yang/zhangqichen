import React from 'react';
import {Form, Select, Radio, Switch, Row, Col, DatePicker, message, Input} from 'antd';
import styles from './index.less';
import {connect} from "dva";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};

const formItemLayout2 = {
  labelCol: { span: 2},
  wrapperCol: { span: 22},
};


@connect(({ eduAddModule,user }) =>
  ({
    eduAddModule,
    currentUser: user.currentUser,
    isClickable: eduAddModule.isClickable
  }),
)

class AuditCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: 2, // 审核
      releaseType: 0, // 发布
      nominateIsRelease: 0,
      cancleValue: 1, // 取消
      hotcancleValue: 1, // 热门取消
      releaseTime: undefined,
      nominateReleaseTime: undefined,
      cancelTime: undefined,
      nominateCancelTime:undefined,
      isRecommondCheck: false ,// 是否是热门推荐

    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/getBaThrongList',
      payload:{},
      htmlText:''
    });
  }


  onCheckChange = (checked) => {
    this.setState({ isRecommondCheck: checked})
    console.log('onCheckChange',`switch to ${checked}`);
  }

  componentDidMount() {
    this.props.onChlidRef(this)
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
  auditCourseHttp = () => {
    if(!this.props.isClickable) return
    const { dispatch } = this.props;
    const { radioValue, isRecommondCheck, releaseTime, nominateReleaseTime,nominateCancelTime , cancleValue, cancelTime,hotcancleValue} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          ...values,
          releaseTime,
          nominateReleaseTime,
          nominateCancelTime: Number(hotcancleValue) === 1 ? '' :nominateCancelTime ,
          cancelTime: Number(cancleValue) === 1 ? '' :cancelTime ,
          isNominate: isRecommondCheck ? 1 : 0,
        }
        if(radioValue !== 2){ // 驳回审核的时候
          const { checkerDesc } = values;
          data = {
            status:3,
            checkerDesc
          }
        }
        data.classId = this.props.id;
        console.log("审核===",data)
        dispatch({
          type:'eduAddModule/CourseUSubmit',
          payload:{
            data,
            cb:()=>{
              this.props.handleBackPage()
            }
          },
        });
      }
    });
  }


  render() {

    const { radioValue , releaseType, isRecommondCheck, nominateIsRelease} = this.state;
    const { ThrongList = [ ] } = this.props.eduAddModule

    const BaThrongListOption = ThrongList.map((item) =>
      <Option key={item.throngId} value= { item.throngId }>{ item.throngName }</Option>)
    const {form: { getFieldDecorator } } = this.props;
    return (
      <div className={styles.main}>

        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="">
                {getFieldDecorator('status', {
                  initialValue: `${radioValue}`,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <div>
                    <Radio.Group style={{ marginLeft: 25}} name="radiogroup"  onChange={this.onAuditChange} defaultValue={ 2 }>
                      <Radio value={2} >审核通过</Radio>
                      <Radio value={3} style={{ marginLeft: 20 }}>驳回审核</Radio>
                    </Radio.Group>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          { /* 驳回圆心 */ }
          <div style={{display: radioValue === 2 ? 'none': 'block', height: 240}} >
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout2} label="驳回原因">
                  {getFieldDecorator('checkerDesc', {
                    initialValue: '',
                    rules: [
                      {
                        required: radioValue !== 2,
                        message:'请输入驳回原因'
                      },
                    ],
                  })(
                    <div className={styles.TextInputBox}>
                      <TextArea
                        defaultValue=''
                        rows={11} placeholder="请输入至少五个字的描述"
                      />
                    </div>
                  )}
                </FormItem>
              </Col>
            </Row>

          </div>

          <div style={{display: radioValue === 2 ? 'block': 'none'}}>

            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="所属人群">
                  {getFieldDecorator('nominateThrongIdList', {
                    initialValue: [],
                    rules: [
                      {
                        required: false,
                        // required: isRecommondCheck && radioValue === 2,
                        message:'请选择所属人群'
                      },
                    ],
                  })(
                    <Select   mode="multiple" placeholder="请选择所属人群">
                      {
                        BaThrongListOption
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
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
                      <Radio.Group style={{ marginLeft: 25}} name="radiogroup"  onChange={this.onChangeRelease} defaultValue={ 0 }>
                        <Radio value={0} >暂不发布</Radio>
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
                {getFieldDecorator('热门推荐')(
                <div>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    defaultChecked = {false}
                    onChange={this.onCheckChange}
                  />
                </div>
                )}
              </FormItem>
            </Col>
          </Row>

          <div style={{display: isRecommondCheck ? 'block': 'none'}}>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout2} label="发布方式">
                {getFieldDecorator('nominateReleaseType', {
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
                      <Radio.Group style={{ marginLeft: 25}} name="radiogroup"  onChange={this.onHotChangeRelease} defaultValue={ 0 }>
                        <Radio value={0} >暂不发布</Radio>
                        <Radio value={1} >立即发布</Radio>
                        <Radio value={2} >预约发布</Radio>
                      </Radio.Group>
                    </div>
                    <div> <DatePicker onChange={ this.onHotReleaseTimeChange } /></div>
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
                        <Radio.Group style={{ marginLeft: 25}}name="radiogroup"  onChange={this.onHotChangeRadioCancle} defaultValue={ 1 }>
                          <Radio value={1} >无限期</Radio>
                          <Radio value={2} >
                            截止日期
                          </Radio>
                        </Radio.Group>
                      </div>
                      <div><DatePicker onChange={ this.onHotCancelTimeChange } /></div>
                    </div>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          </div>

        </div>

        </Form>
      </div>
    );
  }
}

export default  Form.create()(AuditCourse);
