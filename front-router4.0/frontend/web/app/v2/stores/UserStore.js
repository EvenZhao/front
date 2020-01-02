import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

export function doBind(action) {
  fetch(dm.getUrl_api(`/v2/login`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName:action.userName,
      pw:action.pw,
      uuid: action.id || null
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('BindDone', json);    
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doLogOut(action) {
  fetch(dm.getUrl_api(`/v2/logout`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('LogOutDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doRecoverPw(action) {
  fetch(dm.getUrl_api(`/v2/recoverPw`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName: action.userName,
      verifyCode: action.verifyCode,
      newpass: action.newpass
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('RecoverPwDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doRegister(action) {
  fetch(dm.getUrl_api(`/v2/register`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName:action.userName,
      pw:action.pw,
      verifyCode: action.verifyCode
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('RegisterDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doperfectAccount(action) {
  console.log('perfectAccount',action);
  fetch(dm.getUrl_api(`/v2/perfectAccount`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nick_name: action.nick_name,
      name: action.name,
      phoneOrEmail: action.phoneOrEmail,
      verifyCode: action.verifyCode,
      company: action.company,
      positionId: action.positionId,
      position: action.position,
      industry: action.industry,
      cityid: action.cityid,
      companyScale: action.companyScale,
      businessBackgroundId: action.businessBackgroundId,
      hasCompleted: action.hasCompleted,
      taskId: action.taskId,
      gender:action.gender,
      genderSecrecy:action.genderSecrecy,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('perfectAccountDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


export function dothirdBindWx(action) {
  fetch(dm.getUrl_api(`/v2/thirdBindWx`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code:action.code,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('thirdBindWxDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doonCenter(action) {

  fetch(dm.getUrl_api(`/v2/center`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json.user) {//如果有返回值 返回user信息
      EventCenter.emit('onCenterDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    // EventCenter.emit('CenterTimeout');
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


export function dolessonShare(action) {

  fetch(dm.getUrl_api(`/v2/lessonShare`,{id: action.id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('lessonShareDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    // EventCenter.emit('CenterTimeout');
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//个人中心使用员工邀请码
export function doUseStaffInviteCode(action) {
  fetch(dm.getUrl_api(`/v2/useStaffInviteCode`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invite_code:action.invite_code,
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('UseStaffInviteCodeDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//个人中心邀请码
export function doUserInvitedCode(action){
  fetch(dm.getUrl_api(`/v2/userInvitedCode`,{tab: action.tab}), {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json.user) {//如果有返回值 返回user信息
      EventCenter.emit('UserInvitedCodeDone', json);
    }
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//我的参课券
export function doUserRegisterCodeList(action) {

  fetch(dm.getUrl_api(`/v2/userRegisterCodeList`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json.user) {//如果有返回值 返回user信息
      EventCenter.emit('UserRegisterCodeListDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function dogetUserAccount(action) {
  fetch(dm.getUrl_api(`/v2/getUserAccount`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json.user) {//如果有返回值 返回user信息
      EventCenter.emit('getUserAccountDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function dogetAccountActivationRequireInfo(action) {

  fetch(dm.getUrl_api(`/v2/getAccountActivationRequireInfo`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      json.isVip= action.isVip
      EventCenter.emit('getAccountActivationRequireInfoDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doaccountActivation(action) {

  fetch(dm.getUrl_api(`/v2/accountActivation`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('accountActivationDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function dogetThirdAccount(action) {

  fetch(dm.getUrl_api(`/v2/getThirdAccount`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('getThirdAccountDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}
export function dogetSubscribeStatus(action) {

  fetch(dm.getUrl_api(`/v2/getSubscribeStatus`,{taskId: action.taskId}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('getSubscribeStatusDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//修改昵称
export function docompleteTask(action) {
  fetch(dm.getUrl_api(`/v2/completeTask`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      num:3,
      taskId: action.taskId
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('completeTaskDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doMyDiscount(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/myDiscount`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('MyDiscountDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doMyQA(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/myQA`,{type: action.type || 1}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('MyQADone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function dogetPlanExam(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/getPlanExam`,{type: action.type || 1,resourceId: action.resourceId}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('getPlanExamDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doaddDiscount(action) {
  fetch(dm.getUrl_api(`/v2/addDiscount`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      discountCode:action.discountCode,
      // pw:action.pw
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('addDiscountDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}
//修改昵称
export function doupdNickName(action) {
  fetch(dm.getUrl_api(`/v2/updNickName`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nickName:action.nickName,
      // pw:action.pw
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('updNickNameDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//修改绑定手机号
export function doupdateAccountPhone(action) {
  fetch(dm.getUrl_api(`/v2/updateAccountPhone`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone:action.phone,
      verifyCode:action.verifyCode
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('updateAccountPhoneDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}
//修改绑定邮箱
export function doupdateAccountEmail(action) {
  fetch(dm.getUrl_api(`/v2/updateAccountEmail`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: action.email,
      pw: action.pw
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('updateAccountEmailDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//修改密码
export function doupdateAccountPw(action) {
  fetch(dm.getUrl_api(`/v2/updateAccountPw`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      oldPw: action.oldPw,
      newPw: action.newPw
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('updateAccountPwDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//添加建议
//修改绑定手机号
export function doaddFeedback(action) {
  fetch(dm.getUrl_api(`/v2/addFeedback`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      feedback:action.feedback,
      contact:action.contact
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('addFeedbackDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//修改绑定手机号
export function doupdateAccountPhoto(action) {
  if (!action || !action.file) {
   return;
  }
  var file = action.file[0];
  var fileName = file.name;
  var fileSize = file.size;
  //获取后缀并附上图片提交限制
  var postfix = fileName.split(".")[1].toLowerCase();
  // console.log('postfix',postfix);
  var formdata = new FormData();
  formdata.append('file', file);
  // if(postfix !== 'png' && postfix !== 'jpg' && postfix !== 'jpeg'){//暂时去掉 || fileSize > 3*1024*1024
  //     return;
  //     // console.log('err',postfix,fileSize);
  // }
  fetch(dm.getUrl_api(`/v2/updateAccountPhoto`), {
    method: 'POST',
    headers: {
    'Content-Length': fileSize,
    },
    body: formdata,
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('updateAccountPhotoDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doupdAccountBasicInfo(action) {
  var personal_param = {};
  if(action.name !==undefined){
    personal_param['name']=action.name;
  }
  if(action.company !==undefined){
    personal_param['company']=action.company;
  }
  if(action.positionId !==undefined){
    personal_param['position']=action.position;
		personal_param['positionId'] = action.positionId;
  }
  if(action.gender !==undefined){
    personal_param['gender'] = action.gender;
  }
  if(action.genderSecrecy !== undefined){
    personal_param['genderSecrecy'] = action.genderSecrecy;
  }
  
  

  fetch(dm.getUrl_api(`/v2/updAccountBasicInfo`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(personal_param)
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('updAccountBasicInfoDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

  // if (action.updtype == 'name') {//只修改名字
  //   fetch(dm.getUrl_api(`/v2/updAccountBasicInfo`), {
  //     // method: 'GET',
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       name:action.name || '',
  //     })
  //   })
  //   .then(checkHTTPStatus)
  //   .then(parseJSON)
  //   .then( (json) => {
  //     EventCenter.emit('updAccountBasicInfoDone', json);
  //     // EventCenter.emit("REQUEST_END", action);
  //   }).catch( (ex) => {
  //     // EventCenter.emit("REQUEST_END", action);
  //     if(__DEBUG__) console.log('Fetch failed', ex);
  //   });
  // }else if (action.updtype == 'company') {//只修改公司
  //   fetch(dm.getUrl_api(`/v2/updAccountBasicInfo`), {
  //     // method: 'GET',
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       company: action.company || '',
  //     })
  //   })
  //   .then(checkHTTPStatus)
  //   .then(parseJSON)
  //   .then( (json) => {
  //     EventCenter.emit('updAccountBasicInfoDone', json);
  //     // EventCenter.emit("REQUEST_END", action);
  //   }).catch( (ex) => {
  //     // EventCenter.emit("REQUEST_END", action);
  //     if(__DEBUG__) console.log('Fetch failed', ex);
  //   });
  // }else if (action.updtype == 'position') {//只修改职位
  //   fetch(dm.getUrl_api(`/v2/updAccountBasicInfo`), {
  //     // method: 'GET',
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       position: action.position || '',
  //       positionId: action.positionId || ''
  //     })
  //   })
  //   .then(checkHTTPStatus)
  //   .then(parseJSON)
  //   .then( (json) => {
  //     EventCenter.emit('updAccountBasicInfoDone', json);
  //     // EventCenter.emit("REQUEST_END", action);
  //   }).catch( (ex) => {
  //     // EventCenter.emit("REQUEST_END", action);
  //     if(__DEBUG__) console.log('Fetch failed', ex);
  //   });
  // }
}

//getPosition

export function dogetPosition(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/getPosition`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('getPositionDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function dogetVerifyCode(action) {

  fetch(dm.getUrl_api(`/v2/getVerifyCode/${action.userName}/${action.type}`,{isVoice:action.isVoice,token:action.token}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('getVerifyCodeDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//loginTest
export function dologinTest(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/loginTest`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('loginTestDone', json);
    }
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//quicklogin
export function doQuickLogin(action) {
  fetch(dm.getUrl_api(`/v2/quickLogin`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName: action.userName,
      verifyCode: action.verifyCode,
      uuid: action.id,
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('QuickLoginDone', json);
  }).catch( (ex) => {
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doMyCollect(action) {//我的优惠券
  var les_status = action.les_status || {}
  fetch(dm.getUrl_api(`/v2/myCollect`,{limit:les_status.limit,skip:les_status.skip,type:les_status.type}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('MyCollectDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function domyReserveEnroll(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/myReserveEnroll`,{year: action.year, month:action.month,city_id: action.cityId ? action.cityId : null}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('myReserveEnrollDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//二维码详情
export function docodeDetail(action) {

  fetch(dm.getUrl_api(`/v2/codeDetail`,{resource_id: action.resource_id, checkcode:action.checkcode,code:action.code}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('codeDetailDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//今日参课提醒
export function doOfflineCodeToday(action) {
  fetch(dm.getUrl_api(`/v2/offlineCodeToday`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('OfflineCodeTodayDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//是否已签到
export function doChkOfflineAsignedToday(action) {
  fetch(dm.getUrl_api(`/v2/chkOfflineAsignedToday`,
  {
    resource_id:action.resource_id,
    checkcode:action.checkcode,
  }), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('ChkOfflineAsignedTodayDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//线下课报名
export function domyEnrollDetail(action) {
  var id
  if (action.id) {
      id = { id: action.id }
  }else {
      id = { _id: action._id}
  }
  fetch(dm.getUrl_api(`/v2/myEnrollDetail`,{...id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('myEnrollDetailDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//myEnrollLabelType

export function domyEnrollLabelType(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/myEnrollLabelType`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('myEnrollLabelTypeDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function docancelEnroll(action) {//取消报名

  fetch(dm.getUrl_api(`/v2/cancelEnroll`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      enrollId: action.enrollId
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('cancelEnrollDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

}

export function dogetParticipantsById(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/getParticipantsById`,{enrollId: action.enrollId}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('getParticipantsByIdDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function domyReserveEnrollList(action) {//我的优惠券
  fetch(dm.getUrl_api(`/v2/myReserveEnrollList`,{resource_type: action.resource_type,limit:action.limit,skip:action.skip,type:action.type,label_id:action.label_id}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      if (action.loadmore) {
        EventCenter.emit('myReserveEnrollListMoreDone', json);
      }else {
        EventCenter.emit('myReserveEnrollListDone', json);
      }
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function dolearnRecord(action) {//我的优惠券
  EventCenter.emit('canNotLoad')
  fetch(dm.getUrl_api(`/v2/learnRecord`,{limit:action.limit,skip:action.skip}), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      if (action.loadmore) {
        EventCenter.emit('learnRecordLoadMoreDone', json);
      }else {
        EventCenter.emit('learnRecordDone', json);
      }
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doHasSign(action) {//我的优惠券

  fetch(dm.getUrl_api(`/v2/HasSign`), {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('HasSignDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    EventCenter.emit('CenterTimeout');
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function doDoSign(action) {//取消报名
  fetch(dm.getUrl_api(`/v2/doSign`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('DoSignDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('CenterTimeout');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

}

//个人主页
export function doUserInfo(action) {

  fetch(dm.getUrl_api(`/v2/userInfo`,{id:action.id,source:action.source}), {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('UserInfoDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//用户问答
export function doUserQa(action) {

  fetch(dm.getUrl_api(`/v2/userQa`,{
    id:action.id,
    source:action.source,
    skip:action.skip,
    limit:action.limit,
    type:action.type,
  }),
  {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then((json) => {

    if(json){//如果有返回值 返回user信息
      if(action.LoadMore){
        EventCenter.emit('UserQaLoadMoreDone', json);
      }else{
        EventCenter.emit('UserQaDone', json);
      }
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//我的关注
export function doMyFocus(action) {

  fetch(dm.getUrl_api(`/v2/myFocus`,{
    skip:action.skip,
    limit:action.limit,
    type:action.type,
  }),
  {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then((json) => {

    if(json){//如果有返回值 返回user信息
      if(action.LoadMore){
        EventCenter.emit('UserQaLoadMoreDone', json);
      }else{

        EventCenter.emit('MyFocusDone', json);
      }
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//微信端是否要弹出待审核通知弹窗
export function doAuditRemind(action) {

  fetch(dm.getUrl_api(`/v2/auditRemind`,{
    skip:action.skip,
    limit:action.limit,
    type:action.type,
  }),
  {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then((json) => {

    if(json){
        EventCenter.emit('AuditRemindDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}



//提交试卷答案
export function dosubmitExamTest(action) {
  fetch(dm.getUrl_api(`/v2/submitExamTest`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: action.id,
      examIds: action.examIds,
      contentIds: action.contentIds
    })
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('submitExamTestDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//查询测试报告
export function dogetTestResult(action) {

  fetch(dm.getUrl_api(`/v2/getTestResult`,{testId:action.testId}), {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('getTestResultDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//getExamResult 获取试卷答题结果
export function dogetExamResult(action) {

  fetch(dm.getUrl_api(`/v2/getExamResult`,{testId:action.testId}), {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (json) {//如果有返回值 返回user信息
      EventCenter.emit('getExamResultDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}



export const UserStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
