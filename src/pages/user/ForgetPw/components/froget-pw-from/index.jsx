import React from 'react'
import styles from './index.less'
import { Form, Icon, Input, Button } from 'antd';

class ForgetPwFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    console.log('this.props.from', this.props.form)
    const { getFieldDecorator } = this.props.form;
     return (
       <div className={styles.main}>
         <Form onSubmit = {this.handleSubmit} className={styles.from} >
           <Form.Item>
             {getFieldDecorator('new_pw', {
               rules: [{ required: true, message: '请输入您的新密码' }],
             })(
               <Input
                 size="large"
                 prefix={<Icon type="border" style={{ color: 'rgba(0,0,0,.25)' }} />}
                 placeholder="输入新密码"
               />,
             )}
           </Form.Item>
           <Form.Item>
             {getFieldDecorator('new_pw_again', {
               rules: [{ required: true, message: '请再次请输入您的新密码' }],
             })(
               <Input
                 size="large"
                 prefix={<Icon type="table" style={{ color: 'rgba(0,0,0,.25)' }} />}
                 placeholder="再次输入新密码"
               />,
             )}
           </Form.Item>
           <Form.Item>
               <Button type="primary" htmlType="submit" className={styles.btn_confirm}>
                 确认修改并进入系统
               </Button>,
           </Form.Item>
         </Form>
       </div>
     )
   }
}

const NormalForgetPwFrom = Form.create()(ForgetPwFrom);
export default NormalForgetPwFrom;
