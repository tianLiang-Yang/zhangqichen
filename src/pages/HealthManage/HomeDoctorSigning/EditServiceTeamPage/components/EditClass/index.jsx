import React from 'react';
import { Form, Input, Row, Col, message } from 'antd';
import styles from './index.less';
import {connect} from "dva";
import {handleEmptyStr, isEmpty} from "@/utils/utils";
import Avatar from "@/pages/infomation/EditinfomationPage/compont/Avatar";
import {BaseUrl, SERVICE_TEAM_PHOTO} from "@/utils/Constant";
import {getOrgData} from "@/utils/sessionUtil";
import request from "@/utils/request";


const formItemLayout = {
  labelCol: { span: 3},
  wrapperCol: { span: 21},
};

@connect(({ healthHomeDoctorModule }) =>
  ({
    healthHomeDoctorModule
  }),
)

class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smallFileList:[],
      detial: null,
    };
  }



  componentWillMount() {
    this.props.onChlidBaseRef(this)
    this.getDetial()
  }

  getDetial =  () => {
    const { orgTeamId } = this.props
    if(isEmpty(orgTeamId)){
      return
    }
    request.get(`${BaseUrl}/fdsserve/manage/team/info`, {
      params: {
        orgTeamId
      }
    })
      .then( (response) => {
        try{
          if(Number(response.code) === 200){
            const smallFileList = []
            if(response.data){
              smallFileList.push({
                uid: response.data.orgTeamId,
                name: 'image.png',
                status: 'done',
                url: response.data.imageUrl,
                response: {
                  code: 200,
                  data:response.imageUrl
                }
              })
            }
            this.setState({ detial: response.data, smallFileList })
          }
        }catch (e) {
          console.log('资讯管理',e)
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  toSaveAction  = () =>{
    const { smallFileList } = this.state;
    if( smallFileList.length === 0 ){
      message.error('请上传封面图')
      return
    }
    const orgData = getOrgData();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          orgId: orgData.orgId,
          imageUrl: this.getUrl(smallFileList),
        }
          this.props.savaBaseInfo(data);
      }
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
    }
  }


  render() {
    const { smallFileList, detial } = this.state;
    console.log('response',detial);
    const { form: { getFieldDecorator }} = this.props;
    return (
      <div className={styles.main}>
        <Form>
          <Row>
            <Col span={24}>
              <Form.Item label = "团队名称" { ...formItemLayout } >
                {getFieldDecorator('orgTeamName', {
                  rules: [
                    {
                      required: true,
                      message:'请输入团队名称'
                    },
                  ],
                  initialValue: detial ? handleEmptyStr(detial.orgTeamName) : '',
                })(<Input  placeholder="请输入团队名称" />)}
              </Form.Item>
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
                          url = { SERVICE_TEAM_PHOTO }
                          fileList={ smallFileList }
                          onFileListChanage={ this.onFileListChanage }
                          type="small"/>
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
