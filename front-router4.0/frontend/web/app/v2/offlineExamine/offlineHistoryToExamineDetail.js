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

class offlineHistoryToExamineDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auditInfoDetail: {},
      auth: {},
      isShow: false, //是否显示弹框 遮罩层 默认为false
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
    console.log('_handleauditDetailDone====', re);
    if (re.err) {
      this.setState({
        display: 'block',
        alert_title: re.err,
        alert_icon: failure_icon,
        icon_width: 40,
        icon_height: 40,
        isLoading: false,
      }, () => {
        countdown = setInterval(() => {
          clearInterval(countdown);
          this.setState({
            display: 'none',
          })
        }, 1500);
      })
      this.props.history.go(-1);
      return
    }

    this.setState({
      auditInfoDetail: re.result || {},
      auth: re.result.auth || {},
      isLoading: false,
    })
  }
  _handledoAuditDone(re) {
    console.log('re==', re)
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
        }, 1500);
        this.props.history.push({ pathname: `${__rootDir}/offlineToExamine` })
      })
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
    clearInterval(countdown)
  }
  auditStatus(item) { //根据stauts 去判断，但是要用于两次所以写了一下通用方法
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
  //权益抵扣状态
  _format_pay_view(data) {
    var pay_text;
    if (data.lessonStatus == 1 && data.type != 3) {
      //付费课
      return null;
    }
    //已抵扣/返点次
    if (!data.backType) {
      //没有返点/次数 / 0点 0次据则显示已抵扣 
      pay_text = (
        <div style={{ color: '#666666', fontSize: 12 }}>
          权益抵扣状态：<span style={{ color: '#2196F3', marginLeft: 3 }}>已抵扣</span>
        </div>
      )
    } else if (data.backNum && data.backType != 1) {
      //当backNum不为空时，标识数量的单位，1:免费席位；2:点；3:次；4:张(私享会券)
      pay_text = (
        <div style={{ color: '#666666', fontSize: 12 }}>
          权益抵扣状态：<span style={{ color: '#2196F3', marginLeft: 3 }}>已返{data.backNum}{data.backType == 2 ? '点' : data.backType == 3 ? '次' : '张'}</span>
        </div>
      )
    }
    // 当backType为1时，“权益抵扣状态”只显示“已返”，不加数量和单位
    else if (data.backType == 1) {
      pay_text = (
        <div style={{ color: '#666666', fontSize: 12 }}>
          权益抵扣状态：<span style={{ color: '#2196F3', marginLeft: 3 }}>已返</span>
        </div>
      )
    }
    //当backType为-4时，“权益抵扣状态”行不显示
    else {
      return null;
    }
    return pay_text;
  }

  //线下课审核详情底部布局 通过或者拒绝
  _format_pass_or_reject(data) {
    let bottom_button = null;
    if (!data || data.status != 2) {
      return bottom_button;
    }
    if (data.type == 3) {
      //私享会 2.3.50 新增
      if (data.auth.authFlag && data.auth.authFlag == 14) {
        //目前剩余私享会券x张，通过后预计抵扣x张
        bottom_button = (
          <div style={{ position: 'fixed', bottom: 0, left: 0, height: 101 }}>
            <div style={styles.btDiv}>
              <span style={{ fontSize: 14, color: '#666666' }}>目前剩余私享会券<span style={{ color: '#2196F3' }}>{data.auth.privClubTicket}</span>张，</span>
              <span style={{ fontSize: 14, color: '#' }}>通过后本次预计抵扣<span style={{ color: '#f37633' }}>{data.auth.authSingleCount}</span>张</span>
            </div>
            <div style={{ ...styles.buttom }}>
              <div onClick={this._handlegetAuditAuthDone.bind(this)} style={{ ...styles.bottomDiv, borderRightWidth: 1, borderRightColor: '#e1e1e1', borderRightStyle: 'solid' }}>
                <span style={{ fontSize: 16, color: '#2196F3' }}>通过</span>
              </div>
              <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, data.id)}>
                <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
              </div>
            </div>
          </div>
        )
      } else {
        //目前剩余私享会券x张，通过后将提交付费参课申请。 如需购买新的私享会券，请联系客服。
        bottom_button = (
          <div style={{ position: 'fixed', bottom: 0, left: 0, height: 101 }}>
            <div style={{
              height: 50,
              backgroundColor: '#fff',
              borderBottom: 'solid 1px #e1e1e1',
              alignItems: 'center',
              paddingLeft: 20,
            }}>
              <div style={{ fontSize: 14, color: '#666666' }}>目前剩余私享会券<span style={{ color: '#2196F3' }}>{data.auth.privClubTicket}</span>张，通过后将提交付费参课申请</div>
              <div style={{ fontSize: 12, color: '#FF0000' }}> 如需购买新的私享会券，请联系客服。</div>
            </div>
            <div style={{ ...styles.buttom }}>
              <div onClick={this._handlegetAuditAuthDone.bind(this)} style={{ ...styles.bottomDiv, borderRightWidth: 1, borderRightColor: '#e1e1e1', borderRightStyle: 'solid' }}>
                <span style={{ fontSize: 16, color: '#2196F3' }}>通过</span>
              </div>
              <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, data.id)}>
                <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
              </div>
            </div>
          </div>
        )
      }
    } else if (data.lessonStatus == 1) {
      //通过并提交审核
      bottom_button = (
        <div style={{ position: 'fixed', bottom: 0, left: 0, height: 50 }}>
          <div style={{ ...styles.buttom }}>
            <div onClick={this._handlegetAuditAuthDone.bind(this)} style={{ ...styles.bottomDiv, borderRightWidth: 1, borderRightColor: '#e1e1e1', borderRightStyle: 'solid' }}>
              <span style={{ fontSize: 16, color: '#2196F3' }}>通过并提交审核</span>
            </div>
            <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, data.id)}>
              <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
            </div>
          </div>
        </div>
      )
    } else {
      switch (data.auth.authFlag) {
        case 5 || 6 || 7 || 8:
          //目前剩余x次/点,通过后应扣x次/点
          bottom_button = (
            <div style={{ position: 'fixed', bottom: 0, left: 0, height: 101 }}>
              <div style={styles.btDiv}>
                <span style={{ fontSize: 14, color: '#666666' }}>目前剩余<span style={{ color: '#2196F3' }}>{data.auth.authTotalCount}</span>{data.auth.num != null ? '次' : '点'}，</span>
                <span style={{ fontSize: 14, color: '#' }}>通过后应扣<span style={{ color: '#f37633' }}>{data.auth.useCount}</span>{data.auth.num != null ? '次' : '点'}</span>
              </div>
              <div style={{ ...styles.buttom }}>
                <div onClick={this._handlegetAuditAuthDone.bind(this)} style={{ ...styles.bottomDiv, borderRightWidth: 1, borderRightColor: '#e1e1e1', borderRightStyle: 'solid' }}>
                  <span style={{ fontSize: 16, color: '#2196F3' }}>通过</span>
                </div>
                <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, data.id)}>
                  <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
                </div>
              </div>
            </div>
          )
          break;
        case 10:
          //免费课: 目前剩余0点，通过后应扣0点
          bottom_button = (
            <div style={{ position: 'fixed', bottom: 0, left: 0, height: 101 }}>
              <div style={styles.btDiv}>
                <span style={{ fontSize: 14, color: '#666666' }}>目前剩余<span style={{ color: '#2196F3' }}>0</span>点，</span>
                <span style={{ fontSize: 14, color: '#' }}>通过后应扣<span style={{ color: '#f37633' }}>0</span>点</span>
              </div>
              <div style={{ ...styles.buttom }}>
                <div onClick={this._handlegetAuditAuthDone.bind(this)} style={{ ...styles.bottomDiv, borderRightWidth: 1, borderRightColor: '#e1e1e1', borderRightStyle: 'solid' }}>
                  <span style={{ fontSize: 16, color: '#2196F3' }}>通过</span>
                </div>
                <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, data.id)}>
                  <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
                </div>
              </div>
            </div>
          )
          break;
        case 9 || 11:
          if (data.auth.num && data.auth.point) {
            //目前剩余x点/次，通过后应扣x点/次，剩余权益不足。
            bottom_button = (
              <div style={{ position: 'fixed', bottom: 0, left: 0, height: 101 }}>
                <div style={styles.btDiv}>
                  <span style={{ fontSize: 14, color: '#666666' }}>目前剩余<span style={{ color: '#2196F3' }}>{data.auth.authTotalCount}</span>{data.auth.num != null ? '次' : '点'}，</span>
                  <span style={{ fontSize: 14, color: '#666666' }}>通过后应扣<span style={{ color: '#f37633' }}>{data.auth.useCount}</span>{data.auth.num != null ? '次' : '点'}</span>
                </div>
                <div style={{ fontSize: 12, color: '#FF0000' }}>剩余权益不足</div>
                <div style={{ ...styles.buttom }}>
                  <div onClick={this._handlegetAuditAuthDone.bind(this)} style={{ ...styles.bottomDiv, borderRightWidth: 1, borderRightColor: '#e1e1e1', borderRightStyle: 'solid' }}>
                    <span style={{ fontSize: 16, color: '#2196F3' }}>通过</span>
                  </div>
                  <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, data.id)}>
                    <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
                  </div>
                </div>
              </div>
            )
          } else {
            //目前剩余0点/次剩余权益不足
            bottom_button = (
              <div style={{ position: 'fixed', bottom: 0, left: 0, height: 101 }}>
                <div style={styles.btDiv}>
                  <span style={{ fontSize: 14, color: '#666666' }}>目前剩余<span style={{ color: '#2196F3' }}>0</span>{data.auth.num != null ? '次' : '点'}，</span>
                  <span style={{ fontSize: 14, color: '#FF0000' }}>剩余权益不足</span>
                </div>
                <div style={{ ...styles.buttom }}>
                  <div onClick={this._handlegetAuditAuthDone.bind(this)} style={{ ...styles.bottomDiv, borderRightWidth: 1, borderRightColor: '#e1e1e1', borderRightStyle: 'solid' }}>
                    <span style={{ fontSize: 16, color: '#2196F3' }}>通过</span>
                  </div>
                  <div style={{ ...styles.bottomDiv }} onClick={this.falseAudit.bind(this, data.id)}>
                    <span style={{ fontSize: 16, color: '#2196F3' }}>拒绝</span>
                  </div>
                </div>
              </div>
            )
          }
          break;
      }
    }
    return bottom_button;
  }

  doAudit(isAudit, re) {
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



  _resolveType(authFlag) {
    let type = -1;
    if (authFlag == 1 || authFlag == 12) {
      //付费课
      type = 0;
    } else if (authFlag == 9 || authFlag == 11) {
      //权益不足
      type = 1;
    } else if (authFlag == 6 || authFlag == 8) {
      //用次
      type = 3;
    } else if (authFlag == 5 || authFlag == 7) {
      //用点
      type = 4;
    } else if (authFlag == 10) {
      //只有免费名额
      type = 5;
    } else if (authFlag == 14) {
      //私享券
      type = 6;
    } else if (authFlag == 13) {
      //权益不足
      type = 7;
    }
    return type;
  }


  _handlegetAuditAuthDone() {
    console.log('_handlegetAuditAuthDone===', this.state.auditInfoDetail)
    let result = this.state.auditInfoDetail;
    if (result) {
      var title
      var content
      var btnLeft
      var btnRight
      let reqType = this._resolveType(result.auth.authFlag);
      switch (reqType) {
        case 0:
          //付费课同意弹窗
          title = '确认通过';
          content = (<div><span style={{ fontSize: 14, color: '#030303' }}>点击确认后将提交报名申请</span></div>);
          btnLeft = (
            <span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
          );
          btnRight = (
            <span onClick={this.doAudit.bind(this, true, this.props.match.params.id)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
          );
          break;
        case 1:
          //权益不足
          title = '权益不足';
          content = (<div><span style={{ fontSize: 14, color: '#030303' }}>请联系客服充值。</span></div>);
          btnLeft = (<span onClick={this._ApplyVoucher.bind(this)} style={{ fontSize: 17, color: '#666666' }}>联系客服</span>);
          btnRight = (<span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#0076ff' }}>知道了</span>);
          break;
        case 3:
        case 4:
        case 5:
          //3：用次  4：用点 5：只用免费名额固定显示 0点
          let num = result.auth.useCount || 0;
          let unit = reqType == 3 ? '次' : '点';
          if (reqType == 5) {
            num = 0;
            unit = '点'
          }
          title = '确认通过';
          content = (
            <div>
              <div>本次预计抵扣<span style={{ fontSize: 14, color: '#f37633' }}>{num}</span>{unit}，</div>
              <div>点击确认后将进行权益预扣。</div>
            </div>
          )
          btnLeft = (
            <span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
          );
          btnRight = (
            <span onClick={this.doAudit.bind(this, true, this.props.match.params.id)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
          );
          break;
        case 6:
          title = '确认通过';
          content = (
            <div>
              <div>本次预计抵扣私享会券<span style={{ fontSize: 14, color: '#f37633' }}>{result.auth.useCount || 0}</span>张，</div>
              <div>点击确认后将进行权益预扣。</div>
            </div>
          )
          btnLeft = (
            <span onClick={this.cancel.bind(this)} style={{ fontSize: 17, color: '#666666' }}>取消</span>
          );
          btnRight = (
            <span onClick={this.doAudit.bind(this, true, this.props.match.params.id)} style={{ fontSize: 17, color: '#0076ff' }}>确认</span>
          );
          break;
        case 7:
          title = '权益不足';
          content = (<div><span style={{ fontSize: 14, color: '#030303' }}>请联系客服购买新的私享会券或选择另付费参课</span></div>);
          btnLeft = (
            <span onClick={this._ApplyVoucher.bind(this)} style={{ fontSize: 17, color: '#666666' }}>联系客服</span>
          );
          btnRight = (
            <span onClick={this.doAudit.bind(this, true, this.props.match.params.id)} style={{ fontSize: 17, color: '#0076ff' }}>付费参课</span>
          );
          break;
      }

      var obj = {
        title: title,
        content: content,
        leftButtom: btnLeft,
        rightButtom: btnRight,
        centerButtom: null,
      }
      this.setState({
        isShow: true,
        auditAlert: this.auditAlert(obj)
      })
    }
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
              <div style={{ flex: 1, lineHeight: 2.5, }}>
                {obj.leftButtom}
              </div>
              <div style={{ height: 43, width: 1, opacity: 0.22, backgroundColor: '#4d4d4d' }}></div>
              <div style={{ flex: 1, lineHeight: 2.5 }}>
                {obj.rightButtom}
              </div>
            </div>
            : null
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

  //跳转至课程详情页
  _goDetail(resource_id) {
    if (resource_id) {
      this.props.history.push({ pathname: `${__rootDir}/lesson/offline/${resource_id}` })
    }
  }


  render() {
    var auditInfoDetail = this.state.auditInfoDetail || {}
    var auditObj = this.auditStatus(auditInfoDetail)
    var pay_text = this._format_pay_view(auditInfoDetail)
    var bottom_button = this._format_pass_or_reject(auditInfoDetail);

    var post_date = new Date(auditInfoDetail.post_date)
      .format("yyyy-MM-dd")
    var post_time = new Date(auditInfoDetail.post_date)
      .format("hh:mm");
    var start_date = new Date(auditInfoDetail.start_time)
      .format("yyyy-MM-dd")
    var start_time = new Date(auditInfoDetail.start_time)
      .format("hh:mm");
    var end_time = new Date(auditInfoDetail.end_time)
      .format("hh:mm");
    var end_date = new Date(auditInfoDetail.end_time || 0)
      .format("MM-dd")
    var update_date = new Date(auditInfoDetail.update_time)
      .format("yyyy-MM-dd")
    var update_time = new Date(auditInfoDetail.update_time)
      .format("hh:mm")
    var data_time
    if (auditInfoDetail.isSameDay) {
      data_time = start_date + ' ' + start_time + '-' + end_time
    } else {
      data_time = start_date + ' 至 ' + end_date
    }

    var authDiv
    if (auditInfoDetail && auditInfoDetail.useAuditAuthStr) {
      authDiv = (
        <div style={{ ...styles.authDiv }}>
            {auditInfoDetail.useAuditAuthStr}
        </div>
      )
    }

    var herftel = 'tel://' + auditInfoDetail.tel;

    var _height;
    if (auditInfoDetail.status != 2) { //历史审核
      _height = devHeight
    } else { //待审核
      if (auditInfoDetail.auth.authFlag == 1) {
        _height = devHeight - 50;
      } else {
        _height = devHeight - 101;
      }
    }

    return (
      <div style={{ ...styles.div }}>
        <div style={{ height: _height, overflowY: 'auto' }}>
          <FullLoading isShow={this.state.isLoading} />
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
              <span style={{ fontSize: 12, color: '#666666' }}>电子邮箱<span style={{ color: '#333333', marginLeft: 15 }}>{auditInfoDetail.email}</span></span>
            </div>
            <div style={{ marginLeft: 20, marginTop: -2 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>手机号码<span style={{ color: '#333333', marginLeft: 15 }}>{auditInfoDetail.phone}</span></span>
            </div>
            <div style={{ marginLeft: 20, marginTop: -2 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>所在职位<span style={{ color: '#333333', marginLeft: 15 }}>{auditInfoDetail.position}</span></span>
            </div>
            <div style={{ marginLeft: 20, marginTop: -2 }}>
              <span style={{ fontSize: 12, color: '#666666' }}>上级领导<span style={{ color: '#333333', marginLeft: 15 }}>{auditInfoDetail.seniorAccount || '-'}</span></span>
            </div>
            {auditInfoDetail.status == 2 ?
              null
              :
              <div style={{ marginLeft: 20, marginTop: -2 }}>
                <span style={{ fontSize: 12, color: '#666666' }}>更新时间<span style={{ color: '#333333', marginLeft: 15 }}>{update_date} {update_time}</span></span>
              </div>
            }
            {
              auditInfoDetail.backType == -4 ? null
                :
                <div style={{ marginLeft: 20, marginTop: 2 }}>
                  {pay_text}
                </div>
            }
          </div>
          <div style={{ ...styles.offlineInfo }}>
            <div style={{ marginLeft: 10 }}>
              <span style={{ fontSize: 16, color: '#333333' }}>线下课信息</span>
            </div>
            <div style={{ marginLeft: 15, marginTop: 10 }} onClick={this._goDetail.bind(this, this.state.auditInfoDetail.resource_id)}>
              <span style={{ fontSize: 12, color: '#2196F3' }}>{auditInfoDetail.title}</span>
            </div>
            <div style={{ marginLeft: 15, fontSize: 12, color: '#666666', marginTop: 12 }}>
              <span>举办时间</span>
              <span style={{ marginLeft: 15 }}>{data_time}</span>
            </div>
            <div style={{ width: window.screen.width - 24, borderTop: 'solid 1px #D8D8D8', marginTop: 12 }}></div>
            <div style={{ marginLeft: 15, fontSize: 12, color: '#666666', marginTop: 12 }}>
              <span>举办地点</span>
              <span style={{ marginLeft: 15 }}>{auditInfoDetail.cityname || ''} {auditInfoDetail.site || ''}</span>
            </div>
          </div>
          {authDiv}

          {auditInfoDetail.status != 2 ?
            <div style={{ textAlign: 'center', height: 36, padding: '10px 0', position: 'fixed', left: 0, bottom: 0, }}>
              {auditInfoDetail.customerSales ?
                <div style={{ fontSize: 11, lineHeight: '18px', color: Common.Light_Gray, width: devWidth - 24, marginLeft: 12 }}>
                  如有疑问请联系铂略产品顾问<span style={{ color: '#333' }}>{auditInfoDetail.customerSales}</span>或铂略客服
              </div>
                :
                <div style={{ fontSize: 11, lineHeight: '18px', color: Common.Light_Gray, width: devWidth - 24, marginLeft: 12 }}>
                  如有疑问请联系铂略客服。
              </div>
              }
              <div style={{ height: 18, lineHeight: '18px' }}>
                <span style={{ fontSize: 11, color: '#999', marginLeft: 12 }}>客服热线
                  <a style={{ color: '#2196f3' }} href={herftel}>
                    {auditInfoDetail.tel}
                  </a>
                </span>
              </div>
            </div>
            :
            <div style={{ textAlign: 'left', height: 36, paddingTop: 10 }}>
              {auditInfoDetail.customerSales ?
                <div style={{ fontSize: 11, lineHeight: '18px', color: Common.Light_Gray, width: devWidth - 24, marginLeft: 12 }}>
                  如有疑问请联系铂略产品顾问<span style={{ color: '#333' }}>{auditInfoDetail.customerSales}</span>或铂略客服
              </div>
                :
                <div style={{ fontSize: 11, lineHeight: '18px', color: Common.Light_Gray, width: devWidth - 24, marginLeft: 12 }}>
                  如有疑问请联系铂略客服。
              </div>
              }
              <div style={{ height: 18, lineHeight: '18px' }}>
                <span style={{ fontSize: 11, color: '#999', marginLeft: 12 }}>客服热线
                  <a style={{ color: '#2196f3' }} href={herftel}>
                    {auditInfoDetail.tel}
                  </a>
                </span>
              </div>
            </div>
          }


          <div style={{ ...styles.kefu }} onClick={this._ApplyVoucher.bind(this)}></div>
          <div onClick={() => {
            this.setState({ isShow: false })
          }} style={{ ...styles.zzc, display: this.state.isShow ? 'block' : 'none' }}></div>
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
          {bottom_button}
        </div>
      </div>
    )
  }
}

var styles = {
  div: {
    height: devHeight,
    width: devWidth,
    backgroundColor: '#f4f4f4',
  },
  auditInfo: {
    width: devWidth - 24,
    //height: 187,
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
    // width: 60,
    height: 20,
    textAlign: 'center',
    position: 'absolute',
    right: 24,
    borderRadius: '100px',
    lineHeight: 1,
    top: 22,
    paddingLeft: 12,
    paddingRight: 12,
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
    paddingTop: 16
  },
  authDiv: {
    width: devWidth - 34,
    height: 44,
    fontSize: 14,
    lineHeight: '20px',
    backgroundColor: '#f4f8fb',
    borderRadius: '2px',
    boxShadow: '#ccbfbf 0px 1px 3px 0px',
    marginRight: 12,
    marginLeft: 12, color: '#333333',padding:'0 5px'
  },
  buttom: {
    width: devWidth,
    height: 50,
    backgroundColor: '#FFFFFF',
    display: 'flex'
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
    bottom: 110,
    backgroundImage: 'url(' + Dm.getUrl_img('/img/v2/audit/lianxikefu@2x.png') + ')',
    backgroundSize: 'cover'
  },
  btDiv: {
    height: 50,
    backgroundColor: '#fff',
    borderBottom: 'solid 1px #e1e1e1',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20,
  }
}

export default offlineHistoryToExamineDetail;