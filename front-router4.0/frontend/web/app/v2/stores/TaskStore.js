import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

//任务列表
export function doTaskList(action) {

  fetch(dm.getUrl_api(`/v2/taskList`,
    {
      skip:action.skip,
      limit:action.limit,
      taskStatus: action.taskStatus,
    }),
   {
      method: 'GET',
    })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if(action.LoadMore){
      EventCenter.emit('TaskListLoadMoreDone', json);
    }
    else {
      EventCenter.emit('TaskListDone', json);
    }

  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//任务详情
export function doTaskDetail(action) {

  fetch(dm.getUrl_api(`/v2/taskDetail`,
    {
      id:action.task_id,
    }),
   {
      method: 'GET',
    })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('TaskDetailDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const TaskStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
