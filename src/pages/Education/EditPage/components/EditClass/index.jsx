import React from 'react';
import {Form, Select, Input, Switch, Divider, Row, Col, message, TreeSelect} from 'antd';
import styles from './index.less';
import { sourceWays, CourseAttrs,sourceModes } from '@/utils/map/DictionaryUtil'
import {connect} from "dva";
import TreeDialog from '@/components/ui/tree-dialog'
import IconFont from "@/components/IconFont";
import {FLAG_SEE, isEmpty, toTimestr} from "@/utils/utils";

const FormItem = Form.Item;
const { Option } = Select;


const formItemLayout = {
  labelCol: { span: 3},
  wrapperCol: { span: 21},
};

const formItemLayout2 = {
  labelCol: { span: 6},
  wrapperCol: { span: 18},
};

const fromFiveLayout = {
  labelCol: { span: 10,},
  wrapperCol: { span: 10,},
};

const { TextArea } = Input;

@connect(({ eduClassModule,eduAddModule,user }) =>
  ({
    eduClassModule,
    eduAddModule,
    currentUser: user.currentUser,
  }),
)

class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisit:true,  // 阅读
      isLike:true,  // 点赞
      isRelay:true,  // 分享
      isReply:true,  // 评论
      isCollect:true,  // 收藏
      classValues:'', // 分类
    };
  }

  componentWillMount() {
    this.props.onChlidBaseRef(this)
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/getBaThrongList',
      payload:{},
    });
  }

  componentDidMount() {
    this.getAllList();
  }

  toSaveAction  = () =>{
    const { isVisit, isLike, isRelay, isReply, isCollect} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          isVisit: isVisit ? 1 : 0,
          isLike: isLike ? 1 : 0,
          isRelay: isRelay ? 1 : 0,
          isReply: isReply ? 1 : 0,
          isCollect: isCollect ? 1 : 0,
        }
        console.log('Received values of form: ', data);
        if(this.props.id === ''){
          this.props.savaBaseInfo(data);
        }else{
          this.props.updateData(data,1)
        }

      }
    });

  }

  /**
   * 获取上级课程分类
   */
  getAllList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eduClassModule/getAllClassList',
      payload: {},
    });
  }


  // 课堂分分类列表
  handleAllClassData = () => {
    const { allList = []} = this.props.eduClassModule;
    const treeList = JSON.parse(JSON.stringify(allList)
      .replace(/classTypeName/g,"title")
      .replace(/list/g,"children")
      .replace(/classTypeId/g,"value"));
    console.log('handleAllClassData',treeList)
    return treeList;
  }

  // 分类选择监听
  onTreeChange = value => {
    console.log(value);
    this.setState({ classValues: value });
  };

  onSwitchReadChange = (checked) => {
    console.log(`switch to ${checked}`);
    this.setState({ isVisit: checked })
  }

  onSwitchFabulouChange = (checked) => {
    this.setState({ isLike: checked })
  }

  onSwitchShareChange = (checked) => {
    this.setState({ isRelay: checked })
  }

  onSwitchCommentChange = (checked) => {
    this.setState({ isReply: checked })
  }

  onSwitchCollectChange = (checked) => {
    this.setState({ isCollect: checked })
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.detialInfo!== nextProps.detialInfo){
      this.setState({
        isVisit: nextProps.detialInfo.isVisit === 1,
        isLike: nextProps.detialInfo.isLike === 1,
        isRelay: nextProps.detialInfo.isRelay === 1,
        isReply: nextProps.detialInfo.isReply === 1,
        isCollect: nextProps.detialInfo.isCollect === 1,
      })
    }
  }

  render() {
    console.log('基础信息---->',this.props.detialInfo)
    const { form: { getFieldDecorator }, showType, currentUser,detialInfo} = this.props;
    const { isVisit, isLike, isRelay , isReply, isCollect } = this.state;
    const { ThrongList = [], ctstamp } = this.props.eduAddModule
    const BaThrongListOption = ThrongList.map((item) =>
      <Option key={item.throngId} value= { item.throngId }>{ item.throngName }</Option>)
    const CourseAttrsOption = Object.keys(CourseAttrs).map((item) => <Option value={item}>{CourseAttrs[item]}</Option>)
    const CourseWaysOption = Object.keys(sourceWays).map((item) => <Option value={item}>{sourceWays[item]}</Option>)
    return (
      <div className={styles.main}>
        <Form>
          <Row>
            <Col span={16}>
              <FormItem {...formItemLayout} label="课程名称">
                {getFieldDecorator('className', {
                  rules: [
                    {
                      required: true,
                      message:'请输入课程名称'
                    },
                  ],
                  initialValue: detialInfo ? detialInfo.className : ''
                })(<Input disabled={ showType === FLAG_SEE }  placeholder="请输入课程名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout2} label="简拼">
                {getFieldDecorator('pinyin', {
                  rules: [
                    {
                      required: true,
                      message: '请输入简拼'
                    },
                  ],
                  initialValue: detialInfo ? detialInfo.pinyin : ''
                })(<Input disabled={ showType === FLAG_SEE }  placeholder="请输入简拼" />)}
              </FormItem>
            </Col>
          </Row>
          <div className={styles.TextInputBox}>
            <Row>
              <Col span={24}>
                <Form.Item label = "课程概述"
                           {...{
                              labelCol: { span: 2},
                              wrapperCol: { span: 22},
                            }}
                >
                  {getFieldDecorator('classInfo', {
                    rules: [
                      {
                        required: true,
                        message: '请输入至少五个字的描述',
                        min: 5,
                      },
                    ],
                    initialValue: detialInfo ? detialInfo.classInfo : ''
                  })(<TextArea disabled={ showType === FLAG_SEE } placeholder="请输入至少五个字的描述" />)}
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Row>
            <Col span={24}>
              <Form.Item label = "搜索关键字"
                         {...{
                           labelCol: { span: 2},
                           wrapperCol: { span: 22},
                         }}
              >
                {getFieldDecorator('keyword', {
                  rules: [
                    {
                      required: true,
                      message:'请输入所属关键字'
                    },
                  ],
                  initialValue: detialInfo ? detialInfo.keyword : ''
                })(<Input disabled={ showType === FLAG_SEE } placeholder="请输入搜索关键字" />)}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={16}>
              <FormItem {...formItemLayout} label="讲师">
                {getFieldDecorator('lecturer', {
                  rules: [
                    {
                      required: true,
                      message:'请输入讲师名称'
                    },
                  ],
                  initialValue: detialInfo ? detialInfo.lecturer : ''
                })(<Input disabled={ showType === FLAG_SEE } placeholder="请输入讲师名称" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <Form.Item  {...formItemLayout2} label="来源渠道">
                {getFieldDecorator('sourceType', {
                  rules: [
                    {
                      required: true,
                      message:'选择来源渠道'
                    },
                  ],
                  initialValue: detialInfo ? `${detialInfo.sourceType}` : '1'
                })(
                  <Select disabled={ showType === FLAG_SEE } placeholder="请选来源渠道">
                    {
                      CourseWaysOption
                    }
                  </Select>)}
              </Form.Item>
            </Col>
          </Row>

          <Row>

            <Col span={16}>
              <Form.Item   {...formItemLayout} label="所属分类">
                {getFieldDecorator('classTypeIdList', {
                  rules: [
                    {
                      required: true,
                      message:'选择来所属分类'
                    },
                  ],
                  initialValue: detialInfo ? detialInfo.classTypeIdList : []
                })(
                  <TreeSelect
                    disabled={ showType === FLAG_SEE }
                    showSearch
                    style={{ width: '100%' }}
                    value={this.state.classValues}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择所属分类"
                    treeData={this.handleAllClassData()}
                    allowClear
                    multiple
                    treeDefaultExpandAll
                    onChange={this.onTreeChange}
                />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item  {...formItemLayout2} label="课程属性">
                {getFieldDecorator('calssProperty', {
                  rules: [
                    {
                      required: true,
                      message:'选择来课程属性'
                    },
                  ],
                  initialValue: detialInfo ? `${detialInfo.calssProperty}` : ''
                })(
                  <Select disabled={ showType === FLAG_SEE } placeholder="请选择课程分类属性">
                    {
                      CourseAttrsOption
                    }
                  </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={16} >
              <FormItem {... {...formItemLayout}} label="权重">
                {getFieldDecorator('weight', {
                  initialValue: detialInfo ? detialInfo.weight : ''
                })(
                  <Input disabled={ showType === FLAG_SEE } type="number" pattern='[0-20]'  placeholder="请输入权重" />
                )}
              </FormItem>

            </Col>
            <Col span={8}>
              <FormItem  {...formItemLayout2} label="来源方式">
                {getFieldDecorator('sourceMode', {
                  rules: [
                    {
                      required: true,
                      message:'请选择来源方式',
                    },
                  ],
                  initialValue: detialInfo ? `${detialInfo.sourceMode}` : ''
                })(
                  <Select disabled={ showType === FLAG_SEE } placeholder="请选择来源方式">
                    {
                      Object.keys(sourceModes).map((item) => <Option value={item}>{sourceModes[item]}</Option>)
                    }
                  </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Row >
              <Col span={2}>
                <div className={styles.leftContrlDiv}>
                  互动控制：
                </div>
              </Col>
              <Col span={22}>
                <Row>
                  <Col span={4}>
                    <Form.Item {...fromFiveLayout} label="显示阅读量">
                      {getFieldDecorator('显示阅读量',
                        {
                          initialValue: isVisit,
                        })(
                        <Switch
                          disabled={ showType === FLAG_SEE }
                          checkedChildren="是"
                          unCheckedChildren="否"
                          checked={ isVisit }
                          onChange={ this.onSwitchReadChange } />)}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item {...fromFiveLayout} label="可点赞">
                      {getFieldDecorator('可点赞', {
                        initialValue:isLike,
                      })(<Switch
                          disabled={ showType === FLAG_SEE }
                          checkedChildren="是"
                          unCheckedChildren="否"
                          checked={isLike}
                          onChange={ this.onSwitchFabulouChange }/>)}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item {...fromFiveLayout} label="可分享">
                      {getFieldDecorator('可分享', {
                        initialValue:isRelay
                      })(
                        <Switch
                          disabled={ showType === FLAG_SEE }
                          checked={ isRelay }
                          onChange={ this.onSwitchShareChange }
                          checkedChildren="是"
                          unCheckedChildren="否"
                          defaultChecked/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item {...fromFiveLayout} label="可评论">
                      {getFieldDecorator('可评论', {
                        initialValue:isReply
                      })(<Switch
                          disabled={ showType === FLAG_SEE }
                          checked={ isReply }
                          onChange={ this.onSwitchCommentChange }
                          checkedChildren="是"
                          unCheckedChildren="否"
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item {...fromFiveLayout} label="可收藏">
                      {getFieldDecorator('可收藏', {
                        initialValue:isCollect
                      })(
                        <Switch
                          disabled={ showType === FLAG_SEE }
                          checked={ isCollect}
                          onChange={ this.onSwitchCollectChange }
                          checkedChildren="是"
                          unCheckedChildren="否"
                        />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Row>

        </Form>

        <Divider dashed/>

        <div className={styles.HCenter}>
          <div className={ styles.MyHLayout } style={{paddingBottom:30}}>
            <div >来源方式：手动创建</div>
            <div>创建途径：佑健康后台用户</div>
            <div>创建者：{ detialInfo ? detialInfo.createUserName : currentUser.orgUserName }</div>
            <div>创建机构：中科软科技股份有限公司</div>
            {/* eslint-disable-next-line no-nested-ternary */}
            <div>{  detialInfo ? toTimestr(detialInfo.ctstamp) :  isEmpty(ctstamp) ? '' :`创建时间：${toTimestr(ctstamp)}`}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default  Form.create()(EditClass);
