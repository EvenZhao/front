
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

String.prototype.replaceAll = function(s1,s2){
return this.replace(new RegExp(s1,"gm"),s2);
}

var countdown;
const COUNT_DOWN_SECOND = 60;

class SafetyVerification extends React.Component {

  static defaultProps = {
    input_box:6,
  };
  constructor(props) {
    super(props);
    this.TimerOn = this.startCountDown.bind(this);
    this.phoneOrEmail = this.props.location.state.phoneOrEmail || '';
    this.ver_type = this.props.location.state.verifyType ||'';
    this.isFirst = this.props.location.state.isFirst || false;
    this.initPwd = this.props.location.state.initPwd || '';
    //修改绑定手机号第一步获取到的验证码
    this.old_verfyCode = this.props.location.state.old_verfyCode || '';

    //记录每一个输入框的value
    var txt_values = [];
    //输入框输入对象
    this.input_text = [];

    for(var i=0;i<this.props.input_box;i++){
      txt_values.push(null);
      this.input_text.push(null);
    }
    this.state = {
      //记录输入框的value
      text_values:['','','','','',''],
      //是否提交验证码 为true时不可点击
      isDisabled:true,
      //验证码内容
      expression:'',
      //验证码倒计时
      count:COUNT_DOWN_SECOND,
      //是否重新发送验证码
      isSendVerifyCode:false,
      //弹框是否显示
      display:'none',
      //弹框提示信息
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
      user:{},
      // input_width:0,
      btn_width:0,
      // yuYin: false,
      yuYin: false,
      yuYinK: 'none',//语音提示框的状态
      codeOrVoice:false,//默认为发送验证码，true：发送语音验证
    }
    this.verify_code = null;
    this.current_selected_input_idx = 0;
  }


  componentWillMount() {

	}
	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-填写验证码');
    
    if (this.ver_type !== VerifyType.REGISTER_VERIFY && !this.isFirst) {
      Dispatcher.dispatch({
        actionType: 'getUserAccount',
      });
    }


    this._getUserAccountDone = EventCenter.on('getUserAccountDone', this._handlegetUserAccountDone.bind(this));

    this.input_text[0].focus();

    this.e_ReqVerifyCode = EventCenter.on('ReqVerifyCodeDone',this._handleReqVerifyCodeDone.bind(this));
    this.e_ChkVerifyCode = EventCenter.on('ChkVerifyCodeDone',this._handleChkVerifyCodeDone.bind(this));

    this.e_UpdPhone = EventCenter.on('UpdPhoneDone',this._handleUpdPhoneDone.bind(this));
    this.e_BindPhone = EventCenter.on('BindPhoneDone',this._handleBindPhone.bind(this));

    //获取验证码后60s倒计时
    this.TimerOn();
      // console.log("componentDidMount--------")
  }
  
	componentWillUnmount() {
    // console.log("componentWillUnmount")
    this.e_ReqVerifyCode.remove();
    this.e_ChkVerifyCode.remove();
    this._getUserAccountDone.remove();
    this.e_BindPhone.remove();
    clearInterval(this.timer);
    clearInterval(countdown);
  }

  render(){

    var tmp = new Array(this.props.input_box);
    for (var i = 0; i < this.props.input_box; i++) {
      tmp[i] = i;
    }

    var type_str = this.props.location.state.type_str || '';
    var phoneOrEmail = this.props.location.state.phoneOrEmail;//手机号或者邮箱
    var text_str ='';
    if(type_str == 'email'){//传过来的为邮箱
      text_str ='邮箱'
      var position = phoneOrEmail.indexOf("@");
      var str = phoneOrEmail.substring(0,position);
      var char = phoneOrEmail.substring(position,phoneOrEmail.length);
      if(str.length >2){
        phoneOrEmail = phoneOrEmail.substring(0,2)+'****' + char ;
      }
    }
    else {//传过来的为手机号
      text_str ='手机'
      phoneOrEmail = phoneOrEmail.replaceAll('(\\d{3})\\d{4}(\\d{4})', '$1****$2');
    }

    return(
      <div style={{...styles.container}}>
        <div style={{paddingTop:18,textAlign:'center',fontSize:Fnt_Normal,color:Common.Light_Black,}}>
          验证码已经发送至{text_str}<span style={{color:'#F37D3D'}}>{phoneOrEmail}</span>，请注意查收
        </div>
        <div style={{marginTop:50,paddingLeft:12,paddingRight:2,}}>
        {
          tmp.map((item, idx) => {
            return(
              <div key={idx} style={{...styles.input_box,width:this.state.input_width,marginRight:10,}}>
                <input  type="number"
                  maxLength = "1"
                  style={{...styles.input_text,width:(window.screen.width-74)/6,}}
                  value={this.state.text_values[idx]}
                  onChange = {this.ChangeText.bind(this,idx)}
                  onFocus = {this._onFocus.bind(this)}
                  ref={(input) => {this.input_text[idx] = input;}}/>
              </div>
              )
            })
         }
        </div>

        <div style={{textAlign:'center'}}>
          { this.state.isDisabled ?
            <button style={{...styles.btn_ver,marginTop:'40px',backgroundColor:' #E1E1E1',width:window.screen.width-30,}} disabled={true}>提交验证码</button>
            :
            <button style={{...styles.btn_ver,marginTop:'40px',width:window.screen.width-30,backgroundImage:'linear-gradient(-49deg,#27cfff 0%,#2aa6ff 100%)'}} disabled={false} onClick={this.submitVerCode.bind(this)}>提交验证码</button>
           }
        </div>
        {
          this.state.isSendVerifyCode ?
          <div style={{textAlign:'left',marginLeft:12,float:'left'}}>
            <button onClick={this.sendVerifyCode.bind(this)} style={{...styles.verifyCode}}>
                点击获取验证码
            </button>
          </div>
          :
          <div style={{color:'#4A4A4A',fontSize:Fnt_Normal,textAlign:'left',marginTop:17,marginLeft:12,float:'left'}}>
              {this.state.count}s后重新发送验证码
          </div>
         }

         {/*弹框*/}
           <div style={{...Common.alertDiv,display:this.state.display}}>
    				 <div style={{marginBottom:14,paddingTop:15,height:30,}}>
               <img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
    					</div>
    					<span style={{color:Common.BG_White}}>{this.state.alert_title}</span>
    				</div>

         <div onClick={this.sendyuYinVerifyCode.bind(this)} style={{color:Common.Activity_Text,fontSize:Fnt_Normal,textAlign:'right',float:'right',marginTop:17,marginRight:12,display:type_str == 'phone' && this.state.yuYin ? 'block':'none'}}>
            点击获取语音验证码
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
      </div>
    )

  }

  _onFocus(index){
    this.current_selected_input_idx = index;
  }

  ChangeText(idx,e){
    var del = false
    e.preventDefault();
    var val = e.target.value.trim();

    //只能是0-9之间的任意数字
    //var reg = /[^\d]/g;
    var data = this.state.text_values || []
    
    if (val == '' && this.state.text_values[idx] !== '') {//如果当前输入框的值为空
      del = true
    }
    data[idx] = val
    this.setState({
      text_values: data,
    },()=>{
        if (idx==5) {//如果当天input是最后一个 则光标保持原来位置
          if (del) {
            this.input_text[idx-1].focus();
          }else {
            this.input_text[idx].focus();
          }
        }else {
          if (del) {
            if (idx == 0) {
              this.input_text[idx].focus();
            }else {
              this.input_text[idx-1].focus();
            }
          }else {
            this.input_text[idx+1].focus();
          }
        }
        var isDisabled = false
        for (var i = 0; i < data.length; i++) {
          if (data[i] == '') {
            isDisabled = true
          }
        }
        this.setState({
          isDisabled: isDisabled,
        })
    });
 }

 _handlegetUserAccountDone(re){
  // console.log('safety=== _handlegetUserAccountDone==',re)
   if (re && re.user) {
     this.setState({
       user: re.user || {}
     });
   }
 }

  //获取验证码
  _handleReqVerifyCodeDone(re){
    // console.log("_handleReqVerifyCodeDone==",re);

    if(re.err != null && re.err !=''){
      this.setState({
        display:'block',
        isDisabled:true,
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
    if(this.state.codeOrVoice){
      //语音验证
      this.setState({
        yuYinK:'block'
      },()=>{
        countdown = setInterval(()=>{
          clearInterval(countdown);
          this.setState({
            yuYinK: 'none',
          });
        }, 1500);
      });
      // this.ClearInput();
    }else{
      //倒计时
        this.TimerOn();
    }
  }

  _handleUpdPhoneDone(re){
    // console.log("_handleUpdPhoneDone==",re)
    if(re.err || !re.result){
      this.setState({
        display:'block',
        isDisabled:false,
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
      //绑定手机第二步
      this.setState({
        display:'block',
        isDisabled:true,
        alert_title:'账号绑定成功',
        alert_icon:success_icon,
        icon_width:suc_widthOrheight,
        icon_height:suc_widthOrheight,
      },()=>{
        countdown = setInterval(()=>{
            clearInterval(countdown);
            this.setState({
              display:'none',
            })
        }, 1500);
      });
      this.props.history.push({pathname:`${__rootDir}/PgCenter`});
      localStorage.removeItem('oldVerifyCode');
    }
  }

  //初次绑定手机号
  _handleBindPhone(re){

    if(re.err || !re.result){
      this.setState({
        display:'block',
        isDisabled:false,
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

    this.setState({
      display:'block',
      isDisabled:true,
      alert_title:'账号绑定成功',
      alert_icon:success_icon,
      icon_width:suc_widthOrheight,
      icon_height:suc_widthOrheight,
    },()=>{
      countdown = setInterval(()=>{
          clearInterval(countdown);
          this.setState({
            display:'none',
          })
      }, 1500);
    });
    this.props.history.push({pathname:`${__rootDir}/PgCenter`});
  }

  //提交验证码
  submitVerCode(){

    var codeNum = ''
    for (var i = 0; i < this.state.text_values.length; i++) {
      codeNum = codeNum + this.state.text_values[i]
    }
    this.verify_code = codeNum;

    this._ChkVerifyCode();
  }

  //根据不同类型提交相应验证码，发送验证验证码请求
  _ChkVerifyCode(){

    if(this.ver_type == VerifyType.UPDATE_PWD_VERIFY){
      // 2： 修改密码
      Dispatcher.dispatch({
          actionType: 'ChkVerifyCode',
          type:this.phoneOrEmail,
          verify_type: VerifyType.UPDATE_PWD_VERIFY,
          verify_code: this.verify_code,
      });
    }
    else if(this.ver_type == VerifyType.UPDATE_PHONE_SECOND_STEP){
      // 4： 修改(绑定)手机第二步,验证验证码
      if(this.isFirst){
        //初次绑定手机号
        Dispatcher.dispatch({
          actionType: 'BindPhone',
          // 当前发送验证码的目标
          phone: this.phoneOrEmail,
          // 当前发送的验证码
          verify_Code: this.verify_code,
          // 密码
          pwd: this.initPwd,
        });
      }else{
        //修改绑定手机号第二步
        this.old_verfyCode = localStorage.getItem("oldVerifyCode");
        Dispatcher.dispatch({
          actionType: 'UpdPhone',
          type:this.state.user.phone,
          phone:this.phoneOrEmail,//待绑定手机号
          verify_Code:this.verify_code,
          old_verfyCode: this.old_verfyCode,
        });
      }
    }
    else if (this.ver_type == VerifyType.UPDATE_PHONE_FIRST_STEP) {
      // 3：修改手机第一步(验证)
      localStorage.setItem("oldVerifyCode",  this.verify_code);
      Dispatcher.dispatch({
          actionType: 'ChkVerifyCode',
          type:this.phoneOrEmail,
          verify_type: VerifyType.UPDATE_PHONE_FIRST_STEP,
          verify_code: this.verify_code,
      });
    }
    else if (this.ver_type == VerifyType.REGISTER_VERIFY) {
        // 0： 注册
        Dispatcher.dispatch({
            actionType: 'ChkVerifyCode',
            type:this.phoneOrEmail,
            verify_type: VerifyType.REGISTER_VERIFY,
            verify_code: this.verify_code,
        });
    }
  }

  //验证验证码
  _handleChkVerifyCodeDone(re){
    //提交验证码成功后，设置新密码
    if(re.err || !re.result){
      //验证码不正确，重新发送验证码
        this.setState({
          display:'block',
          alert_title:re.err,
          alert_icon:failure_icon,
          icon_width:failure_width,
          icon_height:failure_height,
          isSendVerifyCode:true,
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

      if(this.ver_type == VerifyType.UPDATE_PWD_VERIFY){
        //修改密码
        if(this.props.location.state.type && this.props.location.state.type=='FgtPassword'){
          this.props.history.push({
            pathname:`${__rootDir}/SetNewPwd`, 
            state: 
              { 
                phoneOrEmail: this.props.location.state.phoneOrEmail,
                verifyCode:this.verify_code,type:this.props.location.state.type
              }
            });
          return;
        }
        
          this.props.history.push({
            pathname:`${__rootDir}/SetNewPwd`, 
            state: {
              phoneOrEmail: this.props.location.state.phoneOrEmail,
              verifyCode:this.verify_code,
              }
            });
      }
      else if (this.ver_type == VerifyType.UPDATE_PHONE_SECOND_STEP) {
        //绑定手机第二步 
        this.old_verfyCode = localStorage.getItem("oldVerifyCode");
        Dispatcher.dispatch({
            actionType: 'UpdPhone',
            type:this.state.user.phone,
            phone:this.phoneOrEmail,//待绑定手机号
            verify_Code:this.verify_code,
            old_verfyCode: this.props.location.state.old_verfyCode,
        });
      }
      else if (this.ver_type == VerifyType.UPDATE_PHONE_FIRST_STEP) {
        //修改绑定手机第一步
        //跳转到输入新手机号界面
        this.props.history.push({
          pathname: `${__rootDir}/InputPhoneNumber`, 
          state: 
            {
              old_verfyCode:this.verify_type,
              verify_code:VerifyType.UPDATE_PHONE_FIRST_STEP, 
              str:'输入新手机号'
            }
          });
      }
      else if (this.ver_type == VerifyType.REGISTER_VERIFY) {
        //0:注册
        this.props.history.push({pathname: `${__rootDir}/RegisterSetPD`, query: null, hash: null, state:{mobile:this.phoneOrEmail,verifyCode:this.verify_code}});
      }
    }
    else {
      this.setState({
        display:'block',
        alert_title:'验证码不正确',
        alert_icon:failure_icon,
        icon_width:failure_width,
        icon_height:failure_height,
        isSendVerifyCode:true,
      },()=>{
        countdown = setInterval(()=>{
            clearInterval(countdown);
            this.setState({
              display:'none',
            })
        }, 1500);
      });
    }
  }

  //清空输入框
  ClearInput(){
    for(var i =0;i < this.props.input_box;i++){
      this.state.text_values[i] = '';
    }
  }

  //发送验证码
  sendVerifyCode(){
    this.ClearInput();
    this.setState({
      codeOrVoice:false,
    },()=>{    
      var _that = this;
      checkVaptCha(function(_token){
        Dispatcher.dispatch({
          actionType: 'ReqVerifyCode',
          type:_that.phoneOrEmail,
          verify_type: _that.ver_type,
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
          // if(this.ver_type == VerifyType.UPDATE_PWD_VERIFY){
          //   Dispatcher.dispatch({
          //       actionType: 'ReqVerifyCode',
          //       type:this.phoneOrEmail,
          //       verify_type: VerifyType.UPDATE_PWD_VERIFY,
          //       token:vaptchaObj.getToken(),
          //   });
          // }
          // else if (this.ver_type == VerifyType.UPDATE_PHONE_SECOND_STEP) {
          //   //修改绑定手机第二步
          //   Dispatcher.dispatch({
          //       actionType: 'ReqVerifyCode',
          //       type:this.phoneOrEmail,
          //       verify_type: VerifyType.UPDATE_PHONE_SECOND_STEP,
          //       token:vaptchaObj.getToken(),
          //   });
          // }
          // else if (this.ver_type == VerifyType.UPDATE_PHONE_FIRST_STEP) {
          //   //修改绑定手机第一步
          //   Dispatcher.dispatch({
          //       actionType: 'ReqVerifyCode',
          //       type:this.phoneOrEmail,
          //       verify_type: VerifyType.UPDATE_PHONE_FIRST_STEP,
          //       token:vaptchaObj.getToken(),
          //   });
          // }
  
          Dispatcher.dispatch({
            actionType: 'ReqVerifyCode',
            type:this.phoneOrEmail,
            verify_type: this.ver_type,
            token:vaptchaObj.getToken(),
          });
        });
      });*/ 
    })
  }

  //语音验证码发送
  sendyuYinVerifyCode(){
    this.setState({
      codeOrVoice:true,
    },()=>{
      var _that = this;
      checkVaptCha(function(_token){
        Dispatcher.dispatch({
          actionType: 'ReqVerifyCode',
          type:_that.phoneOrEmail,
          verify_type: _that.ver_type,
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
          // if(this.ver_type == VerifyType.UPDATE_PWD_VERIFY){
          //   Dispatcher.dispatch({
          //       actionType: 'ReqVerifyCode',
          //       type:this.phoneOrEmail,
          //       verify_type: VerifyType.UPDATE_PWD_VERIFY,
          //       isVoice: true,
          //       token:vaptchaObj.getToken(),
          //   });
          // }
          // else if (this.ver_type == VerifyType.UPDATE_PHONE_SECOND_STEP) {
          //   //修改绑定手机第二步
          //   Dispatcher.dispatch({
          //       actionType: 'ReqVerifyCode',
          //       type:this.phoneOrEmail,
          //       verify_type: VerifyType.UPDATE_PHONE_SECOND_STEP,
          //       isVoice: true,
          //       token:vaptchaObj.getToken(),
          //   });
          // }
          // else if (this.ver_type == VerifyType.UPDATE_PHONE_FIRST_STEP) {
          //   //修改绑定手机第一步
          //   Dispatcher.dispatch({
          //       actionType: 'ReqVerifyCode',
          //       type:this.phoneOrEmail,
          //       verify_type: VerifyType.UPDATE_PHONE_FIRST_STEP,
          //       isVoice: true,
          //       token:vaptchaObj.getToken(),
          //   });
          // }
          // else if(this.ver_type == VerifyType.REGISTER_VERIFY) {
          //   //修改绑定手机第一步
          //   Dispatcher.dispatch({
          //       actionType: 'ReqVerifyCode',
          //       type:this.phoneOrEmail,
          //       verify_type: VerifyType.REGISTER_VERIFY,
          //       isVoice: true,
          //       token:vaptchaObj.getToken(),
          //   });
          // }
  
          Dispatcher.dispatch({
            actionType: 'ReqVerifyCode',
            type:this.phoneOrEmail,
            verify_type: this.ver_type,
            isVoice: true,
            token:vaptchaObj.getToken(),
          });
        });
      }); */
    })

  }

  //发送验证码倒计时
  startCountDown(){
    this.setState({
      isDisabled:true,
      isSendVerifyCode:false,
      count:COUNT_DOWN_SECOND,//60s
    },()=>{
      this.timer = setInterval(()=>{
        if(this.state.count > 0){
          var count_num = this.state.count;
          if (count_num == 30 && !this.state.yuYin) { //倒计时30秒的时候显示语音验证码
            this.setState({
              yuYin: true
            })
          }
          this.setState({
            count:this.state.count -1,
          })
        }
        else{//倒计时到0秒，清除定时器
          clearInterval(this.timer);
          //显示重新获取验证码按钮
          this.setState({
            isSendVerifyCode:true,
          })
        }
      }, 1000);
    });
  }
}

var styles={
  container:{
    width:devWidth,
    height:devHeight,
    backgroundColor:Common.Bg_White,
  },
  btn_ver:{
    backgroundColor:Common.Activity_Text,
    color:Common.Bg_White,
    textAlign:'center',
    fontSize:Fnt_Large,
    height:45,
    lineHeight:'45px',
    borderRadius:4,
    border:0,
  },
  input_box:{
    /*width:45,*/
    borderBottomWidth:1,
    borderBottomColor:'#D8D8D8',
    borderBottomStyle:'solid',
    height:26,
    float:'left',
    paddingBottom:2,
  },
  input_text:{
    color:Common.Light_Black,
    fontSize:Fnt_Large,
    height:18,
    paddingBottom:4,
    textAlign:'center',
    border:'none',
  },
  verifyCode:{
    backgroundColor:Common.Bg_White,
    color:Common.Activity_Text,
    fontSize:Fnt_Normal,
    textAlign:'center',
    marginTop:17,
    border:0,
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

export default SafetyVerification;
