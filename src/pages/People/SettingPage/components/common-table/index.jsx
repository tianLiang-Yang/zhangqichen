import React from 'react'
// eslint-disable-next-line @typescript-eslint/camelcase
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider, Pagination, Table } from 'antd';
import styles from './index.less'

/**
 *   公共table
 *   flag // 1-待审核 2-已通过  4-已驳回 3-已取消
 */
class CommonTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1, // 当前页码
      pageSize: 8, // 页容量
      keyWord: '',
    }
  }

  componentWillMount() {
    this.props.onChlidRef(this)
    this.updateList();
  }

 // 刷新数据
  updateList = () => {
    const { page, pageSize, keyWord = "" } = this.state;
    const { flag = 1 } = this.props;
    console.log("flag",flag)
    this.props.getTableList(page, pageSize, flag, keyWord);
  }

  // 刷新数据从第一页开始
  updateListFrom0 = () => {
    this.setState({
      page:1,
    },()=>{
      const { page, pageSize, keyWord = "" } = this.state;
      const { flag = 1 } = this.props;
      console.log("flag",flag)
      this.props.getTableList(page, pageSize, flag, keyWord);
    })
  }

  /** [onChanageKeyWord 根据keyword] */
  onChanageKeyWord = (keyWord) => {
    this.setState({
      page: 1,
      keyWord,
    }, () => {
      this.updateList();
    })
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
    this.setState({
      page: 1,
      pageSize: size,
    }, () => {
      this.updateList();
    })
  }

  render() {
    const { result , Colums, rightBottomUI, isLoadding, flag } = this.props;
    const { page, pageSize } = this.state;
    return (
       <div className={ styles.main }>
          {/* table表格 */}
         <Table
           columns={ Colums }
           dataSource={ undefined === result ? [] : result.records }
           pagination={false}
           loading = { isLoadding }
           scroll={{ y: 410 }}
           defaultExpandedRowKeys = {flag === 2009 ? [0]: []}
           // defaultExpandAllRows = {flag === 2009}
           onRow={record => ({
             // eslint-disable-next-line no-unused-expressions
               onClick: event => { this.props.OnTableClick ? this.props.OnTableClick(record):  ''}, // 点击行
             })}
         />
         <div style={{ height: '10px' }}></div>
         {/* 分页器 */}
         <div className={ styles.PaginationBottom }>
           <div>
             {rightBottomUI}
           </div>
           <LocaleProvider locale={ zh_CN }>
             <Pagination
               size = "small"
               total = { undefined === result ? 0 : result.total }
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
