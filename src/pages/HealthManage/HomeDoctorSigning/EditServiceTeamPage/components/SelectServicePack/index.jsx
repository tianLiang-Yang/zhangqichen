import React from 'react';
import {Checkbox, Row, Col, Divider, Button, Form} from 'antd';
import styles from './index.less';
import {connect} from "dva";
import {AppColor} from "@/utils/ColorCommom";
import {getlimitStr, isEmpty} from "@/utils/utils";

const CheckboxGroup = Checkbox.Group;

@connect(({ healthHomeDoctorModule }) =>
  ({
    healthHomeDoctorModule,
    servicePackSelectList: healthHomeDoctorModule.servicePackSelectList,
    isLoadding: healthHomeDoctorModule.isLoadding,
  }),
)

class SelectServicePack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      checkedList: [],
      indeterminate: true,
      checkAll: false,
    };
  }

  componentDidMount() {
    const checkList = []
    const {teamSelectPackList} = this.props;
    for (let i = 0; i < teamSelectPackList.length ; i++) {
      checkList.push(teamSelectPackList[i].osPackId)
    }
    this.setState({ checkedList: checkList })
    // 获取服务包子项目
      const { dispatch } = this.props;
      dispatch({
        type: 'healthHomeDoctorModule/getSerPackSelectList',
        payload:{
          orgTeamId: this.props.orgTeamId  // this.props.orgTeamId // '169633090434629632' // this.state.id // todo
        },
      });
  }

  submit = () =>{
   this.props.onServicePackResult(true,this.state.checkedList)
  }

  cancle = () =>{
    this.props.onServicePackResult(false,null)
  }

  onChange = (checkedValues) => {
    this.setState({
      checkedList: checkedValues,
    });
  }


  onCheckAllChange = e => {
    const { servicePackSelectList , orgTeamId} =  this.props;
    const checkList = []
    for (let i = 0; i <servicePackSelectList.length ; i++) {
      checkList.push(servicePackSelectList[i].osProjectId)
     }
    if(isEmpty(orgTeamId))


    this.setState({
      checkedList: e.target.checked ? checkList : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  render() {
    const { checkedList } = this.state;
    const { servicePackSelectList } =  this.props;

    const boxs = servicePackSelectList.map((item) =>
        <div className={ styles.ItemBox } >
          <Checkbox value={ `${item.osPackId}` }>
            <div className={ styles.Box }>
            <div>
              <img style={{ width:50, height:50 }} alt="" src={ item.imagetbUrl } />
            </div>
            <div style={{ marginLeft:10}}>
              <div style={{ color: AppColor.Green,fontSize: 12 }}>{ item.osPackName }</div>
              <div style={{ color: AppColor.Gray,fontSize: 15,marginTop:3 }}>{ getlimitStr(14,item.osPackDesc) }</div>
            </div>
          </div>
        </Checkbox>
       </div>)

    return (
      <div className={ styles.main }>
        <div className={ styles.CheckCount }>
          <div>服务包总数：{ servicePackSelectList.length }个 | 已选{ checkedList.length }个</div>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全部选择
          </Checkbox>
        </div>
        <br />
        <div className={ styles.BoxTransfer }>
          <div className={ styles.BoxTransferList }>
            <Checkbox.Group style={{ width: '100%' }} value={ checkedList } onChange={ this.onChange }>
              <div className={styles.GrideBox}>
                { boxs }
              </div>
            </Checkbox.Group>
          </div>
        </div>
        <Divider/>
        <div className={styles.BotttomLayout}>
          <div>
            <Button onClick={() => this.submit()} style={{width: 100, marginLeft: 20}} type="primary"
                    shape="round">选择</Button>
            <div>
              <Button onClick={() => this.cancle()} style={{width: 100, marginLeft: 20}} shape="round">取消</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectServicePack;
