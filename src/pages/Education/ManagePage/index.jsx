import React from 'react';
import {Card, Tabs, Radio, Modal, Divider,} from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';
import IconFont from '@/components/IconFont';
import MyTable from "../components/MyTable3";
import MySearBar from "@/pages/Education/ManagePage/components/MySearBar";
import {connect} from "dva";
import {AppColor} from "@/utils/ColorCommom";
import { FLAG_ADD } from "@/utils/utils";

const { TabPane } = Tabs;
// status 0-未提交；1-待审核；2-审核通过；3-审核驳回；4-待发布；5-已发布；6-已下架）',
const TabsList = [
  { name: '未提交', key: '0' },
  { name: '未审核', key: '1' },
  { name: '待发布', key: '4' },
  { name: '已驳回', key: '3' },
  { name: '已发布', key: '5' },
  { name: '已下架', key: '6' },
];

@connect(({ eduManageModule , user }) =>
  ({
    eduManageModule,
    currentUser: user.currentUser,
  }),
)

class ManagePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableKey:'0', // tabKey
      addVisiable: false,
    };

    this.refChildren = {}
  }

  onRadioChange = e => {
    this.refChildren[this.state.tableKey].onChildRadioChange( e.target.value)
  };

  onChlidRef = (ref, key) => {
    this.refChildren[key] = ref;
  }

  onClickSearch = (searchValue) =>{
     this.refChildren[this.state.tableKey].updataSearchList(searchValue)
  }

  /**
   * tab切换监听
   * @param tab
   */
  onTabOnchanage = (tab) =>{
    // 强制切换后的
    this.refChildren[this.state.tableKey].onChildRadioChange(1)
    this.setState({
      tableKey:tab
    },()=>{
       this.refChildren[this.state.tableKey].onTabKeyChanage(tab)
    })
  }

  // 添加课程
  onClickAddCurose = (type) => {
    this.setState({ addVisiable: true })
    const { dispatch } = this.props;
    dispatch({
      type: 'eduManageModule/chanageResourceType',
      payload:{
        data: type,
      },
    });
  }

  /**
   * 跳转到课程的编辑页面
   * @param id null 的时候为新增
   */
  toPushEditPage = (data) => {
   this.props.history.push(`/education/editpage/${JSON.stringify(data)}`);
  }


  /**
   * 跳转到课程的编辑页面
   * @param id null 的时候为新增
   */
  toPushAppendEditPage = (data) => {
    this.props.history.push(`/education/editClassRoompage/${JSON.stringify(data)}`);
  }

  /**
   * 跳转到追加子课堂的编辑页面
   * @param id null 的时候为新增
   */
  toPushEditClassRoomPage = (data) => {
    this.props.history.push(`/education/editClassRoompage/${JSON.stringify(data)}`);
  }

  render() {
    // tab 页面
    const TabPanes = TabsList.map((item) => {
      const panes =
        <TabPane tab = { item.name } key = { item.key } >
          <MyTable
            tabKey = { item.key  }
            chanageVisibleValue = {1}   // 1- 全部课程 2 -追加子课程 根据此值来判断初始化显示哪个列表
            onChlidRef = { (ref) => this.onChlidRef(ref, item.key) }
            toPushEditPage = { this.toPushEditPage }
            toPushAppendEditPage = { this.toPushAppendEditPage }
          />
        </TabPane>;
      return panes;
    });
    const { tableKey, addVisiable } = this.state;
    const rightUI =  <div className={styles.HTopLayout}>
                        <div onClick={ () => this.onClickAddCurose(1) } >
                          <IconFont type="iconiconjia" style={{ fontSize: 16 }} onClick={this.Add} />&nbsp;&nbsp;视频课程
                        </div>
                        <div onClick={ () => this.onClickAddCurose(3) } >
                          <IconFont type="iconiconjia" style={{ fontSize: 16 }} onClick={this.Add} />&nbsp;&nbsp;图文课程
                        </div>
                      </div>
    return (
      <Card>
        <div>
          <TopTitle2 {...{ title: '课程课程管理', rightUI }} />
          <div>
            <MySearBar onClickSearch = { this.onClickSearch }/>
            <div  className={styles.MyHLayout}>
              <div style={{ display: Number(tableKey) !== 5&&Number(tableKey)!==6 ? 'block':'none'}}>
                <Radio.Group onChange={this.onRadioChange} value={ this.refChildren[this.state.tableKey]?.state.radioValue|| 1}>
                  <Radio value={1}>初始课程</Radio>
                  <Radio value={2}>追加子课程</Radio>
                </Radio.Group>
              </div>
            </div>
            <Tabs
              animated = {false}
              onChange={ this.onTabOnchanage }
              activeKey={tableKey}
              >
              {TabPanes}
            </Tabs>
          </div>
          <Modal
            title="新建课程"
            visible={ addVisiable }
            onCancel={() => {
              this.setState({ addVisiable: false });
            }}
            destroyOnClose // 关闭时销毁 Modal 里的子元素
            maskClosable={false} // 点击遮照能不能关闭Modal
            footer={null} // 底部按钮
            width= { 460 }
            style={{
              top: '25vh',
              bottom: 10,
            }}
            bodyStyle={{ overflow: 'scroll', height: 240 }}
          >
            <div className={styles.modelStyle} style={{color: AppColor.Green}}>
                <div  className={styles.centerLayout} onClick={ () => this.toPushEditPage({ id: '', type: FLAG_ADD })}>
                  <div>
                    <div>
                      <IconFont type="iconshipin1" style={{ fontSize: 100,  }}  />
                    </div>
                    <div style={{ marginTop: 10, marginLeft:20}}>创建新课程</div>
                  </div>
                </div>
                <div  >
                  <Divider type='vertical' style={{height:200}}/>
                </div>
                <div className={styles.centerLayout} onClick = {
                  () => this.toPushEditClassRoomPage( { id:'',type: FLAG_ADD })
                }>
                    <div >
                      <div>
                        <IconFont type="icontuwen" style={{ fontSize: 110, color: AppColor.Green}} />
                      </div>
                      <div style={{  marginLeft:20}}>追加子课程</div>
                    </div>
                </div>
            </div>
          </Modal>


        </div>
      </Card>
    );
  }
}

export default ManagePage;
