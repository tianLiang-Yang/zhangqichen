import React from 'react';
import {Form, Select, Input, Switch, Divider, Button, Row, Col, message, TreeSelect} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import {isEmpty, handleEmptyStr, FLAG_ADD, FLAG_EDIT, FLAG_SEE, PEOPLE_LOCAL, PEOPLE_NET_ID} from "@/utils/utils";
import UserTable from "@/pages/People/ManagePage/components/UserTable";
import UtilStyle from '@/utils/utils.less'
import {AppColor} from "@/utils/ColorCommom";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};


@connect(({ peopleModule }) =>
  ({
    peopleModule,
    throngId: peopleModule.throngId
  }),
)

class EditStaticPeople extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  componentDidMount() {
    this.props.onChlidStaticPeopleRef(this)
    const { dispatch  } = this.props;
    this.getSelectList();
    const { flag } = this.props;
    if(flag!== FLAG_ADD){
      dispatch({
        type: 'peopleModule/queryPeopleDetial',
        payload: {
          data: {
            throngId: this.props.throngId,
          },
          cb: () => {

          }
        },
      });
    }
  }

  /**
   * 获取上级分类
   */
  getSelectList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'peopleModule/getPeopleClassListSelect',
      payload: {},
    });
  }


  onChlidRef = (ref) => {
    this.child = ref;
  }

  getUserIdArray = (list) =>{
    const newList = []
    for(let i = 0 ; i< list.length; i++){
      newList.push(list[i].userId)
    }
    return newList
  }


  // 提交保存
  submit = () => {


  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  handAddUser = () => {
    if(isEmpty(this.props.throngId)){
      message.warn('请先保存基本信息')
     return
    }
     this.props.showSelectDialog(this.props.flag)
  }

  afterSelectDilag = () =>{
    this.child.afterSelect()
  }

  SaveBaseInfo = () => {
    const { dispatch,flag } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
        }
        if(flag === FLAG_ADD){
          const { selectStaticList = []} = this.props.peopleModule
          data.userIds = this.getUserIdArray(selectStaticList)
        }else{
          data.throngId = this.props.throngId
        }
        console.log('Received values of form: ', data);
        dispatch({
          type: flag === FLAG_ADD || isEmpty(this.props.throngId) ? 'peopleModule/addStaticPeoole' : 'peopleModule/updateBaThrongS',
          payload:{
            data,
            cb: this.confirmCallBack
          },
        });
      }
    });
  }

  // 添加成功回调
  confirmCallBack = () =>{
    this.props.onResult(1)
  }

  // 查询
  handleFromQuery = () => {
    this.props.form.validateFields((err, values) => {
      this.child.setFromValue(values)
    });
  }

  // 重置查询条件
  handleReset = () =>{
    this.props.form.resetFields(['userNo','userNick','realName']);
    this.props.form.validateFields((err, values) => {
      this.child.setFromValue(values)
    });
  }

  render() {
    const { flag } = this.props;
    const {form: { getFieldDecorator }} = this.props;
    // eslint-disable-next-line prefer-const
    let { peopleClassList = [] , PeopleDetial = {}} = this.props.peopleModule;
    if(flag === FLAG_ADD)
    // eslint-disable-next-line no-const-assign
      PeopleDetial = null
    return (
      <div className={`${ styles.main } ${ UtilStyle.antFormItem } ${UtilStyle.myLineBoderFrom}`}>
        <div className={ styles.BaseInfoBox }>
          <div className={ styles.LeftBox }>
            <div>
              基本信息
            </div>
          </div>
          <div onClick={ this.SaveBaseInfo }>
            { isEmpty(this.props.throngId) ? '保存' : '修改'}
          </div>
        </div>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="人群名称">
                {getFieldDecorator('throngName', {
                  initialValue:PeopleDetial ?  handleEmptyStr(PeopleDetial.throngName) : '',
                  rules: [
                    {
                      required: true,
                      message:'人群名称不能为空'
                    },
                  ],
                })(<Input disabled={ flag === FLAG_SEE } placeholder="人群名称不能为空" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <Form.Item  { ...formItemLayout } label="人群分类">
                  {getFieldDecorator('throngTypeId', {
                    rules: [
                      {
                        required: true,
                        message:'人群分类不能为空'
                      },
                    ],
                    initialValue: PeopleDetial ?  `${PeopleDetial.throngTypeId}` : [],
                  })(
                    <TreeSelect
                      disabled={ flag === FLAG_SEE }
                      showSearch
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择所属分类"
                      treeData={ peopleClassList }
                      allowClear
                      multiple={ false }
                      treeDefaultExpandAll
                      onChange={ this.onTreeChange }
                    />)}
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.TextInputBox}>
          <Row>
            <Col span={24}>
              <FormItem {... {
                labelCol: { span: 2},
                wrapperCol: { span: 22},
              }} label="备注：">
                {getFieldDecorator('throngDesc', {
                  rules: [
                    {
                      required: true,
                      message:'备注不能为空'
                    },
                  ],
                  initialValue: PeopleDetial ? handleEmptyStr(PeopleDetial.throngDesc) : '' ,})
                (
                    <TextArea
                      disabled={ flag === FLAG_SEE }
                      defaultValue=''
                      rows={3} placeholder="请输入至少五个字的描述"
                    />
                 )}
              </FormItem>
            </Col>
          </Row>
          </div>
          <Row >
            <Col span={5}>
              <div
                className={styles.AddUser}
                style={{ color: AppColor.Green }}
                onClick = { this.handAddUser }>
                <span style = {{ fontSize:18 }}> + </span> 添加成员
              </div>
            </Col>
              <Col span={5}>
                <Form.Item  { ...formItemLayout } label="注册号">
                  {getFieldDecorator('userNo', {
                  })(<Input rows={4} placeholder="请输入注册号" />)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item  { ...formItemLayout } label="昵称">
                  {getFieldDecorator('userNick', {
                  })(<Input  placeholder="请输入昵称" />)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item  { ...formItemLayout } label="姓名">
                  {getFieldDecorator('realName', {
                  })(<Input  placeholder="请输入姓名" />)}
                </Form.Item>
              </Col>
            <Col span={4}>
              <div className={styles.HLayout}>
                <Button style={{marginLeft:10}} type="primary" onClick={ this.handleFromQuery }>查询</Button>
                <Button style={{marginLeft:10}} onClick={ this.handleReset }> 重置</Button>
              </div>
            </Col>
          </Row>
        </Form>
        <UserTable
          flag = { flag }
          show = { flag === FLAG_ADD ? PEOPLE_LOCAL : PEOPLE_NET_ID }
          onChlidRef = { this.onChlidRef}
        />
          {/* <div style={{display : flag === FLAG_SEE ? 'none' : 'block'}}> */}
          {/*  <Divider/> */}
          {/*  <div className={styles.HCenter}> */}
          {/*    <div className={styles.HLayout}> */}
          {/*      <Button onClick={() => this.closeSelf()} style={{width: 100, marginLeft: 20}} type="primary" */}
          {/*              shape="round">关闭</Button> */}
          {/*    </div> */}
          {/*  </div> */}
          {/* </div> */}

      </div>
    );
  }
}

export default  Form.create()(EditStaticPeople);
