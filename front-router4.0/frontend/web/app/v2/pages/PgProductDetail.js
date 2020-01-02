/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ProductTop from '../components/ProductTop'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import ProductLessonDiv from '../components/ProductLessonDiv';
import NoteAlert from '../components/NoteAlert'
import Dm from '../util/DmURL'
import Guide from '../components/Guide'

/*
 * 将秒数格式化时间
 * @param {Number} seconds: 整数类型的秒数
 * @return {String} time: 格式化之后的时间
 */

//格式化时间
global.FormatSeconds = function (value) {
  // 秒
  var theTime = parseInt(value);
  // 分
  var theTime1 = 0;
  // 小时
  var theTime2 = 0;

  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);

    if (theTime1 >= 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  // 秒
  var result = "" + parseInt(theTime);
  if (result.length == 1) {
    result = "0" + result;
  }

  if (theTime1 >= 0) {
    // 分
    if ((theTime1 + "").length == 1) {
      result = "0" + parseInt(theTime1) + ":" + result;
    } else {
      result = "" + parseInt(theTime1) + ":" + result;
    }
  }

  if (theTime2 > 0) {
    // 时
    if ((theTime2 + "").length == 1) {
      result = "0" + parseInt(theTime2) + ":" + result;
    } else {
      result = "" + parseInt(theTime2) + ":" + result;
    }
  }
  return result;
}

var load
var t

class PgProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.firstOnlineId = ''
    this.data = []
    this.wx_config_share_home = {
      title: '',
      desc: '',
      link: document.location.href + '',
      imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
      type: 'link'
    };
    this.state = {
      listHeight: devHeight - 42.5,
      default_image: '',
      introduction: '',
      isCollect: false,
      productPrice: '',
      singlePrice: '',
      title: '',
      levels: [],
      displayStatusNum: 1,
      productId: '',
      orderId: '',
      hasAuth: false,
      isStartLearn: false,//true：开始学习，false：继续学习
      productAccount: {},//跳转到对应的课程
      count: 1,
      alertDisplay: 'none',
      context: '',
      errDisplay: 'none',
      user: {},
      isRemind: false,//是否设置上线提醒
      index: null,
      idx: null,
      isStartLearn: true, //true为开始学习，false为继续学习
      productAccount: {},//继续学习课程
      plan_release_date: null,//即将上线日期
      //是否是会员 1:会员
      vipPriceFlag: null,
      result: {},
      //课程是否下架
      isErr: 'none',//是否显示报错信息
    };
  }

  _handleProductDetailDone(re) {
    console.log('_handleProductDetailDone---', re);
    if (re.err) {
      this.setState({
        isLoading: false,
        isErr: 'block',
        err: re.err
      })
      return false
    }
    if (re.result) {
      var result = re.result;
      this.wx_config_share_home = {
        title: result.title,
        desc: result.introduction,
        link: document.location.href + '',
        imgUrl: result.default_image,
        type: 'link',
        success: function () {
          // 用户确认分享后执行的回调函数
          //分享任务接口,8 视频课 / 9 直播课 / 10 线下课 / 11 专题课
          Dispatcher.dispatch({
            actionType: 'PostShareTask',
            type: 11,
          })
        },
      };
      EventCenter.emit("SET_TITLE", result.title)
      this.setState({
        result: result,
        default_image: result.default_image,
        introduction: result.introduction,
        isCollect: result.isCollect,
        productPrice: result.productPrice,
        singlePrice: result.singlePrice,
        title: result.title,
        levels: result.levels || [],
        productId: result.id,
        hasAuth: result.hasAuth || false,
        user: re.user || {},
        isStartLearn: result.isStartLearn,
        productAccount: result.productAccount,
        vipPriceFlag: re.user && re.user.vipPriceFlag ? re.user.vipPriceFlag : null,
      })
      Dispatcher.dispatch({
        actionType: 'WX_JS_CONFIG',
        onMenuShareAppMessage: this.wx_config_share_home
      })
    }
  }

  //报错回退到上一个界面
  cancelErr(re) {
    this.props.history.go(-1)
  }

  _changeLeves(re) {
    if (re && re > 0) {
      this.setState({
        displayStatusNum: re
      })
    }
  }
  _handleDoCollect(re) {
    console.log('_handleDoCollect', re);
    if (re.result) {
      this.setState({
        isCollect: !this.state.isCollect
      })
    }
  }
  _ProductCollect(re) {
    Dispatcher.dispatch({
      actionType: 'Collect',
      // id: this.props.match.params.id
      resource_id: this.state.productId,
      resource_type: 7
    })
  }
  componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'ProductDetail',
      id: this.props.match.params.id
    })
  }
  _doPay(re) {//makeOrderPayWeixin
    console.log('this.state.user', this.state.user);
    if (this.state.user.isLogined == false) {
      this.props.history.push(`${__rootDir}/login`)
      return
    }
    if (isWeiXin) {
      Dispatcher.dispatch({
        actionType: 'makeOrderPayWeixin',
        resource_id: this.props.match.params.id
      })
    } else {
      alert('如果您对本课程感兴趣，请至网站或微信进行购买。');
    }
  }
  _doStudy(re) {
    var productAccount = this.state.productAccount || {}

    if (this.state.isStartLearn) {//判断是否为开始学习
      Dispatcher.dispatch({
        actionType: 'addProductRecord',
        product_id: this.props.match.params.id,
        learn_id: this.firstOnlineId,
        learn_type: 2
      })
      this.props.history.push({ pathname: `${__rootDir}/lesson/online/${this.firstOnlineId}` })
    } else {//继续学习
      if (productAccount) {//如果返回的值存在则跳转继续学习
        Dispatcher.dispatch({
          actionType: 'addProductRecord',
          product_id: this.props.match.params.id,
          learn_id: productAccount.id,
          learn_type: productAccount.type
        })
        this.props.history.push({ pathname: `${__rootDir}/lesson/online/${productAccount.id}` })
      } else {//如果返回为空，就按照之前的跳转方式，跳转到第一门课程
        this.props.history.push({ pathname: `${__rootDir}/lesson/online/${this.firstOnlineId}` })
      }
    }
  }
  _handlemakeOrderPayWeixin(re) {
    if (re.err) {
      var err = '支付失败:' + re.err
      alert(err)
      return 'fail'
    }
    this._changeTop()
    this.setState({
      orderId: re.orderId,
      alertDisplay: 'block'
    }, () => {
      if (re.orderId) {
        Dispatcher.dispatch({
          actionType: 'isPayCompleteWeixin',
          order_id: this.state.orderId
        })
      }
    })
  }
  _handleisPayCompleteWeixinError() {
    clearInterval(load)
    clearTimeout(t)
    alert('您的订单暂未完成，请稍后重新进入页面或联系客服，切勿重复支付')
    this.setState({
      alertDisplay: 'none'
    })
  }
  _handleisPayCompleteWeixinDone() {
    clearInterval(load)
    clearTimeout(t)
    alert('支付成功');
    this.setState({
      alertDisplay: 'none',
      hasAuth: true
    })
  }
  _changeTop() {
    if (this.state.top == 0) {
      this.setState({
        top: 12
      })
    } else {
      load = setInterval(() => {
        clearInterval(load)
        this.setState({
          top: 0
        })
      }, 300)
    }
    t = setTimeout(() => {
      this._changeTop()
    }, 500)
  }
  handleaddProductRecordDone(e) {
    // console.log('handleaddProductRecordDone',e);
  }
  componentDidMount() {
    EventCenter.emit("SET_TITLE", '铂略财课-专题课详情页')

    backNotloadIndex = 'PgProductDetail'
    this._getProductDetailDone = EventCenter.on('ProductDetailDone', this._handleProductDetailDone.bind(this));
    this._doCollect = EventCenter.on('CollectDone', this._handleDoCollect.bind(this));
    this.getmakeOrderPayWeixin = EventCenter.on('makeOrderPayWeixinDone', this._handlemakeOrderPayWeixin.bind(this))
    this.getisPayCompleteWeixinDone = EventCenter.on('isPayCompleteWeixinDone', this._handleisPayCompleteWeixinDone.bind(this))
    this.getisPayCompleteWeixinError = EventCenter.on('isPayCompleteWeixinError', this._handleisPayCompleteWeixinError.bind(this))
    this._setOnlineRemind = EventCenter.on('SetOnlineRemindDone', this._handleSetOnlineRemind.bind(this));
    this._HideAlert = EventCenter.on('HideAlert', this._handleHideAlert.bind(this));
    this._addProductRecordDone = EventCenter.on('addProductRecordDone', this.handleaddProductRecordDone.bind(this));
  }
  componentWillUnmount() {
    this._getProductDetailDone.remove();
    this._doCollect.remove();
    this.getmakeOrderPayWeixin.remove();
    this.getisPayCompleteWeixinDone.remove();
    this.getisPayCompleteWeixinError.remove();
    this._setOnlineRemind.remove()
    this._HideAlert.remove()
    this._addProductRecordDone.remove()
  }

  _handleshowRemindDone(index, idx) {
    var levels = this.state.levels || []
    if (levels[index].lessons) {
      var lessons = levels[index].lessons
      lessons[idx].showRemind = true
      // levels[index].lessons = lessons
      this.setState({
        levels: levels,
        plan_release_date: lessons[idx].plan_release_date || null
      })
    }

  }
  _remind(online_id, index, idx) {
    Dispatcher.dispatch({
      actionType: 'SetOnlineRemind',
      id: online_id,
    })
    this.setState({
      index: index,
      idx: idx,
    })
  }

  _handleSetOnlineRemind(re) {
    console.log('_handleSetOnlineRemind', re);
    if (re.err) {
      return false;
    }
    if (!re.user.isLogined) {//未登录跳转到登录页面
      this.props.history.push(`${__rootDir}/login`);
      return false;
    }

    if (re.result) {
      this.setState({
        isRemind: true,
      }, () => {
        this._handleshowRemindDone(this.state.index, this.state.idx)
      })
    }
  }

  _handleHideAlert() {
    this.setState({
      isRemind: false,
    })
  }

  _isGo(resourceType, isShow, id) {
    if (resourceType == 1) {//直播课
      Dispatcher.dispatch({
        actionType: 'addProductRecord',
        product_id: this.props.match.params.id,
        learn_id: id,
        learn_type: resourceType
      })
      this.props.history.push({ pathname: `${__rootDir}/lesson/live/${id}` })
    }
    else if (resourceType == 2) {//视频课
      if (isShow) {//非即将上线跳转到详情
        Dispatcher.dispatch({
          actionType: 'addProductRecord',
          product_id: this.props.match.params.id,
          learn_id: id,
          learn_type: resourceType
        })
        this.props.history.push({ pathname: `${__rootDir}/lesson/online/${id}` });
      }
    }
  }

  render() {
    var content = {
      top: 100,
      context: this.state.context,
      display: this.state.display,
    }
    var levels
    // alert(this.state.levels.length)
    if (this.state.levels.length > 0) {
      levels = this.state.levels.map((item, index) => {
        var conut = index + 1;
        var displayStatus;
        var powerWidth;
        var powerNum = 0;
        if (conut == this.state.displayStatusNum) {
          displayStatus = 'block';
        } else {
          displayStatus = 'none';
        }
        var lessons = item.lessons.map((less, idx) => {

          if (!this.firstOnlineId && less.isShow) {
            this.firstOnlineId = less.id
          }
          var duration = FormatSeconds(less.duration);
          var choose;
          var sequence = idx + 1
          if (less.isJoined) {
            powerNum = powerNum + 1
            choose = '/img/v2/icons/productChoose.png'
          } else {
            choose = '/img/v2/icons/productNoChoose.png'
          }
          return (
            <div key={idx} style={{ width: '100%', height: 25, marginBottom: 10 }} onClick={this._isGo.bind(this, less.resource_type, less.isShow, less.id)}>
              <div style={{ float: 'left' }}>
                <img src={Dm.getUrl_img(choose)} height="10" width="10" />
              </div>
              <div style={{ float: 'left', marginLeft: 15, marginRight: 15 }}>
                <span style={{ fontSize: 13, color: '#333333' }}>{sequence}</span>
              </div>
              <div style={{ float: 'left', width: devWidth * 0.6, marginTop: 4 }}>
                <span style={{ ...styles.levelsTitle, fontSize: 13, color: '#333333' }}>{less.title}</span>
              </div>
              <div></div>

              <div style={{ float: 'right', height: 20, }}>
                {
                  less.isShow ?
                    <span style={{ fontSize: 13, color: '#999999' }}>{duration}</span>
                    :
                    <span>
                      {less.showRemind ?
                        <div style={styles.online_remain}>
                          上线提醒
                         <div style={{ ...styles.on_remain }}></div>
                        </div>
                        :
                        <div style={styles.online_remain} onClick={this._remind.bind(this, less.id, index, idx)}>
                          上线提醒
                       </div>
                      }
                    </span>
                }
              </div>
            </div>
          )
        })
        if (powerNum == 0) {
          powerWidth = 0
        } else {
          var hh = item.lessons.length;
          powerWidth = (powerNum / hh) * 44;
        }
        return (
          <div key={index} onClick={this._changeLeves.bind(this, conut)}>
            <div style={{ height: 45, width: '100%', backgroundColor: '#f6fbfb', border: '1px solid', borderColor: '#E5E5E5', }} >
              <div style={{ ...styles.levelsDiv }}>
                <div style={{ ...styles.levelPowerBg, width: powerWidth }}></div>
                <span style={{ ...styles.levelNum }}>阶段{conut}</span>
              </div>
              <div style={{ float: 'left', width: 4, height: 9, backgroundColor: '#0069BC', marginTop: 20, borderRadius: 1 }}></div>
              <div style={{ width: devWidth * 0.39, marginTop: 13, float: 'left', marginLeft: 14, }}>
                <span style={{ ...styles.levelsTitle, fontSize: 14, color: '#666666' }}>{item.title}</span>
              </div>
              <div style={{ float: 'left', marginTop: 13, marginRight: 13 }}>
                <span style={{ fontSize: 12, color: '#666666' }}>
                  <img src={Dm.getUrl_img('/img/v2/icons/class.png')} />
                  <span style={{ marginLeft: 4 }}>{item.course_num}课程</span>
                </span>
              </div>
              <div style={{ marginTop: 13, }}>
                <span style={{ fontSize: 12, color: '#666666' }}>
                  <img src={Dm.getUrl_img('/img/v2/icons/video_num.png')} />
                  <span style={{ marginLeft: 4 }}>{item.video_num}章节</span>
                </span>
              </div>
            </div>
            <div style={{ backgroundColor: '#ffffff', display: displayStatus, paddingTop: 20, paddingBottom: 20, paddingLeft: 12, paddingRight: 12 }}>
              {lessons}
            </div>
          </div>
        )
      })
    }

    var width = devWidth;
    var isCollectImg;
    if (this.state.isCollect) {
      isCollectImg = '/img/v2/icons/onlineFouces@2x.png';
    } else {
      isCollectImg = '/img/v2/icons/online-Fouces@2x.png'
    }

    let noteProps = {
      plan_release_date: this.state.plan_release_date,
      isShow: this.state.isRemind,
    }

    return (
      <div style={{ ...styles.div, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <NoteAlert {...noteProps} />
        <div style={{ ...styles.mask, display: this.state.isRemind ? 'block' : 'none' }} onClick={this._handleHideAlert.bind(this)}></div>
        <div style={{ width: window.screen.width, height: window.screen.height - 50, overflow: 'scroll', flex: 1, overflowX: 'hidden' }}>
          <div style={{ ...styles.imageDiv }}>
            <img src={this.state.default_image} height="236" width={width} />
          </div>
          <div style={{ ...styles.introductionDiv }}>
            <div style={{ width: width - 12, marginLeft: 12, paddingTop: 10 }}>
              <span style={{ ...styles.levelsTitle, fontSize: 17, color: '#333333' }}>{this.state.title}</span>
            </div>
            <div style={{ height: 30, lineHeight: '30px', width: devWidth - 24, fontSize: 12, color: '#999', marginLeft: 12 }}>
              <img src={Dm.getUrl_img('/img/v2/icons/product_level@2x.png')} width={14} height="13" style={{ float: 'left', marginTop: 8 }} />
              <span style={{ marginLeft: 8, float: 'left' }}>{this.state.result.level_num}阶段</span>
              <img src={Dm.getUrl_img('/img/v2/icons/time2@2x.png')} width={13} height="13" style={{ float: 'left', marginLeft: 19, marginTop: 8 }} />
              <span style={{ marginLeft: 8, float: 'left' }}>{this.state.result.course_num}课程</span>
              <img src={Dm.getUrl_img('/img/v2/icons/time2@2x.png')} width={13} height="13" style={{ float: 'left', marginTop: 8, marginLeft: 25 }} />
              <span style={{ marginLeft: 8, float: 'left' }}>{this.state.result.duration}学时</span>
            </div>
            <div style={styles.price_box}>
              {this.state.vipPriceFlag == 1 ?
                <div style={{ color: '#333', fontSize: 14 }}>
                  <img src={Dm.getUrl_img('/img/v2/icons/productVIP.png')} style={{ width: 26, height: 15, float: 'left', marginRight: 6, marginTop: 14 }} />
                  优惠价格<span style={{ fontSize: 12, color: '#f37633' }}>￥</span><span style={{ color: '#f37633', fontSize: 16 }}>0</span>
                  <span style={styles.singlePrice}>专题价格￥{this.state.singlePrice}</span>
                </div>
                :
                <div style={{ color: '#333', fontSize: 14 }}>
                  优惠价格<span style={{ color: '#f37633', fontSize: 12 }}>￥</span>
                  <span style={{ fontSize: 16, color: '#f37633' }}>{this.state.productPrice}</span>
                  <span style={styles.singlePrice}>专题价格￥{this.state.singlePrice}</span>
                </div>
              }
            </div>
            <div style={{ width: width - 12, height: 60, marginLeft: 12, marginTop: 5, paddingBottom: 8 }}>
              <p style={{ ...styles.introductionSpan, fontSize: 14, color: '#666', lineHeight: '20px' }}>{this.state.introduction}</p>
            </div>
          </div>
          <div>
            {levels}
          </div>
        </div>
        <div style={{ width: devWidth, height: 50, backgroundColor: '#ffffff', border: '1px solid', borderColor: '#E5E5E5', borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}>
          {/*
              <div style={{float:'left',marginLeft:12,lineHeight: '20px'}}>
                <div style={{marginTop:8}} onClick={this._ProductCollect.bind(this)}>
                <img src={Dm.getUrl_img(isCollectImg)} width="18" height="18"/></div>
                <div><span style={{fontSize:12,color:'#999999'}}>关注</span></div>
              </div>
            */}

          <div style={{ float: 'left', textAlign: 'center', marginLeft: 12, paddingTop: 6, }} onClick={this._ProductCollect.bind(this)}>
            <img src={Dm.getUrl_img('/img/v2/icons/QAguanzhu@2x.png')} style={{ height: 18, width: 18, display: this.state.isCollect ? 'none' : 'block', marginLeft: 8 }} />
            <img src={Dm.getUrl_img('/img/v2/icons/online-Fouces@2x.png')} style={{ height: 18, width: 18, display: this.state.isCollect ? 'block' : 'none', marginLeft: 16, }} />
            <span style={{ fontSize: 13, color: this.state.isCollect ? '#2196f3' : '#666', marginLeft: this.state.isCollect ? 0 : 4 }}>{this.state.isCollect ? '取消关注' : '关注'}</span>
          </div>

          {
            this.state.hasAuth ?
              <div style={{ float: 'left', position: 'absolute', right: 150 }}></div>
              :
              <div style={{ float: 'left', position: 'absolute', right: 150 }}>
                <div><span style={{ fontSize: 15, color: '#333333' }}>专题价￥{this.state.productPrice || 0}</span></div>
                <div><span style={{ fontSize: 12, color: '#999999', textDecoration: 'line-through' }}>单买总价：{this.state.singlePrice}</span></div>
              </div>
          }
          {
            this.state.hasAuth ?
              <div onClick={this._doStudy.bind(this)} style={{ height: 50, width: 141, backgroundColor: '#2196f3', position: 'absolute', right: 0, textAlign: 'center', lineHeight: '50px', display: (JSON.stringify(this.state.productAccount) == "{}") ? 'none' : 'block' }}>
                <span style={{ fontSize: 18, color: '#FFFFFF' }}>
                  {this.state.isStartLearn ? '开始学习' : '继续学习'}
                </span>
              </div>
              :
              <div onClick={this._doPay.bind(this)} style={{ height: 50, width: 100, backgroundColor: '#DA0D0D', position: 'absolute', right: 0, textAlign: 'center', lineHeight: '50px' }}>
                <span style={{ fontSize: 15, color: '#FFFFFF' }}>购买</span>
              </div>
          }
        </div>
        <div style={{ ...styles.zzc, display: this.state.alertDisplay }}></div>
        <div style={{ ...styles.alertDiv, display: this.state.alertDisplay }}>
          <img src={Dm.getUrl_img(`/img/v2/icons/load@2x.png`)} style={{ position: 'relative', top: this.state.top, width: 26, height: 26 }} />
          <div style={{ display: 'inline-block', marginLeft: 12, color: '#999', position: 'relative', top: 6 }}>订单状态查询中…</div>
        </div>
        <Guide type={'product'} />

        <div style={{ ...styles.zzc, display: this.state.isErr }} onClick={this.cancelErr.bind(this)}></div>
        <div style={{ width: 270, height: 104, backgroundColor: '#FFFFFF', borderRadius: '12px', textAlign: 'center', position: 'absolute', zIndex: 9999, left: (devWidth - 270) / 2, top: (devHeight - 104) / 2, display: this.state.isErr }}>
          <div style={{ height: 60, textAlign: 'center', lineHeight: 4 }}>
            <span style={{ fontSize: 14, color: '#030303', fontFamily: 'pingfangsc-regular' }}>{this.state.err}</span>
          </div>
          <div style={{ width: 270, height: 1, backgroundColor: '#fff', borderBottom: 'solid 1px #d4d4d4' }}></div>
          <div style={{ height: 43, textAlign: 'center', lineHeight: 2.5 }} onClick={this.cancelErr.bind(this)}>
            <span style={{ fontSize: 17, color: '#0076ff', fontFamily: 'pingfangsc-regular' }} >知道了</span>
          </div>
        </div>

      </div>
    );
  }
}

var styles = {
  div: {
    height: devHeight,
    width: devWidth,
  },
  imageDiv: {
    width: '100%',
    height: 236,
  },
  introductionDiv: {
    width: '100%',
    // height: 105,
    backgroundColor: '#ffffff',
  },
  introductionSpan: {
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    lineHeight: '20px'
  },
  levelsDiv: {
    float: 'left',
    height: 20,
    width: 44,
    border: '1px solid',
    borderColor: '#0069BC',
    marginTop: 13,
    marginLeft: 12,
    // marginRight:8,
    textAlign: 'center',
    lineHeight: 1,
    position: 'relative'
  },
  levelsTitle: {
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    // lineHeight: '20px'
  },
  levelNum: {
    fontSize: 12,
    color: '#2196F3',
    height: 19,
    position: 'absolute',
    left: 6,
    top: 4
    // backgroundColor:'#a4d6ff'
  },
  levelPowerBg: {
    position: 'absolute',
    height: 19,
    // width:20,
    backgroundColor: '#a4d6ff',
    // borderRadius:4
  },
  alertDiv: {
    position: 'absolute',
    top: (devHeight - 100) / 2,
    backgroundColor: '#ffffff',
    width: devWidth - 100,
    height: 100,
    marginLeft: 50,
    textAlign: 'center',
    borderRadius: 12,
    lineHeight: 6,
    zIndex: 999
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
  mask: {
    width: devWidth,
    height: devHeight,
    backgroundColor: '#000',
    opacity: 0.2,
    position: 'absolute',
    zIndex: 998,
  },
  online_remain: {
    width: 63,
    height: 18,
    border: 'solid 1px #f37633',
    textAlign: 'center',
    lineHeight: '18px',
    position: 'relative',
    fontSize: 11,
    color: '#f37633',
    borderRadius: 2,
  },
  on_remain: {
    width: 12,
    height: 12,
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundImage: 'url(' + Dm.getUrl_img('/img/v2/icons/icon_reminded@2x.png') + ')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  price_box: {
    width: window.screen.width - 24,
    height: 42,
    lineHeight: '42px',
    borderTop: 'solid 1px #f3f3f3',
    borderBottom: 'solid 1px #f3f3f3',
    margin: '0 12px 5px 12px'
  },
  singlePrice: {
    color: '#999',
    textDecoration: 'line-through',
    marginLeft: 5,
    marginLeft: 18,
    fontSize: 12
  }
};

export default PgProductDetail;
