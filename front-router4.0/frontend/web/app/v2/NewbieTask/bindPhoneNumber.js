import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import funcs from '../util/funcs'
import Common from '../Common';
import VerifyType from '../VerifyType'

var countdown;
var timer;
class bindPhone extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
			phoneNumber: '',
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
			yuYinK: 'none',//语音提示框的状态
			isSmsSent: true,
			isButtom: false,
			token1:'',//人机验证参数
			codeOrVoice:false,//默认为发送验证码，true：发送语音验证
		};
	}

  componentWillMount() {

  }

	componentDidMount() {
		this.e_ReqVerifyCode = EventCenter.on('ReqVerifyCodeDone',this._handleReqVerifyCodeDone.bind(this));
		this.e_ChkVerifyCode = EventCenter.on('ChkVerifyCodeDone',this._handleChkVerifyCodeDone.bind(this));

		EventCenter.emit("SET_TITLE",'铂略财课-绑定手机号');

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
			//本地存储手机号
			var bindInfo = {
				phoneNumber: this.state.phoneNumber,
				code: this.state.code
			}
			localStorage.setItem("bindInfo", JSON.stringify(bindInfo));
			this.props.history.push(`${__rootDir}/perfectData`)
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
		if(this.state.codeOrVoice){//语音验证
			this.setState({
        yuYinK:'block',
      },()=>{
        clearInterval(countdown);
        countdown = setInterval(()=>{
            clearInterval(countdown);
            this.setState({
              yuYinK: 'none'
            });
        }, 1500);
      })
		}else{//获取短信验证码倒计时
			this.setState({
				isSmsSent: false,
				freezeTime: 60,
			},()=>{
				timer = setInterval(()=>{
					if( this.state.freezeTime > 0 ){
						var count_num = this.state.freezeTime
						if (count_num == 30 && !this.state.yuYin) { //倒计时30秒的时候显示语音验证码
							this.setState({
								yuYin: true
							})
						}
						this.setState({
							freezeTime: this.state.freezeTime - 1,
						});
					} else {
						clearInterval(timer);
						this.setState({
							isSmsSent: true
						});
					}
				}, 1500);
			})
		}
  }
	_clear(){
		this.setState({
			phoneNumber:'',
		})
	}
	checkInput(){
		if (this.state.phoneNumber && this.state.code) {
			this.setState({
				isButtom: true
			})
		}else {
			this.setState({
				isButtom: false
			})
		}
	}
	//文本框输入密码的value被改变
	_onChangePhone(e){
		e.preventDefault();
		var val = e.target.value.trim();
		this.setState({
			phoneNumber:val,
		},()=>{
			this.checkInput()
		});
	}
	_onChangeCode(e){
		e.preventDefault();
		var val = e.target.value.trim();
		this.setState({
			code:val,
		},()=>{
			this.checkInput()
		});
	}
	checkCode(){
		// 4： 修改(绑定)手机第二步,验证验证码
		Dispatcher.dispatch({
				actionType: 'ChkVerifyCode',
				type:this.state.phoneNumber,
				verify_type: VerifyType.UPDATE_PHONE_SECOND_STEP,
				verify_code: this.state.code,
		});
	}
	_onClick_btnSendCode(){//获取验证码
		this.setState({
			codeOrVoice:false
		})
		if(!isCellPhoneAvailable(this.state.phoneNumber)) {
			this.setState({
				alert_title:'请输入正确的手机格式',
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
			return false
		}
			if (this.state.isSmsSent) {
				var _that = this;
				checkVaptCha(function(_token){
					_that.setState({
						token1:_token,
					},()=>{
						//发送验证码，修改手机第一步(验证)
						Dispatcher.dispatch({
							actionType: 'ReqVerifyCode',
							type:_that.state.phoneNumber,
							verify_type: VerifyType.UPDATE_PHONE_SECOND_STEP,
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
							token1:_token,
						},()=>{
							//发送验证码，修改手机第一步(验证)
							Dispatcher.dispatch({
									actionType: 'ReqVerifyCode',
									type:this.state.phoneNumber,
									verify_type: VerifyType.UPDATE_PHONE_SECOND_STEP,
									token:this.state.token1,
							});
						})
					});
				}); */

			}
		}

	
		sendyuYinVerifyCode(){
			this.setState({
				codeOrVoice:true,
			})
			if(!isCellPhoneAvailable(this.state.phone)){
				this.setState({
					alert_title:'请输入正确的手机格式',
					display:'block',
					alert_icon:failure_icon,
					icon_width:failure_width,
					icon_height:failure_height,
					isFirst:false,
				})
				countdown = setInterval(()=>{
						clearInterval(countdown);
						this.setState({
								display: 'none'
						});
				}, 1500);
				return false
			}
			var _that = this;
			checkVaptCha(function(_token){
				Dispatcher.dispatch({
					actionType: 'ReqVerifyCode',
					type:_that.state.phoneNumber,
					verify_type: VerifyType.UPDATE_PHONE_SECOND_STEP,
					isVoice: true,
					token:_token
				});
			})
			/*vaptcha({
				vid: '5b7d16a1fc650e163c72b1c2', // 验证单元id
				type: 'invisible', // 显示类型 点击式
				// aiAnimation:false
			}).then((vaptchaObj)=> {
				vaptchaObj.validate();
				vaptchaObj.listen('pass',()=> {
					Dispatcher.dispatch({
						actionType: 'ReqVerifyCode',
						type:this.state.phoneNumber,
						verify_type: VerifyType.UPDATE_PHONE_SECOND_STEP,
						isVoice: true,
						token:vaptchaObj.getToken(),
					});
				});
			});*/ 
		}

	render(){

    return(
			<div style={{...styles.div}}>
        <div style={{height:100,width:devWidth,backgroundColor:'#FFFFFF',marginTop:28}}>
					<div style={{position:'relative',width:devWidth}}>
	          <input style={{...styles.input_box}} type='number' placeholder="手机号" onChange={this._onChangePhone.bind(this)} value={this.state.phoneNumber} />
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
					this.state.isButtom ?
					<div style={{...styles.submit,backgroundColor:'#2196F3'}} onClick={this.checkCode.bind(this)}>
						<span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular'}}>提交绑定</span>
					</div>
					:
					<div style={{...styles.submit}}>
						<span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular'}}>提交绑定</span>
					</div>
				}
				<div onClick={this.sendyuYinVerifyCode.bind(this)} style={{marginLeft:24,marginTop:10, display: this.state.yuYin ? 'block' :'none'}}>
          <span style={{fontSize:14,color:'#2196f3'}}>点击获取语音验证码</span>
        </div>

				 {/* 弹框提示语音验证已发出*/}
				 <div style={{...styles.yuyin,textAlign:'center',display:this.state.yuYinK}}>
          <div style={{lineHeight:1.3}}>
            <div style={{marginTop:13}}>
              <span style={{fontSize:18,color:'#ffffff',fontFamily:' PingFang SC Regular'}}>语音验证电话拨打中...</span>
            </div>
            <div>
              <span style={{fontSize:18,color:'#ffffff',fontFamily:' PingFang SC Regular'}}>请保持手机畅通</span>
            </div>
          </div>
        </div>

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
	yuyin:{
    width: 240,
    height: 66,
    backgroundColor:'#000000',
    borderRadius:'2px',
    opacity:0.7,
    position:'absolute',
    top: (window.innerHeight - 66)/2-70,
    left:(window.screen.width - 240)/2
  }
}

export default bindPhone;
