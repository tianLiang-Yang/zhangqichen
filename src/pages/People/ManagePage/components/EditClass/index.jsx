import React from 'react';
import {Form, Select, Input, Switch, Divider, Button, Row, Col } from 'antd';
import styles from './index.less';
import { CourseAttrs } from '@/utils/map/DictionaryUtil'
import {connect} from "dva";
import { isEmpty, handleEmptyStr, FLAG_ADD, FLAG_EDIT, FLAG_SEE } from "@/utils/utils";

const FormItem = Form.Item;
const { Option } = Select;


const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};

const formItemLayout2 = {
  labelCol: { span: 8},
  wrapperCol: { span: 16},
};

const leftSpan = 4;
const rightSpan = 20;

@connect(({ eduClassModule , user }) =>
  ({
    eduClassModule,
    currentUser: user.currentUser,
  }),
)

class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  componentDidMount() {
    const { dispatch , id } = this.props;
    // this.submit();
    const { flag } = this.props;
    if(flag!== FLAG_ADD){
      // dispatch({
      //   type: 'eduClassModule/queryDetial',
      //   payload: {
      //     data: {
      //     classTypeId: id,
      //     },
      //     cb:this.callbackDetial,
      //   },
      // });
    }
  }

  callbackDetial = ()=>{
    const { detialData = {} } = this.props.eduClassModule;
    this.setState({
      isOpen: detialData.isRelease === 1,
    })
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  /**
   * 获取上级资讯分类
   */
  getAllList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eduClassModule/getAllClassList',
      payload: {},
    });
  }

  // 提交保存
  submit = () => {
    const { dispatch,flag } = this.props;
    const { smallFileList, bigFlieList, isOpen } = this.state;
    console.log('bigFlieList',bigFlieList,smallFileList)
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          isRelease:isOpen?1:0,
        }
        console.log('Received values of form: ', data);

        dispatch({
          type: flag!== 1004? 'eduClassModule/updateData': 'eduClassModule/fetchAddClass',
          payload:{
            data,
            cb: this.confirmCallBack,
          },
        });
      }
    });

  }

  // 添加成功回调
  confirmCallBack = () =>{
    this.props.onResult()
  }


  render() {
    const { flag } = this.props;
     const detialData = null;
    const {form: { getFieldDecorator }} = this.props;
    const CourseAttrsOption = Object.keys(CourseAttrs).map((item) => <Option value={item}>{CourseAttrs[item]}</Option>)
    // const classOptioon = allList.map((item )=> <Option value="jack">{ item.classTypeName  }</Option>)
    return (
      <div className={styles.main}>

        <Form>
          <FormItem {...formItemLayout} label="人群分类名称">
            {getFieldDecorator('人群分类名称', {
              initialValue:detialData ?  handleEmptyStr(detialData.人群分类名称) : '',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input rows={4} placeholder="人群分类名称不能为空" />)}
          </FormItem>
          <Row>
            <Col span={24}>
              <Form.Item  { ...formItemLayout } label="上级资讯分类">
                {getFieldDecorator('上级资讯分类', {
                  initialValue: detialData ?  `${detialData.上级资讯分类}` : '',
                })(
                  <Select placeholder="上级资讯分类">
                    {
                      CourseAttrsOption
                    }
                  </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="权重：">
                {getFieldDecorator('weight', {  initialValue: detialData ? handleEmptyStr(detialData.weight) : '' ,})(<Input rows={4} placeholder="输入权重"/>)}
              </FormItem>
            </Col>
            <Col span={12}/>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="是否发布：">
                {
                  getFieldDecorator('weight',
                    {
                      initialValue: true
                    })( <Switch
                           checkedChildren="是"
                           unCheckedChildren="否"
                           defaultChecked
                         />
                      )}
              </FormItem>
            </Col>
          </Row>

          <Row  style={{display : flag === FLAG_SEE ? 'block' : 'none'}}>
            <Col span={24}>
              <FormItem {...formItemLayout} label="创建时间：">
                {
                  getFieldDecorator('weight',
                    {
                      initialValue: true
                    })(<div> 2018-09-18 </div>)}
              </FormItem>
            </Col>
          </Row>

          <div style={{display : flag === FLAG_SEE ? 'none' : 'block'}}>
            <Divider/>
            <div className={styles.HCenter}>
              <div className={styles.HLayout}>
                <Button onClick={() => this.submit()} style={{width: 100, marginLeft: 20}} type="primary"
                        shape="round">确定</Button>
                <div className={styles.ButtonStyle}>
                  <Button style={{width: 100, marginLeft: 20}} shape="round">取消</Button>
                </div>
              </div>
            </div>
          </div>

        </Form>
      </div>
    );
  }
}

export default  Form.create()(EditClass);
