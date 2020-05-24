import React from 'react';
import {Form, Radio, Switch, Row, Col } from 'antd';
import styles from './index.less';
import { CourseAttrs } from '@/utils/map/DictionaryUtil'
import {connect} from "dva";
import { handleEmptyStr, handleImageUrl, toTimestr } from "@/utils/utils";
import defalute from '@/img/defalute_failure.png'

const FormItem = Form.Item;


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

@connect(({ eduClassModule , user }) =>
  ({
    eduClassModule,
    currentUser: user.currentUser,
  }),
)

class EditDetialClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smallImageUrl: '', // 缩略图
      bigImageUrl: '', // 大图
      radioValue: 1,
      isOpen: true,
      selectTreeValue:'',
    };
  }

  componentDidMount() {
    const { dispatch , id } = this.props;
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

  getImageUrl = (url) => ({
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url,
    })

  callbackDetial = ()=>{
    const { detialData = {} } = this.props.eduClassModule;
    this.setState({
      smallImageUrl:handleImageUrl(detialData.imagetbUrl),
      bigImageUrl:handleImageUrl(detialData.imageUrl),
      selectTreeValue: handleEmptyStr(detialData.classTypeName),
      radioValue:detialData.typeMode,
      isOpen: detialData.isRelease === 1,
    })
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  onImageError = (value) =>{
    if(value === 1){
      this.setState({ smallImageUrl:defalute})
    }else{
      this.setState({ bigImageUrl:defalute})
    }
  }

  render() {
    const { detialData = {} } = this.props.eduClassModule;
    const { selectTreeValue, smallImageUrl, bigImageUrl } = this.state;

    const {form: { getFieldDecorator }} = this.props;
    return (
      <div className={styles.main}>

        <Form>
          <FormItem {...formItemLayout} label="课程分类名称">
            {getFieldDecorator('classTypeName', {
            })(
              <div className = {styles.defineInput}>
               <div className={styles.RightDiv}>{ handleEmptyStr(detialData.classTypeName) }</div>
              </div>)}
          </FormItem>
          <Row>
            <Col span={12}>
              <Form.Item  {...formItemLayout2} label="课程分类属性">
                {getFieldDecorator('typeProperty', {
                })(
                  <div className = {styles.defineInput}>
                    <div className={styles.RightDiv}>{ handleEmptyStr(CourseAttrs[handleEmptyStr(detialData.typeProperty)]) }</div>
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item   {...formItemLayout2} label="上级课程分类">
                {getFieldDecorator('上级课程分类', {
                })(<div className = {styles.defineInput}>
                  <div className={styles.RightDiv}>{ selectTreeValue }</div>
                </div>)}
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col span={12} >
              <Form.Item   {...formItemLayout2} label="所属人群">
                {getFieldDecorator('所属人群', {
                  initialValue: "所有人群",
                })(
                  <div className = {styles.defineInput}>
                    <div className={styles.RightDiv}>所有人群</div>
                  </div>)}
              </Form.Item>
            </Col>
          </Row>

          <Row className={styles.MarginLayout}>
            <Col span={leftSpan}>
              <div className={styles.RightText}>缩略图：</div>
            </Col>
            <Col span={rightSpan}>
              <div style={{width: '100%'}}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img style={{maxWidth:100}} src={smallImageUrl} onError={()=>this.onImageError(1)}/>
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
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img style={{maxWidth:200}} src={handleImageUrl(bigImageUrl)} onError={()=>this.onImageError(2)}/>
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
                  <Radio value={1} disabled>大图模式</Radio>
                  <Radio value={2} disabled>小图模式</Radio>
                </Radio.Group>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="权重">
                {getFieldDecorator('weight')(
                  <div className = {styles.defineInput}>
                    <div className={styles.RightDiv}>{handleEmptyStr(detialData.weight)}</div>
                  </div>)}
              </FormItem>
            </Col>
            <Col span={12}/>
          </Row>

          <Row className={styles.MarginLayout2}>
            <Col span={leftSpan}>
              <div className={styles.RightText}>创建时间：</div>
            </Col>
            <Col span={rightSpan}>
              <div>
                { toTimestr(detialData.ctstamp) }
              </div>
            </Col>
          </Row>

          <Row className={styles.MarginLayout}>
            <Col span={leftSpan}>
              <div className={styles.RightText}>是否发布：</div>
            </Col>
            <Col span={rightSpan}>
              <div className={styles.RightDiv} >
                <Switch disabled checkedChildren="是" unCheckedChildren="否" checked={this.state.isOpen}/>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default  Form.create()(EditDetialClass);
