import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import ActivityAlert from './ActivityAlert';
import funcs from '../util/funcs'
import Common from '../Common';

var countdown;
var load
var t
var startX
var startY
var danyeIndex = 0 //记录当前单页的index
var innerHeight = window.innerHeight
var Opacity

var userAgent = window.navigator.userAgent.toLowerCase();
//返回角度
function GetSlideAngle(dx, dy) {
		return Math.atan2(dy, dx) * 180 / Math.PI;
}

class PgActivityCwdzz extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.wx_config_share_home = {
				title: '解救“表”哥“表”姐正当时！',
				desc: '铂略重磅推出《财务Excel大作战》专项课程包',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/CwdzzShare.jpg'),
				type: 'link'
		};
		this.state = {
			title: 'PgHome',
			top: 0,
			displayOne:'block',
			displayTwo:'none',
			displayThree:'none',
			displayFour:'none',
			name:'',
			company:'',
			telephone:'',
			Opacity:0,
			success: false,
			height:0,
			upDown: false,
			activityDown: false,
			isShow:false,
		};

	}

  componentWillMount() {
    IsActivity = true;//如果是活动页面的去掉顶部APP推荐
  }
  _onChangeName(e){
    e.preventDefault();
    var v = e.target.value.trim();
    if (this.state.name && v.length > 0) {
      this.setState({
        name: v,
      })
    }else {
      this.setState({
        name: v,
      })
    }
  }
  _onChangePosition(e){
    e.preventDefault();
    var v = e.target.value.trim();
    if (this.state.position && v.length > 0) {
      this.setState({
        position: v,
      })
    }else {
      this.setState({
        position: v,
      })
    }
  }

  _onChangeCompany(e){
    e.preventDefault();
    var v = e.target.value.trim();
    if (this.state.company && v.length > 0) {
      this.setState({
        company: v,
      })
    }else {
      this.setState({
        company: v,
      })
    }
  }
  _onChangeTelephone(e){
    e.preventDefault();
    var v = e.target.value.trim();
    if (this.state.telephone && v.length > 0) {
      this.setState({
        telephone: v,
      })
    }else {
      this.setState({
        telephone: v,
      })
    }
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

	_hide(){
    this.setState({
      isShow:false,
      success:false,
      name:'',
      telephone:''
    })
  }

  onClickSpecial(e){
    if (!this.state.name) {
        this.onIsShow('姓名不能为空')
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
			isCima:true,
      url: document.location.href + '',
      title:'财务Excel大作战(移动端)',
    })
  }
	_handleSpecialDone(re){
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
	componentDidMount() {
		// alert(userAgent)
		EventCenter.emit("SET_TITLE",'铂略财课-财务Excel大作战')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

		this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))

	}
	componentWillUnmount() {//ActivityZrdj
		this._getSpecialDone.remove()
	}

	render(){
    return(
      <div style={{...styles.div}}>
				<div style={{width:window.screen.width}}>
	        <img   src={Dm.getUrl_img(`/img/v2/icons/Cwdzz.png`)}  height={window.screen.width*(1601/375)} width={window.screen.width}/>
					<div style={{...styles.from}}>
	          <div style={{...styles.fromTitle}}>
	            <span style={{color:'#f4f9fd'}}>填写信息即可申请免费体验直播或视频课程</span>
	          </div>
						<input style={{...styles.inputText}} type="text" value={this.state.name} placeholder=" 姓名" onChange={this._onChangeName.bind(this)}/>
						<input style={{...styles.inputText}} type="text" value={this.state.company} placeholder=" 公司" onChange={this._onChangeCompany.bind(this)}/>
						<input style={{...styles.inputText}} type="text" value={this.state.telephone} placeholder=" 手机/电话" onChange={this._onChangeTelephone.bind(this)}/>
						<div style={{...styles.button}} onClick={this.onClickSpecial.bind(this)}>
							<span style={{color:'#f4f9fd'}}>提交</span>
						</div>
						<div style={{width:window.screen.width,textAlign:'center',marginTop:window.innerHeight*(22/667)-10}}>
							<span style={{color:'#ecf3f6',fontSize:10}}>了解更多欢迎详询:400-689-0679</span>
						</div>
            <img   src={Dm.getUrl_img(`/img/v2/icons/Cwdzzy.png`)} height={window.screen.width*(43/375)} width={window.screen.width}/>
					</div>
				</div>
				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
				<ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
      </div>
    )
  }
}

var styles = {
div:{
  width:window.screen.width,
  // overflow:'scroll',
  overflowX: 'hidden',
  height:window.innerHeight
},
inputText:{
	height:31,
	width: window.screen.width -120,
	marginLeft:60,
	marginTop:window.innerHeight*(22/667),
	backgroundColor:'#336f84',
	border:'none',
	color:'#fff'
},
button:{
	height: 30,
	width: 155,
	backgroundColor: '#e48e00',
	borderRadius: 4,
	marginLeft: (devWidth-155)/2,
	textAlign: 'center',
	lineHeight: 1.8,
	marginTop:devHeight*(22/667)
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
from:{
  height:320,
  width:window.screen.width,
	backgroundColor:'#064f69'
},
fromTitle:{
	width:window.screen.width,
	textAlign:'center',
	marginBottom:window.innerHeight*(22/667),
	marginTop:-7,
	position:'relative',
	top:30
}
}

export default PgActivityCwdzz;
