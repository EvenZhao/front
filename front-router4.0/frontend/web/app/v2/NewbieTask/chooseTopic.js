import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

var countdown
class chooseTopic extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			TopicList: [],
			display: 'none',
			//弹框提示信息
			alert_title: '',
			//弹框的图标
			alert_icon: '',
			icon_width: 0,
			icon_height: 0,
		};
		this.allTopic = []
		//记录选中话题个数
		this.count = 0
	}
	componentWillMount() {

	}
	_handletopicCenterDone(result) {
		console.log('_handletopicCenterDone', result);
		var { result, err } = result
		if (err || !result) {
			return
		}

		this.allTopic = result || [];
		var seletedList = this.allTopic.filter((item) => {
			if (item.isFocus) {
				return item;
			}
		})
		this.count = seletedList.length;
		this.setState({
			TopicList: result || [],
		})
	}
	handlefocusTopicDone(result) {
		console.log('result==',result)

		var {err,result}=result;
		if(err || !result){

			this.setState({
				display: 'block',
				alert_title: err,
				alert_icon: failure_icon,
				icon_width: failure_width,
				icon_height: failure_height,
			}, () => {
				countdown = setInterval(()=> {
					clearInterval(countdown);
					this.setState({
						display: 'none',
					})
				}, 1500);
			});
			return;
		}

		if (result) {
			this.props.history.push(`${__rootDir}/bindWx`)
		}
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE", '铂略财课-选择话题');
		localStorage.removeItem("bindInfo")
		localStorage.removeItem("perfectInfo")
		this._topicCenter = EventCenter.on('topicCenterDone', this._handletopicCenterDone.bind(this));
		this._getfocusTopicDone = EventCenter.on("focusTopicDone", this.handlefocusTopicDone.bind(this))
		var newbieTaskIndex = localStorage.getItem("newbieTaskIndex");
		//全部话题标签
		if (newbieTaskIndex) {
			newbieTaskIndex = JSON.parse(newbieTaskIndex)
			Dispatcher.dispatch({
				actionType: 'topicCenter',
				taskId: newbieTaskIndex[1].id,
			})
		}
	}
	componentWillUnmount() {
		this._topicCenter.remove()
		this._getfocusTopicDone.remove()
	}
	/**
	 * author markwang
	 * deprecated 本月需求：去掉关注话题5个数量限制
	 * version 2019-04-04T13:18:07+0800
	*/
	/*noMore() {
		//验证码不正确，重新发送验证码
		this.setState({
			display: 'block',
			alert_title: '最多只能选取5个话题哦',
			alert_icon: failure_icon,
			icon_width: failure_width,
			icon_height: failure_height,
		}, () => {
			countdown = setInterval(()=> {
				clearInterval(countdown);
				this.setState({
					display: 'none',
				})
			}, 1500);
		});
		return;
	}*/
	/**
	 * 选择话题
	 * @author markwang
	 * @version 2019-04-04T13:15:41+0800
	 * @blog https://www.qdfuns.com/u/26090.html
	 * @example no example
	 * @modification list 2019-04-04 本月需求：去掉关注话题5个数量限制
	 */
	_chooseTopic(index) {
		if (this.allTopic[index].isFocus) {
			this.allTopic[index].isFocus = false;
			this.count--;
		}
		else {
			this.count++;
			/*if (this.count > 5) {
				//当选中话题数超过5个给出提示
				this.count = 5;
				this.noMore()
				return;
			}*/
			this.allTopic[index].isFocus = true;
		}
		this.setState({
			TopicList: this.allTopic
		})
	}

	focusTopic() {
		var newbieTaskIndex = localStorage.getItem("newbieTaskIndex");
		
		//用来存储选中话题的id
		var _arrayIds =[]
		if(this.state.TopicList.length > 0){
			this.state.TopicList.map((item,index)=>{
				var newItem = {}
				if(item.isFocus){
					newItem.topic_id = item.id;
					_arrayIds.push(newItem);
				}
			})
		}

		if (newbieTaskIndex) {
			newbieTaskIndex = JSON.parse(newbieTaskIndex)
			Dispatcher.dispatch({
				actionType: 'focusTopic',
				taskId: newbieTaskIndex[1].id,
				topicIds: _arrayIds
			})
		}
	}
	render() {
		var TopicList = this.state.TopicList.map((item, index) => {
			return (
				<div key={index} style={{ ...styles.Topic, border: item.isFocus ? '1px solid #2196F3' : '1px solid #ffffff' }} onClick={this._chooseTopic.bind(this, index)}>
					<div style={{ marginLeft: 11, marginTop: 14 }}>
						<img src={item.icon} height="20" width="20" />
					</div>
					<div style={{ marginLeft: 11 }}>
						<span style={{ fontSize: 12, color: '#0f3455' }}>{item.name}</span>
					</div>
				</div>
			)
		})
		return (
			<div style={{ ...styles.div }}>
				<div style={{ width: devWidth, height: 30, backgroundColor: '#f37633', overflowX: 'scroll', overflowY: 'hidden' }}>
					<span style={{ fontSize: 12, color: '#ffffff', marginLeft: 12 }}>选择您感兴趣的话题，以获取为您度身定制的个性化推荐！</span>
				</div>
				<div style={{ ...styles.TopicList }}>
					{TopicList}
				</div>
				<div>
					{
						this.count > 0 ?
							<div style={{ ...styles.buttom, backgroundColor: '#2196F3' }} onClick={this.focusTopic.bind(this)}>
								<span style={{ fontSize: 18, color: '#FFFFFF', fontFamily: 'pingfangsc-regular', letterSpacing: '-0.43px' }}>下一步</span>
							</div>
							:
							<div style={{ ...styles.buttom }}>
								<span style={{ fontSize: 18, color: '#FFFFFF', fontFamily: 'pingfangsc-regular', letterSpacing: '-0.43px' }}>下一步</span>
							</div>
					}
				</div>
				{/*弹框*/}
				<div style={{ display: this.state.display }}>
					<div style={{ ...Common.alertDiv, }}>
						<div style={{ marginBottom: 14, paddingTop: 15, height: 30, }}>
							<img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height} />
						</div>
					</div>
					<div style={{ color: '#fff', position: 'absolute', zIndex: 1001, top: 230, left: (window.screen.width - 170) / 2, width: 190, textAlign: 'center' }}>{this.state.alert_title}</div>
				</div>
			</div>
		)
	}
}

var styles = {
	div: {
		height: devHeight,
		width: devWidth,
		backgroundColor: '#f4f4f4',
		// overflowY: 'scroll',
		// overflowX: 'hidden',
	},
	TopicList: {
		width: devWidth,
		height: devHeight - 126,
		overflowX: 'hidden',
		overflowY: 'scroll',
		display: 'flex',
		flexDirection: 'flex-wrap',
		flexWrap: 'wrap',
		paddingTop: 22,
	},
	Topic: {
		width: (devWidth - 68) / 4,
		height: (devWidth - 68) / 4,
		backgroundColor: '#FFFFFF',
		marginLeft: 12,
		marginBottom: 10,
		borderRadius: '12px',
		lineHeight: 1.2,
		overflow: 'hidden'
		// border:'1px solid'
		// border:1
	},
	buttom: {
		backgroundColor: '#d1d1d1',
		width: devWidth - 30,
		marginLeft: 15,
		borderRadius: '4px',
		textAlign: 'center',
		lineHeight: 2.5,
		height: 45,
		marginTop: 14
	}

}

export default chooseTopic;
