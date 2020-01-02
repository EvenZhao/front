import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
import VerifyType from '../VerifyType'
import funcs from '../util/funcs'

var countdown;

class bindEmail extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
			email: '',
			code: '',
			display:'none',
			//弹框提示信息
			alert_title:'',
			//弹框的图标
			alert_icon:'',
			icon_width:0,
			icon_height:0,
			freezeTime: 60,
			yuYin: false,
			isSmsSent: true,
			token1:'',//人机验证参数
		};

	}

  componentWillMount() {
		clearInterval(countdown);
  }

	componentDidMount() {
		this.e_ReqVerifyCode = EventCenter.on('ReqVerifyCodeDone',this._handleReqVerifyCodeDone.bind(this));
		this.e_ChkVerifyCode = EventCenter.on('ChkVerifyCodeDone',this._handleChkVerifyCodeDone.bind(this));

		EventCenter.emit("SET_TITLE",'铂略财课-验证电子邮箱');

	}
	componentWillUnmount() {
		this.e_ReqVerifyCode.remove()
		this.e_ChkVerifyCode.remove()
		clearInterval(countdown);
	}
	_handleChkVerifyCodeDone(re){
			console.log('_handleChkVerifyCodeDone',re);
		//提交验证码成功后，设置新密码
		if(re.err != null){
			//验证码不正确，重新发送验证码
				this.setState({
					display:'block',
					alert_title:'验证码不正确',
					alert_icon:failure_icon,
					icon_width:failure_width,
					icon_height:failure_height,
				},()=>{
					countdown = setInterval(()=>{
							clearInterval(countdown);
							this.setState({
								display:'none',
							})
					}, 1500);
				});
			return;
		}
		if (re.result) {
			//本地存储邮箱
			var bindInfo = {
				phoneOrEmail: this.state.email,
				code: this.state.code
			}
			localStorage.setItem("bindInfo", JSON.stringify(bindInfo));
			this.props.history.push(`${__rootDir}/perfectData`)
			/**

			*/
		}else {
			//验证码不正确，重新发送验证码
				this.setState({
					display:'block',
					alert_title:'验证码不正确',
					alert_icon:failure_icon,
					icon_width:failure_width,
					icon_height:failure_height,
				},()=>{
					countdown = setInterval(()=>{
							clearInterval(countdown);
							this.setState({
								display:'none',
							})
					}, 1500);
				});
			return;
		}
	}
  _handleReqVerifyCodeDone(re){
		console.log('_handleReqVerifyCodeDone',re);
    if(re.err != null && re.err !=''){
      this.setState({
          display:'block',
          alert_title:re.err,
          alert_icon:failure_icon,
          icon_width:failure_width,
          icon_height:failure_height,
					isSmsSent: true,
					freezeTime: 60,
        },()=>{
          countdown = setInterval(()=>{
              clearInterval(countdown);
              this.setState({
                display:'none',
              })
          }, 1500);
        });
        return;
    }

    if(re.result){
      // this.props.history.push({pathname:`${__rootDir}/SafetyVerification`, query: null, hash: null, state: {phoneOrEmail: this.state.user.phone,verifyType:VerifyType.UPDATE_PHONE_FIRST_STEP}});
    }
  }
	_clear(){
		this.setState({
			email:'',
		})
	}
	//文本框输入密码的value被改变
	_onChangePhone(e){
		e.preventDefault();
		var val = e.target.value.trim();
		this.setState({
			email:val,
		},()=>{

		});
	}
	_onChangeCode(e){
		e.preventDefault();
		var val = e.target.value.trim();
		this.setState({
			code:val,
		},()=>{

		});
	}
	checkCode(){
		// 4： 修改(绑定)手机第二步,验证验证码
		Dispatcher.dispatch({
				actionType: 'ChkVerifyCode',
				type:this.state.email,
				verify_type: VerifyType.UPDATE_EMAIL_SECOND_STEP,
				verify_code: this.state.code,
		});
	}
	_onClick_btnSendCode(){//获取验证码
		if(!isEmailAvailable(this.state.email)) {
			this.setState({
				alert_title:'请输入电子邮箱',
				display:'block',
				alert_icon:failure_icon,
				icon_width:failure_width,
				icon_height:failure_height,
			})
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
			return false;
		}
			if (this.state.isSmsSent) {
				var _that = this;
				checkVaptCha(function(_token){
					_that.setState({
						isSmsSent: false,
						freezeTime: 60,
						token1:_token,
					},()=>{
						//发送验证码，修改手机第一步(验证)
						Dispatcher.dispatch({
								actionType: 'ReqVerifyCode',
								type:_that.state.email,
								verify_type: VerifyType.UPDATE_EMAIL_SECOND_STEP,
								token:_that.state.token1,
						});
					})
				})
				/*vaptcha({
					vid: '5b7d16a1fc650e163c72b1c2', // 验证单元id
					type: 'invisible', // 显示类型 点击式
					// aiAnimation:false
				}).then((vaptchaObj)=> {
					vaptchaObj.validate();
					vaptchaObj.listen('pass',()=> {
						var _token = vaptchaObj.getToken();
						this.setState({
							isSmsSent: false,
							freezeTime: 60,
							token1:_token,
						},()=>{
							//发送验证码，修改手机第一步(验证)
							Dispatcher.dispatch({
									actionType: 'ReqVerifyCode',
									type:this.state.email,
									verify_type: VerifyType.UPDATE_EMAIL_SECOND_STEP,
									token:this.state.token1,
							});
						})
					});
				}); */

				countdown = setInterval(()=>{
						if( this.state.freezeTime > 0 ){
							var count_num = this.state.freezeTime
							this.setState({
								freezeTime: this.state.freezeTime - 1,
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
	render(){

    return(
			<div style={{...styles.div}}>
        <div style={{height:100,width:devWidth,backgroundColor:'#FFFFFF',marginTop:28}}>
					<div style={{position:'relative',width:devWidth}}>
	          <input style={{...styles.input_box}} type='text' placeholder="请输入电子邮箱" onChange={this._onChangePhone.bind(this)} value={this.state.email} />
						<div style={{...styles.clear}} onClick={this._clear.bind(this)}>
							<img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
						</div>
					</div>
					<div style={{...styles.line}}></div>
					<div style={{display:'flex',position:'relative'}}>
						<div>
							<input style={{...styles.input_box,width:devWidth-128}} type='text' placeholder="输入验证码" onChange={this._onChangeCode.bind(this)} value={this.state.code} />
						</div>
						{
							this.state.isSmsSent ?
							<div style={{...styles.buttom}} onClick={this._onClick_btnSendCode.bind(this)}>
								<span style={{...styles.buttomFont}}>获取验证码</span>
							</div>
							:
							<div style={{...styles.buttom}} >
								<span style={{fontSize:14,color:'#fff',}}>
									 还剩{this.state.freezeTime}S
								</span>
							</div>
						}

					</div>
        </div>
				{
					this.state.email && this.state.code ?
					<div style={{...styles.submit,backgroundColor:'#2196F3'}} onClick={this.checkCode.bind(this)}>
						<span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular'}}>提交验证</span>
					</div>
					:
					<div style={{...styles.submit}} >
						<span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular'}}>提交验证</span>
					</div>
				}

        {/*弹框*/}
				<div style={{display:this.state.display}}>
					<div style={{...Common.alertDiv,}}>
						<div style={{marginBottom:14,paddingTop:15,height:30,}}>
							<img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
						 </div>
					 </div>
					 <div style={{color:'#fff',position:'absolute',zIndex:1001,top:210,left:(window.screen.width-170)/2,width:190,textAlign:'center'}}>{this.state.alert_title}</div>
				</div>
			</div>
    )
  }


}

var styles = {
  div:{
    height: devHeight,
    width: devWidth,
    backgroundColor: '#f4f4f4',
    // overflowY: 'scroll',
    // overflowX: 'hidden',
  },
	input_box:{
    border:0,
    fontSize: Fnt_Medium,
    height:18,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:12,
    width:devWidth-46,
  },
	line:{
		width: devWidth-24,
		height: 0.5,
		backgroundColor: '#f3f3f3',
		marginLeft: 12,
	},
	buttom:{
		width:90,
		height:35,
		backgroundColor:'#2196F3',
		borderRadius:'2px',
		textAlign:'center',
		lineHeight: 2,
		position:'absolute',
		right:18,
		top:4
	},
	buttomFont:{
		fontSize: 14,
		color: '#FFFFFF',
		fontFamily: 'pingfangsc-regular',
		letterSpacing: '0',
	},
	submit:{
		width: devWidth-30,
		height: 45,
		marginLeft: 15,
		textAlign: 'center',
		lineHeight: 2.5,
		backgroundColor:'#D1D1D1',
		borderRadius:'4px',
		marginTop:43,
	},
	clear:{
		position:'absolute',
		width:20,
		height:20,
		right:10,
		top:15,
		zIndex:2,
	},
}

export default bindEmail;
