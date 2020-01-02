/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link,StyleSheet } from 'react-router-dom';
import {dm} from '../util/DmURL';
import Dm from '../util/DmURL'
import BlackAlert from '../components/BlackAlert';
var DEFAULT_FREEZETIME = 60;

var countdown;// countdown intervalObj

class PgRegister extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			isSmsSent: true,
			phone: '',
			password: '',
			code: '',
			buttonColor: false,
			word: '',
			isShow: false
		};

	}
	_onChangeRegisterPhone(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.password && v.length > 0 && this.state.code) {
			this.setState({
				phone: v,
				buttonColor: true
			})
		}else {
			this.setState({
				phone: v,
				buttonColor: false
			})
		}
	}
	_onChangeRegisterPassword(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.phone && v.length > 0 && this.state.code) {
			this.setState({
				password: v,
				buttonColor: true
			})
		}else {
			this.setState({
				password: v,
				buttonColor: false
			})
		}
	}
	_onChangeRegisterCode(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.phone && v.length > 0 && this.state.password) {
			this.setState({
				code: v,
				buttonColor: true
			})
		}else {
			this.setState({
				code: v,
				buttonColor: false
			})
		}
	}
	_onBlurChangeButton(){//失去焦点的时候判断登录按钮是否改变颜色
		if (this.state.phone && this.state.code && this.state.password) {
			this.setState({
				buttonColor: true
			})
		}else {
			this.setState({
				buttonColor: false
			})
		}
	}
	_onClick_btnSendCode(){//获取验证码
		if (this.state.isSmsSent) {
			this.setState({
				isSmsSent:false,
				freezeTime: DEFAULT_FREEZETIME,
			}, () => {
				Dispatcher.dispatch({
					actionType: 'getVerifyCode',
					userName: this.state.phone,
					type: 'register'
				})
			})
			countdown = setInterval(()=>{
					if( this.state.freezeTime > 0 ){
							this.setState({
									freezeTime: this.state.freezeTime - 1
							});
					} else {
							clearInterval(countdown);
							this.setState({
									isSmsSent: true
							});
					}
			}, 1000);
		}
	}

	_register() {
		if(this.state.buttonColor == true) {
			Dispatcher.dispatch({
				actionType: 'Register',
				userName: this.state.phone,
				pw: this.state.password,
				verifyCode: this.state.code
			})
		} else {
			return
		}
	}

	_handleVerifyCode(re) {
		console.log(re)
		if(re.err) {
			this.setState({
				word: re.err,
				isShow: true
			}, () => {
				clearTimeout(this.t)
				this.t = setTimeout(() => {
					this.setState({
						isShow: false
					})
				}, 1000)
			})
		}
	}

	_handleRegister(re) {
		console.log("REGISTER", re)
		if(re.err) {
			this.setState({
				word: re.err,
				isShow: true
			}, () => {
				clearTimeout(this.t)
				this.t = setTimeout(() => {
					this.setState({
						isShow: false
					})
				}, 1000)
			})
			return
		}
		if(re.user.isLogined) {
			if(!isWeiXin) dm.saveCredentials(re.result);
			// var url=`${__rootDir}/PgCenter`;
			this.props.history.go(-2);
		}
	}

	componentDidMount() {
		this._getVerifyCode = EventCenter.on('getVerifyCodeDone', this._handleVerifyCode.bind(this))
		this._getRegister = EventCenter.on('RegisterDone', this._handleRegister.bind(this))
	}
	componentWillUnmount() {
		this._getVerifyCode.remove()
		this._getRegister.remove()
		clearInterval(countdown)
	}
	render(){
		return (
			<div className="PgLogin">
				<BlackAlert isShow={this.state.isShow} word={this.state.word}/>
				<div className ="tel-phone">
					<div className="tel-div">
						<img src={Dm.getUrl_img('/img/v2/icons/phone.png')} height="20" width="15" />
						<input style={{border: 'none', fontSize: 15}} placeholder="手机号" onChange={this._onChangeRegisterPhone.bind(this)} onBlur={this._onBlurChangeButton.bind(this)}/>
					</div>
				</div>
				<div className= "login-code">
					<div className="code-div">
						<div className="code-text">
							<img src={Dm.getUrl_img('/img/v2/icons/verification-code.png')} height="15" width="15" />
							<input style={{border: 'none', fontSize: 15, width: '50%'}} placeholder="验证码" onChange={this._onChangeRegisterCode.bind(this)} onBlur={this._onBlurChangeButton.bind(this)}/>
						</div>
						{
							this.state.isSmsSent ?
							<div className="code">
								<div onClick={this._onClick_btnSendCode.bind(this)}>获取验证码</div>
							</div>:
							<div className="code">
								<div>还剩{this.state.freezeTime}秒</div>
							</div>
						}
					</div>
				</div>
				<div className= "login-code">
					<div className="pass-div">
						<div className="pass-text">
							<img src={Dm.getUrl_img('/img/v2/icons/password.png')} height="19" width="15" />
							<input style={{border: 'none', fontSize: 15}} type="password" placeholder="密码"  onChange={this._onChangeRegisterPassword.bind(this)} onBlur={this._onBlurChangeButton.bind(this)}/>
						</div>
					</div>
				</div>
				<div className="denglu-div" onClick={this._register.bind(this)}>
					{
						this.state.buttonColor ?
							<div className="button" ><div style={{lineHeight: '45px'}}>注册</div></div>
							: <div className="button" style={{...styles.button}}><div style={{lineHeight: '45px'}}>注册</div></div>
					}
				</div>
			</div>
		);
	}
}
PgRegister.propTypes = {

};
PgRegister.defaultProps = {

};
var styles = {
  button:{
    backgroundColor:'#d1d1d1',
  }
};
export default PgRegister;
