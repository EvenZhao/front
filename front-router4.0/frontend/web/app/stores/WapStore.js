var Dispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var keyMirror = require('keymirror');
var util =  require('util'),
    f = util.format;
var AppStore = require('./AppStore.js');
var dm = require('../util/DmURL');
var WapStore = require('../stores/WapStore.js');
var URL = require('url');

var Events = keyMirror({
    REQUEST_START: null,
    REQUEST_END: null,
    SERVER_ERROR: null,
    WAP_GET_LIVE_DONE: null,
    GET_USERINFO_DONE: null,
    GET_ACCOUNT_DONE: null,
    GET_LESSON_DONE: null,
    CHANGE_USERINFO_DONE: null,
    GET_SIGN_IN_DONE: null,
    CHANGE_USERIMAGE_DONE: null,
    GET_PASSWORD_DONE: null,
    LOG_OUT_DONE: null,
    WAP_CHANGE_ONLICE_TYPE_DONE: null,
    WAP_SEARCH_DONE: null,
    WAP_CHANGE_SEARCH_TYPE_DONE: null,
    WAP_SEARCH_MORE_DONE: null,
    WAP_LOGIN_DONE: null,
    WAP_UNLOGIN_DONE:null,
    WAP_CATALOG_NUM_DONE: null,
    WAP_MYCONPON_DONE: null,
    SHOW_DIV_DONE: null,
    ADD_COUPONS_DONE: null,
    GET_WAP_REGISTER_CODE_DONE: null,
    WAP_REGISTER_DONE: null,
    SIGN_DONE: null,
    SIGN_STATUS_DONE: null,
    SIGN_NO_DONE:null
});

var ActionTypes = keyMirror({
    WAP_GET_LIVE: null,
    GET_USERINFO: null,
    GET_ACCOUNT: null,
    GET_LESSON: null,
    CHANGE_USERINFO: null,
    GET_SIGN_IN: null,
    CHANGE_USERIMAGE: null,
    GET_PASSWORD: null,
    LOG_OUT: null,
    WAP_CHANGE_ONLICE_TYPE: null,
    WAP_SEARCH: null,
    WAP_CHANGE_SEARCH_TYPE: null,
    WAP_SEARCH_MORE: null,
    WAP_LOGIN: null,
    WAP_CATALOG_NUM: null,
    WAP_MYCONPON: null,
    SHOW_DIV: null,
    ADD_COUPONS: null,
    GET_WAP_REGISTER_CODE: null,
    WAP_REGISTER: null,
    SIGN: null,
    SIGN_STATUS:null,
    SIGN_NO:null
});
var LIMIT = 10;
var skiplength=0;
var resultdata = [];
var WapSearchkeyWord;
var WapSearchType;

function doWAP_MYCONPON(action){
    // console.log('doWAP_MYCONPON',action);
        var url = dm.getUrl_api('/weixin/resourceCode');
    // WapStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {

        },
        dataType: 'json',
        success: function(data){
            // console.log('doWAP_MYCONPON success',data);
            WapStore.emit(Events.WAP_MYCONPON_DONE, data); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           if(jqXHR.status === 500){
               var data = JSON.parse(jqXHR.responseText);
               WapStore.emit(Events.WAP_MYCONPON_DONE, data);
           }
           // WapStore.emit(Events.REQUEST_END, action);
        }
    });
}
//个人中心个人信息
function doGET_USERINFO(action){
    // console.log('doGET_USERINFO');
    var url = dm.getUrl_api('/wap/center_wap');
    // WapStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {

        },
        dataType: 'json',
        success: function(data){
            WapStore.emit(Events.GET_USERINFO_DONE, data); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           if(jqXHR.status === 500){
               var data = JSON.parse(jqXHR.responseText);
               WapStore.emit(Events.GET_USERINFO_DONE, data);
           }
           // WapStore.emit(Events.REQUEST_END, action);
        }
    });
}

//账户管理个人信息
function doGET_ACCOUNT(action){
    var url = dm.getUrl_api('/wap/accountManager_wap');
    // console.log('doGET_ACCOUNT');
    // WapStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            // openid: "wapCode",
            // wapCode: "56a5b8e76dc029f61b94753e,LIFSY5"
        },
        dataType: 'json',
        success: function(data){
            WapStore.emit(Events.GET_ACCOUNT_DONE, data);
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           if(jqXHR.status === 500){
               var data = JSON.parse(jqXHR.responseText);
               WapStore.emit(Events.GET_ACCOUNT_DONE, data);
           }
           // WapStore.emit(Events.REQUEST_END, action);
        }
    });
}

//修改个人信息
function doCHANGE_USERINFO(action){
    // console.log('22222222222CHANGE_USERINFO',action);
    var url = dm.getUrl_api('/wap/updateUserInfo_wap');
    WapStore.emit(Events.REQUEST_START, action);
    // console.log('CHANGE_USERINFO',action);
    var nick_name = action.nick_name;
    var name = action.name;
    var company = action.company;
    var position = action.position;
    //上方数据均从jsx获取，若为空则无法提交
    if(nick_name === '' || name === '' || company === '' || position === ''){
        return;
    }
    var postdata = {
        nick_name: action.nick_name,
        name: action.name,
        company: action.company,
        position: action.position
    };
    jQuery.ajax({
        url: url,
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify(postdata),
        dataType: 'json',
        success: function(data){
            if(data.err){
                // console.log('doCHANGE_USERINFO', data.err);
                return;
            }
            var result = data.result
            if(data && result && result.isUpdated) {
                data.result = postdata;
                WapStore.emit(Events.CHANGE_USERINFO_DONE, data);
                // console.log('CHANGE_USERINFO_DONE',data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           var data = JSON.parse(jqXHR.responseText);
           WapStore.emit(Events.REQUEST_END, action);
        }
    });
}

//修改头像
function doCHANGE_USERIMAGE(action){
    // console.log("doCHANGE_USERIMAGE!!!!!!!!!!!!!!!",action);
    var url = dm.getUrl_api('/wap/updateUserImage_wap');
    AppStore.emit(Events.REQUEST_START, action);
    //获取文件值
    var file = action.files[0];
    var fileName = file.name;
    var fileSize = file.size;
    //获取后缀并附上图片提交限制
    var postfix = fileName.split(".")[1].toLowerCase();
    // console.log('postfix',postfix);
    if(postfix !== 'png' && postfix !== 'jpg' && postfix !== 'jpeg' || fileSize > 3*1024*1024){
        return;
        // console.log('err',postfix,fileSize);
    }
    var formdata = new FormData();
    formdata.append('file', file);
    // console.log('file',file);
    // console.log('formdata', formdata);
    jQuery.ajax({
        url: url,
        method: 'POST',
        crossDomain: true,
        cache: false,
        processData: false,
        contentType: false,
        // contentType: 'multipart/form-data; boundary='+formdata.boundary,
        // contentLength: file.size,
        data: formdata,
        dataType: 'json',
        success: function(data){
            AppStore.emit(Events.REQUEST_END, action);
            // console.log('data',data);
            if(data.err){
                console.log('doCHANGE_USERIMAGE', data.err);
                return;
            }
            if(data && data.result) {
                WapStore.emit(Events.CHANGE_USERIMAGE_DONE, data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
            if(jqXHR.status === 500){ 
                var data = JSON.parse(jqXHR.responseText);
                // console.log("data",data);
                alert("服务器报错请稍后重试并刷新页面");
                if(data.err){
                    console.log('doCHANGE_USERIMAGE', data.err);
                }
            }
            WapStore.emit(Events.REQUEST_END, action);
        }
    });
}

//跳转修改密码页面
function doGET_PASSWORD(action){
    // console.log('doGET_PASSWORD');
    var url = dm.getUrl_api('/weixin/showUser');
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        // data: {
        //     // openid: "wapCode",
        //     // wapCode: "56a5b8e76dc029f61b94753e,LIFSY5"
        // },
        dataType: 'json',
        success: function(data){
            WapStore.emit(Events.GET_PASSWORD_DONE, data);
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
            if(jqXHR.status === 500){
                var data = JSON.parse(jqXHR.responseText);
                console.log("data",data);
                alert("服务器报错请稍后重试并刷新页面");
            }
           WapStore.emit(Events.REQUEST_END, action);
        }
    });
}

//注销
function doLOG_OUT(action){
    // console.log('doLOG_OUT',action);
    var url = dm.getUrl_api('/wap/logout_wap');
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data:{

        },
        dataType: 'json',
        success: function(data){
            // WapStore.emit(Events.LOG_OUT_DONE, data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            // console.log("!!!!!!!!!!!!!!!!!!!!!!",jqXHR,textStatus,errorThrown);
            if(jqXHR.status === 403){
                var data = JSON.parse(jqXHR.responseText);
                // var urll = URL.parse(dm.getUrl_home('/html/index.html?currentPg=Pg_web_index'), true);
                // window.location = URL.format(urll);
                // console.log("data",data);
                alert("注销成功");
            }
            if(jqXHR.status === 500){
                var data = JSON.parse(jqXHR.responseText);
                console.log("data",data);
                alert("注销失败，当前账号未登录");
            }
            WapStore.emit(Events.REQUEST_END, action);
        }
    });
}

//点击新增优惠券出现遮罩层等
function doSHOW_DIV(action){
    WapStore.emit(Events.SHOW_DIV_DONE,action);
}

function flightHandler(jsonData){
    console.log('jsonp-data',jsonData);
}

function doSIGN_STATUS(action){
    var url = dm.getUrl_api('/wap/has-sign');
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data:{
            activityCode:action.activityCode,
            accountId:action.accountId,
            accountLevel:action.accountLevel
        },
        dataType: 'json',
        success: function(data){
            // WapStore.emit(Events.LOG_OUT_DONE, data);
            WapStore.emit(Events.SIGN_STATUS_DONE, data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            // console.log("!!!!!!!!!!!!!!!!!!!!!!",jqXHR,textStatus,errorThrown);
            var data = JSON.parse(jqXHR.responseText);
           // console.log('ssssssssss',data);
           WapStore.emit(Events.SIGN_STATUS_DONE, data);
        }
    });
}

function doSIGN_NO(action){
    WapStore.emit(Events.SIGN_NO_DONE,action);
}
function doSIGN(action){
     var url = dm.getUrl_api('/wap/do-sign');
    console.log('doSIGN_STATUS',action);
    WapStore.emit(Events.ADD_COUPONS_DONE,action);
    jQuery.ajax({
        url: url,
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data:JSON.stringify({
            //优惠券码
            activityCode:action.activityCode,
            accountId:action.accountId,
            accountLevel:action.accountLevel
        }),
        dataType: 'json',
        success: function(data){
            console.log('doSIGN_STATUS-data',data);
            // console.log('addddddddddddd',data);
            WapStore.emit(Events.SIGN_DONE, data); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           var data = JSON.parse(jqXHR.responseText);
           // console.log('ssssssssss',data);
           WapStore.emit(Events.SIGN_DONE, data);
        }
    });
    // WapStore.emit(Events.SIGN_DONE,action);
}

//新增优惠券
function doADD_COUPONS(action){
    var url = dm.getUrl_api('/weixin/resourceCode');
    // console.log('doTEST_BINDssss',action);
    WapStore.emit(Events.ADD_COUPONS_DONE,action);
    jQuery.ajax({
        url: url,
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data:JSON.stringify({
            //优惠券码
            discountCode: action.coupons
        }),
        dataType: 'json',
        success: function(data){
            // console.log('addddddddddddd',data);
            WapStore.emit(Events.ADD_COUPONS_DONE, data); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           var data = JSON.parse(jqXHR.responseText);
           // console.log('ssssssssss',data);
           WapStore.emit(Events.ADD_COUPONS_DONE, data);
        }
    });
}

function doWAP_CATALOG_NUM(action){
    // console.log('doWAP_CATALOG_NUM',action);
    WapStore.emit(Events.WAP_CATALOG_NUM_DONE, action);
}

function _addSearchResults(more){
    more.forEach(function(item){
        if(item && item.ori && item.ori.id){
            resultdata.push(item);
        }
    });
    skiplength=resultdata.length;
    console.log('skiplength',skiplength);
}

function doWAP_LOGIN(action){
    // console.log('doWAP_LOGIN');
    //TODO: remove localstore
    // localStorage.removeItem('credentials.code');
    // localStorage.removeItem('credentials.openid');
    var url_register = dm.getUrl_api('/wap/login_wap');
    WapStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_register,
        method: 'POST',
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
            userName:action.userName,
            pw:action.pw
        }),
        dataType: 'json',
        success: function(data){
            // console.log('data',data);
            if(data && data.result && data.result.wapCode){
                localStorage.setItem("credentials.code", data.result.wapCode);
                localStorage.setItem("credentials.openid", data.result.openid || "wapCode");
                WapStore.emit(Events.WAP_LOGIN_DONE, {
                    user: data.user
                });
            }else{
                this.error();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           var data = JSON.parse(jqXHR.responseText);
           WapStore.emit(Events.WAP_LOGIN_DONE, data);
        }
    });
}

function doGET_WAP_REGISTER_CODE(action){
    // console.log('doGetRegisterCode');
    var url_registerCode = dm.getUrl_api('/weixin/registerCode');
    AppStore.emit(AppStore.Events.REQUEST_START, action);
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
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            WapStore.emit(Events.GET_WAP_REGISTER_CODE_DONE, {
                detail: data.result 
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
           // console.error(jqXHR, textStatus, errorThrown.toString())
            if(jqXHR.status === 500){ 
                var data = JSON.parse(jqXHR.responseText);
                WapStore.emit(Events.GET_WAP_REGISTER_CODE_DONE, data);
            }
        }
    });
}

function doWAP_REGISTER(action){
    // console.log('doREGISTER');
    var url_register = dm.getUrl_api('/weixin/register');
    AppStore.emit(AppStore.Events.REQUEST_START, action);
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
            AppStore.emit(AppStore.Events.REQUEST_END, action);
            if (!isWeiXin) {
                localStorage.setItem("credentials.code", data.result.wapCode);
                localStorage.setItem("credentials.openid", data.result.openid || "wapCode");
                WapStore.emit(Events.WAP_REGISTER_DONE, data);
            }
            if(data && data.user && data.user.isBinded && isWeiXin){
                WapStore.emit(Events.WAP_REGISTER_DONE, data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            AppStore.emit(AppStore.Events.REQUEST_END, action);
           // console.error(jqXHR, textStatus, errorThrown.toString());
            if(jqXHR.status === 500){ 
                var data = JSON.parse(jqXHR.responseText);
                WapStore.emit(Events.WAP_REGISTER_DONE, data);
            }
        }
    });
}
function doWAP_CHANGE_SEARCH_TYPE(action){
    WapStore.emit(Events.WAP_CHANGE_SEARCH_TYPE_DONE, action);
}

function doWAP_CHANGE_ONLICE_TYPE(action){
    // console.log('actionggggggggggggggggg',action);
    WapStore.emit(Events.WAP_CHANGE_ONLICE_TYPE_DONE, action);
}
function doWAP_SEARCH_MORE(action){
    // console.log('doWAP_SEARCH_MORE');
    // var url = dm.getUrl_api('/wap/index_wap');
    // var url = 'http://wechatnd01.linked-f.cn:4444/search/searchByKeyWord'
    var url = dm.getUrl_api('/searchForWeb/search/searchByKeyWord');
    WapStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            keyWord: WapSearchkeyWord,
            searchType: WapSearchType,
            limit:LIMIT,
            skip: skiplength
        },
        dataType: 'json',
        success: function(data){
            WapStore.emit(Events.REQUEST_END, action);
            // console.log('sssssssssssssssssssssss',data);
            if (data && data.content.live) {
                _addSearchResults(data.content.live);
            }
            if (data && data.content.offline) {
                _addSearchResults(data.content.offline);
            }
            if (data && data.content.online) {
                _addSearchResults(data.content.online);
            }
            if (data) {
                WapStore.emit(Events.WAP_SEARCH_MORE_DONE, {
                    resultdata: resultdata,
                    WapSearchMoreType: WapSearchType,
                    skip: skiplength
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           if(jqXHR.status === 500){
               var data = JSON.parse(jqXHR.responseText);
               WapStore.emit(Events.SHOW_USER_DONE, {data: data,keyWords: action.keyWords});
           }
           // WapStore.emit(Events.REQUEST_END, action);
        }
    });

}
function doWAP_SEARCH(action){
    // console.log('doWAP_SEARCH');
    WapSearchkeyWord = action && action.keyWord ? action.keyWord :'';
    WapSearchType = action && action.searchType ? action.searchType :'';
    // var url = dm.getUrl_api('/wap/index_wap');
    // var url = 'http://wechatnd01.linked-f.cn:4444/search/searchByKeyWord'
    var url = dm.getUrl_api('/searchForWeb/search/searchByKeyWord');
    WapStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            keyWord: action.keyWord,
            searchType: action.searchType,
            limit:LIMIT,
            skip:0
        },
        dataType: 'json',
        success: function(data){
            WapStore.emit(Events.REQUEST_END, action);
            // console.log('kkkkkkkkkkkkkkkkkkkkk',data);
            resultdata = [];
            if (data && data.content.live) {
                _addSearchResults(data.content.live);
            }
            if (data && data.content.offline) {
                _addSearchResults(data.content.offline);
            }
            if (data && data.content.online) {
                _addSearchResults(data.content.online);
            }
            if (data) {
                WapStore.emit(Events.WAP_SEARCH_DONE, {
                    data:data,
                    keyWord:action.keyWord
                }); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           if(jqXHR.status === 500){
               var data = JSON.parse(jqXHR.responseText);
               WapStore.emit(Events.SHOW_USER_DONE, {data: data,keyWords: action.keyWords});
           }
           // WapStore.emit(Events.REQUEST_END, action);
        }
    });

}
function doWAP_GET_LIVE(action){
    // console.log('doWAP_GET_LIVE',action);
    var url = dm.getUrl_api('/wap/index_wap');
    // WapStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {},
        dataType: 'json',
        success: function(data){
            // console.log("data!!!!!!!!!!!!!!!!!",data);
            if (data && data.result) {
                WapStore.emit(Events.WAP_GET_LIVE_DONE, data); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           if(jqXHR.status === 500){
               var data = JSON.parse(jqXHR.responseText);
               WapStore.emit(Events.SHOW_USER_DONE, data);
           }
           // WapStore.emit(Events.REQUEST_END, action);
        }
    });

    // var results =[
    //     {
    //         associations: [{id: 1, name: "ACCA"}],
    //         authority: "ready",
    //         brief_image: "http://www.linked-f.com/resourceimages/8df783dc6b13432a9db616a164264043.png",
    //         charge_type: "1",
    //         id: 159,
    //         isCollected: false,
    //         isFree: false,
    //         learn_num: 6345,
    //         level_num: 8,
    //         course_num: 24, 
    //         title: "财务团队绩效管理最佳实践",
    //         type: "live_info"
    //     },
    //     {
    //         associations: [{id: 1, name: "ACCA"}],
    //         authority: "ready",
    //         brief_image: "http://www.linked-f.com/resourceimages/201506131653180114.png",
    //         charge_type: "1",
    //         id: 2,
    //         isCollected: false,
    //         isFree: false,
    //         learn_num: 6345,
    //         level_num: 91,
    //         course_num: 23, 
    //         title: "财务团队绩效管理最佳实践",
    //         type: "live_info"
    //     },
    //     {
    //         associations: [{id: 1, name: "ACCA"}],
    //         authority: "ready",
    //         brief_image: "http://www.linked-f.com/resourceimages/201506131653180114.png",
    //         charge_type: "1",
    //         id: 3,
    //         isCollected: false,
    //         isFree: false,
    //         learn_num: 6345,
    //         level_num: 91,
    //         course_num: 23, 
    //         title: "财务团队绩效管理最佳实践",
    //         type: "live_info"
    //     },
    //     {
    //         associations: [{id: 1, name: "ACCA"}],
    //         authority: "ready",
    //         brief_image: "http://www.linked-f.com/resourceimages/201506131653180114.png",
    //         charge_type: "1",
    //         id: 36,
    //         isCollected: false,
    //         isFree: false,
    //         learn_num: 6345,
    //         level_num: 91,
    //         course_num: 23, 
    //         title: "财务团队绩效管理最佳实践",
    //         type: "live_info"
    //     }
        
    // ];
    // var result ={results};
    // console.log('results',result);
    // WapStore.emit(Events.WAP_GET_LIVE_DONE, result); 
    // console.log('doGET_LIVE');
}


var WapStore = assign({}, EventEmitter.prototype, {
	ActionTypes: ActionTypes,
    Events: Events,
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
module.exports = WapStore;



