import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

export function doLawLastest(action) {

  fetch(dm.getUrl_api(`/v2/lawLastest10/`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('LawLastestDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('LawLastestTimeout');
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doLawDetail(action) {
  fetch(dm.getUrl_api(`/v2/lawDetail/`,{_id: action.id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('LawDetailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doSearchLaw(action) {
  fetch(dm.getUrl_api(`/v2/searchLaw/`,{keyWord: action.keyWord,skip:action.skip,limit:action.limit,filter:'all'}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (action.loadmore) {
      EventCenter.emit('SearchLawlMoreDone', json);
    }else {
      EventCenter.emit('SearchLawlDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const LawStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
