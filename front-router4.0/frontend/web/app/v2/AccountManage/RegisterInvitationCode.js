import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

var countdown

class RegisterInvitationCode extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      one: '',
      two: '',
      three: '',
      four: '',
      five: '',
      six: '',
			isShow: false,
			button: false,
			//弹框是否显示
			display:'none',
			//弹框提示信息
			alert_title:'',
			//弹框的图标
			alert_icon:'',
			icon_width:0,
			icon_height:0,
			successAlert: 'none',
			successAlertTitle:''
		};

	}
  componentWillMount() {

  }

	componentDidMount() {
		if (this.props.location.state) {
			this.setState({
				point: this.props.location.state.point || 0
			})
		}
		this.e_RegisterInvitedCode = EventCenter.on('RegisterInvitedCodeDone',this._handleeRegisterInvitedCode.bind(this));

    EventCenter.emit("SET_TITLE",'铂略财课-邀请码')

	}
	componentWillUnmount() {
		this.e_RegisterInvitedCode.remove();
		clearInterval(countdown);
	}
	_handleeRegisterInvitedCode(re){

		if(re.err){
			this.setState({
					display:'block',
					alert_title:re.err,
					alert_icon:failure_icon,
					icon_width:failure_width,
					icon_height:failure_height,
				},()=>{
					countdown = setInterval(function(){
							clearInterval(countdown);
							this.setState({
								display:'none',
							})
					}.bind(this), 1500);
				});
				return;
		}

		if(re.result){//success_icon
			var successAlertTitle='邀请成功，获得'+this.state.point+'积分'
			if (re.result.isStaff) {
				successAlertTitle ='邀请成功，你已获得铂略2天VIP体验权限'
			}
			this.setState({
					successAlert:'blcok',
					successAlertTitle: successAlertTitle
				},()=>{
					countdown = setInterval(function(){
							clearInterval(countdown);
							this.setState({
								successAlert:'none'
							})
					}.bind(this), 1500);
				});
			this.props.history.push({pathname:`${__rootDir}/`});
		}
	}
  _onChangeOne(e){
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      one:val,
    },()=>{
			if (val) {
				this.two.focus();
			}
			this.checkButtom()
    });
  }
  _onChangeTwo(e){
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      two:val,
    },()=>{
			if (val) {
				this.three.focus();
			}
			this.checkButtom()
    })
  }
  _onChangeThree(e){
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      three:val,
    },()=>{
			if (val) {
				this.four.focus();
			}
			this.checkButtom()
    })
  }
  _onChangeFour(e){
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      four:val,
    },()=>{
			if (val) {
				this.five.focus();
			}
			this.checkButtom()
    })
  }
  _onChangeFive(e){
    e.preventDefault();
    var val = e.target.value.trim() ;
    this.setState({
      five:val,
    },()=>{
			if (val) {
				this.six.focus();
			}
			this.checkButtom()
    })
  }
  _onChangeSix(e){
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      six:val,
    },()=>{
			this.checkButtom()
		})
  }
	checkButtom(){
		if (this.state.one && this.state.two && this.state.three && this.state.four && this.state.five && this.state.six) {
			this.setState({
				button: true
			})
		}else {
			this.setState({
				button: false
			})
		}
	}
	btn_Ok(){
		var inviteCode = this.state.one+this.state.two+this.state.three+this.state.four+this.state.five+this.state.six
		//发送请求
		Dispatcher.dispatch({
			actionType: 'RegisterInvitedCode',
			invite_code:inviteCode,
		});
	}
	render(){

    return(
			<div style={{...styles.div}}>
        <div style={{...styles.codediv}}>
          <div style={{...styles.codeNum}}>
            <input style={{...styles.input}} maxLength="1" onChange={this._onChangeOne.bind(this)}
              ref={(input) => {this.one = input;}} onBlur={this.checkButtom.bind(this)} value={this.state.one} type='text'/>
          </div>
          <div style={{...styles.codeNum}}>
            <input style={{...styles.input}} maxLength="1" onChange={this._onChangeTwo.bind(this)}
            ref={(input) => {this.two = input;}} onBlur={this.checkButtom.bind(this)} value={this.state.two} type='text'/>
          </div>
          <div style={{...styles.codeNum}}>
            <input style={{...styles.input}} maxLength="1" onChange={this._onChangeThree.bind(this)}
            ref={(input) => {this.three = input;}} onBlur={this.checkButtom.bind(this)} value={this.state.three} type='text'/>
          </div>
          <div style={{...styles.codeNum}}>
            <input style={{...styles.input}} maxLength="1" onChange={this._onChangeFour.bind(this)}
            ref={(input) => {this.four = input;}} onBlur={this.checkButtom.bind(this)} value={this.state.four} type='text'/>
          </div>
          <div style={{...styles.codeNum}}>
            <input style={{...styles.input}} maxLength="1" onChange={this._onChangeFive.bind(this)}
            ref={(input) => {this.five = input;}} onBlur={this.checkButtom.bind(this)} value={this.state.five} type='text'/>
          </div>
          <div style={{...styles.codeNum}}>
            <input style={{...styles.input}} maxLength="1" onChange={this._onChangeSix.bind(this)}
            ref={(input) => {this.six = input;}} onBlur={this.checkButtom.bind(this)} value={this.state.six} type='text'/>
          </div>
        </div>
				{
					this.state.button ?
					<div onClick={this.btn_Ok.bind(this)} style={{...styles.button,backgroundImage:'linear-gradient(-49deg,#27cfff 0%,#2aa6ff 100%)'}}>
						<span style={{fontSize:18,color:'#FFFFFF'}}>提交</span>
					</div>
					:
					<div style={{...styles.button,backgroundColor:'#E1E1E1'}}>
						<span style={{fontSize:18,color:'#FFFFFF'}}>提交</span>
					</div>
				}

        <div style={{marginTop:20,marginLeft:15}}>
          <span style={{fontSize:14,color:'#999999'}}>
						使用<span style={{color:'#555555'}}>铂略邀请码</span>，使用后即可获得 <span style={{color:'#555555'}}>2天VIP体验</span>
					</span>
        </div>
        <div style={{marginLeft:15}}>
          <span style={{fontSize:14,color:'#999999'}}>使用<span style={{color:'#555555'}}>好友邀请码</span>，您和您的好友都将获得<span style={{color:'#555555'}}>{this.state.point}积分</span></span>
        </div>
        <div style={{width:devWidth,textAlign:'center',marginTop:35}}>
          <span onClick={this.jump.bind(this)} style={{fontSize:14,color:'#2196f3'}}>跳过</span>
        </div>
				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
				<div style={{...styles.alert,width:270,left:(devWidth-270)/2,display:this.state.isShow ?'block':'none',height: this.state.isDown ? 130 : 160}}>
					<div style={{...styles.alertFirstDiv,height:this.state.isDown ? 84 : 113}}>
						<div style={{width:270,height:50,marginTop:18,position:'absolute',textAlign:'center'}}>
							<span style={{fontSize:16,color:'#030303',}}>
								确认跳过
							</span>
							<div>
								<div style={{lineHeight:1.2}}>
									<div >
										<span style={{fontSize:12,color:'#333333'}}>
											使用好友邀请码，您和您的好友都将获得{this.state.point || 0}积分
										</span>
									</div>
									<div>
										<div>
											<span style={{fontSize:12,color:'#333333'}}>
												使用铂略邀请码，您即可获得2天VIP会员体验
											</span>
										</div>
										<div>
											<span style={{fontSize:12,color:'#333333'}}>
												点击确认后将跳过该步骤
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div style={{position:'relative',bottom:0}}>
						<div>
							<div onClick={this.cancel.bind(this)} style={{...styles.alertSecond,width:134}} >
								<span style={{fontSize:17,color:'#666666'}}>取消</span>
							</div>
							<div onClick={this.gotoHome.bind(this)}  style={{...styles.alertSecond,border:'none'}} >
								<span style={{fontSize:17,color:'#2196f3'}}>确认</span>
							</div>
						</div>
					</div>
				</div>
				{/*弹框*/}
				<div style={{...Common.alertDiv,display:this.state.display}}>
					<div style={{marginBottom:14,paddingTop:15,height:30,}}>
						<img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
					</div>
					<span style={{color:Common.BG_White}}>{this.state.alert_title}</span>
				</div>
				<div style={{...styles.inviteCodeSucces,width:265,left: (devWidth-265)/2,display:this.state.successAlert}}>
					<span style={{fontSize:14,color:'#FFFFFF'}}> </span>
				</div>
			</div>
    )
  }
	gotoHome(){
		this.props.history.push({pathname: `${__rootDir}/`,});
	}
	cancel(){
		this.setState({
			isShow: false
		})
	}
	jump(){
		this.setState({
			isShow: true,
		})
	}
}

var styles = {
  div:{
    height: devHeight,
    width: devWidth,
    backgroundColor:'#f4f4f4',
  },
  codediv:{
    width: devHeight,
    height: 121,
    display:'flex',
  },
  codeNum:{
    width: 45,
    height: 45,
    border:'0.5px solid #2196f3',
    borderRadius:'2px',
    marginLeft: (devWidth-276)/7,
    marginTop: 40,
    textAlign:'center'
  },
  button:{
    width: devWidth-30,
    marginLeft: 15,
    height: 45,
    textAlign:'center',
    lineHeight: 3,
  },
  input:{
    width: 40,
    height: 40,
    backgroundColor:'#f4f4f4',
    border:'none',
    textAlign:'center',
    fontSize:20,
    color:'#333333',
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
	alert:{
		width:270,
		height:131,
		backgroundColor:'#ffffff',
		borderRadius:'12px',
		position:'absolute',
		top: (devHeight - 131)/2,
		zIndex:999,
		// left: (devWidth-270)/2
	},
	alertFirstDiv:{
		// width:270,
		height:84,
		borderBottomWidth:0.5,
		borderBottomColor:'#D4D4D4',
		borderBottomStyle:'solid',
		// padding:'20px 14px 0px 14px'
	},
	alertSecond:{
		width:135,
		height:45,
		textAlign:'center',
		borderRightWidth:1,
		borderRightColor:'#D4D4D4',
		borderRightStyle:'solid',
		float:'left',
		lineHeight:3
	},
	inviteCodeSucces:{
		height:40,
		backgroundColor:'#000000',
		opacity:0.7,
		borderRadius:'2px',
		textAlign:'center',
		position:'absolute',
		top: 190,
		lineHeight: 2.5
	}
}

export default RegisterInvitationCode;
