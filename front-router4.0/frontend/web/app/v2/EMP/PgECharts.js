import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import {dm} from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'
import echarts from 'echarts'


class PgECharts extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      checkNum:0,
      qa:[],

    }

    //this.data = ['我的邀请','我的提问','我的回答',];
    this.data = ['我的提问','我的回答',];
  }

  componentWillMount() {

  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echarts'));
    // 绘制图表
    myChart.setOption({
      title : {
              text: '铂略颜值分数打分',
              subtext: '绝对真实',
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              orient: 'vertical',
              left: 'left',
              data: ['利奥','比利','帅丹','丽丽','贝总']
          },
          series : [
              {
                  name: '颜值来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:[
                      {value:10, name:'利奥'},
                      {value:1, name:'比利'},
                      {value:99999, name:'帅丹'},
                      {value:9999, name:'丽丽'},
                      {value:9999, name:'贝总'}
                  ],
                  itemStyle: {
                      emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
    });
  }

  componentWillUnmount() {
  }

  render(){

    return(
      <div style={{...styles.container}}>
        <div id="echarts" style={{...styles.echarts}}>

        </div>

      </div>
    )
  }



}

var styles ={
  container:{
    backgroundColor:Common.Bg_White,
    height:window.innerHeight,
  },
  echarts:{
    width: window.screen.width,
    height: 200
  }

}

export default PgECharts;
