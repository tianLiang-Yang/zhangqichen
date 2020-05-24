import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { Button, Card, Input, Select, Upload, } from 'antd';
import { getBase64 } from '@/utils/utils';
import UploadPhoto from './UploadPhoto';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 7,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
    md: {
      span: 10,
    },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 7,
    },
  },
};


class FormRendering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imgUrl: null,
    }
  }

  getFormItem = data => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    if (data.type === 'text' || data.type === 'number') {
      return getFieldDecorator(`${data.label}`, {
        rules: [
          {
            required: data.require,
            message: `${data.desc}不可为空!`,
          },
        ],
      })(<Input placeholder={data.desc} key={data.label} />);
    }
    else if (data.type === 'areatext') {
      return getFieldDecorator(`${data.label}`, {
        rules: [
          {
            required: data.require,
            message: `${data.desc}不可为空!`,
          },
        ],
      })(<TextArea placeholder={data.desc} autoSize={{ minRows: 1, maxRows: 6 }} key={data.label} />);
    }
    else if (data.type === 'select') {
      return getFieldDecorator(`${data.label}`, {
        rules: [
          {
            required: data.require,
            message: `${data.desc}不可为空!`,
          },
        ],
      })(<Select key={data.label} >
        {
          data.dict ? (data.dict.map(item => (
            <Option value={item.value} >{item.label}</Option>
          ))
          ) : null
        }
      </Select>);
    }
    else if (data.type === 'image') {
      return getFieldDecorator(`${data.label}`, {
        rules: [
          {
            required: data.require,
            message: `${data.desc}不可为空!`,
          },
        ],
        valuePropName: data.label,
      })(<UploadPhoto action={this.props.uploadUrl + "/prescription/manager/uploadImage"} key={data.label} />);
    }
    return getFieldDecorator(`${data.label}`, {
      rules: [
        {
          required: data.require,
          message: `${data.desc}不可为空!`,
        },
      ],
    })(<Input placeholder={data.desc} key={data.label} />);
  }

  handleSubmit = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  render() {
    const { tableName, handleSearchSubmit, cols } = this.props;
    return (
      <div>
        <Card style={{ marginTop: 20 }}>
          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            <Input.Search
              placeholder={`请输入${tableName}名称`}
              enterButton="搜索"
              size="large"
              onSearch={handleSearchSubmit}
              style={{
                maxWidth: 522,
                width: '100%',
              }}
            />
          </div>
        </Card>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 20,
            }}
          >
            {
              cols ? (cols.map(item =>
                <FormItem {...formItemLayout} label={`${item.desc}`}>
                  {this.getFormItem(item)}
                </FormItem>
              )) :
                null
            }
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
                textAlign: 'center',
              }}
            >
              <Button type="primary" htmlType="submit" >
                <FormattedMessage id="prescriptionandhealthpreform.form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>

    );
  }
}

export default Form.create()(FormRendering);