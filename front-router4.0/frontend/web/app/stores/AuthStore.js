var Dispatcher;
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var async = require('async');
var util =  require('util'),
    f = util.format;
var keyMirror = require('keymirror');
var path = require('path');
var URL = require('url');
var querystring = require('querystring');
var dm = require('../util/DmURL');
var dir_auth = '/auth';
var url_weixin_authenticate = path.join(dir_auth, 'weixin');
var state_weixin_redirect = 'authredirect';


var Events = keyMirror({
    REQUEST_START: null,
    REQUEST_END: null,
    AUTHENTICATE_SUCCEED: null,
    AUTHENTICATE_FAILED: null,
    WX_JS_CONFIG_DONE: null,
    SC403: null,
    SC401: null
});

var ActionTypes = keyMirror({
    AUTHENTICATE: null,
    WX_JS_CONFIG: null,
    TEST: null

});

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
    return f( 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s#wechat_redirect',
        dm.getWXAppId(), //appid
        // encodeURI(url),
        encodeURI(urlstr),
        _scope,
        state_weixin_redirect
    );
}

function get_AUTH_CODE(redirect_path) {//path related to root
    dm.clearCredentials();
    window.location = getUrl_WEIXIN_AUTH_CODE(redirect_path);
}

function do_AUTHENTICATE(action) {
    if(action.url_cb){
        var act_url_cb = URL.parse(action.url_cb.href);
        var search = act_url_cb.search ? querystring.parse(act_url_cb.search.replace('?', '')) : {};
        delete search.state;
        delete search.code;
        act_url_cb.search = querystring.stringify(search);
        var url_cb = URL.format(act_url_cb);
        AuthStore.setUrlAuthCB(url_cb);
        var withoutParam = true;
        var _url = dm.getUrl_api('/weixin/oauth', withoutParam);
        var q = dm.getUrlQueryFromSearch(action.url_cb.search);
        if( q && q.code && q.state && q.state.indexOf(state_weixin_redirect) > -1 ){
            AuthStore.emit(Events.REQUEST_START, action);
            jQuery.ajax({
                url: _url,
                method: 'GET',
                crossDomain: true,
                contentType: "application/x-www-form-urlencoded",
                data: {
                    code: q.code
                },
                dataType: 'json',
                success: function(data){
                    AuthStore.emit(Events.REQUEST_END, action);
                    if(data.result && data.result.openid && data.result.code){
                        dm.saveCredentials(data.result);
                        AuthStore.emit(Events.AUTHENTICATE_SUCCEED, data.result);
                        var phash_before_auth = localStorage.getItem('phash_before_auth');
                        var psearch_before_auth = localStorage.getItem('psearch_before_auth');
                        localStorage.removeItem('phash_before_auth');
                        localStorage.removeItem('psearch_before_auth');
                        act_url_cb.hash = phash_before_auth;
                        act_url_cb.search = psearch_before_auth;
                        window.location = URL.format(act_url_cb);
                    }else{
                        // alert(data.result);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                   // console.error(jqXHR, textStatus, errorThrown.toString());
                   AuthStore.emit(Events.REQUEST_END, action);
                }
            });
        } else {
            localStorage.removeItem('phash_before_auth');
            localStorage.removeItem('psearch_before_auth');
            AuthStore.emit(Events.AUTHENTICATE_SUCCEED, q);
            if (action.noAuthCB) {
                action.noAuthCB();
            }
        }
    } else if (action.noAuthCB) {
        action.noAuthCB();
    }
}
//## end weixin auth#

//# AJAX comm funcs ################
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

function doWX_JS_CONFIG(action) {
    var noncestr = makeNonceStr();
    var timestamp = Date.parse(new Date())/1000 + '';
    // CoursesStore.emit(CoursesStore.Events.REQUEST_START, action);
    var lc = document.location.href.split('#')[0];
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/wxsign'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            url: lc,
            nonceStr: noncestr,
            timestamp: timestamp
        },
        dataType: 'json',
        success: function(data){
            if(data.err){
                console.log('doGET_ORDER', data.err);
                // CoursesStore.emit(CoursesStore.Events.REQUEST_END, action);
                return;
            }
            if(data && data.result) {
                 if(wx){
                    wx.ready(function(){
                        readyWXMenu();
                        if(action && action.onMenuShareAppMessage) {
                            var opts = action.onMenuShareAppMessage;
                            wx.onMenuShareAppMessage(opts);
                            wx.onMenuShareTimeline(opts);
                        }
                    });
                    wx.error(function(res){
                        // alert(res.errMsg);
                    });
                    wx.config({
                        debug: false,
                        appId: dm.getWXAppId(),
                        nonceStr: noncestr,
                        timestamp: timestamp,
                        signature: data.result.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem'
                        ]
                    });
                 }
            }
            // CoursesStore.emit(CoursesStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            // CoursesStore.emit(CoursesStore.Events.REQUEST_END, action);
        }
    });
}

function doTEST(action) {
    console.log('TEST from AuthStore.js');
}

//# end AJAX comm funcs #############
var AuthStore;
function init(dispatcher){
    if(AuthStore){
        return AuthStore;
    }
    Dispatcher = dispatcher;
    AuthStore = assign({}, EventEmitter.prototype, {
        ActionTypes: ActionTypes,
        Events: Events,
        get_AUTH_CODE: get_AUTH_CODE,
        do_AUTHENTICATE: do_AUTHENTICATE,
        setUrlAuthCB: function(auth_cb_path){ //register 403 callback, path related to root
            this.on(Events.SC403, function(){
                get_AUTH_CODE(auth_cb_path);
            });
        },
        addEventListener: function(eventName, callback) {
            this.on(eventName, callback);
        },
        removeEventListener: function(eventName, callback) {
            this.removeListener(eventName, callback);
        },
        dispatcherIndex: Dispatcher.register(function(action) {
            if (action.actionType) {
                if( eval("typeof " + 'do' + action.actionType) === 'function') {
                    eval('do' + action.actionType).call(null, action);
                }
            }
            return true; // No errors. Needed by promise in Dispatcher.
        }.bind(this))

    });
    return AuthStore;
}

module.exports = init;
