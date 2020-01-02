var Dispatcher = require('../dispatcher/AppDispatcher.js');
var AppStore = require('./AppStore.js');
var AuthStore = require('../stores/AuthStore.js')(Dispatcher);
var EventEmitter = require('events').EventEmitter;
var URL = require('url');
var querystring = require('querystring');
var assign = require('object-assign');
var keyMirror = require('keymirror');
var util = require('util'),
    f = util.format;

var dm = require('../util/DmURL');
// var wx = require('../lib/jweixin-1.1.0.js');

var LIMIT = 10;

var Events = keyMirror({
    UNIFY_ORDER_DONE: null,
    DISCOUNT_TAB_CHANGE_DONE: null,
    REDEEM_DONE: null,
    GET_REDEEM_DONE: null,
    GET_PLOYV_SIGN_DONE: null,
    // WX_JS_CONFIG_DONE: null,
    BIND_DONE: null,
    REGISTER_DONE: null,
    GET_REGISTER_CODE_DONE: null,
    ONLINE_CHANGE_CHAPTER_DONE: null,
    ONLINE_CHANGE_TEACHERS_DONE: null,
    GET_LOGIN_DONE: null,
    PLAY_DONE: null,
    SHARE_DONE: null,
    SELECT_RESOURCE_CODE_DONE: null,
    ADD_RESOURCE_CODE_DONE: null,
    GET_RESOURCE_CODE_DONE: null,
    ENROLL_DONE: null,
    ENROLL_ERROR: null,
    RESERVE_DONE: null,
    RESERVE_ERROR: null,
    PAY_DONE: null,
    GET_ENROLL_DONE: null,
    GET_RESERVE_DONE: null,
    GET_ORDER_DONE: null,
    TOGGLE_COLLECT_DONE: null,
    PRODUCT_TOGGLE_COLLECT_DONE: null,
    DETAIL_SECT_CHANGED: null,
    GET_DETAIL_DONE: null,
    SEARCHBAR_FOCUSED: null,
    GET_LATEST_DONE: null,
    GET_LATEST_MORE_DONE: null,
    GET_LATEST_MORE_START: null,
    SEARCH_DONE: null,
    SEARCH_MORE_DONE: null,
    SEARCH_MORE_START: null,
    REQUEST_START: null,
    REQUEST_END: null,
    PRODUCT_DONE: null,
    PRODUCT_DETAIL_DONE:null,
    PRODUCT_ONCHANGE_INDEX_DONE:null,
    PRODUCT_CHANGE_CHAPTER_DONE:null,
    LASTVIEWPRODUCTLESSON_DONE: null,
    GETEXISTORDER_DONE:null,
    ON_PLAYOVER_DONE: null,
    GET_COUPON_DONE: null,
    WEIXIN_ADD_COUPON_DONE: null,
    WEIXIN_USE_COUPON_DONE: null,
    WEIXIN_COUPON_ALERT_DONE: null,
    HIED_APP_DONE: null,
    HIDE_APP_SHARE_DONE: null
});

var ActionTypes = keyMirror({
    UNIFY_ORDER: null,
    DISCOUNT_TAB_CHANGE: null,
    REDEEM: null,
    GET_REDEEM: null,
    SERVER_ERROR: null,
    GET_PLOYV_SIGN: null,
    // WX_JS_CONFIG: null,
    BIND: null,
    REGISTER: null,
    GET_REGISTER_CODE: null,
    ONLINE_CHANGE_CHAPTER: null,
    ONLINE_CHANGE_TEACHERS: null,
    GET_LOGIN: null,
    PLAY: null,
    SHARE: null,
    ADD_RESOURCE_CODE: null,
    GET_RESOURCE_CODE: null,
    ENROLL: null,
    RESERVE: null,
    PAY: null,
    GET_ENROLL: null,
    GET_RESERVE: null,
    GET_ORDER: null,
    DETAIL_SECT_CLICKED: null,
    TOGGLE_CORNER_MENU: null,
    TOGGLE_COLLECT: null,
    GET_DETAIL: null,
    GET_LATEST: null,
    GET_LATEST_MORE: null,
    ADD_JOIN: null,
    SEARCH: null,
    SEARCH_MORE: null,
    PRODUCT: null,
    PRODUCT_DETAIL: null,
    PRODUCT_ONCHANGE_INDEX: null,
    PRODUCT_CHANGE_CHAPTER: null,
    LASTVIEWPRODUCTLESSON: null,
    PRODUCT_TOGGLE_COLLECT: null,
    GETEXISTORDER:null,
    GET_COUPON:null,
    WEIXIN_ADD_COUPON:null,
    WEIXIN_USE_COUPON:null,
    WEIXIN_COUPON_ALERT:null,
    HIED_APP: null,
    HIDE_APP_SHARE: null

});

var CourseTypes = keyMirror({
    online_info: null,
    offline_info: null,
    live_info: null,
    product: null

});

var DetailSects = keyMirror({
    sc_this: null,
    sc_refer: null,
    sc_chapters: null

});

var DiscountTypes = keyMirror({
    trail: null,
    money: null 
});

var existIds_search = [];
var skip_latest = 0;
var type4more = '';
var keyWord4more = '';

function parseJqErr(jqXHR) {
    if(jqXHR.status === 500){ 
        var re = JSON.parse(jqXHR.responseText);
        return re;
    }
    return {};
}

function doHIED_APP(action){
    CoursesStore.emit(CoursesStore.Events.HIED_APP_DONE, action);
}

function doHIDE_APP_SHARE(action){
    CoursesStore.emit(CoursesStore.Events.HIDE_APP_SHARE_DONE, action);

}

function doGET_COUPON(action){
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    // var urll='http://10.10.30.57:8080/weixin/myTrailDiscount';
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/myTrailDiscount'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            resource_type: action.resource_type
        },
        dataType: 'json',
        success: function(data){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            if (data && data.result) {
                CoursesStore.emit(CoursesStore.Events.GET_COUPON_DONE, {discount:data.result,resource_type:action.resource_type});
            }
            // AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}
function doWEIXIN_ADD_COUPON(action){
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    // var urll='http://10.10.30.57:8080/weixin/addTrailDiscount?openid='+localStorage.getItem("credentials.openid")+'&code='+localStorage.getItem("credentials.code")+'';
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/addTrailDiscount'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
           discountCode: action.discountCode,
           resource_type: action.resource_type
        }),
        dataType: 'json',
        success: function(re){
            var result = re.result;
            if(result){
                CoursesStore.emit(CoursesStore.Events.WEIXIN_ADD_COUPON_DONE, result);
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            var re = parseJqErr(jqXHR);
            if(re.err) {
                CoursesStore.emit(CoursesStore.Events.WEIXIN_ADD_COUPON_DONE, re);
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}
function doWEIXIN_USE_COUPON(action){
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    // var urll='http://10.10.30.57:8080/weixin/useTrailDiscount?openid='+localStorage.getItem("credentials.openid")+'&code='+localStorage.getItem("credentials.code")+'';
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/useTrailDiscount'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
           discountCode: action.discountCode,
           resource_type: action.resource_type,
           resource_id: action.resource_id
        }),
        dataType: 'json',
        success: function(re){
            var result = re.result;
            if(result){
                CoursesStore.emit(CoursesStore.Events.WEIXIN_USE_COUPON_DONE, result);
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            var re = parseJqErr(jqXHR);
            if(re.err) {
                CoursesStore.emit(CoursesStore.Events.WEIXIN_USE_COUPON_DONE, re);
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}

function doWEIXIN_COUPON_ALERT(action){
    CoursesStore.emit(CoursesStore.Events.WEIXIN_COUPON_ALERT_DONE, action);
}

function doDISCOUNT_TAB_CHANGE(action) {
    CoursesStore.emit(Events.DISCOUNT_TAB_CHANGE_DONE, action);
}

function doGET_REDEEM(action) {
    CoursesStore.emit(Events.GET_REDEEM_DONE, action);
}

function doREDEEM(action) {
    console.log('doREDEEM');
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/resourceCode'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify(action.param),
        dataType: 'json',
        success: function(re){
            var result = re.result;
            if(result){
                if(result.discount){
                   CoursesStore.emit(CoursesStore.Events.REDEEM_DONE, result);
                }
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            var re = parseJqErr(jqXHR);
            if(re.err) {
                CoursesStore.emit(CoursesStore.Events.SERVER_ERROR, re);
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
    
}

function doADD_JOIN(action) {
    console.log('doADD_JOIN',action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/addJoin'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
            type: action.lesson.type,
            lessonId: action.lesson.id,
            catalogId: action.lesson.video ? action.lesson.video.catalog_id : null,
            productId: action && action.productId ? action.productId : null,
            levelId: action && action.levelId ? action.levelId : null,
            joinStatus: action && action.joinStatus ? action.joinStatus : null
        }),
        dataType: 'json',
        success: function(data){
            if(data.err){
                console.log('doSEARCH', data.err);
                return;
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
        }
    });
}

function doSEARCH(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    type4more = action.type;
    keyWord4more = action.keyWord;
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/search'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            type: action.type,
            keyWord: action.keyWord,
            existIds: [],
            skip: 0,
            limit: LIMIT
        },
        dataType: 'json',
        success: function(data){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            if(data.err){
                console.log('doSEARCH', data.err);
                return;
            }
            var results = (data && data.results && data.results.length > 0) ? data.results : [];
            if(results) {
                existIds_search = [];
                results.forEach(function(item){
                    if(item && item.id){
                        existIds_search.push(item.id);
                    }
                });
                CoursesStore.emit(Events.SEARCH_DONE, {
                    results: results,
                    keyWords: data.keyWords
                }); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}

function doSEARCH_MORE(action) {
    CoursesStore.emit(Events.SEARCH_MORE_START, action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/search'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            type: type4more,
            keyWord: keyWord4more,
            skip: existIds_search.length,
            existIds: (existIds_search && existIds_search.length>0) ? JSON.stringify(existIds_search) + '' : '[]',
            limit: LIMIT
        },
        dataType: 'json',
        success: function(data){
            // AppStore.emit(AppStore.Events.REQUEST_END, action);
            if(data.err){
                console.log('doSEARCH', data.err);
                return;
            }
            var results = (data && data.results && data.results.length > 0) ? data.results : [];
            if(results) {
                results.forEach(function(item){
                    if(item && item.id){
                        existIds_search.push(item.id);
                    }
                });
                CoursesStore.emit(Events.SEARCH_MORE_DONE, {
                    results: assign(results, action.keyWord)
                }); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}

function doGET_LATEST(action) {
    type4more = action.type;
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/lessonlist'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            type: action.type,
            limit: LIMIT
        },
        dataType: 'json',
        success: function(data){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            var results = (data && data.results && data.results.length > 0) ? data.results : [];
            if(results) {
                skip_latest = results.length;
                CoursesStore.emit(Events.GET_LATEST_DONE, {
                    results: results
                }); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });

}

function doGET_LATEST_MORE(action) {
    CoursesStore.emit(Events.GET_LATEST_MORE_START, action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/lessonlist'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            type: type4more,
            skip: skip_latest,
            limit: LIMIT
        },
        dataType: 'json',
        success: function(data){
            // AppStore.emit(AppStore.Events.REQUEST_END, action);
            if(data.err){
                console.log('doSEARCH', data.err);
                return;
            }
            var results = (data && data.results && data.results.length > 0) ? data.results : [];
            if(results) {
                skip_latest += results.length;
                CoursesStore.emit(Events.GET_LATEST_MORE_DONE, {
                    results: results
                }); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}

function doGET_DETAIL(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/lesson'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            lessonId: action.id,
            type: action.type
        },
        dataType: 'json',
        success: function(data){
            if(data.err){
                console.log('GET_DETAIL', data.err);
                AppStore.emit(AppStore.Events.REQUEST_END, action);
                return;
            }
            if(data && data.result) {
                CoursesStore.emit(Events.GET_DETAIL_DONE, {
                    result: data.result,
                    user: data.user
                }); 
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}

function doPRODUCT(action) {
    console.log('action',action);
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/productLevelList'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            productId: action.id,
            type: action.type
        },
        dataType: 'json',
        success: function(data){
            if(data.err){
                console.log('GET_DETAIL', data.err);
                AppStore.emit(AppStore.Events.REQUEST_END, action);
                return;
            }
            if(data && data.result) {
                CoursesStore.emit(Events.PRODUCT_DONE, {
                    result: data.result,
                    user: data.user
                }); 
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}

 var Product;
function doPRODUCT_DETAIL(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    Product = action && action.Product ? action.Product : '';
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/productLevelDetail'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            productId: action.productId,
            levelId: action.levelId
        },
        dataType: 'json',
        success: function(data){
            // if(data.err){
            //     console.log('GET_DETAIL', data.err);
            //     // AppStore.emit(AppStore.Events.REQUEST_END, action);
            //     return;
            // }
            if(data && data.result) {
                CoursesStore.emit(Events.PRODUCT_DETAIL_DONE, {
                    result: data.result,
                    user: data.user,
                    productId: action.productId,
                    levelId: action.levelId,
                    Product: Product,
                    resourceId: action.resourceId,
                    catelogId: action.catelogId
                }); 
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}

function doLASTVIEWPRODUCTLESSON(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/lastViewProductLesson'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            productId: action.productId
        },
        dataType: 'json',
        success: function(data){
            if(data.err){
                console.log('GET_DETAIL', data.err);
                // AppStore.emit(AppStore.Events.REQUEST_END, action);
                return;
            }
            if(data && data.result) {
                CoursesStore.emit(Events.LASTVIEWPRODUCTLESSON_DONE, {
                    result: data.result,
                    user: data.user
                }); 
            }
            // AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}


function doPRODUCT_ONCHANGE_INDEX(action){//Dennis
    CoursesStore.emit(CoursesStore.Events.PRODUCT_ONCHANGE_INDEX_DONE, action);
}

function makeNonceStr() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// function readyWXMenu(){
//     if(wx) {
//         wx.hideAllNonBaseMenuItem();
//         wx.showMenuItems({
//             menuList: [
//                 'menuItem:profile',
//                 'menuItem:favorite',
//                 'menuItem:share:appMessage',
//                 'menuItem:share:timeline'
//             ] // 要显示的菜单项，所有menu项见附录3
//         });
//     }
// }

// function doWX_JS_CONFIG(action) {
//     var noncestr = makeNonceStr();
//     var timestamp = Date.parse(new Date())/1000 + '';
//     // AppStore.emit(AppStore.Events.REQUEST_START, action);
//     var lc = document.location.href.split('#')[0];
//     jQuery.ajax({
//         url: dm.getUrl_api('/weixin/wxsign'),
//         method: 'GET',
//         crossDomain: true,
//         contentType: "application/x-www-form-urlencoded",
//         data: {
//             url: lc,
//             nonceStr: noncestr,
//             timestamp: timestamp
//         },
//         dataType: 'json',
//         success: function(data){
//             if(data.err){
//                 console.log('doGET_ORDER', data.err);
//                 // AppStore.emit(AppStore.Events.REQUEST_END, action);
//                 return;
//             }
//             if(data && data.result) {
//                  if(wx){
//                     wx.hideAllNonBaseMenuItem();
//                     wx.config({
//                         debug: false,
//                         appId: dm.getWXAppId(),
//                         nonceStr: noncestr,
//                         timestamp: timestamp,
//                         signature: data.result.signature,
//                         jsApiList: [
//                             'onMenuShareTimeline',
//                             'onMenuShareAppMessage',
//                             'hideOptionMenu',
//                             'showOptionMenu',
//                             'hideMenuItems',
//                             'showMenuItems',
//                             'hideAllNonBaseMenuItem',
//                             'showAllNonBaseMenuItem'
//                         ]
//                     });
//                     wx.ready(function(){
//                         AuthStore.readyWXMenu();
//                         if(action && action.onMenuShareAppMessage) {
//                             var opts = action.onMenuShareAppMessage;
//                             wx.onMenuShareAppMessage(opts);
//                             wx.onMenuShareTimeline(opts);
//                         }
//                     });
//                     wx.error(function(res){
//                         alert(res.errMsg);
//                     });
//                  }
//             }
//             // AppStore.emit(AppStore.Events.REQUEST_END, action);
//         },
//         error: function(jqXHR, textStatus, errorThrown){
//             console.error(jqXHR, textStatus, errorThrown.toString());
//             // AppStore.emit(AppStore.Events.REQUEST_END, action);
//         }
//     });
// }


// var isOn_doGET_ORDER = false;
function doGET_ORDER(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    var lesson = action.lesson;
    var product = action.product;
    var param = lesson ? {
        orderSource: 'W',
        items: [{
            lessonId: lesson.id,
            type: lesson.type
        }]
        
    } : {};
    param = product ? {
        orderSource: 'W',
        items: [{
            lessonId: product.id,
            type: 'product'
        }] 
    } : {};
    if(action.discounts){
        assign(param, {
            discounts: action.discounts
        });
    }
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/makeOrderW'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify(param),
        dataType: 'json',
        success: function(data){
            if(data && data.result) {
                CoursesStore.emit(Events.GET_ORDER_DONE, data); 
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            var re = parseJqErr(jqXHR);
            if(re.err) {
                CoursesStore.emit(CoursesStore.Events.SERVER_ERROR, re);
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}


function doGETEXISTORDER(action) {
    // console.log('action',action);
    var Product_result;
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/getExistOrder'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            orderId: action.orderId,
            orderSource: 'W'
        },
        dataType: 'json',
        success: function(data){
            if (data.result.authority === 'payed' && data.result.items && data.result.items[0].lessonId) {
                var urll = URL.parse(dm.getUrl_home('/html/courses_index.html?courseType=product#CRSPanelProductLevelList'+ '-'+data.result.items[0].lessonId), true); 
                window.location = URL.format(urll);
                window.location.reload(true);
            }
            if(data && data.result) {
                if (data.result && data.result.items && data.result.items[0].lessonId) {
                        var lessonId = data.result.items[0].lessonId;
                        jQuery.ajax({
                        url: dm.getUrl_api('/weixin/productLevelList'),
                        method: 'GET',
                        crossDomain: true,
                        contentType: "application/x-www-form-urlencoded",
                        data: {
                            productId: lessonId,
                            type: 'product'   
                        },
                        dataType: 'json',
                        success: function(data_result){
                            if(data_result.err){
                                AppStore.emit(AppStore.Events.REQUEST_END, action);
                                return;
                            }
                            if(data_result && data_result.result) {
                                Product_result = data_result.result
                                CoursesStore.emit(Events.GETEXISTORDER_DONE, {
                                    result: data.result,
                                    user: data.user,
                                    product: Product_result
                                }); 
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            console.error(jqXHR, textStatus, errorThrown.toString());
                            AppStore.emit(AppStore.Events.REQUEST_END, action);
                        }
                    });
                }                
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}



function doGET_RESOURCE_CODE(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    var param = {
        type: action.courseType
    };
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/resourceCode'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: param,
        dataType: 'json',
        success: function(data){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            if(data && data.result) {
                CoursesStore.emit(Events.GET_RESOURCE_CODE_DONE, data); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            var re = parseJqErr(jqXHR);
            if(re.err) {
                CoursesStore.emit(CoursesStore.Events.SERVER_ERROR, re);
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        }
    });
}

function doADD_RESOURCE_CODE(action) {

    // console.log('doADD_RESOURCE_CODE', action.discountCode);
    // var sample = {
    //     result: {
    //         added_code: {
    //             id: Date.now(),
    //             code: action.newcode,
    //             end_time: 1445098721971
    //         }
    //     }
    // };
    // CoursesStore.emit(Events.ADD_RESOURCE_CODE_DONE, sample);
}

function doGET_RESERVE(action) {
    var sample = {
        result: action.lesson
    };
    CoursesStore.emit(Events.GET_RESERVE_DONE, sample);
}

function doRESERVE(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/doReserve'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
            type: 'live_info',
            lessonId: action.lesson.id,
            mobile: action.mobile
        }),
        dataType: 'json',
        success: function(data){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            if(data.err){
                console.log('doRESERVE', data.err);
                return;
            }
            if(data && data.result) {
                CoursesStore.emit(Events.RESERVE_DONE, {
                    lesson: assign(action.lesson, {
                        isReserved: data.result.isReserved || true
                    })
                }); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            if(jqXHR.status === 500){ 
                var data = JSON.parse(jqXHR.responseText);
                CoursesStore.emit(Events.RESERVE_ERROR, data);
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            console.error('doENROLL', jqXHR, textStatus, errorThrown.toString());
        }
    });
}

function doENROLL(action) {
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/doEnroll'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
            type: 'offline_info',
            lessonId: action.lesson.id,
            enroll: action.enroll
        }),
        dataType: 'json',
        success: function(data){
            if(data.err){
                console.log('doENROLL', data.err);
                return;
            }
            if(data && data.result) {
                CoursesStore.emit(Events.ENROLL_DONE, {
                    lesson: assign(action.lesson, {authority: data.result.authority})
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            if(jqXHR.status === 500){ 
                var data = JSON.parse(jqXHR.responseText);
                CoursesStore.emit(Events.ENROLL_ERROR, data);
            }
            console.error('doENROLL', jqXHR, textStatus, errorThrown.toString());
        }
    });
}

function doGET_ENROLL(action) {
    console.log('doGET_ENROLL');
    var sample = {
        result: action.lesson
    };
    CoursesStore.emit(Events.GET_ENROLL_DONE, sample);
}

function doDETAIL_SECT_CLICKED(action) {
    CoursesStore.emit(Events.DETAIL_SECT_CHANGED, action);
}

function doTOGGLE_CORNER_MENU(action) {
    console.log('doTOGGLE_CORNER_MENU');
}

function doTOGGLE_COLLECT(action) {
    console.log('doTOGGLE_COLLECT');
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/collect'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
            lessonId: action.lession.id,
            type: action.lession.type
        }),
        dataType: 'json',
        success: function(data){
            if(data.err){
                console.log('doTOGGLE_COLLECT', data.err);
                return;
            }
            if(data && data.result) {
                CoursesStore.emit(Events.TOGGLE_COLLECT_DONE, {isCollected: data.result.isCollected});
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
        }
    });
}

function doPRODUCT_TOGGLE_COLLECT(action) {
    console.log('doPRODUCT_TOGGLE_COLLECT');
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/collect'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
            lessonId: action.lession.id,
            type: 'product'
        }),
        dataType: 'json',
        success: function(data){
            if(data.err){
                console.log('doTOGGLE_COLLECT', data.err);
                return;
            }
            if(data && data.result) {
                CoursesStore.emit(Events.PRODUCT_TOGGLE_COLLECT_DONE, {isCollected: data.result.isCollected}); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
        }
    });
}

function doUNIFY_ORDER(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    var order = action.order;
    jQuery.ajax({
        url: dm.getUrl_api('/weixin/unifiedorder'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
            orderSource: 'W',
            order_id: order.order_id
        }),
        dataType: 'json',
        success: function(data){
            if(data && data.result) {
                CoursesStore.emit(Events.UNIFY_ORDER_DONE, 
                    {order: assign(order, data.result)}
                ); 
            }
            AppStore.emit(AppStore.Events.REQUEST_END, action);
        },
        error: function(jqXHR, textStatus, errorThrown){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            var re = parseJqErr(jqXHR);
            if(re.err) {
                CoursesStore.emit(CoursesStore.Events.SERVER_ERROR, re);
            }
        }
    });
}

function doPAY(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    console.log('doPAY');
    var order = action.order;
    var sign = order.sign;
    if(sign && sign.paySign){
        assign(sign, {
            appId: dm.getWXAppId()
        });
        function onBridgeReady(){
           WeixinJSBridge.invoke(
               'getBrandWCPayRequest', 
               sign,
               function(res){    
                   if(res.err_msg === "get_brand_wcpay_request:ok" ) { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                        //TODO: ajax check pay status from backend!!!
                        alert('支付成功');
                        CoursesStore.emit(Events.PAY_DONE, 
                            {order: assign(order, {authority: 'payed'})}
                        ); 
                   } else {
                        alert('支付失败');
                   }   
                   AppStore.emit(AppStore.Events.REQUEST_END, action);
               }
           ); 
        }
        if (typeof WeixinJSBridge == "undefined"){
           if( document.addEventListener ){
               document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
           }else if (document.attachEvent){
               document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
               document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
           }
        }else{
           onBridgeReady();
        }
    } else { //pay no fee order
        jQuery.ajax({
            url: dm.getUrl_api('/weixin/payzero'),
            method: 'POST',
            crossDomain: true,
            contentType: "application/json",
            data: JSON.stringify({
                orderSource: 'W',
                order_id: order.order_id
            }),
            dataType: 'json',
            success: function(data){
                if(data.err){
                    console.log('doPAY', data.err);
                    AppStore.emit(AppStore.Events.REQUEST_END, action);
                    return;
                }
                if(data && data.result) {
                    CoursesStore.emit(Events.PAY_DONE, 
                        {order: assign(order, {authority: 'payed'})}
                    ); 
                }
                AppStore.emit(AppStore.Events.REQUEST_END, action);
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert('支付失败');
                console.error(jqXHR, textStatus, errorThrown.toString());
                AppStore.emit(AppStore.Events.REQUEST_END, action);
            }
        });
    }
}

function __GET_PLOYV_SIGN(video, callback) {
    var url = dm.getUrl_api('/weixin/polySign');
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            vid: video.vid
        },
        dataType: 'json',
        success: function(data){
            if(data && data.result) {
                callback(data);
                return;
            }
            callback({err:'服务器出错'});
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.error(jqXHR, textStatus, errorThrown.toString());
            if(jqXHR.status === 500){ 
                var data = JSON.parse(jqXHR.responseText);
                callback(data);
                return;
            }
            callback({});
        }
    });
}

function doGET_PLOYV_SIGN(action) {
//no need tamporarily
}

function doONLINE_CHANGE_CHAPTER(action) {
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    var video = action.chapter.video;
    __GET_PLOYV_SIGN(video, (data) => {
        AppStore.emit(AppStore.Events.REQUEST_END, action);
        if(data.err){
            CoursesStore.emit(Events.SERVER_ERROR, data);
            return;
        }
        if(data.result){
            video.sign = data.result.sign;
            video.ts = data.result.ts;
            CoursesStore.emit(Events.ONLINE_CHANGE_CHAPTER_DONE, action); 
        }

    });
}

function doPRODUCT_CHANGE_CHAPTER(action) {
    // console.log('doPRODUCT_CHANGE_CHAPTER',action);
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    var video = action.chapter.video;
    __GET_PLOYV_SIGN(video, (data) => {
        AppStore.emit(AppStore.Events.REQUEST_END, action);
        if(data.err){
            CoursesStore.emit(Events.SERVER_ERROR, data);
            return;
        }
        if(data.result){
            video.sign = data.result.sign;
            video.ts = data.result.ts;
            CoursesStore.emit(Events.PRODUCT_CHANGE_CHAPTER_DONE, action); 
        }

    });
}

function doONLINE_CHANGE_TEACHERS(action) {
    console.log('doONLINE_CHANGE_TEACHERS');
    CoursesStore.emit(Events.ONLINE_CHANGE_TEACHERS_DONE, action); 
}

function doGET_LOGIN(action){
    console.log('doGET_LOGIN');
    if(isWeiXin) {
        AuthStore.emit(AuthStore.Events.SC401);
    } else {
        AuthStore.emit(AuthStore.Events.SC403);
    }
}

function doBIND(action){
    console.log('doBIND');
    var url_bind = dm.getUrl_api('/weixin/bind');
    AppStore.emit(AppStore.Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_bind,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            userName: action.userName,
            pw: action.pw
        },
        dataType: 'json',
        success: function(data){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            if(data && data.user && data.user.isBinded){
                CoursesStore.emit(Events.BIND_DONE, data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            // console.error(jqXHR, textStatus, errorThrown.toString());
            if(jqXHR.status === 500){ 
                var data = JSON.parse(jqXHR.responseText);
                CoursesStore.emit(Events.BIND_DONE, data);
            }
        }
    });
}

// function doREGISTER(action){
//     console.log('doREGISTER');
//     var url_register = dm.getUrl_api('/weixin/register');
//     AppStore.emit(AppStore.Events.REQUEST_START, action);
//     jQuery.ajax({
//         url: url_register,
//         method: 'GET',
//         crossDomain: true,
//         contentType: "application/x-www-form-urlencoded",
//         data: {
//             userName:action.userName,
//             registerCode:action.registerCode,
//             pw:action.pw,
//             specialCode: specialCode
//         },
//         dataType: 'json',
//         success: function(data){
//             AppStore.emit(AppStore.Events.REQUEST_END, action);
//             if(data && data.user && data.user.isBinded){
//                 CoursesStore.emit(Events.REGISTER_DONE, data);
//             }
//         },
//         error: function(jqXHR, textStatus, errorThrown){
//             AppStore.emit(AppStore.Events.REQUEST_END, action);
//            // console.error(jqXHR, textStatus, errorThrown.toString());
//             if(jqXHR.status === 500){ 
//                 var data = JSON.parse(jqXHR.responseText);
//                 CoursesStore.emit(Events.REGISTER_DONE, data);
//             }
//         }
//     });
// }

// function doGET_REGISTER_CODE(action){
//     console.log('doGetRegisterCode');
//     var url_registerCode = dm.getUrl_api('/weixin/registerCode');
//     AppStore.emit(AppStore.Events.REQUEST_START, action);
//     jQuery.ajax({
//         url: url_registerCode,
//         method: 'GET',
//         crossDomain: true,
//         contentType: "application/x-www-form-urlencoded",
//         data: {
//             telephone:action.telephone
//         },
//         dataType: 'json',
//         success: function(data){
//             AppStore.emit(AppStore.Events.REQUEST_END, action);
//             CoursesStore.emit(Events.GET_REGISTER_CODE_DONE, {
//                 detail: data.result 
//             }); 
//         },
//         error: function(jqXHR, textStatus, errorThrown){
//             AppStore.emit(AppStore.Events.REQUEST_END, action);
//            // console.error(jqXHR, textStatus, errorThrown.toString())
//             if(jqXHR.status === 500){ 
//                 var data = JSON.parse(jqXHR.responseText);
//                 CoursesStore.emit(Events.GET_REGISTER_CODE_DONE, data);
//             }
//         }
//     });
// }

var CoursesStore = assign({}, EventEmitter.prototype, {
    ActionTypes: ActionTypes,
    Events: Events,
    CourseTypes: CourseTypes,
    DetailSects: DetailSects,
    DiscountTypes: DiscountTypes,
    LIMIT: LIMIT,
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
module.exports = CoursesStore;



