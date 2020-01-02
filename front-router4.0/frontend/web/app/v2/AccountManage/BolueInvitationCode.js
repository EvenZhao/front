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
var currentHeight;
class BolueInvitationCode extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      invite_code:'',
      expireDate:'',
      //弹框提示信息
      alert_display:'none',
      alert_title:'',
      isShow:false,
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
    }
  }

  componentWillMount() {
    Dispatcher.dispatch({
			actionType: 'UserInvitedCode',
			tab: 'bolue'
		})

    if(isApple){//苹果机
      currentHeight = window.innerHeight;
    }
    else {
      currentHeight = window.screen.height;
    }
	}
	componentDidMount() {

    EventCenter.emit("SET_TITLE",'铂略财课-邀请客户体验');
    this.e_UserInvitedCode = EventCenter.on('UserInvitedCodeDone',this._handleUserInvitedCode.bind(this));
	}
	componentWillUnmount() {
    this.e_UserInvitedCode.remove()
    clearTimeout(countdown)
	}

  _handleUserInvitedCode(re){
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
    if(re.result && re.result.code){
      this.setState({
        invite_code:re.result.code,
        expireDate:re.result.expireDate
      })
    }
  }

  _copyCode(){
    this.props.history.push({pathname: `${__rootDir}/PgCopyCode`,state:{type:'bolueCode',code:this.state.invite_code,expireDate:this.state.expireDate}})
  }

  render(){

    let alertProps ={
			alert_display:this.state.alert_display,
			alert_title:this.state.alert_title,
			isShow:this.state.isShow,
			errStatus:this.state.errStatus
		 }

    return(
      <div style={{...styles.container,height:currentHeight}}>
        <ResultAlert {...alertProps}/>
        <div style={{paddingTop:30}}>
          <div style={styles.invite_bg}>
              <div style={styles.box1}>
                <div style={styles.title}>您的铂略邀请码</div>
                <div style={styles.invite_code}>{this.state.invite_code}</div>
                <div style={{fontSize: '12px',color:Common.Light_Gray,textAlign:'center'}}>有效期至 <span style={{color: Common.Black}}>{this.state.expireDate}</span></div>
              </div>
              <div style={{width:devWidth-60,height:23,position:'relative'}}>
                <img src={Dm.getUrl_img('/img/v2/icons/invite_line@2x.png')} width={devWidth-60} height={25} style={{position:'absolute',zIndex:2,left:0,top:-1}}/>
              </div>
              <div style={styles.box3}>
                <div style={{padding:'0 15px',fontSize:Fnt_Small,color:Common.Light_Gray,}}>
                  <div style={{fontSize:Fnt_Normal,color:Common.Black}}>邀请受益</div>
                  <div style={{marginTop:5}}>受邀成功注册账号后，该账号将获得<span style={{color:'#252525'}}>2天VIP体验权限。</span></div>
                  <div style={{fontSize:Fnt_Normal,color:Common.Black,marginTop:20}}>您可以使用的3种操作方式</div>
                  <div style={{marginTop:10,lineHeight:'16px'}}>1 注册账号时，将邀请码输入<span style={{color:'#252525'}}>邀请码</span>界面后进行提交</div>
                  <div style={{marginTop:10,lineHeight:'16px'}}>2 在官网登录已有账号后，页面右上角头像下拉菜单
                     中点击<span style={{color:'#252525'}}>获取2天VIP体验会员</span>中输入邀请码并提交
                  </div>
                  <div style={{marginTop:10,lineHeight:'16px'}}>3 在铂略财课移动端(安卓/IOS应用、微信服务号）
                   登录已有账号后，进入<span style={{color:'#252525'}}>我-邀请码-铂略邀请码页</span>面中输入邀请码并提交。</div>
                  </div>
                  <div style={styles.button} onClick={this._copyCode.bind(this)}>复制邀请信息给客户</div>
                  <div style={{marginTop:20,lineHeight:'14px',fontSize: 11,color:'#999999',textAlign:'center'}}>注：同一账号仅可使用邀请码获取1次体验权限 <br /> &nbsp;请提醒客户在有效期内使用邀请码。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
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
    paddingBottom:20
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
  button:{
    width:devWidth - 90,
    height:40,
    lineHeight:'40px',
    marginLeft:15,
    marginTop:25,
    color:Common.Bg_White,
    fontSize:Fnt_Medium,
    textAlign:'center',
    backgroundImage: 'linear-gradient(200deg, #27CFFF 0%, #2AA6FF 100%)',
    borderRadius: '100px',
  }
}

export default BolueInvitationCode;
