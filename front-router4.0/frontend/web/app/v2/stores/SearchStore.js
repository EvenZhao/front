import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

export function doSearch(action) {//我的搜索
  EventCenter.emit('canNotLoad')
  // console.log('doSearchdoSearchdoSearch',action);
  fetch(dm.getUrl_api(`/v2/search`,{keyWord:action.keyWord,searchType:action.searchType,skip:action.skip,limit: action.limit}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      if (action.loadMore) {
        json.type = action.searchType
        EventCenter.emit('SearchMoreDone', json);
      }else {
        EventCenter.emit('SearchDone', json);
      }
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    // EventCenter.emit('SearchTimeout', json);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//搜索页是否显示即将上线课程，返回已经设置过上线提醒的课程id
export function doGetAccountOnlineRemind(action) {//我的搜索

  fetch(dm.getUrl_api(`/v2/getAccountOnlineRemind`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('GetAccountOnlineRemindDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function dohotLabelList(action) {//我的搜索
  console.log('hotLabelList');
  fetch(dm.getUrl_api(`/v2/hotLabelList`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('hotLabelListDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    // EventCenter.emit('SearchTimeout', json);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const SearchStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
