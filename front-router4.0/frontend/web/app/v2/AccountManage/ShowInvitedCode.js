/*
 * Author: Joyce
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
import ResultAlert from '../components/ResultAlert'


var countdown;
var t;
var currentHeight;
class ShowInvitedCode extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      checkNum:0,
      invite_code:'',
      point:0,
      //弹框提示信息
      alert_display:'none',
      alert_title:'',
      isShow:false,
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
      isAlert:false,
      successText:'',
      isPrompt:false,
      promptBlock:'',
    }
  }

  componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'UserInvitedCode',
      tab: 'mine'
    })

    if(isApple){//苹果机
      currentHeight = window.innerHeight;
    }
    else {
      currentHeight = window.screen.height;
    }

	}
	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-好友邀请码');
    this.e_UserInvitedCode = EventCenter.on('UserInvitedCodeDone',this._handleUserInvitedCode.bind(this));
    this.e_UseStaffInviteCode = EventCenter.on('UseStaffInviteCodeDone',this._handleUseStaffInviteCode.bind(this));

	}
	componentWillUnmount() {
    this.e_UserInvitedCode.remove()
    this.e_UseStaffInviteCode.remove()
    clearInterval(countdown)
    clearTimeout(t)
	}

  _handleUserInvitedCode(re){
    console.log('_handleUserInvitedCode===',re);
    if(re.err){
      this.setState({
        alert_display:'block',
        alert_title:re.err,
        isShow:false,
        errStatus:0,
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              alert_display:'none',
            })
        }.bind(this), 1000);
      })
      return false;
    }
    if(re.result){
      this.setState({
        point:re.result.point,
        invite_code:re.result.code,
        bolueIsShow:re.result.bolueIsShow,
      })
    }
  }

  _handleUseStaffInviteCode(re){
    if(re.err){
      if(re.err = 'errInviteCode'){//验证码错误提示
        this.setState({
          isAlert:true,
        })
      }
      else {
          this.setState({
            alert_display:'block',
            alert_title:re.err,
            isShow:false,
            errStatus:0,
          },()=>{
            countdown = setInterval(function(){
                clearInterval(countdown);
                this.setState({
                  alert_display:'none',
                })
            }.bind(this), 1000);
          })
      }
      return false;
    }

    if(re.result){//操作成功
      this.setState({
        isPrompt:true,
        successText:'邀请成功，你已获得铂略2天VIP体验权限',
        promptBlock:'block',
      },()=>{
        countdown = setInterval(function(){
            clearInterval(countdown);
            this.setState({
              promptBlock:'none',
            })
        }.bind(this), 1000);
      })
      //验证码提交成功跳转至个人主页
      t = setTimeout(() => {
        window.location.reload();
      }, 1500)

    }
  }


  _copyCode(){
    this.props.history.push({pathname: `${__rootDir}/PgCopyCode`,state:{type:'userCode',code:this.state.invite_code}})
  }


  render(){

    var commonAlert = (
			<div style={{...styles.alert_box,display:this.state.promptBlock}}>
        <div style={styles.alert_content}>
          {this.state.successText}
        </div>
			</div>
		)

    return(
    <div style={{...styles.container,height:currentHeight}}>
        <div style={{...styles.box_bg,height:currentHeight-76,}}>
          <div style={{height:470}}>
            <div style={styles.invite_bg}>
                <div style={styles.box1}>
                  <div style={styles.title}>您的好友邀请码</div>
                  <div style={{...styles.invite_code,paddingBottom:20}}>{this.state.invite_code}</div>
                </div>
                <div style={{width:devWidth-60,height:23,position:'relative'}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/invite_line@2x.png')} width={devWidth-60} height={25} style={{position:'absolute',top:-1,left:0,zIndex:2}}/>
                </div>
                <div style={styles.box3}>
                  <div style={{padding:'0 15px',fontSize:Fnt_Small,color:Common.Light_Gray,}}>
                    <div style={{fontSize:Fnt_Normal,color:Common.Black}}>邀请受益</div>
                    <div style={{marginTop:10,fontSize:Fnt_Small,color:Common.Light_Gray}}>
                      每成功邀请一位好友注册成为铂略用户，您和您的好友各会获得<span style={{color:'#151515'}}>{this.state.point}积分奖励！</span>。
                    </div>
                    <div style={{fontSize:Fnt_Normal,color:Common.Black,marginTop:20}}>使用说明</div>
                    <div style={{marginTop:10,fontSize:Fnt_Small,color:Common.Light_Gray}}>
                      您的好友在注册时，将此邀请码输入<span style={{color:'#151515'}}>邀请码一栏</span>即可。
                    </div>
                  </div>
                  <div style={styles.copy_button} onClick={this._copyCode.bind(this)}>复制邀请信息给好友</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    )
  }
}

var styles={ 
  container:{
    width:devWidth,
    //height:currentHeight,
    backgroundColor:Common.Bg_White,
  },
  tab_box:{
    height:45,
    borderBottomColor:'#F4F4F4',
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    position:'relative',
  },
  tab_con:{
    position:'absolute',
    left:0,
    bottom:0,
    width:devWidth,
    height:45,
    lineHeight:'45px',
  },
  tab:{
    width:devWidth/2,
    height:45,
    lineHeight:'45px',
    textAlign:'center',
    float:'left',
  },
  box:{
    marginTop:15,
    width:devWidth,
    height:45,
    display:'flex',
    flexDirection:'row',
  },
  input_box:{
    marginLeft:14,
    width:(devWidth-98)/6-2,
    height:43,
    lineHeight:'43px',
    fontSize:20,
    border:'solid 1px #2196f3',
    display:'flex',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'center',
    textAlign:'center',
  },
  button:{
    width:devWidth-30,
    marginLeft:15,
    height:45,
    lineHeight:'45px',
    textAlign:'center',
    color:Common.Bg_White,
    fontSize:Fnt_Large,
    borderRadius:4,
    marginTop:5
  },
  kefu:{
		width: 70,
		height: 50,
		position:'absolute',
    zIndex:2,
		right: 0,
		top:280,
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/audit/lianxikefu@2x.png')+')',
		backgroundSize:'cover'
	},
  box_bg:{
    width:devWidth,
    paddingTop:30,
    backgroundImage:'linear-gradient(-180deg,#2196f3 0%,#5ab6ff 100%)',

  },
  invite_bg:{
    width:devWidth-60,
    marginLeft:30,
  },
  box1:{
    backgroundColor:Common.Bg_White,
    width:devWidth - 60,
    borderTopLeftRadius:12,
    borderTopRightRadius:12,
    paddingTop:35,
  },
  box3:{
    backgroundColor:Common.Bg_White,
    width:devWidth - 60,
    borderBottomLeftRadius:12,
    borderBottomRightRadius:12,
    padding:'10px 0 35px 0',
    boxShadow:'2px 12.5px 10px #0068ba'
  },
  title:{
    fontSize:Fnt_Medium,
    color:'#ff6633',
    textAlign:'center'
  },
  invite_code:{
    fontFamily:'PingFangSC-Medium',
    fontSize:45,
    color:Common.Black,
    letterSpacing:'0.09px',
    textAlign:'center',
    marginTop:10,
    height:50,
    lineHeight:'50px',
  },
  copy_button:{
    width:devWidth - 90,
    height:40,
    lineHeight:'40px',
    marginLeft:15,
    marginTop:50,
    color:Common.Bg_White,
    fontSize:Fnt_Medium,
    textAlign:'center',
    backgroundImage: 'linear-gradient(200deg, #27CFFF 0%, #2AA6FF 100%)',
    borderRadius: '100px',
  },
  white_alert:{
		width:devWidth-100,
		height:150,
		backgroundColor:Common.Bg_White,
		borderRadius:12,
		position:'absolute',
		zIndex:1000,
		top:180,
		left:50,
		textAlign:'center',
	},
	alert_bottom:{
		position:'absolute',
		zIndex:201,
		bottom:0,
		left:0,
		width:devWidth-100,
		height:42,
		borderTopStyle:'solid',
		borderTopWidth:1,
		borderTopColor:'#d4d4d4',
		display:'flex',
		flex:1,
	},
	msk:{
    width: devWidth,
		height: devHeight,
		backgroundColor:'#000000',
		position:'fixed',
		zIndex: 999,
		opacity:0.2,
		top:0,
		textAlign:'center',
  },
  alert_box:{
		width:devWidth,
    height:40,
		position:'absolute',
    zIndex:1000,
		top:'50%',
		left:0,
    textAlign:'center'
    // display:'flex',
    // flexDirection:'row',
    // justifyContent:'center',
    // alignItems:'center'
	},
  alert_content:{
    padding:'0 10px',
		height:40,
		lineHeight:'40px',
    display:'inline-block',
		color:Common.Bg_White,
		fontSize:Fnt_Normal,
    backgroundColor:Common.Light_Black,
		opacity:0.7,
		borderRadius:2,
  }

}

export default ShowInvitedCode;
