import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Input, Table, Divider, Collapse, Button, Select } from 'antd';
import { Form } from '@ant-design/compatible';
import { connect } from 'dva';

const { Panel } = Collapse;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ prescriptionAndKeywordPage }) => ({
  prescriptionAndKeywordPage,
}))
class KeywordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      add: true,
    };
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'prescriptionAndKeywordPage/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  handleSearchSubmit = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'prescriptionAndKeywordPage/searchKeyword',
      payload: {
        data: {
          userId: 1,
          keyword: value,
        },
        callback: this.searchCallback,
      },
    });
  };

  searchCallback = data => {
    console.log('searchCallback:', data);
    if (data && data.code === 200 && data.data && data.data.list) {
      this.setState({
        data: data.data.list,
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

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

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'typeName',
      },
      {
        title: '操作',
        key: 'action',
        render: () => (
          <span>
            <a>编辑</a>
            <Divider type="vertical" />
            <a>删除</a>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            <Input.Search
              placeholder="请输入关键词名称"
              enterButton="搜索"
              size="large"
              onSearch={this.handleSearchSubmit}
              style={{
                maxWidth: 522,
                width: '100%',
              }}
            />
          </div>
        </Card>
        {this.state.add && (
          <Card bordered={false}>
            <div
              style={{
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              <Collapse defaultActiveKey={['1']}>
                <Panel header="添加记录" bordered={false}>
                  <Form
                    onSubmit={this.handleSubmit}
                    hideRequiredMark
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <FormItem {...formItemLayout} label="关键字">
                      {getFieldDecorator('keyword', {
                        rules: [
                          {
                            required: true,
                            message: '关键字不可为空!',
                          },
                        ],
                      })(
                        <TextArea
                          placeholder="关键字（支持逗号分割多个）"
                          autoSize={{ minRows: 1, maxRows: 6 }}
                        />,
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="类型">
                      {getFieldDecorator('type', {
                        rules: [
                          {
                            required: true,
                            message: '类型不可为空!',
                          },
                        ],
                      })(
                        <Select
                          showSearch
                          placeholder="选择类型"
                          // onChange={onChange}
                          // onFocus={onFocus}
                          // onBlur={onBlur}
                          // onSearch={onSearch}
                        >
                          <Option value="饮食处方">饮食处方</Option>
                          <Option value="西医疾病">西医疾病</Option>
                          <Option value="中医疾病">中医疾病</Option>
                        </Select>,
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名称">
                      {getFieldDecorator('name', {
                        rules: [
                          {
                            required: true,
                            message: '名称不可为空!',
                          },
                        ],
                      })(<Input placeholder="搜索实体名称（中医疾病/西医疾病/食疗处方）" />)}
                    </FormItem>
                    <FormItem
                      {...submitFormLayout}
                      style={{
                        marginTop: 32,
                        textAlign: 'center',
                      }}
                    >
                      <Button type="primary" htmlType="submit">
                        提交
                      </Button>
                      <Button
                        style={{
                          marginLeft: 8,
                        }}
                      >
                        取消
                      </Button>
                    </FormItem>
                  </Form>
                </Panel>
              </Collapse>
            </div>
          </Card>
        )}
        <Card style={{ marginTop: 20 }}>
          <Table columns={columns} dataSource={this.state.data} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(KeywordPage);
