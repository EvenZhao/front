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
import QaListFilter from './QaListFilter'
import PgBottomMeun from '../components/PgBottomMeun';
import FullLoading from '../components/FullLoading';
import LoadFailure from '../components/LoadFailure'
import Guide from '../components/Guide'


var width = window.screen.width
var innerHeight = window.innerHeight
var skip = 0

class Qa extends React.Component {

  constructor(props) {
    super(props);
    this.wx_config_share_home = {
      title: '问答-铂略咨询',
      desc: '铂略在线问答包含财务，税务，软技能三大类，涵盖会计准则，财务报表，Excel&PPT，业财融合，一带一路，内控与合规，财务领导力，管理会计，全面预算，财务分析，成本控制，共享服务，融资与上市，兼并重组，资金管理，税务合规与筹划，发票，非贸付汇，转让定价，出口退税，税收优惠。',
      link: document.location.href + '',
      imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
      type: 'link'
    };
    this.state = {
      teacherCount: '', //老师人数
      topicCount: '', //话题关注数 如无为null
      questionList: [],//问题列表
      questionListHieght: innerHeight - 156,//初始化高度屏幕高度减去上面两个框高度
      teacherQADispaly: true,//顶部导航栏 消失或隐藏
      topNav: 0,
      questionButton: true, //提问按钮滑动消失状态
      user: {},
      isLoading: true,
      req_err: false,
    }
  }

  _handleQuestionListTimeout() {
    this.setState({
      req_err: true,
    })
  }

  _handleQuestionListDone(re) {
    // console.log('_handleQuestionListDone===',re);
    var result = re.result || {}
    this.setState({
      teacherCount: result.teacherCount || 0,
      topicCount: result.topicCount || 0,
      questionList: result.questionList || [],
      user: re.user || {},
      isLoading: false,
    }, () => {
      skip = this.state.questionList.length || ''
    })
  }
  _handleQuestionListLoadMoreDone(re) {

    var result = re.result || {}
    this.setState({
      questionList: this.state.questionList.concat(result.questionList || []),
      isLoading: false,
    }, () => {
      skip = this.state.questionList.length || ''
    })
  }
  _labelScorll(re) {
    if (this.lessonList.scrollTop <= 20) {
      this.setState({
        teacherQADispaly: true,
        topNav: 0,
        questionListHieght: innerHeight - 146, //190为顶部导航栏 还有间距的高度
        questionButton: true
      })
    } else {
      this.setState({
        teacherQADispaly: false,
        questionListHieght: innerHeight - 96, // 去掉顶部导航栏的高度
        questionButton: true,
        topNav: 86
      })
    }
    if ((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) < document.documentElement.clientHeight) {

      EventCenter.emit("QAListLoadMore", skip)
    }
  }
  componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })
  }
  componentDidMount() {
    EventCenter.emit("SET_TITLE", '铂略财课-问答');
    this._getQuestionListDone = EventCenter.on('QuestionListDone', this._handleQuestionListDone.bind(this))
    this._getQuestionListLoadMoreDone = EventCenter.on("QuestionListLoadMoreDone", this._handleQuestionListLoadMoreDone.bind(this))
    this.e_QuestionListTimeout = EventCenter.on('QuestionListTimeout', this._handleQuestionListTimeout.bind(this))
  }
  changeQuestion(e) {
    this.setState({
      questionButton: false
    })
  }
  componentWillUnmount() {
    this._getQuestionListDone.remove()
    this._getQuestionListLoadMoreDone.remove()
    this.e_QuestionListTimeout.remove()
  }
  gotoTW() {
    var user = this.state.user || {}
    if (user.isLogined) {
      this.props.history.push(`${__rootDir}/AskQuestion`)
    } else {
      this.props.history.push(`${__rootDir}/login`)
    }
  }

  _goQaDetail(id) {
    this.props.history.push({ pathname: `${__rootDir}/QaDetail/${id}` });
  }

  _goLecturerPage(id, isTeacher) {

    if (isTeacher == 1) {
      //跳转到讲师主页
      this.props.history.push(`${__rootDir}/LecturerHomePage/${id}`);
    } else {

      this.props.history.push(`${__rootDir}/PersonalPgHome/${id}`);
    }

  }

  render() {
    var questionList = this.state.questionList.map((item, index) => {
      var answer = item.answer ? item.answer : {}
      var callback_status = item.callback_status
      var status = {}
      var stauts_text = ''
      if (callback_status !== null) {//电话预约专家诊断问题类型 (0: 待回电 / 1: 已回电 / 2: 追问待回 / 3: 追问已回)
        switch (callback_status) {
          case 0:
            stauts_text = '待回电'
            status = {
              backgroundColor: '#fff6c8',
              color: '#ED9D18',
            }
            break;
          case 1:
            stauts_text = '已回电'
            status = {
              backgroundColor: '#d3eafd',
              color: '#33A2FB',
              // opacity: 0.2
            }
            break;
          case 2:
            stauts_text = '追问待回'
            status = {
              backgroundColor: '#fff6c8',
              color: '#ED9D18',
            }
            break;
          case 3:
            stauts_text = '追问已回'
            status = {
              backgroundColor: '#d3eafd',
              color: '#33A2FB',
              // opacity: 0.2,
            }
            break;
        }
      }
      var user = item.answer ? item.answer.user : {}
      var is_teacher = 0;//1:讲师 0:个人
      if (item.answer && item.answer.user && item.answer.user.is_teacher) {
        is_teacher = item.answer.user.is_teacher;
      }
      var photo = user && user.photo ? user.photo : ''
      return (
        <div key={index}>
          <div>
            <Link to={`${__rootDir}/QaDetail/${item.id}`} >
              <div style={{ ...styles.title, ...styles.LineClamp }} dangerouslySetInnerHTML={{ __html: item.title }}>
              </div>
            </Link>
            {
              callback_status == null ?
                <div>
                  <div style={{ marginTop: 12, display: item.answer ? 'block' : 'none' }}>
                    <div style={{ float: 'left', width: 30, height: 30, position: 'relative', zIndex: 1, }}>
                      <img src={photo} width={30} height={30} style={{ borderRadius: 15, }} onClick={this._goLecturerPage.bind(this, user.id, is_teacher)} />
                      <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{ ...styles.small_tag, display: is_teacher == 1 ? 'block' : 'none' }} />
                    </div>

                    <Link to={`${__rootDir}/QaDetail/${item.id}`} >
                      <div style={{ paddingLeft: 8, marginTop: 5, float: 'left', marginBottom: 5, width: devWidth - 62 }}>
                        <span style={{ color: Common.Gray, fontSize: Fnt_Normal, }}>{user.nick_name}</span>
                        <span style={{ color: Common.Gray, fontSize: Fnt_Normal, marginLeft: 10, }}>{user.title}</span>
                      </div>
                    </Link>
                  </div>
                  {
                    item.answer ?
                      <div style={{ ...styles.LineClamp, fontSize: 14, color: Common.Black, height: 40, }} dangerouslySetInnerHTML={{ __html: answer.content }} onClick={this._goQaDetail.bind(this, item.id)}></div>
                      :
                      <p style={{ color: '#999', fontSize: 14, marginTop: 10 }}>还没有答案，快来做第一个回答者吧~</p>
                  }
                </div>
                :
                <Link to={`${__rootDir}/QaDetail/${item.id}`} >
                  <div style={{ width: devWidth - 24, height: 40, position: 'relative' }}>
                    <div style={{ ...status, position: 'absolute', borderRadius: '2px', lineHeight: 0.8, textAlign: 'center', top: 4, width: 50, height: 16 }}>
                      <span style={{ fontSize: 11 }}>{stauts_text}</span>
                    </div>
                    <div style={{}}>
                      <span style={{ ...styles.callback_status, marginLeft: 54 }}>{item.callback_hint}</span>
                    </div>
                  </div>
                </Link>
            }

            <div style={{ ...styles.line, marginTop: 12, }}></div>
          </div>
        </div>
      )
    })
    return (
      <div style={{ width: devWidth, height: devHeight, position: 'relative', zIndex: 1 }}>
        {
          this.state.req_err ?
            <LoadFailure />
            :
            <div
              onTouchEnd={() => { this._labelScorll(this.lessonList) }}>
              <FullLoading isShow={this.state.isLoading} />
              <div style={{ backgroundColor: Common.Bg_White, overflow: 'hidden', display: this.state.teacherQADispaly ? 'block' : 'none' }}>
                <Link to={`${__rootDir}/TeacherCenter`}>
                  <div style={{ ...styles.qa_box }}>
                    <div style={{ float: 'left', marginTop: 11, }}>
                      <img src={Dm.getUrl_img('/img/v2/icons/tch@2x.png')} width={17} height={16} />
                    </div>
                    <div style={{ ...styles.tch_text }}>
                      讲师中心
                </div>
                    <div style={{ float: 'right', }}>
                      <span style={{ fontSize: Fnt_Small, color: Common.Gray, float: 'left', marginTop: 12, }}>{this.state.teacherCount}</span>
                      <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width={8} height={14} style={{ marginLeft: 12, float: 'right', marginTop: 15, }} />
                    </div>
                  </div>
                </Link>
                <div style={{ ...styles.line, marginLeft: 12, marginRight: 12, }}></div>
                <Link to={this.state.user.isLogined ? (this.state.topicCount ? `${__rootDir}/MyPersonalized` : `${__rootDir}/TopicCenter`) : `${__rootDir}/login`}>
                  <div style={{ ...styles.qa_box, }}>
                    <div style={{ float: 'left', marginTop: 11, }}>
                      <img src={Dm.getUrl_img('/img/v2/icons/topic@2x.png')} width={18} height={14} />
                    </div>
                    {
                      this.state.topicCount > 0 ?
                        <div style={{ ...styles.tch_text }}>
                          查看我的个性化推荐
                  </div>
                        :
                        <div style={{ ...styles.tch_text }}>
                          关注话题，定制我的个性化推荐
                  </div>
                    }
                    <div style={{ float: 'right', }}>
                      <span style={{ fontSize: Fnt_Small, color: Common.Gray, float: 'left', marginTop: 12, }}>{this.state.topicCount || '查看'}</span>
                      <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width={8} height={14} style={{ marginLeft: 12, float: 'right', marginTop: 15, }} />
                    </div>
                  </div>
                </Link>
              </div>
              {/*问答筛选条件*/}
              <div style={{ ...styles.qa_tab, marginTop: this.state.teacherQADispaly ? 10 : 0, }}>
                <QaListFilter />
              </div>
              {/*问答列表*/}

              <div style={{ paddingLeft: 12, paddingRight: 12, backgroundColor: Common.Bg_White, height: this.state.teacherQADispaly ? (innerHeight - 202) : (innerHeight - 105), width: window.screen.width - 24, position: 'relative', zIndex: 1 }}>

                <div
                  ref={(lessonList) => this.lessonList = lessonList}
                  style={{ ...styles.questionListDiv, height: this.state.teacherQADispaly ? (innerHeight - 202) : (innerHeight - 105) }}>
                  {questionList}
                </div>
              </div>
              <div style={{ position: 'fixed', zIndex: 9999, bottom: 0, width: window.screen.width, height: 'auto' }}>
                <PgBottomMeun type={'Qa'} />
              </div>
            </div>
        }
        <div style={{ ...styles.btn_qa, display: this.state.questionButton ? 'block' : 'none' }} onClick={() => { this.gotoTW() }}>
          <div style={{ ...styles.qa_text }}>
            提问
            </div>
        </div>
        <Guide type={'qa'} />
      </div>
    )
  }
}

var styles = {
  qa_box: {
    width: window.screen.width - 30,
    paddingLeft: 15,
    paddingRight: 15,
    height: 43,
    overflow: 'hidden'
  },
  tch_text: {
    fontSize: Fnt_Medium,
    color: Common.Light_Black,
    fontWeight: 'bold',
    float: 'left',
    marginLeft: 7,
    marginTop: 10,
  },
  line: {
    width: window.screen.width - 24,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  qa_tab: {
    height: 45,
    width: window.screen.width,
  },
  title: {
    fontSize: Fnt_Medium,
    color: Common.Black,
    marginTop: 15,
    fontWeight: 'bold',
    // height:40,
    lineHeight: '20px',
  },
  LineClamp: {
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    width: window.screen.width - 24,
  },
  btn_qa: {
    position: 'fixed',
    zIndex: 999,
    width: 56,
    height: 56,
    bottom: 70,
    left: window.screen.width / 2 - 28,
    textAlign: 'center',
    backgroundImage: 'url(' + Dm.getUrl_img('/img/v2/icons/bg_qa@2x.png') + ')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
    cursor: 'pointer',//针对iphone7点击无响应
  },
  qa_text: {
    color: '#fff',
    fontSize: Fnt_Medium,
    width: 56,
    height: '56px',
    lineHeight: '56px',
  },
  questionListDiv: {
    width: width,
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  small_tag: {
    position: 'absolute',
    zIndex: 10,
    bottom: -1,
    right: 2,
  },
  callback_status: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666666',
    letterSpacing: '-0.34px',
  }
}


export default Qa;
