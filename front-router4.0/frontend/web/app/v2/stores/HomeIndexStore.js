import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import { dm } from '../util/DmURL'

export function doindex(action) {//我的搜索
  fetch(dm.getUrl_api(`/v2/index`, { cityName: action.cityName }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      if (json) {//如果有返回值 返回user信息
        EventCenter.emit('indexDone', json);
      }
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      EventCenter.emit('IndexTimeout');
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

export function doindexIcon(action) {//我的搜索

  fetch(dm.getUrl_api(`/v2/indexIcon`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      if (json) {//如果有返回值 返回user信息
        EventCenter.emit('indexIconDone', json);
      }
    }).catch((ex) => {
      // EventCenter.emit('IndexTimeout');
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

export function doTopic(action) {//我的搜索
  fetch(dm.getUrl_api(`/v2/topic`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {

      if (json) {//如果有返回值 返回user信息
        EventCenter.emit('topicDone', json);
      }
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      EventCenter.emit('IndexTimeout');
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

export function dogetSubSites(action) {//我的搜索
  fetch(dm.getUrl_api(`/v2/getSubSites`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      if (json) {//如果有返回值 返回user信息
        if (action.choose) {
          EventCenter.emit('getSubSitesChooseDone', json);
        } else {
          EventCenter.emit('getSubSitesDone', json);
        }
      }
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      EventCenter.emit('IndexTimeout');
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

function makeNonceStr() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


function readyWXMenu() {
  if (wx) {
    wx.hideAllNonBaseMenuItem();
    wx.showMenuItems({
      menuList: [
        'menuItem:profile',
        'menuItem:favorite',
        'menuItem:share:appMessage',
        'menuItem:share:timeline',
        'menuItem:openWithSafari',
        'menuItem:copyUrl',
      ] // 要显示的菜单项，所有menu项见附录3
    });
  }
}

function getWXShareinfo(action) {
  global.getWXShareInfo = () => { //定义APP需要的全局函数
    var webShareAppMessage = action.onMenuShareAppMessage || {}
    var webShareInfo = {}
    if (webShareAppMessage) {
      return webShareInfo = {
        title: webShareAppMessage.title,
        description: webShareAppMessage.desc,
        img: webShareAppMessage.imgUrl,
      }
    }
  }
}

export function doWX_JS_CONFIG(action) {//我的搜索
  var noncestr = makeNonceStr();
  var lc = window.location.href.split('#')[0];
  /* 
  2019年9月6日17:25:45更改后发现不用这样写，IOS打开公众号也OK的，故放在这里，代表曾经爱过。。。。爱过
  let u = window.navigator.userAgent;
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  //安卓需要使用当前URL进行微信API注册（即当场调用location.href.split('#')[0]）
  //iOS需要使用进入页面的初始URL进行注册，（即在任何pushstate发生前，调用location.href.split('#')[0]）
  if (isIOS) {
    lc = firstEnterUrl;
  } */
  var timestamp = Date.parse(new Date()) / 1000 + '';
  if (!isWeiXin) {
    getWXShareinfo(action)
    EventCenter.emit('WX_JS_CONFIGDone', true);
    // return
  }
  // alert(lc)
  fetch(dm.getUrl_api(`/v2/wxsign`, {
    url: lc,
    nonceStr: noncestr,
    timestamp: timestamp
  }), {
      method: 'GET',
      // headers: assign(dm.getHttpHeadMyAuth(), {}),
    })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      if (json) {//如果有返回值 返回user信息
        if (json.err) {
          console.log('doWX_JS_CONFIG', json.err);
          return;
        }
        if (json && json.result) {
          if (wx) {
            wx.ready(function () {
              readyWXMenu();
              if (action && action.onMenuShareAppMessage) {
                var opts = action.onMenuShareAppMessage;
                opts.link = lc
                wx.onMenuShareAppMessage(opts);
                wx.onMenuShareTimeline(opts);
              }
            });
            wx.error(function (res) {
              if (__DEBUG__) {
                // alert(JSON.stringify(res));
                console.log(res)
              }
            });
            wx.config({
              debug: false,
              appId: dm.getWXAppId(),
              nonceStr: noncestr,
              timestamp: timestamp,
              signature: json.result.signature,
              jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'openLocation',
                'getLocation'
              ]
            });
          }
          EventCenter.emit('WX_JS_CONFIGDone', true);
        }
      }
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) {
        // alert(JSON.stringify(ex));
        console.log('Fetch failed', ex);
      }
    });
}

function readyWXMap() {
  wx && wx.getLocation({
    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    success: function (res) {
      console.log(res.accuracy)
      var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
      var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
      var speed = res.speed; // 速度，以米/每秒计
      var accuracy = res.accuracy; // 位置精度
      EventCenter.emit("GetMap", res)
    }
  });
  wx.error(function (res) {
    if (__DEBUG__) console.log('err', res)
  });
}
export function doWX_MAP_CONFIG(action) {//线下课地址
  readyWXMap()
}


export const HomeIndexStore = {
  dispatcherIndex: Dispatcher.register((action) => {
    if (action.actionType) {
      if (eval("typeof " + 'do' + action.actionType) === 'function') {
        eval('do' + action.actionType).call(null, action);
      }
    }
    return true; // No errors. Needed by promise in Dispatcher.
  })
}
