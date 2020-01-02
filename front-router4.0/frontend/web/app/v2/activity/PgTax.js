import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import ActivityAlert from './ActivityAlert';
import funcs from '../util/funcs'

var t;

class PgTax extends React.Component {
  constructor(props) {
      super(props);
      this.wx_config_share_home = {
  				title: '加强版税政通2.0隆重登场',
  				desc: '直播学习新体验，绝不辜负您的新期待',
  				link: document.location.href + '',
  				imgUrl: Dm.getUrl_img('/img/v2/activity/tax/share.png'),
  				type: 'link'
  		}
      this.state={
        name:'',
        telephone:'',
        company:'',
        success:'',
        isShow:false,
      }

  }
  _handleSpecialDone(){

  }
  componentDidMount(){

    var phoneWidth =  parseInt(window.screen.width);//屏幕宽度
    var phoneHeight = parseInt(window.screen.height);//屏幕高度

    //根据不同机型做适配
    global.scalePage = function(tmpScale){
      var phoneScale = tmpScale;//网页根据手机分辨率缩放的比例系数
      var ua = navigator.userAgent;
      var oMeta = document.getElementsByTagName('meta')[1];//meta标签中第二个
      if (/Android (\d+\.\d+)/.test(ua)){
          var version = parseFloat(RegExp.$1);
          if(version>2.3){
            oMeta.content = 'width=750, minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi,user-scalable=no';
          }else{
            oMeta.content = 'width=750, target-densitydpi=device-dpi,user-scalable=no';
          }
      } else {
        oMeta.content = 'width=750,minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi,user-scalable=no';
      }
    }
    //初始化时适配页面
    scalePage(phoneWidth/750);
    //手机转屏
    window.addEventListener("orientationchange", function(event) {
     // 根据event.orientation|screen.orientation.angle等于0|180、90|-90度来判断横竖屏
     var tmpScale;
     if(window.orientation==180||window.orientation==0){//竖屏状态
       //竖屏页面缩放比例系数
        tmpScale = phoneWidth/750;
     }
     if(window.orientation==90||window.orientation==-90){//横屏状态
       //横屏页面缩放比例系数
       tmpScale = phoneHeight/750;
     }
     scalePage(tmpScale);
    }, false);


    Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

    EventCenter.emit("SET_TITLE",'铂略财务培训');
    this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
  }

  componentWillMount(){

  }

  componentWillUnmount(){
    this._getSpecialDone.remove()
    // clearTimeout(t)
    window.removeEventListener("orientationchange", false)//解除绑定

    scalePage(window.screen.width);
    //销毁当前屏幕固定适配宽度
    var ua = navigator.userAgent;
    var oMeta = document.getElementsByTagName('meta')[1];//meta标签中第二个
    oMeta.content = "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no";

  }


  	_handleSpecialDone(re){
  		console.log('_handleSpecialDone==',re);
  		if(re.result){
  			this.setState({
  				success: true,
  				isShow: true,
  				title:'您的申请已经成功提交稍后将会有工作人员与您联系'
  			})
  		}
  		if(re.err){
  			this.setState({
  				isShow: true,
  				title:re.err
  			})
  		}
  	}

  	_onChangeName(e){
      e.preventDefault();
      var v = e.target.value.trim();
        this.setState({
          name: v,
        })
     }

    _onChangeCompany(e){
      e.preventDefault();
      var v = e.target.value.trim();
        this.setState({
          company: v,
        })
    }
    _onChangeTelephone(e){
      e.preventDefault();
      var v = e.target.value.trim();
        this.setState({
          telephone: v,
        })
    }

  	onClickSpecial(){
  		if (!this.state.company) {
  				this.onIsShow('公司不能为空')
  			return false;
  		}
  		if (!this.state.telephone) {
  			this.onIsShow('电话不能为空')
  			return false;
  		}
  		if(!isCellPhoneAvailable(this.state.telephone)){
        this.onIsShow('请输入正确的手机号码')
        return false;
      }

  		Dispatcher.dispatch({
  			actionType: 'Special',
  			name:this.state.name,
  			phone: this.state.telephone,
  			company: this.state.company,
  			isCima:false,//用来区分是cima单页还是其他单页
  			url: document.location.href + '',
  			title:'财务Excel大作战(移动端)'
  		})
  	}

    _hide(){
      this.setState({
        isShow:false,
        success:false,
        company:'',
        telephone:''
      })
    }

  	onIsShow(re){
  		this.setState({
  			isShow: true,
  			title: re
  		},()=>{
  			t = setTimeout(() => {
  				this.setState({
  					isShow: false
  				})
  			}, 1000)
  		})
  	}


  	//跳转到首页
  	_goHomePage(){
  		window.location="https://mb.bolue.cn";
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
        window.location.href='https://mb.bolue.cn/freeInvited'
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
        <div>
          <img src={Dm.getUrl_img(`/img/v2/activity/tax/banner.jpg`)} style={{width:'100%',height:393}}/>
        </div>
        <div style={styles.text1}>
          面对海量新政，税务人早已累觉不爱
        </div>
        <div style={styles.title_box}>
          <div style={styles.box1}>
            <div style={{paddingTop:45}}>更新频繁</div>
            <div style={{fontWeight:'bold'}}>难跟上</div>
          </div>
          <div style={{...styles.box1,backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_pic2.jpg`)+')',
            marginLeft:20}}>
            <div style={{paddingTop:45}}>理论实操</div>
            <div style={{fontWeight:'bold'}}>难衔接</div>
          </div>
          <div style={{...styles.box1,backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_pic3.jpg`)+')',
            marginLeft:20}}>
            <div style={{paddingTop:45}}>解读空乏</div>
            <div style={{fontWeight:'bold'}}>难落地</div>
          </div>
        </div>
        <div style={styles.bg2}>
          <div style={styles.text2}>加强版税政通2.0隆重登场</div>
          <div style={styles.text3}>直播学习新体验，绝不辜负您的新期待</div>
            <div style={styles.text_box1}>
              <div style={{...styles.left_text}}>日新<br/>月著</div>
              <div style={{...styles.right_text,color:'#82c040'}}>持续跟进热点税政</div>
            </div>
            <div style={{...styles.text_box1,backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_bg3.png`)+')',marginTop:25}}>
              <div style={{...styles.left_text}}>提纲<br/>挈领</div>
              <div style={{...styles.right_text,color:'#23b8c5'}}>系统解读政策细节</div>
            </div>
            <div style={{...styles.text_box1,backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_bg4.png`)+')',marginTop:25}}>
              <div style={{...styles.left_text}}>有的<br/>放矢</div>
              <div style={{...styles.right_text,color:'#658bfa'}}>权威分享实务洞见</div>
            </div>
            <div style={{...styles.icon_bg}}>
              {/*<img src={Dm.getUrl_img(`/img/v2/activity/tax/tax_icon1.png`)} style={{width:33,height:32,float:'left'}}/>*/}
              <div style={styles.icon_text}>新政颁布当天开放直播课程预约通道，三个工作日内讲解新政要点</div>
            </div>
            <div style={{...styles.icon_bg,margin:'30px 0 0 40px',backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_icon2.png`)+')'}}>
              {/*<img src={Dm.getUrl_img(`/img/v2/activity/tax/tax_icon2.png`)} style={{width:'33px',height:32,float:'left'}}/>*/}
              <div style={styles.icon_text}>链接专题网课，构建学习路径，系统化掌握税政新知</div>
            </div>
        </div>
        <div style={styles.text_box2}>
          <div style={{...styles.text2}}>第一时间汇集税界大V</div>
          <div style={{...styles.text3,paddingTop:20}}>精准解读新政 助力企业实务</div>
        </div>
        <div style={{backgroundColor:'#fff',paddingBottom:55}}>
          <div style={{...styles.photo_box}}>
            <div style={{...styles.photo1}}>
              <div style={styles.photo_bottom}>
                <div style={{fontSize:26,paddingLeft:15,float:'left'}}>王珲</div>
                <div style={{fontSize:18,paddingLeft:15,float:'left'}}>国际税收实战专家</div>
              </div>
            </div>
            <div style={{...styles.photo1,...styles.photo2,marginLeft:19}}>
              <div style={styles.photo_bottom}>
                <div style={{fontSize:26,paddingLeft:15,float:'left'}}>蔡嘉</div>
                <div style={{fontSize:18,paddingLeft:15,float:'left'}}>绿地集团前财务副总裁</div>
              </div>
            </div>
          </div>
          <div style={{...styles.photo_box,marginTop:30}}>
            <div style={{...styles.photo1,...styles.photo3}}>
              <div style={styles.photo_bottom}>
                <div style={{fontSize:26,paddingLeft:10,float:'left'}}>汪蔚青</div>
                <div style={{fontSize:17,paddingLeft:10,float:'left',lineHeight:'24px'}}>国家税务总局<br/>中国国际税收研究会学术委员</div>
              </div>
            </div>
            <div style={{...styles.photo1,...styles.photo4,marginLeft:19}}>
              <div style={styles.photo_bottom}>
                <div style={{fontSize:26,paddingLeft:10,float:'left'}}>王越</div>
                <div style={{fontSize:17,paddingLeft:10,float:'left',lineHeight:'24px'}}>国家税务总局稽查局人才库成员<br/>著名税务实战专家</div>
              </div>
            </div>
          </div>
          <div style={{...styles.photo_box,marginTop:30}}>
            <div style={{...styles.photo1,...styles.photo5}}>
              <div style={styles.photo_bottom}>
                <div style={{fontSize:26,paddingLeft:15,float:'left'}}>陈栋</div>
                <div style={{fontSize:18,paddingLeft:15,float:'left',}}>著名税务实务专家</div>
              </div>
            </div>
            <div style={{...styles.photo1,...styles.photo6,marginLeft:19}}>
              <div style={styles.photo_bottom}>
                <div style={{fontSize:26,paddingLeft:15,float:'left'}}>李兆婴</div>
                <div style={{fontSize:18,paddingLeft:15,float:'left'}}>PKF China高级合伙人</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{backgroundColor:'#fff',paddingBottom:50}}>
          <div style={{width:'100%',height:31,lineHeight:'31px',textAlign:'center'}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/tax/tax_icon3.png`)} style={{width:'40px',height:31,}}/>
            <span style={{marginLeft:20,fontSize:30,color:'#666',fontFamily:'微软雅黑'}}>新政要点早知道</span>
          </div>
          <div style={{width:'100%',height:31,lineHeight:'31px',textAlign:'center',paddingTop:50}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/tax/tax_icon3.png`)} style={{width:'40px',height:31,}}/>
            <span style={{marginLeft:20,fontSize:30,color:'#666',fontFamily:'微软雅黑'}}>税务风险早规避</span>
          </div>
          <div style={{width:'100%',height:31,lineHeight:'31px',textAlign:'center',paddingTop:50}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/tax/tax_icon3.png`)} style={{width:'40px',height:31,}}/>
            <span style={{marginLeft:20,fontSize:30,color:'#666',fontFamily:'微软雅黑'}}>企业优惠早享受</span>
          </div>
        </div>
        <div style={{backgroundColor:'#e2e6ea',width:'100%',paddingBottom:140}}>
           <div style={{paddingTop:60,fontSize:42,color:'#595757',textAlign:'center',fontFamily:'微软雅黑'}}>
             体验视频及直播课程
           </div>
           <div style={{paddingTop:55,paddingBottom:50,}}>
               <input style={{...styles.inputText,}} type="text" value={this.state.name} placeholder=" 姓名" onChange={this._onChangeName.bind(this)}/>
               <input style={{...styles.inputText}} type="text" value={this.state.company} placeholder=" 公司" onChange={this._onChangeCompany.bind(this)}/>
               <input style={{...styles.inputText}} type="text" value={this.state.telephone} placeholder=" 手机/电话" onChange={this._onChangeTelephone.bind(this)}/>
               <div style={{...styles.button,}} onClick={this.onClickSpecial.bind(this)}>
                 立即注册
               </div>
           </div>
        </div>
        <div style={{position:'fixed',zIndex:999,bottom:0,left:0,width:'100%',height:140,backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_footer.jpg`)+')',
        backgroundRepeat:'no-repeat',backgroundSize:'cover',}}>
          <div style={{width:'100%',height:140,color:'#658bfa',fontSize:24,textAlign:'center'}}>
            <div style={{width:187.5,float:'left',height:50,paddingTop:90}} onClick={this._goHomePage.bind(this)}>铂略首页</div>
            <div style={{width:187.5,float:'left',height:140,}}>
              <a href={tel_link} style={{display:'inline-block',width:187,height:50,paddingTop:90,}}><span style={{color:'#658bfa',fontSize:24,}}>一键拨号</span></a>
            </div>
            <div style={{width:187.5,float:'left',height:50,paddingTop:90}} onClick={this._goLink.bind(this)}>在线咨询</div>
            <div style={{width:187.5,float:'left',height:50,paddingTop:90,}} onClick={this._goBack.bind(this)}>返回顶部</div>
          </div>
        </div>

        <div style={{...styles.show_box,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
         <div style={{...styles.bookDiv, display: this.state.isShow ? 'block' : 'none'}}>
          <p style={{...styles.bookTitle}}>{this.state.success ? '提交成功' :'提交失败'}</p>
          <p style={{textAlign: 'center', color: '#333', fontSize: 25, marginTop: 10, marginBottom: 13}}>{this.state.title}</p>
          {
            this.state.success ?
              <div style={{...styles.btn_ok,marginLeft:110,fontWeight: 'bold'}} onClick={this._propAlert.bind(this)}>
                确定
              </div>
              :
             null
           }
         </div>
     </div>
    )
  }

}

var styles ={
  container:{
    width:'100%',
    overflowY:'scroll',
    backgroundColor:'#fff',
  },
  text1:{
    width:'100%',
    backgroundColor:'#fff',
    paddingTop:85,
    paddingBottom:45,
    fontSize:42,
    fontFamily:'微软雅黑',
    color:'#595757',
    textAlign:'center',
    borderBottom:'solid 1px #f7f7f7'
  },
  title_box:{
    padding:'40px 40px 60px 40px',
    backgroundColor:'#fff',
    overflow:'hidden',
  },
  box1:{
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_pic1.jpg`)+')',
    backgroundRepeat:'no-repeat',
    backgroundSize:'100%',
    width:210,
    height:196,
    float:'left',
    fontSize:36,
    color:'#fff',
    fontFamily:'微软雅黑',
    textAlign:'center'
  },
  bg2:{
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_bg1.jpg`)+')',
    backgroundRepeat:'no-repeat',
    backgroundSize:'100%',
    width:'100%',
    height:922,
  },
  text2:{
    fontSize:38,
    fontWeight:'bold',
    color:'#ff8669',
    fontFamily:'微软雅黑',
    width:'100%',
    textAlign:'center',
    paddingTop:60,
  },
  text3:{
    fontSize:32,
    color:'#333',
    fontFamily:'微软雅黑',
    width:'100%',
    textAlign:'center',
    paddingTop:30,
  },
  text_box1:{
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_bg2.png`)+')',
    backgroundRepeat:'no-repeat',
    backgroundSize:'100%',
    width:453,
    height:141,
    margin:'50px auto 0 auto',
    overflow:'hidden'
  },
  left_text:{
    fontSize:32,
    color:'#fff',
    fontFamily:'微软雅黑',
    width:150,
    textAlign:'center',
    paddingTop:20,
    float:'left'
  },
  right_text:{
    fontSize:32,
    fontFamily:'微软雅黑',
    width:300,
    textAlign:'center',
    paddingTop:40,
    float:'left'
  },
  icon_text:{
    fontSize:22,
    fontFamily:'微软雅黑',
    color:'#333',
    lineHeight:'32px',
    // float:'left',
    marginLeft:42
  },
  text_box2:{
    backgroundColor:'#fff',
    width:'100%',
    paddingBottom:50,
  },
  photo_box:{
    padding:'0 28px',
    height:304,
    overflow:'hidden'
  },
  photo1:{
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_photo1.jpg`)+')',
    backgroundRepeat:'no-repeat',
    backgroundSize:'100%',
    width:337,
    height:304,
    float:'left',
    position:'relative'
  },
  photo2:{
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_photo2.jpg`)+')',
    float:'left'
  },
  photo3:{
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_photo3.jpg`)+')',
    float:'left'
  },
  photo4:{
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_photo4.jpg`)+')',
    float:'left'
  },
  photo5:{
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_photo5.jpg`)+')',
    float:'left'
  },
  photo6:{
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_photo6.jpg`)+')',
    float:'left'
  },
  photo_bottom:{
    position:'absolute',
    zIndex:2,
    left:0,
    bottom:0,
    width:'100%',
    height:52,
    color:'#fff',
    lineHeight:'52px',
    overflow:'hidden',
  },
  inputText:{
		padding:'5px 10px',
		width:545,
		height:48,
		lineHeight:'48px',
		marginLeft:92.5,
		border:'none',
		backgroundColor:'#fff',
		borderRadius:4,
    border:'solid 1px #d1d7e1',
		color:'#adacaa',
		fontSize: '25px',
		marginBottom:35,
    display:'bock',
    overflow:'hidden'
	},
	button:{
		fontSize:25,
		color:'#fff',
		backgroundColor:'#ff8669',
		borderRadius:8,
		textAlign:'center',
		width:318,
		height:68,
		lineHeight:'68px',
		marginLeft:225,
	},
  show_box:{
    width:'100%',
    height:1334,
    backgroundColor:'#cccccc',
    position:'fixed',
    opacity: 0.5,
    zIndex: 100,
    bottom:0,
  },
  bookDiv: {
    position: 'fixed',
    zIndex: 999,
    bottom: 280,
		left:0,
    width: 420,
    height: 220,
    backgroundColor: '#fff',
    marginLeft: 165,
    borderRadius: 12
  },
  bookTitle: {
    textAlign: 'center',
    fontSize: 25,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 16
  },
  btn_ok: {
    width: 200,
    textAlign: 'center',
    marginTop: 8,
    color: '#fff',
    display: 'inline-block',
    fontSize: 25,
    backgroundColor:'#2196f3',
    borderRadius:6
  },
  icon_bg:{
    margin:'60px 0 0 40px',
    overflow:'hidden',
    height:34,
    backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/tax/tax_icon1.png`)+')',
    backgroundRepeat:'no-repeat',
    backgroundPosition:'top left',
  }

}

export default PgTax;
