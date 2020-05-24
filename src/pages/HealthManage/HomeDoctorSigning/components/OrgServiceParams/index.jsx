import React from 'react';
import {Form, Input, Row, Col, message, Divider, Button, Select, Switch } from 'antd';
import styles from './index.less';
import {connect} from "dva";
import UtilsStyle from '@/utils/utils.less'
import {handleEmptyStr, isEmpty} from "@/utils/utils";
import Avatar from "@/pages/infomation/EditinfomationPage/compont/Avatar";
import {SERVICE_PACK_PHOTO} from "@/utils/Constant";
import {getOrgData, setOrgData} from "@/utils/sessionUtil";
import {servicePropertyList, validUnitList} from "@/utils/map/DictionaryUtil";

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span:4},
  wrapperCol: { span: 20},
};
const formItemLayout2 = {
  labelCol: { span: 12},
  wrapperCol: { span: 12},
};

@connect(({ healthHomeDoctorModule }) =>
  ({
    orgServiceInfo: healthHomeDoctorModule.orgServiceInfo
  }),
)

class OrgServiceParams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exist: 0, // 0 - 不存在 1 - 存在改数据
      checked: false,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.getDetial()
  }

  getDetial = () => {
    const { dispatch } = this.props;
    const orgData = getOrgData();
    if(!orgData)  return
    dispatch({
      type: 'healthHomeDoctorModule/getOrgSerInfo',
      payload:{
        data:{
          orgId : orgData.orgId ,
        },
        cb:(exist)=>{
          this.setState({ exist, checked :exist === 1   })
        }
      },
    });
  }

  cancle = () => {
  }

  submit  = () =>{
    const orgData = getOrgData();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          orgId: orgData.orgId,
          isRelease: values.isSwitchRelease ? 1 : 0,
        }
       this.props.onOrgerviceParamsDestory(true,this.state.exist,data)
      }
    });
  }

  onChange = (checked) => {
    this.setState({ checked })
  }

  render() {
    const orgData = getOrgData();
    const { form: { getFieldDecorator }} = this.props;
    const Myoptions = Object.keys(validUnitList).map((item) => <Option value={item}>{validUnitList[item]}</Option>)
    const detial = this.props.orgServiceInfo;
    return (
      <div className={`${styles.main} ${UtilsStyle.selectAndInpitLineStyle}`}>
        <Form>
          <Row>
            <Col span={24}>
              <Form.Item label = "服务名称" { ...formItemLayout } >
                {getFieldDecorator('osPackName', {
                  rules: [
                    {
                    },
                  ],
                  initialValue: '家医签约服务',
                })(<span>家医签约服务</span>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label = "服务机构" { ...formItemLayout } >
                {getFieldDecorator('osPackName', {
                  rules: [
                    {
                    },
                  ],
                  initialValue: '家医签约服务',
                })(<span>{ orgData ? orgData.orgName : '' }</span>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout2} label="服务期限">
                {getFieldDecorator('validCount', {
                  rules: [
                    {
                      required: true,
                      message: '请输入服务期限',
                    },
                  ],
                  initialValue: detial ? detial.validCount : ''
                })(<Input
                     type = 'number'
                     min={0}
                   />)}
              </FormItem>
            </Col>
            <Col span={8} style={{marginLeft:10}}>
              <FormItem {...{
                    labelCol: { span: 9},
                    wrapperCol: { span: 7},
              }}>
                {getFieldDecorator('validUnit', {
                  rules: [
                    {
                    },
                  ],
                  initialValue: detial ? `${ isEmpty(detial.validUnit) ? '4': detial.validUnit }` : '4'
                })(
                  <Select>
                    {
                      Myoptions
                    }
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label = "创建时间" { ...formItemLayout } >
                {getFieldDecorator('create', {
                  rules: [
                    {
                    },
                  ],
                })(<span>{ detial ? detial.ctstamp : '' }</span>)}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Form.Item label = "开启家医服务" { ...formItemLayout } >
                {getFieldDecorator('isSwitchRelease', {
                  initialValue: detial ? detial.exist === 1&& detial.isRelease === 1 : false
                })(<Switch checked= { this.state.checked } onChange={ this.onChange }  />)}
              </Form.Item>
            </Col>
          </Row>

          <Divider/>
          <div className={styles.BotttomLayout}>
            <div>
              <Button onClick={() => this.submit()} style={{width: 100, marginLeft: 20}} type="primary"
                      shape="round">确定</Button>
              <div>
                <Button onClick={() => this.cancle()} style={{width: 100, marginLeft: 20}} shape="round">取消</Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default  Form.create()(OrgServiceParams);
