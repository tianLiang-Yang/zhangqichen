import React from 'react';
import {Card, Col, Tree, Modal, Row, Tabs, Table, Input, message} from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';
import MyTable from './components/MyTable'
import IconJiaHao from '@/img/i_jia_green.png'
import {connect} from "dva";
import EditStaticPeople from "@/pages/People/ManagePage/components/EditStaticPeople";
import SelectPeople from "@/pages/People/ManagePage/components/SelectPeople";
import EditDynamicPeople from "@/pages/People/ManagePage/components/EditDynamicPeople";
import { isEmpty, handleEmptyStr, FLAG_ADD, FLAG_EDIT, FLAG_SEE } from "@/utils/utils";
import CommonTable from "@/pages/People/SettingPage/components/common-table";

const { TabPane } = Tabs;
const TabsList = [
  { name: '未发布', key: '0' },
  { name: '已发布', key: '1' },
  { name: '已停用', key: '2' },
];

@connect(({ peopleModule , user }) =>
  ({
    peopleModule,
    currentUser: user.currentUser,
  }),
)

class ManagePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStaticPeopleVisiable: false,
      isSelectVisiable: false,
      isDynamicVisiable: false,
      dynamicFlag : FLAG_ADD,
      staticFlag: FLAG_ADD,
      selectList:[],
      id: '',
      stateList: undefined
    };
  }

  componentDidMount() {
  }

  // 添加分类
  Add = (flag) => {
    if(flag === 1) {
      const { dispatch } = this.props
      dispatch({
        type: 'peopleModule/updateThrongId', // 添加时设置id 为空
        payload:'',
      });
      this.setState({isStaticPeopleVisiable: true, staticFlag: FLAG_ADD})
    }else
      this.setState({isDynamicVisiable: true, dynamicFlag: FLAG_ADD })
  };

  // 显示选择界面
  showSelectDialog = (flag) => {
    this.setState({ isSelectVisiable: true, staticFlag: flag})
  }

  // 添加完成
  onResult = (flag) =>{
    message.info('你好')
    if(flag === 2){
      this.setState({isDynamicVisiable: false})
    }else{
      const { dispatch } = this.props;
      dispatch({
        type: 'peopleModule/UpdateSelectStaticListRes',
        payload:
          {
            data:[],
            // cb:() => { this.requestListHttp() }
          },
      });

    }
    const { stateList } = this.state;
  //   todo 更新列表 未做
    this.peopleChild.setupdateListByHrongTypeId(stateList)
  }

  // 子控件操作弹出动态人群弹出框
  operatePeopleDialog = (record,flag, state) => {
    this.setState({ stateList: state })
    if(record.throngProperty === 'D'){
      this.setState({ isDynamicVisiable: true, dynamicFlag: flag, id: record.throngId})
    }else{
      const { dispatch } = this.props
      dispatch({
        type: 'peopleModule/updateThrongId', // 添加时设置id 为空
        payload: record.throngId,
      });
      this.setState({ isStaticPeopleVisiable: true, staticFlag: flag,})
    }
  }

  // 选择完人群后回到静态人群弹出框
  afterSelectShowStaticDialog = (flag) =>{
    this.setState({ isSelectVisiable: false })
    this.peopleStaticChild.afterSelectDilag() // 更改table数据
  }

  getTableList = (page, pageSize, flag, keyWord) =>{
    const { dispatch } = this.props;
    const { checked } = this.state;
    const param1 = { pageSize, pageNum: page}
    const param2 = { pageSize, pageNum: page,isRelease:1,}
    dispatch({
      type: 'peopleModule/getPeopleClassList',
      payload: checked ? param2 : param1,
    });
  };

  onChlidRef = (ref) => {
    this.child = ref;
  }

  onChlidPeopleRef = (ref) => {
    this.peopleChild = ref;
  }

  onChlidStaticPeopleRef = (ref) => {
    this.peopleStaticChild = ref;
  }


  // 点击人群分类
  OnTableClick = (record) =>{
    this.peopleChild.setupdateListByHrongTypeId(record.throngTypeId)
  }

  render() {
    const { dynamicFlag , staticFlag, selectList, id } = this.state;
    const TabPanes = TabsList.map((item) => {
      const panes =
        <TabPane tab = { item.name } key = { item.key }>
          <MyTable
            onChlidPeopleRef = { this.onChlidPeopleRef }
            status = { item.key }
            operatePeopleDialog = { this.operatePeopleDialog }
          />
        </TabPane>;
      return panes;
    });
    const rightUI = <div className={styles.HTopLayout}>
      <div onClick={ () => this.Add(1) } >
        <img src={IconJiaHao} alt="" style={{ height: 16 }} />&nbsp;&nbsp;新增静态人群
      </div>
      <div onClick={ () => this.Add(2) } >
        <img src={IconJiaHao}  alt="" style={{ height: 16 }} />&nbsp;&nbsp;新增动态人群
      </div>
    </div>
    const columns = [
      {
        title: '人群分类',
        dataIndex: 'throngTypeName',
        key: 'throngTypeName',
        width:'180px'
      },
    ]
    const { isLoadding, peopleClassListResult = {}}  = this.props.peopleModule;
    return (
      <Card>
        <div>
          <TopTitle2 {...{ title: '人群管理',rightUI }} />
          <div>
            <Row>
              <Col span={5}>
                <div className={styles.BorderLeftBox}>
                  <CommonTable
                    flag = { 2009 }
                    isLoadding = { isLoadding }
                    result = { peopleClassListResult }
                    Colums = {  columns }
                    getTableList = {this.getTableList}
                    onChlidRef={ this.onChlidRef }
                    OnTableClick ={ this.OnTableClick}
                  />
                </div>
              </Col>
              <Col span={19}>
                <div className={styles.BorderRightBox}>
                  <Tabs
                    animated = {false}
                    defaultActiveKey = { TabsList[0].key }
                    >
                    {TabPanes}
                  </Tabs>
                </div>
              </Col>
            </Row>
          </div>

          <Modal
            title="新增/编辑静态人群"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="80vw"
            style={{
              top: 10, bottom: 10,
            }}
            bodyStyle={{ overflow: "scroll", height: "90vh" }}
            visible={ this.state.isStaticPeopleVisiable }
            onCancel={() => { this.setState({ isStaticPeopleVisiable: false })} } >
            {
              <EditStaticPeople
                onResult = { this.onResult }
                onChlidStaticPeopleRef = {this.onChlidStaticPeopleRef }
                showSelectDialog = { this.showSelectDialog }
                flag = { staticFlag }  />
            }
          </Modal>
          <Modal
            title="新增/编辑动态人群"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
             maskClosable={false} // 点击遮照能不能关闭Modal
             footer={null} // 底部按钮
             width="60vw"
             style={{
               top: 10, bottom: 10,
             }}
             bodyStyle={{ overflow: "scroll", height: "90vh" }}
             visible={ this.state.isDynamicVisiable }
             onCancel={() => { this.setState({ isDynamicVisiable: false })} } >
            {
                 <EditDynamicPeople
                   id = {id}
                   onResult = { this.onResult }
                   flag={ dynamicFlag }
                />
            }
          </Modal>
          <Modal
            title="选择成员"
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width="80vw"
            style={{
              top: 10, bottom: 10,
            }}
            bodyStyle={{ overflow: "scroll", height: "90vh" }}
            visible={ this.state.isSelectVisiable }
            onCancel={() => { this.setState({ isSelectVisiable: false })} } >
            {
              <SelectPeople
                flag = { staticFlag }
                afterSelectShowStaticDialog = { this.afterSelectShowStaticDialog }
               />
            }
          </Modal>
        </div>
      </Card>
    );
  }
}

export default ManagePage;
