import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import Common from '../Common';
import maskStyle from './maskStyle';

var urlll = document.location.href; // 获取当前url链接
var Examine = urlll.split('offlineToEx')[1]
var ttt = urlll.split('activity')[1]


class PendingReviewAlert extends React.Component {
  constructor(props) {
    super(props);
    // this.phone = '',
    this.state = {
      isReview: null,
      isShow: false,
    };

  }

  componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'AuditRemind'
    })
  }

  componentDidMount() {
    this.getAuditRemind = EventCenter.on('AuditRemindDone', this._handleAuditRemind.bind(this))
  }
  componentWillUnmount() {
    this.getAuditRemind.remove()
  }

  _handleAuditRemind(re) {
    if (re.err) {
      return false;
    }
    this.setState({
      isReview: re.result,
      isShow: re.result > 0 ? true : false,
    })
  }


  _hideAlert() {
    // alert('_hideAlert---')
    this.setState({
      isShow: false
    })
  }
  _review() {
    this.setState({
      isShow: false
    }, () => {
      window.location = `${__rootDir}/offlineToExamine`
    })
    // this.props.history.push(`${__rootDir}/offlineToExamine`)
  }

  render() {

    return (
      <div style={{ display: (this.state.isReview > 0 && this.state.isShow) && (!Examine && !ttt) ? 'block' : 'none' }}>
        <div style={{ ...maskStyle.msk, display: this.state.isShow ? 'block' : 'none' }} onClick={this._hideAlert.bind(this)}></div>
        <div style={{ ...maskStyle.white_alert, paddingTop: -1, display: this.state.isShow ? 'block' : 'none' }}>
          <div style={{ marginTop: 20, fontSize: Fnt_Large, color: Common.Black, fontWeight: 'bold' }}>待审核通知</div>
          <div style={{ padding: '10px 12px 20px', color: Common.Black, fontSize: Fnt_Normal, lineHeight: '20px', }}>目前有<span>{this.state.isReview}</span>条线下课报名申请待审核</div>
          <div style={maskStyle.alert_bottom}>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', borderRight: 'solid 1px #d4d4d4', fontSize: Fnt_Medium, color: Common.Gray }} onClick={this._hideAlert.bind(this)}>稍后再说
  					</div>

            <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Activity_Text }} onClick={this._review.bind(this)}>
              立即审核
						</div>
          </div>
        </div>
      </div>
    )
  }
}



export default PendingReviewAlert;
