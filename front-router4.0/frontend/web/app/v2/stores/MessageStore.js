import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'
var URL = require('url')

export function doredPoint(action) {
  fetch(dm.getUrl_api(`/v2/redPoint/`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('redPointDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doreadMessage(action) {
  fetch(dm.getUrl_api(`/v2/readMessage`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: action.id,
      type: action.type,
      action: action.action
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('readMessageDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function dogetMessageInfo(action) {
  EventCenter.emit('canNotLoad')
  fetch(dm.getUrl_api(`/v2/getMessageInfo/`,{type:action.type,limit:action.limit,skip:action.skip}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (action.loadmore) {
      EventCenter.emit('getMessageInfoLoadMoreDone', json);
    }else {
      EventCenter.emit('getMessageInfoDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//消息详情 getMessageDetail
export function doGetMessageDetail(action) {
  EventCenter.emit('canNotLoad')
  fetch(dm.getUrl_api(`/v2/getMessageDetail/`,{id:action.id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('GetMessageDetailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


export const MessageStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
