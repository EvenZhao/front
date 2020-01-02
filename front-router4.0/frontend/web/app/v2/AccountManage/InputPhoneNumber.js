
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
class InputPhoneNumber extends React.Component {

  constructor(props) {
    super(props);
    this.verifyType = this.props.location.state.verify_type || '';
    this.isFirst = this.props.location.state.isFirst || false;
    this.initPwd = this.props.location.state.initPwd || '';
    //修改绑定手机第一步的时候获取到的验证码
    this.old_verfyCode = this.props.location.state.old_verfyCode || '';

    this.state={
      phoneNumber:'',
      //确定按钮默认不可点
      disabled:true,
      //弹框是否显示
      display:'none',
      //弹框提示信息
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
      placeholder_str:'',
    }
    this.str = this.props.location.state.str;
  }

  componentWillMount() {

	}
	componentDidMount() {

    if(this.str == '输入手机号'){
      EventCenter.emit("SET_TITLE",'铂略财课-输入手机号');
      this.setState({
        placeholder_str:'请输入有效手机号',
      })
    }
    else if (this.str == '输入新手机号') {
      EventCenter.emit("SET_TITLE",'铂略财课-输入新手机号');
      this.setState({
        placeholder_str:'请输入新手机号码',
      })
    }
    this.e_ReqVerifyCode = EventCenter.on('ReqVerifyCodeDone',this._handleReqVerifyCodeDone.bind(this));
	}
	componentWillUnmount() {
    // this.e_ReqVerifyCode.remove();
    clearInterval(countdown);
	}

  render(){
    return(
      <div>
        {
          this.str == '输入手机号' ?
          <div style={{marginTop:18,marginLeft:20,fontSize:12,color:'#666'}}>
            <span>安全验证通过，请输入您要绑定的手机号码。</span>
          </div>
          :
          null
        }
        {
          this.str == '输入新手机号' ?
          <div style={{marginTop:18,marginLeft:20,fontSize:12,color:'#666'}}>
            <span>您的安全验证已通过，请输入手机号。</span>
          </div>
          :
          null
        }

        <div style={{...styles.pwd_box}}>
          <input style={{...styles.input_box}} type='text' placeholder={this.state.placeholder_str} onChange={this._onChangePhoneNumber.bind(this)} value={this.state.phoneNumber} />

          <div style={{...styles.clear}} onClick={this._clear.bind(this)}>
            <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:40,}}>
        {
          this.state.disabled ?
          <button style={{...styles.btn_ver,backgroundColor:'#d1d1d1',}} disabled={true} >发送验证码</button>
          :
          <button style={{...styles.btn_ver}} disabled={false} onClick={this.sendVerifyCode.bind(this)}>发送验证码</button>
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
  _onChangePhoneNumber(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      phoneNumber:val,
      disabled:false,
    });
  }

  //输入手机号发送验证码
  sendVerifyCode(){
    //验证手机号
    if (!isCellPhoneAvailable(this.state.phoneNumber)){
      //提示框
      this.setState({
          display:'block',
          alert_title:'手机号不合法',
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

    if(this.state.placeholder_str == '输入新手机号'){

      var old_mobile = this.props.location.state.phoneOrEmail;

      if(this.state.phoneNumber == old_mobile){
        //提示框
        this.setState({
            display:'block',
            alert_title:'新手机号不能跟原来手机号一致',
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
    var _that = this;
    checkVaptCha(function(_token){
      //修改绑定手机号第二步
      Dispatcher.dispatch({
        actionType:'ReqVerifyCode',
        type:_that.state.phoneNumber,
        verify_type:VerifyType.UPDATE_PHONE_SECOND_STEP,
        token:_token
      })
    })
    /*vaptcha({
      vid: '5b7d16a1fc650e163c72b1c2', // 验证单元id
      type: 'invisible', // 显示类型 点击式
      // aiAnimation:false
    }).then((vaptchaObj)=> {
      vaptchaObj.validate();
      vaptchaObj.listen('pass',()=> {
        //验证成功， 发送验证码
          //修改绑定手机号第二步
          Dispatcher.dispatch({
            actionType:'ReqVerifyCode',
            type:this.state.phoneNumber,
            verify_type:VerifyType.UPDATE_PHONE_SECOND_STEP,
            token:vaptchaObj.getToken(),
          })
        
      });
    });*/
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
      //修改绑定手机号第二步
        this.props.history.push({
          pathname: `${__rootDir}/SafetyVerification`, 
          state: {
            type_str:'phone',
            phoneOrEmail: this.state.phoneNumber,
            old_verfyCode:this.old_verfyCode,
            verifyType:VerifyType.UPDATE_PHONE_SECOND_STEP,
            isFirst:this.isFirst,
            initPwd:this.initPwd,
            }
        });
    }
  }

  _clear(){
    this.setState({
      phoneNumber:'',
      disabled:true,
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
    paddingLeft:12,
    paddingRight:12,
    marginTop:20,
  },
  input_box:{
    border:0,
    fontSize: Fnt_Medium,
    height:20,
    paddingTop:15,
    paddingBottom:15,
    width:window.screen.width-24,
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
    position:'absolute',
    width:20,
    height:20,
    right:10,
    top:75,
  }

}

export default InputPhoneNumber;
