
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

var shareStatus = 0;
class ListFilterPanel extends React.Component {
	constructor(props) {
    super(props);
		//上方标签
		this.wx_config_share_home = {
				title: '铂略咨询-财税领域实战培训供应商',
				desc: '企业财务管理培训,财务培训课程,税务培训课程',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
		this.label = [{label_name: '全部'}];
		this.city = [{city_name: '全部'}];

		this.cityId = '';

		//左下方标签
		this.label_bottom_left = [];

		//右下方标签
		this.label_bottom_right = [];

		this.backNotloadLabel ={
			chooseLabel:{
				label_name:'',
				idx: '',
				item_left: '',
				idx_left: '',
				item_right: '',
				idx_right: ''
			}
		} //用于保存返回页面时标签的状态值 标签数组
		backNotloadLabel = this.backNotloadLabel
		//用于显示标签
		this.label_title = [];

		//用于给label_title显示
		this.select = [];

		//用于显示哪个标签被选中并附上蓝色
		this.select_id = [];

		this.online_label_id = '';

		this.isFree = ['全部', '免费', '收费'];

		this.isHot = ['最新', '最热'];

		this.offlineStatus = ['未举办', '已举办'];

		this.liveStatus = ['未开始(可预约)', '正在直播', '已结束(支持回看)'];

		//最上方label_id
		this.label_top_id = [];

		//课程总条数
		this.data = [];

		this.status_left = ''

		this.status_right = ''

		this.lesson_data = []

		this.fetchNum = 0

		this.state = {
			label_height: false,
			label_title_word: [],
			selectedIdx: null,
			select_top: false,
			select_left: false,
			isHideLeft: true,
			isHideTop: true,
			isHideRight: false,
			isData: false,
			load: false,
			w_height: devHeight-42.5,
			_data: [],
			city: this.city,
			label: this.label
		};
	}

	//升降标签栏
	_labelStatus() {
		this.setState({
			label_height: !this.state.label_height,
		});
	}

	//根据标签传值
	_labelType(idx_left, idx_right, item_right){
		var actionType
		var status = {}
		if(this.props.les === 'online') {
			actionType = 'OnlineLoadListMore'
			this.wx_config_share_home = {
					title: '视频课-铂略咨询',
					desc: '铂略碎片化体系财税课程，全新体验，猛戳进入！',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
			if(idx_left === 0) {
				this.status_left = ''
			} else if(idx_left === 1) {
				this.status_left = 0
			} else if(idx_left === 2) {
				this.status_left = 1
			}
			if(idx_right === 0) {
				this.status_right = 0
			} else if(idx_right === 1) {
				this.status_right = 1
			}
			//选择标签时清空数组
			this.data = []
			status = {
				label_id: this.label_top_id,
				teacher_id: '',
				charge_type: this.status_left,
				sort: this.status_right,
				limit: 15,
				skip: this.data.length
			}
		} else if(this.props.les === 'live') {
			actionType = 'LiveList'
			this.wx_config_share_home = {
					title: '直播课-铂略咨询',
					desc: '铂略每日财税课程直播，覆盖企业众多财税问题，快来免费体验吧！',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
			this.fetchNum++
			if(idx_left === 0) {
				this.status_left = 0
			} else if(idx_left === 1) {
				this.status_left = 1
			} else if(idx_left === 2) {
				this.status_left = 2
			}
			//选择标签时清空数组
			this.data = []
			status = {
				label_id: this.label_top_id,
				live_status: this.status_left,
				teacher_id: '',
				limit: 15,
				skip: this.data.length,
				fetchNum: this.fetchNum
			}
		} else if(this.props.les === 'offline') {

			actionType = 'OfflineList'
			this.wx_config_share_home = {
					title: '线下课-铂略咨询',
					desc: '铂略现场公开课，一键直约报名，赶紧行动！',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
			if(idx_left == 0) {
				this.status_left = 0
			} else if(idx_left == 1) {
				this.status_left = 1
			}
			if(idx_right == 0) {
				this.status_right = ''
			} else {
				this.status_right = this.cityId
			}
			//选择标签时清空数组
			this.data = []
			status = {
				label_id: this.label_top_id,
				status: this.status_left,
				city_id: this.status_right,
				teacher_id: '',
				limit: 15,
				skip: this.data.length
			}
		}
		const les_status = {...status}
		shareStatus = shareStatus + 1
		if (shareStatus == 1) {
			Dispatcher.dispatch({
				actionType: 'WX_JS_CONFIG',
				onMenuShareAppMessage: this.wx_config_share_home
			})
		}
		if (backNotloadIndex !== 'PgDetail' || backNotload.list.length <= 0) {
			Dispatcher.dispatch({
				actionType: actionType,
				les_status
			});
		}else {
			backNotloadIndex = ''
		}
		Dispatcher.dispatch({
			actionType: 'WX_MAP_CONFIG'
		})

	}

	//选择标签
	_chooseLabel(item, idx, item_left, idx_left, item_right, idx_right) {

		this.backNotloadLabel.chooseLabel={
			label_name:item,
			idx: idx,
			item_left: item_left,
			idx_left: idx_left,
			item_right: item_right,
			idx_right: idx_right
		}
		backNotloadLabel = this.backNotloadLabel
		this.select = [item, item_left, item_right]
		this.select_id = [idx, idx_left, idx_right]
		this.label_title = this.select
		this._labelType(idx_left, idx_right, item_right)
		if(this.select[0] !== this.select[1]) {
			if(!this.label_bottom_right) {
				if(idx === 0) {
					this.setState({
						isHideLeft: false,
						isHideTop: true,
						isHideRight: false,
						select_top: false,
						select_left: false,
					})
				} else {
					this.setState({
						isHideLeft: false,
						isHideTop: false,
						isHideRight: false,
						select_top: true,
						select_left: false,
					})
				}
			} else if (this.select[0] == this.select[2]) {
				this.setState({
					isHideLeft: false,
					isHideTop: true,
					isHideRight: true,
					select_top: false,
					select_left: false,
				})
			} else {
				this.setState({
					isHideLeft: false,
					isHideTop: false,
					isHideRight: false,
					select_top: true,
					select_left: true,
				});
			}
		} else {
			this.setState({
				isHideLeft: true,
				isHideTop: true,
				isHideRight: false,
				select_top: false,
				select_left: false,
			});
		}
	}

	//确认初始标签极其初始列表
	_handleFetchLableListDone(re) {
		var right_label
		var right_idx
		var left_label
		var left_idx
		if(this.label_bottom_right && this.props.les != 'offline') {
			right_label = this.label_bottom_right[0]
			right_idx = 0
		} else if(this.props.les == 'offline') {
			right_label = this.label_bottom_right[0].city_name
			right_idx = 0
		} else {
			right_label = null
			right_idx = null
		}
		if(this.label_bottom_left && this.props.les != 'live') {
			left_label = this.label_bottom_left[0]
			left_idx = 0
		} else {
			left_label = this.label_bottom_left[1]
			left_idx = 1
		}
		this.setState({
			label: this.label.concat(re.result.label),
			city: this.city.concat(re.result.city)
		})
		this.backNotloadLabel = { //定义全局变量标签
			labelList:this.label.concat(re.result.label)
		}
		backNotloadLabel = this.backNotloadLabel
		this.label_top_id = this.label[0].label_id
		this.status_left = 0
		this.status_right = right_idx
		this._chooseLabel(this.label[0].label_name, 0, left_label, left_idx, right_label, right_idx)
	}

	_liveLabelChange() {
		this._chooseLabel(this.label[0].label_name, 0, this.label_bottom_left[0], 0)
	}

	//向上滑动吧label列表收起
	_labelUp() {
		this.setState({
			label_height: false
		})
	}


	componentWillMount() {
	}
	componentDidMount() {
		this.fetchNum = 0
		this._getLabelList = EventCenter.on("FetchLableListDone", this._handleFetchLableListDone.bind(this))
		this._labelUp = EventCenter.on('labelUp', this._labelUp.bind(this))
		this._getLiveLabelChange = EventCenter.on('LiveLabelChange', this._liveLabelChange.bind(this))
		//根据开始传入的数据显示labelList
		if (!backNotload || backNotloadIndex !== 'PgDetail') {
			console.log('backNotloadIndex !== PgDetail',backNotload);
			Dispatcher.dispatch({
				actionType: 'FetchLableList',
				type: this.props.les
			})
		}else {
			var chooseLabel = backNotloadLabel.chooseLabel
			if (chooseLabel.label_name=='' && chooseLabel.idx=='') {
				Dispatcher.dispatch({
					actionType: 'FetchLableList',
					type: this.props.les
				})
			}else {
				setTimeout(()=>{
					this.setState({
						label: backNotloadLabel.labelList || [],
					},()=>{
						this._chooseLabel(chooseLabel.label_name,chooseLabel.idx,chooseLabel.item_left,chooseLabel.idx_left,chooseLabel.item_right,chooseLabel.idx_right)
					})
				} , 50)
			}
		}

	}
	componentWillUnmount() {
		this._getLabelList.remove()
		this._labelUp.remove()
		this._getLiveLabelChange.remove()
		this.backNotloadLabel = { //定义全局变量标签
			labelList:this.state.label,
			chooseLabel:this.backNotloadLabel.chooseLabel
		}
		backNotloadLabel = this.backNotloadLabel
	}
	render(){
		switch(this.props.les) {
			case "offline": this.label_bottom_left = this.offlineStatus; this.label_bottom_right = this.state.city; break;
			case "online": this.label_bottom_left = this.isFree; this.label_bottom_right = this.isHot; break;
			case "live": this.label_bottom_left = this.liveStatus; this.label_bottom_right = null;break;
		}
		var label_list = this.state.label.map((item, index) => {
			var fontColor;
			return(
				<div key={index} style={{...styles.label_list}} onClick={() => {
					this.label_top_id = item.label_id
					this._chooseLabel(item.label_name,index,this.select[1],this.select_id[1],this.select[2],this.select_id[2])
				}}>
					<span style={{color: this.select_id[0] === index ? '#2196f3' : '#666'}}>{item.label_name}</span>
				</div>
			)
		});

		var label_left = this.label_bottom_left.map((item, index) => {

			var fontColor;
			var marginRight
			var marginLeft
			if(index === this.select_id[1]) {
				fontColor = '#2196f3'
			} else {
				fontColor = '#666'
			}
			if(index == this.label_bottom_left.length-1) {
				marginRight = 0
			} else {
				marginRight = 20
			}
			if(index == 0) {
				marginLeft = 12
			} else {
				marginLeft = 0
			}
			return(
				<span key={index} style={{...styles.label_bottom_word, color: fontColor, marginRight: marginRight, marginLeft: marginLeft}} onClick={() => {this._chooseLabel(this.select[0],this.select_id[0],item,index,this.select[2],this.select_id[2])}}>{item}</span>
			)
		});

		var label_right = []
		if(this.label_bottom_right) {
			label_right = this.label_bottom_right.map((item, index) => {
				var marginRight
				var fontColor;
				var checkItem
				var marginLeft
				if(index == this.label_bottom_right.length-1 && this.props.les !== 'offline') {
					marginRight = 0
				} else {
					marginRight = 12.5
				}
				if(index === this.select_id[2]) {
					fontColor = '#2196f3'
				} else {
					fontColor = '#666'
				}
				if(index == 0) {
					marginLeft = 12
				} else {
					marginLeft = 0
				}
				if(this.props.les == 'offline') {
					checkItem = item.city_name
				} else {
					checkItem = item
				}
				return(
					<span key={index} style={{...styles.label_bottom_word, marginRight: marginRight, color: fontColor, marginLeft: marginLeft}} onClick={() => {
						this.cityId = item.city_id
						this._chooseLabel(this.select[0],this.select_id[0],this.select[1],this.select_id[1],checkItem,index)}}
					>{checkItem}</span>
				)
			});
		}

		let lesType = {
			lesType: this.props.les,
			data: this.state._data
		}

		var labelLeft
		var labelRight
		var leftStyle
		var rightStyle
		if(this.props.les == 'offline') {
			labelLeft = label_right
			labelRight = label_left
			leftStyle = styles.offline_label
			rightStyle = styles.offline_label
		} else {
			labelLeft = label_left
			labelRight = label_right
			leftStyle = styles.label_bottom_left
			rightStyle = styles.label_bottom_right
		}

		return (
			<div className="labelList" style={{backgroundColor: '#f4f4f4'}}>
        <div style={{...styles.title}} onClick={this._labelStatus.bind(this)} ref={(listTitle) => this.listTitle = listTitle}>
					{/*{label_title}*/}
					<span style={{...styles.label_title, display: this.state.isHideTop ? 'none' : 'inline-block'}}>{this.label_title[0]}</span>
					<img src={Dm.getUrl_img('/img/v2/icons/circle@2x.png')} style={{display: this.state.select_top ? 'inline-block' : 'none', width: 8, height: 8, marginLeft: 10, marginRight: 10}}/>
					<span style={{...styles.label_title, display: this.state.isHideLeft ? 'none' : 'inline-block'}}>{this.label_title[1]}</span>
					<img src={Dm.getUrl_img('/img/v2/icons/circle@2x.png')} style={{display: this.state.select_left ? 'inline' : 'none', width: 8, height: 8, marginLeft: 10, marginRight: 10}}/>
					<span style={{...styles.label_title, display: this.state.isHideRight ? 'none' : 'inline-block'}}>{this.label_title[2]}</span>
					<img src={Dm.getUrl_img('/img/v2/icons/up@2x.png')} style={{display: this.state.label_height ? 'inline-block' : 'none', width: 9, height: 8, marginLeft: 10}}/>
					<img src={Dm.getUrl_img('/img/v2/icons/down@2x.png')} style={{display: this.state.label_height ? 'none' : 'inline-block', width: 9, height: 8, marginLeft: 10}}/>
					<hr style={{...styles.hr}}/>
				</div>
				<div style={{...styles.label, display: this.state.label_height ? 'block' : 'none'}}>
					<div style={{...styles.label_top}}>
						{label_list}
					</div>
					<hr style={{...styles.hr}}/>
					<div style={{...styles.label_bottom}}>
						<div>
							<div style={{...leftStyle}}>
								{labelLeft}
							</div>
							<hr style={{...styles.hr, width: devWidth, display: this.props.les == 'offline' ? 'block' : 'none'}} />
						</div>
						<div style={{...rightStyle}}>
							{labelRight}
						</div>
					</div>
					<hr style={{...styles.hr}}/>
		    </div>

			</div>
		);
	}
}

var styles = {
	title: {
	  height: 42.5,
	  width: '100%',
	  textAlign: 'center',
	  backgroundColor: 'white',
	},
	label: {
		// display: 'block',
	  // height: '100%',
	  backgroundColor: '#f8f8f8',
	},
	label_title: {
    lineHeight: '42.5px',
    color: '#666',
    fontSize: 14,
  },
	label_top: {
    width: '100%',
    paddingTop: 15,
    paddingLeft: 14,
		paddingRight: 14,
	},
	label_list: {
		display: 'inline-block',
		color: '#666',
		fontSize: devWidth < 350 ? 13 : 14,
		// margin-left: 12.5px;
		marginRight: 30,
		marginBottom: 15,
	},
	label_bottom: {
    // height: 43,
		// marginLeft: 14,
		marginRight: 14
	},
	label_bottom_left: {
		float: 'left',
		// marginLeft: 14,
	},
	label_bottom_right: {
		float: 'right',
		// marginRight: 14,
	},
	label_bottom_word: {
		lineHeight: '45px',
		color: '#666',
		fontSize: devWidth < 350 ? 13 : 14,
		marginRight: 20,
	},
	hr: {
	  height: '1px',
		width: '100%',
	  border: 'none',
	  backgroundColor: '#e5e5e5',
	},
	offline_label: {
		float: 'left',
		width: devWidth,
		whiteSpace: 'nowrap',
		overflow: 'scroll'
	},
};

export default ListFilterPanel;
