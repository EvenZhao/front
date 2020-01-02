var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var keyMirror = require('keymirror');
var dm = require('../util/DmURL.js');
var dtfmt = require('../util/format.js');
// var nf = require('../util/notify.js');
var Events = keyMirror({
    CHANGE: null,
    NoSuchUser: null,
    UserExist: null,
    RegisterCodeSent: null,
    UserAdded: null
});
var ActionTypes = keyMirror({
	CheckUserIsExist: null,
	GetRegisterCode: null,
	AddUser: null
});
var msgdelay=5000;
function getRegisterCode(user){
    jQuery.ajax({
        url: dm.getUrl_api('/users/getRegisterCode'),
        method: 'GET',
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        data: user,
        dataType: 'json',
        success: function(data){
            if (data && data.success===true) {
                // var msg = 'Responsed ' + new Date().format(dtfmt.TMSTAMP);
                // console.log(msg);
                // nf.showWarning(msg, msgdelay);
                RegisterStore.emitRegisterCodeSent(true);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            RegisterStore.emitRegisterCodeSent(false);
        }
    });  
    // var msg = 'Requested ' + new Date().format(dtfmt.TMSTAMP);
    // console.log(msg);
    // nf.showWarning(msg, msgdelay);
}

function checkUserIsExist(user){ //user =  {"telephone":phone};
    jQuery.ajax({
	   url: dm.getUrl_api('/users/checkUserIsExist'),
	   method: 'GET',
	   crossDomain: true,
	   contentType:'application/json;charset=utf-8',
	   data: user,
	   dataType: 'json',
	   success: function(data){
			if (data && data.success===false) {
				RegisterStore.emitNoSuchUser();
			}else{
				RegisterStore.emitUserExist();
			}
	   } 
    });
   
}

function addUser(user){
    jQuery.ajax({
        url: dm.getUrl_api('/users/addUser'),
        method: 'POST',
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(user),
        dataType: 'json',
        success: function(data){
        	if (data && data.success===true) {
	        	RegisterStore.emitUserAdded(true);
        	}else{
        		var err_msg = data.err_msg || '注册功能暂时不可用';
        		RegisterStore.emitUserAdded(false, err_msg);
        	}
        }
    });
}

var RegisterStore = assign({}, EventEmitter.prototype, { 
    ActionTypes: ActionTypes,
    Events: Events,

    //callback to UserExist
    emitUserExist: function(){
        this.emit(Events.UserExist);
    },
	addUserExistListener: function(callback) {
        this.on(Events.UserExist, callback);
    },
    removeUserExistListener: function(callback) {
        this.removeListener(Events.UserExist, callback);
    },
    //callback to NoSuchUser
    emitNoSuchUser: function(){
        this.emit(Events.NoSuchUser);
    },
	addNoSuchUserListener: function(callback) {
        this.on(Events.NoSuchUser, callback);
    },
    removeNoSuchUserListener: function(callback) {
        this.removeListener(Events.NoSuchUser, callback);
    },
    //callback to RegisterCodeSent
    emitRegisterCodeSent: function(isSent){
        this.emit(Events.RegisterCodeSent, isSent);
    },
	addRegisterCodeSentListener: function(callback) {
        this.on(Events.RegisterCodeSent, callback);
    },
    removeRegisterCodeSentListener: function(callback) {
        this.removeListener(Events.RegisterCodeSent, callback);
    },
    //callback to UserAdded
    emitUserAdded: function(success, err_msg){
        this.emit(Events.UserAdded, success, err_msg);
    },
	addUserAddedListener: function(callback) {
        this.on(Events.UserAdded, callback);
    },
    removeUserAddedListener: function(callback) {
        this.removeListener(Events.UserAdded, callback);
    },

    dispatcherIndex: AppDispatcher.register(function(action) {
      switch(action.actionType) {
        case ActionTypes.CheckUserIsExist:
            checkUserIsExist(action.user);
            break;
        case ActionTypes.GetRegisterCode:
            getRegisterCode(action.user);
            break;
        case ActionTypes.AddUser:
            addUser(action.user);
            break;
        

        // add more cases for other actionTypes, like TODO_UPDATE, etc.
      }
      return true; // No errors. Needed by promise in Dispatcher.
    }.bind(this))

});

module.exports = RegisterStore;
