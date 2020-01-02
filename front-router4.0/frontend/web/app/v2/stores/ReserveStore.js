import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

export function doLiveReserve(action) {

	fetch(dm.getUrl_api(`/v2/reserve`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			resource_id: action.resource_id,
      resource_type: action.resource_type,
      phone: action.phone,
      title: action.title,
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('LiveReserveDone', {result: json})
			// console.log('json',json);
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

export function doOfflineReserve(action) {

	fetch(dm.getUrl_api(`/v2/reserve`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			resource_id: action.resource_id,
      resource_type: action.resource_type,
      phone: action.phone,
      title: action.title,
      name: action.name,
      company: action.company,
      position: action.position,
      tel: action.tel,
      email: action.email,
      //0 是自己报名
      //1 是帮他人报名
      invited: action.invited
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('OfflineReserveDone', json)
			// console.log('json',json);
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

export function doGetEnrollInfo(action) {
  fetch(dm.getUrl_api(`/v2/getEnrollInfo`,{resource_id: action.resource_id, resource_type: action.resource_type}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('GetEnrollInfoDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const ReserveStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
