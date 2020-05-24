import React from 'react';
import styles from './index.less';
import {
  Card,
  Form,
  Input,
  Row,
  Col,
  Radio,
  Switch,
  Divider,
  Button,
  message,
  TreeSelect,
  DatePicker, Select
} from 'antd';
import { isEmpty} from "@/utils/utils";
import Avatar from "@/pages/infomation/EditinfomationPage/compont/Avatar";
import Edit from './compont/Edit'
import moment from "moment";
import {CourseAttrs, sourceWays, InfomationTypes, sourceModes} from "@/utils/map/DictionaryUtil";
import {connect} from "dva";
import NewVideoUpLoad from "@/pages/infomation/EditinfomationPage/compont/NewVideoUpLoad";
import request from '@/utils/request'
import { BaseUrl } from "@/utils/Constant";
import { TopTitle2 } from "@/components/ui/TopTitle";

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 3},
  wrapperCol: { span: 21},
};

const formTailLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span:18},
};
const fromoneLayout = {
  labelCol: { span: 2},
  wrapperCol: { span: 21},
};
const fromonemoreLayout = {
  labelCol: { span: 2,},
  wrapperCol: { span: 22,},
};

const fromFiveLayout = {
  labelCol: { span: 10,},
  wrapperCol: { span: 10,},
};


/**
 * 添加资讯
 */

@connect(({ eduAddModule, user, editinfomation }) =>
  ({
    eduAddModule,
    editinfomation,
    currentUser: user.currentUser,
  }),
)
class EditinfomationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smallFileList:[], // 缩略图
      bigFlieList:[], // 大图
      classValues: undefined, // 选择分类
      infoTypeName:2, //   1: '图文',2: '视频',3: '外链',
      isShowCommentNumCheck:true,  // 评论
      isSetVaildDateCheck:true,  // 设置有效期
      isReCommondCheck:true, // 是否为热门推荐
      htmlText:'', // 富文本标签
      videoUrl:'', // 视频地址
      cancelTime: '', // 下架时间
      isClickable: true, // 防止多次连续点击
    };
  }

  componentWillMount() {
    this.setState({
      infoTypeName: Number( this.props.match.params.key)
    })
    this.getCrowdList();
    this.getNewsTypeList();
  }

  // 请求人群列表
  getCrowdList = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/getBaThrongList',
      payload:{},
    });
  }

  // 请求所属分类
  getNewsTypeList = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'editinfomation/getNewsTypeList',
      payload:{},
    });
  }


  onSwitchVaildDateChange = (checked) => {
    this.setState({ isSetVaildDateCheck: checked })
  }


  onIsReCommondCheckChange = (checked) => {
    console.log(`switch to ${checked}`);
    this.setState({ isReCommondCheck:checked})
  }

  // 分类选择监听
  onTreeChange = value => {
    console.log(value);
    this.setState({ classValues: value });
  };

  // 富文本编辑器变化监听
  onChanageEditHtmlListener = (htmlText) => {
    this.setState({ htmlText })
  }

  // 介质日期
  onCancelTimeChange = (date, dateString) => {
    console.log('onCancelTimeChange',date, dateString);
    this.setState({ cancelTime: dateString })
  }

  // 保存
  submit = () => {

    const { isClickable, smallFileList, bigFlieList, isReCommondCheck ,htmlText, infoTypeName,videoUrl, cancelTime } = this.state;
    this.props.form.validateFields((err, data) => {
      if (!err) {
        if(smallFileList.length < 1 || bigFlieList.length < 1){
          message.info('缩略图或大图不能为空')
          return;
        }
        if( isEmpty(htmlText)&&infoTypeName !== 3 ){
          message.error('文字描述不能为空')
        }
        const  values = {
          ...data,
        }
        if(!isEmpty(cancelTime)){
          values.cancelTime = cancelTime;
          values.cancelType = 2;
        }

        values.isNominate = isReCommondCheck ? 1 : 0
        values.imagetbUrl1 = this.getUrl(smallFileList[0])
        if(smallFileList.length >1)
          values.imagetbUrl2 = this.getUrl(smallFileList[1])
        if(smallFileList.length >2)
          values.imagetbUrl3 = this.getUrl(smallFileList[2])
        values.imageUrl = this.getUrl(bigFlieList[0])
        console.log('Received values of form: ', values);
        if(infoTypeName !== 3){
          if(isEmpty(htmlText)){
            message.error(infoTypeName===2?'请填写视频简介':'请添加图文详情')
          }
          values.newsDesc = htmlText;
          if(infoTypeName === 2){
            console.log('videoUrlvideoUrl',videoUrl)
            values.newsUrl = videoUrl;
          }
        }
        values.newsSourceName = sourceWays[values.newsSourceId]
        if(!isClickable) return;
        this.insertNews(values)
      }
    });

  }

  // 添加资讯
  insertNews = (data) => {
    this.setState({ isClickable: false })
    request.post(`${BaseUrl}/news/health/baNews/news/insert  `, {
      data
    })
      .then( (response) => {
        if(response.code === 200){
          message.info('添加资讯成功')
        }else{
          message.info(response.msg)
        }
        this.setState({ isClickable: true })
        this.handleBackPage()
      })
      .catch( (error) => {
        console.log(error);
        this.setState({ isClickable: true })
      });
  }

  // 视频上传回调地址
  onResult = (url) =>{
    console.log('视频上传回调地址',url)
    this.setState({ videoUrl: url })
  }

  getUrl = (file) =>
    // eslint-disable-next-line no-nested-ternary
     file? file.response.code === 200?file.response.data:'':''

  onFileListChanage = (type,flieList) =>{
   console.log('图片列表type flieList',type,flieList)
    if(type==="small"){
      this.setState({ smallFileList: flieList })
    }else{
      this.setState({ bigFlieList: flieList })
    }
  }

  handleBackPage = () =>{
    this.props.history.push('/infomation/managepage')
  }

  render() {
    const {
            isShowCommentNumCheck , isSetVaildDateCheck,
            isReCommondCheck, cancelTime, infoTypeName
          } = this.state;
    const { ThrongList = [ ] } = this.props.eduAddModule
    const { typeSelectList = [] } = this.props.editinfomation
    const detial = null;
    const { form: { getFieldDecorator } } = this.props;
    // 人群
    const BaThrongListOption = ThrongList.map((item) =>
      <Option key={item.throngId} value= { item.throngId }>{ item.throngName }</Option>)
    // 资讯分类属性
    const CourseAttrsOption = Object.keys(CourseAttrs).map((item) => <Option value={item}>{CourseAttrs[item]}</Option>)

    // 来源渠道
    const SourceWaysOption = Object.keys(sourceWays).map((item) => <Option value={item}>{sourceWays[item]}</Option>)
    const rightUI =  <div className={styles.MyClick} onClick={ ()=>this.handleBackPage() }>返回上一页</div>
    return (
      <Card>
        <div className = {styles.main}>
            <div><TopTitle2 {...{ title: '资讯编辑', rightUI }} /></div>
          <div>
            <Form >
              <Row>
                <Col span={16}>
                  <FormItem {...formItemLayout}  label="资讯名称">
                    {getFieldDecorator('newsTitle', {
                      rules: [
                        {
                          required: true,
                          message:'请输入资讯名称'
                        },
                      ],
                      initialValue: detial ? detial.newsTitle : '',
                    })(<Input rows={1} placeholder = "请输入资讯名称" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formTailLayout}  label="简拼">
                    {getFieldDecorator('pinyin', {
                      initialValue:'',
                      rules: [
                        {
                          required: true,
                          message:'简拼不能为空'
                        },
                      ],
                    })(<Input rows={4} placeholder = "简拼不能为空" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formTailLayout}  label="资讯属性">
                    {
                      getFieldDecorator('newsProperty', {
                        rules: [
                          {
                            required: true,
                            message:'请选择资讯属性'
                          },
                        ],
                      initialValue:  detial ? `${detial.newsProperty}` : "" ,
                      })(<Select placeholder="请选择资讯属性">
                            {
                              CourseAttrsOption
                            }
                         </Select>
                         )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formTailLayout}  label="来源方式">
                    {
                      getFieldDecorator('sourceMode',
                        {
                          rules: [
                            {
                              required: true,
                              message:'请选择来源方式'
                            },
                          ],
                          initialValue:''
                        }
                      )(
                        <Select
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="请选择来源方式"
                        optionFilterProp="children"
                        >
                          {
                            Object.keys(sourceModes).map((item) => <Option value={item}>{sourceModes[item]}</Option>)
                          }
                        </Select>
                      )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formTailLayout}  label="来源渠道">
                    {
                      getFieldDecorator('newsSourceId', {
                        rules: [
                          {
                            required: true,
                            message:'请选择来源渠道'
                          },
                        ],
                       initialValue:  detial ? detial.newsSourceId : "" ,
                    })(
                        <Select
                          placeholder="请选择来源渠道"
                        >
                          {
                            SourceWaysOption
                          }
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>


              </Row>

              <Row>
                <Col span={16}>
                  <FormItem style={{color:"red"}} {...formItemLayout}  label="所属分类">
                    {getFieldDecorator('typeIds', {
                      // initialValue: [],
                      rules: [
                        {
                          required:true,
                          message:'请选择所属分类',
                          type: 'array'
                        },
                      ],
                      initialValue:[],
                    })(
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={this.state.classValues}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择所属分类"
                        treeData={typeSelectList}
                        allowClear
                        multiple
                        treeDefaultExpandAll
                        onChange={this.onTreeChange}
                        />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formTailLayout}  label="作者">
                    {getFieldDecorator('authorName', {
                      initialValue: detial ? detial.authorName : '',
                      rules: [
                        {
                          required: true,
                          message:'请输入作者名称'
                        },
                      ],
                    })(<Input rows={1} placeholder = "请输入作者名称" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <FormItem {...formItemLayout}  label="搜索关键字">
                    {getFieldDecorator('keyword', {
                      initialValue: detial ? detial.keyword : '',
                      rules: [
                        {
                          required: true,
                          message:'请输入搜索关键字'
                        },
                      ],
                    })(<Input rows={4} placeholder = "请输入搜索关键字" />)}
                  </FormItem>
                </Col>
                <Col span={8}>  <FormItem {...formTailLayout}  label="资讯类型">
                  {getFieldDecorator('resourceType', {
                    initialValue: infoTypeName ,
                  })(<div className={styles.defineInput} >{ InfomationTypes[infoTypeName] }</div>)}
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <FormItem style={{color:"red"}} {...formItemLayout}  label="推送人群">
                    {getFieldDecorator('throngIds', {
                      initialValue: [],
                      rules: [
                        {
                          message:'请选择推送人群',
                          type: 'array'
                        },
                      ],
                    })(
                      <Select  mode="multiple" placeholder="请选择推送人群">
                        {
                          BaThrongListOption
                        }
                      </Select>
                      )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={2}>
                  <div className={styles.leftContrlDiv}>
                    互动控制：
                  </div>
                </Col>
                <Col span={22}>
                  <Row>
                    <Col span={4}>
                      <Form.Item {...fromFiveLayout} label="显示阅读量">
                        {getFieldDecorator('isRead',
                          {
                            initialValue: detial ? detial.isRead : true,
                          })(
                            <Switch
                              checkedChildren="是"
                              unCheckedChildren="否"
                              defaultChecked
                            />
                            )}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item {...fromFiveLayout} label="可点赞">
                        {getFieldDecorator('isLike', {
                          initialValue: detial ? detial.isLike : true,
                        })(<Switch
                               checkedChildren="是"
                               unCheckedChildren="否"
                               defaultChecked
                             />
                               )}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item {...fromFiveLayout} label="可分享">
                        {getFieldDecorator('isRelay', {
                          initialValue: detial ? detial.isRelay === 1 : true
                        })(
                          <Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            defaultChecked
                            />
                          )}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item {...fromFiveLayout} label="可评论">
                        {getFieldDecorator('isReply', {
                          initialValue:isShowCommentNumCheck
                        })(<Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            defaultChecked
                            />
                          )}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item {...fromFiveLayout} label="可收藏">
                        {getFieldDecorator('isCollect', {
                          initialValue:detial ? detial.isCollect : true
                        })(
                          <Switch
                            defaultChecked
                            checkedChildren="是"
                            unCheckedChildren="否"
                           />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={2}>
                  <div className={styles.leftContrlDiv}>
                    封面样式：
                  </div>
                </Col>
                <Form.Item {...fromonemoreLayout} label="">
                  {getFieldDecorator('newsMode', {
                    initialValue:1
                  })(
                    <Radio.Group name="radiogroup"  onChange={this.onChange} defaultValue={ 1 }>
                      <Radio value={1}>小图模式(左图)</Radio>
                      <Radio value={2}>小图模式(右图)</Radio>
                      <Radio value={3}>多图模式(三张图)</Radio>
                      <Radio value={4}>大图模式</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Row>

              <Row style={{height:140}}>
                <Col span={2}>
                  <div className={styles.leftContrlDiv}>
                    缩略图：
                  </div>
                </Col>
                <Col span={22}>
                  <Avatar limit ={3} fileList={this.state.smallFileList} onFileListChanage={ this.onFileListChanage } type="small"/>
                  <div>80*80</div>
                </Col>
              </Row>

              <Row style={{height:120}}>
                <Col span={2}>
                  <div className={styles.leftContrlDiv}>
                    大图：
                  </div>
                </Col>
                <Col span={22}>
                  <Avatar  limit ={1} fileList={this.state.bigFlieList}onFileListChanage={this.onFileListChanage} type="big"/>
                  <div >360*120</div>
                </Col>
              </Row>
              <Row style={{ marginTop:30, display:infoTypeName === 2 ? 'block' : 'none' }}>

                <Col span={24}>
                  <FormItem {...formItemLayout} label= "上传视频">
                    {getFieldDecorator('newsUrl', {
                      rules: [
                        {
                          message:'请输入视频链接'
                        },
                      ],
                      initialValue: this.state.videoUrl,
                    })(
                      <div>
                        <div>
                          <NewVideoUpLoad onResult = { this.onResult }/>
                        </div>
                      </div>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ marginTop:30, display:infoTypeName === 3 ? 'block' : 'none' }} >
                <Col span={2}>
                  <div className={styles.leftContrlDiv}>
                    资讯详情url：
                  </div>
                </Col>
                <Col span={22}>
                  <Form.Item label="">
                    {getFieldDecorator('newsUrl', {
                      initialValue: '',
                      rules: [
                        {
                          required: infoTypeName === 3,
                          message:'请输入资讯详情url',
                        }
                       ]
                    })(<Input rows={4} placeholder = "请输入资讯详情url" />)}
                  </Form.Item>
                </Col>
              </Row>
              <div style={{display:infoTypeName === 3 ? 'none' : 'block', }} >
                <div className={styles.EditStyle}>
                  <div>
                     { infoTypeName === 2 ? '视频介绍':'资讯详情'}：
                  </div>
                  <div>
                    <Edit onChanageEditHtmlListener = { this.onChanageEditHtmlListener } />
                  </div>
                </div>
              </div>

              <Row>
                <Col span={2}>
                  <div className={styles.leftContrlDiv}>
                    设置有效期：
                  </div>
                </Col>
                <Col span={2}>
                  <Form.Item {...fromonemoreLayout} label="">
                    <Form.Item {...fromFiveLayout} label="">
                      {getFieldDecorator('设置有效期', {
                         initialValue:isSetVaildDateCheck
                      })(<Switch
                          checked={ isSetVaildDateCheck }
                          onChange={ this.onSwitchVaildDateChange }
                          checkedChildren="是"
                          unCheckedChildren="否"
                           />)}
                    </Form.Item>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item  {... {
                    labelCol: { span: 4,},
                    wrapperCol: { span: 20,},
                  }} label="有效期至">
                    {getFieldDecorator('有效期', {
                      rules: [{ type: 'object', required: false, message: '请选择有效期' }],
                      initialValue: isEmpty(cancelTime) ? null : moment(cancelTime) ,
                    })(<DatePicker  onChange={ this.onCancelTimeChange } />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={2}>
                  <div className={styles.leftContrlDiv}>
                    加入推荐栏目：
                  </div>
                </Col>
                <Col span={2}>
                    <Form.Item {...fromFiveLayout} label="">
                      {getFieldDecorator('加入推荐栏目', {

                        initialValue: isReCommondCheck,
                      })(<Switch
                        checkedChildren="是"
                        unCheckedChildren="否"
                        checked={isReCommondCheck}
                        onChange={this.onIsReCommondCheckChange}/>)}
                    </Form.Item>
                </Col>
              </Row>

            </Form>
          </div>
        </div>
        <Divider/>
        <div className={styles.HLayout}>
          <Button onClick={()=>this.submit()} style={{width:100,marginLeft:20}} type="primary" shape="round" >保存</Button>
          <div className={styles.ButtonStyle}>
            {/* <Button style={{width:100,marginLeft:20}} shape="round" >预览</Button> */}
            {/* <Button style={{width:100,marginLeft:20}} shape="round" >取消</Button> */}
          </div>
        </div>

      </Card>
    );
  }
}

export default Form.create()(EditinfomationPage);
