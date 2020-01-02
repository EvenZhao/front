import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import ActivityAlert from './ActivityAlert';
import Common from '../Common';
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


class PgActivityOfCards extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.wx_config_share_home = {
				title: '铂略财务培训会员尊享方案（全国版）',
				desc: '立即申请会员体验',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/activity/card_share.png'),
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
      displayNine:'none',
      displayTen:'none',
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
		EventCenter.emit("SET_TITLE",'铂略财务培训会员尊享方案')
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
					<img src={Dm.getUrl_img(`/img/v2/activity/img/card1.jpg`)} height={window.innerHeight} width={window.screen.width} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayTwo,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/img/card2.jpg`)} height={innerHeight} width={window.screen.width}  style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayThree,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/img/card3.jpg`)} height={window.innerHeight} width={window.screen.width} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayFour,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/img/card4.jpg`)} height={window.innerHeight} width={window.screen.width} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayFive,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/img/card5.jpg`)} height={window.innerHeight} width={window.screen.width} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displaySix,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/img/card6.jpg`)} height={window.innerHeight} width={window.screen.width} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displaySeven,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/img/card7.jpg`)} height={window.innerHeight} width={window.screen.width} style={{...styles.image}}/>
				</div>
        <div style={{...styles.div,display:this.state.displayEight,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/img/card8.jpg`)} height={window.innerHeight} width={window.screen.width} style={{...styles.image}}/>
				</div>
        <div style={{...styles.div,display:this.state.displayNine,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/img/card9.jpg`)} height={window.innerHeight} width={window.screen.width} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayTen,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
						<img src={Dm.getUrl_img(`/img/v2/activity/img/card10.jpg`)} height={window.innerHeight} width={window.screen.width} style={{...styles.image}}/>
					<div style={{...styles.form,opacity:this.state.Opacity,}}>
						<div style={{height:window.innerHeight}}>
							<input style={{...styles.inputText}} type="text" value={this.state.name} placeholder="姓名" onChange={this._onChangeName.bind(this)}/>
							<input style={{...styles.inputText}} type="text" value={this.state.company} placeholder="公司" onChange={this._onChangeCompany.bind(this)}/>
							<input style={{...styles.inputText}} type="text" value={this.state.telephone} placeholder="手机/电话" onChange={this._onChangeTelephone.bind(this)}/>
							<div style={{...styles.button}} onClick={this.onClickSpecial.bind(this)}>
								<span style={{color:'#154bb0',fontSize:'18px'}}>提交</span>
							</div>

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
					if (danyeIndex==9) { //如果当前单页为最后一张，则回到第一张
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
		if (danyeIndex==9) { //如果当前单页为最后一张，则回到第一张
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
        displayNine:'none',
        displayTen:'none',
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
        displayNine:'none',
        displayTen:'none',
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
        displayNine:'none',
        displayTen:'none',
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
        displayNine:'none',
        displayTen:'none',
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
        displayNine:'none',
        displayTen:'none',
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
      displayNine:'none',
      displayTen:'none',
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
      displayNine:'none',
      displayTen:'none',
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
      displayNine:'none',
      displayTen:'none',
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
    case 8:
  		this.setState({
  			displayOne:'none',
  			displayTwo:'none',
  			displayThree:'none',
  			displayFour:'none',
  			displayFive:'none',
  			displaySix:'none',
  			displaySeven:'none',
  			displayEight:'none',
        displayNine:'block',
        displayTen:'none',
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
			case 9:
				this.setState({
					displayOne:'none',
					displayTwo:'none',
					displayThree:'none',
					displayFour:'none',
					displayFive:'none',
					displaySix:'none',
					displaySeven:'none',
					displayEight:'none',
          displayNine:'none',
          displayTen:'block',
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
		if (this.state.company && v.length > 0) {
			this.setState({
				company: v,
			})
		}else {
			this.setState({
				company: v,
			})
		}
	}
	_onChangeTelephone(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.telephone && v.length > 0) {
			this.setState({
				telephone: v,
			})
		}else {
			this.setState({
				telephone: v,
			})
		}
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
		if (!this.state.company) {
				this.onIsShow('公司不能为空')
			return
		}
		if (!this.state.telephone) {
			this.onIsShow('电话不能为空')
			return
		}
		if(!isCellPhoneAvailable(this.state.telephone)){
      this.onIsShow('请输入正确的手机号码')
      return
    }
		Dispatcher.dispatch({
			actionType: 'Special',
			name:this.state.name,
			phone: this.state.telephone,
			company: this.state.company,
			isCima:false,
			url: document.location.href + '',
			title:'铂略财务培训会员尊享方案(移动端)',
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
    // height:window.innerHeight,
		height:0,
		overflow:'hidden'

  },
	image:{
		width:window.screen.width,
		height:  window.innerHeight
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
		color:'#15b8ff',
		fontSize:15,
		height:34,
		width: devWidth -128,
		paddingLeft:8,
		marginLeft:(devWidth-(devWidth-118))/2,
		marginBottom:devHeight*(18/667),
		borderRadius:4,
		borderStyle:'solid',
		borderWidth:1,
		borderColor:'#37ace3',
		backgroundColor:'rgba(255, 255, 255, 0.1)'
	},
	button:{
		height: '41px',
		lineHeight:'41px',
		width: devWidth-118,
		backgroundColor: '#00d6ff',
		borderRadius: 4,
		marginLeft: (devWidth-(devWidth-118))/2,
		textAlign: 'center',
		marginTop:devHeight*(12/667),
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
	form:{
		width:devWidth,
		position:'absolute',
		top:devHeight*(200/667),
		zIndex: 99,
	  height:devHeight*(380/667)
	}
};

export default PgActivityOfCards;
