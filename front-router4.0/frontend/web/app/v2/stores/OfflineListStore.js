import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import { dm } from '../util/DmURL'

let param = {}
export function doOfflineList(action) {
  console.log('doOfflineList==', action);
  param = Object.assign({}, param, action.status);
  fetch(dm.getUrl_api(`/v2/offlineList`, { label_id: param.label_id, status: param.status, city_id: param.city_id, teacher_id: param.teacher_id, skip: param.skip, limit: param.limit, user_id: param.user_id || '' }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('OfflineListDone', json);
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      EventCenter.emit('OfflineListDone');
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

export function doOfflineListLoadMore(action) {
  var loadParam = {}
  loadParam = Object.assign({}, param, action.les_status);
  EventCenter.emit('CanNotLoad')
  fetch(dm.getUrl_api(`/v2/offlineList`, { label_id: loadParam.label_id, status: loadParam.status, city_id: loadParam.city_id, teacher_id: loadParam.teacher_id, skip: loadParam.skip, limit: loadParam.limit, user_id: loadParam.user_id || '' }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      var t = setInterval(() => {
        clearInterval(t)
        EventCenter.emit('OfflineListLoadMoreDone', json);
      }, 1000)
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      EventCenter.emit('OfflineListLoadMoreDone');
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

export function doOfflineDetail(action) {
  // fetch((`http://localhost:8000/v2/onlineDetail`, {id: action.id}), {
  fetch(dm.getUrl_api(`/v2/offlineDetail/${action.id}`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('OfflineDetailDone', json);
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      // EventCenter.emit('OfflineDetailDone');
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

//getOfflineAut 获取报名权限
/**
 * [dogetOfflineAuth description]
 * author markwang
 * version 2019-08-12T13:26:27+0800
 * blog https://www.qdfuns.com/u/26090.html
 * example no example
 * modification list xxxxxxxxxxx 新增 
                       2019-08-12 修改
 * @param {[type]} action [description]
 * @param {[type]} action.EnrollFlag 1:学习官报名
 * @return {[type]}
 */
export function dogetOfflineAuth(action) {
  // fetch((`http://localhost:8000/v2/onlineDetail`, {id: action.id}), {
  fetch(dm.getUrl_api(`/v2/getOfflineAuth/`, { resource_id: action.id, ids: action.ids }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      if (action.type && action.type == 'newEnroll') {
        EventCenter.emit('getOfflineAuthNewEnrollDone', json);
      } else {
        EventCenter.emit('getOfflineAuthDone', json);
      }
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      EventCenter.emit('getOfflineAuthDone');
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}


//getCompanyUsers
export function dogetCompanyUsers(action) {//getOfflineAut 获取报名权限
  // fetch((`http://localhost:8000/v2/onlineDetail`, {id: action.id}), {
  fetch(dm.getUrl_api(`/v2/getCompanyUsers/`, { resource_id: action.resource_id, type: action.actType }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('getCompanyUsersDone', json);
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      // console.log('json==========',ex);
      // EventCenter.emit('getCompanyUsersDone');
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}


export function doEnroll(action) {
  fetch(dm.getUrl_api(`/v2/enroll`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lesson_type: action.lesson_type,
      user_type: action.user_type,
      main_holder: action.main_holder,
      enroll_info: action.enroll_info,
      resource_id: action.resource_id,
      outOfAuth: action.outOfAuth
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('enrollDone', json);
      // EventCenter.emit("REQUEST_END", action);
    }).catch((ex) => {
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

export const OfflineListStore = {
  dispatcherIndex: Dispatcher.register((action) => {
    if (action.actionType) {
      if (eval("typeof " + 'do' + action.actionType) === 'function') {
        eval('do' + action.actionType).call(null, action);
      }
    }
    return true; // No errors. Needed by promise in Dispatcher.
  })
}
