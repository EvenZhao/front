import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

export function doAddComment(action) {

	fetch(dm.getUrl_api(`/v2/addComment`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			resourceId: action.resourceId,
			star: action.star,
      content: action.content,
      label: action.label
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('AddCommentDone', {result: json})
			// console.log('json',json);
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

export const AddCommentStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
