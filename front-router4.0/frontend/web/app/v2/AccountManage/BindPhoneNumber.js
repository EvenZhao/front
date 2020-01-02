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

class BindPhoneNumber extends React.Component {

  constructor(props) {
    super(props);
    
    //是否初次绑定手机号
    this.isFirst = this.props.location.state.isFirst;

    this.new_pwd='';
    this.visible = false;

    this.state={
      //文本框类型
      input_type:'password',
      pwd_value:'',
      //确定按钮默认不可点
      disabled:true,
      checked:false,
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
    EventCenter.emit("SET_TITLE",'铂略财课-绑定手机号');
    this.e_ChkPassword = EventCenter.on('ChkPasswordDone',this._handleChkPasswordDone.bind(this));

	}
	componentWillUnmount() {
    this.e_ChkPassword.remove();
    clearInterval(countdown);
	}

  render(){

    return(
      <div>
        <div style={{marginTop:18,marginLeft:20,fontSize:12,color:'#666'}}>
          <span>为了保证您的账号安全，绑定手机号前请先验证登录密码。</span>
        </div>
        <div style={{...styles.pwd_box}}>
          <input style={{...styles.input_box}} type={this.state.input_type} placeholder="密码" onChange={this._onChangePwd.bind(this)} value={this.state.pwd_value} />

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
        <div style={{textAlign:'center',marginTop:40,}}>
          {
            this.state.disabled ?
            <button style={{...styles.btn_ver,backgroundColor:'#d1d1d1',}} disabled={true} >确定</button>
            :
            <button style={{...styles.btn_ver}} disabled={false} onClick={this.btn_Ok.bind(this)}>确定</button>
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
  _onChangePwd(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      pwd_value:val,
      disabled:false,
    });
  }
  //提交设置的新密码
  btn_Ok(){
    //验证登录密码
    if (this.state.pwd_value =='' || !isPasswordAvailable(this.state.pwd_value)){
      //提示框
      this.setState({
          display:'block',
          alert_title:'密码不合法',
          alert_icon:failure_icon,
          icon_width:failure_width,
          icon_height:failure_height,
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
    //发送请求
    Dispatcher.dispatch({
      actionType: 'ChkPassword',
      pwd:this.state.pwd_value,
    });
  }

  _handleChkPasswordDone(re){
    console.log("re==",re)
    if(re.err != null || !re.result){
      //密码不正确
      this.setState({
          display:'block',
          alert_title:'密码不正确',
          alert_icon:failure_icon,
          icon_width:failure_width,
          icon_height:failure_height,

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
      this.props.history.push({
        pathname: `${__rootDir}/InputPhoneNumber`, 
        state:{
          str:'输入手机号',
          isFirst:this.isFirst,
          initPwd:this.state.pwd_value,
        }
      });
    }
  }

  _visible_pwd(){
    if(this.visible){
      this.visible = false;
      this.setState({
        input_type:'text',
      })
    }else {
      this.visible = true;
      this.setState({
        input_type:'password',
      })
    }
  }

  _clear(){
    this.setState({
      pwd_value:'',
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

export default BindPhoneNumber;
