import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

var urlll = document.location.href; // 获取当前url链接
var ttt = urlll.split('activity')[1]



class DownloadApp extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
      display:(ttt) ? 'none':'block',
			SafariDisplay:'none',
		};

	}
	closeDownLoad(re){
		localStorage.setItem("DownloadAppTime", Date.now())
		this.setState({
			display:'none'
		})
		// 记录用户关闭
		sessionStorage.setItem("userClosed",true)
		// 通知首页搜索栏
		// console.log('hehehe')
		EventCenter.emit('getDownLoadAppDisplay','none')
	
	}
	gotoDownLoad(re){
		if (isWeiXin) {
			 this.setState({
				 SafariDisplay: 'block',
				 display: 'none'
			 })
		}else if(isApple) {
			window.location.href = "bolue://?url=" + window.location.href
			// var hasApp = true, t = 1000
			setTimeout(function() {
				// if(!hasApp) {
					window.location="https://mb.bolue.cn/dlapp";
				// }
			}, 2000);
			// var t1 = Date.now()
			// var ifr = document.createElement("iframe")
			// ifr.src = "bolue://?url=" + window.location.href
			// ifr.style.display = "none"
			// document.getElementsByTagName("body")[0].appendChild(ifr)
			// setTimeout(function() {
			// 	var t2 = Date.now()
			// 	if(!t1 || t2 - t1 < t + 200) {
			// 		hasApp = false
			// 	}
			// }, t)

		}else {
			var url = 'bolue://mb.bolue.cn?'
			var urll = document.location.href; // 获取当前url链接
			var tt = document.location.pathname //截取链接
			if (tt) {
				var arr = tt.split('/')
				arr.forEach(function(v, i) {
					if(v) {
						url += 'key' + i + '=' + v + '&'
						
					}
				})
			}
			url = url.substring(0, url.length-1)
			// console.log('-------------' + url)
			window.location.href = url
			setTimeout( function(){ window.location="https://mb.bolue.cn/dlapp"; } , 1000);

		}
	}
	goDispaly(re){
		this.setState({
			SafariDisplay: 'none',
			display: 'block'
		})
	}

	_handletoggledisplay (re) {
			// console.log(re)
			this.setState({
				display: re
			})
	}
	
  componentWillMount() {


  }

	componentDidMount() {
		EventCenter.emit('getDownLoadAppDisplay','none')
		// setTimeout(()=>{
		// 	if (IsActivity) {
		// 		this.setState({
		// 			display:'none'
		// 		})
		// 	}
		// } , 300);

		var date1 = localStorage.getItem("DownloadAppTime")
		var date2 = Date.now();
		if ((date2 - date1) < (60 * 60 * 1000)) {
			this.setState({
				display:'none'
			})
		}
		// DownLoadAPP浮层位置切换
		this._DownLoadAppDisplay = EventCenter.on('toggleDownLoadAppDisplay',this._handletoggledisplay.bind(this))	
	}
	componentWillUnmount() {
		this._DownLoadAppDisplay.remove()
	}

	render(){
		// var url = 'com.linked-f.app://mb.bolue.cn' //调用APP 链接
		// var url = 'bolue://mb.bolue.cn/'
		// var urll = document.location.href; // 获取当前url链接
		// var tt = urll.split('mb.bolue.cn')[1] //截取链接
		// if (tt) {
		// 	url = url + tt
		// }
		
    return(
			<div >
        <div >
				
  	      {/* <div style={{...styles.mainDiv,display:this.state.display}}>
  	        <div style={{float:'left'}}>
  	          <img style={{...styles.logo}} src={Dm.getUrl_img(`/img/v2/icons/downloadLogo@2x.png`)} width="30" height="30" />
  	        </div>
  	        <div style={{float:'left',marginTop:12}}>
  	          <span style={{fontSize:12,color:'#FFFFFF',marginLeft:7}}>铂略财课，随时看你喜欢的课。</span>
  	        </div>
  					<div style={{float:'right',marginRight: devWidth >= 375 ? 26 : 16,marginTop:12}} onClick={this.closeDownLoad.bind(this)}>
  						<img style={{...styles.logo}} src={Dm.getUrl_img(`/img/v2/icons/clearDownload@2x.png`)} width="8" height="8" />
  					</div>
  	        <div style={{...styles.button}} onClick={this.gotoDownLoad.bind(this)}>
  						{
  							isWeiXin || isApple ? <span style={{fontSize: devWidth >= 375 ? 14 : 12,color:'#2196f3'}}>立即打开</span>
  							: <a href={url}><span style={{fontSize:devWidth >= 375 ? 14 : 12,color:'#2196f3'}}>立即打开</span></a>
  						}
  	        </div>
  	      </div> */}
					{/* v2.3.6 DownloadApp 样式*/}
					<div className='downloadapp' style={{...styles.mainDiv,display:this.state.display}}>
						<div style={{float:'left'}} onClick={this.closeDownLoad.bind(this)}>
  						<img style={{marginLeft:12,marginTop:12}} src={Dm.getUrl_img(`/img/v2/icons/closeCopy@2x.png`)} width="16" height="16" />
  					</div>
  	        <div style={{float:'left'}}>
  	          <img style={{marginLeft:12,marginTop:8}} src={Dm.getUrl_img(`/img/v2/icons/downloadLogo@2x.png`)} width="25" height="25" />
  	        </div>
  	        <div style={{float:'left'}}>
  	          <span style={{fontSize:13,color:'#FFFFFF',letterSpacing: -0.31,marginLeft:6}}>畅享更完备学习体验-铂略财课APP</span>
  	        </div>
  					
  	        <div style={{...styles.button,float:'right'}} onClick={this.gotoDownLoad.bind(this)}>
			  	<span style={{fontSize:13,color:'#fff'}}>打开APP</span>
  	        </div>
  	      </div>
  				<div style={{...styles.zzc,display:this.state.SafariDisplay}} onClick={this.goDispaly.bind(this)}>
  					<span style={{...styles.Ftext}}>点击右上角，在浏览器中打开</span>
  					<img style={{...styles.arrow}} src={Dm.getUrl_img(`/img/v2/icons/arrow@2x.png`)} width="40" height="40" />
  				</div>
        </div>

			</div>
    )
  }
}

var styles = {
  mainDiv:{
    width: devWidth,
		height: 40,
		lineHeight:'40px',
    backgroundColor:'rgba(40, 40, 40, 0.7)',
    position:'absolute',
    zIndex: 99999999999,
    top: 0,
		// opacity: 0.7
  },
  logo:{
    marginLeft:  devWidth >= 375 ? 16 : 14,
    marginTop: 9
  },
  button:{
		// width: devWidth >= 375 ? 80 : 60,
		width:'24.5%',
		height:40,
		lineHeight:'40px',
		fontSize:13,
		color:'#fff',
    // borderRadius:40,
    // border:'1px solid',
    // borderColor: '#2196f3',
    // float: 'right',
    // marginTop: 10,
		textAlign:'center',
		backgroundColor:'#1FA0E3',
  },
	zzc:{
		width: devWidth,
		height: devHeight,
		backgroundColor:'#000000',
		position:'absolute',
		zIndex: 999999999999999,
		opacity:0.8,
		top:0,
		textAlign:'center',
	},
	Ftext:{
		fontSize:18,
		color:'#FFFFFF',
		marginTop:20,
		position:'relative',
		top:23,
	},
	arrow:{
		position:'absolute',
		right: 21,
		top:0
	}
}

export default DownloadApp;
