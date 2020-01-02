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

import Loading from '../components/Loading';
import FullLoading from '../components/FullLoading';



// var dataSkip = 0
var dataLimit = 15

String.prototype.strLen = function() {
	var len = 0;
	for (var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2; else len ++;
	}
	return len;
}
//将字符串拆成字符，并存到数组中
String.prototype.strToChars = function(){
	var chars = new Array();
	for (var i = 0; i < this.length; i++){
		chars[i] = [this.substr(i, 1), this.isCHS(i)];
	}
	String.prototype.charsArray = chars;
	return chars;
}
//判断某个字符是否是汉字
String.prototype.isCHS = function(i){
	if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0)
		return true;
	else
		return false;
}
//截取字符串（从start字节到end字节）
String.prototype.subCHString = function(start, end){
	var len = 0;
	var str = "";
	this.strToChars();
	for (var i = 0; i < this.length; i++) {
		if(this.charsArray[i][1])
			len += 2;
		else
			len++;
		if (end < len)
			return str;
		else if (start < len)
			str += this.charsArray[i][0];
	}
	return str;
}
//截取字符串（从start字节截取length个字节）
String.prototype.subCHStr = function(start, length){
	return this.subCHString(start, start + length);
}
// var li= document.getElementsByName("listtitle");
// 	for(var i=0;i<li.length;i++)
// {
// 	li[i].innerHTML=li[i].innerHTML.subCHStr(0,28)+"...";
// }

class PgEnrollList extends React.Component {
	constructor(props) {
	    super(props);
      this.data=['报名','回答']//可变的菜单
			// console.log('this.props',this.props.location.state);
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
		// console.log('this.props.location.state.type',this.props.location.state.type);
		Dispatcher.dispatch({
			actionType: 'getMessageInfo',
			type: this.props.location.state.type,
			skip: this.dataSkip,
			limit: dataLimit
		})
	}
	_handlegetMessageInfoDone(re){
		 console.log('_handlegetMessageInfoDone',re);
		this.setState({
			data: re.result || [],
			loadmore: re.result.length >= dataLimit ? true : false,
			isLoading: false,
			isOver: re.result.length >= dataLimit ? false : true,
 		})
	}
	_handlegetreadMessageDone(re){
		console.log('_handlegetreadMessageDone'.re);
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
		console.log('_handlegetMessageInfoLoadMoreDone',re);
		this.setState({
			data: this.state.data.concat(re.result || []),
			loadmore: re.result.length >= dataLimit ? true : false,
			isLoading: false,
			isOver: re.result.length >= dataLimit ? false : true,
			canNotLoad: false,
			isShow: false
 		})
	}
	componentDidMount() {//
		var title //根据type判断Title
		switch (this.props.location.state.type) {
				case 'enroll':
				 title = '报名通知'
				break;
				case 'answer':
					title = '回答通知'
				break;
				case 'comment':
					title = '评论通知'
				break;
				case 'adopt':
					title = '采纳通知'
				break;
				case 'focus':
					title = '关注通知'
				break;
				case 'note':
					title = '企业公告'
				break;
				case 'message':
					title = '系统通知'
				break;
				case 'invited':
					title = '邀请'
				break;
			default:

		}
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE",title)
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
	gotToDetail(re,redID,type,action){//原来跳转的方法 现废弃 但是先保留
		// var url //定义跳转的Url
		// Dispatcher.dispatch({
		// 	actionType: 'readMessage',
		// 	id: redID,
		// 	type: type,
		// 	action: action
		// })
		// switch (this.props.location.state.type) {
		// 	case 'enroll':
		// 		url=`${__rootDir}/lesson/offline/${re}`;
		// 		break;
		// 	case 'answer':
		// 		url=`${__rootDir}/QaDetail/${re}`;
		// 		break;
		// 	case 'comment':
		// 		url=`${__rootDir}/QaDetail/${re}`;
		// 	break;
		// 	case 'adopt':
		// 		url=`${__rootDir}/QaDetail/${re}`;
		// 	break;
		// 	case 'focus':
		// 		url=`${__rootDir}/QaDetail/${re}`;
		// 	break;
		// 	case 'invited':
		// 		url=`${__rootDir}/QaDetail/${re}`;
		// 	break;
		// 	default:
		//
		// }
		// this.props.history.push(url);
	}
	invited(){//邀请讲师
		var list = this.state.data.map((item,index)=>{//由于是5个一样的菜单，所以偷懒写了个Map循环
		 var title
		 var EAFTitle  //各种类型的标题
		 var qa_title//问题标题
		 var invite_time//邀请时间
		 var BgColor ='#EEEEEE'
		 var row //现实行数
		 var id //跳转详情的ID
		 var height = null //显示内容的高度
		 if (item.isRead) {
			 BgColor = '#FCFCFC'
		 }
		 var content=item.contentNew || item.content
		 var actionTime = new Date(item.send_time).format("yyyy-MM-dd")

			 EAFTitle = content.questionTitle || ''
			 id = content.questionId || ''
			 row = 2
			 qa_title ='问题标题';
			 invite_time = '邀请时间';
			 if (item.action==1) {
				 title='您被邀请回答问题:'
			 }
			 if (item.action==2) {
				 title='您收到的邀请因超过4小时未接受而失效:'
			 }
			 if (item.action==3) {
				 title='您已接受的邀请超过12小时还未提交回答:'
			 }
			 if (item.action==4) {
				 title='您接受的邀请因超过24小时未提交回答而失效:'
			 }


	  var limit = Math.floor(parseInt(devWidth-48) / (parseInt(14))) * row * 2;
		 var more = null
		 if (EAFTitle.length > EAFTitle.subCHStr(0,limit-7).length) {
			 EAFTitle = EAFTitle.subCHStr(0,limit-7)+'...';
			 more = (
					 <span style={{fontSize:14,color:'#2196f3'}}>查看></span>
			 )
		 }
		 return(
				 <div style={{...styles.div,backgroundColor:BgColor,marginTop:(index==0) ? 0 : 15}} key={index} onClick={this.gotToDetail.bind(this,id,item.id,item.type,item.action)}>
					 <div style={{...styles.TitleDiv}}>
						 <span style={{...styles.titleSpan}}>{title}</span>
					 </div>
					 <div>
					 	{invite_time}<span style={{color:'#333'}}>{invite_time}</span>
					 </div>
					 <div style={{...styles.enrollDiv}}>
						 {qa_title}<span style={{...styles.contentSpan,WebkitLineClamp: row,height:height}}>{EAFTitle}</span>
					 </div>
					 <div style={styles.time}>
						 <span style={{fontSize:12,color:'#999999'}}>{actionTime}</span>
					 </div>
				 </div>
		 )
	 })
	 return list
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


	enrollList(){// 报名通知  采纳通知 关注通知
		var list = this.state.data.map((item,index)=>{//由于是5个一样的菜单，所以偷懒写了个Map循环
		 var title
		 var EAFTitle  //各种类型的标题
		 var BgColor ='#EEEEEE'
		 var row //现实行数
		 var id //跳转详情的ID
		 var height = null //显示内容的高度
		 var time_type//时间
		 var content_type//内容类型

		 var firstArry = [];//用来临时存储
		 var keyArry = [];//用来存储body中取出来作为key的数组
		 var strArry = [];//用来存储body中除去key以为的部分
		 var body_str = null;//body字段内容
		 var first_str ='';//数组中移除的第一项的value
		 var body_content = '';//最终解析出来的body内容

		 if (item.isRead) {
			 BgColor = '#FCFCFC'
		 }
		 var content=item.contentNew || item.content;
		 var actionTime = new Date(item.send_time).format("yyyy-MM-dd")

		 if (this.props.location.state.type=='enroll') {//如果是报名通知
			 EAFTitle = content.title || ''
			 id = content.resourceId || ''
			 row = 2;
			 time_type = '报名时间：';
			 content_type ='报名课程：';

			 if (item.action==1) {
				 title='您有一门课程报名通过了:';
			 }
			 else if (item.action==2) {
				 title='您有一门课程报名失败了:'
			 }
			 else if (item.action==3) {
				 title='您收到来自'+content.superNickname+'的课程报名:'
			 }
			 else {
				 //新增action，即action>5,UI显示title  body  time
				 //解析完body字段，通过key、value的形式拼接body字符串
				 body_content = this.Analysis_body(content,firstArry,keyArry,strArry);
			 }
		 }
		 if (this.props.location.state.type=='adopt') {
			 row = 1
			 id = content.questionId || ''
			 height = 17 //给一行的高度
	  	 title = '您的回答被采纳为最佳答案:'
			 time_type = '采纳时间：';
			 content_type ='采纳内容：';
			 EAFTitle = content.answerContent || ''
		 }
		 if (this.props.location.state.type=='focus') {//关注
			 row = 1
			 height =17
			 id = content.questionId || '';
			 time_type = '关注时间：';
			 content_type = '关注问题：'
			 title = (
				 <div>
				 {content.accountNickname} <span style={{fontSize:14,color:'#999'}}>关注了您的问题:</span>
				 </div>
			 )
			 EAFTitle = content.questionTitle || ''
		 }
	  var limit = Math.floor(parseInt(devWidth-48) / (parseInt(14))) * row * 2;
		 var more = null
		 if (EAFTitle.length > EAFTitle.subCHStr(0,limit-7).length) {
			 EAFTitle = EAFTitle.subCHStr(0,limit-7)+'...';
			 more = (
					 <span style={{fontSize:14,color:'#2196f3'}}>查看></span>
			 )
		 }
		 return(
				 <div style={{...styles.div,backgroundColor:BgColor,marginTop:(index==0) ? 0 : 15}} key={index} onClick={this.gotToDetail.bind(this,id,item.id,item.type,item.action)}>
				 {
					 content.body ?
					 <div>
					 		<div style={{fontSize:14,color:'#333'}}>{content.title}</div>
							<div style={{marginTop:10,fontSize:14,color:'#333'}}>{body_content}</div>
							<div style={styles.time}>
								<span style={{fontSize:12,color:'#999999'}}>{actionTime}</span>
							</div>
					 </div>
					 :
						<div>
							 <div style={{...styles.TitleDiv}}>
								<span style={{...styles.titleSpan}}>{title}</span>
							</div>
							<div style={{marginTop:10}}>{time_type}<span style={{color:'#333',marginTop:10}}>{actionTime}</span></div>
							<div style={{...styles.enrollDiv,marginTop:10}}>
							 {content_type}
								<span style={{...styles.contentSpan,WebkitLineClamp: row,height:height}}>{EAFTitle}</span>
							</div>
							<div style={styles.time}>
								<span style={{fontSize:12,color:'#999999'}}>{actionTime}</span>
							</div>
						 </div>
					 }
				 </div>
		 )
	 })
	 return list
	}
	messageGTD(action,id){//已废弃
		// var url
		// if (action== 8 || action== 9 || action== 10) {//直接返回
		// 	return
		// }
		// if (action== 1 || action== 2 || action== 15) {//直播课
		// 	url=`${__rootDir}/lesson/live/${id}`
		// }
		// if (action== 3) {//视频课程
		// 	url=`${__rootDir}/lesson/online/${id}`
		// }
		// if (action== 4) {//线下课
		// 	url=`${__rootDir}/lesson/offline/${id}`
		// }
		// if (action== 5 || action== 16) {//问答
		// 	url=`${__rootDir}/QaDetail/${id}`
		// }
		// if (action== 11 || action== 12 || action== 13 || action== 14) {//话题
		// 	url=`${__rootDir}/TopicDetail/${id}`
		// }
		// if (action== 7) {//计划
		// 	url=`${__rootDir}/CoursePlanDetail/${id}`
		// }
		// this.props.history.push(url);
	}
	message(){//系统公告
		var list = this.state.data.map((item,index)=>{//由于是5个一样的菜单，所以偷懒写了个Map循环
		 var title,EAFTitle,row
		 var content=item.contentNew || item.content;
		 var BgColor ='#EEEEEE'
		 var id;
		 var height = null //显示内容的高度
		 switch (item.action) {
			 	case 1:
					title='您关注的直播系列下更新一门课程'
					EAFTitle =content.seriesTitle
					id = content.resourceId
		 		break;
				case 2:
					title='您预约的直播课即将开始上课'
					EAFTitle = content.title
					id = content.resourceId
		 		break;
				case 3:
					title='您设置上线提醒的视频课上线了'
					EAFTitle = content.title
					id = content.resourceId
		 		break;
				case 4:
					title='您报名/收到报名的线下课即将开始'
					EAFTitle = content.title
					id = content.resourceId
		 		break;
				case 5:
					title='您关注的问题收到别人的新回答'
					EAFTitle = content.questionTitle
					id = content.questionId
		 		break;
				case 6:
					title='您关注的问题提问者设置采纳'//+content.questionTitle+'
					EAFTitle = content.questionTitle
					id = content.questionId
		 		break;
				case 7:
					title='您的学习计划每日提醒'
					EAFTitle = content.title
					id = content.planId
		 		break;
				case 8:
					title='您关注的讲师'+content.teacherNickname+'更新了一门课程'
					EAFTitle = content.title
					// id = content.resourceId
		 		break;
				case 9:
					title=content.title || ''
		 		break;
				case 10:
					title= content.title || ''
		 		break;
				case 11:
					 title='您关注的话题新增了'+content.updateNum+'条问答'
					 EAFTitle = content.topicTitle
					 id = content.topicId
				break;
				case 12:
						title='您擅长的话题新增了'+content.updateNum+'条问答'
						EAFTitle = content.topicTitle
						id = content.topicId
				break;
				case 13:
					title='您关注的话题新上传了'+content.updateNum+'门课程'
					EAFTitle = content.topicTitle
					id = content.topicId
				break;
				case 14:
					title='您擅长的话题新上传了'+content.updateNum+'门课程'
					EAFTitle = content.topicTitle
					id = content.topicId
				break;
				case 15:
					title= '最新直播课上线啦!快来预约吧!'
					EAFTitle = content.title
					id = content.resourceId
				break;
				case 16:
					title='大家都在讨论的精彩问答:'
					EAFTitle = content.questionTitle
					id = content.questionId
				break;
		 }
		 if (item.isRead) {
			 BgColor = '#FCFCFC'
		 }
		 var actionTime = new Date(item.send_time).format("yyyy-MM-dd")
		 var limit = Math.floor(parseInt(window.screen.width-48) / (parseInt(14))) * 1 * 2;
		 var more = null
		 return(
				 <div onClick={this.messageGTD.bind(this,item.action,id)} style={{...styles.div,backgroundColor:BgColor,marginTop:(index==0) ? 0 : 15}} key={index}>
					 <div style={{...styles.TitleDiv}}>
						 <span style={{...styles.titleSpan}}>{title}</span>
					 </div>
					 <div style={{...styles.enrollDiv}}>
						 <span style={{...styles.contentSpan,WebkitLineClamp: row,height:height}}>{EAFTitle}</span>
					 </div>
					 <div style={styles.time}>
						 <span style={{fontSize:12,color:'#999999'}}>{actionTime}</span>
					 </div>
				 </div>
		 )
	 })
	 return list
	}
	answerList(){//回答通知  评论通知
		var list = this.state.data.map((item,index)=>{
		 var BgColor ='#EEEEEE'
		 if (item.isRead) {
			 BgColor = '#FCFCFC'
		 }
		 var title  //标题
		 var id //详情ID
		 var nick_name  ///昵称
		 var time_type//时间
		 var content_type//内容类型
		 var thk_text = ''; //xx感谢回答
		 var content=item.contentNew || item.content;
		 var actionTime = new Date(item.send_time).format("yyyy-MM-dd")
		 var context //内容
		 var limit = Math.floor(parseInt(devWidth-48) / (parseInt(14))) * 2 * 2;
		 if (this.props.location.state.type=='answer') {
				title = '您的问题收到一条新的回答:'
				id = content.questionId || ''
				nick_name = content.answererNickname || '';
				time_type = '回答时间：';
				content_type = '回答内容：';

				context = content.answerContent || ''
		 }
		 if (this.props.location.state.type=='comment') {
			 context = content.replyContent || ''
			 id = content.questionId || ''
			 thk_text = content.answererNickname + ':谢谢回答~';
			 content_type = '问题标题：';
			 if (item.action==1) {
					title = '您的回答收到一条新的评论:'
					time_type = '评论时间：';

			 }
			 if (item.action==2) {
					title = '您的评论收到一条新回复:';
					time_type = '恢复时间：';
			 }
				 nick_name = content.replyerNickname || ''
		 }
		 context = nick_name+':'+context
		 var more = null
		 if (context.length > context.subCHStr(0,limit-7).length) {
			 context = context.subCHStr(0,limit-9)+'...';
			 more = (
					 <span style={{fontSize:14,color:'#2196f3'}}>查看></span>
			 )
		 }

		 return(

				 <div style={{...styles.div,backgroundColor:BgColor,marginTop:(index==0) ? 0 : 15,}} key={index} onClick={this.gotToDetail.bind(this,id,item.id,item.type,item.action)}>
					 <div style={{...styles.TitleDiv}}>
						 <span style={{...styles.titleSpan}}>{title}</span>
					 </div>
					 <div style={{marginTop:10}}>{time_type}<span style={{color:'#333'}}>{actionTime}</span></div>
					 <div style={{...styles.LineClamp,width:window.screen.width-48,height:20,WebkitLineClamp:1}}>
					 	{content_type}
						 <span style={{fontSize:14,color:'#333333'}}>
							 {content.questionTitle}
						 </span>
					 </div>
					 <div style={styles.contentDiv}>
						 <span style={{fontSize:14,color:'#333',height:28}}>
							 {thk_text}
						 </span>
					 </div>
					 <div style={styles.time}>
						 <span style={{fontSize:12,color:'#999999'}}>{actionTime}</span>
					 </div>
				 </div>
			 )
		 })
		 return list
	}
	note(){//企业公告
		var list = this.state.data.map((item,index)=>{
		 var BgColor ='#EEEEEE'
		 if (item.isRead) {
			 BgColor = '#FCFCFC'
		 }
		 var title  //发布类型
		 var content=item.contentNew || item.content;
		 var actionTime = new Date(item.send_time).format("yyyy-MM-dd")
		 var context =''//内容
		 var timeType ='';//时间类型文案
		 var task_title ='';//任务标题
		 var contextTitle // 内容标题
		 var noteDemc = '';//内容类型文案
		 var superNickname = null //action为1 ，2 的时候 上级的昵称
		 var shwoContext = null
		 var limit = Math.floor(parseInt(devWidth-48) / (parseInt(14))) * 2 * 2;
		 if (item.action==1) {
				superNickname = (
					<span style={{fontSize:14,color:'#333333'}}>{content.superNickname || ''}</span>
				)
				timeType ='发布时间：';
				task_title ='任务标题：';
				title = ' 发布了任务';
				contextTitle = content.title  //内容标题
				context = content.content || ''
				noteDemc = '任务描述：'
		 }
		 if (item.action==2) {
			 superNickname = (
				 <span style={{fontSize:14,color:'#333333'}}>{content.superNickname || ''}</span>
			 )
			 timeType ='编辑时间：';
			 task_title ='任务标题：';
			 title = ' 编辑了任务';
			 contextTitle = content.title
			 noteDemc = '任务描述：'
			 context = content.content || ''
		 }
		 if (item.action==3) {
			  timeType ='任务开始时间：';
				task_title ='任务标题：';
				title = '来自您所属企业的任务通知:'
				contextTitle = content.title
				// context =  content.title || ''
		 }
		 if (item.action==4) {
			  timeType ='任务截止时间：';
				task_title ='任务标题：';
				title = '来自您所属企业的任务即将截止通知:'
				contextTitle = content.title
		 }
		 if (item.action==5) {
			  timeType ='撤销时间：';
				task_title ='任务标题：';
				title = '您发布的企业任务即将截止通知:'
				contextTitle = content.title
		 }
		 if (item.action==6) {
			 superNickname = (
				 <span style={{fontSize:14,color:'#333333'}}>{content.superNickname || ''}</span>
			 )
			 timeType ='发布时间：';
			 task_title ='任务标题：';
			 title = ' 发布了企业通知：'
			 contextTitle = content.title
			 context = content.content || ''
			 noteDemc = '任务描述：'
		 }
		 if (item.action==7) {
			 superNickname = (
				<span style={{fontSize:14,color:'#333333'}}>{content.superNickname || ''}</span>
			)
				timeType ='发布时间：';
				title = '发布了企业公告:'
				contextTitle = content.title;
				noteDemc = '通知内容：'
		 }
		 if (item.action==8) {
			  timeType ='发布时间：';
				task_title ='公告标题：';
				title = '来自您所属企业的公告:'
				contextTitle = content.title
				context = content.content || '';
				noteDemc = '公告内容：'
		 }
		 if(item.action == 9){
			 timeType ='发布时间：';
			 title = '企业一周学习周报：'
		 }
		 if (context.length > context.subCHStr(0,limit-7).length) {
			 context = context.subCHStr(0,limit-7)+'...';
			 shwoContext=  (
				 <div style={{marginRight:24,float:'right',marginTop:-6}}>
					 <span style={{fontSize:14,color:'#2196f3'}}>展开</span>
				 </div>
			 )
		 }
		 return(
				 <div style={{...styles.div,backgroundColor:BgColor,marginTop:(index==0) ? 0 : 15,height:130}} key={index}>
					 <div>
						 <div style={{...styles.TitleDiv}}>
							 <span style={{...styles.titleSpan}}>{superNickname}{title}</span>
						 </div>
						 <div style={{marginTop:10}}>{timeType}<span style={{color:'#333'}}>{actionTime}</span></div>

						 <div style={{...styles.LineClamp,width:window.screen.width-48,height:20,WebkitLineClamp:1,marginTop:10}}>
						 	{task_title}
							 <span style={{fontSize:14,color:'#333333'}}>
								 {contextTitle}
							 </span>
						 </div>
						 <div style={{...styles.contentDiv,marginTop:6,lineHeight:1,marginBottom:6}}>
							 <span style={{fontSize:14,color:'#999999',height:28}}>
								 {noteDemc}{context}
							 </span>
						 </div>
						 <div style={styles.time}>
							 <span style={{fontSize:12,color:'#999999'}}>{actionTime}</span>

						 </div>
						 <div></div>
							{shwoContext}
				 </div>
				 </div>
		 )
	 })
	 return list
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
				{
					this.props.location.state.type == 'enroll' ?
						<Link to={`${__rootDir}/list/offline`}>
							<div style={{width:120,height:39,border:'1px solid #666666',borderRadius:'40px',textAlign:'center',lineHeight:2.5,marginLeft:(devWidth-120)/2,marginTop:30}}>
								<span style={{fontSize:16,color:'#666666'}}>去报名学习</span>
							</div>
						</Link>
					: null
				}

			</div>
		)

		var type = this.props.location.state.type || ''
		var list  //定义一个变量 由类型控制最终呈现的结果
    // newHot最新最热
    // 回答 maAnwswer@2.png 评论 maComment.@2x.png 采纳 maAdopt@2x.png 关注 maFocus@2x.png 企业 Group@2x.png 通知 maNew@2x.png
		if(type=='enroll' || type=='adopt' || type=='focus'){
			list = this.enrollList()
		}else if (type=='answer' || type=='comment') {
			list = this.answerList()
		}else if (type=='note') {
			list = this.note()
		}else if(type=='message'){
			list= this.message()
		}else if (type=='invited') {
			list = this.invited()
		}
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
    height:devHeight,
    width:devWidth,
    backgroundColor:'#ffffff',
		overflowY:'scroll',
		overflowX:'hidden'
  },
  div:{//每个菜单的DIV
    width:window.screen.width-48,
    backgroundColor:'#EEEEEE',
    borderRadius:2,
    marginLeft:12,
		padding:'7px 12px 14px 12px',
    position:'relative',
    top:15,
		color:'#999',
		fontSize:14,
  },
  TitleDiv:{//左边的DIV
    width:devWidth-48,
    height:20,
		marginTop:10,
		color:'#333',
		fontSize:14
  },
  contentDiv:{
		fontSize:14,
		marginTop:10,
  },
	enrollDiv:{
		marginTop:10,
	},
  contentSpan:{
    fontSize:14,
    color:'#333333',
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
	  WebkitLineClamp: 2,
		lineHeight:'20px',
  },
  titleSpan:{
    fontSize:14,
    color:'#333'
  },
  image:{
    marginTop: 7,
    marginLeft: 18
  },
  font:{
    fontSize: 14,
    color:'#333333',
    // marginTop: 15
    position:'relative',
    top:15,
  },
  more:{
    // top:22,
    float:'right',
    marginRight:16,
    marginTop:22
  },
	LineClamp:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		// WebkitLineClamp: 1,
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
	}
};
export default PgEnrollList;
