import {BaseUrl} from "@/utils/Constant";
import styles from './index.less'
import React from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts';
import CommonSearch from '../components/CommonSearch'
import { TopTitle2 } from "@/components/ui/TopTitle";
import nextIcon from '@/img/echart_next.png'
import preIcon from '@/img/echart_pre.png'
import {Card, Divider} from "antd";



class HealthPeople extends React.Component {

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    // 使用 SVG 渲染器
    const containerDom =  document.getElementById('box')
    const myChart = echarts.init(containerDom, 'macarons');
    // const myChart = echarts.init(containerDom);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        icon: 'circle',
        data: ['满意', '一般', '不满意', '非常不满意', '非常满意'],
        itemWidth: 12, // 设置宽度
        itemHeight: 12, // 设置高度
        itemGap: 40 // 设置间距
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisLine:{       // x轴
          lineStyle: {
            color: '#333',
          }
        },
        boundaryGap: false,
        data: ['机构一', '机构二', '机构三', '机构四', '机构五', '机构六', '机构七']
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
      series: [
        {
          name: '满意',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210],
          symbol: 'circle',// 折线点设置为实心点
          itemStyle: {
            normal: {
              color: "#00A980",// 折线点的颜色
              lineStyle: {
                color: "#00A980"// 折线的颜色
              }
            }
          }
        },
        {
          name: '一般',
          type: 'line',
          stack: '总量',
          symbol: 'circle',// 折线点设置为实心点
          itemStyle: {
            normal: {
              color: "#22A9F2",// 折线点的颜色
              lineStyle: {
                color: "#22A9F2"// 折线的颜色
              }
            }
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '不满意',
          type: 'line',
          stack: '总量',
          symbol: 'circle',// 折线点设置为实心点
          itemStyle: {
            normal: {
              color: "#F2C322",// 折线点的颜色
              lineStyle: {
                color: "#F2C322"// 折线的颜色
              }
            }
          },
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '非常不满意',
          type: 'line',
          stack: '总量',
          symbol: 'circle',// 折线点设置为实心点
          itemStyle: {
            normal: {
              color: "#F3657C",// 折线点的颜色
              lineStyle: {
                color: "#F3657C"// 折线的颜色
              }
            }
          },
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '非常满意',
          type: 'line',
          stack: '总量',
          symbol: 'circle',// 折线点设置为实心点
          itemStyle: {
            normal: {
              color: "#72D4D4",// 折线点的颜色
              lineStyle: {
                color: "#72D4D4"// 折线的颜色
              }
            }
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };
    const List = []
    for (let i = 0; i < 10; i++) {
      List.push({
        机构名称:`机构${i}`,
        data:[
         {
          name: '满意',
          value: 70
        },
        {
          name: '一般',
          value: 68
        }, {
          name: '不满意',
          value: 48
        },
        {
          name: '非常不满意',
          value: 40
        },
        {
          name: '非常满意',
          value: 32
        }]
      })
    }

    const data = [{
      name: '满意',
      value: 70
    }, {
      name: '一般',
      value: 68
    }, {
      name: '不满意',
      value: 48
    }, {
      name: '非常不满意',
      value: 40
    }, {
      name: '非常满意',
      value: 32
    }];

    const colorList = [
      '#00A980','#22A9F2','#F2C322','#F3657C','#72D4D4'
    ];
    const oo = {
      tooltip : {
      show: true,
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        x : 'center',
        icon: 'circle',
        data: ['满意', '一般', '不满意', '非常不满意', '非常满意'],
        itemWidth: 12, // 设置宽度
        itemHeight: 12, // 设置高度
        itemGap: 40 // 设置间距
      },
      title: [{
        // text: 'Pie label alignTo'
      }, {
        subtext: '地区一',
        left: '16.67%',
        top: '75%',
        textAlign: 'center'
      },
        {
        subtext: '地区二',
          left: '50%',
          top: '75%',
        textAlign: 'center'
      },
        {
        subtext: '地区三',
          left: '83.33%',
          top: '75%',
        textAlign: 'center'
      },
        // {
        //   subtext: '地区四',
        //   left: '75.5%',
        //   top: '75%',
        //   textAlign: 'center'
        // }
      ],

      series : [
      {
        name:'地区一',
        type:'pie',
        center: ['50%', '50%'],
        radius: '25%',
        left: 0,
        right: '66.6667%',
        top: 0,
        bottom: 0,
        data,
        itemStyle: {// 系列级个性化
          normal: {
            color(params) {
              return colorList[params.dataIndex]
            },
            // labelLine:{// 饼图不显示线条
            //   length:2,
            //   show:false
            // },
            label:{// 饼图不显示文字
              // show:true,
              // position : 'inner',// 饼图图上显示百分比
              formatter (params) {
                return `${(params.percent - 0).toFixed(0)  }%`
              },
              textStyle:{
                fontSize:14
              }
            },
          }
        }
      },
      {
        name:'地区二',
        type:'pie',
        center: ['50%', '50%'],
        radius: '25%',
        left: '33.3333%',
        right: '33.3333%',
        top: 0,
        bottom: 0,
        data,
        itemStyle: {// 系列级个性化
          normal: {
            color(params) {
              return colorList[params.dataIndex]
            },
            labelLine:{
                length:2
            },
            label:{// 饼图不显示文字
              // show:false,
              // position : 'inner',// 饼图图上显示百分比
              formatter: `{b} : {d}%`,
              // formatter (params) {
              //   return `${(params.percent - 0).toFixed(0)  }%`
              // },
              textStyle:{
                fontSize:14
              }
            }
          }
        }
      }, {
        name:'地区三',
        type:'pie',
        center: ['50%', '50%'],
        radius: '25%',
        avoidLabelOverlap: false,
        left: '66.6667%',
        right: 0,
        top: 0,
        bottom: 0,
        data,
        itemStyle: {// 系列级个性化
          normal: {
            color(params) {
              return colorList[params.dataIndex]
            },
            labelLine:{// 饼图不显示线条
                show: true,
                length: 6, // 第一段线 长度
                length2: 86, // 第二段线 长度
                align: 'right',
                emphasis: {
                 show: true
               }
            },
            label:{// 饼图不显示文字
                // https://blog.csdn.net/qq_42972625/article/details/105046222
                // 控制引导线上文字颜色和位置,此处a是显示文字区域，b做一个小圆圈在引导线尾部显示
                show: true,
                // a和b来识别不同的文字区域
                formatter: [
                  '{a|{d}%  {b}}',
                  '{b|}'
                ].join('\n'), // 用\n来换行
                rich: {
                  a: {
                    left: 20,
                    padding: [0, -80, -15, -80]
                  },
                  b: {
                    height: 5,
                    width: 5,
                    lineHeight: 5,
                    marginBottom: 10,
                    padding: [0, -5],
                    borderRadius: 5,
                    // backgroundColor(params) {
                    //   return colorList[params.dataIndex]
                    // },
                    backgroundColor: colorList[0], // 圆点颜色和饼图块状颜色一致
                  }
                },

              }
          }
        }
      },
    ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(oo);

  }

  getCurrentList = (list,pageNum) =>{
    return [list.slice((pageNum - 1) * 3, pageNum * 3), list.length];
  }

  getSexZhu = () => {
    const list = []
    for (let i = 10; i < 10; i++) {
      list.push( {product: '地区1', '女': 43.3, '男': 85.8})
    }
    return list
  }


  // 上一个 下一个 点击事件
  handleImageClick = (isNext) => {
    if(isNext){

    }else{

    }
  }

  /**
   * 饼状图 和 线性图 突变点击事件监听
   * @param type 1 - 饼状图 2- 线性图
   */
  onEchartIconChanage = (type) => {
    if(type === 1){

    }
  }

  render() {
    return (
      <Card>
        <div className={styles.main}>
          <TopTitle2 {...{ title: '慢病分析'}} />
           <CommonSearch isNoSelectChronick isNoTabButton onEchartIconChanage = { this.onEchartIconChanage }/>
          <Divider/>
          <div className={styles.TopStyle}>
            <div className={ styles.contentLayout}>
              <div>
                <img src={preIcon} onClick={ this.handleImageClick(true) } alt=""/>
              </div>
              <div style={{width:'100%'}}>
              <div id="box" style={{ width: 'auto', height: '400px' }}/>
              </div>
              <div>
                <img src={nextIcon} onClick={ this.handleImageClick(false) } alt=""/>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

}

export default HealthPeople
