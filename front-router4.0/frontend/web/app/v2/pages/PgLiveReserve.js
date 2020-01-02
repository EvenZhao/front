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

class PgLiveReserve extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      title: '',
      start_time: '',
      end_time: '',
      id: ''
		};
	}

  _handleLiveDetail(re) {
    console.log(re)
    this.setState({
      title: re.result.title,
      start_time: re.result.start_time,
      end_time: re.result.end_time,
      id: re.result.id
    })
  }

	componentDidMount() {
    this._getLiveDetail = EventCenter.on("LiveDetailDone", this._handleLiveDetail.bind(this))
    Dispatcher.dispatch({
      actionType: 'LiveDetail',
      id: this.props.match.params.id
    })
	}

  componentWillUnmount() {
    this._getLiveDetail.remove()
  }

	render(){
		return (
			<div style={{backgroundColor: '#fff'}}>
      <Link to={`${__rootDir}/lesson/live/${this.state.id}`}>
        <div style={{...styles.div}}>
          <div style={{display: '-webkit-box', width: '80%', textOverflow:'ellipsis', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1}}>{this.state.title}</div>
          <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', width: 9, height: 16, position: 'relative', top: -16}}/>
        </div>
      </Link>
        <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px'}}/>
        <div style={{...styles.div}}>
          <img src={Dm.getUrl_img('/img/v2/icons/time-1@2x.png')} style={{float: 'left', width: 16, height: 16, marginTop: 14}}/>
          <span style={{marginLeft: 12, fontSize: 14}}>时间:</span>
          <span style={{fontSize: 14, marginLeft: 10}}>{new Date(this.state.start_time).format("yyyy-MM-dd")}</span>
          <span style={{fontSize: 14, marginLeft: 20}}>{new Date(this.state.start_time).format("hh:mm")}-</span>
          <span style={{fontSize: 14}}>{new Date(this.state.end_time).format("hh:mm")}</span>
        </div>
        <div style={{border: '1px solid #e5e5e5', borderLeft: 'none', borderRight: 'none', height: 20, backgroundColor: '#f4f4f4'}}></div>
        <div style={{...styles.div}}>
          <img src={Dm.getUrl_img('/img/v2/icons/remind@2x.png')} style={{float: 'left', width: 16, height: 18, marginTop: 14}}/>
          <span style={{marginLeft: 12, fontSize: 14}}>提醒</span>
          <span style={{float: 'right', fontSize: 14, color: '#999'}}>15分钟</span>
        </div>
			</div>
		)
	}
}

var styles = {
  div: {
    height: 45,
    lineHeight: '45px',
    margin: '0px 12px',
    color: '#333'
  }
}

export default PgLiveReserve;
