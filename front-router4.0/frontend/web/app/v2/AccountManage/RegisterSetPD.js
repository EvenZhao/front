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
const success_icon = 'success@2x';
const failure_icon = 'failure@2x.png';
const suc_widthOrheight = 42;
const failure_width = 22;
const failure_height = 23;

class RegisterSetPD extends React.Component {

  constructor(props) {
    super(props);

    this.new_pwd='';
    this.visible = false;

    this.state={
      //文本框类型
      input_type:'password',
      pwd_value:'',
      //复选框选中：1，未选中：0
      checked:0,
      isFocus:false,
      isSuccess:false,
      display:'none',
      isCompanyFocus: false,
      com_value:'',
      isCompanyAlert: 'none',
      alert_title: '',
      //弹框是否显示
      display:'none',
      //弹框提示信息
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
    }
  }

  componentWillMount() {

	}
	componentDidMount() {
    if(this.props.location.state && this.props.location.state.reg_type){
      reg_type = this.props.location.state.reg_type
    }
    this.e_RegisterAccount = EventCenter.on('RegisterAccountDone',this._handleRegisterAccountDone.bind(this));

    EventCenter.emit("SET_TITLE",'铂略财课-填写注册信息');

	}
	componentWillUnmount() {
    this.e_RegisterAccount.remove();
    clearInterval(countdown);

	}
  _handleRegisterAccountDone(re){
    console.log('_handleRegisterAccountDone===',re);
    if(re.err){
      this.setState({
        display:'block',
        alert_title: re.err,
        alert_icon:failure_icon,
        icon_width:failure_width,
        icon_height:failure_height,
        isDisabled:true,
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
        isDisabled:false,
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
      this.props.history.push({pathname: `${__rootDir}/RegisterInvitationCode`, query: null, hash: null, state: {point: re.user.invitePoint || 0}});
    }
  }
  render(){

    return(
      <div>
        <div style={{width:devWidth,height:52,position:'relative',}}>
          <span style={{fontSize:14,color:'#000000',position:'relative',left:20,top:15}}>手机验证通过，请填写注册信息</span>
        </div>
        <div style={{...styles.pwd_box}}>
          <img src={Dm.getUrl_img('/img/v2/pgCenter/company@2x.png')} style={{width:13,height:13,}} />
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
        <div style={{width:devWidth-24,height:1,backgroundColor:'#f3f3f3',marginLeft:12}}></div>
        <div style={{...styles.pwd_box}}>
          <img src={Dm.getUrl_img('/img/v2/pgCenter/password@2x.png')} style={{width:11,height:14,}} />
          <input style={{...styles.input_box}} type={this.state.input_type} placeholder="设置密码" value={this.state.pwd_value}
          onChange={this._onChangePwd.bind(this)} ref={(input)=>{this.input=input}} onFocus={this.inputOnFocus.bind(this)} />
        {
          this.state.isFocus?
            <div>
              <div style={{...styles.visible_pwd}} onClick={this._visible_pwd.bind(this)}>
              {this.visible ?
                <img src={Dm.getUrl_img('/img/v2/icons/visible@2x.png')} style={{width:16,height:11,}} />
                :
                <img src={Dm.getUrl_img('/img/v2/icons/invisible@2x.png')} style={{width:16,height:15,}} />
              }
              </div>
              <div style={{...styles.clear}} onClick={this._clearPassword.bind(this)}>
                <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
              </div>
            </div>
            :
            null
        }

        </div>
        <div style={{width:devWidth-32,marginLeft:16,marginTop:6}}>
          <span style={{fontSize:13,color:'#999999'}}>*6-16位密码，包含数字，字母，或符号中的两种</span>
        </div>
        <div style={{textAlign:'center',marginTop:15,}}>
          <button style={{...styles.btn_ver}} onClick={this.btn_Ok.bind(this)}>注册</button>
        </div>

        {/*弹框*/}
         <div style={{...styles.companyAlert,display:this.state.isCompanyAlert}}>
           <span style={{fontSize:14,color:'#FFFFFF'}}>{this.state.alert_title}</span>
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
    })
  }
  isCompanyFocus(){
    this.setState({
      isCompanyFocus:true,
    })
  }

  //文本框输入密码的value被改变
  _onChangePwd(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      pwd_value:val,
    });
  }
  //文本框输入密码的value被改变
  _onChangeCMP(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      com_value:val,
    });
  }


  //提交设置的新密码
  btn_Ok(){

    this.setState({
       isFocus:false,
    });
    var mobile,verifyCode;
    if(this.props.location.state && this.props.location.state.mobile){
      mobile = this.props.location.state.mobile;
    }
    if(this.props.location.state && this.props.location.state.verifyCode){
      verifyCode = this.props.location.state.verifyCode;
    }
    if (this.state.com_value =='') {
      this.setState({
        isCompanyAlert: 'block',
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              isCompanyAlert:'none',
              alert_title:'公司名称不能为空'
            })
        }.bind(this), 1500);
      })
      return false
    }
    if (this.state.pwd_value =='' || !isPasswordAvailable(this.state.pwd_value)) {
      this.setState({
        isCompanyAlert: 'block',
        alert_title:'密码不合法'
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              isCompanyAlert:'none',
            })
        }.bind(this), 1500);
      })
      return false
    }
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
    }else {
      //发送请求，修改密码
      Dispatcher.dispatch({
        actionType: 'RegisterAccount',
        mobile:mobile,
        verify_Code:verifyCode,
        pwd:this.state.pwd_value,
        company: this.state.com_value,
      });
    }

  }


  _visible_pwd(){
    this.input.focus();
    this.visible = !this.visible
    if(this.visible){
      this.setState({
        input_type:'text',
      })
    }else {
      this.setState({
        input_type:'password',
      })
    }
    this.setState({
      isFocus:true,
    })
  }

  _clearPassword(){
    this.setState({
      pwd_value:'',
    })
  }
  _clearCompany(){
    this.setState({
      com_value:'',
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
    backgroundImage:'linear-gradient(-49deg,#27cfff 0%,#2aa6ff 100%)'
  },
  pwd_box:{
    width:window.screen.width,
    height:50,
    backgroundColor:Common.Bg_White,
    // borderBottomStyle:'solid',
    // borderTopWidth:1,
    // borderBottomWidth:1,
    // borderTopColor:'#E5E5E5',
    // borderBottomColor:'#E5E5E5',
    paddingLeft:12,
    paddingRight:12,
    // marginTop:20,
  },
  input_box:{
    border:'none',
    fontSize: Fnt_Medium,
    height:20,
    marginTop:8,
    paddingTop:5,
    paddingBottom:10,
    width:window.screen.width-60,
    marginLeft: 22
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
    width:16,
    height:14,
    right:45,
    top:119,
    zIndex:99,
  },
  clear:{
    position:'absolute',
    width:20,
    height:20,
    right:10,
    top:119,
    zIndex:99,
  },
  companyAlert:{
    height: 40,
    width: 240,
    backgroundColor: '#000000',
    opacity: 0.7,
    borderRadius:'2px',
    position:'absolute',
    top: (devHeight-40)/2,
    textAlign:'center',
    lineHeight:2.5,
    left: (devWidth-240)/2
  }

}

export default RegisterSetPD;
