import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import funcs from '../util/funcs'

var t;

// 移动web捕获虚拟键盘弹出和关闭事件，一般用于input获取焦点弹出虚拟键盘，同时调整可是范围。以下js可以实现此效果：
// var wHeight = window.innerHeight;   //获取初始可视窗口高度
// window.onresize = function() {         //监测窗口大小的变化事件
// 	var hh = window.innerHeight;     //当前可视窗口高度
// 	var viewTop = document.body.scrollTop;   //可视窗口高度顶部距离网页顶部的距离
// 	if(wHeight > hh){//可以作为虚拟键盘弹出事件
// 	// $("body,html").animate({scrollTop:viewTop+100});    //调整可视页面的位置
// 		document.body.scrollTop = viewTop + 200;
// 	}else{ //可以作为虚拟键盘关闭事件
// 	// $("body,html").animate({scrollTop:viewTop-100});
// 		document.body.scrollTop = viewTop - 200;
// 	}
//   wHeight = hh;
// }

//window.adaptVP=function(a){function c(){var c,d;return b.uWidth=a.uWidth?a.uWidth:640,b.dWidth=a.dWidth?a.dWidth:window.screen.width||window.screen.availWidth,b.ratio=window.devicePixelRatio?window.devicePixelRatio:1,b.userAgent=navigator.userAgent,b.bConsole=a.bConsole?a.bConsole:!1,a.mode?(b.mode=a.mode,void 0):(c=b.userAgent.match(/Android/i),c&&(b.mode="android-2.2",d=b.userAgent.match(/Android\s(\d+.\d+)/i),d&&(d=parseFloat(d[1])),2.2==d||2.3==d?b.mode="android-2.2":4.4>d?b.mode="android-dpi":d>=4.4&&(b.mode=b.dWidth>b.uWidth?"android-dpi":"android-scale")),void 0)}function d(){var e,f,g,h,c="",d=!1;switch(b.mode){case"apple":c="width="+b.uWidth+", user-scalable=1";break;case"android-2.2":a.dWidth||(b.dWidth=2==b.ratio?720:1.5==b.ratio?480:1==b.ratio?320:.75==b.ratio?240:480),e=window.screen.width||window.screen.availWidth,320==e?b.dWidth=b.ratio*e:640>e&&(b.dWidth=e),b.mode="android-dpi",d=!0;case"android-dpi":f=160*b.uWidth/b.dWidth*b.ratio,c="target-densitydpi="+f+", width="+b.uWidth+", user-scalable=1",d&&(b.mode="android-2.2");break;case"android-scale":c="width="+b.uWidth+", user-scalable=1"}g=document.querySelector("meta[name='viewport']")||document.createElement("meta"),g.name="viewport",g.content=c,h=document.getElementsByTagName("head"),h.length>0&&h[0].appendChild(g)}function e(){var a="";for(key in b)a+=key+": "+b[key]+"; ";alert(a)}if(a){var b={uWidth:0,dWidth:0,ratio:1,mode:"apple",userAgent:null,bConsole:!1};c(),d(),b.bConsole&&e()}};

//document.body.style.overflowY = 'scroll';

class PgExcel extends React.Component {
	constructor(props) {
	    super(props);
      this.wx_config_share_home = {
  				title: '解救“表”哥“表”姐正当时！',
  				desc: '铂略重磅推出《财务Excel大作战》专项课程包',
  				link: document.location.href + '',
  				imgUrl: Dm.getUrl_img('/img/v2/icons/CwdzzShare.jpg'),
  				type: 'link'
  		};
  		this.state = {
  			title: 'PgHome',
				name:'',
				company:'',
				telephone:'',
				success: false,
				isShow:false,
  		};
	}

	componentDidMount() {
		//document.body.style.fontFamily = 'Microsoft Yahei';
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
        oMeta.content = 'width=750,minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', user-scalable=no, target-densitydpi=device-dpi,user-scalable=no';
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

		// document.body.style.width = '750px';
		// adaptVP({uWidth:750})
		// window.addEventListener("orientationchange", function() {  adaptVP && adaptVP(750); }, false);

		EventCenter.emit("SET_TITLE",'铂略财课-财务Excel大作战')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

		this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
	}
	componentWillUnmount() {
    this._getSpecialDone.remove()
		clearTimeout(t)
		window.removeEventListener("orientationchange", false)//解除绑定
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
		return (
		<div style={{...styles.container}} ref={(currentPage) => this.currentPage = currentPage} >
        <div style={{width:'100%',height:400}}>
          <img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_banner.jpg`)} style={{width:'100%',height:400}}/>
        </div>
        <div style={{backgroundColor:'#fff',width:'100%'}}>
          <div style={{width:'100%',height:2,paddingTop:60}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_line.jpg`)} height={2} width={'100%'}/>
          </div>
          <div style={{width:'100%',paddingTop:50}}>
						<div style={{width:402,marginLeft:174,height:50,backgroundColor:'#333',fontWeight:'bold', borderRadius:100,color:'#fff',fontSize:30,}}>
							<span style={{display:'inline-block',width:194,height:50,backgroundColor:'#1fb6c4',textAlign:'center',borderRadius:100,}}>
							财务人员的
							</span>
							<span style={{marginLeft:10}}>"EXCEL之痛"</span>
						</div>
					</div>
          <div style={{height:326,width:'100%',paddingTop:108}}>
            <div style={{...styles.blue_box,marginLeft:36}}>
                <div style={{width:115,height:115,position:'absolute',top:-57.5,left:45.5}}>
                  <img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_head1.png`)} height={115} width={115}/>
                </div>
                <div style={{...styles.content,}}>
                  <div style={{...styles.title,}}>财务小白之痛</div>
                  <div style={{...styles.line}}></div>
                  <div style={{fontSize:24,marginTop:10,paddingLeft:10,width:170}}>
                    函数公式不会用，加班都是<br/>因为重复劳动，一张“ 表 ”成万骨枯。
                  </div>
                </div>
            </div>
						<div style={{...styles.blue_box,marginLeft:26}}>
                <div style={{width:115,height:115,position:'absolute',top:-57.5,left:45.5}}>
                  <img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_head2.png`)} height={115} width={115}/>
                </div>
								<div style={{...styles.content}}>
                  <div style={{...styles.title}}>财务专员之痛</div>
									<div style={{...styles.line}}></div>
									<div style={{fontSize:24,marginTop:10,paddingLeft:15,width:160}}>
                    本来想用VBA玩转EXCEL，没想到最后却被VBA玩。
                  </div>
                </div>
            </div>
						<div style={{...styles.blue_box,marginLeft:26}}>
	             <div style={{width:115,height:115,position:'absolute',top:-57.5,left:45.5}}>
	                <img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_head3.png`)} height={115} width={115}/>
	              </div>
								<div style={{...styles.content}}>
	                <div style={{...styles.title}}>财务经理之痛</div>
									<div style={{...styles.line}}></div>
	                <div style={{fontSize:24,marginTop:10,paddingLeft:15,width:160}}>
	                  表格已经一删再删，管理层却还嫌我的图表不够简洁。
	                </div>
	              </div>
            </div>
          </div>
        </div>
        <div style={{width:'100%',height:418,paddingTop:60}}>
          <img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_pic1.jpg`)} height={418} width={'100%'}/>
        </div>
        <div style={{backgroundColor:'#fff',width:'100%',paddingTop:70,height:256,}}>
          <div style={{width:'100%',height:256,backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/excel_img/excel_pic2.jpg`)+')',
					backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
            <div style={{paddingTop:58,left:0,paddingLeft:334,fontSize:26,fontWeight:'bold'}}>
              <div style={{color:'#333',}}>铂略财务培训重磅推出</div>
              <div style={{color:'#1fb6c4'}}>“财务EXCEL大作战” 专题课程包！ </div>
            </div>
          </div>
        </div>
				<div style={{backgroundColor:'#fff',width:'100%',height:196,textAlign:'center',color:'#666',fontSize:26,}}>
					<div style={{paddingTop:30}}>铂略财务培训对600多份财务职场人士进行调研</div>
					<div>找出财务人最关注的EXCEL问题</div>
					<div>牵头数位资深财务总监</div>
					<div>以拟真财务案例为操作背景</div>
				</div>
				<div style={{width:'100%',height:62,paddingTop:20}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_pic3.jpg`)} height={62} width={'100%'}/>
				</div>
				<div style={{position:'relative',backgroundColor:'#FFF', width:'100%',height:224,paddingTop:30,}}>
					<div style={{width:420,height:212,marginLeft:165,border:'solid 6px #1fb6c4',}}></div>
					<div style={{width:700,height:176,backgroundColor:'#f6f6f6',marginLeft:25,position:'absolute',left:0,top:54,fontSize:24,color:'#666',textAlign:'center',}}>
						<div style={{paddingTop:5}}>推出总课长为</div>
						<div style={{color:'#1fb6c4',fontSize:28,fontWeight:'bold'}}>20+小时的“财务EXCEL大作战” 专题课程包</div>
						<div>涵盖图表制作、财务管理、财务分析</div>
						<div>EXCEL基础操作等多方面</div>
					</div>
				</div>
				<div style={{width:'100%',height:2,paddingTop:60,paddingBottom:50,}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_line.jpg`)} height={2} width={'100%'}/>
				</div>
				<div style={{width:462,marginLeft:134,height:50,lineHeight:'50px',backgroundColor:'#333',fontWeight:'bold', borderRadius:100,color:'#fff',fontSize:30,}}>
					<span style={{display:'inline-block',width:225,height:50,backgroundColor:'#1fb6c4',textAlign:'center',borderRadius:100,}}>
					可靠源自于专业
					</span>
					<span style={{marginLeft:10}}>专业源自于精细</span>
				</div>
				<div style={{width:'100%',height:532,position:'relative'}}>
					<img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_pic5.jpg`)} height={532} width={'100%'} style={{position:'absolute',zIndex:2,top:0,left:0,}}/>
					<div style={{width:'100%',height:532,position:'absolute',zIndex:3,left:0,top:0}}>
						<div style={{width:315,height:532,float:'left',textAlign:'center'}}>
							<div style={{fontSize:28,color:'#7d7c7c',fontWeight:'bold',paddingTop:30,}}>
								传统EXCEL培训
							</div>
							<div style={{fontSize:24,color:'#666',}}>
								<div style={{paddingTop:40}}>专职EXCEL讲师</div>
								<div style={{paddingTop:80}}>EXCEL功能多且全</div>
								<div style={{paddingTop:80}}>不提供财务职场表单模板</div>
							</div>
						</div>
						<div style={{width:120,height:532,float:'left',textAlign:'center',fontSize:18,color:'#fff',paddingTop:30}}>
								<div style={{paddingTop:125,height:27}}>经验传授</div>
								<div style={{paddingTop:90}}>行业定制</div>
								<div style={{paddingTop:95}}>实战应用</div>
						</div>
						<div style={{width:315,height:532,float:'right',textAlign:'center'}}>
							<div style={{fontSize:28,color:'#1fb6c4',fontWeight:'bold',paddingTop:30}}>
								铂略EXCEL培训
							</div>
							<div style={{fontSize:24,color:'#666',paddingTop:40,}}>财务总监中的EXCEL高手</div>
							<div style={{fontSize:24,color:'#666',paddingTop:60,}}>结合财务人工作
								<div>根据工作场景选择性学习</div>
							</div>
							<div style={{fontSize:24,color:'#666',paddingTop:65,}}>提供财务职场表单模板</div>
						</div>
						</div>
				 </div>
				 <div style={{width:'100%',height:528,position:'relative',
				 backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/excel_img/excel_pic6.jpg`)+')',
				 backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
						<div style={{width:'100%',textAlign:'center',fontSize:28,color:'#1fb6c4',fontWeight:'bold'}}>
								学习铂略“财务EXCEL大作战”专题课程包<br/>将收获
						</div>
						<div style={{width:'100%',height:266,paddingTop:115}}>
	             <div style={{...styles.blue_box2,marginLeft:148}}>
	                <div style={{...styles.head2,}}>
	                  <img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_head1.png`)} height={100} width={100}/>
	                </div>
	                <div style={{...styles.content2,}}>
	                  <div style={{fontWeight:'bold'}}>财务小白之痛</div>
	                  <div style={{...styles.line2}}></div>
										<div style={{paddingTop:10}}>
	                    掌握EXCEL<br/>实用技巧<br/>和重复机械的<br/>数据整理说不
	                  </div>
	                </div>
	            </div>
							<div style={{...styles.blue_box2,marginLeft:20}}>
	                <div style={styles.head2}>
	                  <img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_head2.png`)} height={100} width={100}/>
	                </div>
	                <div style={{...styles.content2}}>
	                  <div style={{fontWeight:'bold'}}>财务专员</div>
										<div style={{...styles.line2}}></div>
										<div style={{paddingTop:10}}>
	                    灵活玩转<br/>EXCEL<br/>实现财务管理<br/>和分析的职能
	                  </div>
	                </div>
	            </div>
							<div style={{...styles.blue_box2,marginLeft:20}}>
	                <div style={{...styles.head2}}>
	                  <img src={Dm.getUrl_img(`/img/v2/activity/excel_img/excel_head3.png`)} height={100} width={100}/>
	                </div>
	                <div style={{...styles.content2}}>
	                  <div style={{fontWeight:'bold'}}>财务经理</div>
										<div style={{...styles.line2}}></div>
	                  <div style={{paddingTop:10}}>
	                    财务分析<br/>思路大开<br/>图表绘制<br/>言简意赅
	                  </div>
	                </div>
	            </div>
	          </div>
				 </div>
				 <div style={{backgroundColor:'#064f69',width:'100%',paddingBottom:140}}>
				 		<div style={{paddingTop:60,fontSize:30,color:'#fff',textAlign:'center'}}>
							填写信息即可申请免费体验直播或视频课程
						</div>
						<div style={{paddingTop:55,paddingBottom:50,}}>
								<input style={{...styles.inputText,}} type="text" value={this.state.name} placeholder=" 姓名" onChange={this._onChangeName.bind(this)}/>
								<input style={{...styles.inputText}} type="text" value={this.state.company} placeholder=" 公司" onChange={this._onChangeCompany.bind(this)}/>
								<input style={{...styles.inputText}} type="text" value={this.state.telephone} placeholder=" 手机/电话" onChange={this._onChangeTelephone.bind(this)}/>
								<div style={{...styles.button,}} onClick={this.onClickSpecial.bind(this)}>
									提交
								</div>
						</div>
				 </div>
				 <div style={{position:'fixed',zIndex:999,bottom:0,left:0,width:'100%',height:140,backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/excel_img/excel_footer.jpg`)+')',
         backgroundRepeat:'no-repeat',backgroundSize:'cover',}}>
           <div style={{width:'100%',height:140,color:'#24427b',fontSize:24,textAlign:'center'}}>
             <div style={{width:187.5,float:'left',height:50,paddingTop:90}} onClick={this._goHomePage.bind(this)}>铂略首页</div>
             <div style={{width:187.5,float:'left',height:140,}}>
               <a href={tel_link} style={{display:'inline-block',width:187,height:50,paddingTop:90,}}><span style={{color:'#24427b',fontSize:24,}}>一键拨号</span></a>
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
		);
	}
}
var styles = {
  container:{
    width:750,
		backgroundColor:'#fff',
		// overflowY:'scroll',
		// overflowX:'hidden',
  },
  blue_box:{
    position:'relative',
    backgroundColor:'#1fb6c4',
    border:'solid 1px #1cb1bf',
    borderRadius:8,
    float:'left',
		width:206,
		height:350
  },
	blue_box2:{
    position:'relative',
    backgroundColor:'#1fb6c4',
    border:'solid 1px #1cb1bf',
    borderRadius:8,
    float:'left',
		width:176,
		height:264
  },
	head2:{
		width:100,
    height:100,
    position:'absolute',
    top:-50,
		left:39
	},
  content:{
    paddingLeft:14,
    paddingRight:14,
    color:'#fff',
		paddingTop:75,
  },
	content2:{
    paddingLeft:5,
    paddingRight:5,
    color:'#fff',
		paddingTop:60,
		textAlign:'center',
		fontSize:22
  },
  title:{
    fontWeight:'bold',
    textAlign:'center',
		fontSize:28
  },
  line:{
    backgroundColor:'#178f99',
    borderTop:'solid 1px #4ab5bc',
    borderBottom:'solid 1px #139ca8',
    marginTop:5,
		height:1,
		width:174,
  },
	line2:{
    backgroundColor:'#4eaab4',
    borderBottom:'solid 1px #027882',
    marginTop:5,
		width:148,
		height:1,
		marginLeft:10
	},
  fnt_size:{
    fontSize:12,
    lineHeight:'18px',
    marginTop:5
  },
	inputText:{
		padding:'5px 10px',
		width:545,
		height:48,
		lineHeight:'48px',
		marginLeft:92.5,
		border:'none',
		backgroundColor:'#336f84',
		borderRadius:4,
		color:'#fff',
		fontSize:22,
		marginBottom:35
	},
	button:{
		fontSize:25,
		color:'#fff',
		backgroundColor:'#e48e00',
		borderRadius:8,
		textAlign:'center',
		width:300,
		height:65,
		lineHeight:'65px',
		marginLeft:225,
	},
	mask:{
	  backgroundColor:'#cccccc',
	  position:'absolute',
	  opacity: 0.5,
	  zIndex: 998,
	  bottom:0,
		left:0,
		width:'100%',
		height:1334,
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
  hr: {
    marginTop: 4,
    border: 'none',
    height: 1,
    backgroundColor: '#d3d3d3'
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

};
export default PgExcel;
