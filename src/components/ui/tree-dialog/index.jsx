import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';
import { Tree, Switch } from 'antd';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';


class TreeDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visiable: false,
      selectedKeys: undefined,
    }
  }

  componentWillMount() {
    this.setState({visiable:  this.props.visiable})
  }

  onSelect = (selectedKeys, info) => {

    if( this.props.onSelectTree){
      this.props.onSelectTree(selectedKeys,info)
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({visiable: nextProps.visiable})
  }

  render() {
    const { title, treeData } = this.props;
    console.log('treeVisiable',this.props)
    const { visiable } = this.state;
    return (
      <Modal
        title = { title }
        className = { styles.standardListForm}
        destroyOnClose // 关闭时销毁 Modal 里的子元素
        maskClosable={false} // 点击遮照能不能关闭Modal
        width = { 640 }
        bodyStyle = {{ padding: '28px 24px' }}
        visible={ visiable }
        onOk = {()=>{
          this.props.onTreeDialogCancle()
          this.setState({ visiable: false })}}
        onCancel={ ()=>{
          this.props.onTreeDialogCancle()
          this.setState({ visiable: false })}}
      >

          <Tree
            onSelect={ this.onSelect }
            treeData= { treeData }
            />
      </Modal>
    );
  }
}

export default TreeDialog;
