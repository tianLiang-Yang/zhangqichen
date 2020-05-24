import React from 'react';
import {Form, Input, Row, Col, Button, Divider, Modal, message, Select, Radio} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import {AppColor} from "@/utils/ColorCommom";
import {isEmpty} from "@/utils/utils";
import PlayerVideo from "@/pages/Education/EditPage/components/VideoShow/PlayerVideo";
import Edit from "@/pages/infomation/EditinfomationPage/compont/Edit";

const FormItem = Form.Item;

const  { TextArea }  = Input;

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6},
  wrapperCol: { span: 18},
};

const formItemLayout2 = {
  labelCol: { span: 2},
  wrapperCol: { span: 22},
};

@connect(({ eduAddModule,user }) =>
  ({
    eduAddModule,
    currentUser: user.currentUser,
    videoUrl:'',
  }),
)

// 添加子课程弹出框内容
class AddText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue:0,
      videoUrl: '',
      isPlayer: false,
      htmlText:'',
      mothed:1, // 视频上传方式 1 - 图文 2 - 图文链接
      iFrameHeight: 500,
      textUrl:'',
      iframeUrl:'', //
    };
  }
  componentDidMount() {
  }

  // 富文本编辑器变化监听
  onChanageEditHtmlListener = (htmlText) => {
    this.setState({ htmlText })
  }

  // 添加子课程
  toSave  = () =>{
    const { typeShow, current, dispatch} = this.props;
    const { mothed } = this.state;
    if(typeShow === 2){ // 从查看界面跳转过来
      this.props.addCourseListener(null)
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          resourceType:3,
          ...values,
          classId :this.props.id,
        }

        if(typeShow === 1 ) {
          // 修改页面过来
          data.courseId = current.courseId
        }
       // isAppend：是否是追加课程：0：否，1：是
        data.isAppend = this.props.isAppend
        console.log('this.props.isAppend',this.props.isAppend,this.props)
        const type = typeShow === 0 ? 'eduAddModule/classCourseInsert':'eduAddModule/tochildCourseUpdate';
        dispatch({
          type,
          payload:{
            data,
            cb:()=>{
              this.props.addCourseListener(mothed)
            }
          },
        });
      }
    });
  }

  // 单课程还是多课程
  onChange = e => {
    this.setState({
      radioValue: e.target.value,
    });
  };

  TextUrlInputListener = (e) => {
    this.setState({ textUrl: e.target.value })
  }

  render() {
    const { isPlayer, videoUrl, htmlText, radioValue, iframeUrl, textUrl } = this.state;
    const {form: { getFieldDecorator }, typeShow, current } = this.props;
    return (
      <div className={styles.main}>
        <Form>
          <div style={{display:typeShow !== 0 ?'none':'block'}}>
            <Row>
              <Col span={12}>
                <FormItem {...{  labelCol: { span: 4},
                  wrapperCol: { span: 19},
                }} label="添加方式">
                  {getFieldDecorator('添加方式', {
                    initialValue:0
                  })(
                    <Radio.Group name="radiogroup"  onChange={ this.onChange } >
                      <Radio value={0}>图文课程内容</Radio>
                      <Radio value={1}>外链图文课程内容</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="课程节次">
                {getFieldDecorator('seqno', {
                  initialValue: current ? current.seqno : '',
                  rules: [
                    {
                      required: true,
                      message:'请输入课程节次'
                    },
                  ],
                })(<Input disabled={ typeShow === 2 } type="number"  pattern='[0-9]'  placeholder="请输入课程课程节次(数字)"  />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="讲师">
                {getFieldDecorator('lecturer', {
                  initialValue: current ? current.lecturer : '',
                  rules: [
                    {
                      required: true,
                      message:'请输入讲师名称'
                    },
                  ],
                })(<Input disabled={ typeShow === 2 } rows={4} placeholder="请输入讲师名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout2} label="课程标题">
                {getFieldDecorator('courseName', {
                  initialValue: current ? current.courseName : '',
                  rules: [
                    {
                      required: true,
                      message:'请输入课程标题'
                    },
                  ],
                })(<Input disabled={ typeShow === 2 } placeholder="请输入课程标题" />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item label = "课程简介"
                         {...{
                           labelCol: { span: 2},
                           wrapperCol: { span: 20},
                         }}
              >
                {getFieldDecorator('courceInfo', {
                  initialValue:  current ? current.courceInfo : '',
                  rules: [
                    {
                      required:true,
                      message: '请输入至少五个字的描述',
                      min: 5,
                    },
                  ],
                })(
                  <div className={styles.TextInputBox}>
                    <TextArea
                      defaultValue={current ? current.courceInfo : ''}
                      disabled={ typeShow === 2 } rows={4} placeholder="请输入至少五个字的描述"
                    />
                  </div>)}
              </Form.Item>
            </Col>
          </Row>

          <Row  style={{ display: radioValue !== 0 ? 'block' : 'none' }}>
            <Col span={24}>
              <FormItem  {...{
                labelCol: { span: 2},
                wrapperCol: { span: 18},
              }} label="课程链接">
                {getFieldDecorator('courseUrl', {
                  initialValue: current ? current.courseUrl : '',
                  rules: [
                    {
                      required: radioValue === 1,
                      message:'请输入课程链接'
                    },
                  ],
                })(  <Row>
                  <Col span={18}>  <Input onChange={ this.TextUrlInputListener } placeholder="请输入课程链接" /></Col>
                  <Col span={4}>
                    <div
                      style={{color:AppColor.Green,marginLeft:10, cursor: 'pointer'}}
                      onClick={ () => {
                        if(isEmpty(this.state.textUrl)){
                          message.info("请先输入课程链接")
                          return
                        }
                        this.setState({ iframeUrl:textUrl })
                      }}
                    >
                      测试图文课程地址
                    </div>
                  </Col>
                </Row>)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ display: radioValue === 1 ? 'block' : 'none' }}>
            <Col span={24}>
              <Form.Item label = "图文预览"
                         {...{
                           labelCol: { span: 2},
                           wrapperCol: { span: 20},
                         }}
              >
                {getFieldDecorator('图文预览', {
                })(
                  <div className={styles.preBox}>
                    {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                    <iframe
                      style={{width:'100%', height:this.state.iFrameHeight}}
                      src={ iframeUrl }
                      width="100%"
                      height={this.state.iFrameHeight}
                      frameBorder="0"
                    />
                  </div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: radioValue === 0 ? 'block' : 'none' ,}}>
            <Col span={24}>
              <Form.Item label = "课程内容"
                         {...{
                           labelCol: { span: 2},
                           wrapperCol: { span: 20},
                         }}
              >
                {getFieldDecorator('courseContent', {
                  initialValue:  current ? current.courseContent : htmlText,
                  rules: [
                    {
                      required: radioValue === 0,
                      message: '请输入至少五个字的描述',
                      min: 5,
                    },
                  ],
                })(
                  <div  style={{ border: '1px #D9D9D9 solid' }}>
                    <Edit onChanageEditHtmlListener = { this.onChanageEditHtmlListener } />
                  </div>)}
              </Form.Item>
            </Col>
          </Row>
          <Divider/>
          <div className={styles.HCenter}>
            <div className={styles.HLayout}>
              <Button
                onClick={()=>this.toSave()}
                style={{width:100,marginLeft:20, display: Number(typeShow === 2) ? 'none': 'block'}}
                type="primary" shape="round" >确定</Button>
              <div className={styles.ButtonStyle}>
                <Button onClick={ () => this.props.cancleDialog() } style={{width:100,marginLeft:20}} shape="round" >取消</Button>
              </div>
            </div>
          </div>
        </Form>

        <Modal
          title="视频播放"
          visible={ isPlayer }
          onCancel={() => {
            this.setState({ isPlayer: false });
          }}
          destroyOnClose // 关闭时销毁 Modal 里的子元素
          maskClosable={false} // 点击遮照能不能关闭Modal
          footer={null} // 底部按钮
          width = { 740 }
          bodyStyle = {{ padding: '28px 24px' }}
          wrapClassName="report-modal-wrap"
        >
          <PlayerVideo videoUrl={ videoUrl }/>
        </Modal>

      </div>
    );
  }
}

export default  Form.create()(AddText);
