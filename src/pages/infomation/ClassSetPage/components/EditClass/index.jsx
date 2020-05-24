import React from 'react';
import {Form, Select, Radio,  Input, Switch, Divider, Button,} from 'antd';
import styles from './index.less';
import Avatar from "@/pages/infomation/EditinfomationPage/compont/Avatar";

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 3},
  wrapperCol: { span: 20},
};

const formItemLayout2 = {
  labelCol: { span: 7},
  wrapperCol: { span: 17},
};

const formItemLayout3 = {
  labelCol: { span: 2},
  wrapperCol: { span: 10},
};

class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smallFileList:[], // 缩略图
      bigFlieList:[], // 大图
      radioValue: 1,
      isOpen:false,
    };
  }

  onSwitchOpenChange = (checked) => {
    console.log(`switch to ${checked}`);
    this.setState({ isOpen: checked })
  }

  onFileListChanage = (type,flieList) =>{
    console.log('图片列表type flieList',type,flieList)
    if(type==="small"){
      this.setState({ smallFileList: flieList })
    }else{
      this.setState({ bigFlieList: flieList })
    }
  }

  // 保存
  submit = () => {
    const { smallFileList, bigFlieList, radioValue, isOpen } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });

  }

  // 模式
  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      radioValue: e.target.value,
    });
  };


  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
        <div className={styles.main}>
          <Form>
            <FormItem {...formItemLayout}  label="资讯名称">
              {getFieldDecorator('资讯名称', {
                rules: [
                  {
                    required: true,
                    min: 1,
                  },
                ],
              })(<Input rows={4} placeholder = "资讯名称不能为空" />)}
            </FormItem>
          <div className={styles.HLayout}>
            <div className={styles.childHalf}>
              <Form.Item  {...formItemLayout2}  label="资讯分类属性" >
                {getFieldDecorator('资讯分类属性', {
                  rules: [
                    {
                      required: true,
                      message: '请选择资讯分类属性',
                    },
                  ],
                  initialValue: "jack",
                })(
                  <Select  placeholder="请选择资讯分类属性" >
                    <Option value="jack">Jack (100)</Option>
                    <Option value="lucy">Lucy (101)</Option>
                  </Select>)}
              </Form.Item>
            </div>
            <div style={{paddingLeft:10}} className={styles.childHalf}>
              <Form.Item   {...formItemLayout2}  label="上级资讯分类" >
                {getFieldDecorator('上级资讯分类', {
                  rules: [
                    {
                      required: true,
                      message: '请选择上级资讯分类',
                    },
                  ],
                  initialValue: "jack",
                })(
                  <Select  placeholder="请选择上级资讯分类" >
                    <Option value="jack">Jack (100)</Option>
                    <Option value="lucy">Lucy (101)</Option>
                  </Select>)}
              </Form.Item>
            </div>
          </div>
            <div className={styles.HLayout}>
              <div  className={styles.ImageHint}>缩略图：</div>
              <div style={{width:'90%'}}>
                <Avatar onFileListChanage={this.onFileListChanage} type="small"/>
                <div>80*80</div>
              </div>
            </div>
            <div className={styles.HLayout}>
              <div className={styles.ImageHint}>大图：</div>
              <div style={{width:'90%'}}>
                <Avatar onFileListChanage={this.onFileListChanage} type="big"/>
                <div >360*120</div>
              </div>
            </div>
            <div style={{marginTop:26,marginBottom:10}} className={styles.HLayout}>
              <div>资讯模式:</div>
              <div style={{marginLeft:15}}>
                <Radio.Group name="radiogroup"  onChange={this.onChange} defaultValue={ this.state.radioValue }>
                  <Radio value={1}>小图</Radio>
                  <Radio value={2}>大图</Radio>
                  <Radio value={3}>多图</Radio>
                </Radio.Group>
              </div>
            </div>
            <FormItem {...formItemLayout3}  label="权重">
              {getFieldDecorator('权重', {
                rules: [
                  {
                    required: true,
                    min: 1,
                  },
                ],
              })(<Input rows={4} placeholder = "输入权重" />)}
            </FormItem>
            <div className={styles.HLayout}>
              <div className={styles.childHalf}>创建时间：2018-09-18</div>
              <div className={styles.childHalf}>更新时间：2018-09-18</div>
            </div>
            <div className={styles.HLayout}>
              <div>是否开启:</div>
              <div style={{paddingLeft:10}}>
                <Switch checked={this.state.isOpen} onChange={this.onSwitchOpenChange} />
              </div>
            </div>
            <Divider/>
            <div className={styles.HCenter}>
              <div className={styles.HLayout}>
                <Button onClick={()=>this.submit()} style={{width:100,marginLeft:20}} type="primary" shape="round" >确定</Button>
                <div className={styles.ButtonStyle}>
                  <Button style={{width:100,marginLeft:20}} shape="round" >取消</Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
    );
  }
}

export default  Form.create()(EditClass);
