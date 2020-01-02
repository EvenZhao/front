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

var testphone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

var testmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

var countdown;

class PgLogin extends React.Component {
	mixins: [ History ]
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			phone: '',
			password: '',
			buttonColor: false,
			context: '',
			display:'none'
		};

	}
	_onChangeLoginPhone(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.password && v.length > 0) {
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
		if (this.state.phone && v.length > 0) {
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
	_onBlurChangeButton(){
		if (this.state.phone && this.state.password) {
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

	}
	_login(e){
		if (this.state.phone.search(testphone) > -1 || this.state.phone.search(testmail) > -1) {

		}else {
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
		if (!this.state.password) {
				this.setState({
					context:'请输入正确的密码',
					display:'block'
				});
			return false;
		}
		// alert('ppp');
		Dispatcher.dispatch({
			actionType: 'Bind',
			userName: this.state.phone,
			pw: this.state.password
		})
	}
	componentDidMount() {
		this._onBindDone = EventCenter.on('BindDone', this._handleBindDone.bind(this))
	}
	componentWillUnmount() {
		this._onBindDone.remove()
	}
	render(){
		var content= {
			top:100,
			context:this.state.context,
			display:this.state.display,
		}
		return (
			<div className="PgLogin">
				<div className ="tel-phone">
					<div className="tel-div">
						<img src={Dm.getUrl_img('/img/v2/icons/phone_num@2x.png')} height="20" width="15" />
						<input style={{border:0, fontSize: 15}} placeholder="手机号或电子邮箱" onChange={this._onChangeLoginPhone.bind(this)} value={this.state.phone} onBlur={this._onBlurChangeButton.bind(this)}/>
					</div>
				</div>
				<div className= "login-code">
					<div className="pass-div">
						<div className="pass-text">
							<img src={Dm.getUrl_img('/img/v2/icons/password.png')} height="19" width="15" />
							<input style={{border:0, fontSize: 15}} type="password" placeholder="密码" onChange={this._onChangeLoginPass.bind(this)} value={this.state.password} onBlur={this._onBlurChangeButton.bind(this)} />
						</div>
					</div>
				</div>
				<div className="denglu-div">
					{
						this.state.buttonColor ?
							<div className="button" onClick={this._login.bind(this)}>登录</div>
							: 	<div className="button" style={{...styles.button}}>登录</div>

					}
				</div>
				<div className="login-register">
					<div className="login"><Link to={`${__rootDir}/findpass`}><span style={{color:'#333333'}}>忘记密码?</span></Link></div><div><Link to={`${__rootDir}/register`}><span style={{color:'#333333'}}>注册</span></Link></div>
				</div>
				<PromptBox {...content}/>
			</div>
		);
	}
}
PgLogin.propTypes = {

};
PgLogin.defaultProps = {

};
var styles = {
  button:{
    backgroundColor:'#d1d1d1',
  }
};
export default PgLogin;
