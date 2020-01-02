
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import {dm} from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'
import VerifyType from '../VerifyType'
import QRCodeSignIn from '../components/QRCodeSignIn'

var countdown;
var timer;
class AccountLogin extends React.Component {

  constructor(props) {
    super(props);
    this.data = [isWeiXin ?'手机免密绑定':'手机免密登录',isWeiXin ? '账号密码绑定':'普通登录']
    this.state={
      quickLogin: true, //判断是够为快捷登录
      isSmsSent: true,//是否获取验证码
      freezeTime: 60,
      phone: '',
      password: '',
      verifyCode: '',
      visible: false,
      button: false, //按钮是否可以点击
      //弹框是否显示
      display:'none',
      //弹框提示信息
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
      loginShow:false,
      err:'',
      errCode:false,
      checkNum:0,
      yuYin: false,
      yuYinK: 'none',//语音提示框的状态
      token1:'',
      codeOrVoice:false,//默认为发送验证码，true：发送语音验证
    }
  }
  _handleReqVerifyCodeDone(re){
    if (re.err || !re.result) {
      this.setState({
        alert_title:re.err,
        display:'block',
        alert_icon:failure_icon,
        icon_width:failure_width,
        icon_height:failure_height,
      });
      countdown = setInterval(()=>{
          clearInterval(countdown);
          this.setState({
              display: 'none'
          });
      }, 1500);
      return false;
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
    }
    else{//发送短信验证
      //获取手机验证码倒计时
      this.setState({
        isSmsSent:false,
        freezeTime: 60,
      },()=>{
        timer = setInterval(()=>{
        if( this.state.freezeTime > 0 ){
          var count_num = this.state.freezeTime
          if (count_num == 30 && !this.state.yuYin) { //倒计时30秒的时候显示语音验证码
            this.setState({
              yuYin: true,
            })
          }
          this.setState({
            freezeTime: this.state.freezeTime - 1
          });
         } else {
          clearInterval(timer);
            this.setState({
              isSmsSent: true
            });
          }
        }, 1000);
     })
    }
  }
 
  componentDidMount() {
    if (isWeiXin) {
      EventCenter.emit("SET_TITLE",'铂略财课-绑定');
    }else {
      EventCenter.emit("SET_TITLE",'铂略财课-登录');
    }
    // this._getVerifyCode = EventCenter.on('getVerifyCodeDone', this._handleVerifyCode.bind(this))
    this._onQuickLoginDone = EventCenter.on('QuickLoginDone', this._handleQuickLoginDone.bind(this))
    this._onBindDone = EventCenter.on('BindDone', this._handleBindDone.bind(this))
    this.e_ReqVerifyCode = EventCenter.on('ReqVerifyCodeDone',this._handleReqVerifyCodeDone.bind(this));
  }

	componentWillUnmount() {
    // this._getVerifyCode.remove()
    this._onQuickLoginDone.remove()
    this._onBindDone.remove();
    this.e_ReqVerifyCode.remove()
    clearInterval(countdown);
    clearInterval(timer);

	}
  _handleBindDone(re){
    console.log('_handleBindDone',re);

    if (re.err) {
      if(re.errCode == 'ERR_BINDED'){
        this.setState({
          errCode:true,
          err:re.err,
        })
      }
      this.setState({
        alert_title:re.err,
        display:'block',
        alert_icon:failure_icon,
        icon_width:failure_width,
        icon_height:failure_height,
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
        this.props.history.push({pathname: `${__rootDir}/chooseAccount`, query: null, hash: null, state: {userName: this.state.phone, pw: this.state.password, code: null, moreAccount: re.result, type: 'login'} })
        return
      } else {

        localStorage.setItem("credentials.code", re.result.code);
        localStorage.setItem("credentials.openid", re.result.openid);

        if(!isWeiXin) dm.saveCredentials(re.result);
        // var url=`${__rootDir}/PgCenter`;
        if (re.result.firstLogin) {
          this.props.history.push({pathname:`${__rootDir}/newbieTaskIndex`, query: null, hash: null, state:null});
          return
        }
        if (loginType) {
          loginType = false
          this.props.history.push({pathname:`${__rootDir}/PgCenter`, query: null, hash: null, state:null});

        }else {
          this.props.history.go(-1);
        }
        if (re.result.changePasswordFlag) {
          EventCenter.emit('showChangePwdTips', re);
        }
      }

      //登录成功以后检索线下课是否有参课提醒
      Dispatcher.dispatch({
        actionType: 'OfflineCodeToday',
      })
    }
  }
  _handleQuickLoginDone(re){
    console.log('_handleQuickLoginDone',re);
    if (re.err) {
      this.setState({
        alert_title:re.err,
        display:'block',
        alert_icon:failure_icon,
        icon_width:failure_width,
        icon_height:failure_height,
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
        this.props.history.push({
          pathname: `${__rootDir}/chooseAccount`,
         state: 
          {
            userName: this.state.phone, 
            code: this.state.verifyCode, 
            pw: null, 
            moreAccount: re.result, 
            type: 'quickLogin'
            } 
          })
        return
      } else {
        if(re.result.needBind && re.result.needBind == true){
          //跳转到免密绑定账号页面
          this.props.history.push({
            pathname:`${__rootDir}/BindAccount`, 
          state:{
            verifyCode:this.state.verifyCode,
            phone:this.state.phone
            }
          });
          return;
        }
        localStorage.setItem("credentials.code", re.result.code);
        localStorage.setItem("credentials.openid", re.result.openid);

        if(!isWeiXin) dm.saveCredentials(re.result);
        // var url=`${__rootDir}/PgCenter`;
       
        this.props.history.go(-1);
        if (re.result.changePasswordFlag) {
          EventCenter.emit('showChangePwdTips', re);
        }
      }

    }
  }
  _handleVerifyCode(re) {
    console.log('_handleVerifyCode',re);
    if (re.err) {
      this.setState({
        alert_title:re.err,
        display:'block',
        alert_icon:failure_icon,
        icon_width:failure_width,
        icon_height:failure_height,
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
  //文本框输入密码的value被改变
  _onChangePhone(e){
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      phone:val,
    },()=>{
      this.checkButton()
    });
  }
  _onChangeCode(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      verifyCode :val,
    },()=>{
      this.checkButton()
    });
  }
  _onChangePassWord(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      password:val,
    },()=>{
      this.checkButton()
    });
  }
  checkButton(){
    if (this.state.quickLogin) {
      this.setState({
        button: (this.state.phone !== '' && this.state.verifyCode !== '') ? true : false
      })
    }else {
      this.setState({
        button: (this.state.phone !== '' && this.state.password !== '') ? true : false
      })
    }
  }
  _visible_pwd(){
    this.setState({
      visible: !this.state.visible
    })
  }
  ChangeQuickLogin(index){//切换普通登录还是快捷登录
    this.setState({
      checkNum:index,
    },()=>{
      if(index == 0){
        this.setState({
          quickLogin: true,
        })
      }
      else {
        this.setState({
          quickLogin: false,
        })
      }
    })

  }
  _clear(){
    this.setState({
      phone:'',
    })
  }
  _onClick_btnSendCode(){//获取验证码

    if(!isCellPhoneAvailable(this.state.phone)){
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
          codeOrVoice:false,
          token1:_token
        }, () => {
          Dispatcher.dispatch({
            actionType: 'ReqVerifyCode',
            type:_that.state.phone,
            verify_type:VerifyType.LOGIN_VERIFY,//快捷登录
            isVoice: false,
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
          // 验证成功， 进行登录操作
          this.setState({
            codeOrVoice:false,
            token1:_token
          }, () => {
            Dispatcher.dispatch({
              actionType: 'ReqVerifyCode',
              type:this.state.phone,
              verify_type:VerifyType.LOGIN_VERIFY,//快捷登录
              isVoice: false,
              token:this.state.token1,
            });
          })
        })
      })*/
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
      })
      countdown = setInterval(()=>{
          clearInterval(countdown);
          this.setState({
              display: 'none'
          });
      }, 1500);
      return false;
    }
    var _that = this;
    checkVaptCha(function(_token){
      Dispatcher.dispatch({
        actionType: 'ReqVerifyCode',
        type:_that.state.phone,
        verify_type: VerifyType.LOGIN_VERIFY,
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
          type:this.state.phone,
          verify_type: VerifyType.LOGIN_VERIFY,
          isVoice: true,
          token:vaptchaObj.getToken(),
        });
      });
    });*/ 
  }

  onSubmit(){
    if (!isCellPhoneAvailable(this.state.phone) && !isEmailAvailable(this.state.phone)) {
      this.setState({
        alert_title:'请输入正确的用户名格式',
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
    if (this.state.quickLogin) { //如果是快捷登录
      if (!this.state.verifyCode) {
        this.setState({
          alert_title:'验证码不能为空',
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
        }, 2000);
        return false
      }
      Dispatcher.dispatch({
        actionType: 'QuickLogin',
        userName: this.state.phone,
        verifyCode: this.state.verifyCode,
        uuid: null
      })
    }else {
      if (!this.state.password) {
        this.setState({
          alert_title:'密码不能为空',
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
        }, 2000);
        return false
      }
      Dispatcher.dispatch({
  			actionType: 'Bind',
  			userName: this.state.phone,
  			pw: this.state.password
  		})
    }
  }

_handleAl(){
  this.setState({
    loginShow:true,
  })
}
closeAlert(){
  this.setState({
    loginShow:false,
  })
}

  render(){

    var firstDiv = this.data.map((item,index)=>{
        var style = {//定义样式
          float:'left',
          width:devWidth/2,
          textAlign:'center',
          height:45,
          borderBottomStyle:'solid',
          borderBottomWidth:1,
          lineHeight:3,
          borderBottomColor: ((this.state.quickLogin && index ==0) || (!this.state.quickLogin && index ==1)) ? '#2196f3' : '#E1E1E1'
        }
        var fontColor = ((this.state.quickLogin && index ==0) || (!this.state.quickLogin && index ==1)) ? '#2196f3' : '#000000'
        return(
          <div key={index}>
            <div style={{...style}} onClick={this.ChangeQuickLogin.bind(this,index)}>
              <span style={{fontSize:16,color:fontColor}}>{item}</span>
            </div>
          </div>
        )
    })

    return(
      <div style={{...styles.div}}>
        <div style={{...styles.firstDiv}}>
          {firstDiv}
        </div>
        <div style={{...styles.secondDiv}}>
          <div style={{...styles.inputDiv}}>
            <div style={{float:'left',marginRight:10,marginTop:17}}>
              { //userName@2x
                this.state.quickLogin ?
                  <img src={Dm.getUrl_img('/img/v2/icons/phone_num@2x.png')} height="19" width="15" style={{width:15,height:19,}} />
                :
                <img src={Dm.getUrl_img('/img/v2/icons/userName@2x.png')} height="17" width="15" style={{width:15,height:19,}} />
              }
            </div>
            <div style={{position:'relative'}}>
              <input style={{width:devWidth-60,marginTop:16,border:'none',fontSize:16,}} onBlur={this.checkButton.bind(this)} onChange={this._onChangePhone.bind(this)} value={this.state.phone} placeholder={this.state.quickLogin ? '手机号':'邮箱或手机号'} type="text"/>
              <div style={{...styles.clear}} onClick={this._clear.bind(this)}>
                <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
              </div>
            </div>
          </div>
        {
          this.state.quickLogin ?
            <div style={{...styles.inputDiv}}>
              <img src={Dm.getUrl_img('/img/v2/icons/verification-code@2x.png')} height="15" width="19" style={{marginRight:10,position:'relative',top:12}} />
              <input onChange={this._onChangeCode.bind(this)} onBlur={this.checkButton.bind(this)} value={this.state.verifyCode} style={{width:devWidth-160,border:'none',fontSize:16,position:'relative',top:10}} placeholder="输入验证码" type="text" pattern="[0-9]*"/>
              {
                this.state.isSmsSent ?
                <div onClick={this._onClick_btnSendCode.bind(this)} style={{float:'right',width:90,height:35,backgroundColor:'#2196f3', borderRadius:'2px',textAlign:'center',marginTop:6,lineHeight:2}}>
                  <span style={{fontSize:14,color:'#fff',}}>
                     获取验证码
                  </span>
                </div>
                :
                <div style={{float:'right',width:90,height:35,backgroundColor:'#D1D1D1', borderRadius:'2px',textAlign:'center',marginTop:6,lineHeight:2}}>
                  <span style={{fontSize:14,color:'#fff',}}>
                     还剩{this.state.freezeTime}S
                  </span>
                </div>
              }
            </div>
          :
            <div style={{...styles.inputDiv}}>
              <div style={{float:'left',marginRight:10}}>
                <img src={Dm.getUrl_img('/img/v2/icons/password@2x.png')} style={{width:15,height:19,position:'relative',top:12}} />
              </div>
              <div>
                <input onChange={this._onChangePassWord.bind(this)} onBlur={this.checkButton.bind(this)} value={this.state.password}  type={this.state.visible ? 'text':'password'} style={{width:devWidth-80,border:'none',fontSize:16,position:'relative',top:10}} placeholder="密码"/>
                {this.state.visible ?
                  <img onClick={this._visible_pwd.bind(this)} src={Dm.getUrl_img('/img/v2/icons/visible@2x.png')} style={{width:16,height:11,position:'relative',top:14}} />
                  :
                  <img onClick={this._visible_pwd.bind(this)} src={Dm.getUrl_img('/img/v2/icons/invisible@2x.png')} style={{width:16,height:15,position:'relative',top:14}} />
                }
              </div>
            </div>
        }
        </div>
        {
          this.state.err && this.state.errCode ?
          <div style={{color:'#F37633',fontSize:12,marginLeft:16,marginTop:15}}>
            {this.state.err}<span style={{color:'#2196f3'}} onClick={this._handleAl.bind(this)}>不是自己绑定的？</span>
          </div>
          :
          null
        }

        <div style={{...styles.buttonDiv,backgroundColor: this.state.button ? '#2196f3' :'#D1D1D1'}} onClick={this.onSubmit.bind(this)}>
          <span style={{fontSize:18,color:'#FFFFFF'}}>{isWeiXin ? '绑定' :'登录'}</span>
        </div>
        {
          this.state.quickLogin ?
          <div style={{width:devWidth,marginTop:15}}>
            <div style={{float:'left',marginLeft:24}}>
              <Link to={`${__rootDir}/PhoneRegister`}>
                <span style={{fontSize:14,color:'#2196f3'}}>注册账号</span>
              </Link>
            </div>
            <div onClick={this.sendyuYinVerifyCode.bind(this)} style={{float:'right',marginRight:24,display: this.state.yuYin ? 'block' :'none'}}>
                <span style={{fontSize:14,color:'#2196f3'}}>点击获取语音验证码</span>
            </div>
          </div>
          :
          <div style={{width:devWidth,marginTop:15}}>
            <div style={{float:'left',marginLeft:24}}>
              <Link to={`${__rootDir}/PhoneRegister`}>
                <span style={{fontSize:14,color:'#2196f3'}}>注册账号</span>
              </Link>
            </div>
            <div style={{float:'right',marginRight:24}}>
              <Link to={`${__rootDir}/FindPassword`}>
                <span style={{fontSize:14,color:'#2196f3'}}>忘记密码</span>
              </Link>
            </div>
          </div>
        }
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
        <div style={{...styles.bind_alert,paddingTop:1,display:this.state.loginShow ? 'block':'none'}}>
          <div style={{fontSize:12,color:'#030303',marginLeft:12,marginTop:20,width:246,height:99}}>
          <div>一个铂略账号只能关联绑定一个微信账号。</div>
          您的铂略账号已关联绑定过其他微信账号，您可登录铂略PC官网或拨打铂略客服电话<span style={{color:'#2196F3'}}>(400-689-0679）</span>解除绑定。
          <div>解除绑定后，请再与当前微信账号进行绑定。</div>
          </div>
          <div style={{...styles.bottom}} onClick={this.closeAlert.bind(this)}>知道了</div>
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
    width:devWidth,
    height: devHeight,
    backgroundColor:'#f4f4f4',
    position:'fixed',
    top: 0,
    bottom: 0,
  },
  firstDiv:{
    width: devWidth,
    height:62,
  },
  secondDiv:{
    width:devWidth,
    height:100,
    backgroundColor:'#FFFFFF',

  },
  buttonDiv:{
    width:devWidth-32,
    marginLeft:16,
    height:45,
    textAlign:'center',
    marginTop:15,
    lineHeight:2.5,
    borderRadius:'4px'
  },
  inputDiv:{
    width:devWidth-24,
    height:50,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#f3f3f3',
    marginLeft:12
  },
  clear:{
    position:'absolute',
    width:20,
    height:20,
    right:10,
    top:15,
    zIndex:2,
  },
  bind_alert:{
    width:270,
    height:160,
    position:'absolute',
    zIndex:10,
    left:(devWidth-270)/2,
    top:(devHeight-160)/2,
    backgroundColor:'#fff',
    borderRadius:12,
  },
  bottom:{
    width:270,
    height:40,
    lineHeight:'40px',
    borderTopColor:'#f3f3f3',
    borderTopWidth:1,
    borderTopStyle:'solid',
    textAlign:'center',
    fontSize:17,
    color:'#0076FF',
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


export default AccountLogin;
