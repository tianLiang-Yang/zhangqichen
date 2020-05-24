import React from 'react';
import {Form, Radio, Button, Modal, message} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import AddVideo from "@/pages/Education/EditPage/components/VideoShow/AddVideo";
import AddText from "@/pages/Education/EditPage/components/VideoShow/AddText";

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 2},
  wrapperCol: { span: 20},
};

@connect(({ eduClassModule, user, eduManageModule }) =>
  ({
    eduManageModule,
    eduClassModule,
    currentUser: user.currentUser,
  }),
)

class UpVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: 0,
      visiableVideoAdd: false,
      visiableTextAdd:false,
    };
  }

  componentDidMount() {
  }

  // 显示添加视频界面
  handOpenModal = () =>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
        }
        this.props.updateData(data,3);
      }
    });
    const { resourceType } = this.props.eduManageModule
    if(resourceType === 1){
      this.setState({ visiableVideoAdd: true })
    }else{
      this.setState({ visiableTextAdd: true })
    }
  }

  // 单课程还是多课程
  onChange = e => {
    this.setState({
      radioValue: e.target.value,
    });
    // 更改课程类型
     this.props.updateData({isMultiCourse: e.target.value },3)
    this.props.onChangeMultiTypelistener(e.target.value)
  };

  // 添加子课程成功回调
  addCourseListener = (type) => {
    const { resourceType } = this.props.eduManageModule
    if(resourceType === 1){
      this.setState({ visiableVideoAdd: false })
    }else{
      this.setState({ visiableTextAdd: false })
    }
    this.props.addCourseListener(type);
  }


  render() {

    const { radioValue, visiableVideoAdd, visiableTextAdd } = this.state;
    const { resourceType } = this.props.eduManageModule
    const { form: { getFieldDecorator } , id } = this.props;
    return (
      <div className={styles.main}>

        <Form>
          <div className={styles.AddBox}>
            <div className={styles.innerBox} >
              <div className={styles.CenterBox}>
                <div>您还没有添加课程，请点击下方按钮立即添加~</div>
              </div>
              <div style={{ display: this.props.isAppend === 1 ? 'none': 'block'}}>
                <FormItem {...formItemLayout} label="">
                  {getFieldDecorator('is_multi_course', {
                    initialValue:radioValue,
                    rules: [
                      {
                        required: true,
                      },

                    ],
                  })(
                    <Radio.Group name="radiogroup"  onChange={ this.onChange } defaultValue={ radioValue }>
                      <Radio value={0}>单课程</Radio>
                      <Radio value={1}>组合课程(多个子课程组合)</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </div>
              <div className={styles.CenterBox}>
                <Button type="primary" shape="round" onClick={ this.handOpenModal }>
                  {
                    resourceType === 1 ? '上传视频' : '上传图文'
                   }
                </Button>
              </div>
            </div>

          </div>
        </Form>

        <Modal
          title="新增子课堂"
          visible={ visiableVideoAdd }
          onCancel={() => {
            this.setState({ visiableVideoAdd: false });
          }}
          destroyOnClose // 关闭时销毁 Modal 里的子元素
          maskClosable={false} // 点击遮照能不能关闭Modal
          footer={null} // 底部按钮
          width="60vw"
          style={{
            top: 20,
            bottom: 20,
          }}
          bodyStyle={{ overflow: 'scroll', height: '85vh' }}
          wrapClassName="report-modal-wrap"
        >
          <AddVideo
            isAppend = { this.props.isAppend }
            id = { id }
            typeShow = { 0 } // 添加 -0
            addCourseListener = { this.addCourseListener }
          />
        </Modal>

        <Modal
          title="编辑子课堂"
          visible={ visiableTextAdd }
          onCancel={() => {
            this.setState({ visiableTextAdd: false , typeShow: 0});
          }}
          destroyOnClose // 关闭时销毁 Modal 里的子元素
          maskClosable={false} // 点击遮照能不能关闭Modal
          footer={null} // 底部按钮
          width="80vw"
          style={{
            top: 10,
            bottom: 10,
          }}
          bodyStyle={{ overflow: 'scroll', height: '90vh' }}
          wrapClassName="report-modal-wrap"
        >
          <AddText
            id = { id }
            isAppend = { this.props.isAppend }
            typeShow = { 0 }
            addCourseListener = { this.addCourseListener }
          />
        </Modal>
      </div>
    );
  }
}

export default  Form.create()(UpVideo);
