import React from 'react';
import {Form, Select, Input, Checkbox, Divider, Button, Row, Col, Radio, TreeSelect, message,} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import { isEmpty, handleEmptyStr, FLAG_ADD, FLAG_EDIT, FLAG_SEE } from "@/utils/utils";
import AreaSelect from "@/pages/UserManager/components/area-select";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};

@connect(({ userManage, peopleModule }) =>
  ({
    peopleModule,
    userManage,
  }),
)

class EditDynamicPeople extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radioHealth : 1,
      checkSex: false,
      checkAge: false,
      checkOrg: false,
      checkProTitle: false,
      checkJobType: false,
      checkCity: false,
      checkHeleth: false,
    };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({'checkOne': true})
    this.fetchSomeHttp();
    this.getSelectList();
    const { dispatch , id } = this.props;
    // this.submit();
    const { flag } = this.props;
    if(flag!== FLAG_ADD){
      dispatch({
        type: 'peopleModule/queryPeopleDetial',
        payload: {
          data: {
            throngId: id,
          },
        },
      });
    }
  }

  getArrayList = (list) =>{
    const intList = []
    for (let i = 0; i < list.length; i++) {
      intList.push(Number(list[i]))
    }
    return intList;
  }

  fetchSomeHttp = () => {
    const { dispatch } = this.props;
    // 职称 职业
    dispatch({
      type: 'userManage/fetchDicList',
      payload: {
        dictCodeList: ['jobType', 'protitle'],
      },
    });
    // 机构
    dispatch({
      type: 'userManage/fetchOrgList',
      payload: {
        keyword: '',
      },
    });
  }

  // 用来判断是否显示慢病下拉框
  onChangeHealth = (e) => {
    this.setState({ radioHealth: e.target.value })
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
      payload: {},
    });
  }


  // 提交保存
  submit = () => {
    console.log('提交保存')
    try{
      console.log('提交保存try')
      const { dispatch,flag } = this.props;
      const { checkSex, checkAge, checkOrg, checkProTitle, checkJobType, checkCity, checkHeleth } = this.state;
      this.props.form.validateFields((err, values) => {
        console.log('submit',err,values)
        if (!err) {
          const dynamicData = {}
          dynamicData.throngName = values.throngName
          dynamicData.throngTypeId = values.throngTypeId
          dynamicData.throngDesc = values.throngDesc
          const data = {...values}
          data.userType = values.userType
          data.doctorType = values.doctorType
          data.checkOne = 1
          if(checkSex) data.sex = values.sex
          if(checkAge &&Number(values.ageStart)>Number( values.ageEnd)){
            message.warn('开始年龄要小于结束年龄')
            return
          }
          if(checkAge){

            data.ageStart = values.ageStart
            data.ageEnd = values.ageEnd
          }
          if(checkOrg) data.orgIds = values.orgIds
          if(checkProTitle) data.protitleIds = values.protitleIds
          if(checkJobType) data.jobTypeIds = values.jobTypeIds
          if(checkHeleth) {
            data.healthType = values.healthType
            // if(values.healthType === 3) data.chronicTypeIds = values.data.chronicTypeIds
          }
          if(checkProTitle) data.protitleIds = values.protitleIds
          if(checkCity) data.provinceId = values.area.province
          if(checkCity) data.areaIds = values.area.city
          dynamicData.dynamicFactorParam = data
          console.log('Received values of form: ', data);
          dispatch({
            type: flag === FLAG_EDIT ? 'peopleModule/updateData': 'peopleModule/addDynnmicPeoole',
            payload:{
              data:dynamicData,
              cb: this.confirmCallBack,
            },
          });
        }
      });

    }catch (e) {
      console.log(e)
    }

  }

  // 添加成功回调
  confirmCallBack = () =>{
    this.props.onResult(2)
  }

   checkArea = (rule, value, callback) => {
    if(!value){
     return callback('请选择所在地区');
    }
    console.log('checkArea',rule,value)
    if(value.province !== '' && value.city !== '')  {
      return callback();
    }
     console.log('checkArea2',rule,value)
     return callback('请选择所在地区');
  };

  onCheckSexChange = (e) => {
    this.setState({ checkSex: e.target.checked})
  }

  onCheckAgeChange = (e) => {
    this.setState({ checkAge: e.target.checked})
  }

  onCheckOrgChange = (e) => {
    this.setState({ checkOrg: e.target.checked})
  }

  onCheckProTitleChange = (e) => {
    this.setState({ checkProTitle: e.target.checked})
  }

  onCheckJobTypeChange = (e) => {
    this.setState({ checkJobType: e.target.checked})
  }

  onCheckCityChange = (e) => {
    this.setState({ checkCity: e.target.checked})
  }

  onCheckHelethChange = (e) => {
    this.setState({ checkHeleth: e.target.checked})
  }

  // 机构下拉列表
  orgOption = () => {
    const orgList = this.props.userManage.orgRes.data;
    // eslint-disable-next-line max-len
    return orgList.map((item) => <Option key = { item.orgId } value = { item.orgId } >{ item.orgName }</Option>)
  }

  render() {
    const { flag } = this.props;
    const { radioHealth, checkSex, checkAge, checkProTitle, checkOrg, checkJobType, checkCity, checkHeleth } = this.state;
    const {form: { getFieldDecorator }} = this.props;
    const { queryArr = {} } = this.props.userManage;
    // eslint-disable-next-line prefer-const
    let { peopleClassList = [] , PeopleDetial = {}} = this.props.peopleModule;
    let detialData = null;
    if(flag === FLAG_ADD){
      PeopleDetial = null;
    }else{
      const { dynamicFactor = null } = PeopleDetial;
      detialData = dynamicFactor ? JSON.parse(dynamicFactor) : null;
    }
    const marginLeftChild = 10;
    const checkBoxStyle = { display: 'block'}
    const  selectFromItem = {
                              labelCol: { span: 6},
                              wrapperCol: { span:18},
                             }
    const  selectFromItemSelect = {
      labelCol: { span: 3},
      wrapperCol: { span:21},
    }
    return (
      <div className={styles.main}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="人群名称">
                {getFieldDecorator('throngName', {
                  initialValue: PeopleDetial ? handleEmptyStr(PeopleDetial.throngName) : '',
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
                        message:'请选择人群分类'
                      },
                    ],
                    initialValue: PeopleDetial ? `${PeopleDetial.throngTypeId}` : '',
                  })(
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择所属分类"
                      treeData={ peopleClassList }
                      allowClear
                      multiple={ false }
                      treeDefaultExpandAll
                      onChange={ this.onTreeChange }
                      disabled={ flag === FLAG_SEE }
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
                {getFieldDecorator('throngDesc',
                  {  rules: [
                      {
                        required: true,
                        message:'请输入备注',
                        min:5
                      },
                    ],
                    initialValue: PeopleDetial ? PeopleDetial.throngDesc : '' ,})
                (
                    <TextArea
                      disabled={ flag === FLAG_SEE }
                      rows={3}
                      placeholder="请输入至少五个字的描述"
                    />
                 )}
              </FormItem>
            </Col>
          </Row>
          </div>
          <div className={styles.Box}>
            <div className={styles.TopTitleClass}>动态筛选条件</div>
          </div>

          <div style={{color:'black'}}>
            <Row >
              <Col span={3} style={checkBoxStyle}>
                <FormItem label="">
                  {getFieldDecorator('checkOne')
                  (
                        <Checkbox
                          defaultChecked
                          disabled
                         >

                          选择
                        </Checkbox>
                   )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {... {
                  labelCol: { span: 6},
                  wrapperCol: { span: 18},
                }} label="用户类型">
                  {getFieldDecorator('userType', { initialValue: detialData ? Number(detialData.userType) : 1 })
                  (
                    <Radio.Group  disabled={ flag === FLAG_SEE }  defaultValue={ 1 }>
                      <Radio value={1} >公众</Radio>
                      <Radio value={2} >医务人员</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem  {... {
                  labelCol: { span: 6},
                  wrapperCol: { span: 18},
                  }}
                  label="医务人员类别">
                  {getFieldDecorator('doctorType', { initialValue: detialData ? Number(detialData.doctorType) : 1 })
                  (
                    <Radio.Group  disabled={ flag === FLAG_SEE }  defaultValue={ 1 }>
                      <Radio value={1} >医生</Radio>
                      <Radio value={2} >健管师</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col span={3} style={checkBoxStyle}>
                <FormItem label="">
                  {getFieldDecorator('checkSex', {  initialValue: detialData ? handleEmptyStr(detialData.checkSex) : checkSex ,})
                  (
                    <div>
                      <Checkbox
                        disabled={FLAG_SEE === flag}
                        onChange={ this.onCheckSexChange }
                        defaultChecked={ detialData ? handleEmptyStr(detialData.checkSex) : checkSex }
                      />
                      <span style={{marginLeft:marginLeftChild}}>选择</span>
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {... {
                  labelCol: { span: 6},
                  wrapperCol: { span: 18},
                  }}
                   label="性别">
                  {getFieldDecorator('sex', {
                    rules: [
                      {
                        required: checkSex,
                        message:'人群名称不能为空'
                      },
                    ],
                    initialValue: detialData ? Number(detialData.sex) : 1 })
                  (
                    <Radio.Group  disabled={ flag === FLAG_SEE }  defaultValue={ 1 }>
                      <Radio value={1} >男</Radio>
                      <Radio value={2} >女</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col span={3} style={checkBoxStyle}>
                <FormItem label="">
                  {getFieldDecorator('checkAge',
                    {  initialValue: detialData ? handleEmptyStr(detialData.checkAge) : checkAge,})
                  (
                    <div>
                      <Checkbox
                        defaultChecked={ detialData ? handleEmptyStr(detialData.checkAge) : checkAge }
                        disabled={ flag === FLAG_SEE }
                        onChange={ this.onCheckAgeChange }
                      />
                      <span style={{marginLeft:marginLeftChild}}>选择</span>
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {... {
                  labelCol: { span: 6},
                  wrapperCol: { span:16},
                }} label="年龄范围">
                  {getFieldDecorator('ageStart', {
                    rules: [
                      {
                        required: checkAge,
                        message:'请填写起始年龄'
                      },
                    ],
                    initialValue: detialData ? Number(detialData.ageStart) : '' })
                  (
                    <Input type="number" disabled={ flag === FLAG_SEE } placeholder="请输入起始年龄" />
                  )}
                </FormItem>
              </Col>
              <Col span={2}><div style={{ marginTop:10 }}> —— </div> </Col>
              <Col span={8}>
                <FormItem {... {
                  labelCol: { span: 2},
                  wrapperCol: { span: 18},
                }} >
                  {getFieldDecorator('ageEnd', {
                    rules: [
                      {
                        required: checkAge,
                        message:'请填写结束年龄'
                      },
                    ],
                    initialValue: detialData ? Number(detialData.ageEnd) : '' })
                  (
                    <Input type="number" disabled={ flag === FLAG_SEE } placeholder="请输入结束年龄" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col span={3} style={checkBoxStyle}>
                <FormItem label="">
                  {getFieldDecorator('checkOrg',
                    {  initialValue: detialData ? handleEmptyStr(detialData.checkOrg) : checkOrg ,})
                  (
                    <div>
                      <Checkbox
                        disabled={ flag === FLAG_SEE }
                        onChange={ this.onCheckOrgChange }
                        defaultChecked={ detialData ? handleEmptyStr(detialData.checkOrg) : checkOrg  }
                      />
                      <span style={{marginLeft:marginLeftChild}}>选择</span>
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={16}>
                <Form.Item
                  {...selectFromItemSelect}
                  label="机构">
                  {getFieldDecorator('orgIds', {
                    rules: [
                      {
                        required: checkOrg,
                        message: '请选择机构',
                      },
                    ],
                    initialValue: detialData? handleEmptyStr(detialData.orgIds) : [],
                  })(
                    <Select mode="multiple" disabled = { flag === FLAG_SEE }  >
                     { this.orgOption() }
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row >
              <Col span={3} style={checkBoxStyle}>
                <FormItem label="">
                  {getFieldDecorator('checkProTitle', {  initialValue: detialData ? handleEmptyStr(detialData.throngDesc) : checkProTitle ,})
                  (
                    <div>
                      <Checkbox
                        disabled={ flag === FLAG_SEE }
                        onChange={ this.onCheckProTitleChange }
                        defaultChecked={ detialData ? handleEmptyStr(detialData.checkProTitle) : checkProTitle }
                      />
                      <span style={{marginLeft:marginLeftChild}}>选择</span>
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={16}>
                <Form.Item
                  {...selectFromItemSelect}
                  label="职称">
                  {getFieldDecorator('protitleIds', {
                    rules: [
                      {
                        required: checkProTitle,
                        message: '请选择职称',
                      },
                    ],
                    initialValue: detialData? handleEmptyStr(detialData.protitleIds) : [],
                  })(<Select mode="multiple" disabled = { flag === FLAG_SEE }>
                    {
                      isEmpty(queryArr.protitle) ?
                        null
                        :
                        queryArr.protitle.map((item) => <Option
                          key={item.value}
                          value={item.value}>
                          {item.label}
                        </Option>)
                    }
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row >
              <Col span={3} style={checkBoxStyle}>
                <FormItem label="">
                  {getFieldDecorator('checkJobType', {  initialValue: true })
                  (
                    <div>
                      <Checkbox
                        defaultChecked={ detialData ? handleEmptyStr(detialData.checkJobType) : checkJobType }
                        disabled={ flag === FLAG_SEE }
                        onChange={ this.onCheckJobTypeChange }
                      />
                      <span style={{marginLeft:marginLeftChild}}>选择</span>
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={16}>
                <Form.Item
                  {...selectFromItemSelect}
                  label="职业">
                  {getFieldDecorator('jobTypeIds', {
                    rules: [
                      {
                        required: checkJobType,
                        message: '请选择职业',
                      },
                    ],
                    initialValue: detialData? handleEmptyStr(detialData.jobTypeIds) : [],
                  })(<Select mode="multiple" disabled = { flag === FLAG_SEE }>
                    {
                      isEmpty(queryArr.jobType) ?
                        null
                        :
                        queryArr.jobType.map((item) => <Option
                          key={item.value}
                          value={item.value}>
                          {item.label}
                        </Option>)
                    }
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row >
              <Col span={3} style={checkBoxStyle}>
                <FormItem label="">
                  {getFieldDecorator('checkCity', {  initialValue: detialData ? handleEmptyStr(detialData.checkCity) : checkCity ,})
                  (
                    <div>
                      <Checkbox
                        defaultChecked={detialData ? handleEmptyStr(detialData.checkCity) : checkCity}
                        disabled={ flag === FLAG_SEE }
                        onChange={ this.onCheckCityChange }
                      />
                      <span style={{marginLeft:marginLeftChild}}>选择</span>
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col span={16}>
                <Form.Item
                  {...{
                    labelCol: { span: 3},
                    wrapperCol: { span:21},
                  }}
                  label="所在地">
                  {getFieldDecorator('area', {
                    rules: [{ required: checkCity, validator: this.checkArea }],
                    initialValue: {
                      city: detialData ? this.getArrayList(detialData.areaIds): [],
                      province: detialData ? Number(detialData.provinceId) : ''
                    }
                  })(<AreaSelect isMore = "more"  flag = {flag}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row >
              <Col span={3} style={checkBoxStyle}>
                <FormItem label="">
                  {getFieldDecorator('checkHeleth', {  initialValue: detialData ? handleEmptyStr(detialData.checkHeleth) : checkHeleth ,})
                  (
                    <div>
                      <Checkbox
                        defaultChecked={ detialData ? handleEmptyStr(detialData.checkHeleth) : checkHeleth }
                        disabled={ flag === FLAG_SEE }
                        onChange={ this.onCheckHelethChange }
                      />
                      <span style={{marginLeft:marginLeftChild}}>选择</span>
                    </div>
                  )}
                </FormItem>
              </Col>
              <Col  span={10}>
                <FormItem {... {
                  labelCol: { span: 5},
                  wrapperCol: { span: 19},
                }} label="健康状况">
                  {getFieldDecorator('healthType', {
                    initialValue: detialData ? Number(detialData.healthType) : 1 })
                  (
                    <Radio.Group
                      disabled={ flag === FLAG_SEE }
                      defaultValue={ 1 }
                      onChange={ this.onChangeHealth }
                    >
                      <Radio value={1} style={{marginLeft:6}}>健康</Radio>
                      <Radio value={2} style={{marginLeft:6}}>亚健康</Radio>
                      <Radio value={3} style={{marginLeft:6}} >慢病患者</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col style={{display: radioHealth === 3 ? 'block' : 'none'}} span={10}>
                <FormItem {... {
                  labelCol: { span: 5},
                  wrapperCol: { span: 19},
                }} >
                  {getFieldDecorator('chronicTypeIds', {
                    rules: [
                      {
                        required: checkHeleth && radioHealth === 3,
                        message:'人群名称不能为空'
                      },
                    ],
                    initialValue: detialData ? Number(detialData.chronicTypeIds) : [] })
                  (
                    <Select mode="multiple" disabled = { flag === FLAG_SEE }>
                      <Option
                        key={1}
                        value="慢病测试别选"
                      >慢病测试别选</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

          </div>
        </Form>

          <div style={{display : flag === FLAG_SEE ? 'none' : 'block'}}>
            <Divider/>
            <div className={styles.HCenter}>
              <div className={styles.HLayout}>
                <Button onClick={() => this.submit()}
                        style={{width: 100, marginLeft: 20}}
                        type="primary"
                        shape="round">确定</Button>
              </div>
            </div>
          </div>

      </div>
    );
  }
}

export default  Form.create()(EditDynamicPeople);
