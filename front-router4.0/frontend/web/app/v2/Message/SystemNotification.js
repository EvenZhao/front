/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common'

import Loading from '../components/Loading';
import FullLoading from '../components/FullLoading';
import funcs from '../util/funcs'
import DataPrompt3 from '../components/DataPrompt3'

var dataLimit = 15

class SystemNotification extends React.Component {
	constructor(props) {
		super(props);
		this.dataSkip = 0
		this.wx_config_share_home = {
			title: '消息中心',
			desc: '',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link'
		};
		this.state = {
			title: 'PgHome',
			data: [],
			loadmore: true,
			isLoading: true,
			isOver: false,
			isShow: false,
			DataPrompt3IsShow: false,
		};
	}
	componentWillMount() {
		Dispatcher.dispatch({
			actionType: 'getMessageInfo',
			type: this.props.location.state.type,
			skip: this.dataSkip,
			limit: dataLimit
		})
	}
	//关闭弹框
	_handleHideAlert() {
		this.setState({
			DataPrompt3IsShow: false,
		})
	}
	_handlegetMessageInfoDone(re) {
		console.log('_handlegetMessageInfoDone', re);
		this.setState({
			data: re.result || [],
			loadmore: re.result.length >= dataLimit ? true : false,
			isLoading: false,
			isOver: re.result.length >= dataLimit ? false : true,
		})
	}
	_handlegetreadMessageDone(re) {
		console.log('_handlegetreadMessageDone'.re);
	}
	_MessageListloadMore() {
		if ((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) < document.documentElement.clientHeight) {
			if (this.state.canNotLoad == true) {
				return
			}
			if (this.state.loadmore == true) {
				this.setState({
					isShow: true
				}, () => {
					this._gotoLoadMore()
				})
			} else {
				this.setState({
					isShow: false,
					isOver: true,
					loadmore: false
				})
			}
		}
	}
	_gotoLoadMore(re) {
		this.dataSkip = this.state.data.length || 0
		Dispatcher.dispatch({
			actionType: 'getMessageInfo',
			limit: dataLimit,
			skip: this.dataSkip,
			loadmore: true,
			type: this.props.location.state.type
		})
	}
	_handleCanNotLoad() {
		this.setState({
			canNotLoad: true
		})
	}
	_handlegetMessageInfoLoadMoreDone(re) {
		this.setState({
			data: this.state.data.concat(re.result || []),
			loadmore: re.result.length >= dataLimit ? true : false,
			isLoading: false,
			isOver: re.result.length >= dataLimit ? false : true,
			canNotLoad: false,
			isShow: false
		})
	}
	componentDidMount() {

		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE", '铂略财课-系统通知')
		this.ongetMessageInfoDone = EventCenter.on('getMessageInfoDone', this._handlegetMessageInfoDone.bind(this))
		this.ongetreadMessageDone = EventCenter.on('readMessageDone', this._handlegetreadMessageDone.bind(this))
		this._canNotLoad = EventCenter.on('canNotLoad', this._handleCanNotLoad.bind(this))
		this._getMessageInfoLoadMoreDone = EventCenter.on('getMessageInfoLoadMoreDone', this._handlegetMessageInfoLoadMoreDone.bind(this))
		this.e_hideAlert = EventCenter.on('HideAlert', this._handleHideAlert.bind(this))
	}
	componentWillUnmount() {
		this.ongetMessageInfoDone.remove()
		this.ongetreadMessageDone.remove()
		this._canNotLoad.remove()
		this._getMessageInfoLoadMoreDone.remove()
		this.e_hideAlert.remove()
	}
	gotToDetail(jumpUrl, redID, type, action) {
		Dispatcher.dispatch({
			actionType: 'readMessage',
			id: redID,
			type: type,
			action: action
		})
		if (30 <= action && action <= 32) {
			this.setState({
				DataPrompt3IsShow: true,
			})
			return false;
		}
		if (jumpUrl) {
			var str_params = jumpUrl.split('/')[jumpUrl.split('/').length - 1];
			var urlArray = jumpUrl.split('/');
			urlArray = urlArray.splice(3, urlArray.length - 3);
			var new_array;
			var params = '';

			if (str_params == 'download') {//有资料下载更新，给出提示
				new_array = urlArray.splice(urlArray.length - 1, 1)
				EventCenter.emit("DownloadInfo")
			}
			if (urlArray[0] == 'test') {
				new_array = urlArray.splice(1, urlArray.length - 1)
			}
			else {
				new_array = urlArray;
			}
			for (var i = 0; i < new_array.length; i++) {
				params += '/' + new_array[i]
			}
			this.props.history.push({ pathname: `${__rootDir}` + params, query: null, hash: null, state: {} });
		}
	}

	removeHtmlTag(str) {
		if (str) {
			var str1 = str.replace(/<[^>]+>/g, "");
			var str2 = str1.replace(/&nbsp;/ig, ' ');
		}
		return str2;
	}

	//解析body
	Analysis_body(content, firstArry, keyArry, strArry) {
		//  var keyArry = [];//用来存储body中取出来作为key的数组
		//  var strArry = [];//用来存储body中除去key以为的部分
		var body_str = null;//body字段内容
		var first_str = '';//数组中移除的第一项的value
		var body_content = '';//最终解析出来的body内容
		if (content.body) {
			body_str = content.body.split('♂');//第一次分隔字符串放入数组
			if (body_str.length > 1) {
				firstArry = body_str.slice(1);//移除数组中第一个
				first_str = body_str.splice(0, 1);//返回数组中移除的第一个元素的value
				var key = '';
				var second_str = '';

				firstArry.map((item, index) => {
					key = item.split('♀')[0];
					second_str = item.split('♀')[1];
					keyArry.push(key);
					strArry.push(second_str);
				})
				for (var i = 0; i < keyArry.length; i++) {
					if (content[keyArry[i]] == null) {
						content[keyArry[i]] = '';
					}
					body_content += content[keyArry[i]] + strArry[i];
				}
				return body_content = first_str + body_content;
			}
		}
	}

	render() {

		var listNull = (
			<div style={{ textAlign: 'center', paddingTop: 114 }}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{ marginTop: 51 }}>
					<span style={{ fontSize: 15, color: '#999999' }}>暂无通知哦~</span>
				</div>
			</div>
		)
		var list = this.state.data.map((item, index) => {
			var BgColor = '#EEEEEE'
			if (item.isRead) {
				BgColor = '#f9f9f9'
			}
			var title  //标题
			var content_type = '';//内容类型
			var content = item.contentNew || item.content;
			var sendTime = new Date(item.send_time).format('yyyy-MM-dd');
			var new_sendTime = someDay(item.send_time);

			var context = ''; //内容
			var id = content.resourceId || '' //详情ID
			var jumpUrl = item.jumpUrl;//跳转url
			var more_text = '';//查看详情
			var messageLength = 0;//消息条数
			var duration_time = '';//开始--结束时间

			var firstArry = [];//用来临时存储
			var keyArry = [];//用来存储body中取出来作为key的数组
			var strArry = [];//用来存储body中除去key以为的部分
			var body_str = null;//body字段内容
			var first_str = '';//数组中移除的第一项的value
			var body_content = '';//最终解析出来的body内容

			switch (item.action) {
				case 29:
					title = '今日考试提醒'
					messageLength = content.listSize;
					context = content.quizList[0].quizTitle;
					duration_time = '(时间：' + content.quizList[0].dateString + ')';
					more_text = (
						<div style={{ ...styles.more, display: messageLength > 0 ? 'flex' : 'none' }}>
							<span style={{ marginRight: 10 }}>查看全部{messageLength}个内容</span>
							<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12 }} />
						</div>
					)
					break;
				case 30:
					title = '您的考试考场已经开放';
					context = content.title;
					duration_time = '(时间：' + content.duration + ')';
					id = content.id;
					break;
				case 31:
					title = '您的考试已被撤销';
					context = content.title;
					duration_time = '(时间：' + content.duration + ')';
					id = content.id;
					break;
				case 32:
					title = content.accountName + '发布了新的考试';
					context = content.title;
					duration_time = '(时间：' + content.duration + ')';
					id = content.id;
					break;
				case 1:
					title = '您关注的直播系列下更新一门课程：'
					context = content.seriesTitle
					id = content.resourceId
					break;
				case 2:
					title = '您预约的直播课即将开始：'
					context = content.title
					id = content.resourceId
					break;
				case 3:
					title = '视频课上线提醒'
					context = content.title
					id = content.resourceId
					break;
				case 4:
					title = '您报名/收到报名的线下课即将开始：'
					context = content.title
					id = content.resourceId
					break;
				case 5:
					var updateNum = content.updateNum || 1
					title = '您关注的问题收到' + updateNum + '条新回答：'
					context = content.questionTitle
					id = content.questionId
					break;
				case 6:
					title = '您关注的问题提问者设置采纳：'//+content.questionTitle+'
					context = content.questionTitle
					id = content.questionId
					break;
				case 7:
					title = '今日学习计划提醒'
					context = content.title
					id = content.planId
					break;
				case 8:
					title = (
						<div>您关注的讲师<span style={{ color: '#333' }}>{content.teacherNickname}</span>更新了一门课程：</div>
					)
					context = content.title
					// id = content.resourceId
					break;
				case 9:
					title = content.title || ''
					break;
				case 10:
					title = content.title || ''
					break;
				case 11:
					title = (
						<div>您关注的话题新增了<span style={{ color: '#333' }}>{content.updateNum}</span>条问答：</div>
					)
					context = (
						<div style={{ color: '#333' }}>话题名称：{content.topicTitle}</div>
					)
					id = content.topicId
					break;
				case 12:
					title = (
						<div>您擅长的话题新增了<span style={{ color: '#333' }}>{content.updateNum}</span>条问答：</div>
					)
					context = content.topicTitle
					id = content.topicId
					break;
				case 13:
					title = (
						<div>您关注的话题新上传了<span style={{ color: '#333' }}>{content.updateNum}</span>门课程：</div>
					)
					//title='您关注的话题新上传了'+content.updateNum+'门课程'
					//context = content.topicTitle
					context = (
						<div style={{ color: '#333' }}>话题名称：{content.topicTitle}</div>
					)
					id = content.topicId
					break;
				case 14:
					title = (
						<div>您擅长的话题新上传了<span style={{ color: '#333' }}>{content.updateNum}</span>门课程：</div>
					)
					//title='您擅长的话题新上传了'+content.updateNum+'门课程'
					context = content.topicTitle
					id = content.topicId
					break;
				case 15:
					title = '最新直播课上线啦!快来预约吧!'
					context = content.title
					id = content.resourceId
					break;
				case 16:
					title = '正在热烈讨论的精彩问题:'
					context = content.questionTitle
					id = content.questionId
					break;
				case 17:
					title = (
						<div>您关注的讲师<span style={{ color: '#333' }}>{content.teacherNickname}</span>新增了一条回答：</div>
					)
					context = content.questionTitle
					id = content.questionId
					// id = content.resourceId
					break;
				// 迁移至offlineChange
				// case 18:
				// 	title = '您报名的线下课有资料更新'
				// 	messageLength = content.offlineList.length;
				// 	context = content.offlineList[0].title;
				// 	duration_time = '(时间：'+content.offlineList[0].duration+')'
				// 	more_text =(
				// 		<div style={{...styles.more,display:messageLength > 0 ?'flex':'none'}}>
				// 		 <span style={{marginRight:10}}>查看全部{messageLength}个内容</span>
				// 		 <img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12}}/>
				// 		</div>
				// 	)
				// 	break;
				case 19:
					title = '您预约/观看的直播课有资料更新'
					messageLength = content.liveList.length;
					context = content.liveList[0].title;
					duration_time = '(时间：' + content.liveList[0].duration + ')'
					more_text = (
						<div style={{ ...styles.more, display: messageLength > 0 ? 'flex' : 'none' }}>
							<span style={{ marginRight: 10 }}>查看全部{messageLength}个内容</span>
							<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12 }} />
						</div>
					)
					break;
				case 22:
					title = '您预约的直播课即将开始'
					context = content.title;
					duration_time = '(时间：' + content.duration + ')'
					break;
				case 23:
					title = '铂略平台官方通知'
					context = content.content;
					more_text = (
						<div style={{ ...styles.more }}>
							<span style={{ marginRight: 10 }}>查看详情</span>
							<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12 }} />
						</div>
					)
					break;
					break;
				case 24:
					title = '今日学习计划提醒'
					messageLength = content.listSize;
					context = content.planList[0].planTitle;
					duration_time = '(时间：' + content.planList[0].duration + ')'
					more_text = (
						<div style={{ ...styles.more, display: messageLength > 0 ? 'flex' : 'none' }}>
							<span style={{ marginRight: 10 }}>查看全部{messageLength}个内容</span>
							<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12 }} />
						</div>
					)
					break;
				default:
					title = content.title;
					body_content = this.Analysis_body(content, firstArry, keyArry, strArry);
					break;
			}

			if (item.action <= 17) {
				return (
					<div onClick={this.gotToDetail.bind(this, jumpUrl, item.id, item.type, item.action)} style={{ ...styles.div, backgroundColor: BgColor, marginTop: 15 }} key={index}>
						<div style={{ ...styles.TitleDiv }}>
							{title}
						</div>
						<div style={{ width: window.screen.width - 48, marginTop: 10 }}>
							<span style={{ fontSize: 14, color: '#333333' }}>
								{this.removeHtmlTag(context)}
							</span>
						</div>
						<div style={styles.time}>
							<span style={{ fontSize: 12, color: '#999999' }}>{sendTime}</span>
						</div>
					</div>
				)
			}
			else if (item.action >= 18 && item.action <= 24 || (item.action >= 29 && item.action <= 32)) {//新增new_action
				return (
					<div key={index}>
						<div style={{ textAlign: 'center' }}>
							<div style={styles.send_time}>{new_sendTime}</div>
						</div>
						<div onClick={this.gotToDetail.bind(this, jumpUrl, item.id, item.type, item.action)} style={{ ...styles.div, backgroundColor: BgColor, marginTop: 15 }}>
							<div style={{ ...styles.TitleDiv, fontSize: 16, color: '#333' }}>
								{title}
							</div>
							<div style={{ ...styles.note_text, ...styles.LineClamp, lineHeight: '20px' }}>
								{this.removeHtmlTag(context)}
							</div>
							<div style={{ ...styles.note_text, width: window.screen.width - 48, marginTop: 0 }}>{duration_time}</div>
							{more_text}
						</div>
					</div>
				)
			}
			else {
				return (
					<div key={index}>
						<div style={{ textAlign: 'center' }}>
							<div style={styles.send_time}>{new_sendTime}</div>
						</div>
						<div onClick={this.gotToDetail.bind(this, jumpUrl, item.id, item.type, item.action)} style={{ ...styles.div, backgroundColor: BgColor, marginTop: 15 }}>
							<div style={{ ...styles.TitleDiv, fontSize: 16, color: '#333' }}>
								{title}
							</div>
							<div style={{ ...styles.note_text, ...styles.LineClamp, lineHeight: '20px' }}>
								{this.removeHtmlTag(body_content)}
							</div>
						</div>
					</div>
				)
			}
		})

		return (
			<div style={{ ...styles.container }} onTouchEnd={this._MessageListloadMore.bind(this)} ref={(lessonList) => this.lessonList = lessonList}>
				<FullLoading isShow={this.state.isLoading} />
				<DataPrompt3 isShow={this.state.DataPrompt3IsShow} />
				{this.state.data.length > 0 ? list : listNull}
				{
					this.state.loadmore ?
						<Loading isShow={this.state.isShow} />
						:
						<div style={{ ...styles.total, display: this.state.isOver == true && this.state.isShow == false && this.state.data.length > 0 ? 'block' : 'none' }}>共{this.state.data.length}条</div>
				}
			</div>
		);
	}
}

var styles = {
	container: {
		height: window.innerHeight,
		width: window.screen.width,
		backgroundColor: '#ffffff',
		overflowY: 'scroll',
		overflowX: 'hidden'
	},
	div: {//每个菜单的DIV
		width: window.screen.width - 48,
		backgroundColor: '#EEEEEE',
		borderRadius: 2,
		marginLeft: 12,
		padding: '7px 12px 14px 12px',
		position: 'relative',
		color: '#999',
		fontSize: 14,
	},
	TitleDiv: {//左边的DIV
		width: window.screen.width - 48,
		marginTop: 10,
		color: '#999',
		fontSize: 14
	},
	total: {
		height: 40,
		position: 'relative',
		textAlign: 'center',
		marginTop: 24
	},
	time: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		flex: 1,
		marginTop: 10
	},
	LineClamp: {
		textOverflow: 'ellipsis',
		wordBreak: 'break-word',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		width: window.screen.width - 48,
	},
	send_time: {
		backgroundColor: '#dbdbdb',
		borderRadius: 2,
		fontSize: 12,
		color: '#fff',
		display: 'inline-block',
		height: 20,
		lineHeight: '20px',
		padding: '0 10px',
		margin: '20px 0 10px 0'
	},
	note_text: {
		fontSize: 12,
		color: '#444',
		marginTop: 10
	},
	more: {
		display: 'flex',
		fontSize: 12,
		color: '#999',
		height: 20,
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	}
};
export default SystemNotification;
