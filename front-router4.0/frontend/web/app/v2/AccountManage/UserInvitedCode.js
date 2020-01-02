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
class UserInvitedCode extends React.Component {
  static defaultProps = {
    input_box:6,
  };
  constructor(props) {
    super(props);

    //记录每一个输入框的value
    var txt_values = [];
    //输入框输入对象
    this.input_text = [];

    for(var i=0;i<this.props.input_box;i++){
      txt_values.push(null);
      this.input_text.push(null);
    }

    this.state={
      checkNum:0,
      taskIsShow:false,//是否显示新手任务 true显示 / false不显示
      isInvited:false,//是否填写过邀请码 也可用code判断 null就是没填过
      invite_code:'',
      //记录输入框的value
      text_values:['','','','','',''],
      isSubmit:false,
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
    this.current_selected_input_idx = 0;
    this.tabDate = ['铂略邀请码','邀请好友体验']
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
    EventCenter.emit("SET_TITLE",'铂略财课-邀请码');
    this.e_UserInvitedCode = EventCenter.on('UserInvitedCodeDone',this._handleUserInvitedCode.bind(this));
    this.e_UseStaffInviteCode = EventCenter.on('UseStaffInviteCodeDone',this._handleUseStaffInviteCode.bind(this));
    //第一个输入框获取光标
    this.input_text[0].focus();
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
        taskIsShow:re.result.taskIsShow,
        point:re.result.point,
        invite_code:re.result.code,
        isInvited:re.result.isInvited,
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

  ChooseTab(index){
    this.setState({
      checkNum:index,
    })
    if(index == 0){
      Dispatcher.dispatch({
  			actionType: 'UserInvitedCode',
  			tab: 'bolue'
  		})
    }else {
      Dispatcher.dispatch({
  			actionType: 'UserInvitedCode',
  			tab: 'mine'
  		})
    }
  }

  //联系客服
  _goCustomerService(){
    if(isWeiXin){
      this.props.history.push({pathname: `${__rootDir}/freeInvited`})
    }else {
      window.location.href='https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
    }
  }

  //输入框获取value
  ChangeText(idx,e){
    var del = false
    e.preventDefault();
    var val = e.target.value.trim().toUpperCase();
    //只能是数字或者字母且长度为一个字符
    var reg = new RegExp(/^[a-zA-Z0-9]{1}$/)
    var data = this.state.text_values || []
    if (val !== '') {
      // if((val.search(reg) !== -1) || data[idx].length > 0)
      // {
      //   return;
      // }
    }
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
          this.setState({
            isSubmit:true,
          })
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
    });
 }


  _onFocus(index){
    this.current_selected_input_idx = index;
  }

  _copyCode(){
    this.props.history.push({pathname: `${__rootDir}/PgCopyCode`,state:{type:'userCode',code:this.state.invite_code}})
  }

  //提交邀请码
  _submit(){
    var code = ''
    for (var i = 0; i < this.state.text_values.length; i++) {
      code = code + this.state.text_values[i]
    }
    Dispatcher.dispatch({
			actionType: 'UseStaffInviteCode',
			invite_code: code,
		})
  }
  //完成新手任务
  _goTask(){
    this.props.history.push({pathname: `${__rootDir}/newbieTaskIndex`})
  }

  _hideAlert(){
    this.setState({
      isAlert:false,
    })
  }

  render(){

    //提示弹框
    var showAlert =(
      <div style={{...styles.white_alert,paddingTop:-1}}>
        <div style={{marginTop:15,fontSize:Fnt_Large,color:Common.Black,fontWeight:'bold'}}>请输入正确的铂略邀请码</div>
        <div style={{ color: '#333',fontSize:Fnt_Small,marginTop:10}}>铂略邀请码为铂略产品顾问<br/>或客服提供的官方邀请码</div>
        <div style={styles.alert_bottom}>
          <div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Gray}}  onClick={this._hideAlert.bind(this)}>知道了</div>
        </div>
      </div>
    )

    var commonAlert = (
			<div style={{...styles.alert_box,display:this.state.promptBlock}}>
        <div style={styles.alert_content}>
          {this.state.successText}
        </div>
			</div>
		)

    var tmp = new Array(this.props.input_box);
    for (var i = 0; i < this.props.input_box; i++) {
      tmp[i] = i;
    }

    let alertProps ={
      alert_display:this.state.alert_display,
      alert_title:this.state.alert_title,
      isShow:this.state.isShow,
      errStatus:this.state.errStatus
     }

    var tab = this.tabDate.map((item,index)=>{
      var text_color = Common.Light_Black;
      var border_color = '#F4F4F4';
      var border_width = 0;

      if(this.state.checkNum == index){
         text_color = Common.Activity_Text;
         border_color = Common.Activity_Text;
         border_width = 1;
      }
      var tab_text = {
        display:'inline-block',
        padding:'0 10px',
        height:45,
        lineHeight:'45px',
        textAlign:'center',
        fontSize:Fnt_Medium,
        color:text_color,
        borderBottomStyle:'solid',
        borderBottomWidth:border_width,
        borderBottomColor:border_color,
      }
      return(
        <div key={index} style={styles.tab} onClick={this.ChooseTab.bind(this,index)}>
           <div style={tab_text}>{item}</div>
        </div>
      )
    })

    return(
    <div style={{...styles.container,height:currentHeight}}>
      <ResultAlert {...alertProps}/>
      <div style={{...styles.msk,display:this.state.isAlert ? 'block':'none'}} onClick={this._hideAlert.bind(this)}></div>
      {this.state.isAlert ?
        showAlert
        :
        null
      }
      {this.state.isPrompt ?
        commonAlert
        :
        null
      }
      <div style={styles.tab_box}>
        <div style={styles.tab_con}>
          {tab}
        </div>
       </div>
        <div style={{display:this.state.checkNum == 0 ? 'block':'none',position:'relative',width:devWidth,height:devHeight-46,}}>
            <div style={{paddingTop:40,fontSize:Fnt_Normal,color:Common.Black,marginLeft:15}}>
               请输入6位铂略邀请码，使用后即可获得<span style={{color:'#ff6633',}}>2天VIP体验</span>
            </div>
            {this.state.isInvited ?
              <div style={styles.box}>
                {
                  tmp.map((item,idx)=>{
                    return(
                      <div key={idx}
                      style={{...styles.input_box,color:'#e1e1e1',textDecoration:'line-through',marginRight:idx == 5 ? 14:0}}>
                        {this.state.invite_code.charAt(idx)}
                      </div>
                    )
                  })
                }
              </div>
              :
              <div style={styles.box}>
                {
                  tmp.map((item,idx)=>{
                    return(
                      <input type='text'
                      key={idx}
                      maxLength ='1'
                      value={this.state.text_values[idx]}
                      style={{...styles.input_box,color:Common.Black,marginRight:idx == 5 ? 14:0}}
                      ref={(input) => {this.input_text[idx] = input}}
                      onChange = {this.ChangeText.bind(this,idx)}
                      onFocus = {this._onFocus.bind(this,idx)}
                      />
                    )
                  })
                }
              </div>
            }

            <div style={{marginTop:22,height:20,lineHeight:'20px',textAlign:'center',fontSize:Fnt_Normal,color:Common.Activity_Text}}>
              <div style={{display:this.state.isInvited ? 'block':'none'}}>您已使用过铂略邀请码</div>
            </div>
            {this.state.isSubmit ?
              <div style={{...styles.button,backgroundImage:'linear-gradient(-45deg,#27cfff 0%,#2aa6ff 100%)'}} onClick={this._submit.bind(this)}>
                提交邀请码
              </div>
              :
              <div style={{...styles.button,backgroundColor:'#e1e1e1'}}>
                提交邀请码
              </div>
            }

            {!this.state.isInvited ?
              <div>
                {this.state.taskIsShow ?
                  <div style={{color:'#818181',fontSize:Fnt_Normal,marginTop:15,marginLeft:20}}>
                    没有邀请码？<span style={{color:Common.Activity_Text}} onClick={this._goTask.bind(this)}>完成新手任务</span>
                    也可获得2天VIP体验
                  </div>
                  :
                  <div style={{color:'#818181',fontSize:Fnt_Normal,marginTop:15,marginLeft:20}}>
                    没有邀请码？联系在线客服，也许有惊喜哦~
                  </div>
                }
              </div>
              :
              null
            }
   					<div style={{...styles.kefu}} onClick={this._goCustomerService.bind(this)}></div>
        </div>
        <div style={{...styles.box_bg,height:currentHeight-76,display:this.state.checkNum == 1 ? 'block':'none'}}>
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

export default UserInvitedCode;
