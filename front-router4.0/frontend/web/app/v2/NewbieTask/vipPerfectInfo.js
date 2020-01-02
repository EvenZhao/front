import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
import echarts from 'iosselect'
import iosSelect from '../util/iosSelect'
import FullLoading from '../components/FullLoading';
import GenderList from '../components/GenderList';


var industryId = ''
var industry_name = ''
var position_name = ''
var positionId = ''
var backgroundnameId = ''
var background_name = ''
var cityid = ''
var city_name = ''
var companySizeId = ''
var companysize_name = ''
var countdown

class vipPerfectInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userInfo: {},//个人资料
			position: [],//职位
			industry: [],//行业
			companySize: [],//规模
			companyBackGround: [],//背景
			cities: {},//所在城市、
			nick_name: '',
			name: '',
			industry_name: '',
			position_name: '',
			background_name: '',
			cityname: '',
			company_size: '',
			company: '',
			phone: '',
			email: '',
			isButtom: false,
			bindInfo: {},
			isLoading: true,
			isShow: false,
			// gender(1男性，2女性)
			gender: null,
			// genderSecrecy(0:不保密；1:保密)
			//false：不保密  true:保密
			isSecret: true,
			sexText: '',
			phone_str: ''
		};

	}

	componentWillMount() {

	}
	forData(data) {
		var newData = []
		for (var i = 0; i < data.length; i++) {
			var obj = {
				id: data[i].id,
				value: data[i].name || data[i].position_name || data[i].background_name
			}
			newData.push(obj)
		}
		return newData
	}
	forcities(data) {
		var iosProvinces = []
		var iosCitys = []
		// 向控制台输出对象的可枚举属性
		for (var key of Object.keys(data)) {
			var obj = {
				id: key,
				value: data[key].provincename,
				parentId: data[key].provinceid,
			}
			iosProvinces.push(obj)
			var cityList = data[key].cityList || []
			for (var t = 0; t < cityList.length; t++) {
				var city = {
					id: cityList[t].cityid,
					value: cityList[t].cityname,
					parentId: cityList[t].provinceid,
				}
				iosCitys.push(city)
			}
		}
		var cities = {//返回值 列为一个对象，蛋疼的数据结构
			iosProvinces: iosProvinces,
			iosCitys: iosCitys,
		}
		return cities
	}
	_handlegetAccountActivationRequireInfoDone(re) {
		console.log('vip账号：', re)
		if (re.err || !re.isVip) {
			return
		}
		var result = re.result
		var userInfo = result.userInfo || {}
		var industry = result.industry || []

		//获取城市id
		if (result.cities) {
			var cityObj = this.forcities(result.cities);
			if (cityObj && cityObj.iosCitys){
				cityObj.iosCitys.map((item, index) => {
					if (item.value == userInfo.cityname) {
						cityid = item.id;
					}
				})
			}
		}

			this.setState({
				userInfo: userInfo,//个人资料
				gender: userInfo.gender,//性别
				isSecret: userInfo.genderSecrecy == 0 ? false : true,
				position: this.forData(result.position),//职位
				industry: this.forData(result.industry),//行业
				companySize: this.forData(result.companySize),//规模
				companyBackGround: this.forData(result.companyBackGround),//背景
				cities: result.cities || '',//所在城市
				nick_name: userInfo.nick_name || '',
				name: userInfo.name || '',
				industry_name: userInfo.industry_name || '',
				position_name: userInfo.position || '',
				background_name: userInfo.background_name || '',
				cityname: userInfo.cityname || '',
				company_size: userInfo.company_size || '',
				company: userInfo.company || '',
				phone: userInfo.phone || '',
				email: userInfo.email || '',
				isLoading: false
			}, () => {
				position_name = userInfo.position
				city_name = userInfo.cityname
				// if (this.state.phone && this.state.email) {
				// 	this.setState({
				// 		bindInfo: { bindPhoneNumber: true }
				// 	})
				// }
				this.backData()
				this.nextButtom();
			})
		}

		//校验所有必填项不为空则按钮高亮
		nextButtom() {

			var _phone = '';
			var _email = '';
			var bindInfo = localStorage.getItem("bindInfo");
			if (bindInfo != null) {
				bindInfo = JSON.parse(bindInfo)
				if (bindInfo.phoneOrEmail) {
					_email = bindInfo.phoneOrEmail
				}
				else {
					_email = this.state.email;
				}
				if (bindInfo.phoneNumber) {
					_phone = bindInfo.phoneNumber
				}
				else {
					_phone = this.state.phone;
				}
			}
			else {
				if (this.state.email) {
					_email = this.state.email;
				}
				if (this.state.phone) {
					_phone = this.state.phone;
				}
			}

			// console.log('验证',this.state.name+'-'+this.state.gender+'-'+position_name +'-'+city_name +'-' + _email + '-' + _phone)

			if (this.state.name && (position_name || this.state.position_name) && (city_name || this.state.cityname) && _phone && _email && this.state.gender) {

				this.setState({
					isButtom: true
				})
			}
		}
		_oncities() {
			var boj = this.forcities(this.state.cities)
			var showGeneralDom = document.querySelector('#showGeneral');
			var suIdDom = document.querySelector('#suId');
			var weiIdDom = document.querySelector('#weiId');
			var suId = showGeneralDom.dataset['su_id'];
			var suValue = showGeneralDom.dataset['su_value'];
			var weiId = showGeneralDom.dataset['wei_id'];
			var weiValue = showGeneralDom.dataset['wei_value'];
			var sanguoSelect = new iosSelect(2,
				[boj.iosProvinces, boj.iosCitys],
				{
					title: '选择城市',
					itemHeight: 35,
					oneLevelId: suId,
					twoLevelId: weiId,
					relation: [1, 1],
					callback: (selectOneObj, selectTwoObj) => {
						weiIdDom.innerHTML = selectTwoObj.value;
						cityid = selectTwoObj.id
						city_name = selectTwoObj.value;
						this.nextButtom()
					}
				});
		}
		//选择职位
		_onposition() {
			if (this.state.position_name) {
				return false
			}
			// this.nextButtom()
			var showDom = document.querySelector('#position');// 绑定一个触发元素
			var valDom = document.querySelector('#position_name');  // 绑定一个存储结果的元素
			var val = showDom.dataset['id'];             // 获取元素的data-id属性值
			var title = showDom.dataset['value'];        // 获取元素的data-value属性值
			var example = new iosSelect(1,               // 第一个参数为级联层级，演示为1
				[this.state.position],                     // 演示数据
				{
					container: '.container',             // 容器class
					title: '选择职位',                    // 标题
					itemHeight: 50,                      // 每个元素的高度
					itemShowCount: 3,                    // 每一列显示元素个数，超出将隐藏
					oneLevelId: val,                     // 第一级默认值
					callback: (selectOneObj) => {  // 用户确认选择后的回调函数
						valDom.innerHTML = selectOneObj.value;
						position_name = selectOneObj.value
						positionId = selectOneObj.id;
						this.nextButtom()
					}
				});
		}
		getperDataInfo() {
			var perfectinfo = {
				nick_name: this.state.nick_name,
				name: this.state.name,
				gender: this.state.gender,
				phoneOrEmail: '',
				phone: this.state.phone,
				email: this.state.email,
				verifyCode: '',
				company: this.state.company,
				positionId: positionId,
				position: this.state.position_name || position_name,
				industry: industryId,
				cityid: cityid,
				// city_name: city_name,
				companyScale: companySizeId,
				businessBackgroundId: backgroundnameId,
				hasCompleted: '',
				taskId: '',
				industry_name: industry_name,
				companysize_name: companysize_name,
				city_name: city_name,
				background_name: background_name,
			}
			localStorage.setItem("perfectInfo", JSON.stringify(perfectinfo));
		}
		backData() {
			var perfectInfo = localStorage.getItem("perfectInfo");
			if (perfectInfo) {
				perfectInfo = JSON.parse(perfectInfo)
				// console.log('perfectInfo----',perfectInfo);
				this.setState({
					nick_name: perfectInfo.nick_name,
					gender: perfectInfo.gender,
					name: perfectInfo.name,
					phone: perfectInfo.phone,
					email: perfectInfo.email,
					company: perfectInfo.company,
					cityname: perfectInfo.city_name,
					position_name: perfectInfo.position
				}, () => {
					var weiIdDom = document.querySelector('#weiId');
					var position = document.querySelector('#position_name');  // 绑定一个存储结果的元素
					// weiIdDom.innerHTML = perfectInfo.city_name || '请选择城市'
					city_name = perfectInfo.city_name
					// position.innerHTML = perfectInfo.position || '请选择职位'
					position_name = perfectInfo.position
					positionId = perfectInfo.positionId
					cityid = perfectInfo.cityid
					this.nextButtom()
				})
			}
		}
		componentDidMount() {
			this.e_getAccountActivationRequireInfo = EventCenter.on('getAccountActivationRequireInfoDone', this._handlegetAccountActivationRequireInfoDone.bind(this));
			this.e_getperfectAccount = EventCenter.on('perfectAccountDone', this._handleperfectAccountDone.bind(this));

			var bindInfo = localStorage.getItem("bindInfo");
			if (bindInfo) {
				bindInfo = JSON.parse(bindInfo)
				this.setState({
					bindInfo: bindInfo
				})
				// var bindPhone = document.querySelector('#bindPhone');
				// var bindEmail = document.querySelector('#bindEmail');
				// if (bindPhone) {
				// 	bindPhone.innerHTML = (bindInfo.phoneOrEmail).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + ' 已绑定'
				// } else {
				// 	bindEmail.innerHTML = (bindInfo.phoneOrEmail).replaceAll(bindInfo.phoneOrEmail.substring(2, bindInfo.phoneOrEmail.lastIndexOf("@")), "*****") + ' 已验证'
				// }


				if (bindInfo.phoneNumber) {
					// bindPhone.innerHTML = (bindInfo.phoneOrEmail).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + ' 已绑定';
					var str = (bindInfo.phoneNumber).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + ' 已绑定';
					this.setState({
						phone_str: str
					})
				} else {
					var email = bindInfo.phoneOrEmail || '';
					var position = email.indexOf("@");
					var str = email.substring(0, position);

					var char = email.substring(position, email.length);
					if (str.length > 2) {
						email = email.substring(0, 2) + '****' + char;
					}
					// bindEmail.innerHTML = email + ' 已验证';
					var str = email + ' 已验证';
					this.setState({
						email_str: str
					})
					// bindEmail.innerHTML = (bindInfo.phoneOrEmail).replaceAll(bindInfo.phoneOrEmail.substring(2, bindInfo.phoneOrEmail.lastIndexOf("@")), "*****") + ' 已验证'
				}

			}



			Dispatcher.dispatch({
				actionType: 'getAccountActivationRequireInfo',
				isVip: true
			})
			EventCenter.emit("SET_TITLE", '铂略财课-完善资料')
			// countdown = setInterval(function () {
			// 	this.nextButtom()
			// }.bind(this), 200);

		}
		componentWillUnmount() {
			this.e_getAccountActivationRequireInfo.remove()
			this.e_getperfectAccount.remove()
			this.getperDataInfo()
			// clearInterval(countdown);
		}
		_handleperfectAccountDone(re) {
			console.log('re==', re)
			if (re.result) {
				this.props.history.push(`${__rootDir}/chooseTopic`)
			}
		}

		//初始化性别组件
		_choiceGender() {
			this.setState({
				isShow: true,
			})
		}

		//选择性别后确认
		_confirm(re) {
			var { genderType, isSecret } = re;
			var _sex = '';
			if (isSecret) {
				_sex = '(性别对外保密)'
			}
			this.setState({
				gender: genderType,
				sexText: _sex,
				isShow: false,
				isSecret: isSecret,
			}, () => {
				this.nextButtom()
			})
		}
		//设置性别
		_set(isSecret) {
			this.setState({
				isSecret: isSecret
			})
		}
		//关闭弹框和遮罩层
		_hideAlert() {
			this.setState({
				isShow: false
			})
		}

		render() {
			return (
				<div style={{ ...styles.div }}>
					<FullLoading isShow={this.state.isLoading} />
					<div style={{ ...styles.mask, display: this.state.isShow ? 'block' : 'none' }} onClick={this._hideAlert.bind(this)}></div>
					<GenderList
						isShow={this.state.isShow}
						gender={this.state.gender}
						isSecret={this.state.isSecret}
						confirm={this._confirm.bind(this)}
						set={this._set.bind(this)}
					/>
					<div style={{ ...styles.secondDiv }}>

						<div style={{ ...styles.div_box, marginTop: 18 }}>
							<div style={{ ...styles.titlediv, color: '#999' }}>姓名</div>
							<div style={{ position: 'absolute', right: 39, color: '#999' }}>
								{this.state.name && (this.state.name != null || this.state.name != '') ?
									<div>{this.state.name}</div>
									:
									<input style={{ ...styles.inputText, }} disabled="disabled" type="text" value={this.state.name} placeholder="姓名不可修改" onChange={this._onChangeInputName.bind(this)} />
								}
							</div>
						</div>
						<div style={{ ...styles.div_input, marginTop: 11 }} onClick={this._choiceGender.bind(this)}>
							<div id="gender" style={{ ...styles.titlediv, }}>性别</div>
							<div style={styles.more}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} /></div>
							<div style={{ float: 'right', }}>
								{this.state.gender ?
									<span style={{ ...styles.infoText, color: '#333' }} >
										{this.state.gender == 1 ?
											"男"
											:
											"女"
										}
										<span style={{ marginLeft: 10, display: this.state.sexText ? 'inline' : 'none' }}>{this.state.sexText}</span>
									</span>
									:
									<span style={styles.infoText} >
										请选择性别
							  </span>
								}

							</div>
						</div>
						<div style={{ ...styles.div_input, marginTop: 12 }} onClick={this._onposition.bind(this)}>
							<div id="position" style={{ ...styles.titlediv, }}>职位</div>

							<div style={styles.more}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} /></div>
							<div style={{ float: 'right', }}>

								<span id="position_name" style={{ ...styles.infoText, color: '#333' }}>
									{this.state.position_name != '请选择职位' ?
										<span>{this.state.position_name}</span>
										:
										<span style={{ color: '#999' }}>请选择职位</span>
									}
									{/* {this.state.position_name || '请选择职业' } */}
								</span>


							</div>
						</div>
						<div style={{ ...styles.div_input }} onClick={this._oncities.bind(this)}>
							<div id="showGeneral" style={{ ...styles.titlediv, }}>所在城市</div>
							<div style={styles.more}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} /></div>
							<div style={{ float: 'right', }}>
								<span id="weiId" style={{ ...styles.infoText, color: '#333' }}>
									{this.state.cityname ?
										<span>{this.state.cityname}</span>
										:
										<span style={{ color: '#999' }}>请选择城市</span>
									}
									{/* {this.state.cityname || '请选择城市'} */}
								</span>
							</div>
						</div>
						{
							this.state.email && this.state.phone ?
								null
								:
								<div>
									{/* {
									this.state.userInfo.email ?
										<div style={{ ...styles.div_input, marginTop: 11 }}>
											<Link to={`${__rootDir}/bindPhone`}>
												<div style={{ ...styles.titlediv, }}>手机号码</div>
												<div style={styles.more}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} /></div>
												<div style={{ float: 'right', }}>
													<span id="bindPhone" style={styles.infoText}>去绑定</span>
												</div>
											</Link>
										</div>
										:
										<div style={{ ...styles.div_input, marginTop: 11 }}>
											<Link to={`${__rootDir}/bindEmail`}>
												<div style={{ ...styles.titlediv, }}>电子邮箱</div>
												<div style={{ float: 'right', marginRight: 12, marginLeft: 12 }}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} /></div>
												<div style={{ float: 'right', }}>
													<span id="bindEmail" style={styles.infoText}>去验证</span>
												</div>
											</Link>
										</div>
								} */}

									{
										this.state.email != null || this.state.email != '' ?
											<div style={{ ...styles.div_input, marginTop: 11 }} onClick={this.BindPhoneNumber.bind(this, 'phone')}>
												<div style={{ ...styles.titlediv, }}>手机号码</div>
												<div style={styles.more}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} /></div>
												<div style={{ float: 'right' }}>
													{this.state.phone_str ?
														<span style={{ color: '#3333' }}>
															{this.state.phone_str}
														</span>
														:
														<span id="bindPhone" style={styles.infoText}>去绑定</span>
													}
												</div>
											</div>
											:
											<div style={{ ...styles.div_input, marginTop: 11 }} onClick={this.BindPhoneNumber.bind(this, 'email')}>
												<div style={{ ...styles.titlediv, }}>电子邮箱</div>
												<div style={styles.more}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} /></div>
												<div style={{ float: 'right' }}>
													{this.state.email_str ?
														<span style={{ color: '#333' }}>{this.state.email_str}</span>
														:
														<span id="bindEmail" style={styles.infoText}>去验证</span>
													}
												</div>
											</div>
									}

								</div>
						}

					</div>
					{
						this.state.isButtom ?
							<div style={{ ...styles.buttom, marginTop: 28 }} onClick={this.submit.bind(this)}>
								<span style={{ fontSize: 18, color: '#FFFFFF', fontFamily: 'pingfangsc-regular', letterSpacing: '-0.43px' }}>下一步</span>
							</div>
							:
							<div style={{ ...styles.buttom, marginTop: 28, backgroundColor: '#d1d1d1' }}>
								<span style={{ fontSize: 18, color: '#FFFFFF', fontFamily: 'pingfangsc-regular', letterSpacing: '-0.43px' }}>下一步</span>
							</div>
					}

					<div className="container"></div>
				</div>
			)
		}

		//绑定手机号和邮箱
		BindPhoneNumber(e) {
			if (this.state.bindInfo) {
				var bindInfo = this.state.bindInfo || {}
				if (bindInfo.phoneOrEmail) {
					return
				}
				if (bindInfo.phoneNumber) {
					return
				}
			}

			if (e == 'phone') {
				this.props.history.push(`${__rootDir}/bindPhone`)
			} else {
				this.props.history.push(`${__rootDir}/bindEmail`)
			}
			this.nextButtom()
		}

		submit() {
			var newbieTaskIndex = localStorage.getItem("newbieTaskIndex");
			if (newbieTaskIndex) {
				newbieTaskIndex = JSON.parse(newbieTaskIndex)

				var _phoneOrEmail;
				var bindInfo = this.state.bindInfo || {}
				if (bindInfo.phoneNumber) {
					_phoneOrEmail = bindInfo.phoneNumber
				}
				else {
					_phoneOrEmail = bindInfo.phoneOrEmail
				}

				var _genderSecrecy;
				if (this.state.isSecret) {
					//保密
					_genderSecrecy = 1;
				}
				else {
					//不保密
					_genderSecrecy = 0;
				}
				console.log('cityid==', cityid)

				Dispatcher.dispatch({
					actionType: 'perfectAccount',
					nick_name: this.state.nick_name,
					name: this.state.name,
					phoneOrEmail: _phoneOrEmail,
					verifyCode: bindInfo.code,
					company: this.state.company,
					positionId: positionId,
					position: position_name,
					industry: industryId,
					cityid: cityid,
					companyScale: companySizeId,
					businessBackgroundId: backgroundnameId,
					hasCompleted: true,
					taskId: newbieTaskIndex[0].id,
					gender: this.state.gender,
					genderSecrecy: _genderSecrecy
				})
			}
		}
		_onChangeInputnick_name(e) {
			e.preventDefault();
			var v = e.target.value.trim();
			this.setState({
				nick_name: v,
			})
		}
		_onChangeInputName(e) {
			e.preventDefault();
			var v = e.target.value.trim();
			this.setState({
				name: v,
			}, () => {
				this.nextButtom()
			})
		}


	}

var styles = {
	div: {
		height: devHeight,
		width: devWidth,
		backgroundColor: '#f4f4f4',
		// overflowY: 'scroll',
		// overflowX: 'hidden',
	},
	secondDiv: {
		height: devHeight - 100,
		width: devWidth,
		overflowY: 'scroll',
		overflowX: 'hidden',
	},
	div_input: {
		height: '50px',
		width: devWidth,
		backgroundColor: '#fff',
		lineHeight: 3,
		// paddingLeft:15,
		borderBottomWidth: 0.5,
		borderBottomColor: '#e5e5e5',
		borderBottomStyle: 'solid',
	},
	div_box: {
		height: '50px',
		width: devWidth,
		// marginLeft:15,
		backgroundColor: '#fff',
		lineHeight: 3,
		borderBottomWidth: 0.5,
		borderBottomColor: '#e5e5e5',
		borderBottomStyle: 'solid',
		position: 'relative'
	},
	titlediv: {
		fontSize: 15,
		marginLeft: 12,
		float: 'left',
		marginTop: 6,
		fontSize: 14,
		color: '#333'
	},
	inputText: {
		textAlign: 'right',
		fontSize: 14,
		color: '#333',
		width: devWidth - 104,
		// width:'80%',
		border: 'none',
		backgroundColor: '#FFFFFF',
	},
	buttom: {
		width: devWidth - 28,
		height: 45,
		borderRadius: '4px',
		marginLeft: 14,
		backgroundColor: '#2196F3',
		textAlign: 'center',
		lineHeight: 2.5
	},
	div_input: {
		height: '50px',
		width: devWidth,
		backgroundColor: '#fff',
		lineHeight: 3,
		// paddingLeft:15,
		borderBottomWidth: 0.5,
		borderBottomColor: '#e5e5e5',
		borderBottomStyle: 'solid',
	},
	infoText: {
		fontSize: 14,
		color: '#999',
	},
	more: {
		float: 'right',
		marginRight: 16,
		marginLeft: 15
	},
	mask: {
		width: window.screen.width,
		height: window.innerHeight,
		backgroundColor: '#000',
		opacity: 0.4,
		position: 'absolute',
		left: 0,
		top: 0,
		zIndex: 90
	},

}

export default vipPerfectInfo;
