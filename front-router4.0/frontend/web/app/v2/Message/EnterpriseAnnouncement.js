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

class EnterpriseAnnouncement extends React.Component {
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
		EventCenter.emit("SET_TITLE",'铂略财课-企业公告')
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

	removeHtmlTag(str) {
    if(str) {
      var str1 = str.replace(/<[^>]+>/g,"");
      var str2 = str1.replace(/&nbsp;/ig,' ');
    }
    return str2;
  }

	gotToDetail(jumpUrl,redID,type,action){
		console.log('jumpUrl==',jumpUrl);
		Dispatcher.dispatch({
			actionType: 'readMessage',
			id: redID,
			type: type,
			action: action
		})

	if(jumpUrl){
		var str_params = jumpUrl.split('/')[jumpUrl.split('/').length-1];
		var urlArray = jumpUrl.split('/');
		urlArray = urlArray.splice(3,urlArray.length-3);
		var new_array;
		var params='';

		if(urlArray[0]=='test'){
			new_array = urlArray.splice(1,urlArray.length-1)
		}
		else {
			new_array = urlArray;
		}
		for(var i=0;i<new_array.length;i++){
			params += '/' + new_array[i]
		}
		// console.log('params',params)
		if (params.indexOf('/activity/') > -1) {
			window.location.href=`${__rootDir}`+params
		} else {
			this.props.history.push({pathname:`${__rootDir}` + params, query: null, hash: null, state: {}});
		}
		// this.props.history.push({pathname:`${__rootDir}` + params, query: null, hash: null, state: {}});
		
	 }
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
		 var content_type ='';//内容类型
		 var timeType ='';
		 var content=item.contentNew || item.content;
		 var actionTime = (
		 	<span>{new Date(item.send_time).format("yyyy-MM-dd")}&nbsp;&nbsp;{new Date(item.send_time).format("hh:mm")}</span>
		 )
		 var sysTime = new Date(item.send_time).format("yyyy-MM-dd");
		 var new_sendTime = someDay(item.send_time);
		 var context = ''; //内容
     var task_title ='';//任务标题
		 var contextTitle // 内容标题
		 var noteDemc = '';//内容类型文案
		 var duration_time ='';//开始--结束时间
		 var messageLength = 0;//消息条数
		 var details = '';
		 var superNickname = null //action为1 ，2 的时候 上级的昵称
     var id = content.resourceId || '' //详情ID
		var jumpUrl = item.jumpUrl;//跳转url

     var firstArry = [];//用来临时存储
		 var keyArry = [];//用来存储body中取出来作为key的数组
		 var strArry = [];//用来存储body中除去key以为的部分
		 var body_str = null;//body字段内容
		 var first_str ='';//数组中移除的第一项的value
		 var body_content = '';//最终解析出来的body内容

     switch (item.action) {
			 	case 1:
          superNickname = (
            <span style={{fontSize:14,color:'#333333'}}>{content.superNickname || ''}</span>
          )
          timeType ='发布时间：';
          task_title ='任务标题：';
          title = ' 发布了任务';
          contextTitle = content.title  //内容标题
          context = content.content || ''
          noteDemc = '任务描述：'
		 		break;
				case 2:
            superNickname = (
             <span style={{fontSize:14,color:'#333333'}}>{content.superNickname || ''}</span>
           )
           timeType ='编辑时间：';
           task_title ='任务标题：';
           title = ' 编辑了任务';
           contextTitle = content.title
           noteDemc = '任务描述：'
           context = content.content || ''
		 		break;
				case 3:
          timeType ='任务开始时间：';
          task_title ='任务标题：';
          title = '来自您所属企业的任务通知：'
          contextTitle = content.title
		 		break;
				case 4:
          timeType ='任务截止时间：';
          task_title ='任务标题：';
          title = '您的学习任务即将截止:'
          contextTitle = content.title
		 		break;
				case 5:
          timeType ='撤销时间：';
          task_title ='任务标题：';
          title = '您发布的企业任务即将截止通知:'
          contextTitle = content.title
		 		break;
				case 6:
            superNickname = (
             <span style={{fontSize:14,color:'#333333'}}>{content.superNickname || ''}</span>
           )
           timeType ='发布时间：';
           task_title ='任务标题：';
           title = ' 您的学习任务已被撤销'
           contextTitle = content.title
           context = content.content || ''
           noteDemc = '任务描述：'
		 		break;
				case 7:
            superNickname = (
            <span style={{fontSize:14,color:'#333333'}}>{content.superNickname || ''}</span>
            )
            timeType ='发布时间：';
            title = '来自您所属企业通知:'
            contextTitle = content.title;
            noteDemc = '通知内容：'
		 		break;
				case 8:
          timeType ='发布时间：';
          task_title ='公告标题：';
          title = '来自您所属企业的公告:'
          contextTitle = content.title
          context =this.removeHtmlTag(content.content) || '';
          noteDemc = '公告内容：'
		 		break;
				case 9:
          timeType ='发布时间：';
					title = '企业一周学习周报：';
					// 添加内容
					context = content.content || ''
		 		break;
				case 10:
					title = '您的学习任务已经开始'
					duration_time = '(时间：'+content.duration+')'
					// context = content.title
					break;
				case 11:
					title = '『'+content.superNickname+'』发布了新的学习任务'
					duration_time = '(时间：'+content.duration+')'
					// context = content.title
					break;
				case 12:
					title = '您的学习任务已被更新'
					duration_time = '(时间：'+content.duration+')'
					// context = content.title

					break;
				case 13:
					title = '今日学习任务提醒'
					duration_time = '(时间：'+content.taskList[0].duration+')'
					messageLength = content.taskList.length;
					context = content.taskList[0].taskTitle
					details=(
						<div style={{...styles.more,display:messageLength > 0 ?'flex':'none'}}>
						 <span style={{marginRight:10}}>查看全部{messageLength}个内容</span>
						 <img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12}}/>
						</div>
					)
					break;
				case 14:
					title = '您的学习任务即将截止'
					duration_time = '(时间：'+content.duration+')'
					// context = content.title
					break;
				case 16:
					title = '您的学习任务已被撤销'
					duration_time = '(时间：'+content.duration+')'
					// context = content.title
				case 17:
					title = '来自您所属企业通知'
					// context = content.title
					details =(
						<div style={{...styles.more}}>
						 <span style={{marginRight:10}}>查看详情</span>
						 <img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12}}/>
						</div>
					)
					break;
				case 18:
					title = '来自您所属企业的公告'
					context = content.content || ''
					details =(
						<div style={{...styles.more}}>
						 <span style={{marginRight:10}}>查看详情</span>
						 <img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12}}/>
						</div>
					)
					break;
        default:
          title = content.title;
          body_content = this.Analysis_body(content,firstArry,keyArry,strArry);
        break;
		 }

     if(item.action < 9){
       return(
         <div onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)} style={{...styles.div,backgroundColor:BgColor,marginTop:15}} key={index}>
					 <div>
						 <div style={{...styles.TitleDiv}}>
							 <span style={{...styles.titleSpan}}>{superNickname}{title}</span>
						 </div>
						 <div style={{marginTop:10}}>{timeType}<span style={{color:'#333'}}>{actionTime}</span></div>
						 <div style={{width:window.screen.width-48,marginTop:10}}>
						 	{task_title}
							 <span style={{fontSize:14,color:'#333333'}}>
								 {contextTitle}
							 </span>
						 </div>
						 <div style={{marginTop:6,lineHeight:1,marginBottom:6}}>
							 <span style={{fontSize:14,color:'#999999',lineHeight:'18px'}}>
								 {noteDemc}{context}
							 </span>
						 </div>
						 <div style={styles.time}>
							 <span style={{fontSize:12,color:'#999999'}}>{sysTime}</span>
						 </div>
						 <div>&nbsp;</div>
					 </div>
				 </div>
  			)
     }
		 else if(item.action >=9 && item.action <= 18){
			 return(
			 <div key={index}>
			 	 <div style={{textAlign:'center'}}>
				 		<div style={styles.send_time}>{new_sendTime}</div>
				 </div>
         <div onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)} style={{...styles.div,backgroundColor:BgColor,marginTop: 15}}>
						 <div style={{...styles.TitleDiv,fontSize:16,color:'#333',}}>
							 <span style={{...styles.titleSpan}}>{title}</span>
						 </div>
						{
							item.action == 9 ?
							<div style={{marginTop:10}}>{timeType}<span style={{color:'#333'}}>{new Date(content .actionTime).format("yyyy-MM-dd")}</span></div>
							:
							<div style={{...styles.LineClamp,...styles.note_text,width:window.screen.width-48,}}>
								{content.title}
						 </div>
						} 
						 
						 <div style={{...styles.LineClamp,...styles.note_text,width:window.screen.width-48,}}>
							{this.removeHtmlTag(context)}
						 </div>
						 <div style={{...styles.note_text,width:window.screen.width-48}}>{duration_time}</div>
						 {details}
						 <div style={{display: item.action == 9 ? 'block' : 'none' , textAlign:'right'}}>{new Date(content .actionTime).format("yyyy-MM-dd")}</div>
				 </div>
				</div>
  			)
		 }
		 else
     {
       return(
         <div onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)} style={{...styles.div,backgroundColor:BgColor,marginTop: 15}} key={index}>
  					 <div style={{...styles.TitleDiv}}>
  						 {title}
  					 </div>
  					 <div style={{width:window.screen.width-48,marginTop:10}}>
  						 <span style={{fontSize:14,color:'#333333'}}>
  							 {body_content}
  						 </span>
  					 </div>
  					 <div style={styles.time}>
  						 <span style={{fontSize:12,color:'#999999'}}>{sysTime}</span>
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
  div:{//每个菜单的DIV
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
	more:{
		display:'flex',
		fontSize:12,
		color:'#999',
		height:20,
		marginTop:10,
		flexDirection:'row',
		justifyContent:'flex-end',
		alignItems:'center',
	},
	LineClamp:{
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
	},
	reply_box:{
		marginTop:10,
		width:window.screen.width-78,
		padding:15,
		fontSize:12,
		color:'#999'
	}
};
export default EnterpriseAnnouncement;
