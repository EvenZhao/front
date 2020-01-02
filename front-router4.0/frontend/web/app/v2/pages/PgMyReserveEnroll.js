/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import PromptBox from '../components/PromptBox';

var DEFAULT_FREEZETIME= 60;
var countdown;
var dateHeight;
var dateRow;
var startX;
var startY;


function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
       var a = val.charAt(i);
       if (a.match(/[^\x00-\xff]/ig) != null)
      {
          len += 2;
      }
      else
      {
          len += 1;
      }
  }
  return len;
}
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

class PgMyReserveEnroll extends React.Component {
	constructor(props) {
	    super(props);
			this.wx_config_share_home = {
					title: '课程预约-铂略咨询',
					desc: '铂略咨询-财税领域实战培训供应商',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
      this.weekData = ['日','一','二','三','四','五','六']
			this.city = [{city_id: '', city_name: '全部'}];
		this.state = {
			title: 'PgHome',
			display:'none',
			context:'',
      num: 1,
      check: {},
			date: new Date(),
			year: new Date().getFullYear(),
			month: new Date().getMonth(),
			reserveLesson:[],
			lessonsDetailList:[],
			onClickDay: new Date().getDate() || 0,
			today:new Date().getDate() || 0,
			chooseCity: false,
			cityList: [],
			cityCheckNum: 0,//城市对应的ID，默认为0
			city_name: '全国',
			city_id: null
		};

	}

	_handlemyReserveEnrollDone(re){
		var result = re.result || []
		var num = this.state.onClickDay - 1
		var lessonsDetailList = result[num].lessons || []
		if (result.length > 0) {
			this.setState({
					reserveLesson: result,
					lessonsDetailList: lessonsDetailList
			})
		}
	}
	chooseCity(){
		this.setState({
			chooseCity: !this.state.chooseCity
		})
	}
	_changeLeftDate(re){
		var m = this.state.month;
		if (re == 'left') {//如果是减少月份的话
			if (m == 0) {//如果当前月份是一月份 则月份变成十二月，年份减一
				m = 11;
				this.setState({
					month: m,
					year: this.state.year -1,
					lessonsDetailList: [],
					onClickDay: new Date().getDate() || 0,
				},()=>{
					Dispatcher.dispatch({//getUserAccountDone
						actionType: 'myReserveEnroll',
						year: this.state.year,
						month: this.state.month+1,
						cityId: this.state.city_id
					})
				})
			}else {
				this.setState({
					month: m -1,
					lessonsDetailList: [],
					onClickDay: new Date().getDate() || 0,
				},()=>{
					Dispatcher.dispatch({//getUserAccountDone
						actionType: 'myReserveEnroll',
						year: this.state.year,
						month: this.state.month+1,
						cityId: this.state.city_id
					})
				})

			}
		}else if (re == 'right') {
			if (m == 11) {//如果当前月份是十二月份 则月份变成一月，年份加一
				m = 0;
				this.setState({
					year: this.state.year +1,
					lessonsDetailList: [],
					onClickDay: new Date().getDate() || 0,
					month: m
				},()=>{
					Dispatcher.dispatch({//getUserAccountDone
						actionType: 'myReserveEnroll',
						year: this.state.year,
						month: this.state.month+1,
						cityId: this.state.city_id
					})
				})
			}else {
				this.setState({
					month: m +1,
					lessonsDetailList: [],
					onClickDay: new Date().getDate() || 0,
				},()=>{
					Dispatcher.dispatch({//getUserAccountDone
						actionType: 'myReserveEnroll',
						month:this.state.month+1,
						year: this.state.year,
						cityId: this.state.city_id
					})
				})
			}
		}
	}
	_gotoDetail(re,id,hasregeist){
		if (hasregeist) {
			if (re==1) {//跳转到预约直播课详情
				this.props.history.push({pathname: `${__rootDir}/PgMyReserveDetail/${id}`})
			}else if (re ==3) {//跳转到报名线下课详情
				this.props.history.push({pathname: `${__rootDir}/PgOffLlineEnrollDetail/${id}`})
			}
		}else {
			if (re==1) {//跳转到预约直播课详情
				this.props.history.push({pathname: `${__rootDir}/lesson/live/${id}`})
			}else if (re ==3) {//跳转到报名线下课详情
				this.props.history.push({pathname: `${__rootDir}/lesson/offline/${id}`})
			}
		}
	}
	// _getmyReserveEnrollList(re){
	// 	this.props.history.push({pathname: `${__rootDir}/PgMyReserveEnrollList`})
	// }
	_onClickDetail(re,day){
			this.setState({
				lessonsDetailList: re,
				onClickDay: day
			})

	}
	_handleFetchLableListDone(re) {
		var result = re.result || {}
		console.log('_handleFetchLableListDone',re);
		this.setState({
			cityList: this.city.concat(result.city || [])
		},()=>{
			var citydefaultCity = localStorage.getItem("citydefaultCity")
			var addressName = localStorage.getItem("addressName")
			console.log('citydefaultCity',citydefaultCity);
			console.log('addressName',addressName);
			for (var i = 0; i < this.state.cityList.length; i++) {
				if (this.state.cityList[i].city_name == citydefaultCity || this.state.cityList[i].city_name == addressName) {
					this.clickTab(i,this.state.cityList[i].city_name,this.state.cityList[i].city_id)
					return
				}
			}
		})
	}
	componentWillMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-日历')

	}
	componentDidMount() {
		console.log('addressName.......',localStorage.getItem("addressName"));

		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		Dispatcher.dispatch({
			actionType: 'FetchLableList',
			type: 'offline'
		})
		this._getLabelList = EventCenter.on("FetchLableListDone", this._handleFetchLableListDone.bind(this))
		this._getmyReserveEnrollDone = EventCenter.on('myReserveEnrollDone', this._handlemyReserveEnrollDone.bind(this))

	}
	componentWillUnmount() {
		this._getmyReserveEnrollDone.remove()
		this._getLabelList.remove()
	}

	onTouchStart(ev){
		startX = ev.touches[0].pageX;
		startY = ev.touches[0].pageY;
	}

	onTouchEnd(ev){
		var endX
		var endY
		endX = ev.changedTouches[0].pageX;
		endY = ev.changedTouches[0].pageY;
		 var direction = GetSlideDirection(startX, startY, endX, endY);
		 if(direction == 1){
			 //向上滑动，收起日历，只显示当前选中的这行
		 }
		 else if (direction == 2) {
		 	//向下滑动,展开日历
		 }
	}
	MyPeserve(cityid){
		if (cityid) {
			Dispatcher.dispatch({//getUserAccountDone
				actionType: 'myReserveEnroll',
				cityId: cityid,
				year: this.state.year,
				month: this.state.month+1,
			})
		}else {
			Dispatcher.dispatch({//getUserAccountDone
				actionType: 'myReserveEnroll',
				year: this.state.year,
				month: this.state.month+1,
			})
		}
	}
  clickTab(idx,name,city_id) {
		this.MyPeserve(city_id)
		this.setState({
			cityCheckNum: idx,
			city_name: name,
			city_id: city_id
		})
	}
	changeCity(index,id,name){
		this.setState({
			city_name: name,
			chooseCity: false,
			cityCheckNum: index,
			changeCity: id
		},()=>{
			this.MyPeserve(id)
		})
	}
	render(){
		var cityList = this.state.cityList.map((item,index)=>{
			var color = '#333333'
			var border = '1px solid #e8e5e5'
			if (this.state.cityCheckNum ==  index) {
				border ='1px solid #2196f3'
				color ='#2196f3'
			}
			return(
				<div key={index} onClick={this.changeCity.bind(this,index,item.city_id,item.city_name)} style={{...styles.cityitem,border:border,}}>
					<span style={{fontSize:12,color}}>{item.city_name}</span>
				</div>
			)
		})
    var date = new Date();
    // var date = new Date()
    var num = this.state.num || 1;
    var check = this.state.check;
    var headerStyle = this.state.headerStyle;
    var items = [];
    var dateNow = new Date();
    // for(var n = 0; n < num; n++){
      /*循环完成一个月*/
      var rows = [];
      var newDate = new Date(this.state.year, this.state.month + 1, 0); //天数
      var week = new Date(this.state.year, this.state.month, 1).getDay(); //月份开始的星期
      if(week === 0){
        week = 1;
      }else {
      	week+=1
      }
      var counts = newDate.getDate();
      var rowCounts = Math.ceil((counts + week - 1) / 7); //本月行数
					//dateRow = rowCounts;
					dateHeight = ((window.screen.width-32)/7-1) * (42/51) * rowCounts
			// if (window.screen.width == 375) {
			// 	if (rowCounts == 5) {
			// 		dateHeight = 270
			// 	}else if(rowCounts == 6){
			// 		dateHeight = 323
			// 	}else if (rowCounts == 4) {
			// 		dateHeight = 216
			// 	}
			// }else if(window.screen.width < 375){
			// 	if (rowCounts == 5) {
			// 		dateHeight = 234
			// 	}else if(rowCounts == 6){
			// 		dateHeight = 278
			// 	}else if (rowCounts == 4) {
			// 		dateHeight = 188
			// 	}
			// }else if (window.screen.width > 375) {
			// 	if (rowCounts == 5) {
			// 		dateHeight = 300
			// 	}else if(rowCounts == 6){
			// 		dateHeight = 360
			// 	}else if (rowCounts == 4) {
			// 		dateHeight = 240
			// 	}
			// }
      for(var i = 0; i < rowCounts; i++){
        var days = [];
        for(var j = (i * 7) + 1; j < ((i+1) * 7) + 1; j++){
          //根据每个月开始的［星期］往后推
          var dayNum = j - week+1 ;
					var lessons={}
					var lessonDetailList = []
          if(dayNum > 0 && j < counts + week){
						var liveType=null;
						var offlineType =null;
						//获取当天的预约数组
						if (this.state.reserveLesson.length >0) {
								lessons = this.state.reserveLesson[dayNum-1] || {}
								if (lessons.lessons) {
									if (lessons.lessons.length >0) {
										lessonDetailList = lessons.lessons || []
										var liveHasregeist = false;
										var offlineHasregeist = false;
										for (var t = 0; t < lessons.lessons.length; t++) {//把当天的数组遍历查询课程类型
											if (lessons.lessons[t].resource_type == 1) {
												liveType = (
													<img style={{marginLeft:6,marginTop:6}} src={Dm.getUrl_img('/img/v2/pgCenter/line-2@2x.png')} height="12" width="12"/>
												)
												if (lessons.lessons[t].hasregeist || liveHasregeist) {
													liveHasregeist = true //如果有多门直播课如果一门预约 图标就变亮
													liveType = (
														<img style={{marginLeft:6,marginTop:6}} src={Dm.getUrl_img('/img/v2/pgCenter/line-1@2x.png')} height="12" width="12"/>
													)
												}
											}else if (lessons.lessons[t].resource_type == 3) {
												offlineType =(
													<img style={{marginLeft:6,marginTop:6}} src={Dm.getUrl_img('/img/v2/pgCenter/offline-2@2x.png')} height="12" width="12"/>
												)
												if (lessons.lessons[t].hasregeist || offlineHasregeist) {
													offlineHasregeist = true //如果是多个线下课只要一门课报名 图标就变亮
													offlineType = (
														<img style={{marginLeft:6,marginTop:6}} src={Dm.getUrl_img('/img/v2/pgCenter/offline-1@2x.png')} height="12" width="12"/>
													)
												}
											}
										}
									}
							}
						}
            //如果当前日期小于今天，则变灰
            var dateObj = new Date(this.state.year, this.state.month, dayNum);

            var month = (dateObj.getMonth()+1).toString();
            if (month.length == 1) {
              month = "0" + month;
            }
            var daytime = dayNum +''
            if (daytime.length == 1) {
              daytime = "0" + daytime
            }
            var dateStr = dateObj.getFullYear() + '-' + month + '-' + daytime;
            var dateStr_time = new Date(dateStr).format('yyyy-MM-dd');//把字符串 变化成日期格式
            var backgroundColor = {};
            var bk = {};
            var checkDate = new Date(dateStr);
						var dateNowF = new Date(dateNow).format('yyyy-MM-dd 00:00:00');
						var today =''
						var backgroundImage = false
						var getFullYea = new Date().getFullYear();
						var getMont = new Date().getMonth();
            if((this.state.onClickDay == dayNum) && ( (new Date (dateNowF)).getTime() - (new Date(this.state.year, this.state.month, dayNum)).getTime() == 0 ) ){//判断一下今天的位置
								// backgroundColor='#aedcde'
								// today = '今天'
            }
						if (getFullYea == this.state.year && getMont == this.state.month && dayNum == this.state.today) {
							backgroundImage = true
							today = '今天'
						}
            days.push(
                <div onClick={this._onClickDetail.bind(this,lessonDetailList,dayNum)}
									style={{...styles.dayNum,backgroundImage: (backgroundImage) ? 'url('+Dm.getUrl_img('/img/v2/pgCenter/Rectangle@2x.png')+')':null,border:(this.state.onClickDay == dayNum && dayNum !== this.state.today) ? '1px solid #ff6633':'1px solid #FFFFFF'}} key={j}
									>
                  <div>
										<span style={{fontSize:15,color:(today) ? '#FFFFFF':'#2196f3',marginTop:2,marginLeft:4}}>{dayNum}</span>
										<span style={{fontSize:11,color:'#FFFFFF',marginLeft:2,marginTop:4,marginRight:4}}>{today}</span>
									</div>
									<div>
										{liveType}
										{offlineType}
									</div>
                </div>
            );
          }else{
            days.push(
              <div style={{...styles.dayNum,backgroundColor:'#ffffff',border:'1px solid #FFFFFF'}} key={j}>
                <span></span>
              </div>
            );
          }

        }
        rows.push(
          <div style={styles.row} key={i}>{days}</div>
        );
      }

    // }

    var week = this.weekData.map((item,index)=>{
      var weekColor;
      if (index == 0 || index ==6) {
        weekColor = '#2196f3'
      }else {
        weekColor = '#999'
      }
      return(
        <div style={{...styles.weekDay}} key={index}>
          <span style={{fontSize:12,color:weekColor}}>{item}</span>
        </div>
      )
    })
		var lessonsList = this.state.lessonsDetailList.map((item,index)=>{
			var start_time = new Date(item.starTime).format("hh:mm");
			var Has ='未预约'
			var HasColor = '0.5px solid #757575'
			var HasBackgroud = '#f3f3f3'
			var HasFont = '#666666'
			var resourceText = '';
			if (item.resource_type == 1) {//直播课
					resourceText = '直播课';
			}else {
					resourceText = '线下课';
			}
			if (item.hasregeist) {
					Has ='已预约';
					HasColor = '0.5px solid #23bb2d'
					HasBackgroud = '#f3fef4'
					HasFont = '#4ab464'
			}
			var data_time
			var start_date = new Date(item.starTime || 0).format("yyyy-MM-dd")
			var start_time = new Date(item.starTime || 0).format("hh:mm");
			var end_time = new Date(item.endTime || 0).format("hh:mm");
			var end_date = new Date(item.endTime || 0).format("yyyy-MM-dd")
			if (start_date==end_date) {
				data_time = start_date +' '+ start_time +'-'+ end_time
			}else {
				data_time = start_date +' 至 '+end_date
			}
			return(
				<div onClick={this._gotoDetail.bind(this,item.resource_type,item.id,item.hasregeist)} style={{...styles.lessonDetail}} key={index}>
					<div style={{width:70,height:85,float:'left',textAlign:'center',position:'relative'}}>
						<span style={{fontSize:14,color:'#666666',position:'relative',top:33}}>{resourceText}</span>
					</div>
					<div style={{height:60,width:1,backgroundColor:'#f0f0f0',position:'absolute',top:13,left:69}}></div>
					<div style={{...styles.lessonDetailList}}>
						<div style={{marginTop:15,display:'flex'}}>
							<div style={{...styles.statusButtom,backgroundColor:HasBackgroud,border:HasColor}}><span style={{fontSize:10,color:HasFont}}>{Has}</span></div>
							<div style={{marginLeft:15}}><span style={{fontSize:12,color:'#BDBDBD'}}>{data_time}</span></div>
						</div>
						<div style={{marginLeft:15}}>
							<span style={{fontSize:14,color:'#333333'}}>{item.title}</span>
						</div>
					</div>
				</div>
			)
		})
		var getLen = getByteLen(this.state.city_name)
		return (
			<div style={{...styles.container}}>
				<div style={{width:devWidth,backgroundColor:'#f9fcff',height:60,display:'flex'}}>
					<div style={{...styles.addressDiv,textAlign:'center'}}>
						<div onClick={this.chooseCity.bind(this)} style={{...styles.addButtom,position:'relative',width: (getLen * 12)/2+40,marginLeft:((devWidth/2)-((getLen * 12)/2+40))/2}}>
							<img style={{position:'absolute',top:8,left:8}}  src={Dm.getUrl_img('/img/v2/pgCenter/address@2x.png')} height="12" width="10"/>
							<span style={{fontSize:12,color:'#253A4B',marginLeft:0}}>{this.state.city_name}</span>
							<img style={{position:'absolute',right:12,top:12}} src={Dm.getUrl_img('/img/v2/pgCenter/Shape@2x.png')} height="5" width="10"/>
						</div>
					</div>
	        <div style={{...styles.dateDiv,paddingLeft:16}}>
						<img onClick={this._changeLeftDate.bind(this,'left')} src={Dm.getUrl_img('/img/v2/pgCenter/left@2x.png')} height="15" width="10"/>
	          <span style={{...styles.dateTitle}}>{this.state.year}年{this.state.month+1}月</span>
	          <img onClick={this._changeLeftDate.bind(this,'right')} src={Dm.getUrl_img('/img/v2/pgCenter/right@2x.png')} height="15" width="10"/>
						{/*<span onClick={this._getmyReserveEnrollList.bind(this)} style={{fontSize:15,color:'#2196f3',float:'right',marginRight:12}}>查看预约</span>*/}
					</div>
				</div>
				<div></div>
				<div style={{height:devHeight-60,width:devWidth,overflowX:'hidden',overflowY:'scroll'}}>
	        <div style={{...styles.weekDiv}}>
	          {week}
	        </div>

				<div style={{height:window.innerHeight-90}}
				ref={(calendar)=>this.calendar = calendar}
				onTouchEnd={this.onTouchEnd.bind(this)}
				onTouchStart={this.onTouchStart.bind(this)}>
	        <div style={{width:window.screen.width,height:dateHeight}}>
	          {rows}
	        </div>
					<div></div>
					<div style={{...styles.typeDiv,display:'flex',flexDirection:'row',alignItems:'center'}}>
						<div style={{width:(window.screen.width-22)/2,marginLeft:(window.screen.width >= 375) ? 12 : 6,display:'flex',flexDirection:'row',alignItems:'center'}}>
							<span style={{fontSize:11,color:'#333333',marginLeft:(window.screen.width >= 375) ? 4 : 2}}>已预约:</span>
							<img style={{marginLeft:(window.screen.width >= 375) ? 6 : 3}} src={Dm.getUrl_img('/img/v2/pgCenter/line-1@2x.png')} height="12" width="12"/>
							<span style={{color:'#BDBDBD',fontSize:11,marginLeft:(window.screen.width >= 375) ? 4 : 2}}>直播课</span>
							<img style={{marginLeft:(window.screen.width >= 375) ? 6 : 3}} src={Dm.getUrl_img('/img/v2/pgCenter/offline-1@2x.png')} height="12" width="12"/>
							<span style={{color:'#BDBDBD',fontSize:11,marginLeft:(window.screen.width >= 375) ? 4 : 2}}>线下课</span>
						</div>
						<div style={{width:(window.screen.width-30)/2+2,right:(window.screen.width >= 375) ? 12 : 6,display:'flex',flexDirection:'row',alignItems:'center'}}>
							<span style={{fontSize:11,color:'#333333',marginRight:(window.screen.width >= 375) ? 6 : 3}}>未预约:</span>
							<img style={{marginRight:(window.screen.width >= 375) ? 4 : 2}} src={Dm.getUrl_img('/img/v2/pgCenter/line-2@2x.png')} height="12" width="12"/>
							<span style={{color:'#BDBDBD',fontSize:11,marginRight:(window.screen.width >= 375) ? 6 : 3}}>直播课</span>
							<img style={{marginRight:(window.screen.width >= 375) ? 4 : 2}} src={Dm.getUrl_img('/img/v2/pgCenter/offline-2@2x.png')} height="12" width="12"/>
							<span style={{color:'#BDBDBD',fontSize:11}}>线下课</span>
						</div>
					</div>
					<div style={{...styles.detailDiv,display: this.state.lessonsDetailList.length >0 ? 'block' :'none'}}>
						{lessonsList}
					</div>
				</div>
			</div>
			<div style={{display: this.state.chooseCity ? 'block':'none'}}>
				<div  style={{...styles.cityDiv,}}>
					{cityList}
				</div>
			</div>
			<div onClick={this.chooseCity.bind(this)} style={{...styles.zzc,display:this.state.chooseCity ?'block':'none'}}></div>
			</div>
		);
	}
}

var styles = {
  container:{
    backgroundColor:'#f3f7fa',
    height: window.innerHeight,
    width: window.screen.width,
		// overflow:'auto',
		// overflowX: 'hidden',
  },
  dateDiv:{
    height: 35,
    width: devWidth/2,
    // textAlign: 'center',
    // marginTop: 18,
    // backgroundColor:'#ffffff',
    paddingTop:15,
		// float:'left',
  },
	addressDiv:{
		width:devWidth/2,
		// float:'left',
		// backgroundColor:'#ffffff',
		paddingTop:18,
		// textAlign:'center',
	},
  dateTitle:{
    fontSize: 20,
    color: '#333333',
    marginLeft: 20,
    marginRight: 20,
  },
  weekDiv:{
    height: 30,
    width: window.screen.width,
    backgroundColor:'#ffffff',
    marginTop: 10,
    lineHeight: 2,
  },
  weekDay:{
    width: window.screen.width/7,
    textAlign:'center',
    float:'left',
  },
  div:{
    // height: '65px',
    // width: '100%',
    // backgroundColor:'#ffffff',
    // lineHeight:4,
  },
  flex_1:{
    // flex:1,
    // alignItems:'center',
    // justifyContent:'center',
    float:'left'
  },
  row:{
    // flexDirection:'row',
    // height:35,
    width:window.screen.width,
    float:'left'
  },
  month:{
    // alignItems:'center',
    // justifyContent:'center',
    height:40,
  },
  cm_bottom:{
    // borderBottomWidth:1/PixelRatio.get(),
    borderBottomColor:'#ccc',
  },
  month_text:{
  fontSize:18,
  // fontWeight: 400,
  },
  dayNum:{
    float:'left',
    width:(devWidth-28)/7,
    height:((devWidth-28)/7) * (42/51),
    // textAlign:'center',
    borderRadius:6,
    margin:1,
		backgroundSize: '100%',
		backgroundAttachment: 'fixed',
		backgroundColor:'#FFFFFF',
		lineHeight:1
  },
	typeDiv:{
		width: window.screen.width,
		height: 47,
		backgroundColor: '#ffffff',
		lineHeight: 3,
		overflow:'hidden'
	},
	detailDiv:{
		width: window.screen.width,
		// height:220,
		backgroundColor:'#f3f7fa',
		// marginTop:20,
		// overflow:'auto',
		// overflowX: 'hidden',
		// paddingTop:20
	},
	lessonDetail:{
		width:window.screen.width,
		// marginLeft:12,
		height:85,
		marginBottom:4,
		// marginTop:10,
		backgroundColor:'#FFFFFF',
		position:'relative',
		top:15,
	},
	lessonDetailList:{
		width: window.screen.width-75,
		height: 85,
		lineHeight:'20px',
		float:'left',
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		paddingLeft:4
	},
	LineClamp:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		// WebkitLineClamp: 1,
	},
	addButtom:{
		height:26,
		// width:110,
		paddingLeft: 8,
		paddingRight: 8,
		backgroundColor:'#e9eef4',
		borderRadius:'100px',
		// marginLeft:((devWidth/2)-110)/2,
	},
	cityDiv:{
		width: devWidth,
		// height: 143,
		backgroundColor:'#fafafa',
		position:'absolute',
		top: 60,
		zIndex:999,
		display: 'flex',
		flexDirection: 'flex-wrap',
		flexWrap: 'wrap',
		// marginBottom:1
		paddingBottom:10
		// overflowX:'hidden',
		// overflowY:'scroll'
	},
	zzc:{
		width: devWidth,
		height: devHeight-60,
		backgroundColor:'#cccccc',
		position:'absolute',
		opacity: 0.5,
		zIndex: 998,
		top:60,
	},
	cityitem:{
		height:26,
		// width:70,
		padding:'0px 17px 0px 17px',
		borderRadius:'100px',
		textAlign:'center',
		marginTop:16,
		marginLeft:15,
		backgroundColor:'#FFFFFF',
		// opacity: 0.5
	},
	statusButtom:{
		height:15,
		width:42,
		borderRadius:'100px',
		textAlign:'center',
		lineHeight:0.8,
		marginLeft:15
	}
};
export default PgMyReserveEnroll;
