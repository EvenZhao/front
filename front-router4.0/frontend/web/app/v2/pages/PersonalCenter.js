/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router';
import PgBottomMeun from '../components/PgBottomMeun';
import LoginAlert from '../components/LoginAlert'
import Dm from '../util/DmURL'
import Common from '../Common'
import LoadFailure from '../components/LoadFailure'

// var back = false
// var timer;
class PersonalCenter extends React.Component {
	constructor(props) {
	    super(props);
			this.wx_config_share_home = {
					title: '个人中心-铂略咨询',
					desc: '铂略咨询-财税领域实战培训供应商',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
			this.imgArry = ['checkIn1@2x.png','checkIn2@2x.png','checkIn3@2x.png'];
			this.index = 0;

		this.state = {
			title: 'PgHome',
			user: {},
			user_image: '',
			sign: false,
			auth: '',
			point: '',
			learnHour: '',
			discount: '',
			isLogin:false,
			isShow: false,
			signCount: 0,//签到
			new_expire_date: '',
			auth_type:null,
			level:null,
			userRegisterCodeNum:0,//用户参课券
			userRecordNum:0,//用户看过多少课程
			userAddLessonNum:0,//用户选课总数
			focusTeacherNum:0,//用户关注讲师总数
			topicNum:0,
			userQaNum:0,//用户回答以及提问总和
			isMainHolder:false,//是否是主持卡人，主持卡人可审核
			discount:0,//体验券,
			topic:[],//话题
			bolueIsShow:false,//是否显示铂略邀请码
			isExpired:false,//会员过期时间，是否已过期，true：为已过期
		};
	}
	_handleonCenterDone(re){
		console.log('_handleonCenterDone==',re);
		var user = re.user;
		this.setState({
			user: user,
			user_image: user.user_image,
			// sign: user.sign,
			auth_type:user.auth_type || null,
			auth: user.auth,
			point: user.point,
			learnHour: user.learnHour,
			discount: user.discount,
			isLogin: user.account_id ? true : false,
			new_expire_date: user.new_expire_date,
			level:user.level || null,
			userRegisterCodeNum:user.userRegisterCodeNum ? user.userRegisterCodeNum:0,
			focusTeacherNum:user.focusTeacherNum ? user.focusTeacherNum : 0,
			userAddLessonNum:user.userAddLessonNum ? user.userAddLessonNum : 0,
			topicNum:user.topicNum,
			userQaNum:user.userQaNum ? user.userQaNum : 0,
			userRecordNum:user.userRecordNum ? user.userRecordNum : 0,//用户看过多少课程
			isMainHolder:user.isMainHolder,
			discount:user.discount,//体验券
			topic:user.topic || [],
			bolueIsShow:user.bolueIsShow,
			isExpired:user.isExpired,
		})
	}


	doSign() {
		if(this.state.sign == false) {
			// Dispatcher.dispatch({
			// 	actionType: 'DoSign'
			// })
			this.props.history.push({pathname: `${__rootDir}/taskList`,state:{source:'pageCenter',account_type:this.state.user.account_type}})
		}
	}

	_handleHasSign(re) {
		if(re.result && !re.result.hasSign) {
			this.setState({
				sign: re.result.hasSign,
				signCount: 0
			})
		} else if(re.result && re.result.hasSign && re.result.signCount) {
			this.setState({
				sign: re.result.hasSign,
				signCount: re.result.signCount
			})
		}
	}

	_handleDoSign(re) {
		this.setState({
			signCount: re.result.signCount
		})
		window.location.reload()
	}

	componentWillMount() {
	}
	componentDidMount() {
		Dispatcher.dispatch({
			actionType: 'onCenter'
		})
		Dispatcher.dispatch({
			actionType: 'HasSign'
		})
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE",'铂略财课-个人中心')
		this.onCenterDone = EventCenter.on('onCenterDone', this._handleonCenterDone.bind(this))
		this.onBackToCenter = EventCenter.on('BackToCenter',this._BackToCenter.bind(this))
		this.isHasSign = EventCenter.on('HasSignDone', this._handleHasSign.bind(this))
		// this.doSignDone = EventCenter.on('DoSignDone', this._handleDoSign.bind(this))
	}
	componentWillUnmount() {
		this.onCenterDone.remove()
		this.onBackToCenter.remove()
		this.isHasSign.remove()
		// this.doSignDone.remove()
	}

	//登录
	_login(){
		this.props.history.push({pathname: `${__rootDir}/login`})
	}

	//去掉弹框
	_BackToCenter(re){
		this.setState({
			isShow: false
		})
	}
	//跳转
	_gotoLink(re){

		if(this.state.isLogin){//登录后
			switch (re) {
				case 'learn'://足迹,最近浏览
					this.props.history.push({pathname: `${__rootDir}/PgLearnRecord`})
					break;
				case 'choice'://选课
					this.props.history.push({pathname: `${__rootDir}/ChoiceCourse`})
					break;
				case 'attention'://我的关注
					this.props.history.push({pathname: `${__rootDir}/MyAttention`})
					break;
				case 'reserve'://课程预约
					this.props.history.push({pathname: `${__rootDir}/PgMyReserveEnroll`})
				break;
				case 'point':
					this.props.history.push({pathname: `${__rootDir}/PointsMall`})
					break;
				case 'discount'://卡券
					this.props.history.push({pathname: `${__rootDir}/PgMyDiscount`})
				break;
				case 'review'://审核
					this.props.history.push({pathname: `${__rootDir}/offlineToExamine`})
					break;
				case 'plan'://计划
					this.props.history.push({pathname: `${__rootDir}/CoursePlan`})
				break;
				case 'qa'://我的问答
					this.props.history.push({pathname: `${__rootDir}/MyQa`})
					break;
				case 'task'://我的任务
					this.props.history.push({pathname: `${__rootDir}/taskList`, query: null, hash: null, state:{account_type:this.state.user.account_type}})
				break;
				case 'topic'://话题
					this.props.history.push({pathname: `${__rootDir}/TopicCenter`, query: null, hash: null, state:{user_id:null,question_id:null}});
				break;
				case 'live'://我的预约-直播课
					this.props.history.push({pathname: `${__rootDir}/PgLiveReserveEnrollList`})
					break;
				case 'offline'://我的预约-线下课
					this.props.history.push({pathname: `${__rootDir}/PgOfflineReserveEnrollList`})
					break;
				case 'coupons'://参课券
					this.props.history.push({pathname: `${__rootDir}/Coupons`})
				 break;
				case 'inviteCode'://邀请码
					//isStaff:  true员工账号 、false不是
					if(this.state.user.isStaff){//铂略员工账号
						this.props.history.push({pathname: `${__rootDir}/BolueInvitationCode`})
					}else {
						if(this.state.bolueIsShow){
							this.props.history.push({pathname: `${__rootDir}/UserInvitedCode`})
						}else {
							this.props.history.push({pathname: `${__rootDir}/ShowInvitedCode`})
						}
					}
 				break;
				case 'set'://设置
					this.props.history.push({pathname: `${__rootDir}/PgCenterSet`})
				break;
				case 'setInfo':
					this.props.history.push({pathname: `${__rootDir}/PgSetInfo`})
					break;
				default:
			}
		}else {//未登录，提示登录
			this.setState({
				isShow: true
			})
		}
	}

	render(){
		var level_content;
		var user_type;
		if(this.state.level == 1){
			//注册用户
			level_content = (
				<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:20}}>
					<span style={{color:Common.Bg_White,fontSize:Fnt_Normal,marginRight:5}}>{this.state.user.nick_name}</span>
					{/*<img src={Dm.getUrl_img('/img/v2/icons/rg_member@2x.png')} width={13} height={9} />*/}
				</div>
			)

			user_type=(
				<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:20}}>
				  <img src={Dm.getUrl_img('/img/v2/icons/type_register@2x.png')} width={14} height={13} style={{marginRight:5,}} />
					<span style={{fontSize:Fnt_Normal,color:Common.Black,marginLeft:5}}>注册用户</span>
				</div>
			)
		}
		else if (this.state.level == 11) {
			//铂略员工账号
			level_content = (
				<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:20}}>
					<span style={{color:Common.Bg_White,fontSize:Fnt_Normal,marginRight:5}}>{this.state.user.nick_name}</span>
					{/*<img src={Dm.getUrl_img('/img/v2/icons/employee@2x.png')} width={15} height={15} />*/}
				</div>
			)
			user_type=(
				<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:20}}>
				  <img src={Dm.getUrl_img('/img/v2/icons/type_employer@2x.png')} width={13} height={14} />
					<span style={{fontSize:Fnt_Normal,color:Common.Black,marginLeft:5}}>员工账号</span>
				</div>
			)

		}
		else if (this.state.level == 13) {
			//VIP体验会员
			level_content = (
				<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:20}}>
					<span style={{color:Common.Bg_White,fontSize:Fnt_Normal,marginRight:5}}>{this.state.user.nick_name}</span>
					{/*<img src={Dm.getUrl_img('/img/v2/pgCenter/tyhy@2x.png')} width={41} height={16} />*/}
				</div>
			)

			user_type=(
				<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:20}}>
					<img src={Dm.getUrl_img('/img/v2/icons/type_VIP@2x.png')} width={14} height={13} />
					<span style={{fontSize:Fnt_Normal,color:Common.Black,marginLeft:5}}>体验会员</span>
				</div>
			)
		}
		else {
			//vip会员
			level_content = (
				<div>
					<span style={{color:Common.Bg_White,fontSize:Fnt_Normal,marginLeft:5}}>{this.state.user.nick_name}</span>
					{/*<img src={Dm.getUrl_img('/img/v2/pgCenter/vip@2x.png')} width={16} height={12} />*/}
				</div>
			)
			user_type=(
				<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:20}}>
					<img src={Dm.getUrl_img('/img/v2/icons/type_VIP@2x.png')} width={14} height={13} />
					<span style={{fontSize:Fnt_Normal,color:Common.Black,marginLeft:5}}>VIP会员</span>
				</div>
			)
		}

		var topic = this.state.topic.map((item,index)=>{
			return(
				<div style={styles.topic} key={index} onClick={this._gotoLink.bind(this,'topic')} >{item.name}</div>
			)
		})

		return (
		<div style={styles.container}>
			<div style={{width:devWidth,height:devHeight - 50,overflowY:'auto'}}>
			{/*未登录状态*/}
        <div>
					<div style={{...styles.topbg,height:this.state.isLogin ? 75:130,}}>
					{!this.state.isLogin ?
						<div>
							<div style={styles.top_text}>欢迎来到铂略财课</div>
							<div style={styles.top_button} onClick={this._login.bind(this)}>
							{isWeiXin ?
								<span>绑定/注册</span>
								:
								<span>登录/注册</span>
							}
							</div>
						</div>
						:
						<div style={styles.login_in}>
							<div style={styles.personal_info}>
								<div style={styles.checkIn}>
								{this.state.sign ?
									<div>已签到<span style={{color:'#ffe2b0'}}>{this.state.signCount}</span>天</div>
									:
									<div  onClick={this.doSign.bind(this)}>
										<img src={Dm.getUrl_img('/img/v2/pgCenter/checkIn@2x.png')} width={11} height={10} />
										<span style={{marginLeft:5}}>签到</span>
									</div>
								}
								</div>
								<div style={styles.photo} onClick={this._gotoLink.bind(this,'setInfo')}>
										<img src={this.state.user_image} width={68} height={68} style={{borderRadius:34,}}/>
								</div>
								<div style={{float:'left',width:devWidth-98,marginLeft:10}}>
									{level_content}
										{this.state.isExpired ?
											<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:20,marginTop:18,fontSize:12,color:Common.Light_Gray}}>
												<img src={Dm.getUrl_img('/img/v2/icons/type_register@2x.png')} width={14} height={13} style={{marginRight:5,}} />
												您的VIP权限已到期
											</div>
											:
											<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:20,marginTop:18}}>
												{user_type}
												{/*<img src={Dm.getUrl_img('/img/v2/pgCenter/validperiod@2x.png')} width={17} height={17}/>*/}
												{ this.state.new_expire_date ?
													<span style={{marginLeft:5,fontSize:11,color:Common.Light_Gray}}>{new Date(this.state.new_expire_date).format('yyyy-MM-dd')}到期</span>
													:
													null
												}
											</div>
										}
								</div>
								{/*关注话题*/}
								<div style={styles.topic_box}>
									<span style={{fontSize:Fnt_Small,color:Common.Black}}>关注话题</span>
									{this.state.topicNum > 0  && this.state.topicNum <=2 ?
									 <div style={{display:'flex',flexDirection:'row',alignItems:'center'}} onClick={this._gotoLink.bind(this,'topic')} >
									 	{topic}
										<img src={Dm.getUrl_img('/img/v2/pgCenter/edit@2x.png')} width={13} height={15} style={{marginLeft:10}} />
									 </div>
										:
										<div>
											{this.state.topicNum == 0 ?
												<div style={{fontSize:Fnt_Small,color:'#9d8275',marginLeft:15,display:'flex',flexDirection:'row',alignItems:'center'}} onClick={this._gotoLink.bind(this,'topic')}>
													<span>去关注话题</span>
													<img src={Dm.getUrl_img('/img/v2/pgCenter/edit@2x.png')} width={13} height={15} style={{marginLeft:10}}/>
												</div>
												:
												<div style={{display:'flex',flexDirection:'row',alignItems:'center'}} onClick={this._gotoLink.bind(this,'topic')}>
													{topic}
													<img src={Dm.getUrl_img('/img/v2/pgCenter/gengduo@2x.png')} width={35} height={16} style={{marginLeft:10}}  />
													<img src={Dm.getUrl_img('/img/v2/pgCenter/edit@2x.png')} width={13} height={15} style={{marginLeft:5}}/>
												</div>

											}
										</div>
									}
								</div>
								<div style={{...styles.line,marginTop:20}}></div>
							</div>
						</div>
					}
					</div>

          <div style={{...styles.top_box,marginTop:this.state.isLogin ? 70:0}}>
            <div style={styles.topBlock}>
              <div style={styles.text1}>{this.state.isLogin ? this.state.focusTeacherNum : 0}</div>
              <div style={styles.text2}>关注</div>
            </div>
            <div style={styles.topBlock}>
              <div style={styles.text1}>{this.state.isLogin ? this.state.userRecordNum : 0}</div>
              <div style={styles.text2}>课程</div>
            </div>
            <div style={styles.topBlock}>
              <div style={styles.text1}>{this.state.isLogin ? this.state.userQaNum : 0}</div>
              <div style={styles.text2}>问答</div>
            </div>
            <div style={styles.topBlock}>
              <div style={styles.text1}>{this.state.isLogin ? this.state.learnHour : 0}</div>
              <div style={styles.text2}>学时</div>
            </div>
          </div>

          <div style={styles.classify_box}>
              <div style={styles.classify}>
									<div style={styles.topBlock} onClick={this._gotoLink.bind(this,'learn')}>
									  <div><img src={Dm.getUrl_img('/img/v2/pgCenter/footprints@2x.png')} width={12} height={17}/></div>
										<div style={{fontSize:Fnt_Normal,color:Common.Light_Black}}>足迹</div>
									</div>
									<div style={styles.topBlock} onClick={this._gotoLink.bind(this,'attention')}>
										<div><img src={Dm.getUrl_img('/img/v2/pgCenter/attention@2x.png')} width={15} height={15}/></div>
										<div style={{fontSize:Fnt_Normal,color:Common.Light_Black}}>关注</div>
									</div>
									<div style={styles.topBlock} onClick={this._gotoLink.bind(this,'reserve')}>
									  <div><img src={Dm.getUrl_img('/img/v2/pgCenter/calendar@2x.png')} width={17} height={17}/></div>
										<div style={{fontSize:Fnt_Normal,color:Common.Light_Black}}>日历</div>
									</div>
									<div style={styles.topBlock} onClick={this._gotoLink.bind(this,'qa')}>
									  <div><img src={Dm.getUrl_img('/img/v2/pgCenter/qa@2x.png')} width={15} height={15}/></div>
										<div style={{fontSize:Fnt_Normal,color:Common.Light_Black}}>问答</div>
									</div>
              </div>
							<div style={styles.line}></div>
							<div style={styles.classify}>
									<div style={styles.topBlock} onClick={this._gotoLink.bind(this,'plan')}>
										<div><img src={Dm.getUrl_img('/img/v2/pgCenter/plan@2x.png')} width={17} height={16}/></div>
										<div style={{fontSize:Fnt_Normal,color:Common.Light_Black}}>计划</div>
									</div>
									<div style={styles.topBlock} onClick={this._gotoLink.bind(this,'task')}>
									  <div><img src={Dm.getUrl_img('/img/v2/pgCenter/task@2x.png')} width={20} height={14}/></div>
										<div style={{fontSize:Fnt_Normal,color:Common.Light_Black}}>任务</div>
									</div>
									<div style={styles.topBlock} onClick={this._gotoLink.bind(this,'live')}>
									  <div><img src={Dm.getUrl_img('/img/v2/pgCenter/live@2x.png')} width={18} height={18}/></div>
										<div style={{fontSize:Fnt_Normal,color:Common.Light_Black}}>直播课</div>
									</div>
									<div style={styles.topBlock} onClick={this._gotoLink.bind(this,'offline')}>
									  <div><img src={Dm.getUrl_img('/img/v2/pgCenter/offline@2x.png')} width={16} height={15}/></div>
										<div style={{fontSize:Fnt_Normal,color:Common.Light_Black}}>线下课</div>
									</div>
              </div>
          </div>
				{this.state.isLogin ?
					<div style={styles.sencond_block}>
						<div style={styles.integral}  onClick={this._gotoLink.bind(this,'point')}>
							<img src={Dm.getUrl_img('/img/v2/pgCenter/integral@2x.png')} width={21} height={20} style={{marginLeft:20}}/>
							<span style={{fontSize:Fnt_Medium,color:Common.Black,marginLeft:8}}>积分</span>
							<div style={styles.num}>{this.state.point}分</div>
						</div>

						<div style={{...styles.integral,borderRight:'none',display:this.state.auth_type ? 'flex':'none'}} onClick={this._gotoLink.bind(this,'choice')}>
							<img src={Dm.getUrl_img('/img/v2/pgCenter/elective@2x.png')} width={18} height={19} style={{marginLeft:20}}/>
							<span style={{fontSize:Fnt_Medium,color:Common.Black,marginLeft:8}}>选课</span>
							<div style={styles.num}>{this.state.userAddLessonNum}门</div>
						</div>
						<div style={styles.integral} onClick={this._gotoLink.bind(this,'discount')}>
							<img src={Dm.getUrl_img('/img/v2/pgCenter/voucher@2x.png')} width={15} height={14} style={{marginLeft:20}}/>
							<span style={{fontSize:Fnt_Medium,color:Common.Black,marginLeft:8}}>卡券</span>
							<div style={styles.num}>{this.state.discount}张</div>
						</div>
						<div style={{...styles.integral,borderRight:'none'}} onClick={this._gotoLink.bind(this,'coupons')}>
							<img src={Dm.getUrl_img('/img/v2/pgCenter/participation@2x.png')} width={20} height={13} style={{marginLeft:20}}/>
							<span style={{fontSize:Fnt_Medium,color:Common.Black,marginLeft:8}}>参课券</span>
							<div style={styles.num}>{this.state.userRegisterCodeNum}张</div>
						</div>
						<div style={{...styles.integral,position:'relative',display:this.state.isMainHolder ? 'flex':'none'}} onClick={this._gotoLink.bind(this,'review')}>
							<div style={{...styles.red_point,display:this.state.user.audit_point > 0 ? 'block':'none'}}></div>
							<img src={Dm.getUrl_img('/img/v2/pgCenter/review@2x.png')} width={15} height={14} style={{marginLeft:20}}/>
							<span style={{fontSize:Fnt_Medium,color:Common.Black,marginLeft:8}}>审核</span>
							{this.state.user.audit_point > 0 ?
								<div style={{marginLeft:25,fontSize:Fnt_Normal,color:Common.red}}>{this.state.user.audit_point}条未审核</div>
								:
								<div style={{marginLeft:25,fontSize:Fnt_Normal,color:Common.Activity_Text}}>0条<span style={{color:'#3f3f3f'}}>未审核</span></div>
							}
						</div>
					</div>
					:
					null
				}
				{this.state.isLogin ?
					<div style={{...styles.set,marginBottom:10}} onClick={this._gotoLink.bind(this,'inviteCode')}>
						<div style={styles.set_text}>{this.state.user.isStaff ? '邀请客户体验' : '邀请码'}</div>
						<div style={styles.more}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} width={8} height={14}/></div>
					</div>
					:
					null
				 }
					<div style={{...styles.set,marginBottom:10}} onClick={this._gotoLink.bind(this,'set')}>
						<div style={styles.set_text}>设置</div>
						<div style={styles.more}><img src={Dm.getUrl_img('/img/v2/icons/more.png')} width={8} height={14}/></div>
					</div>
        </div>

				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
				<LoginAlert isShow={this.state.isShow}/>

				<div style={{position: 'fixed', zIndex: 997,height:'auto', bottom: 0, width: devWidth}}>
					<PgBottomMeun type={'my'}/>
				</div>

			</div>
    </div>
		);
	}
}
PersonalCenter.propTypes = {

};
PersonalCenter.defaultProps = {

};
var styles = {
  container:{
    backgroundColor:'#f4f4f4',
		height: devHeight,
    width:devWidth,
  },
	topbg:{
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/pgCenter/topbg@2x.png')+')',
		backgroundRepeat:'no-repeat',
		backgroundPosition:'bottom center',
		width:devWidth,
		position:'relative',
	},
	top_text:{
		fontSize:24,
		color:Common.Bg_White,
		textAlign:'center',
		paddingTop:25,
	},
	top_button:{
		width:150,
		height:30,
		marginLeft:(devWidth-150)/2,
		marginTop:12,
		lineHeight:'30px',
		textAlign:'center',
		borderRadius:14,
		backgroundColor:'#ffb942',
		color:Common.Bg_White,
		fontSize:Fnt_Medium,
	},
	login_in:{
		height:88,
		position:'absolute',
		zIndex:99,
		width:devWidth,
		top:66,
		left:0,
		borderTopLeftRadius:8,
		borderTopRightRadius:8,
		backgroundColor:Common.Bg_White,
	},
	personal_info:{
		width:devWidth,
		height:68,
		position:'absolute',
		zIndex:100,
		left:0,
		top:-34,
	},
	photo:{
		marginLeft:20,
		float:'left',
		width:68,
		height:68,
	},
	checkIn:{
		width:70,
		height:24,
		lineHeight:'24px',
		border:'solid 1px #cff0ff',
		borderRadius:8,
		color:'#cbeeff',
		fontSize:11,
		textAlign:'center',
		position:'absolute',
		top:2,
		right:6,
	},
	topic_box:{
		marginLeft:28,
		marginTop:15,
		width:devWidth-56,
		display:'flex',
		flexDirection:'row',
		height:20,
		alignItems:'center'
	},
	topic:{
		backgroundColor:'#ffeee4',
		height:20,
		lineHeight:'20px',
		borderRadius:10,
		padding:'0 7px',
		color:'#9d8275',
		fontSize:11,
		marginLeft:9,
	},
  top_box:{
    height:80,
    backgroundColor:Common.Bg_White,
    display:'flex',
    flexDirection:'row',
  },
  topBlock:{
    display:'flex',
    flexDirection:'column',
    flex:1,
		width:devWidth/4,
    justifyContent:'center',
    alignItems:'center',
  },
  text1:{
    fontSize:20,
    color:Common.Activity_Text,
		fontWeight:'bold',
  },
  text2:{
    fontSize:Fnt_Small,
    color:Common.Gray,
  },
  classify_box:{
    backgroundColor:Common.Bg_White,
    width:devWidth,
		marginTop:10,
  },
	classify:{
		display:'flex',
		flex:4,
		flexDirection:'row',
		width:devWidth,
		height:60,
		flexWrap:'wrap',
	},
	line:{
		borderBottom:'solid 1px #f4f4f4',
		height:1,
		width:devWidth - 54,
		marginLeft:27,
	},
	sencond_block:{
		display:'flex',
		flex:2,
		flexDirection:'row',
		marginTop:10,
		width:devWidth,
		flexWrap:'wrap',
		backgroundColor:Common.Bg_White,
	},
	integral:{
		width:devWidth/2-1,
		borderLeft:'solid 1px #f4f4f4',
		height:60,
		display:'flex',
		flexDirection:'row',
		backgroundColor:Common.Bg_White,
		borderBottom:'solid 1px #f4f4f4',
		alignItems:'center'
	},
	num:{
		fontSize:Fnt_Normal,
		color:Common.Activity_Text,
		display:'flex',
		flex:1,
		justifyContent:'flex-end',
		marginRight:20,
	},
	set:{
		height:50,
		backgroundColor:Common.Bg_White,
		marginTop:10,
		display:'flex',
		flexDirection:'row',
		flex:1,
		alignItems:'center'
	},
	set_text:{
		marginLeft:20,
		fontSize:Fnt_Medium,
		color:Common.Black,
		display:'flex',
		flexDirection:'row',
		flex:1,
	},
	more:{
		marginRight:16,
		display:'flex',
		flexDirection:'row',
		flex:1,
		justifyContent:'flex-end'
	},
	zzc:{
		width: devWidth,
		height: devHeight,
		backgroundColor:'#cccccc',
		position:'absolute',
		opacity: 0.5,
		zIndex: 998,
		top:0,
	},
	red_point:{
		width:7,
		height:7,
		backgroundColor:Common.red,
		borderRadius:'50%',
		position:'absolute',
		zIndex:2,
		top:25,
		left:8
	}
};
export default PersonalCenter;
