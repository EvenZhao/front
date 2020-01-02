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
import VerifyType from '../VerifyType'

var countdown;
class FindPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      phoneOrEmail:'',
      isDisable:true,
      //弹框是否显示
      display:'none',
      //弹框提示信息
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
    }
  }

  componentWillMount() {

	}
	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-找回密码');
    this.e_ReqVerifyCode = EventCenter.on('ReqVerifyCodeDone',this._handleReqVerifyCodeDone.bind(this));
  }
	componentWillUnmount() {
    this.e_ReqVerifyCode.remove();
    clearInterval(countdown);
	}

  render(){

    return(
      <div>
        <div style={{...styles.pwd_box}}>
        <div>
          <img src={Dm.getUrl_img('/img/v2/icons/personal@2x.png')} style={{width:15,height:17,float:'left',marginTop:16,marginLeft:17,}} />
        </div>
          <input style={{...styles.input_box}} type='text' placeholder="邮箱或手机号" onChange={this._onChangephoneOrEmail.bind(this)} value={this.state.phoneOrEmail} />

          <div style={{...styles.clear}} onClick={this._clear.bind(this)}>
            <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:40,}}>
          {
            this.state.isDisable ?
            <button style={{...styles.btn_ver,backgroundColor:'#D1D1D1',}}>下一步</button>
            :
            <button style={{...styles.btn_ver}} onClick={this.btn_Ok.bind(this)}>下一步</button>
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

  //文本框输入密码的value被改变
  _onChangephoneOrEmail(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      phoneOrEmail:val,
      isDisable:false,
    });
  }
  //输入手机号发送验证码
  btn_Ok(){
    //验证手机号
    if(this.state.phoneOrEmail == ''){
      this.setState({
          display:'block',
          alert_title:'请输入手机号或者邮箱',
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
        return false;
    }
    var _that = this;
    checkVaptCha(function(_token){
        _that._checkPhoneOrEmail(_that.state.phoneOrEmail, _token);
    })
    /*vaptcha({
      vid: '5b7d16a1fc650e163c72b1c2', // 验证单元id
      type: 'invisible', // 显示类型 点击式
      // aiAnimation:false
    }).then((vaptchaObj)=> {
      vaptchaObj.validate();
      vaptchaObj.listen('pass',()=> {
        this._checkPhoneOrEmail(this.state.phoneOrEmail, vaptchaObj.getToken());
      });
    }); */
  }

  _handleReqVerifyCodeDone(re){
    if(re.err != null && re.err !=''){
      this.setState({
          display:'block',
          alert_title:re.err,
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

    if(re.result){
      this.props.history.push({pathname:`${__rootDir}/SafetyVerification`,query:null,hash:null,state:{phoneOrEmail:this.state.phoneOrEmail,verifyType:VerifyType.UPDATE_PWD_VERIFY,type:'FgtPassword'}});
    }
  }

  _clear(){
    this.setState({
      phoneOrEmail:'',
      isDisable:true,
    })
  }

  _checkPhoneOrEmail(val, token) {
    if (isEmailAvailable(val) || isCellPhoneAvailable(val)) {
      //发送请求
      Dispatcher.dispatch({
        actionType: 'ReqVerifyCode',
        type:this.state.phoneOrEmail,
        verify_type:VerifyType.UPDATE_PWD_VERIFY,
        token:token,
      });

      return true;
    }

    this.setState({
        display:'block',
        alert_title:'请输入合法的手机号或者邮箱',
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
    return false;
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
    border:'none',
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
    marginTop:20,
  },
  input_box:{
    border:0,
    fontSize: Fnt_Medium,
    height:20,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:12,
    width:window.screen.width-76,
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
    top:75,
  },
  clear:{
    float:'right',
    width:20,
    height:20,
    marginRight:'10px',
    marginTop:16,
  }
}

export default FindPassword;
