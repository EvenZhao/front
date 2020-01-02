import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import { dm } from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import LiveLessonDiv from '../components/LiveLessonDiv';
import OfflineLessonDiv from '../components/OfflineLessonDiv';
import BlackAlert from '../components/BlackAlert';


function getStrleng(str, maxstrlen) {
  var myLen = 0;
  var i = 0;
  if (str != null) {
    for (; (i < str.length) && (myLen <= maxstrlen * 2); i++) {
      if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128)
        myLen++;
      else
        myLen += 2;
    }
  } else {
    myLen = 0;
  }

  return myLen;
}
var skip = 0
class QaDetail extends React.Component {

  constructor(props) {
    super(props);
    this.wx_config_share_home = {
      title: '',
      desc: '',
      link: document.location.href + '',
      imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
      type: 'link'
    };
    this.state = {
      //是否关注
      isAttention: false,
      //是否采纳
      isAdopt: false,
      result: {},
      answerList: [],
      lesson: [],
      lessonQuestion: [],
      topicList: [],
      isLogin: false,
      changeCollectedType: false,
      isShow: false,
      nick_name: '',
      callInvitedAlert: false,
      loadmore: true,
      reservedLives: [],
      account_type: 0,
      newComment: '',
      user: {},
      isPhoneShow: false,
      isShowAnswer: false,
      isCanUseQuestion: false,//判断追问结果提示信息
      CanUseQuestionTitle: '',
      answerNum: 500,
      canUseQuestionCallback: false,
      callbackNum: 0,
      salesInfo: {},
      alertIsShow: false,  //是否显示黑色弹框
      alertWord: ''   //黑色弹框文案
    }

  }

  _handlequestionDetail4Done(re) {//问题详情的数据
    var result, user
    result = re.result || {}
    user = re.user || {}
    var question = result.question || {}
    this.wx_config_share_home = {
      title: question.title || '',
      desc: question.content || '',
      link: document.location.href + '',
      imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
      type: 'link'
    };
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    });
    this.setState({
      result: result,
      lesson: result.lesson || [],
      lessonQuestion: result.lessonQuestion || [],
      topicList: result.topicList || [],
      isLogin: user.isLogined,
      changeCollectedType: result.isCollected,
      callInvitedAlert: result.callInvitedAlert,//是否接受邀请
      reservedLives: re.reservedLives || [],
      answerContent: result.answerContent,
      account_type: user.account_type || 0,
      newComment: question.content || '',
      content: question.content || '',
      user: user,
      isClosely: false,
      close_time: result.close_time,
      is_callback: result.callback_status !== null ? true : false,
      answerNum: 500 - getStrleng(question.content, 500)

    })

  }

  _handleAnswerListDone(re) {
    if (re && re.result) {
      this.setState({
        answerList: this.state.answerList.concat(re.result),
        loadLength: re.result.length
      }, () => {
        skip = re.result.length
        this.setState({
          loadmore: skip < 15 ? false : true
        })
      })
    }
  }
  _check_answer(e) {
    e.preventDefault();
    var v = e.target.value.trim();
    this.setState({
      newComment: v
    }, () => {
      this.setState({
        answerNum: 500 - getStrleng(this.state.newComment, 500)
      })
    })
  }
  removeHtmlTag(str) {
    if (str) {
      var str1 = str.replace(/<[^>]+>/g, "");
      var str2 = str1.replace(/&nbsp;/ig, '');
    }
    return str2;
  }
  _handleAdoptAnswer(re) {

  }
  componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'questionDetail4',
      id: this.props.match.params.id
    })
    Dispatcher.dispatch({
      actionType: 'AnswerList',
      id: this.props.match.params.id,
      skip: 0,
      limit: 15
    })
  }
  _handlereviseQuestionDone(e) {
    console.log('_handlereviseQuestionDone', e);
    if (e.result) {
      this.setState({
        isShow: false,
        content: this.state.newComment,
      })
    } else {
      this.setState({
        alertIsShow: true,
        alertWord: e.err
      }, () => {
        clearTimeout(this.t)
        this.t = setTimeout(() => {
          this.setState({
            alertIsShow: false
          })
        }, 2000)
      })
    }
  }
  _handlepostQuestionCallbackDone(re) {
    if (re.err) {
      this.setState({
        isCanUseQuestion: true,
        isClosely: false,
        CanUseQuestionTitle: re.err.errCode
      })
    }
    if (re.result) {
      this.setState({
        isCanUseQuestion: true,
        isClosely: false,
        CanUseQuestionTitle: '您的追问申请已提交，我们会尽快安排讲师跟进。'
      })
    }
  }
  componentDidMount() {
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })

    EventCenter.emit("SET_TITLE", '铂略财课-问题详情');
    this._answerList = EventCenter.on("AnswerListDone", this._handleAnswerListDone.bind(this))
    this._getquestionDetail4Done = EventCenter.on("questionDetail4Done", this._handlequestionDetail4Done.bind(this))
    this._handleAdoptAnswer = EventCenter.on("AdoptAnswerDone", this._handleAdoptAnswer.bind(this))
    this._reviseQuestionDone = EventCenter.on("reviseQuestionDone", this._handlereviseQuestionDone.bind(this))
    this._postQuestionCallback = EventCenter.on('postQuestionCallbackDone', this._handlepostQuestionCallbackDone.bind(this))
    this._questionCallbackUserInfo = EventCenter.on('questionCallbackUserInfoDone', this._handlequestionCallbackUserInfoDone.bind(this))
    Dispatcher.dispatch({
      actionType: 'questionCallbackUserInfo',
      // topic_id: re
    })
  }

  componentWillUnmount() {
    this._getquestionDetail4Done.remove()
    this._answerList.remove()
    this._handleAdoptAnswer.remove()
    this._reviseQuestionDone.remove()
    this._postQuestionCallback.remove()
    this._questionCallbackUserInfo.remove()
  }
  _handlequestionCallbackUserInfoDone(e) {
    console.log('_handlequestionCallbackUserInfoDone', e);
    if (e.err) {
      return false
    }
    var result = e.result
    if (e.result) {
      this.setState({
        callbackNum: e.result.callbackNum || 0,
        canUseQuestionCallback: e.result.canUseQuestionCallback,
        salesInfo: e.result.salesInfo
      })
    }
    console.log('e.result.salesInfo', e.result.salesInfo)


  }
  gotoUserDetail(re, isTeacher) {
    if (re) {
      this.props.history.push(isTeacher == 1 ? `${__rootDir}/LecturerHomePage/${re}` : `${__rootDir}/PersonalPgHome/${re}`)
    }
  }

  _answer(id) {
    this.props.history.push(`${__rootDir}/QaDetail/${id}`)
  }

  //关掉弹框及遮罩层
  _hideBlackGround() {
    this.setState({
      callInvitedAlert: false,
    })
  }

  //是否接受邀请,发送请求
  _isInvited(isAccept) {
    Dispatcher.dispatch({
      actionType: 'ProcessInvited',
      isAccept: isAccept,
      questionId: this.props.match.params.id,
    })
  }

  //接受邀请
  _accept() {
    this._isInvited(true);
    this._hideBlackGround();
  }
  //拒绝邀请
  _refuse() {
    this._isInvited(false);
    this._hideBlackGround();
  }
  loadMore() {
    if ((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) < document.documentElement.clientHeight) {
      if (!this.state.loadmore) {
        return
      }
      Dispatcher.dispatch({
        actionType: 'AnswerList',
        id: this.props.match.params.id,
        skip: skip,
        limit: 15
      })
    }
  }
  render() {
    var result = this.state.result || {}
    var canUseQuestionClosely = result.canUseQuestionClosely
    var question = result.question || {}
    var questionContent = this.removeHtmlTag(this.state.content)
    var createTime = new Date(question.create_time).format("yyyy-MM-dd")
    var close_time = new Date(result.close_time).format("yyyy年MM月dd日")
    var callback_status = result.callback_status  //
    var user = this.state.user
    var phone = user.phone
    if (phone) {
      phone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
    var sta = {}
    var stauts_text = ''
    if (callback_status !== null) {//电话预约专家诊断问题类型 (0: 待回电 / 1: 已回电 / 2: 追问待回 / 3: 追问已回)
      switch (callback_status) {
        case 0:
          stauts_text = '待回电'
          sta = {
            backgroundColor: '#fff6c8',
            color: '#ED9D18',
          }
          break;
        case 1:
          stauts_text = '已回电'
          sta = {
            backgroundColor: '#d3eafd',
            color: '#33A2FB',
            // opacity: 0.2
          }
          break;
        case 2:
          stauts_text = '追问待回'
          sta = {
            backgroundColor: '#fff6c8',
            color: '#ED9D18',
          }
          break;
        case 3:
          stauts_text = '追问已回'
          sta = {
            backgroundColor: '#d3eafd',
            color: '#33A2FB',
            // opacity: 0.2,
          }
          break;
      }
    }
    let props = {
      data: this.state.lesson,
      history: this.props.history,
    }
    var lessonList = this.state.lesson.map((item, index) => {

      var start_date = new Date(item.start_time).format("yyyy-MM-dd")
      var lesson_div
      if (item.resource_type == 2) {
        lesson_div = <OnlineLessonDiv {...props} />
      } else if (item.resource_type == 1) {
        lesson_div = <LiveLessonDiv {...props} reservedLives={this.state.reservedLives} />
      } else if (item.resource_type == 3) {
        lesson_div = <OfflineLessonDiv {...props} />
      }
      return (
        <div key={index} style={{ position: 'relative', }}>{lesson_div}</div>
      )
    })
    var lessonQuestionList = this.state.lessonQuestion.map((item, index) => {

      var create_time = new Date(item.create_time).format("yyyy-MM-dd")
      return (
        <div key={index} onClick={this._answer.bind(this, item.id)}>
          <div style={{ fontSize: Fnt_Normal, color: Common.Black, marginTop: 12, }} dangerouslySetInnerHTML={{ __html: item.title }}>
          </div>
          <div style={{ height: 30, lineHeight: '30px', }}>
            <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{ float: 'left', marginTop: 9, }} />
            <span style={{ float: 'left', fontSize: Fnt_Small, color: Common.Light_Gray, marginLeft: 5, }}>{item.question_answer_num || 0}评论</span>
            <div style={{ float: 'right', fontSize: Fnt_Small, color: Common.Light_Gray, }}>{create_time}</div>
          </div>
        </div>
      )
    })
    var status = question.status
    var isMyQuestion = result.isMyQuestion

    var answerList = this.state.answerList.map((item, index) => {
      var user = item.user || {}
      // console.log('dsjkhdjksajkdhsakjdksajdkjsakdjksaj',user);
      var title = this.removeHtmlTag(item.content)
      var isAdopted = null
      var is_callback = item.is_callback
      var isWidth = false;
      if (status == 0 && !isMyQuestion) {
        isAdopted = null
        isWidth = false;
      } else if (isMyQuestion && status == 0) {
        isAdopted = (
          <div style={{ float: 'right', marginTop: 6 }} onClick={this.Adopt.bind(this, question.id, item.id)}>
            <img src={Dm.getUrl_img('/img/v2/icons/unadopt@2x.png')} width={18} height={18} style={{ float: 'left', }} />
            <span style={{ float: 'left', fontSize: Fnt_Normal, color: Common.Gray, marginLeft: 8 }}>采纳</span>
          </div>
        )
        isWidth = true;
      } else if (status !== 0 && item.isAdopted) {
        isAdopted = (
          <div style={{ float: 'right', marginTop: 6, }}>
            <img src={Dm.getUrl_img('/img/v2/icons/adopt@2x.png')} width={18} height={18} style={{ float: 'left', }} />
            <span style={{ float: 'left', fontSize: Fnt_Normal, color: Common.Activity_Text, marginLeft: 8 }}>已采纳</span>
          </div>
        )
        isWidth = true;
      }
      return (
        <div key={index}>
          <div style={{ clear: 'both', paddingTop: 5, }}>
            <div style={{ float: 'left', width: 30, height: 30, position: 'relative', zIndex: 1, }} onClick={this.gotoUserDetail.bind(this, user.id, user.isTeacher)}>
              <img src={user.photo || Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={30} height={30} style={{ borderRadius: 15, }} />
              <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{ ...styles.small_tag, display: user.isTeacher == 1 ? 'block' : 'none' }} />
            </div>
            <div style={{ ...styles.LineClamp, WebkitLineClamp: 1, width: isWidth ? (devWidth - 199) : (devWidth - 134), height: 24, float: 'left', marginLeft: 8, marginTop: 6, fontSize: Fnt_Normal, color: Common.Gray }}>
              <span>{user.nick_name}</span><span style={{ marginLeft: 15 }}>{user.title}</span>
            </div>
            <div style={{ float: 'left', marginLeft: 8, marginTop: 6, display: is_callback ? 'block' : 'none' }}>
              <img src={Dm.getUrl_img('/img/v2/icons/answerByPhone@2x.png')} width={99} height={16} />
            </div>
            <div style={{ float: 'right', }}></div>
            {
              this.state.is_callback ? null : isAdopted
            }
          </div>
          <div style={{ clear: 'both' }}>
          </div>
          <div onClick={this.pinglun.bind(this, item.id, index, item.is_callback)} style={{ ...styles.span_text, height: 60, WebkitLineClamp: 3, marginTop: 10 }}>
            {title}
          </div>
          <div onClick={this.pinglun.bind(this, item.id, index, item.is_callback)} style={{ height: 30, lineHeight: '30px', }}>
            <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{ float: 'left', marginTop: 9, }} />
            <span style={{ float: 'left', fontSize: Fnt_Small, color: Common.Light_Gray, marginLeft: 5, }}>{item.answer_comment_num}评论</span>
            <div style={{ float: 'right', fontSize: Fnt_Small, color: Common.Light_Gray, }}>{new Date(item.last_time).format('yyyy-MM-dd')}</div>
          </div>
          <div style={{ ...styles.line, marginTop: 5, }}>
          </div>
        </div>
      )
    })
    var topicList = this.state.topicList.map((item, index) => {
      return (
        <div key={index} style={{ ...styles.tag }}>{item.name}</div>
      )
    })

    //是否接受邀请弹框
    var inviteAlert = (
      <div style={{ ...styles.white_alert, paddingTop: -1 }}>
        <div style={{ marginTop: 25, fontSize: Fnt_Large, color: Common.Black }}>您已被邀请回答该问题</div>
        <div style={{ color: '#333', fontSize: Fnt_Normal }}>若您接受，请在24小时内提交您的答案。</div>
        <div style={{ color: '#333', fontSize: Fnt_Normal }}>超过4小时未接受该邀请则视为拒绝。</div>
        <div style={styles.alert_bottom}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', borderRight: 'solid 1px #d4d4d4', fontSize: Fnt_Medium, color: Common.Gray }} onClick={this._refuse.bind(this)} >拒绝</div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px', fontSize: Fnt_Medium, color: Common.Activity_Text }} onClick={this._accept.bind(this)}>接受</div>
        </div>
      </div>
    )

    return (
      <div style={{ width: devWidth, height: devHeight, overflowY: 'scroll', }}
        onTouchEnd={this.loadMore.bind(this)}
        ref={(lessonList) => this.lessonList = lessonList}
      >
        <BlackAlert isShow={this.state.alertIsShow} word={this.state.alertWord} />
        <div style={{ backgroundColor: '#000', position: 'absolute', height: window.innerHeight, width: '100%', opacity: 0.5, zIndex: 100, display: this.state.callInvitedAlert ? 'block' : 'none' }} onClick={this._hideBlackGround.bind(this)}></div>
        {this.state.callInvitedAlert ?
          inviteAlert
          :
          null
        }
        <div style={{ ...styles.container, height: callback_status !== null && !isMyQuestion ? devHeight : devHeight - 50, }}>
          <div style={{ backgroundColor: Common.Bg_White, paddingBottom: 10, }}>
            <div style={{ paddingLeft: 12, paddingRight: 12, }}>
              <Link to={{ pathname: `${__rootDir}/TopicCenter`, hash: null, query: null, state: { question_id: this.props.match.params.id } }}>
                <div style={{ ...styles.tag_box, display: this.state.topicList.length > 0 ? 'block' : 'none' }} >
                  {topicList}
                  <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', marginTop: 2, }}>
                    <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width="8" height="14" style={{ float: 'right' }} />
                  </div>
                </div>
              </Link>
              <div style={{ ...styles.line }}>
              </div>
              <div style={{ ...styles.LineClamp, fontSize: Fnt_Medium, color: Common.Light_Black, marginTop: 10, position: 'relative' }}>
                <div style={{ ...sta, position: 'absolute', borderRadius: '2px', lineHeight: 0.8, textAlign: 'center', top: 4, width: 50, height: 16 }}>
                  <span style={{ fontSize: 11 }}>{stauts_text}</span>
                </div>
                <span style={{ marginLeft: stauts_text ? 54 : 0 }} dangerouslySetInnerHTML={{ __html: question.title }}></span>
              </div>
              {/*<div dangerouslySetInnerHTML={{__html: questionContent}} style={{fontSize:14,color:Common.Black,marginTop:10,}}>*/}
              <div style={{ fontSize: 14, color: Common.Black, marginTop: 10, }} dangerouslySetInnerHTML={{ __html: questionContent }}></div>

              <div style={{ width: devWidth, height: 14, position: 'relative', display: result.isMyQuestion && callback_status == null ? 'block' : 'none' }} onClick={this.isShowEdit.bind(this)}>
                <img src={Dm.getUrl_img('/img/v2/icons/edit@2x.png')} width={14} height={12} style={{ position: 'absolute', top: 0, right: 24 }} />
              </div>
              <div style={{ fontSize: Fnt_Normal, color: Common.Light_Gray, marginTop: 8, paddingBottom: 10, height: 30 }}>
                <img src={question.photo} width={20} height={20} style={{ float: 'left', borderRadius: '50px' }} />
                <span style={{ float: 'left', marginLeft: 5, }}>{question.nick_name}</span>
                <div style={{ float: 'right', fontSize: Fnt_Small, color: Common.Light_Gray, }}>提问于 {createTime}</div>
              </div>
              <div style={{ height: 41, textAlign: 'right', display: callback_status !== null && !isMyQuestion ? 'block' : 'none' }}>
                <img src={Dm.getUrl_img('/img/v2/icons/hyzx@2x.png')} width={81} height={19} style={{ verticalAlign: 'middle' }} />
                <span style={{ fontSize: 12, color: '#999999', letterSpacing: '-0.29px', marginLeft: 10, verticalAlign: 'middle' }}>电话预约专家诊断问题</span>
              </div>
            </div>
            <div style={{ height: 30, lineHeight: '30px', paddingLeft: 12, paddingRight: 12, backgroundColor: '#F8F8F8', width: devWidth }}>
              <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{ float: 'left', marginTop: 9, }} />
              <span style={{ float: 'left', fontSize: Fnt_Small, color: Common.Light_Gray, marginLeft: 5, }}>共{question.question_answer_num}个回答</span>
            </div>
          </div>

          <div style={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 5, backgroundColor: Common.Bg_White }}
          >
            {answerList}
            {/*<div style={{display:!this.state.loadmore ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray,marginTop:10,}}>已经到底啦~</div>*/}
            {
              callback_status !== null && !isMyQuestion ?
                <div style={{ backgroundColor: '#F4F8FB', borderRadius: '2px', paddingTop: 12, paddingLeft: 16, paddingRight: 16, paddingBottom: 12 }}>
                  <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 14, color: '#999999', letterSpacing: '0.09px' }}>本问题已被提问者设定为电话预约专家诊断问题，回答内容仅供提问者可见。</span>
                </div>
                :
                <div style={{ backgroundColor: '#FFFFFF', width: devWidth - 24, height: 98, textAlign: 'center', display: this.state.answerList.length < 1 ? 'block' : 'none', lineHeight: 6 }}>
                  <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 14, color: '#999999', letterSpacing: '0.34px' }}>暂无回答</span>
                </div>
            }

          </div>

          <div style={{ backgroundColor: Common.Bg_White, }}>
            <div style={{ ...styles.subject, display: this.state.lesson.length > 0 ? 'block' : 'none' }}>
              <div style={{ fontSize: Fnt_Medium, color: Common.Light_Black, paddingLeft: 12 }}>所属课程</div>
              {lessonList}
              <div style={{ ...styles.line, marginTop: 15, }}></div>
            </div>
            <div style={{ paddingLeft: 12, paddingRight: 12, display: this.state.lessonQuestion.length > 0 ? 'block' : 'none' }}>
              <div style={{ fontSize: Fnt_Medium, color: Common.Light_Black, }}>相关问答</div>
              {lessonQuestionList}
              <div style={{ ...styles.line, marginTop: 5, }}>
              </div>
            </div>

          </div>
          <div style={{ display: isMyQuestion ? 'block' : 'none', position: 'absolute', bottom: 44, right: (devWidth - 246) / 2 }}>
            <img src={Dm.getUrl_img('/img/v2/icons/hyzxicon1@2x.png')} width={81} height={24} style={{}} />
          </div>
        </div>
        {
          isMyQuestion ?
            <div style={{ backgroundColor: '#fff', width: window.screen.width, height: 50, position: 'fixed', bottom: 0 }}>
              <hr style={{ height: 1, backgroundColor: '#f3f3f3', border: 'none' }} />
              <div style={{ padding: '0px 0px 0px 0px' }}>
                <div onClick={this._collect.bind(this)} style={{ float: 'left', width: 80, textAlign: 'center', marginTop: 6 }} >
                  <img src={Dm.getUrl_img('/img/v2/icons/QAguanzhu@2x.png')} style={{ height: 18, width: 18, display: this.state.changeCollectedType ? 'none' : 'block', marginLeft: 62 / 2 }} />
                  <img src={Dm.getUrl_img('/img/v2/icons/online-Fouces@2x.png')} style={{ height: 18, width: 18, display: this.state.changeCollectedType ? 'block' : 'none', marginLeft: 62 / 2 }} />
                  <span style={{ fontSize: 13, color: this.state.changeCollectedType ? '#2196f3' : '#666', marginLeft: this.state.changeCollectedType ? 0 : 0 }}>{this.state.changeCollectedType ? '取消关注' : '关注'}</span>
                </div>
                {
                  canUseQuestionClosely ?
                    <div style={{ width: 85, textAlign: 'center', float: 'left', marginTop: 6, }} onClick={this.goClosely.bind(this)}>
                      <img src={Dm.getUrl_img('/img/v2/icons/QAhuida.png')} style={{ height: 19, width: 16, marginLeft: 69 / 2, display: 'block' }} />
                      <span style={{ fontSize: 13, color: '#666' }}>
                        我要追问
                      </span>
                    </div>
                    :
                    <div>
                      {
                        callback_status == null ?
                          <Link to={{ pathname: this.state.isLogin ? `${__rootDir}/InviteTeacher` : `${__rootDir}/login`, hash: null, query: null, state: { id: this.props.match.params.id } }}>
                            <div style={{ float: 'left', width: 85, textAlign: 'center', display: this.state.account_type ? 'block' : 'none', marginTop: 6, }}>
                              <img src={Dm.getUrl_img('/img/v2/icons/Qayaoqing@2x.png')} style={{ height: 20, width: 20, marginLeft: 70 / 2, display: 'block', }} />
                              <span style={{ fontSize: 13, color: '#666' }}>邀请回答</span>
                            </div>
                          </Link>
                          : null
                      }
                    </div>

                }

                <div style={{ width: devWidth - 165, height: 50, backgroundColor: '#2196f3', float: 'right', }}>
                  {
                    callback_status == null ?
                      <div style={{ width: devWidth - 165, height: 50, textAlign: 'center' }} onClick={this.PgAnserByPhone.bind(this)}>
                        <div style={{ fontFamily: 'PingFangSC-Medium', fontSize: 16, color: '#FFFFFF', letterSpacing: '0.1px', marginTop: 4 }}>电话预约专家诊断</div>
                        <div style={{ fontFamily: 'PingFangSC-Regular', fontSize: 12, color: '#FFFFFF', letterSpacing: '0.29px' }}>48小时内电话答疑</div>
                      </div>
                      :
                      <div style={{ width: devWidth - 165, height: 50, textAlign: 'center', lineHeight: 1.5 }}>
                        <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 14, color: '#FFFFFF', letterSpacing: '0.34px' }}>电话预约专家诊断问题<br />{phone}</span>
                      </div>
                  }
                </div>
              </div>
            </div>
            :
            <div style={{ backgroundColor: '#fff', width: window.screen.width, height: 50, position: 'fixed', bottom: 0, display: callback_status == null ? 'block' : 'none' }}>
              <hr style={{ height: 1, backgroundColor: '#f3f3f3', border: 'none' }} />
              <div style={{ padding: '6px 0px 0px 0px' }}>
                <div onClick={this._collect.bind(this)} style={{ float: 'left', width: window.screen.width / 3, textAlign: 'center' }} >
                  <img src={Dm.getUrl_img('/img/v2/icons/QAguanzhu@2x.png')} style={{ height: 18, width: 18, display: this.state.changeCollectedType ? 'none' : 'block', marginLeft: (window.screen.width / 3 - 20) / 2 }} />
                  <img src={Dm.getUrl_img('/img/v2/icons/online-Fouces@2x.png')} style={{ height: 18, width: 18, display: this.state.changeCollectedType ? 'block' : 'none', marginLeft: (window.screen.width / 3 - 20) / 2 }} />
                  <span style={{ fontSize: 13, color: this.state.changeCollectedType ? '#2196f3' : '#666', marginLeft: this.state.changeCollectedType ? 0 : 0 }}>{this.state.changeCollectedType ? '取消关注' : '关注'}</span>
                </div>
                <Link to={{ pathname: this.state.isLogin ? `${__rootDir}/InviteTeacher` : `${__rootDir}/login`, hash: null, query: null, state: { id: this.props.match.params.id } }}>
                  <div style={{ float: 'left', width: window.screen.width / 3, textAlign: 'center', display: this.state.account_type ? 'block' : 'none' }}>
                    <img src={Dm.getUrl_img('/img/v2/icons/Qayaoqing@2x.png')} style={{ height: 20, width: 20, marginLeft: (window.screen.width / 3 - 15) / 2, display: 'block', }} />
                    <span style={{ fontSize: 13, color: '#666' }}>邀请回答</span>
                  </div>
                </Link>
                <div style={{ width: window.screen.width / 3, textAlign: 'center', float: 'right' }}>
                  <Link to={this.state.isLogin ? { pathname: `${__rootDir}/AnswerQuestion`, hash: null, query: null, state: { title: question.title, question_id: question.id, answerContent: this.state.answerContent } } : `${__rootDir}/login`}>
                    <img src={Dm.getUrl_img('/img/v2/icons/QAhuida.png')} style={{ height: 19, width: 16, marginLeft: (window.screen.width / 3 - 18) / 2, display: 'block' }} />
                    <span style={{ fontSize: 13, color: '#666' }}>
                      {
                        this.state.answerContent ? '编辑我的回答' : '我要回答'
                      }
                    </span>
                  </Link>
                </div>
              </div>
            </div>
        }
        {/*回复弹框*/}
        <div style={{ ...styles.mask, display: this.state.isShow ? 'block' : 'none' }}></div>
        <div style={{ ...styles.reply_box, display: this.state.isShow ? 'block' : 'none' }}>
          <div style={{ ...styles.reply_title, }}>
            <img onClick={this.cancel.bind(this)} src={Dm.getUrl_img('/img/v2/icons/close@2x.png')} width={15} height={15} style={{ float: 'left', marginLeft: 12, marginTop: 14, }} />
            <div style={{ textAlign: 'center', width: window.screen.width - 87, float: 'left', fontSize: Fnt_Normal, color: Common.Gray, }}>
              修改描述
            </div>
            <div onClick={this.button.bind(this)} style={{ ...styles.btn_submit }}>提交</div>
          </div>
          <div style={{ clear: 'both' }}></div>
          <div>
            <textarea style={{ ...styles.content_input }} value={this.state.newComment} onChange={this._check_answer.bind(this)} placeholder="请输入您的内容" />
          </div>
          <div style={{ ...styles.limit_text }}>
            {this.state.answerNum}
          </div>
        </div>
        <div style={{ ...styles.zzc, display: this.state.isShowAnswer ? 'block' : 'none' }}></div>
        <div style={{ ...styles.alert, display: this.state.isShowAnswer ? 'block' : 'none' }}>
          <div style={{ width: 270, textAlign: 'center', marginTop: 17 }}>
            <span style={{ fontFamily: 'PingFangSC-Medium', fontSize: 17, color: '#030303', letterSpacing: '-0.41px' }}>设置成功</span>
          </div>
          <div style={{ lineHeight: '12px' }}>
            <div style={{ width: 270, textAlign: 'center' }}>
              <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#030303', letterSpacing: '-0.31px' }}>我们将于48小时内安排专业老师为您提供</span>
            </div>
            <div style={{ width: 270, textAlign: 'center' }}>
              <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#030303', letterSpacing: '-0.31px' }}>电话解答服务，届时请保持电话畅通。</span>
            </div>
          </div>
          <div style={{ ...styles.line, marginTop: 14 }}></div>
          <div style={{ width: 270, textAlign: 'center', height: 45, lineHeight: 3 }} onClick={this._toback.bind(this)}>
            <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 17, color: '#0076ff', letterSpacing: '-0.41px', }}>知道了</span>
          </div>
        </div>
        <div style={{ ...styles.zzc, display: this.state.isPhoneShow ? 'block' : 'none' }}></div>
        {
          this.state.canUseQuestionCallback ?
            <div style={{ ...styles.alert, display: this.state.isPhoneShow ? 'block' : 'none' }}>
              <div style={{ width: 270, textAlign: 'center', marginTop: 17 }}>
                <span style={{ fontFamily: 'PingFangSC-Medium', fontSize: 17, color: '#030303', letterSpacing: '-0.41px' }}>您的服务次数已用完</span>
              </div>
              <div style={{ lineHeight: '12px' }}>
                <div style={{ width: 270, textAlign: 'center' }}>
                  <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#030303', letterSpacing: '-0.31px' }}>如需继续使用</span>
                </div>
                <div style={{ width: 270, textAlign: 'center' }}>
                  <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#030303', letterSpacing: '-0.31px' }}>请联系铂略产品顾问{this.state.salesInfo ? this.state.salesInfo.name : ''}</span>
                </div>
              </div>
              <div style={{ ...styles.line, marginTop: 14 }}></div>
              <div style={{ width: 270, textAlign: 'center', height: 45, lineHeight: 3 }} onClick={this._toback.bind(this)}>
                <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 17, color: '#0076ff', letterSpacing: '-0.41px', }}>知道了</span>
              </div>
            </div>
            :
            <div style={{ ...styles.alert, display: this.state.isPhoneShow ? 'block' : 'none' }}>
              <div style={{ width: 270, textAlign: 'center', marginTop: 17 }}>
                <span style={{ fontFamily: 'PingFangSC-Medium', fontSize: 17, color: '#030303', letterSpacing: '-0.41px' }}>提示</span>
              </div>
              <div style={{ lineHeight: '16px' }}>
                <div style={{ width: 244, height: 28, marginLeft: 12 }}>
                  <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#030303', letterSpacing: '-0.31px' }}>
                    本功能为尊贵会员专享，如需尊享此服务，请您联系铂略
                      {
                      this.state.salesInfo ?
                        <span>产品顾问{this.state.salesInfo.name}</span>
                        :
                        <span>
                          客服
                          </span>
                    }
                  </span>
                </div>
              </div>
              <div style={{ ...styles.line, width: 270, marginTop: 14 }}></div>
              {
                this.state.salesInfo ?
                  <div style={{ width: 270, textAlign: 'center', height: 45, lineHeight: 3 }} onClick={this._toback.bind(this)}>
                    <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 17, color: '#0076ff', letterSpacing: '-0.41px', }}>知道了</span>
                  </div>
                  :
                  <div>
                    <div style={{ width: 270 / 2, textAlign: 'center', height: 45, lineHeight: 3, float: 'left' }} onClick={this._toback.bind(this)}>
                      <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 17, color: '#0076ff', letterSpacing: '-0.41px', }}>知道了</span>
                    </div>
                    <div style={{ width: 270 / 2, textAlign: 'center', height: 45, lineHeight: 3, float: 'left', borderBottomRightRadius: 12 }} onClick={this._applyVoucher.bind(this)}>
                      <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 17, color: '#0076ff', letterSpacing: '-0.41px', }}>联系客服</span>
                    </div>
                  </div>
              }

            </div>
        }
        <div style={{ ...styles.zzc, display: this.state.isClosely ? 'block' : 'none' }}></div>
        <div style={{ ...styles.alert, display: this.state.isClosely ? 'block' : 'none' }}>
          <div style={{ width: 270, textAlign: 'center', marginTop: 14 }}>
            <span style={{ fontFamily: 'PingFangSC-Medium', fontSize: 17, color: '#030303', letterSpacing: '-0.41px' }}>确认提交追问</span>
          </div>
          <div style={{ lineHeight: '12px', height: 30 }}>
            <div style={{ width: 246, marginLeft: 12 }}>
              <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#030303', letterSpacing: '-0.31px' }}>点击确认后，将为您提交追问申请。</span>
            </div>
            <div style={{ width: 246, marginLeft: 12 }}>
              <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#030303', letterSpacing: '-0.31px' }}>(本问题追问功能有效期限至{close_time}截止)</span>
            </div>
          </div>
          <div style={{ ...styles.line, marginTop: 14 }}></div>
          <div style={{ width: 270 }}>
            <div style={{ ...styles.closeButton, float: 'left' }} onClick={this.cancelClose.bind(this)}>
              <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 17, color: '#0076ff', letterSpacing: '-0.41px', }}>取消</span>
            </div>
            <div style={{ ...styles.closeButton, float: 'right', backgroundColor: '#2196f3', borderBottomRightRadius: 12 }} onClick={this.ButtomSubmit.bind(this)}>
              <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 17, color: '#FFFFFF', letterSpacing: '-0.41px', }} >确认</span>
            </div>
          </div>
        </div>
        <div style={{ ...styles.zzc, display: this.state.isCanUseQuestion ? 'block' : 'none' }}></div>
        <div style={{ ...styles.alert, display: this.state.isCanUseQuestion ? 'block' : 'none' }}>
          <div style={{ width: 270, textAlign: 'center', marginTop: 17 }}>
            <span style={{ fontFamily: 'PingFangSC-Medium', fontSize: 17, color: '#030303', letterSpacing: '-0.41px' }}>提示</span>
          </div>
          <div style={{ lineHeight: '12px' }}>
            <div style={{ width: 270, textAlign: 'center' }}>
              <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 13, color: '#030303', letterSpacing: '-0.31px' }}>{this.state.CanUseQuestionTitle}</span>
            </div>
          </div>
          <div style={{ ...styles.line, marginTop: 14 }}></div>
          <div style={{ width: 270, textAlign: 'center', height: 45, lineHeight: 3 }} onClick={this._toback.bind(this)}>
            <span style={{ fontFamily: 'PingFangSC-Regular', fontSize: 17, color: '#0076ff', letterSpacing: '-0.41px', }}>知道了</span>
          </div>
        </div>
      </div>
    )
  }
  cancelClose() {
    this.setState({
      isClosely: false
    })
  }
  Adopt(questionId, answerId) {
    Dispatcher.dispatch({
      actionType: 'AdoptAnswer',
      id: answerId,
      question_id: questionId
    })
  }
  _collect() {
    if (this.state.isLogin == true) {
      this.setState({
        changeCollectedType: !this.state.changeCollectedType
      })
      Dispatcher.dispatch({
        actionType: 'CollectQuestion',
        question_id: this.props.match.params.id
      })
    } else {
      this.props.history.push(`${__rootDir}/login`)
    }
  }
  ButtomSubmit() {
    Dispatcher.dispatch({
      actionType: 'postQuestionCallback',
      callbackType: 1,
      questionId: this.props.match.params.id,
    })
  }
  goClosely() {
    this.setState({
      isClosely: true,
    })
  }
  pinglun(e, index, is_callback) {//对xxxx回复
    // <Link to={ `${__rootDir}/AnswerDetail/${item.id}`}>
    this.props.history.push({ pathname: `${__rootDir}/AnswerDetail/${e}`, hash: null, query: null, state: { id: e, nickName: this.state.answerList[index].user.nick_name, is_callback: this.state.is_callback } })
  }
  closePingLun(e) {
    this.setState({
      isShow: false
    })
  }
  button(e) {
    Dispatcher.dispatch({
      actionType: 'reviseQuestion',
      id: this.props.match.params.id,
      content: this.state.newComment,
    })
  }
  cancel(e) {
    this.setState({
      isShow: false,
      item: {},
      newComment: this.state.newComment
    })
  }
  isShowEdit() {
    this.setState({
      isShow: true,
    })
  }
  _toback() {
    this.setState({
      isShowAnswer: false,
      isPhoneShow: false,
      isCanUseQuestion: false,
    })
  }
  _applyVoucher() {
    if (isWeiXin) {
      this.props.history.push({ pathname: `${__rootDir}/freeInvited` })
    } else {
      window.location.href = 'https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
    }
  }
  PgAnserByPhone() {
    if (this.state.callbackNum !== 0 && this.state.callbackNum !== null) {
      this.props.history.push(`${__rootDir}/PgAnserByPhone/${this.props.match.params.id}`)
    } else {
      this.setState({
        isPhoneShow: true
      })
    }
  }
}

var styles = {
  container: {
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  tag_box: {
    backgroundColor: Common.Bg_White,
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
    display: 'flex',
    flexGrow: 1
  },
  tag: {
    height: 20,
    lineHeight: '20px',
    fontSize: 11,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#E3F1FC',
    color: Common.Black,
    marginRight: 15,
    borderRadius: 8,
    display: 'flex',
    float: 'left'
  },
  line: {
    width: devWidth - 24,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  LineClamp: {
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    // WebkitLineClamp: 2,
    fontWeight: 'bold',
    // height:48,
    width: devWidth - 24,
  },
  ques_title: {
    width: devWidth - 24,
    height: '42px',
    lineHeight: '21px',
    fontSize: Fnt_Medium,
    color: Common.Black,
  },
  quest_con: {
    width: devWidth - 24,
    height: '34px',
    lineHeight: '17px',
    fontSize: Fnt_Normal,
    color: Common.Black,
    marginTop: 6,
    paddingBottom: 10,
    marginBottom: 18,
  },
  subject: {
    marginTop: 12,
    paddingTop: 15,
    paddingBottom: 15,
    //paddingLeft:12,
    //paddingRight:12,
  },
  span_text: {
    fontSize: 14,
    color: '#333',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    lineHeight: '20px'
  },
  list: {
    // height: 667,
    overflow: 'scroll',
  },
  lessonDiv: {
    height: 80,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingRight: 12,
    position: 'relative'
  },
  lessonPng: {
    width: 127.5,
    height: 80,
    marginRight: 15,
    float: 'left',
  },
  isFree: {
    fontSize: 11,
    color: "#2196f3",
    border: '1px solid',
    borderColor: '#2196f3',
    borderRadius: '4px',
    float: 'left',
    marginRight: 9,
    paddingLeft: 5,
    paddingRight: 5,
  },
  timePng: {
    width: 15,
    height: 15,
    float: 'left',
    // border: '1px solid',
    marginRight: 7,
  },
  placePng: {
    width: 13,
    height: 15,
    float: 'left',
    marginLeft: 9,
    // border: '1px solid',
    marginRight: 7,
  },
  lessonTime: {
    fontSize: 12,
    color: '#999',
    float: 'left',
    lineHeight: '16px',
    marginRight: 14,
  },
  short_line: {
    float: 'left',
    lineHeight: '14px',
    color: '#e5e5e5',
    height: 22,
    width: 1
  },
  chapter: {
    fontSize: 12,
    color: '#666',
    float: 'left',
    lineHeight: '16px',
    marginLeft: 14,
  },
  isTest: {
    fontSize: 11,
    color: '#999',
    lineHeight: '16px',
    float: 'left',
  },
  zzc: {
    width: devWidth,
    height: devHeight,
    backgroundColor: '#cccccc',
    position: 'absolute',
    opacity: 0.5,
    zIndex: 998,
    top: 0,
  },
  pinglunDiv: {
    width: window.screen.width,
    height: 197,
    backgroundColor: '#ffffff',
    position: 'absolute',
    zIndex: 999,
    bottom: 0
  },
  pinglunFirst: {
    height: 41,
    width: window.screen.width,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    borderBottomStyle: 'solid'
  },
  inputText: {
    width: window.screen.width,
    // height:109,
    resize: 'none',
    border: 'none',
    padding: '16px 12px 98px 12px',
    fontSize: 14,
    wordBreak: 'break-all'
  },
  content_input: {
    width: window.screen.width - 24,
    resize: 'none',
    border: 'none',
    padding: '15px 12px 55px 12px',
    fontSize: 14,
    wordBreak: 'break-all',
  },
  limit_text: {
    color: '#a4a4a4',
    fontSize: Fnt_Normal,
    textAlign: 'right',
    paddingRight: 20,
    paddingTop: 10,
    height: 35,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    borderTopStyle: 'solid',
  },
  small_tag: {
    position: 'absolute',
    zIndex: 10,
    bottom: -1,
    right: 2,
  },
  white_alert: {
    width: devWidth - 100,
    height: 150,
    backgroundColor: Common.Bg_White,
    borderRadius: 12,
    position: 'absolute',
    zIndex: 1000,
    top: 180,
    left: 50,
    textAlign: 'center',
  },
  alert_bottom: {
    position: 'absolute',
    zIndex: 201,
    bottom: 0,
    left: 0,
    width: devWidth - 100,
    height: 42,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#d4d4d4',
    display: 'flex',
    flex: 1,
  },
  mask: {
    backgroundColor: Common.Light_Black,
    opacity: 0.3,
    position: 'absolute',
    width: window.screen.width,
    height: window.innerHeight,
    zIndex: 2,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  reply_box: {
    width: window.screen.width,
    height: 198,
    backgroundColor: Common.Bg_White,
    position: 'absolute',
    bottom: 0,
    zIndex: 3,
  },
  reply_title: {
    height: 42,
    lineHeight: '42px',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  btn_submit: {
    float: 'right',
    marginRight: 20,
    width: 40,
    lineHeight: '42px',
    height: 42,
    backgroundColor: Common.Bg_White,
    color: Common.Activity_Text,
    fontSize: Fnt_Medium,
    border: 'none',
  },
  content_input: {
    width: window.screen.width - 24,
    resize: 'none',
    border: 'none',
    padding: '15px 12px 55px 12px',
    fontSize: 14,
    wordBreak: 'break-all',
  },
  limit_text: {
    color: '#a4a4a4',
    fontSize: Fnt_Normal,
    textAlign: 'right',
    paddingRight: 20,
    paddingTop: 10,
    height: 35,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    borderTopStyle: 'solid',
  },
  alert: {
    width: 270,
    height: 131,
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    position: 'absolute',
    left: (devWidth - 270) / 2,
    top: 190,
    zIndex: 999,
  },
  zzc: {
    width: devWidth,
    height: devHeight,
    backgroundColor: '#cccccc',
    position: 'absolute',
    opacity: 0.5,
    zIndex: 998,
    top: 0,
  },
  alertButton: {
    width: devWidth,
    height: 45,
  },
  // line:{
  //   width:devWidth,
  //   height:1,
  //   backgroundColor:'#D8D8D8',
  //   // marginLeft:20,
  //   // marginTop:8,
  //   // marginBottom: 8,
  // },
  closeButton: {
    width: 135,
    textAlign: 'center',
    height: 45,
    lineHeight: 3,
  }
}


export default QaDetail;
