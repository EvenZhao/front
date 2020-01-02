import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
import FullLoading from '../components/FullLoading';

var countdown

class offlineToExamineDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auditInfoDetail: {},
      isShow: false,//是否显示弹框 遮罩层 默认为false
      auditAlert: '',
      //弹框是否显示
      display: 'none',
      //弹框提示信息
      alert_title: '',
      //弹框的图标
      alert_icon: '',
      icon_width: 0,
      icon_height: 0,
      isLoading: true,
    };

  }
  _handleauditDetailDone(re) {
    console.log('==_handleauditDetailDone', re);
    this.setState({
      auditInfoDetail: re.result || {},
      auth: re.result.auth || {},
      isLoading: false,
    })
  }
  _handledoAuditDone(re, isAudit) {
    if (re.err) {
      this.setState({
        display: 'block',
        alert_title: re.err,
        alert_icon: failure_icon,
        icon_width: 40,
        icon_height: 40,
      }, () => {
        countdown = setInterval(() => {
          clearInterval(countdown);
          this.setState({
            display: 'none',
          })
        }, 1500);
      })
      return
    }
    var result = re.result
    if (result) {
      if (isAudit) {
        var data = this.state.auth || {}
        var content
        var leftButtom
        var rightButtom
        var title
        if (data.authFlag == 1 || data.authFlag == 12) { //相当于AuditType == 0
          title = '申请提交成功'
          content = (
            <div>工作人员将于2个工作日内与您联系后续参课事宜。</div>
          )
          rightButtom = (
            <span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#0076ff' }}>知道了</span>
          )
          var obj = {
            title: title,
            content: content,
            leftButtom: leftButtom,
            rightButtom: rightButtom,
            centerButtom: true,
          }
          this.setState({
            isShow: true,
            auditAlert: this.auditAlert(obj)
          })
        }
        else {
          var _title = '操作成功';
          if (data.authFlag == 14) { //相当于AuditType == 6
            _title = '报名成功';
          }
          this.setState({
            display: 'block',
            alert_title: _title,
            alert_icon: success_icon,
            icon_width: 40,
            icon_height: 40,
          }, () => {
            countdown = setInterval(() => {
              clearInterval(countdown);
              this.setState({
                display: 'none',
              })
            }, 1500);
          })
        }
      } else {
        this.setState({
          display: 'block',
          alert_title: '操作成功',
          alert_icon: success_icon,
          icon_width: 40,
          icon_height: 40,
        }, () => {
          countdown = setInterval(() => {
            clearInterval(countdown);
            this.setState({
              display: 'none',
            })
            window.history.back()
          }, 1500);
        })
      }
    }
  }
  componentWillMount() {

  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE", '铂略财课-线下课报名审核详情')
    this._getauditDetail = EventCenter.on("auditDetailDone", this._handleauditDetailDone.bind(this))
    this.ondoAuditDone = EventCenter.on('doAuditDone', this._handledoAuditDone.bind(this))

    Dispatcher.dispatch({
      actionType: 'auditDetail',
      id: this.props.match.params.id
    })

  }
  componentWillUnmount() {
    this._getauditDetail.remove()
    this.ondoAuditDone.remove()
  }
  auditStatus(item) {//根据stauts 去判断，但是要用于两次所以写了一下通用方法
    var status
    var color
    switch (item.status) {
      case 2:
        status = '待审核'
        color = '#ff4642'
        break;
      case 3:
        status = '待参课'
        color = '#2196F3'
        break;
      case 4:
        status = '审核被拒'
        color = '#f37633'
        break;
      case 5:
        status = '已参课'
        color = '#23bb2d'
        break;
      case 6:
        status = '缺席'
        color = '#9AB2CF'
        break;
      case 7:
        status = '超时未审核'
        color = '#f37633'
        break;
      case 8:
        status = '超时未确认'
        color = '#f37633'
        break;
      case 9:
        status = '待确认'
        color = '#ff4642'
        break;
      case 10:
        status = '取消报名'
        color = '#D1D1D1'
        break;
      default:
    }
    var auditObj = {
      status: status,
      color: color
    }
    return auditObj
  }
  doAudit(isAudit, re) {
    console.log('');
    this.setState({
      isShow: false
    }, () => {
      Dispatcher.dispatch({
        actionType: 'doAudit',
        id: this.props.match.params.id,
        isAudit: isAudit,
      })
    })
  }
  _handlegetAuditAuthDone(re) {
    var data = this.state.auth
    var content
    var leftButtom
    var rightButtom
    var title
    if (data.authFlag == 11 || data.authFlag == 9) {// authFlag=11 || data.authFlag == 9 为权益不足
      title = '权益不足'
      content = (
        <div>
          <Link to={{ pathname: `${__rootDir}/freeInvited`, state: null }}>
            <span style={{ fontSize: 14, color: '#030303' }}>请联系客服充值。</span>
          </Link>
        </div>
      )
      leftButtom = (
        <Link to={{ pathname: `${__rootDir}/freeInvited`, state: null }}>
          <span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>联系客服</span>
        </Link>
      )
      rightButtom = (
        <span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#0076ff' }}>知道了</span>
      )
    } else if (data.authFlag == 1) {//付费课
      title = '确认通过'
      content = (
        <div>
          <span style={{ fontSize: 14, color: '#030303' }}>点击确认后将提交报名申请。</span>
        </div>
      )
      leftButtom = (
        <span onClick={this.doAudit.bind(this, true, this.props.match.params.id)} style={{ fontSize: 17, color: '#666666' }}>确认</span>
      )
      rightButtom = (
        <span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#0076ff' }}>取消</span>
      )
    } else {
      title = '确认通过'
      content = (
        <div>
          <div>本次预计抵扣<span style={{ fontSize: 14, color: '#f37633' }}>{data.useCount}</span>{data.num == null ? '点' : '次'}，</div>
          <div>点击确认后将进行权益预扣。</div>
        </div>
      )
      leftButtom = (
        <span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
      )
      rightButtom = (
        <span onClick={this.doAudit.bind(this, true, this.props.match.params.id)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
      )
    }
    var obj = {
      title: title,
      content: content,
      leftButtom: leftButtom,
      rightButtom: rightButtom,
      centerButtom: null,
    }
    this.setState({
      isShow: true,
      auditAlert: this.auditAlert(obj)
    })
  }
  falseAudit(re) {
    var leftButtom = (
      <span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
    )
    var rightButtom = (
      <span onClick={this.doAudit.bind(this, false, re)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
    )
    var obj = {
      title: '确认拒绝',
      content: '点击确认后将完成操作',
      leftButtom: leftButtom,
      rightButtom: rightButtom,
      centerButtom: null,
    }
    this.setState({
      isShow: true,
      auditAlert: this.auditAlert(obj)
    })
  }
  auditAlert(obj) {
    return (
      <div style={{ ...styles.alert }}>
        <div style={{ height: 87, }}>
          <div style={{ paddingTop: 17 }}>
            <span style={{ fontSize: 17, color: '#030303', fontFamily: 'pingfangsc-medium' }}>{obj.title}</span>
          </div>
          <div style={{ lineHeight: 1 }}>
            <span style={{ fontSize: 14, color: '#030303', fontFamily: 'pingfangsc-regular' }}>{obj.content}</span>
          </div>
        </div>
        <div style={{ width: 270, height: 1, opacity: 0.22, backgroundColor: '#4d4d4d' }}></div>
        {
          obj.centerButtom == null ?
            <div style={{ ...styles.alertBottom, }}>
              <div style={{ flex: 1, lineHeight: 2.5 }}>
                {obj.leftButtom}
              </div>
              <div style={{ height: 43, width: 1, opacity: 0.22, backgroundColor: '#4d4d4d' }}></div>
              <div style={{ flex: 1, lineHeight: 2.5 }}>
                {obj.rightButtom}
              </div>
            </div>
            : <div style={{ width: 270, textAlign: 'center' }}>{obj.rightButtom}</div>
        }
      </div>
    )
  }
  cancel() {
    this.setState({
      isShow: false
    })
  }

  //联系客服
  _ApplyVoucher() {
    if (isWeiXin) {
      this.props.history.push({ pathname: `${__rootDir}/freeInvited` })
    } else {
      window.location.href = 'https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
    }
  }

  render() {
    var auditInfoDetail = this.state.auditInfoDetail || {}
    var auditObj = this.auditStatus(auditInfoDetail)
    var post_date = new Date(auditInfoDetail.post_date).format("yyyy-MM-dd")
    var post_time = new Date(auditInfoDetail.post_date).format("hh:mm");
    var start_date = new Date(auditInfoDetail.start_time).format("yyyy-MM-dd")
    var start_time = new Date(auditInfoDetail.start_time).format("hh:mm");
    var end_time = new Date(auditInfoDetail.end_time).format("hh:mm");
    var end_date = new Date(auditInfoDetail.end_time || 0).format("MM-dd")
    var data_time
    if (auditInfoDetail.isSameDay) {
      data_time = start_date + ' ' + start_time + '-' + end_time
    } else {
      data_time = start_date + ' 至 ' + end_date
    }
    var auth = this.state.auth || {}
    var authDiv
    if (auth.authFlag == 11 || auth.authFlag == 9) {
      if ((auth.num == 0 || auth.num == null) && (auth.point == 0 || auth.point == null)) {
        authDiv = null;
      }
      else {
        authDiv = (
          <div style={{ ...styles.authDiv, marginTop: 2 }}>
            <span style={{ marginLeft: 15, color: '#333333' }}>本课程免费席位<span style={{ color: '#f37633' }}>{auth.freeNum || 0}人</span>，超出后抵扣<span style={{ color: '#f37633' }}>{auth.authSingleCount || 0}{auth.num ? '次' : '点'}/人</span></span>
          </div>
        )
      }

    } else if (auth.authFlag == 1) {
      authDiv = (
        <div style={{ ...styles.authDiv }}>
          <span style={{ marginLeft: 15, color: '#333333' }}>本课程为另收费课程，无法使用权益抵扣。</span>
        </div>
      )

    } else {
      if (auth.authFlag == 5 || auth.authFlag == 6) {
        authDiv = (
          <div style={{ ...styles.authDiv }}>
            <span style={{ marginLeft: 15, color: '#333333' }}>本课程免费席位<span style={{ color: '#f37633' }}>{auth.freeNum || 0}人</span>，超出后抵扣<span style={{ color: '#f37633' }}>{auth.authSingleCount || 0}{auth.num ? '次' : '点'}/人</span></span>
          </div>
        )
      } else if (auth.authFlag == 7 || auth.authFlag == 8) {
        authDiv = (
          <div style={{ ...styles.authDiv }}>
            <span style={{ marginLeft: 15, color: '#333333' }}>本课程超出后抵扣<span style={{ color: '#f37633' }}>{auth.authSingleCount || 0}{auth.num ? '次' : '点'}/人</span></span>
          </div>
        )
      } else if (auth.authFlag == 10) {
        authDiv = (
          <div style={{ ...styles.authDiv }}>
            <span style={{ marginLeft: 15, color: '#333333' }}>本课程剩余免费席位<span style={{ color: '#f37633' }}>{auth.freeNum || 0}人</span></span>
          </div>
        )
      }
    }

    var authBlock;
    if (auth.authFlag == 1) {//付费课
      authBlock = (
        <div style={{ ...styles.buttom }}>
          <div onClick={this._handlegetAuditAuthDone.bind(this)} style={{ ...styles.bottomDiv, borderRightWidth: 1, borderRightColor: '#e1e1e1', borderRightStyle: 'solid' }}>
            <span style={{ fontSize: 16, color: '#2196F3' }}>通过并提交审核</span>
          </div>
          <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, auditInfoDetail.id)}>
            <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
          </div>
        </div>
      )
    }
    else if (auth.authFlag == 11 || auth.authFlag == 9) {

      authBlock = (
        <div style={{ ...styles.buttom }}>
          <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, auditInfoDetail.id)}>
            <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
          </div>
        </div>
      )
    }
    else {
      authBlock = (
        <div style={{ ...styles.buttom }}>
          <div onClick={this._handlegetAuditAuthDone.bind(this)} style={{ ...styles.bottomDiv, borderRightWidth: 1, borderRightColor: '#e1e1e1', borderRightStyle: 'solid' }}>
            <span style={{ fontSize: 16, color: '#2196F3' }}>通过</span>
          </div>
          <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, auditInfoDetail.id)}>
            <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
          </div>
        </div>
      )
    }

    return (
      <div style={{ ...styles.div }}>
        <FullLoading isShow={this.state.isLoading} />
        <div style={{ height: devHeight - 101, width: devWidth, overflowY: 'scroll', overflowX: 'hidden' }}>
          <div style={{ ...styles.auditInfo }}>
            <div style={{ marginLeft: 20 }}>
              <div>
                <span style={{ fontSize: 16, color: '#000000' }}>{auditInfoDetail.name}</span>
              </div>
              <div style={{ ...styles.status, backgroundColor: auditObj.color }}>
                <span style={{ fontSize: 12, color: '#ffffff' }}>{auditObj.status}</span>
              </div>
            </div>
            <div style={{ marginLeft: 20 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>申请时间 {post_date} {post_time}</span>
            </div>
            <div style={{ ...styles.line }}></div>
            <div style={{ marginLeft: 20 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>电子邮箱 <span style={{ color: '#333333' }}>{auditInfoDetail.email}</span></span>
            </div>
            <div style={{ marginLeft: 20 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>手机号码 <span style={{ color: '#333333' }}>{auditInfoDetail.phone}</span></span>
            </div>
            <div style={{ marginLeft: 20 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>所在职位 <span style={{ color: '#333333' }}>{auditInfoDetail.position}</span></span>
            </div>
            <div style={{ marginLeft: 20 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>上级领导 <span style={{ color: '#333333' }}>{auditInfoDetail.seniorAccount || '-'}</span></span>
            </div>
          </div>
          <div style={{ ...styles.offlineInfo }}>
            <div style={{ marginLeft: 10 }}>
              <span style={{ fontSize: 16, color: '#333333' }}>线下课信息</span>
            </div>
            <div style={{ marginLeft: 15, marginTop: 10, marginRight: 10 }}>
              <span style={{ fontSize: 12, color: '#2196F3' }}>{auditInfoDetail.title}</span>
            </div>
            <div style={{ marginLeft: 15 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>课程时间 <span style={{ color: '#333333' }}>{data_time}</span></span>
            </div>
            <div style={{ marginLeft: 15 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>举办地址 <span style={{ color: '#333333' }}>{auditInfoDetail.cityname}&nbsp;{auditInfoDetail.address ? <span>,{auditInfoDetail.address}</span> : ''}</span></span>
            </div>
          </div>
          {authDiv}
          {auditInfoDetail.customerSales ?
            <div style={{ marginTop: 15, fontSize: 11, lineHeight: '18px', color: Common.Light_Gray, width: devWidth - 24, marginLeft: 12 }}>
              如有疑问请联系铂略产品顾问<span style={{ color: '#333' }}>{auditInfoDetail.customerSales}</span>或铂略客服
							</div>
            :
            <div style={{ marginTop: 15, fontSize: 11, lineHeight: '18px', color: Common.Light_Gray, width: devWidth - 24, marginLeft: 12 }}>
              如有疑问请联系铂略客服。
							</div>
          }
        </div>
        <div style={{ ...styles.bottomTop, display: auth.authFlag == 1 ? 'none' : 'block' }}>
          {
            auth.authFlag == 11 || auth.authFlag == 9 ?
              <span>
                {
                  (auth.num == 0 || auth.num == null) && (auth.point == 0 || auth.point == null) ?
                    <span style={{ marginLeft: 20, fontSize: 14, color: '#666666' }}>
                      目前剩余0{auth.num ? '次' : '点'}
                      <span style={{ fontSize: 14, color: '#FF0000' }}>剩余权益不足</span>
                    </span>
                    :
                    <span style={{ marginLeft: 20 }}>
                      <span style={{ fontSize: 14, color: '#666666' }}>目前剩余<span style={{ color: '#0076ff' }}>
                        {auth.authTotalCount}</span>{auth.num ? '次' : '点'}</span>
                      <span style={{ fontSize: 14, color: '#' }}>通过后应付<span style={{ color: '#f37633' }}>{auth.useCount}</span>{auth.num ? '次' : '点'}</span>
                      <span style={{ fontSize: 14, color: '#FF0000' }}>剩余权益不足</span>
                    </span>
                }
              </span>
              :
              <span style={{ marginLeft: 20 }}>
                <span style={{ fontSize: 14, color: '#666666' }}>目前剩余<span style={{ color: '#2196F3' }}>{auth.authTotalCount}</span>{auth.num ? '次' : '点'}，</span>
                <span style={{ fontSize: 14, color: '#' }}>通过后应扣<span style={{ color: '#f37633' }}>{auth.useCount}</span>{auth.num ? '次' : '点'}</span>
              </span>
          }
        </div>

        <div>
          {authBlock}
        </div>
        <div style={{ ...styles.zzc, display: this.state.isShow ? 'block' : 'none' }}></div>
        {
          this.state.isShow ? this.state.auditAlert : null
        }
        {/*弹框*/}
        <div style={{ ...Common.alertDiv, display: this.state.display }}>
          <div style={{ marginBottom: 14, paddingTop: 15, height: 30, }}>
            <img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height} />
          </div>
          <span style={{ color: Common.BG_White }}>{this.state.alert_title}</span>
        </div>
        <div style={{ ...styles.kefu }} onClick={this._ApplyVoucher.bind(this)}></div>
      </div>
    )
  }
}

var styles = {
  div: {
    height: devHeight,
    width: devWidth,
    backgroundColor: '#f4f4f4'
  },
  auditInfo: {
    width: devWidth - 24,
    //height: 176,
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    marginLeft: 12,
    paddingTop: 20,
    paddingBottom: 20,
    position: 'relative',
    marginBottom: 15,
    marginTop: 20,
    boxShadow: '1px 1px 4px 1px',
    color: '#d2d2d2',
  },
  status: {
    height: 20,
    textAlign: 'center',
    position: 'absolute',
    right: 24,
    top: 22,
    borderRadius: '100px',
    lineHeight: '20px',
    padding: '0 12px',
    fontSize: 12
  },
  line: {
    width: devWidth - 64,
    height: 1,
    backgroundColor: '#D8D8D8',
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  offlineInfo: {
    width: devWidth - 24,
    marginLeft: 12,
    backgroundColor: '#FFFFFF',
    height: 145,
    borderRadius: '2px',
    marginTop: 15,
    paddingTop: 16,

  },
  authDiv: {
    width: devWidth - 24,
    height: 44,
    lineHeight: '44px',
    fontSize: 14,
    backgroundColor: '#f4f8fb',
    borderRadius: '2px',
    boxShaow: '0 2px 4px 0',
    marginLeft: 12,

    boxShadow: '0px 2px 4px 0px',
    color: '#d2d2d2',
    marginTop: 2,
  },
  buttom: {
    width: devWidth,
    height: 50,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    display: 'flex',
  },
  bottomDiv: {
    flex: 1,
    textAlign: 'center',
    lineHeight: 3,
  },
  alert: {
    width: 270,
    height: 131,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    position: 'absolute',
    zIndex: 99999,
    top: 202,
    left: (devWidth - 270) / 2,
    textAlign: 'center'
  },
  zzc: {
    width: devWidth,
    height: devHeight,
    backgroundColor: '#cccccc',
    position: 'absolute',
    opacity: 0.5,
    zIndex: 998,
    top: 0,
  },
  alertBottom: {
    display: 'flex',
    width: 270,
    // borderTopWidth:1,
    // borderTopColor:'#4d4d4d',
    // borderTopStyle:'solid',
    height: 43,
    // positionTop:'absolute',
    // bottom:0
  },
  bottomTop: {
    width: devWidth,
    height: 50,
    backgroundColor: '#FFFFFF',
    lineHeight: 3,
    position: 'absolute',
    bottom: 51
  },
  kefu: {
    width: 70,
    height: 50,
    position: 'absolute',
    right: 0,
    bottom: 143,
    backgroundImage: 'url(' + Dm.getUrl_img('/img/v2/audit/lianxikefu@2x.png') + ')',
    backgroundSize: 'cover'
  }
}

export default offlineToExamineDetail;
