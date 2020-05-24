import React from 'react'
// eslint-disable-next-line @typescript-eslint/camelcase
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider, Pagination, Table } from 'antd';
import styles from './index.less'
import { PageSize } from '@/utils/Constant'

/**
 *   公共table
 */
class CommonTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1, // 当前页码
      pageSize: PageSize, // 页容量
    }
  }

  componentWillMount() {
    this.updateList();
  }

 // 刷新数据
  updateList = () => {
    const { page, pageSize } = this.state;
    this.props.getTableList(page, pageSize);
  }

  /**
   * [onPageChange 选择某一页事件]
   * @param  {[type]} page     [选中页]
   * @param  {[type]} pageSize [当前页容量]
   * @return {[type]}          [undefined]
   */
  onPageChange = (page, pageSize) => {
    console.log('onPageChange page', page)
    this.setState({
      page,
      pageSize,
    }, () => {
      this.updateList();
    })
  }

  /** [onShowSizeChange 页面数据多少改变] */
  onShowSizeChange = (current, size) => {
    console.log('onShowSizeChange page', current)
    this.setState({
      page: 1,
      pageSize: size,
    }, () => {
      this.updateList();
    })
  }

  render() {
    const { result: { data = {} }, columns, isLoadding, bottomRightUI } = this.props;
    console.log('result------->', data)
    const { page, pageSize } = this.state;
    return (
       <div className={ styles.main }>
          {/* table表格 */}
         <Table
           columns = {columns}
           dataSource={ data.object || [] }
           pagination={false}
           loading = { isLoadding }
           scroll={{ y: 410 }}
         />
         <div style={{ height: '10px' }} />
         {/* 分页器 */}
         <div className={ styles.PaginationBottom }>
           <div>
             { bottomRightUI !== null ? bottomRightUI : '' }
           </div>
           {/* eslint-disable-next-line @typescript-eslint/camelcase */}
           <LocaleProvider locale={ zh_CN }>
             <Pagination
               size = "small"
               total = { undefined === data.total ? 0 : data.total }
               current = { page }
               defaultPageSize = { pageSize}
               showSizeChanger
               onShowSizeChange = { this.onShowSizeChange }
               onChange = { this.onPageChange }
               showQuickJumper />
           </LocaleProvider>
         </div>
       </div>
    )
  }
}
export default CommonTable;
