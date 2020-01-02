
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
import ResultAlert from '../components/ResultAlert'


var verifyCode = '';
var phone = '';
var countdown;
class BindAccount extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      email:'',
      password:'',
      isDisabled:false,
      visible:false,
      errCode:'',//根据返回错误信息判断显示相应弹框
      promptText:'',//提示信息
      first_show:false,
      second_show:false,
      //弹框提示信息
      alert_display:'none',
      alert_title:'',
      isShow:false,
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
    }
    phone = this.props.location.state.phone;

  }

  componentWillMount() {

	}
  componentDidMount() {

      EventCenter.emit("SET_TITLE",'铂略财课-绑定账号');
      //验证码
      if(this.props && this.props.location.state.verifyCode){
        verifyCode = this.props.location.state.verifyCode;
      }
      this.e_LoginBindPhone = EventCenter.on('LoginBindPhoneDone',this._handleLoginBindPhone.bind(this))
  }
	componentWillUnmount() {
    this.e_LoginBindPhone.remove()
	}

  _onChangeEmail(e){
    e.preventDefault();
    var val = e.target.value.trim();
    this.setState({
      email:val,
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
    if(this.state.email != '' && this.state.password !== ''){
      this.setState({
        isDisabled:true,
      })
    }else {
      this.setState({
        isDisabled:false,
      })
    }
  }
  _visible_pwd(){
    this.setState({
      visible: !this.state.visible
    })
  }
  _clear(text){//清空输入框
    if(text == 'email'){
      this.setState({
        email:'',
      })
    }else if(text == 'password') {
      this.setState({
        password:'',
      })
    }
  }
  //绑定账号
  _bindAccount(){
    if(this.state.email == '' || !isEmailAvailable(this.state.email)){

  			this.setState({
          alert_display:'block',
          alert_title:'请输入有效邮箱',
          isShow:false,
          errStatus:0,
        },()=>{
          countdown = setInterval(function(){
              clearInterval(countdown);
              this.setState({
                alert_display:'none',
              })
          }.bind(this), 1500);
        })
  			return false;
    }
    else if (this.state.password == '' || !isPasswordAvailable(this.state.password)) {
      this.setState({
        alert_display:'block',
        alert_title:'请输入有效密码',
        isShow:false,
        errStatus:0,
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              alert_display:'none',
            })
        }.bind(this), 1500);
      })
      return false;
    }

    Dispatcher.dispatch({
      actionType:'LoginBindPhone',
      phone: phone,
      email:this.state.email,
      verifyCode:verifyCode,
      password:this.state.password,
    })
  }

  _handleLoginBindPhone(re){
    console.log('_handleLoginBindPhone==',re);
    if(re.err){
      if(re.errCode){
        this.setState({
          errCode:re.errCode,
          promptText:re.err,
        })
      }
      this.setState({
        alert_display:'block',
        alert_title:re.err,
        isShow:false,
        errStatus:0,
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              alert_display:'none',
            })
        }.bind(this), 1500);
      })
      return false;
    }

    //绑定成功，跳转到个人中心
    localStorage.setItem("credentials.code", re.result.code);
    localStorage.setItem("credentials.openid", re.result.openid);
    if (re.result && re.result.firstLogin) {
      this.props.history.push({pathname:`${__rootDir}/newbieTaskIndex`, query: null, hash: null, state:null});
      return
    }
    this.props.history.push(`${__rootDir}/PgCenter`)
  }
  _prompt(){
    if(this.state.errCode == 'ERR_BINDED'){
      this.setState({
        second_show:true,
      })
    }else if (this.state.errCode == 'ERR_BINDED_PHONE') {
      this.setState({
        first_show:true,
      })
    }
  }
  _hidden(){
    this.setState({
      first_show:false,
      second_show:false,
    })
  }

  _register(){
    //需传参数 mobile,verifyCode,password,reg_type:区分注册绑定设置密码和注册设置密码
    this.props.history.push({pathname: `${__rootDir}/SetPassword`, query: null, hash: null, state: {mobile:phone, pwd: this.state.password,verifyCode:verifyCode,reg_type:'freePwd'} })
  }

  render(){
      let alertProps ={
        alert_display:this.state.alert_display,
        alert_title:this.state.alert_title,
        isShow:this.state.isShow,
        errStatus:this.state.errStatus
      }
      return(
        <div style={styles.container}>
        <ResultAlert {...alertProps}/>
        <div style={styles.text}>为了给您提供更好的服务，请绑定一个铂略账号</div>
        <div style={styles.secondDiv}>
          <div style={{...styles.inputDiv}}>
            <div style={{float:'left',marginRight:10,marginTop:17}}>
                <img src={Dm.getUrl_img('/img/v2/icons/userName@2x.png')} height="17" width="15" style={{width:15,height:19,}} />
            </div>
            <div style={{position:'relative'}}>
              <input style={{width:devWidth-60,marginTop:16,border:'none',fontSize:16,}} onBlur={this.checkButton.bind(this)} onChange={this._onChangeEmail.bind(this)} value={this.state.email} placeholder={'邮箱'} type="text"/>
              <div style={{...styles.clear}} onClick={this._clear.bind(this,'email')}>
                <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
              </div>
            </div>
          </div>
          <div style={{...styles.inputDiv,position:'relative'}}>
            <div style={{float:'left',marginRight:10}}>
              <img src={Dm.getUrl_img('/img/v2/icons/password@2x.png')} style={{width:15,height:19,position:'relative',top:12,}} />
            </div>
            <div>
              <input onChange={this._onChangePassWord.bind(this)} onBlur={this.checkButton.bind(this)} value={this.state.password}  type={this.state.visible ? 'text':'password'} style={{width:devWidth-80,border:'none',fontSize:16,position:'relative',top:10}} placeholder="密码"/>
              {this.state.visible ?
                <img onClick={this._visible_pwd.bind(this)} src={Dm.getUrl_img('/img/v2/icons/visible@2x.png')} style={{width:16,height:11,position:'relative',top:14,right:65}} />
                :
                <img onClick={this._visible_pwd.bind(this)} src={Dm.getUrl_img('/img/v2/icons/invisible@2x.png')} style={{width:16,height:15,position:'relative',top:14,right:65}} />
              }
              <div style={{...styles.clear}} onClick={this._clear.bind(this,'password')}>
                <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
              </div>
            </div>
          </div>
          <div style={{fontSize:Fnt_Small,marginTop:12,textAlign:'center',display:this.state.promptText ? 'block':'none'}}>
            <span style={{color:Common.orange}}>{this.state.promptText}</span>
            <span style={{color:Common.Activity_Text}} onClick={this._prompt.bind(this)}>不是自己绑定的？</span>
          </div>
          {this.state.isDisabled ?
            <div style={{...styles.buttonDiv,backgroundColor:'#2196f3'}} onClick={this._bindAccount.bind(this)}>
              <span style={{fontSize:18,color:'#FFFFFF'}}>绑定</span>
            </div>
            :
            <div style={{...styles.buttonDiv,backgroundColor:'#D1D1D1'}}>
              <span style={{fontSize:18,color:'#FFFFFF'}}>绑定</span>
            </div>
          }
          <div style={{textAlign:'center',marginTop:15,fontSize:Fnt_Normal,color:Common.Activity_Text}} onClick={this._register.bind(this)}>新注册用户绑定</div>
          </div>

          <div style={{...styles.bind_alert,display:this.state.first_show ? 'block':'none'}}>
            <div style={{fontSize:Fnt_Small,color:Common.Black,padding:'0 18px 8px 18px'}}>
            一个铂略账号只能关联绑定一个手机号码。
            您的铂略账号已关联绑定过其他手机账号，
            您可登录铂略PC官网或拨打铂略客服电话
            <span style={{color:Common.Activity_Text}}>(400-689-0679）</span>解除绑定。解除绑定后，
            请再与当前手机账号进行绑定。
            </div>
            <div style={styles.gotIt} onClick={this._hidden.bind(this)}>知道了</div>
          </div>
          <div style={{...styles.bind_alert,display:this.state.second_show ? 'block':'none'}}>
            <div style={{fontSize:Fnt_Small,color:Common.Black,padding:'0 18px 8px 18px'}}>
              <div>一个铂略账号只能关联绑定一个微信账号。</div>
              您的铂略账号已关联绑定过其他微信账号，您可登录铂略PC官网或拨打铂略客服电话<span style={{color:'#2196F3'}}>(400-689-0679）</span>解除绑定。
              解除绑定后，请再与当前微信账号进行绑定。
            </div>
            <div style={styles.gotIt} onClick={this._hidden.bind(this)}>知道了</div>
          </div>
          <div style={{...styles.msk,display:this.state.first_show || this.state.second_show ? 'block':'none'}} onClick={this._hidden.bind(this)}></div>
        </div>
      )
   }
 }

var styles = {
  container:{
    width:devWidth,
    height:devHeight,
  },
  text:{
    fontSize:Fnt_Normal,
    color:Common.Light_Black,
    textAlign:'center',
    height:42,
    lineHeight:'42px'
  },
  secondDiv:{
    width:devWidth,
    height:100,
    backgroundColor:'#FFFFFF',
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
  buttonDiv:{
    width:devWidth-32,
    marginLeft:16,
    height:45,
    textAlign:'center',
    marginTop:21,
    lineHeight:2.5,
    borderRadius:'4px'
  },
  bind_alert:{
    width:270,
    height:148,
    paddingTop:12,
    position:'absolute',
    zIndex:100,
    left:(devWidth-270)/2,
    top:devHeight/2-160,
    backgroundColor:'#fff',
    borderRadius:12,
  },
  gotIt:{
    fontSize:17,
    color:'#0076FF',
    textAlign:'center',
    height:40,
    lineHeight:'40px',
    borderTop:'solid 1px #eaeaea',
  },
  msk:{
    backgroundColor:Common.Black,
    opacity:0.2,
    width:devWidth,
    height:devHeight,
    position:'absolute',
    zIndex:99,
    top:0,
    left:0,
  }
}


export default BindAccount;
