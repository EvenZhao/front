/* flow */
'use strict';
// import "babel-polyfill";
import { dm, makeSureCurrentUrlSaveForWeixinShare } from './util/DmURL.js';
import { jumpToPC } from './redirectPC'
// import URL from 'url';
import './util/DateFormat';
import './util/funcs';
import Dispatcher from './AppDispatcher';
import EventCenter from './EventCenter';
import React, { PropTypes } from 'react';
import Common from './Common';
import iosSelect from './util/iosSelect'
import maskStyle from './components/maskStyle'
import {
  render
} from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Match,
  withRouter,
  IndexRoute,
  Link,
} from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'


const cx = require('classnames');
const util = require('util'),
  f = util.format;

import { AuthStore } from './stores/AuthStore.js';
import './stores/StoreRegister'

import PLoadingMask from './components/PanelLoadingMask';
import promptBox from './components/PromptBox';


import PgWeuiTest from './pages/PgWeui';
import GuidePage from './pages/GuidePage';
import PgNoPassLogin from './pages/PgNoPassLogin'
import PgHome from './pages/PgHome';
import PgOnlineDetail from './pages/PgOnlineDetail';
import PgLiveDetail from './pages/PgLiveDetail';
import PgOfflineDetail from './pages/PgOfflineDetail';
import PgTeacherDetail from './pages/PgTeacherDetail';
import PgOnlineCommentList from './pages/PgOnlineCommentList';
import PgOnlineComment from './pages/PgOnlineComment';
import PgQuestion from './pages/PgQuestion';
import PgOfflineEnroll from './pages/PgOfflineEnroll';
import PgExam from './pages/PgExam';
import PgFindPass from './pages/PgFindPass';
import PgRegister from './pages/PgRegister';
import PgCompleteData from './pages/PgCompleteData';
// import PgCenter from './pages/PgCenter';
import PersonalCenter from './pages/PersonalCenter'
import PgCenterSet from './pages/PgCenterSet';
import PgSetInfo from './pages/PgSetInfo';
import PgSetNickname from './pages/PgSetNickname';
import PgAdvice from './pages/PgAdvice';
import PgSetPassword from './pages/PgSetPassword';
import PgSelectAccount from './pages/PgSelectAccount';
import PgLessonList from './pages/PgLessonList';
import PgPriceIntroduction from './pages/PgPriceIntroduction';
import PgQuestionDetail from './pages/PgQuestionDetail';
import PgQuestionList from './pages/PgQuestionList';
import PgProductList from './pages/PgProductList';
import PgProductDetail from './pages/PgProductDetail';
import PgMyDiscount from './pages/PgMyDiscount';
import PgAddDiscount from './pages/PgAddDiscount';
import PgMyCollect from './pages/PgMyCollect'
import PgAnswerDetail from './pages/PgAnswerDetail'
import PgAddAnswer from './pages/PgAddAnswer'
import PgLearnRecord from './pages/PgLearnRecord'
import PgSearchResult from './pages/PgSearchResult'
import PgHomeIndex from './pages/PgHomeIndex'
import PgMyQuestion from './pages/PgMyQuestion'
import PgAddAnswerComment from './pages/PgAddAnswerComment'
import PgTeacherLessonList from './pages/PgTeacherLessonList'
import PgLessonQuestion from './pages/PgLessonQuestion'
import PgLiveReserve from './pages/PgLiveReserve'
import PgAdress from './pages/PgAdress'
import PgExamResult from './pages/PgExamResult'
import PgUseDiscountForOnline from './pages/PgUseDiscountForOnline'

import PgPositionList from './pages/PgPositionList'
import PgSetPhone from './pages/PgSetPhone'
import PgUpdatePhone from './pages/PgUpdatePhone'
import PgSetEmail from './pages/PgSetEmail'
import PgSetPosition from './pages/PgSetPosition'
import PgMyReserveEnroll from './pages/PgMyReserveEnroll'
import PgChooseAccount from './pages/PgChooseAccount'
import PgQuickLogin from './pages/PgQuickLogin'

import PgMyReserveDetail from './pages/PgMyReserveDetail'
import PgMyEnrollDetail from './pages/PgMyEnrollDetail'
import PgMyReserveEnrollList from './pages/PgMyReserveEnrollList'
import PgLiveReserveEnrollList from './pages/PgLiveReserveEnrollList'
import PgOfflineReserveEnrollList from './pages/PgOfflineReserveEnrollList'
import PgEnrollPerson from './pages/PgEnrollPerson'
import LoginAlert from './components/LoginAlert'
import PgOfflineNewEnroll from './pages/PgOfflineNewEnroll'
import PgOfflineEnrollManyPeople from './pages/PgOfflineEnrollManyPeople'
import NewEnrollManyPeople from './pages/NewEnrollManyPeople'
import PgLawLastest from './pages/PgLawLastest'
import PgLawDetail from './pages/PgLawDetail'
import PgLawSearch from './pages/PgLawSearch'
import PgFreeInvited from './pages/PgFreeInvited'

import PgLoadingPlay from './pages/PgLoadingPlay'
import FullLoading from './components/FullLoading'
import PgPay from './pages/PgPay'
import DownloadApp from './components/DownloadApp'
import ChangePwdTips from './components/ChangePwdTips'

//消息通知
import PgMessageList from './pages/PgMessageList'
import PgEnrollList from './pages/PgEnrollList'
import ReviewNoticeList from './Message/ReviewNoticeList'
import AnswerNoticeList from './Message/AnswerNoticeList'
import CommentNoticeList from './Message/CommentNoticeList'
import AdoptNoticeList from './Message/AdoptNoticeList'
import FocusNoticeList from './Message/FocusNoticeList'
import EnrollNoticeList from './Message/EnrollNoticeList'
import OfflineChangeNoticeListTina from './Message/OfflineChangeNoticeListTina'
import OfflineRemindNoticeList from './Message/OfflineRemindNoticeList'
import InviteNoticeList from './Message/InviteNoticeList'
import SystemNotification from './Message/SystemNotification'
import EnterpriseAnnouncement from './Message/EnterpriseAnnouncement'
import NoteDetails from './Message/NoteDetails'
import AnnouncementDetails from './Message/AnnouncementDetails'
import TaskDetails from './Message/TaskDetails'


import PgBindWeixinFromWeb from './pages/PgBindWeixinFromWeb'

import AccountManage from './AccountManage/AccountManage'
import ChangePwd from './AccountManage/ChangePwd'
import SafetyVerification from './AccountManage/SafetyVerification'

import SetNewPwd from './AccountManage/SetNewPwd'
import Register from './AccountManage/Register'
import RegisterSetPD from './AccountManage/RegisterSetPD'
import SetPassword from './AccountManage/SetPassword'
import BindPhoneNumber from './AccountManage/BindPhoneNumber'
import InputPhoneNumber from './AccountManage/InputPhoneNumber'
import InvitationCode from './AccountManage/InvitationCode'
import UserInvitedCode from './AccountManage/UserInvitedCode'
import BolueInvitationCode from './AccountManage/BolueInvitationCode'
import ShowInvitedCode from './AccountManage/ShowInvitedCode'
import PgCopyCode from './AccountManage/PgCopyCode'


import AccountLogin from './AccountManage/AccountLogin'
import CompleteInfo from './AccountManage/CompleteInfo'
import BindAccount from './AccountManage/BindAccount'

import UpdateBindMobile from './AccountManage/UpdateBindMobile'
import FindPassword from './AccountManage/FindPassword'
import PgLiveVideo from './pages/PgLiveVideo'


import Qa from './QA/Qa'
import TopicCenter from './QA/TopicCenter'
import TopicDetail from './QA/TopicDetail'
import TeacherCenter from './QA/TeacherCenter'
import InviteTeacher from './QA/InviteTeacher'
import QaListFilter from './QA/QaListFilter'
import QaDetail from './QA/QaDetail'
import BelongsToTopic from './QA/BelongsToTopic'
import AnswerDetail from './QA/AnswerDetail'
import QuesLabelSelection from './QA/QuesLabelSelection'
import AnswerQuestion from './QA/AnswerQuestion'
import AskQuestion from './QA/AskQuestion'
import MyPersonalized from './QA/MyPersonalized' //我的个性化推荐
import PgAnserByPhone from './QA/PgAnserByPhone'

import PgChooseCity from './pages/PgChooseCity'
import PgofflineCheckin from './pages/PgofflineCheckin'


import LecturerHomePage from './PgCenter/LecturerHomePage'
import PersonalPgHome from './PgCenter/PersonalPgHome'
import MemberPgHome from './PgCenter/MemberPgHome'
import LectureQa from './PgCenter/LectureQa'
import CoursePlan from './PgCenter/CoursePlan'
import ChoiceCourse from './PgCenter/ChoiceCourse'
import CoursePlanDetail from './PgCenter/CoursePlanDetail'
import Task from './PgCenter/taskList' //本来导入的是Task 但是跟后台返回的URL 不符合 所以改成新的列表
import TaskDetail from './PgCenter/TaskDetail'
import Participants from './PgCenter/Participants'
import Coupons from './PgCenter/Coupons'

import PgConfirmenrollment from './pages/PgConfirmenrollment'
import PgOfflineAddEnroll from './pages/PgOfflineAddEnroll'

import QaList from './PgCenter/QaList'
import MyQa from './PgCenter/MyQa'
import MyAttention from './PgCenter/MyAttention'

import PgPersonEnroll from './pages/PgPersonEnroll'

import SetDate from './PgCenter/SetDate'
import PgtestPaper from './pages/PgtestPaper'
import PgtestPaperResult from './pages/PgtestPaperResult'
import PgTaskPaper from './pages/PgTaskPaper'
import PgNoMessage from './pages/PgNoMessage'
import PgECharts from './EMP/PgECharts'
import bolueWeeklyReport from './EMP/bolueWeeklyReport'
import SearchResultOnline from './components/SearchResultOnline'

import PgError from './pages/PgError'
import PgOffLlineEnrollDetail from './pages/PgOffLlineEnrollDetail'
import PgOfflineJoinDetail from './pages/PgOfflineJoinDetail'


import PendingReview from './Review/PendingReview'
import PendingReviewDetail from './Review/PendingReviewDetail'
import ReviewDetail from './Review/ReviewDetail'
import offlineToExamine from './offlineExamine/offlineToExamine'
import offlineToExamineDetail from './offlineExamine/offlineToExamineDetail'
import offlineHistoryToExamineDetail from './offlineExamine/offlineHistoryToExamineDetail'
import AppActivationTask from './components/appActivationTask'

import newbieTaskIndex from './NewbieTask/newbieTaskIndex'
import taskList from './PgCenter/taskList'
import chooseTopic from './NewbieTask/chooseTopic'
import perfectData from './NewbieTask/perfectData'
import bindPhone from './NewbieTask/bindPhoneNumber'
import bindEmail from './NewbieTask/bindEmail'
import bindWx from './NewbieTask/bindWx'
import focusOnWX from './NewbieTask/focusOnWX'
import vipPerfectInfo from './NewbieTask/vipPerfectInfo'
import IntegralIntroduction from './NewbieTask/IntegralIntroduction'
import PointsMall from './NewbieTask/PointsMall'
import VipCouponsDetail from './NewbieTask/VipCouponsDetail'
import ExchangeRecords from './NewbieTask/ExchangeRecords'
import Pointsdetails from './NewbieTask/Pointsdetails'

import PendingReviewAlert from './components/PendingReviewAlert'
import QRCodeSignIn from './components/QRCodeSignIn'
import serviceProtocol from './PgCenter/serviceProtocol'
import RegisterInvitationCode from './AccountManage/RegisterInvitationCode'
import PgOfflineJoinCodeDetail from './pages/PgOfflineJoinCodeDetail'
import PgresourceShare from './pages/PgresourceShare'
import GetKnowledgeCard from './pages/GetKnowledgeCard'
import AttentionPlease from './components/AttentionPlease'

var urlll = document.location.href; // 获取当前url链接
var ttt = urlll.split('activity')[1]
var addressComponents //定位
var urlquery = dm.getCurrentUrlQuery();
global.specialCode = urlquery.specialCode || '';
global.wailian = urlquery.wailian || '';
global.renderFromApp = urlquery.renderFromApp || '';
var ts_sw_last = localStorage.getItem("ts_sw_last") //记录wailian设置时长
if (!ts_sw_last || Date.now() - ts_sw_last > 5 * 60 * 1000) {
  localStorage.setItem("specialCode", specialCode);
  localStorage.setItem("wailian", wailian);
  localStorage.setItem("ts_sw_last", Date.now());
}
// 人机交互实例化：当第三方服务出错时，result为false；接口非正常错误返回
global.checkVaptCha = function (callback) {
  fetch(dm.getUrl_api(`/v2/getOutsideServiceStatus`, { scd: 'ssyz' }), {
    method: 'GET'
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      if (json.result) {
        vaptcha({
          vid: '5b7d16a1fc650e163c72b1c2', // 验证单元id
          type: 'invisible', // 显示类型 点击式
          // aiAnimation:false
        }).then((vaptchaObj) => {
          vaptchaObj.validate();
          vaptchaObj.listen('pass', () => {
            callback && callback(vaptchaObj.getToken())
          })
        })
      } else {
        callback && callback(null)
      }
    }).catch((ex) => {
      // alert("网络连接出错了，请稍候重试");
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
};
global.backNotload = {
  list: []
} //定义返回状态时的对象
global.backNotloadIndex = '';
global.backNotloadTop = 0
global.backNotloadLabel = []
global.AddLearnRecordLeave = () => { }

global.IsActivity = false
global.offlineUsers = [];//线下课主持卡人报名存储选中用户状态
global.__rootDir = process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'dev' ? '' : '/' + process.env.NODE_ENV;
var userAgent = window.navigator.userAgent.toLowerCase();
if (__DEBUG__) console.log('userAgent', userAgent);
// if (__DEBUG__) alert(userAgent)
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
  jumpToPC(window.location)
}
global.isWeiXin = userAgent.indexOf('micromessenger') > -1;//为了测试先注释掉
// global.isWeiXin = userAgent.indexOf('micromessenger') > -1 ? false : true;
global.isApple = userAgent.indexOf('iphone') > -1;
//##Main Entry
global.isReload = ''
global.messageRedPoint = false
global.isCityReaold = false
global.isReservation = false;
global.completeName = ''
global.completeFlag = false
global.inputCompany = ''
global.companyFlag = false
global.backFocuscompanyUserList = []
global.NextCatalogList = []

var urlll = document.location.href; // 获取当前url链接
var ttt = urlll.split('activity')[1]
var CodeDetail = urlll.split('PgOfflineJoinCodeDetail')[1]
var service = urlll.split('about')[1]
var reShare = urlll.split('resourceShare')[1]
var huawei
var Integral = urlll.split('Integral')[1]

function checkbrowser() {
  var sUserAgent = navigator.userAgent;
  var sUsername = navigator.appName;
  //parseFloat 运行时逐个读取字符串中的字符，当他发现第一个非数字符是就停止
  var fAppVersion = parseFloat(navigator.appVersion);
  var browser = new Array();
  huawei = sUserAgent.indexOf("HUAWEI") > -1
  var isOpera = sUserAgent.indexOf("Opera") > -1;
  if (isOpera) {
    //首先检测Opera是否进行了伪装
    var version;
    if (navigator.appName == 'Opera') {
      version = fAppVersion; //如果没有进行伪装，则直接后去版本号
    } else {
      var reOperaVersion = /Opera (\d+\.\d+)/;
      reOperaVersion.exec(sUserAgent); //使用正则表达式的test方法测试并将版本号保存在RegExp.$1中
      version = parseFloat(RegExp.$1);
    }
    browser[0] = "Opera";
    browser[1] = version;
  }
  // IE
  var isIE = /(msie\s|trident.*rv:)([\w.]+)/i.test(sUserAgent) && !isOpera; //!isOpera 避免是由Opera伪装成的IE
  // var isIE = !!window.ActiveXObject;
  if (isIE) {
    var reIE = /MSIE (\d+\.\d+);/;
    var hReIE = /rv\:(\d+\.\d+)/;
    var versions = reIE.exec(sUserAgent) || hReIE.exec(sUserAgent);
    var version = parseFloat(versions[1]);
    browser[0] = "Internet Explorer";
    browser[1] = version;
  }
  //Chrome
  var isChrome = sUserAgent.indexOf("Chrome") > -1;
  if (isChrome) {
    var reChorme = /Chrome\/(\d+\.\d+)/;
    reChorme.exec(sUserAgent);
    var version = parseFloat(RegExp.$1);
    browser[0] = "Chrome";
    browser[1] = version;
  }
  //Safari
  //排除Chrome信息，因为在Chrome的user-agent字符串中会出现Konqueror/Safari的关键字
  var isKHTML = (sUserAgent.indexOf("KHTML") > -1 || sUserAgent.indexOf("Konqueror") > -1 || sUserAgent.indexOf("AppleWebKit") > -1) && !isChrome;
  if (isKHTML) { //判断是否基于KHTML，如果时的话在继续判断属于何种KHTML浏览器
    var isSafari1 = sUserAgent.indexOf("AppleWebKit") > -1;
    var isKonq = sUserAgent.indexOf("Konqueror") > -1;
    var version = '';
    if (isSafari1) {
      var reAppleWebKit = /AppleWebKit\/(\d+\.\d+)/;
      reAppleWebKit.exec(sUserAgent);
      version = parseFloat(RegExp.$1);
    } else if (isKonq) {
      var reKong = /Konqueror\/(\d+\.\d+)/;
      reKong.exec(sUserAgent);
      version = parseFloat(RegExp.$1);
    }
    browser[0] = "Safari";
    browser[1] = version;
  }
  //firefox
  var isMoz = sUserAgent.indexOf("Gecko") > -1 && !isChrome && !isKHTML && !isIE; //排除Chrome 及Konqueror /Safari的伪装
  if (isMoz) {
    var reMoz = /Firefox\/(\d+\.\d+)/;
    reMoz.exec(sUserAgent);
    var version = parseFloat(RegExp.$1);
    browser[0] = "Firefox";
    browser[1] = version;
  }
  return browser;
}


class PgIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMaskPg: false,
      authenticated: false,
      nonceIframe: '',
      GuidePage: false,
    };
  }
  initData() {
    // makeSureCurrentUrlSaveForWeixinShare()
    Dispatcher.dispatch({
      actionType: 'loginTest'
    })
  }
  _handleloginTestDone(re) {
    this.setState({
      authenticated: true
    });
  }
  _handleREQUEST_START(re) {
    this.setState({
      isMaskPg: true
    });
  }
  _handleREQUEST_END(re) {
    this.setState({
      isMaskPg: false
    });
  }
  _handleSET_TITLE(title) {
    // console.log('_handleSET_TITLE',title);
    document.title = title;
    if (isApple) {//如果是在IOS情况下 进行以下操作
      // alert('title')
      // const iframe = document.createElement('iframe');
      // iframe.src = dm.getUrl_img('/img/v2/icons/logo.png')
      // const listener = () => {
      //     setTimeout(() => {
      //         iframe.removeEventListener('load', listener);
      //         setTimeout(() => {
      //             document.body.removeChild(iframe);
      //         }, 0);
      //     }, 0);
      // }
      // iframe.addEventListener('load', listener);
      // document.body.appendChild(iframe);
    } else {
      // var $iframe = (<iframe key={'nonceIframe' + Date.now()} style={{display: 'none'}}></iframe>);
      // this.setState({
      //     nonceIframe: $iframe
      // });
    }
  }
  _handlegetSubSitesDone(re) {
    // console.log('_handlegetSubSitesDone',re);
    var result = re.result || []
    var baiduCity = addressComponents.city //获取百度返回的城市
    var baiduProvince = addressComponents.province //获取百度返回的省
    if (baiduCity.charAt(baiduCity.length - 1) == '市') {//判断如果百度返回的市后面有市则去掉
      baiduCity = baiduCity.substring(0, baiduCity.length - 1)
    }
    if (baiduCity.charAt(baiduCity.length - 1) == '站') {//判断如果百度返回的市后面有市则去掉
      baiduCity = baiduCity.substring(0, baiduCity.length - 1)
    }
    if (baiduProvince.charAt(baiduProvince.length - 1) == '省') {//判断百度返回的省后面有省则去掉
      baiduProvince = baiduProvince.substring(0, baiduProvince.length - 1)
    }
    if (baiduProvince.charAt(baiduProvince.length - 1) == '市') {//判断如果百度返回的市后面有市则去掉
      baiduProvince = baiduProvince.substring(0, baiduProvince.length - 1)
    }
    localStorage.setItem("dWTime", Date.now())
    for (var key of result) { //把接口中城市取出来循环对比
      var cities = key.cities || [] //定义需要匹配城市数组
      var province = key.province || '' //定义需要匹配的省
      var defaultCity = key.defaultCity || ''
      if (cities.length > 0) {//城市循环对比
        for (var city of cities) {
          if (city.charAt(city.length - 1) == '站') {//判断如果百度返回的市后面有市则去掉
            city = city.substring(0, city.length - 1)
          }
          if (city == baiduCity) {
            isCityReaold = true
            localStorage.setItem("addressName", key.name)
            // localStorage.setItem("cityProvince",province)
            localStorage.setItem("citydefaultCity", defaultCity)
            return //如果成功则return
          }
        }
      } else {//如果cities城市为空，则对比省
        if (province.charAt(province.length - 1) == '站') {//判断如果百度返回的市后面有市则去掉
          province = province.substring(0, province.length - 1)
        }
        if (province == baiduProvince) {
          isCityReaold = true
          localStorage.setItem("addressName", key.name)
          localStorage.setItem("citydefaultCity", defaultCity)
          return
        }
      }
    }
  }
  componentWillMount() {

    var checkbro = checkbrowser();
    if (!isWeiXin && !isApple) {
      if (CodeDetail || service || reShare || ttt || Integral) {//如果是参课二维码页面 法律协议 课程推荐页面就跳过

      } else if (huawei && checkbro[0] == 'Safari') {
        this.setState({
          GuidePage: true
        })
      }
      else if (checkbro.length < 1) {
        this.setState({
          GuidePage: true
        })
      }
    }


    var addressName = localStorage.getItem("addressName")
    var date1 = localStorage.getItem("dWTime")
    var date2 = Date.now();

    var cityNum = 0
    if (addressName === null || !isCityReaold) {
      if (ttt || (date2 - date1) < (60 * 60 * 1000 * 24)) { //判读如果当前页面为活动页面，则不去定位。
        return
      }
      !renderFromApp && setTimeout(function () {
        //百度地图API功能
        var map = new BMap.Map("allmap");
        var point = new BMap.Point(116.331398, 39.897445);
        map.centerAndZoom(point, 12);
        var geoc = new BMap.Geocoder();
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
          var pt = r.point
          geoc.getLocation(pt, function (rs) {
            var addComp = rs.addressComponents;
            var city = addComp.city
            addressComponents = addComp
            Dispatcher.dispatch({//发送请求获取定位城市
              actionType: 'getSubSites',
            })
            localStorage.setItem("headersCity", city || '')
            // console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
          });
        }, { enableHighAccuracy: true })
      }, 200);
    }
  }
  componentDidMount() {
    if (!renderFromApp) {
      localStorage.setItem("bolueClient", isWeiXin ? 'weixin' : 'wap');
    }
    this.e_REQUEST_START = EventCenter.on("REQUEST_START", this._handleREQUEST_START.bind(this));
    this.e_REQUEST_END = EventCenter.on("REQUEST_END", this._handleREQUEST_END.bind(this));
    this.e_loginTestDone = EventCenter.on("loginTestDone", this._handleloginTestDone.bind(this));
    this.e_SET_TITLE = EventCenter.on("SET_TITLE", this._handleSET_TITLE.bind(this));
    this._getgetSubSites = EventCenter.on('getSubSitesDone', this._handlegetSubSitesDone.bind(this))
    this.eWX_JS_CONFIGDone = EventCenter.on("WX_JS_CONFIGDone", this._handleWX_JS_CONFIGDone.bind(this));


    // fixWeUIInput();
    if (isWeiXin) {
      AuthStore.doAUTHENTICATE({
        url_cb: document.location,
        noAuthCB: this.initData.bind(this)
      });
    } else {
      this.setState({
        authenticated: true
      });
    }
  }
  // componentDidUpdate (prevProps) {
  // }
  componentWillUnmount() {
    this.e_REQUEST_START.remove()
    this.e_REQUEST_END.remove()
    this.e_loginTestDone.remove()
    this.e_SET_TITLE.remove()
    this._getgetSubSites.remove()
    this.eWX_JS_CONFIGDone.remove()
  }
  _handleWX_JS_CONFIGDone(re) {
  }

  render() {

    return (
      <div>
        {
          this.state.GuidePage ?
            <div>
              <GuidePage />
            </div>
            :
            <div>
              {!renderFromApp ? <DownloadApp /> : null}
              {!renderFromApp ? <QRCodeSignIn /> : null}
              {!renderFromApp ? <ChangePwdTips /> : null}
              {!renderFromApp ? <PendingReviewAlert /> : null}
              {!renderFromApp ? <AppActivationTask /> : null}
              {this.state.authenticated ?
                <Router>
                  <div>
                    <Route render={({ location }) => (
                      <CSSTransitionGroup
                        transitionName="AnimNavTrans"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                      >
                        <Route location={location} key={location.key}>
                          <Switch>
                            <Route exact path={`${__rootDir}/list/:type`} component={withRouter(PgLessonList)} />
                            <Route exact path={`${__rootDir}/lesson/online/:id`} component={withRouter(PgOnlineDetail)} />
                            <Route exact path={`${__rootDir}/lesson/live/:id`} component={withRouter(PgLiveDetail)} />
                            <Route exact path={`${__rootDir}/lesson/offline/:id`} component={withRouter(PgOfflineDetail)} />
                            <Route exact path={`${__rootDir}/price`} component={withRouter(PgPriceIntroduction)} />
                            <Route exact path={`${__rootDir}/teacher/:id`} component={withRouter(PgTeacherDetail)} />
                            <Route exact path={`${__rootDir}/commentList/:id`} component={withRouter(PgOnlineCommentList)} />
                            <Route exact path={`${__rootDir}/question`} component={withRouter(PgQuestion)} />
                            <Route exact path={`${__rootDir}/lessonQuestion/:type/:id`} component={withRouter(PgLessonQuestion)} />
                            <Route exact path={`${__rootDir}/comment/:id`} component={withRouter(PgOnlineComment)} />
                            <Route exact path={`${__rootDir}/exam/:id/:catalogId`} component={withRouter(PgExam)} />
                            <Route exact path={`${__rootDir}/enroll/:id`} component={withRouter(PgOfflineEnroll)} />
                            <Route exact path={`${__rootDir}/questionDetail/:id`} component={withRouter(PgQuestionDetail)} />
                            <Route exact path={`${__rootDir}/questionList`} component={withRouter(PgQuestionList)} />
                            <Route exact path={`${__rootDir}/answerDetail/:id`} component={withRouter(AnswerDetail)} />
                            <Route exact path={`${__rootDir}/addAnswer`} component={withRouter(PgAddAnswer)} />
                            <Route exact path={`${__rootDir}/addAnswerComment`} component={withRouter(PgAddAnswerComment)} />
                            <Route exact path={`${__rootDir}/teacher/lesson/list/:type`} component={withRouter(PgTeacherLessonList)} />
                            <Route exact path={`${__rootDir}/reserveDetail/:id`} component={withRouter(PgLiveReserve)} />
                            <Route exact path={`${__rootDir}/map`} component={withRouter(PgAdress)} />
                            <Route exact path={`${__rootDir}/examDetail/:id/:catalogId`} component={withRouter(PgExamResult)} />
                            <Route exact path={`${__rootDir}/home`} component={withRouter(PgHome)} />
                            <Route exact path={`${__rootDir}/useDiscount/:type/:id`} component={withRouter(PgUseDiscountForOnline)} />
                            <Route exact path={`${__rootDir}/chooseAccount`} component={withRouter(PgChooseAccount)} />
                            <Route exact path={`${__rootDir}/quickLogin`} component={withRouter(PgQuickLogin)} />
                            <Route exact path={`${__rootDir}/LoginAlert`} component={withRouter(LoginAlert)} />
                            <Route exact path={`${__rootDir}/PgLawLastest`} component={withRouter(PgLawLastest)} />
                            <Route exact path={`${__rootDir}/LoginAlert`} component={withRouter(LoginAlert)} />
                            <Route exact path={`${__rootDir}/FullLoading`} component={withRouter(FullLoading)} />
                            <Route exact path={`${__rootDir}/freeInvited`} component={withRouter(PgFreeInvited)} />
                            <Route exact path={`${__rootDir}/AccountManage`} component={withRouter(AccountManage)} />
                            <Route exact path={`${__rootDir}/ChangePwd`} component={withRouter(ChangePwd)} />
                            <Route exact path={`${__rootDir}/SafetyVerification`} component={withRouter(SafetyVerification)} />


                            <Route exact path={`${__rootDir}/SetNewPwd`} component={withRouter(SetNewPwd)} />
                            <Route exact path={`${__rootDir}/PhoneRegister`} component={withRouter(Register)} />
                            <Route exact path={`${__rootDir}/SetPassword`} component={withRouter(SetPassword)} />
                            <Route exact path={`${__rootDir}/RegisterSetPD`} component={withRouter(RegisterSetPD)} />
                            <Route exact path={`${__rootDir}/BindPhoneNumber`} component={withRouter(BindPhoneNumber)} />
                            <Route exact path={`${__rootDir}/InputPhoneNumber`} component={withRouter(InputPhoneNumber)} />

                            <Route exact path={`${__rootDir}/login`} component={withRouter(AccountLogin)} />
                            <Route exact path={`${__rootDir}/CompleteInfo`} component={withRouter(CompleteInfo)}></Route>
                            <Route exact path={`${__rootDir}/BindAccount`} component={withRouter(BindAccount)}></Route>

                            <Route exact path={`${__rootDir}/UpdateBindMobile`} component={withRouter(UpdateBindMobile)} />
                            <Route exact path={`${__rootDir}/FindPassword`} component={withRouter(FindPassword)} />

                            <Route exact path={`${__rootDir}/PgMyReserveDetail/:id`} component={withRouter(PgMyReserveDetail)} />
                            <Route exact path={`${__rootDir}/PgMyEnrollDetail/:id`} component={withRouter(PgMyEnrollDetail)} />
                            <Route exact path={`${__rootDir}/PgMyReserveEnrollList`} component={withRouter(PgMyReserveEnrollList)} />
                            <Route exact path={`${__rootDir}/PgLiveReserveEnrollList`} component={withRouter(PgLiveReserveEnrollList)} />
                            <Route exact path={`${__rootDir}/PgOfflineReserveEnrollList`} component={withRouter(PgOfflineReserveEnrollList)} />

                            <Route exact path={`${__rootDir}/PgEnrollPerson/:id`} component={withRouter(PgEnrollPerson)} />
                            <Route exact path={`${__rootDir}/PgLawDetail/:id`} component={withRouter(PgLawDetail)} />
                            <Route exact path={`${__rootDir}/PgLawSearch`} component={withRouter(PgLawSearch)} />

                            <Route exact path={`${__rootDir}/PgECharts`} component={withRouter(PgECharts)}></Route>

                            <Route exact path={`${__rootDir}/PgBindWeixinFromWeb`} component={withRouter(PgBindWeixinFromWeb)} />
                            <Route exact path={`${__rootDir}/nplogin`} component={withRouter(PgNoPassLogin)} />
                            <Route exact path={`${__rootDir}/findpass`} component={withRouter(PgFindPass)} />
                            <Route exact path={`${__rootDir}/register`} component={withRouter(PgRegister)} />
                            <Route exact path={`${__rootDir}/PgCompleteData`} component={withRouter(PgCompleteData)} />
                            <Route exact path={`${__rootDir}/PgCenter`} component={withRouter(PersonalCenter)} />
                            {/* <Route exact path={`${__rootDir}/PersonalCenter`} component={withRouter(PersonalCenter)} />*/}


                            <Route exact path={`${__rootDir}/PgCenterSet`} component={withRouter(PgCenterSet)} />
                            <Route exact path={`${__rootDir}/PgSetInfo`} component={withRouter(PgSetInfo)} />
                            <Route exact path={`${__rootDir}/PgSetNickname`} component={withRouter(PgSetNickname)} />
                            <Route exact path={`${__rootDir}/PgAdvice`} component={withRouter(PgAdvice)}></Route>
                            <Route exact path={`${__rootDir}/PgSetPassword`} component={withRouter(PgSetPassword)}></Route>
                            <Route exact path={`${__rootDir}/PgSelectAccount`} component={withRouter(PgSelectAccount)}></Route>
                            <Route exact path={`${__rootDir}/promptBox`} component={withRouter(promptBox)}></Route>
                            <Route exact path={`${__rootDir}/PgProductList`} component={withRouter(PgProductList)}></Route>
                            <Route exact path={`${__rootDir}/ProductDetail/:id`} component={withRouter(PgProductDetail)}></Route>
                            <Route exact path={`${__rootDir}/PgMyDiscount`} component={withRouter(PgMyDiscount)}></Route>
                            <Route exact path={`${__rootDir}/PgAddDiscount`} component={withRouter(PgAddDiscount)}></Route>
                            <Route exact path={`${__rootDir}/PgMyCollect`} component={withRouter(PgMyCollect)}></Route>
                            <Route exact path={`${__rootDir}/PgLearnRecord`} component={withRouter(PgLearnRecord)}></Route>
                            <Route exact path={`${__rootDir}/PgSearchResult`} component={withRouter(PgSearchResult)}></Route>
                            <Route exact path={`${__rootDir}/PgHomeIndex`} component={withRouter(PgHomeIndex)}></Route>
                            <Route exact path={`${__rootDir}/PgMyQuestion`} component={withRouter(PgMyQuestion)}></Route>
                            <Route exact path={`${__rootDir}/PgPositionList`} component={withRouter(PgPositionList)}></Route>
                            <Route exact path={`${__rootDir}/PgSetPhone`} component={withRouter(PgSetPhone)}></Route>
                            <Route exact path={`${__rootDir}/PgUpdatePhone`} component={withRouter(PgUpdatePhone)}></Route>
                            <Route exact path={`${__rootDir}/PgSetEmail`} component={withRouter(PgSetEmail)}></Route>
                            <Route exact path={`${__rootDir}/PgSetPosition`} component={withRouter(PgSetPosition)}></Route>
                            <Route exact path={`${__rootDir}/PgMyReserveEnroll`} component={withRouter(PgMyReserveEnroll)}></Route>
                            <Route exact path={`${__rootDir}/PgPay`} component={withRouter(PgPay)}></Route>
                            <Route exact path={`${__rootDir}/Qa`} component={withRouter(Qa)} />
                            <Route exact path={`${__rootDir}/TopicCenter`} component={withRouter(TopicCenter)}></Route>
                            <Route exact path={`${__rootDir}/TopicDetail/:id`} component={withRouter(TopicDetail)}></Route>
                            <Route exact path={`${__rootDir}/TeacherCenter`} component={withRouter(TeacherCenter)}></Route>
                            <Route exact path={`${__rootDir}/InviteTeacher`} component={withRouter(InviteTeacher)}></Route>
                            <Route exact path={`${__rootDir}/QaListFilter`} component={withRouter(QaListFilter)}></Route>
                            <Route exact path={`${__rootDir}/QaDetail/:id`} component={withRouter(QaDetail)}></Route>
                            <Route exact path={`${__rootDir}/BelongsToTopic`} component={withRouter(BelongsToTopic)}></Route>
                            <Route exact path={`${__rootDir}/QuesLabelSelection`} component={withRouter(QuesLabelSelection)}></Route>
                            <Route exact path={`${__rootDir}/AnswerQuestion`} component={withRouter(AnswerQuestion)}></Route>
                            <Route exact path={`${__rootDir}/AskQuestion`} component={withRouter(AskQuestion)}></Route>

                            <Route exact path={`${__rootDir}/MyPersonalized`} component={withRouter(MyPersonalized)}> </Route>


                            <Route exact path={`${__rootDir}/LecturerHomePage/:id`} component={withRouter(LecturerHomePage)}></Route>
                            <Route exact path={`${__rootDir}/MemberPgHome`} component={withRouter(MemberPgHome)}></Route>
                            <Route exact path={`${__rootDir}/LectureQa`} component={withRouter(LectureQa)}></Route>
                            <Route exact path={`${__rootDir}/CoursePlan`} component={withRouter(CoursePlan)}></Route>
                            <Route exact path={`${__rootDir}/CoursePlanDetail/:id`} component={withRouter(CoursePlanDetail)}></Route>
                            <Route exact path={`${__rootDir}/Task`} component={withRouter(Task)}></Route>
                            <Route exact path={`${__rootDir}/TaskDetail/:id`} component={withRouter(TaskDetail)}></Route>
                            <Route exact path={`${__rootDir}/Participants`} component={withRouter(Participants)}></Route>
                            <Route exact path={`${__rootDir}/Coupons`} component={withRouter(Coupons)}></Route>
                            <Route exact path={`${__rootDir}/QaList`} component={withRouter(QaList)}></Route>
                            <Route exact path={`${__rootDir}/MyQa`} component={withRouter(MyQa)}></Route>
                            <Route exact path={`${__rootDir}/MyAttention`} component={withRouter(MyAttention)}></Route>
                            <Route exact path={`${__rootDir}/SetDate`} component={withRouter(SetDate)}></Route>
                            <Route exact path={`${__rootDir}/PgMessageList`} component={withRouter(PgMessageList)}></Route>
                            <Route exact path={`${__rootDir}/PgEnrollList`} component={withRouter(PgEnrollList)}></Route>
                            <Route exact path={`${__rootDir}/PgLiveVideo/:id`} component={withRouter(PgLiveVideo)}></Route>


                            <Route exact path={`${__rootDir}/PgChooseCity`} component={withRouter(PgChooseCity)}></Route>

                            {/*<Route exact path={`${__rootDir}/PgOfflineNewEnroll`} component={withRouter(PgOfflineNewEnroll)}></Route>*/}

                            <Route exact path={`${__rootDir}/PgOfflineEnrollManyPeople`} component={withRouter(PgOfflineEnrollManyPeople)}></Route>
                            <Route exact path={`${__rootDir}/NewEnrollManyPeople`} component={withRouter(NewEnrollManyPeople)}></Route>
                            <Route exact path={`${__rootDir}/PgConfirmenrollment`} component={withRouter(PgConfirmenrollment)}></Route>
                            <Route exact path={`${__rootDir}/PgOfflineAddEnroll`} component={withRouter(PgOfflineAddEnroll)}></Route>
                            <Route exact path={`${__rootDir}/PgPersonEnroll`} component={withRouter(PgPersonEnroll)}></Route>
                            <Route exact path={`${__rootDir}/PgtestPaper`} component={withRouter(PgtestPaper)}></Route>
                            <Route exact path={`${__rootDir}/PgtestPaperResult/:id`} component={withRouter(PgtestPaperResult)}></Route>
                            <Route exact path={`${__rootDir}/offlineCheckin`} component={withRouter(PgofflineCheckin)}></Route>
                            <Route exact path={`${__rootDir}/PgTaskPaper`} component={withRouter(PgTaskPaper)}></Route>

                            <Route exact path={`${__rootDir}/ChoiceCourse`} component={withRouter(ChoiceCourse)}></Route>
                            <Route exact path={`${__rootDir}/PersonalPgHome/:id`} component={withRouter(PersonalPgHome)}></Route>


                            <Route exact path={`${__rootDir}/AnswerNoticeList`} component={withRouter(AnswerNoticeList)}></Route>
                            <Route exact path={`${__rootDir}/CommentNoticeList`} component={withRouter(CommentNoticeList)}></Route>
                            <Route exact path={`${__rootDir}/AdoptNoticeList`} component={withRouter(AdoptNoticeList)}></Route>
                            <Route exact path={`${__rootDir}/ReviewNoticeList`} component={withRouter(ReviewNoticeList)}></Route>
                            <Route exact path={`${__rootDir}/FocusNoticeList`} component={withRouter(FocusNoticeList)}></Route>
                            <Route exact path={`${__rootDir}/EnrollNoticeList`} component={withRouter(EnrollNoticeList)}></Route>
                            <Route exact path={`${__rootDir}/OfflineRemindNoticeList`} component={withRouter(OfflineRemindNoticeList)}></Route>
                            <Route exact path={`${__rootDir}/OfflineChangeNoticeList`} component={withRouter(OfflineChangeNoticeListTina)}></Route>
                            <Route exact path={`${__rootDir}/InviteNoticeList`} component={withRouter(InviteNoticeList)}></Route>
                            <Route exact path={`${__rootDir}/SystemNotification`} component={withRouter(SystemNotification)}></Route>
                            <Route exact path={`${__rootDir}/EnterpriseAnnouncement`} component={withRouter(EnterpriseAnnouncement)}></Route>
                            <Route exact path={`${__rootDir}/NoteDetails/:id`} component={withRouter(NoteDetails)}></Route>
                            <Route exact path={`${__rootDir}/AnnouncementDetails/:id`} component={withRouter(AnnouncementDetails)}></Route>
                            <Route exact path={`${__rootDir}/TaskDetails/:id`} component={withRouter(TaskDetails)}></Route>

                            <Route exact path={`${__rootDir}/PendingReview`} component={withRouter(PendingReview)}></Route>
                            <Route exact path={`${__rootDir}/PendingReviewDetail/:id`} component={withRouter(PendingReviewDetail)}></Route>
                            <Route exact path={`${__rootDir}/ReviewDetail/:id`} component={withRouter(ReviewDetail)}></Route>
                            <Route exact path={`${__rootDir}/PgError`} component={withRouter(PgError)}></Route>
                            <Route exact path={`${__rootDir}/PgOffLlineEnrollDetail/:id`} component={withRouter(PgOffLlineEnrollDetail)}></Route>
                            <Route exact path={`${__rootDir}/PgOffLlineMainHolderEnrollDetail/:_id`} component={withRouter(PgOffLlineEnrollDetail)}></Route>
                            <Route exact path={`${__rootDir}/PgOfflineJoinDetail/:id/:checkcode`} component={withRouter(PgOfflineJoinCodeDetail)}></Route>
                            <Route exact path={`${__rootDir}/offlineToExamine`} component={withRouter(offlineToExamine)}></Route>
                            <Route exact path={`${__rootDir}/offlineToExamineDetail/:id`} component={withRouter(offlineToExamineDetail)}></Route>
                            <Route exact path={`${__rootDir}/offlineHistoryToExamineDetail/:id`} component={withRouter(offlineHistoryToExamineDetail)}></Route>
                            <Route exact path={`${__rootDir}/newbieTaskIndex`} component={withRouter(newbieTaskIndex)}></Route>
                            <Route exact path={`${__rootDir}/taskList`} component={withRouter(taskList)}></Route>
                            <Route exact path={`${__rootDir}/chooseTopic`} component={withRouter(chooseTopic)}></Route>
                            <Route exact path={`${__rootDir}/perfectData`} component={withRouter(perfectData)}></Route>
                            <Route exact path={`${__rootDir}/bindPhone`} component={withRouter(bindPhone)}></Route>
                            <Route exact path={`${__rootDir}/bindEmail`} component={withRouter(bindEmail)}></Route>
                            <Route exact path={`${__rootDir}/bindWx`} component={withRouter(bindWx)}></Route>
                            <Route exact path={`${__rootDir}/focusOnWX`} component={withRouter(focusOnWX)}></Route>
                            <Route exact path={`${__rootDir}/vipPerfectInfo`} component={withRouter(vipPerfectInfo)}></Route>
                            <Route exact path={`${__rootDir}/IntegralIntroduction`} component={withRouter(IntegralIntroduction)}></Route>
                            <Route exact path={`${__rootDir}/PointsMall`} component={withRouter(PointsMall)}></Route>
                            <Route exact path={`${__rootDir}/VipCouponsDetail/:id`} component={withRouter(VipCouponsDetail)}></Route>
                            <Route exact path={`${__rootDir}/ExchangeRecords`} component={withRouter(ExchangeRecords)}></Route>
                            <Route exact path={`${__rootDir}/Pointsdetails`} component={withRouter(Pointsdetails)}></Route>


                            <Route exact path={`${__rootDir}/InvitationCode`} component={withRouter(InvitationCode)}></Route>
                            <Route exact path={`${__rootDir}/about/service-protocol`} component={withRouter(serviceProtocol)}></Route>
                            <Route exact path={`${__rootDir}/RegisterInvitationCode`} component={withRouter(RegisterInvitationCode)}></Route>
                            <Route exact path={`${__rootDir}/UserInvitedCode`} component={withRouter(UserInvitedCode)}></Route>
                            <Route exact path={`${__rootDir}/BolueInvitationCode`} component={withRouter(BolueInvitationCode)}></Route>
                            <Route exact path={`${__rootDir}/ShowInvitedCode`} component={withRouter(ShowInvitedCode)}></Route>
                            <Route exact path={`${__rootDir}/PgCopyCode`} component={withRouter(PgCopyCode)}></Route>
                            <Route exact path={`${__rootDir}/PgOfflineJoinCodeDetail/:checkcode`} component={withRouter(PgOfflineJoinCodeDetail)}></Route>
                            <Route exact path={`${__rootDir}/resourceShare/:id`} component={withRouter(PgresourceShare)}></Route>
                            <Route exact path={`${__rootDir}/PgAnserByPhone/:id`} component={withRouter(PgAnserByPhone)}></Route>
                            <Route exact path={`${__rootDir}/AttentionPlease`} component={withRouter(AttentionPlease)}></Route>


                            <Route exact path={`${__rootDir}/`} component={withRouter(PgHomeIndex)}></Route>
                            <Route exact path={`${__rootDir}/GetKnowledgeCard/:id`} component={withRouter(GetKnowledgeCard)}></Route>



                            <Route component={withRouter(PgError)} />
                          </Switch>
                        </Route>
                      </CSSTransitionGroup>
                    )} />
                    <div id="allmap"></div>
                  </div>
                </Router>
                : ''}
              {this.state.isMaskPg ? <PLoadingMask /> : ''}
            </div>
        }
      </div>
    )
  }
}
global.setParametersForApp = (openid, code, bolueClient, bolueVer, UUIDIMEI, devToken, params) => {
  // localStorage.clear();
  localStorage.setItem("credentials.code", code);
  localStorage.setItem("credentials.openid", openid);
  localStorage.setItem("bolueClient", bolueClient);
  localStorage.setItem("boluever", bolueVer);
  localStorage.setItem("UUIDIMEI", UUIDIMEI);
  localStorage.setItem("devToken", devToken);
  try{
    if (params){
        params = JSON.parse(params);
        var keys = Object.keys(params);
        // document.getElementById('markTest').innerHTML  = params
        for(var i = 0; i < keys.length; i++){
          localStorage.removeItem(keys[i]);
          localStorage.setItem(keys[i], params[keys[i]])
        }
    }
  }catch(e){
  }
  render(<PgIndex />, document.getElementById('react'));
}
if (!renderFromApp) {
  render(<PgIndex />, document.getElementById('react'));
  localStorage.removeItem("navigationDisplay")
} else {
  // 2019年8月15日15:32:18 新增：学习官报名页面需要给IOS和微信共用，故做此改造
  // 如果是APP调用显示，则需要显示公共头部（返回按钮和title）
  localStorage.setItem("navigationDisplay", true)
  // APP 会将登录信息放在header中带过来，故用headersDatas接收，然后存在localStorage
  if (headersDatas) {
    setParametersForApp(headersDatas.openid, headersDatas.code, headersDatas.bolueclient, headersDatas.boluever, "", "", headersDatas.params)
  }
}
