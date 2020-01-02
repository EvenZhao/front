import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import ActivityAlert from './ActivityAlert';
import funcs from '../util/funcs'

var countdown;
var load
var t
var startX
var startY
var danyeIndex = 0 //记录当前单页的index
var innerHeight = window.innerHeight
var Opacity
//如果是活动页面的去掉顶部APP推荐

//返回角度
function GetSlideAngle(dx, dy) {
		return Math.atan2(dy, dx) * 180 / Math.PI;
}

class PgActivityZrdj extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.wx_config_share_home = {
				title: '2017《转让定价训练营（第二季）》再度来袭！',
				desc: '2大真实案例、12个常见争议点、16个热门思考点深度剖析',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/ZrdjShare.jpg'),
				type: 'link'
		}
		this.data={
			title: '2017《转让定价训练营（第二季）》再度来袭！',
			description: '2大真实案例、12个常见争议点、16个热门思考点深度剖析',
			img: Dm.getUrl_img('/img/v2/icons/ZrdjShare.jpg'),
		}
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
			activityDown: false
		};

	}

  componentWillMount() {
		IsActivity = true
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

	onIsShow(re){
		console.log('onIsShow',re);
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
  onClickSpecial(e){

		// if (!this.state.name) {
		// 		this.onIsShow('姓名不能为空')
		// 	return
		// }

		if (!this.state.company) {
			this.onIsShow('公司不能为空')
			return false
		}
		if (!this.state.telephone) {
			this.onIsShow('电话不能为空')
			return false
		}
		if(!isCellPhoneAvailable(this.state.telephone)){
			this.onIsShow('请输入正确的手机号码')
			return false
		}

    Dispatcher.dispatch({
      actionType: 'Special',
      name:this.state.name,
      phone: this.state.telephone,
      company: this.state.company,
			isCima:false,
      url: document.location.href + '',
      title:'转让定价专项课程(移动端)',
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
		EventCenter.emit("SET_TITLE",'铂略财课-转让定价专项课程')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

		// if (this.container && this.container.contentWindow) {
		// 	this.container.contentWindow.postMessage(this.data, '*');
		// 	console.log('djkshdjkhsjkdhks====-------');
		// }
		 window.addEventListener('message', this.msgHandler);
		this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))

	}
	msgHandler(e){
		console.log('msgHandler-----------',e);
	}
	componentWillUnmount() {//ActivityZrdj
		this._getSpecialDone.remove()

	}

	render(){
    return(
      <div style={{...styles.div}}>

				<div style={{width:window.screen.width}}>
	        <img   src={Dm.getUrl_img(`/img/v2/activity/Zrdjy.jpg`)} height={window.screen.width*(3061/750)} width={window.screen.width}/>
					<div style={{...styles.from,}}>
						<div style={{...styles.fromDiv}}>
							<img  src={Dm.getUrl_img(`/img/v2/icons/Zrdje.png`)} width={window.screen.width-26}/>
							<div style={{width:window.screen.width-26,textAlign:'center',marginBottom:window.innerHeight*(22/667)}}>
								<span style={{fontSize:18,color:'#aaaaaa'}}>注册网站索取课纲</span>
							</div>
							<input style={{...styles.inputText}} type="text" value={this.state.name} placeholder=" 姓名" onChange={this._onChangeName.bind(this)}/>
							<input style={{...styles.inputText}} type="text" value={this.state.company} placeholder=" 公司" onChange={this._onChangeCompany.bind(this)}/>
							<input style={{...styles.inputText}} type="text" value={this.state.telephone} placeholder="手机/电话" onChange={this._onChangeTelephone.bind(this)}/>
							<div style={{...styles.button}} onClick={this.onClickSpecial.bind(this)}>
								<span style={{color:'#f4f9fd'}}>提交</span>
							</div>
							<div style={{width:window.screen.width-26,textAlign:'center',marginTop:window.innerHeight*(22/667)}}>
								<span style={{color:'#aaaaaa',fontSize:10}}>了解更多欢迎详询:400-689-0679</span>
							</div>
						</div>
					</div>
					<img   src={Dm.getUrl_img(`/img/v2/icons/Zrdjl.png`)} height={window.screen.width*(174/375)} width={window.screen.width}/>
				</div>
				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
				<ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
      </div>
    )
  }
}

var styles = {
div:{
  width:devWidth,
  // overflow:'scroll',
	overflowX: 'hidden',
  height:devHeight
},
inputText:{
	height:31,
	width: devWidth -120,
	marginLeft:(devWidth-(devWidth -120))/2-13,
	marginBottom:devHeight*(22/667),
	border:'none',
	borderRadius:'4px',
},
button:{
	height: 30,
	width: 155,
	backgroundColor: '#5a7eb7',
	borderRadius: 4,
	marginLeft: (devWidth-155)/2-13,
	textAlign: 'center',
	lineHeight: 1.8
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
	height:350,
	width:devWidth,
	backgroundColor:'#ecf6f7'
},
fromDiv:{
	width:devWidth-26,
	marginLeft:13,
	backgroundColor:'#fafafa',
	marginTop:-17,
	paddingBottom:10
	}
}

export default PgActivityZrdj;
