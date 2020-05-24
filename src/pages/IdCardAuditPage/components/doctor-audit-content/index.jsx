import React from 'react'
import styles from './index.less'
import { Tabs } from 'antd';
import DoctorAudit from './dorctor-audit';
import DoctorHistory from './doctor-history';

const { TabPane } = Tabs;
/**
 * 医生资质审核
 */
class DoctorAuditContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { dialogControl, userId } = this.props;
    return (
       <div className = { styles.main }>
         <Tabs
           className={ styles.MyTabs }
           animated = { false }
           defaultActiveKey = "1">
           <TabPane tab = "本次审核" key = "1">
             <DoctorAudit
               userId = { userId }
               currentTab = { this.props.currentTab}
               closeDialog = { this.props.closeDialog }
               dialogControl = { dialogControl } // 控制dialog的 展示样子
               zoomImage={this.props.zoomImage} />
           </TabPane>
           <TabPane tab = "审核历史" key = "2">
             <DoctorHistory userId = { userId }/>
           </TabPane>
         </Tabs>
       </div>
    )
  }
}
export default DoctorAuditContent;
