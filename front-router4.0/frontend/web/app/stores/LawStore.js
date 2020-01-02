var AppDispatcher = require('../dispatcher/LawDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var keyMirror = require('keymirror');

var dm = require('../util/DmURL');
var dir_law = '/law';
var url_search = dm.getUrl_api(dir_law+'/search');
var url_prompt = dm.getUrl_api(dir_law+'/prompt');
var url_detail=dm.getUrl_api(dir_law+'/searchDetail');
var url_latest=dm.getUrl_api(dir_law+'/lastest10');

var Events = keyMirror({
    SEARCH_RESULT_CHANGED: null,
    GET_DETAIL_DONE: null,
    REQUEST_START: null,
    REQUEST_END: null,
    GET_LATEST_DONE: null,
    SEARCH_PROMPT_DONE: null,
    FILTERED: null
});

var ActionTypes = keyMirror({
    GET_DETAIL: null,
    SEARCH: null,
    SEARCH_MORE: null,
    GET_LATEST: null,
    SEARCH_PROMPT: null,
    FILTERING: null

});

var LIMIT = 15;
var resultdata = [];
var existIds = [];
var skiplength=0;
var keyWord='';
var filter='';

function _addSearchResults(more){
    more.forEach(function(item){
        if(item && item._id){
            existIds.push(item._id);
            if(!item._notfound) resultdata.push(item);
        }
    });
    skiplength=resultdata.length;
}

//# AJAX comm funcs ################
function do_GET_DETAIL(action) {
    LawStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_detail,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            _id: action._id,
            keyWord: keyWord
        },
        dataType: 'json',
        success: function(data){
            LawStore.emit(Events.REQUEST_END, action);
            LawStore.emit(Events.GET_DETAIL_DONE, {
                detail: data.result || {}
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
           // console.error(jqXHR, textStatus, errorThrown.toString());
           LawStore.emit(Events.REQUEST_END, action);
        }
    });
}

function do_SEARCH(action) {
    LawStore.emit(Events.REQUEST_START, action); 
    keyWord = action.keyWord;
    filter = action.filter;
    jQuery.ajax({
        url: url_search,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            keyWord: keyWord,
            filter: filter,
            limit: LIMIT
        },
        dataType: 'json',
        success: function(data){
            resultdata = [];// clear arr
            existIds = [];// clear arr
            if (data && data.result){
                _addSearchResults(data.result);
            } 
            // skiplength=resultdata.length;
            LawStore.emit(Events.REQUEST_END, action); 
            LawStore.emit(Events.SEARCH_RESULT_CHANGED, {
                results: resultdata.concat([]),
                keyWord: data.keyWords || keyWord,
                filter: filter
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
            // console.error(jqXHR, textStatus, errorThrown.toString());
            LawStore.emit(Events.REQUEST_END, action); 
        }
    });
}

function do_SEARCH_MORE(action) {
    LawStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_search,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            keyWord: keyWord,
            filter: filter,
            limit: LIMIT,
            skip: skiplength,
            existIds: (existIds && existIds.length>0) ? JSON.stringify(existIds) + '' : '[]'
        },
        dataType: 'json',
        success: function(data){
            var more_data = ((data && data.result) ? data.result : []);
            LawStore.emit(Events.REQUEST_END, action); 
            if(more_data.length > 0) {
                _addSearchResults(more_data);
            }
            LawStore.emit(Events.SEARCH_RESULT_CHANGED, {
                results: resultdata.concat([]), //make sure view don't get previous reference
                keyWord: data.keyWords || keyWord
            }); 
        },
        error: function(jqXHR, textStatus, errorThrown){
            // console.error(jqXHR, textStatus, errorThrown.toString());
            LawStore.emit(Events.REQUEST_END, action); 
        }
    });
}

function do_GET_LATEST(action){
    // LawStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_latest,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
        },
        dataType: 'json',
        success: function(data){
            var resultdata = (data && data.result && data.result.length > 0) ? data.result : [];
            // LawStore.emit(Events.REQUEST_END, action); 
            if(resultdata) {
                LawStore.emit(Events.GET_LATEST_DONE, {
                    results: resultdata
                }); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            // console.error(jqXHR, textStatus, errorThrown.toString());
            // LawStore.emit(Events.REQUEST_END, action); 
        }
    });
}

function do_SEARCH_PROMPT(action) {
    LawStore.emit(Events.REQUEST_START, action);
    jQuery.ajax({
        url: url_prompt,
        method: 'GET',
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded",
        data: {
            keyWord: '税务',
            limit: 5
        },
        dataType: 'json',
        success: function(data){
            var resultdata = (data && data.result && data.result.length > 0) ? data.result : [];
            LawStore.emit(Events.REQUEST_END, action); 
            if(resultdata.length > 0) {
                LawStore.emit(Events.SEARCH_PROMPT_DONE, {
                    words: resultdata
                }); 
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            // console.error(jqXHR, textStatus, errorThrown.toString());
            LawStore.emit(Events.REQUEST_END, action); 
        }
    });
}
//# end AJAX comm funcs #############

function doFILTERING(action){
    LawStore.emit(Events.FILTERED, action); 
}

// var fg_interval;

var LawStore = assign({}, EventEmitter.prototype, {
    ActionTypes: ActionTypes,
    Events: Events,
    LIMIT: LIMIT,
    addEventListener: function(eventName, callback) {
        this.on(eventName, callback);
    },
    removeEventListener: function(eventName, callback) {
        this.removeListener(eventName, callback);
    },
    dispatcherIndex: AppDispatcher.register(function(action) {
        switch (action.actionType) {
            case ActionTypes.GET_DETAIL:
                do_GET_DETAIL(action);
                break;
            case ActionTypes.SEARCH:
                do_SEARCH(action);
                break;
            case ActionTypes.SEARCH_MORE:
                do_SEARCH_MORE(action);
                break;
            case ActionTypes.GET_LATEST:
                do_GET_LATEST(action);
                break;
            case ActionTypes.SEARCH_PROMPT:
                do_SEARCH_PROMPT(action);
                break;
            case ActionTypes.FILTERING:
                doFILTERING(action);
                break;

                // add more cases for other actionTypes, like TODO_UPDATE, etc.
        }
        return true; // No errors. Needed by promise in Dispatcher.
    }.bind(this))

});

module.exports = LawStore;


