import '@ant-design/compatible/assets/index.css';
import { Modal } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import FormRendering from '@/components/FormRendering';

class TcmForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: [],
      tcmId: null,
    };
  }

  componentWillMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'prescriptionAndDiseaseForm/getTableSetting',
      payload: {
        data: {
          tableName: "中医疾病",
        },
        callback: (res) => {
          console.log('getTableSetting:',res,JSON.parse(res.data));
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
    data.tcmId = this.state.tcmId;
    console.log('handleSubmit:',data)
    dispatch({
      type: 'prescriptionAndTcmForm/updateTcm',
      payload: {
        data,
        callback: (res) => {
          console.log('dadad:',res)
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
      type: 'prescriptionAndTcmForm/getTcm',
      payload: {
        data: {
          userId: 1,
          tcmName: value,
        },
        callback: (data) => {
          console.log('searchCallback:', data);
          if (data && data.code === 200 && data.data) {
            this.setState({
              tcmId: data.data.tcmId,
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
        content={<FormattedMessage id="prescriptionandtcmform.basic.description" />}
      >
        <FormRendering 
          ref="form"
          tableName="中医疾病"
          handleSearchSubmit={this.handleSearchSubmit}
          cols={this.state.cols}
          data={this.state.data}
          handleSubmit={this.handleSubmit}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect()(TcmForm);
