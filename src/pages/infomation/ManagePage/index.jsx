import React from 'react';
import {Card, Table, Divider, Dropdown, Menu, Input, Tabs} from 'antd';
import styles from './index.less';
import { TopTitle2 } from '@/components/ui/TopTitle';
import IconFont from '@/components/IconFont';
import MyTable from './components/MyTable'

const { TabPane } = Tabs;

const TabsList = [
  { name: '未发布', key: 1 },
  { name: '已发布', key: 2 },
  { name: '已下架', key: 3 },
];


class ManagePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 处理下拉框
  handleDropdown = (key) => {
     console.log('handleDropdown',this.props)
    this.props.history.push(`/infomation/editinfomation/${key}`)
  };


  render() {
    const TabPanes = TabsList.map((item) => {
      const panes =
        <TabPane tab = { item.name } key = { item.key }>
          <MyTable
            status = { item.key }
          />
        </TabPane>;
      return panes;
    });
    const rightUI =  <div className={styles.rightChildLayout}>
                        <Dropdown
                          overlay={
                            <Menu onClick={({ key }) => this.handleDropdown(key)}>
                              <Menu.Item key={2}>添加视频</Menu.Item>
                              <Menu.Item key={1}>添加图文</Menu.Item>
                              <Menu.Item key={3}>添加外链</Menu.Item>
                            </Menu>
                          }
                         >
                          <a>
                            <IconFont type="iconiconjia" style={{ fontSize: 18 }} />
                          </a>
                        </Dropdown>
                    </div>

    return (
      <Card>
        <div className={styles.main}>
            <TopTitle2 {...{ title: '健康资讯管理', rightUI }} />
          <div>
            <Tabs
              animated = {false}
              defaultActiveKey = { TabsList[0].key }
            >
              { TabPanes }
            </Tabs>
          </div>
        </div>
      </Card>
    );
  }
}

export default ManagePage;
