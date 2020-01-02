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

class PgNoPassLogin extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			isSmsSent: true,
			phone: '',
			code: '',
			buttonColor: false,
		};

	}
	_onChangeLoginPhone(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.code && v.length > 0) {
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
	_onChangeLoginCode(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.phone && v.length > 0) {
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
		if (this.state.phone && this.state.code) {
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
	componentDidMount() {
	}
	componentWillUnmount() {
	}
	render(){
		return (
			<div className="PgLogin">
				<div className ="tel-phone">
					<div className="tel-div">
						<img src={Dm.getUrl_img('/img/v2/icons/phone.png')} height="20" width="15" />
						<input placeholder="手机号" onChange={this._onChangeLoginPhone.bind(this)}  onBlur={this._onBlurChangeButton.bind(this)}/>
					</div>
				</div>
				<div className= "login-code">
					<div className="code-div">
						<div className="code-text">
						<img src={Dm.getUrl_img('/img/v2/icons/verification-code.png')} height="15" width="15" />
							<input placeholder="验证码" onChange={this._onChangeLoginCode.bind(this)}  onBlur={this._onBlurChangeButton.bind(this)}/>
						</div>
						{
							this.state.isSmsSent ?
							<div className="code">
								<button onClick={this._onClick_btnSendCode.bind(this)}>获取验证码</button>
							</div>:
							<div className="code">
								<button>{this.state.freezeTime}秒</button>
							</div>
						}
					</div>
				</div>
				<div className="denglu-div">
				{
					this.state.buttonColor ?
						<div className="button"><button>登录</button></div>
						: <div className="button" style={{...styles.button}}><button>登录</button></div>
				}

				</div>
				<div className="login-register">
					<div className="login"><Link to={`${__rootDir}/login`}><span style={{color:'#333333'}}>账号密码登录</span></Link></div><div><Link to={`${__rootDir}/register`}><span style={{color:'#333333'}}>注册</span></Link></div>
				</div>
			</div>
		);
	}
}
PgNoPassLogin.propTypes = {

};
PgNoPassLogin.defaultProps = {

};
var styles = {
  button:{
    backgroundColor:'#d1d1d1',
  }
};
export default PgNoPassLogin;
