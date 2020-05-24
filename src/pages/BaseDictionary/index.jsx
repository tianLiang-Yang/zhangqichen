import React from 'react';
import {Card, List, Divider, Button, Modal, Form, Input, Select, Result, DatePicker} from 'antd'
import styles from './index.less';
import IconFont from '@/components/IconFont';
import { connect } from 'dva';
import { AppColor } from '@/utils/ColorCommom'
import CommonTable from '@/components/common-table';
import { OPRATE_AUDIT_DATA, OPRATE_SEE_DETIALS } from '@/pages/DoctorQualificationReview/help/Colums';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ baseDictionary }) =>
  ({
    baseDictionary,
  }),
)

class BaseDictionary extends React.Component {

  state = {
    page: 1,
    pageSize: 13,
    isLoadding: false,
    addIsVisiable: false,
    current: {},
  }

  formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };


  componentDidMount() {
    const { page, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'baseDictionary/fetchDictionaryRes',
      payload: {
        pageNum: page,
        pageSize,
      },
    });
  }

  /**
   * 获取列表数据http请求
   */
  getTableList = (page, pageSize) => {
    console.log('获取列表数据http请求', '你好')
    const { dispatch } = this.props;
    dispatch({
      type: 'baseDictionary/fetchDetialListbyId',
      payload: {
        pageSize,
        pageNum: page,
      },
    });
  }

  handleAduitDialog = (record, flag) => {

  }

  /**
   * 添加字典值
   * @AddDictionary
   */
  AddDictionary = () => {
      this.setState({
        addIsVisiable: true,
      })
  }


   selectOnSearch = (val) => {
    console.log('search:', val);
  }

  /**
   *  添加和修改字典
    */
  getModalContent = () => {
    const { current } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="字典值" {...this.formLayout}>
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入字典值',
              },
            ],
            initialValue: current.title,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="中文描述" {...this.formLayout}>
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入中文描述',
              },
            ],
            initialValue: current.title,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="简拼(助记码)" {...this.formLayout}>
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入简拼(助记码)',
              },
            ],
            initialValue: current.title,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="备注">
          {getFieldDecorator('subDescription', {
            rules: [
              {
                message: '请输入至少五个字符的备注！',
                min: 5,
              },
            ],
            initialValue: current.subDescription,
          })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
        </FormItem>
      </Form>
    );
  };

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: '序号',
        key: '序号',
        width: '8%',
      },
      {
        title: '字典值',
        dataIndex: '字典值',
        key: '字典值',
        width: '8%',
      },
      {
        title: '中文名称',
        dataIndex: '中文名称',
        key: '中文名称',
        width: '15%',
      },
      {
        title: '助记码',
        dataIndex: '助记码',
        key: '助记码',
        width: '9%',
      },
      {
        title: '备注说明',
        dataIndex: '备注说明',
        key: '备注说明',
        width: '35%',
      },
      {
        title: '状态',
        dataIndex: '状态',
        key: '状态',
        width: '5%',
        render: (text, record) => (
          <div style = {{ color: Number(record.状态) === 0 ? AppColor.Gray : AppColor.Green}}>
            { Number(record.状态) === 0 ? '停用' : '启用' }
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: '操作',
        key: '操作',
        render: (text, record) => (
          <span style = {{ color: AppColor.Green, cursor: 'pointer' }}>
            <a onClick = { () => this.handleAduitDialog(record, OPRATE_SEE_DETIALS) } >上移</a>
            <Divider type="vertical" />
            <a onClick = { () => this.handleAduitDialog(record, OPRATE_AUDIT_DATA)}>下移</a>
            <Divider type="vertical" />
            <a onClick = { () => this.handleAduitDialog(record, OPRATE_AUDIT_DATA)}>停用</a>
             <Divider type="vertical" />
            <a onClick = { () => this.handleAduitDialog(record, OPRATE_AUDIT_DATA)}>修改</a>
          </span>
        ),
      },
    ];
    const { isLoadding } = this.state;
    const { baseDictionary = {} } = this.props;
    const { dictionaryRes = {}, dictionaryListRes = {} } = baseDictionary;
    const { object = [] } = dictionaryRes.data || {};
    // console.log('result------->基础字典---》首页', dictionaryListRes)
   return (
    <Card>
      <div className = { styles.Content }>
        <div className = { styles.ContentLeft }>
          <div className={ styles.Title }>• 字典类型列表</div>
          <div className = { styles.ContentLeftTop}>
            <div className = { styles.ItemXvHao }>序号</div>
            <div className = {styles.ItemDicType }>字典类型</div>
            <div></div>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={ object }
            renderItem={ item => (
              <List.Item>
                <div className = { styles.ItemXvHao }>{ item.序号 }</div>
                <div className = {styles.ItemDicType }>{ item.字典类型 }</div>
                <div className = { styles.ItemOrg }>
                  { item.机构类型 }
                  <IconFont type = "icongengduo" style = {{ marginLeft: 5 }} />
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className={ styles.VLine}></div>
        <div className = { styles.ContentRight }>
          <div style={{ padding: '15px 0px' }}>
            <Select
              showSearch
              style={{ width: 230 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onSearch={ this.selectOnSearch }
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
            <Button onClick = { () => this.AddDictionary() } type="primary" shape="round" style={{ width: '100px', marginLeft: '10px' }}>
              +添加
            </Button>
          </div>
          <CommonTable
            isLoadding = { isLoadding }
            columns = { columns }
            result = { dictionaryListRes }
            getTableList = { this.getTableList }
          />
        </div>
      </div>
      <div className = { styles.BottomHitUI }>
        <span className = { styles.TitlePromit}>温馨提示</span>
        <p>1. 机构维护：如果设置为机构维护，则只有各个机构管理员可以维护，系统管理员/平台管理员不能进行控制；</p>
        <p>2. 系统维护：如果设置为平台维护，该字典项只允许系统管理员/平台管理员进行修改和维护，机构管理员只有浏览权限，没有维护权限；</p>
        <p>3. HIS 维护：如果设置为HIS维护，则该项目只能通过系统管理员/平台管理员在HIS平台基础字典进行维护；</p>
      </div>
      <Modal
        title="添加"
        className={ styles.standardListForm }
        width={ 640 }
        bodyStyle={{ padding: '72px 0' }}
        destroyOnClose
        visible={ this.state.addIsVisiable}
      >
        { this.getModalContent() }
      </Modal>
    </Card>
   )
  }
}
export default (Form.create()(BaseDictionary));
