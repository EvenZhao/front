import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'


export function doSpecial(action) {
  fetch(dm.getUrl_api(`/v2/special`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: action.name,
      phone: action.phone,
      email:action.email,
      company: action.company,
      url: action.url,
      isCima:action.isCima,//用来区分cima单页跟其他活动单页cima:true,其他为false
      title: action.title
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('SpecialDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doBindWeixinFromWeb(action) {

  fetch(dm.getUrl_api(`/v2/bindWeixinFromWeb`, {uuid: action.uuid, ts: action.ts, token: action.token}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('bindWeixinFromWebDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//获取用户信息
export function doGetActivityUserInfo(action) {
  // `http://10.10.20.132:8010/yiYuanGou/getActivityUserInfo?uuid=`+action.uuid+'&source='+ action.source+'&code='+ action.code
  //`http://10.10.20.132:8010/yiYuanGou/getActivityUserInfo?uuid=`+action.uuid+'&source='+ action.source+'&code='+ action.code
  fetch(dm.getUrl_api(`/yiYuanGou/getActivityUserInfo`,{
    uuid:action.uuid,
    source:action.source,
    code:action.code,
  })
  ,{
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('GetActivityUserInfoDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//获取验证码
export function doGetActivityVerifyCode(action) {
  console.log('code====',action);
//`http://10.10.20.132:8010/yiYuanGou/getActivityVerifyCode?uuid=`+action.uuid+'&phone='+ action.phone+'&code='+ action.code
  fetch(dm.getUrl_api(`/yiYuanGou/getActivityVerifyCode`,{uuid:action.uuid,code:action.code,phone:action.phone,})
  ,{
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('GetActivityVerifyCodeDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}



export function doGetUserInfoAndVerifyCode(action) {
  console.log('code====',action);
  fetch(dm.getUrl_api(`/yiYuanGou/getUserInfoAndVerifyCode`,{code:action.code,phone:action.phone,source:action.source})
  ,{
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('GetUserInfoAndVerifyCodeDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//购买

export function doPayForActivity(action) {
  console.log('PayFor===',action)
  //`http://10.10.20.132:8010/yiYuanGou/payForActivity`
	fetch(dm.getUrl_api(`/yiYuanGou/payForActivity`)
  ,{
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
      uuid:action.uuid,
      code:action.code,
      verifyCode:action.verifyCode,
      source:action.source,
      phone:action.phone,
      clientType:action.clientType,
		})
	}).then(checkHTTPStatus).then(parseJSON)
		.then( (json) => {
			EventCenter.emit('PayForActivityDone',json)
			// console.log('json',json);
		}).catch( (ex) => {
			EventCenter.emit("REQUEST_END", action);
			if(__DEBUG__) {
				console.log('Fetch failed', ex);
			}
		});
}


export const ActivityStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
