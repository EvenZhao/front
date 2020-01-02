import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'


//审核课程列表
export function doAuditLessonList(action) {

  fetch(dm.getUrl_api(`/v2/auditLessonList`,{
    status:action.status,
    skip:action.skip,
    limit:action.limit,
  })
  ,{
    method: 'GET',

  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (action.LoadMore_notReview) {//如果有返回值 返回user信息
      EventCenter.emit('NotReviewLessonLoadMoreDone', json);
    }
    else if (action.LoadMore_Audited) {
      EventCenter.emit('AuditLessonLoadMoreDone', json);
    }
    else {
      if(action.status == 0){
        EventCenter.emit('AuditLessonListDone', json);
      }else {
        EventCenter.emit('AuditLessonListReviewDone', json);
      }
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//线下课报名待审核详情
export function doPendingAuditDetail(action) {

  fetch(dm.getUrl_api(`/v2/pendingAuditDetail`,{id:action.id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('PendingAuditDetailDone', json);
    }

  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//已审核详情
export function doAuditDetail(action) {

  fetch(dm.getUrl_api(`/v2/auditDetail`,{id:action.id,label_id:action.label_id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    console.log('aciton--',action);
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('AuditDetailDone', json);
    }

  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const ReviewStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
