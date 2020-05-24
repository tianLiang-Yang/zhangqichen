import { Modal, } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { PrescriptionUrl } from "@/utils/Constant";
import FormRendering from '@/components/FormRendering';


class HealthPreForm extends Component {
  constructor(props){
    super(props);
    this.state ={
      prescriptionId: null,
      cols: [],
    };
  }

  componentWillMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'prescriptionAndHealthPreForm/getTableSetting',
      payload: {
        data: {
          tableName: "健康处方",
        },
        callback: (res) => {
          if(res && res.code === 200 && res.data){
            this.setState({
              cols: JSON.parse(res.data).data,
            })
          }
          else{
            Modal.error('获取数据库表设置失败!');
          }
        },
      },
    });
  }

  handleSubmit = data => {
    const { dispatch } = this.props;
    data.prescriptionId = this.state.prescriptionId;
    dispatch({
      type: 'prescriptionAndHealthPreForm/updateHealthPre',
      payload: {
        data,
        callback: (res) => {
          if(!res || res.code != 200){
            console.log('update failed:',res)
            Modal.error({
              content: '更新失败',
            });
          }
          else{
            Modal.success({
              content: '保存完成',
            })
          }
        }
      },
    });
  };

  handleSearchSubmit = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'prescriptionAndHealthPreForm/getHealthPre',
      payload: {
        data: {
          userId: 1,
          preName: value,
        },
        callback: (data) => {
          if (data && data.code === 200 && data.data) {
            this.setState({
              prescriptionId: data.data.prescriptionId,
            })
            this.refs.form.setFieldsValue(data.data);
          }
        },
      },
    });
  };

  render() {
    return (
      <PageHeaderWrapper
        content={<FormattedMessage id="prescriptionandhealthpreform.basic.description" />}
      >
        <FormRendering 
          ref="form"
          tableName="健康处方"
          uploadUrl={PrescriptionUrl}
          handleSearchSubmit={this.handleSearchSubmit}
          cols={this.state.cols}
          handleSubmit={this.handleSubmit}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect()(HealthPreForm);
