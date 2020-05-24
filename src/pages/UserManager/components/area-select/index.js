import {message, Select} from 'antd';
import React from 'react';
import { connect } from 'dva';
import {  FLAG_SEE } from "@/utils/utils";
const { Option } = Select;

@connect(({ userManage }) =>
  ({
    userManage,
  }),
)
class AreaSelect extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      province: value.province || '',
      city: value.city || '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetchProvinceList',
      payload: {
        keyword: '',
      },
    });
    if(this.state.province){
      dispatch({
        type: 'userManage/fetchCityList',
        payload: {
          provinceid: this.state.province,
        },
      });
    }

  }

  // 省
  provinceOption = () => {
    const { provinceList } = this.props.userManage;
    return provinceList.map(province => (
      <Option
        key = { Number(province.areaId) }
        value= { Number(province.areaId) } >
        { province.areaName }
      </Option>));
  }

  // 市
  cityOption = () => {
    const { cityList = [] } = this.props.userManage;
    return cityList.map(city => (
      <Option
        key = { Number(city.areaId)}
        value= { Number(city.areaId)} >
        { city.areaName }
      </Option>));
  }

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  // 市的选中事件
  onSecondCityChange = city => {
    if (!('value' in this.props)) {
      this.setState({ city });
    }

    this.triggerChange({ city });
  }

  // 省选中事件
  handleProvinceChange = province => {
    const { dispatch, isMore } = this.props;
    dispatch({
      type: 'userManage/fetchCityList',
      payload: {
        provinceid: province,
      },
    });
    if (!('value' in this.props)) {
      this.setState({ province });
    }
    this.setState({
      city: isMore === 'more' ? [] : '',
    });
    this.triggerChange({ province, city: isMore === 'more' ? [] : '' });
  };


  render() {
    const { flag = '1001', isMore = "" } = this.props

    console.log('flagflag',flag)
    return (
      <div style={{display: 'flex',  flexDirection: 'row'}}>
          <Select
            value={ this.state.province }
            style={{ width:  isMore === 'more'? '22%':120 }}
            onChange={this.handleProvinceChange}
            disabled={ flag === FLAG_SEE}
          >
            { this.provinceOption() }
          </Select>
          <Select
            mode= { isMore === 'more' ? "multiple" : ''}
            style={{ width: isMore === 'more'? '77%':120, marginLeft: 20 }}
            value={ this.state.city }
            disabled={ flag === FLAG_SEE }
            onChange={ this.onSecondCityChange }
          >
            { this.cityOption() }
          </Select>
      </div>
    );
  }
}

export default AreaSelect;
