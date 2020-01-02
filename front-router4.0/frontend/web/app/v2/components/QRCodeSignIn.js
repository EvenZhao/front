import Dispatcher from '../AppDispatcher';
import React from 'react';
import EventCenter from '../EventCenter';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import QRCode from 'qrcode.react'
import Common from '../Common';

var height = window.innerHeight
var borderWidth = height * (541 / 667) - 341
var t

function funcUrl(name, value, type) {
  var loca = window.location;
  var baseUrl = type == undefined ? loca.origin + loca.pathname + "?" : "";
  var query = loca.search.substr(1);
  // 如果没有传参,就返回 search 值 不包含问号
  if (name == undefined) { return query }
  // 如果没有传值,就返回要查询的参数的值
  if (value == undefined) {
    var val = query.match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
    return val != null ? decodeURI(val[2]) : null;
  };
  var url;
  if (query == "") {
    // 如果没有 search 值,则返回追加了参数的 url
    url = baseUrl + name + "=" + value;
  } else {
    // 如果没有 search 值,则在其中修改对应的值,并且去重,最后返回 url
    var obj = {};
    var arr = query.split("&");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split("=");
      obj[arr[i][0]] = arr[i][1];
    };
    obj[name] = value;
    url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
  };
  return url;
}


class QRCodeSignIn extends React.Component {
  constructor(props) {
    super(props);
    this.wx_config_share_home = {
      title: '铂略咨询-财税领域实战培训供应商',
      desc: '企业财务管理培训,财务培训课程,税务培训课程',
      link: document.location.href + '',
      imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
      type: 'link'
    };
    this.state = {
      value: '',
      size: 140,
      fgColor: '#000000',
      bgColor: '#ffffff',
      level: 'L',
      // tiXing: true,//是否提醒
      //是否弹出二维码页面
      isShow: false,
      resource_id: '',
      first_step: false,
      second_step: false,
      isMsk: false,
    };

  }

  componentWillMount() {

    Dispatcher.dispatch({
      actionType: 'OfflineCodeToday',
    })

  }

  componentDidMount() {
    devWidth = window.screen.width;
    devHeight = window.innerHeight;

    var isApp = funcUrl()
    var urlquery = Dm.getCurrentUrlQuery();
    var isApp = urlquery.isApp || ''
    // if (isApp) {
    //   this.setState({
    //     tiXing: false
    //   })
    // }

    EventCenter.emit("SET_TITLE", '铂略财课-参课详情');


    this.e_OfflineCodeToday = EventCenter.on("OfflineCodeTodayDone", this._handleOfflineCodeToday.bind(this));
    this.e_ChkOfflineAsignedToday = EventCenter.on("ChkOfflineAsignedTodayDone", this._handleChkOfflineAsignedToday.bind(this));
  }
  componentWillUnmount() {
    this.e_OfflineCodeToday.remove()
    this.e_ChkOfflineAsignedToday.remove()
  }

  //获取数据源
  _handleOfflineCodeToday(result) {
    // console.log('二维码result==', result);

    var { err, result } = result;
    if (err || !result) {
      this.setState({
        isShow: false,
      })
      return;
    }

    var codeKey = result.codeDetail.resource_id + JSON.stringify(localStorage.getItem("credentials.openid"));
    //当前时间
    var currentDate = new Date().format('yyyyMMdd');
    if(JSON.parse(localStorage.getItem(codeKey)) == currentDate){
      //判断是不是同一天 同一个用户 同一门课
      this.setState({
        isShow:false,
      })
      return;
    }

    this.setState({
      isShow: result ? true : false,
      offlineInfo: result.offlineInfo || {},
      codeDetail: result.codeDetail,
      value: result.codeDetail.checkcode || '',
      resource_id: result.codeDetail && result.codeDetail.resource_id ? result.codeDetail.resource_id : ''
    }, () => {

      //当前时间
      var time = new Date().format('yyyyMMdd');
      //当前课程ID
      var resource_id = this.state.resource_id;
      //当前用户的openId
      var openId = JSON.stringify(localStorage.getItem("credentials.openid"));
      //将用户的openId和课程ID作为一组key，防止下一次刷新页面上一次的信息被覆盖
      var codeKey = resource_id + openId;
      //记录下每次请求回来的当前时间
      localStorage.setItem(codeKey, JSON.stringify(time));

      Dispatcher.dispatch({
        actionType: 'WX_JS_CONFIG',
        onMenuShareAppMessage: this.wx_config_share_home
      })
    })
  }

  //是否已签到数据返回
  _handleChkOfflineAsignedToday(result) {
    if(result.err || !result){
      return;
    }

    if (result.result) {
      //返回true，表示已签到，关闭活动页
      this.setState({
        isShow:false,
      })
    } else {//未签到，继续签到
      this.setState({
        isMsk: true,
        first_step: true,
      })
    }

  }

  gotoMap(add) {
    window.location.href = 'http://api.map.baidu.com/marker?location=' + add.map_y + ',' + add.map_x + '&title=课程地址&content=' + add.site + '&output=html'
  }

  _toLink() {
    this.props.history.push(`${__rootDir}/lesson/offline/${offlineInfo.id}`)
  }

  //关闭弹窗
  _close() {
    //先看看是否已签到，如果已签到就关闭
    Dispatcher.dispatch({
      actionType: 'ChkOfflineAsignedToday',
      resource_id: this.state.resource_id,
      checkcode: this.state.value
    })
  }
  //稍后签到
  _laterSign() {
    this.setState({
      first_step: false,
      second_step: true,
    })
  }
  //直接签到，关闭当前提示弹框，出示二维码扫码签到
  _SignIn() {
    this.setState({
      first_step: false,
      isMsk: false,
    })
  }

  _hideAlert() {
    this.setState({
      second_step: false,
      isMsk: false,
      isShow: false,
    })
  }

  render() {
    var offlineInfo = this.state.offlineInfo || {}
    var address = offlineInfo.address || {}
    var codeDetail = this.state.codeDetail || {}
    var status_text
    var status_image
    var status_block = 'none'
    var text_line = {} //是否失效的显示状态
    var data_time

    var start_date = new Date(offlineInfo.start_time || 0).format("yyyy-MM-dd")
    var start_time = new Date(offlineInfo.start_time || 0).format("hh:mm");
    var end_time = new Date(offlineInfo.end_time || 0).format("hh:mm");
    var end_date = new Date(offlineInfo.end_time || 0).format("MM-dd")

    if (offlineInfo.isSameDay) {
      data_time = start_date + ' ' + start_time + '-' + end_time
    } else {
      data_time = start_date + ' 至 ' + end_date
    }
    var herftel = 'tel://' + offlineInfo.tel
    var herf = 'tel://' + offlineInfo.contacts_phone;

    var currentHeight;
    var codeWidth;//二维码宽度
    var codeHeight;//二维码高度
    var codeLeft = 0;//二维码距离左边的距离

    if (devHeight < 597) {
      currentHeight = 597;
    }
    else {
      currentHeight = devHeight
    }

    codeWidth = 140;
    codeHeight = 140;
    codeLeft = (devWidth - codeWidth - 36) / 2;

    var step1 = (
      <div style={{ ...styles.white_alert, paddingTop: -1, display: this.state.first_step ? 'block' : 'none' }}>
        <div style={{ marginTop: 15, fontSize: Fnt_Large, color: Common.Black, fontWeight: 'bold', textAlign: 'center' }}>提示</div>
        <div style={{ color: '#333', fontSize: Fnt_Small, marginTop: 10 }}>您尚未进行该线下课签到，若您已到会场建议您直接签到</div>
        <div style={styles.alert_bottom}>
          <div style={{ ...styles.divButton, borderRight: 'solid 1px #d4d4d4', color: Common.Gray }} onClick={this._laterSign.bind(this)}>稍后再签到</div>
          <div style={{ ...styles.divButton, color: Common.Activity_Text, }} onClick={this._SignIn.bind(this)}  >直接签到</div>
        </div>
      </div>
    )
    var step2 = (
      <div style={{ ...styles.white_alert, paddingTop: -1, display: this.state.second_step ? 'block' : 'none' }}>
        <div style={{ marginTop: 15, fontSize: Fnt_Large, color: Common.Black, fontWeight: 'bold', textAlign: 'center' }}>提示</div>
        <div style={{ color: '#333', fontSize: Fnt_Small, marginTop: 10 }}>
          您已关闭本次参课提醒，如您稍后仍需签到，您可进入
        <span style={{ fontSize: 14, color: '#000' }}>我-参课券</span>
          中找到具体参课券进行签到。
        </div>
        <div style={styles.alert_bottom}>
          <div style={{ ...styles.divButton, color: Common.Activity_Text }} onClick={this._hideAlert.bind(this)}>知道了</div>
        </div>
      </div>
    )
    return (
      <div style={{ ...styles.container, height: currentHeight - 18, display: this.state.isShow ? 'block' : 'none' }} ref={(lessonList) => this.lessonList = lessonList}>
        <div style={styles.boxMsk}></div>
        <div style={{ ...styles.codeDiv, }}>
          <div style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <div style={{ width: 27, height: 27, position: 'absolute', right: -13, top: -13 }} onClick={this._close.bind(this)}>
              <img src={Dm.getUrl_img('/img/v2/icons/codeClosed.png')} height="27" width="27" />
            </div>
            <div style={{ height: 50, paddingTop: 20, }}>
              <div style={{ textAlign: 'center', }}>
                <span style={{ fontSize: 18, color: '#000000', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.43px' }}>铂略线下课参课券</span>
              </div>
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 14, color: '#c3c3c3', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.34px' }}>请向工作人员出示进行签到</span>
              </div>
            </div>
          </div>
          <div style={{ height: 20, width: devWidth - 36, }}>
            <img src={Dm.getUrl_img('/img/v2/pgCenter/coups_line@2x.png')} width={devWidth - 36} height={20} />
          </div>
          <div style={{ backgroundColor: '#FFFFFF', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <div style={{ paddingTop: 20, width: codeWidth, height: codeHeight, marginLeft: codeLeft, }}>
              <QRCode
                value={this.state.value}
                size={codeWidth}
                fgColor={this.state.fgColor}
                bgColor={this.state.bgColor}
                level={this.state.level}
              />
              <div style={{ ...styles.codezzc, zIndex: 9998, display: status_block }}></div>
              <div style={{ ...styles.status_text, zIndex: 9999, display: status_block }}>
                <img src={Dm.getUrl_img(status_image)} height="40" width="40" />
                <div style={{ marginTop: 13 }} >
                  <span style={{ fontSize: 18, color: '#ffffff' }}>{status_text}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8, height: 18, marginBottom: 15, }}>
              <span style={{ ...text_line, fontSize: 16, color: '#f37633' }}>券号 {this.state.value}</span>
            </div>

            <div style={{ height: (offlineInfo.contacts_phone && offlineInfo.contacts) ? 255 : 215, }}>
              <div style={{ ...styles.content, ...styles.LineClamp, lineHeight: '20px' }}>
                <div onClick={this._toLink.bind(this)}>
                  <span style={{ fontSize: 16, color: '#333333', fontFamily: 'PingFangSC-Medium', letterSpacing: '-0.33px' }}>{offlineInfo.title}</span>
                </div>
              </div>
              <div style={{ ...styles.content, marginTop: 15 }}>
                <div>
                  <span style={{ display: 'inline-block', width: 55, fontSize: 11, color: '#c0c0c0', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px' }}>举办时间</span>
                  <span style={{ fontSize: 12, color: '#262626', fontFamily: 'PingFangSC-Medium', letterSpacing: '-0.33px', marginLeft: 15 }}>{data_time}</span>
                  <span style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>({start_time} 签到)</span>
                </div>
              </div>
              <div onClick={this.gotoMap.bind(this, address)} style={{ ...styles.content, marginTop: 10, position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 55, float: 'left' }}>
                  <span style={{ fontSize: 11, color: '#c0c0c0', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px' }}>举办地址</span>
                </div>
                <div style={{ width: devWidth - 170, marginLeft: 15, float: 'left' }}>
                  <span style={{ fontSize: 12, color: '#262626', fontFamily: 'PingFangSC-Medium', letterSpacing: '-0.33px' }}>{address.provincename || ''}&nbsp;{address.cityname || ''}&nbsp;{address.address || ''}</span>
                  <div style={{ marginTop: 5, position: 'relative', }}>
                    <span style={{ fontSize: 11, color: '#999999', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px', marginTop: 5 }}>{address.site}&nbsp;{address.detail_place ? address.detail_place : ''}</span>
                    <img src={Dm.getUrl_img('/img/v2/icons/more.png')} width="8" height="14" style={{ position: 'absolute', right: 0, bottom: 0, }} />
                  </div>
                </div>
              </div>
              <div style={{ width: devWidth - 96, height: 1, backgroundColor: '#D8D8D8', marginLeft: 30, marginTop: 8, position: 'relative' }}></div>
              <div style={{ ...styles.content, marginTop: 10, paddingTop: 0 }}>
                <div style={{ width: 55, float: 'left' }}>
                  <span style={styles.code_text}>参课人员</span>
                </div>
                <div style={{ width: devWidth - 170, marginLeft: 15, float: 'left' }}>
                  <span style={{ fontSize: 11, color: '#999999' }}>{codeDetail.name}</span>
                </div>
              </div>
              <div style={{ ...styles.content, overflow: 'hidden', paddingTop: 5, }}>
                <div style={{ width: 55, float: 'left' }}>
                  <span style={styles.code_text}>手机号码</span>
                </div>
                <div style={{ width: devWidth - 170, marginLeft: 15, float: 'left' }}>
                  <span style={{ fontSize: 11, color: '#999999' }}>{codeDetail.phone}</span>
                </div>
              </div>
              <div style={{ ...styles.content, overflow: 'hidden', paddingTop: 5, }}>
                <div style={{ width: 55, float: 'left' }}>
                  <span style={{ fontSize: 11, color: '#c0c0c0', fontFamily: 'PingFangSC-Regular', letterSpacing: '-0.27px' }}>电子邮箱</span>
                </div>
                <div style={{ width: devWidth - 175, marginLeft: 15, float: 'left' }}>
                  <span style={{ fontSize: 11, color: '#999999' }}>{codeDetail.email}</span>
                </div>
              </div>
              <div style={{ ...styles.button, display: (offlineInfo.contacts_phone && offlineInfo.contacts) ? 'block' : 'none' }}>
                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: 14, color: '#333333' }}>会场接待 <a style={{ color: '#333333' }} href={herf}>{offlineInfo.contacts_phone}</a> </span>
                  <span style={{ fontSize: 12, color: '#999999' }}> ({offlineInfo.contacts})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div style={{ height: 35, lineHeight: '35px', textAlign: 'center', width: devWidth,position:'absolute',left:0,top:530,zIndex:9999 }}>
          <span style={{ fontSize: 12, color: '#ffffff' }}>客服热线 <a style={{ color: '#ffffff', textDecoration: 'underline' }} href={herftel}>{offlineInfo.tel}</a></span>
        </div> */}
        
        <div style={{ ...styles.msk, display: this.state.isMsk ? 'block' : 'none' }}></div>
        {step1}
        {step2}
      </div>
    )
  }
}

var styles = {
  container: {
    width: devWidth,
    // backgroundImage: 'url('+Dm.getUrl_img('/img/v2/pgCenter/Rectangle@2x.png')+')',
    // backgroundImage: 'linear-gradient(49deg, #27CFFF 0%, #2AA6FF 100%)',
    // backgroundSize: '100%',
    // backgroundAttachment: 'fixed',
    position: 'fixed',
    zIndex: 8999,
    left: 0,
    top: 0,
    paddingTop: 18,
    height: devHeight - 18,
    overflowY: 'auto'
  },
  boxMsk: {
    backgroundColor: '#000',
    opacity: '0.3',
    position: 'absolute',
    zIndex: 9000,
    left: 0,
    top: 0,
    width: devWidth,
    height: devHeight,
  },
  codeDiv: {
    width: devWidth - 36,
    // boxShadow: '0 2px 4px 0  #078ffb',
    // borderRadius: '12px',
    marginLeft: 18,
    position: 'absolute',
    left: 0,
    top: 18,
    zIndex: 9020,
    lineHeight: 1,
  },
  codezzc: {
    height: 140,
    width: 140,
    position: 'absolute',
    opacity: 0.7,
    backgroundColor: '#000000',
    top: 92
  },
  status_text: {
    height: 140,
    width: 140,
    position: 'absolute',
    top: 98,
    textAlign: 'center',
    paddingTop: (140 - 71) / 2,
  },
  content: {
    width: devWidth - 96,
    marginLeft: 30,
    position: 'relative',
  },
  code_text: {
    fontSize: 11,
    color: '#c0c0c0',
    fontFamily: 'PingFangSC-Regular',
    letterSpacing: '-0.27px'
  },
  button: {
    width: devWidth - 36,
    height: 40,
    backgroundColor: '#f4f8fb',
    borderRadius: '0 0 12px 12px',
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
  },
  bottom: {
    width: devWidth - 36,
    height: 45,
    backgroundColor: '#FFFFFF',
    marginLeft: 18,
    borderRadius: '4px',
    position: 'absolute',
    left: 0,
    bottom: 35,
  },
  LineClamp: {
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  white_alert: {
    width: devWidth - 120,
    padding: '0 10px',
    height: 160,
    backgroundColor: Common.Bg_White,
    borderRadius: 12,
    position: 'absolute',
    zIndex: 9100,
    top: 180,
    left: 50,
    // textAlign: 'center',
  },
  alert_bottom: {
    position: 'absolute',
    zIndex: 201,
    bottom: 0,
    left: 0,
    width: devWidth - 100,
    height: 42,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#d4d4d4',
    display: 'flex',
    flex: 1,
  },
  msk: {
    width: devWidth,
    height: devHeight,
    backgroundColor: '#000000',
    position: 'fixed',
    zIndex: 9030,
    opacity: 0.3,
    top: 0,
    textAlign: 'center',
  },
  alert_box: {
    width: devWidth,
    height: 40,
    position: 'absolute',
    zIndex: 9000,
    top: '50%',
    left: 0,
    textAlign: 'center'
    // display:'flex',
    // flexDirection:'row',
    // justifyContent:'center',
    // alignItems:'center'
  },
  alert_content: {
    padding: '0 10px',
    height: 40,
    lineHeight: '40px',
    display: 'inline-block',
    color: Common.Bg_White,
    fontSize: Fnt_Normal,
    backgroundColor: Common.Light_Black,
    opacity: 0.7,
    borderRadius: 2,
  },
  divButton: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    lineHeight: '42px',
    fontSize: Fnt_Medium,
  }

}

export default QRCodeSignIn;
