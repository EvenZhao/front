/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import { Link } from 'react-router-dom';
// import Star from '../components/star';
import TeacherDetail from '../components/TeacherDetail';
import Alert from '../components/Alert';
import LiveVideo from '../components/LiveVideo';
// import GenseeVideoJs from '../components/GenseeVideoJs';
import LiveAlert from '../components/LiveAlert';
import FullLoading from '../components/FullLoading';
import Dm from '../util/DmURL'
import Common from '../Common';
import ResultAlert from '../components/ResultAlert'
import DataPrompt from '../components/DataPrompt'
import Guide from '../components/Guide'

var countdown;

class PgLiveDetail extends React.Component {
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
			leftTime: '',
			end_time: '',
			title_img: '',
			title: '',
			title_brief: '',
			status: '',
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
			reserveType: false,//是否预约
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
			authority: false,//true:有权限看视频，false:没权限看视频
			isLogin: false,
			isLoading: true,
			num: 0,
			question_count: 0,
			live_series: null,
			free_num: 0,
			errInfo: '',
			errShow: false,
			resource_count: null,
			//弹框是否显示
			display: 'none',
			usePoint: null,
			isShow: false,
			isSuccess: false,
			//弹框提示信息
			alert_display: 'none',
			alert_title: '',
			alertShow: false,
			errStatus: 0,//0:返回错误信息,1:显示其他提示信息
			isAlert: false,
			err_title: '',
			isNote: false,//是否有课程资料更新的通知
			//倒计时状态文案
			timerText: '',
			//进入直播间是否高亮
			isHighlight: false,
			//倒计时显示时间
			courseTimer: '',
		};

		this.select = ''

		this.isList = false;

		this.isShow = false;
	}

	_collect() {
		if (this.state.isLogin == false) {
			this.props.history.push(`${__rootDir}/login`)
		} else {
			Dispatcher.dispatch({
				actionType: 'Collect',
				resource_id: this.props.match.params.id,
				resource_type: 1
			})
			if (this.state.changeCollectedType) {
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

	_isCanPlayVideo() {
		if (this.state.isLogin) {
			if (this.state.authority) {
				Dispatcher.dispatch({
					actionType: 'LiveReserve',
					resource_id: this.props.match.params.id,
					resource_type: 1,
					title: this.state.title,
					phone: '',
				})
			}
			else {
				//第一次预约调用选课接口，不选课
				Dispatcher.dispatch({
					actionType: 'AddLesson',
					id: this.props.match.params.id,
					type: 1,
					isUsePoint: this.state.isUsePoint,//是否选课
				})
			}
		}
		else {//登录
			this.props.history.push(`${__rootDir}/login`)
		}
	}

	_CanPlayVideo(isUsePoint) {
		//第一次预约调用选课接口，不选课
		Dispatcher.dispatch({
			actionType: 'AddLesson',
			id: this.props.match.params.id,
			type: 1,
			isUsePoint: isUsePoint,//是否选课
		})
	}

	_handleHideMask() {
		this.setState({
			isShow: false,
			isSuccess: false,
		})
	}
	_hideBlackGround() {
		this.setState({
			errShow: false,
			isShow: false,
			isSuccess: false,
			isNote: false,
			alert: false,
		})
	}

	_propShow(cancel, phone) {

		// var phoneTest = /^1[3|4|5|7|8]\d{9}$/
		if (this.state.reload) {
			this.setState({
				rightButton: 'confirm',
				bookTitle: '预约报名',
				bookContent: 'input',
				buttonValue: '确定',
			})
		}
		if ((phone == '' && cancel == 'confirm') || (!isCellPhoneAvailable(phone) && cancel == 'confirm')) {
			this.setState({
				rightButton: 'again',
				bookTitle: '预约失败',
				bookContent: '您输入的手机号码不正确。',
				buttonValue: '再试一次',
			})
		} else if (cancel == 'again') {
			this.setState({
				rightButton: 'confirm',
				bookTitle: '预约报名',
				bookContent: 'input',
				buttonValue: '确定'
			})
		} else if (cancel == 'cancel') {
			this.setState({
				alert: false,
				isShow: false
			}, () => {
				Dispatcher.dispatch({
					actionType: 'LiveDetail',
					id: this.props.match.params.id
				})
			})
		} else if (cancel == 'success') {
			this.setState({
				alert: false,
				isShow: false
			}, () => {
				this.props.history.push({ pathname: `${__rootDir}/reserveDetail/${this.props.match.params.id}` })
			})
		}
	}

	_handleLiveDetail(re) {
		// console.log('_handleLiveDetail====', re);
		if (re.err) {
			this.setState({
				isAlert: true,
				err_title: re.err,
				isLoading: false,
			})
			return false;
		}

		if (re && re.result && re.user) {
			var req = re.result
			this.wx_config_share_home = {
				title: req.title,
				desc: req.live_brief,
				link: document.location.href + '',
				imgUrl: req.brief_image,
				type: 'link',
				success: function () {
					// 用户确认分享后执行的回调函数
					//分享任务接口,8 视频课 / 9 直播课 / 10 线下课 / 11 专题课
					Dispatcher.dispatch({
						actionType: 'PostShareTask',
						type: 9,
					})
				},
			};
			EventCenter.emit("SET_TITLE", req.title)
			var user = re.user

			var _liveDate = new Date(req.start_time).format("MM月dd日")
			var _time = new Date(req.start_time).format("hh:mm") + '-' + new Date(req.end_time).format("hh:mm")
			this.setState({
				timerText: _liveDate,
				courseTimer: _time,
				start_time: req.start_time,
				leftTime: req.leftTime ? (req.leftTime / 1000 - 15 * 60) : 0,
				end_time: req.end_time,
				title_img: req.brief_image ? req.brief_image : Dm.getUrl_img('/img/v2/icons/course_default.jpg'),
				title: req.title,
				title_brief: req.live_brief,
				status: req.status,
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
				authority: req.authority,
				isLogin: user.isLogined,
				num: req.num,
				free_num: req.free_num,
				live_series: req.liveSeries,
				question_count: req.questionCount,
				isLoading: false,
				resource_count: req.resource_count,
			}, () => {
				Dispatcher.dispatch({
					actionType: 'WX_JS_CONFIG',
					onMenuShareAppMessage: this.wx_config_share_home
				})
				//直播课倒计时
				if(this.state.leftTime > 0){
					this._countDown();
				}
			})
		}
	}

	//刷新页面
	_startReRefreshLive() {
		//刷新页面，1分钟刷新一次
		clearInterval(this.refreshTimer);
		if (this.state.status == 1) {
			// clearInterval(this.refreshTimer);
			return;
		}

		this.refreshTimer = setInterval(() => {
			Dispatcher.dispatch({
				actionType: 'LiveDetail',
				id: this.props.match.params.id
			})
		}, 60000)

	}

	//倒计时，进入直播间前15分钟开始倒计时（即开课前30分钟）
	_countDown() {
		//正在直播
		if (this.state.status == 1) {
			//开启直播间时，若定时器还在计时，则关闭
			if (this.refreshTimer) {
				clearInterval(this.refreshTimer);
			}
		}
		//尚未开始、即将开始的状态下，开启定时器
		/*if (this.state.status == 0 || this.state.status == 3) {
			//start_time为开课时间
			var _time = this.state.start_time;
			//倒计时的开始时间（毫秒数）
			var _start_time = _time - 30 * 60 * 1000;
			//倒计时的结束时间（毫秒数）
			var _end_time = _time - 15 * 60 * 1000;

			if (new Date().getTime() > _end_time) {
				//倒计时结束
				this.setState({
					timerText: '直播间即将开启',
					courseTimer: '00:00	',
				});
				//开启另一个倒计时
				this._startReRefreshLive();
				return;
			}
			//进入直播间以后，在开课时间之前
			if (new Date().getTime() > _end_time && new Date().getTime() < _time) {
				//倒计时结束,清空第开课定时器
				clearInterval(this.countInterval)
				this.setState({
					timerText: '直播间即将开启',
					courseTimer: '00:00',
				});
				//开启另一个定时器（每一分钟刷新一次页面)
				this._startReRefreshLive();
				return;
			}

			//关闭定时器
			this.countInterval && clearInterval(this.countInterval)
			//开启定时器，每100毫秒刷一次
			this.countInterval = setInterval(() => {
				console.log(this.state.leftTime)
				this.state.leftTime --;
				if (new Date().getTime() >= _start_time && new Date().getTime() <= _end_time) {
					//开始倒计时,精确到毫秒 
					// let countDownDate = new Date(_end_time - new Date().getTime()).Format('mm:ss');
					// var _courseTimer = countDownDate + ':' + Math.floor(new Date(_end_time - new Date().getTime()).getMilliseconds() / 100)
					let fen = parseInt(this.state.leftTime / 60) - 15
						,miao = parseInt(this.state.leftTime % 60)
						,_courseTimer = (fen < 10 ? '0' + fen : fen)  + ':' + (miao < 10 ? '0' + miao : miao)
					this.setState({
						timerText: '直播间即将开启',
						courseTimer: _courseTimer,
					});
				}
				else if (new Date().getTime() > _end_time) {
					//倒计时结束,关闭第开课定时器
					clearInterval(this.countInterval)
					this.setState({
						timerText: '直播间即将开启',
						courseTimer: '00:00',
					});
					//开启另一个定时器（每一分钟刷新一次页面)
					// this._startReRefreshLive();
					this._countDown()
					return;
				}
			}, 1000);
		}*/

		if (this.state.status == 0 || this.state.status == 3) {
			this.countInterval && clearInterval(this.countInterval)
			//开启定时器，每1秒刷一次
			this.countInterval = setInterval(() => {
				console.log('this.state.leftTime',this.state.leftTime)
				if(this.state.leftTime <= 0 ){
					this.setState({
						timerText: '直播间即将开启',
						courseTimer: '00:00',
					});
					//倒计时结束,关闭第开课定时器
					clearInterval(this.countInterval)
					this._startReRefreshLive();
				}
				else if (15 * 60 >= this.state.leftTime) {
					let fen = parseInt(this.state.leftTime / 60)
						,miao = parseInt(this.state.leftTime % 60)
						,_courseTimer = (fen < 10 ? '0' + fen : fen)  + ':' + (miao < 10 ? '0' + miao : miao)
					this.setState({
						timerText: '直播间即将开启',
						courseTimer: _courseTimer,
					});
				}
				this.state.leftTime --;
			}, 1000);
		}
	}

	_handleAddLesson(re) {

		if (re.err) {
			//alert
			return false;
		}
		if (re.result == true) {//预约成功

			//选课成功
			this.setState({
				isHighlight: true,
				isReserved: true,
				alertShow: true,
				alert_display: 'block',
				alert_title: '加入学习成功！',
				errStatus: 0,
			}, () => {
				countdown = setInterval(()=> {
					clearInterval(countdown);
					this.setState({
						alert_display: 'none',
						isShow: false,
					})
				}, 1500);
			});

			//正在直播进入直播间
			if (this.state.status == 1) {
				this.props.history.push({ pathname: `${__rootDir}/PgLiveVideo/${this.props.match.params.id}` })
				return;
			}
		}
		else {//1:有权限选课，0:没法选课，2:VIP体验期限到期，根据resource_count判断是否还有课程可选
			this.setState({
				isShow: true,
				usePoint: re.result.usePoint
			})
		}
	}

	_handleLiveReserve(re) {
		// console.log('==_handleLiveReserve==', re);
		if (re.result.err) {
			if (re.result.err == '免费名额已满') {
				this.setState({
					errInfo: re.result.err,
					errShow: true,
				})
			}
			return false;
		}
		if (re.result.result == true) {
			this.setState({
				reserveType: true,
				isReserved: true,
				isSuccess: true,
			}, () => {
				this.setState({
					rightButton: 'success',
					bookTitle: '预约成功',
					bookContent: '您已成功预约该直播课',
					bookContenttwo: '(开课前15分钟可进入直播间)。',
					buttonValue: '设置提醒',
					alert: true,
				})
			})
		}
	}

	_handleHideAlert() {
		this.setState({
			isShow: false,
			isNote: false,
		})
	}

	_handleApplyVoucher() {
		this.setState({
			isShow: false
		}, () => {
			this.props.history.push({ pathname: `${__rootDir}/freeInvited` })
		})
	}

	_handleJumpToDiscount(re) {
		this.props.history.push({ pathname: `${__rootDir}/useDiscount/1/${this.props.match.params.id}` })
	}

	_run() {
		if (this.state.isLogin) {
			Dispatcher.dispatch({
				actionType: 'insertLiveResourceJoin',
				resource_id: this.props.match.params.id,
			})
			if (this.state.authority) {
				// this.props.history.push({ pathname: `${__rootDir}/PgLiveVideo/${this.props.match.params.id}` })
				document.cookie ='openid='+localStorage.getItem("credentials.openid") + '; path=/ ;';
				document.cookie = 'code='+localStorage.getItem("credentials.code") + '; path=/ ;';
				document.cookie = 'bolueVer='+localStorage.getItem("bolueVer") + '; path=/ ;';
				document.cookie = 'bolueClient='+localStorage.getItem("bolueClient") + '; path=/ ;';
				window.location.href = __rootDir + '/livePlay/'+this.props.match.params.id;
				// + '?openid='+localStorage.getItem("credentials.openid")+'&code='+localStorage.getItem("credentials.code");
			} else {
				this._CanPlayVideo(false)
			}
		}
		else {
			this.props.history.push(`${__rootDir}/login`)
		}
	}

	Login() {
		this.props.history.push({ pathname: `${__rootDir}/login` })
	}

	//使用体验券
	_useDiscount() {
		EventCenter.emit("PropToDiscount")
	}

	componentWillMount() {
		Dispatcher.dispatch({
			actionType: 'LiveDetail',
			id: this.props.match.params.id
		})
	}
	componentDidMount() {

		devWidth = window.innerWidth;
		devHeight = window.innerHeight;
		EventCenter.emit("SET_TITLE", '铂略财课-直播课详情页')

		backNotloadIndex = 'PgDetail'
		if (this.props.location.state && this.props.location.state.isDownload) {
			this.setState({
				isNote: true
			})
		}
		this._hideAlert = EventCenter.on('HideAlert', this._handleHideAlert.bind(this))
		this._applyVoucher = EventCenter.on('ApplyVoucher', this._handleApplyVoucher.bind(this))
		this._liveDetail = EventCenter.on('LiveDetailDone', this._handleLiveDetail.bind(this))
		this._addLesson = EventCenter.on('AddLessonDone', this._handleAddLesson.bind(this))

		this._liveReserve = EventCenter.on('LiveReserveDone', this._handleLiveReserve.bind(this))
		this._JumpToDiscount = EventCenter.on('PropToDiscount', this._handleJumpToDiscount.bind(this))
		this._HideMask = EventCenter.on('HideMask', this._handleHideMask.bind(this));
	}
	componentWillUnmount() {
		this._liveDetail.remove()
		this._liveReserve.remove()
		this._hideAlert.remove()
		this._applyVoucher.remove()
		this._JumpToDiscount.remove()
		this._addLesson.remove()
		this._HideMask.remove()
		clearInterval(this.countInterval)
		clearInterval(this.refreshTimer)
		clearInterval(countdown);
	}
	//跳转至上一级页面
	_goBack() {
		window.history.go(-1);
	}

	render() {
		var score
		var assLogo
		var quest
		var hrStyle
		//var startStyle
		//var startType
		var learnNumType
		var liveStatus;
		var status;

		if (this.state.logo.length < 1) {
			assLogo = false
		} else {
			assLogo = true
		}
		if (this.state.question.length < 1) {
			quest = false
		} else {
			quest = true
		}
		if (this.state.teacher > 1) {
			if (index === this.state.teacher.length - 1) {
				hrStyle = styles.teacher_hr
			} else {
				hrStyle = styles.teacher_hr_margin
			}
		} else {
			hrStyle = styles.teacher_hr
		}

		//未预约的情况下并且免费名额大于0，且尚未开始或者正在直播的状态下显示
		if (this.state.free_num && this.state.free_num > 0 && this.state.status != 2) {
			this.isShow = true;
		}

		if (this.state.status == 0) {//尚未开始
			status = (
				<div style={{ ...styles.status_box, backgroundColor: '#ffeee8', color: '#f64d14', border: 'solid 1px #ff6633' }}>
					尚未开始
			</div>
			)
			if (this.state.isReserved) {//已预约
				liveStatus = (
					<div style={{ ...styles.status_bg, backgroundColor: '#a9a9a9' }}>
						<div style={{ ...styles.timeBg, }}>
							<div>
								{this.state.timerText}<br />
								{this.state.courseTimer}开播
								</div>
						</div>
						<div style={{ ...styles.liveButton, backgroundColor: '#a9a9a9' }}>进入直播</div>
					</div>
				)
			} else {//立即预约
				liveStatus = (
					<div style={{ ...styles.status_bg, }}>
						<div style={styles.timeBg}>
							<div>
								{this.state.timerText}<br />
								{this.state.courseTimer}开播</div>
						</div>
						<div style={{ ...styles.liveButton }} onClick={this._isCanPlayVideo.bind(this)}>立即预约</div>
					</div>
				)
			}
		}
		else if (this.state.status == 1) {//正在直播，进入直播间
			learnNumType = '人已参与'
			status = (
				<div style={{ ...styles.status_box, backgroundColor: '#e9f5ff', color: Common.Activity_Text, border: 'solid 1px #2196f3' }}>
					正在直播
				</div>
			)

			liveStatus = (
				<div onClick={this._run.bind(this)} style={{ ...styles.status_bg }}>
					<div style={{ ...styles.timeBg, }}>
						<div>正在直播<br />
							{this.state.courseTimer}
						</div>
					</div>
					<div style={{...styles.liveButton}}>进入直播</div>
				</div>
			)
		}
		else if (this.state.status == 2) {//直播结束
			learnNumType = '人已参与'
			status = (
				<div style={{ ...styles.status_box, backgroundColor: '#f3f3f3', color: Common.Gray, border: 'solid 1px #666' }}>
					直播结束
				</div>
			)
			if (this.state.online_id !== null) { //支持回放
				liveStatus = (
					<Link to={this.state.isLogin ? `${__rootDir}/lesson/online/${this.state.online_id}` : `${__rootDir}/login`}>
						<div
							style={{ ...styles.status_bg, backgroundImage: 'linear-gradient(90deg, #0da7e3 0%, #2196f3 100%)' }}>
							<div style={styles.status_time}>
								<div>直播结束<br />
									{this.state.courseTimer}开播
								</div>
							</div>
							<div style={{ marginLeft: 20, color: '#FFFFFF' }}>查看回放</div>
						</div>
					</Link>
				)
			} else {//暂不支持回放
				liveStatus = (
					<div style={{ ...styles.status_bg, backgroundColor: '#a9a9a9' }}>
						<div style={{ ...styles.timeBg, backgroundImage: 'none' }}>
							<div>直播结束<br />
								{this.state.courseTimer}开播
							</div>
						</div>
						<div style={{ ...styles.liveButton, backgroundColor: '#a9a9a9' }}>暂无回放</div>
					</div>
				)
			}
		}
		else if (this.state.status == 3) {//即将开始
			status = (
				<div style={{ ...styles.status_box, backgroundColor: '#B7EC7D', color: '#104F1F', border: 'solid 1px #00731C', opacity: 0.5 }}>
					即将开始
				</div>
			)
			if (this.state.isReserved) {//已预约
				liveStatus = (
					<div style={{ ...styles.status_bg, backgroundColor: '#a9a9a9' }}>
						<div style={{ ...styles.timeBg, }}>
							{this.state.timerText}
							<div>{this.state.courseTimer}</div>
						</div>
						<div style={{ ...styles.liveButton, backgroundColor: '#a9a9a9' }}>进入直播</div>
					</div>
				)
			} else {//立即预约
				liveStatus = (
					<div style={{ ...styles.status_bg, }}>
						<div style={styles.timeBg}>
							<div>{this.state.timerText}<br />
								{this.state.courseTimer}
							</div>
						</div>
						<div style={{ ...styles.liveButton }} onClick={this._isCanPlayVideo.bind(this)}>立即预约</div>
					</div>
				)
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

		//补全直播组件的uid
		var Uid = ''
		var addZero = ''
		for (var i = 0; i < 10 - (1 + String(this.state.uid).length); i++) {
			addZero = addZero + 0
		}
		Uid = 2 + addZero + String(this.state.uid)
		// 给直播组件传值
		let liveVideo = {
			ownerid: this.state.attendUrl,
			authcode: this.state.authcode,
			uid: Uid,
			uname: this.state.uname,
			isPlay: this.state.isPlay
		}

		//弹框组件传值
		let alertProps = {
			id: this.props.match.params.id,
			isShow: this.state.isShow,
			resource_count: this.state.resource_count,
			usePoint: this.state.usePoint,
			type: 1,
		}

		//预约报名组件
		let show = {
			show: this.state.alert,
			bookTitle: this.state.bookTitle,
			content: this.state.bookContent,
			bookContenttwo: this.state.bookContenttwo,
			rightButton: this.state.rightButton,
			buttonValue: this.state.buttonValue,
			resource_id: this.props.match.params.id,
			title: this.state.title
		}

		if (this.state.logo.length > 0) {
			var logo = this.state.logo.map((item, index) => {
				var left
				if (index == 0) {
					left = 12
				} else {
					left = 0
				}
				return (
					<div key={index} style={{ ...styles.ass_logo_div, marginLeft: left }}>
						{/*<img src={item.logo} style={{...styles.ass_logo}} />*/}
						{item.name}
					</div>
				)
			});
		}

		if (this.state.question.length > 0) {
			var question = this.state.question.map((item, index) => {
				return (
					<Link to={`${__rootDir}/QaDetail/${item.id}`} key={index}>
						<div>
							<div style={{ ...styles.question_title }}>
								<span style={{ color: '#333', fontSize: Fnt_Medium, marginBottom: 12 }} dangerouslySetInnerHTML={{__html: item.title}}></span>
							</div>
							<div style={{ marginLeft: 12, marginBottom: 12, marginRight: 12 }}>
								<img src={Dm.getUrl_img('/img/v2/icons/online_QA@2x.png')} style={{ width: 12, height: 12, marginRight: 5, position: 'relative', top: 1.5 }} />
								<span style={{ color: '#999', fontSize: Fnt_Normal }}>{item.question_answer_num}</span>
								<span style={{ marginRight: 12, color: '#999', fontSize: Fnt_Normal }}>回答</span>
								<span style={{ marginRight: 6, color: '#999', fontSize: Fnt_Normal, float: 'right' }}>{new Date(item.create_time).format("yyyy-MM-dd")}</span>
							</div>
						</div>
					</Link>
				)
			})
		}

		let errProps = {
			alert_display: this.state.alert_display,
			alert_title: this.state.alert_title,
			isShow: this.state.alertShow,
			errStatus: this.state.errStatus
		}
		// let geeseJs = this.state.isPlay ? <GenseeVideoJs /> : ''
		return (
			<div style={{ height: devHeight, display: 'flex', flexDirection: 'column' }}>
				<FullLoading isShow={this.state.isLoading} />
				<ResultAlert {...errProps} />
				<DataPrompt isShow={this.state.isNote} />

				<div style={{ backgroundColor: '#000', position: 'absolute', height: devHeight, width: '100%', opacity: 0.5, zIndex: 100, display: this.state.isShow || this.state.isSuccess || this.state.isNote ? 'block' : 'none' }} onClick={this._hideBlackGround.bind(this)}></div>

				<div style={{ ...styles.white_alert, paddingTop: -1, display: this.state.errInfo && this.state.errShow ? 'block' : 'none' }}>
					<div style={{ marginTop: 30 }}>{this.state.errInfo}</div>
					<div style={{ color: '#333' }} onClick={this._useDiscount.bind(this)}><span style={{ color: Common.Activity_Text }}>请使用优惠券</span></div>
					<div style={styles.alert_bottom}>
						<div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Normal, borderRight: 'solid 1px #d4d4d4' }} onClick={this._hideBlackGround.bind(this)}>取消</div>
						<div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Normal }} onClick={this._useDiscount.bind(this)}>确定</div>
					</div>
				</div>

				<div style={{ ...styles.white_alert, paddingTop: -1, display: this.state.isAlert ? 'block' : 'none' }}>
					<div style={{ marginTop: 30 }}>提示</div>
					<div style={{ color: '#333' }}>{this.state.err_title}</div>
					<div style={styles.alert_bottom}>
						<div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Normal, }} onClick={this._goBack.bind(this)}>知道了</div>
					</div>
				</div>
				<div style={{ backgroundColor: '#000', position: 'absolute', height: devHeight, width: '100%', opacity: 0.5, zIndex: 100, display: this.state.isAlert ? 'block' : 'none' }} onClick={this._goBack.bind(this)}></div>


				<div style={{ position: 'relative', width: window.screen.width, height: 236, backgroundColor: '#fff', display: this.state.isPlay ? 'none' : 'inline-block' }}>
					<div style={{ ...styles.free_content, display: this.isShow ? 'block' : 'none' }}>
						<div style={styles.free_text}>
							<img src={Dm.getUrl_img('/img/v2/icons/live_note@2x.png')} style={{ height: 13, width: 14, marginRight: 5 }} />
							还有<span style={{ color: Common.orange }}>{this.state.free_num}</span>个免费名额
						</div>
					</div>
					<img src={this.state.title_img} style={{ ...styles.top_img }} />
					{/*startStyle*/}
					<LiveAlert {...alertProps} />
					{/*
						<div style={{fontSize: 14, margin: '0px auto', position: 'relative', width: this.state.w_width, textAlign: 'center', color: 'white', zIndex: 2, marginTop: 10}}>
							{startType}: {new Date(this.state.start_time).format("yyyy-MM-dd")}<span style={{marginLeft: 10}}></span>{new Date(this.state.start_time).format("hh:mm")}-{new Date(this.state.end_time).format("hh:mm")}
						</div>
						*/}
				</div>
				<LiveVideo {...liveVideo} />
				{/*{geeseJs}*/}
				{/*<div style={styles.top_img} dangerouslySetInnerHTML={
					{
						__html:
							'<gs:video-live id="videoComponent" site="linked-f.gensee.com" ctx="webcast" ownerid="ec51c72245854d85b5cbd6817c23fc0e" uid="55831" uname="user5623" authcode="333333" lang="zh_CN" bar="true"></gs:video-live>'
					}
				}/>*/}
				{/*<div style={{height: 238, position: 'relative', top: 0}}/></div>*/}
				<Alert {...show} ChooseType={this._propShow.bind(this)} />

				<div style={{ height: devHeight - 296, overflowY: 'auto', backgroundColor: '#fff' }}>
					<div style={{ ...styles.t_title_div }}>
						<div style={{ ...styles.t_title, marginTop: 20 }}>
							<div style={{ float: 'left', marginRight: 15, marginTop: 2 }}>{status}</div>
							{this.state.title}
						</div>
						<div style={{ display: 'flex', flexDirection: 'row', height: 20, alignItems: 'center' }}>
							<img src={this.state.live_series == 3 ? Dm.getUrl_img('/img/v2/icons/CFO@2x.png') : Dm.getUrl_img('/img/v2/icons/SZT@2x.png')} style={{ height: 14, width: 60, }} />
							<img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} style={{ width: 11, height: 11, marginRight: 4, marginLeft: 50, }} />
							<span style={{ color: Common.orange, fontSize: 12, }}>{this.state.num}</span>
						</div>
						<div style={{ fontSize: Fnt_Medium, color: '#666', lineHeight: '18px', marginTop: 5 }}>{this.state.title_brief}</div>
					</div>
					<hr style={{ ...styles.t_hr }}></hr>
					<div style={{ backgroundColor: '#fff' }}>
						<div>
							<img src={Dm.getUrl_img('/img/v2/icons/teacher@2x.png')} style={{ ...styles.logo, height: 18 }} />
							<span style={{ ...styles.logo_title, color: '#000', fontSize: Fnt_Large }}>讲师介绍</span>
						</div>
						<TeacherDetail {...teacher} />
						{/*<hr style={hrStyle}></hr>*/}
						<hr style={{ ...styles.teacher_hr, marginBottom: 12 }}></hr>
					</div>
					<div style={{ backgroundColor: '#fff', display: assLogo ? 'block' : 'none' }}>
						<div>
							<img src={Dm.getUrl_img('/img/v2/icons/parter@2x.png')} style={{ ...styles.logo, height: 18, width: 18 }} />
							<span style={{ ...styles.logo_title, color: '#000', fontSize: Fnt_Large }}>合作协会</span>
						</div>
						<div style={{ margin: '12px 12px 0 12px' }}>
							{logo}
						</div>
						<hr style={{ ...styles.teacher_hr, marginTop: 0, marginBottom: 12 }}></hr>
					</div>

					<div style={{ backgroundColor: '#fff', minHeight: 100, }}>
						<div style={{ paddingBottom: 10, height: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<img src={Dm.getUrl_img('/img/v2/icons/lesson_qa@2x.png')} style={{ height: 18, width: 18, marginLeft: 12, marginRight: 10, marginBottom: 2 }} />
							<span style={{ color: Common.Light_Black, fontSize: Fnt_Large, fontWeight: 'bold' }}>问答列表</span>
							<span style={{ fontSize: 14, color: '#999', marginLeft: 4, }}>({this.state.question_count})</span>
						</div>
						{question}
						<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/question` : `${__rootDir}/login`, hash: null, query: null, state: { type: 'live', id: this.props.match.params.id } }}>
							<div style={{ ...styles.no_comment_div, backgroundColor: '#2196f3', display: quest ? 'none' : 'block' }}>
								<img src={Dm.getUrl_img('/img/v2/icons/white-qa@2x.png')} style={{ width: 16, height: 18, float: 'left', marginTop: 4, }} />
								<div style={{ ...styles.qa_text }}>
									提第一个问题
								</div>
							</div>
						</Link>
						<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/lessonQuestion/live/${this.props.match.params.id}` : `${__rootDir}/login`, hash: null, query: null, state: { type: 'live', id: this.props.match.params.id } }}>
							<div style={{ ...styles.have_comment_div, backgroundColor: '#ffffff', display: quest ? 'block' : 'none' }}>
								<div style={{ ...styles.no_comment_txt }}>
									查看所有问题
								</div>
							</div>
						</Link>
					</div>

					<hr style={{ ...styles.teacher_hr, marginTop: 0, marginBottom: 12 }}></hr>

					<div style={{ backgroundColor: '#fff', marginBottom: 12 }}>
						<div style={{ paddingBottom: 12 }}>
							<img src={Dm.getUrl_img('/img/v2/icons/more2@2x.png')} style={{ ...styles.logo, height: 18, width: 18, position: 'relative', top: 2 }} />
							<span style={{ ...styles.logo_title, color: '#000', fontSize: 16 }}>课程详情</span>
						</div>
						<div dangerouslySetInnerHTML={{ __html: this.state.html }} style={{ fontSize: 14, color: '#333', margin: '0px 12px' }}></div>
					</div>
					<hr style={{ ...styles.teacher_hr, marginTop: 0, marginBottom: 0, display: assLogo ? 'block' : 'none' }}></hr>
					{/*<div style={styles.br_div}></div>*/}

					{/*底部固定部分*/}
					<div style={styles.fix_box}>
						<div style={styles.bottom_box} onClick={this._collect.bind(this)}>
							<img src={Dm.getUrl_img('/img/v2/icons/QAguanzhu@2x.png')} style={{ height: 18, width: 18, display: this.state.changeCollectedType ? 'none' : 'block', }} />
							<img src={Dm.getUrl_img('/img/v2/icons/online-Fouces@2x.png')} style={{ height: 18, width: 18, display: this.state.changeCollectedType ? 'block' : 'none', }} />
							<span style={{ fontSize: 13, color: this.state.changeCollectedType ? '#2196f3' : '#666', marginLeft: this.state.changeCollectedType ? 0 : 4 }}>{this.state.changeCollectedType ? '取消关注' : '关注'}</span>
						</div>
						<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/AskQuestion` : `${__rootDir}/login`, hash: null, query: null, state: { type: 'live', id: this.props.match.params.id } }}>
							<div style={styles.bottom_box}>
								<img src={Dm.getUrl_img('/img/v2/icons/havent_qa@2x.png')} style={{ height: 17, width: 15, display: 'block' }} />
								<span style={{ fontSize: 13, color: '#666' }}>提问</span>
							</div>
						</Link>
						<div style={{ width: 226, height: 50, display: 'flex', flexDirection: 'column', color: Common.Bg_White }}>
							{liveStatus}
						</div>
						<div>

						</div>

					</div>
				</div>
				{this.state.isNote ?
					null : <Guide type={'live'} />
				}
			</div>
		)
	}
}

var styles = {
	start: {
		width: 226,
		height: 50,
	},
	status_bg: {
		width: 226,
		height: 50,
		fontSize: Fnt_Large,
		// textAlign: 'center',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	status_time: {
		paddingLeft: 25,
		fontSize: 11,
		color: '#f4f8f8',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start'
	},
	timeBg: {
		// paddingLeft: 25,
		width: 113,
		height: 50,
		fontSize: 11,
		color: '#f4f8f8',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundImage: 'linear-gradient(-90deg, #0DA7E3 0%, #2196F3 100%)'
	},
	liveButton: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2196F3',
		fontSize: 18,
		height: 50,
		width: 113,
	},
	greyButton: {
		backgroundColor: '#a9a9a9'
	},
	status_box: {
		width: 60,
		height: 18,
		lineHeight: '18px',
		textAlign: 'center',
		fontSize: 11,
		borderRadius: '100px',
		boxShadow: '0 2px 4px 0 #ffeee8',
	},
	top_img: {
		width: '100%',
		height: 236,
		position: 'absolute'
	},
	qa_text: {
		fontSize: 12,
		color: '#fff',
		float: 'left',
		height: 27,
		lineHeight: '27px',
		marginLeft: 5,
	},
	t_title_div: {
		paddingLeft: 12,
		paddingRight: 12,
		backgroundColor: '#fff',
	},
	t_title: {
		fontSize: Fnt_Large,
		color: Common.Light_Black,
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
		width: 16,
		height: 16,
		display: 'inline-block',
		marginRight: 9
	},
	ass_logo_div: {
		marginBottom: 14,
		height: 20,
		lineHeight: '20px',
		display: 'inline-block',
		marginRight: 15,
		backgroundColor: '#2196f3',
		padding: '0 5px',
		color: '#fff',
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
		border: 'none'
	},
	br_div: {
		height: 10,
		width: devWidth,
		backgroundColor: '#f3f7fa',
	},
	question_title: {
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3,
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		paddingLeft: 12,
		paddingRight: 12
	},
	no_comment_txt: {
		color: '#2196f3',
		fontSize: 12,
		height: 24,
		lineHeight: '24px',
		textAlign: 'center',
	},
	no_comment_div: {
		width: 100,
		height: 27,
		borderRadius: 4,
		padding: '3px 14px',
		margin: '0 auto',
	},
	// no_comment_div: {
	//   width: 100,
	//   height: 27,
	//   borderRadius: 4,
	//   padding: '3px 14px',
	//   margin: '0 auto',
	// 	marginBottom: 20,
	// },
	have_comment_div: {
		width: 90,
		height: 24,
		border: '1px solid #2196f3',
		borderRadius: 100,
		padding: '0px 14px',
		margin: '0 auto',
		marginBottom: 20
	},
	free_content: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		zIndex: 101,
		height: 24,
		width: devWidth,
		backgroundColor: '#000',
		opacity: 0.9,
	},
	free_text: {
		color: Common.Activity_Text,
		fontSize: Fnt_Small,
		textAlign: 'center',
		position: 'absolute',
		zIndex: 120,
		top: 0,
		left: 0,
		height: 24,
		lineHeight: '24px',
		width: devWidth,
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	white_alert: {
		width: devWidth - 100,
		height: 130,
		backgroundColor: Common.Bg_White,
		borderRadius: 12,
		position: 'absolute',
		zIndex: 200,
		top: devHeight / 2,
		left: 50,
		marginTop: -65,
		textAlign: 'center',
	},
	alert_bottom: {
		position: 'absolute',
		zIndex: 201,
		bottom: 0,
		left: 0,
		width: devWidth - 100,
		height: 42,
		borderTopStyle: 'solid',
		borderTopWidth: 1,
		borderTopColor: '#d4d4d4',
		display: 'flex',
		flex: 1,
	},
	fix_box: {
		backgroundColor: '#fff',
		width: devWidth,
		height: 50,
		position: 'fixed',
		left: 0,
		bottom: 0,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	bottom_box: {
		width: (devWidth - 226) / 2,
		paddingTop: 6,
		height: 43,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		borderTop: 'solid 1px #f3f3f3',
	}
}

export default PgLiveDetail;
