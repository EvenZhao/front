/* flow */
'use strict';
// import "babel-polyfill";
import * as Loadable from 'react-loadable';
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
import appRouter from './routerConfig';
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
                            {
                              appRouter.map(item => <Route
                                exact
                                path={item.path}
                                component={withRouter(item.component)}
                                key={item.path}
                              />)
                            }
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
