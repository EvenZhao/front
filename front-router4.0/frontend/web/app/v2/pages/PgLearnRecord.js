/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from './ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import LiveLessonDiv from '../components/LiveLessonDiv';
import OfflineLessonDiv from '../components/OfflineLessonDiv';
import Dm from '../util/DmURL'
import Loading from '../components/Loading';
import Star from '../components/star';
import FullLoading from '../components/FullLoading';

// import scrollHelper from '../../components/scrollHelper.js';
var limit = 15;
var skip = 0;
class PgLearnRecord extends React.Component {
	constructor(props) {
    super(props);
		this.wx_config_share_home = {
				title: '最近学习-铂略咨询',
				desc: '铂略咨询-财税领域实战培训供应商',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
		this.state = {
			listHeight: devHeight-42.5,
      learnRecordData: [],
			loadmore: true,
			isShow: false,
			canNotLoad: false,
			isLoading: true,
			isOver: false,
			loadLength: '',
			reservedLives: []
		};
	}

  _handlelearnRecordDone(re) {
		var result =  re.result ? re.result : [];
		// if (result.length > 0) {
			// console.log('_handlelearnRecordDone',result);
			console.log('_handlelearnRecordDone----',result);
			this.setState({
				reservedLives: re.reservedLives.length > 0 ? re.reservedLives : [],
	      learnRecordData: result || [],
				loadmore: result.length >= limit ? true : false,
				isLoading: false
	    })
		// }
		this.backNotload={
			list: result
		}
		backNotload = this.backNotload
	}
	_handlelearnRecordLoadMoreDone(re){
		var result =  re.result ? re.result : [];
		if (result.length > 0) {
			console.log('_handlelearnRecordDone',result);
			this.setState({
	      learnRecordData: this.state.learnRecordData.concat(result),
				loadmore: result.length >= limit ? true : false,
				isShow: false,
				loadLength: result.length,
				canNotLoad: false
	    },()=>{
				this.backNotload={
					list: this.state.learnRecordData || []
				}
			})
			backNotload = this.backNotload
		}
	}
	_gotoLoadMore(re){
		skip = this.state.learnRecordData.length || 0
		Dispatcher.dispatch({
			actionType: 'learnRecord',
			limit: limit,
			skip: skip,
			loadmore: true
		})
	}
	_learnRecordloadMore() {
		if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
			if(this.state.canNotLoad == true) {
				return
			}
			if(this.state.loadmore == true) {
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
	_handleCanNotLoad() {
		this.setState({
			canNotLoad: true
		})
	}
	componentWillMount() {
		if (backNotload && backNotloadIndex == 'PgDetail') {//因为观看记录的详情页调用视频课 直播课的详情 所以PgDetail公用
			if (backNotload.list.length > 0) {
				this.setState({
					learnRecordData: backNotload.list || [],
					isLoading: false
				})
			}else {
				Dispatcher.dispatch({
					actionType: 'learnRecord',
					limit: limit,
					skip: 0
				})
			}
			setTimeout(()=>{
				console.log('this.lessonList',this.lessonList.scrollHeight);
				this.lessonList.scrollTop= backNotloadTop;

			} , 50)
			backNotload = ''
			backNotloadIndex = ''
		}else {
			Dispatcher.dispatch({
				actionType: 'learnRecord',
				limit: limit,
				skip: 0
			})
		}
	}
	componentDidMount() {
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE",'铂略财课-最近学习')
    this._getlearnRecordDone = EventCenter.on('learnRecordDone',this._handlelearnRecordDone.bind(this))
		this._getlearnRecordLoadMoreDone = EventCenter.on('learnRecordLoadMoreDone',this._handlelearnRecordLoadMoreDone.bind(this))
		this._canNotLoad = EventCenter.on('canNotLoad', this._handleCanNotLoad.bind(this))
	}
	componentWillUnmount() {
    this._getlearnRecordDone.remove()
		this._getlearnRecordLoadMoreDone.remove()
		this._canNotLoad.remove()
		backNotloadTop = this.lessonList.scrollTop
	}
	render(){

		var listNull = (
			<div style={{textAlign:'center',paddingTop:70}}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{marginTop:51}}>
					<span style={{fontSize:13,color:'#333333'}}>暂无学习记录哦，快去学习吧~</span>
				</div>
			</div>
		)
		var joinDate;
		var learnRecord = this.state.learnRecordData.map((item,index)=>{
			var joinDispaly = 'block'
			if (joinDate == item.join_date && index != 0) {
				joinDispaly = 'none'
			}
			joinDate = item.join_date;
			if (item.resource_type == 1) {
				var free;
				var padT =0;
				var padB =15;
				var test;
				var width;
				var height;
				var liveType;
				var color;
				var borderColor;
				var typeWidth;
				var reserved
				var liveStatusType
	      var learnNumType
				var isReserve = false;
				var imgStatus;

				if(this.state.reservedLives && this.state.reservedLives.length > 0) {
	        this.state.reservedLives.map((rows, idx) => {
	          if(rows.id == item.id) {
	            reserved = item.id
	          }
	        })
	      }

				if(devWidth != 375) {
					width = (devWidth / 375)*127
					height = width / 1.58
				} else {
					width = 127
					height = 80
				}
				if(item.isFree) {
					free = ""
				} else {
					free = "none"
				}
				// if(index == 0) {
				// 	padT = 15,
				// 	padB = 15
				// } else {
				// 	padT = 0,
				// 	padB = 15
				// }
				if(item.exam_mark === 1) {
					test = 'inline-block'
				} else {
					test = 'none'
				}
				if(item.id == reserved) {
	        isReserve = true;//已预约
	      }
				if(item.status == 0) {//尚未开始
					//liveStatusType = '尚未开始'
					imgStatus =(
						<div style={styles.img_status}>
							<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_notStarted@2x.png')} />
						</div>
					)
				}
				else if (item.status == 1) {//正在直播
						//learnNumType = '已预约'
						imgStatus =(
							<div style={styles.img_status}>
								<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_starting@2x.png')} />
							</div>
						)
				}
				else if(item.status == 2) {//直播结束
					imgStatus =(
						<div style={styles.img_status}>
							<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_started@2x.png')} />
						</div>
					)
				}
				else if (item.status == 3) {//即将开始
					imgStatus=(
						<div style={styles.img_status}>
							<img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_start@2x.png')} />
						</div>
					)
				}

				var liveSeriesImg
	      if(item.liveSeries == 3) {
	        liveSeriesImg = Dm.getUrl_img('/img/v2/icons/CFO@2x.png')
	      } else if(item.liveSeries == 4) {
	        liveSeriesImg = Dm.getUrl_img('/img/v2/icons/SZT@2x.png')
	      } else {
	        liveSeriesImg = null
	      }
				return(
					<div key={index}>
						<div style={{display:joinDispaly,marginLeft:12}}>
							<div style={{...styles.joinBorder}}></div>
							<div><span style={{fontSize:13,color:'#666666'}}>{item.join_date}</span></div>
						</div>
						<Link to={`${__rootDir}/lesson/live/${item.id}`} >
		        <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height, marginLeft: devWidth < 350 ? 10 : 12}} ref={(lesson) => this.lesson = lesson}>
		            <img style={{...styles.lessonPng, width: width, height: height, marginRight: devWidth < 350 ? 8 : 15}} src={item.brief_image} />
								{isReserve ?
									<div style={{width:32,height:32,position:'absolute',zIndex:99,top:0,left:0,}}><img width={32} height={32} src={Dm.getUrl_img('/img/v2/course/live_leftTop@2x.png')} /></div>
									:
									null
								 }
		            <div style={{...styles.imgBlack, width: width-8,paddingLeft:8}}>
								{new Date(item.start_time).format("MM-dd")}&nbsp;&nbsp;&nbsp;{new Date(item.start_time).format("hh:mm")}-{new Date(item.end_time).format("hh:mm")}
								</div>
		            <div style={{marginBottom: 15}}>
		              <div style={{...styles.span, fontSize: devWidth < 350 ? 12 : 14}}>{imgStatus}<span style={{paddingLeft:60}}>{item.title}</span></div>
		            </div>
		            <div style={{position: 'absolute', display: 'inline-block', bottom: 0, marginRight: 10, width: window.screen.width - 39 - width}}>
		              <div style={{...styles.timePng, display: liveSeriesImg ? 'block' : 'none'}}>
		                {/*{new Date(item.start_time).format("yyyy-MM-dd")}
		                <span style={{marginLeft: 9}}>
		                  {new Date(item.start_time).format("hh:mm")}-
		                </span>
		                <span>
		                  {new Date(item.end_time).format("hh:mm")}
		                </span>*/}
										<img src={liveSeriesImg} style={{width: 60, height: 14, marginTop: 6}}/>
		              </div>
		              {/*<div style={{...styles.isTest, color: color, borderColor: borderColor, width: w_width < 350 ? 38 : 42, padding: w_width < 350 ? 1 : 2, marginLeft: w_width < 350 ? 7 : 14}}>{liveType}</div>*/}
									<div style={{marginLeft: liveSeriesImg ? 58 : 118, display: 'inline-block'}}>
		                <img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} style={{width: 11, height: 11, marginRight: 6, position: 'relative', top: 1.3}}/>
		                <span style={{fontSize: 11, color: '#999'}}>{item.learn_num}</span>
		              </div>
		            </div>
		        </div>
		        </Link>
					</div>
				)
			}else if (item.resource_type == 2) {

	      var free;
	      var padT;
	      var padB;
	      var test;
	      var width;
	      var height;
	      var bottom_left
				var div_height
	      if(item.isFree) {
	        free = "inline-block"
	      } else {
	        free = "none"
	      }
	      if(index == 0) {
	        padT = 15,
	        padB = 15
	      } else {
	        padT = 0,
	        padB = 15
	      }
	      if(item.exam_mark === 1) {
	        test = 'inline-block'
	      } else {
	        test = 'none'
	      }
	      if(devWidth != 375) {
	        width = (devWidth / 375)*127
	        height = width / 1.58
	      } else {
	        width = 127
	        height = 80
	      }
	      if(devWidth < 375) {
	        bottom_left = devWidth - width - 18 - 66
					div_height = 26
	      } else if(devWidth == 375) {
	        bottom_left = devWidth - width - 27 - 66
					div_height = 32
	      } else if(devWidth > 375) {
	        bottom_left = devWidth - width - 27 - 78
					div_height = 34
	      }
				let starOverScore = {
	        right: 6,
	        star: item.star,
	        canChange: false,
	        score: item.star,
	        propScore: item.star, //外部传数 （固定分数）
	  			scoreShow: false,
	  			width: 11,
	  			height: 11
	      }
	      return(
					<div key={index}>
						<div style={{display:joinDispaly,marginLeft:12}}>
							<div style={{...styles.joinBorder}}></div>
							<div><span style={{fontSize:13,color:'#666666'}}>{item.join_date}</span></div>
						</div>
		        <Link to={`${__rootDir}/lesson/online/${item.id}`}>
		        <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height}} ref={(lesson) => this.lesson = lesson}>
		            <img style={{...styles.lessonPng, width: width, height: height, marginRight: devWidth < 350 ? 8 : 15, marginLeft: devWidth < 350 ? 10 : 12}} src={item.brief_image} />
		            <div style={{height: 34}}>
		              {/*<span style={{...styles.isFree, display: free}}>免费</span>*/}
		              <span style={{...styles.span, fontSize: devWidth < 350 ? 12 : 14}}>{item.title}</span>
		            </div>
								<div style={{position: 'relative', top: -2, display: 'inline-block'}}>
		              <Star {...starOverScore}/>
		            </div>
								<span style={{fontSize: 11, position: 'relative', top: 0, color: '#999'}}>{item.star.toString().split('.').length > 1 ? item.star : item.star + '.0' }</span>
		            <div style={{position: 'absolute', display: 'inline-block', bottom: 0, left: bottom_left, height: 16}}>
		              {/*<div style={{...styles.timePng}}></div>*/}
		              {/*<span style={{...styles.lessonTime}}>{item.duration}分钟</span>*/}
									<img src={item.isFree ? Dm.getUrl_img('/img/v2/icons/isFree@2x.png') : Dm.getUrl_img('/img/v2/icons/isNotFree@2x.png')} style={{...styles.isFreePng, marginRight: item.has_exam ? 7 : 50}} />
		              <img src={Dm.getUrl_img('/img/v2/icons/new_test@2x.png')} style={{float: 'left', width: 15, height: 14, marginRight: 26, display: item.has_exam ? 'block' : 'none'}}/>
		              <div style={{...styles.line}}>|</div>
									<img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} style={{...styles.learnNum}} />
		              <span style={{fontSize: 11, color: '#999', position: 'relative', top: -7, marginLeft: 6}}>{item.learn_num}</span>
		              {/*<span style={{...styles.chapter}}>共{item.catalog_num}章</span>*/}
		              {/*<div style={{...styles.onliveisTest, display: test}}>测</div>*/}
		            </div>
		        </div>
		        </Link>
					</div>
	      )
			}
		})
		return (
			<div style={{...styles.div}} onTouchEnd={this._learnRecordloadMore.bind(this)} ref={(lessonList) => this.lessonList = lessonList}>
				<FullLoading isShow={this.state.isLoading}/>
				{this.state.learnRecordData.length > 0 ? learnRecord : listNull}
				{
					this.state.loadmore ?
					// <div style={{width:'100%',height:15,backgroundColor:'#ffffff',textAlign:'center'}} onClick={this._gotoLoadMore.bind(this)}>
					// 	<span style={{fontSize:12,color:'#333333'}}>更多</span>
					// </div>
					<Loading isShow={this.state.isShow}/>
					:
					<div style={{height: 40, display: this.state.isOver == true && this.state.isShow == false && this.state.learnRecordData.length > 0 ? 'block' : 'none', textAlign: 'center'}}>共{this.state.learnRecordData.length}条</div>
					// <div style={{width:'100%',height:15,backgroundColor:'#ffffff',textAlign:'center'}} onClick={this._gotoLoadMore.bind(this)}>
					// 	<span style={{fontSize:12,color:'#333333'}}></span>
					// </div>
				}
			</div>
		);
	}
}

var styles = {
	div:{
    height: devHeight,
    width: devWidth,
    backgroundColor:'#ffffff',
		overflow:'auto',
		overflowX: 'hidden',
  },
	span: {
		fontSize: 14,
		color: '#333',
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		lineHeight: '20px',
		position:'relative'
	},
	list: {
		// height: 667,
		overflow: 'scroll',
	},
	lessonDiv: {
		// height: 80,
		backgroundColor: '#fff',
		paddingTop: 15,
		paddingRight: 12,
		position: 'relative'
	},
	lessonPng: {
		// width: 127,
		// height: 80,
		// border: '1px solid',
		// marginLeft: 12,
		marginRight: 15,
		float: 'left',
	},
	isFree: {
		position: 'absolute',
		width: 29,
		height: 14,
		borderColor: '#2196F3',
		border:'1px solid',
		borderRadius: 4,
		backgroundColor: '#fff',
		color: '#2196f3',
		fontSize: 11,
		textAlign: 'center',
		lineHeight: '14px'
	},
	imgBlack: {
    position: 'absolute',
    bottom: 0,
    height: 20,
    backgroundImage:'linear-gradient(-180deg, rgba(51,51,51,0.05) 0%, rgba(0,0,0,0.70) 100%)',
    color: '#fff',
    fontSize: 11,
    lineHeight: '20px',
  },
	timePng: {
		color: '#999',
		fontSize: 11,
		float: 'left',
	},
	lessonTime: {
		fontSize: 12,
		color: '#666',
		float: 'left',
		lineHeight: '16px',
		marginRight: 14,
	},
	line: {
		float: 'left',
		lineHeight: '14px',
		color: '#e5e5e5',
		height: 22,
		width: 1
	},
	chapter: {
		fontSize: 12,
		color: '#666',
		float: 'left',
		lineHeight: '16px',
		marginLeft: 14,
	},
	isTest: {
		position: 'relative',
		top: -3,
		fontSize: 11,
		textAlign: 'center',
		width: 42,
		lineHeight: '13px',
		padding: 2,
		borderRadius: 50,
		float: 'right',
		border: '1px solid',
		// marginLeft: 14,
	},
	onliveisTest: {
		fontSize: 11,
		color: '#666',
		lineHeight: '13px',
		padding: 1,
		borderRadius: 4,
		float: 'left',
		border: '1px solid #e5e5e5',
		marginLeft: 7,
	},
	joinBorder:{
		width:5,
		height:5,
		backgroundColor:'#2196f3',
		borderRadius:10,
		float:'left',
		marginTop:10,
		marginRight:8
	},
	isFreePng: {
		width: 38,
		height: 14,
		float: 'left',
		marginRight: 7,
	},
	learnNum: {
    width: 10,
    height: 10,
    float: 'left',
    position: 'relative',
    top: 2,
    marginLeft: 24
  },
	img_status:{
    width:50,
    height:20,
		position:'absolute',
		zIndex:2,
		left:0,
		top:0,
  }
};

export default PgLearnRecord;
