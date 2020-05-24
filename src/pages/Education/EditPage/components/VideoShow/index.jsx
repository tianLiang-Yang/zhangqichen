import React from 'react';
import styles from './index.less';
import { connect } from "dva";
import UpVideo from "@/pages/Education/EditPage/components/VideoShow/UpVideoOrText";
import {Modal, Table, Col, Row, Divider} from "antd";
import * as Colums from "@/pages/Education/ManagePage/help/Colums";
import PlayerVideo from "@/pages/Education/EditPage/components/VideoShow/PlayerVideo";
import AddVideo from "@/pages/Education/EditPage/components/VideoShow/AddVideo";
import IconFont from "@/components/IconFont";
import {AppColor} from "@/utils/ColorCommom";
import shanchuIcon from '@/img/shanchu.png'
import {FLAG_ADD, FLAG_SEE, handleEmptyStr, isEmpty, toTimestr} from '@/utils/utils'
import AddText from './AddText'
import defalureImage from "@/img/defalute_failure.png";


@connect(({ eduAddModule,user,eduManageModule }) =>
  ({
    eduManageModule,
    eduAddModule,
    currentUser: user.currentUser,
  }),
)

class VideoShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlayer: false,
      videoUrl: '',
      visiableTextAdd:false, // 添加图文弹出框
      visiableVideoAdd:false,
      typeShow: 0, // 0- 添加 1 - 修改 2-查看
      current: null,
      multiTypeRadioValue: 0, // 当前选择是多课程还是单课程 默认单课程
      childList:[],
    };
  }

  /**
   * 获取课堂下的课程
   */
  getHttpList = () => {
    const { courseId= '' } = this.props.eduAddModule;
    const id = courseId
    const { fromDataParams } = this.props
    if(fromDataParams&&fromDataParams.courseId){
      const { dispatch } = this.props;
      dispatch({
        type: 'eduAddModule/classCourseInfoDetialById',
        payload:{
          data:{
            courseId: fromDataParams.courseId
          },
          cb:(data)=>{
            const list =  data ? [ data ] : []
            this.setState({childList:list})
            this.props.toControllVisiableUpLode(list.length>0)
          }
        },
      });
      return;
    }
    if(id === ""){
      return;
    }
    console.log('addCourseListener','id',id)
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/getChildList',
      payload:{
        data:{
          classId: id
        },
        cb:(list)=>{
          this.setState({childList:list})
          this.props.toControllVisiableUpLode(list.length>0)
          if(this.props.getCourseId) this.props.getCourseId(list.length > 0 ? list[0].courseId : null)
        }
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.detialInfo!== nextProps.detialInfo){
      if(nextProps.detialInfo){
        this.setState({multiTypeRadioValue: nextProps.detialInfo.isMultiCourse})
      }
      console.log('listlistlist','componentWillReceiveProps')
      this.getHttpList()
    }
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  /**
   * des 隐藏添加课程的UI，根据添加课程的类型展示单课程UI或者是多课程UI
   * type 0 - 单课程 1- 多课程
   * */
  addCourseListener = () =>{
    console.log('addCourseListener')
  //  修改成功的回调
      this.setState({ visiableVideoAdd: false, visiableTextAdd: false })
      this.getHttpList();
  }

  testModth = (record,flag) =>{
    this.setState({ current :record})
    if(flag === 1){
      this.setState({
        visiableVideoAdd:true,
        typeShow: 2
      })
    } else if(flag === 2){ // 播放
      this.setState({
        isPlayer: true,
        videoUrl: record.courseUrl,
      })
    }else if(flag === 3){ // 修改
      const { resourceType } = this.props.eduManageModule
      if(resourceType === 1){
        this.setState({ visiableVideoAdd: true,  typeShow: 1 })
      }else{
        this.setState({ visiableTextAdd: true,  typeShow: 1 })
      }
    }else if(flag === 4){ // 删除
      const { dispatch } = this.props;
      dispatch({
        type: 'eduAddModule/ClassCourseDelete',
        payload:{
          courseId: record.courseId,
          cb:()=>{
            this.getHttpList()
          }
        },
      });
    }
  }

  // onchanage
  onChangeMultiTypelistener = (value) =>{
    this.setState({
      multiTypeRadioValue: value,
    });
  }

  // 获取 表头
  getColumns = (showType) => {
    const columns = Colums.CommonChildColumns();
    if(showType === FLAG_SEE ) return
    columns.push(  {
        title: '操作',
        key: '操作',
        render: (text, record) => (
          <div>
            <div>
            <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
              <span onClick={() =>{
                this.testModth(record, 1)
              }}>查看</span>
              <Divider type="vertical" />
              <span onClick={() =>  this.testModth(record, 2)}>播放</span>
            </span>
            </div>
            <div>
                <span style={{ color: AppColor.Green, cursor: 'pointer' }}>
                  <span onClick={() =>  this.testModth(record, 3)}>修改</span>
                  <Divider type="vertical" />
                  <span onClick={() =>  this.testModth(record, 4)}>删除</span>
                </span>
            </div>

          </div>
        ),
      },
    )
    return columns
  }

  cancleDialog = () => {
    this.setState({
      visiableTextAdd:false, // 添加图文弹出框
      visiableVideoAdd:false,
    })
  }

  render() {
    console.log('this.props.isAppend====>',this.props.isAppend)
    const {  childList = [],isPlayer, videoUrl, visiableVideoAdd, typeShow,current,visiableTextAdd,multiTypeRadioValue } = this.state;
    const { id, showType } = this.props;
    const { coverImgUrl } = this.props.eduAddModule;
    const { resourceType } = this.props.eduManageModule
    const columns =this.getColumns(showType);
    const Mystyle = { marginTop: 10 }
    const singleCuourseRecord = childList.length >0 ? childList[0] : {}
    return (
      <div className={styles.main}>
        <div style={{ display:childList.length === 0 ?  'block' : 'none' }}>
          <UpVideo
            isAppend = { this.props.isAppend }
            id = { id }
            updateData = {this.props.updateData}
            onChangeMultiTypelistener = { this.onChangeMultiTypelistener }
            addCourseListener = { this.addCourseListener }
          />
        </div>
        <div  style={{ display:childList.length > 0 &&  multiTypeRadioValue !== 0 ? 'block' : 'none', marginBottom:20 }}>
          <div onClick={ () => {
            if(resourceType === 1){
              this.setState({
                visiableVideoAdd:true,
                typeShow: 0,
              })
            }else{
              this.setState({
                visiableTextAdd:true,
                typeShow: 0,
              })
            }
          }}>
            <IconFont type = "iconiconjia" style={{fontSize:20,marginTop: 10,marginBottom:10}}/>&nbsp;&nbsp;添加课程
          </div>
          <Table
            columns={columns}
            dataSource={ childList }
            pagination={false}
          />
        </div>

        <div style={{ display: childList.length > 0 &&  multiTypeRadioValue === 0 ? 'block' : 'none' }}>

        <div className={styles.MyCourse}>
          <div style={{width:'70%'}}>
            <Row>
              <Col span={8}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img style={{width:240, height:160}}  src={  isEmpty(coverImgUrl)? defalureImage : handleEmptyStr(coverImgUrl)}/>
              </Col >
              <Col span={16}>
                <div className={styles.BaseInfo}>
                  <Row style={ Mystyle }>
                    <Col>
                      课程节次：
                      <span className={styles.MySpan}>
                        { handleEmptyStr(singleCuourseRecord.seqno) }
                      </span>
                    </Col>
                  </Row>
                  <Row style={ Mystyle }>
                    <Col>
                      课程标题：
                      <span className={styles.MySpan}>
                        { handleEmptyStr(singleCuourseRecord.courseName) }
                      </span>
                    </Col>
                  </Row>
                  <Row style={ { display: resourceType === 3 ? 'none' : 'block' ,marginTop: 10 } }>
                    <Col>
                      类型/时长：
                      <span className={styles.MySpan}>
                        { (singleCuourseRecord.duration/60).toFixed(2)}
                      </span>
                    </Col>
                  </Row>
                  <Row style={ Mystyle }>
                    <Col>
                      讲师：
                      <span className={styles.MySpan}>
                        { handleEmptyStr(singleCuourseRecord.lecturer) }
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col style={ Mystyle }>
                      创建：
                      <span className={styles.MySpan}>
                        { handleEmptyStr(singleCuourseRecord.createUserName) }
                        {handleEmptyStr(toTimestr(singleCuourseRecord.ctstamp))}
                      </span>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>

          <div style={{ display: showType === FLAG_SEE ? 'none' : 'block'}}>
            <div
              className={styles.MyIconBox}
              onClick={ ()=>this.testModth(singleCuourseRecord,2)}>
              <div>
                <IconFont type="iconbofang1"  style={{color:AppColor.Green,fontSize:20}}/>
              </div>
              <div>播放</div>
            </div>
            <div
              className={styles.MyIconBox}
              onClick={ ()=> this.testModth (singleCuourseRecord,3)}>
              <div>
                <IconFont type="iconxiugai1" style={{color:AppColor.Green,fontSize:16}}/>
              </div>
              <div>修改</div>
            </div>
            <div
              className={styles.MyIconBox}
              onClick={ ()=>this.testModth (singleCuourseRecord,4)}>
              <div>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={ shanchuIcon } style={{height:16}}/>
              </div>
              <div>删除</div>
            </div>

          </div>
        </div>
        </div>
        <Modal
          title="视频播放"
          visible={ isPlayer }
          onCancel={() => {
            this.setState({ isPlayer: false });
          }}
          destroyOnClose // 关闭时销毁 Modal 里的子元素
          maskClosable={false} // 点击遮照能不能关闭Modal
          footer={null} // 底部按钮
          width = { 740 }
          bodyStyle = {{ padding: '28px 24px' }}
          wrapClassName="report-modal-wrap"
        >
          <PlayerVideo videoUrl={ videoUrl }/>
        </Modal>
        <Modal
          title="编辑子课堂"
          visible={ visiableVideoAdd }
          onCancel={() => {
            this.setState({ visiableVideoAdd: false , typeShow: 0});
          }}
          destroyOnClose // 关闭时销毁 Modal 里的子元素
          maskClosable={false} // 点击遮照能不能关闭Modal
          footer={null} // 底部按钮
          width="60vw"
          style={{
            top: 20,
            bottom: 20,
          }}
          bodyStyle={{ overflow: 'scroll', height: '85vh' }}
          wrapClassName="report-modal-wrap"
        >
          <AddVideo
            isAppend = { this.props.isAppend }
            id = { id }
            current = { current }
            typeShow = { typeShow }
            addCourseListener = { this.addCourseListener }
            cancleDialog = { this.cancleDialog }
            />
        </Modal>

        <Modal
          title="编辑子课堂"
          visible={ visiableTextAdd }
          onCancel={() => {
            this.setState({ visiableTextAdd: false , typeShow: 0});
          }}
          destroyOnClose // 关闭时销毁 Modal 里的子元素
          maskClosable={false} // 点击遮照能不能关闭Modal
          footer={null} // 底部按钮
          width="80vw"
          style={{
            top: 10,
            bottom: 10,
          }}
          bodyStyle={{ overflow: 'scroll', height: '90vh' }}
          wrapClassName="report-modal-wrap"
        >
          <AddText
            id = { id }
            isAppend = { this.props.isAppend }
            current = { current }
            typeShow = { typeShow }
            cancleDialog = { this.cancleDialog }
            addCourseListener = { this.addCourseListener }
          />
        </Modal>
      </div>

    );
  }
}

export default VideoShow;
