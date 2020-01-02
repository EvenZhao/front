/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import LiveLessonDiv from '../components/LiveLessonDiv';
import OfflineLessonDiv from '../components/OfflineLessonDiv';
import ProductLessonDiv from '../components/ProductLessonDiv';
import Loading from '../components/Loading';

// import scrollHelper from '../../components/scrollHelper.js';
var actionType
var status = {}

class PgTeacherLessonList extends React.Component {
	constructor(props) {
    super(props);
    this.id = ''
    this.data = []
		this.state = {
			listHeight: window.innerHeight-42.5,
      data: [],
			loadLength: '',
			isShow: false,
			Msg: '',
			isOver: false,
			canNotLoad: false,
			isLoading: true,
			reservedLives:[],
			vipPriceFlag:null
		};
	}

	_labelScorll() {
		if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
			if(this.state.loadLength == 0) {
				this.setState({
					isShow: false,
					isOver: true,
				})
			}
			if(this.state.canNotLoad == true) {
				return
			}
			if(this.state.loadLength < 15) {
				this.setState({
					isShow: false,
					isOver: true,
				})
			} else {
				if (this.props.location.state.teacher_id || this.props.location.state.user_id) {
					this.loadmore()
				}else {
					this._loadOnlineMore()
				}
				this.setState({
					isShow: true,
					isOver: false
				})
			}
		}
	}

  _loadOnlineMore() {
    var status = {}
    status = {
      skip: this.state.data.length,
      limit: 15,
			type:this.props.match.params.type
    }
    const les_status = {...status}
    Dispatcher.dispatch({
      actionType: 'MyCollect',
      les_status
    })
  }

	loadmore(){
		if (this.props.location.state.teacher_id || this.props.location.state.user_id) {
			if (this.props.location.state.teacher_id) {
				status = {
					label_id: '',
					teacher_id: this.props.location.state.teacher_id,
					charge_type: '',
					sort: '',
					limit: 15,
					skip: this.state.data.length
				}
			}else {
				status = {
					label_id: '',
					user_id: this.props.location.state.user_id,
					charge_type: '',
					sort: '',
					limit: 15,
					skip: this.state.data.length
				}
			}
			const les_status = {...status}
			Dispatcher.dispatch({
				actionType: actionType,
				les_status
			});
		}
	}

	_handleOnlineCanNotLoad() {
		this.setState({
			canNotLoad: true
		})
	}
	_handleOnMyCollectDone(re){
		console.log('_handleOnMyCollectDone:',re)

		if(re.err){
			return;
		}
		var {user} = re

		if (this.props.match.params.type == 'online') {
			var online_info_list = re.result.online_info_list || []
			this.setState({
				data: this.state.data.concat(online_info_list),
				loadLength: online_info_list.length,
				isShow: false,
				isOver: false
			})
		}
		if (this.props.match.params.type == 'live') {
			var live_info_list = re.result.live_info_list || []
			this.setState({
				data: this.state.data.concat(live_info_list),
				loadLength: live_info_list.length,
				isShow: false,
				isOver: false,
			})
		}
		if (this.props.match.params.type == 'offline') {
			var offline_info_list = re.result.offline_info_list || []
			this.setState({
				data: this.state.data.concat(offline_info_list),
				loadLength: offline_info_list.length,
				isShow: false,
				isOver: false
			})
		}
		if (this.props.match.params.type == 'product') {
			var product_list = re.result.product_list || []
			this.setState({
				data: this.state.data.concat(product_list),
				loadLength: product_list.length,
				vipPriceFlag:user && user.vipPriceFlag ? user.vipPriceFlag:null,
				isShow: false,
				isOver: false
			})
		}
	}
	_handleLiveListDone(re) {
		this._handleOnlineLoadListMoreDone(re)
	}
	_handleOnlineLoadListMoreDone(re){
		console.log('讲师：',re)
			var online_info_list = re.result || []
			this.setState({
				data: this.state.data.concat(online_info_list),
				loadLength: online_info_list.length,
				isShow: false,
				isOver: false,
				reservedLives:re.reservedLives || [],
			})
	}
	_handleOfflineListDone(re){
		this._handleOnlineLoadListMoreDone(re)
	}
	componentWillMount() {

	}
	componentDidMount() {
		window.scrollTo(0,0)
		var type

		if(this.props.match.params.type == 'online') {
			type = '视频课'
			actionType = 'OnlineLoadListMore'
		} else if(this.props.match.params.type == 'live') {
			actionType = 'LiveList'
			type = '直播课'
		} else if(this.props.match.params.type == 'offline') {
			actionType = 'OfflineList'
			type = '线下课'
		}else if(this.props.match.params.type == 'product') {
			type = '专题课'
		}
		if (this.props.location.state.teacher_id || this.props.location.state.user_id) {

			if (this.props.location.state.teacher_id) {

				status = {
					label_id: '',
					teacher_id: this.props.location.state.teacher_id,
					charge_type: '',
					sort: '',
					limit: 15,
					skip: 0
				}
			}else {
				status = {
					label_id: '',
					user_id: this.props.location.state.user_id,
					charge_type: '',
					sort: '',
					limit: 15,
					skip: 0
				}
			}
			const les_status = {...status}
			Dispatcher.dispatch({
				actionType: actionType,
				les_status
			});
		}else {
	    status = {
	      skip: 0,
	      limit: 15,
	      type: this.props.match.params.type
	    }
			const les_status = {...status}
			Dispatcher.dispatch({
				actionType: 'MyCollect',
				les_status
			})
		}


		EventCenter.emit("SET_TITLE",type)
		this._onlineCanNotLoad = EventCenter.on('CanNotLoad', this._handleOnlineCanNotLoad.bind(this))
		this._onMyCollectDone = EventCenter.on('MyCollectDone', this._handleOnMyCollectDone.bind(this))
		this._getLiveList = EventCenter.on('LiveListDone', this._handleLiveListDone.bind(this))
		this._getOnlineLessonList = EventCenter.on('OnlineLoadListMoreDone',this._handleOnlineLoadListMoreDone.bind(this))
		this._getOfflineList = EventCenter.on('OfflineListDone', this._handleOfflineListDone.bind(this))

	}
	componentWillUnmount() {
		this._onlineCanNotLoad.remove()
		this._onMyCollectDone.remove()
		this._getLiveList.remove()
		this._getOnlineLessonList.remove()
		this._getOfflineList.remove()
	}
	render(){
		

		let props = {
			data: this.state.data,
			history:this.props.history
		}
    var lessonDiv
		if(this.props.match.params.type === 'online') {
			lessonDiv = <OnlineLessonDiv {...props}/>
		} else if(this.props.match.params.type === 'live') {
			lessonDiv = <LiveLessonDiv  {...props} reservedLives={this.state.reservedLives}/>
		} else if(this.props.match.params.type === 'offline') {
      lessonDiv = <OfflineLessonDiv {...props} />
    }
		else if (this.props.match.params.type === 'product') {
			props = {
				data: this.state.data,
				vipPriceFlag:this.state.vipPriceFlag
			}
			lessonDiv = <ProductLessonDiv {...props} />
		}
		return (
			<div>
	      <div style={{...styles.list, height: window.innerHeight}} ref={(lessonList) => this.lessonList = lessonList} onTouchEnd={() => {
					EventCenter.emit("labelUp")
					this._labelScorll()
				}}>
					{lessonDiv}
					<div style={{height: 40, display: this.state.isOver == true && this.state.isShow == false && this.state.data.length > 0 ? 'block' : 'none', textAlign: 'center'}}
					onClick={this._labelScorll.bind(this)}>共{this.state.data.length}条
					</div>
					<Loading isShow={this.state.isShow}/>
	      </div>
			</div>
		);
	}
}

var styles = {
	list: {
		// height: 667,
		overflow: 'scroll',
		backgroundColor: '#fff'
	},
};

export default PgTeacherLessonList;
