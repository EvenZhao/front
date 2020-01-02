import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

//我的计划列表
export function doPlanList(action) {
  console.log('action',action);
  fetch(dm.getUrl_api(`/v2/planList`,{
    skip:action.skip,
    limit:action.limit,
    type:action.type,
  }),
  {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then((json) => {
    if(action.LoadMore) {//如果有返回值 返回user信息
      EventCenter.emit('PlanListLoadMoreDone', json);
    }else {
      EventCenter.emit('PlanListDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//计划详情
export function doPlanDetail(action) {
  console.log('action',action);
  fetch(dm.getUrl_api(`/v2/planDetail`,{
    id:action.id,
  }),
  {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then((json) => {

    if(json){//如果有返回值 返回user信息
        EventCenter.emit('PlanDetailDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//计划详情
export function doCourseList(action) {
  console.log('action',action);
  fetch(dm.getUrl_api(`/v2/courseList`,{
    id:action.id,
    skip:action.skip,
    limit:action.limit,
  }),
  {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then((json) => {
    if(action.LoadMore){
      EventCenter.emit('CourseListLoadMoreDone', json);
    }else {
      EventCenter.emit('CourseListDone', json);
    }

    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//激活计划或更新计划时间
export function doUpdatePlan(action) {
  fetch(dm.getUrl_api(`/v2/updatePlan`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id:action.id,
      startTime:action.startTime,
      endTime:action.endTime,
      name:action.plan_title,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('UpdatePlanDone', json);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


export const CoursePlanStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
