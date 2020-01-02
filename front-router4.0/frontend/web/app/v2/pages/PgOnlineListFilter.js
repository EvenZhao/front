import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import async from 'async'
import Common from '../Common';


class PgOnlineListFilter extends React.Component {
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

    this.label = [{label_id: '', label_name: '全部课程体系'}];

    this.price = [{id: '', type: '不限价格'}, {id: 0, type: '免费课'}, {id: 1, type: '会员课'}];

    this.isHot = [{id: 3, type: '综合排序'}, {id: 0, type: '最新'}, {id: 1, type: '最热'}, {id: 2, type: '好评'}]

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

		this.state = {
      label_up: false,
      price_up: false,
      hot_up: false,
      label_name: '全部课程体系',
      price_name: '不限价格',
      hot_name: '综合排序',
      label_id: '',
      price_id: '',
      hot_id: '',
      label: this.label,
			//是否显示遮罩层
			mask_display:'none',
		};
	}

	_labelUp() {
		this.setState({
			label_up: false,
			price_up: false,
			hot_up: false,
		})
	}

	componentDidMount() {
    var status = {}
    status = {
      label_id: '',
      teacher_id: '',
      charge_type: '',
      sort: '',
      limit: 15,
      skip: 0
    }
    const les_status = {...status}
    Dispatcher.dispatch({
      actionType: 'OnlineLoadListMore',
      les_status
    })

    Dispatcher.dispatch({
      actionType: 'FetchLableList',
      type: 'online'
    })
    this._getLabelList = EventCenter.on("FetchLableListDone", this._handleFetchLableListDone.bind(this))
		this._labelUp = EventCenter.on('labelUp', this._labelUp.bind(this))
	}

  componentWillUnmount() {
    this._getLabelList.remove()
		this._labelUp.remove()
  }

  _handleFetchLableListDone(re) {
    this.setState({
			label: this.label.concat(re.result.label),
		})
  }

  //选择其中一个筛选条件
  //展开筛选
  clickLabel(label) {
		this.setState({
			mask_display:'none',
		})
    if(label == 'label') {
			if(!this.state.label_up == false){
				this.setState({
	        label_up: !this.state.label_up,
	        price_up: false,
	        hot_up: false,
					mask_display:'none',
	      })
			}else {
				this.setState({
	        label_up: !this.state.label_up,
	        price_up: false,
	        hot_up: false,
					mask_display:'block',
	      })
			}

    } else if(label == 'price') {
			if(!this.state.price_up == false){
				this.setState({
	        label_up: false,
	        price_up: !this.state.price_up,
	        hot_up: false,
					mask_display:'none',
	      })
			}
			else {
				this.setState({
	        label_up: false,
	        price_up: !this.state.price_up,
	        hot_up: false,
					mask_display:'block',
	      })
			}
    } else if(label == 'hot') {
			if(!this.state.hot_up == false){
				this.setState({
	        label_up: false,
	        price_up: false,
	        hot_up: !this.state.hot_up,
					mask_display:'none',
	      })
			}else {
				this.setState({
	        label_up: false,
	        price_up: false,
	        hot_up: !this.state.hot_up,
					mask_display:'block',
	      })
			}
    }
  }

  //选择筛选展开列表
  //关闭筛选
  clickTab(idx, type) {
    var status = {}
    if(type == 'label') {
      this.setState({
        label_name: this.state.label[idx].label_name,
        label_id: this.state.label[idx].label_id,
        label_up: false,
				mask_display:'none',
      }, () => {
        status = {
          label_id: this.state.label_id,
          teacher_id: '',
          charge_type: this.state.price_id,
          sort: this.state.hot_id,
          limit: 15,
          skip: 0
        }
        const les_status = {...status}
        Dispatcher.dispatch({
          actionType: 'OnlineLoadListMore',
          les_status
        })
      })
    } else if(type == 'price') {
      this.setState({
        price_name: this.price[idx].type,
        price_id: this.price[idx].id,
        price_up: false,
				mask_display:'none',
      }, () => {
        status = {
          label_id: this.state.label_id,
          teacher_id: '',
          charge_type: this.state.price_id,
          sort: this.state.hot_id,
          limit: 15,
          skip: 0
        }
        const les_status = {...status}
        Dispatcher.dispatch({
          actionType: 'OnlineLoadListMore',
          les_status
        })
      })
    } else if(type == 'hot') {
      this.setState({
        hot_name: this.isHot[idx].type,
        hot_id: this.isHot[idx].id,
        hot_up: false,
				mask_display:'none',
      }, () => {
        status = {
          label_id: this.state.label_id,
          teacher_id: '',
          charge_type: this.state.price_id,
          sort: this.state.hot_id,
          limit: 15,
          skip: 0
        }
        const les_status = {...status}
        Dispatcher.dispatch({
          actionType: 'OnlineLoadListMore',
          les_status
        })
      })
    }
  }

	render(){
    var labelName = this.state.label.map((item, index) => {
      return(
        <div key={index} style={{display: this.state.label_up ? 'block' : 'none', height: 40, width: devWidth, color: '#333', fontSize: 14, backgroundColor: '#f9f9f9'}}>
        <div style={{marginLeft: 12, lineHeight: '39px', color: item.label_name == this.state.label_name ? '#2196f3' : '#333'}}
        onClick={() => {
          this.clickTab(index, 'label')
        }}
        >{item.label_name}</div>
        <hr style={{width: devWidth, height: 1, backgroundColor: '#f3f3f3', border: 'none'}} />
        </div>
      )
    })

    var isFree = this.price.map((item, index) => {
      return(
        <div key={index} style={{display: this.state.price_up ? 'block' : 'none', height: 40, width: devWidth, color: '#333', fontSize: 14, backgroundColor: '#f9f9f9'}}>
          <div style={{marginLeft: 12, lineHeight: '39px', color: item.type == this.state.price_name ? '#2196f3' : '#333'}}
            onClick={() => {
              this.clickTab(index, 'price')
            }}
          >{item.type}</div>
          <hr style={{width: devWidth, height: 1, backgroundColor: '#f3f3f3', border: 'none'}} />
        </div>
      )
    })

    var isHot = this.isHot.map((item, index) => {
      return(
        <div key={index} style={{display: this.state.hot_up ? 'block' : 'none', height: 40, width: devWidth, color: '#333', fontSize: 14, backgroundColor: '#f9f9f9'}}>
          <div style={{marginLeft: 12, lineHeight: '39px', color: item.type == this.state.hot_name ? '#2196f3' : '#333'}}
            onClick={() => {
              this.clickTab(index, 'hot')
            }}
          >{item.type}</div>
          <hr style={{width: devWidth, height: 1, backgroundColor: '#f3f3f3', border: 'none'}} />
        </div>
      )
    })
		return (
      <div>
        <div style={{...styles.tab}}>
          <div onClick={() => {this.clickLabel('label')}} style={{display: 'flex', flexFlow: 'row',width:window.screen.width - 220,}}>
            <div style={{...styles.LineClamp,width:window.screen.width-244,marginLeft: this.state.label_name.length > 6 ? 6 : 25, color: this.state.label_id !== '' ? '#2196f3' : '#333'}}>
							{this.state.label_name}
						</div>
            <img src={this.state.label_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
          <div style={{...styles.hr,}}></div>
          <div onClick={() => {this.clickLabel('price')}} style={{display: 'flex', flexFlow: 'row',width:100}}>
            <div style={{marginLeft: 18, color: this.state.price_id !== '' ? '#2196f3' : '#333'}}>{this.state.price_name}</div>
            <img src={this.state.price_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
          <div style={{...styles.hr,}}></div>
          <div onClick={() => {this.clickLabel('hot')}} style={{display: 'flex', flexFlow: 'row',width:100}}>
            <div style={{marginLeft: 20, color: this.state.hot_id !== '' && this.state.hot_id !== 3 ? '#2196f3' : '#333'}}>{this.state.hot_name}</div>
            <img src={this.state.hot_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
        </div>
        <hr style={{border: 'none', height: 1, width: devWidth, backgroundColor: '#f6f6f6'}}/>
        <div style={{display: 'flex', flexFlow: 'column', width: devWidth, position: 'absolute', zIndex: 999}}>
          {labelName}
          {isFree}
          {isHot}
        </div>
				<div onClick={this._hide.bind(this)} style={{...styles.mask,display:this.state.mask_display,}}></div>
      </div>
		)
	}

	_hide(){
		this.setState({
			mask_display:'none',
			label_up: false,
      price_up: false,
      hot_up: false,
		})
	}

}

var styles = {
  tab: {
    width: devWidth,
    backgroundColor: '#f4f8fb',
    height: 45,
    fontFamily:"微软雅黑",
    lineHeight: '45px',
    fontSize: 14,
    color: '#333',
    display: 'flex',
    flexFlow: 'row'
  },
  triangle: {
    height: 6,
    width: 8,
    position: 'relative',
    top: 19,
    marginLeft: 10
  },
  hr: {
    backgroundColor: '#eaeaea',
    height: 20,
    width: 1,
    marginLeft: 10,
    position: 'relative',
    top: 11
  },
	mask:{
		width:devWidth,
		height: devHeight,
		backgroundColor: '#000',
		opacity: 0.2,
		position: 'absolute',
		zIndex: 998,
	},
	LineClamp:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 1,
		height:45,
    width:devWidth-24,
	},
}

export default PgOnlineListFilter;
