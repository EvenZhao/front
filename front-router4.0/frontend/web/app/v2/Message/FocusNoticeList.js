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

import Loading from '../components/Loading';
import FullLoading from '../components/FullLoading';
import funcs from '../util/funcs'

var dataLimit = 15

class FocusNoticeList extends React.Component {
	constructor(props) {
	    super(props);
			this.dataSkip = 0
			this.wx_config_share_home = {
					title: '消息中心',
					desc: '',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
		this.state = {
			title: 'PgHome',
			data:[],
			loadmore: true,
			isLoading: true,
			isOver: false,
			isShow: false,
		};
	}
	componentWillMount() {
		Dispatcher.dispatch({
			actionType: 'getMessageInfo',
			type: this.props.location.state.type,
			skip: this.dataSkip,
			limit: dataLimit
		})
	}
	_handlegetMessageInfoDone(re){
		//  console.log('_handlegetMessageInfoDone',re);
		this.setState({
			data: re.result || [],
			loadmore: re.result.length >= dataLimit ? true : false,
			isLoading: false,
			isOver: re.result.length >= dataLimit ? false : true,
 		})
	}
	_handlegetreadMessageDone(re){
		// console.log('_handlegetreadMessageDone'.re);
	}
	_MessageListloadMore() {
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
	_gotoLoadMore(re){
		this.dataSkip = this.state.data.length || 0
		Dispatcher.dispatch({
			actionType: 'getMessageInfo',
			limit: dataLimit,
			skip: this.dataSkip,
			loadmore: true,
			type: this.props.location.state.type
		})
	}
	_handleCanNotLoad() {
		this.setState({
			canNotLoad: true
		})
	}
	_handlegetMessageInfoLoadMoreDone(re){
		this.setState({
			data: this.state.data.concat(re.result || []),
			loadmore: re.result.length >= dataLimit ? true : false,
			isLoading: false,
			isOver: re.result.length >= dataLimit ? false : true,
			canNotLoad: false,
			isShow: false
 		})
	}
	componentDidMount() {

		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE",'铂略财课-关注通知')
		this.ongetMessageInfoDone = EventCenter.on('getMessageInfoDone', this._handlegetMessageInfoDone.bind(this))
		this.ongetreadMessageDone = EventCenter.on('readMessageDone',this._handlegetreadMessageDone.bind(this))
		this._canNotLoad = EventCenter.on('canNotLoad', this._handleCanNotLoad.bind(this))
		this._getMessageInfoLoadMoreDone = EventCenter.on('getMessageInfoLoadMoreDone',this._handlegetMessageInfoLoadMoreDone.bind(this))
	}
	componentWillUnmount() {
		this.ongetMessageInfoDone.remove()
		this.ongetreadMessageDone.remove()
		this._canNotLoad.remove()
		this._getMessageInfoLoadMoreDone.remove()
	}
	gotToDetail(jumpUrl,redID,type,action){
		Dispatcher.dispatch({
			actionType: 'readMessage',
			id: redID,
			type: type,
			action: action,
		})
		// var params = jumpUrl.split('/')[jumpUrl.split('/').length-1];
		// if(action==12 || action == 15 || action == 16 || action == 17 || action == 18){//截图消息id跳转至通知详情
		// 	this.props.history.push({pathname:`${__rootDir}/NoteDetails/${id}`, query: null, hash: null, state: {id:params,type:type}});
		// }
		// else {
		// 	if(params == 'download'){//有资料下载更新，给出提示
		// 		EventCenter.emit("DownloadInfo")
		// 	}
		// 	setTimeout(function(){ window.location=jumpUrl; } , 1500);
		// }
		if(jumpUrl){
			var str_params = jumpUrl.split('/')[jumpUrl.split('/').length-1];
			var urlArray = jumpUrl.split('/');
			urlArray = urlArray.splice(3,urlArray.length-3);
			var new_array;
			var params='';

			if(str_params == 'download'){//有资料下载更新，给出提示
				EventCenter.emit("DownloadInfo")
			}
			if(urlArray[0]=='test'){
				new_array = urlArray.splice(1,urlArray.length-1)
			}
			else {
				new_array = urlArray;
			}
			for(var i=0;i<new_array.length;i++){
				params += '/' + new_array[i]
			}
			this.props.history.push({pathname:`${__rootDir}` + params, query: null, hash: null, state: {}});
		}
	}

	removeHtmlTag(str) {
		if(str) {
			var str1 = str.replace(/<[^>]+>/g,"");
			var str2 = str1.replace(/&nbsp;/ig,'');
		}
		return str2;
	}

 //解析body
 Analysis_body(content,firstArry,keyArry,strArry){
		//  var keyArry = [];//用来存储body中取出来作为key的数组
		//  var strArry = [];//用来存储body中除去key以为的部分
	   var body_str = null;//body字段内容
	   var first_str ='';//数组中移除的第一项的value
		 var body_content = '';//最终解析出来的body内容
		 if(content.body){
			 body_str = content.body.split('♂');//第一次分隔字符串放入数组
			 if(body_str.length > 1){
					firstArry = body_str.slice(1);//移除数组中第一个
					first_str = body_str.splice(0,1);//返回数组中移除的第一个元素的value
					var key = '';
					var second_str = '';

					firstArry.map((item,index)=>{
						 key = item.split('♀')[0];
						 second_str = item.split('♀')[1];
						 keyArry.push(key);
						 strArry.push(second_str);
					})
					for(var i=0;i < keyArry.length;i++){
					 if(content[keyArry[i]] == null){
						 content[keyArry[i]] = '';
					 }
					 body_content += content[keyArry[i]] + strArry[i];
				  }
					return	body_content=first_str+body_content;
  		 }
  		}
    }

	render(){

		var listNull = (
			<div style={{textAlign:'center',paddingTop:114}}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{marginTop:51}}>
					<span style={{fontSize:15,color:'#999999'}}>暂无通知哦~</span>
				</div>
			</div>
		)

    var list = this.state.data.map((item,index)=>{
		 var BgColor ='#EEEEEE'
		 var boxBgColor ='#E5E5E5'
		 if (item.isRead) {
			 BgColor = '#f9f9f9'
			 boxBgColor='#e9e9e9'
		 }
		 var title  //标题
		 var id //详情ID
		 var time_type//时间
		 var content_type//内容类型
		 var content=item.contentNew || item.content;
		 var content_title = '';//新增new_action--内容标题
		 var box_content = ''//新增new_action--回复或者评论内容
		 var messageLength = 0;//消息数量
		 var actionTime = (
			 <span>{new Date(item.send_time).format("yyyy-MM-dd")}&nbsp;&nbsp;{new Date(item.send_time).format("hh:mm")}</span>
		 )
		 var sysTime = new Date(item.send_time).format("yyyy-MM-dd");
		 var new_sendTime = someDay(item.send_time);
		 var context //内容
		 var jumpUrl = item.jumpUrl;//跳转url

     var firstArry = [];//用来临时存储
		 var keyArry = [];//用来存储body中取出来作为key的数组
		 var strArry = [];//用来存储body中除去key以为的部分
		 var body_str = null;//body字段内容
		 var first_str ='';//数组中移除的第一项的value
		 var body_content = '';//最终解析出来的body内容
		 var course_title;//课程标题
		 var course_date;//课程时间
		 switch (item.action) {
		 	case 1:
				id = content.questionId || '';
				time_type = '关注时间：';
				content_type = '关注问题：'
				title = (
					<div>
					{content.accountNickname} <span style={{fontSize:14,color:'#999'}}>关注了您的问题:</span>
					</div>
				)
				context = content.questionTitle || ''

		 		break;
				case 2:
					if (jumpUrl.split('https://mb.bolue.cn/test/list/live')[1]) {
						jumpUrl = 'https://mb.bolue.cn/test/list/live'
					}else {
						jumpUrl = 'https://mb.bolue.cn/list/live'
					}
					title='您关注的直播系列有课程更新'
					context =content.seriesTitle
					id = content.resourceId
				break;
				case 3:
					var updateNum = content.updateNum || 1
					//title='您关注的问题收到'+ updateNum +'条新回答：'
					title='您关注的问题有新回答：'
					context = content.questionTitle
					id = content.questionId
				break;
				case 4:
					title='您关注的问题已有采纳答案：'//+content.questionTitle+'
					context = content.questionTitle
					id = content.questionId
				break;
				case 5:
					title=(
						<div>您关注的讲师<span style={{color:'#333'}}>{content.teacherNickname}</span>更新了一门课程：</div>
					)
					context = content.title
				break;
				case 6:
					// title = (
					// 	<div>您关注的话题新增了<span style={{color:'#333'}}>{content.updateNum}</span>条问答：</div>
					// )
					title = (
						<div>您关注的话题<span style={{color:'#333'}}>[xx话题标题]</span>有新增问题：</div>
					)
					context = (
						<div style={{color:'#333'}}>话题名称：{content.topicTitle}</div>
					)
					id = content.topicId
				break;
				case 7:
					// title = (
					// 	<div>您关注的话题新上传了<span style={{color:'#333'}}>{content.updateNum}</span>门课程：</div>
					// )
					title = (
						<div>您关注的话题<span style={{color:'#333'}}>xx话题标题</span>有课程更新：</div>
					)
					//title='您关注的话题新上传了'+content.updateNum+'门课程'
					//context = content.topicTitle
					context = (
						<div style={{color:'#333'}}>话题名称：{content.topicTitle}</div>
					)
					id = content.topicId
				break;
				case 8:
					title=(
						<div>您关注的讲师<span style={{color:'#333'}}>{content.teacherNickname}</span>新增了一条问答：</div>
					)
					context = content.questionTitle
					id = content.questionId
				break;
				case 9:
						title = '您关注的视频课有资料更新'
						if(content.onlineList && content.onlineList.length >0){
							content_title = content.onlineList[0].title || '';
							messageLength = content.onlineList.length;
						}
					break;
				case 10:
						title = '您关注的直播课有资料更新'
						if(content.liveList && content.liveList.length > 0){
							content_title = content.liveList[0].title || '';
							messageLength = content.liveList.length;
						}
					break;
				// 迁移至offlineRemind
				// case 11:
				// 	title = '您关注的线下课有资料更新'
				// 	if(content.offlineList && content.offlineList.length >0){
				// 		content_title = content.offlineList[0].title || '';
				// 		messageLength = content.offlineList.length;
				// 	}
				// 	break;
				case 12:
					title = '您关注的直播课系列『'+content.seriesTitle+'』有课程更新'
					if(content.courseList && content.courseList.length > 0){
						content_title = content.courseList[0].title || '';
						messageLength = content.courseList.length;
					}
					break;
				case 13:
					title = '您关注的问题有新回答'
					content_title = content.answererNickname+'：'+content.answerContent;
					box_content = content.questionTitle;//问题标题
					break;
				case 14:
					title = '您关注的问题已有采纳答案'
					content_title = content.answererNickname+'：'+content.answerContent;
					box_content = content.questionTitle;//问题标题
					break;
				case 15:
					title = '您关注的讲师『'+content.teacherNickname+'』有课程更新'
					if(content.courseList && content.courseList.length>0){
						content_title = content.courseList[0].title || '';
						messageLength = content.courseList.length;
					}
					break;
				case 16:
					title = '您关注的话题『'+content.topicTitle+'』有新增问题'
					if(content.questionList && content.questionList.length > 0){
						content_title = content.questionList[0].questionTitle || '';
						messageLength = content.questionList.length;
					}
					break;
				case 17:
					title = '您关注的话题『'+content.topicTitle+'』有课程更新'
					if(content.courseList && content.courseList.length > 0){
						content_title = content.courseList[0].title || '';
						messageLength = content.courseList.length;
					}
					break;
				case 18:
					title = '您关注的讲师『'+content.teacherNickname+'』回答了新的问题'
					if(content.questionAnswerList && content.questionAnswerList.length > 0){
						content_title = content.questionAnswerList[0].AnswerTitle || '';
						box_content = content.questionAnswerList[0].questionTitle || '';
						messageLength = content.questionAnswerList.length;
					}
					break;
		 	default:
				body_content = this.Analysis_body(content,firstArry,keyArry,strArry);
				course_title = content.title;
				course_date = content.offlineDate;

				return(
						<div key={index}>
							<div style={{textAlign:'center'}}>
	 					 		<div style={styles.send_time}>{new_sendTime}</div>
	 					 </div>
						 <div style={{...styles.div_box,backgroundColor:BgColor,marginTop:10,}} onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)}>
								<div style={{...styles.TitleDiv}}>
									{title}
								</div>
								<div style={{width:window.screen.width-48}}>
									<span style={{fontSize:14,color:'#333333'}}>
										{body_content}
									</span>
								</div>
								<div style={{...styles.note_text,width:window.screen.width-48,}}>
	 								 {course_title}
	   					 </div>
	 						 <div style={{...styles.note_text,width:window.screen.width-48,}}>
	 						 		<div>(时间：{course_date})</div>
	 						 </div>
							</div>
						 {/*
							<div style={styles.time}>
								<span style={{fontSize:12,color:'#999999'}}>{actionTime}</span>
							</div>
							*/}
						</div>
					)
		 }

     if(item.action == 1){
			 return(
					 <div style={{...styles.div_box,backgroundColor:BgColor,marginTop:15,}} key={index} onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)}>
						 <div style={{...styles.TitleDiv}}>
							 {title}
						 </div>
						 <div style={{marginTop:10}}>{time_type}<span style={{color:'#333'}}>{actionTime}</span></div>
						 <div style={{...styles.LineClamp,WebkitLineClamp: 2,width:window.screen.width-48,lineHeight:'20px'}}>
							{content_type}
							 <span style={{fontSize:14,color:'#333333'}}>
								 {this.removeHtmlTag(context)}
							 </span>
						 </div>
						 <div style={styles.time}>
							 <span style={{fontSize:12,color:'#999999'}}>{sysTime}</span>
						 </div>
					 </div>
				 )
     	}
			else if(item.action >1 && item.action <=8){
			 return(
         <div onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)} style={{...styles.div_box,backgroundColor:BgColor,marginTop: 15}} key={index}>
  					 <div style={{...styles.TitleDiv}}>
  						 {title}
  					 </div>
  					 <div style={{...styles.LineClamp,WebkitLineClamp: 2,width:window.screen.width-48,marginTop:10,height:40,lineHeight:'20px'}}>
  						 <span style={{fontSize:14,color:'#333333'}}>
  							 {this.removeHtmlTag(context)}
  						 </span>
  					 </div>
  					 <div style={styles.time}>
  						 <span style={{fontSize:12,color:'#999999'}}>{actionTime}</span>
  					 </div>
  				 </div>
  			 )
     }
		 else if (item.action >=9 && item.action<=18) {//新增new_action
			 return(
				 <div key={index}>
				 	 <div style={{textAlign:'center'}}>
					 		<div style={styles.send_time}>{new_sendTime}</div>
					 </div>
					 <div style={{...styles.div_box,backgroundColor:BgColor,marginTop:10}} onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)}>
						 <div style={{...styles.TitleDiv,fontSize:16,color:'#333'}}>
							 {title}
						 </div>
						 <div style={{...styles.LineClamp,...styles.note_text,WebkitLineClamp: 2,lineHeight:'20px',width:window.screen.width-48,}}>
						 	{this.removeHtmlTag(content_title)}
						 </div>
						 <div style={{...styles.reply_box,...styles.LineClamp,WebkitLineClamp: 2,backgroundColor:boxBgColor,lineHeight:'20px',display:box_content ? "block":'none'}}>
						 		{box_content}
  					 </div>
						 <div style={{...styles.more,display:messageLength > 0 ? 'flex':'none'}}>
						 	<span style={{marginRight:10}}>查看全部{messageLength}个内容</span>
							<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12}}/>
						 </div>
					 </div>
					</div>
				 )
		 }
	})

	return (
		<div style={{...styles.container}}  onTouchEnd={this._MessageListloadMore.bind(this)} ref={(lessonList) => this.lessonList = lessonList}>
				<FullLoading isShow={this.state.isLoading}/>
        {this.state.data.length > 0 ?  list : listNull}
				{
					this.state.loadmore ?
					<Loading isShow={this.state.isShow}/>
					:
					<div style={{...styles.total, display: this.state.isOver == true && this.state.isShow == false && this.state.data.length > 0 ? 'block' : 'none'}}>共{this.state.data.length}条</div>
				}
		</div>
	);
	}
}

var styles = {
  container:{
    height:window.innerHeight,
    width:window.screen.width,
    backgroundColor:'#ffffff',
		overflowY:'scroll',
		overflowX:'hidden'
  },
  div_box:{//每个菜单的DIV
    width:window.screen.width-48,
    backgroundColor:'#EEEEEE',
    borderRadius:2,
    marginLeft:12,
		padding:'7px 12px 14px 12px',
    position:'relative',
		color:'#999',
		fontSize:14,
  },
  TitleDiv:{//左边的DIV
    width:window.screen.width-48,
		marginTop:10,
		color:'#999',
		fontSize:14
  },
	total:{
		height: 40,
		position:'relative',
    textAlign: 'center',
		marginTop: 24
	},
	time:{
		display:'flex',
		flexDirection:'row',
		justifyContent:'flex-end',
		flex:1,
		marginTop:10
	},
	LineClamp:{
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 1,
	},
	send_time:{
		backgroundColor:'#dbdbdb',
		borderRadius:2,
		fontSize:12,
		color:'#fff',
		display:'inline-block',
		height:20,
		lineHeight:'20px',
		padding:'0 10px',
		margin:'20px 0 10px 0'
	},
	note_text:{
		fontSize:12,
		color:'#444',
		marginTop:10
	},
	reply_box:{
		marginTop:10,
		width:window.screen.width-90,
		padding:'15px',
		fontSize:12,
		color:'#999'
	},
	more:{
		display:'flex',
		fontSize:12,
		color:'#999',
		height:20,
		marginTop:10,
		flexDirection:'row',
		justifyContent:'flex-end',
		alignItems:'center',
	}
};
export default FocusNoticeList;
