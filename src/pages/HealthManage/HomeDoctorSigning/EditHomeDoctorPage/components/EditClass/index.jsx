import React from 'react';
import { Form, Input, Row, Col, message } from 'antd';
import styles from './index.less';
import {connect} from "dva";
import {handleEmptyStr, isEmpty} from "@/utils/utils";
import Avatar from "@/pages/infomation/EditinfomationPage/compont/Avatar";
import {SERVICE_PACK_PHOTO} from "@/utils/Constant";
import {getOrgData} from "@/utils/sessionUtil";

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 3},
  wrapperCol: { span: 21},
};
const formItemLayout2 = {
  labelCol: { span: 9},
  wrapperCol: { span: 15},
};


const { TextArea } = Input;

@connect(({ healthHomeDoctorModule }) =>
  ({
    healthHomeDoctorModule,
    ServePackInfo: healthHomeDoctorModule.ServePackInfo,
  }),
)

class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smallFileList:[],
      bigBackFlieList:[],
    };
  }

  componentWillMount() {
    this.props.onChlidBaseRef(this)
    if(isEmpty(this.props.id)) return
    this.getDetialInfo()
  }

  componentDidMount() {
  }

  toSaveAction  = () =>{
    const { smallFileList, bigBackFlieList} = this.state;
    if(bigBackFlieList.length === 0 || smallFileList.length === 0 ){
      message.error('请上传封面图或者背景图')
      return
    }
    const orgData = getOrgData();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          orgId: orgData.orgId,
          imageurl: this.getUrl(bigBackFlieList),
          imagetbUrl: this.getUrl(smallFileList),
        }
        if(this.props.id === ''){
          this.props.savaBaseInfo(data);
        }else{
          this.props.updateData(data,1)
        }
      }
    });

  }

  // 获取详情
  getDetialInfo = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'healthHomeDoctorModule/getManageServePackInfo',
      payload:{
        osPackId: this.props.id,
        cb: (data) => {
          if(isEmpty(this.props.id)) data = null
          const smallFileList = []
          const bigBackFlieList = []
          if(data){
            smallFileList.push({
              uid: data.imagetbUrl,
              name: 'imageTUrl.png',
              status: 'done',
              url: data.imagetbUrl,
              response: {
                code: 200,
                data:data.imagetbUrl
              }
            })
            bigBackFlieList.push({
              uid: data.imageurl,
              name: 'imageUrl.png',
              status: 'done',
              url: data.imageurl,
              response: {
                code: 200,
                data:data.imageurl
              }
            })
          }
          this.setState({ smallFileList, bigBackFlieList})
        }
      },
    });
  }

  getUrl = (arr) =>{
    if(arr.length === 0)
      return "";
    // eslint-disable-next-line no-nested-ternary
    return arr[0].response? arr[0].response.code === 200?arr[0].response.data:'':'';
  }

  // 图片选择
  onFileListChanage = (type,flieList) =>{
    if(type==="small"){
      this.setState({ smallFileList: flieList })
    }else{
      this.setState({ bigBackFlieList: flieList })
    }
  }


  render() {
    const { smallFileList, bigBackFlieList } = this.state;
    // eslint-disable-next-line prefer-const
    let { form: { getFieldDecorator }, ServePackInfo = null } = this.props;
    return (
      <div className={styles.main}>
        <Form>
          <Row>
            <Col span={24}>
              <Form.Item label = "服务包名称" { ...formItemLayout } >
                {getFieldDecorator('osPackName', {
                  rules: [
                    {
                      required: true,
                      message:'请输入服务包名称'
                    },
                  ],
                  initialValue: ServePackInfo ? handleEmptyStr(ServePackInfo.osPackName) : '',
                })(<Input  placeholder="请输入服务包名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.moreRowInput}>
            <Row>
              <Col span={24}>
                <Form.Item label = "服务包描述" { ...formItemLayout }>
                  {getFieldDecorator('osPackDesc', {
                    rules: [
                      {
                        required: true,
                        message: '请输入至少五个字的描述',
                        min: 5,
                      },
                    ],
                    initialValue: ServePackInfo ? handleEmptyStr(ServePackInfo.osPackDesc) : '',
                  })(<TextArea rows={4} placeholder="请输入至少五个字的描述" />)}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout2} label="市场价格">
                {getFieldDecorator('unitPrice', {
                  rules: [
                    {
                      required: true,
                      message: '请输入市场价格',
                    },
                  ],
                  initialValue: ServePackInfo ? ServePackInfo.unitPrice : ''
                })(<Input
                     type = 'number'
                     min={0}
                     placeholder="请输入市场价格" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout2} label="优惠金额">
                {getFieldDecorator('preferPrice', {
                  rules: [
                    {
                      required: true,
                      message: '请输入优惠金额'
                    },
                  ],
                  initialValue: ServePackInfo ? ServePackInfo.preferPrice : ''
                })(<Input
                     type = 'number'
                     min={0}
                     placeholder="请输入优惠金额"  />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout2} label="优惠后金额">
                {getFieldDecorator('trulyPrice', {
                  rules: [
                    {
                      required: true,
                      message: '请输入优惠后金额'
                    },
                  ],
                  initialValue: ServePackInfo ? ServePackInfo.trulyPrice : ''
                })(
                  <Input
                    type = 'number'
                    min={0}
                    placeholder="请输入优惠后金额"
                    />
                    )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Row span={24}>
                <Col span={9}>
                  <div>
                    <div className={ styles.LeftBox }>
                      <div>
                        上传封面小图照片：
                      </div>
                    </div>
                    <div className={ styles.LeftBottomBox }>
                      （160*160）
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <Avatar limit ={1}
                          url = { SERVICE_PACK_PHOTO }
                          fileList={ smallFileList }
                          onFileListChanage={ this.onFileListChanage }
                          type="small"/>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row span={24}>
                <Col span={9}>
                  <div>
                    <div className={ styles.LeftBox }>
                      <div>
                        上传背景大图照片：
                      </div>
                    </div>
                    <div className={ styles.LeftBottomBox }>
                      （750*250）
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={styles.backgroundImageBox}>
                  <Avatar limit ={1}
                          fileList={ bigBackFlieList }
                          url = { SERVICE_PACK_PHOTO }
                          onFileListChanage={ this.onFileListChanage }
                          type="bigback"/>
                  </div>
                </Col>
              </Row>
            </Col>

          </Row>
        </Form>
      </div>
    );
  }
}

export default  Form.create()(EditClass);
