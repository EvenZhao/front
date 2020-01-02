import Dispatcher from '../AppDispatcher'
import EventCenter from '../EventCenter'
import {dm} from '../util/DmURL'

//问答首页
export function doQuestionList (action) {
  var les_status = action.les_status || {}
  fetch(dm.getUrl_api(`/v2/questionList`,
  {
    type: les_status.type,
    topic_id: les_status.topic_id,
    not_answer: les_status.not_answer,
    limit:les_status.limit,
    skip:les_status.skip,
    question_type: les_status.question_type,
  }),
  {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    // if (json.user) {//如果有返回值 返回user信息
      if(les_status.LoadMore){
        EventCenter.emit('QuestionListLoadMoreDone', json);
      }else {
        EventCenter.emit('QuestionListDone', json);
      }
    // }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    EventCenter.emit('QuestionListTimeout');
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//我的个性化推荐
export function domyPersonalRecommend (action) {

  var les_status = action.les_status || {}
  console.log('doQuestionList',les_status);
  fetch(dm.getUrl_api(`/v2/myPersonalRecommend`,
  {
    type: les_status.type,
    topic_id: les_status.topic_id,
    not_answer: les_status.not_answer,
    limit:les_status.limit,
    skip:les_status.skip,
    question_type: les_status.question_type,
  }),
  {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    // if (json.user) {//如果有返回值 返回user信息
      if(les_status.LoadMore){
        EventCenter.emit('myPersonalRecommendLoadMoreDone', json);
      }else {
        EventCenter.emit('myPersonalRecommendDone', json);
      }
    // }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


//讲师中心
export function doteacherList (action) {
  EventCenter.emit('canNotLoad')
  fetch(dm.getUrl_api(`/v2/teacherList`,{question_id:action.question_id,skip:action.skip,limit:action.limit}),
  {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (action.LoadMore) {//如果有返回值 返回user信息
      EventCenter.emit('teacherListLoadMoreDone', json);
    }else {
      EventCenter.emit('teacherListDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//问题详情
export function doquestionDetail4 (action) {

  fetch(dm.getUrl_api(`/v2/questionDetail4`,{id:action.id}),
  {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('questionDetail4Done', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//提问，实时搜索问题标题searchQaTitle?keyWord=test
export function doSearchQaTitle (action) {
  fetch(dm.getUrl_api(`/v2/searchQaTitle`,{keyWord:action.keyWord}),
  {
    method: 'GET',
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('SearchQaTitleDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


//尊贵会员个人信息（答疑）
export function doquestionCallbackUserInfo(action) {

  fetch(dm.getUrl_api(`/v2/questionCallbackUserInfo`),
  {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('questionCallbackUserInfoDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}
//话题详情
export function dotopicDetail (action) {

  fetch(dm.getUrl_api(`/v2/topicDetail`,{topic_id:action.topic_id}),
  {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('topicDetailDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

//话题详情问答列表
export function dotopicQaList (action) {

  fetch(dm.getUrl_api(`/v2/topicQaList`,{type:action.type,topic_id:action.topic_id,skip:action.skip,limit:action.limit}),
  {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (action.LoadMore) {//如果有返回值 返回user信息
      EventCenter.emit('topicQaListLoadMoreDone', json);
    }else {
      EventCenter.emit('topicQaListDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}

export function dofocusTeacher(action) {//取消报名
  fetch(dm.getUrl_api(`/v2/focusTeacher`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      teacher_id: action.teacher_id
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('focusTeacherDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

}

export function doreviseQuestion(action) {//取消报名
  fetch(dm.getUrl_api(`/v2/reviseQuestion`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: action.content,
      id: action.id
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('reviseQuestionDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

}


export function dopostQuestionCallback(action) {//提交电话预约专家诊断
  fetch(dm.getUrl_api(`/v2/postQuestionCallback`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      callbackType: action.callbackType,
      questionId: action.questionId
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
      EventCenter.emit('postQuestionCallbackDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

}

export function doinvitedTeacher(action) {//邀请讲师
  fetch(dm.getUrl_api(`/v2/invitedTeacher`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invite_id: action.invite_id,
      question_id: action.question_id
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('invitedTeacherDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


//是否接受邀请
export function doProcessInvited(action) {
  fetch(dm.getUrl_api(`/v2/processInvited`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isAccept: action.isAccept,
      questionId: action.questionId
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('ProcessInvitedDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


export function dosearchTeacher(action) {//搜索讲师
  fetch(dm.getUrl_api(`/v2/searchTeacher`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: action.name,
      question_id: action.question_id,
      skip: action.skip,
      limit: action.limit
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (action.LoadMore) {
      EventCenter.emit('searchTeacherLoadMoreDone', json);
    }else {
      EventCenter.emit('searchTeacherDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

}

export function doaddAnswer(action) {//我要评论
  fetch(dm.getUrl_api(`/v2/addAnswer`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: action.content,
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (action.LoadMore) {
      EventCenter.emit('searchTeacherLoadMoreDone', json);
    }else {
      EventCenter.emit('searchTeacherDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

}

export function dofocusTopic(action) {//关注话题
  console.log('dofocusTopic',action);
  fetch(dm.getUrl_api(`/v2/focusTopic`), {
    // method: 'GET',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic_id: action.topic_id,
      taskId: action.taskId ? action.taskId : null,
      topicIds: action.topicIds ? action.topicIds : null
    })
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    EventCenter.emit('focusTopicDone', json);
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });

}

//topicCenter 话题中心
//讲师中心
export function dotopicCenter (action) {

  fetch(dm.getUrl_api(`/v2/topicCenter`,{taskId: action.taskId,skip:action.skip,limit:action.limit,user_id: action.user_id,question_id:action.question_id}),
  {
    method: 'GET',
    // headers: assign(dm.getHttpHeadMyAuth(), {}),
  })
  .then(checkHTTPStatus)
  .then(parseJSON)
  .then( (json) => {
    if (action.LoadMore) {//如果有返回值 返回user信息
      EventCenter.emit('topicCenterLoadMoreDone', json);
    }else {
      EventCenter.emit('topicCenterDone', json);
    }
    // EventCenter.emit("REQUEST_END", action);
  }).catch( (ex) => {
    // EventCenter.emit("REQUEST_END", action);
    if(__DEBUG__) console.log('Fetch failed', ex);
  });
}


export const QaStore = {
  dispatcherIndex: Dispatcher.register( (action) => {
      if (action.actionType) {
          if( eval("typeof " + 'do' + action.actionType) === 'function') {
              eval('do' + action.actionType).call(null, action);
          }
      }
      return true; // No errors. Needed by promise in Dispatcher.
  })
}
