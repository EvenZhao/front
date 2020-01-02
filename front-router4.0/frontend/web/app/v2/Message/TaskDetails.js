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

var dataLimit = 15

class TaskDetails extends React.Component {
	constructor(props) {
	    super(props);
			this.dataSkip = 0
			this.wx_config_share_home = {
					title: '消息通知详情',
					desc: '',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
		this.state = {
			list:[],
			listSize:0,
			send_time:'',
			big_title:'',
		};
	}
	componentWillMount() {
		if(this.props.match.params.id){
			Dispatcher.dispatch({
				actionType: 'GetMessageDetail',
				id:this.props.match.params.id
			})
		}
	}


	componentDidMount() {

		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE",'铂略财课-任务详情')
		this.e_GetMessageDetail = EventCenter.on('GetMessageDetailDone',this._handelGetmessageDetails.bind(this));

	}
	componentWillUnmount() {
		this.e_GetMessageDetail.remove()
	}

	_goLink(jumpUrl){
		if(jumpUrl){
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
			this.props.history.push({pathname:`${__rootDir}` + params, query: null, hash: null, state: {}});
		}
	}

	_handelGetmessageDetails(re){
		console.log('re----',re);
		if(re.err){
			return false;
		}
		if(re.result){
			var result = re.result;
			var title;
			switch (result.action) {
				case 10:
					title = '您的学习任务已经开始'
					break;
				case 11:
					title = '『'+re.result.superNickname+'』发布了新的学习任务'
					break;
				case 12:
					title = '您的学习任务已被更新'
					break;
				case 13:
					title = '今日学习任务提醒'
					break;
				case 14:
					title = '您的学习任务即将截止'
					break;
				case 16:
					title = '您的学习任务已被撤销'
				default:
			}
			this.setState({
				big_title:title,
				listSize: result.content.listSize || 0,
				send_time:result.send_time || '',
				list:result.content.taskList || [],
			})
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

	return (
	<div style={styles.container}>
	{this.state.list.length > 0 ?
		<div style={styles.note_box1}>
			<div style={styles.title}>{this.state.big_title}</div>
			<div style={{...styles.title_box,...styles.note_text_box}}>
				<div style={styles.note_number}>共{this.state.listSize}个内容</div>
				<div style={styles.time}>{new Date(this.state.send_time).format('yyyy-MM-dd')}<span>&nbsp;&nbsp;</span>{new Date(this.state.send_time).format('hh:mm')}</div>
			</div>
			{this.state.list.map((item,index)=>{
					return(
						<div style={{...styles.note_content,borderBottom:index ==(this.state.list.length -1) ? 'none' : 'solid 1px #d5d5d5'}} key={index} onClick={this._goLink.bind(this,item.jumpUrl)}>
							<div style={{...styles.task_title,...styles.LineClamp,}}>{item.taskTitle}</div>
							<div style={{fontSize:12,color:'#444',marginTop:5}}>(时间：{item.duration})</div>
							<img src={Dm.getUrl_img('/img/v2/icons/more1213@2x.png')} style={{ width: 7, height: 12,position:'absolute',top:15,right:12,}}/>
						</div>
						)
					})
			 }
		</div>
		:
		listNull
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
		overflowY:'auto',
		overflowX:'hidden'
  },
	note_box1:{
		width:window.screen.width - 54,
		padding:15,
		backgroundColor:'#eee',
		borderRadius:2,
		marginLeft:12,
		marginTop:20
	},
	title_box:{
		display:'flex',
		flexDirection:'row',
		height:22,
		alignItems:'center',
		marginTop:20
	},
	title:{
		fontSize:16,
		color:'#333',
		display:'flex',
		flexDirection:'row',
	},
	time:{
		display:'flex',
		fontSize:12,
		color:'#999',
		justifyContent:'flex-end'
	},
	note_text:{
		fontSize:12,
		color:'#444',
		marginTop:13,
	},
	note_text_box:{
		fontSize:12,
		color:'#999',
		borderBottom:'solid 1px #d5d5d5',
		paddingBottom:13,
	},
	note_number:{
		display:'flex',
		flexDirection:'row',
		flex:1
	},
	note_content:{
		position:'relative',
		borderBottom:'solid 1px #d5d5d5',
		paddingBottom:10,
		paddingRight:25,
		marginTop:20
	},
	task_title:{
		fontSize:14,
		color:'#333',
		width:window.screen.width - 80,
		lineHeight:'24px'
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
};
export default TaskDetails;
