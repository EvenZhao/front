var Dispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var keyMirror = require('keymirror');
var util =  require('util'),
    f = util.format;

var dm = require('../util/DmURL');
var MeStore = require('../stores/MeStore.js');
var AppStore = require('./AppStore.js');
var URL = require('url');

var Events = keyMirror({
    GET_LATEST_MyCENTER:null,
    REQUEST_START: null,
    REQUEST_END: null,
    CHANGE_PWD:null,
    SEARCH_RESULT_CHANGED:null,
    SEARCH_ORDER_DONE:null,
    BIND_DONE:null,
    REGISTER_DONE:null,
    GET_DETAIL_DONE:null,
    SEARCH_ORDER_RESULT_MORE_DONE:null,
    GET_REGISTER_CODE_DONE:null,
    SHOW_USER_DONE: null,
    // TEST_BIND_DONE: null,
    REGISTER_ERROE: null,
    // PRODUCT_DONE: null,
    UNBIND_DONE: null

});

var ActionTypes = keyMirror({
    CHANGE_PASSWORD:null,
    SEARCH_MyCENTER_RESULT:null,
    SEARCH_MORE:null,
    SEARCH_ORDER_RESULT:null,
    BIND:null,
    REGISTER:null,
    GET_REGISTER_CODE:null,
    GET_DETAIL: null,
    SEARCH_ORDER_RESULT_MORE:null,
    SHOW_USER: null,
    // TEST_BIND:null,
    // PRODUCT: null,
    UNBIND: null

});

var LIMIT = 10;
var ORDER_LIMIT=10;
var result_order_data=[];
var resultdata = [];
var skiplength=0;
var skip_order_length=0;
var type='';
var action_type='';

function _addSearchResults(more){
    more.forEach(function(item){
        if(item && item.id){
            resultdata.push(item);
        }
    });
    skiplength=resultdata.length;
}

function doSHOW_USER(action){
    console.log('doTEST_BIND');
    var url = dm.getUrl_api('/weixin/showUser');
    // MeStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {},
        dataType: 'json',
        success: function(data){
            MeStore.emit(Events.SHOW_USER_DONE, data); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           if(jqXHR.status === 500){
               var data = JSON.parse(jqXHR.responseText);
               MeStore.emit(Events.SHOW_USER_DONE, data);
           }
           // MeStore.emit(Events.REQUEST_END, action);
        }
    });
}

// function doTEST_BIND(action){
//     console.log('doTEST_BIND');
//     var url_testBind = dm.getUrl_api('/weixin/showUser');
//     // MeStore.emit(Events.REQUEST_START, action);
//     jQuery.ajax({
//         url: url_testBind,
//         method: 'GET',
//         crossDomain: true,
//         contentType: "application/x-www-form-urlencoded",
//         data: {
            
//         },
//         dataType: 'json',
//         success: function(data){
//             MeStore.emit(Events.TEST_BIND_DONE, data); 
//         },
//         error: function(jqXHR, textStatus, errorThrown){
//            // console.error(jqXHR, textStatus, errorThrown.toString());
//            if(jqXHR.status === 500){
//                var data = JSON.parse(jqXHR.responseText);
//                MeStore.emit(Events.TEST_BIND_DONE, data);
//            }
//            // MeStore.emit(Events.REQUEST_END, action);
//         }
//     });
// }

function _addSearch_Order_Results(more){
    more.forEach(function(item){
        if(item && item.lessonInfo){
            result_order_data.push(item);
        }
    });
    skip_order_length=result_order_data.length;
    console.log('skip_order_length',skip_order_length);
}

function doBIND(action){
    // console.log('doBIND');
    var url_bind = dm.getUrl_api('/weixin/bind');
    MeStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_bind,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            userName:action.userName,
            pw:action.pw
        },
        dataType: 'json',
        success: function(data){
            if(data && data.user){
                MeStore.emit(Events.BIND_DONE, {
                    user: data.user ,
                    iserror: !data.user.isBinded
                }); 
            }else{
                this.error();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           var data = JSON.parse(jqXHR.responseText);
           MeStore.emit(Events.BIND_DONE, data);
        }
    });
}

function doUNBIND(action){
    console.log('doTEST_BINDssss');
    var url_unBind = dm.getUrl_api('/weixin/unBind');
    MeStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_unBind,
        method: 'POST',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            
        },
        dataType: 'json',
        success: function(data){
            MeStore.emit(Events.UNBIND_DONE, {
                detail: data.result
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           var data = JSON.parse(jqXHR.responseText);
           MeStore.emit(Events.UNBIND_DONE, data);
           MeStore.emit(Events.REQUEST_END, action);
        }
    });
}

function doREGISTER(action){
    // console.log('doREGISTER');
    var url_register = dm.getUrl_api('/weixin/register');
    MeStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_register,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            userName:action.userName,
            registerCode:action.registerCode,
            pw:action.pw
        },
        dataType: 'json',
        success: function(data){
            console.log('data',data);
            if(data && data.result){
                MeStore.emit(Events.REGISTER_DONE, {
                    user: data.user,
                    iserror: !data.user.isRegistered
                });
            }else{
                this.error();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           var data = JSON.parse(jqXHR.responseText);
           MeStore.emit(Events.REGISTER_DONE, data);
        }
    });
}

function doGET_REGISTER_CODE(action){
    // console.log('doGetRegisterCode');
    var url_registerCode = dm.getUrl_api('/weixin/registerCode');
    MeStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_registerCode,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            telephone:action.telephone
        },
        dataType: 'json',
        success: function(data){
            MeStore.emit(Events.GET_REGISTER_CODE_DONE, {
                detail: data.result 
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString())
           var data = JSON.parse(jqXHR.responseText);
           MeStore.emit(Events.GET_REGISTER_CODE_DONE, data);
        }
    });
}
function doCHANGE_PASSWORD(action){
    // console.log('doCHANGE_PASSWORD',action);
    var url_changePwd = dm.getUrl_api('/weixin/changePw');
    MeStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_changePwd,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            oldPw:action.oldPw,
            newPw:action.newPw
        },
        dataType: 'json',
        success: function(data){
            console.log('aaaaaaaaaaaaaaaaaaaaaa',data);
            MeStore.emit(Events.CHANGE_PWD, {
                detail: data.result 
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
            var data = JSON.parse(jqXHR.responseText);
            MeStore.emit(Events.CHANGE_PWD, data);
            MeStore.emit(Events.REQUEST_END, action);
        }
    });

}

// function doGET_DETAIL(action) {
    
//     var urll = URL.parse(dm.getUrl_home('/html/courses_index.html?courseType='+action.type+'#CRSPanelDetail'+ '-'+action.id), true);
//     var urlquery = dm.getCurrentUrlQuery();
//     window.location = URL.format(urll);
// }

// function doPRODUCT(action) {
    
//     var urll = URL.parse(dm.getUrl_home('/html/courses_index.html?courseType=product#CRSPanelProductLevelList'+ '-'+action.id), true); 
//     var urlquery = dm.getCurrentUrlQuery();
//     window.location = URL.format(urll);
// }

function doSEARCH_MyCENTER_RESULT(action){
    var url_userAction = dm.getUrl_api('/weixin/userAction');
    type=action.type;
    action_type=action.action_type;
    MeStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_userAction,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            type:action.type,
            action_type:action.action_type,
            limit:LIMIT,
            skip:0
        },
        dataType: 'json',
        success: function(data){
            resultdata = [];// clear arr
            if (data && data.result.reserve){
                _addSearchResults(data.result.reserve);
            } 
            if (data && data.result.enroll){
                _addSearchResults(data.result.enroll);
            } 
            if (data && data.result.collect){
                _addSearchResults(data.result.collect);
            } 
            if (data && data.result.join){
                _addSearchResults(data.result.join);
            } 
            MeStore.emit(Events.GET_LATEST_MyCENTER, {
                result: data.result,
                user:data.user
            }); 
            
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
          console.log('jqXHR:',textStatus);
           MeStore.emit(Events.REQUEST_END, {
            action:action,
            jqXHR:jqXHR
        });

        }
    });
     
}

function doSEARCH_MORE(action) {
    MeStore.emit(Events.REQUEST_START, action);
    var url_userAction = dm.getUrl_api('/weixin/userAction');
    jQuery.ajax({
        url: url_userAction,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            type:type,
            action_type:action_type,
            limit:LIMIT,
            skip: skiplength
        },
        dataType: 'json',
        success: function(data){
            var more_data = ((data && data.result) ? data.result : []);
            var listType;
            MeStore.emit(Events.REQUEST_END, action); 
            if(more_data.reserve) {//我的预约
                
                listType='reserve';
                _addSearchResults(more_data.reserve);
            }
            if(more_data.enroll) {//我要报名
               
                listType='enroll';
                _addSearchResults(more_data.enroll);
            }
            if(more_data.collect) {//我的收藏
                listType='collect';
                _addSearchResults(more_data.collect);
            }
            if(more_data.join) {//我看过的
                
                listType='join';
                _addSearchResults(more_data.join);
            }
            MeStore.emit(Events.SEARCH_RESULT_CHANGED, {
                result: resultdata.concat([]), //make sure view don't get previous reference
                actionType:type,
                listType:listType
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
            // console.error(jqXHR, textStatus, errorThrown.toString());
            MeStore.emit(Events.REQUEST_END, action); 
        }
    });
}

function doSEARCH_ORDER_RESULT(action){
    // console.log('doSEARCH_ORDER_RESULT');
    AppStore.emit(Events.REQUEST_START, action);
    var url_changePwd = dm.getUrl_api('/weixin/userOrder');
    jQuery.ajax({
        url: url_changePwd,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            limit:10,
            skip:0
        },
        dataType: 'json',
        success: function(data){
            result_order_data=[];
            if (data && data.results) {
                _addSearch_Order_Results(data.results);
            }
            MeStore.emit(Events.SEARCH_ORDER_DONE, {
                results: data.results 
            }); 
            AppStore.emit(Events.REQUEST_END, action);
            console.log('doSEARCH_ORDER_RESULT',data);
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           MeStore.emit(Events.REQUEST_END, action);
        }
    });
}
function doSEARCH_ORDER_RESULT_MORE(action){
    // console.log('doSEARCH_ORDER_RESULT_MORE',skip_order_length);
    var url_changePwd = dm.getUrl_api('/weixin/userOrder');
    MeStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_changePwd,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            limit:ORDER_LIMIT,
            skip:skip_order_length
        },
        dataType: 'json',
        success: function(data){
            var more_data = ((data && data.results) ? data.results : []);
            MeStore.emit(Events.REQUEST_END, action);
            if(more_data.length > 0) {
                _addSearch_Order_Results(more_data);
            }
            MeStore.emit(Events.SEARCH_ORDER_RESULT_MORE_DONE, {
                results: result_order_data.concat([])
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           MeStore.emit(Events.REQUEST_END, action);
        }
    });
}
var MeStore = assign({}, EventEmitter.prototype, {
	ActionTypes: ActionTypes,
    Events: Events,
    LIMIT: LIMIT,
    ORDER_LIMIT:ORDER_LIMIT,
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
module.exports = MeStore;



