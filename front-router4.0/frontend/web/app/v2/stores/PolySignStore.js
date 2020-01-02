import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'
//
// export function doPolySign(action) {
//   fetch(dm.getUrl_api(`/v2/polySign`, {}), {
//     method: 'GET',
//     // headers: assign(dm.getHttpHeadMyAuth(), {}),
//   })
//   .then(checkHTTPStatus)
//   .then(parseJSON)
//   .then( (json) => {
//     EventCenter.emit('PolySignDone', json);
//     // EventCenter.emit("REQUEST_END", action);
//   }).catch( (ex) => {
//     // EventCenter.emit("REQUEST_END", action);
//     if(__DEBUG__) console.log('Fetch failed', ex);
//   });
// }
export function doPolySign(action) {
  
	fetch(dm.getUrl_api(`/v2/polySign`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			vid: action.vid,
      resource_id: action.resource_id,
      isFree: action.isFree
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('PolySignDone', json)
			// console.log('json',json);
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

export const PolySignStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
