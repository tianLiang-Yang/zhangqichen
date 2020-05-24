import React from 'react';
import {Form, Select, Radio, Input, Switch, Divider, Button, Row, Col, message} from 'antd';
import styles from './index.less';
import Avatar from "@/pages/infomation/EditinfomationPage/compont/Avatar";
import { CourseAttrs } from '@/utils/map/DictionaryUtil'
import {connect} from "dva";
import TreeDialog from '@/components/ui/tree-dialog'
import IconFont from "@/components/IconFont";
import {isEmpty, handleEmptyStr, FLAG_ADD} from "@/utils/utils";

const FormItem = Form.Item;
const { Option } = Select;


const formItemLayout = {
  labelCol: { span: 4},
  wrapperCol: { span: 20},
};

const formItemLayout2 = {
  labelCol: { span: 8},
  wrapperCol: { span: 16},
};

const leftSpan = 4;
const rightSpan = 20;

@connect(({ eduClassModule , eduAddModule,user }) =>
  ({
    eduAddModule,
    eduClassModule,
    currentUser: user.currentUser,
  }),
)

class EditClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smallFileList: [], // 缩略图
      bigFlieList: [], // 大图
      radioValue: 1,
      isOpen: true,
      visiable: false,
      selectTreeValue:'',
      selectTreeKey:0,
      treeVisiable:false,
      level:1,
      isClickable: true
    };
  }

  componentDidMount() {
    this.getAllList();
    const { dispatch , id } = this.props;
    // this.submit();
    const { flag } = this.props;
    if(flag!== FLAG_ADD){
      dispatch({
        type: 'eduClassModule/queryDetial',
        payload: {
          data: {
          classTypeId: id,
          },
          cb:this.callbackDetial,
        },
      });
    }
    dispatch({
      type: 'eduAddModule/getBaThrongList',
      payload:{},
    });
  }

  getImageUrl = (url) => ({
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url,
      response:{
        code:200,
        data: url
      }
  })

  callbackDetial = ()=>{
    const { detialData = {} } = this.props.eduClassModule;
    const arr1 = [];
    const arr2 = [];
    if(!isEmpty(detialData.imageUrl)){
      arr1.push(this.getImageUrl(detialData.imageUrl))
    }
    if(!isEmpty(detialData.imagetbUrl)){
      arr2.push(this.getImageUrl(detialData.imagetbUrl))
    }
    console.log('callbackDetial',arr2,arr1)
    this.setState({
      selectTreeValue: handleEmptyStr(detialData.classTypeName),
      selectTreeKey: detialData.parentId,
      radioValue: detialData.typeMode,
      isOpen: detialData.isRelease === 1,
      smallFileList: arr2,
      bigFlieList: arr1,
    })
  }

  onChlidRef = (ref) => {
    this.child = ref;
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

  onSwitchOpenChange = (checked) => {
    console.log(`switch to ${checked}`);
    this.setState({ isOpen: checked })
  }

  onFileListChanage = (type,flieList) =>{
    console.log('图片列表type flieList',type,flieList)
    if(type==="small"){
      this.setState({ smallFileList: flieList })
    }else{
      this.setState({ bigFlieList: flieList })
    }
  }

  // 提交保存
  submit = () => {
    const { isClickable } = this.state
    console.log('isClickable',isClickable)
    if(!isClickable) return
    this.setState({ isClickable: false })
    const { dispatch,flag,id } = this.props;
    const { smallFileList, bigFlieList, radioValue, isOpen,selectTreeKey,level } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          ...values,
          parentId:selectTreeKey,
          classTypeId:flag!== FLAG_ADD?id:0,
          level,
          typeMode:radioValue,
          isRelease:isOpen?1:0,
          // eslint-disable-next-line no-nested-ternary
          imageUrl: bigFlieList.length > 0 ? bigFlieList[0].response.code === 200?bigFlieList[0].response.data:'':'', // 大图
          // eslint-disable-next-line no-nested-ternary
          imagetbUrl:smallFileList.length >0 ?smallFileList[0].response.code === 200?smallFileList[0].response.data:'':'', // 缩略图
        }
        console.log('Received values of form: ', data);

        dispatch({
          type: flag!== FLAG_ADD? 'eduClassModule/updateData': 'eduClassModule/fetchAddClass',
          payload:{
            data,
            cb: this.confirmCallBack,
          },
        });
      }
    });

  }

  // 添加成功回调
  confirmCallBack = (isSuccess) =>{
    this.setState({ isClickable: true})
    if(isSuccess)
      this.props.onResult()
  }

  // 模式
  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      radioValue: e.target.value,
    });
  };

  // 课堂分分类列表
  handleAllClassData = () => {
    const { allList = []} = this.props.eduClassModule;
    const treeList = JSON.parse(JSON.stringify(allList)
      .replace(/classTypeName/g,"title")
      .replace(/list/g,"children")
      .replace(/classTypeId/g,"key"));
    console.log('handleAllClassData',treeList)
    return treeList;
  }

  onTreeDialogCancle = () => {
    this.setState({treeVisiable:false})
  }

  onSelectTree = (selectedKeys,info) =>{
    this.setState({
      selectTreeValue: info.node.props.title,
      selectTreeKey: selectedKeys[0],
      level:(info.node.props.level +1),
    })
    console.log('selected', selectedKeys, info);
  }

  render() {
    const { flag } = this.props;
    let { detialData = {} } = this.props.eduClassModule;
    if(flag===FLAG_ADD){
      detialData = {};
    }
    const { selectTreeValue } = this.state;
    const { ThrongList = [ ] } = this.props.eduAddModule
    const BaThrongListOption = ThrongList.map((item) =>
      <Option key={item.throngId} value= { item.throngId }>{ item.throngName }</Option>)
    const {form: { getFieldDecorator }} = this.props;
    const CourseAttrsOption = Object.keys(CourseAttrs).map((item) => <Option value={item}>{CourseAttrs[item]}</Option>)
    return (
      <div className={styles.main}>

        <Form>
          <FormItem {...formItemLayout} label="课程分类名称">
            {getFieldDecorator('classTypeName', {
              initialValue: handleEmptyStr(detialData.classTypeName) ,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input rows={4} placeholder="课程分类名称不能为空" />)}
          </FormItem>
          <Row>
            <Col span={12}>
              <Form.Item  {...formItemLayout2} label="课程分类属性">
                {getFieldDecorator('typeProperty', {
                  initialValue: isEmpty(detialData.typeProperty) ? "1" : `${detialData.typeProperty}`,
                })(
                  <Select placeholder="请选择课程分类属性">
                    {
                      CourseAttrsOption
                    }
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item   {...formItemLayout2} label="上级课程分类">
                {getFieldDecorator('上级课程分类', {
                })(<div className = {styles.defineInput}
                        onClick={()=>{this.setState({ treeVisiable:true })}}>
                  <div style={{width:'60%',paddingLeft:5}}>{ selectTreeValue }</div>
                  <div>
                  <IconFont type="iconarrow" style={{color:'#BFBFBF'}} />
                  </div>
                </div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12} >
              <Form.Item   {...formItemLayout2} label="所属人群">
                {getFieldDecorator('throngIdList', {
                  initialValue: Array.isArray(detialData.throngIdList)? detialData.throngIdList:[],
                  rules: [
                    {
                      type: 'array',
                    },
                  ],
                })(
                  <Select  mode="multiple" placeholder="请选择所属人群">
                    {
                      BaThrongListOption
                    }
                  </Select>)}
              </Form.Item>
            </Col>
          </Row>

          <Row className={styles.MarginLayout}>
            <Col span={leftSpan}>
              <div className={styles.RightText}>缩略图：</div>
            </Col>
            <Col span={rightSpan}>
              <div style={{width: '100%'}}>
                <Avatar limit ={1} fileList={this.state.smallFileList} onFileListChanage={ this.onFileListChanage } type="small"/>
                <div>80*80</div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={leftSpan}>
              <div className={styles.RightText}>大图：</div>
            </Col>
            <Col span={rightSpan}>
              <div style={{width: '100%'}}>
                <Avatar limit ={1}  fileList={this.state.bigFlieList} onFileListChanage={this.onFileListChanage} type="big"/>
                <div>360*120</div>
              </div>
            </Col>
          </Row>

          <Row className={styles.MarginLayout}>
            <Col span={leftSpan}>
              <div className={styles.RightText}>资讯模式：</div>
            </Col>
            <Col span={rightSpan}>
              <div style={{width: '100%'}}>
                <Radio.Group name="radiogroup" onChange={this.onChange} defaultValue={this.state.radioValue}>
                  <Radio value={1}>大图模式</Radio>
                  <Radio value={2}>小图模式</Radio>
                </Radio.Group>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="权重">
                {getFieldDecorator('weight', {  initialValue: handleEmptyStr(detialData.weight),})(<Input rows={4} placeholder="输入权重"/>)}
              </FormItem>
            </Col>
            <Col span={12}/>
          </Row>
          <div style={{display: flag === FLAG_ADD ? '': ''}}>
            <Row className={styles.MarginLayout2}>
              <Col span={leftSpan}>
                <div className={styles.RightText}>创建时间：</div>
              </Col>
              <Col span={rightSpan}>
                <div>
                  2018-09-18
                </div>
              </Col>
            </Row>
          </div>

          <Row className={styles.MarginLayout}>
            <Col span={leftSpan}>
              <div className={styles.RightText}>是否发布：</div>
            </Col>
            <Col span={rightSpan}>
              <div style={{paddingLeft: 10}}>
                <Switch checkedChildren="是" unCheckedChildren="否" checked={this.state.isOpen}
                        onChange={this.onSwitchOpenChange}/>
              </div>
            </Col>
          </Row>
          <div style={{display : flag===1002 ? 'none' : 'block'}}>
          <Divider/>
          <div className={styles.HCenter}>
            <div className={styles.HLayout}>
              <Button
                onClick={() => this.submit()}
                style={{width: 100, marginLeft: 20}}
                type="primary"
                shape="round"
              >
                确定
              </Button>
              <div className={styles.ButtonStyle}>
                <Button style={{width: 100, marginLeft: 20}} shape="round">取消</Button>
              </div>
            </div>
          </div>
          </div>

        </Form>
        <TreeDialog
          visiable = { this.state.treeVisiable }
          title="所属上级课程"
          treeData = {this.handleAllClassData()}
          onSelectTree = { this.onSelectTree }
          onTreeDialogCancle = {this.onTreeDialogCancle}
          />
      </div>
    );
  }
}

export default  Form.create()(EditClass);
