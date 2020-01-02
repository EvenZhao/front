/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import { Link } from 'react-router-dom';
import {Dialog, Button, Input} from 'react-weui';
import Star from '../components/star';
import Alert from '../components/Alert';
import LiveVideo from '../components/LiveVideo';
import LiveDocVideo from '../components/LiveDocVideo'
import GenseeVideoJs from '../components/GenseeVideoJs';
import OnlineAlert from '../components/OnlineAlert';
import FullLoading from '../components/FullLoading';
import Dm from '../util/DmURL'
import funcs from '../util/funcs'
// const {Dialog} = WeUI;

class PgLiveVideo extends React.Component {
	constructor(props) {
    super(props);
		this.wx_config_share_home = {
				title: '',
				desc: '',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
		this.state = {
			select: false,
			w_width: devWidth,
      start_time: '',
      end_time: '',
			title_img: '',
			title: '',
			title_brief: '',
      live_status: '',
			isCollected: '',
			logo: [],
			question: [],
			teacher: [],
			changeCollectedType: '',
			alert: false,
			bookTitle: '预约报名',
			bookContent: 'input',
			rightButton: 'confirm',
			buttonValue: '确定',
			reload: false,
			reserveType: false,
			user: {},
			isReserved: false,
			attendUrl: '',
			authcode: '',
			uid: '',
			uname: '',
			isPlay: false,
			isFree: false,
			online_id: '',
      html: '',
			authority: false,
			isLogin: false,
			isShow: false,
			isLoading: true,
			learn_num: 0,
			question_count: 0,
			live_series: null,
			genseeName:'',
		};

		this.select = ''

		this.isList = false
	}

	_collect() {
		if(this.state.isLogin == false) {
			this.props.history.push(`${__rootDir}/login`)
		} else {
			Dispatcher.dispatch({
				actionType: 'Collect',
				resource_id: this.props.match.params.id,
				resource_type: 1
			})
			if(this.state.changeCollectedType) {
				this.setState({
					changeCollectedType: false
				})
			} else {
				this.setState({
					changeCollectedType: true
				})
			}
		}
	}

  _isCanPlayVideo(type) {
		if(type == 'not_started') {
			this.setState({
				alert: true,
				reload: true
			})
		}
  }

	_hideBlackGround() {
		this.setState({
			isShow: false
		})
	}

	_propShow(cancel, phone) {
		console.log(cancel)
		// var phoneTest = /^1[3|4|5|7|8]\d{9}$/
		if(this.state.reload) {
			this.setState({
				rightButton: 'confirm',
				bookTitle: '预约报名',
				bookContent: 'input',
				buttonValue: '确定',
			})
		}
		if((phone == '' && cancel == 'confirm') || (!isCellPhoneAvailable(phone) && cancel == 'confirm')) {
			this.setState({
				rightButton: 'again',
				bookTitle: '预约失败',
				bookContent: '您输入的手机号码不正确。',
				buttonValue: '再试一次',
			})
		} else if(cancel == 'again') {
			this.setState({
				rightButton: 'confirm',
				bookTitle: '预约报名',
				bookContent: 'input',
				buttonValue: '确定'
			})
		} else if(cancel == 'cancel') {
			this.setState({
				alert: false
			}, () => {
				Dispatcher.dispatch({
					actionType: 'LiveDetail',
					id: this.props.match.params.id
				})
			})
		} else if(cancel == 'success') {
			this.setState({
				alert: false
			}, () => {
				this.props.history.push({pathname: `${__rootDir}/reserveDetail/${this.props.match.params.id}`})
			})
		}
	}

	_handleLiveDetail(re) {
		console.log(re)
		if(re && re.result && re.user) {
			var req = re.result
			this.wx_config_share_home = {
					title: req.title,
					desc: req.live_brief,
					link: document.location.href + '',
					imgUrl: req.brief_image,
					type: 'link'
			};
			EventCenter.emit("SET_TITLE",req.title)
			var user = re.user
			this.setState({
        start_time: req.start_time,
        end_time: req.end_time,
				title_img: req.brief_image,
        title: req.title,
				title_brief: req.live_brief,
        live_status: req.live_status,
        isCollected: req.isCollected,
				changeCollectedType: req.isCollected,
				logo: req.associations,
				question: req.question,
				teacher: req.teachers,
				user: user,
				isFree: req.isFree,
				isReserved: req.isReserved,
				attendUrl: req.attend_url,
				authcode: req.authcode,
				online_id: req.online_id,
        html: req.live_introduction,
				uid: user.id || '',
				uname: user.nick_name || '',
				genseeName: user.genseeName || '',
				authority: req.authority,
				isLogin: user.isLogined,
				learn_num: req.learn_num,
				live_series: req.liveSeries,
				question_count: req.questionCount,
				isLoading: false
			},()=>{
				Dispatcher.dispatch({
					actionType: 'WX_JS_CONFIG',
					onMenuShareAppMessage: this.wx_config_share_home
				})
			})
		}
	}

	_handleLiveReserve(re) {
		console.log(re.result)
		if(re.result.result == true) {
			this.setState({
				reserveType: true
			}, () => {
				this.setState({
					rightButton: 'success',
					bookTitle: '预约成功',
					bookContent: '设置提醒,以便您及时参加课程。',
					buttonValue: '设置提醒',
				})
			})
		}
	}

	_handleHideAlert() {
		this.setState({
			isShow: false
		}, () => {
			this.props.history.push({pathname: `${__rootDir}/freeInvited`})
		})
	}

	_handleJumpToDiscount(re) {
		this.props.history.push({pathname: `${__rootDir}/useDiscount/1/${this.props.match.params.id}`})
	}

	_run() {
		if(this.state.authority == false) {
			this.setState({
				isShow: true,
				isPlay: false,
			})
		} else {
			var addScript = document.createElement('script')
			addScript.id = 'gensee_video'
			addScript.type = 'text/javascript'
			addScript.setAttribute('src', 'https://static.gensee.com/webcast/static/sdk/js/gssdk.js?random='+Date.now())
			document.body.appendChild(addScript)

			this.setState({
				isPlay: true
			})
			// setTimeout( function(){
			// 	var channel = GS.createChannel();
			// 	console.log('GS-----',GS);
			// 	channel.bind("onVideoConfig", function (event) {
			// 		//  alert(event.data);
			// 		 console.log('event',event.data);
			// 		 alert(event.data.hasVideo)
			// 	 });
			// 	//  channel.bind("onVideoShow", function (event) {
			// 	// 		// alert(event.data);
			// 	// 		console.log('event',event.data);
			// 	// 	});
			//
			//  } , 1500);
		}

	}

	Login() {
		this.props.history.push({pathname: `${__rootDir}/login`})
	}



	componentWillMount() {
		Dispatcher.dispatch({
			actionType: 'LiveDetail',
			id: this.props.match.params.id
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-直播课详情页')
		backNotloadIndex = 'PgDetail'
		this._hideAlert = EventCenter.on('HideAlert', this._handleHideAlert.bind(this))
		this._liveDetail = EventCenter.on('LiveDetailDone', this._handleLiveDetail.bind(this))
		this._liveReserve = EventCenter.on('LiveReserveDone', this._handleLiveReserve.bind(this))
		this._JumpToDiscount = EventCenter.on('PropToDiscount', this._handleJumpToDiscount.bind(this))
	}
	componentWillUnmount() {
		this._liveDetail.remove()
		this._liveReserve.remove()
		this._hideAlert.remove()
		this._JumpToDiscount.remove()
		window.location = window.location
	}
	render(){
		var score
		var assLogo
		var quest
		var hrStyle
    var startStyle
    var startType
		var learnNumType

		if(this.state.live_status === 0) {
			startType = '开始时间'
			learnNumType = '已预约'
			if(this.state.isLogin && this.state.isReserved) {
				startStyle = <div style={{...styles.start, backgroundColor: '#d1d1d1', width: 125, height: 41, borderRadius: 50, color: '#fff', fontSize: 16, textAlign: 'center', lineHeight: '41px'}}>已预约</div>
			} else if(this.state.isLogin && !this.state.isReserved) {
				startStyle = <div onClick={() => {this._isCanPlayVideo('not_started')}} style={{...styles.start, backgroundColor: '#ee864f', width: 125, height: 41, borderRadius: 50, color: '#fff', fontSize: 16, textAlign: 'center', lineHeight: '41px'}}>点击预约</div>
			} else if(this.state.isLogin == false) {
				startStyle = <div onClick={this.Login.bind(this)} style={{...styles.start, backgroundColor: '#ee864f', width: 125, height: 41, borderRadius: 50, color: '#fff', fontSize: 16, textAlign: 'center', lineHeight: '41px'}}>点击登录</div>
			}
		} else if(this.state.live_status == 1) {
			startType = '直播中'
			learnNumType = '人已参与'
			if(this.state.isLogin == false) {
				startStyle = <div onClick={this.Login.bind(this)} style={{...styles.start, backgroundColor: '#ee864f', width: 125, height: 41, borderRadius: 50, color: '#fff', fontSize: 16, textAlign: 'center', lineHeight: '41px'}}>点击登录</div>
			} else {
				startStyle = <img src={Dm.getUrl_img('/img/v2/icons/play@2x.png')} onClick={this._run.bind(this)} style={{position: 'relative', width: 60, height: 60, marginTop: 236 / 2 - 30, zIndex: 99, marginLeft: devWidth / 2 - 30}} />
			}
		} else if(this.state.live_status == 2 && this.state.online_id != null) {
			startType = '已结束'
			learnNumType = '人已参与'
			if(this.state.isLogin == false) {
				startStyle = <div onClick={this.Login.bind(this)} style={{...styles.start, backgroundColor: '#ee864f', width: 125, height: 41, borderRadius: 50, color: '#fff', fontSize: 16, textAlign: 'center', lineHeight: '41px'}}>点击登录</div>
			} else {
				startStyle = <Link to={`${__rootDir}/lesson/online/${this.state.online_id}`}><img src={Dm.getUrl_img('/img/v2/icons/repaly@2x.png')} style={{position: 'relative', width: 60, height: 60, marginTop: 236 / 2 - 30, zIndex: 99, marginLeft: devWidth / 2 - 30}}/></Link>
			}
		} else if(this.state.live_status == 2 && this.state.online_id == null) {
			startType = '已结束'
			learnNumType = '人已参与'
			if(this.state.isLogin == false) {
				startStyle = <div onClick={this.Login.bind(this)} style={{...styles.start, backgroundColor: '#ee864f', width: 125, height: 41, borderRadius: 50, color: '#fff', fontSize: 16, textAlign: 'center', lineHeight: '41px'}}>点击登录</div>
			} else {
				startStyle = <div style={{...styles.start, backgroundColor: '#d1d1d1', width: 125, height: 41, borderRadius: 50, color: '#fff', fontSize: 16, textAlign: 'center', lineHeight: '41px'}}>暂不支持回放</div>
			}
		}
		// catalog组件传值
		let props = {
			catalog: this.state.catalog
		}
		// 星星组件传值
		let starOverScore = {
      right: 6,
      star: score,
      canChange: false,
      score: score,
      propScore: score, //外部传数 （固定分数）
			scoreShow: false,
			width: 14,
			height: 14
    }

		// 老师介绍组件传值
		let teacher = {
			t_detail: this.state.teacher
		}

		console.log('this.state.live_series',this.state.live_series);

		//补全直播组件的uid
		var Uid = ''
		var addZero = ''
		for(var i=0; i<10 - (1 + String(this.state.uid).length); i++) {
			addZero = addZero + 0
		}
		Uid = 2 + addZero + String(this.state.uid)
		// 给直播组件传值
		let liveVideo = {
			ownerid: this.state.attendUrl,
			authcode: this.state.authcode,
			uid: Uid,
			uname: this.state.genseeName,
			isPlay: this.state.isPlay
		}


		// let geeseJs = this.state.isPlay ? <GenseeVideoJs /> : ''
		return (
			<div style={{backgroundColor: '#fff', height: document.documentElement.clientHeight, display: 'flex', flexDirection: 'column'}}>

			<div style={{backgroundColor: '#000', position: 'absolute', height: devHeight, width: '100%', opacity: 0.5, zIndex: 100, display: this.state.alert || this.state.isShow ? 'block' : 'none'}} onClick={this._hideBlackGround.bind(this)}></div>
			<div style={{backgroundColor: '#000', position: 'absolute', height: 236, width: '100%', opacity: 0.3, zIndex: 1}}></div>
			<div style={{height: 236, display: this.state.isPlay ? 'none' : 'inline-block'}}>
			<img src={this.state.title_img} style={{...styles.top_img}}/>
					{startStyle}
					<OnlineAlert isShow={this.state.isShow}/>
				<div style={{fontSize: 14, margin: '0px auto', position: 'relative', width: this.state.w_width, textAlign: 'center', color: 'white', zIndex: 2, marginTop: 10}}>
				</div>
			</div>
				<LiveVideo {...liveVideo}/>
				<div style={{backgroundColor: '#000', position: 'absolute', height: devHeight, width: '100%', opacity: 0.5,top:300, zIndex: 100, display: this.state.alert || this.state.isShow ? 'block' : 'none'}} onClick={this._hideBlackGround.bind(this)}></div>
				<div style={{backgroundColor: '#000', position: 'absolute', height: 236, width: '100%', opacity: 0.3, zIndex: 1,top:300}}></div>
				<div style={{height: 236, display: this.state.isPlay ? 'none' : 'inline-block',top:300,position:'absolute'}}>
				<img src={this.state.title_img} style={{...styles.top_img}}/>
						{startStyle}
					<div style={{fontSize: 14, margin: '0px auto', position: 'relative', width: this.state.w_width, textAlign: 'center', color: 'white', zIndex: 2, marginTop: 10}}>
					</div>
				</div>
				<LiveDocVideo {...liveVideo}/>
			</div>
		)
	}
}

var styles = {
	start: {
		position: 'relative',
		margin: '0 auto',
		width: 50,
		height: 50,
		// top: 100,
		marginTop: 236 / 2 - 20,
		zIndex: 2,
		backgroundColor: 'black'
	},
	top_img: {
		width: '100%',
		height: 236,
		position: 'absolute'
	},
	t_title_div: {
		paddingLeft: 12,
		paddingRight: 12,
		backgroundColor: '#fff'
	},
	t_title: {
		paddingBottom: 5,
		paddingTop: 12,
		fontSize: 17,
		color: '#333',
	},
	t_hr: {
		backgroundColor: '#f3f3f3',
		border: 'none',
		height: 1,
		marginBottom: 12,
		marginTop: 15
	},
	logo_title: {
		color: '#333',
		fontSize: 13,
		verticalAlign: 'text-bottom'
	},
	teacher_img: {
		width: 43,
		height: 43,
		borderRadius: 50,
		display: 'inline-block',
		marginRight: 10
	},
	teacher_hr_margin: {
		backgroundColor: '#f3f3f3',
		border: 'none',
		height: 1,
		marginBottom: 15,
		marginTop: 15,
		marginLeft: 12,
		marginRight: 12
	},
	teacher_div: {
		paddingLeft: 12,
		paddingRight: 12,
		height: 43
	},
	teacher_hr: {
		backgroundColor: '#f3f3f3',
		border: 'none',
		height: 1,
		marginBottom: 15,
		marginTop: 15
	},
	logo: {
		marginLeft: 12,
		// border:'1px solid',
		width: 16,
		height: 16,
		// borderColor: 'red',
		display: 'inline-block',
		marginRight: 9
	},
	ass_logo_div: {
		marginBottom: 19,
		height: 21,
		display: 'inline-block'
	},
	ass_logo: {
		width: 44,
		height: 21,
		backgroundColor: 'red',
		display: 'inline-block',
		marginRight: 20
	},
	input: {
		width: 165,
		height: 30,
		backgroundColor: '#f5fdfb',
		borderRadius: 4,
		paddingLeft: 13,
		border:'none'
	},
	br_div: {
		border: '1px solid',
		borderColor: '#f3f3f3',
		borderLeft:'none',
		borderRight: 'none',
		height: 12,
		backgroundColor: '#f4f4f4',
	},
	question_title: {
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3,
		textOverflow:'ellipsis',
		overflow: 'hidden',
		paddingLeft: 12,
		paddingRight: 12
	},
	no_comment_txt: {
    color: '#666',
    fontSize: 12,
    display: 'inline-block',
    verticalAlign: 'text-bottom',
    marginLeft: 8
  },
  no_comment_div: {
    width: 100,
    height: 27,
    border: '1px solid',
    borderRadius: 4,
    borderColor: '#666',
    padding: '3px 14px',
    margin: '0 auto',
		marginBottom: 20
  },
}

export default PgLiveVideo;
