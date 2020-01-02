import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
import FullLoading from '../components/FullLoading';

var t
var countdown

class PgresourceShare extends React.Component {
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
			dataList:[],
			shareType:'',
			title:'',
			isLoading: true,
			livedata:[],
			offlinedata:[],
			err: false,
			errContent:''
		};

	}

  componentWillMount() {

  }
	_handlelessonShareDone(re){
		if (!re || re.err) {
			this.setState({
				isLoading: false,
				err: true,
				errContent: re.err
			},()=>{
				countdown = setInterval(()=>{
						clearInterval(countdown);
						this.setState({
							err: false
						},()=>{
							this.goToHome()
						})
				}, 1500);
			})
			return
		}
		var result = re.result
		this.setState({
			dataList:result.lesson,
			title: result.title,
			shareType: result.shareType,
			isLoading: false,
		},()=>{
			if (result.title) {
				EventCenter.emit("SET_TITLE",result.title);
			}
			this.wx_config_share_home = {
					title: result.title,
					desc: '铂略（bolue.cn）近期热门课程点击查看！',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
			Dispatcher.dispatch({
				actionType: 'WX_JS_CONFIG',
				onMenuShareAppMessage: this.wx_config_share_home
			})
			var dataList = result.lesson
			var livedata = []
			var offlinedata = []
			if (result.shareType == 4) {
				for (var i = 0; i < dataList.length; i++) {
					if (dataList[i].resource_type == 1) {
						livedata.push(dataList[i])
					}else {
						offlinedata.push(dataList[i])
					}
				}
				this.setState({
					livedata: livedata,
					offlinedata: offlinedata,
				})
			}
		})
		// console.log('_handlelessonShareDone',re);
	}
	componentDidMount() {//
		EventCenter.emit("SET_TITLE",'铂略财课-课程推荐');
		// t = setTimeout(() => {
		// 	this.stopDrop()
		// }, 300)
		this._getlessonShareDone = EventCenter.on("lessonShareDone", this._handlelessonShareDone.bind(this))
		Dispatcher.dispatch({
			actionType: 'lessonShare',
			id: this.props.match.params.id,
		})

	}
	/**
	 * 禁止浏览器下拉回弹
	 */
	 stopDrop() {
		 document.body.addEventListener('touchmove', function (evt) {
		//In this case, the default behavior is scrolling the body, which
		//would result in an overflow.  Since we don't want that, we preventDefault.
			if (!evt._isScroller) {
					evt.preventDefault();
			}
			});
		}
	componentWillUnmount() {
		this._getlessonShareDone.remove()
		clearInterval(countdown);
	}
	goToHome(){
		this.props.history.push({pathname:`${__rootDir}/`});
	}
	goToDetail(type,id){//
		switch (type) {
			case 1:
				this.props.history.push({pathname:`${__rootDir}/lesson/live/${id}`});
			break;
			case 2:
				this.props.history.push({pathname:`${__rootDir}/lesson/online/${id}`});
			break;
			case 3:
				this.props.history.push({pathname:`${__rootDir}/lesson/offline/${id}`});
			break;
		}
	}
	getStrLength(str){
		var l = str.length;
		var blen = 0;
		for(var i=0; i<l; i++) {
			if ((str.charCodeAt(i) & 0xff00) != 0) {
				blen ++;
			}
				blen ++;
		}
		blen = blen/2
		var isTitle = false
		if (blen * 16 > (devWidth - 148)) {
			isTitle = true
		}
		return isTitle
	}
	shareDatalist(data){
		var dataList = data.map((item,index)=>{
			if (!item) {
				return
			}
			var resource_type = item.resource_type
			var brief,start_time,end_time,start_date,end_date,data_time,address,liveSeriesImg
			var statusImage = ''
			switch (resource_type) {
				case 1:
					brief = item.brief
					 start_date = new Date(item.start_time || 0).format("MM-dd")
					 end_date = new Date(item.end_time || 0).format("MM-dd")
					 start_time = new Date(item.start_time || 0).format("hh:mm");
					 end_time = new Date(item.end_time || 0).format("hh:mm");
					 data_time = start_date +' '+ start_time +'-'+ end_time
					 if (start_date !== end_date) {
						 data_time = start_date +' 至 '+ end_date +' '+start_time
					 }
					 if (item.status == 0) {
						 statusImage = '/img/v2/share/newLiveswks@2x.png'
					 }
					 if (item.status == 1) {
						 statusImage = '/img/v2/share/newLivezzzb@2x.png'
					 }
					 if (item.status == 2) {
						 statusImage = '/img/v2/share/newLivezbjs@2x.png'
					 }
					 if (item.status == 3) {
						 statusImage = '/img/v2/share/newLivejjks@2x.png'
					 }
					 if(item.liveSeries == 3) {
						 liveSeriesImg = Dm.getUrl_img('/img/v2/share/newcfo@2x.png')
					 } else if(item.liveSeries == 4) {
						 liveSeriesImg = Dm.getUrl_img('/img/v2/share/newszt@2x.png')
					 } else {
						 liveSeriesImg = null
					 }
				break;
				case 2:
					brief= item.online_brief
				break;
				case 3:
					start_date = new Date(item.start_time || 0).format("MM-dd")
					start_time = new Date(item.start_time || 0).format("hh:mm");
					end_time = new Date(item.end_time || 0).format("hh:mm");
					end_date = new Date(item.end_time || 0).format("MM-dd")
					if (item.isSameDay) {
						data_time = start_date +' '+ start_time +'-'+ end_time
					}else {
						data_time = start_date +' 至 '+end_date
					}
					address = item.address || {}
					brief = item.offline_brief
					if (item.disp_status == 1) {
						statusImage = '/img/v2/share/newOffzzbm@2x.png'
					}
					if (item.disp_status == 2) {
						statusImage = '/img/v2/share/newOffbmym@2x.png'
					}
					if (item.disp_status == 3) {
						statusImage = '/img/v2/share/newOffkcjs@2x.png'
					}
					if (item.disp_status == 4) {
						statusImage = '/img/v2/share/newOffbmjz@2x.png'
					}
				break;
			}
			var teacher = item.teacher || {}
			return(
				<div style={{...styles.info,height: resource_type == 2 ? 254 : 290}} key={index} onClick={this.goToDetail.bind(this,resource_type,item.resource_id)}>
					<div style={{...styles.img}}>
						<img src={item.brief_image} height="" width={devWidth-74} style={{borderRadius:'5px',backgroundSize:'cover'}}/>
					</div>
					<div style={{...styles.imgzzc}}></div>
					<div style={{...styles.titleDiv,}}>
						<div style={{...styles.title,...styles.LineClamp,WebkitLineClamp: 2,paddingTop: this.getStrLength(item.title) ? 2 : 12}}>
							<img src={Dm.getUrl_img(statusImage)} height="20" width="50" style={{position:'absolute',top:this.getStrLength(item.title) ? 2 : 12,display:resource_type == 2 ? 'none' : 'block'}}/>
							<span style={{marginLeft:resource_type == 2 ? 0 : 54}}>{item.title}</span>
						</div>
					</div>
					<div style={{...styles.teacher,...styles.LineClamp,WebkitLineClamp: 1,display:resource_type == 2 ? 'none' : 'block',position:'relative'}}>
						<img src={Dm.getUrl_img('/img/v2/share/time@2x.png')} height="12" width="12" style={{}}/>
						<span style={{marginLeft:8}}>时间</span>
						<span style={{marginLeft:14}}>{data_time}</span>
						<div style={{position:'absolute',right:0,top: 2,display:resource_type == 3 ? 'block' : 'none'}}>
							<img src={Dm.getUrl_img('/img/v2/share/address@2x.png')} height="13" width="13" style={{}}/>
							<span style={{marginLeft:8}}> {address ? address.cityname : null}</span>
						</div>
					</div>
					<div style={{...styles.teacher,...styles.LineClamp,WebkitLineClamp: 1}}>
						<img src={Dm.getUrl_img('/img/v2/share/teacher@2x.png')} height="12" width="12" style={{}}/>
						<span style={{marginLeft:8}}>讲师</span>
						<span style={{marginLeft:14}}>{teacher.name}</span>
						<span style={{marginLeft:8}}>{teacher.title}</span>
					</div>
					<div style={{...styles.infoText,...styles.LineClamp,WebkitLineClamp: 2,}}>
						<span>{brief}</span>
					</div>
					<div style={{...styles.bannerLogo,left: 26,}}>
						<img src={Dm.getUrl_img('/img/v2/share/bannerlogo@2x.png')} height="18" width="38" style={{}}/>
					</div>
					<div style={{...styles.bannerLogo,right:26,display:resource_type == 1 ? 'block' : 'none'}}>
						<img src={liveSeriesImg} height="14" width="45" style={{}}/>
					</div>
				</div>
			)
		})
		return dataList
	}
	render(){
		var dataList = this.shareDatalist(this.state.dataList)
		var livedata = this.shareDatalist(this.state.livedata)
		var offlinedata = this.shareDatalist(this.state.offlinedata)
    return(
			<div style={{...styles.div}}>
				<FullLoading isShow={this.state.isLoading}/>
				<div style={{display:this.state.shareType !== 4 ? 'block':'none'}}>
					{dataList}
				</div>
				<div style={{display:this.state.shareType == 4 ? 'block':'none'}}>
					<div style={{width:devWidth-54,height:25,marginLeft:27,marginTop:30}}>
						<span style={{...styles.font}}>直播课</span>
					</div>
					{livedata}
					<div style={{width:devWidth-54,height:25,marginLeft:27,marginTop:30}}>
						<span style={{...styles.font}}>线下课</span>
					</div>
					{offlinedata}
				</div>
				<div style={{...styles.button,display: !this.state.err ? 'block':'none'}} onClick={this.goToHome.bind(this)}>
					<span style={{...styles.buttonFont}}>查看更多好课</span>
				</div>
				<div style={{...styles.zzc,display:this.state.err ?'block':'none'}}></div>
				{/*弹框*/}
				<div style={{...Common.alertDiv,display:this.state.err ?'block':'none',width:220,left: (window.screen.width-220)/2}}>
					<div style={{marginBottom:14,paddingTop:15,height:30,}}>
						<img src={Dm.getUrl_img('/img/v2/icons/' + failure_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
					 </div>
					 <span style={{color:Common.BG_White}}>{this.state.errContent}</span>
				 </div>
			</div>
    )
  }
}

var styles = {
	div:{
		width: devWidth,
		height: devHeight,
		backgroundColor: '#F4F4F4',
		overflowY: 'scroll',
		overflowX: 'hidden',
	},
	info:{
		width: devWidth-44,
		height: 254,
		backgroundColor: '#FFFFFF',
		borderRadius: '12px',
		border: '0.5px solid #ebebeb',
		marginLeft: 22,
		position: 'relative',
		marginTop: 12,
		paddingTop:15,
	},
	img:{
		width: devWidth-74,
		height: 160,
		//backgroundColor:'#05ccea',
		borderRadius: '5px',
		marginLeft: 15,
		// marginTop: 15,
		position:'relative',
		overflow:'hidden',
	},
	imgzzc:{
		width: devWidth-74,
		height: 160,
		backgroundColor: '#000000',
		borderRadius:'5px',
		left: 15,
		top: 15,
		position: 'absolute',
		opacity: 0.2,
		zIndex: 99
	},
	titleDiv:{
		backgroundImage: 'linear-gradient(-180deg,rgba(51,51,51,0.05) 0%,rgba(0,0,0,0.70) 70%)',
		height: 44,
		width: devWidth-74,
		zIndex:100,
		borderRadius:'0 0 5px 5px',
		left: 15,
		top: 131,
		position: 'absolute',
		// paddingLeft: 10,
		// paddingRight: 10,
		// opacity: 0.2,
	},
	title:{
		fontSize: 16,
		color: '#FFFFFF',
		fontFamily:'PingFangSC-Medium',
		letterSpacing:'0.1px',
		lineHeight:'20px',
		height: 44,
		width: devWidth-94,
		marginLeft:10,
		position:'relative',
	},
	teacher:{
		fontFamily:'PingFangSC-Regular',
		fontSize: 12,
		color: '#000000',
		letterSpacing:'0.1px',
		width: devWidth-94,
		marginLeft: 25,
		marginTop:8,
		position:'relative',
	},
	infoText:{
		fontSize: 12,
		color:'#ababab',
		letterSpacing:'0.1px',
		fontFamily:'PingFangSC-Regular',
		width: devWidth-94,
		marginLeft: 25,
		marginTop:6
	},
	button:{
		height: 30,
		width: 160,
		backgroundImage: 'linear-gradient(49deg,#27cfff 0%,#2aa6ff 100%)',
		borderRadius:'100px',
		marginTop: 18,
		marginLeft: (devWidth-160)/2,
		textAlign:'center',
		marginBottom: 18,
		paddingTop:5
	},
	bannerLogo:{
		position:'absolute',
		top: 25,
		zIndex:1111
	},
	buttonFont:{
		fontSize:14,
		color:'#FFFFFF',
		fontFamily:'PingFangSC-Medium',
		letterSpacing:'0.12px',
		lineHeight:'16px',
		// marginTop:8
	},
	LineClamp:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		// WebkitLineClamp: 1,
	},
	font:{
		fontFamily:'PingFangSC-Medium',
		fontSize: 18,
		color:'#000000',
		letterSpacing:'-0.43px'
	}
}

export default PgresourceShare;
