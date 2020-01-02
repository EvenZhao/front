import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

export function doTeacherLesson(action) {

  fetch(dm.getUrl_api(`/v2/teacherLesson/${action.id}`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('TeacherLessonDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doTeacherQuestion(action) {
  fetch(dm.getUrl_api(`/v2/teacherQuestion/${action.id}`, {skip: action.skip, limit: action.limit}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('TeacherQuestionDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//讲师主页
export function doTeacherUserInfo(action) {
  fetch(dm.getUrl_api(`/v2/teacherUserInfo`,{type:action.type,id:action.teacher_id,skip:action.skip,limit:action.limit}), {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    json.type = action.type || ''
    EventCenter.emit('TeacherUserInfoDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const TeahcerDetailStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
