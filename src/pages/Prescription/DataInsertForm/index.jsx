/* eslint-disable no-plusplus */
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
// import { CloseCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Input,
  // Popover,
  Row,
  Select,
  Icon,
  Modal,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;

class DataInsertForm extends Component {
  // getErrorInfo = () => {
  //   const {
  //     form: { getFieldsError },
  //   } = this.props;
  //   const errors = getFieldsError();
  //   const errorCount = Object.keys(errors).filter(key => errors[key]).length;

  //   if (!errors || errorCount === 0) {
  //     return null;
  //   }

  //   const scrollToField = fieldKey => {
  //     const labelNode = document.querySelector(`label[for="${fieldKey}"]`);

  //     if (labelNode) {
  //       labelNode.scrollIntoView(true);
  //     }
  //   };

  //   return (
  //     <span className={styles.errorIcon}>
  //       <Popover
  //         title="表单校验信息"
  //         overlayClassName={styles.errorPopover}
  //         trigger="click"
  //         getPopupContainer={trigger => {
  //           if (trigger && trigger.parentNode) {
  //             return trigger.parentNode;
  //           }

  //           return trigger;
  //         }}
  //       >
  //         <CloseCircleOutlined />
  //       </Popover>
  //       {errorCount}
  //     </span>
  //   );
  // };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      // eslint-disable-next-line no-plusplus
      if (!error) {
        values.conditions = []
        for (let index = 0; index < values.name.length; index++) {
          if(values.name[index]){
            let condition = {
              name: values.name[index],
              feature: values.feature[index],
              bsymptom: values.bsymptom[index],
              prescription: values.prescription[index],
              pinyin: values.pinyin[index],
              pre_type: values.pre_type[index],
              cure: values.cure[index],
              description: values.description[index],
              note: values.note[index],
              vip_flag: values.vip_flag[index],
            }
            values.conditions.push(condition);
          }
        }
        delete values.name;
        delete values.feature;
        delete values.bsymptom;
        delete values.prescription;
        delete values.pinyin;
        delete values.pre_type;
        delete values.cure;
        delete values.description;
        delete values.note;
        delete values.vip_flag;
        console.log('validateFieldsAndScroll:', values);
        // submit the values
        dispatch({
          type: 'prescriptionAndDataInsertForm/submitAdvancedForm',
          payload: {
            data:values,
            callback: this.submitCallback,
          }
        });
      }
    });
  };

  submitCallback = value => {
    console.log('submitCallback:',value)
    if(value && value.code && value.code == 200){
      Modal.success({
        content: '保存成功',
      });
    }
    else{
      Modal.error({
        content: '保存失败',
      });
    }
  };

  remove = key => {
    const { form } = this.props; // can use data-binding to get

    const conditions = form.getFieldValue('conditions'); // We need at least one passenger
    for(let i=0;i<conditions.length;i++){
      if(conditions[i] && conditions[i].key === key){
        delete conditions[i];
        break;
      }
    }

    form.setFieldsValue({
      conditions: conditions,
    });
  };

  add = () => {
    const { form } = this.props; // can use data-binding to get

    const conditions = form.getFieldValue('conditions');
    const nextCondition = conditions.concat({
      name: '',
      feature: '',
      bsymptom: '',
      prescription: '',
      pinyin: '',
      pre_type: '',
      cure: '',
      description: '',
      note: '',
      vip_flag: '',
    }); // can use data-binding to set
    // important! notify form to detect changes

    form.setFieldsValue({
      conditions: nextCondition,
    });
  };

  creatGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      submitting,
    } = this.props;
    getFieldDecorator('conditions', {
      initialValue: [],
    });
    const conditions = getFieldValue('conditions');
    const formItems = conditions.map((condition, index) => {
      if(condition && !condition['key'] ){
        condition['key'] = this.creatGuid();
      }
      return (
        <div>
          <Form.Item
            // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label="方剂记录"
            required={false}
            key={condition['key']}
          >
            <div>
              <Form.Item label="病情名称">
                {getFieldDecorator(`name[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '请输入病情名称',
                    },
                  ],
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
              <Form.Item label="病情临床表现">
                {getFieldDecorator(`feature[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '请输入病情临床表现',
                    },
                  ],
                })(
                  <Input
                    placeholder="病情临床表现"
                    style={{
                      width: '60%',
                      marginRight: 8,
                    }}
                  />,
                )}
              </Form.Item>
              <Form.Item label="病情是否为证候">
                {getFieldDecorator(`bsymptom[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: '0',
                  rules: [
                    {
                      required: true,
                      message: '请选择病情是否为证候',
                    },
                  ],
                })(
                  <Select style={{ width: '60%' }}>
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="方剂名称">
                {getFieldDecorator(`prescription[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '请输入方剂名称',
                    },
                  ],
                })(
                  <Input
                    placeholder="方剂名称"
                    style={{
                      width: '60%',
                      marginRight: 8,
                    }}
                  />,
                )}
              </Form.Item>
              <Form.Item label="方剂拼音">
                {getFieldDecorator(`pinyin[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                  ],
                })(
                  <Input
                    placeholder="方剂拼音"
                    style={{
                      width: '60%',
                      marginRight: 8,
                    }}
                  />,
                )}
              </Form.Item>
              <Form.Item label="方剂类型">
                {getFieldDecorator(`pre_type[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: '食疗处方',
                  rules: [
                    {
                      required: true,
                      message: '请输入方剂类型',
                    },
                  ],
                })(
                  <Select style={{ width: '60%' }}>
                    <Option value="1">食疗处方</Option>
                    <Option value="2">运动处方</Option>
                    <Option value="5">民间妙方</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="方剂主治">
                {getFieldDecorator(`cure[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '请输入方剂主治',
                    },
                  ],
                })(
                  <Input
                    placeholder="方剂主治"
                    style={{
                      width: '60%',
                      marginRight: 8,
                    }}
                  />,
                )}
              </Form.Item>
              <Form.Item label="方剂描述">
                {getFieldDecorator(`description[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '请输入方剂描述',
                    },
                  ],
                })(
                  <Input
                    placeholder="方剂描述"
                    style={{
                      width: '60%',
                      marginRight: 8,
                    }}
                  />,
                )}
              </Form.Item>
              <Form.Item label="方剂按语">
                {getFieldDecorator(`note[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '请输入方剂按语',
                    },
                  ],
                })(
                  <Input
                    placeholder="方剂按语"
                    style={{
                      width: '60%',
                      marginRight: 8,
                    }}
                  />,
                )}
              </Form.Item>
              <Form.Item label="方剂查看权限">
                {getFieldDecorator(`vip_flag[${index}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '请输入方剂查看权限',
                    },
                  ],
                })(
                  <Input
                    placeholder="方剂查看权限（0非会员；1会员）"
                    style={{
                      width: '60%',
                      marginRight: 8,
                    }}
                  />,
                )}
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(condition['key'])}
                />
              </Form.Item>
            </div>
          </Form.Item>
          <hr />
        </div>
      )
    });
    return (
      <>
        <PageHeaderWrapper content="完整模型数据录入页面。">
          <Card title="西医疾病" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="西医疾病名称">
                    {getFieldDecorator('disease_name', {
                      rules: [
                        {
                          required: true,
                          message: '请输入西医疾病名称',
                        },
                      ],
                    })(<Input placeholder="请输入西医疾病名称" />)}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 6,
                    offset: 2,
                  }}
                  lg={{
                    span: 8,
                  }}
                  md={{
                    span: 12,
                  }}
                  sm={24}
                >
                  <Form.Item label="西医疾病拼音">
                    {getFieldDecorator('disease_pinyin', {
                      rules: [],
                    })(<Input placeholder="请输入西医疾病拼音" />)}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 8,
                    offset: 2,
                  }}
                  lg={{
                    span: 10,
                  }}
                  md={{
                    span: 24,
                  }}
                  sm={24}
                >
                  <Form.Item label="西医疾病概述">
                    {getFieldDecorator('disease_description', {
                      rules: [
                        {
                          required: true,
                          message: '请输入西医疾病概述',
                        },
                      ],
                    })(
                      <TextArea
                        placeholder="西医疾病概述"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="西医疾病病因">
                    {getFieldDecorator('disease_cause', {
                      rules: [
                        {
                          required: true,
                          message: '请输入西医疾病病因',
                        },
                      ],
                    })(
                      <TextArea
                        placeholder="请输入西医疾病病因"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 6,
                    offset: 2,
                  }}
                  lg={{
                    span: 8,
                  }}
                  md={{
                    span: 12,
                  }}
                  sm={24}
                >
                  <Form.Item label="西医治疗">
                    {getFieldDecorator('disease_cure', {
                      rules: [
                        {
                          required: true,
                          message: '请输入西医治疗',
                        },
                      ],
                    })(
                      <TextArea
                        placeholder="请输入西医治疗"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 8,
                    offset: 2,
                  }}
                  lg={{
                    span: 10,
                  }}
                  md={{
                    span: 24,
                  }}
                  sm={24}
                >
                  <Form.Item label="西医疾病别名">
                    {getFieldDecorator('disease_alias', {
                      rules: [
                      ],
                    })(
                      <TextArea
                        placeholder="西医疾病别名"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="中医疾病" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="中医疾病名称">
                    {getFieldDecorator('tcm_name', {
                      rules: [
                        {
                          required: true,
                          message: '请输入中医疾病名称',
                        },
                      ],
                    })(<Input placeholder="请输入中医疾病名称" />)}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 6,
                    offset: 2,
                  }}
                  lg={{
                    span: 8,
                  }}
                  md={{
                    span: 12,
                  }}
                  sm={24}
                >
                  <Form.Item label="中医疾病拼音">
                    {getFieldDecorator('tcm_pinyin', {
                      rules: [],
                    })(<Input placeholder="请输入中医疾病拼音" />)}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 8,
                    offset: 2,
                  }}
                  lg={{
                    span: 10,
                  }}
                  md={{
                    span: 24,
                  }}
                  sm={24}
                >
                  <Form.Item label="中医疾病概述">
                    {getFieldDecorator('tcm_description', {
                      rules: [
                        {
                          required: true,
                          message: '请输入中医疾病概述',
                        },
                      ],
                    })(
                      <TextArea
                        placeholder="中医疾病概述"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="中医疾病病因">
                    {getFieldDecorator('tcm_cause', {
                      rules: [
                        {
                          required: true,
                          message: '请输入中医疾病病因',
                        },
                      ],
                    })(
                      <TextArea
                        placeholder="请输入中医疾病病因"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 6,
                    offset: 2,
                  }}
                  lg={{
                    span: 8,
                  }}
                  md={{
                    span: 12,
                  }}
                  sm={24}
                >
                  <Form.Item label="中医治疗">
                    {getFieldDecorator('tcm_cure', {
                      rules: [
                        {
                          required: true,
                          message: '请输入中医治疗',
                        },
                      ],
                    })(
                      <TextArea
                        placeholder="请输入中医治疗"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 8,
                    offset: 2,
                  }}
                  lg={{
                    span: 10,
                  }}
                  md={{
                    span: 24,
                  }}
                  sm={24}
                >
                  <Form.Item label="中医疾病别名">
                    {getFieldDecorator('tcm_alias', {
                      rules: [
                      ],
                    })(
                      <TextArea
                        placeholder="中医疾病别名"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="其他" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="禁忌">
                    {getFieldDecorator('taboo', {
                      rules: [
                        {
                          required: true,
                          message: '请输入禁忌',
                        },
                      ],
                    })(
                      <TextArea
                        placeholder="请输入禁忌"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 6,
                    offset: 2,
                  }}
                  lg={{
                    span: 8,
                  }}
                  md={{
                    span: 12,
                  }}
                  sm={24}
                >
                  <Form.Item label="适宜">
                    {getFieldDecorator('suitable', {
                      rules: [],
                    })(
                      <TextArea
                        placeholder="请输入适宜"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col
                  xl={{
                    span: 8,
                    offset: 2,
                  }}
                  lg={{
                    span: 10,
                  }}
                  md={{
                    span: 24,
                  }}
                  sm={24}
                >
                  <Form.Item label="预防">
                    {getFieldDecorator('prevention', {
                      rules: [
                        {
                          required: true,
                          message: '请输入预防',
                        },
                      ],
                    })(
                      <TextArea
                        placeholder="预防"
                        autoSize={{
                          minRows: 1,
                          maxRows: 6,
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Form.Item label="关键字">
                  {getFieldDecorator('keyword', {
                    rules: [
                      {
                        required: true,
                        message: '请输入关键字',
                      },
                    ],
                  })(
                    <TextArea
                      placeholder="请输入关键字"
                      autoSize={{
                        minRows: 1,
                        maxRows: 6,
                      }}
                    />,
                  )}
                </Form.Item>
              </Row>
            </Form>
          </Card>
          <Card title="病情/处方" className={styles.card} bordered={false}>
            {formItems}
            <Form.Item>
              <Button
                type="dashed"
                onClick={this.add}
                style={{
                  width: '60%',
                }}
              >
                <Icon type="plus" /> 添加病情，处方记录
              </Button>
            </Form.Item>
          </Card>
        </PageHeaderWrapper>
        <FooterToolbar>
          {/* {this.getErrorInfo()} */}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </>
    );
  }
}

export default connect(({ loading }) => ({
  submitting: loading.effects['prescriptionAndDataInsertForm/submitAdvancedForm'],
}))(Form.create()(DataInsertForm));
