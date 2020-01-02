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

class PgEnrollPerson extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      name: '',
      phone: '',
      tel: '',
      email: '',
			company: '',
			position: '',
			enrollId:''
		};
	}

  _handlegetParticipantsByIdDone(re) {
    console.log('_handlegetParticipantsByIdDone',re)
		var user = re.user[0] || {}
    this.setState({
			name: user.name,
      phone: user.phone,
      tel: user.tel,
      email: user.email,
			company: user.company,
			position: user.position,
			enrollId: user.enrollId
    })
  }
	_handlecancelEnrollDone(re){
		console.log('_handlecancelEnrollDone',re);
		if (re.result && re.result.isSuccess) {
			window.history.back()
		}
	}
	_onClickCancelEnroll(re){
		Dispatcher.dispatch({
      actionType: 'cancelEnroll',
      enrollId: this.state.enrollId
    })
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-参课人详情')
    this._getgetParticipantsByIdDone = EventCenter.on("getParticipantsByIdDone", this._handlegetParticipantsByIdDone.bind(this))
		this._getcancelEnrollDone = EventCenter.on("cancelEnrollDone", this._handlecancelEnrollDone.bind(this))
    Dispatcher.dispatch({
      actionType: 'getParticipantsById',
      enrollId: this.props.match.params.id
    })
	}

  componentWillUnmount() {
    this._getgetParticipantsByIdDone.remove()
		this._getcancelEnrollDone.remove()
  }

	render(){
		return (
			<div style={{backgroundColor: '#fff'}}>
        <div style={{...styles.div}}>
          <img src={Dm.getUrl_img('/img/v2/icons/user-name@2x.png')} style={{float: 'left', width: 18, height: 18, marginTop: 14}}/>
          <span style={{marginLeft: 12, fontSize:15,color: '#666666'}}>姓名</span>
          <span style={{float: 'right', fontSize:15, color: '#666666'}}>{this.state.name}</span>
        </div>
				<hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px'}}/>
				<div style={{...styles.div}}>
					<img src={Dm.getUrl_img('/img/v2/icons/phone@2x.png')} style={{float: 'left', width: 15, height: 18, marginTop: 14}}/>
					<span style={{marginLeft: 12, fontSize:15,color: '#666666'}}>手机</span>
					<span style={{float: 'right', fontSize:15, color: '#666666'}}>{this.state.phone}</span>
				</div>
				<hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px'}}/>
				<div style={{...styles.div}}>
					<img src={Dm.getUrl_img('/img/v2/icons/tel@2x.png')} style={{float: 'left', width: 18, height: 18, marginTop: 14}}/>
					<span style={{marginLeft: 12, fontSize:15,color: '#666666'}}>座机</span>
					<span style={{float: 'right', fontSize:15, color: '#666666'}}>{this.state.tel}</span>
				</div>
				<hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px'}}/>
				<div style={{...styles.div}}>
					<img src={Dm.getUrl_img('/img/v2/icons/e-mail@2x.png')} style={{float: 'left', width: 18, height: 13, marginTop: 14}}/>
					<span style={{marginLeft: 12, fontSize:15,color: '#666666'}}>电子邮箱</span>
					<span style={{float: 'right', fontSize:15, color: '#666666'}}>{this.state.email}</span>
				</div>
				<hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px'}}/>
				<div style={{...styles.div}}>
					<img src={Dm.getUrl_img('/img/v2/icons/company@2x.png')} style={{float: 'left', width: 16, height: 18, marginTop: 14}}/>
					<span style={{marginLeft: 12, fontSize:15,color: '#666666'}}>公司</span>
					<span style={{float: 'right', fontSize:15, color: '#666666'}}>{this.state.company}</span>
				</div>
				<hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px'}}/>
				<div style={{...styles.div}}>
					<img src={Dm.getUrl_img('/img/v2/icons/position@2x.png')} style={{float: 'left', width: 16, height: 13, marginTop: 14}}/>
					<span style={{marginLeft: 12, fontSize:15,color: '#666666'}}>职位</span>
					<span style={{float: 'right', fontSize:15, color: '#666666'}}>{this.state.position}</span>
				</div>
				<div style={{border: '1px solid #e5e5e5', borderLeft: 'none', borderRight: 'none', height: 20, backgroundColor: '#f4f4f4'}}></div>
				<div style={{...styles.div,textAlign:'center'}}>
					<span style={{fontSize:15,color:'#2196f3'}} onClick={this._onClickCancelEnroll.bind(this)}>取消报名</span>
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

export default PgEnrollPerson;
