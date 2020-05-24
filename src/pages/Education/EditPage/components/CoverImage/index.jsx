import React from 'react';
import {Form, Select, Radio, Input, Switch, Divider, Button, Row, Col, DatePicker} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import Avatar from "@/pages/infomation/EditinfomationPage/compont/Avatar";
import {FLAG_SEE} from "@/utils/utils";

const FormItem = Form.Item;
const { Option } = Select;


const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};


@connect(({ eduClassModule,user }) =>
  ({
    eduClassModule,
    currentUser: user.currentUser,
  }),
)

class CoverImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: 2,
      smallFileList: [], // 缩略图
      bigFlieList: [], // 大图
      bigBackFlieList: [], // 背景图
    };
  }

  componentDidMount() {
    this.props.onChlidCoverRef(this)
  }

  componentWillReceiveProps(nextProps) {
    let smallFileList =  [] // 缩略图
    let bigFlieList = [] // 大图
    let bigBackFlieList = [] // 背景图
    if(this.props.detialInfo!== nextProps.detialInfo){
      const { detialInfo } = nextProps
      if(detialInfo.imagetbUrl){
        smallFileList = this.getFileList(detialInfo.imagetbUrl)
      }
      if(detialInfo.imagebUrl){
        bigBackFlieList = this.getFileList(detialInfo.imagebUrl)
      }
      if(detialInfo.imageUrl){
        bigFlieList = this.getFileList(detialInfo.imageUrl)
      }
      this.setState({
        smallFileList , // 缩略图
        bigFlieList , // 大图
        bigBackFlieList , // 背景图
        radioValue: detialInfo.typeMode
      })
    }
  }

  /**
   * 保存
   */
  toSaveCoverAction  = () =>{
    console.log('toSaveCoverAction',this.state)
    const  { smallFileList, bigFlieList, bigBackFlieList } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
        }
        data.imagetbUrl = this.getUrl(smallFileList)
        data.imagebUrl = this.getUrl(bigBackFlieList)
        data.imageUrl = this.getUrl(bigFlieList)
        console.log('Received values of form: ', data);
        this.props.updateData(data,2);
        this.setCoverIamgeOfModel(this.getUrl(smallFileList)) // 更新model中的值
      }
    });

  }



  // 设置初始值
  getFileList = (url) =>{
    const fileList = []
    fileList.push({
      uid: 'imagetbUrl',
      name: 'image.png',
      status: 'done',
      url,
      response: {
        code: 200,
        data: url
      }
    })
    return fileList
  }

  /**
   * 更新model中的值
   * @param url 北京图片的url
   */
  setCoverIamgeOfModel = (url) => {
    const { dispatch} = this.props;
    dispatch({
      type: 'eduAddModule/updateCoverImage',
      payload: {
        data:url
      }
    })
  }

  /**
   * 上传图片回调
   * @param type
   * @param flieList
   */
  onFileListChanage = (type,flieList) =>{
    console.log('图片列表type flieList',type,flieList,this.getUrl(flieList))
    if(type==="small"){
      this.setState({ smallFileList: flieList })
    }else if(type==="big"){
      this.setState({ bigFlieList: flieList })
    }else{
      this.setState({ bigBackFlieList: flieList })
    }
  }

  getUrl = (arr) =>{
    if(arr.length === 0)
      return "";
    // eslint-disable-next-line no-nested-ternary
    return arr[0].response? arr[0].response.code === 200?arr[0].response.data:'':'';
  }

  render() {

    const { radioValue ,smallFileList, bigFlieList,bigBackFlieList} = this.state;
    const {form: { getFieldDecorator }, showType } = this.props;
    return (
      <div className={styles.main}>
        <Form>
          <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="封面样式">
                    {getFieldDecorator('typeMode', {
                      initialValue:radioValue || 2,
                      rules: [
                        {
                          required: true,
                        },

                      ],
                    })(<Radio.Group disabled={ showType === FLAG_SEE } name="radiogroup"  onChange={this.onChange} >
                        <Radio value={2}>小图模式</Radio>
                        <Radio value={1}>大图模式</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>

            </Col>

          </Row>

          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="小图">
                {getFieldDecorator('imagetbUrl', {
                  initialValue: this.getUrl(smallFileList) ,
                  rules: [
                    {
                      required: true,
                      message:'请上传缩略图'
                    },
                  ],
                })(
                  <Avatar  showRemoveIcon = { showType !== FLAG_SEE } limit ={1}  fileList={smallFileList} onFileListChanage={this.onFileListChanage} type="small"/>
                )}
              </FormItem>
            </Col>
            <Col span={12} >
              <FormItem {...formItemLayout} label="背景大图">
                {getFieldDecorator('imagebUrl', {
                  initialValue: this.getUrl(bigBackFlieList) ,
                  rules: [
                    {
                      required: true,
                      message:'请上传背景大图'
                    },
                  ],
                })(
                  <div className={ styles.backgroundImageBox }>
                    <Avatar showRemoveIcon = { showType !== FLAG_SEE } limit ={1}  fileList={bigBackFlieList} onFileListChanage={this.onFileListChanage} type="bigback"/>
                  </div>
                )}
              </FormItem>

            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="大图">
                {getFieldDecorator('imageUrl', {
                  initialValue: this.getUrl(bigFlieList) ,
                  rules: [
                    {
                      required: true,
                      message:'请上传大图'
                    },
                  ],
                })(
                  <div className={ styles.bigImageBox }>
                     <Avatar showRemoveIcon = { showType !== FLAG_SEE } limit ={1} fileList={bigFlieList} onFileListChanage={this.onFileListChanage} type="big"/>
                  </div>
                  )}
              </FormItem>
            </Col>
          </Row>

        </Form>
      </div>
    );
  }
}

export default  Form.create()(CoverImage);
