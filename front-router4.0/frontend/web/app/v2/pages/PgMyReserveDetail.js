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
      id: '',
      live_status:null,
      err:'',
      isErr: 'none',//是否显示报错信息
		};
	}

	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-直播参与')
    
    Dispatcher.dispatch({
      actionType: 'MyReserveDetail',
      resource_id: this.props.match.params.id
    })
    
    this.e_MyReserveDetail = EventCenter.on('MyReserveDetailDone',this._handleMyReserveDetail.bind(this))

	}

  componentWillUnmount() {
    this.e_MyReserveDetail.remove()
  }

  _handleMyReserveDetail(result){
    // console.log('result:',result)
    var {err,result}=result;
    if(err){
      this.setState({
        isErr:'block',
        err:err
      })
      return;
    }

    this.setState({
      title:result.title,
      start_time:result.start_time,
      end_time:result.end_time,
    })
  }

  //回到上一级页面
  cancelErr(re) {
		this.props.history.go(-1)
	}

	render(){
		return (
			<div>
      <Link to={`${__rootDir}/lesson/live/${this.state.id}`}>
        <div style={{...styles.div}}>
          <div style={{float: 'left',display: '-webkit-box', width: '80%', textOverflow:'ellipsis', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1}}>{this.state.title}</div>
          <div style={{float: 'right', width: 9, height: 16,marginTop:12}}>
						<img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', width: 9, height: 16,}}/>
					</div>
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
        <div style={{...styles.div,marginTop:20,display:this.state.live_status == 0 ? 'block':'none'}}>
          <img src={Dm.getUrl_img('/img/v2/icons/remind@2x.png')} style={{float: 'left', width: 16, height: 18, marginTop: 14}}/>
          <span style={{marginLeft: 12, fontSize: 14}}>提醒</span>
          <span style={{float: 'right', fontSize: 14, color: '#999'}}>15分钟</span>
        </div>

      	<div style={{ ...styles.zzc, display: this.state.isErr }} onClick={this.cancelErr.bind(this)}></div>
				<div style={{ width: 270, height: 104, backgroundColor: '#FFFFFF', borderRadius: '12px', textAlign: 'center', position: 'absolute', zIndex: 999999, left: (devWidth - 270) / 2, top: (devHeight - 104) / 2, display: this.state.isErr }}>
					<div style={{ height: 60, textAlign: 'center', lineHeight: 4 }}>
						<span style={{ fontSize: 14, color: '#030303', fontFamily: 'pingfangsc-regular' }}>{this.state.err}</span>
					</div>
					<div style={{ width: 270, height: 1, backgroundColor: '#fff', borderBottom: 'solid 1px #d4d4d4' }}></div>
					<div style={{ height: 43, textAlign: 'center', lineHeight: 2.5 }} onClick={this.cancelErr.bind(this)}>
						<span style={{ fontSize: 17, color: '#0076ff', fontFamily: 'pingfangsc-regular' }}>知道了</span>
					</div>
				</div>

			</div>
		)
	}
}

var styles = {
  div: {
    height: 45,
    lineHeight: '45px',
    color: '#333',
		backgroundColor: '#fff',
		padding:'0 12px',
  },
  zzc: {
		width: devWidth,
		height: devHeight,
		backgroundColor: '#cccccc',
		position: 'absolute',
		opacity: 0.5,
		zIndex: 99998,
		top: 0,
	},
}

export default PgLiveReserve;
