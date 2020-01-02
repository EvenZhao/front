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


var countdown;
var load
var t
var startX
var startY
var innerHeight = window.innerHeight
var Opacity
var accountLabelTotal = 0
//返回角度
function GetSlideAngle(dx, dy) {
		return Math.atan2(dy, dx) * 180 / Math.PI;
}


//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
function GetSlideDirection(startX, startY, endX, endY) {
		var dy = startY - endY;
		var dx = endX - startX;
		var result = 0;

		//如果滑动距离太短
		if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
				return result;
		}

		var angle = GetSlideAngle(dx, dy);
		if(angle >= -45 && angle < 45) {
				result = 4;
		}else if (angle >= 45 && angle < 135) {
				result = 1;
		}else if (angle >= -135 && angle < -45) {
				result = 2;
		}
		else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
				result = 3;
		}

		return result;
}

var width= window.screen.width

class bolueWeeklyReport extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      studyRank:[],
      learnTime:{},
      basicInfo:{},
      actionEffective:{},
      accountLabel:[],
      effectiveData:[],
      accountLabelName:[],//饼图的标签名称表
      checkDispalyNum:['block','none','none','none'],//
			checkoutNum: 0,//默认显示第一个
			height: innerHeight,
			upDown: false,
			// Opacity:0,
			top: 0,
			activityDown: false,//图标切换flag
			activityDownHideen: false,//如果最后一页隐藏图标
      accountLabelTwo:[],
      //是否显示logo
      // hasLogo:false,

    }
    this.itemStyleColor=['#1ce2bf','#d9a1a1','#48c8e0','#ab9bff','#f58484','#03a3f5','#fcb385','#23b7c4','#735cd0','#e4e19b',   '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
    '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0']
    this.checkout = ['0','1','2','3']
  }
  _handleGetempDataDone(re){
    console.log('_handleGetempDataDone',re);
    if (!re.result || re.result.length < 1) {
      return
    }
    var result = re.result || {}
    var dataList = result.actionEffective.dataList || {}
    var newEffectiveData = []
    if (dataList) {
      var effectiveData = dataList.effectiveData || []
      for (var i = 0; i < effectiveData.length; i++) {
        if (i == 0 || i== 4 || i== 8 || i== 12 || i== 16 || i== 20 || i== 24) {
          newEffectiveData.push(effectiveData[i])
        }
      }
    }
    console.log('newEffectiveData',newEffectiveData);
    var accountLabel = result.accountLabel || []
    var newAccountLabel=[]
    var accountLabelName = []
    for (var i = 0; i < accountLabel.length; i++) {
			accountLabelTotal = accountLabelTotal + accountLabel[i][1]
      var obj = {
        value: accountLabel[i][1],
        name:accountLabel[i][0],
        itemStyle:{
          normal:{
            color:this.itemStyleColor[i]
          }
        }
      }
      newAccountLabel.push(obj)
      accountLabelName.push(accountLabel[i][0])
    }
    this.setState({
      studyRank: result.studyRank || [],
      learnTime: result.learnTime,
      basicInfo: result.basicInfo,
      actionEffective: result.actionEffective,
      accountLabel: newAccountLabel || [],
      effectiveData: newEffectiveData || [],
      accountLabelName: accountLabelName,
			accountLabelTwo: result.accountLabel
    })
    this.xuanke()
    // this.huoyue()
    this.learnRecordTotal()
		Opacity = setInterval(()=>{
				if( this.state.Opacity < 1 ){
						this.setState({
								// Opacity: this.state.Opacity + 0.2,
								height: innerHeight
						});
				} else {
						clearInterval(Opacity);
				}
		}, 300);
  }
  onTouchStart(ev){
    // var touch = event.targetTouches[0];
		startX = ev.touches[0].pageX;
		startY = ev.touches[0].pageY;
		this.setState({
			activityDownHideen: true
		})
  }
  onTouchEnd(ev){
    var endX
    var endY
		var checkoutNum = this.state.checkoutNum
		var checkDispalyNum = this.state.checkDispalyNum
    endX = ev.changedTouches[0].pageX;
    endY = ev.changedTouches[0].pageY;
     var direction = GetSlideDirection(startX, startY, endX, endY);
     switch(direction) {
      case 0:
          break;
      case 1:
          console.log("向上");
					if (checkoutNum !== 3) {
						checkDispalyNum[checkoutNum]= 'none' //把当前的块设置为none
						checkDispalyNum[checkoutNum + 1]= 'block' //把下一个块设置为block
						this.setState({
							checkoutNum: checkoutNum + 1,
							checkDispalyNum: checkDispalyNum,
							upDown: false,
							height: 0,
							activityDownHideen: (checkoutNum == 2) ? true : false
						},()=>{
							this.onTouchMove()
						})
					}
          break;
      case 2:
          console.log("向下");
					if (checkoutNum !== 0) {
						checkDispalyNum[checkoutNum]= 'none' //把当前的块设置为none
						checkDispalyNum[checkoutNum - 1]= 'block' //把下一个块设置为block
						this.setState({
							checkoutNum: checkoutNum - 1,
							checkDispalyNum: checkDispalyNum,
							upDown: true,
							height: 0,
							activityDownHideen: false
						},()=>{
							this.onTouchMove()
						})
					}else {
						this.setState({
							activityDownHideen: false
						})
					}
          break;
      default:
    }

  }
	onTouchMove(e){
		countdown = setInterval(()=>{
				if( this.state.height < innerHeight ){
						this.setState({
								height: this.state.height + 10
						});
				} else {
						clearInterval(countdown);
						this.setState({
							height: innerHeight
						})
				}
		}, 10);
	}
	_changeTop() {
		var top = this.state.top
		var activityDown = this.state.activityDown
		if (top == 2) {
			this.setState({
				activityDown: false
			})
		}else if (top == 0) {
			this.setState({
				activityDown: true
			})
		}
		if (activityDown) {
			top = top + 2
		}else {
			top = top - 2
		}
		this.setState({
			top: top
		})
		t = setTimeout(() => {
			this._changeTop()
		}, 300)
	}
  componentWillMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-每周学习报告')
  }
  huoyue(){
    var huoyue = echarts.init(document.getElementById('huoyue'));
    huoyue.setOption({
			// backgroundColor: '#F5F9FB',
      title: {
        // text: '堆叠区域图'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#2196F3'
                }
            }
        },
        legend: {
            // data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
            borderColor:'#238cae'
        },
        toolbox: {
            feature: {
                // saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['0','04','08','12','16','20','24'],
								axisLine: {
									onZero: false,
									lineStyle: {
										color: '#666666'
									}
								},
            }
        ],
        yAxis : [
            {
                type : 'value',
								splitLine: {
									lineStyle:{
										type:'dotted'
									}
									// show: false
								},
								axisLine: {
									onZero: false,
									lineStyle: {
										color: '#BDBDBD'
									}
								},
            }
        ],
        series : [
            {
                name:'活跃指数',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
								// show:true,
                data:this.state.effectiveData,
                itemStyle: {
                 normal: {
									 color : '#00c3b1',
									//  label : {show: true},
                   areaStyle: {
                       // 区域图，纵向渐变填充
                       color :'#2196F3'
                   },
									 lineStyle: {
											//  color : '#00c3b1'
									 }
                 },
               },
							//  markLine: {
							// 		//  color:'#BDBDBD',
	            //      data: [
	            //          {type: 'max', name: '最大值'}
	            //      ]
	            //  }
            },
        ],
				// timeline:{
				// 	// width:'90%'
				// }
      // color:['#2196F3']
    });
  }
  xuanke(){
    var xuanke = echarts.init(document.getElementById('xuanke'));
    // 绘制图表
    xuanke.setOption({
      title : {
              // text: '铂略颜值分数打分',
              // subtext: '绝对真实',
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{b}:{d}%",
							position:['30%','50%']
          },
          legend: {
            orient: 'horizontal',//horizontal vertical 布局方式，默认为水平布局，可选为：'horizontal' | 'vertical'
            bottom: 0,
            left: 'center',
						// data: this.state.accountLabelName || [],
						itemWidth:10,
						itemHeight:10
          },
          series : [
              {
                  // name: '标签名称',
                  type: 'pie',
                  radius : '90%',
                  center: ['50%', '50%'],
                  left:'20%',
                  data:this.state.accountLabel,
                  itemStyle: {
                      emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      },
                      normal: {
                        label: {
                            show: false,
														formatter: '{b} : {c} ({d}%)'
                        },
                        labelLine: {
                            show: false
                        }
                      }
                      // label.normal.show: false
                  }
              }
          ]
    });
  }
  learnRecordTotal(){
    var learnTime = this.state.learnTime || {}
    var dataList = learnTime.dataList || {}
    var platform = dataList.platform || []
    var company = dataList.company || []
    var nameList = learnTime.nameList || []
    var newNameList = []
    for (var i = 0; i < nameList.length; i++) {
      var start_time = new Date(nameList[i]).format("M-dd");
      newNameList.push(start_time.replace('-', "."))
    }
    var learnRecordTotal = echarts.init(document.getElementById('learnRecordTotal'));
    // 绘制图表
    var colors = ['#ffb942', '#2196F3', '#675bba'];
    learnRecordTotal.setOption({
			// backgroundColor: '#F5F9FB',
      title: {
      },
      tooltip: {
      },
      legend: {
      },
      xAxis:  {
          type: 'category',
          boundaryGap: false,
          data: newNameList,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#BDBDBD'
            }
          },
					// axisTick: {
					// 		show: false
					// }
      },
      yAxis: {
          type: 'value',
					splitLine: {
						lineStyle:{
							type:'dotted'
						}
						// show: false
					},
					axisLine: {
						onZero: false,
						lineStyle: {
							color: '#BDBDBD'
						}
					},
      },

      series: [
        {
            name:'公司',
            type:'line',
            smooth: true,
            data: company,
						markPoint: {
								data: [
										{type: 'max', name: '最大值'},
										// {type: 'min', name: '最小值'}
								]
						},
            itemStyle:{
              normal:{
                color:'#2196F3'
              }
            },
						// markLine: {
						// 		color:'#BDBDBD'
						// 		data: [
						// 				{type: 'max', name: '最大值'}
						// 		]
						// }
        },
        {
            name:'个人',
            type:'line',
            smooth: true,
            data: platform,
						markPoint: {
								data: [
										{type: 'max', name: '最大值'},
										// {type: 'min', name: '最小值'}
								]
						},
            itemStyle:{
              normal:{
                color:'#ea9333'
              }
            }
        }
      ]
    });
  }
  componentDidMount() {
		console.log('document.getElementById()----',document.getElementById('container'))
		this._changeTop()
		// if (!isApple) {
			t = setTimeout(() => {
				this.stopDrop()
			}, 300)
		// }
    Dispatcher.dispatch({//发送请求获取定位城市
			actionType: 'GetempData',
			// id: '599e5ebd9c8acc993f78b334'
			id: this.props.match.params.id
		})
    this._GetempData = EventCenter.on('GetempDataDone',this._handleGetempDataDone.bind(this))

  }

  componentWillUnmount() {
    this._GetempData.remove()
  }
	/**
	 * 禁止浏览器下拉回弹
	 */
	 stopDrop() {
		 document.body.addEventListener('touchmove', function (evt) {
		//In this case, the default behavior is scrolling the body, which
		//would result in an overflow.  Since we don't want that, we preventDefault.
			if (!evt._isScroller) {
					evt.preventDefault();
			}
		});

	}
  render(){//emp_answer emp_person
    var basicInfo = this.state.basicInfo || {}
    // var vitality = this.state.actionEffective.dataList
    // console.log('vitality',vitality);
    var studyRank =  this.state.studyRank.map((item,index)=>{
      var count = index + 1
      return(
        <div key={index} style={{...styles.learnRecordTotal,borderBottomStyle:index == 9 ? null : 'solid'}}>
          <div style={{float:'left',marginLeft:22,marginTop:(window.innerHeight * (50/667)-16)/2-2,width:6}}>
            <span style={{fontSize:16,color:'#000000',fontFamily:'Arial-ItalicMT'}}>{count}</span>
          </div>
          <div style={{float:'left',marginLeft:19,marginTop:(window.innerHeight * (50/667)-16)/2 -5,}}>
            <img src={item.photo} style={{borderRadius:20}} height="27" width="27"/>
          </div>
          <div style={{...styles.LineClamp,height:20, float:'left',marginLeft:14,marginTop:(window.innerHeight * (50/667)-16)/2 -2,width:window.screen.width - 198,fontSize:16,color:'#000000'}}>
           {item.name}
          </div>
          <div style={{float:'right',textAlign:'right', marginRight:24,marginTop:(window.innerHeight * (50/667)-16)/2 -2,width:76}}>
            <span style={{fontSize:20,color:'#2196F3'}}>{item.studyTime}</span>
          </div>
					<div></div>
        </div>
      )
    })
    var checkout = this.checkout.map((item,index)=>{
      var marginTop=16
      if (index==0) {
        marginTop=0
      }
			if (index ==  this.state.checkoutNum) {
				return(
					<div key={index} style={{height:7,width:7,backgroundColor:'#2196F3',borderRadius:'8px',marginTop:marginTop}}></div>
				)
			}else {
				return(
					<div key={index} style={{...styles.checkoutDiv,marginTop:marginTop}}></div>
				)
			}
    })
		var accountLabelTwo = this.state.accountLabelTwo.map((item,index)=>{
			var aa = item[1]/accountLabelTotal
			var total = (Math.round(aa * 10000)/100).toFixed(1)
			return(
				<div key={index} style={{...styles.xuanke}}>
					<div style={{height:10,width:10,float:'left',marginRight:7,backgroundColor:this.itemStyleColor[index],marginLeft:30,borderRadius:'2px'}}></div>
					<div style={{...styles.LineClamp,float:'left',width:(width/2-47)}} >
						<span style={{fontSize:11,color:'#616161'}}>{item[0]} {total}%</span>
					</div>
				</div>
			)
		})
    return(
      <div style={{...styles.container}}
        ref={(lessonList) => this.lessonList = lessonList}
        onTouchEnd={this.onTouchEnd.bind(this)}
        onTouchStart={this.onTouchStart.bind(this)} id="container" >
      {/*
        <div style={{...styles.report_bg,display:this.state.checkDispalyNum[0],position:this.state.upDown ? 'relative':'absolute',bottom:0,}}>
          <div style={{textAlign:'center'}}>
            { this.state.hasLogo ?
              <div style={{marginTop:179}}>
                <img src={Dm.getUrl_img('/img/v2/icons/emp_logo.png')} width="130" height="44"/>
              </div>
              :
              <div style={{fontSize:16,color:'#333',marginTop:200}}>铂略企业咨询管理有限公司</div>
            }
              <div style={{fontSize:40,color:'#333',marginTop:10}}>每周学习报告</div>
              <div style={styles.date}>2017.8.1 — 2017.8.7</div>
            </div>
            <div style={{position:'fixed',left:0,bottom:20,zIndex:999, width:window.screen.width,textAlign:'center',fontSize:12,color:'#999'}}>铂略财税学习平台发布</div>
        </div>
        */}
        <div style={{...styles.div,display:this.state.checkDispalyNum[0],height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0,}}>
          <div style={{...styles.titleDiv}}>
            <span style={{fontSize:20,color:'#2196F3'}}>学习概览</span>
          </div>
          <div style={{width:width}}>
            <div style={{...styles.blockDiv,float:'left',marginRight:2,marginLeft:((width-(width*(160/375)*2)+2))/2}}>
              <div style={{marginTop:37*(37/50)}}>
                <img src={Dm.getUrl_img('/img/v2/icons/emp_time@2x.png')} height="28" width="28"/>
              </div>
              <div>
                <span style={{fontSize:12,color:'#424242'}}>学习时长(小时)</span>
              </div>
              <div>
                <span style={{fontSize:30,color:'#2196F3'}}>{basicInfo.countTimeAll || 0}</span>
              </div>
            </div>
            <div style={{...styles.blockDiv,float:'left'}}>
              <div style={{marginTop:37*(37/50)}}>
                <img src={Dm.getUrl_img('/img/v2/icons/emp_person@2x.png')} height="27" width="29"/>
              </div>
              <div>
                <span style={{fontSize:12,color:'#424242'}}>学习总人数</span>
              </div>
              <div>
                <span style={{fontSize:30,color:'#2196F3'}}>{ basicInfo.countAccount || 0 }</span>
                <span style={{fontSize:24,color:'#616161'}}>/{ basicInfo.staffCountAll || 0}</span>
              </div>
            </div>
            <div></div>
            <div style={{...styles.blockDiv,float:'left',marginRight:2,marginLeft:((width-(width*(160/375)*2)+2))/2,marginTop:2}}>
              <div style={{marginTop:37*(37/50)}}>
                <img src={Dm.getUrl_img('/img/v2/icons/emp_class@2x.png')} height="30" width="25"/>
              </div>
              <div>
                <span style={{fontSize:12,color:'#424242'}}>学习总课程数</span>
              </div>
              <div>
                <span style={{fontSize:30,color:'#2196F3'}}>{ basicInfo.totalCourses || 0 }</span>
              </div>
            </div>
            <div style={{...styles.blockDiv,float:'left',marginTop:2}}>
              <div style={{marginTop:37*(37/50)}}>
                <img src={Dm.getUrl_img('/img/v2/icons/emp_answer@2x.png')} height="31" width="30"/>
              </div>
              <div>
                <span style={{fontSize:12,color:'#424242'}}>试题答题总次数</span>
              </div>
              <div>
                <span style={{fontSize:30,color:'#2196F3'}}>{ basicInfo.totalQuestionAnswer || 0 }</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{...styles.div,display:this.state.checkDispalyNum[3],height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
          <div style={{...styles.titleDiv}}>
            <span style={{fontSize:20,color:'#2196F3'}}>学习时长排行榜
              <span style={{fontSize:14,color:'#616161'}}>(小时)</span>
            </span>
          </div>
          {studyRank}
        </div>
        {/*
        <div style={{...styles.div,display:this.state.checkDispalyNum[2],height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
          <div style={{...styles.titleDiv}}>
            <span style={{fontSize:20,color:'#2196F3'}}>活跃指数</span>
          </div>
           <div id="huoyue" style={{...styles.echarts,height: 290,paddingLeft:10}}></div>
        </div>
       */} 
        <div style={{...styles.div,display:this.state.checkDispalyNum[1],height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
          <div style={{...styles.titleDiv}}>
            <span style={{fontSize:20,color:'#2196F3'}}>选课标签</span>
          </div>
           <div id="xuanke" style={{...styles.echarts,height:290,marginBottom:12}}></div>
					 {accountLabelTwo}
        </div>
        <div style={{...styles.div,display:this.state.checkDispalyNum[2],height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
          <div style={{...styles.titleDiv}}>
            <span style={{fontSize:20,color:'#2196F3'}}>学习时长</span>
          </div>
           <div id="learnRecordTotal" style={{...styles.echarts,height:290,paddingLeft:10}}></div>
					 <div>
						 <div style={{marginLeft:43,float:'left',lineHeight:0.5}}>
							 <span style={{fontSize:11,color:'#BDBDBD'}}>时间单位:小时</span>
						 </div>
						 <div style={{float:'right',width:50,marginRight:20}}>
							 <div style={{height:10,width:10,backgroundColor:'#ea9333',float:'left',marginRight:7,borderRadius:'2px'}}></div>
							 <div style={{lineHeight:0.5}}>
								 <span style={{fontSize:11,color:'#ea9333'}}>平台</span>
							 </div>
						 </div>
						 <div style={{float:'right',width:50}}>
							 <div style={{height:10,width:10,backgroundColor:'#2196F3',float:'left',marginRight:7,borderRadius:'2px'}}></div>
							 <div style={{lineHeight:0.5}}>
								 <span style={{fontSize:11,color:'#2196F3'}}>公司</span>
							 </div>
						 </div>
					 </div>
        </div>
        <div style={{...styles.sortNum}}>
          {checkout}
        </div>
				{
					!this.state.activityDownHideen ?
						<div>
							{
								this.state.activityDown ?
								<div style={{...styles.goBack}} >
									<img src={Dm.getUrl_img(`/img/v2/icons/emp01@2x.png`)} style={{position: 'relative', top: this.state.top, width: 40, height: 13}}/>
								</div>
								:
								<div style={{...styles.goBack}}>
									<img src={Dm.getUrl_img(`/img/v2/icons/emp02@2x.png`)} style={{position: 'relative', top: this.state.top, width: 40, height: 13}}/>
								</div>
							}
						</div>
					: null
				}

      </div>
    )
  }

//

}

var styles ={
  container:{
    // backgroundColor:Common.Bg_White,
    height:window.innerHeight,
    width: width,
		overflowX:'hidden',
		overflowY:'scroll'
    // paddingLeft:10
  },
  report_bg:{
    backgroundImage:'url('+Dm.getUrl_img('/img/v2/icons/emp_bg.png')+')',
    backgroundRepat:'no-repeat',
    backgroundSize:'cover',
    width:window.screen.width,
    height:window.innerHeight,
  },
  titleDiv:{
    width: width,
    textAlign: 'center',
    height: 90,
    lineHeight: 4.5
  },
	div:{
		width:window.screen.width,
		// height:window.innerHeight,
		height:0,
		overflowY:'scroll',
		overflowX:'hidden',
		backgroundColor:'#fafafa'
	},
  blockDiv:{
    width: width*(160/375),
    height: width*(160/375),
    backgroundColor:'#f5f5f5',
    textAlign:'center',
		// border:'1 solid #e0e0e0',
		borderStyle:'solid',
		borderColor:'#e0e0e0',
		borderWidth:0.5
  },
  echarts:{
    width: width,
    height: 450
  },
  learnRecordTotal:{
    width: window.screen.width,
    height: window.innerHeight * (50/667) ,
    borderBottomStyle: 'solid',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e9f5ff',
    overflow:'hidden'
  },
  sortNum:{
    position: 'absolute',
    zIndex: 9999,
    left: 5,
    top: (window.innerHeight-90)/2 ,
    height: 90,
    width: 8,
  },
  checkoutDiv:{
    width:5,
    height:5,
    border:'1px solid #979797',
    borderRadius:'8px',
  },
	goBack:{
		position:'absolute',
    bottom:50,
    width:40,
		height:13,
		width:window.screen.width,
		textAlign:'center'
	},
	xuanke:{
		width:width/2,
		float:'left',
		lineHeight:0.5,
		marginBottom:15
	},
	LineClamp:{
    textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 1,
		height:11,
		paddingBottom:1
  },
  date:{
    display:'inline-block',
    padding:'0 13px',
    height:25,
    lineHeight:'25px',
    borderRadius:100,
    border:'solid 1px #2196f3',
    color:'#2196f3',
    fontSize:14,
    marginTop:10
  },
}

export default bolueWeeklyReport;
