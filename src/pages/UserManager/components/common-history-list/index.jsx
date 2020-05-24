import React from 'react';
import CommonTable from '../../../../components/common-table';
import { connect } from 'dva';
import { getlimitStr } from '@/utils/utils';
import { AppColor } from '@/utils/ColorCommom';


@connect(({ userManage }) =>
  ({
    userManage,
  }),
  )

class HistoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  // 获取系统用户列表
  getTableList = (page, size) => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'userManage/fetchSysHistoryList',
      payload: {
        orgUserId: id,
        page,
        size,
      },
    });
  }


  render() {
    const { sysHistory, isLoadding } = this.props.userManage;
    const columns = [
      {
        title: '审核人',
        dataIndex: 'worker',
        key: '审核人',
        width: '15%',
      },
      {
        title: '操作状态',
        dataIndex: 'afterStatus',
        key: '操作状态',
        width: '12%',
        render: (text) => (
          <span style={{ color: Number(text) === 0 ? AppColor.Red : AppColor.Green }} >
            { Number(text) === 0 ? '封号' : '启号' }
          </span>
        ),
      },
      {
        title: '操作时间',
        dataIndex: 'utstemp',
        key: '操作时间',
        width: '23%',
      },
      {
        title: '原因',
        dataIndex: 'statusDesc',
        key: 'statusDesc',
        render: (text) => (
          <span title={ text }>
            { getlimitStr(49, text) }
          </span>
        ),
      },
    ]
    return (
      <div>
        <CommonTable
          isLoadding = { isLoadding }
          columns = { columns }
          result={ sysHistory }
          getTableList = { this.getTableList }
        />
      </div>
    );
  }
}

export default HistoryList;
