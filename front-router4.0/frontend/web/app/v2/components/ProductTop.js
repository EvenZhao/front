
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

class ProductTop extends React.Component {
	constructor(props) {
    super(props);
		//上方标签
		this.label = [{label_name: '全部'}];
		this.city = [{city_name: '全部'}];

		this.cityId = '';

		//用于显示标签
		this.label_title = [];
		this.backNotloadLabel ={}
		//用于给label_title显示
		this.select = [];

		//用于显示哪个标签被选中并附上蓝色
		this.select_id = [];

		this.online_label_id = '';

		this.isFree = ['全部', '免费', '收费'];

		this.isHot = ['最热', '最新'];

		this.offlineStatus = ['未举办', '已举办'];

		this.liveStatus = ['未开始(可预约)', '正在直播', '已结束(支持回复)'];

		//最上方label_id
		this.label_top_id = [];

		//课程总条数
		this.data = [];

		this.status_left = ''

		this.status_right = ''

		this.lesson_data = []

		this.state = {
			title: 'PgHomesadwadsd1221',
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
			// city: this.city,
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
		// if(this.props.les === 'online') {
			actionType = 'OnProductList'
			if(idx_right === 0) {
				this.status_right = 0
			} else if(idx_right === 1) {
				this.status_right = 1
			}
			//选择标签时清空数组
			this.data = []
			status = {
				label_id: this.label_top_id,
				charge_type: this.status_left,
				// sort: this.status_right,
				limit: 15,
				skip: this.data.length
			}
		// }
		const les_status = {...status}
		if (backNotloadIndex !== 'PgProductDetail') {
			Dispatcher.dispatch({
				actionType: actionType,
				les_status
			});
		}else {
			backNotloadIndex = ''
		}
	}

	//选择标签
	_chooseLabel(item, idx, item_left, idx_left, item_right, idx_right) {
		// if (!backNotloadLabel.chooseLabel) {
			this.backNotloadLabel.chooseLabel={
				label_name:item,
				idx: idx
			}
			backNotloadLabel = this.backNotloadLabel
		// }
		this.select = [item, item_left, item_right]
		this.select_id = [idx, idx_left, idx_right]
		this.label_title = this.select
		this._labelType(idx_left, idx_right, item_right)
		if(this.select[0] !== this.select[1]) {
     if (this.select[0] == this.select[2]) {
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
		this._chooseLabel(this.label[0].label_name, 0, null, 0, null, 0)
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
		this._getLabelList = EventCenter.on("FetchLableListDone", this._handleFetchLableListDone.bind(this))
		this._labelUp = EventCenter.on('labelUp', this._labelUp.bind(this))
		//根据开始传入的数据显示labelList
		if (!backNotload || backNotloadIndex !== 'PgProductDetail') {
			Dispatcher.dispatch({
				actionType: 'FetchLableList',
				type:'product'
			})
		}else {
			var chooseLabel = backNotloadLabel.chooseLabel
			setTimeout(()=>{
				this.setState({
					label: backNotloadLabel.labelList || [],
				},()=>{
					if (!chooseLabel) {
						return
					}
					this._chooseLabel(chooseLabel.label_name,chooseLabel.idx,null,null,null,null)
				})
			} , 50)
		}
	}
	componentWillUnmount() {
		this._getLabelList.remove()
		this._labelUp.remove()
		this.backNotloadLabel = { //定义全局变量标签
			labelList:this.state.label,
			chooseLabel:this.backNotloadLabel.chooseLabel
		}
		backNotloadLabel = this.backNotloadLabel
	}
	render(){
		// switch(this.props.les) {
		// 	case "offline": this.label_bottom_left = this.offlineStatus; this.label_bottom_right = this.state.city; break;
		// 	case "online": this.label_bottom_left = this.isFree; this.label_bottom_right = this.isHot; break;
		// 	case "live": this.label_bottom_left = this.liveStatus; this.label_bottom_right = null;break;
		// }
		var label_list = this.state.label.map((item, index) => {
			var fontColor;
			return(
				<div key={index} style={{...styles.label_list}} onClick={() => {
					this.label_top_id = item.label_id
					this._chooseLabel(item.label_name,index,null,null,null,null)
				}}>
					<span style={{color: this.select_id[0] === index ? '#2196f3' : '#666'}}>{item.label_name || ''}</span>
				</div>
			)
		});

		return (
			<div className="labelList" style={{backgroundColor: '#f4f4f4'}}>
        <div style={{...styles.title}} onClick={this._labelStatus.bind(this)} ref={(listTitle) => this.listTitle = listTitle}>
					{/*{label_title}*/}
					<span style={{...styles.label_title, display: this.state.isHideTop ? 'none' : 'inline-block'}}>{this.label_title[0]}</span>
					<img src={Dm.getUrl_img('/img/v2/icons/up@2x.png')} style={{display: this.state.label_height ? 'inline-block' : 'none', width: 9, height: 8, marginLeft: 10}}/>
					<img src={Dm.getUrl_img('/img/v2/icons/down@2x.png')} style={{display: this.state.label_height ? 'none' : 'inline-block', width: 9, height: 8, marginLeft: 10}}/>
					<hr style={{...styles.hr}}/>
				</div>
				<div style={{...styles.label, display: this.state.label_height ? 'block' : 'none'}}>
					<div style={{...styles.label_top}}>
						{label_list}
					</div>
					<hr style={{...styles.hr}}/>
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
	  height: '100%',
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
	// label_bottom: {
  //   height: 43,
	// 	// marginLeft: 14,
	// 	marginRight: 14
	// },
	// label_bottom_left: {
	// 	float: 'left',
	// 	// marginLeft: 14,
	// },
	// label_bottom_right: {
	// 	float: 'right',
	// 	// marginRight: 14,
	// },
	// label_bottom_word: {
	// 	lineHeight: '45px',
	// 	color: '#666',
	// 	fontSize: window.screen.width < 350 ? 13 : 14,
	// 	marginRight: 20,
	// },
	hr: {
	  height: '1px',
		width: '100%',
	  border: 'none',
	  backgroundColor: '#e5e5e5',
	},
	offline_label: {
		float: 'left',
		width: devWidth
	},
};

export default ProductTop;
