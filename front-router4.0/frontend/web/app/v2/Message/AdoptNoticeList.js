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

// var dataSkip = 0
var dataLimit = 15
class AdoptNoticeList extends React.Component {
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
	componentDidMount() {

		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE",'铂略财课-采纳通知')
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
		setTimeout(function(){ window.location=jumpUrl; } , 1500);
	}

	removeHtmlTag(str) {
		if(str) {
			var str1 = str.replace(/<[^>]+>/g,"");
			var str2 = str1.replace(/&nbsp;/ig,' ');
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
		 var content=item.contentNew || item.content;
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
		 if(item.action == 1){
			 title = '您的回答被采纳为最佳答案：'
			 context = content.answerContent
			 return(
         <div onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)} style={{...styles.div_box,backgroundColor:BgColor,marginTop:15}} key={index}>
					 <div>
						 <div style={{...styles.TitleDiv,fontSize:14,color:'#999'}}>
							 <span style={{...styles.titleSpan}}>{title}</span>
						 </div>
						 <div style={{marginTop:10}}>采纳时间：<span style={{color:'#333'}}>{actionTime}</span></div>
						 <div style={{...styles.LineClamp,WebkitLineClamp:2,width:window.screen.width-48,marginTop:10}}>
						 	<span style={{fontSize:14,color:'#999'}}>采纳内容：</span>
							 <span style={{fontSize:14,color:'#333333'}}>
							 {this.removeHtmlTag(context)}
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
		 else if(item.action == 2){
        id = content.questionId || ''
        title = '您的答案被采纳了'
        context = content.answerContent || ''
				context = this.removeHtmlTag(context)
       return(
				 <div key={index}>
				 	 <div style={{textAlign:'center'}}>
					 		<div style={styles.send_time}>{new_sendTime}</div>
					 </div>
  				 <div style={{...styles.div_box,backgroundColor:BgColor}} onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)}>
  					 <div style={{...styles.TitleDiv}}>
  						 {title}
  					 </div>
  					 <div style={{...styles.LineClamp,...styles.note_text, }}>
  							 答案：{context}
  					 </div>
						 <div style={{...styles.LineClamp,...styles.reply_box,backgroundColor:boxBgColor,display:content.questionTitle ? 'block':'none'}}>
						 {content.questionTitle}
						</div>
  				 </div>
					</div>
  			 )
     }else
     {
       body_content = this.Analysis_body(content,firstArry,keyArry,strArry);
			 body_content = this.removeHtmlTag(body_content)
       return(
				 <div key={index}>
				 	 <div style={{textAlign:'center'}}>
					 		<div style={styles.send_time}>{sysTime}</div>
					 </div>
  				 <div style={{...styles.div_box,backgroundColor:BgColor}} onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)}>
  					 <div style={{...styles.TitleDiv}}>
  						 {title}
  					 </div>
  					 <div style={{...styles.note_text,width:window.screen.width-48,}}>
  							 {body_content}
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
		color:'#333',
		fontSize:16
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
		width:window.screen.width-48,
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
		width:window.screen.width-78,
		padding:15,
		fontSize:12,
		color:'#999'
	}
};
export default AdoptNoticeList;
