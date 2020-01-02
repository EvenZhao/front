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
import OnlineLessonDiv from '../components/OnlineLessonDiv'
import LiveLessonDiv from '../components/LiveLessonDiv'
import FullLoading from '../components/FullLoading';



class PersonalPgHome extends React.Component {

  constructor(props) {
    super(props);
    this.wx_config_share_home = {
        title: '个人主页',
        desc: '',
        link: document.location.href + '',
        imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
        type: 'link'
    };
    this.state={
      //是否关注
      checkNum: 0,
      topic:true,
      isAttention:false,
      //个人信息
      userInfo:{},
      //话题
      userTopic:[],
      //直播课数量
      liveCount:0,
      //视频课数量
      onlineCount:0,
      liveLesson:[],
      onlineLesson:[],
      count:0,
      qa:[],
      answerCount: 0,
      questionCount: 0,
      answerList: [],
      questionList: [],
      type:'',
      loadLength:0,
      loadMore:true,
      both: true,
      isLoading: true,
      isSameOne:false,//true：查看自己主页，false：查看别人主页
      position:'',//职位
      level:null,//区分用户类型
      lesson_count:0,//课程数
      qa_count:0,//问答数
      reservedLives:[],
    }
    this.tab_box = ['课程','问答'];
  }

  componentWillMount() {
   
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-个人主页');

    Dispatcher.dispatch({
      actionType: 'UserInfo',
      id: this.props.match.params.id || '',      //this.props.match.params.id
      // source:'bolue',
      source:'qa',
    })
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })

    this.e_UserInfo = EventCenter.on('UserInfoDone',this._handleUserInfoDone.bind(this));
    this.e_UserQa = EventCenter.on('UserQaDone',this._handleUserQaDone.bind(this));
    this.e_UserQaLoadMoreDone = EventCenter.on("UserQaLoadMoreDone",this._handleUserQaLoadMoreDone.bind(this))
  }

  componentWillUnmount() {
    this.e_UserInfo.remove()
    this.e_UserQa.remove()
    this.e_UserQaLoadMoreDone.remove()
  }

  render(){
    let screenWidth = devWidth
    let onlineProps = {
      data: this.state.onlineLesson,
      history: this.props.history,
    }
    let liveProps = {
      data: this.state.liveLesson
    }

    var listNull = (
      <div style={{textAlign:'center',paddingTop:70}}>
        <div>
          <img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
        </div>
        <div style={{marginTop:51}}>
          <span style={{fontSize:13,color:'#333333'}}>暂无数据~</span>
        </div>
      </div>
    )
    // var type = '';
    // if(this.state.userInfo.type == 0){
    //   type = '注册会员';
    // }
    // else if(this.state.userInfo.type == 1) {
    //   type = '员工帐号';
    // }

    var level_content = '';
    if(this.state.level == 1){
      //注册会员
      level_content = (
        <div>
          <img src={Dm.getUrl_img('/img/v2/icons/rg_member@2x.png')} width={13} height={9} />
          <span style={{color:'#FFE1AF',fontSize:11,marginLeft:2}}>注册会员</span>
        </div>
      )
    }
    else if (this.state.level == 11) {
      //铂略员工账号
      level_content = (
        <div>
          <img src={Dm.getUrl_img('/img/v2/icons/employee@2x.png')} width={13} height={13} />
          <span style={{color:'#FFE1AF',fontSize:11,marginLeft:2}}>员工账号</span>
        </div>
      )
    }
    else if (this.state.level == 13) {
      //铂略员工账号
      level_content = (
        <div>
          <img src={Dm.getUrl_img('/img/v2/icons/employee@2x.png')} width={13} height={13} />
          <span style={{color:'#FFE1AF',fontSize:11,marginLeft:2}}>VIP体验会员</span>
        </div>
      )
    }
    else {
      //vip会员
      level_content = (
        <div>
          <img src={Dm.getUrl_img('/img/v2/icons/vip_member@2x.png')} width={14} height={12} />
          <span style={{color:'#FFE1AF',fontSize:11,marginLeft:2}}>VIP会员</span>
        </div>
      )
    }

    var answerArry;
    var questionArry;
    var answerDisplay
    var questionDisplay

    if(this.state.both == true) {
      answerDisplay = questionDisplay = 'block'
    } else {

      if(this.state.type == 'answer') {
        answerDisplay = 'block'
        questionDisplay = 'none'
      } else {
        answerDisplay = 'none'
        questionDisplay = 'block'
      }
    }

    if(this.state.both == true) {
        answerArry = this.state.answerList.map((item,index)=>{
          return(
            <Link to={`${__rootDir}/QaDetail/${item.question_id}`} key={index}>
              <div style={{marginTop:15,fontSize:Fnt_Medium,color:Common.Black,}}>{item.title || ''}</div>
              <div>
                <img src={item.user_info ? item.user_info.photo : Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={30} height={30} style={{float:'left',marginTop:13,borderRadius:15,}}/>
              <div style={{marginLeft:8,marginTop:16,float:'left',marginBottom:5,}}>
                <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{ item.user_info ? item.user_info.nick_name : ''}</span>
              </div>
              <div style={Common.clear}></div>
                <div style={{...styles.LineClamp,...styles.content}} dangerouslySetInnerHTML={{__html: item.content}}>
              </div>
              </div>
              <hr style={{backgroundColor: '#f4f4f4', height: 1, border: 'none', marginTop: 12, display: this.state.answerList.length == index + 1 ? 'none' : 'block'}}/>
            </Link>
          )
        })
        questionArry = this.state.questionList.map((item,index)=>{
          return(
            <Link to={`${__rootDir}/QaDetail/${item.id}`} key={index}>
              <div style={{...styles.LineClamp,fontSize:Fnt_Medium,color:Common.Light_Black,marginTop:10}}>
                {item.title || ''}
              </div>
              <div style={{height:30,lineHeight:'30px',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/answer@2x.png')} width={12} height={13} style={{float:'left',marginTop:9,}}/>
                <span style={{float:'left',fontSize:Fnt_Small,color:Common.Light_Gray,marginLeft:5,}}>{item.question_answer_num}回答</span>
                <div style={{float:'right',fontSize:Fnt_Small,color:Common.Light_Gray,}}>{new Date(item.create_time).format(Common.YDATE)}</div>
              </div>
              <hr style={{backgroundColor: '#f4f4f4', height: 1, border: 'none', marginTop: 12, display: this.state.questionList.length == index + 1 ? 'none' : 'block'}}/>
            </Link>
          )
        })
    } else {
      if(this.state.type == 'answer'){
         answerArry = this.state.qa.map((item,index)=>{
          return(
            <Link to={`${__rootDir}/QaDetail/${item.question_id}`} key={index}>
              <div style={{marginTop:15,fontSize:Fnt_Medium,color:Common.Black,}}>{item.title || ''}</div>
              <div>
                <img src={item.user_info ? item.user_info.photo : Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={30} height={30} style={{float:'left',marginTop:13,borderRadius:15,}}/>
                <div style={{marginLeft:8,marginTop:16,float:'left',marginBottom:5,}}>
                  <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{ item.user_info ? item.user_info.nick_name : ''}</span>
                </div>
                <div style={Common.clear}></div>
                <div style={{...styles.LineClamp,...styles.content}} dangerouslySetInnerHTML={{__html: item.content}}>

                </div>
              </div>
              <hr style={{backgroundColor: '#f4f4f4', height: 1, border: 'none', marginTop: 12, display: this.state.qa.length == index + 1 ? 'none' : 'block'}}/>
            </Link>
          )
        })
      } else {
         questionArry = this.state.qa.map((item,index)=>{
          return(
            <Link to={`${__rootDir}/QaDetail/${item.id}`} key={index}>
              <div style={{...styles.LineClamp,fontSize:Fnt_Medium,color:Common.Light_Black,marginTop:10}}>
                {item.title || ''}
              </div>
              <div style={{height:30,lineHeight:'30px',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/answer@2x.png')} width={12} height={13} style={{float:'left',marginTop:9,}}/>
                <span style={{float:'left',fontSize:Fnt_Small,color:Common.Light_Gray,marginLeft:5,}}>{item.question_answer_num}回答</span>
                <div style={{float:'right',fontSize:Fnt_Small,color:Common.Light_Gray,}}>{new Date(item.create_time).format(Common.YDATE)}</div>
              </div>
              <hr style={{backgroundColor: '#f4f4f4', height: 1, border: 'none', marginTop: 12, display: this.state.qa.length == index + 1 ? 'none' : 'block'}}/>
            </Link>
          )
        })
      }
    }

    return(
      <div>
        <div style={{...styles.lecture_bg}}>
          <img src={Dm.getUrl_img('/img/v2/icons/lecture_bg@2x.png')} style={styles.bg}/>
          <div style={styles.lecture_top}>
            <div style={{padding:'15px 20px 10px 20px'}}>
              <div style={{float:'left',position:'relative',}}>
                <img src={this.state.userInfo.photo ? this.state.userInfo.photo : Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={68} height={68} style={{float:'left',borderRadius:'50%',}}/>
              </div>
              <div style={{float:'left',marginLeft:15,marginTop:15}}>
                <div style={{display:'flex',flexDirection:'row'}}>
                  <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>
                    {this.state.userInfo.nick_name}
                  </div>
                  { this.state.isSameOne ?
                    <div style={{marginLeft:5}}>{level_content}</div>
                    :
                    null
                  }
                </div>
                {/*<div style={styles.tag}>{type}</div>*/}
                <div style={{fontSize:12,color:'#e5e5e5'}}>{this.state.position}</div>
              </div>
              <div style={Common.clear}></div>
              <div style={{marginTop:15}}>
                {
                  this.state.userTopic.length>0 ?
                  <div>
                    <div style={{float:'left',color:'#E1E1E0',fontSize:Fnt_Small}}>关注话题：</div>
                    {
                      this.state.userTopic.map((item,index)=>{

                        return(
                          <div key={index} style={styles.lec_label}>
                            {item.name}
                          </div>
                        )
                      })
                    }

                    <Link to={{pathname: `${__rootDir}/TopicCenter` , query: null, hash: null, state:{user_id: this.props.match.params.id} }}>
                      <img src={Dm.getUrl_img('/img/v2/icons/lec_more@2x.png')} width={20} height={16} style={{float:'left',}}/>
                    </Link>
                    <div style={Common.clear}></div>
                  </div>
                  :
                  <div style={{fontSize:Fnt_Small,color:'#E1E1E0'}}>关注话题：此用户很懒，还未关注任何话题</div>
                }
                <div style={Common.clear}></div>
              </div>
            </div>
            <div>
              <div style={{float:'left',width:devWidth/3,textAlign:'center'}}>
                <div style={{fontSize:13,color:'#AEAEAE'}}>关注</div>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>{this.state.userInfo.focus_count}</div>
              </div>
              <div style={{float:'left',width:devWidth/3,textAlign:'center'}}>
                <div style={{fontSize:13,color:'#AEAEAE'}}>问答</div>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>{this.state.userInfo.qa_count}</div>
              </div>
              <div style={{float:'left',width:window.screen.width/3,textAlign:'center'}}>
                <div style={{fontSize:13,color:'#AEAEAE'}}>课程</div>

                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>{this.state.userInfo.lesson_count}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.tab_box}>
          <div style={styles.tab_position}>
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
                width:devWidth/2,
                textAlign:'center',
                fontSize:Fnt_Normal,
                float:'left',
                color:tab_color,
                borderBottomStyle:'solid',
                borderBottomWidth:2,
                borderBottomColor:borderBottomColor,
              }
              return(
                <div key={idx} onClick={this._clickTab.bind(this,idx)} style={tab}>
                  {item}
                </div>
              )
            })
          }
          </div>
        </div>

        <div style={{width:devWidth,backgroundColor:Common.Bg_White}}>
          <div>
            {/*课程*/}
            <div style={{display:this.state.checkNum == 0 ? 'block':'none',height:window.innerHeight-226,overflowY:'auto'}}>
            {
              this.state.lesson_count > 0 ?
              null
              :
              listNull
            }
            {
              this.state.onlineCount >0 ?
              <div>
                 <Link to={{pathname: `${__rootDir}/teacher/lesson/list/online`, query: null, hash: null, state: {user_id: this.props.match.params.id}}}>
                  <div style={{padding: '12px 0px 0px', width: screenWidth, height: 20, }}>
                    <img src={Dm.getUrl_img('/img/v2/icons/online@2x.png')} style={{...styles.logo, width: 22}}/>
                    <div style={{...styles.logo_title}}>视频课</div>
                    <div style={{...styles.count_num}}>{this.state.onlineCount}</div>
                    <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.onlineCount > 3 ? 'block' : 'none'}}/>
                  </div>
                </Link>
                <OnlineLessonDiv {...onlineProps}/>
                <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.onlineCount > 0 ? 'block' : 'none'}}></hr>
              </div>
              :
              null
            }
            {
              this.state.liveCount > 0 ?
              <div>
                <Link to={{pathname: `${__rootDir}/teacher/lesson/list/live`, query: null, hash: null, state: {user_id: this.props.match.params.id}}}>
                  <div style={{padding: '12px 0px 0px', width: screenWidth,}}>
                    <img src={Dm.getUrl_img('/img/v2/icons/live@2x.png')} style={{...styles.logo}}/>
                    <div style={{...styles.logo_title}}>直播课</div>
                    <div style={{...styles.count_num}}>{this.state.liveCount}</div>
                    <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.liveCount > 3 ? 'block' : 'none'}}/>
                  </div>
                </Link>

                <LiveLessonDiv {...liveProps} reservedLives={this.state.reservedLives}/>

                <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.liveCount > 0 ? 'block' : 'none'}}></hr>
              </div>
              :
              null
            }

            </div>

            {/*问答 无回答只显示提问，无提问只显示回答*/}
            <div style={{display:this.state.checkNum == 1 ? 'block':'none',backgroundColor:'#fff',height:window.innerHeight-226}}>
              {/*TA的回答*/}
            {
              this.state.qa.length>0 ?
              <div>
              {/*{
                this.state.type =='answer' ?*/}
                <div style={{display: this.state.questionCount > 0 && this.state.answerCount > 0 ? 'block' : 'none', backgroundColor: '#fff', padding:'0px 12px 0px 12px'}}>
                  <Link to={{pathname: `${__rootDir}/QaList`, query: null, hash: null, state: {type: 'question',userId:this.state.userId}}}>
                    <div style={{padding: '12px 0px 0px'}}>
                      <div style={{...styles.logo_title}}>TA的提问</div>
                      <div style={{...styles.count_num}}>{this.state.questionCount}</div>
                      <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', width: 10, height: 15, marginTop: 4}}/>
                    </div>
                  </Link>
                      {questionArry}
                </div>
                <div style={{height: 12, backgroundColor: '#f4f4f4', marginTop: 10, marginBottom: 5, display: this.state.both ? 'block' : 'none'}}></div>
                <div style={{display: this.state.answerCount > 0 && this.state.questionCount > 0 ? 'block' : 'none', backgroundColor: '#fff', padding:'0px 12px 10px 12px'}}>
                  <Link to={{pathname: `${__rootDir}/QaList`, query: null, hash: null, state: {type: 'answer',userId:this.state.userId}}}>
                    <div style={{padding: '12px 0px 0px'}}>
                      <div style={{...styles.logo_title}}>TA的回答</div>
                      <div style={{...styles.count_num,}}>{this.state.answerCount}</div>
                      <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', width: 10, height: 15, marginTop: 4}}/>
                    </div>
                  </Link>
                      {answerArry}
                </div>
                {/**/}

                <div style={{padding: '12px', display: this.state.type == 'question' && this.state.both == false ? 'block' : 'none'}}>
                  <div style={{...styles.logo_title}}>TA的提问</div>
                  <div style={{...styles.count_num}}>{this.state.count}</div>
                  {/*<img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', width: 10, height: 15, marginTop: 4}}/>*/}
                </div>
                <div style={{padding: '12px', display: this.state.type == 'answer' && this.state.both == false ? 'block' : 'none'}}>
                  <div style={{...styles.logo_title}}>TA的回答</div>
                  <div style={{...styles.count_num,}}>{this.state.count}</div>
                  {/*<img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', width: 10, height: 15, marginTop: 4}}/>*/}
                </div>

               {/**/}
                <div style={{width:devWidth-24,height:devHeight-280,overflow:'scroll', padding:'0 12px 10px 12px', backgroundColor:Common.Bg_White, display: this.state.both ? 'none' : 'block'}}
                   onTouchEnd={this._labelScroll.bind(this)} ref={(qaList) => this.qaList = qaList}
                 >
                  {answerArry}
                  {questionArry}
                </div>
              </div>
              :
              <div style={{paddingTop:70,textAlign:'center'}}>
               <img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} width={188} height={128}/>
               <div style={{textAlign: 'center', fontSize: 14, color: '#666', marginTop: 12}}>此用户暂无问答哦</div>
             </div>
            }
          </div>
        </div>
      </div>

    </div>

    )
  }

  _clickTab(idx){
    this.setState({
      checkNum: idx,
    })
    if(idx == 1){
      Dispatcher.dispatch({
        actionType: 'UserQa',
        id: this.props.match.params.id,      //this.props.match.params.id
        source:'qa',
        skip:0,
        limit:15,
        type:'index',
      })
    }
  }

  //课程
  _handleUserInfoDone(re){
    console.log('==_handleUserInfoDone==',re);
    if(!re.err && re.result){
      this.setState({
        userInfo:re.result,
        userTopic:re.result.user_topic,
        liveCount:re.result.lessons.live_count,
        onlineCount:re.result.lessons.online_count,
        liveLesson:re.result.lessons.live_lesson || [],
        onlineLesson:re.result.lessons.online_lesson || [],
        isSameOne:re.result.isSameOne,
        position:re.result.position,
        level:re.result.level,
        lesson_count:re.result.lesson_count,
        qa_count:re.result.qa_count,
        reservedLives:re.reservedLives
      })
    }
  }

  //问答
  _handleUserQaDone(re){

    if(re && re.result){
      this.setState({
        qa:re.result.type == 'answer' ? re.result.answer:re.result.question,
        type:re.result.type,
        count:re.result.type == 'answer' ? re.result.answer_count:re.result.question_count,
        loadLength:re.result.type == 'answer' ? re.result.answer.length:re.result.question.length,
        userId:re.result.user_id,
        both: re.result.type ? false : true,
        isLoading: false,
    },()=>{
      if(re.result.answer && re.result.question) {
        this.setState({
          answerCount: re.result.answer_count,
          questionCount: re.result.question_count,
          answerList: re.result.answer,
          questionList: re.result.question,
          loadMore: false
        })
      } else if(!re.result.answer){
        this.setState({
          loadMore:this.state.loadLength == 15 ? true:false,
          questionCount: re.result.question_count
        })
      } else if(!re.result.question) {
        this.setState({
          loadMore:this.state.loadLength == 15 ? true:false,
          answerCount: re.result.answer_count
        })
      }
    })
    }
  }
  _handleUserQaLoadMoreDone(re){

    if(re && re.result){
      this.setState({
        qa:re.result.type == 'answer' ? this.state.qa.concat(re.result.answer) : this.state.qa.concat(re.result.question),
        type:re.result.type,
        count:re.result.type == 'answer' ? re.result.answer_count:re.result.question_count,
        userId:re.result.user_id,
        isLoading: false,
        // loadMore:re.result.answer.length = 15 ? true : false,
      },()=>{
        if(re.result.type == 'answer') {
          this.setState({
            loadLength:re.result.type == 'answer' ? this.state.qa.length:this.state.qa.length,
            loadMore:re.result.answer.length == 15 ? true:false,
          })
        } else {
          this.setState({
            loadLength:re.result.type == 'answer' ? this.state.qa.length:this.state.qa.length,
            loadMore:re.result.question.length == 15 ? true:false,
          })
        }
      })
    }
  }
  _loadMore(){

      Dispatcher.dispatch({
        actionType: 'UserQa',
        id: this.props.match.params.id,      //this.props.match.params.id
        source:'qa',
        skip:this.state.loadLength,
        limit:15,
        type:'index',
        LoadMore: true,
      })
  }

  _labelScroll() {
    if( (this.qaList.scrollHeight - this.qaList.scrollTop - 226) <  document.documentElement.clientHeight) {
			if(this.state.loadMore) {
        this._loadMore();
			} else {
				return false;
			}
		}
	}

}

var styles = {
  lecture_bg:{
    height:180,
    width:devWidth,
    position:'relative',
  },
  bg:{
    width:devWidth,
    height:180,
    position:'absolute',
    zIndex:1,
    top:0,
    left:0,
  },
  lecture_top:{
    width:devWidth,
    height:180,
    position:'absolute',
    zIndex:10,
    top:0,
    left:0,
  },
  tag:{

    height:18,
    lineHeight:'18px',
    fontSize:11,
    color:Common.Bg_White,
    width:70,
    textAlign:'center',
    backgroundColor:Common.orange,
    borderRadius:8,
    marginTop:5,
  },
  lec_label:{
    height:16,
    lineHeight:'16px',
    borderRadius:8,
    marginRight:14,
    float:'left',
    fontSize:11,
    color:Common.Black,
    padding:'0 10px',
    backgroundColor:'#E3F1FC',
  },
  line:{
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#F4F4F4',
    width:devWidth,
    marginTop:15,
  },
  short_line:{
    height:11,
    width:1,
    backgroundColor:'#E5E5E5',
  },
  tab_box:{
    position:'relative',
    width:devWidth,
    height:'44px',
    lineHeight:'44px',
    borderBottomStyle:'solid',
    borderBottomWidth:2,
    borderBottomColor:'#F3F3F3',
    backgroundColor:Common.Bg_White,
    textAlign:'center',
  },
  tab_position:{
    position:'absolute',
    height:'44px',
    bottom:0,
    left:0,
  },

  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  logo: {
		marginLeft: 12,
		width: 18,
		height: 18,
		borderColor: 'red',
		display: 'inline-block',
		marginRight: 9,
    float:'left',
	},
  logo_title: {
		color: '#000',
		fontSize: Fnt_Medium,
    float:'left',
    marginRight:10,
    height:'24px',
    lineHeight:'24px',
	},
  title:{
    color:'#000',
    fontSize:14,
    marginTop:12,
  },
  ques_text:{
    fontSize:Fnt_Small,
    color:Common.Light_Gray,
    marginLeft:5,
    float:'left',
    marginTop:2
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
    marginTop:15,
    border:'none',
  },
  count_num: {
		border: '1px solid #d1d1d1',
		height: 11,
		padding: '2px 10px',
		display: 'inline-block',
		fontSize: 12,
		color: '#d1d1d1',
		lineHeight: '11px',
		position: 'relative',
		top: '-3px',
		marginLeft: 8,
		borderRadius: 8
	},
  content:{
    fontSize:Fnt_Normal,
    color:Common.Black,
    width:devWidth-24,
    marginTop:5,
    height:40,
    lineHeight:'20px'
  }


}


export default PersonalPgHome;
