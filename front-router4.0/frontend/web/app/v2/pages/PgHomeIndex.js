/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import { Link } from 'react-router-dom';
// import Swiper from 'react-native-swiper';
import HomeOnlineItem from '../components/HomeOnlineItem';
import Dm from '../util/DmURL'
import PgBottomMeun from '../components/PgBottomMeun';
import Carousel from '../components/Carousel'
import LoadFailure from '../components/LoadFailure'
import Guide from '../components/Guide'
import Common from '../Common'
import { NONAME } from 'dns';
import maskStyle from '../components/maskStyle';

var countdown, addressIcon
var addressComponents //定义一个全局变量去获取百度地图返回到 对象
var t;
function DataLength(fData) {
	var intLength = 0
	for (var i = 0; i < fData.length; i++) {
		if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255))
			intLength = intLength + 2
		else
			intLength = intLength + 1
	}
	return intLength
}

class PgHomeIndex extends React.Component {
	constructor(props) {
		super(props);
		this.id = ''
		this.pageName = "PgHomeIndex"
		this.wx_config_share_home = {
			title: '铂略咨询-财税领域实战培训供应商',
			desc: '企业财务管理培训,财务培训课程,税务培训课程',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link'
		};
		this.state = {
			listHeight: devHeight - 42.5,
			alreadyLive: [],
			firstLessonCount: {},
			first_online_lessons: [],
			secondLessonCount: {},
			second_online_lessons: [],
			thirdLessonCount: {},
			third_online_lessons: [],
			question: [],
			CarouselData: [], //轮播图数组,
			CarouselTop: 40, //首页轮播图的Top
			CarouselDisplay: 'block',
			CarouselSearch: '',
			CarouselOpc: 0.3,
			CarouselSearchTop:40,
			searchIuput: '#ffffff',
			spanColor: '#ffffff',
			leaveTop: 0,
			address: '',//定位城市默认为全国
			addressDisplay: true,
			SubSites: [], //SubSites接口返回的值
			addressIconWidth: 12, //定位图标的宽度
			addressIconHeight: 14,//定位图标的高度
			req_err: false,
			addressWidth: 80,
			firstIcons: [],
			secondIcons: [],
			thirdIcons: [],
			offlineList: [],
			offlineCodeToday: {},
			codeDetail: {},
			offlineInfo: {},
			DownLoadAppDisplay:'block',//打开App浮层状态
			showBindPhone:false //是否显示绑定手机号浮层
			
		};
	}

	_handleindexDone(re) {
		console.log('===HomeIndex==', re);
		if (re.err) {
			return false;
		}
		if (re.result) {
			var result = re.result
			this.setState({
				// data: this.data.concat(re.result),
				reservedLives: re.reservedLives || [],
				alreadyLive: result.alreadyLive || [],
				firstLessonCount: result.firstLessonCount || {},
				first_online_lessons: result.first_online_lessons || [],
				secondLessonCount: result.secondLessonCount || {},
				second_online_lessons: result.second_online_lessons || [],
				thirdLessonCount: result.thirdLessonCount || {},
				third_online_lessons: result.third_online_lessons || [],
				offlineList: result.offlineList || [],
				question: result.question || [],
				offlineCodeToday: result.offlineCodeToday,
				codeDetail: result.offlineCodeToday && result.offlineCodeToday.codeDetail ? result.offlineCodeToday.codeDetail : {},
				offlineInfo: result.offlineCodeToday && result.offlineCodeToday.offlineInfo ? result.offlineCodeToday.offlineInfo : {},

			})
		}
		if (re.user && re.user.hintBindPhone) {
			this.setState({
				showBindPhone : true  //(true 需要提示 / false 不需要提示) 
			}) 
		} 
	}
	_labelScorll(re) {
		// alert('re',re)
		// console.log('this.lessonList.scrollTop',this.lessonList.scrollTop);
		// var isAppClosed = sessionStorage.getItem('userClosed') ? true : false
		var date1 = localStorage.getItem("DownloadAppTime")
		var date2 = Date.now();
		if (!this.lessonList) {
			return
		}
		if (this.lessonList.scrollTop == 0) {
			// app打开时存在app下载浮层搜索栏据顶部距离
			if ((date2 - date1) >= (60 * 60 * 1000)) {
				this.setState({
					CarouselDisplay: 'block',
					CarouselTop:40,
					CarouselSearch: '',
					CarouselOpc: 0.3,
					CarouselSearchTop:40,
					searchIuput: '#ECEAEA',
					spanColor: '#ffffff',
					leaveTop: 0,
					addressDisplay: true,
					DownLoadAppDisplay:'block',
					
				})
				EventCenter.emit('toggleDownLoadAppDisplay',this.state.DownLoadAppDisplay)
			}else {
				this.setState({
					CarouselDisplay: 'block',
					CarouselTop:0,
					CarouselSearch: '',
					CarouselOpc: 0.3,
					CarouselSearchTop:0,
					searchIuput: '#ECEAEA',
					spanColor: '#ffffff',
					leaveTop: 0,
					addressDisplay: true,
					
				})
			}
			
		} else if (this.lessonList.scrollTop !== 0 && this.state.CarouselDisplay == 'block') {
			this.setState({
				CarouselDisplay: 'none',
				CarouselTop:0,
				CarouselSearch: 'true',
				CarouselOpc: 0.8,
				CarouselSearchTop:0,
				searchIuput: '#DCDCDC',
				spanColor: '#666666',
				leaveTop: 1,
				addressDisplay: true,
				DownLoadAppDisplay:'none',
			})
			EventCenter.emit('toggleDownLoadAppDisplay',this.state.DownLoadAppDisplay)
		}		
		
	}
	_handletopicDone(re) {
		var result = re.result || []
		// console.log('_handletopicDone',result);
		this.setState({
			CarouselData: result
		})

	}
	_handlegetSubSitesDone(re) {
		// console.log('_handlegetSubSitesDone',re);
		var result = re.result || []
		this.setState({
			SubSites: result
		})
		var baiduCity = addressComponents.city //获取百度返回的城市
		var baiduProvince = addressComponents.province //获取百度返回的省
		if (baiduCity.charAt(baiduCity.length - 1) == '市') {//判断如果百度返回的市后面有市则去掉
			baiduCity = baiduCity.substring(0, baiduCity.length - 1)
		}
		if (baiduCity.charAt(baiduCity.length - 1) == '站') {//判断如果百度返回的市后面有市则去掉
			baiduCity = baiduCity.substring(0, baiduCity.length - 1)
		}
		if (baiduProvince.charAt(baiduProvince.length - 1) == '省') {//判断百度返回的省后面有省则去掉
			baiduProvince = baiduProvince.substring(0, baiduProvince.length - 1)
		}
		if (baiduProvince.charAt(baiduProvince.length - 1) == '市') {//判断如果百度返回的市后面有市则去掉
			baiduProvince = baiduProvince.substring(0, baiduProvince.length - 1)
		}
		// var dWTime =  new Date().format("yyyy-MM-dd hh:mm")+''
		localStorage.setItem("dWTime", Date.now())
		for (var key of result) { //把接口中城市取出来循环对比
			var cities = key.cities || [] //定义需要匹配城市数组
			var province = key.province || '' //定义需要匹配的省
			var defaultCity = key.defaultCity || ''
			if (cities.length > 0) {//城市循环对比
				for (var city of cities) {
					if (city.charAt(city.length - 1) == '站') {//判断如果百度返回的市后面有市则去掉
						city = city.substring(0, city.length - 1)
					}
					if (city == baiduCity) {
						this.setState({
							address: key.name,
							addressIconWidth: 12,
							addressIconHeight: 14,
						}, () => {
							clearInterval(addressIcon)
							var pp = DataLength(this.state.address)
							if (pp > 6) {
								var addressWidth = this.state.addressWidth || 80
								var newCount = (pp - 6)
								this.setState({
									addressWidth: this.state.addressWidth + (newCount * 6)
								})
							}
						})
						isCityReaold = true
						localStorage.setItem("addressName", key.name)
						// localStorage.setItem("cityProvince",province)
						localStorage.setItem("citydefaultCity", defaultCity)
						return //如果成功则return
					}
				}
			} else {//如果cities城市为空，则对比省
				if (province.charAt(province.length - 1) == '站') {//判断如果百度返回的市后面有市则去掉
					province = province.substring(0, province.length - 1)
				}
				// console.log('province===',province);
				if (province == baiduProvince) {
					this.setState({
						address: key.name,
						addressIconWidth: 12,
						addressIconHeight: 14,
					}, () => {
						clearInterval(addressIcon)
						var pp = DataLength(this.state.address)
						if (pp > 6) {
							var addressWidth = this.state.addressWidth || 80
							var newCount = (pp - 6)
							this.setState({
								addressWidth: this.state.addressWidth + (newCount * 6)
							})
						}
					})
					isCityReaold = true
					localStorage.setItem("addressName", key.name)
					localStorage.setItem("citydefaultCity", defaultCity)
					return
				}
			}
		}
	}

	_handeleIndexTimeout() {
		this.setState({//因为地图引起的暂时先隐掉
			// req_err:true,
		})
	}

	changeAddressIcon() {
		if (this.state.addressIconWidth == 6 || this.state.addressIconHeight == 7) {
			this.setState({
				addressIconWidth: 12,
				addressIconHeight: 14,
			})
		} else {
			this.setState({
				addressIconWidth: 6,
				addressIconHeight: 7,
			})
		}

	}

	// 处理打开app浮层显隐及搜索栏置顶
	changeDownLoadAppDisplay() {
		if(!this.lessonList){
			return
		}
		//判断用户是否关闭 打开app浮层
		var isCloseApp = sessionStorage.getItem('userClosed') ? true : false
		if(isCloseApp){
			// console.log('app closed')
			//用户已关闭打开App浮层
			if(this.lessonList.scrollTop == 0){
				this.setState({
					CarouselSearch: '',
				})
			} else{
				this.setState({
					CarouselSearch: true,
				})
			}			
		} else{
			// console.log('app not closed')
			// 用户未关闭浮层
			if(this.lessonList.scrollTop == 0){
					// console.log(this.lessonList.scrollTop)
					this.setState({
						CarouselTop: 40,
						CarouselSearchTop: 40,
						DownLoadAppDisplay:'block',
					})
					console.log(1234)
					EventCenter.emit('toggleDownLoadAppDisplay',this.state.DownLoadAppDisplay)
				}else if(this.lessonList.scrollTop !== 0 && this.state.CarouselDisplay == 'block'){
					// console.log(this.lessonList.scrollTop)
					this.setState({
						CarouselTop: 0,
						CarouselSearchTop: 0,
						DownLoadAppDisplay:'none',
					})
					console.log(12345)

					EventCenter.emit('toggleDownLoadAppDisplay',this.state.DownLoadAppDisplay)
				}

		}

		

	}
	// 获取打开App浮层的显隐
	_handlegetDownLoadAppDisplay(re){
		// console.log('---------32424', re);
	}

	componentWillMount() {

		// if(this.props.location.state.pullRefresh == 'pullRefresh'){
		//   t = setTimeout(function(){
		//     window.location.reload()
		//   },10)
		// }

		// 监听DownLoadApp组件display状态
		// console.log('33333')
		this.getDownLoadAppDisplay = EventCenter.on('getDownLoadAppDisplay',this._handlegetDownLoadAppDisplay.bind(this))
		// console.log('4444')

		var addressName = localStorage.getItem("addressName")
		// console.log('componentWillMount',addressName);
		var date1 = localStorage.getItem("dWTime")
		var date2 = Date.now();

		var cityNum = 0
		if (addressName === null || !isCityReaold) {
			// console.log('minutes',(date2 - date1));
			if ((date2 - date1) < (60 * 60 * 1000 * 24)) { //判读如果当前页面为活动页面，则不去定位。
				this.setState({
					address: addressName
				}, () => {
					isCityReaold = true
					var pp = DataLength(this.state.address)
					if (pp > 6) {
						var addressWidth = this.state.addressWidth || 80
						var newCount = (pp - 6)
						this.setState({
							addressWidth: this.state.addressWidth + (newCount * 6)
						})
					}
				})
				return
			}
			addressIcon = setInterval(()=> {//定位如果没有完成 图标的动画
				this.changeAddressIcon() //图标动画的效果
				if (cityNum == 10) {
					this.setState({
						addressIconWidth: 12,
						addressIconHeight: 14,
					})
					isCityReaold = true
					clearInterval(addressIcon)
				}
				cityNum = cityNum + 1
			}, 500);
			setTimeout(function () {
				//百度地图API功能
				var map = new BMap.Map("allmap");
				var point = new BMap.Point(116.331398, 39.897445);
				map.centerAndZoom(point, 12);
				var geoc = new BMap.Geocoder();
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function (r) {
					var pt = r.point
					geoc.getLocation(pt, function (rs) {
						var addComp = rs.addressComponents;
						var city = addComp.city
						addressComponents = addComp;
						Dispatcher.dispatch({//发送请求获取定位城市
							actionType: 'getSubSites',
						})
						localStorage.setItem("headersCity", city || '')
						console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
					});
				}, { enableHighAccuracy: true })
			}, 200);
		} else {
			this.setState({
				address: addressName
			}, () => {
				isCityReaold = true
				var pp = DataLength(this.state.address)
				if (pp > 6) {
					var addressWidth = this.state.addressWidth || 80
					var newCount = (pp - 6)
					this.setState({
						addressWidth: this.state.addressWidth + (newCount * 6)
					})
				}
			})
		}


	}
	_handleindexIconDone(re) {
		// console.log('_handleindexIconDone----',re);
		var result = re.result
		if (re.err) {
			return
		}
		this.setState({
			firstIcons: result.firstIcons || [],
			secondIcons: result.secondIcons || [],
			thirdIcons: result.thirdIcons || [],
		})
	}
	_hideBindPhoneAlert(){
		this.setState({
		  showBindPhone:false
		})
	}
	_goToBindPhone(){
	  this.setState({
	    showBindPhone:false
	  },()=>{
	    // window.location =`${__rootDir}/BindPhoneNumber`
	    this.props.history.push({pathname:`${__rootDir}/BindPhoneNumber`,state:{isFirst:true}});
	  })
	  // this.props.history.push(`${__rootDir}/offlineToExamine`)
	}
	componentDidMount() {
		// alert('componentDidMount---------')
		EventCenter.emit("SET_TITLE", '铂略财课-首页')
		this._getindexDone = EventCenter.on('indexDone', this._handleindexDone.bind(this))
		this._gettopicDone = EventCenter.on('topicDone', this._handletopicDone.bind(this))
		this._getgetSubSites = EventCenter.on('getSubSitesDone', this._handlegetSubSitesDone.bind(this))
		this.e_IndexTimeout = EventCenter.on('IndexTimeout', this._handeleIndexTimeout.bind(this));
		this._getindexIconDoneDone = EventCenter.on('indexIconDone', this._handleindexIconDone.bind(this))

		//localStorage.setItem("citydefaultCity",this.state.defaultCity)
		var _defaultCity = localStorage.getItem("citydefaultCity");
		console.log('_defaultCity:', _defaultCity);

		Dispatcher.dispatch({
			actionType: 'index',
			cityName: encodeURI(_defaultCity)
		})
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		Dispatcher.dispatch({
			actionType: 'Topic',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		countdown = setInterval(()=> {
			this._labelScorll()
		}, 10);

		// 监听页面滚动
		// this.lessonList.addEventListener('scroll',this.changeDownLoadAppDisplay.bind(this))		
	}
	componentWillUnmount() {
		this._getindexDone.remove()
		this._gettopicDone.remove()
		this._getgetSubSites.remove()
		this.e_IndexTimeout.remove()
		this._getindexIconDoneDone.remove()
		clearInterval(countdown); //离开页面的时候把定时器关掉
		clearInterval(addressIcon)

		this.getDownLoadAppDisplay.remove()
	}
	goToCity(e) {
		// <Link to={{  }}>
		// console.log('isCityReaold===',this.props);
		if (isCityReaold) {
			this.props.history.push({ pathname: `${__rootDir}/PgChooseCity`, query: null, state: { SubSites: this.state.SubSites, addressComponents: addressComponents, address: this.state.address } })
		}
	}

	goToDetail() {
		if (this.state.codeDetail.code) {
			this.props.history.push({ pathname: `${__rootDir}/PgOfflineJoinCodeDetail/${this.state.codeDetail.code}` })
		} else {
			this.props.history.push({ pathname: `${__rootDir}/PgOfflineJoinDetail/${this.state.codeDetail.resource_id}/${this.state.codeDetail.checkcode}` })
		}
	}

	render() {
		// console.log('addressDisplay：',this.state.addressDisplay);
		let w_width = devWidth
		var firstLessonCount = this.state.firstLessonCount || {};//获取第一阶段视频课count
		var secondLessonCount = this.state.secondLessonCount || {};
		var thirdLessonCount = this.state.thirdLessonCount || {};
		var first_online_lessons = {
			data: this.state.first_online_lessons || []
		}
		var second_online_lessons = {
			data: this.state.second_online_lessons || []
		}
		var third_online_lessons = {
			data: this.state.third_online_lessons || []
		}

		//直播课
		var live = this.state.alreadyLive.map((item, index) => {

			var start_date = new Date(item.start_time).format("yyyy-MM-dd")
			var date_text = '';
			if (start_date == new Date().format("yyyy-MM-dd")) {
				date_text = '今天';
			}
			else {
				date_text = start_date;
			}

			var start_time = new Date(item.start_time).format("hh:mm");
			var end_time = new Date(item.end_time).format("hh:mm");

			var status
			var border_color
			var font_color
			var reserved
			var imgStatus

			if (this.state.reservedLives && this.state.reservedLives.length > 0) {
				this.state.reservedLives.map((rows, idx) => {
					if (rows.id == item.id) {
						reserved = item.id
					}
				})
			}
			if (item.status == 0) {//尚未开始
				imgStatus = (
					<div style={{ ...styles.img_status, ...styles.orange_status }}>
						{/*<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_notStarted@2x.png')} />*/}
						<span style={styles.text_orange}>尚未开始</span>
					</div>
				)
			}
			else if (item.status == 1) {//正在直播
				imgStatus = (
					<div style={styles.img_status}>
						{/*<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_starting@2x.png')} />*/}
						<span style={styles.text_blue}>正在直播</span>
					</div>
				)
			}
			else if (item.status == 2) {//直播结束
				imgStatus = (
					<div style={{ ...styles.img_status, }}>
						{/*  <span style={styles.text_white}>直播结束</span>*/}
						<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_started@2x.png')} />
					</div>
				)
			}
			else if (item.status == 3) {//即将开始
				imgStatus = (
					<div style={{ ...styles.img_status, ...styles.green_status }}>
						{/*<span style={styles.text_green}>即将开始</span>*/}
						<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_start@2x.png')} />
					</div>
				)
			}

			if (item.live_status == 1) {
				status = '直播中'
				border_color = font_color = '#2196f3'
			} else if (item.live_status == 2) {
				status = '已结束'
				border_color = font_color = '#999'
			} else if (item.live_status == 0) {
				if (item.id == reserved) {
					status = '已预约'
					border_color = font_color = '#7ed321'
				} else {
					status = '预约'
					border_color = font_color = '#f37633'
				}
			}
			return (
				<Link to={`${__rootDir}/lesson/live/${item.id}`} key={index} >

					<div style={{ ...styles.liveDiv }}>
						<div style={{ width: 110, height: 70, float: 'left', marginRight: 10, position: 'relative' }}>
							<img src={item.brief_image ? item.brief_image : Dm.getUrl_img('/img/v2/icons/course_default.jpg')} width="110" height="70" />
							{imgStatus}
							<div style={{ ...styles.imgBlack, width: 110 }}>
							</div>
						</div>
						<div style={{ height: 96, width: devWidth - 144, float: 'left' }}>
							<div style={{ ...styles.LineClamp, WebkitLineClamp: 2, width: devWidth - 144, height: 36, lineHeight: '18px', fontSize: 14, color: '#000' }}>
								{item.title}
							</div>
							<div style={{ width: devWidth - 144, marginTop: 9 }}>
								<div style={{ fontSize: 12, color: '#999', float: 'left', marginTop: 2 }}>
									{date_text} {start_time}-{end_time}
								</div>
								<div style={{ float: 'right', fontSize: 12, textAlign: 'center', border: '1px solid', borderColor: border_color, color: font_color, borderRadius: 100, width: 60, height: 22, lineHeight: '22px' }}>{status}</div>
							</div>
						</div>
					</div>
				</Link>
			)
		})

		//线下课
		var offlineList = this.state.offlineList.map((item, index) => {
			var start_date = new Date(item.start_time).format("yyyy-MM-dd")
			var start_time = new Date(item.start_time).format("MM-dd");
			var end_time = new Date(item.end_time).format("MM-dd");
			var _date = ''
			//判断是否是同一天
			if (start_time == end_time) {//同一天
				_date = (
					<span>
						{start_date}&nbsp;&nbsp;&nbsp;{new Date(item.start_time).format("hh:mm")}-{new Date(item.end_time).format("hh:mm")}
					</span>
				)
			}
			else {//跨天
				_date = (
					<span>
						{start_date} 至 {new Date(item.end_time).format("MM-dd")}
					</span>
				)
			}

			var status = ''
			var border_color = ''
			var font_color = ''
			var imgStatus = ''

			//报名，即未报名
			if (item.isEnroll == 0) {
				if (item.hasOverdue != 1) {
					status = '查看';
					border_color = font_color = '#2196f3'
				}
				else {//报名
					status = '报名';
					border_color = font_color = '#f37633'
				}
			} else {//已报名
				status = '已报名'
				border_color = font_color = '#2196f3'
			}

			switch (item.hasOverdue) {
				case 1:
					// statuText = '正在报名';
					// statuColor = '#F37633';
					imgStatus = (
						<div style={styles.img_status}>
							{/*<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_signUp@2x.png')} />*/}
							<span style={styles.text_blue}>正在报名</span>
						</div>
					)
					break;
				case 2:
					// statuText = '报名已满';
					// statuColor = '#0097FA';
					imgStatus = (
						<div style={{ ...styles.img_status, ...styles.orange_status }}>
							<span style={styles.text_orange}>报名已满</span>
							{/*<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_signFull@2x.png')} />*/}
						</div>
					)
					break;
				case 3:
					// statuText = '课程结束';
					// statuColor = '#999999';
					imgStatus = (
						<div style={{ ...styles.img_status }}>
							<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_end@2x.png')} />
							{/*  <span style={styles.text_white}>课程结束</span>*/}
						</div>
					)
					break;
				case 4:
					// statuText = '报名截止';
					// statuColor = '#ff0000';
					imgStatus = (
						<div style={{ ...styles.img_status, ...styles.pink_status }}>
							<span style={styles.text_pink}>报名截止</span>
							{/*<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_signDone@2x.png')} />*/}
						</div>
					)
					break;
			}

			return (
				<Link to={`${__rootDir}/lesson/offline/${item.id}`} key={index} >
					<div style={{ ...styles.liveDiv }}>
						<div style={{ width: 110, height: 70, float: 'left', marginRight: 10, position: 'relative' }}>
							<img src={item.brief_image ? item.brief_image : Dm.getUrl_img('/img/v2/icons/course_default.jpg')} width="110" height="70" />
							{imgStatus}
							<div style={{ ...styles.imgBlack, width: 110 }}>
							</div>
						</div>
						<div style={{ height: 96, width: devWidth - 144, float: 'left' }}>
							<div style={{ ...styles.LineClamp, WebkitLineClamp: 2, fontSize: 14, color: '#000', width: devWidth - 144, height: 36, lineHeight: '18px' }}>
								{item.title}
							</div>
							<div style={{ marginTop: 9, width: devWidth - 144, }}>
								<div style={{ fontSize: 12, color: '#999', float: 'left', marginTop: 2 }}>
									{_date}
								</div>
								<div style={{ float: 'right', fontSize: 12, textAlign: 'center', border: '1px solid', borderColor: border_color, color: font_color, borderRadius: 100, width: 60, height: 22, lineHeight: '22px' }}>{status}</div>
							</div>
						</div>
					</div>

				</Link>
			)
		})


		var question = this.state.question.map((item, index) => {
			var user = item.user
			var dis
			if (index == 0) {
				dis = 'block'
			} else {
				dis = 'none'
			}
			return (
				<Link to={`${__rootDir}/QaDetail/${item.id}`} key={index}>
					<div style={{ ...styles.questionDiv, height: 60 }} >
						<div style={{ width: 30, height: 30, marginRight: 9, marginLeft: 14, backgroundColor: '#ffffff', float: 'left' }}>
							<img style={{ borderRadius: 100 }} src={user.photo} height="30" width="30" />
						</div>
						<div style={{ float: 'left', width: devWidth - 78 }}>
							<div style={{ ...styles.LineClamp, fontSize: 12, color: '#999999', width: devWidth - 78, WebkitLineClamp: 1 }}>
								{user.nick_name}
							</div>
							<div dangerouslySetInnerHTML={{ __html: item.title }} style={{ ...styles.LineClamp, fontSize: 14, color: '#333333', width: devWidth - 78, WebkitLineClamp: 2 }}>
							</div>
						</div>
						{/*<img src={Dm.getUrl_img(`/img/v2/icons/more@2x.png`)} style={{float: 'right', width: 11, height: 17, position: 'relative', top: 25}}/>*/}
					</div>
					<hr style={{ height: 1, border: 'none', backgroundColor: '#f3f3f3', marginTop: 12, display: dis }}></hr>
				</Link>
			)
		})

		//今日参课提醒
		var time = '';
		if (this.state.offlineInfo.isSameDay) {//同一天
			time = (
				<span>
					{this.state.offlineInfo.start_time && this.state.offlineInfo.end_time ?
						<span style={{ color: '#262626' }}>
							{new Date(this.state.offlineInfo.start_time).format('yyyy-MM-dd')}
							<span style={{ marginLeft: 10, }}>{new Date(this.state.offlineInfo.start_time).format('hh:mm')}-{new Date(this.state.offlineInfo.end_time).format('hh:mm')}</span>
						</span>
						:
						null
					}
				</span>
			)
		} else {//跨天
			time = (
				<span style={{ color: '#262626' }}>
					{this.state.offlineInfo.start_time && this.state.offlineInfo.end_time ?
						<span>{new Date(this.state.offlineInfo.start_time).format('yyyy-MM-dd')} 至 {new Date(this.state.offlineInfo.end_time).format('MM-dd')}
						</span>
						:
						null
					}
				</span>
			)
		}

		var provincename, cityName, address, site, detail_place;
		provincename = this.state.offlineInfo && this.state.offlineInfo.address && this.state.offlineInfo.address.provincename ? this.state.offlineInfo.address.provincename : '';
		cityName = this.state.offlineInfo && this.state.offlineInfo.address && this.state.offlineInfo.address.cityname ? this.state.offlineInfo.address.cityname : '';
		address = this.state.offlineInfo && this.state.offlineInfo.address && this.state.offlineInfo.address.address ? this.state.offlineInfo.address.address : ''
		site = this.state.offlineInfo && this.state.offlineInfo.address && this.state.offlineInfo.address.site ? this.state.offlineInfo.address.site : '';
		detail_place = this.state.offlineInfo && this.state.offlineInfo.address && this.state.offlineInfo.address.detail_place ? this.state.offlineInfo.address.detail_place : '';



		return (
			
			<div style={{ width: devWidth, height: devHeight}}>
				<div style={{display:this.state.showBindPhone ? 'block' : 'none'}}>
					<div style={{...maskStyle.msk,display:this.state.showBindPhone ? 'block':'none'}} onClick={this._hideBindPhoneAlert.bind(this)}></div>
					<div style={{...maskStyle.white_alert,width:275,height:231,top:'50%',left:'50%',margin:'-125px 0 0 -137.5px',paddingTop:-1,display:this.state.showBindPhone ? 'block':'none'}}>
						<div style={{marginTop:20,fontSize:Fnt_Medium,color:'#030303',fontWeight:'bold'}}>为了您的账号安全，请绑定手机</div>
						<div style={{margin:'5px 21px 0',fontSize:12,textAlign:'left',lineHeight:'16px'}}>
							<div style={{color:'#030303',lineHeight:'20px'}}>绑定手机的两大理由：</div>
							<div style={{color:Common.Black}}>1.根据国家网络信息办公室规定，自2016年8月1日起，互联网注册用户应当提供基于手机号码等方式的真实身份信息。
							<div style={{marginTop:8}}>2.即使您忘记了账号和密码，仍能使用绑定的手机进行免密登录，学习不受影响</div></div>
						</div>
						<div style={{...maskStyle.alert_bottom,width:275}}>
							<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:Fnt_Medium,color:Common.Gray}} onClick={this._hideBindPhoneAlert.bind(this)}>跳过
							</div>

							<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Activity_Text}} onClick={this._goToBindPhone.bind(this)}>
								立即绑定手机
							</div>
						</div>
					</div>
				</div>
				{
					this.state.req_err ?
						<LoadFailure />
						:
						<div
							onTouchEnd={() => {
								this._labelScorll(this.lessonList)
							}}
							style={{ height: devHeight - 50, display: 'flex', flexDirection: 'column' }}>
							<div style={{ ...styles.div, overflowY: 'scroll' }} ref={(lessonList) => this.lessonList = lessonList}>
								<div style={{ height: 290, width: '100%', backgroundColor: '#ffffff' ,lineHeight:1}}>
									{/* <div style={{ ...styles.menceng, display: this.state.addressDisplay ? 'block' : 'none' }}></div>
									<div onClick={this.goToCity.bind(this)} style={{ ...styles.addressDiv, display: this.state.addressDisplay ? 'block' : 'none', width: this.state.addressWidth }}>
										<div style={{ width: 12, height: 14, float: 'left', marginRight: 8, marginTop: 7 }}>
											<img src={Dm.getUrl_img('/img/v2/icons/home_address@2x.png')} width={this.state.addressIconWidth} height={this.state.addressIconHeight} />
										</div>
										<div style={{ float: 'left', marginTop: 4 }}>
											<span style={{ fontSize: 12, color: '#ffffff' }}>{this.state.address || '全国站'}</span>
											<img style={{ marginLeft: 8 }} src={Dm.getUrl_img('/img/v2/icons/Triangledown@2x.png')} width="8" height="6" />
										</div>
									</div>
									<Link to={`${__rootDir}/PgSearchResult`}>
										<div style={{ marginTop: 3, position: 'absolute', zIndex: 1200, backgroundColor: '#ffffff', opacity: 0.6 }}>
											<span style={{ ...styles.input, width: devWidth * 0.59, left: this.state.addressDisplay ? 145 + (this.state.addressWidth - 80 > 0 ? this.state.addressWidth - 80 : 0) : 50 }}>输入您想了解的内容</span>
										</div>
									</Link>									
									
									<div style={{ ...styles.opacity_box, display: this.state.addressDisplay ? 'none' : 'block' }}>
									</div>

									<div style={{ ...styles.inputDiv, backgroundColor: this.state.searchIuput, opacity: 0.7, width: this.state.addressDisplay ? devWidth - 120 - (this.state.addressWidth - 80) : devWidth - 30, }}>
										<div style={{ float: 'left', marginLeft: 16, marginTop: 8, marginRight: 10, opacity: 1 }}>
											<img src={Dm.getUrl_img('/img/v2/icons/search.png')} />
										</div>
									</div> */}
									{/* 页面定位与搜索框位置 */}
									<div id='search-bar' style={{width:'100%',height:44,position:'absolute',top:this.state.CarouselSearchTop,zIndex:999,}}>
										{
											this.state.firstIcons.length >=5 ?
											<div style={{ ...styles.menceng, backgroundColor:'#AF0000',display: this.state.CarouselSearchTop === 0 && this.state.CarouselSearch ? 'block' : 'none' }}></div>
											:
											<div style={{ ...styles.menceng,  backgroundImage:'linear-gradient(-90deg, #27CFFF 0%, #2AA6FF 99%)',display: this.state.CarouselSearchTop === 0 && this.state.CarouselSearch ? 'block' : 'none' }}></div>			
										}
										<div style={{ ...styles.menceng, display: this.state.CarouselSearchTop === 0 && this.state.CarouselSearch ? 'block' : 'none' }}></div>
										<div onClick={this.goToCity.bind(this)} style={{ ...styles.addressDiv, textShadow:this.state.CarouselSearchTop === 0 && this.state.CarouselSearch ? '':'0 1px 2px rgba(0,0,0,0.80)', width: this.state.addressWidth }}>
											<div style={{width: 12, height: 14, float: 'left', marginRight: 8, marginTop: 7}}>
												<img src={Dm.getUrl_img('/img/v2/icons/home_address@2x.png')} width={this.state.addressIconWidth} height={this.state.addressIconHeight} />
											</div>
											<div style={{ float: 'left',  marginTop: 6 }}>
												<span style={{ fontSize: 12, color: '#ffffff' }}>{this.state.address || '全国站'}</span>
												<img style={{ marginLeft: 8 ,}} src={Dm.getUrl_img('/img/v2/icons/Triangledown@2x.png')} width="8" height="6" />
											</div>
										</div>
										<Link to={`${__rootDir}/PgSearchResult`}>
											<div style={{ marginTop: 3, position: 'absolute', zIndex: 1200,right:'13px',width:devWidth * 0.59,height:30  }}>
												<span style={{ ...styles.input, width: devWidth * 0.59,  marginLeft:10,}}>输入您想了解的内容</span>
											</div>
										</Link>	
										<div style={{ ...styles.inputDiv,  width: devWidth *0.69,  boxShadow:this.state.CarouselSearchTop === 0 && this.state.CarouselSearch ? '' :  '0 1px 2px 0 rgba(0,0,0,0.80)'  }}>
											<div style={{ float: 'left', marginLeft: 16, marginTop: 8, marginRight: 10, opacity: 1 }}>
												<img src={Dm.getUrl_img('/img/v2/icons/search.png')} />
											</div>
										</div>
										<div style={{...styles.gradientDiv,height: 44}}></div>
									</div>

									
									<div style={{ width: devWidth, height: 200, marginTop:this.state.CarouselTop}}>
										<Carousel CarouselDisplay={this.state.CarouselDisplay} CarouselData={this.state.CarouselData} isNerYear={this.state.firstIcons.length} />
									</div>
									<div style={{ height: this.state.firstIcons.length >=5? 80 :72, paddingTop: this.state.firstIcons.length >=5 ? 10 :18, width: devWidth - 30, marginLeft:this.state.firstIcons.length >=5 ? 12.5 : 15 ,lineHeight: 1, }}>
										<Link to={`${__rootDir}/list/online`}>

											<div style={{ float: 'left', width: this.state.firstIcons.length >=5 ? 50 :40, textAlign: 'center', marginRight: this.state.firstIcons.length >=5 ? (devWidth - 280) / 4 : (devWidth - 230) / 4 }}>
												{
													this.state.firstIcons.length >= 5 ?
														<div><img src={this.state.firstIcons[0].image}  height="56"  style={{display:'block'}}/></div>
														:
														<div><img src={Dm.getUrl_img('/img/v2/icons/home-online@2x.png')}  height="40" style={{display:'block'}}/></div>
												}
												<div><span style={{ fontSize: 12, color: '#333333' }}>视频</span></div>
											</div>
										</Link>
										<Link to={`${__rootDir}/list/live`}>
											<div style={{ float: 'left', width: this.state.firstIcons.length >=5 ? 50 :40, textAlign: 'center', marginRight: this.state.firstIcons.length >=5 ? (devWidth - 280) / 4 : (devWidth - 230) / 4}}>
												{
													this.state.firstIcons.length >= 5 ?
														<div><img src={this.state.firstIcons[1].image}  height="56" style={{display:'block'}}/></div>
														:
														<div><img src={Dm.getUrl_img('/img/v2/icons/home-liveinfo@2x.png')} height="40"  style={{display:'block'}}/></div>
												}
												<div><span style={{ fontSize: 12, color: '#333333' }}>直播</span></div>
											</div>
										</Link>
										<Link to={`${__rootDir}/list/offline`}>
											<div style={{ float: 'left', width: this.state.firstIcons.length >=5 ? 50 :40, textAlign: 'center', marginRight: this.state.firstIcons.length >=5 ? (devWidth - 280) / 4 : (devWidth - 230) / 4 }}>
												{
													this.state.firstIcons.length >= 5 ?
														<div><img src={this.state.firstIcons[2].image} height="56" style={{display:'block'}}/></div>
														:
														<div><img src={Dm.getUrl_img('/img/v2/icons/home-offline@2x.png')}  height="40" style={{display:'block'}}/></div>

												}
												<div><span style={{ fontSize: 12, color: '#333333' }}>线下</span></div>
											</div>
										</Link>
										<Link to={`${__rootDir}/PgProductList`}>
											<div style={{ float: 'left', width: this.state.firstIcons.length >=5 ? 50 :40, textAlign: 'center', marginRight: this.state.firstIcons.length >=5 ? (devWidth - 280) / 4 : (devWidth - 230) / 4}}>
												{
													this.state.firstIcons.length >= 5 ?
														<div><img src={this.state.firstIcons[3].image}  height="56" style={{display:'block'}}/></div>
														:
														<div><img src={Dm.getUrl_img('/img/v2/icons/home-product@2x.png')}  height="40" style={{display:'block'}}/></div>
												}
												<div><span style={{ fontSize: 12, color: '#333333' }}>专题</span></div>
											</div>
										</Link>
										<Link to={`${__rootDir}/TeacherCenter`}>
											<div style={{ float: 'left',width: this.state.firstIcons.length >=5 ? 50 :40,textAlign: 'center' }}>
												{
													this.state.firstIcons.length >= 5 ?
														<div><img src={this.state.firstIcons[4].image}  height="56" style={{display:'block'}}/></div>
														:
														<div><img src={Dm.getUrl_img('/img/v2/icons/home-teacher@2x.png')}  height="40" style={{display:'block'}}/></div>
												}
												<div><span style={{ fontSize: 12, color: '#333333' }}>讲师</span></div>
											</div>
										</Link>
									</div>
								</div>


								<div style={{ width: '100%', backgroundColor: '#ffffff', marginTop: 10, paddingBottom: 20, display: this.state.offlineCodeToday ? 'block' : 'none' }}>




									<div>
										<div style={{ ...styles.titleDiv }}>
											{
												this.state.secondIcons.length > 0 ?
													<div style={{ ...styles.logoColor }}></div>
													:
													<div style={{ ...styles.divColor }}></div>
											}
											<div style={styles.bigTitle}>今日参课提醒</div>
										</div>
										<div style={{ ...styles.list_box, }} onClick={this.goToDetail.bind(this)}>
											<div style={styles.code_top}>
											</div>
											<div style={{ ...styles.contentBg }}>
												<div style={{ marginLeft: 27 }}>
													<div style={styles.title}>{this.state.offlineInfo.title}</div>
													<div style={{ ...styles.text, marginTop: 10 }}>举办时间<span style={{ marginLeft: 8 }}>{time}</span></div>
													<div style={{ ...styles.text, marginTop: 10, overflow: 'auto' }}>
														<span style={{ float: 'left' }}>举办地址</span>
														<div style={{ color: '#262626', marginLeft: 8, float: 'left', width: devWidth - 158 }}>
															{provincename}&nbsp;
														{cityName}&nbsp;
														{address}
														</div>
													</div>
													<div style={{ ...styles.text, marginTop: 10, overflow: 'auto' }}>
														<span style={{ float: 'left' }}>会场名称</span>
														<div style={{ color: '#262626', marginLeft: 8, float: 'left', width: devWidth - 158 }}>
															{site}&nbsp;{detail_place}
														</div>
													</div>
												</div>
												</div>
												<div style={styles.lineBg}></div>
												<div style={styles.ckCode}>
													<div style={styles.code_text}>参课券号：{this.state.codeDetail && this.state.codeDetail.checkcode ? this.state.codeDetail.checkcode : ''}</div>
													<div style={styles.code}>
														<img src={Dm.getUrl_img('/img/v2/pgCenter/code@2x.png')} width={16} height={16} />
													</div>
												</div>

											</div>
									
									</div>
									<div>
									</div>
								</div>


								{this.state.alreadyLive && this.state.alreadyLive.length > 0 ?
									<div style={{ width: '100%', backgroundColor: '#ffffff', marginTop: 10, paddingBottom: 20, overflow: 'hidden' }}>
										<Link to={`${__rootDir}/list/live`}>
											<div style={{ ...styles.titleDiv }}>
												{
													this.state.secondIcons.length >= 3 ?
														<div style={{ ...styles.logoColor }}></div>
														:
														<div style={{ ...styles.divColor }}></div>
												}
												<div style={styles.bigTitle}>
													最新直播
		            </div>
												<div style={{ float: 'right', marginTop: 12 }}>
													<span style={{ position: 'relative', fontSize: 12, color: '#999999', fontWeight: 'bold', marginRight: 7, display: this.state.secondIcons.length >= 3 ? 'none' : 'inline' }}>更多</span>
													{/*<img style={{position:'relative',top:2}} src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width="8" height="14"/>*/}
												</div>
											</div>
										</Link>
										<div>
											{live}
										</div>
									</div>
									:
									null
								}

								{this.state.offlineList && this.state.offlineList.length > 0 ?
									<div style={{ width: '100%', backgroundColor: '#ffffff', marginTop: 10, paddingBottom: 20 }}>
										<Link to={`${__rootDir}/list/offline`}>
											<div style={{ ...styles.titleDiv }}>
												{
													this.state.secondIcons.length >= 3 ?
														<div style={{ ...styles.logoColor }}></div>
														:
														<div style={{ ...styles.divColor }}></div>
												}
												<div style={styles.bigTitle}>
													线下课
								</div>

												<div style={{ float: 'right', marginTop: 12 }}>
													<span style={{ position: 'relative', fontSize: 12, color: '#999999', fontWeight: 'bold', marginRight: 7, display: this.state.secondIcons.length >= 3 ? 'none' : 'inline' }}>更多</span>
												</div>
												<div></div>
											</div>
										</Link>
										<div>
											{offlineList}
										</div>
									</div>
									:
									null
								}

								<div style={{ ...styles.onlineDiv, marginTop: 10, display: this.state.first_online_lessons.length > 0 ? 'block' : 'none' }}>
									<Link to={`${__rootDir}/list/online`}>
										<div style={{ ...styles.titleDiv }}>
											{
												this.state.secondIcons.length >= 3 ?
													<div style={{ ...styles.logoColor }}></div>
													:
													<div style={{ ...styles.divColor }}></div>
											}
											<div style={{ float: 'left', marginLeft: 4, marginTop: 12, marginRight: (w_width >= 375) ? 14 : 6, }}>
												<span style={{ fontSize: 18, color: '#333333', fontFamily: 'pingfangsc-medium' }}>管理会计</span>
											</div>
											<div style={{ float: 'left', marginTop: 14, marginRight: (w_width >= 375) ? 14 : 6 }}>
												{
													this.state.secondIcons.length > 0 ?
														<img style={{ marginRight: 9 }} src={this.state.secondIcons[1].image} width="13" height="13" />
														:
														<img style={{ marginRight: 9 }} src={Dm.getUrl_img('/img/v2/icons/knowledge@2x.png')} width="12" height="12" />
												}
												<span style={{ ...styles.positionTop, fontSize: 11, color: '#FDC73B' }}>{firstLessonCount.catalogNum || 0}<span style={{ color: '#666' }}>个知识点</span></span>
											</div>
											<div style={{ float: 'left', marginTop: 12, display: 'none' }}>
												{
													this.state.secondIcons.length > 0 ?
														<img style={{ marginRight: 9 }} src={this.state.secondIcons[2].image} width="13" height="13" />
														:
														<img style={{ marginRight: 9 }} src={Dm.getUrl_img('/img/v2/icons/class@2x.png')} width="13" height="13" />
												}
												<span style={{ ...styles.positionTop, fontSize: 11, color: '#666666' }}>{firstLessonCount.lessonCount || 0}个视频</span>
											</div>
											<div style={{ float: 'right', marginTop: 10 }}>
												<span style={{ fontSize: 12, color: '#999999', fontWeight: 'bold', marginRight: (w_width >= 375) ? 7 : 3 }}>更多</span>
												{/*<img style={{position:'relative',top:2}} src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width="8" height="14"/>*/}
											</div>
											<div></div>
										</div>
									</Link>
									<div style={{ width: devWidth - 26, marginLeft: 13, overflow: 'hidden', paddingBottom: 18 }}>
										<HomeOnlineItem {...first_online_lessons} />
									</div>
								</div>

								<div style={{ ...styles.onlineDiv, marginTop: 10, display: this.state.second_online_lessons.length > 0 ? 'block' : 'none' }}>
									<Link to={`${__rootDir}/list/online`}>
										<div style={{ ...styles.titleDiv }}>
											{
												this.state.secondIcons.length >= 3 ?
													<div style={{ ...styles.logoColor }}></div>
													:
													<div style={{ ...styles.divColor }}></div>
											}
											<div style={{ float: 'left', marginLeft: 4, marginTop: 12, fontSize: 18, color: '#333333', fontFamily: 'pingfangsc-medium', marginRight: (w_width >= 375) ? 14 : 6, width: 72 }}>
												税务
		            </div>
											<div style={{ float: 'left', marginTop: 14, marginRight: (w_width >= 375) ? 14 : 6 }}>
												{
													this.state.secondIcons.length > 0 ?
														<img style={{ marginRight: 9 }} src={this.state.secondIcons[1].image} width="13" height="13" />
														:
														<img style={{ marginRight: 9 }} src={Dm.getUrl_img('/img/v2/icons/knowledge@2x.png')} width="12" height="12" />
												}
												<span style={{ ...styles.positionTop, fontSize: 11, color: '#FDC73B' }}>{secondLessonCount.catalogNum || 0}<span style={{ color: '#666' }}>个知识点</span></span>
											</div>
											<div style={{ float: 'left', marginTop: 12, display: 'none' }}>
												{
													this.state.secondIcons.length > 0 ?
														<img style={{ marginRight: 9 }} src={this.state.secondIcons[2].image} width="13" height="13" />
														:
														<img style={{ marginRight: 9 }} src={Dm.getUrl_img('/img/v2/icons/class@2x.png')} width="13" height="13" />
												}
												<span style={{ ...styles.positionTop, fontSize: 11, color: '#666666' }}>{secondLessonCount.lessonCount || 0}个视频</span>
											</div>
											<div style={{ float: 'right', marginTop: 10 }}>
												<span style={{ fontSize: 12, color: '#999999', fontWeight: 'bold', marginRight: (w_width >= 375) ? 7 : 3 }}>更多</span>
												{/*<img style={{position:'relative',top:2}} src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width="8" height="14"/>*/}
											</div>
											<div></div>
										</div>
									</Link>
									<div style={{ width: devWidth - 26, marginLeft: 13, overflow: 'hidden', paddingBottom: 18 }}>
										<HomeOnlineItem {...second_online_lessons} />
									</div>
								</div>
								<div style={{ ...styles.onlineDiv, marginTop: 10, display: this.state.third_online_lessons.length > 0 ? 'block' : 'none' }}>
									<Link to={`${__rootDir}/list/online`}>
										<div style={{ ...styles.titleDiv }}>
											{
												this.state.secondIcons.length >= 3 ?
													<div style={{ ...styles.logoColor }}></div>
													:
													<div style={{ ...styles.divColor }}></div>
											}
											<div style={{ float: 'left', marginLeft: 4, marginTop: 12, marginRight: (w_width >= 375) ? 14 : 6, width: 72 }}>
												<span style={{ fontSize: 18, color: '#333333', fontFamily: 'pingfangsc-medium' }}>软技能</span>
											</div>
											<div style={{ float: 'left', marginTop: 14, marginRight: (w_width >= 375) ? 14 : 6 }}>
												{
													this.state.secondIcons.length > 0 ?
														<img style={{ marginRight: 9 }} src={this.state.secondIcons[1].image} width="13" height="13" />
														:
														<img style={{ marginRight: 9 }} src={Dm.getUrl_img('/img/v2/icons/knowledge@2x.png')} width="12" height="12" />
												}
												<span style={{ ...styles.positionTop, fontSize: 11, color: '#FDC73B' }}>{thirdLessonCount.catalogNum || 0}<span style={{ color: '#666' }}>个知识点</span></span>
											</div>
											<div style={{ float: 'left', marginTop: 12, display: 'none' }}>
												{
													this.state.secondIcons.length > 0 ?
														<img style={{ marginRight: 9 }} src={this.state.secondIcons[2].image} width="13" height="13" />
														:
														<img style={{ marginRight: 9 }} src={Dm.getUrl_img('/img/v2/icons/class@2x.png')} width="13" height="13" />
												}
												<span style={{ ...styles.positionTop, fontSize: 11, color: '#666666' }}>{thirdLessonCount.lessonCount || 0}个视频</span>
											</div>
											<div style={{ float: 'right', marginTop: 10 }}>
												<span style={{ fontSize: 12, color: '#999999', fontWeight: 'bold', marginRight: (w_width >= 375) ? 7 : 3 }}>更多</span>
												{/*<img style={{position:'relative',top:2}} src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width="8" height="14"/>*/}
											</div>
											<div></div>
										</div>
									</Link>
									<div style={{ width: devWidth - 26, marginLeft: 13, overflow: 'hidden', paddingBottom: 18 }}>
										<HomeOnlineItem {...third_online_lessons} />
									</div>
								</div>
								<div style={{ ...styles.question, display: this.state.question.length > 0 ? 'block' : 'none' }}>
									<Link to={`${__rootDir}/Qa`}>
										<div style={{ ...styles.titleDiv }}>
											{
												this.state.secondIcons.length >= 3 ?
													<div style={{ ...styles.logoColor }}></div>
													:
													<div style={{ ...styles.divColor }}></div>
											}
											<div style={{ float: 'left', marginLeft: 4, marginTop: 12, marginRight: 23 }}>
												<span style={{ fontSize: 18, color: '#333333', fontFamily: 'pingfangsc-medium' }}>财税问答</span>
											</div>
											<div style={{ float: 'right', marginTop: 12 }}>
												<span style={{ fontSize: 12, color: '#999999', fontWeight: 'bold', marginRight: 7 }}>更多</span>
												{/*<img style={{position:'relative',top:2}} src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width="8" height="14"/>*/}
											</div>
										</div>
									</Link>
									<div style={{ width: devWidth - 25, marginLeft: 13, marginRight: 12 }}>
										{question}
									</div>
								</div>
								<div style={{ borderTop: '1px solid', borderColor: '#e1e1e1', height: 10, backgroundColor: '#f4f4f4' }}></div>
							</div>
							<div style={{ height: 'auto', width: devWidth, position: 'fixed', left: 0, bottom: 0, zIndex: 999, }}>
								<PgBottomMeun type={'index'} />
							</div>
							<div id="allmap"></div>
							<Guide type={'home'} />
						</div>
				}
			</div>
		);
	}
}

var styles = {
	div: {
		flex: 1,
		width: devWidth,
		overflowX: 'hidden',
		height: devHeight - 50,
		overflowY: 'auto'
	},
	bigTitle: {
		float: 'left',
		marginLeft: 4,
		marginTop: 12,
		fontSize: 18,
		color: '#000',
		fontFamily: 'pingfangsc-medium',
		// lineHeight:'16px',
	},
	code_top: {
		width: devWidth - 16,
		height: 12.5,
		backgroundImage: 'url(' + Dm.getUrl_img('/img/v2/offlineReserve/code_top.png') + ')',
		backgroundRepeat: 'no-repeat',
		backgroundSize: '100%'
	},
	contentBg: {
		width: devWidth - 16,
		backgroundImage: 'url(' + Dm.getUrl_img('/img/v2/offlineReserve/code_contentBg.png') + ')',
		backgroundRepeat: 'repeat-y',
		backgroundSize: '100%',
		paddingTop: 8,
		
	},
	lineBg: {
		width: devWidth - 16,
		height: 20,
		backgroundImage: 'url(' + Dm.getUrl_img('/img/v2/offlineReserve/code_lineBg.png') + ')',
		backgroundRepeat: 'no-repeat',
		backgroundSize: '100%'
	},
	ckCode: {
		width: devWidth - 16,
		height: 48,
		backgroundImage: 'url(' + Dm.getUrl_img('/img/v2/offlineReserve/code_bottom.png') + ')',
		backgroundRepeat: 'no-repeat',
		backgroundSize: '100%',
		display: 'flex',
		flexDirection: 'row',
		// alignItems: 'center',
	},
	opacity_box: {
		width: devWidth,
		height: 35,
		padding: '10px 0 7px 0',
		backgroundColor: '#fff',
		opacity: 0.7,
		borderBottomWidth: 1,
		borderBottomColor: '#dfdfdf',
		borderBottomStyle: 'solid',
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 999,
	},
	inputDiv: {
		height: 30,
		borderRadius: 4,
		background: '#FFFFFF',
		// opacity: 0.8,
		color: '#FFFFFF',
		position: 'absolute',
		top: 8,
		zIndex: 999,
		right: 14,
		marginLeft: 12,
	},
	input: {
		width: devWidth * 0.59,
		height:12,
		lineHeight:'12px',
		fontSize: 12,
		color: '#666666',
		position: 'absolute',
		top: 15,
		// left:50,
		zIndex: 990,
		fontFamily: 'PingFangSC-regular',
		letterSpacing: '-0.29px',
		lineHeight:'12px',
		textAlign:'left',
		opacity:0.72,

	},
	divColor: {
		width: 4,
		height: 18,
		borderRadius: 2,
		backgroundImage: ' linear-gradient(-155deg, #27CFFF 0%, #2AA6FF 100%)',
		float: 'left',
		marginTop: 16,
		marginRight: 6
	},
	logoColor: {
		float: 'left',
		marginTop: 16,
		marginRight:1,
		//new add
		width: 10,
		height: 18,
		backgroundImage: 'url(' + Dm.getUrl_img('/img/v2/newyear/newlogo@2x.png') + ')',
		backgroundSize: '10px 18px',
		backgroundPosition: 'left center',
		backgroundRepeat: 'no-repeat'
	},
	titleDiv: {
		width: devWidth - 24,
		marginLeft: 12,
		paddingTop: 12,
		overflow: 'hidden',
		// borderBottomWidth:1,
		// borderBottomColor:'#f3f3f3',
		// borderBottomStyle:'solid'
	},
	liveDiv: {
		height: 70,
		width: devWidth - 24,
		marginLeft: 12,
		marginRight: 12,
		marginTop: 16,
		overflow: 'hidden'
	},
	LineClamp: {
		textOverflow: 'ellipsis',
		whiteSpace: 'normal',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		// WebkitLineClamp: 1,
	},
	onlineDiv: {
		width: '100%',
		backgroundColor: '#ffffff',
		// marginTop:10
	},
	question: {
		width: devWidth,
		// height: 260,
		backgroundColor: '#ffffff',
		marginTop: 12,
		paddingBottom: 20
	},
	questionDiv: {
		width: devWidth - 25,
		// marginRight: 12,
		marginTop: 15,
	},
	positionTop: {
		position: 'relative',
		top: -2
	},
	recordSpan: {
		fontSize: 10,
		// color:'#ffffff',
		position: 'absolute',
		top: 32,
		right: 26
	},
	searchDiv: {
		height: 40,
		width: '100%',
		paddingTop: 12,
		position: 'absolute',
		top: 0,
		borderBottomStyle: 'solid',
		borderBottomColor: '#E1E1E1',
	},
	addressDiv: {
		position: 'absolute',
		zIndex: 999,
		width: 85,
		height: 30,
		left: 12,
		top:10,
		verticalAlign:'middle',
		// textShadow:'0 1px 2px rgba(0,0,0,0.80)'
	},
	menceng: {
		width: devWidth,
		height: 44,
		// backgroundImage: 'linear-gradient(0deg,rgba(51,51,51,0.05) 0%,rgba(0,0,0,0.70) 100%)',
		// borderRadius: '5.18px',
		// opacity: 0.4,
		// backgroundImage:'linear-gradient(-90deg, #27CFFF 0%, #2AA6FF 99%)',
		position: 'absolute',
		top: 0,
		zIndex:998,
	},
	boxShadow: {
		boxShadow: '0 1px 2px 0 rgba(0,0,0,0.80)',
	},
	gradientDiv: {
		width:devWidth,
		// height:44,
		backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.23) 30%, #000000 99%)'

	},
	img_status: {
		width: 50,
		height: 20,
		lineHeight: '20px',
		position: 'absolute',
		zIndex: 5,
		left: 1,
		bottom: 0,
		backgroundImage: 'linear-gradient(-90deg, #B0E6FC 0%, #8DCAFA 100%)',
		borderRadius: 2,
		textAlign: 'center'
	},
	orange_status: {
		backgroundImage: 'linear-gradient(-90deg, #F8B878 0%, #F8A185 98%)'
	},
	green_status: {
		backgroundImage: 'linear-gradient(-90deg, #C1E581 0%, #9BCE85 100%)',
	},
	grey_status: {
		backgroundImage: ' linear-gradient(-90deg, #B7B7B7 0%, #A3A3A3 98%)'
	},
	pink_status: {
		backgroundImage: 'linear-gradient(-90deg, #F6B3B3 0%, #F49D9D 98%)'
	},
	text_blue: {
		fontSize: 11,
		color: '#457295'
	},
	text_orange: {
		fontSize: 11,
		color: '#B63F00'
	},
	text_green: {
		fontSize: 11,
		color: '#104F1F'
	},
	text_white: {
		fontSize: 11,
		color: '#FFFFFF'
	},
	text_pink: {
		fontSize: 11,
		color: '#6E0000'
	},
	imgBlack: {
		position: 'absolute',
		bottom: 0,
		height: 20,
		backgroundImage: 'linear-gradient(-180deg, rgba(51,51,51,0.05) 0%, rgba(0,0,0,0.70) 100%)',
		color: '#fff',
		fontSize: 11,
		lineHeight: '20px',
	},
	list_box: {
		width: window.screen.width - 16,
		marginLeft: 8,
		marginTop: 16,
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


};

export default PgHomeIndex;
