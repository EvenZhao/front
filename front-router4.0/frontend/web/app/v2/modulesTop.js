'use strict';
import { dm } from './util/DmURL.js';
var urlquery = dm.getCurrentUrlQuery();
global.renderFromApp = urlquery.renderFromApp || '';
global.__rootDir = process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'dev' ? '' : '/' + process.env.NODE_ENV;
var userAgent = window.navigator.userAgent.toLowerCase();
if (__DEBUG__) console.log('userAgent', userAgent);
// if (__DEBUG__) alert(userAgent)
if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    jumpToPC(window.location)
}
global.isWeiXin = userAgent.indexOf('micromessenger') > -1; //为了测试先注释掉
// global.isWeiXin = userAgent.indexOf('micromessenger') > -1 ? false : true;
global.isApple = userAgent.indexOf('iphone') > -1;