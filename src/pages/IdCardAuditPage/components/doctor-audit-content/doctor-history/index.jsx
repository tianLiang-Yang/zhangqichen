import React from 'react'
import { connect } from 'dva';
import { AppColor } from '@/utils/ColorCommom';
import {getlimitStr, isEmpty} from '@/utils/utils';
import CommonTable from '@/components/common-table';

@connect(({ idCardQualification }) => ({
  idCardQualification,
  }))
/**
 * 医生资质审核
 */
class DoctorHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  // 获取系统用户列表
  getTableList = (page, size) => {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'idCardQualification/fetchDoctorHistory',
      payload: {
        userId,
        page,
        size,
      },
    });
  }

  render() {
    const { doctorAduitHistroy, isLoadding } = this.props.idCardQualification;
    const statusData = [
      { text: '待审批', value: 1, color: AppColor.Origin },
      { text: '认证通过', value: 2, color: AppColor.Green },
      { text: '申请驳回', value: 3, color: AppColor.Red },
      { text: '认证被取消', value: 4, color: AppColor.Yellow },
    ]
    const columns = [
      {
        title: '审核人',
        dataIndex: 'worker',
        key: '审核人',
        width: '15%',
      },
      {
        title: '操作状态',
        dataIndex: 'status',
        key: '操作状态',
        width: '12%',
        render: (text) => ( // （1-待审批2-认证通过3-申请驳回4-认证被取消
          <span style={{ color: statusData[Number(text) - 1].color }} >
            { statusData[Number(text) - 1].text }
          </span>
        ),
      },
      {
        title: '操作时间',
        dataIndex: 'utstamp',
        key: '操作时间',
        width: '23%',
      },
      {
        title: '原因',
        dataIndex: 'workerDesc',
        key: 'workerDesc',
        render: (text) => (
          <span title={ text }>
            { isEmpty(text) ? '暂无' : getlimitStr(49, text) }
          </span>
        ),
      },
    ]
    return (
      <div>
        <CommonTable
          isLoadding = { isLoadding }
          columns = { columns }
          result={ doctorAduitHistroy }
          getTableList = { this.getTableList }
        />
      </div>
    );
  }
}
export default DoctorHistory;
