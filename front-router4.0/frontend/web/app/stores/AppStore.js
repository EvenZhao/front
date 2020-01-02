var Dispatcher = require('../dispatcher/AppDispatcher.js');
var AuthStore = require('../stores/AuthStore.js')(Dispatcher);
var EventEmitter = require('events').EventEmitter;
var URL = require('url');
var querystring = require('querystring');
var assign = require('object-assign');
var keyMirror = require('keymirror');
var util = require('util'),
    f = util.format;

var dm = require('../util/DmURL');

var Events = keyMirror({
    GET_LOGIN_DONE: null,
    REQUEST_START: null,
    REQUEST_END: null,
    SET_TITLE: null
});

var ActionTypes = keyMirror({
    GET_LOGIN: null
});

function doGET_LOGIN(action){
    console.log('doGET_LOGIN');
    AuthStore.emit(AuthStore.Events.SC401);
}

var AppStore = assign({}, EventEmitter.prototype, {
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
module.exports = AppStore;


