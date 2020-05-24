import React from 'react';
import {Form, Select, TreeSelect, Input, Switch, Divider, Button, Row, Col, message} from 'antd';
import styles from './index.less';
import utilLess from '@/utils/utils.less'
import { CourseAttrs } from '@/utils/map/DictionaryUtil'
import {connect} from "dva";
import { isEmpty, handleEmptyStr, FLAG_ADD, FLAG_EDIT, FLAG_SEE } from "@/utils/utils";

const FormItem = Form.Item;
const { Option } = Select;


const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};

@connect(({ peopleModule }) =>
  ({
    peopleModule,
  }),
)

class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // 下拉列表
    this.getSelectList();
    const { dispatch , id } = this.props;
    const { flag } = this.props;
    if(flag !== FLAG_ADD){ // 添加
      dispatch({
        type: 'peopleModule/queryClassDetial',
        payload: {
          data: {
            id,
          }
        },
      });
    }
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  /**
   * 获取上级分类
   */
  getSelectList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'peopleModule/getPeopleClassListSelect',
      payload: {
        isRelease: 1
      },
    });
  }

  // 提交保存
  submit = () => {
    const { dispatch,flag,id } = this.props;
    if( flag === FLAG_SEE){
      return
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
        }
        if(flag === FLAG_EDIT)
          data.throngTypeId = id
        data.isRelease = values.isRelease ? 1 : 0
        console.log('Received values of form: ', data, values.isRelease);
        dispatch({
          type: flag!== FLAG_ADD ? 'peopleModule/updateClass': 'peopleModule/AddClassHttp',
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
     const { peopleClassList = [], peopleClassDetial } = this.props.peopleModule;
     let detialData = peopleClassDetial;
     if(flag === FLAG_ADD){
       detialData = null;
     }
    const {form: { getFieldDecorator }} = this.props;
    return (
      <div className={styles.main}>
        <Form>
          <FormItem {...formItemLayout} label="人群分类名称">
            {getFieldDecorator('throngTypeName', {
              initialValue: detialData ?  handleEmptyStr(detialData.throngTypeName) : '',
              rules: [
                {
                  required: true,
                  message: "请输入人群分类名称"
                },
              ],
            })(<Input disabled={ flag === FLAG_SEE } rows={4} placeholder="请输入人群分类名称" />)}
          </FormItem>
          <Row>
            <Col span={24}>
              <Form.Item  { ...formItemLayout } label="上级人群分类">
                {getFieldDecorator('parentId', {
                  initialValue: detialData ? detialData.parentId : '',
                })(
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择所属分类"
                    treeData={peopleClassList}
                    allowClear
                    multiple={false}
                    treeDefaultExpandAll
                    onChange={this.onTreeChange}
                    disabled={ flag === FLAG_SEE }
                  />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="权重：">
                {getFieldDecorator('weight',

                  {
                    initialValue: detialData ? handleEmptyStr(detialData.weight) : '' ,}
                    )(
                      <Input disabled={ flag === FLAG_SEE } laceholder="请输入权重"
                      />)}
              </FormItem>
            </Col>
            <Col span={12}/>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label="是否发布：">
                {
                  getFieldDecorator('isRelease',
                    {
                      initialValue : detialData? detialData.isRelease === 1 : true
                    })( <Switch
                           disabled={ flag === FLAG_SEE }
                           checkedChildren="是"
                           unCheckedChildren="否"
                           defaultChecked = { detialData? detialData.isRelease === 1 : true }
                         />
                      )}
              </FormItem>
            </Col>
          </Row>

          <Row  style={{display : flag === FLAG_SEE ? 'block' : 'none'}}>
            <Col span={24}>
              <FormItem {...formItemLayout} label="创建时间：">
                {
                  getFieldDecorator('创建时间',
                    {
                    })(<div> { detialData ? detialData.ctstamp : '' }</div>)}
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
                  <Button disabled={flag === FLAG_SEE} style={{width: 100, marginLeft: 20}} shape="round">取消</Button>
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
