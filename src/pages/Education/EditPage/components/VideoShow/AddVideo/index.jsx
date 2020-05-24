import React from 'react';
import {Form, Input, Row, Col, Button, Divider, Modal, message, Select} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import NewVideoUpLoad from "@/pages/infomation/EditinfomationPage/compont/NewVideoUpLoad";
import {AppColor} from "@/utils/ColorCommom";
import {isEmpty} from "@/utils/utils";
import {VideoTypeList} from "@/utils/map/DictionaryUtil";
import PlayerVideo from "@/pages/Education/EditPage/components/VideoShow/PlayerVideo";

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
    isClickable: eduAddModule.isClickable
  }),
)

// 添加子课程弹出框内容
class AddVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: '',
      isPlayer: false,
      mothed:1, // 视频上传方式 1 - 视频 2 - 视频链接
      videoDuration: 0, // 视频时长(秒)
    };
  }

  // 添加子课程
  toSave  = () =>{
    const { typeShow, current, dispatch} = this.props;
    const { mothed, videoUrl } = this.state;
    if(typeShow === 2){ // 从查看界面跳转过来
      this.props.addCourseListener(null)
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          resourceType:1,
          ...values,
          classId :this.props.id,
        }

        if(typeShow === 1 ) {
          // 修改页面过来
          data.courseId = current.courseId
          data.courseUrl =  current.courseUrl;
        } else { // 添加页逻辑
          if(isEmpty(videoUrl)){
            message.error("视频没有上传完成")
            return ;
          }
          if(mothed === 1){
            data.courseUrl =  this.state.videoUrl
          }
        }
        // isAppend：是否是追加课程：0：否，1：是
        data.isAppend = this.props.isAppend
        data.duration = this.state.videoDuration
        if(!this.props.isClickable) return
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

  componentDidMount() {
  }

  /**
   *  视频上传回调地址
   * @param url（上传地址）
   * @param file 文件
   */
  onResult = (url,file) =>{
    this.setState({ videoUrl: url })
    this.getTimes(file)
  }

  getTimes = (content) => {
    console.log(content)
    // 获取录音时长
    const url = URL.createObjectURL(content);
    // 经测试，发现audio也可获取视频的时长
    const audioElement = new Audio(url);

    let duration = 0;
    audioElement.addEventListener("loadedmetadata",  (_event) =>{
      duration = audioElement.duration;
      // eslint-disable-next-line radix
      console.log('发现audio也可获取视频的时长',parseInt(duration));
      this.setState({  videoDuration: parseInt(duration) })
    });
  }

  VideoUrlInputListener = (e) => {
    this.setState({ videoUrl: e.target.value })
  }

  // 选择方式
  onChanageMothed = (value) => {
    this.setState({ mothed: Number(value) })
  }

  render() {
    const Myoptions = Object.keys(VideoTypeList).map((item) => <Option value={item}>{VideoTypeList[item]}</Option>)
    const { isPlayer, videoUrl, mothed, videoDuration } = this.state;
    console.log('videoDuration',videoDuration)
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
                    initialValue:`${this.state.mothed}` ,
                  })(
                    <Select onChange={ this.onChanageMothed } >
                      {
                        Myoptions
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout2} label= { mothed !== 1 ?"视频链接":""}>
                  {getFieldDecorator('courseUrl', {
                    // initialValue: this.state.videoUrl,
                    rules: [
                      {
                        required: typeShow !== 1,
                        message:'请输入视频链接'
                      },
                    ],
                    initialValue: typeShow ===1 ? current.courseUrl:this.state.videoUrl,
                  })(
                    <div>
                      {
                        mothed !== 1
                          ?
                          <Row>
                            <Col span={18}>  <Input onChange={  this.VideoUrlInputListener} placeholder="请输入视频链接" /></Col>
                           <Col span={4}>
                             <div
                               style={{ color: AppColor.Green, marginLeft: 10, cursor: 'pointer' }}
                               onClick={ () => {
                                 if(isEmpty(this.state.videoUrl)){
                                   message.info("请先输入视频地址链接")
                                   return
                                 }
                                 this.setState({ isPlayer:true })
                               }}
                             >
                               测试视频地址
                             </div>
                           </Col>
                          </Row>

                        :
                        <div>
                           <NewVideoUpLoad onResult = { this.onResult }/>
                        </div>
                      }
                    </div>

                    )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="课程节次">
                {getFieldDecorator('seqno', {
                  initialValue: current ? `${current.seqno}` : '',
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
              <FormItem {...formItemLayout} label="课程长度">
                {getFieldDecorator('duration', {
                  // eslint-disable-next-line no-nested-ternary
                  initialValue: current ? `${current.duration}` : videoDuration === 0 ? '' : `${(videoDuration/60).toFixed(2)}分`,
                  rules: [
                    {
                      max:20,
                      required: true,
                      message:'请输入课程长度'
                    },
                  ],
                })(<Input
                   readonly="readonly"
                    value = { current ? `${current.duration}` : videoDuration === 0 ? '' : `${(videoDuration/60).toFixed(2)}分分钟}`}
                    disabled={ typeShow === 2 }
                     />)}
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
              <Form.Item label = "视频简介"
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
                      disabled={ typeShow === 2 } rows={11} placeholder="请输入至少五个字的描述"
                    />
                  </div>)}
              </Form.Item>
            </Col>
          </Row>
          <Divider/>
          <div className={styles.HCenter} >
            <div className={styles.HLayout}>
              <Button
                onClick={()=>this.toSave()}
                style={{width:100,marginLeft:20, display: Number(typeShow === 2) ? 'none': 'block'}}
                type="primary"
                shape="round"
              >
                确定
              </Button>
              <div className={styles.ButtonStyle}>
                <Button onClick={ () => this.props.cancleDialog() }style={{width:100,marginLeft:20}} shape="round" >取消</Button>
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

export default  Form.create()(AddVideo);
