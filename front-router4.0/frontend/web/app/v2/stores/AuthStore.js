import Dispatcher from '../AppDispatcher';
// var EventEmitter = require('events').EventEmitter;
var async = require('async');
var util =  require('util'),
    f = util.format;
var keyMirror = require('keymirror');
var path = require('path');
var URL = require('url');
var querystring = require('querystring');
import {dm} from '../util/DmURL';
var dir_auth = '/auth';
var url_weixin_authenticate = path.join(dir_auth, 'weixin');
var state_weixin_redirect = 'authredirect';
import EventCenter from '../EventCenter';

// ## oauth weixin auth#
function getUrl_WEIXIN_AUTH_CODE(redirect_path, scope) {
    if(!redirect_path){
        console.error('redirect_path required!');
        return;
    }
    var _scope = scope || 'snsapi_userinfo'; //snsapi_base
    var url = URL.parse(redirect_path, true);
    if(url.hash){
        localStorage.setItem('phash_before_auth', url.hash);
        delete url.hash;
    }
    if(url.search) {
        localStorage.setItem('psearch_before_auth', url.search);
    }
    var urlstr = URL.format(url);
    sessionStorage.removeItem('authData')
    return f( 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s#wechat_redirect',
        dm.getWXAppId(), //appid
        encodeURI(urlstr),
        _scope,
        state_weixin_redirect
    );
}

function get_AUTH_CODE(redirect_path) {//path related to root
    dm.clearCredentials();
    window.location = getUrl_WEIXIN_AUTH_CODE(redirect_path);
}

function doAUTHENTICATE(action) {
    if(action.url_cb){
        var act_url_cb = URL.parse(action.url_cb.href);
        var search = act_url_cb.search ? querystring.parse(act_url_cb.search.replace('?', '')) : {};
        delete search.state;
        delete search.code;
        act_url_cb.search = querystring.stringify(search);
        var url_cb = URL.format(act_url_cb);
        AuthStore.setUrlAuthCB(url_cb);
        var withoutParam = true;
        var q = dm.getUrlQueryFromSearch(action.url_cb.search);
        if( q && q.code && q.state && q.state.indexOf(state_weixin_redirect) > -1 ){
            // 若已获取用户信息，则不再向后台发送code
            var auth_data = sessionStorage.getItem('authData')
            if (!auth_data) {
                EventCenter.emit("REQUEST_START", action);
                var _url = dm.getUrl_api('/v2/weixin/oauth', { code: q.code });
                fetch( _url, {
                    method: 'GET',
                    headers: {
                        // "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(checkHTTPStatus).then(parseJSON)
                .then( (json) => {
                    EventCenter.emit("REQUEST_END", action);
                    if(json.result && json.result.openid && json.result.code){
                        // 存储凭证
                        sessionStorage.setItem("authData", JSON.stringify(json.result));

                        dm.saveCredentials(json.result);
                        EventCenter.emit("AUTHENTICATE_SUCCEED", json.result);
                        var phash_before_auth = localStorage.getItem('phash_before_auth');
                        var psearch_before_auth = localStorage.getItem('psearch_before_auth');
                        localStorage.removeItem('phash_before_auth');
                        localStorage.removeItem('psearch_before_auth');
                        act_url_cb.hash = phash_before_auth;
                        act_url_cb.search = psearch_before_auth;
                        window.location = URL.format(act_url_cb);
                    }else{
                        console.log(json);
                        var msg;
                        if(json.err){
                            msg=json.err;
                        }else if(json.result){
                            msg='哎呀，出错了';
                        }else{
                            msg=json;
                        }
                        alert(msg);
                    }
                }).catch( (ex) => {
                    EventCenter.emit("REQUEST_END", action);
                });
                return;
            } else {

                dm.saveCredentials(JSON.parse(sessionStorage.getItem('authData')));
                EventCenter.emit("AUTHENTICATE_SUCCEED", JSON.parse(sessionStorage.getItem('authData')));
                var phash_before_auth = localStorage.getItem('phash_before_auth');
                var psearch_before_auth = localStorage.getItem('psearch_before_auth');
                localStorage.removeItem('phash_before_auth');
                localStorage.removeItem('psearch_before_auth');
                act_url_cb.hash = phash_before_auth;
                act_url_cb.search = psearch_before_auth;
                window.location = URL.format(act_url_cb); 
            }
            
        } else {
            localStorage.removeItem('phash_before_auth');
            localStorage.removeItem('psearch_before_auth');
            EventCenter.emit("AUTHENTICATE_SUCCEED", q);
            if (action.noAuthCB) {
                action.noAuthCB();
            }
        }
    } else if (action.noAuthCB) {
        action.noAuthCB();
    }
    
    
}

function makeNonceStr() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function readyWXMenu(){
    if(wx) {
        wx.hideAllNonBaseMenuItem();
        wx.showMenuItems({
            menuList: [
                'menuItem:profile',
                'menuItem:favorite',
                'menuItem:share:appMessage',
                'menuItem:share:timeline',
                'menuItem:openWithSafari'
            ] // 要显示的菜单项，所有menu项见附录3
        });
    }
}
//
// function doWX_JS_CONFIG(action) {
//     var noncestr = makeNonceStr();
//     var timestamp = Date.parse(new Date())/1000 + '';
//     var lc = document.location.href.split('#')[0];
//     var _url = dm.getUrl_api('/weixin/wxsign', {
//         url: lc,
//         nonceStr: noncestr,
//         timestamp: timestamp
//     });
//     fetch( _url, {
//         method: 'GET',
//         headers: dm.getHttpHeadMyAuth()
//     }).then(checkHTTPStatus).then(parseJSON)
//     .then( (json) => {
//         if(json.err){
//             console.log('doGET_ORDER', json.err);
//             return;
//         }
//         if(json && json.result) {
//              if(wx){
//                 wx.ready(function(){
//                     readyWXMenu();
//                     if(action && action.onMenuShareAppMessage) {
//                         var opts = action.onMenuShareAppMessage;
//                         wx.onMenuShareAppMessage(opts);
//                         wx.onMenuShareTimeline(opts);
//                     }
//                 });
//                 wx.error(function(res){
//                     alert(res.errMsg);
//                 });
//                 wx.config({
//                     debug: false,
//                     appId: dm.getWXAppId(),
//                     nonceStr: noncestr,
//                     timestamp: timestamp,
//                     signature: json.result.signature,
//                     jsApiList: [
//                         'onMenuShareTimeline',
//                         'onMenuShareAppMessage',
//                         'hideOptionMenu',
//                         'showOptionMenu',
//                         'hideMenuItems',
//                         'showMenuItems',
//                         'hideAllNonBaseMenuItem',
//                         'showAllNonBaseMenuItem'
//                     ]
//                 });
//              }
//         }
//     }).catch( (ex) => {
//         console.error(jqXHR, textStatus, errorThrown.toString());
//     });
// }
//## end weixin auth#

export const AuthStore = {
    get_AUTH_CODE: get_AUTH_CODE,
    doAUTHENTICATE: doAUTHENTICATE,
    setUrlAuthCB(auth_cb_path){ //register 403 callback, path related to root
        EventCenter.on("SC403", function(){
            get_AUTH_CODE(auth_cb_path);
        });
    },
    dispatcherIndex: Dispatcher.register( (action) => {
        if (action.actionType) {
            if( eval("typeof " + 'do' + action.actionType) === 'function') {
                eval('do' + action.actionType).call(null, action);
            }
        }
        return true; // No errors. Needed by promise in Dispatcher.
    })

};
