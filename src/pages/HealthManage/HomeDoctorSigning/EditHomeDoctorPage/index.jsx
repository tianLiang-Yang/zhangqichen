import React from 'react';
import {Card, message, Button, Modal, Table} from 'antd';
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
import AddProject from "@/pages/HealthManage/HomeDoctorSigning/EditHomeDoctorPage/components/AddProject";
import {FLAG_ADD, isEmpty} from "@/utils/utils";
import { ServiceChildProColumns } from '../../help/Colums'

@connect(({healthHomeDoctorModule }) =>
  ({
    healthHomeDoctorModule,
    servicePackChildProList: healthHomeDoctorModule.servicePackChildProList,
    isLoadding: healthHomeDoctorModule.isLoadding,
    isClickable: healthHomeDoctorModule.isClickable,
  }),
)
class EditHomeDoctorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "", // 课堂id
      visiableBaseInfo: true, // 基础信息模块是否可见
      isAddServicePro: false,
      flag: FLAG_ADD,
    };
  }

  componentWillMount() {
    this.setState({ id: this.props.match.params.key === 'null' ? '' : this.props.match.params.key},()=> {
     if(isEmpty(this.state.id)) return
      this.getChildList()
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
          // eslint-disable-next-line no-lonely-if
            if(this.props.isClickable)  this.baseChild.toSaveAction();

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
    }
  }

  // 添加基本信息
  savaBaseInfo = (data) => {
    const { dispatch, isClickable } = this.props;
    if(!isClickable) return
    dispatch({
      type: 'healthHomeDoctorModule/addServicePack',
      payload:{
        data,
        cb:(res)=>{
          this.setState({ id: res.data})
          document.getElementById('rightTitle1').innerText =
            "基本信息已保存"
        }
      },
    });
  }

  // 修改基本信息
  updateData = (data) => {
    if(!this.props.isClickable) return
      data.osPackId = this.state.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/updateServicePack',
      payload:{
        data,
        cb:()=>{
          message.success("基本信息已保存")
        }
      },
    });
  }

  submit = () =>{
    if(!this.props.isClickable) return
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/releaseServicePack',
      payload:{
        data:{
          osPackId:  this.state.id
        },
        cb:()=>{
          this.handleBackPage()
        }
      },
    });
  }

  handleBackPage = () =>{
    this.props.history.push('/healthManage/homeDoctorSigning')
  }

  // 服务包弹窗 关闭事件
  onServicePackResult = (isUpdate,data) =>{
    if(isUpdate){
      const { flag } = this.state;
      const { dispatch } = this.props;
      dispatch({
        type: flag === FLAG_ADD ? 'healthHomeDoctorModule/addServiceChildProject' : 'healthHomeDoctorModule/updateData',
        payload:{
          data,
          cb:()=>{
            this.setState({ isAddServicePro : false})
            this.getChildList();
          }
        },
      });
    }else{
      this.setState({ isAddServicePro : false})
    }
  }

  // 获取服务包子项目
  getChildList = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'healthHomeDoctorModule/getServiceChildProList',
      payload:{
        osPackId: this.state.id // todo
      },
    });
  }

  deleteItem = (record) =>{
    Modal.confirm({
      title: '删除',
      content: '是否删除该服务包',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const value = { osProjectId: record.osProjectId }
        dispatch({
          type: 'healthHomeDoctorModule/deleteProChildSer',
          payload: {
            data:value,
            cb: () => {
              this.getChildList()
            }
          },
        });
      }
    });
  }

 addPack = () => {
   if(isEmpty(this.state.id)){
     message.info('请先保存服务基本信息，再添加服务项目')
     return;
   }
   this.setState({isAddServicePro: true, flag: FLAG_ADD })
 }

  render() {
    const { visiableBaseInfo  , id, flag } = this.state;
    const { servicePackChildProList, isLoadding } = this.props;
    const baseInfoBar = this.MyTitleBar(BaseInfoIcon,'服务基本信息','请设置课程基本信息','设置','取消',1);
    const upVideoBar = this.MyTitleBar2( TextIcon,  '服务项目信息','+ 添加服务项目',this.addPack);
    const rightUI =  <div className={styles.MyClick} onClick={ ()=>this.handleBackPage() }>返回上一页</div>
    const Colums = ServiceChildProColumns(this.deleteItem)
    return (
      <Card>
        <div className={ utilStyles.MySmallTable }>
          <TopTitle3 {...{ title: '服务包管理', span:'> 新增/编辑',rightUI }} />
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
            upVideoBar
          }
          <Table
            style={{ marginTop: 10 }}
            columns={ Colums }
            dataSource={ servicePackChildProList }
            pagination={false}
            loading = { isLoadding }
            scroll={{ y: 410 }}
          />
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
            title="新增/编辑服务项目"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="50vw"
            style={{
              top: 50, bottom: 10,
            }}
            bodyStyle={{ overflow: "scroll", height: "75vh" }}
            visible={ this.state.isAddServicePro }
            onCancel={() => { this.setState({ isAddServicePro: false })} } >
            {
              <AddProject
                id = { id }
                flag = { flag }
                onServicePackResult = { this.onServicePackResult}
              />
            }
          </Modal>
        </div>
      </Card>
    );
  }
}

export default EditHomeDoctorPage;
