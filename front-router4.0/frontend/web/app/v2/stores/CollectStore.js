import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

export function doCollect(action) {

	fetch(dm.getUrl_api(`/v2/collect`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			resource_id: action.resource_id,
			resource_type: action.resource_type
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('CollectDone', {result: json})
			// console.log('json',json);
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

export function doCollectQuestion(action) {
  
	fetch(dm.getUrl_api(`/v2/collectQuestion`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			question_id: action.question_id,
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('CollectQuestionDone', {result: json})
			// console.log('json',json);
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

export const CollectStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
