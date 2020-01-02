import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import async from 'async'
import Common from '../Common';

class PgLiveListFilter extends React.Component {
	constructor(props) {
    super(props);

    this.label = [{label_id: 0, label_name: '全部系列'}, {label_id: 3, label_name: '连线CFO'}, {label_id: 4, label_name: '税政通'}];

    this.price = [{id: 0, type: '所有状态'}, {id: 1, type: '近期直播'}, {id: 2, type: '往期回顾'}];

    this.isHot = [{id: 3, type: '综合'}, {id: 0, type: '最新'}, {id: 1, type: '最热'}, {id: 2, type: '好评'}]

    this.fetchNum = 0

		this.state = {
      label_up: false,
      price_up: false,
      hot_up: false,
      label_name: '全部系列',
      price_name: '所有状态',
      hot_name: '综合',
      label_id: 0,
      price_id: 0,
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
			mask_display:'none',
		})
	}

	componentDidMount() {
    this.fetchNum = 0
    var status = {}
    status = {
      live_series: 0,
      new_live_status: 0,
      teacher_id: '',
      limit: 15,
      skip: 0,
      fetchNum: this.fetchNum
    }
    const les_status = {...status}
    Dispatcher.dispatch({
      actionType: 'LiveList',
      les_status
    })

    // Dispatcher.dispatch({
    //   actionType: 'FetchLableList',
    //   type: 'live'
    // })
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
			}
			else {
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
			}else {
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
    this.fetchNum++
    if(type == 'label') {
      this.setState({
        label_name: this.state.label[idx].label_name,
        label_id: this.state.label[idx].label_id,
        label_up: false,
				mask_display:'none',
      }, () => {
        status = {
          live_series: this.state.label_id,
          new_live_status: this.state.price_id,
          teacher_id: '',
          limit: 15,
          skip: 0,
          fetchNum: this.fetchNum
        }
        const les_status = {...status}
        Dispatcher.dispatch({
          actionType: 'LiveList',
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
          live_series: this.state.label_id,
          new_live_status: this.state.price_id,
          teacher_id: '',
          limit: 15,
          skip: 0,
          fetchNum: this.fetchNum
        }
        const les_status = {...status}
        Dispatcher.dispatch({
          actionType: 'LiveList',
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

    // var isHot = this.isHot.map((item, index) => {
    //   return(
    //     <div key={index} style={{display: this.state.hot_up ? 'block' : 'none', height: 40, width: window.screen.width, color: '#333', fontSize: 14, backgroundColor: '#f9f9f9'}}>
    //       <div style={{marginLeft: 12, lineHeight: '39px', color: item.type == this.state.hot_name && index != 0 ? '#2196f3' : '#333'}}
    //         onClick={() => {
    //           this.clickTab(index, 'hot')
    //         }}
    //       >{item.type}</div>
    //       <hr style={{width: window.screen.width, height: 1, backgroundColor: '#f3f3f3', border: 'none'}} />
    //     </div>
    //   )
    // })

		return (
      <div>
        <div style={{...styles.tab}}>
          <div onClick={() => {this.clickLabel('label')}} style={{display: 'flex', flexFlow: 'row', flexGrow: 1, justifyContent: 'center'}}>
            <div style={{color: this.state.label_id !== 0 ? '#2196f3' : '#333'}}>{this.state.label_name}</div>
            <img src={this.state.label_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
          <div style={{...styles.hr, marginLeft: 0}}></div>
          <div onClick={() => {this.clickLabel('price')}} style={{display: 'flex', flexFlow: 'row', flexGrow: 1, justifyContent: 'center'}}>
            <div style={{color: this.state.price_id !== 0 ? '#2196f3' : '#333'}}>{this.state.price_name}</div>
            <img src={this.state.price_up ? Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png') : Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>
          {/*<div style={{...styles.hr, marginLeft: 13}}></div>*/}
          {/*<div onClick={() => {this.clickLabel('hot')}} style={{display: 'flex', flexFlow: 'row'}}>
            <div style={{marginLeft: 30, color: this.state.hot_id !== '' ? '#2196f3' : '#333'}}>{this.state.hot_name}</div>
            <img src={Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} style={{...styles.triangle}}/>
          </div>*/}
        </div>
        <hr style={{border: 'none', height: 1, width: window.screen.width, backgroundColor: '#f6f6f6'}}/>
        <div style={{display: 'flex', flexFlow: 'column', width: window.screen.width, position: 'absolute', zIndex: 999}}>
          {labelName}
          {isFree}
          {/*{isHot}*/}
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
    width: window.screen.width,
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
		width: devWidth,
		height: devHeight,
		backgroundColor: '#000',
		opacity: 0.2,
		position: 'absolute',
		zIndex: 998,
	}
}

export default PgLiveListFilter;
