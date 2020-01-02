import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ProductTop from '../components/ProductTop'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import ProductLessonDiv from '../components/ProductLessonDiv';
import Alert from '../components/Alert';
import LiveLessonDiv from '../components/LiveLessonDiv';
import FullLoading from '../components/FullLoading';
import Dm from '../util/DmURL'
import Common from '../Common';



var limit = 15;//定数初始limit
var liveSkip = 0;
var myEnrollSkip = 0;
var isInvited = 0;
var skip = 0;

class PgMyReserveEnrollList extends React.Component {
	constructor(props) {
    super(props);
    this.id = ''
		this.titleData = []
    // this.titleData = ['直播预约','线下课报名','企业参课']
		this.state = {
      titleSelectNum: 0,
			type: 3,
			liveList:[],
			myEnrollList:[],
			isInvitedList:[],
			liveMore:true,
			myEnrollMore:true,
			isInvitedMore:true,
			labelList:[],
			labelListDisplay:false,
			label_name:'全部',
			myEnrollLabelType:[],
			isLoading:true,
		};
	}

	componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'myReserveEnrollList',
      resource_type: 1,
			type:null,
			skip: 0,
			limit: limit,
    })
	}
	_handleFetchLableListDone(re){
		var result= re.result || {}
		this.setState({
			labelList: result.label || []
		})
	}
	_handlemyEnrollLabelType(re){
		this.setState({
			myEnrollLabelType: re.result || []
		})
	}
	componentDidMount() {
		isReservation = true;

		EventCenter.emit("SET_TITLE",'铂略财课-我的预约')
    this._getmyReserveEnrollListDone = EventCenter.on('myReserveEnrollListDone',this._handlemyReserveEnrollListDone.bind(this));
		this._getmyReserveEnrollListMoreDone = EventCenter.on('myReserveEnrollListMoreDone',this._handlemyReserveEnrollListMoreDone.bind(this));
		this._getLabelList = EventCenter.on("FetchLableListDone", this._handleFetchLableListDone.bind(this))
		this._getmyEnrollLabelType = EventCenter.on("myEnrollLabelTypeDone", this._handlemyEnrollLabelType.bind(this))

		Dispatcher.dispatch({
      actionType: 'FetchLableList',
			type:'myEnroll',
    })
		//myEnrollLabelType 预约筛选样式 / 文字
		Dispatcher.dispatch({
			actionType: 'myEnrollLabelType',
		})
	}
	componentWillUnmount() {
    this._getmyReserveEnrollListDone.remove();
		this._getmyReserveEnrollListMoreDone.remove();
		this._getLabelList.remove()
		this._getmyEnrollLabelType.remove()
	}

	_onSelectedMeun(index){
		this.setState({
			titleSelectNum: index,
			label_name:'全部'
		},()=>{
			if(index == 0){
				Dispatcher.dispatch({
					actionType: 'myReserveEnrollList',
					resource_type: 1,
					type:null,
					skip: 0,
					limit: limit,
				})
			}
			else if(index == 1){
				Dispatcher.dispatch({
					actionType: 'myReserveEnrollList',
					resource_type: 3,
					type:'offlineEnroll',
					skip: 0,
					limit: limit,
				})
			}
			else if (index == 2) {
				Dispatcher.dispatch({
					actionType: 'myReserveEnrollList',
					resource_type: 3,
					type:'companyEnroll',
					skip: 0,
					limit: limit,
				})
			}
		})
	}

	_handlemyReserveEnrollListDone(re){
		// console.log('_handlemyReserveEnrollListDone==222=',re);
		var results = re.result || [];
		var user = re.user || {}
		if (user && user.isMainHolder) {
			this.titleData = ['直播参与','线下课报名','企业参课']
		}else {
			this.titleData = ['直播参与','线下课报名']
		}
		skip = results.length || 0;
		if (this.state.titleSelectNum == 0) {
			this.setState({
				liveList: results.length >0 ? results : [],
				liveMore: results.length >=limit ? true : false,
				isLoading:false,
			})
		}else if (this.state.titleSelectNum == 1) {
			this.setState({
				myEnrollList: results.length >0 ? results : [],
				myEnrollMore: results.length >=limit ? true : false,
				isLoading:false,
			})
		}
		else if (this.state.titleSelectNum == 2) {
			this.setState({
				isInvitedList:results.length >0 ? results : [],
				isInvitedMore:results.length >=limit ? true : false,
				isLoading:false,
			})
		}
	}

	_handlemyReserveEnrollListMoreDone(re){
		var results = re.result || [];
		if (this.state.titleSelectNum == 0) {
			skip = this.state.liveList.concat(results).length || 0
			this.setState({
				liveList: results.length >0 ? this.state.onelist.concat(results) : this.state.liveList,
				liveMore: results.length >=limit ? true : false,
				isLoading:false,
			})
		}else if (this.state.titleSelectNum == 1) {
			skip = this.state.myEnrollList.concat(results).length || 0
			this.setState({
				myEnrollList: results.length >0 ? this.state.myEnrollList.concat(results) : this.state.myEnrollList,
				myEnrollMore: results.length >=limit ? true : false,
				isLoading:false,
			})
		}
		else if (this.state.titleSelectNum == 2) {
			skip = this.state.isInvitedList.concat(results).length || 0
			this.setState({
				isInvitedList:results.length >0 ? this.state.isInvitedList.concat(results) : this.state.isInvitedList,
				isInvitedMore:results.length >=limit ? true : false,
				isLoading:false,
			})
		}
	}
	changeLabelList(e){
		this.setState({
			labelListDisplay: !this.state.labelListDisplay
		})
	}
	_labelScorll(re){
		if((this.myEnrollList.scrollHeight - this.myEnrollList.scrollTop - 220) <  document.documentElement.clientHeight) {
      if (this.state.myEnrollList.length < 15 || this.state.isInvitedList.length < 15) {
        return
      }
      if(this.state.titleSelectNum == 0){
				Dispatcher.dispatch({
					actionType: 'myReserveEnrollList',
					resource_type: re,
					type:null,
					skip: skip,
					limit: limit,
					loadmore: true //标记用于判断是够调用loadmore方法
				})
      }
      else if (this.state.titleSelectNum == 1) {
				Dispatcher.dispatch({
					actionType: 'myReserveEnrollList',
					resource_type: re,
					type:'offlineEnroll',
					skip: skip,
					limit: limit,
					loadmore: true //标记用于判断是够调用loadmore方法
				})
      }
      else if (this.state.titleSelectNum == 2) {
				Dispatcher.dispatch({
					actionType: 'myReserveEnrollList',
					resource_type: re,
					type:'companyEnroll',
					skip: skip,
					limit: limit,
					loadmore: true //标记用于判断是够调用loadmore方法
				})
      }
	}
}
	labelClick(re,name){
		this.setState({
			labelListDisplay: !this.state.labelListDisplay,
			label_name: name
		},()=>{
			Dispatcher.dispatch({
				actionType: 'myReserveEnrollList',
				resource_type: 3,
				type:'offlineEnroll',
				label_id:re,
				// loadmore: true //标记用于判断是够调用loadmore方法
			})
		})
	}
	render(){
    var lessonDiv;
		var toLink;
		var loadmore;
		var myEnrollList;
		var isInvitedList;
		if (this.state.titleSelectNum == 0) {
			toLink = `${__rootDir}/list/live`;
		}else{
			toLink = `${__rootDir}/list/offline`;
		}
		var listNull = (
			<div style={{textAlign:'center',paddingTop:70}}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{marginTop:51}}>
					<span style={{fontSize:15,color:'#999999'}}>暂无收藏哦，快去预约课程吧~</span>
				</div>
				<Link to={toLink}>
					<div style={{...styles.collecButton}}>
						<span style={{fontSize:16,color:'#666666'}}>去预约</span>
					</div>
				</Link>
			</div>
		)

		if(this.state.titleSelectNum == 0){
			let data = {
				data: this.state.liveList || [],
				isReservation:isReservation,
			}
			if (this.state.liveList.length < 1) {
				lessonDiv = listNull
			}else {
				lessonDiv = <LiveLessonDiv {...data}/>
			}
		}
		else if (this.state.titleSelectNum == 1) {

			if (this.state.myEnrollList.length < 1) {
				myEnrollList = listNull
			}else {
				  myEnrollList = this.state.myEnrollList.map((item,index)=>{
					var myEnrollLabelType = this.state.myEnrollLabelType //预约筛选样式
					var status_text ='';
					var status_color='';
					var status = item.status
					for (var i = 0; i < myEnrollLabelType.length; i++) {
						if (status == myEnrollLabelType[i].id) {
							status_text = myEnrollLabelType[i].text
							status_color = myEnrollLabelType[i].color
						}
					}
					return(
						<Link key={index} to={`${__rootDir}/PgOffLlineEnrollDetail/${item.id}`}>
						<div style={{marginTop:15,marginLeft:12}}>
							<img src={item.brief_image || ''} width={127} height={80} style={{float:'left'}} />
							<div style={{float:'left',marginLeft:12,width:devWidth-163}}>
								<div style={{...Common.LineClamp,fontSize:Fnt_Normal,height:40,lineHeight:'20px',color:Common.Black}}>{item.title}</div>
								<div style={{marginTop:15}}>
									<img src={Dm.getUrl_img('/img/v2/icons/time2@2x.png')} width={13} height={13} style={{float:'left',marginTop:2}} />
									<span style={{color:Common.Light_Gray,fontSize:Fnt_Small,marginLeft:7,float:'left'}}>{new Date(item.start_time).format(Common.YDATE)}</span>
									<div style={{float:'right',fontSize:Fnt_Normal,color:status_color}}>{status_text}</div>
								</div>
							</div>
							<div style={{clear:'both'}}></div>
						</div>
						</Link>
					)
				})
			}
		}
		else if(this.state.titleSelectNum == 2){

			if (this.state.isInvitedList.length < 1) {
				isInvitedList = listNull
			}else {
				  isInvitedList = this.state.isInvitedList.map((item,index)=>{
					var status_text ='';
					var status_color='';
					if(item.status==0 || item.status==2){
						status_text = '待审核';
						status_color = Common.orange;
					}
					else if (item.status==3) {
						status_text = '报名通过';
						status_color = Common.Activity_Text;
					}
					else if (item.status==4) {
						status_text = '报名失败';
						status_color = Common.red;
					}
					else if (item.status==5) {
						status_text = '已参课';
						status_color = '#f69898';
					}
					else if (item.status==6) {
						status_text = '未参课';
						 status_color = '#9AB2CF';
					}

					return(
						<Link key={index} to={`${__rootDir}/PgOffLlineEnrollDetail/${item._id}`}>
						<div style={{marginTop:15,marginLeft:12}}>
							<div style={{float:'left',width:127,height:80,position:'relative'}}>
								<img src={item.brief_image || ''} width={127} height={80}   />
								{/*
									<div style={{...styles.msk}}>
										<div style={{...styles.source}}>来源：{item.source_name}</div>
									</div>
								*/}
							</div>
							<div style={{float:'left',marginLeft:12,width:devWidth-163}}>
								<div style={{...Common.LineClamp,fontSize:Fnt_Normal,height:40,lineHeight:'20px',color:Common.Black}}>{item.title}</div>
								<div style={{marginTop:15}}>
									<img src={Dm.getUrl_img('/img/v2/icons/time2@2x.png')} width={13} height={13} style={{float:'left',marginTop:2}} />
									<span style={{color:Common.Light_Gray,fontSize:Fnt_Small,marginLeft:7,float:'left'}}>{new Date(item.start_time).format(Common.YDATE)}</span>
									<div style={{float:'right',fontSize:Fnt_Normal,color:status_color}}>{status_text}</div>
								</div>
							</div>
							<div style={{clear:'both'}}></div>
						</div>
						</Link>
					)
				})
			}
		}
	var labelList = this.state.labelList.map((item,index)=>{
		if (this.state.labelList.length < 1) {
			return null
		}
		return(
			<div key={index} style={{...styles.labelList}} onClick={this.labelClick.bind(this,item.label_id,item.label_name)}>
				 <span style={{fontSize:14,color:'#333333',marginLeft:14}}>{item.label_name}</span>
			</div>
		)
	})
	return (
		<div style={{...styles.div}} ref={(myEnrollList) => this.myEnrollList = myEnrollList}
		onTouchEnd={() => {this._labelScorll(this.myEnrollList)}}>
		<FullLoading isShow={this.state.isLoading}/>
			<div style={styles.tab_box}>
				<div style={styles.tab_con}>
					 {
						 this.titleData.map((item,index)=>{
							 var text_color = Common.Light_Black;
							 var border_color = '#F4F4F4';
							 var border_width = 0;

							 if(this.state.titleSelectNum == index){
									text_color = Common.Activity_Text;
									border_color = Common.Activity_Text;
									border_width = 1;
							 }

							 var tab_text = {
								 display:'inline-block',
								 height:45,
								 lineHeight:'45px',
								 textAlign:'center',
								 fontSize:Fnt_Medium,
								 color:text_color,
								 borderBottomStyle:'solid',
								 borderBottomWidth:border_width,
								 borderBottomColor:border_color,
							 }
							 var length = window.screen.width/this.titleData.length
							 return(
								 <div key={index} style={{...styles.tab,width: length}} onClick={this._onSelectedMeun.bind(this,index)}>
										<div style={tab_text}>{item}</div>
								 </div>
							 )
						 })
					 }
				</div>
			</div>{/**线下课预约筛选*/}
				<div style={{...styles.label,display:this.state.titleSelectNum == 1 ? 'block':'none'}} onClick={this.changeLabelList.bind(this)}>
					<span style={{fontSize:14,color: this.state.label_name == '全部' ? '#333333' :'#2196F3'}}>{this.state.label_name}</span>
					<img src={this.state.labelListDisplay ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
				</div>
        <div style={{...styles.lessonDiv,height:this.state.titleSelectNum == 1 ? devHeight-95 : devHeight-50}}>
					<div style={{display:this.state.titleSelectNum == 0 ? 'block':'none'}}>
						{lessonDiv}
						<div style={{display:this.state.liveList.length >0 && this.state.liveMore == false ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
					</div>
					<div style={{display:this.state.titleSelectNum == 1 ? 'block':'none'}}>
						{ this.state.labelListDisplay ?
							labelList : null
						}
						{myEnrollList}
						<div style={{display:this.state.myEnrollList.length >0 && this.state.myEnrollMore == false ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
					</div>
					<div style={{display:this.state.titleSelectNum == 2 ? 'block':'none'}}>
						{isInvitedList}
						<div style={{display:this.state.isInvitedList.length >0 && this.state.isInvitedMore == false ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>

				</div>

        </div>
			</div>
		);
	}
}

var styles = {
  div:{
    height: devHeight,
    width: devWidth,
    backgroundColor:'#ffffff',
  },
	tab_box:{
    height:45,
    borderBottomColor:'#F4F4F4',
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    position:'relative',
  },
  tab_con:{
    position:'absolute',
    left:0,
    bottom:0,
    width:devWidth,
    height:45,
    lineHeight:'45px',
  },
  tab:{
    // width:window.screen.width/3,
    height:45,
    lineHeight:'45px',
    textAlign:'center',
    float:'left',
  },
  title:{
    fontSize:Fnt_Medium,
    color:Common.Black,
  },
  lessonDiv:{
    height: devHeight-50,
    width:'100%',
    backgroundColor:'#ffffff',
    overflow:'scroll'
  },
  meunTitleDiv:{
    width:devWidth/2,
    height:50,
    float:'left',
    textAlign:'center',
    fontSize:15,
    color:'#999999',
    lineHeight: 3,
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#F3F3F3',
  },
  meunTitleDivSelected:{
    width:devWidth/2,
    height:50,
    float:'left',
    textAlign:'center',
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#2196f3',
    color:'#2196f3',
    fontSize:15,
    lineHeight: 3
  },
  collecButton:{
    width: 120,
    height: 39,
    border: '1px solid',
    borderRadius: 25,
    borderColor: '#666666',
    marginLeft: (devWidth-120)/2,
    lineHeight: 2.5,
    marginTop: 22,
  },
	LineClamp:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		// lineHeight:20,
		// WebkitLineClamp: 1,
	},
	oneDiv:{
		width:devWidth-24,
		marginLeft:12,
		borderBottomWidth:1,
		borderBottomStyle:'solid',
		borderBottomColor:'#F3F3F3',
	},
	msk:{
		width:127,
		height:80,
		backgroundColor:'#000',
		opacity:0.5,
		position:'absolute',
		left:0,
		top:0,
	},
	source:{
		position:'absolute',
		bottom:0,
		left:0,
		height:20,
		lineHeight:'20px',
		fontSize:11,
		color:Common.Bg_White,
		padding:'0 8px'
	},
	label:{
		width: window.screen.width,
		height: 45,
		backgroundColor: '#f4f8fb',
		textAlign: 'center',
		lineHeight: 2.5
	},
	labelList:{
		height: 40,
		width: window.screen.width,
		backgroundColor: '#f9f9f9',
		borderBottomColor: '#F3F3F3',
		borderBottomWidth: 1,
		borderBottomStyle: 'solid',
		lineHeight: 2.5
	},
	triangle: {
		height: 6,
		width: 8,
		// position: 'relative',
		// top: 19,
		marginLeft: 10
	},
};

export default PgMyReserveEnrollList;
