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
import ResultAlert from '../components/ResultAlert'

var countdown;
class Coupons extends React.Component {
	constructor(props) {
		super(props);
		this.wx_config_share_home = {
			title: '我的参课券-铂略咨询',
			desc: '铂略咨询-财税领域实战培训供应商',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link'
		};

		this.state = {
			list_data: [],
			//弹框提示信息
			alert_display: 'none',
			alert_title: '',
			isShow: false,
			errStatus: 0,//0:返回错误信息,1:显示其他提示信息
		}
	}

	componentWillMount() {
		EventCenter.emit("SET_TITLE", '铂略财课-我的参课券')
	}
	componentDidMount() {
		Dispatcher.dispatch({
			actionType: 'UserRegisterCodeList'
		})

		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

		this.e_UserRegisterCodeList = EventCenter.on('UserRegisterCodeListDone', this._handleUserRegisterCodeList.bind(this))
	}
	componentWillUnmount() {
		this.e_UserRegisterCodeList.remove()
		clearInterval(countdown)
	}
	goToDetail(code, id, checkcode) {
		if (code) {
			this.props.history.push({ pathname: `${__rootDir}/PgOfflineJoinCodeDetail/${code}` })
		} else {
			this.props.history.push({ pathname: `${__rootDir}/PgOfflineJoinDetail/${id}/${checkcode}` })
		}
	}
	_handleUserRegisterCodeList(re) {
		console.log('CodeList====', re);
		if (re.err) {

			this.setState({
				alert_display: 'block',
				alert_title: re.err,
				isShow: false,
				errStatus: 0,
			}, () => {
				countdown = setInterval(()=> {
					clearInterval(countdown);
					this.setState({
						alert_display: 'none',
					})
				}, 1500);
			})
			return false;
		}
		if (re.result.length > 0) {
			this.setState({
				list_data: re.result,
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
					<span style={{ fontSize: 15, color: '#999999' }}>暂无数据哦~</span>
				</div>
			</div>
		)

		var list = this.state.list_data.map((item, index) => {
			var time = '';
			if (item.isSameDay) {//同一天
				time = (
					<span style={{ color: '#262626' }}>{new Date(item.start_time).format('yyyy-MM-dd')}<span style={{ marginLeft: 10, }}>{new Date(item.start_time).format('hh:mm')}-{new Date(item.end_time).format('hh:mm')}</span></span>
				)
			} else {//跨天
				time = (
					<span style={{ color: '#262626' }}>{new Date(item.start_time).format('yyyy-MM-dd')} 至 {new Date(item.end_time).format('MM-dd')} {/*new Date(item.start_time).format('hh:mm')*/}</span>
				)
			}
			var address = item.address;
			return (
				<div style={styles.list_box} key={index} onClick={this.goToDetail.bind(this, item.code, item.offlineId, item.checkcode)}>
					<div style={{ width: devWidth - 89, marginLeft: 27, }}>
						<div style={styles.title}>{item.title}</div>
						<div style={{ ...styles.text, marginTop: 10 }}>举办时间<span style={{ marginLeft: 8 }}>{time}</span></div>
						<div style={{ ...styles.text, marginTop: 10, overflow: 'auto' }}>
							<span style={{ float: 'left' }}>举办地址</span>
							<div style={{ color: '#262626', marginLeft: 8, float: 'left', width: devWidth - 158 }}>
							{address && address.provincename ? address.provincename : ''} &nbsp;
							{address && address.cityname ? address.cityname : ''}&nbsp;
							{address && address.address ? address.address : ''}
							</div>
							</div>
						<div style={{ ...styles.text, marginTop: 10, overflow: 'auto' }}>
							<span style={{ float: 'left' }}>会场名称</span>
							<div style={{ color: '#262626', marginLeft: 8, float: 'left', width: devWidth - 158 }}>{address && address.site ? address.site : ''}&nbsp;{item.detail_place ? item.detail_place : ''}</div>
						</div>
					</div>
					<div style={{ backgroundColor: '#f3f7fa', height: 20, width: 340, marginTop: 5 }}>
						<img src={Dm.getUrl_img('/img/v2/pgCenter/coups_line@2x.png')} width={340} height={20} />
					</div>
					<div style={styles.ckCode}>
						<div style={styles.code_text}>参课券号：{item.checkcode}</div>
						<div style={styles.code}>
							<img src={Dm.getUrl_img('/img/v2/pgCenter/code@2x.png')} width={16} height={16} />
						</div>
					</div>
				</div>
			)
		})

		let alertProps = {
			alert_display: this.state.alert_display,
			alert_title: this.state.alert_title,
			isShow: this.state.isShow,
			errStatus: this.state.errStatus
		}

		return (
			<div style={styles.container}>
				<ResultAlert {...alertProps} />
				<Link to={`${__rootDir}/PgOfflineReserveEnrollList`}>
					<div style={styles.topbg}>
						<div style={{ marginLeft: 18, display: 'flex', width: devWidth - 20, color: Common.Bg_White, height: 30, alignItems: 'center' }}>全部线下课参课信息请至“我-线下课”中查看</div>
						<span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginRight: 20 }}>
							<img src={Dm.getUrl_img('/img/v2/pgCenter/coups_more@2x.png')} width={6} height={11} />
						</span>
					</div>
				</Link>
				<div style={{ paddingBottom: 15, height: devHeight - 45, backgroundColor: '#f3f7fa', overflowY: 'auto', }}>
					{this.state.list_data.length > 0 ?
						list
						:
						listNull
					}
				</div>
			</div>
		)
	}
}

var styles = {
	container: {
		width: devWidth,
		height: devHeight,
	},
	topbg: {
		backgroundColor: Common.Activity_Text,
		height: 30,
		width: devWidth,
		color: Common.Bg_White,
		fontSize: Fnt_Small,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		fontFamily: 'pingfangsc-regular'
	},
	list_box: {
		width: 340,
		marginLeft: (devWidth - 340) / 2,
		marginTop: 20,
		backgroundColor: Common.Bg_White,
		padding: '15px 0',
		borderRadius: 10,
		boxShadow: '0 2px 5px 0 rgba(215,232,245,0.60)',
	},
	title: {
		fontSize: Fnt_Medium,
		color: Common.Black,
		lineHeight: '20px',
	},
	text: {
		fontSize: Fnt_Normal,
		color: '#c0c0c0'
	},
	ckCode: {
		display: 'flex',
		flexDirection: 'row',
		height: 20,
		alignItems: 'center',
		marginTop: 8,
	},
	code_text: {
		fontSize: Fnt_Normal,
		color: Common.orange,
		width: devWidth - 16,
		marginLeft: 27
	},
	code: {
		width: 16,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginRight: 40,
	}

}

export default Coupons;
