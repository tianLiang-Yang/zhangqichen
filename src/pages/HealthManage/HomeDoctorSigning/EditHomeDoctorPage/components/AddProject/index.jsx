import React from 'react';
import {Form, Select, Input, Row, Col, message, Divider, Button} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import {FLAG_ADD, FLAG_SEE, handleEmptyStr} from "@/utils/utils";
import Avatar from "@/pages/infomation/EditinfomationPage/compont/Avatar";
import {servicePropertyList} from "@/utils/map/DictionaryUtil";
import {SERVICE_PACK_PHOTO} from "@/utils/Constant";
import {getHealthPre} from "@/pages/Prescription/HealthPreForm/service";

const FormItem = Form.Item;
const { Option } = Select;

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
    isClickable: healthHomeDoctorModule.isClickable,
    healthHomeDoctorModule,
  }),
)

class AddProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smallFileList: [],
      bigFileList: [],
    };
  }

  componentDidMount() {
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
      this.setState({ bigFileList: flieList })
    }
  }

  submit = () => {
    if(!this.props.isClickable) return;
    const { smallFileList, bigFileList } = this.state;
    if(smallFileList.length === 0 || bigFileList.length === 0 ){
      message.error('请上传服务缩略图或者大图')
      return
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          osPackId:  this.props.id,
          imageurl: this.getUrl(bigFileList),
          imagetbUrl: this.getUrl(smallFileList),
        }
        console.log('Received values of form: ', data);
        this.props.onServicePackResult(true, data)
      }
    });
  }

  cancle = () => {
    this.props.onServicePackDestory(false)
  }


  render() {
    const { smallFileList, bigFileList } = this.state;
    const { form: { getFieldDecorator }} = this.props;
    const Myoptions = Object.keys(servicePropertyList).map((item) => <Option value={item}>{servicePropertyList[item]}</Option>)
    const detial = null;
    return (
      <div className={styles.main}>
        <Form>
          <Row>
            <Col span={24}>
              <Form.Item label = "项目名称" { ...formItemLayout } >
                {getFieldDecorator('osProjectName', {
                  rules: [
                    {
                      required: true,
                      message:'请输入项目名称'
                    },
                  ],
                  initialValue: detial ? handleEmptyStr(detial.osProjectName) : '',
                })(<Input  placeholder="请输入项目名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label = "项目属性" { ...formItemLayout } >
                {getFieldDecorator('serviceProperty', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                  initialValue: detial ? handleEmptyStr(detial.osProjectName) : '',
                })(
                  <Select >
                    {
                      Myoptions
                    }
                  </Select>)
                }
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.moreRowInput}>
            <Row>
              <Col span={24}>
                <Form.Item label = "项目描述" { ...formItemLayout }>
                  {getFieldDecorator('osProjectDesc', {
                    rules: [
                      {
                        required: true,
                        message: '请输入至少五个字的描述',
                        min: 5,
                      },
                    ],
                    initialValue: detial ? handleEmptyStr(detial.osProjectDesc) : '',
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
                  initialValue: detial ? detial.unitPrice : ''
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
                  initialValue: detial ? detial.preferPrice : ''
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
                  initialValue: detial ? detial.trulyPrice : ''
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
                        缩略图：
                      </div>
                    </div>
                    <div className={ styles.LeftBottomBox }>
                      （160*160）
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <Avatar
                    url = { SERVICE_PACK_PHOTO }
                    limit ={1}
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
                        背景图：
                      </div>
                    </div>
                    <div className={ styles.LeftBottomBox }>
                      （160*160）
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <Avatar
                    url = { SERVICE_PACK_PHOTO }
                    limit ={1}
                    fileList={ bigFileList }
                    onFileListChanage={ this.onFileListChanage }
                    type="big"/>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider/>
          <div className={styles.BotttomLayout}>
            <div>
              <Button onClick={() => this.submit()} style={{width: 100, marginLeft: 20}} type="primary"
                      shape="round">确定</Button>
              <div>
                <Button   onClick={() => this.cancle()} style={{width: 100, marginLeft: 20}} shape="round">取消</Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default  Form.create()(AddProject);
