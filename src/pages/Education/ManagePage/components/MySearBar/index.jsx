import React from 'react';
import {Row, Col, Select, Input, DatePicker, Radio, TreeSelect} from 'antd';
import styles from './index.less';
import IconFont from "@/components/IconFont";
import {AppColor} from "@/utils/ColorCommom";
import {CourseAttrs, sourceTypes, sourceModes,sourceTypeList,userTypeList} from '@/utils/map/DictionaryUtil'
import {connect} from "dva";
import moment from "moment";
import {handleEmptyStr, isEmpty} from "@/utils/utils";

const { Option } = Select;

@connect(({ eduClassModule, eduAddModule  }) =>
  ({
    eduClassModule,
    eduAddModule,
  }),
)

class MySearBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visiable: false,
      resourceType:'',
      className:'',
      keyword:'',
      classTypeIds:[], // 选择分类
      throngIds:[],
      sourceMode:'',
      sourceType:'',
      userType:'',
      lecturer:'', // 讲师
      createUserName:'', // 上传者
      createOrgName:'' , // 上传者机构（创建人机构)
      radioTypeValue:1, // 全部 ‘’ ， 无分类 null
      cancelTimeDesc:'', // 有效期至
      ctstampDesc:'', // 输入上传日期
      calssProperty:'', // 课程属性
    };
  }

  componentWillMount() {
    this.getAllList();
    this.getCrowdList();
  }

  // 请求人群列表
  getCrowdList = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'eduAddModule/getBaThrongList',
      payload:{},
    });
  }


  /**
   * 获取上级课程分类
   */
  getAllList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eduClassModule/getAllClassList',
      payload: {},
    });
  }

  // 分类选择监听
  onTreeChange = value => {
    console.log('分类选择监听',value);
    this.setState({ classTypeIds: value });
  };

  onRadioTypeChange = e => {
    console.log('radio checked', e.target.value);
    if( e.target.value === 1){
      this.setState({ classTypeIds: [] });
    }else if( e.target.value === 2){
      this.setState({ classTypeIds: null });
    }
    this.setState({ radioTypeValue: e.target.value });
  };

  // eslint-disable-next-line class-methods-use-this
   onSelectSourceTypesChange = (value) => {
    this.setState({ resourceType: value })
  }

  // eslint-disable-next-line class-methods-use-this
  onSelectCourseTypeChange = (value) => {
    this.setState({ calssProperty: value })
  }



  // 分类选择监听
    onSelectChange = value => {
    console.log('分类选择监听',value);
    this.setState({ throngIds: value });
  };


  // eslint-disable-next-line class-methods-use-this
  onSelectSourceModeChange = (value) => {
    this.setState({ sourceMode: value })
  }

  // eslint-disable-next-line class-methods-use-this
  onSelecSourceTypeListChange = (value) => {
    this.setState({ sourceType: value })
  }

  // eslint-disable-next-line class-methods-use-this
  onSelecUserTypeListChange = (value) => {
    this.setState({ userType: value })
  }

  onCancleDateChange = (date, dateString) =>{
    this.setState({ cancelTimeDesc: dateString})
  }

  onCreateDateChange = (date, dateString) =>{
    this.setState({ ctstampDesc: dateString})
  }

  // 课堂分分类列表
  getAllClassData = () => {
    const { allList = []} = this.props.eduClassModule;
    const treeList = JSON.parse(JSON.stringify(allList)
      .replace(/classTypeName/g,"title")
      .replace(/list/g,"children")
      .replace(/classTypeId/g,"value"));
    console.log('handleAllClassData',treeList)

    return treeList;
  }

  // 课堂分分类列表
  getAllPeopleClassData = () => {
    const { ThrongList = []} = this.props.eduAddModule;
    const treeList = JSON.parse(JSON.stringify(ThrongList)
      .replace(/throngName/g,"title")
      .replace(/list/g,"children")
      .replace(/throngId/g,"value"));
    console.log('handleAllClassData222222',treeList)
    return treeList;
  }


  // 清空搜索条件
  clearValue = () =>{
     this.setState({
       resourceType:'',
       className:'',
       keyword:'',
       classTypeIds:[], // 选择分类
       throngIds:[],
       sourceMode:'',
       sourceType:'',
       userType:'',
       lecturer:'', // 讲师
       createUserName:'', // 上传者
       createOrgName:'' , // 上传者机构（创建人机构)
       radioTypeValue:1, // 全部 ‘’ ， 无分类 null
       cancelTimeDesc:'', // 有效期至
       ctstampDesc:'', // 输入上传日期
       calssProperty:'', // 课程属性
     },()=>{
       this.props.onClickSearch(this.state)
     })
  }

  render() {
    const searchUI =   <div className={styles.SearchStyle}

                          >
                           <IconFont
                             type="iconsousuo1"
                             style={{fontSize:20,marginRight:10}}
                             onClick={()=>{this.props.onClickSearch(this.state)}}
                           />
                            <IconFont
                              type="iconqingkong"
                              style={{fontSize:20,color:AppColor.Green}}
                              onClick={ this.clearValue }
                            />
                       </div>

    const { visiable, className, keyword, lecturer, createUserName, createOrgName, radioTypeValue } = this.state;
    // 人群
    const { ThrongList = [ ] } = this.props.eduAddModule

    return (
        <div className={styles.main}>
          <Row className={styles.MyCol}>
            <Col span={8}>
              <div className={styles.HLayout}>
                <div >资源类型：</div>
                <div>
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="请选择资源类型"
                    optionFilterProp="children"
                    value={ this.state.resourceType }
                    onChange={this.onSelectSourceTypesChange}
                  >
                    {
                      Object.keys(sourceTypes).map((item) => <Option value={item}>{sourceTypes[item]}</Option>)
                    }
                  </Select>
                </div>
              </div>
            </Col>
            <Col span={7}>
              <div className={styles.HLayout}>
                <div >课程标题：</div>
                <div>
                  <Input
                    value={ className }
                    onChange={(e)=>{
                      this.setState({className:e.target.value})}
                    }
                    style={{ width: '100%' }} placeholder="输入课程标题" />
                </div>
              </div>
            </Col>
            <Col span={7}>
              <div className={styles.HLayout}>
                <div >搜索关键字：</div>
                <div>
                  <Input
                    value={ keyword }
                    onChange={(e)=>{
                      this.setState({keyword:e.target.value})}
                    }
                    style={{ width: '100%' }} placeholder="输入搜索关键字" />
                </div>
              </div>
            </Col>
            <Col span={2}>
              <div style={{display: !visiable ? 'block' : 'none'}}>
              { searchUI }
              </div>
            </Col>
          </Row>

          <div style={{display: visiable ? 'block' : 'none'}}>
            <Row className={styles.MyCol}>
              <Col span={15}>
                <div className={styles.HLayout}>
                  <div >课程分类：</div>
                  <div className={styles.CourseclassStyle}>
                    <div >
                      <Radio.Group
                        style={{ width: '40%' }}
                        onChange={this.onRadioTypeChange}
                        value={radioTypeValue}>
                        <Radio value={1}>全部</Radio>
                        <Radio value={2}>无分类</Radio>
                        <Radio value={3}>分类</Radio>
                    </Radio.Group>
                    </div>
                      <TreeSelect
                        value={this.state.classTypeIds}
                        showSearch
                        style={{ width: '100%', }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择课程分类"
                        treeData={ this.getAllClassData() }
                        allowClear
                        multiple
                        treeDefaultExpandAll
                        onChange={this.onTreeChange}
                       />
                  </div>

                </div>
              </Col>
              <Col span={7}>
                <div className={styles.HLayout}>
                  <div >课程属性：</div>
                  <div>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="请选择课程属性"
                      optionFilterProp="children"
                      value={ this.state.calssProperty }
                      onChange={ this.onSelectCourseTypeChange }
                    >
                      {
                        Object.keys(CourseAttrs).map((item) => <Option value={item}>{CourseAttrs[item]}</Option>)
                      }
                    </Select>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className={styles.MyCol}>
              <Col span={15}>
                <div className={styles.HLayout}>
                  <div >所属人群：</div>
                  <div style={{width:'85%'}}>
                    <TreeSelect
                      showSearch
                      style={{ width: '100%', }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择人群分类"
                      treeData={ this.getAllPeopleClassData() }
                      allowClear
                      multiple
                      treeDefaultExpandAll
                      onChange={this.onSelectChange}
                      value={ this.state.throngIds}
                    />
                  </div>
                </div>
              </Col>
              <Col span={7}>
                <div className={styles.HLayout}>
                  <div >来源方式：</div>
                  <div>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="请选择来源方式"
                      optionFilterProp="children"
                      onChange={this.onSelectSourceModeChange}
                      value={ this.state.sourceMode }
                    >
                      {
                        Object.keys(sourceModes).map((item) => <Option value={item}>{sourceModes[item]}</Option>)
                      }
                    </Select>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className={styles.MyCol}>
              <Col span={8}>
                <div className={styles.HLayout}>
                  <div >来源渠道：</div>
                  <div>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="请选择来源渠道"
                      optionFilterProp="children"
                      onChange={this.onSelecSourceTypeListChange}
                      value={ this.state.sourceType }
                    >
                      {
                        Object.keys(sourceTypeList).map((item) => <Option value={item}>{sourceTypeList[item]}</Option>)
                      }
                    </Select>
                  </div>
                </div>
              </Col>
              <Col span={7}>
                <div className={styles.HLayout}>
                  <div >讲师：</div>
                  <div>
                    <Input
                      value={ lecturer }
                      onChange={(e)=>{
                        this.setState({lecturer:e.target.value})}
                      }
                      style={{ width: '100%' }} placeholder="输入讲师名" />
                  </div>
                </div>
              </Col>
              <Col span={7}>
                <div className={styles.HLayout}>
                  <div >上传日期：</div>

                  <div>
                    <DatePicker
                      value={
                        isEmpty(this.state.ctstampDesc) ?
                          ''
                          :
                          moment(this.state.ctstampDesc)
                      }
                      onChange={this.onCreateDateChange}
                      style={{width:'100%'}} />
                  </div>
                </div>
              </Col>
            </Row>

            <Row className={styles.MyCol}>
              <Col span={8}>
                <div className={styles.HLayout}>
                  <div >上传者：</div>
                  <div>
                    <Input
                      value={ createUserName }
                      onChange={(e)=>{
                        this.setState({createUserName:e.target.value})}
                      }
                      tyle={{ width: '100%' }}
                      placeholder="输入上传者名" />
                  </div>
                </div>
              </Col>
              <Col span={7}>
                <div className={styles.HLayout}>
                  <div >上传者机构：</div>
                  <div>
                    <Input
                      value={ createOrgName }
                      onChange={(e)=>{
                        this.setState({createOrgName:e.target.value})}
                      }
                      style={{ width: '100%' }} placeholder="输入上传者机构" />
                  </div>
                </div>
              </Col>
              <Col span={7}>
                <div className={styles.HLayout}>
                  <div >上传途径：</div>
                  <div>
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="请选择上传途径"
                      optionFilterProp="children"
                      onChange={this.onSelecUserTypeListChange}
                      value={ this.state.userType }
                    >
                      {
                        Object.keys(userTypeList).map((item) => <Option value={item}>{userTypeList[item]}</Option>)
                      }
                    </Select>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className={styles.MyCol}>
              <Col span={8}>
                <div className={styles.HLayout}>
                  <div >有效期至：</div>
                  <div style={{width:'85%'}}>
                    <DatePicker
                      value={
                        isEmpty(this.state.cancelTimeDesc) ?
                        ''
                        :
                        moment(this.state.cancelTimeDesc)
                      }
                      onChange={this.onCancleDateChange}
                      style={{width:'100%'}} />
                  </div>
                </div>
              </Col>
              <Col span={14}></Col>
              <Col span={2}>
                { searchUI }
              </Col>
            </Row>

          </div>
          <div>
            <div className={styles.DownLayout}>
              <div className={styles.ClickStyle}
                   onClick={()=>{
                      this.setState({
                        visiable:!visiable,
                      })
                   }}>
                <IconFont type={visiable ? "icondaosanjiao-" : "icondaosanjiao"} style={{fontSize:15}}/>

              </div>
            </div>
            <div className={styles.downLine}/>
          </div>

          </div>
    );
  }
}

export default MySearBar;
