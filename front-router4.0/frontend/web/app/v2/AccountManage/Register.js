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
class Register extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      phoneNumber:'',
      isDisable:true,
      //弹框是否显示
      display:'none',
      //弹框提示信息
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
      agree: true
    }
  }

  componentWillMount() {

	}
	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-验证手机号');
    this.e_ReqVerifyCode = EventCenter.on('ReqVerifyCodeDone',this._handleReqVerifyCodeDone.bind(this));
	}
	componentWillUnmount() {
    clearInterval(countdown);
    this.e_ReqVerifyCode.remove();
	}
  changeAgree(){
    this.setState({
      agree: !this.state.agree
    })
  }
  gotoServiceProtocol(){
    this.props.history.push({pathname:`${__rootDir}/about/service-protocol`,query:null,hash:null,state:{}});
  }
  render(){

    return(
      <div>
        <div style={{...styles.pwd_box}}>
        <div>
          <img src={Dm.getUrl_img('/img/v2/icons/phone_num@2x.png')} style={{width:15,height:19,float:'left',marginTop:16,marginLeft:17,}} />
        </div>
          <input style={{...styles.input_box}} type='text' placeholder="请输入有效手机号" onChange={this._onChangePhoneNumber.bind(this)} value={this.state.phoneNumber} />

          <div style={{...styles.clear}} onClick={this._clear.bind(this)}>
            <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:40,}}>
          {
            !this.state.agree ||  this.state.isDisable   ?
            <button style={{...styles.btn_ver,backgroundColor:'#D1D1D1',}}>下一步</button>
            :
            <button style={{...styles.btn_ver,backgroundImage:'linear-gradient(-49deg,#27cfff 0%,#2aa6ff 100%)'}} onClick={this.btn_Ok.bind(this)}>下一步</button>
          }
        </div>
        {
          <div style={{marginTop:17,}}>
            {
              this.state.agree ?
              <img onClick={this.changeAgree.bind(this)} src={Dm.getUrl_img('/img/v2/pgCenter/agree@2x.png')} style={{width:12,height:12,marginLeft:17,}} />
              :
              <img onClick={this.changeAgree.bind(this)} src={Dm.getUrl_img('/img/v2/pgCenter/noAgree@2x.png')} style={{width:12,height:12,marginLeft:17,}} />

            }
            <span style={{fontSize:12,color:'#BDBDBD',marginLeft:10}}>我已阅读并同意</span>
            <span onClick={this.gotoServiceProtocol.bind(this)} style={{fontSize:12,color:'#2196f3'}}>《铂略服务协议》</span>
          </div>
        }

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
  _onChangePhoneNumber(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      phoneNumber:val,
      isDisable:false,
    });
  }
  //输入手机号发送验证码
  btn_Ok(){
    //验证手机号
    if (this.state.phoneNumber == '' || !isCellPhoneAvailable(this.state.phoneNumber)){
      //提示框
      this.setState({
          display:'block',
          alert_title:'手机号不正确',
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
    var _that = this;
    checkVaptCha(function(_token){
      Dispatcher.dispatch({
        actionType: 'ReqVerifyCode',
        type:_that.state.phoneNumber,
        verify_type:VerifyType.REGISTER_VERIFY,
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
        // 验证成功， 发送验证码
        //发送请求
        Dispatcher.dispatch({
          actionType: 'ReqVerifyCode',
          type:this.state.phoneNumber,
          verify_type:VerifyType.REGISTER_VERIFY,
          token:vaptchaObj.getToken()
        });
      });
    });*/
  }

  _handleReqVerifyCodeDone(re){
    console.log("_handleReqVerifyCodeDone:",re)
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
      this.props.history.push({pathname:`${__rootDir}/SafetyVerification`,query:null,hash:null,state:{phoneOrEmail:this.state.phoneNumber,verifyType:VerifyType.REGISTER_VERIFY}});
    }
  }

  _clear(){
    this.setState({
      phoneNumber:'',
      isDisable:true,
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

export default Register;
