import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import funcs from '../util/funcs'
import ActivityAlert from './ActivityAlert';
import util from 'util';
var f = util.format;

var countdown;
var devWidth;
var devHeight;
devWidth = window.innerWidth;
devHeight = window.innerHeight;
class yygmb extends React.Component {
  constructor(props) {
      super(props);

      this.state={
        resource_id:null,
        mobile:'',
        dispUser:'',
        isAttend:false,
        uuid:'',
        verifyCode:'',
        count:60,
        isSend:true,
        alertInfo:'',
        alertDisplay:'none',
        formHtml: null,
        errInfo:'',
      }
      //this.code = this.props.match.params.code;
      this.uuid = this.props.match.params.uuid;
      this.source ='0';
      this.clientType = 5;
      this.code = 'yyg';

  }

componentDidMount(){

  EventCenter.emit("SET_TITLE",'1块钱get2位CFO独家秘笈');

  this.e_GetUserInfoAndVerifyCode = EventCenter.on('GetUserInfoAndVerifyCodeDone',this._handleGetUserInfoAndVerifyCode.bind(this));
  this.e_PayForActivity = EventCenter.on('PayForActivityDone',this._handlePayForActivity.bind(this));
}

componentWillMount(){

}

componentWillUnmount(){

  this.e_GetUserInfoAndVerifyCode.remove()
  this.e_PayForActivity.remove()
  clearInterval(countdown)
}

_handleGetUserInfoAndVerifyCode(re){

  if(re.err){
    if(re.err == '本次活动未开始' || re.err == '本次活动已结束'){
      this.setState({
        errInfo:re.err,
      })
      return false;
    }else {
      this.setState({
        alertInfo:re.err,
        alertDisplay:'block',
      },()=>{
        countdown = setInterval(()=>{
            clearInterval(countdown);
            this.setState({
                alertDisplay: 'none'
            });
        }, 1500);
      })
      return false;
    }
  }
  if(re.result){//获取验证码成功
    this.setState({
      dispUser:re.result.dispUser,
      mobile:re.result.phone,
      isAttend:re.result.isAttend,
      resource_id:re.result.resource_id||'',
      uuid:re.result.uuid||'',
    })
  }
}

_handlePayForActivity(re){
  if(re.err){
    this.setState({
      alertInfo:re.err,
      alertDisplay:'block',
    },()=>{
      countdown = setInterval(()=>{
          clearInterval(countdown);
          this.setState({
              alertDisplay: 'none'
          });
      }, 2000);
    })
    return;
  }

  if(re.result){
    //存储openid
    localStorage.setItem("credentials.code", re.result.code);
    localStorage.setItem("credentials.openid", re.result.openid);

    this.setState({
      form:re.result.form,
    },()=>{

      var stateFrom = this.state.form.split('<script>')[0] || null
      var script = this.state.form.split('<script>')[1] || null

      var form = <div dangerouslySetInnerHTML={{__html: f(stateFrom)}}></div>

      this.setState({
        formHtml: form
      },()=>{
        	var addScript = document.createElement('script')
        	addScript.type = 'text/javascript'
          addScript.innerHTML = 'document.forms[0].submit();';
          setTimeout(() => {
              document.body.appendChild(addScript)
          }, 100);
      })

    })
  }
}

_sendCode(){

  //手机号不存在，输入手机号
    if(this.state.mobile == '' || !isCellPhoneAvailable(this.state.mobile)){
      this.setState({
        alertInfo:'请输入有效手机号',
        alertDisplay:'block',
      },()=>{
        countdown = setInterval(()=>{
            clearInterval(countdown);
            this.setState({
                alertDisplay: 'none'
            });
        }, 2000);
      });
      return;
    }

  if(this.state.isSend){
    this.setState({
      isSend:false,
      count: 60,
    },()=>{
      //发送验证码
      Dispatcher.dispatch({
        actionType:'GetUserInfoAndVerifyCode',
        source:this.source,
        code:this.code,
        phone:this.state.mobile,
      })
    });
    countdown = setInterval(()=>{
        if( this.state.count > 0 ){
          this.setState({
            count: this.state.count - 1,
          });
        } else {
          clearInterval(countdown);
          this.setState({
            isSend: true
          });
        }
    }, 1000);
  }
}

//购买
_buy(){

   //输入手机号
   if(this.state.mobile == ''){
     this.setState({
       alertInfo:'请输入手机号',
       alertDisplay:'block',
     },()=>{
       countdown = setInterval(()=>{
           clearInterval(countdown);
           this.setState({
               alertDisplay: 'none'
           });
       }, 2000);
     });
     return false;
   }
   if(this.state.verifyCode == ''){
     this.setState({
       alertInfo:'请输入验证码',
       alertDisplay:'block',
     },()=>{
       countdown = setInterval(()=>{
           clearInterval(countdown);
           this.setState({
               alertDisplay: 'none'
           });
       }, 1500);
     });
     return false;
   }
   Dispatcher.dispatch({
     actionType:'PayForActivity',
     uuid:this.state.uuid,
     code:this.code,
     source:this.source,
     verifyCode:this.state.verifyCode,
     clientType:this.clientType,
   })
}

//开始学习
_study(){
  var id = this.state.resource_id;
  this.props.history.push({pathname: `${__rootDir}/productDetail/${id}`})
}

//输入手机号
_onChangeMobile(e){
  e.preventDefault();
  var input_text = e.target.value.trim();
  if(this.state.mobile && input_text.length>0){
    this.setState({
      mobile:input_text,
    });
  }
  else {
    this.setState({
      mobile:input_text,
    });
  }
}

//输入验证码
_onChangeCode(e){
  e.preventDefault();
  var input_text = e.target.value.trim();
  if(this.state.verifyCode && input_text.length>0){
    this.setState({
      verifyCode:input_text,
    });
  }
  else {
    this.setState({
      verifyCode:input_text,
    });
  }
}

  render(){

    var alertDiv = (
      <div style={{...styles.alertDiv,display:this.state.alertDisplay}}>
        <img src={Dm.getUrl_img('/img/v2/activity/icon_alert.png')} width={devWidth/750*96} height={devHeight/1334*96}/>
        <div style={{width:devWidth-64,marginTop:devWidth/750*15}}>{this.state.alertInfo}</div>
      </div>
    )
    var formHtml = this.state.formHtml || null;

    return(
      <div style={{...styles.container}}>
        <div style={styles.body_bg}>

          <img src={Dm.getUrl_img('/img/v2/activity/yyg_bg1.jpg')} width={devWidth} height={1404/750*devWidth} style={{position:'absolute',zIndex:2}}/>

          <div style={{...styles.content_bg}}>
            <div style={styles.activity_relative}>
              <div style={styles.yyg_text1}>
                1块钱学习两门《连线CFO》系列视频课程，聆听行业潮流新思路，感受财界领袖新启发，迈向职场进阶新突破。您与世界500强明星CFO财智精粹，只有1块钱的距离
              </div>

          <div style={{visibility:this.state.errInfo ? 'hidden':'visible'}}>
            <div style={{fontSize:14,color:'#898989',marginTop:30/750*devWidth,visibility:this.state.dispUser ? 'visible':'hidden'}}>尊敬的<span style={{color:'#28aeb9'}}>{this.state.dispUser}</span>用户，完成以下信息后，即可优惠购课</div>
            <div style={{visibility:this.state.isAttend ? 'hidden':'visible'}}>
              {this.state.dispUser ?
                <div style={styles.show_mobile}>
                  <img src={Dm.getUrl_img('/img/v2/activity/mobilebg.png')} width={devWidth/750*622} height={devHeight/1334*92}/>
                  <div style={styles.mobile_text}>{this.state.mobile}</div>
                </div>
                :
                <div style={styles.inputbg}>
                  <input type='text' value={this.state.mobile} placeholder={'输入有效手机号码'} style={styles.input_text} onChange={this._onChangeMobile.bind(this)}/>
                </div>
               }
              <div style={styles.codebg}>
                <input type='text' value={this.state.code} placeholder={'输入验证码'} style={styles.code_text} onChange={this._onChangeCode.bind(this)}/>
              </div>
              <div style={styles.btnCode}>
                <img src={Dm.getUrl_img('/img/v2/activity/yuan_timer.png')} width={devWidth/750*207} height={devHeight/1334*85}/>
                <div style={{...styles.timmerbg,}} onClick={this._sendCode.bind(this)}>{this.state.isSend ? '获取验证码':this.state.count+'s后重新获取'}</div>
              </div>
            </div>

              <div style={{clear:'both',height:0,overflow:'hidden'}}></div>
              <div style={styles.buybg}>
                <img src={Dm.getUrl_img('/img/v2/activity/btn_buy.png')} width={devWidth/750*622} height={devHeight/1334*97}/>
                {
                  this.state.isAttend?
                  <div style={styles.buy_text} onClick={this._study.bind(this)}>开始学习</div>
                  :
                  <div style={styles.buy_text} onClick={this._buy.bind(this)}>立即购买</div>
                 }
                 </div>
              </div>

              <div style={styles.tel}>如有疑问，请联系客服&nbsp;400 689 0679</div>
              <div style={{...styles.activityInfo,height:devHeight/1334*260,paddingTop:devHeight/1334*180,display:this.state.errInfo ? 'block':'none'}}>
              {this.state.errInfo}
              </div>
              <div style={{...styles.activityInfo,display:this.state.isAttend ? 'block':'none',paddingTop:devHeight/1334*50,top:devWidth/750*320,height:devHeight/1334*160, lineHeight:'25px'}}>
                <div>您已完成该活动课程购买，</div>快开始学习吧！
              </div>
            </div>
          </div>
          {alertDiv}
        </div>
        <div style={{...styles.yyg_ftbg,}}>
          <img src={Dm.getUrl_img('/img/v2/activity/yyg_bg2.jpg')} width={devWidth} height={181/750*devWidth} style={{position:'absolute',zIndex:2,top:0,left:0,}} />
          <div style={styles.activity_details}>
          1.请在完成购买后，登录铂略官网（www.bolue.cn）或手机登录“铂略财课”（APP/微信服务号）进行学习
          <div>2.活动时间：2017年8月1日~2017年8月31日</div>
          </div>
        </div>
        {formHtml}
      </div>
    )
  }

}

var styles ={
  container:{
    width:devWidth,
    height:devHeight,
    overflowX: 'hidden',
    overflowY:'scroll'
  },
  body_bg:{
    width:devWidth,
    height:1404/750*devWidth,
    position:'relative',
  },
  content_bg:{
    position:'absolute',
    zIndex:2,
    left:devWidth/750*64,
    top:625/750*devWidth,
    width:devWidth-64,
    height:715/750*devWidth,
  },
  activity_relative:{
    position:'relative',
    width:devWidth-64,
    height:devHeight/1334*715,
  },
  yyg_text1:{
    width:devWidth-64,
    height:175/750*devWidth,
    fontSize:13,
    color:'#666',
  },

  inputbg:{
    width:devWidth-66,
    height:devHeight/1334*86,
    backgroundColor:'#fff',
    border:'solid 1px #65605f',
    marginTop:devHeight/1334*25
  },
  input_text:{
    width:devWidth-84,
    height:devHeight/1334*66,
    marginTop:devWidth/750*7,
    paddingLeft:8,
    fontSize:14,
    color:'#333',
    border:'none',
  },
  show_mobile:{
    width:devWidth-64,
    height:devHeight/1334*86,
    marginTop:devWidth/750*30,
    position:'relative',
  },
  mobile_text:{
    width:devWidth-72,
    height:devHeight/1334*86,
    lineHeight:devHeight/1334*86+'px',
    paddingLeft:8,
    fontSize:16,
    color:'#000',
    fontWeight:'bold',
    position:'absolute',
    zIndex:5,
    top:0,
    left:0,
  },
  codebg:{
    width:devWidth/750*390,
    height:devHeight/1334*86,
    backgroundColor:'#fff',
    border:'solid 1px #65605f',
    marginTop:devWidth/750*20,
    float:'left',
  },
  code_text:{
    width:devWidth/750*360,
    height:devHeight/1334*66,
    marginTop:devWidth/750*7,
    paddingLeft:8,
    fontSize:14,
    color:'#333',
    border:'none',
  },
  btnCode:{
    float:'right',
    position:'relative',
    width:devWidth/750*207,
    height:devHeight/1334*85,
    textAlign:'center',
    lineHeight:devHeight/1334*85+'px',
    marginTop:devWidth/750*20,
  },
  timmerbg:{
    width:devWidth/750*207,
    height:devHeight/1334*85,
    fontSize:14,
    color:'#fff',
    textAlign:'center',
    position:'absolute',
    zIndex:5,
    left:0,
    top:0,
  },
  buybg:{
    width:devWidth/750*622,
    height:devHeight/1334*97,
    position:'relative',
    marginTop:devWidth/750*20,
  },
  buy_text:{
    width:devWidth/750*622,
    height:devHeight/1334*97,
    position:'absolute',
    zIndex:5,
    left:0,
    top:0,
    fontSize:16,
    color:'#fff',
    textAlign:'center',
    lineHeight:devHeight/1334*97+'px',
  },
  activityInfo:{
    width:devWidth-64,
    height:210/750*devWidth,
    position:'absolute',
    zIndex:8,
    left:0,
    top:devWidth/750*180,
    textAlign:'center',
    fontSize:18,
    color:'#fff',
    backgroundColor:'#c9c9ca',
  },
  alertDiv:{
    position:'absolute',
    zIndex:10,
    left:devWidth/750*64,
    top:devWidth/750*775,
    width:devWidth-64,
    height:devHeight/1334*266,
    paddingTop:devWidth/750*50,
    textAlign:'center',
    fontSize:18,
    color:'#fff',
    backgroundColor:'#000',
    opacity:0.8,
  },
  tel:{
    fontSize:13,
    color:'#898989',
    textAlign:'center',
    width:devWidth-64,
    marginTop:devWidth/750*30,
  },
  yyg_ftbg:{
    position:'relative',
    width:devWidth,
    height:181/750*devWidth,
  },
  activity_details:{
    position:'absolute',
    zIndex:3,
    width:devWidth-60,
    height:120/750*devWidth,
    left:devWidth/750*62,
    top:devHeight/1334*60,
    lineHeight:'18px',
    fontSize:12,
    color:'#fff',
  },

}

export default yygmb;
