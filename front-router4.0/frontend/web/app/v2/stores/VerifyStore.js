import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'


//获取验证码
export function doReqVerifyCode(action) {
  fetch(dm.getUrl_api(`/v2/reqVerifyCode`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneOrEmail: action.type,
      verifyType:action.verify_type,
      isVoice: action.isVoice ? action.isVoice : false,
      token:action.token
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {

    EventCenter.emit('ReqVerifyCodeDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//验证验证码
export function doChkVerifyCode(action) {
  console.log("验证验证码action:",action)
  fetch(dm.getUrl_api(`/v2/chkVerifyCode`,
    {
      phoneOrEmail: action.type,
      verifyType:action.verify_type,
      verifyCode:action.verify_code,
    }),
   {
      method: 'GET',
    })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('ChkVerifyCodeDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//验证密码 chkPassword
export function doChkPassword(action) {
  fetch(dm.getUrl_api(`/v2/chkPassword`,{password: action.pwd}), {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {
      EventCenter.emit('ChkPasswordDone', json);
    }
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//修改密码
export function doUpdPassword(action) {
  fetch(dm.getUrl_api(`/v2/updPassword`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneOrEmail: action.phoneOrEmail,
      verifyCode:action.verify_Code,
      newPassword:action.newPwd,
      setAll:action.isChecked,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('UpdPasswordDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//忘记密码
export function doFgtPassword(action) {
  fetch(dm.getUrl_api(`/v2/fgtPassword`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneOrEmail: action.phoneOrEmail,
      verifyCode:action.verify_Code,
      newPassword:action.newPwd,
      setAll:action.isChecked,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('FgtPasswordDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//绑定手机
export function doBindPhone(action){
  fetch(dm.getUrl_api(`/v2/bindPhone`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: action.phone,
      verifyCode:action.verify_Code,
      password:action.pwd,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('BindPhoneDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//绑定邮箱
export function doBindEmail(action){
  fetch(dm.getUrl_api(`/v2/bindEmail`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: action.email,
      verifyCode:action.verify_Code,
      password:action.pwd,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('BindEmailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//修改手机
export function doUpdPhone(action){
  console.log("doUpdPhone=action==",action)
  fetch(dm.getUrl_api(`/v2/updPhone`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneOrEmail: action.type,//原来的手机号或者邮箱
      phone:action.phone,//待绑定的手机号
      verifyCode:action.verify_Code,
      verifyCodeForOld:action.old_verfyCode,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('UpdPhoneDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//手机免密登录绑定账号
export function doLoginBindPhone(action){
  fetch(dm.getUrl_api(`/v2/loginBindPhone`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: action.phone,
      email:action.email,
      verifyCode:action.verifyCode,
      password:action.password,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('LoginBindPhoneDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//修改邮箱
export function doUpdEmail(action){
  fetch(dm.getUrl_api(`/v2/updEmail`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneOrEmail: action.type,
      email:action.email,
      verifyCode:action.verify_Code,
      verifyCodeForOld:action.old_verfyCode,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('UpdEmailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//手机号注册
export function doRegisterAccount(action){
  fetch(dm.getUrl_api(`/v2/registerAccount`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneOrEmail: action.mobile,
      verifyCode:action.verify_Code,
      password:action.pwd,
      isQuick:action.isQuick,
      company: action.company,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('RegisterAccountDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//注册成功后填写邀请码
export function doRegisterInvitedCode(action){
  fetch(dm.getUrl_api(`/v2/registerInvitedCode`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invite_code: action.invite_code,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('RegisterInvitedCodeDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


export const VerifyStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
