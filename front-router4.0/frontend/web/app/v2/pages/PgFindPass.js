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

var DEFAULT_FREEZETIME = 60;

var countdown;// countdown intervalObj

class PgFindPass extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			isSmsSent: true,
			buttonColor: false,
			phone: '',
			password: '',
			code: '',
		};

	}
	_onChangeLoginPhone(e){
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
	_onChangeLoginPass(e){
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
	_onChangeLoginCode(e){
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
	_onBlurChangeButton(){
		if (this.state.phone && this.state.password && this.state.code) {
			this.setState({
				buttonColor: true
			})
		}else {
			this.setState({
				buttonColor: false
			})
		}
	}
	_onClick_btnSendCode(){
		if (this.state.isSmsSent) {
			this.setState({
				isSmsSent:false,
				freezeTime: DEFAULT_FREEZETIME,
			}, () => {
				Dispatcher.dispatch({
					actionType: 'getVerifyCode',
					userName: this.state.phone,
					type: 'recover_password'
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
			}, 1500);
		}
	}

	_handleVerifyCode(re) {
		console.log(re)
		if (re.err) {
			alert(re.err)
		}
	}

	recoverPw() {
		Dispatcher.dispatch({
			actionType: 'RecoverPw',
			userName: this.state.phone,
			verifyCode: this.state.code,
			newpass: this.state.password
		})
	}

	_handleRecoverPw(re) {
		console.log(re)
		if(re.err) {
			alert(re.err)
			return
		}
		if(re.result) {
			if(re.result.setNewPw == true) {
				this.props.history.go(-1)
			}
		}
	}

	componentDidMount() {
		this._getVerifyCode = EventCenter.on('getVerifyCodeDone', this._handleVerifyCode.bind(this))
		this._getRecoverPw = EventCenter.on('RecoverPwDone', this._handleRecoverPw.bind(this))
	}
	componentWillUnmount() {
		clearInterval(countdown)
		this._getVerifyCode.remove()
		this._getRecoverPw.remove()
	}
	render(){
		return (
			<div className="PgLogin">
				<div className ="tel-phone">
					<div className="tel-div">
						<img src={Dm.getUrl_img('/img/v2/icons/phone.png')} height="20" width="15" />
						<input style={{border: 'none', fontSize: 15}} placeholder="手机号" onChange={this._onChangeLoginPhone.bind(this)} value={this.state.phone} onBlur={this._onBlurChangeButton.bind(this)}/>
					</div>
				</div>
				<div className= "login-code">
					<div className="code-div">
						<div className="code-text">
							<img src={Dm.getUrl_img('/img/v2/icons/verification-code.png')} height="15" width="15" />
							<input style={{border: 'none', fontSize: 15}} placeholder="验证码" onChange={this._onChangeLoginCode.bind(this)} onBlur={this._onBlurChangeButton.bind(this)}/>
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
							<input style={{border: 'none', fontSize: 15}} placeholder="新密码" onChange={this._onChangeLoginPass.bind(this)} value={this.state.password} onBlur={this._onBlurChangeButton.bind(this)}/>
						</div>
					</div>
				</div>
				<div className="denglu-div">
				{
					this.state.buttonColor ?
						<div className="button"> <div style={{lineHeight: '45px'}} onClick={this.recoverPw.bind(this)}>确定</div></div>
					: <div className="button" style={{...styles.button}}><div style={{lineHeight: '45px'}}>确定</div></div>
				}
				</div>
			</div>
		);
	}
}
PgFindPass.propTypes = {

};
PgFindPass.defaultProps = {

};
var styles = {
  button:{
    backgroundColor:'#d1d1d1',
  }
}
export default PgFindPass;
