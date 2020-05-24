import React, { Component } from 'react'
import { Card } from 'antd'

//导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import wel from './Welcome.less';

export default class PieA extends Component {
  
    getOption = ()=>{
        let option = {
            title: {
                text: '用户订单',
                x: 'center'
            },
            tooltip : {
                trigger: 'item',
                //提示框浮层内容格式器，支持字符串模板和回调函数形式。
                formatter: "{a} <br/>{b} : {c} ({d}%)" 
            },
            legend: {
                orient: 'vertical',
                top: 20,
                right: 5,
                data: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
            },
            series : [
                {
                    name:'订单量',
                    type:'pie',
                    data:[
                        {value:1000, name:'星期一'},
                        {value:1500, name:'星期二'},
                        {value:2000, name:'星期三'},
                        {value:2500, name:'星期四'},
                        {value:3000, name:'星期五'},
                        {value:2300, name:'星期六'},
                        {value:1600, name:'星期日'}
                    ],
                }
            ]
        }
        return option;
    }
    render() {
        return (
          <div className={wel.box}>
            <Card.Grid className="pie_a">
                <ReactEcharts option={this.getOption()}/>
            </Card.Grid>
          </div>
            
        )
    }
}