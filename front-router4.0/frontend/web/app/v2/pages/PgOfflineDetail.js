/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import CatalogList from '../components/CatalogList';
import Star from '../components/star';
import CommentList from '../components/CommentList';
import TeacherDetail from '../components/TeacherDetail';
import FullLoading from '../components/FullLoading';
import Dm from '../util/DmURL'
import Common from '../Common';
import ResultAlert from '../components/ResultAlert'
import DataPrompt from '../components/DataPrompt'
import DataPrompt2 from '../components/DataPrompt2'
import Guide from '../components/Guide'
import MsgAlert from '../components/MsgAlert'


var countdown;
class PgOfflineDetail extends React.Component {
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
			changeCollectedType: '',
			logo: [],
			question: [],
			teacher: [],
			address: '',
			provinceName: '',
			cityName: '',
			price: '',
			price_introduction: '',
			isExpired: '',
			user: {},
			isReservedNew: false,//true:已报名，false:未报名
			html: '',
			map_x: '',
			map_y: '',
			isLoading: true,
			isLogin: false,
			isSameDay: true,
			question_count: 0,
			main_holder: false,
			cooperate_type: '',
			type: null,
			offlineTypeStr: '',
			OfflineAut: {},
			freeNum: 0,
			authSingleCount: 0,
			authTotalCount: '',
			authFlag: '',
			authUnit: false, //如True 为点数 false 次数
			disp_status: null,//2为报名已满(特殊处理)
			mainEnroll: false,//是否是主持卡人
			mainInfo: {}, //用来判断是不是企业员工
			learn_num: 0,//学习人数
			isShow: false,//是否显示弹框
			//酒店名称
			site: '',
			//会场名称
			detail_place: '',
			//弹框提示信息
			alert_display: 'none',
			alert_title: '',
			errStatus: 0,//0:返回错误信息,1:显示其他提示信息
			isNote: false,//消息通知是否有课程资料更新
			isKnowledgeDownload: false,//提示铂略员工账号前往PC端下载
			isKnowledgeGot: false,//提示已经索取过实战笔记
			status: null,
			//个人报名
			register_id: null,
			//企业参课id
			resource_id: null,
			//课程是否下架
			isErr: 'none',//是否显示报错信息


			showMsgAlert: false,
			msgAlertTitle: '权益不足',
			msgAlertContent: '本课程为私享会课程,需要使用私享会券抵扣进行参课。请联系客服购买私享会券或选择另付费参课。',
			msgAlertLeftText: '联系客服',
			msgAlertRightText: '付费参课',
			msgAlertOnLeft: null,
			msgAlertOnRight: null

		};

		this.select = ''

		this.isList = false
	}

	_handleOfflineDetail(re) {
		console.log('_handleOfflineDetail==', re);
		if (re.err) {
			this.setState({
				isLoading: false,
				isErr: 'block',
				err: re.err
			})
			return false
		}
		if (re && re.result) {
			var req = re.result
			this.wx_config_share_home = {
				title: req.title,
				desc: req.offline_brief,
				link: document.location.href + '',
				imgUrl: req.brief_image,
				type: 'link',
				success: function () {
					// 用户确认分享后执行的回调函数
					//分享任务接口,8 视频课 / 9 直播课 / 10 线下课 / 11 专题课
					Dispatcher.dispatch({
						actionType: 'PostShareTask',
						type: 10,
					})
				},
			};
			EventCenter.emit("SET_TITLE", req.title)
			var cityName, address, map_x, map_y, site
			if (req.address) {
				cityName = req.address.cityname
				address = req.address.address
				map_x = req.address.map_x
				map_y = req.address.map_y
				site = req.address.site
			} else {
				cityName = ''
				address = ''
				map_x = ''
				map_y = ''
			}
			this.setState({
				isLoading: false,
				register_id: req.register_id,
				resource_id: req._id ? req._id : null,
				status: req.status,
				start_time: req.start_time,
				end_time: req.end_time,
				title_img: req.brief_image,
				title: req.title,
				title_brief: req.offline_brief,
				isCollected: req.isCollected,
				changeCollectedType: req.isCollected,
				logo: req.associations,
				teacher: req.teachers,
				cityName: cityName,
				provinceName: req.address && req.address.provincename ? req.address.provincename : '',
				site: req.address && req.address.site ? req.address.site : '',
				address: address,
				price: req.price != null ? req.price : "",
				price_introduction: req.price_introduction,
				isExpired: req.isExpired,
				disp_status: req.disp_status,
				user: re.user,
				isReservedNew: req.isReservedNew,
				html: req.offline_introduction,
				map_x: map_x,
				map_y: map_y,
				isLogin: re.user.isLogined,
				isSameDay: req.isSameDay,
				question: req.questions || [],
				question_count: req.questionCount,
				main_holder: re.user.main_holder,
				cooperate_type: req.cooperate_type,
				type: req.type,
				offlineTypeStr: req.offlineTypeStr,
				mainInfo: req.mainInfo || {},
				learn_num: req.learn_num,
				site: site,
				detail_place: req.detail_place || '',
				isKcUpload: req.isKcUpload,		//实战笔记是否已上传（当kcLinkType不为0时有用）
				kcLinkType: req.kcLinkType,		//实战笔记按钮显示类型，0:不显示，1:索取实战笔记，2:下载实战笔记
				plan_release_date: req.plan_release_date,		//实战笔记预计上线时间（毫秒时间戳）
				isPost: req.isPost
			}, () => {
				Dispatcher.dispatch({
					actionType: 'WX_JS_CONFIG',
					onMenuShareAppMessage: this.wx_config_share_home
				})
			})
		}
	}

	_collect() {
		if (this.state.isLogin == false) {
			this.props.history.push(`${__rootDir}/login`)
		} else {
			Dispatcher.dispatch({
				actionType: 'Collect',
				resource_id: this.props.match.params.id,
				resource_type: 3
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

	_handleOfflineReserveDone(re) {

	}
	_handlegetOfflineAuthDone(re) {
		console.log('线下课详情===', re);
		if (!re || re.err) {
			this.setState({
				alert_display: 'block',
				alert_title: re.err,
				isShow: false,
				errStatus: 0,
			}, () => {
				countdown = setInterval(() => {
					clearInterval(countdown);
					this.setState({
						alert_display: 'none',
					})
				}, 1500);
			})
			return false;
		}

		if (re.result) {
			this.setState({
				OfflineAut: re.result.data,
				freeNum: re.result.data ? re.result.data.freeNum : 0,
				authSingleCount: re.result.data ? re.result.data.authSingleCount : 0,
				authTotalCount: re.result.data ? re.result.data.authTotalCount : 0,
				authFlag: re.result.data ? re.result.data.authFlag : 0,
				mainEnroll: re.result.mainEnroll,
			}, () => {
				if (this.state.mainEnroll) {//进入主持卡人报名界面
					//主持卡人报名
					if (this.state.authFlag == 9 || this.state.authFlag == 11) {//权益不足，请联系客服
						this.setState({
							isShow: true,
						})
						return false;
					}
					//学习官报名
					//2.3.50新增
					//若该公司已配置私享会券数据但私享会券不足
					//authFlag = 13.
					if (re.result.data.authFlag == 13) {
						this.setState({
							showMsgAlert: true,
							msgAlertOnLeft: () => {
								this._applyVoucher();
							},
							msgAlertOnRight: () => {
								this.props.history.push({ pathname: `${__rootDir}/NewEnrollManyPeople`, query: null, hash: null, state: { id: this.props.match.params.id, OfflineAut: this.state.OfflineAut } })
								// window.location.href = __rootDir + '/enrollManyPeople';
							}
						})
					} else {
						this.props.history.push({ pathname: `${__rootDir}/NewEnrollManyPeople`, query: null, hash: null, state: { id: this.props.match.params.id, OfflineAut: this.state.OfflineAut } })
						// window.location.href = __rootDir + '/enrollManyPeople';

					}
				} else {
					//个人报名
					var authFlag = {
						freeNum: this.state.freeNum,
						authSingleCount: this.state.authSingleCount,
						authTotalCount: this.state.authTotalCount,
						authUnit: this.state.authUnit,
						mainInfo: this.state.mainInfo
					}
					this.props.history.push({ pathname: `${__rootDir}/PgPersonEnroll`, query: null, hash: null, state: { id: this.props.match.params.id, user: this.state.user, cooperate_type: this.state.cooperate_type, authFlag: authFlag } });
				}
			})
		}
	}
	componentWillMount() {
		localStorage.setItem('isDetail', 1)
		//移除线下课报名本地存储数据
		localStorage.removeItem('initData');
		localStorage.removeItem('times');
		localStorage.removeItem('addCompanyUserList');
		Dispatcher.dispatch({
			actionType: 'OfflineDetail',
			id: this.props.match.params.id
		})
	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE", '铂略财课-线下课详情页')
		backNotloadIndex = 'PgDetail'
		if (this.props.location.state && this.props.location.state.isDownload) {
			this.setState({
				isNote: true
			})
		}
		this._offlineDetail = EventCenter.on('OfflineDetailDone', this._handleOfflineDetail.bind(this))
		this._OfflineReserve = EventCenter.on('OfflineReserveDone', this._handleOfflineReserveDone.bind(this))
		this._OffgetOfflineAuth = EventCenter.on("getOfflineAuthDone", this._handlegetOfflineAuthDone.bind(this))
		this.e_hideAlert = EventCenter.on('HideAlert', this._handleHideAlert.bind(this))

		backFocuscompanyUserList = []
	}
	componentWillUnmount() {
		this._offlineDetail.remove()
		this._OfflineReserve.remove()
		this._OffgetOfflineAuth.remove()
		this.e_hideAlert.remove()
		localStorage.removeItem('key')
		clearInterval(countdown)
		//本地移除主持卡人报名，选中的员工list
		localStorage.removeItem('selected')
		//本地移除主持卡人报名应扣除的点/次的数量
		localStorage.removeItem('usedCount');
	}

	_handleHideAlert() {
		this.setState({
			isNote: false,
			isKnowledgeDownload: false,
		})
	}

	//了解更多
	_understandMore() {
		if (this.state.user.isLogined) {
			this.props.history.push({ pathname: `${__rootDir}/freeInvited` })
		} else {//登录
			this.props.history.push({ pathname: `${__rootDir}/login`, query: null, hash: null, state: null })
		}
	}

	_signUp() {
		if (this.state.user.isLogined) {//立即报名
			Dispatcher.dispatch({
				actionType: 'getOfflineAuth',
				id: this.props.match.params.id
			})
		} else {//登录
			this.props.history.push({ pathname: `${__rootDir}/login`, query: null, hash: null, state: null })
		}
	}

	//联系客服
	_applyVoucher() {
		this.setState({
			isShow: false
		}, () => {
			if (isWeiXin) {
				this.props.history.push({ pathname: `${__rootDir}/freeInvited` })
			}
			else {
				window.location.href = 'https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
			}
		})
	}
	//关闭弹框
	_hideAlert() {

		this.setState({
			isShow: false,
			isNote: false,
			isKnowledgeDownload: false,
			showMsgAlert: false
		})
	}

	//跳转到详情页
	_goDetails() {
		//主持卡人跳转至企业参课详情
		if (this.state.main_holder) {
			if (this.state.resource_id) {
				this.props.history.push({ pathname: `${__rootDir}/PgOffLlineMainHolderEnrollDetail/${this.state.resource_id}`, state: { _id: '_id' } })
			}
			else {
				//提示：该课下您企业暂无有效的报名记录。
				this.setState({
					alert_display: 'block',
					alert_title: '该课下您企业暂无有效的报名记录。',
					isShow: false,
					errStatus: 0,
				}, () => {
					countdown = setInterval(() => {
						clearInterval(countdown);
						this.setState({
							alert_display: 'none',
						})
					}, 1500);
				})
				return false;
			}
		}
		else {//跳转到报名详情
			this.props.history.push({ pathname: `${__rootDir}/PgOffLlineEnrollDetail/${this.state.register_id}` })
		}
	}

	//判断课程状态
	_offlineStatus() {
		var text_status = ''
		switch (this.state.status) {
			case 2:
				//已报名，待审核
				text_status = '已报名，待审核';
				break;
			case 3:
				//已报名，待参课
				text_status = '已报名，待参课';
				break;
			case 5:
				//已报名，已参课
				text_status = '已报名，已参课';
				break;
			case 6:
				//已报名，缺席
				text_status = '已报名，缺席';
				break;
			case 4:
			case 7:
			case 8:
			case 10:
			case 13:
				//已报名，报名关闭
				text_status = '已报名，报名关闭';
				break;
			case 9:
				//待确认
				text_status = '已报名，待确认';
				break;
			default:
				text_status = '已报名'
				break;
		}
		return text_status;
	}

	_goLogin() {
		this.props.history.push({ pathname: `${__rootDir}/login`, query: null, hash: null, state: { user: this.state.user, title: this.state.title, isReserved: this.state.isReservedNew } })
	}
	gotoMap(add) {
		window.location.href = 'http://api.map.baidu.com/marker?location=' + this.state.map_y + ',' + this.state.map_x + '&title=' + this.state.site + '&content=' + this.state.address + '&output=html'
	}

	_gotKnowledge() {
		this.setState({
			isKnowledgeGot: true
		}, () => {
			setTimeout(() => {
				this.setState({
					isKnowledgeGot: false
				})
			}, 3000);
		})
	}

	_downloadKnowledge() {
		this.setState({
			isKnowledgeDownload: true
		})
	}

	//报错回退到上一个界面
	cancelErr(re) {
		this.props.history.go(-1)
	}

	render() {

		console.log('this.state.loading', this.state.isLoading)

		var assLogo
		var hrStyle
		//课程状态
		var status;
		//按钮状态
		var startStyle;
		var text_status = '';
		var btn_text = '';

		//正在报名,左上角课程状态
		if (this.state.disp_status == 1) {
			//正在报名，按钮显示 正在报名
			status = (
				<div style={{ ...styles.status_box, backgroundColor: '#e9f5ff', color: Common.Activity_Text, border: 'solid 1px #2196f3' }}>
					正在报名
				</div>
			)
		}
		else if (this.state.disp_status == 2) {
			//报名已满，按钮显示了解更多
			status = (
				<div style={{ ...styles.status_box, backgroundColor: '#ffe1d8', color: '#f64d14', border: 'solid 1px #ff6633' }}>
					报名已满
				</div>
			)

		}
		else if (this.state.disp_status == 3) {
			//课程结束，按钮显示了解更多
			status = (
				<div style={{ ...styles.status_box, backgroundColor: '#f3f3f3', color: Common.Gray, border: 'solid 1px #666' }}>
					课程结束
				</div>
			)
		}
		else if (this.state.disp_status == 4) {
			//报名截止，按钮显示了解更多
			status = (
				<div style={{ ...styles.status_box, backgroundColor: '#ffe1d8', color: Common.red, border: 'solid 1px #ff0000' }}>
					报名截止
				</div>
			)
		}

		//按钮的状态
		var isService;//是否在线客服
		var statusButton = false;//是否显示大按钮（立即报名/在线客服）
		if (this.state.disp_status == 1) {
			//主持卡人
			if (this.state.main_holder) {
				//按钮立即报名
				isService = '立即报名'
			}
			else {
				//个人用户报名，判断是否已报名
				if (this.state.isReservedNew) {
					//已报名
					isService = '在线客服';
				}
				else {
					//未报名
					isService = '立即报名'
				}
			}
		}
		else {
			//在线客服
			isService = '在线客服';
		}

		//已报名，课程状态和按钮状态
		if (this.state.isReservedNew) {
			statusButton = true;
			//主持卡人报名
			if (this.state.status) {
				//主持卡人给自己报名
				text_status = this._offlineStatus();
			}
			else {
				console.log('444')
				//主持卡人给别人报名，课程状态显示已报名，按钮显示立即报名
				text_status = '已报名';
			}
		}
		else {
			statusButton = false;
			//未报名，显示立即报名
			text_status = '已报名'
		}

		startStyle = (
			<div style={styles.bg_box}>
				<div style={styles.status_details}>
					<div style={{ color: '#eaeaea' }}>{text_status}</div>
					<div style={{ fontSize: 14 }} onClick={this._goDetails.bind(this)}>查看详情</div>
				</div>
				{isService == '立即报名' ?
					<div style={{ ...styles.signup_button, width: 113 }} onClick={this._signUp.bind(this)}>
						<div style={{ fontSize: 18, color: '#f4f8fb', marginLeft: 6 }}>立即报名</div>
					</div>
					:
					<div style={{ ...styles.signup_button, width: 113 }} onClick={this._understandMore.bind(this)}>
						<img src={Dm.getUrl_img('/img/v2/icons/offline_service.png')} width={26} height={25} />
						<div style={{ fontSize: 11, color: '#f4f8fb', marginLeft: 6 }}>在线客服</div>
					</div>
				}
			</div>
		)


		if (this.state.logo.length < 1) {
			assLogo = false
		} else {
			assLogo = true
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

		// 老师介绍组件传值
		let teacher = {
			t_detail: this.state.teacher
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

		var showAlert = (
			<div style={{ ...styles.white_alert, paddingTop: -1 }}>
				<div style={{ marginTop: 25, fontSize: Fnt_Large, color: Common.Black }}>权益不足</div>
				<div style={{ color: '#333', fontSize: Fnt_Medium }}>请联系客服充值。</div>
				<div style={styles.alert_bottom}>
					<div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', borderRight: 'solid 1px #d4d4d4', fontSize: Fnt_Medium, color: Common.Activity_Text }} onClick={this._applyVoucher.bind(this)}>联系客服</div>
					<div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Gray }} onClick={this._hideAlert.bind(this)}>知道了</div>
				</div>
			</div>
		)


		var question = this.state.question.map((item, index) => {//问答列表

			return (
				<Link to={`${__rootDir}/QaDetail/${item.id}`} key={index}>
					<div>
						<div style={{ ...styles.question_title, fontSize: Fnt_Medium }}>
							<span style={{ color: '#333', fontSize: 14, marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: item.title }}></span>
						</div>
						<div style={{ marginLeft: 12, marginBottom: 18, marginRight: 12 }}>
							<img src={Dm.getUrl_img('/img/v2/icons/online_QA@2x.png')} style={{ width: 12, height: 12, position: 'relative', top: 1, marginRight: 5 }} />
							<span style={{ color: '#999', fontSize: Fnt_Normal }}>{item.question_answer_num}</span>
							<span style={{ marginRight: 12, color: '#999', fontSize: Fnt_Normal }}>回答</span>
							<span style={{ marginRight: 6, color: '#999', fontSize: Fnt_Normal, float: 'right' }}>{new Date(item.create_time).format("yyyy-MM-dd")}</span>
						</div>
					</div>
				</Link>
			)
		})

		var time = '';
		if (this.state.isSameDay) {
			time = (<span>{new Date(this.state.start_time).format("yyyy-MM-dd")}<span style={{ marginLeft: 5 }}>{new Date(this.state.start_time).format("hh:mm")}-{new Date(this.state.end_time).format("hh:mm")}</span></span>)
		}
		else {
			time = (<span>{new Date(this.state.start_time).format("yyyy-MM-dd") + " 至 " + new Date(this.state.end_time).format("MM-dd")}</span>)
		}
		//签到时间
		var _signTime = this.state.start_time ? new Date(this.state.start_time).format("hh:mm") : '';

		//type  1: 分享会 / 2: 公开课 / 3: 沙龙
		// var offline_type = '';
		var text_color = '';
		if (this.state.type == 1) {
			text_color = '#FF6633';
		}
		else if (this.state.type == 2) {
			text_color = '#2196F3';
		}
		else if (this.state.type == 3) {
			text_color = '#40BAE8';
		}
		else if (this.state.type == 4) {
			text_color = '#7148E2';
		}
		else if (this.state.type == 5) {
			text_color = '#CF59C7';
		}
		else if (this.state.type == 6) {
			text_color = '#1FC4A9';
		}
		else {
			text_color = '#E39F4A';
		}

		let alertProps = {
			alert_display: this.state.alert_display,
			alert_title: this.state.alert_title,
			isShow: this.state.isShow,
			errStatus: this.state.errStatus
		}

		//索取／下载实战笔记
		var getKnowledge;
		if (this.state.kcLinkType == 0) {	// 不显示
			getKnowledge = null;
		} else {
			var date_text = null;
			if (this.state.plan_release_date) {
				var date = new Date(this.state.plan_release_date).format('yyyy');
				var year = new Date().getFullYear();
				if (date == year) {
					date_text = (new Date(this.state.plan_release_date).getMonth() + 1) + '月';//月份
				}
				else {
					date_text = new Date(this.state.plan_release_date).format('yyyy年M月')
				}
			}

			if (this.state.kcLinkType == 1) {		//索取实战笔记
				console.log('ispost-----', this.state.isPost)
				if (this.state.isPost) {		//索取过了
					getKnowledge = (
						<div>
							<hr style={{ ...styles.t_hr, marginTop: 13 }}></hr>
							<div style={{ ...styles.off_text, marginTop: 20 }} onClick={this._gotKnowledge.bind(this)}>
								<img src={Dm.getUrl_img('/img/v2/icons/kapian@2x.png')} style={{ ...styles.logo, width: 19, height: 19, marginRight: 3 }} />
								<div style={{ ...styles.text_title, width: devWidth - 51, color: '#f37633' }}>索取实战笔记</div>
								<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={styles.more} />
							</div>
						</div>
					)
				} else {
					getKnowledge = (
						<div>
							<hr style={{ ...styles.t_hr, marginTop: 13 }}></hr>
							<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/GetKnowledgeCard/${this.props.match.params.id}` : `${__rootDir}/login`, hash: null, query: null, state: {} }}>
								<div style={{ ...styles.off_text, marginTop: 20 }}>
									<img src={Dm.getUrl_img('/img/v2/icons/kapian@2x.png')} style={{ ...styles.logo, width: 19, height: 19, marginRight: 3 }} />
									<div style={{ ...styles.text_title, width: devWidth - 51 - (date_text == null ? 0 : 130), color: '#f37633' }}>索取实战笔记</div>
									{
										date_text != null ?
											<div style={{ width: 130, color: '#999', fontSize: 12, textAlign: 'right', paddingRight: 10 }}>预计{date_text}上线</div>
											:
											''
									}
									<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={styles.more} />
								</div>
							</Link>
						</div>
					)

				}
			} else if (this.state.kcLinkType == 2) {		//下载实战笔记
				getKnowledge = (
					<div>
						<hr style={{ ...styles.t_hr, marginTop: 13 }}></hr>
						{
							this.state.isKcUpload == false ?
								(
									<div style={{ ...styles.off_text, marginTop: 20 }}>
										<img src={Dm.getUrl_img('/img/v2/icons/kapian3@2x.png')} style={{ ...styles.logo, width: 19, height: 19, marginRight: 3 }} />
										<div style={{ ...styles.text_title, width: devWidth - 51 - 130, color: '#777' }}>下载实战笔记</div>
										<div style={{ width: 130, color: '#999', fontSize: 12, textAlign: 'right', paddingRight: 10 }}>预计{date_text}上线</div>
										{/* <img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={styles.more} /> */}
									</div>
								)
								:
								(
									<div style={{ ...styles.off_text, marginTop: 20 }} onClick={this._downloadKnowledge.bind(this)}>
										<img src={Dm.getUrl_img('/img/v2/icons/kapian20@2x.png')} style={{ ...styles.logo, width: 19, height: 19, marginRight: 3 }} />
										<div style={{ ...styles.text_title, width: devWidth - 51, color: '#11A4E6' }}>下载实战笔记</div>
										<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={styles.more} />
									</div>
								)
						}
					</div>
				)
			}
		}


		return (
			<div style={{ backgroundColor: '#fff', overflowY: 'auto', height: devHeight - 50, position: 'absolute', width: devWidth }}>
				<FullLoading isShow={this.state.isLoading} />
				<ResultAlert {...alertProps} />
				<DataPrompt isShow={this.state.isNote} />
				<DataPrompt2 isShow={this.state.isKnowledgeDownload} />
				<MsgAlert
					title={this.state.msgAlertTitle}
					content={this.state.msgAlertContent}
					isShow={this.state.showMsgAlert}
					leftText={this.state.msgAlertLeftText}
					rightText={this.state.msgAlertRightText}
					onClickLeft={this.state.msgAlertOnLeft}
					onClickRight={this.state.msgAlertOnRight} />
				<div style={{ ...styles.layer, display: this.state.isKnowledgeGot ? 'block' : 'none' }}>
					<span style={{ fontSize: 14, color: '#ffffff' }}>您已索取过该课实战笔记，请勿重复索取</span>
				</div>
				<div style={{ ...styles.msk, display: this.state.isShow || this.state.isNote || this.state.isKnowledgeDownload || this.state.showMsgAlert ? 'block' : 'none' }} onClick={this._hideAlert.bind(this)}></div>
				{this.state.isShow ?
					showAlert
					:
					null
				}
				<div style={{ height: devHeight }}>
					<div style={{ height: 236 }}>
						<img src={this.state.title_img} style={{ ...styles.top_img }} />
					</div>
					<div style={{ ...styles.t_title_div, marginBottom: 15 }}>
						<div style={{ display: 'flex', flexDirection: 'row', marginTop: 20, marginBottom: 13, alignItems: 'flex-start' }}>
							<div style={{ ...styles.t_title, }}>
								<div style={{ float: 'left', marginRight: 15, marginTop: 2 }}>{status}</div>
								{this.state.title}
							</div>
						</div>
						<div style={styles.public}>
							<img src={Dm.getUrl_img('/img/v2/icons/icon_offline.png')} width={13} height={13} />
							<span style={{ fontSize: Fnt_Small, color: text_color, marginLeft: 10 }}>{this.state.offlineTypeStr}</span>

							{/*<img src={Dm.getUrl_img('/img/v2/icons/people1213@2x.png')} style={{width: 12, height: 11,margin:'1px 5px 0 30px'}}/>
								<span style={{color:'#666',fontSize:Fnt_Small}}>{this.state.learn_num}</span>
							*/}
						</div>
						<p style={{ fontSize: 14, color: '#666', lineHeight: '18px', marginTop: 10, }}>{this.state.title_brief}</p>
					</div>
					<hr style={{ ...styles.t_hr }}></hr>
					<div style={{ ...styles.off_text, marginTop: 15, }}>
						<img src={Dm.getUrl_img('/img/v2/icons/s_time@2x.png')} style={{ ...styles.logo }} />
						<span style={{ ...styles.text_title, marginRight: 20 }}>举办时间<span style={{ color: Common.Black, fontSize: Fnt_Normal, marginLeft: 10 }}>{time}</span>
							{_signTime ?
								<span style={{ marginLeft: 10 }}>({_signTime} 签到)</span>
								:
								null
							}
						</span>
					</div>
					<div style={{ ...styles.off_text, marginTop: 20 }} onClick={this.gotoMap.bind(this)}>
						<img src={Dm.getUrl_img('/img/v2/icons/offline_address2@2x.png')} style={{ ...styles.logo, height: 14, width: 15 }} />
						<div style={{ ...styles.text_title, ...styles.LineClamp, width: devWidth - 48 }}>举办地址<span style={{ color: Common.Black, marginLeft: 10 }}>{this.state.provinceName}&nbsp;{this.state.cityName}&nbsp;{this.state.address}</span></div>
						<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={styles.more} />
					</div>

					<div style={{ ...styles.off_text, marginTop: 20 }}>
						<img src={Dm.getUrl_img('/img/v2/course/meeting.png')} style={{ ...styles.logo, width: 14, height: 15 }} />
						<div style={{ ...styles.text_title }}>会场名称<span style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>{this.state.site}&nbsp;{this.state.detail_place}</span></div>
					</div>

					<div style={{ ...styles.off_text, marginTop: 20 }}>
						<img src={Dm.getUrl_img('/img/v2/icons/price@2x.png')} style={{ ...styles.logo, width: 14, height: 13 }} />
						<div style={{ ...styles.text_title }}>参课价格<span style={{ color: '#f37633', marginLeft: 10 }}>￥{this.state.price}</span><span style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>VIP会员参课价格请参考会员权益</span></div>
					</div>
					<Link to={{ pathname: `${__rootDir}/price`, query: null, hash: null, state: { price: this.state.price_introduction } }}>
						<div style={{ ...styles.off_text, marginTop: 20 }}>
							<img src={Dm.getUrl_img('/img/v2/icons/icon_description@2x.png')} style={{ ...styles.logo, width: 14, height: 17, }} />
							<div style={{ ...styles.text_title, width: devWidth - 51 }}>参课须知</div>
							<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={styles.more} />
						</div>
					</Link>
					{getKnowledge}
					<hr style={{ ...styles.t_hr, marginLeft: 0, marginRight: 0, marginTop: 15 }}></hr>

					<div style={{ backgroundColor: '#fff', marginTop: 15 }}>
						<div>
							<img src={Dm.getUrl_img('/img/v2/icons/teacher@2x.png')} style={{ ...styles.logo, height: 18, width: 16 }} />
							<span style={{ ...styles.logo_title, color: '#000', fontSize: Fnt_Large, fontWeight: 'bold' }}>讲师介绍</span>
						</div>
						{this.state.teacher && this.state.teacher.length > 0 ?
							<TeacherDetail {...teacher} />
							:
							<div style={{ ...styles.text_title, textAlign: 'center', paddingTop: 10 }}>暂无相关老师介绍</div>
						}

						<hr style={hrStyle}></hr>
					</div>

					{/*<hr style={{...styles.teacher_hr, marginTop: 0, marginBottom: 12}}></hr>*/}

					<hr style={{ ...styles.teacher_hr, marginTop: 0, marginBottom: 12, display: assLogo ? 'block' : 'none' }}></hr>

					<div style={{ backgroundColor: '#fff', display: assLogo ? 'block' : 'none' }}>
						<div>
							<img src={Dm.getUrl_img('/img/v2/icons/parter@2x.png')} style={{ ...styles.logo, height: 18, width: 18 }} />
							<span style={{ ...styles.logo_title, color: '#000', fontSize: Fnt_Large, fontWeight: 'bold' }}>合作机构</span>
						</div>
						<div style={{ margin: '12px 12px 0 12px' }}>
							{logo}
						</div>
					</div>

					<div style={{ backgroundColor: '#fff', minHeight: 100 }}>
						<div style={{ paddingBottom: 10, height: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<img src={Dm.getUrl_img('/img/v2/icons/lesson_qa@2x.png')} style={{ height: 18, width: 18, marginLeft: 12, marginRight: 10, marginBottom: 2 }} />
							<span style={{ color: Common.Light_Black, fontSize: Fnt_Large, fontWeight: 'bold' }}>问答列表</span>
							<span style={{ fontSize: 14, color: '#999', marginLeft: 4, }}>({this.state.question_count})</span>
						</div>
						{question}

						{
							this.state.question_count == 0 ?
								<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/AskQuestion` : `${__rootDir}/login`, hash: null, query: null, state: { type: 'offline', id: this.props.match.params.id } }}>
									<div style={{ ...styles.no_comment_div, backgroundColor: '#2196f3', display: this.state.question_count != 0 ? 'none' : 'block' }}>
										<img src={Dm.getUrl_img('/img/v2/icons/white-qa@2x.png')} style={{ width: 16, height: 18, float: 'left', marginTop: 4, }} />
										<div style={{ ...styles.qa_text, }}>
											提第一个问题
										</div>
									</div>
								</Link>
								:
								<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/lessonQuestion/offline/${this.props.match.params.id}` : `${__rootDir}/login`, hash: null, query: null, state: { type: 'online', id: this.props.match.params.id } }}>
									<div style={{ ...styles.have_comment_div, backgroundColor: '#ffffff', display: this.state.question_count != 0 ? 'block' : 'none' }}>查看所有问题</div>
								</Link>
						}

						<hr style={hrStyle}></hr>
						{/*<hr style={{...styles.teacher_hr, marginTop: 0, marginBottom: 0, display: assLogo ? 'block' : 'none'}}></hr>*/}
					</div>

					<div style={{ backgroundColor: '#fff', marginBottom: 12 }}>
						<div style={{ paddingBottom: 12 }}>
							<img src={Dm.getUrl_img('/img/v2/icons/more2@2x.png')} style={{ ...styles.logo, width: 16, height: 16 }} />
							<span style={{ ...styles.logo_title, color: '#000', fontSize: 16, fontWeight: 'bold' }}>课程详情</span>
						</div>
						<div dangerouslySetInnerHTML={{ __html: this.state.html }} style={{ fontSize: 14, color: '#333', margin: '0px 12px' }}></div>
					</div>
					<div style={{ ...styles.br_div }}></div>
					<div style={styles.fix_box}>
						<div style={{ width: devWidth - 226, borderTop: 'solid 1px #f3f3f3', height: 49 }}>
							<div style={{ ...styles.CollectDiv }} onClick={this._collect.bind(this)}>
								<div style={{ height: 18, }}>
									{this.state.changeCollectedType ?
										<img src={Dm.getUrl_img('/img/v2/icons/online-Fouces@2x.png')} style={{ height: 18, width: 18 }} />
										:
										<img src={Dm.getUrl_img('/img/v2/icons/onlineFouces@2x.png')} style={{ height: 18, width: 18 }} />
									}
								</div>
								<div style={{ fontSize: 13, color: this.state.changeCollectedType ? '#2196f3' : '#666' }}>{this.state.changeCollectedType ? '取消关注' : '关注'}</div>
							</div>
							<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/AskQuestion` : `${__rootDir}/login`, hash: null, query: null, state: { type: 'online', id: this.props.match.params.id } }}>
								<div style={{ ...styles.CollectDiv, position: 'absolute', zIndex: 11, bottom: 0, left: (devWidth - 226) / 2 }}>
									<div style={{ height: 18 }}>
										<img src={Dm.getUrl_img('/img/v2/icons/havent_qa@2x.png')} style={{ height: 17, width: 15, }} />
									</div>
									<div style={{ fontSize: 13, color: '#666', }}>提问</div>
								</div>
							</Link>
						</div>
						{statusButton ?
							startStyle
							:
							<div>
								{isService == '立即报名' ?
									<div style={{ ...styles.signup_button }} onClick={this._signUp.bind(this)}>
										<div style={{ fontSize: 18, color: '#f4f8fb', marginLeft: 6 }}>立即报名</div>
									</div>
									:
									<div style={{ ...styles.signup_button }} onClick={this._understandMore.bind(this)}>
										<img src={Dm.getUrl_img('/img/v2/icons/offline_service.png')} width={26} height={25} />
										<div style={{ fontSize: 18, color: '#f4f8fb', marginLeft: 6 }}>在线客服</div>
									</div>
								}
							</div>
						}
					</div>
				</div>
				{this.state.isNote ?
					null : <Guide type={'offline'} />
				}

				<div style={{ ...styles.zzc, display: this.state.isErr }} onClick={this.cancelErr.bind(this)}></div>
				<div style={{ width: 270, height: 104, backgroundColor: '#FFFFFF', borderRadius: '12px', textAlign: 'center', position: 'absolute', zIndex: 999999, left: (devWidth - 270) / 2, top: (devHeight - 104) / 2, display: this.state.isErr }}>
					<div style={{ height: 60, textAlign: 'center', lineHeight: 4 }}>
						<span style={{ fontSize: 14, color: '#030303', fontFamily: 'pingfangsc-regular' }}>{this.state.err}</span>
					</div>
					<div style={{ width: 270, height: 1, backgroundColor: '#fff', borderBottom: 'solid 1px #d4d4d4' }}></div>
					<div style={{ height: 43, textAlign: 'center', lineHeight: 2.5 }} onClick={this.cancelErr.bind(this)}>
						<span style={{ fontSize: 17, color: '#0076ff', fontFamily: 'pingfangsc-regular' }}>知道了</span>
					</div>
				</div>


			</div>
		)
	}
}

var styles = {
	start: {
		position: 'relative',
		margin: '0 auto',
		index: 99,
		top: 100,
		backgroundColor: '#d1d1d1',
		width: 125,
		height: 41,
		borderRadius: 50,
		color: '#fff',
		fontSize: 16,
		textAlign: 'center',
		zIndex: 2,
		lineHeight: '41px'
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
		backgroundColor: '#fff'
	},
	t_title: {
		fontSize: Fnt_Large,
		color: Common.Light_Black,
	},
	t_hr: {
		backgroundColor: '#e0e0e0',
		border: 'none',
		height: 1,
		marginLeft: 12,
		marginRight: 12
	},
	logo_title: {
		color: '#333',
		fontSize: 13,
		verticalAlign: 'text-bottom',
		width: devWidth - 63,
		marginRight: 5
	},
	off_text: {
		height: 20,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	public: {
		display: 'flex',
		flexDirection: 'row',
		height: 20,
		alignItems: 'center',
		position: 'relative',
	},
	more: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginRight: 12,
		width: 7,
		height: 12,
	},
	teacher_img: {
		width: 43,
		height: 43,
		borderRadius: 50,
		display: 'inline-block',
		marginRight: 10
	},
	teacher_hr_margin: {
		backgroundColor: '#bdbdbd',
		border: 'none',
		height: 0.5,
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
		backgroundColor: '#bdbdbd',
		border: 'none',
		height: 0.5,
		marginBottom: 15,
		marginTop: 15
	},
	logo: {
		marginLeft: 12,
		width: 15,
		height: 15,
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
	signup_button: {
		backgroundImage: 'linear-gradient(90deg, #0da7e3 0%, #2196f3 100%)',
		width: 226,
		height: 50,
		color: Common.Bg_White,
		// textAlign:'center',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	bg_box: {
		width: 226,
		display: 'flex',
		flexDirection: 'row',
		height: 50
	},
	status_details: {
		width: 99,
		paddingLeft: 14,
		backgroundColor: '#6CBEFE',
		height: 50,
		color: Common.Bg_White,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		fontSize: 11
	},
	btn_detail: {
		backgroundImage: 'linear-gradient(90deg, #0da7e3 0%, #2196f3 100%)',
		width: 226,
		height: 50,
		color: Common.Bg_White,
		textAlign: 'center',
	},
	fix_box: {
		backgroundColor: '#fff',
		position: 'fixed',
		bottom: 0,
		width: devWidth,
		height: 50,
		zIndex: 10,
		display: 'flex',
		flexDirection: 'row',
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
	CollectDiv: {
		width: (devWidth - 226) / 2,
		height: 49,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	have_comment_div: {
		width: 90,
		height: 24,
		border: '1px solid',
		borderRadius: 100,
		borderColor: '#666',
		// padding: '0px 14px',
		margin: '0 auto',
		borderColor: '#2196f3',
		marginBottom: 20,
		textAlign: 'center',
		fontSize: 12,
		color: '#2196f3',
		lineHeight: '24px'
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
		borderRadius: 4,
		padding: '3px 14px',
		margin: '0 auto',
	},
	LineClamp: {
		textOverflow: 'ellipsis',
		whiteSpace: 'normal',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 1,
	},
	white_alert: {
		width: devWidth - 100,
		height: 150,
		backgroundColor: Common.Bg_White,
		borderRadius: 12,
		position: 'absolute',
		zIndex: 1000,
		top: 180,
		left: 50,
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
	msk: {
		width: devWidth,
		height: devHeight,
		backgroundColor: '#000000',
		position: 'fixed',
		zIndex: 999,
		opacity: 0.2,
		top: 0,
		textAlign: 'center',
	},
	text_title: {
		fontSize: Fnt_Normal,
		color: Common.Light_Gray,
	},
	kapian: {
		width: 90,
		height: 24,
		border: '1px solid #f37633',
		borderRadius: '2px',
		textAlign: 'center',
		position: 'absolute',
		right: 0,
	},
	zzc: {
		width: devWidth,
		height: devHeight,
		backgroundColor: '#cccccc',
		position: 'fixed',
		opacity: 0.5,
		zIndex: 99998,
		top: 0,
	},
	layer: {
		width: 190,
		// height:30,
		backgroundColor: '#000000',
		borderRadius: '5px',
		opacity: 0.7,
		position: 'fixed',
		top: 254,
		zIndex: 999,
		textAlign: 'center',
		lineHeight: 2,
		marginLeft: (devWidth - 190) / 2,
		padding: '0 10px'
	}

}

export default PgOfflineDetail;
