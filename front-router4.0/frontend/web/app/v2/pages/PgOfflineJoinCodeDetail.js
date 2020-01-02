import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
import QRCode from 'qrcode.react'
import FullLoading from '../components/FullLoading';


var width = devWidth
var height = window.innerHeight
var borderWidth = height * (541 / 667) - 341
var codeWith = borderWidth - 20
var t

function funcUrl(name, value, type) {
	var loca = window.location;
	var baseUrl = type == undefined ? loca.origin + loca.pathname + "?" : "";
	var query = loca.search.substr(1);
	// 如果没有传参,就返回 search 值 不包含问号
	if (name == undefined) { return query }
	// 如果没有传值,就返回要查询的参数的值
	if (value == undefined) {
		var val = query.match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
		return val != null ? decodeURI(val[2]) : null;
	};
	var url;
	if (query == "") {
		// 如果没有 search 值,则返回追加了参数的 url
		url = baseUrl + name + "=" + value;
	} else {
		// 如果没有 search 值,则在其中修改对应的值,并且去重,最后返回 url
		var obj = {};
		var arr = query.split("&");
		for (var i = 0; i < arr.length; i++) {
			arr[i] = arr[i].split("=");
			obj[arr[i][0]] = arr[i][1];
		};
		obj[name] = value;
		url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
	};
	return url;
}


class PgOfflineJoinCodeDetail extends React.Component {
	constructor(props) {
		super(props);
		this.wx_config_share_home = {
			title: '铂略咨询-财税领域实战培训供应商',
			desc: '企业财务管理培训,财务培训课程,税务培训课程',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link'
		};
		this.state = {
			value: '',
			size: 140,
			fgColor: '#000000',
			bgColor: '#ffffff',
			level: 'L',
			tiXing: true,//是否提醒
			isLoading: true,
		};

	}

	componentWillMount() {

	}
	_handlecodeDetail(re) {
		// 后台人员专用报错，按理说只要能进页面，就一定是正确的code，正确的页面
		if (re.err) {
			alert(re.err)
			return
		}
		var result = re.result || {}
		this.setState({
			offlineInfo: result.offlineInfo || {},
			codeDetail: result.codeDetail,
			value: result.codeDetail.checkcode || '',
			isLoading: false
		}, () => {
			Dispatcher.dispatch({
				actionType: 'WX_JS_CONFIG',
				onMenuShareAppMessage: this.wx_config_share_home
			})
		})
	}
	componentDidMount() {
		devWidth = window.screen.width;
		devHeight = window.innerHeight;

		var isApp = funcUrl()
		var urlquery = Dm.getCurrentUrlQuery();
		var isApp = urlquery.isApp || ''
		if (isApp) {
			this.setState({
				tiXing: false
			})
		}

		EventCenter.emit("SET_TITLE", '铂略财课-参课详情');
		this._getcodeDetail = EventCenter.on("codeDetailDone", this._handlecodeDetail.bind(this));

		if (this.props.match.params.id) {
			Dispatcher.dispatch({
				actionType: 'codeDetail',
				resource_id: this.props.match.params.id,
				checkcode: this.props.match.params.checkcode,
			})
		} else {
			Dispatcher.dispatch({
				actionType: 'codeDetail',
				code: this.props.match.params.checkcode,
			})
		}
	}
	componentWillUnmount() {
		this._getcodeDetail.remove()
	}

	gotoMap(add) {
		window.location.href = 'http://api.map.baidu.com/marker?location=' + add.map_y + ',' + add.map_x + '&title=课程地址&content=' + add.site + '&output=html'
	}
	render() {
		var offlineInfo = this.state.offlineInfo || {}
		var address = offlineInfo.address || {}
		var codeDetail = this.state.codeDetail || {}
		var status_text
		var status_image
		var status_block = 'none'
		var text_line = {} //是否失效的显示状态
		var data_time
		if (codeDetail.status == 5) {
			status_text = '签到成功'
			status_image = '/img/v2/offlineReserve/joinSuccess@2x.png'
			status_block = 'block'
			text_line = {
				textDecoration: 'line-through'
			}
		} else if (codeDetail.status == 6) {
			status_text = '缺席失效'
			status_image = '/img/v2/offlineReserve/noJoin@2x.png'
			status_block = 'block'
			text_line = {
				textDecoration: 'line-through'
			}
		}
		var start_date = new Date(offlineInfo.start_time || 0).format("yyyy-MM-dd")
		var start_time = new Date(offlineInfo.start_time || 0).format("hh:mm");
		var end_time = new Date(offlineInfo.end_time || 0).format("hh:mm");
		var end_date = new Date(offlineInfo.end_time || 0).format("MM-dd")

		if (offlineInfo.isSameDay) {
			data_time = start_date + ' ' + start_time + '-' + end_time
		} else {
			data_time = start_date + ' 至 ' + end_date
		}
		var herftel = 'tel://' + offlineInfo.tel
		var herf = 'tel://' + offlineInfo.contacts_phone;

		var currentHeight;
		var contentHeight;
		var codeWidth;//二维码宽度
		var codeHeight;//二维码高度
		var codeLeft = 0;//二维码距离左边的距离
		var maxWidth = 220;//二维码边长定量,最大宽度
		var minWidth = 140;//二维码边长最小值

		if (devHeight < 597) {
			currentHeight = 597;
		}
		else {
			currentHeight = devHeight
		}

		if (offlineInfo.contacts_phone && offlineInfo.contacts) {
			contentHeight = 255;//显示会场接待时内容区域高度
		}
		else {
			contentHeight = 215;//不显示会场接待时的内容区域高度
		}

		codeWidth = 140;
		codeHeight = 140;
		codeLeft = (devWidth - codeWidth - 36) / 2;
		//codeHeight = currentHeight - contentHeight-123;

		// if(codeWidth > codeHeight){//二维码为正方形，选取尺寸小的作为边长
		//   codeWidth = codeHeight;
		//   if(codeWidth > maxWidth){
		//     codeWidth = maxWidth;
		//     codeHeight = maxWidth;
		//   }
		//   else if(codeWidth < minWidth){
		//     codeWidth = minWidth;
		//     codeHeight = minWidth;
		//   }
		//   codeLeft = (devWidth-codeWidth-36)/2;
		// }
		// else if (codeWidth < codeHeight) {
		//   codeHeight = codeWidth;
		//   if(codeHeight > maxWidth){
		//     codeWidth = maxWidth;
		//     codeHeight = maxWidth;
		//   }
		//   else if (codeHeight < minWidth) {
		//     codeWidth = minWidth;
		//     codeHeight = minWidth;
		//   }
		//   codeLeft = (devWidth-codeWidth-36)/2;
		// }

		return (
			<div style={{ ...styles.div, height: currentHeight - 13, }} ref={(lessonList) => this.lessonList = lessonList}>
				<FullLoading isShow={this.state.isLoading} />
				<div style={{ ...styles.codeDiv, }}>
					<div style={{ height: 50, paddingTop: 20, }}>
						<div style={{ textAlign: 'center', }}>
							<span style={{ fontSize: 18, color: '#000000', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.43px' }}>铂略线下课参课券</span>
						</div>
						<div style={{ textAlign: 'center', marginTop: 6 }}>
							<span style={{ fontSize: 14, color: '#c3c3c3', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.34px' }}>请向工作人员出示进行签到</span>
						</div>
					</div>
					<div style={{ width: devWidth - 96, height: 1, border: '1px #e9e9e9', marginLeft: 30, borderBottomStyle: 'dashed' }}>
					</div>

					<div style={{ marginTop: 20, width: codeWidth, height: codeHeight, marginLeft: codeLeft, }}>
						<QRCode
							value={this.state.value}
							size={codeWidth}
							fgColor={this.state.fgColor}
							bgColor={this.state.bgColor}
							level={this.state.level}
						/>
						<div style={{ ...styles.codezzc, zIndex: 9998, display: status_block }}></div>
						<div style={{ ...styles.status_text, zIndex: 9999, display: status_block }}>
							<img src={Dm.getUrl_img(status_image)} height="40" width="40" />
							<div style={{ marginTop: 13 }} >
								<span style={{ fontSize: 18, color: '#ffffff' }}>{status_text}</span>
							</div>
						</div>
					</div>
					<div style={{ textAlign: 'center', marginTop: 8, height: 18, marginBottom: 15, }}>
						<span style={{ ...text_line, fontSize: 16, color: '#f37633' }}>券号 {this.state.value}</span>
					</div>

					<div style={{ height: (offlineInfo.contacts_phone && offlineInfo.contacts) ? 255 : 215, }}>
						<div style={{ ...styles.content, ...styles.LineClamp, lineHeight: '20px' }}>
							<Link to={`${__rootDir}/lesson/offline/${offlineInfo.id}`}>
								<span style={{ fontSize: 16, color: '#333333', fontFamily: 'PingFangSC-Medium', letterSpacing: '-0.33px' }}>{offlineInfo.title}</span>
							</Link>
						</div>
						<div style={{ ...styles.content, marginTop: 15 }}>
							<div>
								<span style={{ display: 'inline-block', width: 55, fontSize: 11, color: '#c0c0c0', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px' }}>举办时间</span>
								<span style={{ fontSize: 12, color: '#262626', fontFamily: 'PingFangSC-Medium', letterSpacing: '-0.33px', marginLeft: 15 }}>{data_time}</span>
								<span style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>({start_time} 签到)</span>
							</div>
						</div>
						<div onClick={this.gotoMap.bind(this, address)} style={{ ...styles.content, marginTop: 10, position: 'relative', overflow: 'hidden' }}>
							<div style={{ width: 55, float: 'left' }}>
								<span style={{ fontSize: 11, color: '#c0c0c0', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px' }}>举办地址</span>
							</div>
							<div style={{ width: devWidth - 170, marginLeft: 15, float: 'left' }}>
								<span style={{ fontSize: 12, color: '#262626', fontFamily: 'PingFangSC-Medium', letterSpacing: '-0.33px' }}>{address.provincename || ''}&nbsp;{address.cityname || ''}&nbsp;{address.address || ''}</span>
								<div style={{ marginTop: 5, position: 'relative', }}>
									<span style={{ fontSize: 11, color: '#999999', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px', marginTop: 5 }}>{address.site}&nbsp;{address.detail_place ? address.detail_place : ''}</span>
									<img src={Dm.getUrl_img('/img/v2/icons/more.png')} width="8" height="14" style={{ position: 'absolute', right: 0, bottom: 0, }} />
								</div>
							</div>
						</div>
						<div style={{ width: devWidth - 96, height: 1, backgroundColor: '#D8D8D8', marginLeft: 30, marginTop: 8, position: 'relative' }}></div>
						<div style={{ ...styles.content, marginTop: 10, paddingTop: 0 }}>
							<div style={{ width: 55, float: 'left' }}><span style={{ fontSize: 11, color: '#c0c0c0', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px' }}>参课人员</span></div>
							<div style={{ width: devWidth - 170, marginLeft: 15, float: 'left' }}><span style={{ fontSize: 11, color: '#999999' }}>{codeDetail.name}</span></div>
						</div>
						<div style={{ ...styles.content, overflow: 'hidden', paddingTop: 5, }}>
							<div style={{ width: 55, float: 'left' }}><span style={{ fontSize: 11, color: '#c0c0c0', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px' }}>手机号码</span></div>
							<div style={{ width: devWidth - 170, marginLeft: 15, float: 'left' }}><span style={{ fontSize: 11, color: '#999999' }}>{codeDetail.phone}</span></div>
						</div>
						<div style={{ ...styles.content, overflow: 'hidden', paddingTop: 5, }}>
							<div style={{ width: 55, float: 'left' }}><span style={{ fontSize: 11, color: '#c0c0c0', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px' }}>电子邮箱</span></div>
							<div style={{ width: devWidth - 175, marginLeft: 15, float: 'left' }}><span style={{ fontSize: 11, color: '#999999' }}>{codeDetail.email}</span></div>
						</div>
						<div style={{ ...styles.button, display: (offlineInfo.contacts_phone && offlineInfo.contacts) ? 'block' : 'none' }}>
							<div style={{ marginTop: 12 }}>
								<span style={{ fontSize: 14, color: '#333333' }}>会场接待 <a style={{ color: '#333333' }} href={herf}>{offlineInfo.contacts_phone}</a> </span>
								<span style={{ fontSize: 12, color: '#999999' }}> ({offlineInfo.contacts})</span>
							</div>
						</div>
					</div>

				</div>
				{
					(isWeiXin && this.state.tiXing) ?
						<div style={{ ...styles.bottom, display: 'none' }}>
							<div style={{ ...styles.top, float: 'left' }}>
								<img src={Dm.getUrl_img('/img/v2/pgCenter/kktx@2x.png')} height="15" width="15" style={{ marginTop: 16, marginLeft: 14 }} />
								<span style={{ fontSize: 14, color: '#333333', marginLeft: 9, marginTop: 12 }}>开课提醒</span>
							</div>
							<div style={{ ...styles.top, float: 'right', marginTop: 12 }}>
								<span style={{ fontSize: 14, color: '#333333', marginRight: 14 }}>一天前</span>
							</div>
						</div>
						: null
				}
				<div style={{ height: 35, lineHeight: '35px', textAlign: 'center', width: devWidth }}>
					<span style={{ fontSize: 12, color: '#ffffff' }}>客服热线 <a style={{ color: '#ffffff', textDecoration: 'underline' }} href={herftel}>{offlineInfo.tel}</a></span>
				</div>
				<div style={{ ...styles.round, top: 75, left: 18 }}></div>
				<div style={{ ...styles.round, top: 75, right: 18, borderRadius: ' 100px 0px 0px 100px' }}></div>
			</div>
		)
	}
}

var styles = {
	div: {
		width: devWidth,
		// backgroundImage: 'url('+Dm.getUrl_img('/img/v2/pgCenter/Rectangle@2x.png')+')',
		backgroundImage: 'linear-gradient(49deg, #27CFFF 0%, #2AA6FF 100%)',
		backgroundSize: '100%',
		backgroundAttachment: 'fixed',
		position: 'relative',
		paddingTop: 13,
		height: devHeight - 13,
		overflowY: 'auto'
	},
	codeDiv: {
		width: devWidth - 36,
		backgroundColor: '#FFFFFF',
		boxShadow: '0 2px 4px 0  #078ffb',
		borderRadius: '12px',
		marginLeft: 18,
		position: 'relative',
		lineHeight: 1,
	},
	codezzc: {
		height: 140,
		width: 140,
		position: 'absolute',
		opacity: 0.7,
		backgroundColor: '#000000',
		top: 92
	},
	status_text: {
		height: 140,
		width: 140,
		position: 'absolute',
		top: 98,
		textAlign: 'center',
		paddingTop: (140 - 71) / 2,
	},
	content: {
		width: devWidth - 96,
		marginLeft: 30,
		position: 'relative',
	},
	button: {
		width: devWidth - 36,
		height: 40,
		backgroundColor: '#f4f8fb',
		borderRadius: '0 0 12px 12px',
		position: 'absolute',
		bottom: 0,
		textAlign: 'center',
	},
	bottom: {
		width: devWidth - 36,
		height: 45,
		backgroundColor: '#FFFFFF',
		marginLeft: 18,
		borderRadius: '4px',
		position: 'absolute',
		left: 0,
		bottom: 35,
	},
	round: {
		backgroundImage: 'linear-gradient(-45deg,#2196F3 0%,#5AB6FF 100%)',
		height: 20,
		width: 10,
		borderRadius: ' 0 100px 100px 0',
		position: 'absolute',
		zIndex: 999,
	},
	LineClamp: {
		textOverflow: 'ellipsis',
		whiteSpace: 'normal',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
	},
}

export default PgOfflineJoinCodeDetail;
