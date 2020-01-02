import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import { dm } from '../util/DmURL'



/**
 * 会员电话答疑呼叫接口
 * @param {*} action 
 */
export function doCallAnswerSaveRemark(action) {
  fetch(dm.getUrl_api(`/v2/callAnswerSaveRemark`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: action.id,//商品ID
      remarkStatus: action.remarkStatus,
      remark: action.remark,
    })
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('CallAnswerSaveRemark', json);
    }).catch((ex) => {
      EventCenter.emit('CallAnswerSaveRemark', { err: '请检查网络！' });
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}


/**
 * 会员电话答疑呼叫接口
 * @param {*} action 
 */
export function doCallAnswerMakeCall(action) {
  fetch(dm.getUrl_api(`/v2/callAnswerMakeCall`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      callRole: action.callRole,//商品ID
      callerNum: action.callerNum,
      callAnswerId: action.callAnswerId,
      expertId: action.expertId,
      callDirection: action.callDirection
    })
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('CallAnswerMakeCall', json);
    }).catch((ex) => {
      EventCenter.emit('CallAnswerMakeCall', { err: '请检查网络！' });
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

/**
 * 用户端咨询记录数据接口
 * @param {*} action 
 */
export function doCallAnswerRecordsUser(action) {
  fetch(dm.getUrl_api(`/v2/callAnswerRecordsUser`,
    {
      status: action.status,
      skip: action.skip,
      limit: action.limit,
      // ...action.params
    }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('CallAnswerRecordsUser', json);
    }).catch((ex) => {
      EventCenter.emit('CallAnswerRecordsUser', { "err": "请检查网络！" });
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

/**
 * 会员专家电话答疑专家列表页数据接口
 * @param {*} action 
 */
export function doCallAnswerExpertList(action) {
  fetch(dm.getUrl_api(`/v2/callAnswerExpertList`,
    {
      direction: action.direction,
      skip: action.skip,
      limit: action.limit,
      // ...action.params
    }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('CallAnswerExpertList', json);
    }).catch((ex) => {
      EventCenter.emit('CallAnswerExpertList', { "err": "请检查网络！" });
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}
/**
 * 会员电话答疑(专家端)列表
 */

export function doPATeacherList(action) {
  console.log('doPATeacherList==', action);
  let param = Object.assign({}, action.status);
  fetch(dm.getUrl_api(`/v2/callAnswerRecordsExpert `, { status: param.status, skip: param.skip, limit: param.limit }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('TeacherListDone', json);
      // EventCenter.emit('TeacherListDone', {result:{list:[1, 1, 1, 1, 1, 1]}});
    }).catch((ex) => {
      EventCenter.emit('TeacherListDone', { "err": "请检查网络！" });
      // EventCenter.emit("REQUEST_END", action);
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}
/**
 * 用户端/专家端咨询详情数据接口
 * @author markwang
 * @email        wangji5850@qq.com
 * @version      2019-11-13T15:09:12+0800
 * @example      no example
 * @modification list 2019-11-13 新增
 * @param        {object} action [description]
 * @return       {[type]} [description]
 */
export function doCallAnswerDetail(action) {
  console.log('doCallAnswerDetail==', action);
  let param = Object.assign({}, action.status);
  fetch(dm.getUrl_api(`/v2/callAnswerDetail`, { id: param.id }), {
    method: 'GET',
  })
    .then(checkHTTPStatus)
    .then(parseJSON)
    .then((json) => {
      EventCenter.emit('CallAnswerDetailDone', json);
    }).catch((ex) => {
      EventCenter.emit('CallAnswerDetailDone', { "err": "请检查网络！" });
      if (__DEBUG__) console.log('Fetch failed', ex);
    });
}

export const PhoneAnswerStore = {
  dispatcherIndex: Dispatcher.register((action) => {
    if (action.actionType) {
      if (eval("typeof " + 'do' + action.actionType) === 'function') {
        eval('do' + action.actionType).call(null, action);
      }
    }
    return true; // No errors. Needed by promise in Dispatcher.
  })
}
