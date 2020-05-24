import React from 'react';
import {Card, message, Button, Modal, Table, Empty } from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';

import CloseIcon from '@/img/curose_close.png'
import ShowIcon from '@/img/curose_show.png'
import AuditCourse from './components/AuditCourse'
import VidecIcon from '@/img/ed_video.png'
import AuditIcon from '@/img/ed_audit.png'
import TextIcon from '@/img/ed_text.png'
import {connect} from "dva";
import ClassCourseSelectList from './components/ClassCourseSelectList'
import VideoShow from "@/pages/Education/EditPage/components/VideoShow";
import {deleteArrayOfIndex, FLAG_ADD, FLAG_SEE, getArrayOfIndex, handleEmptyStr, toTimestr2} from "@/utils/utils";
import {childColumns, parentColumns} from "@/pages/Education/ManagePage/help/Colums";
import UtilStyles from "@/utils/utils.less";
import PlayerVideo from "@/pages/Education/EditPage/components/VideoShow/PlayerVideo";
import {AppColor} from "@/utils/ColorCommom";

@connect(({ eduAddModule,user, eduManageModule,  }) =>
  ({
    eduAddModule,
    eduManageModule,
    currentUser: user.currentUser,
    isClickable: eduAddModule.isClickable,
    classRoomInfo: eduAddModule.classRoomInfo ? eduAddModule.classRoomInfo : {},
    childList:  eduAddModule.classRoomInfo.list || [],
    classCourseDetial: eduAddModule.classCourseDetial || [],
  }),
)
// resourceType :1, // '资源类型：1-视频 2-音频，3-图文 4-文件 ）',
class EditClassRoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "", // 课堂id
      visiableSelectClassCourse: false, // 选择课程
      visiableAudit: false, // 审核
      detialInfo: null, // 课堂详情
      showType: FLAG_ADD,// 进入界面的行为展示
      videoUrl: undefined, // 视频地址
      isPlayer: false, // 是否弹出播放框
      isMore: false,
      visiableUpLode: false,
      fromDataParams: undefined, // 上级页面传过来的参数
      courseId: undefined,
      isEmptyShowUI : true // 是否显示空界面
    }
  }

  componentDidMount() {
    const data = JSON.parse(this.props.match.params.data)
    this.setState({
      id: handleEmptyStr(data.id),
      showType: data.type,
      fromDataParams: data || {},
      courseId: data ? data.courseId: undefined
    },()=>{
      if(this.state.id) {
        this.getClassRoomBaseInfo(this.state.id)
        this.getInfoDetial()
        this.setState({ isEmptyShowUI: false })
      }
    })
  }


  /**
   * 选择课程的回调
   * @param record
   */
  onSelectResult = (record) => {
    // 保存当前的课程
    this.setState({
      id: record.classId,
      visiableSelectClassCourse: false,
      isEmptyShowUI: false
    },()=>{
      this.toUpdateClassIdOfModel()
    })
   this.getClassRoomBaseInfo(record.classId)
  }

  /**
   * 根据课堂ID请求课堂基本信息
   * @param classId  根据课堂ID
   */
  getClassRoomBaseInfo =  (classId) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/fetchClassRoomInfoByclassId',
      payload:{
        data:{
          classId
        },
        cb:(record)=>{
          this.setCoverIamgeOfModel(record.imagetbUrl||'') // 更新model中的值
        }
      },
    });
  }

  /**
   * 更新model中的值
   * @param url 北京图片的url
   */
  setCoverIamgeOfModel = (url) => {
    const { dispatch} = this.props;
    dispatch({
      type: 'eduAddModule/updateCoverImage',
      payload: {
        data:url
      }
    })
  }

  onChlidRef = (ref) => {
    this.child = ref;
  }

  /**
   * 获取课程详情
   */
  getInfoDetial = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/classCourseDetial',
      payload:{
        data: {classId:this.state.id },
        cb:(res)=>{
          this.setState({ detialInfo: res },() => {
          })
        }
      },
    });
  }

  /**
   * 更新model上的存储的classId
   */
  toUpdateClassIdOfModel = () => {
    const { id } = this.state
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/updateClassId',
      payload: id,
    });
  }

  //获取添加后的courseID
  getCourseId = (id) => {
    this.setState({courseId: id})
  }

  MyTitleBar = (leftIcon,leftTitle,rightTitle,rightSave,rightCancle,flag) =>
           <div className={styles.MyTitleBar}>
              <div>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={ leftIcon }/>
                <span>{ leftTitle }</span>
              </div>
              <div style={{ visibility: this.state.showType === FLAG_SEE ? 'hidden' : 'visible' }}>
                <div id={`rightTitle${flag}`}>{ rightTitle }</div>
                <div id = { `save${flag}` }
                     onClick={ () => this.OnSaveOrShowChildClickListener(flag) }
                >
                  { rightSave }
                </div>
                <div
                  id = { `cancle${flag}`}
                  style = {{ display:'none'}}
                  onClick={ () => this.OnCancleClickListener(flag) }>
                  { rightCancle }
                </div>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img style={{display: flag === 4 ? 'none' : 'block'}} id={`icon${flag}`} src={ CloseIcon }/>
              </div>
           </div>

  // 保存
  OnSaveOrShowChildClickListener = (flag) =>{
    const saveText = document.getElementById(`save${flag}`);
    const cancleText = document.getElementById(`cancle${flag}`);
    const barIcon = document.getElementById(`icon${flag}`);
    switch (Number(flag)) {
      case 3:
        if(saveText.textContent === "上传") {
          saveText.style.display = 'none'
          barIcon.src = ShowIcon;
          cancleText.style.display = 'block'
        }
        break;
      case 4:
        if(saveText.textContent === "审核") {
          if( !this.state.visiableUpLode){
            message.error("至少上传一个子课程")
            return;
          }
          saveText.style.display = 'none'
          barIcon.src = ShowIcon;
          cancleText.style.display = 'block'
          this.setState({ visiableAudit: true})
        }
        break;
      default:
        break
    }

  }

  // 取消
  OnCancleClickListener = (flag) =>{
    const saveText = document.getElementById(`save${flag}`);
    const cancleText = document.getElementById(`cancle${flag}`);
    const barIcon = document.getElementById(`icon${flag}`);
     if( flag === 3){
      saveText.style.display = 'block'
      cancleText.style.display = 'none'
      barIcon.src = CloseIcon;
    }else if( flag === 4){
      saveText.style.display = 'block'
      cancleText.style.display = 'none'
      barIcon.src = CloseIcon;
      this.setState({ visiableAudit: false })
    }

  }

  // 提交
  submit = () =>{
    this.child.auditCourseHttp(this.state.courseId)
  }

  // 返回上一级
  handleBackPage = () =>{
    this.props.history.push('/education/manage')
  }

  /**
   * 控制视频模块是否展示，在非添加状态
   */
  toControllVisiableUpLode = (visiableUpLode) => {
    this.setState({ visiableUpLode, visiableAudit: visiableUpLode })
  }

  render() {
    const { resourceType } = this.props.eduManageModule;
    const { classRoomInfo, childList = [] } = this.props;
    const { isEmptyShowUI, isPlayer, isMore, videoUrl, visiableSelectClassCourse, showType , visiableAudit , id, detialInfo } = this.state;
    const upVideoBar = this.MyTitleBar( resourceType === 1 ? VidecIcon : TextIcon,resourceType === 1 ? '上传视频' : '上传图文','上传课程资料','上传','完成',3);
    const upCuroseBar = this.MyTitleBar( AuditIcon ,'发布审批信息','','','取消',4);
    const rightUI =  <div className={styles.MyClick} onClick={ ()=>this.handleBackPage() }>返回上一页</div>
    const mParentCloums = parentColumns(null,0)
    const childCloums = childColumns(classRoomInfo || '' ,null,0)
    const mChildCloums = deleteArrayOfIndex(  childCloums.length -1 ,childCloums)
    console.log('classRoomInfo',[classRoomInfo] )
    const childLast = { title: '', dataIndex: 'lecturer', key: 'lecturer',
      render: (text, record) => (
      <span
        style={{ color: AppColor.Green , cursor: 'pointer'}}
        onClick={() => { this.setState({ videoUrl: record.courseUrl, isPlayer: true })}}>
        播放
      </span>)
      }
    if(resourceType === 1) mChildCloums.push(childLast)
    return (
      <Card className={ UtilStyles.MySmallTable }>
        <TopTitle2 {...{ title: '追加子课程', rightUI }} />
        <div style={{ display: isEmptyShowUI ? 'block': 'none'}} className={ styles.EmptyContainer }>
          <div className={styles.EmptyContainer}>
            <Empty description={false} >
              <div style={{ fontWeight: 'bold'}}>您还没有追加子课程</div>
              <div style={{ color: AppColor.Gray}}>追加子课程前必须要选择一个主课程，请点击<br/>
                下方按钮选择</div>
              <Button
                style={{ marginTop: 10 }}
                type="primary"
                shape="round"
                onClick={ () => { this.setState({ visiableSelectClassCourse: true })} }>
                选择的主课程
              </Button>
            </Empty>
          </div>
        </div>
        <div style={{ display: !isEmptyShowUI ? 'block': 'none'}}>
          <Table
            style={{ marginTop: 10 }}
            columns={ deleteArrayOfIndex(mParentCloums.length - 1, mParentCloums)}
            dataSource={  [classRoomInfo] || [] }
            pagination={ false }
          />
          <div>
            <div style={{ display: childList.length === 0 ? 'none' : 'block '}}>
              <Table
                columns={ mChildCloums }
                dataSource={ !isMore ? getArrayOfIndex(2,childList) : childList}
                pagination={ false }
              />
            </div>
            <div>
              <div className={ styles.HLayoutCenter}  style={{ display: childList.length < 3 ? 'none' : 'block '}}>
                <img
                  src={ isMore ? CloseIcon : ShowIcon}
                  onClick={()=>{ this.setState({ isMore: !isMore })}}
                  alt="" />
              </div>
            </div>
          </div>
          <div>
            {
              upVideoBar
            }
            <div>
              <VideoShow
                id = { id }
                isAppend = { 1 }
                showType = { showType }
                detialInfo = { detialInfo }
                toControllVisiableUpLode = { this.toControllVisiableUpLode }
                fromDataParams = { this.state.fromDataParams }
                getCourseId = {this.getCourseId}
              />
            </div>
            <div style={{display: FLAG_SEE !== showType ? 'block' : 'none' }}>
            {
              upCuroseBar
            }
              <div style={{display: visiableAudit ? 'block' : 'none' }}>
                 <AuditCourse
                   onChlidRef = {this.onChlidRef }
                   handleBackPage = { this.handleBackPage }
                 />
              </div>
            </div>
            <div style={{display: FLAG_SEE !== showType ? 'block' : 'none' }}>
              <Button
                onClick={() => this.submit()}
                style={{width: 100, marginLeft: 20,marginTop:20}}
                type="primary"
                shape="round"
              >
                提交
              </Button>
            </div>
          </div>
          <Modal
            title="选择主课程"
            visible={ visiableSelectClassCourse }
            onCancel={() => {
              this.setState({ visiableSelectClassCourse: false });
            }}
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="80vw"
            style={{
              top: 20,
              bottom: 20,
            }}
            bodyStyle={{ overflow: 'scroll', height: '85vh' }}
            wrapClassName="report-modal-wrap"
          >
              <ClassCourseSelectList resourceType={resourceType} onSelectResult={ this.onSelectResult }/>
          </Modal>

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
        </div>
      </Card>
    );
  }
}

export default EditClassRoomPage;
