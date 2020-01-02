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
class InvitationCode extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      inviteCode:'',
      isDisable:true,
      //弹框是否显示
      display:'none',
      //弹框提示信息
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
      isShow: false,
      isDown: false,
      point: 0
    }
  }

  componentWillMount() {

	}
	componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        point: this.props.location.state.point || 0
      })
    }
    EventCenter.emit("SET_TITLE",'铂略财课-邀请码');
    this.e_RegisterInvitedCode = EventCenter.on('RegisterInvitedCodeDone',this._handleeRegisterInvitedCode.bind(this));
	}
	componentWillUnmount() {
    clearInterval(countdown);
    this.e_RegisterInvitedCode.remove();
	}
  goStudy(){
    this.props.history.push(`${__rootDir}`)
  }
  goNewbieTask(){
    this.props.history.push(`${__rootDir}/newbieTaskIndex`)
  }
  render(){

    return(
      <div>
        <div style={{...styles.pwd_box}}>
        <div>
          <img src={Dm.getUrl_img('/img/v2/icons/invite_code@2x.png')} style={{width:19,height:15,float:'left',marginTop:17.5,marginLeft:17,}} />
        </div>
          <input style={{...styles.input_box}} type='text' placeholder="请输入邀请码" onChange={this._onChangeInviteCode.bind(this)} value={this.state.inviteCode} />

          <div style={{...styles.clear}} onClick={this._clear.bind(this)}>
            <img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:40,}}>
          {
            this.state.isDisable ?
            <button style={{...styles.btn_ver,backgroundColor:'#D1D1D1',}}>确定</button>
            :
            <button style={{...styles.btn_ver}} onClick={this.btn_Ok.bind(this)}>确定</button>
          }
        </div>
        <div style={{marginTop:25,textAlign:'center'}} onClick={this.next.bind(this)}>
          <span style={{fontSize:13,color:Common.Activity_Text,}}>跳过</span>
        </div>

        {/*弹框*/}
        <div style={{...Common.alertDiv,display:this.state.display}}>
          <div style={{marginBottom:14,paddingTop:15,height:30,}}>
            <img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
           </div>
           <span style={{color:Common.BG_White}}>{this.state.alert_title}</span>
         </div>
         <div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
         <div style={{...styles.alert,width:270,left:(devWidth-270)/2,display:this.state.isShow ?'block':'none',height: this.state.isDown ? 130 : 160}}>
           <div style={{...styles.alertFirstDiv,height:this.state.isDown ? 84 : 113}}>
             <div style={{width:270,height:50,marginTop:18,position:'absolute',textAlign:'center'}}>
               <span style={{fontSize:16,color:'#030303',}}>
                 注册成功
               </span>
               <div>
                 {
                   this.state.isDown ?
                   <span style={{fontSize:12}}>
                   当前网站权限级别 2天VIP体验会员
                   </span>
                   :
                   <div>
                     <div>
                       <span style={{fontSize:12}}>
                         当前网站权限级别 注册用户
                       </span>
                     </div>
                     <div style={{lineHeight:1}}>
                       <div>
                         <span style={{fontSize:12}}>
                           完成 新手任务 即可获得 2天VIP会员
                         </span>
                       </div>
                       <div>
                         <span style={{fontSize:12}}>
                           体验权限 + {this.state.point}积分
                         </span>
                       </div>
                     </div>
                   </div>
                 }

               </div>
             </div>
           </div>
           <div style={{position:'relative',bottom:0}}>
             {
               this.state.isDown ?
               <div onClick={this.goStudy.bind(this)} style={{width:270,height:45,textAlign:'center',lineHeight:3}}>
                 <span style={{fontSize:17,color:'#2196f3'}}>开始学习</span>
               </div>
               :
               <div>
                 <div onClick={this.goNewbieTask.bind(this)} style={{...styles.alertSecond,width:134}} >
                   <span style={{fontSize:17,color:'#2196f3'}}>做新手任务</span>
                 </div>
                 <div onClick={this.goStudy.bind(this)} style={{...styles.alertSecond,border:'none'}} >
                   <span style={{fontSize:17,color:'#2196f3'}}>直接开始学习</span>
                 </div>
               </div>
             }

           </div>
         </div>

      </div>
    )

  }

  //文本框输入密码的value被改变
  _onChangeInviteCode(e){
    e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      inviteCode:val,
      isDisable:false,
    });
  }
  //输入邀请码
  btn_Ok(){

    if (this.state.inviteCode == ''){
      //提示框
      this.setState({
          display:'block',
          alert_title:'请输入邀请码',
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
      actionType: 'RegisterInvitedCode',
      invite_code:this.state.inviteCode,
    });
  }

  _handleeRegisterInvitedCode(re){

    if(re.err){
      this.setState({
          display:'block',
          alert_title:re.err,
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
      this.setState({
        isShow: true,
        isDown: true,
      })
      // this.props.history.push({pathname:`${__rootDir}/CompleteInfo`});
    }
  }
  next(){
    this.setState({
      isShow: true,
      isDown: false,
    })
  }
  _clear(){
    this.setState({
      inviteCode:'',
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
    backgroundColor:Common.Bg_White,
    border:0,
    fontSize: Fnt_Medium,
    height:20,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:12,
    width:window.screen.width-80,
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
  },
  zzc:{
    width: devWidth,
    height: devHeight,
    backgroundColor:'#cccccc',
    position:'absolute',
    opacity: 0.5,
    zIndex: 998,
    top:0,
  },
  alert:{
    width:270,
    height:131,
    backgroundColor:'#ffffff',
    borderRadius:'12px',
    position:'absolute',
    top: (devHeight - 131)/2,
    zIndex:999,
    // left: (devWidth-270)/2
  },
  alertFirstDiv:{
    // width:270,
    height:84,
    borderBottomWidth:0.5,
    borderBottomColor:'#D4D4D4',
    borderBottomStyle:'solid',
    // padding:'20px 14px 0px 14px'
  },
  alertSecond:{
    width:135,
    height:45,
    textAlign:'center',
    borderRightWidth:1,
    borderRightColor:'#D4D4D4',
    borderRightStyle:'solid',
    float:'left',
    lineHeight:3
  },
}

export default InvitationCode;
