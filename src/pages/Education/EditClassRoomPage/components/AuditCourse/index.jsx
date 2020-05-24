import React from 'react';
import {Form, Select, Radio, Switch, Row, Col, DatePicker, message, Input} from 'antd';
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
      cancleValue: 1, // 取消
      releaseTime: undefined,
      cancelTime: undefined,
    };
  }

  componentDidMount() {
    this.props.onChlidRef(this)
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/getBaThrongList',
      payload:{},
      htmlText:''
    });
  }

  // 审核状态
  onAuditChange = (e) =>{
    this.setState({ radioValue: Number(e.target.value) })
  }

  // 发布方式
  onChangeRelease = (e) => {
    this.setState({ releaseType: e.target.value })
  }

  // 发布时间
  onReleaseTimeChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({ releaseTime: dateString })
  }

  // 提交审核
  auditCourseHttp = (id) => {
    if(!this.props.isClickable) return
    const { dispatch } = this.props;
    const { radioValue, releaseTime , cancleValue, cancelTime} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          ...values,
          releaseTime,
          cancelTime: Number(cancleValue) === 1 ? '' :cancelTime ,
        }
        if(radioValue !== 2){ // 驳回审核的时候
          const { checkerDesc } = values;
          data = {
            status:3,
            checkerDesc
          }
        }
        data.courseId = id;
        console.log("审核===",data)
        dispatch({
          type:'eduAddModule/ClassCourseCheck',
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

    const { radioValue , releaseType} = this.state;
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
        </div>

        </Form>
      </div>
    );
  }
}

export default  Form.create()(AuditCourse);
