import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

var countdown
class Guide extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			guideHeight: 80,
			guideWidth: 80,
			left: (devWidth - 1660) / 2 - (devWidth / 2 - 38),
			top: (devHeight - 1660) / 2 - (devHeight / 2 - 15),
			// left: (devWidth - 1660)/2 - (devWidth* 0.75)/2 + 72,
			// top: (devHeight - 1660)/2 - (devHeight/2-30)+5,
			status: 1, //状态代表顺序 目前正在引导第几个
			display: 'none',
			disp_status: null,
			isMainHolder: false,
			// liveStatus:0
			guideTop: 40,//首页导学的Top
			
		};

	}

	componentWillMount() {
		// 判断首页是否出现打开App 浮层
		var date1 = localStorage.getItem("DownloadAppTime")
		var date2 = Date.now();
		
		if((date2 - date1) >= (60* 60 *1000)){
			this.setState({
				guideTop: 40,	
			})
		}else {
			this.setState({
				guideTop: 0,
			})
		}
		
		



	}
	_handleLiveDetail(re) {//因为直播详情页判断比较多 所以单独拿出来
		if (!re || re.err || !re.user) {
			return
		}
		var status = re.result.status

		// var GuideLiveStart = ''
		// var GuideLiveIng = ''
		// var GuideLiveEnd = ''
		var GuideLiveStart = localStorage.getItem("GuideLiveStart")
		var GuideLiveIng = localStorage.getItem("GuideLiveIng")
		var GuideLiveEnd = localStorage.getItem("GuideLiveEnd")
		if (status == 1 && GuideLiveIng == 'GuideLiveIng') {
			this.setState({
				display: 'none'
			})
			return false //如果之前有过引导记录 就去掉
		}
		if (status == 2 && GuideLiveEnd == 'GuideLiveEnd') {
			this.setState({
				display: 'none'
			})
			return false //如果之前有过引导记录 就去掉
		}
		if ((status == 0 || status == 3) && GuideLiveStart == 'GuideLiveStart') {
			this.setState({
				display: 'none'
			})
			return false //如果之前有过引导记录 就去掉
		}
		if (status == 3) {
			status = 0
		}
		this.setState({
			status: status,
			display: re.user.type ? 'block' : 'none'
		})
	}
	_handleindexDone(re) {//除了直播课详情 其他都类似 所以可以综合写成一个
		
		if (!re || re.err || !re.user) {
			return
		}
		switch (this.props.type) {
			case 'offline':
				var GuideOffline = localStorage.getItem("GuideOffline")
				// var GuideOffline = ''
				if (GuideOffline == 'GuideOffline') {
					this.setState({
						display: 'none'
					})
				} else if (re && !re.err) {
					var disp_status = re.result.disp_status
					if (disp_status == 1 && re.user.type) {
						this.setState({
							display: re.user.type ? 'block' : 'none',
							isMainHolder: re.user && re.user.main_holder ? re.user.main_holder : false,
							isReservedNew: re.result.isReservedNew,
						}, () => {
							this.setState({
								guideHeight: 50,
								guideWidth: this.state.isMainHolder && this.state.isReservedNew ? 115 : 230,
								left: this.state.isMainHolder && this.state.isReservedNew  ? ((devWidth - 1826) / 2 + (devWidth / 2 - 224 / 2) + 110) : (devWidth - 1826) / 2 + (devWidth / 2 - 224 / 2),
								top: (devHeight - 1660) / 2 + (devHeight / 2 - 30) + 10,
								// status: this.props.liveStatus || 0
							})
						})
					}
				}
				break
			case 'product':
				var GuideProduct = localStorage.getItem("GuideProduct")
				// var GuideProduct = ''
				if (GuideProduct == 'GuideProduct') {
					this.setState({
						display: 'none'
					})
				} else if (!re.result.isCollect && !re.err) {
					this.setState({
						display: re.user.type ? 'block' : 'none'
					})
				}
				break;
			case 'teacher':
				var GuideTeacher = localStorage.getItem("GuideTeacher")
				// var GuideTeacher = ''
				if (GuideTeacher == 'GuideTeacher') {
					this.setState({
						display: 'none'
					})
				} else if (!re.result.isCollected && !re.err) {
					this.setState({
						display: re.user.type ? 'block' : 'none'
					})
				}
				break;
			case 'home':
				var GuideIndex = localStorage.getItem("GuideIndex")
				// var GuideIndex = ''
				// console.log('GuideIndex',GuideIndex);
				if (GuideIndex == 'GuideIndex') {
					this.setState({
						display: 'none'
					})
				} else if (!re.err) {
					this.setState({
						display: re.user.type ? 'block' : 'none'
					})
				}
				break;
			case 'qa':
				var GuideQa = localStorage.getItem("GuideQa")
				// var GuideQa = ''
				if (GuideQa == 'GuideQa') {
					this.setState({
						display: 'none'
					})
				} else if (!re.err) {
					this.setState({
						display: re.user.type ? 'block' : 'none'
					})
				}
				break;
			case 'online':
				var GuideOnline = localStorage.getItem("GuideOnline")
				// var GuideOnline = ''
				if (GuideOnline == 'GuideOnline') {
					this.setState({
						display: 'none'
					})
				} else if (!re.err) {
					this.setState({
						display: re.user.type ? 'block' : 'none'
					})
				}
				break;
			default:
		}
		// this.setState({
		// 	display: re.user.type ? 'block':'none'
		// })
	}
	
	_handlegetDownLoadAppDisplay(re){
		// console.log('---------32424', re);
		if(re === 'none'){
			this.setState({
				guideTop: 0,
			},() => {
				this.follow()
			})
			// console.log('666')
		}
	}

	componentDidMount() {
		// console.log('----------this.props-------------',this.props);
		this._liveDetail = EventCenter.on('LiveDetailDone', this._handleLiveDetail.bind(this))
		this._getindexDone = EventCenter.on('indexDone', this._handleindexDone.bind(this))
		this._getQuestionListDone = EventCenter.on('QuestionListDone', this._handleindexDone.bind(this))
		this._onlineDetail = EventCenter.on('OnlineLoadDetailDone', this._handleindexDone.bind(this))
		this._offlineDetail = EventCenter.on('OfflineDetailDone', this._handleindexDone.bind(this))
		this._getProductDetailDone = EventCenter.on('ProductDetailDone', this._handleindexDone.bind(this));
		this.e_TeacherUserInfo = EventCenter.on('TeacherUserInfoDone', this._handleindexDone.bind(this));

		
		this._getDownLoadAppDisplay = EventCenter.on('getDownLoadAppDisplay',this._handlegetDownLoadAppDisplay.bind(this))

		this.follow()

		
	}
	componentWillUnmount() {
		this._liveDetail.remove()
		this._getindexDone.remove()
		this._getQuestionListDone.remove()
		this._onlineDetail.remove()
		this._offlineDetail.remove()
		this._getProductDetailDone.remove()
		this.e_TeacherUserInfo.remove()

		// clearInterval(countdown)
		this._getDownLoadAppDisplay.remove()
	}
	follow() {
		switch (this.props.type) {
			case 'home':
				if (this.state.status == 1) {
					this.setState({
						guideHeight: 80,
						guideWidth: 80,
						left: (devWidth - 1660) / 2 - (devWidth / 2 - 38),
						// top: (devHeight - 1660) / 2 - (devHeight / 2 - 15),
						top: this.state.guideTop == 40 ? (devHeight - 1660) / 2 - (devHeight / 2 - 15) + 40 : (devHeight - 1660) / 2 - (devHeight / 2 - 15), 
					})
				}
				break;
			case 'qa':
				if (this.state.status == 1) {
					this.setState({
						guideHeight: 80,
						guideWidth: 80,
						left: (devWidth - 1660) / 2 - 10,
						top: (devHeight - 1660) / 2 + (devHeight / 2 - 160) + 50,
					})
				}
				break;
			case 'online':
				if(this.state.status == 1) {
					this.setState({
						guideHeight: 60,
						guideWidth: 60,
						left: (devWidth - 1660) / 2,
						top: (devHeight - 1660) / 2 + (devHeight / 2 - 30),
					})
				}
				break;
			case 'live':
				this.setState({
					guideHeight: 50,
					guideWidth: 113,
					left: (devWidth - 1830) / 2 + (devWidth / 2 - 222 / 2) + 113,
					top: (devHeight - 1660) / 2 + (devHeight / 2 - 30) + 10,
					// status: this.props.liveStatus || 0
				})
				break;
			case 'product':
				this.setState({
					guideHeight: 50,
					guideWidth: 50,
					left: (devWidth - 1660) / 2 - (devWidth / 2 - 35),
					top: (devHeight - 1660) / 2 + (devHeight / 2 - 20),
				})
				break;
			case 'teacher':
				this.setState({
					guideHeight: 65,
					guideWidth: 65,
					left: (devWidth - 1660) / 2 + (devWidth / 2 - 58),
					top: (devHeight - 1660) / 2 - (devHeight / 2 - 41),
				})
				break;
			// case 'offline':
			// 	this.setState({
			// 		guideHeight: 50,
			// 		guideWidth:this.state.isMainHolder ? 115:230,
			// 		left:this.state.isMainHolder ? (devWidth - 1826) / 2 + (devWidth / 2 - 224 / 2)+115:(devWidth - 1826) / 2 + (devWidth / 2 - 224 / 2),
			// 		top:this.state.isMainHolder ? (devHeight - 1660) / 2 + (devHeight / 2 - 30) + 125:(devHeight - 1660) / 2 + (devHeight / 2 - 30) + 10,
			// 		// status: this.props.liveStatus || 0
			// 	})
			// 	break;
			default:

		}
	}
	goQuestion() {
		this.setState({
			guideHeight: 60,
			guideWidth: 60,
			left: (devWidth - 1660) / 2,
			top: (devHeight - 1660) / 2 + (devHeight / 2 - 30),
			status: 3
		})
	}
	goSearch() {
		this.setState({
			guideHeight: 40,
			guideWidth: devWidth * 0.75,
			left: (devWidth - 1660) / 2 - (devWidth * 0.75) / 2 + 72,
			top: (devHeight - 1660) / 2 - (devHeight / 2 - 30) + 5,
			top: this.state.guideTop == 40 ? (devHeight - 1660) / 2 - (devHeight / 2 - 30) + 42 : (devHeight - 1660) / 2 - (devHeight / 2 - 30) + 5 ,
			status: 2
		})
		localStorage.setItem("GuideIndex", 'GuideIndex');
	}
	goQa() {
		this.setState({
			guideHeight: 40,
			guideWidth: 230,
			// left: (devWidth - 1826) / 2 - (devWidth / 2 - 230 / 2) / 2,
			left: 0 - 800 + 10,
			top: (devHeight - 1660) / 2 - (devHeight / 2 - 30) + 45,
			status: 2
		})
		localStorage.setItem("GuideQa", 'GuideQa');
	}
	share() {
		this.setState({
			guideHeight: 2,
			guideWidth: 2,
			left: (devWidth - 1826) / 2 - (devWidth / 2 - 230 / 2) / 2,
			top: (devHeight - 1660) / 2 - (devHeight / 2 - 30) + 45,
			status: 2
		})
		localStorage.setItem("GuideOnline", 'GuideOnline');
	}
	none() {
		switch (this.props.type) {
			case 'offline':
				localStorage.setItem("GuideOffline", 'GuideOffline');
				break;
			case 'product':
				localStorage.setItem("GuideProduct", 'GuideProduct');
				break;
			case 'teacher':
				localStorage.setItem("GuideTeacher", 'GuideTeacher');
				break;
			case 'live':
				if (this.state.status == 1) {
					localStorage.setItem("GuideLiveIng", 'GuideLiveIng');
				}
				if (this.state.status == 2) {
					localStorage.setItem("GuideLiveEnd", 'GuideLiveEnd');
				}
				if (this.state.status == 3 || this.state.status == 0) {
					localStorage.setItem("GuideLiveStart", 'GuideLiveStart');
				}
				break;
		}
		this.setState({
			display: 'none'
		})
	}
	render() {
		var height = this.state.guideHeight
		var width = this.state.guideWidth
		var left = this.state.left
		var top = this.state.top
		return (
			<div style={{ ...styles.div, display: this.state.display }}>
				<div style={{ ...styles.guide, width: width, height: height, left: left, top: top, borderRadius: '9999999999999px' }}>
				</div>
				<div style={{ display: this.props.type == 'home' ? 'block' : 'none' }}>{/**首页显示*/}
					<div style={{ display: this.state.status == 1 ? 'block' : 'none' }}>{/**首页地址引导站点*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/xia@2x.png`)} style={{ width: 25, height: 25, ...styles.icon, top: this.state.guideTop == 40 ? 100 : 60, left: 84 }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/fbqg@2x.png`)} style={{ width: 140, height: 16, ...styles.icon, left: 40, top: this.state.guideTop == 40 ? 130 : 90 }} />
						<img onClick={this.goSearch.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, top: 220, left: (devWidth - 100) / 2 }} />
					</div>
					<div style={{ display: this.state.status == 2 ? 'block' : 'none' }}>{/**首页搜索引导搜索*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/xia@2x.png`)} style={{ width: 25, height: 25, ...styles.icon, top: this.state.guideTop == 40 ? 100 : 60, left: (devWidth - 25) / 2 + devWidth * 0.2 }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/search@2x.png`)} style={{ width: 218, height: 16, ...styles.icon, left: (devWidth - 218) / 2 + devWidth * 0.2, top: this.state.guideTop == 40 ? 130 : 90 }} />
						<img onClick={this.goQuestion.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, top: 220, left: (devWidth - 100) / 2 }} />
					</div>
					<div style={{ display: this.state.status == 3 ? 'block' : 'none' }}>{/**首页问答引导*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/question@2x.png`)} style={{ width: 123, height: 40, ...styles.icon, bottom: 100, left: (devWidth - 123) / 2 }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left: (devWidth - 14) / 2, bottom: 64 }} />
						<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 180, left: (devWidth - 100) / 2 }} />
					</div>
				</div>
				<div style={{ display: this.props.type == 'qa' ? 'block' : 'none' }}>{/**回答显示*/}
					<div style={{ display: this.state.status == 2 ? 'block' : 'none' }}>{/**问答引导搜索*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/xia@2x.png`)} style={{ width: 25, height: 25, ...styles.icon, top: 90, left: (230) / 2 + 30 }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/tuijian@2x.png`)} style={{ width: 124, height: 16, ...styles.icon, left: (230) / 2 - 10, top: 130 }} />
						<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, top: 210, left: (devWidth - 100) / 2 }} />
					</div>
					<div style={{ display: this.state.status == 1 ? 'block' : 'none' }}>{/**问答推荐引导*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/question@2x.png`)} style={{ width: 123, height: 40, ...styles.icon, bottom: 200, left: (devWidth - 123) / 2 }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left: (devWidth - 14) / 2 - 14, bottom: 150 }} />
						<img onClick={this.goQa.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 250, left: (devWidth - 100) / 2 }} />
					</div>
				</div>
				<div style={{ display: this.props.type == 'online' ? 'block' : 'none' }}>{/**视频课显示*/}
					<div style={{ display: this.state.status == 2 ? 'block' : 'none' }}>{/**视频课分享引导搜索*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/left@2x.png`)} style={{ width: 25, height: 25, ...styles.icon, top: 10, right: 50 }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/haoyou@2x.png`)} style={{ width: 109, height: 16, ...styles.icon, right: 14, top: 40 }} />
						<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, top: 210, left: (devWidth - 100) / 2 }} />
					</div>
					<div style={{ display: this.state.status == 1 ? 'block' : 'none' }}>{/**视频课提问引导*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/onlinehudong@2x.png`)} style={{ width: 123, height: 40, ...styles.icon, bottom: 106, left: (devWidth - 123) / 2 }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left: (devWidth - 14) / 2, bottom: 65 }} />
						<img onClick={this.share.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 200, left: (devWidth - 100) / 2 }} />
					</div>
				</div>
				<div style={{ display: this.props.type == 'live' ? 'block' : 'none' }}>{/**直播课显示*/}
					<div style={{ display: this.state.status == 1 ? 'block' : 'none' }}>{/**直播课引导*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/hudong@2x.png`)} style={{ width: 96, height: 38, ...styles.icon, bottom: 106, left: (devWidth - 106) }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left: (devWidth - 14) / 2 + 120, bottom: 65 }} />
						<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 200, left: (devWidth - 216) + 100 }} />
					</div>
					<div style={{ display: this.state.status == 0 ? 'block' : 'none' }}>{/**直播课引导*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/zhanzuo@2x.png`)} style={{ width: 139, height: 16, ...styles.icon, bottom: 106, left: (devWidth - 156) }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left: (devWidth - 14) / 2+120, bottom: 65 }} />
						<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 200, left: (devWidth - 116) }} />
					</div>
					<div style={{ display: this.state.status == 2 ? 'block' : 'none' }}>{/**直播课引导*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/cuoguo@2x.png`)} style={{ width: 112, height: 38, ...styles.icon, bottom: 106, left: (devWidth - 146) }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left: (devWidth - 14) / 2+120, bottom: 65 }} />
						<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 200, left: (devWidth - 116) }} />
					</div>
				</div>
				<div style={{ display: this.props.type == 'product' ? 'block' : 'none' }}>{/**专题课*/}
					<div style={{ display: this.state.status == 1 ? 'block' : 'none' }}>{/**专题课引导*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/xianzhi@2x.png`)} style={{ width: 109, height: 40, ...styles.icon, bottom: 86, left: 40 }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left: 24, bottom: 54 }} />
						<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 192, left: (devWidth - 100) / 2 }} />
					</div>
				</div>
				<div style={{ display: this.props.type == 'teacher' ? 'block' : 'none' }}>{/**讲师*/}
					<div style={{ display: this.state.status == 1 ? 'block' : 'none' }}>{/**讲师引导*/}
						<img src={Dm.getUrl_img(`/img/v2/guide/left@2x.png`)} style={{ width: 25, height: 24, ...styles.icon, top: 50, right: 98 }} />
						<img src={Dm.getUrl_img(`/img/v2/guide/bawo@2x.png`)} style={{ width: 125, height: 44, ...styles.icon, right: 62, top: 85 }} />
						<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, top: 250, left: (devWidth - 100) / 2 }} />
					</div>
				</div>
				<div style={{ display: this.props.type == 'offline' ? 'block' : 'none' }}>{/**线下课显示*/}
					{this.state.isMainHolder ?
						<div>
							{this.state.isReservedNew ?
								<div style={{ display: this.state.status == 1 ? 'block' : 'none' }}>{/**线下课引导*/}
									<img src={Dm.getUrl_img(`/img/v2/guide/xiande@2x.png`)} style={{ width: 96, height: 38, ...styles.icon, bottom: 106, left: (devWidth - 111) }} />
									<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left:((devWidth - 14) / 2+115) , bottom: 65 }} />
									<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 200, left: (devWidth - 111) }} />
								</div>
								:
								<div style={{ display: this.state.status == 1 ? 'block' : 'none' }}>{/**线下课引导*/}
									<img src={Dm.getUrl_img(`/img/v2/guide/xiande@2x.png`)} style={{ width: 96, height: 38, ...styles.icon, bottom: 106, left: (devWidth - 226) }} />
									<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left: ((devWidth - 14) / 2), bottom: 65 }} />
									<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 200, left: (devWidth - 216) }} />
								</div>
							}
						</div>
						:
						<div style={{ display: this.state.status == 1 ? 'block' : 'none' }}>{/**线下课引导*/}
							<img src={Dm.getUrl_img(`/img/v2/guide/xiande@2x.png`)} style={{ width: 96, height: 38, ...styles.icon, bottom: 106, left: (devWidth - 226) }} />
							<img src={Dm.getUrl_img(`/img/v2/guide/shang@2x.png`)} style={{ width: 14, height: 32, ...styles.icon, left: (devWidth - 14) / 2, bottom: 65 }} />
							<img onClick={this.none.bind(this)} src={Dm.getUrl_img(`/img/v2/guide/zdl@2x.png`)} style={{ width: 100, height: 35, ...styles.icon, bottom: 200, left: (devWidth - 216) }} />
						</div>
					}
				</div>
			</div>
		)
	}
}

var styles = {
	div: {
		height: devHeight,
		width: devWidth,
		// position: 'absolute',
		overflow: 'hidden',
		zIndex: 8000,
		top: 0,
		left: 0,
		position: 'fixed',
	},
	guide: {
		// width: 60,
		// height: 60,
		border: '800px solid rgba(0, 0, 0, .45)',
		borderRadius: '50%',
		position: 'absolute',
		// opacity: 0.5
		// zIndex:9999999
		// left: (devWidth - 1660)/2 - 130,
		// top: (devHeight - 1660)/2 - 300,
		// borderRadius:'20px'
	},
	icon: {
		position: 'absolute',
		zIndex: 999
	},
	sea: {
		// borderTopRight-radius: 4px;    /*目标元素右上角为4px的圆角*/
		// border-top-left-radius: 4px;    /*目标元素左上角为4px的圆角*/
	}
}

export default Guide;
