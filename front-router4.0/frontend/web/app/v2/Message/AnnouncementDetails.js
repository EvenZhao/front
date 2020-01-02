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

class AnnouncementDetails extends React.Component {
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
			content:{},
			send_time:'',
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
		EventCenter.emit("SET_TITLE",'铂略财课-公告详情')
		this.e_GetMessageDetail = EventCenter.on('GetMessageDetailDone',this._handelGetmessageDetails.bind(this));
	}
	componentWillUnmount() {
		this.e_GetMessageDetail.remove()
	}

	removeHtmlTag(str) {
		if(str) {
			var str1 = str.replace(/<[^>]+>/g,"");
			var str2 = str1.replace(/&nbsp;/ig,'');
		}
		return str2;
	}

	_handelGetmessageDetails(re){
		if(re.err){
			return false;
		}
		if(re.result){
			var result = re.result;
			this.setState({
				content:result.content||{},
				send_time:result.send_time,
			})
		}
	}

	render(){
		var send_time = (
			<span>
				{new Date(this.state.send_time).format('yyyy-MM-dd')}
				{new Date(this.state.send_time).format('hh:mm')}
			</span>
		)
		return (
			<div style={styles.container}>
				<div style={styles.note_box1}>
					<div style={styles.title_box}>
						<div style={styles.title}>来自您所属企业的公告</div>
						<div style={styles.time}>{send_time}</div>
					</div>
					<div style={{fontSize:14,color:'#333',marginTop:10}}>{this.state.content.title}</div>
					<div style={styles.note_text}>
						{this.removeHtmlTag(this.state.content.content)}
					</div>
				</div>
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
		overflowX:'hidden',
  },
	note_box1:{
		width:window.screen.width - 54,
		padding:15,
		margin:'20px 12px 0 12px',
		backgroundColor:'#eee',
		borderRadius:2,
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
		flex:1
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
		marginTop:10,
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
	},
	note_content:{
		position:'relative',
		borderBottom:'solid 1px #d5d5d5',
		paddingBottom:10,
		paddingRight:25,
	},
	task_title:{
		fontSize:14,
		color:'#333',
		width:window.screen.width - 80,
		height:40,
		lineHeight:'24px'
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
};

export default AnnouncementDetails;
