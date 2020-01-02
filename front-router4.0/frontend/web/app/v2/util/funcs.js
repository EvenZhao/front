import 'whatwg-fetch'
import EventCenter from '../EventCenter'
import React from 'react'
import { render } from 'react-dom'
import { dm } from './DmURL'
import URL from 'url'
import querystring from 'querystring'
import Fingerprint2 from 'fingerprintjs2'

global.checkHTTPStatus = (response) => {
  const devToken = response.headers.get('devToken')
  var mainHolderActivateHint = response.headers.get('mainHolderActivateHint')
  if (mainHolderActivateHint == 'true') {
    EventCenter.emit('mainHolderActivateHintDone', mainHolderActivateHint);
  }

  // var review = response.headers.get('AuditRemindDone')
  // if (review == 'true') {
  //  EventCenter.emit('AuditRemindDone', review);
  // }

  if (devToken) {
    localStorage.setItem("devToken", devToken)
  }
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    switch (response.status) {
      case 403: EventCenter.emit("SC403"); break;
      case 401: EventCenter.emit("SC401"); break;
    }
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
global.parseJSON = (response) => {
  return response.json()
}
global.parseHTML = (response) => {
  return response.text()
}
global.fixWeUIInput = () => {
  // .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
  // 相关 issue: https://github.com/weui/weui/issues/15
  // 解决方法:
  // 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
  // 1. 参考 http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
  //    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
  if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function () {
      if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
        window.setTimeout(function () {
          document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
      }
    })
  }
}
global.setPageTitle = (title) => {
  document.title = title;
  var $iframe = (<iframe key={'nonceIframe' + Date.now()} style={{ display: 'none' }} src="/img/favicon/favicon.ico"></iframe>);
  // this.setState({
  //  nonceIframe: $iframe
  // });
  render($iframe, document.getElementById('nonceIframe'));
}

global.makeUrlWithFixedParams = (ori_url) => {
  let url = URL.parse(ori_url, true);
  let q = querystring.parse(url.search.replace('?', '')) || {}
  url.search = '?' + querystring.stringify(Object.assign({}, q, {
    yyyTS: Date.now()
  }));
  return URL.format(url);
}

global.bolueVer = '2.4.50'
localStorage.setItem("bolueVer", bolueVer)
const OriFetch = fetch
global.fetch = async function (url, options) {
  var addressName = localStorage.getItem("addressName")
  var headersCity = localStorage.getItem("headersCity")
  var bolueClient = localStorage.getItem("bolueClient")
  var wailian = localStorage.getItem("wailian") || '';
  var UUIDIMEI = localStorage.getItem("UUIDIMEI")
  var devToken = localStorage.getItem("devToken") || ''
  if (!UUIDIMEI) {
    UUIDIMEI = await new Promise((resolve, reject) => {
      new Fingerprint2().get((result, components) => {
        resolve('web_' + result)
      })
    })
    localStorage.setItem("UUIDIMEI", UUIDIMEI)
  }
  if (__DEBUG__) console.log(`requestUrl: ${url}`);
  if (__DEBUG__) console.log(`requestOptions: ${options}`);
  let _options = Object.assign({}, options, {
    headers: Object.assign({}, options.headers, dm.getHttpHeadMyAuth(), { UUIDIMEI: UUIDIMEI, bolueClient: bolueClient, devToken: devToken, bolueVer: bolueVer }, (addressName !== '' && addressName !== null) ? { station: encodeURI(addressName) } : '', (headersCity !== '' && headersCity !== null) ? { city: encodeURI(headersCity) } : '', (wailian !== null && wailian !== '') ? { wailian: wailian } : '')
  });
  return OriFetch(makeUrlWithFixedParams(url), _options)
    // .then(checkHTTPStatus).then(parseJSON)
    .then((json) => {
      // if (__DEBUG__) console.log(json)
      return json
    }).catch((ex) => {
      if (__DEBUG__) console.log(ex)
      throw ex
    })
}

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// 密码合法性check
global.isPasswordAvailable = function (pwd) {
  var m = 0;
  var mode = 0;
  if (pwd == null || pwd === undefined) {
    return false;
  }
  pwd = pwd.trim();
  if (pwd.length > 16) {
    return false;
  }

  for (var i = 0; i < pwd.length; i++) {
    var c_type = 0;
    var t = pwd.charCodeAt(i);
    if (t >= 48 && t <= 57) {
      // 数字
      c_type = 1;
    } else if ((t >= 65 && t <= 90) || (t >= 97 && t <= 122)) {
      // 大小写
      c_type = 2;
    } else {
      // 文字串，随便什么都行
      c_type = 4;
    }
    mode |= c_type;
  }
  for (var i = 0; i < 3; i++) {
    if (mode & 1) {
      m++;
    }
    mode >>>= 1
  }
  if (m < 2) {
    return false;
  }
  return true;
}

global.isCellPhoneAvailable = function (s) {
  return typeof ('') === typeof (s) ? /^1[0-9]{10}$/.test(s) : !!0;
  /*
  if (phone === undefined) {
    return false;
  }
  if (phone === '') {
    return false;
  }
  // if(!/^((13[0-9])|(14[5|7|9])|(15[^4])|(17[0|1|3|5-8])|(18[0-9]))\d{8}$/.test(phone)){
  //  return false;
  // }
  if(!/^((13[0-9])|(14[5|7|9])|(15[^4])|(166)|(17[0|1|3|5-8])|(18[0-9])|(19[1|8|9]))\d{8}$/.test(phone))
  {
    return false;
  }

  return true;*/
}

// 邮箱合法性
global.isEmailAvailable = function (email) {
  if (email === undefined) {
    return false;
  }
  if (email === '') {
    return false;
  }

  // var str = /^(\w)+(\.\w+)*@(.)+((\.\w+)+)$/;
  var str = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (str.test(email)) {
    return true;
  }
  return false;
}

// QQ号合法性
global.isQQAvailable = function (qq) {
  if (qq === undefined) {
    return false;
  }
  if (qq === '') {
    return false;
  }
  return isNumber(qq);
}

String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function () {
  return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim = function () {
  return this.replace(/(\s*$)/g, "");
}

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}

global.isNumber = function (value) {
  var reg = new RegExp("^[0-9]*$");
  return reg.test(value);
}

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
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  // 秒
  var result = "" + parseInt(theTime) + "";
  if (result.length == 1) {
    result = "0" + result;
  }
  if (theTime1 > 0) {
    // 分
    result = "" + parseInt(theTime1) + ":" + result;
  }
  if (theTime2 > 0) {
    // 时
    result = "" + parseInt(theTime2) + ":" + result;
  }

  if (theTime1 == 0 && theTime2 == 0) {
    result = "00:" + result;
  }
  return result;
}

//判断今天、昨天以及两天前，分别以不同的日期格式显示
global.someDay = function (theDate) {
  var date = new Date()
  var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
  var yesterday = new Date(today - 1000 * 60 * 60 * 24).getTime()//昨天
  var sendTime = '';//日期显示格式
  var theDate = new Date(theDate).getTime();

  if (today <= new Date(theDate)) {//今天
    sendTime = new Date(theDate).format('hh:mm')
  }
  else if (theDate < today && theDate >= yesterday) {//昨天
    sendTime = '昨天 ' + new Date(theDate).format('hh:mm')
  }
  else {//两天前
    sendTime = new Date(theDate).format('yyyy-MM-dd') + ' ' + new Date(theDate).format('hh:mm')
  }
  return sendTime;
}

global.replaceHtmlWithoutBR = function (str) {
  if (!str) {
    return "";
  }
  str = str.replace(/<br\s*\/?>/gi, "\r\n");

  str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
  str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
  // str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
  str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
  // str=str.replace(/\s/g,''); //将空格去掉

  return str;
}

//座机号校验
global.isTelCorrect = function (tel) {
  // var reg = new RegExp("^((0?[1-9]{2,3})-)([0-9]*)(-[0-9]*)?$");
  var reg = new RegExp("/^(0[0-9]{2,3}-+[2-9][0-9]{6,7})+(-+[0-9]*)?$/");
  return reg.test(tel);
}

global.filesizeAsMB = (filesize) => {
  const mb = (filesize / 1024 / 1024).toFixed(1).replace('.0', '')
  return (filesize ? `${mb}` : '0') + 'MB'
}

global.loginType = false