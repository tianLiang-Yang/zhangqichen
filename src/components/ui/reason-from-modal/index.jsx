import React from 'react';
import { Form, Input, Modal } from 'antd';
import styles from './index.less';
import { isEmpty } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

class ReasonFromModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  // 编辑和添加角色表单提交
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.handleReasonConfirm(fieldsValue);
    });
  };

  render() {
    // status true 正常 false 封号
    const { visiable, title, label, message } = this.props;
    const { form: { getFieldDecorator } } = this.props;
    const modalFooter =
      {
        okText: '保存',
        onOk: this.handleSubmit,
        onCancel: this.props.handleReasonCancel,
      };
    return (
      <Modal
        title = { title }
        className = { styles.standardListForm}
        width = { 640 }
        bodyStyle = {{ padding: '28px 24px' }}
        destroyOnClose
        visible={ visiable }
        {...modalFooter}
      >
      <Form onSubmit={this.props.handleSubmit}>
        <FormItem {...this.formLayout} label = { label }>
          {getFieldDecorator('statusDesc', {
            rules: [
              {
                required: true,
                message: isEmpty(message) ? '请输入至少五个字符' : message,
                min: 5,
              },
            ],
          })(<TextArea rows={4} placeholder = { isEmpty(message) ? '请输入至少五个字符' : message} />)}
        </FormItem>
      </Form>
      </Modal>
    );
  }
}

export default Form.create()(ReasonFromModal);
