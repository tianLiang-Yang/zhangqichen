import React from 'react';
import {Card, Divider, Input, message, Modal, Tabs} from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';
// 家医团队
import TeamManage from './TeamManage'
// 家医签约列表
import HomeDoctorServiceManage from './HomeDoctorServiceManage'

import OrgSelectList from './components/OrgSelectList'
import IconFont from "@/components/IconFont";
import {AppColor} from "@/utils/ColorCommom";
import {connect} from "dva";
import {getOrgData, setOrgData} from "@/utils/sessionUtil";
import OrgServiceParams from "@/pages/HealthManage/HomeDoctorSigning/components/OrgServiceParams";
import {FLAG_EDIT} from "@/utils/utils";

const { TabPane } = Tabs;
const { Search } = Input;

const NoUseUI =  <span style={{ color: AppColor.Origin }}> 未开通</span>
const OrgUseUI =  <span style={{ color: AppColor.Green }}> 已开通</span>

@connect(({ healthHomeDoctorModule }) =>
  ({
    healthHomeDoctorModule,
    orgServiceInfo: healthHomeDoctorModule.orgServiceInfo
  }),
)
class HomeDoctorSigning extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      currentKey: 1,
      isOrgListVisiable: false,
      isOrgParamsVisiable: false,
      statusUI: NoUseUI,
      orgName:'',
      isOpenService: false,
    }
  }

  componentDidMount() {
    const data = getOrgData();
    this.setState({ orgName: data ? data.orgName : ''})
    this.getOrgSerDetial()
  }

  onChlidHomeDoctorRef = (ref) => {
    this.homeDoctorChild = ref;
  }

  onChlidTeamRef = (ref) => {
    this.teamChild = ref;
  }

  handleInputSearch = () => {
    this.setState({ isOrgListVisiable: true})
  }

  // 添加监听
  onAddListener = () => {
    const data = getOrgData()
    if(data){
      // this.setState({ isOrgParamsVisiable: true })

      if( this.state.isOpenService === 0 ){
        message.warn('当前机构暂未开通家医签约，请先开通该机构服务')
        return
      }
      const { currentKey } = this.state;
      const id = null
      if(currentKey === 1){ // 添加家医服务
        this.props.history.push(`/healthManage/EditHomeDoctorPage/${id}`)
      }else{
        this.props.history.push(`/healthManage/EditServiceTeamPage/${id}`)
      }
    }else{
      message.warn('请选择当前机构')
    }
  }

  // tab 切换监听
  onTabKeyChanage = ( value ) => {
    this.setState({ currentKey: Number(value)})
  }

  // 选择机构回调
  onOrgSelectDestory = (record) => {
    this.setState({ orgName: record.orgName} )
    setOrgData(record)
    this.getOrgSerDetial()
    this.setState({ isOrgListVisiable: false})
    // 刷新列表
    this.homeDoctorChild.requestHomeDoctorListHttp(1)
    if(this.teamChild)  this.teamChild.requestTeamListHttp(1)

  }

  getOrgSerDetial = () => {
   const orgData = getOrgData();
   if(!orgData)  return
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/getOrgSerInfo',
      payload:{
        data:{
          orgId: orgData.orgId
        },
        cb:(data)=>{
          if(data.exist === 0 || data.isRelease === 0){
            this.setState( { statusUI: NoUseUI, isOpenService: false})
          } else {
            this.setState( { statusUI: OrgUseUI, isOpenService: true})
          }
        }
      },
    });
  }

  // 修改添加服务机构回调处理
  onOrgerviceParamsDestory = (isUpdate,isExist,data) => {
    if(isUpdate) {
      const { dispatch } = this.props
      const orgData = getOrgData()
      data.orgId = orgData.orgId
      if(isExist === 1){ // 服务存在
        dispatch({
          type: 'healthHomeDoctorModule/updateOrgService',
          payload: {data, cb : ()=>{ this.getOrgSerDetial() }},
        });
      }else{  // 服务存在 服务不存在
        dispatch({
          type: 'healthHomeDoctorModule/addOrgService',
          payload:{
            data,
            cb : () => { this.getOrgSerDetial() }}
        });
      }
    }
    this.setState({ isOrgParamsVisiable: false })
  }

  // 服务参数设置
  onSetServiceParamsClick = () => {
    const data = getOrgData();
    if(data){
      this.setState({ isOrgParamsVisiable: true })
    }else{
      message.warn('请选择服务机构')
    }
  }

  // 修改团队信息
  onModifyTeam = (record) => {
    this.props.history.push(`/healthManage/EditServiceTeamPage/${record.orgTeamId}`)
  }

  // 修改服务包
  onModifySerVicePack = (record) =>{
    this.props.history.push(`/healthManage/EditHomeDoctorPage/${record.osPackId}`)
  }

  render() {
    const { statusUI, orgName } = this.state;
    return (
      <Card>
        <div className={ styles.main }>
          <TopTitle2 {...{ title: '家医签约'}} />

          <div className={ styles.InputContent }>
            <Search
              showSearch
              value={ orgName }
              size = "normal"
              shape="round"
              placeholder="请选择机构名称"
              style = {{ width: 324 }}
              // onChange = { this.chanageInput }
              onSearch = { value => this.handleInputSearch(value) }
            />
            <div style={{ cursor: 'pointer' }}>
              <span >{ statusUI }</span>
              <Divider type="vertical"/>
              <span style={{ color: AppColor.Green }} onClick={ this.onSetServiceParamsClick }>服务参数设置</span>
            </div>
          </div>
          <Divider/>
          <div className={ styles.AddBox } >
            <IconFont type="iconiconjia" style={{ fontSize: 18 }}  onClick={ this.onAddListener }/>
          </div>
          <div>
            <Tabs
              animated = {false}
              defaultActiveKey = { 1 }
              onChange={ this.onTabKeyChanage }
              >
              <TabPane tab = "家医服务包管理" key = { 1 }>
                <HomeDoctorServiceManage
                  onModifySerVicePack = { this.onModifySerVicePack }
                  onChlidHomeDoctorRef = { this.onChlidHomeDoctorRef }
                />
              </TabPane>
              <TabPane tab = "家医团队管理" key = { 2 }>
                <TeamManage
                  onChlidTeamRef = { this.onChlidTeamRef }
                  onModifyTeam = { this.onModifyTeam }/>
              </TabPane>
            </Tabs>
          </div>
          <Modal
            title="选择机构"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="50vw"
            style={{
              top: 53, bottom: 10,
            }}
            bodyStyle={{ overflow: "scroll", height: "63vh" }}
            visible={ this.state.isOrgListVisiable }
            onCancel={() => { this.setState({ isOrgListVisiable: false })} } >
            {
              <OrgSelectList onOrgSelectDestory = { this.onOrgSelectDestory }/>
            }
          </Modal>
          <Modal
            title="服务参数设置"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="40vw"
            style={{
              top: 53, bottom: 10,
            }}
            bodyStyle={{ overflow: "scroll", height: "52vh" }}
            visible={ this.state.isOrgParamsVisiable }
            onCancel={() => { this.setState({ isOrgParamsVisiable: false })} } >
            {
              <OrgServiceParams  onOrgerviceParamsDestory = { this.onOrgerviceParamsDestory }/>
            }
          </Modal>
        </div>
      </Card>
    );
  }
}

export default HomeDoctorSigning;
