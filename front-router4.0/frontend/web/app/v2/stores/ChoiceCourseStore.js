import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

//选课列表
export function doLessonList(action) {
  fetch(dm.getUrl_api(`/v2/lessonList`,{type:action.type,skip:action.skip,limit:action.limit}), {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    json.type = action.type || ''
    if(action.LoadMore){
      EventCenter.emit('LessonListLoadMoreDone', json);
    }else {
      EventCenter.emit('LessonListDone', json);
    }

  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


//添加选课
export function doAddLesson(action) {
  fetch(dm.getUrl_api(`/v2/addLesson `), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id:action.id,
      type:action.type,
      isUsePoint:action.isUsePoint,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('AddLessonDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//添加选课
export function doinsertLiveResourceJoin(action) {
  fetch(dm.getUrl_api(`/v2/insertLiveResourceJoin `), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resource_id:action.resource_id,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('insertLiveResourceJoinDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const ChoiceCourseStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
