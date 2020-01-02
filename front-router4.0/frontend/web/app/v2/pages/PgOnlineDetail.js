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
import PolyvVideo from '../components/PolyvVideo';
import OnlineAlert from '../components/OnlineAlert';
import DataPrompt from '../components/DataPrompt'
import FullLoading from '../components/FullLoading';
import Dm from '../util/DmURL';
import Common from '../Common';
import Guide from '../components/Guide'

var countdown;
class PgOnlineDetail extends React.Component {
	constructor(props) {
		super(props);
		this.video = {}
		this.wx_config_share_home = {
			title: '',
			desc: '',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link',
		};
		this.state = {
			select: false,
			w_width: devWidth,
			title_img: '',
			title: '',
			title_brief: '',
			catalog: [],
			isCollected: false,
			authority: false,
			starCount: '',
			commitList: [],
			listCount: '',
			logo: [],
			question: [],
			prop_video: {},
			video: null,
			changeCollectedType: '',
			videoShow: false,
			readyVideo: null,
			isShow: false,
			isShow2: false, //1017 移动端断点续播功能改造：控制弹窗显示与否
			isShow2Alert: '', //1017 移动端断点续播功能改造：弹窗
			lastLearn:{}, //上次观看记录{章节，秒数}
			isLogin: true,
			teacher: [],
			isLoading: true,
			learn_num: 0,
			online_product: [],
			question_count: 0,
			isFree: true,//章节是否免费
			catalogIdx: this.props.location.state ? this.props.location.state.catalogIdx : 0,
			resource_count: null,
			//是否有资料下载更新的提示
			isNote: false,
			//弹框是否显示
			display: 'none',
			//弹框提示信息
			alert_title: '',
			//弹框的图标
			alert_icon: '',
			icon_width: 0,
			icon_height: 0,
			authority: false,//true:有权限看视频，false:没有权限
			accountId: '',//微信用户的ID
			isShowAndorid: false,
			isAndorid: isApple ? false : true, //如果是IOS 则为false
			isErr: 'none',//是否显示报错信息
			//课程是否下架
			err: '',//报错信息
		};
		this.select = ''

		this.isList = false;


	}

	_collect() {
		if (this.state.isLogin == false) {
			this.props.history.push(`${__rootDir}/login`)
		} else {
			Dispatcher.dispatch({
				actionType: 'Collect',
				resource_id: this.props.match.params.id,
				resource_type: 2
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

	_check_catalog(video) {
		// this.video = video
		this.setState({
			readyVideo: video,
			videoShow: false
		}, () => {
			Dispatcher.dispatch({
				actionType: 'PolySign',
				vid: this.state.readyVideo.vid,
				catalog_id: this.state.readyVideo.catalog_id,
				isFree: this.state.readyVideo.isFree,
				resource_id: this.props.match.params.id
			})
		})
	}

	_getVideoSign() {
		this.setState({
			isShow: true
		})
	}
	_getAndroidVideoSign() {
		this.setState({
			isShowAndorid: true
		})
	}
	_isAddShow() {
		this.setState({
			isShow: true
		})
	}

	_hideBlackGround() {
		this.setState({
			isShow: false,
			isNote: false
		})
	}
	// 移动端断点续播功能改造
	  isShow2Alert(obj){
	    return(
	      <div style={{...styles.alert}}>
	        <div style={{height:87,}}>
	           <div style={{paddingTop:17}}>
	             <span style={{fontSize:17,color:'#030303'}}>{obj.title}</span>
	           </div>
	           <div style={{lineHeight:1}}>
	             <span style={{fontSize:14,color:'#030303'}}>{obj.content}</span>
	           </div>
	         </div>
			<div style={{width:270,height:1,opacity:0.22,backgroundColor:'#4d4d4d'}}></div>
	           <div style={{...styles.alertBottom}}>
	             <div style={{flex:1,lineHeight:2.5}}>
	               {obj.leftButtom}
	             </div>
				 <div style={{height:43,width:1,opacity:0.22,backgroundColor:'#4d4d4d'}}></div>
	             <div style={{flex:1,lineHeight:2.5}}>
	               {obj.rightButtom}
	             </div>
	           </div>
	      </div>
	    )
	  }
  cancelPlay2(){
    this.setState({
      isShow2:false
    })
  }
  // 断点续播功能
  doPlay2(){
	window.setTimeout(() => {
		var cl = this.refs.catalogList,
			re = cl.props,
			index = this.state.lastLearn.catalog_index,
			ca = re.catalog[index];
			ca.video['start'] = this.state.lastLearn.exit_time
		cl._select(this.state.lastLearn.catalog_id,Object.assign(ca.video, {isFree: ca.isFree, exam: ca.exam, catalogIdx: index}))
	}, 500);
	this.cancelPlay2()
  }
	_handleOnlineLoadDetail(re) {
		console.log('_handleOnlineLoadDetail==', re);
		if (re && re.err) {
			this.setState({
				isLoading: false,
				isErr: 'block',
				err: re.err
			})
			return false
		}
		if (re && re.result) {
			var req = re.result;
			if(re && re.user && re.user.isLogined && (typeof req.lastLearn.exit_time !="undefined")){
				this.setState({
					lastLearn: req.lastLearn
				})
				  var title = '是否继续',
				  content = (
				    <div>
				        <div>上一次未观看完毕，您是否继续观看？</div>
				    </div>
				  ),
				  leftButtom = (
				    <span onClick={this.cancelPlay2.bind(this)} style={{fontSize:17,color:'#666666'}}>取消</span>
				  ),
				  rightButtom = (
				    <span onClick={this.doPlay2.bind(this)} style={{fontSize:17,color:'#0076ff'}}>确认</span>
				  ),
				  obj = {
				  title: title,
				  content: content,
				  leftButtom: leftButtom,
				  rightButtom: rightButtom,
				  centerButtom: null,
				}
				this.setState({
				  isShow2: true,
		          isShow2Alert: this.isShow2Alert(obj)
				});
			}
			this.wx_config_share_home = {
				title: req.title,
				desc: req.online_brief,
				link: document.location.href,
				imgUrl: req.brief_image,
				type: 'link',
				success: function () {
					// 用户确认分享后执行的回调函数
					//分享任务接口,8 视频课 / 9 直播课 / 10 线下课 / 11 专题课
					Dispatcher.dispatch({
						actionType: 'PostShareTask',
						type: 8,
					})
				},
			};
				EventCenter.emit("SET_TITLE",req.title)
			this.setState({
				title_img: req.brief_image,
				title: req.title,
				title_brief: req.online_brief,
				catalog: req.catalogs,
				isCollected: req.isCollected,
				authority: req.authority,
				starCount: req.commentStar,
				commitList: req.comments,
				listCount: req.listCount,
				logo: req.associations,
				question: req.questions,
				prop_video: req.video,
				// readyVideo: Object.assign({},{isFree: req.catalogs[0].isFree}, req.catalogs[0].video, {exam: req.catalogs[0].exam}),
				changeCollectedType: req.isCollected,
				teacher: req.teachers,
				isLogin: re.user.isLogined,
				accountId: re.user.accountId || '',
				learn_num: req.learn_num,
				isFree: req.isFree,
				authority: req.authority,
				online_product: req.productInfo,
				question_count: req.questionCount,
				isLoading: false,
				resource_count: req.resource_count,
			}, () => {

				Dispatcher.dispatch({
					actionType: 'WX_JS_CONFIG',
					onMenuShareAppMessage: this.wx_config_share_home
				})
				EventCenter.emit('getCatalogDetail', Object.assign({}, { catalog: this.state.catalog }, { id: this.props.match.params.id }))
			})
		}
	}

	_handleDoCollect(re) {

	}

	_handleAddLesson(re) {
		if (re.err) {
			//提示框
			this.setState({
				display: 'block',
				alert_title: re.err,
				alert_icon: failure_icon,
				icon_width: failure_width,
				icon_height: failure_height,

			}, () => {
				countdown = setInterval(()=> {
					clearInterval(countdown);
					this.setState({
						display: 'none',
					})
				}, 1500);
			});

			return false;
		}

		if (re.result) {
			//加入学习成功
			this.setState({//隐藏加入学习弹框
				isShow: false,
			})
			this.setState({
				display: 'block',
				alert_title: '加入学习成功！',
				alert_icon: success_icon,
				icon_width: suc_widthOrheight,
				icon_height: suc_widthOrheight,
			}, () => {
				countdown = setInterval(()=> {
					clearInterval(countdown);
					this.setState({
						display: 'none',
					})
				}, 1500);
			});
		}
	}

	_handleHideAlert() {
		this.setState({
			isShow: false,
			isNote: false,
			isNote: false
		})
	}

	_handleApplyVoucher() {
		this.setState({
			isShow: false
		}, () => {
			this.props.history.push({ pathname: `${__rootDir}/freeInvited` })
		})
	}

	_handleShowAlert() {
		this.setState({

		})
	}

	_handleSign(re) {
		if (re.result.length < 1 || this.state.isLogin == false) {
			return
		}
		this.video = {}
		this.video =
			Object.assign(
				this.video,
				re.result,
				{
					title_img: this.state.title_img,
					isFree: true,
					type: 'online_info',
					catalog_id: this.state.readyVideo.catalog_id,
					resource_id: this.props.match.params.id,
					exam: this.state.readyVideo.exam,
					catalogIdx: this.state.readyVideo.catalogIdx,
					start: this.state.readyVideo.start
				})
		if (!this.video || !this.video.sign) { return }
		this.setState({
			video: null
		}, () => {
			this.setState({
				video: this.video,
				videoShow: true
			}, () => {
				window.setTimeout(() => {
					EventCenter.emit("InitPolyvPlayer")
				}, 500);
			})
		})
	}

	_handleJumpToExam(re) {
		this.props.history.push({ pathname: `${__rootDir}/exam/${re.resource_id}/${re.catalog_id}`, query: null, hash: null, state: { catalogIdx: re.catalogIdx,catalogTitle:this.state.readyVideo.catalogTitle } })
	}

	_handleJumpToDiscount(re) {
		this.props.history.push({ pathname: `${__rootDir}/useDiscount/2/${this.props.match.params.id}` })
	}

	_isInsertLearnRecord(re) {

	}

	_handleAddLearnRecord(re) {
		if (re) {
			Dispatcher.dispatch({
				actionType: 'AddLearnRecord',
				id: this.props.match.params.id,
				catalog_id: re.catalog_id,
				start_time: re.start_time,
				end_time: re.end_time,
				client_type: 1
			})
		}
	}

	Login() {
		this.props.history.push({ pathname: `${__rootDir}/login` })
	}

	onlineToProduct(id) {
		this.props.history.push({ pathname: `${__rootDir}/productDetail/${id}` })
	}

	resumePlayer() {
		this.setState({
			isShowAndorid: false,
			isAndorid: false
		})
		EventCenter.emit("resumePlayer")
	}
	gotoDownload() {
		window.location = "https://mb.bolue.cn/dlapp";
	}
	noMore() {
		this.setState({
			isShowAndorid: false,
			isAndorid: false
		})
		EventCenter.emit("resumePlayer")
		var AndroidNoMoreAlert = localStorage.getItem("AndroidNoMoreAlert")
		var openID = localStorage.getItem("credentials.openid")
		if (!AndroidNoMoreAlert) {
			AndroidNoMoreAlert = openID
		} else {
			AndroidNoMoreAlert += ',' + openID
		}
		localStorage.setItem("AndroidNoMoreAlert", AndroidNoMoreAlert);
	}
	cancel() {
		this.setState({
			isShowAndorid: false,
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE", '铂略财课-视频课详情页')
		if (this.props.location.state && this.props.location.state.isDownload) {
			this.setState({
				isNote: true
			})
		}
		var AndroidNoMoreAlert = localStorage.getItem("AndroidNoMoreAlert")
		var openID = localStorage.getItem("credentials.openid")
		if (AndroidNoMoreAlert) {
			var AndroidNoMoreAlertArr = AndroidNoMoreAlert.split(',')
			for (var i = 0; i < AndroidNoMoreAlertArr.length; i++) {
				if (openID == AndroidNoMoreAlertArr[i]) {
					this.setState({
						isAndorid: false
					})
					break
				}
			}
		}

		backNotloadIndex = 'PgDetail'
		this._addLearnRecord = EventCenter.on('AddLearnRecord', this._handleAddLearnRecord.bind(this))
		this._learnRecordIsInsert = EventCenter.on('AddLearnRecordDone', this._isInsertLearnRecord.bind(this))
		this._onlineDetail = EventCenter.on('OnlineLoadDetailDone', this._handleOnlineLoadDetail.bind(this))
		this._getSign = EventCenter.on('PolySignDone', this._handleSign.bind(this))
		this._doCollect = EventCenter.on('CollectDone', this._handleDoCollect.bind(this))
		this._ChooseCatalog = EventCenter.on('ChooseCatalog', this._check_catalog.bind(this))
		this._hideAlert = EventCenter.on('HideAlert', this._handleHideAlert.bind(this))
		this._applyVoucher = EventCenter.on('ApplyVoucher', this._handleApplyVoucher.bind(this))

		this._addLesson = EventCenter.on('AddLessonDone', this._handleAddLesson.bind(this))
		this._isAddShow = EventCenter.on('isAddShow', this._isAddShow.bind(this))

		this._Jump = EventCenter.on('JumpToExam', this._handleJumpToExam.bind(this))
		this._JumpToDiscount = EventCenter.on('PropToDiscount', this._handleJumpToDiscount.bind(this))
		Dispatcher.dispatch({
			actionType: 'OnlineLoadDetail',
			id: this.props.match.params.id
		})
	}
	componentWillUnmount() {
		this._addLearnRecord.remove()
		this._learnRecordIsInsert.remove()
		this._onlineDetail.remove()
		this._getSign.remove()
		this._doCollect.remove()
		this._ChooseCatalog.remove()
		this._hideAlert.remove()
		this._Jump.remove()
		this._JumpToDiscount.remove()
		localStorage.removeItem('CatalogIdx')
		AddLearnRecordLeave()
		this._addLesson.remove()
		this._isAddShow.remove()
		this._applyVoucher.remove()
		clearInterval(countdown)
	}
	cancelErr(re) {
		this.props.history.go(-1)
	}
	render() {
		var score
		var assLogo
		var quest
		var hrStyle
		var playType = true
		if (this.state.isLogin == false) {
			playType = false
		} else {
			playType = true
		}
		if (this.state.commitList === null) {
			score = 5
			this.isList = false
		} else if (this.state.commitList.length >= 1) {
			score = this.state.starCount
			this.isList = true
		}
		if (this.state.logo.length < 1) {
			assLogo = false
		} else {
			assLogo = true
		}
		if (this.state.question.length < 1) {
			quest = false
		} else {
			quest = true
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

		// catalog组件传值
		let props = {
			catalog: this.state.catalog,
			authority: this.state.authority,
			catalogIdx: this.state.catalogIdx,
			resource_count: this.state.resource_count,
			//id:this.props.match.params.id,
		}

		//弹框组件传值
		let alertProps = {
			id: this.props.match.params.id,
			isShow: this.state.isShow,
			resource_count: this.state.resource_count,
			type: 2,
		}

		// 星星组件传值
		let starOverScore = {
			right: 6,
			star: score,
			canChange: false,
			score: score,
			propScore: score, //外部传数 （固定分数）
			scoreShow: false,
			width: 11,
			height: 11
		}
		// 评论组件传值
		let commentProps = {
			comList: this.state.commitList,
			isList: this.isList,
			id: this.props.match.params.id,
			isLogin: this.state.isLogin,
			detail: 'detail'
		}
		// 老师介绍组件传值
		let teacher = {
			t_detail: this.state.teacher
		}


		var logo = this.state.logo.map((item, index) => {
			return (
				<div key={index} style={{ ...styles.ass_logo_div }}>
					{/*	<img src={item.logo} style={{...styles.ass_logo}} />*/}
					{item.name}
				</div>
			)
		});

		var question = this.state.question.map((item, index) => {
			return (
				<Link to={`${__rootDir}/QaDetail/${item.id}`} key={index}>
					<div>
						<div style={{ ...styles.question_title }}>
							<span style={{ color: '#333', fontSize: 14, marginBottom: 12 }} dangerouslySetInnerHTML={{__html: item.title}}></span>
						</div>
						<div style={{ marginLeft: 12, marginBottom: 18, marginRight: 12 }}>
							<img src={Dm.getUrl_img('/img/v2/icons/online_QA@2x.png')} style={{ width: 12, height: 12, position: 'relative', top: 1, marginRight: 5 }} />
							<span style={{ color: '#999', fontSize: 11 }}>{item.question_answer_num}</span>
							<span style={{ marginRight: 12, color: '#999', fontSize: 12 }}>回答</span>
							<span style={{ marginRight: 6, color: '#999', fontSize: 12, float: 'right' }}>{new Date(item.create_time).format("yyyy-MM-dd")}</span>
						</div>
					</div>
				</Link>
			)
		})

		if (this.state.online_product) {
			var onlineProduct = this.state.online_product.map((item, index) => {
				return (
					<div key={index} style={{ marginBottom: 15 }} onClick={() => { this.onlineToProduct(item.id) }}>
						<div style={{ display: 'flex', flexDirection: 'row', fontSize: 14, color: '#666', flexGrow: 1, marginLeft: 20 }}>
							{item.title}
							<div style={{ display: 'flex', flexDirection: 'row-reverse', flexGrow: 1, marginRight: 14 }}>
								<img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{ width: 8, height: 14 }} />
							</div>
						</div>
					</div>
				)
			})
		} else {
			var onlineProduct = <div></div>
		}
		var videoAndroidShow
		return (
			<div style={{ backgroundColor: '#fff', height: devHeight, display: 'flex', flexDirection: 'column' }}>
				<FullLoading isShow={this.state.isLoading} />
				<div style={{ height: devHeight, width: devWidth, backgroundColor: '#000', opacity: 0.5, position: 'absolute', zIndex: 1000, display: this.state.isShow || this.state.isNote ? 'block' : 'none' }} onClick={this._hideBlackGround.bind(this)}></div>
				<OnlineAlert {...alertProps} />
				<DataPrompt isShow={this.state.isNote} />
				<div style={{ height: 236, display: this.state.videoShow ? 'none' : 'block' }}>
					<img src={this.state.title_img} style={{ ...styles.top_img }} />
					<img src={Dm.getUrl_img('/img/v2/icons/play@2x.png')} style={{ ...styles.start, display: playType ? 'block' : 'none' }} onClick={this._getVideoSign.bind(this)} />
					<div style={{ ...styles.login, display: playType ? 'none' : 'block' }} onClick={this.Login.bind(this)}>登录</div>
				</div>
				<div style={{ height: 236, position: 'absolute', width: 360, zIndex: 99999, display: (this.state.videoShow && this.state.isAndorid) ? 'block' : 'none' }} onClick={this._getAndroidVideoSign.bind(this)}></div>
				<PolyvVideo lastLearn={this.state.lastLearn} accountId={this.state.accountId} video={this.state.video} videoShow={this.state.videoShow} ref="polyvPlayer" />
				<hr style={{ border: 'none', height: 1, backgroundColor: '#e5e5e5' }} />
				<div style={{ flex: 1, overflow: 'scroll' }}>
					<div style={{ ...styles.t_title_div }}>
						<p style={{ ...styles.t_title, color: '#050505', fontSize: 17 }}>{this.state.title}</p>
						<div style={{ marginBottom: 6, marginTop: 5 }}>
							<div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
								<img src={this.state.isFree ? Dm.getUrl_img('/img/v2/icons/isFree@2x.png') : Dm.getUrl_img('/img/v2/icons/isNotFree@2x.png')} style={{ width: 38, height: 14 }} />
								<div style={{ position: 'relative', top: -9, marginLeft: 12 }}>
									<Star {...starOverScore} />
								</div>
								<span style={{ marginLeft: 4, position: 'relative', top: -1, fontSize: 12, color: '#f37633' }}>{this.state.commitList === null ? '5.0' : this.state.starCount.toString().split('.').length > 1 ? this.state.starCount : this.state.starCount + '.0'}</span>
								{/*倒序排列*/}
								<div style={{ display: 'flex', flexGrow: 1, marginLeft: 50 }}>
									<img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} style={{ width: 11, height: 11, position: 'relative', top: 3.3 }} />
									<span style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>{this.state.learn_num}</span>
								</div>
							</div>
						</div>
						<p style={{ fontSize: 14, color: '#666', lineHeight: '18px' }}>{this.state.title_brief}</p>
					</div>
					<hr style={{ ...styles.t_hr }}></hr>
					<div style={{ backgroundColor: '#fff' }}>
						<div>
							{/*<div style={{...styles.logo}}></div>*/}
							<img src={Dm.getUrl_img('/img/v2/icons/teacher@2x.png')} style={{ ...styles.logo, height: 18 }} />
							<span style={{ ...styles.logo_title, color: '#000', fontSize: 16 }}>讲师介绍</span>
						</div>

						<TeacherDetail {...teacher} />
						<hr style={{ ...styles.t_hr }}></hr>
					</div>

					<div style={{ backgroundColor: '#fff', display: this.state.online_product ? 'block' : 'none' }}>
						<div style={{ marginBottom: 3 }}>
							{/*<div style={{...styles.logo}}></div>*/}
							<img src={Dm.getUrl_img('/img/v2/icons/online_product@2x.png')} style={{ ...styles.logo, height: 20, width: 16 }} />
							<span style={{ ...styles.logo_title, verticalAlign: 'text-bottom', color: '#000', fontSize: 16 }}>所属专题</span>
						</div>
						{onlineProduct}
						<hr style={{ ...styles.teacher_hr, marginBottom: 16 }} />
					</div>

					<div style={{ backgroundColor: '#fff' }}>
						<div style={{ paddingBottom: 12 }}>
							{/*<div style={{...styles.logo}}></div>*/}
							<img src={Dm.getUrl_img('/img/v2/icons/menu@2x.png')} style={{ ...styles.logo, height: 18 }} />
							<span style={{ ...styles.logo_title, color: '#000', fontSize: 16 }}>章节目录</span>
						</div>

						<CatalogList {...props} ref="catalogList"/>

						<hr style={{ ...styles.teacher_hr, marginBottom: 0 }}></hr>
					</div>

					<div style={{ backgroundColor: '#fff', display: assLogo ? 'block' : 'none' }}>
						<div style={{ marginTop: 15 }}>
							{/*<div style={{...styles.logo}}></div>*/}
							<img src={Dm.getUrl_img('/img/v2/icons/parter@2x.png')} style={{ ...styles.logo, height: 18, width: 18 }} />
							<span style={{ ...styles.logo_title, color: '#000', fontSize: 16 }}>合作机构</span>
						</div>
						<div style={{ margin: '12px 12px 0 12px' }}>
							{logo}
						</div>
					</div>
					<hr style={{ ...styles.teacher_hr, marginTop: 8, marginBottom: 0, display: assLogo ? 'block' : 'none' }}></hr>

					<div style={{ height: 46, display: 'flex', marginBottom: 12, lineHeight: '46px' }}>
						<img src={Dm.getUrl_img('/img/v2/icons/comment@2x.png')} style={{ ...styles.logo, height: 18, width: 18, marginTop: 14 }} />
						<span style={{ ...styles.logo_title, color: '#000', fontSize: 16 }}>评价</span>
						<div>
							<span style={{ fontSize: 13, color: '#999', marginLeft: 6 }}>({this.state.commitList === null ? '0' : this.state.listCount})</span>
							{/*<span style={{marginTop: 8, marginRight: 12}}>></span>*/}
						</div>
					</div>

					<CommentList {...commentProps} />
					<div style={{ backgroundColor: '#fff', minHeight: 100, }}>
						<div style={{ paddingBottom: 10, height: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<img src={Dm.getUrl_img('/img/v2/icons/lesson_qa@2x.png')} style={{ height: 18, width: 18, marginLeft: 12, marginRight: 10, marginBottom: 2 }} />
							<span style={{ color: Common.Light_Black, fontSize: Fnt_Large, fontWeight: 'bold' }}>问答列表</span>
							<span style={{ fontSize: 14, color: '#999', marginLeft: 4, }}>({this.state.question_count})</span>
						</div>
						{question}
						<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/AskQuestion` : `${__rootDir}/login`, hash: null, query: null, state: { type: 'online', id: this.props.match.params.id } }}>
							<div style={{ ...styles.no_comment_div, backgroundColor: '#2196f3', display: quest ? 'none' : 'block' }}>
								<img src={Dm.getUrl_img('/img/v2/icons/white-qa@2x.png')} style={{ width: 16, height: 18, float: 'left', marginTop: 4, }} />
								<div style={{ ...styles.qa_text }}>
									提第一个问题
									</div>
							</div>
						</Link>
						<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/lessonQuestion/online/${this.props.match.params.id}` : `${__rootDir}/login`, hash: null, query: null, state: { type: 'online', id: this.props.match.params.id } }}>
							<div style={{ ...styles.have_comment_div, backgroundColor: '#ffffff', display: quest ? 'block' : 'none' }}>
								<div style={{ ...styles.no_comment_txt }}>
									查看所有问题
									</div>
							</div>
						</Link>
						{/*<hr style={{...styles.teacher_hr, marginTop: 0, marginBottom: 0, display: assLogo ? 'block' : 'none'}}></hr>*/}
					</div>

				</div>
				<div style={{ backgroundColor: '#fff', width: devWidth, height: 50 }}>
					<hr style={{ height: 1, backgroundColor: '#f3f3f3', border: 'none' }} />
					<div style={{ padding: '6px 0px 0px 0px' }}>
						<div style={{ float: 'left', width: devWidth / 3, textAlign: 'center' }} onClick={this._collect.bind(this)}>
							<img src={Dm.getUrl_img('/img/v2/icons/QAguanzhu@2x.png')} style={{ height: 18, width: 18, display: this.state.changeCollectedType ? 'none' : 'block', marginLeft: (devWidth / 3 - 20) / 2 }} />
							<img src={Dm.getUrl_img('/img/v2/icons/online-Fouces@2x.png')} style={{ height: 18, width: 18, display: this.state.changeCollectedType ? 'block' : 'none', marginLeft: (devWidth / 3 - 20) / 2 }} />
							<span style={{ fontSize: 13, color: this.state.changeCollectedType ? '#2196f3' : '#666', marginLeft: this.state.changeCollectedType ? 0 : 4 }}>{this.state.changeCollectedType ? '取消关注' : '关注'}</span>
						</div>
						<Link to={{ pathname: this.state.isLogin ? `${__rootDir}/AskQuestion` : `${__rootDir}/login`, hash: null, query: null, state: { type: 'online', id: this.props.match.params.id } }}>
							<div style={{ float: 'left', width: devWidth / 3, textAlign: 'center' }}>
								<img src={Dm.getUrl_img('/img/v2/icons/QAhuida.png')} style={{ height: 17, width: 15, marginLeft: (devWidth / 3 - 15) / 2, display: 'block', }} />
								<span style={{ fontSize: 13, color: '#666' }}>提问</span>
							</div>
						</Link>
						<div style={{ width: devWidth / 3, textAlign: 'center', float: 'left' }}>
							<Link to={this.state.isLogin ? `${__rootDir}/comment/${this.props.match.params.id}` : `${__rootDir}/login`}>
								<img src={Dm.getUrl_img('/img/v2/icons/QApinglun@2x.png')} style={{ height: 18, width: 17, marginLeft: (devWidth / 3 - 18) / 2, display: 'block' }} />
								<span style={{ fontSize: 13, color: '#666' }}>评价</span>
							</Link>
						</div>
					</div>
				</div>

				<div style={{ ...Common.alertDiv, display: this.state.display }}>
					<div style={{ marginBottom: 14, paddingTop: 15, height: 30, }}>
						<img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height} />
					</div>
					<span style={{ color: Common.BG_White }}>{this.state.alert_title}</span>
				</div>

				<div style={{ ...styles.zzc, display: this.state.isShowAndorid ? 'block' : 'none' }} onClick={this.cancel.bind(this)}></div>
				<div style={{ ...styles.white_alert, paddingTop: -1, display: this.state.isShowAndorid ? 'block' : 'none' }}>
					<div style={{ marginTop: 20, fontSize: 17, color: Common.Black, fontWeight: 'bold' }}>提示</div>
					<div style={{ color: '#333', fontSize: 13, lineHeight: '20px', }}>使用微信观看视频，学习时长记录可能不</div>
					<div style={{ color: '#333', fontSize: 13, lineHeight: '20px', marginBottom: 32 }}>准确，建议下载APP使用</div>
					<div style={styles.alert_bottom}>
						<span style={{ fontSize: 17, color: '#2196F3' }} onClick={this.gotoDownload.bind(this)}>下载APP</span>
					</div>
					<div style={styles.alert_bottom} onClick={this.resumePlayer.bind(this)}>
						<span style={{ fontSize: 17, color: '#2196F3' }}>继续观看</span>
					</div>
					<div style={styles.alert_bottom} onClick={this.noMore.bind(this)}>
						<span style={{ fontSize: 17, color: '#2196F3' }}>不再提醒</span>
					</div>
				</div>
				{this.state.isNote ?
					null : <Guide type={'online'} />
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
				<div style={{...styles.zzc,display:this.state.isShow2 ?'block':'none'}}></div>
				{
				  this.state.isShow2 ? this.state.isShow2Alert : null
				}
				{/*弹框*/}
			</div>
		)

	}
}

var styles = {
	start: {
		position: 'relative',
		marginLeft: devWidth / 2 - 50,
		// zIndex: 1,
		width: 100,
		height: 100,
		top: 74,
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
		// paddingBottom: 5,
		paddingTop: 12,
		fontSize: 17,
		color: '#333',
	},
	t_hr: {
		backgroundColor: '#e5e5e5',
		border: 'none',
		height: 1,
		marginBottom: 12,
		marginTop: 15
	},
	logo_title: {
		color: '#333',
		fontSize: 13,
	},
	teacher_img: {
		width: 43,
		height: 43,
		borderRadius: 50,
		display: 'inline-block',
		marginRight: 10
	},
	teacher_hr_margin: {
		backgroundColor: '#f3f3f3',
		border: 'none',
		height: 1,
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
		backgroundColor: '#e5e5e5',
		border: 'none',
		height: 1,
		marginBottom: 15,
		marginTop: 15
	},
	logo: {
		marginLeft: 12,
		// border:'1px solid',
		width: 16,
		height: 16,
		// borderColor: 'red',
		display: 'inline-block',
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
		backgroundColor: '#f6f6f6',
		borderRadius: 4,
		paddingLeft: 13,
		border: 'none',
	},
	br_div: {
		border: '1px solid',
		borderColor: '#e5e5e5',
		borderLeft: 'none',
		borderRight: 'none',
		height: 12,
		backgroundColor: '#f4f4f4',
		// marginBottom: 10
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
	login: {
		position: 'absolute',
		marginLeft: devWidth / 2 - 45,
		marginTop: 236 / 2 - 20,
		width: 90,
		backgroundColor: '#f37633',
		fontSize: 16,
		height: 40,
		textAlign: 'center',
		lineHeight: '40px',
		color: '#fff',
		borderRadius: 30
	},
	no_comment_txt: {
		color: '#2196f3',
		fontSize: 12,
		height: 24,
		lineHeight: '24px',
		textAlign: 'center',
	},
	no_comment_div: {
		width: 100,
		height: 27,
		borderRadius: 4,
		padding: '3px 14px',
		margin: '0 auto',
	},
	have_comment_div: {
		width: 90,
		height: 24,
		border: '1px solid',
		borderRadius: 4,
		borderColor: '#666',
		padding: '0px 14px',
		margin: '0 auto',
		borderColor: '#2196f3',
		marginBottom: 20
	},
	white_alert: {
		width: 270,
		height: 247,
		backgroundColor: Common.Bg_White,
		borderRadius: 12,
		position: 'absolute',
		zIndex: 99999,
		top: 180,
		left: (devWidth - 270) / 2,
		textAlign: 'center',
	},
	alertBottom:{
	  display:'flex',
	  width:270,
	  height:43,
	},
	alert:{
	  width:270,
	  height:130,
	  backgroundColor:'#ffffff',
	  borderRadius:'12px',
	  position:'absolute',
	  zIndex:99999,
	  top: 'calc(50% - 65px)',
	  left: (devWidth-270)/2,
	  textAlign:'center'
	},
	alert_bottom: {
		width: 270,
		height: 42,
		lineHeight: 2.5,
		borderTopStyle: 'solid',
		borderTopWidth: 1,
		borderTopColor: '#d4d4d4',
		// display:'flex',
		textAlign: 'center',
		// flex:1,
	},
	zzc: {
		width: devWidth,
		height: devHeight,
		backgroundColor: '#cccccc',
		position: 'absolute',
		opacity: 0.5,
		zIndex: 99998,
		top: 0,
	},
}

export default PgOnlineDetail;
