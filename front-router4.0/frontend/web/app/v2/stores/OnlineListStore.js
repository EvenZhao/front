import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

let param = {}
export function doOnlineLoadListMore(action) {
  param = Object.assign({}, param, action.les_status);
  fetch(dm.getUrl_api(`/v2/onlineList`,{label_id: param.label_id, charge_type: param.charge_type, sort: param.sort, teacher_id: param.teacher_id, skip: param.skip, limit: param.limit,user_id: param.user_id || ''}), {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('OnlineLoadListMoreDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doOnlineLoadListLoadMore(action) {
  var loadParam = {}
  loadParam = Object.assign({}, param, action.les_status);
  EventCenter.emit('CanNotLoad')
  fetch(dm.getUrl_api(`/v2/onlineList`,{label_id: loadParam.label_id, charge_type: loadParam.charge_type, sort: loadParam.sort, teacher_id: loadParam.teacher_id, skip: loadParam.skip, limit: loadParam.limit,user_id:loadParam.user_id || ''}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    var t = setInterval(() => {
      clearInterval(t)
      EventCenter.emit('OnlineLoadListLoadMoreDone', json);
    }, 1000)
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit('OnlineLoadListLoadMoreDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doOnlineLoadDetail(action) {
  // fetch((`http://localhost:8000/v2/onlineDetail`, {id: action.id}), {
  fetch(dm.getUrl_api(`/v2/onlineDetail/${action.id}`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),

  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('OnlineLoadDetailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('OnlineLoadDetailDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doOnlineLoadCommentList(action) {
  var param = getParam(action);
  fetch(dm.getUrl_api(`/app/onlineCommentList${param}`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('OnlineLoadCommentListDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('OnlineLoadCommentListDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doMyCanUseDiscount(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/getValidDiscount`, {resource_type: action.resource_type, resource_id: action.resource_id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('MyCanUseDiscountDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('MyCanUseDiscountDone');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doUseDiscount(action) {

	fetch(dm.getUrl_api(`/v2/useDiscount`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
      resource_id: action.resource_id,
      resource_type: action.resource_type,
      code: action.code
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('UseDiscountDone', json)
			// console.log('json',json);
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

//视频课上线提醒
export function doSetOnlineRemind(action) {

	fetch(dm.getUrl_api(`/v2/setOnlineRemind`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
      id:action.id,
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('SetOnlineRemindDone', json)

		}).catch( (ex) => {

			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}


//knowledgeCard 索取知识卡片
export function doknowledgeCard(action) {

	fetch(dm.getUrl_api(`/v2/knowledgeCard`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
      contact_name: action.contact_name || null,
      contact_phone: action.contact_phone || null,
      resource_id: action.resource_id,
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('knowledgeCardDone', json)

		}).catch( (ex) => {

			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}
export function doAddLearnRecord(action) {
	fetch(dm.getUrl_api(`/v2/addLearnRecord`), {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
      id: action.id,
			catalog_id: action.catalog_id,
      start_time: action.start_time,
      end_time: action.end_time,
      client_type: action.client_type
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('AddLearnRecordDone', json)
			// console.log('json',json);
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}

function getParam(action) {
  var param = `?limit=${action.limit}`;

  if (action.skip !== undefined) {
    param = param + `&skip=${action.skip}`;
  }
  if (action.label_id !== undefined) {
    param = param + `&label_id=${action.label_id}`;
  }
  if (action.charge_type !== undefined) {
    param = param + `&charge_type=${action.charge_type}`;
  }
  if (action.online_id !== undefined) {
    param = param + `&online_id=${action.online_id}`;
  }
  return param;
}

export const OnlineListStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
