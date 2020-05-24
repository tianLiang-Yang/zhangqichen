import React from 'react';
import {Card, message, Button, Modal, Table, Empty } from 'antd';
import styles from './index.less';
import { TopTitle3 } from '@/components/ui/TopTitle';
import utilStyles from '@/utils/utils.less'
import CloseIcon from '@/img/curose_close.png'
import ShowIcon from '@/img/curose_show.png'
import EditClass from './components/EditClass'
import BaseInfoIcon from '@/img/ed_baseinfo.png'
import TextIcon from '@/img/ed_text.png'
import {connect} from "dva";
import {AppColor} from "@/utils/ColorCommom";
import SelectServicePack from "@/pages/HealthManage/HomeDoctorSigning/EditServiceTeamPage/components/SelectServicePack";
import {FLAG_ADD, isEmpty} from "@/utils/utils";
import { teamEditColumns, DETLE, SET_MASTER, CANCLE_MASTER, SET_LEADER, CANCLE_LEADER, SEND } from '../../help/Colums'
import SelectPeople from "./components/SelectPeople";
import IconFont from "@/components/IconFont";
import defaultImage from '@/img/defalute_failure.png'

/**
 * 团队服务编辑页
 */
@connect(({healthHomeDoctorModule }) =>
  ({
    isClickable: healthHomeDoctorModule.isClickable,
    healthHomeDoctorModule,
    servicePackChildProList: healthHomeDoctorModule.servicePackChildProList,
    teamUserList: healthHomeDoctorModule.teamUserList,
    teamSelectPackList: healthHomeDoctorModule.teamSelectPackList,
    isLoadding: healthHomeDoctorModule.isLoadding,
  }),
)
class EditServiceTeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',// "171105650334629888", // 团队id
      visiableBaseInfo: true, // 基础信息模块是否可见
      isSelectPackVisiable: false,
      flag: FLAG_ADD,
      isSelectTeamMumber: false,
    };
  }

  componentWillMount() {
    this.setState({ id: this.props.match.params.key === 'null' ? '' : this.props.match.params.key},()=>{
      if(!isEmpty(this.state.id)){
        this.getTeamUserList()
        this.getSelectPackList();
      }else{
        this.toClearCache()
      }
    })
  }

  componentDidMount() {
    const saveText = document.getElementById(`save${1}`);
    const cancleText = document.getElementById(`cancle${1}`);
    const barIcon = document.getElementById(`icon${1}`);
    saveText.innerText = '保存'
    cancleText.style.display = 'block'
    barIcon.src = ShowIcon;
    this.setState({ visiableBaseInfo: true })
  }

  onChlidBaseRef = (ref) => {
    this.baseChild  = ref;
  }

  onChlidRef = (ref) => {
    this.child = ref;
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
                  <span style={{color: flag === 3 ?  AppColor.Green : AppColor.Blue}}> { rightSave }</span>
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
      default:
        break
    }

  }


  // 取消
  OnCancleClickListener = (flag) =>{
    const saveText = document.getElementById(`save${flag}`);
    const cancleText = document.getElementById(`cancle${flag}`);
    const barIcon = document.getElementById(`icon${flag}`);
    if(flag === 1) {
      saveText.innerText = '设置'
      cancleText.style.display = 'none'
      barIcon.src = CloseIcon;
      this.setState({visiableBaseInfo: false});
    }else if( flag === 3){
      saveText.style.display = 'block'
      cancleText.style.display = 'none'
      barIcon.src = CloseIcon;
    }
  }

  // 添加基本信息
  savaBaseInfo = (data) => {
    if(!this.props.isClickable) return
    if(isEmpty(this.state.id)){
      const { dispatch } = this.props;
      dispatch({
        type: 'healthHomeDoctorModule/CreateTeam',
        payload:{
          data,
          cb:(res)=>{
            this.setState({ id: res.data})
            document.getElementById('rightTitle1').innerText =
              "基本信息已保存"
          }
        },
      });
    }else{
      this.updateData(data)
    }

  }

  // 修改基本信息
  updateData = (data) => {
    if(!this.props.isClickable) return
    data.orgTeamId = this.state.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/updateTeam',
      payload:{
        data,
        cb:()=>{

        }
      },
    });
  }

  submit = () =>{
    if(!this.props.isClickable) return
    const { teamUserList =[], teamSelectPackList = [] } = this.props
    if(teamUserList.length === 0){
      message.warn('请选择团队成员')
      return
    }
    if (teamSelectPackList.length === 0){
      message.warn('请选择服务包')
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/OpenTeam',
      payload:{
        data:{
          orgTeamId:  this.state.id
        },
        cb:()=>{
          this.handleBackPage()
        }
      },
    });
  }

  handleBackPage = () =>{
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    this.props.history.push('/healthManage/homeDoctorSigning')
  }

  // 选择服务包
  onServicePackResult = (isUpdate,list) =>{
    console.log('onServicePackResult',list)
    const data = { selectList: list, orgTeamId: this.state.id}
    if(isUpdate){
      const { dispatch } = this.props;
      dispatch({
        type: 'healthHomeDoctorModule/updateTeamPack',
        payload:{
          data,
          cb:()=>{
            this.setState({ isSelectPackVisiable : false})
            this.getSelectPackList();
          }
        },
      });
    }else{
      this.setState({ isSelectPackVisiable : false})
    }
  }

  // 添加成员成功回调
  onTeamMumberkDestory = () =>{
      this.setState({ isSelectTeamMumber : false})
      this.getTeamUserList()
  }

  // 获取团队成员
  getTeamUserList = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/getTeamUserList',
      payload:{
        orgTeamId: this.state.id,// this.state.id
      },
    });
  }

  // 获取团队已经选择的服务包列表
  getSelectPackList = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/getSelectPackList',
      payload:{
        orgTeamId: this.state.id ,
      },
    });
  }

  // 清除redux的缓存列表
  toClearCache = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/toChanageTeamList',
      payload:{
      },
    });
  }

  MyTitleBar2 = (leftIcon,leftTitle,rightTitle,onClickListener) =>
    <div className={styles.MyTitleBar}>
      <div>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={ leftIcon }/>
        <span>{ leftTitle }</span>
      </div>
      <div>
        <div  style={{ color: AppColor.Green, cursor: 'pointer'}} onClick={ onClickListener }>{ rightTitle }</div>
      </div>
    </div>;

  // 添加团队成员或添加团队服务包
  addTeamUserOrServicePack = (flag) => {
    if (isEmpty(this.state.id)){
      message.warn('请先保存基本信息')
      return
    }
    if(flag === 1)
      this.setState({ isSelectTeamMumber: true })
    else
      this.setState({ isSelectPackVisiable: true })
  }

  // 团队成员列表相关操作
  teamOprateSomeThing = (record,flag) => {
    const { dispatch } = this.props;
    switch (flag) {
      case DETLE:
        Modal.confirm({
          title: '删除',
          content: '是否移除该团队成员？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'healthHomeDoctorModule/deleteTeamUser',
              payload:{
                data: { otmId: record.otmId },
                cb: () => { this.getTeamUserList() }
              },
            });
          }
        });
        break
      case SET_MASTER:
        Modal.confirm({
          title: '设置签约主体',
          content: `是否设置${record.drName}为签约主体？`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'healthHomeDoctorModule/teamAddMaster',
              payload:{
                data: { otmId: record.otmId },
                cb: () => { this.getTeamUserList() }
              },
            });
          }
        });
        break
      case CANCLE_MASTER:
        Modal.confirm({
          title: '取消签约主体',
          content: `是否取消签约主体？`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'healthHomeDoctorModule/teamcancleMaster',
              payload:{
                data: { otmId: record.otmId },
                cb: () => { this.getTeamUserList() }
              },
            });
          }
        });
        break
      case SET_LEADER:
        Modal.confirm({
          title: '设置团队长',
          content: `是否设置${record.drName}为团队长？`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'healthHomeDoctorModule/teamAddLeader',
              payload:{
                data: { otmId: record.otmId },
                cb: () => { this.getTeamUserList() }
              },
            });
          }
        });
        break
      case CANCLE_LEADER:
        break
      case SEND:
        break
      default:
        break
    }
  }

  deletePackItem = (item) => {
    // 删除当前数据
      const { dispatch } = this.props;
      dispatch({
        type: 'healthHomeDoctorModule/deleteTeamPack',
        payload: {
          data:{
            orgTeamId: this.state.id,
            productPackId: item.productPackId,
          },
          cb: () => {
            this.getSelectPackList()
          }
        },
      });
  }

  render() {
    const { visiableBaseInfo , id, flag } = this.state;
    // eslint-disable-next-line prefer-const
    const { teamUserList, teamSelectPackList = [],  isLoadding } = this.props;
    const baseInfoBar = this.MyTitleBar(BaseInfoIcon,'课程基本信息','请设置课程基本信息','设置','取消',1);
    const upVideoBar = this.MyTitleBar2( TextIcon,  '家医团队成员信息','+ 添加团队成员',() => this.addTeamUserOrServicePack(1));
    const packBar = this.MyTitleBar2( TextIcon,  '家医团队服务包','+ 添加服务包', () => this.addTeamUserOrServicePack(2));
    const rightUI =  <div className={styles.MyClick} onClick={ () => this.handleBackPage() }>返回上一页</div>
    const packServiceUI =
      teamSelectPackList.length === 0 ?
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        :
        teamSelectPackList.map((item) =>
        <div className={ styles.Box }>
          <div  className={ styles.ListItem}>
            <div>
              <div>
                <img
                  id = {`img${item.osPackId}`}
                  style={{ width:60, height:60, marginTop:5, float:'left'}}
                  alt=""
                  src={ item.imagetbUrl }
                  onError={ () => {
                    document.getElementById(`img${item.osPackId}`).src = defaultImage
                  }}
                />
                <div style={{ marginLeft: -12, float:'left'}} onClick={ () => this.deletePackItem(item) }>
                 <IconFont type="icon_shanchu" style={{ fontSize: 19}}/>
                </div>
              </div>
              <div style={{ clear: 'both', color: AppColor.Green, paddingTop: 5 }}>
                { item.osPackName }
              </div>
            </div>
          </div>
      </div>)
    const Colums = teamEditColumns(this.teamOprateSomeThing)
    return (
      <Card>
        <div className={ `${ utilStyles.MySmallTable} ${ utilStyles.MySmallTableHeader}` }>
          <TopTitle3 {...{ title: '服务团队管理', span:'新增/编辑',rightUI }} />
          {
            baseInfoBar
          }
          <div  style={{display: visiableBaseInfo ? 'block' : 'none' ,marginTop:20}} >
            <EditClass
              orgTeamId = { id }
              onChlidBaseRef = { this.onChlidBaseRef }
              updateData = { this.updateData }
              savaBaseInfo = { this.savaBaseInfo }/>
          </div>
          {
            upVideoBar
          }
          {/* 添加团队成员 */}
            <Table
              style={{ marginTop: 10 }}
              columns={ Colums }
              dataSource={ teamUserList }
              pagination={false}
              loading = { isLoadding }
              scroll={{ y: 410 }}
            />
          {
            packBar
          }
          {/*  添加服务包 */}
          <div className={ teamSelectPackList.length !== 0 ?styles.Gride : null}
               style={{ padding: 15, border: '1px solid #D7D7D7', borderTop: 0}}>
              {
                packServiceUI
              }
          </div>
          {/* </div> */}
          <div>
            <Button
              onClick={() => this.submit()}
              style={{width: 100, marginLeft: 20,marginTop:40}}
              type="primary"
              shape="round"
            >
              发布
            </Button>
          </div>

          <Modal
            title="选择团队服务包"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="50vw"
            style={{
              top: 50, bottom: 10,
            }}
            bodyStyle={{ overflow: "scroll", height: "80vh" }}
            visible={ this.state.isSelectPackVisiable }
            onCancel={() => { this.setState({ isSelectPackVisiable: false })} } >
            {
              <SelectServicePack
                orgTeamId = { id }
                flag = { flag }
                teamSelectPackList = { teamSelectPackList }
                onServicePackResult = { this.onServicePackResult}
              />
            }
          </Modal>

          <Modal
            title="添加团队成员"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="60vw"
            style={{
              top: 50, bottom: 10,
            }}
            bodyStyle={{ overflow: "scroll", height: "80vh" }}
            visible={ this.state.isSelectTeamMumber }
            onCancel={() => { this.setState({ isSelectTeamMumber: false })} } >
            {
              <SelectPeople
                orgTeamId = { id }
                onTeamMumberkDestory = { this.onTeamMumberkDestory}
              />
            }
          </Modal>

        </div>
      </Card>
    );
  }
}

export default EditServiceTeamPage;
