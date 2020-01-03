/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link ,History} from 'react-router-dom';
import PromptBox from '../components/PromptBox';
import {dm} from '../util/DmURL';
import Dm from '../util/DmURL'
import funcs from '../util/funcs'


var countdown;

class PgLogin extends React.Component {
	// mixins: [History]
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			phone: '',
			code: '',
			buttonColor: false,
			context: '',
			display:'none',
      isSmsSent: true,
      freezeTime: 60,
      context: '',
      display: 'none'
		};
	}
	_onChangeLoginPhone(e){
		// e.preventDefault();
		// var v = e.target.value.trim();
		if (this.state.code && e.target.value.length > 0) {
			this.setState({
				phone: e.target.value,
				buttonColor: true
			})
		}else {
			this.setState({
				phone: e.target.value,
				buttonColor: false
			})
		}
	}
	_onChangeLoginCode(e){
		// e.preventDefault();
		var v = e.target.value;
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
	_onBlurChangeButton(){
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
	_handleBindDone(re){
		if (re.err) {
			this.setState({
				context:re.err,
				display:'block'
			});
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
			return false;
		}
		if (re.result) {
			if(re.result.length > 1) {
				this.props.history.push({pathname: `${__rootDir}/chooseAccount`, query: null, hash: null, state: {userName: this.state.phone, code: this.state.code, pw: null, moreAccount: re.result, type: 'quickLogin'} })
				return
			} else {
				if(!isWeiXin) dm.saveCredentials(re.result);
				// var url=`${__rootDir}/PgCenter`;
				this.props.history.go(-1);
			}
		}
	}

  _onClick_btnSendCode(){//获取验证码
    if(!this.state.phone) {
      return
    }
		if (this.state.isSmsSent) {
			this.setState({
				isSmsSent:false,
				freezeTime: 60,
			}, () => {
				Dispatcher.dispatch({
					actionType: 'getVerifyCode',
					userName: this.state.phone,
					type: 'quick_login'
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

  _handleVerifyCode(re) {
    if (re.err) {
			this.setState({
				context:re.err,
				display:'block'
			});
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
			return false;
		}
  }

	_login(e){
		if (!isCellPhoneAvailable(this.state.phone)) {
			this.setState({
				context:'请输入正确的账号',
				display:'block'
			});
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
			return false;
		}
		if (!this.state.code) {
				this.setState({
					context:'请输入正确的密码',
					display:'block'
				});
			return false;
		}
		// alert('ppp');
		Dispatcher.dispatch({
			actionType: 'QuickLogin',
			userName: this.state.phone,
			verifyCode: this.state.code,
      uuid: null
		})
	}
	componentDidMount() {
		this._onBindDone = EventCenter.on('QuickLoginDone', this._handleBindDone.bind(this))
    this._getVerifyCode = EventCenter.on('getVerifyCodeDone', this._handleVerifyCode.bind(this))
	}
	componentWillUnmount() {
		this._onBindDone.remove()
    this._getVerifyCode.remove()
    clearInterval(countdown)
	}
	render(){
		var content= {
			top:100,
			context:this.state.context,
			display:this.state.display,
		}
		return (
			<div>
				<div style={{height: 50, backgroundColor: '#fff', marginTop: 12}}>
					<img src={Dm.getUrl_img('/img/v2/icons/phone_num@2x.png')} height="20" width="15" style={{marginLeft: 12, marginRight: 12, position: 'relative', top: 16}}/>
					<input placeholder="手机号" style={{border: 'none', position: 'relative', top: 10, height: 20, fontSize: 15}} onChange={this._onChangeLoginPhone.bind(this)} value={this.state.phone} onBlur={this._onBlurChangeButton.bind(this)}></input>
				</div>
        <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px'}}></hr>
				<div style={{height: 50, backgroundColor: '#fff'}}>
					<img src={Dm.getUrl_img('/img/v2/icons/verification-code@2x.png')} height="15" width="19" style={{marginLeft: 12, marginRight: 8, position: 'relative', top: 16}}/>
					<input placeholder="验证码" style={{border: 'none', position: 'relative', top: 13.5, height: 20, fontSize: 15, width: '50%'}} onChange={this._onChangeLoginCode.bind(this)} value={this.state.code} onBlur={this._onBlurChangeButton.bind(this)} />
          <div style={{...styles.verifyCode}} onClick={this._onClick_btnSendCode.bind(this)}>{this.state.isSmsSent ? '获取验证码' : '还剩'+this.state.freezeTime+'S'}</div>
				</div>
        <div style={{margin: '40px 36px 0px'}} onClick={this._login.bind(this)}>
  				<button style={{...styles.button, backgroundColor: this.state.buttonColor ? '#2196f3' : '#d1d1d1'}}>登录</button>
  			</div>
				<div style={{margin: '12px 36px 0px'}}>
					<div style={{marginLeft: 12, float: 'left'}}><Link to={`${__rootDir}/login`}><span style={{color:'#666'}}>帐号密码登录</span></Link></div>
          <div style={{float: 'right', marginRight: 12}}><Link to={`${__rootDir}/register`}><span style={{color:'#666'}}>注册</span></Link></div>
				</div>
				<PromptBox {...content}/>
			</div>
		);
	}
}

var styles = {
  button: {
    backgroundColor: '#d1d1d1',
    borderRadius: 4,
    height: 45,
    width: window.screen.width-72,
    color: '#fff',
    border: 'none',
    fontSize: 15
  },
  verifyCode: {
    float: 'right',
    height: 35,
    width: 81,
    marginRight: 12,
    textAlign: 'center',
    lineHeight: '35px',
    backgroundColor: '#e5e5e5',
    marginTop: 6.5,
    fontSize: 14,
    padding: '0px 9px',
    borderRadius: 2,
    color: '#666'
  }
};
export default PgLogin;
