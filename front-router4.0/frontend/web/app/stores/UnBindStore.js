var Dispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var keyMirror = require('keymirror');
var util =  require('util'),
    f = util.format;

var dm = require('../util/DmURL');
var UnBindStore = require('../stores/UnBindStore.js');
var URL = require('url');

var Events = keyMirror({
    REQUEST_START: null,
    REQUEST_END: null,
    CHANGE_PWD:null,
    BIND_DONE:null,
    REGISTER_DONE:null,
    GET_REGISTER_CODE_DONE:null,
    TEST_BIND_DONE:null,
    REGISTER_ERROE:null,
    SHOW_USER_DONE:null,
    UNBIND_DONE:null

});

var ActionTypes = keyMirror({
    CHANGE_PASSWORD:null,
    SEARCH_ORDER_RESULT:null,
    BIND:null,
    REGISTER:null,
    GET_REGISTER_CODE:null,
    TEST_BIND:null,
    SHOW_USER:null,
    UNBIND:null

});

var LIMIT = 10;
var ORDER_LIMIT=10;
var result_order_data=[];
var resultdata = [];
var skiplength=0;
var skip_order_length=0;
var type='';
var action_type='';

function doSHOW_USER(action){
    console.log('doTEST_BIND');
    var url_showUser = dm.getUrl_api('/weixin/showUser');
    UnBindStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_showUser,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            
        },
        dataType: 'json',
        success: function(data){
            UnBindStore.emit(Events.SHOW_USER_DONE, {
                user: data.user 
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());

           UnBindStore.emit(Events.REQUEST_END, action);
        }
    });
}

// function doUNBIND(action){
//     console.log('doTEST_BIND');
//     var url_unBind = dm.getUrl_api('/weixin/unBind');
//     UnBindStore.emit(Events.REQUEST_START, action);
//     jQuery.ajax({
//         url: url_unBind,
//         method: 'POST',
//         crossDomain: true,
//         contentType: "application/x-www-form-urlencoded",
//         data: {
            
//         },
//         dataType: 'json',
//         success: function(data){
//             UnBindStore.emit(Events.UNBIND_DONE, {
//                 detail: data.result
//             }); 
//         },
//         error: function(jqXHR, textStatus, errorThrown){
//            // console.error(jqXHR, textStatus, errorThrown.toString());
//            var data = JSON.parse(jqXHR.responseText);
//            UnBindStore.emit(Events.UNBIND_DONE, data);
//            UnBindStore.emit(Events.REQUEST_END, action);
//         }
//     });
// }


// function doBIND(action){
//     console.log('doBIND');
//     var url_bind = dm.getUrl_api('/weixin/bind');
//     UnBindStore.emit(Events.REQUEST_START, action);
//     jQuery.ajax({
//         url: url_bind,
//         method: 'GET',
//         crossDomain: true,
//         contentType: "application/x-www-form-urlencoded",
//         data: {
//             userName:action.userName,
//             pw:action.pw
//         },
//         dataType: 'json',
//         success: function(data){
//             if(data && data.user){
//                 UnBindStore.emit(Events.BIND_DONE, {
//                     user: data.user ,
//                     iserror: !data.user.isBinded
//                 }); 
//             }else{
//                 this.error();
//             }
//         },
//         error: function(jqXHR, textStatus, errorThrown){
//            // console.error(jqXHR, textStatus, errorThrown.toString());
//            var data = JSON.parse(jqXHR.responseText);
//            UnBindStore.emit(Events.BIND_DONE, data);
//         }
//     });
// }

// function doREGISTER(action){
//     console.log('doREGISTER');
//     var url_register = dm.getUrl_api('/weixin/register');
//     UnBindStore.emit(Events.REQUEST_START, action);
//     jQuery.ajax({
//         url: url_register,
//         method: 'GET',
//         crossDomain: true,
//         contentType: "application/x-www-form-urlencoded",
//         data: {
//             userName:action.userName,
//             registerCode:action.registerCode,
//             pw:action.pw
//         },
//         dataType: 'json',
//         success: function(data){
//             console.log('data',data);
//             if(data && data.result){
//                 UnBindStore.emit(Events.REGISTER_DONE, {
//                     user: data.user,
//                     iserror: !data.user.isRegistered
//                 });
//             }else{
//                 this.error();
//             }
//         },
//         error: function(jqXHR, textStatus, errorThrown){
//            // console.error(jqXHR, textStatus, errorThrown.toString());
//            var data = JSON.parse(jqXHR.responseText);
//            UnBindStore.emit(Events.REGISTER_DONE, data);
//         }
//     });
// }

// function doGET_REGISTER_CODE(action){
//     console.log('doGetRegisterCode');
//     var url_registerCode = dm.getUrl_api('/weixin/registerCode');
//     UnBindStore.emit(Events.REQUEST_START, action);
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
//             UnBindStore.emit(Events.GET_REGISTER_CODE_DONE, {
//                 detail: data.result 
//             }); 
//         },
//         error: function(jqXHR, textStatus, errorThrown){
//            // console.error(jqXHR, textStatus, errorThrown.toString())
//            var data = JSON.parse(jqXHR.responseText);
//            UnBindStore.emit(Events.GET_REGISTER_CODE_DONE, data);
//         }
//     });
// }
// function doCHANGE_PASSWORD(action){
//     console.log('doCHANGE_PASSWORD',action);
//     var url_changePwd = dm.getUrl_api('/weixin/changePw');
//     UnBindStore.emit(Events.REQUEST_START, action);
//     jQuery.ajax({
//         url: url_changePwd,
//         method: 'GET',
//         crossDomain: true,
//         contentType: "application/x-www-form-urlencoded",
//         data: {
//             oldPw:action.oldPw,
//             newPw:action.newPw
//         },
//         dataType: 'json',
//         success: function(data){
//             UnBindStore.emit(Events.CHANGE_PWD, {
//                 detail: data.result 
//             }); 
//         },
//         error: function(jqXHR, textStatus, errorThrown){
//            // console.error(jqXHR, textStatus, errorThrown.toString());
//             var data = JSON.parse(jqXHR.responseText);
//             UnBindStore.emit(Events.CHANGE_PWD, data);
//             UnBindStore.emit(Events.REQUEST_END, action);
//         }
//     });

// }

var UnBindStore = assign({}, EventEmitter.prototype, {
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
module.exports = UnBindStore;



