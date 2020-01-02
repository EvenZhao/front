import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import Common from '../Common'

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

class PgActivityApp extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.wx_config_share_home = {
				title: '铂略财课APP',
				desc: '开启一站式财税学习移动时代',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/activity/app_img/app_share.jpg'),
				type: 'link'
		};
		this.state = {
			title: 'PgHome',
			top: 0,
			displayOne:'block',
			displayTwo:'none',
			displayThree:'none',
			displayFour:'none',
			page5:'none',
			page6:'none',
			page7:'none',
			name:'',
			company:'',
			telephone:'',
			//Opacity:0,
			success: false,
			height:devHeight,
			upDown: false,
			activityDown: false,
			screenHeight:0,
		};
		this.innerHeight = 0;
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
  componentWillMount() {
    IsActivity = true;//如果是活动页面的去掉顶部APP推荐
  }

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课APP')
		t = setTimeout(() => {
			this.stopDrop()
		}, 300)
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

		this.innerHeight = window.innerHeight;
	}
	componentWillUnmount() {
		clearInterval(countdown)
		clearTimeout(t)
	}

	render(){
		return (
			<div style={{...styles.container,}}
			ref={(lessonList) => this.lessonList = lessonList}
				onTouchEnd={this.onTouchEnd.bind(this)}
				onTouchStart={this.onTouchStart.bind(this)}>
				<div style={{...styles.div,display:this.state.displayOne,height:devHeight,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<div style={{...styles.common_bg,...styles.bg1}}>
						<div style={{transform:'scale(0.9,0.95)'}}>
							<img src={Dm.getUrl_img('/img/v2/activity/app_img/page1_img1.png')} className="page1_img1" style={{...styles.common_bg,...styles.page1_img1}}/>
							<img src={Dm.getUrl_img('/img/v2/activity/app_img/page1_img2.png')} className="page1_img2" style={{...styles.common_bg,...styles.page1_img2}}/>
							<img src={Dm.getUrl_img('/img/v2/activity/app_img/page1_img3.png')} className="page1_img3" style={{...styles.common_bg,...styles.page1_img3}}/>
							<img src={Dm.getUrl_img('/img/v2/activity/app_img/page1_img04.png')} className="page1_img1" style={{...styles.common_bg,...styles.page1_img4}}/>
						</div>
					</div>
				</div>
				<div style={{...styles.div,display:this.state.displayTwo,height:devHeight,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<div style={{...styles.common_bg,...styles.bg2}}>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page2_img1.png')} width={devWidth/750*570} height={405/750*devWidth} className="page1_img1" style={{...styles.page2_img1}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page2_img2.png')} width={devWidth/750*435} height={567/750*devWidth} className="page2_img2" style={{...styles.page2_img2}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page2_img3.png')} width={devWidth/750*189} height={516/750*devWidth} className="page2_img3" style={{...styles.page2_img3}}/>
					</div>
				</div>
				<div style={{...styles.div,display:this.state.displayThree,height:devHeight,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<div style={{...styles.common_bg,...styles.bg3}}>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page3_img1.png')} width={devWidth/750*560} height={265/750*devWidth} className="page1_img1" style={{...styles.page3_img1}}/>
						{/* <img src={Dm.getUrl_img('/img/v2/activity/app_img/page3_img2.png')} width={devWidth/750*544} height={29/750*devWidth} className="page1_img1" style={{...styles.page3_img2}}/> */}
						<div className="page1_img1" style={{...styles.page3_img2,fontSize:14,color:'#0c3a5e'}}>
							<span>资深专家有问必答</span>
							<span style={{marginLeft:40}}>课程管家定时提醒</span>
						</div>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page3_img3.png')} width={devWidth/750*588} height={534/750*devWidth} className="page2_img2" style={{...styles.page3_img3}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page3_img4.png')} width={devWidth/750*347} height={241/750*devWidth} className="page2_img3" style={{...styles.page3_img4}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page3_img5.png')} width={devWidth/750*311} height={229/750*devWidth} className="page3_img5" style={{...styles.page3_img5}}/>
					</div>
				</div>
				<div style={{...styles.div,display:this.state.displayFour,height:devHeight,position:this.state.upDown ? 'relative':'absolute',bottom:0,backgroundColor:'#36a7ff'}}>
					<div style={{...styles.common_bg,...styles.bg4,transform:'scale(0.9,0.95)'}}>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page4_img1.png')} width={devWidth/750*624} height={271/750*devWidth} className="page1_img1" style={{...styles.page4_img1}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page4_img2.png')} width={devWidth/750*602} height={294/750*devWidth} className="page1_img1" style={{...styles.page4_img2}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page4_img3.png')} width={devWidth/750*576} height={541/1334*devHeight} className="page2_img2" style={{...styles.page4_img3}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page4_img4.png')} width={devWidth/750*21} height={252/750*devWidth} className="page2_img3" style={{...styles.page4_img4}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page4_img5.png')} width={devWidth/750*62} height={203/750*devWidth} className="page2_img3" style={{...styles.page4_img5}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page4_img6.png')} width={devWidth/750*59} height={131/750*devWidth} className="page3_img5" style={{...styles.page4_img6}}/>
					</div>
				</div>
				<div style={{...styles.div,display:this.state.page5,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<div style={{...styles.common_bg,...styles.bg5}}>
						<div className="page1_img1" style={{...styles.common_bg,...styles.page7_img1,top:0,left:0,}}></div>
						<div className="page2_img2" style={{...styles.common_bg,...styles.page7_img2,top:0,left:0,}}></div>
						<div className="page1_img1" style={{...styles.common_bg,...styles.page7_img3,top:0,left:0,}}></div>
					</div>
				</div>
				<div style={{...styles.div,display:this.state.page6,height:devHeight,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<div style={{...styles.common_bg,...styles.bg6}}>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page5_img1.png')} width={devWidth/750*571} height={336/750*devWidth} className="page1_img1" style={{...styles.page5_img1}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page5_img2.png')} width={devWidth/750*615} height={28/750*devWidth} className="page1_img1" style={{...styles.page5_img2}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page5_img3.png')} width={devWidth/750*586} height={535/750*devWidth} className="page5_img3" style={{...styles.page5_img3}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page5_img4.png')} width={devWidth/750*58} height={336/750*devWidth} className="page3_img5" style={{...styles.page5_img4}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page5_img5.png')} width={devWidth/750*146} height={186/750*devWidth} className="page2_img3" style={{...styles.page5_img5}}/>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page5_img6.png')} width={devWidth/750*56} height={205/750*devWidth} className="page2_img3" style={{...styles.page5_img6}}/>
					</div>
				</div>
				<div style={{...styles.div,display:this.state.page7,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<div style={{...styles.common_bg,...styles.bg7}}>
						<img src={Dm.getUrl_img('/img/v2/activity/app_img/page6_img1.png')} width={devWidth/750*592} height={194/1334*devHeight} className="page2_img3" style={{...styles.page6_img1}}/>
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
					break;
			case 1:
					if (danyeIndex==6) { //如果当前单页为最后一张，则回到第一张
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
					//this.onTouchMove(danyeIndex,window.event)
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
		if (danyeIndex==6) { //如果当前单页为最后一张，则回到第一张
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
				page5:'none',
				page6:'none',
				page7:'none',
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
				page5:'none',
				page6:'none',
				page7:'none',
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
				page5:'none',
				page6:'none',
				page7:'none',
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
				page5:'none',
				page6:'none',
				page7:'none',
				activityDown: false
			},()=>{
				countdown = setInterval(function(){
						if( this.state.height < innerHeight ){
								this.setState({
										height: this.state.height + 10,
								});
						} else {
								clearInterval(countdown);
								this.setState({
										height:innerHeight
								});
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
				page5:'block',
				page6:'none',
				page7:'none',
				activityDown: false
			},()=>{
				countdown = setInterval(function(){
						if( this.state.height < innerHeight ){
								this.setState({
										height: this.state.height + 10,
								});
						} else {
								clearInterval(countdown);
								this.setState({
										height:innerHeight
								});
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
			page5:'none',
			page6:'block',
			page7:'none',
			//Opacity: 0,
			activityDown: false
		},()=>{
			countdown = setInterval(function(){
					if( this.state.height < innerHeight ){
							this.setState({
									height: this.state.height + 10,
							});
					} else {
							clearInterval(countdown);
							this.setState({
									height:innerHeight
							});
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
					page5:'none',
					page6:'none',
					page7:'block',
					//Opacity: 0,
					activityDown: true
				},()=>{
					countdown = setInterval(function(){
							if( this.state.height < innerHeight ){
									this.setState({
											height: this.state.height + 10,
									});
							} else {
									clearInterval(countdown);
									this.setState({
											height:innerHeight
									});
							}
					}.bind(this), 10);
				})
			break;
		default:
		break;
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
	common_bg:{
		width:devWidth,
		height:devHeight,
		backgroundSize:'cover'
	},
	bg1:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page1.jpg`)+')',
	},
	bg2:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page2.jpg`)+')',
	},
	bg3:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page3.jpg`)+')',
	},
	bg4:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page4.jpg`)+')',
	},
	bg5:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page7.jpg`)+')',
	},
	bg6:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page5.jpg`)+')',
	},
	bg7:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page6.jpg`)+')',
	},
	page7_img1:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page7_img1.png`)+')',
	},
	page7_img2:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page7_img2.png`)+')',
	},
	page7_img3:{
		backgroundImage:'url('+ Dm.getUrl_img(`/img/v2/activity/app_img/page7_img3.png`)+')',
	},
	page1_img1:{
		top:0,
		left:0,
		zIndex:1,
	},
	page1_img2:{
		top:0,
		left:0,
	},
	page1_img3:{
		top:0,
		right:0,
		zIndex:3,
	},
	page1_img4:{
		top:0,
		left:0,
		zIndex:4,
	},
	page2_img1:{
		top:devHeight/1334*70,
		left:devWidth/750*65,
	},
	page2_img2:{
		top:devHeight/1334*556,
		left:devWidth/750*90,
	},
	page2_img3:{
		top:devHeight/1334*382,
		right:devWidth/750*60,
	},
	page3_img1:{
		top:devHeight/1334*99,
		left:devWidth/750*65,
		zIndex:3,
	},
	page3_img2:{
		bottom:devHeight/1334*157,
		left:devWidth/750*138,
	},
	page3_img3:{
		top:devHeight/1334*481,
		left:devWidth/750*90,
	},
	page3_img4:{
		top:devHeight/1334*343,
		right:devWidth/750*94,
	},
	page3_img5:{
		bottom:devHeight/1334*168,
		left:devWidth/750*105,
	},
	page4_img1:{
		top:devHeight/1334*77/2,
		left:devWidth/750*72,
	},
	page4_img2:{
		bottom:devHeight/1334*66/2,
		left:devWidth/750*76,
	},
	page4_img3:{
		top:devHeight/1334*385,
		left:devWidth/750*86,
	},
	page4_img4:{
		top:devHeight/1334*190,
		right:devWidth/750*314,
		zIndex:3,
	},
	page4_img5:{
		bottom:devHeight/1334*280,
		right:devWidth/750*337,
		zIndex:3,
	},
	page4_img6:{
		bottom:devHeight/1334*113,
		left:devWidth/750*50,
		zIndex:3,
	},
	page5_img1:{
		top:devHeight/1334*88,
		left:devWidth/750*65,
	},
	page5_img2:{
		bottom:devHeight/1334*136,
		left:devWidth/750*55,
	},
	page5_img3:{
		bottom:devHeight/1334*251,
		left:devWidth/750*82,
	},
	page5_img4:{
		top:devHeight/1334*328,
		left:devWidth/750*72,
	},
	page5_img5:{
		top:devHeight/1334*407,
		right:devWidth/750*143,
	},
	page5_img6:{
		bottom:devHeight/1334*146,
		right:devWidth/750*51,
	},
	page6_img1:{
		top:devHeight/1334*262,
		left:devWidth/750*81,
		position:'absolute',
		zIndex:2,
	},
};

export default PgActivityApp;
