import React from 'react';
import {Card, message, Button } from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';

import CloseIcon from '@/img/curose_close.png'
import ShowIcon from '@/img/curose_show.png'
import EditClass from './components/EditClass'
import CoverImage from './components/CoverImage'
import AuditCourse from './components/AuditCourse'
import BaseInfoIcon from '@/img/ed_baseinfo.png'
import VidecIcon from '@/img/ed_video.png'
import CoverIcon from '@/img/ed_cover.png'
import AuditIcon from '@/img/ed_audit.png'
import TextIcon from '@/img/ed_text.png'
import {connect} from "dva";
import VideoShow from "@/pages/Education/EditPage/components/VideoShow";
import {handleEmptyStr} from "@/utils/utils";

@connect(({ eduAddModule,user, eduManageModule }) =>
  ({
    eduAddModule,
    eduManageModule,
    currentUser: user.currentUser,
    isClickable: eduAddModule.isClickable
  }),
)

class EditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "", // 课堂id
      // id: "159185480666185728", // 课堂id
      visiableBaseInfo: true, // 基础信息模块是否可见
      visiableCoverImage: false, // 封面模块是否课件
      visiableUpLode: false,// 上传
      visiableAudit: false, // 审核
      resourceType :1, // '资源类型：1-视频 2-音频，3-图文 4-文件 ）',
      isCoverComplete : false, // 封面是否设置完毕
      detialInfo: null, // 课堂详情
    };
  }

  componentDidMount() {
    this.setState({
      id: handleEmptyStr(this.props.match.params.id)
    },()=>{
      if(this.state.id) this.getInfoDetial()
      const saveText = document.getElementById(`save${1}`);
      const cancleText = document.getElementById(`cancle${1}`);
      const barIcon = document.getElementById(`icon${1}`);
      saveText.innerText = '保存'
      cancleText.style.display = 'block'
      barIcon.src = ShowIcon;
      const { resourceType } = this.props.eduManageModule;
      this.setState({ visiableBaseInfo: true, resourceType })
    })

  }

  onChlidBaseRef = (ref) => {
    this.baseChild  = ref;
  }

  onChlidCoverRef = (ref) => {
    this.coverChild  = ref;
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
          this.setState({ detialInfo: res })
        }
      },
    });
  }

  MyTitleBar = (leftIcon,leftTitle,rightTitle,rightSave,rightCancle,flag) =>
           <div className={styles.MyTitleBar}>
              <div>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={ leftIcon }/>
                <span>{ leftTitle }</span>
              </div>
              <div>
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
                <img id={`icon${flag}`} src={ CloseIcon }/>
              </div>
           </div>

  // 保存
  OnSaveOrShowChildClickListener = (flag) =>{
    if(flag !==1 && this.state.id === ""){
        message.error("请先完成基本信息的填写")
        return;
    }
    const saveText = document.getElementById(`save${flag}`);
    const cancleText = document.getElementById(`cancle${flag}`);
    const barIcon = document.getElementById(`icon${flag}`);
    switch (Number(flag)) {
      case 1: // 基本信息
        // eslint-disable-next-line no-case-declarations
        if(saveText.textContent === "设置"){
          saveText.innerText = '保存'
          cancleText.style.display = 'block'
          barIcon.src = ShowIcon;
          this.setState({ visiableBaseInfo: true })
        }else{
          // 保存点击事件
            this.baseChild.toSaveAction();
        }
        break;
      case 2: // 封面
        if(saveText.textContent === "设置"){
          saveText.innerText = '完成'
          cancleText.style.display = 'block'
          barIcon.src = ShowIcon;
          this.setState({ visiableCoverImage: true })
        }else{
          // 保存点击事件
          this.coverChild.toSaveCoverAction();
        }
        break;
      case 3:
        if(saveText.textContent === "上传") {
          if(!this.state.isCoverComplete){
            message.error("请设置封面信息")
            return;
          }
          saveText.style.display = 'none'
          barIcon.src = ShowIcon;
          cancleText.style.display = 'block'
          this.setState({ visiableUpLode: true})
        }
        break;
      case 4:
        if(saveText.textContent === "审核") {
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
    if(flag === 1){
      saveText.innerText = '设置'
      cancleText.style.display = 'none'
      barIcon.src = CloseIcon;
      this.setState({ visiableBaseInfo: false });
    }else if( flag === 2){

      saveText.innerText = '设置'
      cancleText.style.display = 'none'
      barIcon.src = CloseIcon;
      this.setState({ visiableCoverImage: false })
    }else if( flag === 3){
      saveText.style.display = 'block'
      cancleText.style.display = 'none'
      barIcon.src = CloseIcon;
      this.setState({ visiableUpLode: false })
    }else if( flag === 4){
      saveText.style.display = 'block'
      cancleText.style.display = 'none'
      barIcon.src = CloseIcon;
      this.setState({ visiableAudit: false })
    }

  }

  // 填写基本信息
  savaBaseInfo = (data) => {
    if(!this.props.isClickable) return
    const { dispatch } = this.props;
    data.resourceType = this.state.resourceType;
    dispatch({
      type: 'eduAddModule/addBaseInfoHttp',
      payload:{
        data,
        cb:(res)=>{
          this.setState({id: res.classId})
          document.getElementById('rightTitle1').innerText =
            "课程基本信息已保存"
        }
      },
    });
  }

  updateData = (data,flag) => {
    if(!this.props.isClickable) return
    data.classId = this.state.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/updateData',
      payload:{
        data,
        cb:()=>{
          if(flag === 2){
            this.setState({ isCoverComplete: true})
            message.info('封面设置完毕')
            const htmlString =   '<p>设置封面已完成 <span style={{color:AppColor.Green}}>小图模式</span></p>';
            const htmlStringbig =   '<p>设置封面已完成 <span style={{color:AppColor.Green}}>大图模式</span></p>';
            document.getElementById('rightTitle2').innerHTML = data.typeMode === 1 ? htmlStringbig : htmlString;
            // eslint-disable-next-line no-empty
          }
        }
      },
    });
  }

  submit = () =>{
    this.child.auditCourseHttp()
  }

  // 返回上一级
  handleBackPage = () =>{
    this.props.history.push('/education/manage')
  }

  render() {
    const { resourceType } = this.props.eduManageModule;
    const { visiableBaseInfo , visiableCoverImage, visiableUpLode, visiableAudit ,id } = this.state;
    const baseInfoBar = this.MyTitleBar(BaseInfoIcon,'课程基本信息','请设置课程基本信息','设置','取消',1);
    const coverBar = this.MyTitleBar(CoverIcon,'课程封面设置','当前封面封面还未设置','设置','取消',2);
    const upVideoBar = this.MyTitleBar( resourceType === 1 ? VidecIcon : TextIcon,resourceType === 1 ? '上传视频' : '上传图文','上传课程资料','上传','完成',3);
    const upCuroseBar = this.MyTitleBar( AuditIcon ,'发布审批信息','当前课程未审核','审核','取消',4);
    const rightUI =  <div className={styles.MyClick} onClick={ ()=>this.handleBackPage() }>返回上一页</div>
    return (
      <Card>
        <div>
            <TopTitle2 {...{ title: '课堂课程管理', rightUI }} />

          {
            baseInfoBar
          }
          <div  style={{display: visiableBaseInfo ? 'block' : 'none' ,marginTop:20}} >
            <EditClass
              id = { id }
              onChlidBaseRef = { this.onChlidBaseRef }
              updateData = { this.updateData }
              savaBaseInfo = { this.savaBaseInfo }/>
          </div>
          {
            coverBar
          }
          <div  style={{display: visiableCoverImage ? 'block' : 'none' ,marginTop:20}} >
            <CoverImage
              updateData = { this.updateData }
              onChlidCoverRef = {this.onChlidCoverRef }
            />
          </div>
          {
            upVideoBar
          }
          <div style={{display: visiableUpLode ? 'block' : 'none' }}>
            <VideoShow
              id = { id }
              updateData = { this.updateData }
            />
          </div>
          {
            upCuroseBar
          }
          <div style={{display: visiableAudit ? 'block' : 'none' }}>
             <AuditCourse
               id = {id}
               onChlidRef = {this.onChlidRef }
               handleBackPage = { this.handleBackPage }
             />
          </div>
          <div>
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
      </Card>
    );
  }
}

export default EditPage;
