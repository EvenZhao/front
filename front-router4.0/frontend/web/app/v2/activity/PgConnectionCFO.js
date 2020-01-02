import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import ActivityAlert from './ActivityAlert';
import funcs from '../util/funcs'

var t
class PgConnectionCFO extends React.Component {
  constructor(props) {
      super(props);
      this.wx_config_share_home = {
  				title: '汇聚领先企业CFO，收获知识、经验和洞见',
  				desc: '新启发、新思路、新突破，铂略“连线CFO”系列直播课程',
  				link: document.location.href + '',
  				imgUrl: Dm.getUrl_img('/img/v2/activity/cfo_share.png'),
  				type: 'link'
  		}
      this.state={
        name:'',
        company:'',
        telephone:'',
        isShow:false,
        success:false,
        title: 'PgHome',
        top: 0,
        height:0,
      }
  }
  componentDidMount(){
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })
    EventCenter.emit("SET_TITLE",'铂略财课-连线CFO系列直播课程');
    this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
  }

  componentWillMount(){

  }

  componentWillUnmount(){

  }

  //跳转到首页
  _goHomePage(){
    window.location="https://mb.bolue.cn";
    // window.location.href = `${__rootDir}`
  }
   //返回顶部
   _goBack(){
    // window.scrollTo(0,0);
    this.currentPage.scrollTop = 0;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop =0
   }
   //在线咨询
  _goLink(){
    if(isWeiXin){
      // this.props.history.push({pathname: `${__rootDir}/freeInvited`})
      // window.location.href='https://mb.bolue.cn/freeInvited'
      window.location.href = `${__rootDir}/freeInvited`
    }else {
      window.location.href='https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
    }
  }

  _propAlert(re){
    window.location="https://mb.bolue.cn";
  }

  render(){
    var tel_link = 'tel://400-616-3899';
    return(
      <div style={{...styles.container}} ref={(currentPage) => this.currentPage = currentPage}>
        <div style={{width:devWidth,backgroundColor:'#fff'}}>
          <img src={Dm.getUrl_img(`/img/v2/activity/cfo_top.jpg`)} width={devWidth} height={devWidth*(2846.5/375)} />
          <div style={{...styles.form_box}}>
            <div style={{...styles.form_div}}>
            <div style={{width:devWidth,textAlign:'center',}}>
              <span style={{fontSize:18,color:'#595757'}}>体验视频及直播课程</span>
            </div>
            <div style={{...styles.line,marginTop:20,}}></div>
            <input style={{...styles.inputText,marginTop:20,}} type="text" value={this.state.name} placeholder=" 姓名" onChange={this._onChangeName.bind(this)}/>
            <input style={{...styles.inputText}} type="text" value={this.state.company} placeholder=" 公司" onChange={this._onChangeCompany.bind(this)}/>
            <input style={{...styles.inputText}} type="text" value={this.state.telephone} placeholder=" 手机/电话" onChange={this._onChangeTelephone.bind(this)}/>
            <div style={{...styles.button}} onClick={this.onClickSubmit.bind(this)}>
              <span style={{color:'#fff'}}>立即注册</span>
            </div>
            </div>
          </div>

          <div style={{position:'fixed',zIndex:999,bottom:0,left:0,width:devWidth,height:devWidth*(70/375),backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/cfo_footer.jpg`)+')',
          backgroundRepeat:'no-repeat',backgroundSize:'cover',}}>
            <div style={{width:devWidth,height:devWidth*(70/375),color:'#4db2aa',fontSize:12,textAlign:'center'}}>
              <div style={{width:devWidth/4-2,float:'left',height:devWidth*(50/375),paddingTop:devWidth*(45/375)}} onClick={this._goHomePage.bind(this)}>铂略首页</div>
              <div style={{width:devWidth/4-2,float:'left',height:devWidth*(70/375),}}>
                <a href={tel_link} style={{display:'inline-block',width:devWidth/4-2,height:devWidth*(50/375),paddingTop:devWidth*(45/375),}}><span style={{color:'#4db2aa',fontSize:12,}}>一键拨号</span></a>
              </div>
              <div style={{width:devWidth/4-2,float:'left',height:devWidth*(50/375),paddingTop:devWidth*(45/375)}} onClick={this._goLink.bind(this)}>在线咨询</div>
              <div style={{width:devWidth/4-2,float:'left',height:devWidth*(50/375),paddingTop:devWidth*(45/375),}} onClick={this._goBack.bind(this)}>返回顶部</div>
            </div>
          </div>
        </div>
        <div style={{...styles.show_box,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
        <ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
      </div>
    )
  }

  //输入姓名
  _onChangeName(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    if(this.state.name && input_text.length>0){
      this.setState({
        name:input_text,
      });
    }
    else {
      this.setState({
        name:input_text,
      });
    }
  }

  //输入公司
  _onChangeCompany(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    if(this.state.company && input_text.length>0){
      this.setState({
        company:input_text,
      });
    }
    else {
      this.setState({
        company:input_text,
      });
    }
  }

  //输入电话
  _onChangeTelephone(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    this.setState({
      telephone:input_text,
    });
  }

  //提示框
  onIsShow(re){
		console.log('onIsShow',re);
		this.setState({
			isShow: true,
			title: re
		},()=>{
			t = setTimeout(() => {
				this.setState({
					isShow: false,
				})
			}, 1000)
		})
	}

  //注册
  onClickSubmit(){
    if (!this.state.company) {
        this.onIsShow('公司不能为空')
      return
    }

    if (!this.state.telephone) {
      this.onIsShow('电话不能为空')
      return
    }
    if(!isCellPhoneAvailable(this.state.telephone)){
      this.onIsShow('请输入正确的手机号码')
      return
    }

    Dispatcher.dispatch({
      actionType: 'Special',
      name:this.state.name,
      phone: this.state.telephone,
      company: this.state.company,
      isCima:false,
      url: document.location.href + '',
      title:'连线CFO（移动端）',
    });
  }

  _hide(){
    this.setState({
      isShow:false,
      success:false,
      name:'',
      company:'',
      telephone:''
    })
  }


  _handleSpecialDone(re){
    if(re.result){
			this.setState({
				success: true,
				isShow: true,
				title:'您的申请已经成功提交稍后将会有工作人员与您联系',
			});
		}
		if(re.err){
			this.setState({
				isShow: true,
				title:re.err
			});
		}
  }
}

var styles ={
  container:{
    width:devWidth,
    height:devHeight,
    overflowX: 'hidden',
  },
  form_box:{
    height:350,
    paddingBottom:30,
    width:devWidth,
    backgroundColor:'#fff',
  },
  form_div:{
    width:devWidth,
    backgroundColor:'#fff',
  },
  inputText:{
  		height:32,
      paddingLeft:8,
  		width: devWidth - 99,
  		marginLeft:(devWidth-(devWidth -91))/2,
  		marginBottom:18,
      borderRadius:4,
      border:'none',
      borderStyle:'solid',
      borderWidth:1,
      borderColor:'#c5cdda',
  },
  button:{
    backgroundColor:'#e79012',
    textAlign:'center',
    height:'31px',
    lineHeight:'31px',
    width:devWidth-215.5,
    borderRadius: 4,
  	marginLeft: (devWidth-(devWidth-215.5))/2,
    marginTop:14,
  },
  show_box:{
    width: devWidth,
    height: devHeight,
    backgroundColor:'#cccccc',
    position:'absolute',
    opacity: 0.5,
    zIndex: 998,
    top:0,
  },
  line:{
    width:devWidth,
    height:1,
    backgroundColor:'#f7f7f7',
  }

}

export default PgConnectionCFO;
