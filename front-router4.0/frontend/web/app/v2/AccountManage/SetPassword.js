/*
 * Author: JOyce
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'

var countdown;
var reg_type = ''
class SetPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      //文本框类型
      input_type:'password',
      pwd_value:'',
      isFocus:false,
      isDisabled:false,
      //密码是否可见
      isVisible:false,
      //弹框是否显示
      display:'none',
      //弹框提示信息
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
      isCompanyFocus: false,
      com_value:'',
    }
  }

  componentWillMount() {

	}
	componentDidMount() {
    if(this.props.location.state.reg_type){
      reg_type = this.props.location.state.reg_type
    }
    if(reg_type){
      EventCenter.emit("SET_TITLE",'铂略财课-注册绑定');
    }else {
      EventCenter.emit("SET_TITLE",'铂略财课-设置密码');
    }

    this.e_RegisterAccount = EventCenter.on('RegisterAccountDone',this._handleRegisterAccountDone.bind(this));
	}
	componentWillUnmount() {
    this.e_RegisterAccount.remove();
    clearInterval(countdown);
	}
  //文本框输入密码的value被改变
  _onChangeCMP(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      com_value:val,
    },()=>{
      this.check()
    });
  }
  _clearCompany(){
    this.setState({
      com_value:'',
    },()=>{
      this.check()
    })
  }
  isCompanyFocus(){
    this.setState({
      isCompanyFocus:true,
    },()=>{
      this.check()
    })
  }
  render(){

    return(
      <div>
        <div style={{marginTop:18,marginLeft:20,fontSize:12,color:'#666'}}>
          { reg_type ?
            <span>请设置账户登录密码。</span>
            :
            <span>安全验证通过，请设置密码。</span>
          }
        </div>
        <div style={{...styles.pwd_box,marginTop:20}}>
          <img src={Dm.getUrl_img('/img/v2/pgCenter/company@2x.png')} style={{width:13,height:13,float:'left',marginTop:15,marginLeft:17,}} />
          <input style={{...styles.input_box}} type='text' placeholder="输入公司名称" value={this.state.com_value}
          onChange={this._onChangeCMP.bind(this)} ref={(input)=>{this.input=input}} onFocus={this.isCompanyFocus.bind(this)} />
        {
          this.state.isCompanyFocus?
            <div>
              <div style={{...styles.clear,top:70}} onClick={this._clearCompany.bind(this)}>
                <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
              </div>
            </div>
            :
            null
        }
        </div>
        <div style={{...styles.pwd_box}}>
          <div style={{width:15,}}>
            <img src={Dm.getUrl_img('/img/v2/icons/password@2x.png')} style={{width:15,height:19,float:'left',marginTop:15,marginLeft:17,}}/>
          </div>
          <input style={{...styles.input_box}} type={this.state.input_type} placeholder="密码" value={this.state.pwd_value}
          onChange={this._onChangePwd.bind(this)} ref={(input)=>{this.input=input}} onFocus={this.inputOnFocus.bind(this)} />
         {
          this.state.isFocus?
            <div>
              <div style={{...styles.visible_pwd}} onClick={this._visible_pwd.bind(this)}>
              {this.state.isVisible ?
                <img src={Dm.getUrl_img('/img/v2/icons/visible@2x.png')} style={{width:16,height:11,}} />
                :
                <img src={Dm.getUrl_img('/img/v2/icons/invisible@2x.png')} style={{width:16,height:15,}} />
              }
              </div>
              <div style={{...styles.clear}} onClick={this._clear.bind(this)}>
                <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
              </div>
            </div>
            :
            null
          }
        </div>
        <div style={{fontSize:Fnt_Small+1,color:'#666',marginTop:9,marginLeft:16,}}><span>*6-16位密码，包含数字、字母、或符号中的两种</span></div>
        <div style={{textAlign:'center',marginTop:15,}}>
        {
          this.state.isDisabled ?
          <button style={{...styles.btn_ver}} onClick={this.btn_Ok.bind(this)} disabled={false}>确定</button>
          :
          <button style={{...styles.btn_ver,backgroundColor:'#D1D1D1',}} disabled={true}>确定</button>
        }
        </div>

        {/*弹框*/}
        <div style={{...Common.alertDiv,display:this.state.display}}>
          <div style={{marginBottom:14,paddingTop:15,height:30,}}>
            <img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
           </div>
           <span style={{color:Common.BG_White}}>{this.state.alert_title}</span>
         </div>
      </div>
    )
  }

  inputOnFocus(){
    this.setState({
      isFocus:true,
    },()=>{
      this.check()
    })
  }

  //文本框输入密码的value被改变
  _onChangePwd(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      pwd_value:val,
      // isDisabled:true,
    },()=>{
      this.check()
    });
  }
  //提交设置密码
  btn_Ok(){
    this.setState({
       isFocus:false,
    });
    // console.log('isPasswordAvailable(this.state.pwd_value)',isPasswordAvailable(this.state.pwd_value));
    //验证密码是否合法
    if (this.state.pwd_value =='' || !isPasswordAvailable(this.state.pwd_value)){
      //提示框
      this.setState({
        display:'block',
        alert_title:'密码不合法',
        alert_icon:failure_icon,
        icon_width:failure_width,
        icon_height:failure_height,
        // isDisabled:true,
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              display:'none',
            })
        }.bind(this), 1500);
      });
      return;
    }

    var mobile,verifyCode;
    if(this.props.location.state.mobile){
      mobile = this.props.location.state.mobile;
    }
    if(this.props.location.state.verifyCode){
      verifyCode = this.props.location.state.verifyCode;
    }
    console.log('verifyCode==',verifyCode);
    //发送请求
    if(reg_type){
      console.log('reg_type==',reg_type);
      Dispatcher.dispatch({
        actionType: 'RegisterAccount',
        mobile:mobile,
        verify_Code:verifyCode,
        pwd:this.state.pwd_value,
        isQuick:true,//是否注册并绑定手机号
        company: this.state.com_value,
      });
    }
    else {
      Dispatcher.dispatch({
        actionType: 'RegisterAccount',
        mobile:mobile,
        verify_Code:verifyCode,
        pwd:this.state.pwd_value,
        company: this.state.com_value,
      });
    }

  }
  check(){
    if (this.state.pwd_value && this.state.com_value) {
      this.setState({
        isDisabled: true
      })
    }else {
      this.setState({
        isDisabled: false
      })
    }
  }
  _handleRegisterAccountDone(re){
    console.log('_handleRegisterAccountDone===',re);
    if(re.err){
      this.setState({
        display:'block',
        alert_title:'账号注册失败',
        alert_icon:failure_icon,
        icon_width:failure_width,
        icon_height:failure_height,
        // isDisabled:true,
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              display:'none',
            })
        }.bind(this), 1500);
      });
      return;
    }

    if(re.result){
      localStorage.setItem("credentials.code", re.result.code);
      localStorage.setItem("credentials.openid", re.result.openid);
      this.setState({
        display:'block',
        alert_title:'账号注册成功',
        alert_icon:success_icon,
        icon_width:suc_widthOrheight,
        icon_height:suc_widthOrheight,
        // isDisabled:false,
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              display:'none',
            })
        }.bind(this), 1500);
      });
      //跳转邀请码
      loginType = true
      this.props.history.push({pathname: `${__rootDir}/InvitationCode`, query: null, hash: null, state: {point: re.user.point || 0}});
    }
  }

  _visible_pwd(){
    this.input.focus();
    console.log('this.input',this.input);
    if(this.state.isVisible){
      this.setState({
        isVisible:false,
        input_type:'password',
      })
    }else {
      this.setState({
        isVisible:true,
        input_type:'text',
      })
    }
    this.setState({
      isFocus:true,
    })
  }

  _clear(){
    this.setState({
      pwd_value:'',
      // isDisable:true,
    },()=>{
      this.check()
    })
  }

}

var styles={ 
  btn_ver:{
    backgroundColor:Common.Activity_Text,
    textAlign:'center',
    fontSize:Fnt_Large,
    color:Common.Bg_White,
    width:345,
    height:45,
    lineHeight:'45px',
    borderRadius:4,
    border:0,
  },
  pwd_box:{
    width:window.screen.width,
    height:50,
    backgroundColor:Common.Bg_White,
    borderBottomStyle:'solid',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderTopColor:'#E5E5E5',
    borderBottomColor:'#E5E5E5',
    paddingRight:12,
    // marginTop:20,
  },
  input_box:{
    border:0,
    border:'none',
    fontSize: Fnt_Medium,
    height:20,
    marginTop:10,
    paddingTop:5,
    paddingBottom:5,
    marginLeft:12,
    width:window.screen.width-135,
    flot:'left',
  },
  timePng:{
    width:14,
    height:14,
  },
  span_text:{
    color:'#4A4A4A',
    fontSize:Fnt_Normal,
    marginLeft:8,
    marginTop:20,
  },
  visible_pwd:{
    position:'absolute',
    width:32,
    height:30,
    right:55,
    top:122,
  },
  clear:{
    position:'absolute',
    width:20,
    height:20,
    right:10,
    top:70,
  }

}

export default SetPassword;
