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

class EnrollNoticeList extends React.Component {
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
	componentDidMount() {

		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE",'铂略财课-报名通知')
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

	gotToDetail(jumpUrl,redID,type,action){
		Dispatcher.dispatch({
			actionType: 'readMessage',
			id: redID,
			type: type,
			action: action,
		})
		if(jumpUrl){
			console.log('jumpUrl==',jumpUrl);
			var urlArray = jumpUrl.split('/');
			urlArray = urlArray.splice(3,urlArray.length-3);
			var code = urlArray[urlArray.length-1];
			var isMainHolder_id = '';
			var str = urlArray[urlArray.length-2];
			if(str == 'PgOffLlineMainHolderEnrollDetail'){
				isMainHolder_id = '_id'
			}
			else {
				isMainHolder_id = ''
			}
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
			this.props.history.push({pathname:`${__rootDir}` + params, query: null, hash: null, state: {_id:isMainHolder_id,code:code}});
		}
		// setTimeout(function(){ window.location=jumpUrl; } , 1500);

	}

 //解析body
 Analysis_body(content,firstArry,keyArry,strArry){
		//  var keyArry = [];//用来存储body中取出来作为key的数组
		//  var strArry = [];//用来存储body中除去key以外的部分
	   var body_str = null;//body字段内容
	   var first_str ='';//数组中移除的第一项的value
		 var body_content = '';//最终解析出来的body内容
		 var noteContent ='';
		 var course_content;
		 var bodyArray = [];
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
					var title ='';
					var offlineDate='';
					for(var i=0;i < keyArry.length;i++){
					 if(content[keyArry[i]] == null || ''){
						 content[keyArry[i]] = '';
					 }
					 body_content +=content[keyArry[i]] + strArry[i];
				  }
					body_content=first_str+body_content;
					return body_content
  		 }
			 else {
			 	   return content.body;
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
		 if (item.isRead) {
			 BgColor = '#f9f9f9'
		 }
		 var title  //标题
		 var time_type = '报名时间：';//时间
		 var content_type ='报名课程：';//内容类型
		 var content=item.contentNew || item.content;
		 var actionTime = new Date(item.send_time).format("yyyy-MM-dd")
		 var new_sendTime = someDay(item.send_time);
		 var context = content.title || '' //内容
     var id = content.resourceId || '' //详情ID
		 var jumpUrl = item.jumpUrl;//跳转url

     var firstArry = [];//用来临时存储
		 var keyArry = [];//用来存储body中取出来作为key的数组
		 var strArry = [];//用来存储body中除去key以为的部分
		 var body_str = null;//body字段内容
		 var first_str ='';//数组中移除的第一项的value
		 var body_content = '';//最终解析出来的body内容
		 var course_title;//课程标题
		 var course_date;//课程时间
		 var noteContent;//解析body内容

     switch (item.action) {
       case 1:
         title='您有一门课程报名通过了:';
         break;
       case 2:
         title='您有一门课程报名失败了:';
       case 3:
         title='您收到来自'+content.superNickname+'的课程报名:';
         break;
       default:
         //title = content.title;
         body_content = this.Analysis_body(content,firstArry,keyArry,strArry);
				 noteContent = body_content;
				 course_title = content.title;
				 course_date = content.offlineDate
         break;
     }

     if(item.action < 6){
       return(
  				 <div style={{...styles.div,backgroundColor:BgColor,marginTop:15,}} key={index} onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)}>
  					 <div style={{...styles.TitleDiv}}>
  						 {title}
  					 </div>
  					 <div style={{marginTop:10}}>{time_type}<span style={{color:'#333'}}>{actionTime}</span></div>
  					 <div style={{width:window.screen.width-48,}}>
  					 	{content_type}
  						 <span style={{fontSize:14,color:'#333333'}}>
  							 {context}
  						 </span>
  					 </div>
  					 <div style={styles.time}>
  						 <span style={{fontSize:12,color:'#999999'}}>{actionTime}</span>
  					 </div>
  				 </div>
  			 )
     }else
     {
       return(
				 <div key={index}>
					 <div style={{textAlign:'center'}}>
							<div style={styles.send_time}>{new_sendTime}</div>
					 </div>
  				 <div style={{...styles.div,backgroundColor:BgColor,marginTop:15,}} onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)}>
  					 <div style={{...styles.TitleDiv}}>
  						 {noteContent}
  					 </div>
  					 <div style={{...styles.note_text,width:window.screen.width-48,}}>
								 {course_title}
  					 </div>
						 <div style={{...styles.note_text,width:window.screen.width-48,}}>
						 		<div>(时间：{course_date})</div>
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
		color:'#333',
		fontSize:16
  },
	total:{
		height: 40,
		position:'relative',
    textAlign: 'center',
		marginTop: 24
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
};
export default EnrollNoticeList;
