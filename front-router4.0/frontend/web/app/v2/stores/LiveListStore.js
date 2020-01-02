import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

let param = {}
export function doLiveList(action) {
  param = Object.assign({}, param, action.les_status);
  fetch(dm.getUrl_api(`/v2/liveList`,{label_id: param.label_id, live_status: param.live_status, teacher_id: param.teacher_id, live_series: param.live_series, new_live_status: param.new_live_status, skip: param.skip, limit: param.limit,user_id: param.user_id || ''}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('LiveListDone', Object.assign({}, json, {fetchNum: action.les_status.fetchNum} ));
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('LiveListDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doLiveListLoadMore(action) {
  var loadParam = {}
  loadParam = Object.assign({}, param, action.les_status);
  EventCenter.emit('CanNotLoad')
  fetch(dm.getUrl_api(`/v2/liveList`,{label_id: loadParam.label_id, live_status: loadParam.live_status, teacher_id: loadParam.teacher_id, live_series: loadParam.live_series, new_live_status: loadParam.new_live_status, skip: loadParam.skip, limit: loadParam.limit,user_id:loadParam.user_id || ''}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    var t = setInterval(() => {
      clearInterval(t)
      EventCenter.emit('LiveListLoadMoreDone', json);
    }, 1000)
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('LiveListLoadMoreDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doLiveDetail(action) {
  // fetch((`http://localhost:8000/v2/onlineDetail`, {id: action.id}), {
  fetch(dm.getUrl_api(`/v2/liveDetail/${action.id}`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {

    EventCenter.emit('LiveDetailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('LiveDetailDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//直播课预约详情
export function doMyReserveDetail(action) {
  fetch(dm.getUrl_api(`/v2/myReserveDetail`,{resource_id:action.resource_id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('MyReserveDetailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('MyReserveDetailDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const LiveListStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
