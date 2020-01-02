import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
// import ResultAlert from '../components/ResultAlert'

var countdown
var limit = 15

class offlineToExamine extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			examineTab: true,//顶部Tab切换值  为True  则显示报名审核，反之历史审核
			auditCount: 0,//到确认数量 默认为0
			cityInfo: [],//权益地址，免费席位地址
			auditInfo: [],//待确认数组
			freeNum: 0,//单课免费席位
			num: '',//次
			point: '',//点
			cityName: [],//免费席位地区
			freeCityName: [],//权益地区
			auditInfoHeight: devHeight - 189,//默认高度为46+60+80
			isShow: false,//是否显示弹框 遮罩层 默认为false
			auditAlert: '',
			//弹框是否显示
			display: 'none',
			//弹框提示信息
			alert_title: '',
			//弹框的图标
			alert_icon: '',
			icon_width: 0,
			icon_height: 0,
			checkNum: '',
			searchData: [],
			isSearch: false,
			searchKeyWord: '',//搜索的关键字
			auditKeyWordData: ['1'],//存储本地的审核搜索列表
			searchDataCount: false,
			auditInfoId: '',//用于删除数组的标识
			authData: {},
			searchDown: true//控制搜索取消文字
		};

	}
	_handleAuditListDone(re) {
		console.log('_handleAuditListDone', re);
		if (re.err) { return }
		var result = re.result || {}
		this.setState({
			auditCount: this.state.examineTab ? result.auditCount : this.state.auditCount,
			freeNum: result.freeNum || 0,
			num: result.num || 0,
			point: result.point || 0,
			cityName: result.cityName,
			freeCityName: result.freeCityName,
			auditInfo: this.state.auditInfo.concat(result.auditInfo) || [],
		}, () => {
			var cityName = result.cityName
			var freeCityName = result.freeCityName
			var cityNameHeight = 40
			var freeCityNameHeight = 40
			if (cityName.length > 1) {
				cityNameHeight = 60
			}
			if (freeCityName.length > 1) {
				freeCityNameHeight = 60
			}
			this.setState({
				auditInfoHeight: devHeight - 109 - cityNameHeight - freeCityNameHeight
			})
		})
	}
	componentWillMount() {

	}
	examineTab(e) {
		var examineTab = this.state.examineTab
		this.setState({
			examineTab: (e == 1) ? true : false,
			isSearch: false,
			searchKeyWord: '',
			auditInfo: [],
			searchData: [],
		}, () => {
			Dispatcher.dispatch({
				actionType: 'AuditList',
				status: this.state.examineTab ? 'enroll' : 'audit',
				limit: this.state.examineTab ? null : 15,
				skip: this.state.examineTab ? null : 0,
			})
		})
		setTimeout(() => {
			// this.lessonList.scrollTop= 0;
		}, 500)
	}


	_resolveType(authFlag) {
		let type = -1;
		if (authFlag == 1 || authFlag == 12) {
			//付费课
			type = 0;
		} else if (authFlag == 9 || authFlag == 11) {
			//权益不足
			type = 1;
		} else if (authFlag == 6 || authFlag == 8) {
			//用次
			type = 3;
		} else if (authFlag == 5 || authFlag == 7) {
			//用点
			type = 4;
		} else if (authFlag == 10) {
			//只有免费名额
			type = 5;
		} else if (authFlag == 14) {
			//私享券
			type = 6;
		} else if (authFlag == 13) {
			//权益不足
			type = 7;
		}
		return type;
	}
	//联系客服
	_ApplyVoucher() {
		if (isWeiXin) {
			this.props.history.push({ pathname: `${__rootDir}/freeInvited` })
		} else {
			window.location.href = 'https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
		}
	}

	_handlegetAuditAuthDone(re) {
		console.log('_handlegetAuditAuthDone', re);
		const { err, result, id } = re;
		if (err) {
			this.setState({
				display: 'block',
				alert_title: err,
				alert_icon: failure_icon,
				icon_width: 40,
				icon_height: 40,
			}, () => {
				countdown = setInterval(() => {
					clearInterval(countdown);
					this.setState({
						display: 'none',
					})
				}, 1500);
			})
			return
		}

		if (result && result.data) {
			var title
			var content
			var btnLeft
			var btnRight
			let reqType = this._resolveType(result.data.authFlag);
			console.log("==:  " + reqType)
			switch (reqType) {
				case 0:
					//付费课同意弹窗
					title = '确认通过';
					content = (<div><span style={{ fontSize: 14, color: '#030303' }}>点击确认后将提交报名申请</span></div>);
					btnLeft = (
						<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
					);
					btnRight = (
						<span onClick={this.doAudit.bind(this, true, this.state.checkNum)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
					);
					break;
				case 1:
					//权益不足
					title = '权益不足';
					content = (<div><span style={{ fontSize: 14, color: '#030303' }}>请联系客服充值。</span></div>);
					btnLeft = (<span onClick={this._ApplyVoucher.bind(this)} style={{ fontSize: 17, color: '#666666' }}>联系客服</span>);
					btnRight = (<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#0076ff' }}>知道了</span>);
					break;
				case 3:
				case 4:
				case 5:
					//3：用次  4：用点 5：只用免费名额固定显示 0点
					let num = result.data.useCount || 0;
					let unit = reqType == 3 ? '次' : '点';
					if (reqType == 5) {
						num = 0;
						unit = '点'
					}
					title = '确认通过';
					content = (
						<div>
							<div>本次预计抵扣<span style={{ fontSize: 14, color: '#f37633' }}>{num}</span>{unit}，</div>
							<div>点击确认后将进行权益预扣。</div>
						</div>
					)
					btnLeft = (
						<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
					);
					btnRight = (
						<span onClick={this.doAudit.bind(this, true, this.state.checkNum)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
					);
					break;
				case 6:
					title = '确认通过';
					content = (
						<div>
							<div>本次预计抵扣私享会券<span style={{ fontSize: 14, color: '#f37633' }}>{result.data.useCount || 0}</span>张，</div>
							<div>点击确认后将进行权益预扣。</div>
						</div>
					)
					btnLeft = (
						<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
					);
					btnRight = (
						<span onClick={this.doAudit.bind(this, true, this.state.checkNum)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
					);
					break;
				case 7:
					title = '权益不足';
					content = (<div><span style={{ fontSize: 14, color: '#030303' }}>请联系客服购买新的私享会券或选择另付费参课</span></div>);
					btnLeft = (
						<span onClick={this._ApplyVoucher.bind(this)} style={{ fontSize: 17, color: '#666666' }}>联系客服</span>
					);
					btnRight = (
						<span onClick={this.doAudit.bind(this, true, this.state.checkNum)} style={{ fontSize: 17, color: '#0076ff' }}>付费参课</span>
					);
					break;
			}

			var obj = {
				title: title,
				content: content,
				leftButtom: btnLeft,
				rightButtom: btnRight,
				centerButtom: null,
			}
			this.setState({
				isShow: true,
				auditAlert: this.auditAlert(obj),
				authData: result.data
			})
		}


		// var result = re.result || {}
		// var data = result.data
		// var content
		// var leftButtom
		// var rightButtom
		// var title
		// if (data.authFlag == 11) {// authFlag=11 为权益不足
		// 	title = '权益不足'
		// 	content = (
		// 		<div>
		// 			<Link to={{ pathname: `${__rootDir}/freeInvited`, state: null }}>
		// 				<span style={{ fontSize: 14, color: '#030303' }}>请联系客服充值。</span>
		// 			</Link>
		// 		</div>
		// 	)
		// 	leftButtom = (
		// 		<Link to={{ pathname: `${__rootDir}/freeInvited`, state: null }}>
		// 			<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>联系客服</span>
		// 		</Link>
		// 	)
		// 	rightButtom = (
		// 		<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#0076ff' }}>知道了</span>
		// 	)
		// } else if (data.authFlag == 1 || data.authFlag == 9) {
		// 	title = '确认报名'
		// 	content = (
		// 		<div>
		// 			<span style={{ fontSize: 14, color: '#030303' }}>点击后确认将提交报名申请</span>
		// 		</div>
		// 	)
		// 	leftButtom = (
		// 		<span onClick={this.doAudit.bind(this, true, this.state.checkNum)} style={{ fontSize: 17, color: '#666666' }}>确认</span>
		// 	)
		// 	rightButtom = (
		// 		<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#0076ff' }}>取消</span>
		// 	)
		// } else {
		// 	title = '确认通过'
		// 	content = (
		// 		<div>
		// 			<div>本次预计抵扣<span style={{ fontSize: 14, color: '#f37633' }}>{data.useCount}</span>{data.num == null ? '点' : '次'}，</div>
		// 			<div>点击确认后将进行权益预扣。</div>
		// 		</div>
		// 	)
		// 	leftButtom = (
		// 		<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
		// 	)
		// 	rightButtom = (
		// 		<span onClick={this.doAudit.bind(this, true, this.state.checkNum)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
		// 	)
		// }
		// var obj = {
		// 	title: title,
		// 	content: content,
		// 	leftButtom: leftButtom,
		// 	rightButtom: rightButtom,
		// 	centerButtom: null,
		// }
		// this.setState({
		// 	isShow: true,
		// 	auditAlert: this.auditAlert(obj),
		// 	authData: result.data
		// })
	}
	_handledoAuditDone(re, isAudit) {
		// console.log('_handledoAuditDone', re);
		if (re.err) {
			this.setState({
				display: 'block',
				alert_title: re.err,
				alert_icon: failure_icon,
				icon_width: 40,
				icon_height: 40,
			}, () => {
				countdown = setInterval(() => {
					clearInterval(countdown);
					this.setState({
						display: 'none',
					})
				}, 1500);
			})
			return
		}
		var result = re.result
		if (result) {
			if (isAudit) { //确认
				var data = this.state.authData || {}
				var AuditType = this._resolveType(data.authFlag)
				var content
				var leftButtom
				var rightButtom
				var title
				if (AuditType == 0) {
					title = '申请提交成功'
					content = (
						<div>工作人员将于2个工作日内与您联系后续参课事宜。</div>
					)
					rightButtom = (
						<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#0076ff' }}>知道了</span>
					)
					var obj = {
						title: title,
						content: content,
						leftButtom: leftButtom,
						rightButtom: rightButtom,
						centerButtom: true,
					}
					this.setState({
						isShow: true,
						auditAlert: this.auditAlert(obj)
					})
				} else {
					var _title = '操作成功';
					if (AuditType == 6) {
						_title = '报名成功';
					}
					this.setState({
						display: 'block',
						alert_title: _title,
						alert_icon: success_icon,
						icon_width: 40,
						icon_height: 40,
					}, () => {
						countdown = setInterval(() => {
							clearInterval(countdown);
							this.setState({
								display: 'none',
							})
						}, 1500);
					})
				}
			} else { //拒绝
				var offlineAuth = result.offlineAuth || {}
				this.setState({
					display: 'block',
					alert_title: '操作成功',
					alert_icon: success_icon,
					icon_width: 40,
					icon_height: 40,
					point: offlineAuth.point || this.state.point,
					freeNum: offlineAuth.freeNum || this.state.freeNum,
				}, () => {
					if (!this.state.isSearch) {
						var auditInfo = this.state.auditInfo
						var newData = []
						for (var i = 0; i < auditInfo.length; i++) {
							if (auditInfo[i].id !== this.state.auditInfoId) {
								newData.push(auditInfo[i])
							}
						}
						this.setState({
							auditInfo: newData
						})
					} else {
						var auditInfo = this.state.searchData
						var newData = []
						for (var i = 0; i < auditInfo.length; i++) {
							if (auditInfo[i].id !== this.state.auditInfoId) {
								newData.push(auditInfo[i])
							}
						}
						this.setState({
							searchData: newData
						})
					}
					countdown = setInterval(() => {
						clearInterval(countdown);
						this.setState({
							display: 'none',
						})
					}, 1500);
				})
			}
			this.setState({
				auditCount: this.state.auditCount - 1,
			});
		}
	}
	_handlesearchAuditListDone(re) {
		console.log('_handlesearchAuditListDone', re);
		var result = re.result || {}
		this.setState({
			searchData: this.state.searchData.concat(result.auditInfo) || [],
			searchDataCount: true,
			searchDown: false,
		})
	}
	componentDidMount() {
		var SEARCH_DATA = localStorage.getItem("auditKeyWordData") //把本地的搜索记录暂时放进临时变量中
		if (SEARCH_DATA === null) {
			//  return;
		} else {
			var json = JSON.parse(SEARCH_DATA);
			this.setState({
				auditKeyWordData: json
			})
		}
		EventCenter.emit("SET_TITLE", '铂略财课-线下课审核')
		this.onAuditListDone = EventCenter.on('AuditListDone', this._handleAuditListDone.bind(this))
		this.ongetAuditAuthDone = EventCenter.on('getAuditAuthDone', this._handlegetAuditAuthDone.bind(this))
		this.ondoAuditDone = EventCenter.on('doAuditDone', this._handledoAuditDone.bind(this))
		this.onsearchAuditListDone = EventCenter.on('searchAuditListDone', this._handlesearchAuditListDone.bind(this))



		Dispatcher.dispatch({
			actionType: 'AuditList',
			status: 'enroll'
		})

	}
	componentWillUnmount() {
		this.onAuditListDone.remove()
		this.ongetAuditAuthDone.remove()
		this.ondoAuditDone.remove()
		this.onsearchAuditListDone.remove()
	}
	doAudit(isAudit, re) {
		this.setState({
			isShow: false,
			auditInfoId: re
		}, () => {
			Dispatcher.dispatch({
				actionType: 'doAudit',
				id: re,
				isAudit: isAudit,
			})
		})
	}
	falseAudit(re) {
		var leftButtom = (
			<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
		)
		var rightButtom = (
			<span onClick={this.doAudit.bind(this, false, re)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
		)
		var obj = {
			title: '确认拒绝',
			content: '点击确认后将完成操作',
			leftButtom: leftButtom,
			rightButtom: rightButtom,
			centerButtom: null,
		}
		this.setState({
			isShow: true,
			auditAlert: this.auditAlert(obj)
		})
	}
	getAuditAuth(re, id) {
		this.setState({
			checkNum: id
		}, () => {
			Dispatcher.dispatch({
				actionType: 'getAuditAuth',
				resource_id: re
			})
		})
	}
	goOfflineDetail(id) {
		this.props.history.push({ pathname: `${__rootDir}/lesson/offline/${id}`, state: null })
	}
	goAuditInfoDetail(id, type) {
		// if (type) {
		// 	this.props.history.push({pathname:`${__rootDir}/offlineToExamineDetail/${id}`, state:null})
		// }else {
		// 	this.props.history.push({pathname:`${__rootDir}/offlineHistoryToExamineDetail/${id}`, state:null})
		// }
		this.props.history.push({ pathname: `${__rootDir}/offlineHistoryToExamineDetail/${id}`, state: null })

	}
	auditStatus(item) {//根据stauts 去判断，但是要用于两次所以写了一下通用方法
		var status
		var color
		switch (item.status) {
			case 2:
				status = '待审核'
				color = '#ff4642'
				break;
			case 3:
				status = '待参课'
				color = '#2196F3'
				break;
			case 4:
				status = '审核被拒'
				color = '#f37633'
				break;
			case 5:
				status = '已参课'
				color = '#23bb2d'
				break;
			case 6:
				status = '缺席'
				color = '#9AB2CF'
				break;
			case 7:
				status = '超时未审核'
				color = '#f37633'
				break;
			case 8:
				status = '超时未确认'
				color = '#f37633'
				break;
			case 9:
				status = '待确认'
				color = '#ff4642'
				break;
			case 10:
				status = '取消报名'
				color = '#D1D1D1'
				break;
			default:
		}
		var auditObj = {
			status: status,
			color: color
		}
		return auditObj
	}
	nowAuditInfo(data) {
		var auditInfo = data.map((item, index) => {
			var post_date = new Date(item.post_date).format("yyyy-MM-dd")
			var post_time = new Date(item.post_date).format("hh:mm");
			var start_date = new Date(item.start_time).format("yyyy-MM-dd")
			var start_time = new Date(item.start_time).format("hh:mm");
			var end_time = new Date(item.end_time).format("hh:mm");
			var end_date = new Date(item.end_time || 0).format("MM-dd")

			var data_time
			if (item.isSameDay) {
				data_time = start_date + ' ' + start_time + '-' + end_time
			} else {
				data_time = start_date + ' 至 ' + end_date
			}
			var address = item.address || {}
			var auditObj = this.auditStatus(item)
			return (
				<div style={{ ...styles.auditInfo }} key={index}>
					<div style={{ marginLeft: 20 }}>
						<div onClick={this.goAuditInfoDetail.bind(this, item.id, true)}>
							<div>
								<span style={{ fontSize: 16, color: '#000000' }}>{item.name}</span>
							</div>
							<div style={{ ...styles.status, backgroundColor: auditObj.color }}>
								<span style={{ fontSize: 12, color: '#ffffff' }}>{auditObj.status}</span>
							</div>
						</div>
					</div>
					<div style={{ marginLeft: 20 }}>
						<span style={{ fontSize: 12, color: '#666666' }}>申请时间 {post_date} {post_time}</span>
					</div>
					<div style={{ ...styles.divLine }}></div>
					<div style={{ marginLeft: 20 }} onClick={this.goOfflineDetail.bind(this, item.resource_id)}>
						<span style={{ fontSize: 12, color: '#2196f3' }}>{item.title}</span>
					</div>
					<div onClick={this.goAuditInfoDetail.bind(this, item.id, true)}>
						<div style={{ marginLeft: 20, fontSize: 12, color: '#666666', marginTop: 15 }}>
							<span>举办时间</span><span style={{ marginLeft: 15 }}>{data_time}</span>
						</div>
						<div style={{ marginLeft: 20, fontSize: 12, color: '#666666', marginTop: 5 }}>
							<span>举办地点</span><span style={{ marginLeft: 15 }}>{address.cityname || ''} {address.site || ''}</span>
						</div>
					</div>
					<div style={styles.alert_bottom}>
						<div onClick={this.getAuditAuth.bind(this, item.resource_id, item.id)} style={{ ...styles.buttom, borderRight: 'solid 1px #d4d4d4' }}>通过</div>
						<div onClick={this.falseAudit.bind(this, item.id)} style={{ ...styles.buttom, borderRight: 'solid 1px #d4d4d4' }}>拒绝</div>

						<div style={{ ...styles.buttom }}>
							{/*
								<Link to={`${__rootDir}/offlineToExamineDetail/${item.id}`}>
									<span style={{color:'#2196F3'}}>查看详情</span>
								</Link>
								*/}
							<Link to={`${__rootDir}/offlineHistoryToExamineDetail/${item.id}`}>
								<span style={{ color: '#2196F3' }}>查看详情</span>
							</Link>

						</div>
					</div>
				</div>
			)
		})
		return auditInfo
	}
	historyAuditInfo(data) {
		var auditInfo = data.map((item, index) => {
			var post_date = new Date(item.post_date).format("yyyy-MM-dd")
			var post_time = new Date(item.post_date).format("hh:mm");
			var start_date = new Date(item.start_time).format("yyyy-MM-dd")
			var start_time = new Date(item.start_time).format("hh:mm");
			var end_time = new Date(item.end_time).format("hh:mm");
			var update_date = new Date(item.status_update_time).format("yyyy-MM-dd")
			var update_time = new Date(item.status_update_time).format("hh:mm")
			var end_date = new Date(item.end_time || 0).format("MM-dd")

			var data_time
			if (item.isSameDay) {
				data_time = start_date + ' ' + start_time + '-' + end_time
			} else {
				data_time = start_date + ' 至 ' + end_date
			}
			var address = item.address || {}
			var auditObj = this.auditStatus(item)

			return (
				<div style={{ ...styles.auditInfo }} key={index}>
					<div style={{ marginLeft: 20 }}>
						<div onClick={this.goAuditInfoDetail.bind(this, item.id, false)}>
							<div>
								<span style={{ fontSize: 16, color: '#000000' }}>{item.name}</span>
							</div>
							<div style={{ ...styles.status, backgroundColor: auditObj.color }}>
								<span style={{ fontSize: 12, color: '#ffffff' }}>{auditObj.status}</span>
							</div>
						</div>
					</div>
					<div style={{ marginLeft: 20 }}>
						<span style={{ fontSize: 12, color: '#666666' }}>申请时间 {post_date} {post_time}</span>
					</div>
					<div style={{ ...styles.divLine }}></div>
					<div style={{ marginLeft: 20 }} onClick={this.goOfflineDetail.bind(this, item.resource_id)}>
						<span style={{ fontSize: 12, color: '#2196f3' }}>{item.title}</span>
					</div>
					<div onClick={this.goAuditInfoDetail.bind(this, item.id, false)}>
						<div style={{ marginLeft: 20, marginTop: 15 }}>
							<span style={{ fontSize: 12, color: '#666666' }}>举办时间 {data_time}</span>
						</div>
						<div style={{ marginLeft: 20 }}>
							<span style={{ fontSize: 12, color: '#666666' }}>举办地点 {address.cityname || ''} {address.site || ''}</span>
						</div>
						<div style={{ marginLeft: 20 }}>
							<span style={{ fontSize: 12, color: '#666666' }}>更新时间 {update_date} {update_time}</span>
						</div>
					</div>
					<div style={{ ...styles.divLine }}></div>
					<Link to={`${__rootDir}/offlineHistoryToExamineDetail/${item.id}`}>
						<div style={{ marginLeft: 20, display: 'flex' }}>
							<div style={{ flex: 1 }}>
								<span style={{ fontSize: 12, color: '#2196f3' }}>查看详情</span>
							</div>
							<div style={{ flex: 1, position: 'relative' }}>
								<img style={{ float: 'right', marginRight: 23, marginTop: 8 }} src={Dm.getUrl_img('/img/v2/icons/more.png')} width={7} height={12} />
							</div>
						</div>
					</Link>
				</div>
			)
		})
		return auditInfo
	}
	auditAlert(obj) {
		return (
			<div style={{ ...styles.alert }}>
				<div style={{ height: 87, }}>
					<div style={{ paddingTop: 17 }}>
						<span style={{ fontSize: 17, color: '#030303', fontFamily: 'pingfangsc-medium' }}>{obj.title}</span>
					</div>
					<div style={{ lineHeight: 1 }}>
						<span style={{ fontSize: 14, color: '#030303', fontFamily: 'pingfangsc-regular' }}>{obj.content}</span>
					</div>
				</div>
				<div style={{ width: 270, height: 1, opacity: 0.22, backgroundColor: '#4d4d4d' }}></div>
				{
					obj.centerButtom == null ?
						<div style={{ ...styles.alertBottom, }}>
							<div style={{ flex: 1, lineHeight: 2.5 }}>
								{obj.leftButtom}
							</div>
							<div style={{ height: 43, width: 1, opacity: 0.22, backgroundColor: '#4d4d4d' }}></div>
							<div style={{ flex: 1, lineHeight: 2.5 }}>
								{obj.rightButtom}
							</div>
						</div>
						: <div style={{ width: 270, textAlign: 'center' }}>{obj.rightButtom}</div>
				}
			</div>
		)
	}
	cancel() {
		this.setState({
			isShow: false
		})
	}
	_onChangeSearchKeyword(e) {
		e.preventDefault();
		var v = e.target.value.trim();
		this.setState({
			searchKeyWord: v,
			searchDown: true
		})
	}
	_doSearch() {
		if (this.state.auditKeyWordData.length < 5) { //判断一下当前临时数组的长度，目前保留数组长度为10
			this.state.auditKeyWordData.push(this.state.searchKeyWord)
		} else {
			this.state.auditKeyWordData[0] = this.state.searchKeyWord
		}
		var unique = {};//去掉数组中相同的值
		this.state.auditKeyWordData.forEach(function (gpa) { unique[JSON.stringify(gpa)] = gpa });
		this.state.auditKeyWordData = Object.keys(unique).map(function (u) { return JSON.parse(u) });
		localStorage.setItem("auditKeyWordData", JSON.stringify(this.state.auditKeyWordData));
		Dispatcher.dispatch({
			actionType: 'searchAuditList',
			keyWord: this.state.searchKeyWord,
			status: this.state.examineTab ? 'enroll' : 'audit',
			skip: this.state.examineTab ? null : 0,
			limit: this.state.examineTab ? null : 15,
		})
		this.setState({
			searchData: []
		})
	}
	_hotLabelSearch(re) {  //热门标签搜索
		if (re) {
			Dispatcher.dispatch({
				actionType: 'searchAuditList',
				keyWord: re,
				status: this.state.examineTab ? 'enroll' : 'audit',
				skip: this.state.examineTab ? null : 0,
				limit: this.state.examineTab ? null : 15,
			})
			this.setState({
				searchKeyWord: re,
			})
		}
	}
	searchShow(isSearch) {//判断一下是否触发搜索框,蛋疼的功能
		this.setState({
			isSearch: isSearch,
			searchDown: true
			// auditInfo:[]
		})
	}
	render() {

		//剩余点/次的数量
		//剩余的点跟次不会共存，二者只会出现一种情况
		var _left = 0;
		var _unit = ''
		if (this.state.num) {
			_left = this.state.num;
			_unit = '次'
		}
		else if (this.state.point) {
			_left = this.state.point;
			_unit = '点'
		}

		var auditInfo
		var searchInfo
		if (this.state.examineTab) { //判断 报名审核 还是 历史审核
			auditInfo = this.nowAuditInfo(this.state.auditInfo)
			searchInfo = this.nowAuditInfo(this.state.searchData)
		} else {
			auditInfo = this.historyAuditInfo(this.state.auditInfo)
			searchInfo = this.historyAuditInfo(this.state.searchData)
		}
		var listNull = (
			<div style={{ textAlign: 'center', paddingTop: 70 }}>
				<div>
					<img height="128" width="188" src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{ marginTop: 51 }}>
					<span style={{ fontSize: 15, color: '#999999' }}>暂无数据哦~</span>
				</div>
			</div>
		)
		var myLabel = this.state.auditKeyWordData.map((item, index) => {
			var keyWords = item;
			return (
				<div style={{ ...styles.myKeyWord }} key={index} onClick={this._hotLabelSearch.bind(this, keyWords)}>
					<div style={{ float: 'left', marginLeft: 32, marginTop: 10, marginRight: 15 }}>
						<img src={Dm.getUrl_img('/img/v2/icons/time2@2x.png')} width={15} height={15} />
					</div>
					<div style={{ lineHeight: 2.5 }}>
						<span style={{ fontSize: 15, color: '#666666' }}>{item}</span>
					</div>
				</div>
			)
		})
		return (
			<div style={{ ...styles.div, }}>
				<div style={{ ...styles.examineTab }}>
					<div style={{ ...styles.tabDiv }} onClick={this.examineTab.bind(this, 1)}>
						<span style={{ fontSize: 16, color: this.state.examineTab ? '#2196F3' : '#000000' }}>报名审核  </span>
						{
							this.state.examineTab ?
								<div style={{ ...styles.tabLine }}></div>
								: null
						}
						{this.state.auditCount > 0 ?
							<span style={{ ...styles.point }}>
								{this.state.auditCount}
							</span>
							:
							null
						}
						{this.state.auditCount > 99 ?
							<span style={{ ...styles.point }}>
								'··'
						</span>
							:
							null
						}
					</div>
					<div style={{ ...styles.tabDiv }} onClick={this.examineTab.bind(this, 2)}>
						<span style={{ fontSize: 16, color: this.state.examineTab ? '#000000' : '#2196F3' }}>历史审核</span>
						{
							!this.state.examineTab ?
								<div style={{ ...styles.tabLine }}></div>
								: null
						}
					</div>
				</div>
				{/** 报名审核*/}
				<div style={{ ...styles.examineDiv }}>
					<div style={{ ...styles.offlineInfoDiv, display: !this.state.isSearch ? 'block' : 'none' }}>
						<div style={{ display: this.state.freeCityName.length > 1 ? 'inline-block' : 'flex', }}>
							<div style={{ ...styles.infoSeconeDiv, height: this.state.freeCityName.length > 1 ? 30 : 40 }}>
								<img style={{ marginLeft: 16, marginTop: 12 }} src={Dm.getUrl_img('/img/v2/audit/join@2x.png')} width={11} height={13} />
								<span style={{ ...styles.infoFont, marginTop: 8 }}>单课免费席位：<span style={{ color: '#2196F3' }}>{this.state.freeNum || 0}</span> 人</span>
							</div>
							<div style={{ ...styles.infoSeconeDiv, height: this.state.freeCityName.length > 1 ? 25 : 40 }}>
								<img style={{ marginLeft: 16, marginTop: 12 }} src={Dm.getUrl_img('/img/v2/audit/xizuo@2x.png')} width={12} height={12} />
								<span style={{ ...styles.infoFont, marginTop: 8 }}>免费席位地区：
									{//判断一下是多城市还是单城市
										this.state.freeCityName.map((item, index) => {
											if (this.state.freeCityName.length > 1) {
												var len = this.state.freeCityName.length - 1
												if (index == len) {//判断当前是否为最后一个，如果是则去掉竖线
													return (
														<span key={index}>{item}</span>
													)
												} else {
													return (
														<span key={index}>{item} | </span>
													)
												}
											} else {
												return (
													<span key={index}>{item}</span>
												)
											}
										})
									}
								</span>
							</div>
						</div>
						<div style={{ width: devWidth - 36, height: 0.5, backgroundColor: '#D8D8D8', marginLeft: 16 }}></div>
						<div style={{ display: this.state.cityName.length > 1 ? 'inline-block' : 'flex', }}>
							<div style={{ ...styles.infoSeconeDiv, height: this.state.cityName.length > 1 ? 30 : 40 }}>
								<img style={{ marginLeft: 16, marginTop: 12 }} src={Dm.getUrl_img('/img/v2/audit/point@2x.png')} width={12} height={14} />
								<span style={{ ...styles.infoFont, marginTop: 8 }}>剩余权益：
									<span style={{ color: '#f37633' }}>
										{/*this.state.point !== null ? this.state.point : this.state.num*/}
										{/*this.state.point !== null ? ' 点':' 次'*/}
										{_left}
									</span><span>{_unit}</span>
								</span>
							</div>
							<div style={{ ...styles.infoSeconeDiv, height: this.state.cityName.length > 1 ? 30 : 40 }}>
								<img style={{ marginLeft: 16, marginTop: 12 }} src={Dm.getUrl_img('/img/v2/audit/address@2x.png')} width={12} height={15} />
								<span style={{ ...styles.infoFont, marginTop: 8 }}>权益地区：
									{//判断一下是多城市还是单城市
										this.state.cityName.map((item, index) => {
											if (this.state.cityName.length > 1) {
												var len = this.state.cityName.length - 1
												if (index == len) {//判断当前是否为最后一个，如果是则去掉竖线
													return (
														<span key={index}>{item}</span>
													)
												} else {
													return (
														<span key={index}>{item} | </span>
													)
												}
											} else {
												return (
													<span key={index}>{item}</span>
												)
											}
										})
									}
								</span>
							</div>

						</div>
					</div>
					<div style={{ ...styles.searchDiv }}>{/**搜索框*/}
						<div style={{ ...styles.searchInput }}>
							<img style={{ ...styles.searchImage }} src={Dm.getUrl_img('/img/v2/audit/search@2x.png')} width="15" height="15" />
							<input style={{ ...styles.input }} value={this.state.searchKeyWord} onChange={this._onChangeSearchKeyword.bind(this)} onFocus={this.searchShow.bind(this, true)} placeholder="请输入姓名，正文内容" />
							<img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} onClick={this.clearKeyWord.bind(this)} style={{ ...styles.clearImg, display: this.state.searchKeyWord ? 'block' : 'none' }} />
						</div>
						{
							(this.state.searchKeyWord || !this.state.isSearch) && this.state.searchDown ?
								<div onClick={this._doSearch.bind(this)} style={{ marginLeft: 12, marginTop: 16 }}>
									<span style={{ fontSize: 14, color: '#333333' }}>搜索</span>
								</div>
								:
								<div onClick={this.searchShow.bind(this, false)} style={{ marginLeft: 12, marginTop: 16 }}>
									<span style={{ fontSize: 14, color: '#333333' }}>取消</span>
								</div>
						}
					</div>
					{
						!this.state.isSearch ?
							<div
								style={{ width: devWidth, overflowX: 'hidden', overflowY: 'scroll', height: this.state.auditInfoHeight, backgroundColor: this.state.auditInfo.length > 0 ? '#f4f4f4' : '#FFFFFF' }}
								onTouchEnd={this._auditlLoadMore.bind(this)}
								ref={(auditlessonList) => this.auditlessonList = auditlessonList}>
								{/**循环数组开始的地方*/}
								{
									this.state.auditInfo.length > 0 ? auditInfo : listNull
								}
							</div>
							:
							<div
								style={{ ...styles.searchInfo, backgroundColor: this.state.searchData.length > 0 ? '#f4f4f4' : '#ffffff' }}
								onTouchEnd={this._loadMore.bind(this)}
								ref={(lessonList) => this.lessonList = lessonList}>
								<div style={{ display: this.state.searchKeyWord || this.state.searchData.length > 0 ? 'none' : 'block' }}>
									<div style={{ marginTop: 21, marginLeft: 14, }}>
										<span style={{ fontSize: 16, color: '#333333' }}>最近搜索：</span>
										{
											this.state.auditKeyWordData.length > 0 ?
												null
												:
												<span style={{ fontSize: 14, color: '#666666' }}>暂无搜索</span>
										}
									</div>
									{myLabel}
								</div>
								{this.state.searchData.length > 0 ?
									searchInfo
									:
									<div style={{ width: devWidth, textAlign: 'center', marginTop: 21 }}>
										{
											this.state.searchDataCount && this.state.searchKeyWord ?
												<span style={{ fontSize: 14, color: '#333333' }}>没有搜索到相关课程信息</span>
												: null
										}
									</div>
								}
							</div>
					}
				</div>
				{/** 遮罩层*/}
				<div onClick={() => {
					this.setState({ isShow: false })
				}} style={{ ...styles.zzc, display: this.state.isShow ? 'block' : 'none' }}></div>
				{
					this.state.isShow ? this.state.auditAlert : null
				}
				{/*弹框*/}
				<div style={{ ...Common.alertDiv, display: this.state.display }}>
					<div style={{ marginBottom: 14, paddingTop: 15, height: 30, }}>
						<img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height} />
					</div>
					<span style={{ color: Common.BG_White }}>{this.state.alert_title}</span>
				</div>
			</div>
		)
	}
	_loadMore() {
		if ((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) < document.documentElement.clientHeight) {
			if (this.state.examineTab) {//报名审核不做laodmore
				return
			}
			this._gotoLoadMore()
		}
	}
	_auditlLoadMore() {
		if ((this.auditlessonList.scrollHeight - this.auditlessonList.scrollTop - 220) < document.documentElement.clientHeight) {
			if (this.state.examineTab) {//报名审核不做laodmore
				return
			}
			this._gotoauditLoadMore()
		}

	}
	_gotoauditLoadMore() {
		console.log('_gotoauditLoadMore', this.state.examineTab);
		var skip = this.state.auditInfo.length || 0
		Dispatcher.dispatch({
			actionType: 'AuditList',
			status: 'audit',
			limit: 15,
			skip: skip,
		})
	}
	_gotoLoadMore(re) {
		console.log('_gotoLoadMore', this.state.examineTab);
		var skip = this.state.searchData.length || 0
		Dispatcher.dispatch({
			actionType: 'searchAuditList',
			keyWord: this.state.searchKeyWord,
			limit: limit,
			skip: skip,
			loadmore: true
		})
	}
	clearKeyWord() {
		this.setState({
			searchKeyWord: ''
		})
	}
}

var styles = {
	div: {
		height: devHeight,
		width: devWidth,
		backgroundColor: '#f4f4f4'
	},
	examineTab: {
		display: 'flex',
		height: 46,
		backgroundColor: '#FFFFFF',
		position: 'relative',
		borderBottomWidth: 1,
		borderBottomColor: '#D8D8D8',
		borderBottomStyle: 'solid',
	},
	tabDiv: {
		flex: 1,
		// justifyContent: 'center',
		alignItems: 'center',
		width: devWidth / 2,
		textAlign: 'center',
		marginTop: 13
	},
	tabLine: {
		width: 62,
		height: 1,
		backgroundColor: '#2196F3',
		marginLeft: (devWidth / 2 - 62) / 2,
		position: 'absolute',
		top: 45
	},
	examineDiv: {
		height: devHeight - 46,
		width: devWidth,
	},
	offlineInfoDiv: {
		backgroundColor: '#ffffff',
		width: devWidth,
	},
	infoFont: {
		fontSize: 14,
		color: '#333333',
		marginLeft: 8
	},
	infoSeconeDiv: {
		flex: 1,
		// width:devWidth/2,
		// float:'left',
		height: 40,
	},
	searchDiv: {
		width: devWidth,
		height: 60,
		display: 'flex',
	},
	searchInput: {
		height: 30,
		backgroundColor: '#ffffff',
		width: devWidth * (295 / 375),
		border: '0.5px solid #e0e0e0',
		borderRadius: '2px',
		marginTop: 15,
		marginLeft: 12,
		position: 'relative',
	},
	input: {
		border: 'none',
		marginLeft: 8,
		position: 'absolute',
		top: 8,
		width: devWidth * (295 / 375) - 40,
	},
	clearImg: {
		marginLeft: 8,
		position: 'absolute',
		top: 8,
		right: 12,
		width: 12,
		height: 12,
	},
	searchImage: {
		marginLeft: 12,
		marginTop: 8
	},
	auditInfo: {
		width: devWidth - 24,
		// height: 245,
		paddingBottom: 10,
		backgroundColor: '#ffffff',
		borderRadius: '2px',
		marginLeft: 12,
		paddingTop: 22,
		position: 'relative',
		marginBottom: 15,
	},
	alert_bottom: {
		// position:'absolute',
		// zIndex:201,
		// bottom:0,
		// left:12,
		width: devWidth - 48,
		marginLeft: 12,
		marginTop: 8,
		height: 50,
		borderTopStyle: 'solid',
		borderTopWidth: 0.5,
		borderTopColor: '#d4d4d4',
		display: 'flex',
		flex: 1,
	},
	buttom: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center',
		// lineHeight: '42px',
		fontSize: Fnt_Medium,
		color: Common.Activity_Text,
		height: 20,
		marginTop: 15
	},
	status: {
		// width: 60,
		height: 20,
		textAlign: 'center',
		position: 'absolute',
		right: 24,
		borderRadius: '100px',
		lineHeight: 1,
		top: 22,
		paddingLeft: 12,
		paddingRight: 12,
	},
	alert: {
		width: 270,
		height: 131,
		backgroundColor: '#ffffff',
		borderRadius: '12px',
		position: 'absolute',
		zIndex: 99999,
		top: 202,
		left: (devWidth - 270) / 2,
		textAlign: 'center'
	},
	zzc: {
		width: devWidth,
		height: devHeight,
		backgroundColor: '#cccccc',
		position: 'absolute',
		opacity: 0.5,
		zIndex: 998,
		top: 0,
	},
	alertBottom: {
		display: 'flex',
		width: 270,
		// borderTopWidth:1,
		// borderTopColor:'#4d4d4d',
		// borderTopStyle:'solid',
		height: 43,
		// opacity:0.78,
		// positionTop:'absolute',
		// bottom:0
	},
	searchInfo: {
		height: devHeight - 106,
		overflowX: 'hidden',
		overflowY: 'scroll',
		width: devWidth,
		// backgroundColor:'#FFFFFF',
	},
	divLine: {
		width: devWidth - 64,
		marginLeft: 20,
		height: 1,
		backgroundColor: '#D8D8D8',
		marginTop: 13,
		marginBottom: 13
	},
	point: {
		position: 'absolute',
		// right:28,
		// left: 128,
		marginTop: 13,
		width: 15,
		height: 15,
		lineHeight: '15px',
		borderRadius: '50%',
		fontSize: 11,
		backgroundColor: '#f15114',
		color: Common.Bg_White,
		textAlign: 'center',
		top: 5,
		marginLeft: 3
	},
}

export default offlineToExamine;
