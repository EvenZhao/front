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
const success_icon = 'success@2x';
const failure_icon = 'failure@2x.png';
const suc_widthOrheight = 42;
const failure_width = 22;
const failure_height = 23;

class SetNewPwd extends React.Component {

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
    }
  }

  componentWillMount() {

	}
	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-设置新密码');
    //修改密码
    this.e_UpdPassword = EventCenter.on('UpdPasswordDone',this._handleUpdPasswordDone.bind(this));
    //忘记密码
    this.e_FgtPassword = EventCenter.on('FgtPasswordDone',this._handleFgtPasswordDone.bind(this));
	}
	componentWillUnmount() {
    clearInterval(countdown);
    this.e_UpdPassword.remove();
    this.e_FgtPassword.remove()
	}

  render(){

    return(
      <div>
        <div style={{marginTop:18,marginLeft:20,fontSize:12,color:'#666'}}>
          <span>安全验证通过，请设置新密码。</span>
        </div>
        <div style={{...styles.pwd_box}}>
          <input style={{...styles.input_box}} type={this.state.input_type} placeholder="新密码" value={this.state.pwd_value}
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
              <div style={{...styles.clear}} onClick={this._clear.bind(this)}>
                <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
              </div>
            </div>
            :
            null
        }

        </div>
        <div style={{textAlign:'center',marginTop:40,}}>
          <button style={{...styles.btn_ver}} onClick={this.btn_Ok.bind(this)}>确定</button>
        </div>

        <div style={{textAlign:'center',marginTop:20}} onClick={this._check.bind(this)}>
        { this.state.checked == 1 ?
           <span>
            <img src={Dm.getUrl_img('/img/v2/icons/icon_checked@2x.png')} style={{...styles.timePng}} />
           </span>
           :
           <span>
             <img src={Dm.getUrl_img('/img/v2/icons/icon_unchecked@2x.png')} style={{...styles.timePng}} />
           </span>
         }
           <span style={{...styles.span_text}}>修改该手机对应的所有账号登录密码</span>
        </div>


        {/*弹框*/}
         <div style={{...Common.alertDiv,display:this.state.display}}>
            {
              !this.state.isSuccess?
              <div>
                <div style={{marginBottom:14,paddingTop:15,height:20,}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/failure@2x.png')} width={22} height={23}/>
                </div>
                <span style={{color:Common.BG_White}}> 密码必须包含大小写，符号或数字中的任意2种</span>
              </div>
              :
              <div>
                <div style={{marginBottom:14,paddingTop:15,height:30,}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/success@2x.png')} width={42} height={42}/>
                </div>
                <span style={{color:Common.BG_White}}>密码修改成功</span>
              </div>
            }
         </div>
      </div>
    )
  }

  inputOnFocus(){
    this.setState({
      isFocus:true,
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

  _handleUpdPasswordDone(re){
    console.log('_handleUpdPasswordDone===',re);
    if(re.err != null){
      this.setState({
        isSuccess:false,
        display:'block',
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
      this.setState({
        isSuccess:true,
        display:'block',
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              display:'none',
            })
        }.bind(this), 1500);
      });
      loginType = true
      this.props.history.push({pathname: `${__rootDir}/login`, query: null, hash: null, state: {}});
    }
  }

  _handleFgtPasswordDone(re){
    console.log('_handleFgtPasswordDone==',re);
    if(re.err != null){
      this.setState({
        isSuccess:false,
        display:'block',
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
      this.setState({
        isSuccess:true,
        display:'block',
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              display:'none',
            })
        }.bind(this), 1500);
      });
      loginType = true
      this.props.history.push({pathname: `${__rootDir}/login`, query: null, hash: null, state: {}});
    }
  }

  //提交设置的新密码
  btn_Ok(){

    this.setState({
       isFocus:false,
    });

    //验证新密码是否合法
    if (this.state.pwd_value =='' || !isPasswordAvailable(this.state.pwd_value)){
      //提示框
      this.setState({
        isSuccess:false,
        display:'block',
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              display:'none',
            })
        }.bind(this), 1500);
      })
      return;
    }

    var _phoneOrEmail = this.props.location.state.phoneOrEmail;
    var verify_Code = this.props.location.state.verifyCode;

    if(this.props.location.state.type && this.props.location.state.type=='FgtPassword'){
      //发送请求,忘记密码
      Dispatcher.dispatch({
        actionType: 'FgtPassword',
        phoneOrEmail:_phoneOrEmail,
        verify_Code:verify_Code,
        newPwd:this.state.pwd_value,
        isChecked:1,
      });
    }else {
      //发送请求，修改密码
      console.log('_phoneOrEmail====',_phoneOrEmail);

      Dispatcher.dispatch({
        actionType: 'UpdPassword',
        phoneOrEmail:_phoneOrEmail,
        verify_Code:verify_Code,
        newPwd:this.state.pwd_value,
        isChecked:this.state.checked,
      });
    }
  }
  _check(){
    if(this.state.checked == 1){
      //选中状态
      this.setState({
        checked:0,
      });
    }
    else {
      //未选中状态
      this.setState({
        checked:1,
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

  _clear(){
    this.setState({
      pwd_value:'',
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
    border:'none',
    fontSize: Fnt_Medium,
    height:20,
    marginTop:8,
    paddingTop:5,
    paddingBottom:10,
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

export default SetNewPwd;
