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
import DataPrompt3 from '../components/DataPrompt3'

var dataLimit = 15

class NoteDetails extends React.Component {
	constructor(props) {
		super(props);
		this.dataSkip = 0
		this.wx_config_share_home = {
			title: '消息通知详情',
			desc: '',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link'
		};
		this.state = {
			send_time: '',
			hasArray: false,//判断不同action返回数据格式中是否包含数组
			list: [],
			content: {},
			title: '',
			isShow3: false, //不支持考试功能提醒框
		};
	}
	componentWillMount() {
		if (this.props.match.params.id) {
			Dispatcher.dispatch({
				actionType: 'GetMessageDetail',
				id: this.props.match.params.id
			})
		}
	}

	componentDidMount() {
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE", '铂略财课-通知详情')
		this.e_GetMessageDetail = EventCenter.on('GetMessageDetailDone', this._handelGetmessageDetails.bind(this));
		this.e_hideAlert = EventCenter.on('HideAlert', this._handleHideAlert.bind(this))

	}
	componentWillUnmount() {
		this.e_GetMessageDetail.remove()
		this.e_hideAlert.remove()
	}
	//关闭弹框
	_handleHideAlert() {
		this.setState({
			isShow3: false,
		})
	}
	//跳转到对应页面 2019年7月17日14:22:26新增flag=1，用于判断是否微信不支持此功能
	_goLink(jumpUrl, flag) {
		if (flag) {
			this.setState({
				isShow3: true,
			})
			return false;
		}
		if (jumpUrl) {
			var urlArray = jumpUrl.split('/');
			urlArray = urlArray.splice(3, urlArray.length - 3);
			var isKey = urlArray[urlArray.length - 1];
			var new_array;
			var params = '';
			var isDownload = false;
			if (isKey == 'download') {
				new_array = urlArray.splice(urlArray.length - 1, 1)
				isDownload = true;
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
			this.props.history.push({ pathname: `${__rootDir}` + params, query: null, hash: null, state: { isDownload: isDownload } });
		}
	}

	removeHtmlTag(str) {
		if (str) {
			var str1 = str.replace(/<[^>]+>/g, "").replace(/\n/g, '<br/>');
			var str2 = str1.replace(/&nbsp;/ig, ' ');
		}
		return str2;
	}

	_handelGetmessageDetails(re) {
		console.log('_handelGetmessageDetails===', re);
		if (re.err) {
			return false;
		}
		var result;
		if (re.result) {
			result = re.result;
			var hasArray = false;//返回的对象中是否存在数组
			var title = '';//标题
			var new_array = [];
			for (var key in result.content) {
				var array_obj = result.content[key];
				if (Array.isArray(array_obj)) {
					hasArray = true;
					for (var i = 0; i < array_obj.length; i++) {
						var content = '';//内容
						var jumpUrl = '';//跳转链接
						var duration = '';
						switch (result.type) {
							case 6:
								switch (result.action) {
									case 9:
										title = '您关注的视频课有资料更新'
										content = array_obj[i].title;
										jumpUrl = array_obj[i].jumpUrl
										break;
									case 10:
										title = '您关注的直播课有资料更新'
										content = array_obj[i].title;
										jumpUrl = array_obj[i].jumpUrl
										duration = '(时间：' + array_obj[i].duration + ')'
										break;
									case 11:
										title = '您关注的线下课有资料更新'
										content = array_obj[i].title;
										jumpUrl = array_obj[i].jumpUrl
										duration = '(时间：' + array_obj[i].duration + ')'
										break;
									case 12:
										title = '您关注的直播课系列『' + result.content.seriesTitle + '』有课程更新'
										content = array_obj[i].title;
										jumpUrl = array_obj[i].jumpUrl
										break;
									case 15:
										title = '您关注的讲师『' + result.content.teacherNickname + '』有课程更新'
										content = array_obj[i].title;
										jumpUrl = array_obj[i].jumpUrl
										break;
									case 16:
										title = '您关注的话题『' + result.content.topicTitle + '』有新增问题'
										content = array_obj[i].questionTitle;
										jumpUrl = array_obj[i].jumpUrl
										break;
									case 17:
										title = '您关注的话题『' + result.content.topicTitle + '』有课程更新'
										content = array_obj[i].title;
										jumpUrl = array_obj[i].jumpUrl
										break;
									case 18:
										title = '您关注的讲师『' + result.content.teacherNickname + '』回答了新的问题'
										content = array_obj[i].questionTitle;
										jumpUrl = array_obj[i].jumpUrl
										break;
									default:
								}
								break;
							case 7:
								switch (result.action) {
									case 13:
										title = '今日学习任务提醒'
										content = array_obj[i].taskTitle
										jumpUrl = array_obj[i].jumpUrl
										duration = '(时间：' + array_obj[i].duration + ')'
										break;
									default:
								}
								break;
							case 8:
								switch (result.action) {
									case 34:
										title = '您参加的线下课有实战笔记上传'
										content = array_obj[i].resourceTitle
										jumpUrl = array_obj[i].jumpUrl
										duration = '(时间：' + array_obj[i].offlineDate + ')'
										break;
									case 29:
										title = '今日考试提醒'
										content = array_obj[i].quizTitle
										jumpUrl = ''
										duration = '(时间：' + array_obj[i].dateString + ')'
										break;
									case 18:
										title = '您报名的线下课有资料更新'
										content = array_obj[i].title
										jumpUrl = array_obj[i].jumpUrl
										duration = '(时间：' + array_obj[i].duration + ')'
										break;
									case 19:
										title = '您预约/观看的直播课有资料更新'
										content = array_obj[i].title
										jumpUrl = array_obj[i].jumpUrl
										duration = '(时间：' + array_obj[i].duration + ')'
										break;
									case 24:
										title = '今日学习计划提醒'
										content = array_obj[i].planTitle
										jumpUrl = array_obj[i].jumpUrl
										duration = '(时间：' + array_obj[i].duration + ')'
										break;
									default:
								}
								break;
							default:
						}
						var joson = { 'content': content, 'duration': duration, 'jumpUrl': jumpUrl, 'action': result.action }
						new_array.push(joson)
					}
				}
			}

			if (!hasArray) {//返回的数据不包含数组
				if (result.type == 7 && result.action == 17) {//企业通知
					title = '来自您所属企业通知'
					content = result.content.title;
					console.log('content==', content);
				}
				else if (result.type == 8 && result.action == 23) {//系统通知
					title = '铂略平台官方通知'
					content = result.content.content;
				}
			}

			this.setState({
				send_time: result.send_time || '',
				hasArray: hasArray,
				content: result.content || {},
				list: new_array || [],
				title: title || ''
			})
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

		var noteContent = ''
		if (this.state.hasArray) {
			var list = this.state.list.map((item, index) => {
				return (
					<div style={{ ...styles.note_content, borderBottom: index == (this.state.list.length - 1) ? 'none' : 'solid 1px #d5d5d5' }}
						key={index} onClick={this._goLink.bind(this, item.jumpUrl, item.action == 29 ? 1 : '')}>
						<div style={{ overflow: 'auto' }}>
							<div style={{ ...styles.LineClamp, ...styles.task_title, float: 'left', display: item.content ? 'block' : 'none' }}>
								{this.removeHtmlTag(item.content)}
							</div>
							<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12, float: 'right', marginTop: 5 }} />
						</div>
						<div style={{ fontSize: 12, color: '#444', marginTop: 5, display: item.duration ? 'block' : 'none' }}>
							{item.duration}
						</div>
					</div>
				)
			})
			noteContent = (
				<div style={styles.note_box1}>
					<div style={{ ...styles.LineClamp, ...styles.task_title, }}>{this.state.title}</div>
					<div style={{ ...styles.title_box, ...styles.note_text_box }}>
						<div style={styles.note_number}>共{this.state.list.length}个内容</div>
						<div style={styles.time}>{new Date(this.state.send_time).format('yyyy-MM-dd')}<span>&nbsp;&nbsp;</span>{new Date(this.state.send_time).format('hh:mm')}</div>
					</div>
					{list}
				</div>
			)
		}
		else {
			noteContent = (
				<div style={styles.note_box1}>
					<div style={styles.title_box}>
						<div style={styles.title}>
							{this.state.title}
						</div>
						<div style={styles.time}>
							{new Date(this.state.send_time).format('yyyy-MM-dd')}
						</div>
					</div>
					<div style={styles.note_text} dangerouslySetInnerHTML={{ __html: this.removeHtmlTag(this.state.content.title) }}>

					</div>
				</div>
			)
		}

		return (
			<div style={styles.container}>
				{noteContent ? noteContent : listNull}
				<DataPrompt3 isShow={this.state.isShow3} />
			</div>
		);
	}
}

var styles = {
	container: {
		height: window.innerHeight,
		width: window.screen.width,
		backgroundColor: '#ffffff',
		overflowY: 'auto',
		overflowX: 'hidden'
	},
	note_box1: {
		width: window.screen.width - 54,
		padding: 15,
		margin: '20px 12px 0 12px',
		backgroundColor: '#eee',
		borderRadius: 2,
	},
	title_box: {
		display: 'flex',
		flexDirection: 'row',
		height: 22,
		alignItems: 'center',
		marginTop: 20
	},
	title: {
		fontSize: 16,
		color: '#333',
		display: 'flex',
		flexDirection: 'row',
		flex: 1
	},
	time: {
		display: 'flex',
		fontSize: 12,
		color: '#999',
		justifyContent: 'flex-end'
	},
	note_text: {
		fontSize: 12,
		color: '#444',
		marginTop: 13,
	},
	note_text_box: {
		fontSize: 12,
		color: '#999',
		borderBottom: 'solid 1px #d5d5d5',
		paddingBottom: 13,
	},
	note_number: {
		display: 'flex',
		flexDirection: 'row',
		flex: 1
	},
	note_content: {
		position: 'relative',
		borderBottom: 'solid 1px #d5d5d5',
		paddingBottom: 10,
		// paddingRight:25,
		marginTop: 20,
	},
	task_title: {
		fontSize: 14,
		color: '#333',
		width: window.screen.width - 80,
		lineHeight: '18px',
		height: 36
	},
	LineClamp: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		wordBreak: 'break-word',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		// width:window.screen.width-48,
	},
};
export default NoteDetails;
