import React from 'react';
import { Form, Input, Icon, Button } from 'antd';

class DynamicFieldSet extends React.Component {
  remove = index => {
    const { form } = this.props; // can use data-binding to get

    const conditions = form.getFieldValue('conditions'); // We need at least one passenger

    if (conditions.length === 1) {
      return;
    } // can use data-binding to set

    form.setFieldsValue({
      conditions: conditions.splice(index, 1),
    });
  };

  add = () => {
    const { form } = this.props; // can use data-binding to get

    const conditions = form.getFieldValue('conditions');
    const nextCondition = conditions.concat({
      condition: '',
      feature: '',
    }); // can use data-binding to set
    // important! notify form to detect changes

    form.setFieldsValue({
      conditions: nextCondition,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log(
          'Merged values:',
          keys.map(key => names[key]),
        );
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 20,
        },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 4,
        },
      },
    };
    getFieldDecorator('conditions', {
      initialValue: this.props.data ? this.props.data : [],
    });
    const conditions = getFieldValue('conditions');
    const formItems = conditions.map((condition, index) => (
      <div>
        <Form.Item
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '病情' : ''}
          required={false}
          key={condition}
        >
          <div className="condition">
            <Form.Item>
              {getFieldDecorator(`names[${index}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: condition.condition,
                rules: [],
              })(
                <Input
                  placeholder="病情名称"
                  style={{
                    width: '60%',
                    marginRight: 8,
                  }}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`feature[${index}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: condition.feature,
                rules: [],
              })(
                <Input
                  placeholder="病情临床表现"
                  style={{
                    width: '60%',
                    marginRight: 8,
                  }}
                />,
              )}
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(index)}
              />
            </Form.Item>
          </div>
        </Form.Item>
      </div>
    ));
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button
            type="dashed"
            onClick={this.add}
            style={{
              width: '60%',
            }}
          >
            <Icon type="plus" /> 添加病情，症状记录
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(DynamicFieldSet);
