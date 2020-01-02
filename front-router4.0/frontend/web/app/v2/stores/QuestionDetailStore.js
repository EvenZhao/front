import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

export function doQuestionDetail(action) {
  fetch(dm.getUrl_api(`/v2/questionDetail/${action.id}`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('QuestionDetailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('QuestionDetailDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


var param = {}
export function doQAList(action) {
  param = Object.assign({}, param, action);
  fetch(dm.getUrl_api(`/v2/qaList/`,
    {
      sort: action.sort,
      not_answer: action.not_answer,
      skip: action.skip,
      limit: action.limit,
      resource_id: action.resource_id,
      resource_type: action.resource_type
    }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if(action.LoadMore){
      EventCenter.emit('QAListLoadMoreDone', json);
    }else {
      EventCenter.emit('QAListDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('QAListDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doQAListLoadMore(action) {
  EventCenter.emit('CanNotLoad')
  fetch(dm.getUrl_api(`/v2/qaList/`,
    {
      sort: param.sort,
      not_answer: param.not_answer,
      skip: action.skip,
      limit: action.limit,
      resource_id: action.resource_id,
      resource_type: action.resource_type
    }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    var t = setInterval(() => {
      clearInterval(t)
      EventCenter.emit('QAListLoadMoreDone', json);
    }, 1000)
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('QAListLoadMoreDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doAnswerList(action) {
  fetch(dm.getUrl_api(`/v2/answerList/${action.id}`, {skip: action.skip, limit: action.limit}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('AnswerListDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('AnswerListDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doAnswerComment(action) {
  fetch(dm.getUrl_api(`/v2/answerComment/${action.id}`, {skip: action.skip, limit: action.limit}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('AnswerCommentDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('AnswerCommentDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doAddAnswer(action) {
	fetch(dm.getUrl_api(`/v2/addAnswer/${action.question_id}`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			content: action.content,
      anonymous: action.anonymous
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('AddAnswerDone', {result: json})
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

export function doAddAnswerComment(action) {
	fetch(dm.getUrl_api(`/v2/addAnswerComment/${action.answer_id}`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			content: action.content,
      parent_id: action.parent_id,
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('AddAnswerCommentDone', {result: json})
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

export function doAdoptAnswer(action) {
	fetch(dm.getUrl_api(`/v2/adoptAnswer/`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			id: action.id,
      question_id: action.question_id,
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('AdoptAnswerDone', json)
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}


export function doAnswerDetail(action) {
  fetch(dm.getUrl_api(`/v2/answerDetail/`, {id: action.id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('AnswerDetailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('AnswerDetailDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doQuestionTeacher(action) {
  fetch(dm.getUrl_api(`/v2/questionTeacher/`, {skip: action.skip, limit: action.limit}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('QuestionTeacherDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('QuestionTeacherDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doQuestionTeacherLoadMore(action) {
  EventCenter.emit('CanNotLoad')
  fetch(dm.getUrl_api(`/v2/questionTeacher/`, {skip: action.skip, limit: action.limit}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('QuestionTeacherLoadMoreDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('QuestionTeacherLoadMoreDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export const QuestionDetailStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
