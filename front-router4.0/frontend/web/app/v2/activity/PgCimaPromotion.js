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
var timer
var countdown
var startX
var startY
var scrollTop
var index = 0;
//返回角度
function GetSlideAngle(dx, dy) {
		return Math.atan2(dy, dx) * 180 / Math.PI;
}
//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
function GetSlideDirection(startX, startY, endX, endY) {
		var dy = startY - endY;
		var dx = endX - startX;
		var result = 0;

		//如果滑动距离太短
		if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
				return result;
		}
		var angle = GetSlideAngle(dx, dy);
		if(angle >= -45 && angle < 45) {
				result = 4;
		}else if (angle >= 45 && angle < 135) {
				result = 1;
		}else if (angle >= -135 && angle < -45) {
				result = 2;
		}
		else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
				result = 3;
		}
		return result;
}

//解决禁止微信下拉后导致页面内部不能滚动页面的问题
var overscroll = function(el) {
  el.addEventListener('touchstart', function() {
    var top = el.scrollTop
      , totalScroll = el.scrollHeight
      , currentScroll = top + el.offsetHeight
    //If we're at the top or the bottom of the containers
    //scroll, push up or down one pixel.
    //
    //this prevents the scroll from "passing through" to
    //the body.
    if(top === 0) {
      el.scrollTop = 1
    } else if(currentScroll === totalScroll) {
      el.scrollTop = top - 1
    }
  })
  el.addEventListener('touchmove', function(evt) {
    //if the content is actually scrollable, i.e. the content is long enough
    //that scrolling can occur
    if(el.offsetHeight < el.scrollHeight)
      evt._isScroller = true
  })
}


class PgCimaPromotion extends React.Component {
  constructor(props) {
      super(props);
      this.wx_config_share_home = {
  				title: 'CIMA高级经理人课程',
  				desc: '你离国际商业领袖仅一步之遥',
  				link: document.location.href + '',
  				imgUrl: Dm.getUrl_img('/img/v2/activity/cima_img/cima_share.jpg'),
  				type: 'link'
  		}
      this.state={
        name:'',
        email:'',
        telephone:'',
        isShow:false,
        success:false,
        title: 'PgHome',
        top: 0,
        height:devHeight,
        scrollName:'',
      }
  }

	componentWillMount(){
	}
  componentDidMount(){
		// 移动web捕获虚拟键盘弹出和关闭事件，一般用于input获取焦点弹出虚拟键盘，同时调整可是范围。以下js可以实现此效果：
		var wHeight = window.innerHeight;   //获取初始可视窗口高度
		window.onresize = function() {         //监测窗口大小的变化事件
			var resizeHeight = window.innerHeight;     //当前可视窗口高度
			var viewTop = document.body.scrollTop || document.documentElement.scrollTop;    //可视窗口高度顶部距离网页顶部的距离
			if(wHeight > resizeHeight){//可以作为虚拟键盘弹出事件
		   //调整可视页面的位置
				document.body.scrollTop = viewTop + 300;
			}else{ //可以作为虚拟键盘关闭事件
				document.body.scrollTop = viewTop - 300;
			}
		  wHeight = resizeHeight;
		}

		// overscroll(this.lessonList);
		// countdown = setTimeout(() => {
		// 	this.stopDrop()
		// }, 300)
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })
    EventCenter.emit("SET_TITLE",'铂略财课-CIMA高级经理人课程');
    this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
  }

  componentWillUnmount(){
    this._getSpecialDone.remove()
    clearTimeout(t)
    clearTimeout(timer)
		clearTimeout(countdown)
		window.onresize=''
  }

	/**
	 * 禁止浏览器下拉回弹
	 */
	 stopDrop() {
		 document.body.addEventListener('touchmove', function (evt) {
		//In this case, the default behavior is scrolling the body, which
		//would result in an overflow.  Since we don't want that, we preventDefault.
			if (!evt._isScroller) {
					evt.preventDefault();
			}
		});
	}

	//跳转到首页
	_goHomePage(){
    window.location="https://mb.bolue.cn";
    // window.location.href = `${__rootDir}`
	}

 //返回顶部
 _goBack(){
	 this.lessonList.scrollTop = 0;
 }
 //在线咨询
_goLink(){
  if(isWeiXin){
    // this.props.history.push({pathname: `${__rootDir}/freeInvited`})
    window.location.href = `${__rootDir}/freeInvited`
  }else {
    window.location.href='https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
  }
}
  onTouchStart(ev){
    startX = ev.touches[0].pageX;
    startY = ev.touches[0].pageY;
  }
  onTouchEnd(ev){
		var endX
		var endY
		endX = ev.changedTouches[0].pageX;
		endY = ev.changedTouches[0].pageY;

		 var direction = GetSlideDirection(startX, startY, endX, endY);
		 switch(direction) {
			case 0:

					break;
			case 1:
          this.onTouchMove('up')
					break;
			case 2:
          this.onTouchMove('down')
					break;
			case 3:
					// alert("向左");
					// alert("!");
					break;
			case 4:
					// alert("向右");
					// break;
			default:
		}
	}

  onTouchMove(ev){
    if(ev == 'up'){
      timer = setTimeout(()=>{
        scrollTop = this.lessonList.scrollTop + 50
        this.lessonList.scrollTop = scrollTop
      } , 50)
    }else if(ev == 'down') {
      timer = setTimeout(()=>{
        scrollTop = this.lessonList.scrollTop - 50
        this.lessonList.scrollTop = scrollTop
      } , 50)
    }
 }
  render(){
		var tel_link = 'tel://400-616-3899';
    return(
		<div style={{width:devWidth,height:devHeight,overflowY:'scroll',}}>
      <div ref={(lessonList) => this.lessonList = lessonList} style={{...styles.container}}>
        <div style={{width:devWidth,backgroundColor:'#fff'}}>
          <div style={{width:devWidth,height:devWidth*(389/750),overflow:'hidden',position:'relative'}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/cima_img/banner.jpg?t=20180201`)} width={devWidth} height={devWidth*(389/750)} />
            <div style={{position:'absolute',zIndex:2,bottom:devWidth/750*78,right:devWidth/750*162}} onClick={this._goLink.bind(this)}>
              <img src={Dm.getUrl_img(`/img/v2/activity/cima_img/btn_cima.png`)} width={devWidth/750*117} style={{display:'block'}}/>
            </div>
          </div>
          <div style={{width:devWidth,height:devWidth*(527/750),overflow:'hidden'}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/cima_img/cima_pic2.jpg`)} width={devWidth} height={devWidth*(527/750)} />
          </div>
          <div style={{width:devWidth,height:devWidth*(1614/750),overflow:'hidden'}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/cima_img/cima_pic3.jpg?t=20180201`)} width={devWidth} height={devWidth*(1614/750)} />
          </div>
          <div style={{width:devWidth,height:devWidth*(547/750),overflow:'hidden'}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/cima_img/cima_pic4.jpg`)} width={devWidth} height={devWidth*(547/750)} />
          </div>
          <div style={{...styles.cima_pic5,}}>
            <div style={{...styles.scroll_img,overflowX:'scroll'}}
              ref={(scrollImg)=>this.scrollImg = scrollImg}
              onTouchEnd={this.onTouchEnd.bind(this)}
      				onTouchStart={this.onTouchStart.bind(this)}>
              <img src={Dm.getUrl_img(`/img/v2/activity/cima_img/CIMA_photo.png`)} width={devHeight*(1334/1334)} height={devWidth*(367/750)} />
            </div>
          </div>
          <div style={{width:devWidth,height:devWidth*(707/750),position:'relative',zIndex:2}}>
						<div style={{...styles.left_msk,left:0,}}></div>
						<div style={{...styles.left_msk,right:0,}}></div>
            <img src={Dm.getUrl_img(`/img/v2/activity/cima_img/cima_pic6.jpg`)} width={devWidth} height={devWidth*(707/750)} />
          </div>
          <div style={{width:devWidth,height:devWidth*(791/750),overflow:'hidden'}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/cima_img/cima_pic7.jpg?t=20180201`)} width={devWidth} height={devWidth*(791/750)} />
          </div>
          <div style={{width:devWidth,height:devWidth*(1262/750),overflow:'hidden'}}>
            <img src={Dm.getUrl_img(`/img/v2/activity/cima_img/cima_pic8.jpg`)} width={devWidth} height={devWidth*(1262/750)} />
          </div>
          <div style={{...styles.form_box}}>
            <div style={{...styles.form_div}}>
              <input style={{...styles.inputText,marginTop:8,}} type="text" value={this.state.name} placeholder=" 姓名" onChange={this._onChangeName.bind(this)}/>
              <input style={{...styles.inputText,marginTop:22,}} type="text" value={this.state.telephone} placeholder=" 手机" onChange={this._onChangeTelephone.bind(this)}/>
              <input style={{...styles.inputText,marginTop:22,}} type="text" value={this.state.email} placeholder=" 邮箱" onChange={this._onChangeEmail.bind(this)}/>

              <div style={{...styles.button}} onClick={this.onClickSubmit.bind(this)}>
                <span style={{color:'#fff'}}>申请免试认证</span>
              </div>
            </div>
          </div>
        </div>
				<div style={{position:'fixed',zIndex:999,bottom:0,left:0,width:devWidth,height:devWidth*(140/750),backgroundImage:'url('+Dm.getUrl_img(`/img/v2/activity/cima_img/cima_footer.jpg`)+')',backgroundRepeat:'no-repeat',backgroundSize:'cover',}}>
					<div style={{width:devWidth,height:devWidth*(140/750),color:'#5e2275',fontSize:devWidth > 375 ? 14:12,textAlign:'center'}}>
						<div style={{width:(devWidth-3)/4,float:'left',height:devWidth*(50/750),paddingTop:devWidth*(90/750)}} onClick={this._goHomePage.bind(this)}>铂略首页</div>
						<div style={{width:(devWidth-3)/4,float:'left',marginLeft:1,}}>
							<a href={tel_link} style={{display:'inline-block',width:(devWidth-3)/4,height:devWidth*(50/750),paddingTop:devWidth*(90/750),}}><span style={{color:'#5e2275',fontSize:devWidth > 375 ? 14:12,}}>一键拨号</span></a>
						</div>
						<div style={{width:(devWidth-3)/4,float:'left',marginLeft:1,height:devWidth*(50/750),paddingTop:devWidth*(90/750)}} onClick={this._goLink.bind(this)}>在线咨询</div>
						<div style={{width:(devWidth-3)/4,float:'left',marginLeft:1,height:devWidth*(50/750),paddingTop:devWidth*(90/750)}} onClick={this._goBack.bind(this)}>返回顶部</div>
					</div>
				</div>
      </div>
			<div style={{...styles.show_box,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
			<ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
		</div>
    )
  }

//点击空白区域
	_hide(){
    this.setState({
      isShow:false,
      success:false,
      name:'',
      telephone:''
    })
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

  //输入电话
  _onChangeTelephone(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    if(this.state.telephone && input_text.length>0){
      this.setState({
        telephone:input_text,
      });
    }
    else {
      this.setState({
        telephone:input_text,
      });
    }
  }

  //输入邮箱
  _onChangeEmail(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    this.setState({
      email:input_text,
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
    if (!this.state.name) {
        this.onIsShow('姓名不能为空')
      return
    }

    if (!this.state.telephone) {
      this.onIsShow('手机号不能为空')
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
      email:this.state.email,
      isCima:true,//用来区分是cima单页还是其他单页
      url: document.location.href + '',
      title:'学Cima（移动端）',
    });
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
    overflow: 'scroll',
		position:'relative',
		zIndex:2
  },
  form_box:{
    width:devWidth,
    height:devWidth*(848/750),
    backgroundImage:'url(' + Dm.getUrl_img(`/img/v2/activity/cima_img/cima_pic11.jpg`)+')',
    backgroundPosition:'top center',
    backgroundSize:'cover',
    position:'relative',
  },
  form_div:{
    width:devWidth,
    paddingTop:devWidth*(140/750),
  },
  cima_pic5:{
    width:devWidth,
    height:devWidth*(536/750),
    backgroundImage:'url(' + Dm.getUrl_img(`/img/v2/activity/cima_img/cima_pic5.jpg?t=20180201`)+')',
    backgroundPosition:'top center',
    backgroundSize:'cover',
    position:'relative',
    zIndex:1,
  },
  left_msk:{
    width:43,
    height:devWidth*(368/750),
    position:'absolute',
    top:-(devWidth*(406/750)),
    zIndex:999,
    backgroundColor:'#333',
    opacity:0.8,
  },
  scroll_img:{
    width:devWidth,
    height:devWidth*(367/750),
    paddingTop:devWidth*(130/750),
    overflowY:'hidden',
  },
  inputText:{
  		height:32,
      paddingLeft:8,
  		width: devWidth - 100,
      marginLeft:46,
      borderRadius:4,
      border:'none',
  },
  button:{
    backgroundColor:'#e89e09',
    textAlign:'center',
    height:'31px',
    lineHeight:'31px',
    width:devWidth-214,
    borderRadius: 4,
  	marginLeft: (devWidth-(devWidth-214))/2,
    marginTop:20,
  },
  show_box:{
    width: devWidth,
    height: devHeight,
    backgroundColor:'#cccccc',
		opacity: 0.5,
    position:'absolute',
    zIndex: 999,
    top:0,
		left:0,
  },

}

export default PgCimaPromotion;
