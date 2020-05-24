import {BaseUrl} from "@/utils/Constant";
import styles from './index.less'
import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts';
import CommonSearch from '../components/CommonSearch'
import { TopTitle2 } from "@/components/ui/TopTitle";
import { Card, Col, Divider, Form, Row, Select, Tabs } from "antd";
import utilStyle from "@/utils/utils.less";
const formItemLayout = {
  labelCol: { span: 5},
  wrapperCol: { span: 18},
};

const { TabPane } = Tabs;

const { Option } = Select;
class HealthPeople extends React.Component {

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    // 使用 SVG 渲染器
    const containerDom =  document.getElementById('box')
    const myChart = echarts.init(containerDom, 'macarons');
    // const myChart = echarts.init(containerDom);
    const zhuOption = {
      title: {
      },
      legend: {
        type: 'scroll',
        icon: "circle",
        itemWidth: 12, // 设置宽度
        itemHeight: 12, // 设置高度
        itemGap: 40 // 设置间距
      },
      tooltip: {},
      dataset: {
        dimensions: ['product', '女', '男',],
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        source: [
          {product: '地区1', '女': '43.3', '男': '85.8'},
          {product: '地区2', '女': '83.1', '男': '73.4'},
          {product: '地区3', '女': '86.4', '男': '65.2',},
          {product: '地区4', '女': '72.4', '男': '53.9',}
        ]
      },
      // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
      xAxis: {
        type: 'category',
        axisTick:{       // x轴刻度线
          color:'red'
        },
        axisLine:{       // x轴
          lineStyle: {
            color: '#333',
          }
        },
      },
      // 声明一个 Y 轴，数值轴。
      yAxis: {
        splitLine:{
          show:true,
          lineStyle:{
            type:'dashed',
          }
        },
        axisLine:{       // y轴
          show:false,
        },
        axisTick:{       // y轴刻度线
          show:false,
        },
      },
      // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
      series: [
        {
          type: 'bar',
          barWidth: '20px',
          color:'#F2C322',
        },
        {
          type: 'bar',
          barWidth: '20px',
          color:'#22A9F2',
        },
      ]
    }

    const option = {
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient : 'vertical',
        x : 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
      },
      calculable : true,
      series : [
        {
          name:'访问来源',
          type:'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:335, name:'直接访问'},
            {value:310, name:'邮件营销'},
            {value:234, name:'联盟广告'},
            {value:135, name:'视频广告'},
            {value:1548, name:'搜索引擎'}
          ]
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

  }

  getSexZhu = () => {
    const list = []
    for (let i = 10; i < 10; i++) {
      list.push( {product: '地区1', '女': 43.3, '男': 85.8})
    }
    return list
  }

  // 更新当前图表
  updateChart = () => {

  }

  /**
   * 饼状图 和 线性图 突变点击事件监听
   * @param type 1 - 饼状图 2- 线性图
   */
  onEchartIconChanage = (type) => {
    if(type === 1){

    }
  }

  /**
   * 性别 和 年龄 点击事件
   * @param key 1 - 性别 2 - 年龄
   */
  tabOnclick = (key) =>{
  }

  render() {
    return (
      <Card>
        <div  className={ `${utilStyle.myFromItem} ${utilStyle.myRadioBoderFrom} ${ styles.main }` }>
          <TopTitle2 {...{ title: '慢病分析'}} />
          <CommonSearch
            tabOnclick = { () =>this.tabOnclick }
            onEchartIconChanage = { this.onEchartIconChanage }
          />
          <Divider/>
          <div id="box" style={{ width: 'auto', height: '400px' }}/>
        </div>
      </Card>
    );
  }
}

export default HealthPeople
