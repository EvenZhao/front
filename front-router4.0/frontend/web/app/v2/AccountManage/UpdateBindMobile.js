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
class UpdateBindMobile extends React.Component {

  constructor(props) {
    super(props);
    // this.verifyType = this.props.location.state.verifyType || '';
    // this.old_verfyCode = this.props.location.state.old_verfyCode ||'';

    // console.log('a-b-c old_verfyCode',this.old_verfyCode)

    this.state={
      user:{},
      isVisible:true,
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
    EventCenter.emit("SET_TITLE",'铂略财课-修改绑定手机号');
      Dispatcher.dispatch({
        actionType: 'getUserAccount',
      });
    
    this._getUserAccountDone = EventCenter.on('getUserAccountDone', this._handlegetUserAccountDone.bind(this));
    this.e_ReqVerifyCode = EventCenter.on('ReqVerifyCodeDone',this._handleReqVerifyCodeDone.bind(this));
	}
	componentWillUnmount() {
    this._getUserAccountDone.remove();
    this.e_ReqVerifyCode.remove();
    clearInterval(countdown);
	}

  render(){
    // //手机号
    // var tel = this.state.user.phone || '';
    // tel = tel.replaceAll('(\\d{3})\\d{4}(\\d{4})', '$1****$2');
    //手机号
    var tel = this.state.user.phone || '';
    tel = tel.replaceAll('(\\d{3})\\d*(\\d{4})', '$1****$2');

    //邮箱
    var email = this.state.user.email || '';
    //email = email.replaceAll(/(\w{1,2})(\w?)@(\w+)/, "$1****@$3")

    var position = email.indexOf("@");
    var str = email.substring(0,position);

    var char = email.substring(position,email.length);
    if(str.length >2){
      email = email.substring(0,2)+'****' + char ;
    }
    return(
      <div>
        <div style={{marginTop:18,textAlign:'center',fontSize:12,color:'#666'}}>
          <span>为了保证您的账号安全，修改绑定手机号前请先进行安全验证。</span>
        </div>
        {/*手机验证*/}
        { this.state.user.phone && this.state.isVisible ?
           <div style={{marginTop:30,textAlign:'center',}}>
             <div style={{textAlign:'center',}}>
               <span style={{fontSize: 24,color:Common.Black,}}>{tel} </span>
             </div>
           { this.state.user.email ?
             <div style={{marginLeft: (window.screen.width - 107)/2,width:107,height:26,borderColor:'#E1E1E1',borderWidth:1,backgroundColor:'#fff',}}>
               <div style={{float:'left',marginTop:2,marginLeft:8,height:26, lineHeight:'23px'}}>
                 <img src={Dm.getUrl_img('/img/v2/icons/icon_change@2x.png')} width={13} height={13}/>
               </div>
               <div style={{float:'left',fontSize:Fnt_Small,color:Common.gray,marginLeft:6,height:26,lineHeight:'26px',}} onClick={this.changeEmialVerify.bind(this)}>更换邮箱验证</div>
             </div>
             :
             null
           }
           </div>
           :
           <div style={{marginTop:30,textAlign:'center',}}>
             <div style={{textAlign:'center',}}>
               <span style={{fontSize: 24,color:Common.Black,}}>{email}</span>
             </div>
           {this.state.user.phone ?
             <div style={{marginLeft: (window.screen.width - 107)/2,width:107,height:26,borderColor:'#E1E1E1',borderWidth:1,backgroundColor:'#fff',}}>
               <div style={{float:'left',marginTop:2,marginLeft:8,height:26, lineHeight:'23px'}}>
                 <img src={Dm.getUrl_img('/img/v2/icons/icon_change@2x.png')} width={13} height={13}/>
               </div>
               <div style={{float:'left',fontSize:Fnt_Small,color:Common.gray,marginLeft:6,height:26,lineHeight:'26px',}} onClick={this.changePhoneVerify.bind(this)}>更换手机验证</div>
             </div>
             :
             null
            }
           </div>
          }
        <div style={{textAlign:'center',marginTop:40,}}>
          <button style={{...styles.btn_ver,width:window.screen.width-30}} onClick={this.sendVerCode.bind(this)}>发送验证码</button>
        </div>
        <div style={{fontSize:Fnt_Small,color:Common.Light_Gray,textAlign:'center',marginTop:16,}}>
          如您的验证方式都已无法使用，<Link to={`${__rootDir}/freeInvited`} style={{color:Common.Activity_Text,fontSize:Fnt_Small,}}>请点此申诉</Link>，成功后可更换。
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

  _handlegetUserAccountDone(re){
    console.log('_handlegetUserAccountDone===',re);
		if (re && re.user) {
			this.setState({
				user: re.user || {}
			});
		}
	}

  sendVerCode(){
    //人机验证
    var _that = this;
    checkVaptCha(function(_token){
      //发送验证码，修改手机第一步(验证)
      if(_that.state.isVisible){//发送手机验证码
          Dispatcher.dispatch({
            actionType: 'ReqVerifyCode',
            type:_that.state.user.phone,
            verify_type: VerifyType.UPDATE_PHONE_FIRST_STEP,
            token:_token
          });
        
      }
      else{//发送邮箱验证码
        Dispatcher.dispatch({
          actionType: 'ReqVerifyCode',
          type:_that.state.user.email,
          verify_type: VerifyType.UPDATE_PHONE_FIRST_STEP,
          token:_token
        });
      }
    })
    /*vaptcha({
      vid: '5b7d16a1fc650e163c72b1c2', // 验证单元id
      type: 'invisible', // 显示类型 点击式
      // aiAnimation:false
    }).then((vaptchaObj)=> {
      vaptchaObj.validate();
      vaptchaObj.listen('pass',()=> {
        //发送验证码，修改手机第一步(验证)
        if(this.state.isVisible){//发送手机验证码
            Dispatcher.dispatch({
              actionType: 'ReqVerifyCode',
              type:this.state.user.phone,
              verify_type: VerifyType.UPDATE_PHONE_FIRST_STEP,
              token:vaptchaObj.getToken(),
            });
          
        }
        else{//发送邮箱验证码
          Dispatcher.dispatch({
            actionType: 'ReqVerifyCode',
            type:this.state.user.email,
            verify_type: VerifyType.UPDATE_PHONE_FIRST_STEP,
            token:vaptchaObj.getToken(),
          });
        }
      });
    }); */
  }

  _handleReqVerifyCodeDone(re){
    console.log('_handleReqVerifyCodeDone===',re);
    if(re.err != null && re.err !=''){
      this.setState({
          display:'block',
          alert_title:re.err,
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
        return;
    }

    if(re.result){
      if(this.state.isVisible){
        this.props.history.push({
          pathname:`${__rootDir}/SafetyVerification`, 
          state: 
            { 
              type_str:'phone',
              phoneOrEmail: this.state.user.phone,
              verifyType:VerifyType.UPDATE_PHONE_FIRST_STEP,
              isOnTimer:true,
            }
        });
      }
      else {
        this.props.history.push({
          pathname:`${__rootDir}/SafetyVerification`, 
          state: 
          { 
            type_str:'email',
            phoneOrEmail: this.state.user.email,
            verifyType:VerifyType.UPDATE_PHONE_FIRST_STEP,
            isOnTimer:true,//开启定时器，倒计时
          }
        });
      }
    }
  }

  changeEmialVerify(){
    this.setState({
      isVisible:false,
    });
  }

  changePhoneVerify(){
    this.setState({
      isVisible:true,
    });
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
}

export default UpdateBindMobile;
