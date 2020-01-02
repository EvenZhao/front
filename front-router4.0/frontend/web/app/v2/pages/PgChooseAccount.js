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
import { dm } from '../util/DmURL';
import ResultAlert from '../components/ResultAlert'

class PgChooseAccount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			select: this.props.location.state.moreAccount ? this.props.location.state.moreAccount[0].uuid : '',
			err: '',
			errCode: false,
			loginShow: false,
			moreAccount: this.props.location.state.moreAccount,
			//弹框提示信息
			alert_display: 'none',
			alert_title: '',
			alertShow: false,
			errStatus: 0,//0:返回错误信息,1:显示其他提示信息
			isShow:false,
		};
	}
	componentWillMount() {
	}

	componentDidMount() {
		this._onBindDone = EventCenter.on('BindDone', this._handleBindDone.bind(this))
		this._onQuickLogin = EventCenter.on('QuickLoginDone', this._handleQuickLogin.bind(this))
	}

	componentWillUnmount() {
		this._onBindDone.remove()
		this._onQuickLogin.remove()
		clearInterval(this.countdown)
		
	}
	_handleAl() {
		this.setState({
			loginShow: true,
		})
	}
	closeAlert() {
		this.setState({
			loginShow: false,
		})
	}
	_chooseAccount(item) {
		this.setState({
			select: item.uuid,
			moreAccount: this.state.moreAccount
		})
	}

	Login() {
		if (this.state.select && this.props.location.state.type == 'login') {
			Dispatcher.dispatch({
				actionType: 'Bind',
				userName: this.props.location.state.userName,
				pw: this.props.location.state.pw,
				id: this.state.select
			})
		} else if (this.state.select && this.props.location.state.type == 'quickLogin') {
			Dispatcher.dispatch({
				actionType: 'QuickLogin',
				userName: this.props.location.state.userName,
				verifyCode: this.props.location.state.code,
				id: this.state.select
			})
		} else {
			return
		}
	}

	_handleBindDone(re) {
		console.log('---re--', re);
		if(re.err){
			this.setState({
				alertShow: true,
				alert_display: 'block',
				alert_title: re.err,
				errStatus: 0,
				isShow:true
			},()=>{
				this.countdown = setInterval(()=> {
					clearInterval(this.countdown);
					this.setState({
						alert_display: 'none',
						isShow: false,
					})
				}, 1500);
			})
			return;
		}

		if (re.errCode == 'ERR_BINDED') {
			this.setState({
				errCode: true,
				err: re.err,
			})

			return;
		}
		if (re.result && re.user.isLogined) {

			localStorage.setItem("credentials.code", re.result.code);
			localStorage.setItem("credentials.openid", re.result.openid);
			if (!isWeiXin) dm.saveCredentials(re.result);
			// var url=`${__rootDir}/PgCenter`;

			//登录成功以后检索线下课是否有参课提醒
			Dispatcher.dispatch({
				actionType: 'OfflineCodeToday',
			})

			if (re.result.firstLogin) {
				this.props.history.push({ pathname: `${__rootDir}/newbieTaskIndex`, query: null, hash: null, state: null });
				return
			}
			if (loginType) {
				loginType = false
				this.props.history.push({ pathname: `${__rootDir}/PgCenter`, query: null, hash: null, state: null });

			} else {
				this.props.history.go(-2);
			}
			if (re.result.changePasswordFlag) {
			  EventCenter.emit('showChangePwdTips', re);
			}
		}
	}

	_handleQuickLogin(re) {
		// console.log("多账号：",re)
		if(re.err){
			this.setState({
				alertShow: true,
				alert_display: 'block',
				alert_title: re.err,
				errStatus: 0,
				isShow:true
			},()=>{
				this.countdown = setInterval(()=> {
					clearInterval(this.countdown);
					this.setState({
						alert_display: 'none',
						isShow: false,
					})
				}, 1500);
			})
			return;
		}
		if (re.errCode == 'ERR_BINDED') {
			this.setState({
				errCode: true,
				err: re.err,
			})
			return;
		}
		if (re.result && re.user.isLogined) {

			localStorage.setItem("credentials.code", re.result.code);
			localStorage.setItem("credentials.openid", re.result.openid);

			if (!isWeiXin) dm.saveCredentials(re.result);
			// var url=`${__rootDir}/PgCenter`;
			this.props.history.go(-2);
			if (re.result.changePasswordFlag) {
			  EventCenter.emit('showChangePwdTips', re);
			}
		}
	}

	render() {

		var moreAccount = this.state.moreAccount.map((item, index) => {
			var choose
			if (this.state.select == item.uuid) {
				choose = true
			} else {
				choose = false
			}
			var _type;
			if (item.dispType == 0) {
				_type = '注册账号';
			}
			else if (item.dispType == 1) {
				_type = '铂略员工账号';
			}
			else if (item.dispType == 2) {
				_type = '会员账号'
			}

			return (
				<div key={index} style={{ ...styles.choose_bar, borderColor: choose ? '#2196f3' : '#e5e5e5' }} onClick={() => { this._chooseAccount(item) }}>
					<div style={{ width: 40, height: 40, float: 'left', margin: '10px 6px 10px 12px' }}>
						<img src={item.photo} style={{ width: 40, height: 40, borderRadius: 100, }} />
					</div>
					<div style={{ float: 'left', width: window.screen.width - 95, marginTop: 10 }}>
						<div style={{ overflow: 'hidden' }}>
							<div style={{ ...styles.nick_name }}>{item.nickName}</div>
							<span style={{ fontSize: 12, color: '#999', float: 'right', marginLeft: 12 }}>{_type}</span>
							{index == 0 ?
								<span style={{ fontSize: 12, color: '#2196f3', float: 'right' }}>推荐登录</span>
								:
								null
							}
						</div>
						<div style={{ ...styles.LineClamp, fontSize: 12, color: '#999', lineHeight: '21px', width: window.screen.width - 95 }}>{item.company}</div>
					</div>
				</div>
			)
		})

		let errProps = {
			alert_display: this.state.alert_display,
			alert_title: this.state.alert_title,
			isShow: this.state.alertShow,
			errStatus: this.state.errStatus
		}

		return (
			<div style={styles.container}>
				<ResultAlert {...errProps} />
				<div style={{ fontSize: 12, color: '#333', marginTop: 30, marginLeft: 15 }}>该手机号对应多个账号，请选择</div>
				<div style={{ marginTop: 10 }}>{moreAccount}</div>

				{
					this.state.err && this.state.errCode ?
						<div style={{ color: '#F37633', fontSize: 12, marginLeft: 16, marginTop: 15 }}>
							{this.state.err}<span style={{ color: '#2196f3' }} onClick={this._handleAl.bind(this)}>不是自己绑定的？</span>
						</div>
						:
						null
				}
				<div style={{ marginTop: 50, marginLeft: 15, }}>
					<button style={{ ...styles.button, backgroundColor: this.state.select ? '#2196f3' : '#d1d1d1' }} onClick={this.Login.bind(this)}>{isWeiXin ? '绑定' : '选好了，确认登录'}</button>
				</div>
				<div style={{ ...styles.zzc, display: this.state.loginShow ? 'block' : 'none' }}></div>
				<div style={{ ...styles.bind_alert, paddingTop: 1, display: this.state.loginShow ? 'block' : 'none' }}>
					<div style={{ fontSize: 12, color: '#030303', marginLeft: 12, marginTop: 20, width: 246, height: 99 }}>
						<div>一个铂略账号只能关联绑定一个微信账号。</div>
						您的铂略账号已关联绑定过其他微信账号，您可登录铂略PC官网或拨打铂略客服电话<span style={{ color: '#2196F3' }}>(400-689-0679）</span>解除绑定。
          <div>解除绑定后，请再与当前微信账号进行绑定。</div>
					</div>
					<div style={{ ...styles.bottom }} onClick={this.closeAlert.bind(this)}>知道了</div>
				</div>
			</div>
		)
	}
}

var styles = {
	container: {
		width: window.screen.width,
		height: window.innerHeight,
		overflow: 'auto'
	},
	choose_bar: {
		width: window.screen.width - 25,
		height: 60,
		marginLeft: 13,
		border: '1px solid #e5e5e5',
		backgroundColor: '#fff',
		borderRadius: 4,
		marginBottom: 15,
	},
	button: {
		backgroundColor: '#d1d1d1',
		borderRadius: 4,
		height: 45,
		width: window.screen.width - 30,
		color: '#fff',
		border: 'none',
		fontSize: 18
	},
	nick_name: {
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 1,
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		fontSize: 14,
		color: '#333',
		float: 'left',
		width: window.screen.width - 235,

	},
	bind_alert: {
		width: 270,
		height: 160,
		position: 'absolute',
		zIndex: 999,
		left: (devWidth - 270) / 2,
		top: (devHeight - 160) / 2,
		backgroundColor: '#fff',
		borderRadius: 12,
	},
	bottom: {
		width: 270,
		height: 40,
		lineHeight: '40px',
		borderTopColor: '#f3f3f3',
		borderTopWidth: 1,
		borderTopStyle: 'solid',
		textAlign: 'center',
		fontSize: 17,
		color: '#0076FF',
	},
	zzc: {
		width: devWidth,
		height: devHeight,
		backgroundColor: '#cccccc',
		position: 'absolute',
		opacity: 0.5,
		zIndex: 998,
		top: 0,
	},
	LineClamp: {
		textOverflow: 'ellipsis',
		whiteSpace: 'normal',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 1,
	},
}

export default PgChooseAccount;
