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
class ReviewNoticeList extends React.Component {
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
		EventCenter.emit("SET_TITLE",'铂略财课-待我审核')
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

		if(jumpUrl){
			var urlArray = jumpUrl.split('/');
			urlArray = urlArray.splice(3,urlArray.length-3);
			var isKey = urlArray[urlArray.length-1];
			var new_array;
			var params='';

			if(urlArray[0]=='test'){
				new_array = urlArray.splice(1,urlArray.length-1)
			}
			else {
				new_array = urlArray;
			}
			console.log('new_array===',new_array);
			if(new_array.length >0){
				if(new_array[0] == 'offlineToExamineDetail' || new_array[0] == 'offlineHistoryToExamineDetail'){
					params = new_array[1];
					this.props.history.push({pathname:`${__rootDir}/offlineHistoryToExamineDetail/${params}`});
				}
			}

			// for(var i=0;i<new_array.length;i++){
			// 	params += '/' + new_array[i]
			// }
			// this.props.history.push({pathname:`${__rootDir}` + params, query: null, hash: null, state: {}});
		}
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
 					 if(content[keyArry[i]] == null){
 						 content[keyArry[i]] = '';
 					 }
 				// 	 if(keyArry[i] == 'title'){
 				// 		 title = content[keyArry[i]]
 				// 	 }
 				// 	 if(keyArry[i] == 'offlineDate'){
 				// 		 offlineDate = content[keyArry[i]]
 				// 	 }
 					 body_content += content[keyArry[i]] + strArry[i];
 				  }

 					body_content=first_str+body_content;

 					return	body_content;
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
		 var id //详情ID
		 var time_type//时间
		 var content_type//内容类型
		 var content=item.contentNew || item.content;
		// var actionTime = new Date(item.send_time).format("yyyy-MM-dd")
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
		 var noteContent;//解析body的内容
       body_content = this.Analysis_body(content,firstArry,keyArry,strArry);
			 noteContent = body_content
			 course_title = content.title
			 course_date = content.offlineDate
       return(
				 <div key={index}>
					 <div style={{textAlign:'center'}}>
							<div style={styles.send_time}>{new_sendTime}</div>
					 </div>
  				 <div style={{...styles.div,backgroundColor:BgColor,marginTop:15,}} onClick={this.gotToDetail.bind(this,jumpUrl,item.id,item.type,item.action)}>
  					 <div style={{...styles.TitleDiv}}>
  						 {noteContent}
  					 </div>
						 <div style={{...styles.note_text,...styles.LineClamp,width:window.screen.width-48,height:40,lineHeight:'20px'}}>
								 {course_title}
  					 </div>
						 <div style={{...styles.note_text,...styles.LineClamp,width:window.screen.width-48,height:20,lineHeight:'20px'}}>
								<div>(时间：{course_date})</div>
						</div>
  				 </div>
					</div>
  		)
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
    height:window.screen.height,
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
	LineClamp:{
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
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
};
export default ReviewNoticeList;
