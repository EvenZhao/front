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
import ActivityAlert from './ActivityAlert'
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

class PgZrdj extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			top: 0,
			displayOne:'block',
			displayTwo:'none',
			displayThree:'none',
			displayFour:'none',
			name:'',
			position:'',
			mobile:'',
			company:'',
			telephone:'',
			email:'',
			Opacity:0,
			success: false,
			height:0,
			upDown: false,
			activityDown: false
		};
	}
	_changeTop() {
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
	_onChangePosition(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.position && v.length > 0) {
			this.setState({
				position: v,
			})
		}else {
			this.setState({
				position: v,
			})
		}
	}
	_onChangeMobile(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.mobile && v.length > 0) {
			this.setState({
				mobile: v,
			})
		}else {
			this.setState({
				mobile: v,
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
	_onChangeEmail(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.email && v.length > 0) {
			this.setState({
				email: v,
			})
		}else {
			this.setState({
				email: v,
			})
		}
	}
	componentWillMount() {
		// Dispatcher.dispatch({//getUserAccountDone
		// 	actionType: 'getUserAccount'
		// })
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
					if (danyeIndex==3) { //如果当前单页为最后一张，则回到第一张
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
		if (danyeIndex==3) { //如果当前单页为最后一张，则回到第一张
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
		console.log('onTouchMove',e);
		switch(e) {
			case 0:
				this.setState({
					displayOne:'block',
					displayTwo:'none',
					displayThree:'none',
					displayFour:'none',
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
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'转让定价专项课程')
		this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
	}
	componentWillUnmount() {
		this._getSpecialDone.remove()
		clearInterval(countdown)
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

		if (!this.state.mobile) {
			this.onIsShow('手机号不能为空')
			return false
		}
		if(!isCellPhoneAvailable(this.state.mobile)){
			this.onIsShow('请输入正确的手机号码')
			return false
		}
		if (!this.state.company) {
			this.onIsShow('公司不能为空')
			return false
		}

		Dispatcher.dispatch({
      actionType: 'Special',
      name:this.state.name,
			position:this.state.position,
			email:this.state.email,
			telephone: this.state.telephone,
			phone: this.state.mobile,
			company: this.state.company,
			isCima:false,
			url: document.location.href + '',
			title:'',
    })
	}
	render(){
		return (
			<div style={{...styles.container,}}
			ref={(lessonList) => this.lessonList = lessonList}
				onTouchEnd={this.onTouchEnd.bind(this)}
				onTouchStart={this.onTouchStart.bind(this)}
			>
        <div style={{...styles.div,display:this.state.displayOne,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/icons/ZrdjOne.png`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
        </div>
				<div style={{...styles.div,display:this.state.displayTwo,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/icons/ZrdjTwo.png`)} height={innerHeight} width={devWidth}  style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayThree,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
					<img src={Dm.getUrl_img(`/img/v2/icons/ZrdjThree.png`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
				</div>
				<div style={{...styles.div,display:this.state.displayFour,height:this.state.height,position:this.state.upDown ? 'relative':'absolute',bottom:0}}>
				<div style={{...styles.from,opacity:this.state.Opacity}}>
					<input style={{...styles.inputText}} type="text" value={this.state.name} placeholder=" Name" onChange={this._onChangeName.bind(this)}/>
					<input style={{...styles.inputText}} type="text" value={this.state.position} placeholder=" Position" onChange={this._onChangePosition.bind(this)}/>
					<input style={{...styles.inputText}} type="text" value={this.state.mobile} placeholder=" Mobile" onChange={this._onChangeMobile.bind(this)}/>
					<input style={{...styles.inputText}} type="text" value={this.state.company} placeholder=" Company" onChange={this._onChangeCompany.bind(this)}/>
					<input style={{...styles.inputText}} type="text" value={this.state.telephone} placeholder=" Telephone" onChange={this._onChangeTelephone.bind(this)}/>
					<input style={{...styles.inputText}} type="text" value={this.state.email} placeholder=" E-mail" onChange={this._onChangeEmail.bind(this)}/>
					<div style={{...styles.button}} onClick={this.onClickSpecial.bind(this)}>
						<span style={{color:'#f4f9fd'}}>提交</span>
					</div>
				</div>
					<img src={Dm.getUrl_img(`/img/v2/icons/ZrdjFour.png`)} height={devHeight} width={devWidth} style={{...styles.image}}/>
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

				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
				<ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
			</div>
		);
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
		height:31,
		width: devWidth -120,
		marginLeft:60,
		marginBottom:devHeight*(22/667)-4
	},
	button:{
		height: 30,
		width: 155,
		backgroundColor: '#5a7eb7',
		borderRadius: 4,
		marginLeft: (devWidth-155)/2,
		textAlign: 'center',
		lineHeight: 1.8
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
		height:100,
		width:devWidth,
		position:'absolute',
		top:devHeight*(60/667),
		zIndex: 99
	}
};
export default PgZrdj;
