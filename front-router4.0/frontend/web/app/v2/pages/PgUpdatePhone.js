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
import PromptBox from '../components/PromptBox';

var DEFAULT_FREEZETIME= 60;
var countdown;
class PgUpdatePhone extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			phone: '',
      code:'',
			buttonColor:false,
			display:'none',
			errDisplay:'none',
			isSmsSent: true,
			display:'none',
			context:''
		};

	}
	_onChangePhone(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.code && v.length > 0) {
			this.setState({
				buttonColor:true,
				phone: v,

			})
		}else {
			this.setState({
				phone: v,
				buttonColor: false
			})
		}

	}
  _onChangeCode(e){
    e.preventDefault();
    var v = e.target.value.trim();
    if (this.state.phone && v.length > 0) {
      this.setState({
        buttonColor: true,
        code: v,

      })
    }else {
      this.setState({
        code: v,
        buttonColor: false
      })
    }

  }
	_onClick_btnSendCode(re){//获取验证码

		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getVerifyCode',
			userName: this.state.phone,
			type:'update_phone'
		})

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
			}, 1000);
		}
	}
	_handleupdateAccountPhoneDone(re){
		console.log('_handleupdateAccountPhoneDone',re);
		if (re.err) {
			this.setState({
				display:'block',
				context: re.err
			})
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
			return false;
		}
		if (re && re.result) {
			var result = re.result || {}
			if (result.isSuccess) {
				this.setState({
					display:'block',
					context: '手机号修改成功'
				})
				countdown = setInterval(()=>{
						clearInterval(countdown);
						// this.setState({
						// 		display: 'none'
						// });
					window.history.back()
				}, 1500);
				return false;
			}
		}
	}
	_handlegetVerifyCodeDone(re){
		console.log('_handlegetVerifyCodeDone',re);
		if (re.err) {
			this.setState({
				display:'block',
				context: '该手机号已存在',
				isSmsSent: true,
				freezeTime: DEFAULT_FREEZETIME,
			})
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
			return false;
		}

	}

	_updateAccountPhone(){
		Dispatcher.dispatch({
			actionType: 'updateAccountPhone',
			phone: this.state.phone,
			verifyCode: this.state.code
		})
	}
	componentWillMount() {
		// Dispatcher.dispatch({//getUserAccountDone
		// 	actionType: 'getUserAccount'
		// })
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-修改绑定')
		this._getupdateAccountPhoneDone = EventCenter.on('updateAccountPhoneDone', this._handleupdateAccountPhoneDone.bind(this))
		this._getVerifyCodeDone = EventCenter.on('getVerifyCodeDone', this._handlegetVerifyCodeDone.bind(this))

	}
	componentWillUnmount() {
		this._getupdateAccountPhoneDone.remove()
		this._getVerifyCodeDone.remove()

	}
	render(){
		var content= {
			top:100,
			context:this.state.context,
			display:this.state.display,
		}
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.div}}>
          <img style={{marginLeft:12}} src={Dm.getUrl_img('/img/v2/icons/phone@2x.png')} height="15" width="19"/>
					<input style={{...styles.input}} value={this.state.phone} placeholder="手机号" onChange={this._onChangePhone.bind(this)}/>
        </div>
        <div style={{...styles.div}}>
					<div style={{float:'left'}}>
						<img style={{marginLeft:12}} src={Dm.getUrl_img('/img/v2/icons/phone@2x.png')} height="15" width="19"/>
					</div>
					<div style={{float:'left'}}>
						<input style={{...styles.input,width:(window.screen.width*0.85)-95}} value={this.state.code} placeholder="验证码" onChange={this._onChangeCode.bind(this)}/>
					</div>
						{//判断获取验证码状态
							this.state.isSmsSent ?
							<div style={{...styles.codeButton}} onClick={this._onClick_btnSendCode.bind(this)}>
								<span style={{fontSize:14,color:'#666666'}}>获取验证码</span>
							</div>
							:
							<div style={{...styles.codeButton}}>
								<span style={{fontSize:14,color:'#666666'}}>{this.state.freezeTime}秒</span>
							</div>
						}
        </div>
        <div style={{...styles.buttonDiv}}>
					{
						this.state.buttonColor ?
						<div onClick={this._updateAccountPhone.bind(this)} style={{...styles.button,backgroundColor:'#2196f3'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>提交绑定</span>
						</div>
						:
						<div style={{...styles.button,backgroundColor:'#d1d1d1'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>提交绑定</span>
						</div>
					}
        </div>
				<PromptBox {...content}/>
			</div>
		);
	}
}

var styles = {
  container:{
    backgroundColor:'#f4f4f4',
    height:'100%',
    width:'100%',
  },
  div:{
    height: '65px',
    width: '100%',
    backgroundColor:'#ffffff',
    lineHeight:4,
  },
  input:{
    width:window.screen.width*0.85,
		marginLeft: 12,
		border:0
  },
  buttonDiv:{
    width:'100%',
    height:50,
    textAlign:'center',
    marginTop:40,
  },
  button:{
    width:window.screen.width*0.8,
    height:45,
    textAlign:'center',
    lineHeight:2.5,
    borderRadius:2,
    marginLeft:35,
  },
	alertDiv:{
		position:'absolute',
		top:170,
		backgroundColor:'#626262',
		fontSize:15,
		color:'#ffffff',
		width:105,
		height:28,
		left: (window.screen.width-105)/2,
		textAlign:'center',
		borderRadius:4,
		lineHeight:2
	},
	errAlertDiv:{
		position:'absolute',
		top:170,
		backgroundColor:'#626262',
		fontSize:15,
		color:'#ffffff',
		width:180,
		height:28,
		left: (window.screen.width-180)/2,
		textAlign:'center',
		borderRadius:4,
		lineHeight:2
	},
	codeButton:{
		width: 90,
		height: 35,
		backgroundColor: '#E5E5E5',
		float: 'left',
		textAlign: 'center',
		marginTop: 12,
		lineHeight: 2,
		borderRadius: 2
	}
};
export default PgUpdatePhone;
