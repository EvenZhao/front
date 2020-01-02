import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import ActivityAlert from './ActivityAlert';
import funcs from '../util/funcs'

var countdown;
var load
var t
var startX
var startY
var danyeIndex = 0 //记录当前单页的index
var innerHeight = window.innerHeight
var Opacity

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


class PgNonTrade extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.wx_config_share_home = {
				title: '2017《非贸付汇训练营》火热登陆',
				desc: '实务教学匠心独具，权威讲师金牌课程',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/activity/non_share.png'),
				type: 'link'
		};
		this.state = {
			title: 'PgHome',
			top: 0,
			displayOne:'block',
			displayTwo:'none',
			displayThree:'none',
			displayFour:'none',
			displayFive:'none',
			displaySix:'none',
			displaySeven:'none',
			displayEight:'none',
			name:'',
			company:'',
			telephone:'',
			Opacity:0,
			success: false,
			height:0,
			upDown: false,
			activityDown: false,
			screenHeight:0,
			isShow:false,
		};
		this.innerHeight = 0;
	}

  componentWillMount() {
    IsActivity = true;//如果是活动页面的去掉顶部APP推荐

		this._changeTop()
		countdown = setInterval(function(){
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
		}.bind(this), 10);
  }


	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-非贸付汇专项课程')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))


			this.innerHeight = window.innerHeight;

	}
	componentWillUnmount() {//ActivityZrdj
		this._getSpecialDone.remove()
		clearInterval(countdown)
	}

	render(){

		return (
			<div style={{...styles.container,}}
			ref={(lessonList) => this.lessonList = lessonList}
				onTouchEnd={this.onTouchEnd.bind(this)}
				onTouchStart={this.onTouchStart.bind(this)}>
				<div style={{...styles.div,display:this.state.displayOne,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/non_first.jpg`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayTwo,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/non_second.jpg`)} height={innerHeight} width={devWidth}  style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayThree,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/non_three.jpg`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayFour,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/non_four.jpg`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayFive,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/non_five.jpg`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displaySix,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/non_six.jpg`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displaySeven,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/non_seven.jpg`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayEight,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
						<img src={Dm.getUrl_img(`/img/v2/activity/non_eight.jpg`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
					<div style={{...styles.from,opacity:this.state.Opacity,}}>
						<div style={{height:window.innerHeight}}>

						{/*
							<div style={{color:'#fff',fontSize:24,textAlign:'center',paddingBottom:window.innerHeight*(30/667),paddingTop:window.innerHeight*(45/667),}}>现在索取课纲</div>
						*/}

							<input style={{...styles.inputText}} type="text" value={this.state.name} placeholder="姓名" onChange={this._onChangeName.bind(this)}/>
							<input style={{...styles.inputText}} type="text" value={this.state.company} placeholder="公司" onChange={this._onChangeCompany.bind(this)}/>
							<input style={{...styles.inputText}} type="text" value={this.state.telephone} placeholder="手机/电话" onChange={this._onChangeTelephone.bind(this)}/>
							<div style={{...styles.button}} onClick={this.onClickSpecial.bind(this)}>
								<span style={{color:'#7b6bb0',fontSize:'18px'}}>提交</span>
							</div>

							{/*
								<div style={{width:window.screen.width,textAlign:'center',marginTop:12,}}>
									<span style={{color:'#fff',fontSize:12,}}>了解更多欢迎详询:400-689-0679</span>
								</div>
								<div style={{textAlign:'center'}}>
									<img src={Dm.getUrl_img(`/img/v2/activity/non_logo.png`)} height={59} width={window.screen.width-240}/>
								</div>

								*/}

						</div>
					</div>

				</div>

				{
					this.state.activityDown ?
					<div style={{...styles.goBack,top:0}} onClick={this.on_down.bind(this)}>
						<img src={Dm.getUrl_img(`/img/v2/icons/activityDown@2.png`)} style={{position: 'relative', top: this.state.top, width: 31, height: 20}}/>
					</div>
					:
					<div style={{...styles.goBack}} onClick={this.on_up.bind(this)}>
						<img src={Dm.getUrl_img(`/img/v2/icons/danyeBack@2x.png`)} style={{position: 'relative', top: this.state.top, width: 31, height: 20}}/>
					</div>
				}

				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
				<ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
			</div>
		);
	}

	_changeTop(){
		if(this.state.top == 0) {
			this.setState({
				top: 12
			})
		} else {
			load = setInterval(() => {
				clearInterval(load)
				this.setState({
					top: 0
				})
			}, 300)
		}
		t = setTimeout(() => {
			this._changeTop()
		}, 500)
	}
	onTouchStart(ev){
		// var touch = event.targetTouches[0];
		startX = ev.touches[0].pageX;
		startY = ev.touches[0].pageY;
	}
	onTouchEnd(ev){
		var endX
		var endY
		endX = ev.changedTouches[0].pageX;
		endY = ev.changedTouches[0].pageY;
		 var direction = GetSlideDirection(startX, startY, endX, endY);
		 switch(direction) {
			case 0:
					// alert("没滑动");
					break;
			case 1:
					console.log("向上");
					if (danyeIndex==7) { //如果当前单页为最后一张，则回到第一张
						// danyeIndex=0
						return
					}else {
						danyeIndex = danyeIndex + 1
						this.setState({
							height: 0,
							upDown: false
						})
					}
					this.onTouchMove(danyeIndex)
					break;
			case 2:
					console.log("向下");
					if (danyeIndex==0) { //如果当前单页为最后一张，则回到第一张
						return
						// danyeIndex=3
					}else {
						danyeIndex = danyeIndex - 1
						this.setState({
							height: 0,
							upDown: true
						})
					}
					this.onTouchMove(danyeIndex)

					break;
			case 3:
					// alert("向左");
					// alert("!");
					break;
			case 4:
					// alert("向右");
					// break;
			default:
		}
	}
	on_up(re){
		if (danyeIndex==7) { //如果当前单页为最后一张，则回到第一张
			// danyeIndex=0
			return
		}else {
			danyeIndex = danyeIndex + 1
			this.setState({
				height: 0,
				upDown: false
			})
		}
		this.onTouchMove(danyeIndex)
	}
	on_down(re){
		console.log("向下");
		if (danyeIndex==0) { //如果当前单页为最后一张，则回到第一张
			// danyeIndex=2`
			return
		}else {
			danyeIndex = danyeIndex - 1
			this.setState({
				height: 0,
				upDown: true
			})
		}
		this.onTouchMove(danyeIndex)
	}

onTouchMove(e){
	switch(e) {
		case 0:
			this.setState({
				displayOne:'block',
				displayTwo:'none',
				displayThree:'none',
				displayFour:'none',
				displayFive:'none',
				displaySix:'none',
				displaySeven:'none',
				displayEight:'none',
				activityDown: false
			},()=>{
				countdown = setInterval(function(){
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
				}.bind(this), 10);
			})
				break;
		case 1:
			this.setState({
				displayOne:'none',
				displayTwo:'block',
				displayThree:'none',
				displayFour:'none',
				displayFive:'none',
				displaySix:'none',
				displaySeven:'none',
				displayEight:'none',
				activityDown: false
			},()=>{
				countdown = setInterval(function(){
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
				}.bind(this), 10);
			})
				break;
		case 2:
			this.setState({
				displayOne:'none',
				displayTwo:'none',
				displayThree:'block',
				displayFour:'none',
				displayFive:'none',
				displaySix:'none',
				displaySeven:'none',
				displayEight:'none',
				activityDown: false
			},()=>{
				countdown = setInterval(function(){
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
				}.bind(this), 10);
			})

				break;
		case 3:
			this.setState({
				displayOne:'none',
				displayTwo:'none',
				displayThree:'none',
				displayFour:'block',
				displayFive:'none',
				displaySix:'none',
				displaySeven:'none',
				displayEight:'none',
				Opacity: 0,
				activityDown: false
			},()=>{
				countdown = setInterval(function(){
						if( this.state.height < innerHeight ){
								this.setState({
										height: this.state.height + 10,
								});
						} else {
								clearInterval(countdown);
								Opacity = setInterval(function(){
										if( this.state.Opacity < 1 ){
												this.setState({
														Opacity: this.state.Opacity + 0.1,
														height:innerHeight
												});
										} else {
												clearInterval(Opacity);
										}
								}.bind(this), 200);
						}
				}.bind(this), 10);
			})
				break;
		case 4:
			this.setState({
				displayOne:'none',
				displayTwo:'none',
				displayThree:'none',
				displayFour:'none',
				displayFive:'block',
				displaySix:'none',
				displaySeven:'none',
				displayEight:'none',
				Opacity: 0,
				activityDown: false
			},()=>{
				countdown = setInterval(function(){
						if( this.state.height < innerHeight ){
								this.setState({
										height: this.state.height + 10,
								});
						} else {
								clearInterval(countdown);
								Opacity = setInterval(function(){
										if( this.state.Opacity < 1 ){
												this.setState({
														Opacity: this.state.Opacity + 0.1,
														height:innerHeight
												});
										} else {
												clearInterval(Opacity);
										}
								}.bind(this), 200);
						}
				}.bind(this), 10);
			})
				break;
	case 5:
		this.setState({
			displayOne:'none',
			displayTwo:'none',
			displayThree:'none',
			displayFour:'none',
			displayFive:'none',
			displaySix:'block',
			displaySeven:'none',
			displayEight:'none',
			Opacity: 0,
			activityDown: false
		},()=>{
			countdown = setInterval(function(){
					if( this.state.height < innerHeight ){
							this.setState({
									height: this.state.height + 10,
							});
					} else {
							clearInterval(countdown);
							Opacity = setInterval(function(){
									if( this.state.Opacity < 1 ){
											this.setState({
													Opacity: this.state.Opacity + 0.1,
													height:innerHeight
											});
									} else {
											clearInterval(Opacity);
									}
							}.bind(this), 200);
					}
			}.bind(this), 10);
		})
			break;
	case 6:
		this.setState({
			displayOne:'none',
			displayTwo:'none',
			displayThree:'none',
			displayFour:'none',
			displayFive:'none',
			displaySix:'none',
			displaySeven:'block',
			displayEight:'none',
			Opacity: 0,
			activityDown: false
		},()=>{
			countdown = setInterval(function(){
					if( this.state.height < innerHeight ){
							this.setState({
									height: this.state.height + 10,
							});
					} else {
							clearInterval(countdown);
							Opacity = setInterval(function(){
									if( this.state.Opacity < 1 ){
											this.setState({
													Opacity: this.state.Opacity + 0.1,
													height:innerHeight
											});
									} else {
											clearInterval(Opacity);
									}
							}.bind(this), 200);
					}
			}.bind(this), 10);
		})
			break;
			case 7:
				this.setState({
					displayOne:'none',
					displayTwo:'none',
					displayThree:'none',
					displayFour:'none',
					displayFive:'none',
					displaySix:'none',
					displaySeven:'none',
					displayEight:'block',
					Opacity: 0,
					activityDown: true
				},()=>{
					countdown = setInterval(function(){
							if( this.state.height < innerHeight ){
									this.setState({
											height: this.state.height + 10,
									});
							} else {
									clearInterval(countdown);
									Opacity = setInterval(function(){
											if( this.state.Opacity < 1 ){
													this.setState({
															Opacity: this.state.Opacity + 0.1,
															height:innerHeight
													});
											} else {
													clearInterval(Opacity);
											}
									}.bind(this), 200);
							}
					}.bind(this), 10);
				})
					break;
		default:
	}
}

	_onChangeName(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.name && v.length > 0) {
			this.setState({
				name: v,
			})
		}else {
			this.setState({
				name: v,
			})
		}
	}

	_onChangeCompany(e){
		e.preventDefault();
		var v = e.target.value.trim();
		this.setState({
			company: v,
		})
	}
	_onChangeTelephone(e){
		e.preventDefault();
		var v = e.target.value.trim();
		this.setState({
			telephone: v,
		})
	}

	onIsShow(re){
		this.setState({
			isShow: true,
			title: re
		},()=>{
			t = setTimeout(() => {
				this.setState({
					isShow: false
				})
			}, 1000)
		})
	}
	onClickSpecial(e){

		// if (!this.state.name) {
		// 		this.onIsShow('姓名不能为空')
		// 	return
		// }
		if(!this.state.company){
			this.onIsShow('公司不能为空')
			return false
		}
		if (!this.state.telephone) {
			this.onIsShow('电话不能为空')
			return false
		}
		if(!isCellPhoneAvailable(this.state.telephone)){
			this.onIsShow('请输入正确的手机号码')
			return false
		}

		Dispatcher.dispatch({
			actionType: 'Special',
			name:this.state.name,
			phone: this.state.telephone,
			company: this.state.company,
			isCima:false,
			url: document.location.href + '',
			title:'非贸付汇(移动端)',
		})
	}

	_hide(){
    this.setState({
      isShow:false,
      success:false,
      name:'',
			company:'',
      telephone:''
    })
  }

	_handleSpecialDone(re){
		if(re.result){
			this.setState({
				success: true,
				isShow: true,
				title:'您的申请已经成功提交稍后将会有工作人员与您联系'
			})
		}
		if(re.err){
			this.setState({
				isShow: true,
				title:re.err
			})
		}
	}
}

var styles = {
  container:{
    backgroundColor:'#f4f4f4',
    height:devHeight,
    width:devWidth,

  },
  div:{
    width:devWidth,
		height:0,
		overflow:'hidden'

  },
	image:{
		width:devWidth,
		height: devHeight
	},
	goBack:{
		position:'absolute',
		bottom:0,
		height:50,
		width:devWidth,
		textAlign:'center',
		zIndex:999
	},
	inputText:{
		color:'#fff',
		fontSize:15,
		height:34,
		width: devWidth -128,
		paddingLeft:8,
		marginLeft:(devWidth-(devWidth-118))/2,
		marginBottom:devHeight*(18/667),
		borderRadius:4,
		borderStyle:'solid',
		borderWidth:1,
		borderColor:'#fff',
		backgroundColor:'rgba(255, 255, 255, 0.1)'
	},
	button:{
		height: '41px',
		lineHeight:'41px',
		width: devWidth-118,
		backgroundColor: '#d9dae3',
		borderRadius: 4,
		marginLeft: (devWidth-(devWidth-118))/2,
		textAlign: 'center',
		marginTop:devWidth*(12/667),
	},
	zzc:{
		width: devWidth,
		height: devHeight,
		backgroundColor:'#cccccc',
		position:'absolute',
		opacity: 0.5,
		zIndex: 998,
		top:0,
	},
	from:{
	//	height:100,
		width:devWidth,
		position:'absolute',
		top:devHeight*(150/667),
		zIndex: 99,
	  height:devHeight*(380/667)
	}
};

export default PgNonTrade;
