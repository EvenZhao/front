import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import {dm} from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'

var skip = 0
class TopicDetail extends React.Component {

  constructor(props) {
    super(props);
    this.wx_config_share_home = {
        title: '话题详情',
        desc: '',
        link: document.location.href + '',
        imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
        type: 'link'
    };
    this.state={
      //是否关注
      isAttention:false,
      checkNum: 0,
      topic_info:{},
      lesson:[],
      questionList:[],
      hotClassDiv:true,//判断是否隐藏热门课程
      questionListHieght: window.innerHeight-358,

    }
    this.tab_box = ['最新问答','最热问答','待回答问题']
  }
  _handletopicDetailDone(re){
    var result = re.result || {}
    this.wx_config_share_home = {
        title: result.topic_info || '话题详情',
        desc: '',
        link: document.location.href + '',
        imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
        type: 'link'
    };
    this.setState({
      topic_info: result.topic_info,
      lesson: result.lesson,
      isAttention: result.topic_info.isFocus,
    })
  }
  _handletopicQaListDone(re){
    var result = re.result || {}
    skip = result.questionList.length
    this.setState({
      questionList: result.questionList || []
    })
  }
  _handletopicQaListLoadMoreDone(re){
    var result = re.result || {}
    this.setState({
      questionList: this.state.questionList.concat(result.questionList || [])
    },()=>{
      skip = this.state.questionList.length
    })
  }
  _labelScorll(re){
    if (this.lessonList.scrollTop==0) {
      this.setState({
        hotClassDiv: true,
        questionListHieght: window.innerHeight-358,

      })
    }else if (this.lessonList.scrollTop !== 0)
    {
      this.setState({
        hotClassDiv: false,
        questionListHieght:window.innerHeight-162
      })
    }
    if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
      console.log('LoadMore questionList');
      Dispatcher.dispatch({
        actionType: 'topicQaList',
        topic_id: this.props.match.params.id,
        type:this.state.checkNum,
        skip:skip,
        limit: 15,
        LoadMore: true
      })
    }
  }
  componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'topicDetail',
      topic_id: this.props.match.params.id
    })
    Dispatcher.dispatch({
      actionType: 'topicQaList',
      topic_id: this.props.match.params.id,
      type:0,
      skip:0,
      limit: 15
    })
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })
  }
  handlefocusTopicDone(re){
    console.log('handlefocusTopicDone',re);
  }
  isFocus(re){
    this.setState({
      isAttention: !this.state.isAttention
    })
    Dispatcher.dispatch({
      actionType: 'focusTopic',
      topic_id: re
    })
  }
  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-话题详情');
    this._gettopicDetailDone = EventCenter.on("topicDetailDone",this._handletopicDetailDone.bind(this))
    this._gettopicQaListDone = EventCenter.on("topicQaListDone",this._handletopicQaListDone.bind(this))
    this._gettopicQaListLoadMoreDone = EventCenter.on("topicQaListLoadMoreDone",this._handletopicQaListLoadMoreDone.bind(this))
    this._getfocusTopicDone =EventCenter.on("focusTopicDone",this.handlefocusTopicDone.bind(this))


  }

  componentWillUnmount() {
    this._gettopicDetailDone.remove()
    this._gettopicQaListDone.remove()
    this._getfocusTopicDone.remove()
  }

  _goLink(isTeacher,id){
    if(isTeacher == 1){
      //跳转到讲师主页
      this.props.history.push(`${__rootDir}/LecturerHomePage/${id}`);
    }else {

      this.props.history.push(`${__rootDir}/PersonalPgHome/${id}`);
    }
  }

  render(){
    var topic_info = this.state.topic_info || {}
    var lesson = this.state.lesson.map((item,index)=>{
      var marginLeft = 0
      if (index==1) {
        marginLeft =20
      }
      return(
        <Link to={`${__rootDir}/lesson/online/${item.id}`} key={index}>
          <div style={{float:'left',marginTop:12,width:(window.screen.width-44)/2,backgroundColor:'#f8f8f8',marginLeft: marginLeft}}>
            <img src={item.brief_image} width={(window.screen.width-44)/2} height={104}/>
            <div style={{height:44,width:(window.screen.width-44)/2}}>
              <div style={{paddingLeft:8,lineHeight:'22px',fontSize:Fnt_Small,color:Common.Light_Black,}}>
                {item.title}
              </div>
            </div>
          </div>
        </Link>
      )
    })
    var questionList = this.state.questionList.map((item,index)=>{
      var answer = item.answer || {}
      var is_teacher = 0;//1:讲师 0:个人
      if(item.answer && item.answer.user && item.answer.user.is_teacher){
        is_teacher = item.answer.user.is_teacher;
      }
      return(
        <div style={{...styles.con_box}} key={index}>
          <Link to={`${__rootDir}/QaDetail/${item.id}`}>
            <div style={{...styles.ques_title,...styles.LineClamp}} dangerouslySetInnerHTML={{__html: item.title}}>
            </div>
          </Link>
          <div>
             <div style={{marginTop:12,clear:'both', display: item.answer ? 'block' : 'none'}}>
               <div style={{position:'relative',float:'left',width:30,height:30,}}>
               {answer.anonymous == 0 ?
                 <div onClick={this._goLink.bind(this,is_teacher,answer.user_id)}>
                   <img src={answer && answer.user && answer.user.photo ? answer.user.photo : Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={30} height={30} style={{borderRadius:'50%'}}/>
                   <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.small_tag,display:is_teacher == 1 ? 'block':'none'}}/>
                 </div>
                 :
                 <img src={answer && answer.user && answer.user.photo ? answer.user.photo : Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={30} height={30} style={{borderRadius:'50%'}}/>
               }

               </div>
              <Link to={`${__rootDir}/QaDetail/${item.id}`}>
                <div style={{float:'left',marginLeft:8,marginTop:6,fontSize:Fnt_Normal,color:Common.Gray}}>
                  <span>{answer.user ? answer.user.nick_name : ''}</span><span style={{marginLeft:15}}>{answer.user ? answer.user.title : ''}</span>
                </div>
                <div style={{clear:'both'}}></div>
              </Link>
            </div>
            <Link to={`${__rootDir}/QaDetail/${item.id}`}>
            {
              item.answer ?
              <div style={{...styles.quest_con,...styles.LineClamp,height:40,lineHeight:'20px', display: item.answer ? 'block' : 'none'}} dangerouslySetInnerHTML={ { __html: answer.content } }></div>
              :
              <p style={{color: '#999', fontSize: 14, marginTop: 10}}>还没有答案，快来做第一个回答者吧~</p>
            }
            </Link>
          </div>
          <div style={styles.line}></div>

        </div>
      )
    })
    return(
      <div
        onTouchEnd={() => {
        this._labelScorll(this.lessonList)
        }}
      >
        <div style={{...styles.topic_top}}>
            <img src={topic_info!==null && topic_info.icon!=='' ? topic_info.icon : Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={60} height={60} style={{float:'left',marginTop:20,}}/>
            <div style={{marginLeft:8,float:'left',}}>
              <div style={{...styles.title}}>{topic_info.name}</div>
              <div style={{float:'left',width:(window.screen.width-178)/2}}>
                <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{float:'left',marginTop:5}}/>
                <span style={{...styles.ques_text}}>
                  {topic_info.topic_question_num}个问题
                </span>
              </div>
              <div style={{float:'left'}}>
                <img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} width={12} height={11} style={{float:'left',marginTop:6,}}/>
                <div style={{...styles.ques_text}}>
                  {topic_info.topic_user_num}人关注
                </div>
              </div>
            </div>
            {
              this.state.isAttention ?
              <div onClick={this.isFocus.bind(this,topic_info.id)} style={{...styles.btn_attention,backgroundColor:'#d1d1d1'}} disabled={true}>已关注</div>
              :
              <div onClick={this.isFocus.bind(this,topic_info.id)} style={{...styles.btn_attention}} disabled={false}><span style={{color:Common.Bg_White,fontSize:20}}>+</span> 关注</div>
            }
        </div>


        <div style={{...styles.hot_box,display: this.state.hotClassDiv ? 'block' :'none'}}>
          <div style={{color:Common.Light_Black,fontSize:Fnt_Medium}}>热门课程推荐</div>
          {lesson}
        </div>

        <div style={{...styles.tab_box}}>
          <div style={{...styles.tab_position,}}>
          {
            this.tab_box.map((item,idx)=>{
              var tab_color = Common.Light_Gray;
              var borderBottomColor = '#f3f3f3';
              if (this.state.checkNum==idx) {
                tab_color = Common.Activity_Text;
                borderBottomColor = Common.Activity_Text;
              }

              var tab = {
                height:'44px',
                width:window.screen.width/3,
                textAlign:'center',
                fontSize:Fnt_Normal,
                float:'left',
                color:tab_color,
                borderBottomStyle:'solid',
                borderBottomWidth:2,
                borderBottomColor:borderBottomColor,
              };

              return(
                <div key={idx} onClick={this._clickTab.bind(this,idx)} style={tab}>
                  {item}
                </div>
              )
            })
          }
          </div>
        </div>
        <div
          ref={(lessonList) => this.lessonList = lessonList}
          style={{backgroundColor:Common.Bg_White,height:this.state.questionListHieght,overflowY:'scroll',overflowX:'hidden'}}>
          {this.state.questionList.length > 0 ? questionList
            :
            <div style={{fontSize:Fnt_Normal,color:Common.Light_Gray,marginTop:12,marginLeft:12}}>
              还没有答案，快来做第一个回答者吧～
            </div>
          }
        </div>
      </div>

    )
  }

_clickTab(idx){
  this.setState({
    checkNum: idx
  })
  Dispatcher.dispatch({
    actionType: 'topicQaList',
    topic_id: this.props.match.params.id,
    type: idx,
    skip:0,
    limit: 15
  })
}

}

var styles = {
  topic_top:{
    paddingLeft:12,
    paddingRight:12,
    backgroundColor:Common.Bg_White,
    height:106,
    overflow:'hidden',
  },
  title:{
    color:'#000',
    fontSize:14,
    marginTop:30,
  },
  ques_text:{
    fontSize:Fnt_Small,
    color:Common.Light_Gray,
    marginLeft:5,
    float:'left',
    marginTop:2
  },
  tab_box:{
    position:'relative',
    width:window.screen.width,
    height:'44px',
    lineHeight:'44px',
    borderBottomStyle:'solid',
    borderBottomWidth:2,
    borderBottomColor:'#F3F3F3',
    backgroundColor:Common.Bg_White,
    textAlign:'center',
    marginTop:10,
  },
  tab_position:{
    position:'absolute',
    height:'44px',
    bottom:0,
    left:0,
  },
  // tab:{
  //   height:'44px',
  //   width:window.screen.width/3,
  //   textAlign:'center',
  //   fontSize:Fnt_Normal,
  //   color:Common.Light_Gray,
  //   float:'left',
  //   borderBottomStyle:'solid',
  //   borderBottomWidth:2,
  // },
  on:{
    color:Common.Activity_Text,
    borderBottomColor:Common.Activity_Text,
  },
  btn_attention:{
    width:80,
    height:'30px',
    lineHeight:'28px',
    textAlign:'center',
    fontSize:Fnt_Normal,
    color:Common.Bg_White,
    borderRadius:2,
    backgroundColor:Common.Activity_Text,
    float:'right',
    marginTop:35,
    border:'none',
  },
  hot_box:{
    backgroundColor:Common.Bg_White,
    // position:'absolute',
    // top:114,
    // left:0,
    marginTop:10,
    width:window.screen.width,
    height:208,
    paddingLeft:12,
    paddingRight:12,
    paddingTop:17,
    paddingBottom:15,
  },
  con_box:{
    width:window.screen.width,
    paddingTop:15,
    paddingLeft:12,
    paddingRight:12,
    backgroundColor:Common.Bg_White,
  },
  ques_title:{
    width:window.screen.width-24,
    // height:'42px',
    lineHeight:'20px',
    fontSize:Fnt_Medium,
    color:Common.Black,
  },
  quest_con:{
    width:window.screen.width-24,
    // height:'34px',
    lineHeight:'17px',
    fontSize:Fnt_Normal,
    color:Common.Black,
    marginTop:6,
    marginBottom:18,
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  small_tag:{
    position:'absolute',
    zIndex:2,
    bottom:-1,
    right:2,
  },
  line:{
    width:window.screen.width-24,
    height:1,
    borderBottom:'solid 1px #F4F4F4',
    marginTop:10,
  }
}


export default TopicDetail;
