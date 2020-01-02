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
import Star from '../components/star';
import TeacherLesson from '../components/TeacherLesson';
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import LiveLessonDiv from '../components/LiveLessonDiv';
import OfflineLessonDiv from '../components/OfflineLessonDiv';
import FullLoading from '../components/FullLoading';
import Guide from '../components/Guide'

var t;
class LecturerHomePage extends React.Component {

  constructor(props) {
    super(props);
    this.wx_config_share_home = {
        title: '讲师主页',
        desc: '',
        link: document.location.href + '',
        imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
        type: 'link'
    };
    this.state={
     //是否关注
     checkNum: 0,
     userTopic:[],
     //区分讲师和个人
     isTeacher:false,
     //别人看讲师主页是否关注讲师
     isCollected:false,
     isSameOne: false,
     result:{},
     //最新课程
     newLessons:[],
     //问题及回答
     question:[],
     //直播课
     live_lesson: [],
     //视频课
		 online_lesson: [],
     //线下课
 		 offline_lesson: [],
     //问答
     qas:[],
     count:{},
     listHeight:devHeight-226,
     loadLength:null,
     isLoading: true,
     ballHide: false,
     reservedLives:[],
    //  callback_hint:'',//电话预约专家诊断权限提示
    }
    this.tab_box = ['主页','课程','问答']
  }

  componentWillMount() {
   
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-讲师主页');
    Dispatcher.dispatch({
      actionType: 'TeacherUserInfo',
      teacher_id:this.props.match.params.id || '',
      type:'index',
    });
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })

    this.e_TeacherUserInfo = EventCenter.on('TeacherUserInfoDone',this._handleTeacherUserInfoDone.bind(this));
    this.e_TeacherFocus = EventCenter.on('focusTeacherDone', this._handleFocusTeacherDone.bind(this));
  }

  componentWillUnmount() {
    this.e_TeacherUserInfo.remove()
    this.e_TeacherFocus.remove()
    clearTimeout(t)
  }

//电话预约专家诊断问题类型 (0: 待回电 / 1: 已回电 / 2: 追问待回 / 3: 追问已回)
  _allStatus(status){
    var statusColor = {}
    var stauts_text = ''
    var textDiv;
    if (status) {//电话预约专家诊断问题类型 (0: 待回电 / 1: 已回电 / 2: 追问待回 / 3: 追问已回)
      switch (status) {
       case 0:
         stauts_text = '待回电'
         statusColor = {
           backgroundColor: '#fff6c8',
           color: '#ED9D18',
         }
       break;
       case 1:
         stauts_text = '已回电'
         statusColor = {
           backgroundColor: '#d3eafd',
           color: '#33A2FB',
         }
       break;
       case 2:
         stauts_text = '追问待回'
         statusColor = {
           backgroundColor: '#fff6c8',
           color: '#ED9D18',
         }
       break;
       case 3:
         stauts_text = '追问已回'
         statusColor = {
           backgroundColor: '#d3eafd',
           color: '#33A2FB',
         }
       break;
      }
      textDiv =(
        <div style={{...styles.callback_status,...statusColor,}}>
          <span style={{fontSize:11}}>{stauts_text}</span>
        </div>
      )
      return textDiv;
    }
  }

  _focusTeacher() {
    this.setState({
      isCollected: !this.state.isCollected
    }, () => {
      Dispatcher.dispatch({
        actionType: 'focusTeacher',
        teacher_id:this.props.match.params.id || '',
      });
    })
  }

  render(){
    let screenWidth = window.screen.width
    let starOverScore = {
      right: 6,
      star: 4.5,
      canChange: false,
      score: 4.5,
      propScore:4.5, //外部传数（固定分数）
      scoreShow: false,
      width: 11,
      height: 11
    }
    var reserved;
    var isReserved = false;

    let onlineProps = {
      data: this.state.online_lesson,
      history: this.props.history,
    }

    let liveProps = {
      data: this.state.live_lesson
    }

    let offlineProps = {
      data: this.state.offline_lesson
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
    return(
      <div style={{height:devHeight}}>
      <FullLoading isShow={this.state.isLoading}/>
        <div style={styles.lecture_bg}>
          <img src={Dm.getUrl_img('/img/v2/icons/lecture_bg@2x.png')} style={styles.bg}/>
          <div style={styles.lecture_top}>
            <div style={{padding:'15px 20px 10px 15px'}}>
              <div style={{float:'left',position:'relative',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/lec_big@2x.png')} width={14} height={14} style={{...styles.tag,display:this.state.isTeacher ? 'block':'none'}}/>
                <img src={this.state.result.photo} width={68} height={68} style={{float:'left',borderRadius:50}}/>
              </div>
              <div style={{float:'left',marginLeft:15,marginTop:25}}>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>{this.state.result.nick_name}</div>
                <div style={{fontSize:Fnt_Small,color:'#E5E5E5',...styles.LineClamp,WebkitLineClamp:1,width:devWidth-118,height:20,}}>{this.state.result.company}&nbsp;{this.state.result.position}</div>
              </div>
              {
                this.state.isSameOne ?
                null
                :
                <div style={{float:'right',marginRight:15,position: 'absolute',right: 0}} onClick={this._focusTeacher.bind(this)}>
                {
                  this.state.isCollected ?
                  <button style={{...styles.btn_attention,backgroundColor:'#d1d1d1'}}>已关注</button>
                  :
                  <button style={{...styles.btn_attention}}><span style={{color:Common.Bg_White,fontSize:20}}>+</span> 关注</button>
                }
                </div>
              }
              <div style={Common.clear}></div>
              <div style={{marginTop:15,}}>
                <div style={{float:'left',color:'#E1E1E0',fontSize:Fnt_Small}}>擅长领域：</div>
                {
                  this.state.userTopic.length > 0 ?
                  <div style={{float:'left'}}>
                    {
                      this.state.userTopic.map((item,index)=>{
                        return (
                          <div style={styles.lec_label} key={index}>
                            {item.name}
                          </div>
                        )
                      })
                     }
                    <Link to={{pathname: `${__rootDir}/TopicCenter` , query: null, hash: null, state:{user_id: this.props.match.params.id} }}>
                      <img src={Dm.getUrl_img('/img/v2/icons/lec_more@2x.png')} width={20} height={16} style={{float:'left',}}/>
                    </Link>
                  </div>
                  :
                  <div style={{float:'left',color:'#E1E1E0',fontSize:Fnt_Small}}>暂无</div>
                }
              </div>
              <div style={Common.clear}></div>
            </div>
            <div>
              <div style={{float:'left',width:window.screen.width/3,textAlign:'center'}}>
                <div style={{fontSize:13,color:'#AEAEAE'}}>问答</div>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>{this.state.result.answerNum}</div>
              </div>
              <div style={{float:'left',width:window.screen.width/3,textAlign:'center'}}>
                <div style={{fontSize:13,color:'#AEAEAE'}}>课程</div>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>{this.state.result.lessonNum}</div>
              </div>
              <div style={{float:'left',width:window.screen.width/3,textAlign:'center'}}>
                <div style={{fontSize:13,color:'#AEAEAE'}}>满意度</div>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>{this.state.result.satisfaction}%</div>
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
              var changeTab = {
                color:tab_color,
                borderBottomColor:borderBottomColor,
              };

              return(
                <div key={idx} onClick={this._clickTab.bind(this,idx)} style={{...styles.tab,...changeTab}}>
                  {item}
                </div>
              )
            })
          }
          </div>
        </div>

      <div style={{backgroundColor:Common.Bg_White,}}>

          <div style={{...styles.con_box,display:this.state.checkNum == 0 ? 'block':'none',height:window.innerHeight-246,overflowY:'auto'}}>
              {
                this.state.result.introduction ?
                <div>
                  <div style={{width:window.screen.width-24,paddingLeft:12,paddingRight:12,}}>
                    <img src={Dm.getUrl_img('/img/v2/icons/Rectangle@2x.png')} width={3} height={16} style={{float:'left',marginTop:4,}}/>
                    <div style={{fontSize:Fnt_Medium,color:Common.Black,float:'left',marginLeft:10,}}>简介</div>
                    <div style={Common.clear}></div>
                  </div>
                  <div style={{fontSize:Fnt_Normal,color:Common.Light_Black,marginTop:10,width:window.screen.width-24,paddingLeft:12,paddingRight:12,}}>
                    {this.state.result.introduction}
                  </div>
                  <hr style={{border: 'none', height: 1, backgroundColor: '#f4f4f4', marginTop: 15}} />
                </div>
                :
                null
              }

              {
                this.state.newLessons.length>0?
                <div style={{width:window.screen.width-24,paddingLeft:12,paddingRight:12,marginTop:15}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/Rectangle@2x.png')} width={3} height={16} style={{float:'left',marginTop:4,}}/>
                  <div style={{fontSize:Fnt_Medium,color:Common.Black,float:'left',marginLeft:10,}}>最新课程</div>
                  <div style={Common.clear}></div>
                {
                  this.state.newLessons.map((item,index)=>{
                    var array = [];
                    array.push(this.state.newLessons[index])
                  if(item.resource_type == 1){//直播课
                        let liveProps = {
                          data:array
                         }
                        return(
                          <div key={index}>
                            <LiveLessonDiv {...liveProps} reservedLives={this.state.reservedLives}/>
                          </div>
                        )
                    }
                    else if (item.resource_type == 2) {//视频
                        let onlineProps = {
                          data:array,
                          history: this.props.history,
                        }
                        return(
                          <div style={{paddingTop:10}} key={index}>
                            <OnlineLessonDiv {...onlineProps}/>
                          </div>
                         )
                      }
                      else if (item.resource_type == 3) {//线下
                        let offlineProps = {
                          data:array
                        }
                        return(
                          <div key={index}>
                            <OfflineLessonDiv {...offlineProps}/>
                          </div>
                        )
                      }
                      else {//专题
                        return(
                          <div key={index}>
                          <Link to={`${__rootDir}/productDetail/${item.id}`}>
                            <div style={{marginTop:15,}}>
                               <div style={{position:'relative',float:'left',width:127,height:80,}}>
                                  <img src={item.brief_image} width={127} height={80} style={{position:'absolute',zIndex:1,left:0,top:0,}}/>
                                </div>
                                <div style={{float:'left',marginLeft:10,width:window.screen.width-161,}}>
                                  <div style={{fontSize:Fnt_Normal,color:Common.Light_Black}}>员工享受社保、年金以及商业保险中的企业常见税务问题</div>
                                  <div style={{color:Common.Light_Gray,marginTop:15,}}>
                                    <span style={{fontSize:11,float:'left'}}>共6章</span>
                                    <span style={{fontSize:Fnt_Small,float:'right',color:Common.Activity_Text}}>已学完</span>
                                    <div style={Common.clear}></div>
                                  </div>
                                </div>
                            </div>
                            <div style={Common.clear}></div>
                          </Link>
                          </div>
                        )
                      }
                  })
                }
                <hr style={{border: 'none', height: 1, backgroundColor: '#f4f4f4', marginTop: 15}} />
                </div>
                :
                null
              }
              {/*热门回答*/}
              {
                this.state.question.length>0?
                <div style={{width:window.screen.width-24,paddingLeft:12,paddingRight:12,marginTop:15,}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/Rectangle@2x.png')} width={3} height={16} style={{float:'left',marginTop:4,}}/>
                  <div style={{fontSize:Fnt_Medium,color:Common.Black,float:'left',marginLeft:10,}}>热门问答</div>
                  <div style={Common.clear}></div>
                  {
                    this.state.question.map((item,index)=>{
                      var isBlock = 'block';
                      if(index == this.state.question.length-1){
                        isBlock = 'none';
                      }
                      else {
                        isBlock = 'block';
                      }
                      var user = {}
                      if(item.answer && item.answer.user){
                        user = item.answer.user
                      }

                      return(
                        <div key={index} onClick={this._goToQuestion.bind(this, item.id)}>
                          {/*<Link>*/}
                            <div style={{...styles.ques_title,...styles.LineClamp,}}>
                              {item.title}
                            </div>
                          {/*</Link>*/}
                          {item.callback_status ?
                            <div style={{position:'relative',margin:'15px 0',width:window.screen.width-24,height:40}}>
                              {this._allStatus(item.callback_status)}
                              <div style={{fontSize:14,color:'#666',textIndent:'4em'}}>{item.callback_hint}</div>
                            </div>
                            :
                            <div>
                              <div style={{marginTop:15,width:window.screen.width-24,overflow:'hidden'}}>
                                <div style={styles.lec_small}>
                                  <img src={user && user.photo ? user.photo : ''} width={30} height={30} style={styles.lec_img}/>
                                  <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.small_tag,display:this.state.isTeacher ? 'block':'none'}}/>
                                </div>
                                <div style={{float:'left',marginLeft:8,marginTop:6,fontSize:Fnt_Normal,color:Common.Gray}}>
                                  <span>{user && user.nick_name ? user.nick_name : ''}</span><span style={{marginLeft:15}}>{user && user.title ? user.title : ''}</span>
                                </div>
                              </div>
                              {item.answer && item.answer.content ?
                                <div style={{...styles.quest_con,...styles.LineClamp}} dangerouslySetInnerHTML={{__html: item.answer.content}}>
                                </div>
                                :
                                null
                              }
                            </div>
                          }
                          <hr style={{border: 'none', height: 1, backgroundColor: '#f4f4f4', display: isBlock}}/>
                        </div>
                      )
                    })
                  }
                </div>
                :
                null
              }
           </div>

           {/*课程*/}
           <div style={{...styles.con_box,display:this.state.checkNum == 1 ? 'block':'none',height:window.innerHeight-246,overflowY:'auto'}}>
           {
             this.state.online_lesson.length >0 ?
             <div>
                <Link to={{pathname: `${__rootDir}/teacher/lesson/list/online`, query: null, hash: null, state: {teacher_id: this.props.match.params.id,type:'online'}}}>
                 <div style={{padding: '12px 0px 0px', width: screenWidth, height: 20, display: this.state.online_lesson.length > 0 ? 'block' : 'none'}}>
                   <img src={Dm.getUrl_img('/img/v2/icons/online@2x.png')} style={{...styles.logo, width: 22}}/>
                   <span style={{...styles.logo_title}}>视频课</span>
                   <div style={{...styles.count_num}}>{this.state.count.onlineCount}</div>
                   <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.online_lesson.length > 0 ? 'block' : 'none'}}/>
                 </div>
               </Link>
               <OnlineLessonDiv {...onlineProps}/>
               <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.online_lesson.length > 0 ? 'block' : 'none'}}></hr>
             </div>
             :
             null
           }

            {
              this.state.live_lesson.length > 0 ?
              <div>
                <Link to={{pathname: `${__rootDir}/teacher/lesson/list/live`, query: null, hash: null, state: {teacher_id: this.props.match.params.id}}}>
                  <div style={{padding: '12px 0px 0px', width: screenWidth, display: this.state.live_lesson.length > 0 ? 'block' : 'none'}}>
                    <img src={Dm.getUrl_img('/img/v2/icons/live@2x.png')} style={{...styles.logo}}/>
                    <span style={{...styles.logo_title}}>直播课</span>
                    <div style={{...styles.count_num}}>{this.state.count.liveCount}</div>
                    <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.live_lesson.length > 0 ? 'block' : 'none'}}/>
                  </div>
                </Link>
                <LiveLessonDiv {...liveProps} reservedLives={this.state.reservedLives}/>
                <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.live_lesson.length > 0 ? 'block' : 'none'}}></hr>
              </div>
              :
              null
            }
          {
            this.state.offline_lesson.length > 0 ?
            <div>
              <Link to={{pathname: `${__rootDir}/teacher/lesson/list/offline`, query: null, hash: null, state: {teacher_id: this.props.match.params.id}}}>
                <div style={{padding: '12px 0px 0px', width: screenWidth, height: 24, display: this.state.offline_lesson.length > 0 ? 'block' : 'none'}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/offline@2x.png')} style={{...styles.logo, width: 23, height: 23}}/>
                  <span style={{...styles.logo_title}}>线下课</span>
                  <div style={{...styles.count_num}}>{this.state.count.offlineCount}</div>
                  <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.offline_lesson.length > 0 ? 'block' : 'none'}}/>
                </div>
              </Link>
              <OfflineLessonDiv {...offlineProps}/>
              <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.offline_lesson.length > 0 ? 'block' : 'none'}}></hr>
            </div>
            :
            null
          }
          </div>

           {/*问答*/}

           <div style={{...styles.con_box,display:this.state.checkNum == 2 ? 'block':'none', paddingTop: 0}}>
             <div ref={(qasList) => this.qasList = qasList}
               style={{overflow: 'scroll', height: document.documentElement.clientHeight-226}}
     					onTouchEnd={this._labelScroll.bind(this)}
     					onScroll={this._ballType.bind(this)}
     					onTouchStart={this._hideBall.bind(this)}>
           {
             this.state.qas.length > 0 ?
             <div style={{width:window.screen.width-24,marginLeft:12}}>
             {
               this.state.qas.map((item,index)=>{
                 var isBlock = '';
                 if(index == this.state.qas.length -1){
                   isBlock = 'none';
                 }
                 else {
                   isBlock = 'block';
                 }
                 var is_teacher = 0;//1:讲师 0:个人
                 if(item.answer && item.answer.user && item.answer.user.is_teacher){
                   is_teacher = item.answer.user.is_teacher;
                 }
                 var user ={};
                 if(item.answer && item.answer.user){
                   user = item.answer.user;
                 }

                 return(
                   <div key={index} onClick={this._goToQuestion.bind(this, item.id)}>
                       <div style={{...styles.ques_title,...styles.LineClamp,}}>
                         {item.title}
                       </div>
                      {item.callback_status ?
                        <div style={{position:'relative',margin:'15px 0',width:window.screen.width-24,height:40}}>
                          {this._allStatus(item.callback_status)}
                          <div style={{fontSize:14,color:'#666',textIndent:'4em'}}>{item.callback_hint}</div>
                        </div>
                        :
                        <div>
                          <div style={{marginTop:15,width:window.screen.width-24,overflow:'hidden'}}>
                            <div style={{position:'relative',float:'left',width:30,height:30,}}>
                               <img src={user && user.photo ? user.photo:''} width={30} height={30} style={{borderRadius:'50%'}}/>
                               <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.small_tag,display:is_teacher == 1 ? 'block':'none'}}/>
                            </div>
                            <div style={{float:'left',marginLeft:8,marginTop:6,fontSize:Fnt_Normal,color:Common.Gray}}>
                              <span>{user && user.nick_name ? user.nick_name :''}</span><span style={{marginLeft:15}}>{user && user.title ? user.title : ''}</span>
                            </div>
                          </div>
                          {item.answer && item.answer.content?
                            <div style={{...styles.quest_con,...styles.LineClamp}} dangerouslySetInnerHTML={{__html: item.answer.content}}>
                            </div>
                            :
                            null
                          }
                        </div>
                      }
                     <hr style={{border: 'none', height: 1, backgroundColor: '#f4f4f4', display: isBlock}} />
                   </div>
                 )
               })
             }
             </div>
             :
             <div style={{marginTop: 70, textAlign: 'center'}}>
     					<img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} style={{width: 188, height: 128}}/>
     					<div style={{fontSize: 14, color: '#666', marginTop: 50}}>此用户暂无问答哦~</div>
     				</div>
           }
           </div>
        </div>

       </div>
       <Guide type={'teacher'} />

    </div>

    )
  }

  _clickTab(idx){
    this.setState({
      checkNum: idx,
    })

    if(idx == 0 ){
      Dispatcher.dispatch({
        actionType: 'TeacherUserInfo',
        teacher_id:this.props.match.params.id || '',
        type:'index',
      });
    }
    else if (idx == 1) {
      Dispatcher.dispatch({
        actionType: 'TeacherUserInfo',
        teacher_id:this.props.match.params.id || '',
        type:'lesson',
      });
    }
    else if (idx == 2) {
      Dispatcher.dispatch({
        actionType: 'TeacherUserInfo',
        teacher_id:this.props.match.params.id || '',
        type:'question',
        skip:this.state.qas.length,
        limit:15,
      });
    }
  }

  _goToQuestion(id) {
    this.props.history.push({pathname: `${__rootDir}/QaDetail/${id}`, hash: null, query: null, state: null})
  }

  _handleTeacherUserInfoDone(re){
    console.log('===_handleTeacherUserInfoDone000===',re);
    if(re && re.result){
      this.setState({
        result: re.type=='index' ? re.result : this.state.result,
        isTeacher:re.type=='index' ? re.result.isTeacher : this.state.isTeacher,
        isCollected:re.type=='index' ? re.result.isCollected : this.state.isCollected,
        isSameOne: re.type == 'index' ? re.result.isSameOne : this.state.isSameOne,
        userTopic: re.type=='index' ? re.result.user_topic : this.state.userTopic,
        newLessons:re.result.new_lessons || [],
        question:re.result.question || [],
        count:re.result.count || {},
        live_lesson:re.result.live_lesson || [],
        online_lesson:re.result.online_lesson || [],
        offline_lesson:re.result.offline_lesson || [],
        qas:re.type=='question' ? this.state.qas.concat(re.result) : [],
        loadLength:re.type=='question' ? re.result.length:this.state.qas.length,
        isLoading:false,
        reservedLives:re.reservedLives,
      },()=>{
        var array = [];
        array.push(this.state.newLessons[0]);
      })
    }
  }

  _handleFocusTeacherDone(re) {

    if(re.err) {
      alert(err)
      return
    }
  }

  _loadMore() {
    Dispatcher.dispatch({
      actionType: 'TeacherUserInfo',
      teacher_id:this.props.match.params.id || '',
      type:'question',
      skip:this.state.qas.length,
      limit:15,
    })
  }

  _labelScroll() {

		if( (this.qasList.scrollHeight - this.qasList.scrollTop - 226) <  document.documentElement.clientHeight) {

			if(this.state.loadLength < 15) {
				return
			} else {
				this._loadMore()
			}
		}
	}

_ballType(){
  clearTimeout(t)
  t = setTimeout(() => {
    this.setState({
      ballHide: false
    })
  }, 200)
}

_hideBall(){
  this.setState({
    ballHide:true,
  })
}

}

var styles = {
  lecture_bg:{
    height:180,
    width:window.screen.width,
    position:'relative'
  },
  bg:{
    width:window.screen.width,
    height:180,
    position:'absolute',
    zIndex:1,
    top:0,
    left:0,
  },
  lecture_top:{
    width:window.screen.width,
    height:180,
    position:'absolute',
    zIndex:10,
    top:0,
    left:0,
  },
  time_bg:{
    position: 'absolute',
    bottom: 0,
    height: 20,
    backgroundImage:'linear-gradient(-180deg, rgba(51,51,51,0.05) 0%, rgba(0,0,0,0.70) 100%)',
    color: '#fff',
    fontSize: 11,
    lineHeight: '20px',
  },
  tag:{
    position:'absolute',
    zIndex:2,
    bottom:-3,
    right:10,
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
  short_line:{
    height:11,
    width:1,
    backgroundColor:'#E5E5E5',
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
  },
  tab_position:{
    position:'absolute',
    height:'44px',
    bottom:0,
    left:0,
  },
  tab:{
    height:'44px',
    width:devWidth/3,
    textAlign:'center',
    fontSize:Fnt_Normal,
    float:'left',
    borderBottomStyle:'solid',
    borderBottomWidth:2,
  },
  con_box:{
    width:devWidth,
    paddingTop:15,
    backgroundColor:Common.Bg_White,
  },
  title:{
    fontSize:Fnt_Normal,
    color:Common.Light_Black,
    height:40,
    lineHeight:'20px',
  },
  ques_title:{
    width:devWidth-24,
    height:'42px',
    lineHeight:'21px',
    fontSize:Fnt_Medium,
    color:Common.Black,
    marginTop:15,
  },
  quest_con:{
    width:devWidth-24,
    height:'36px',
    lineHeight:'18px',
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
  lec_small:{
     position:'relative',
     zIndex:1,
     float:'left',
     width:30,
     height:30,
  },
  lec_img:{
    position:'absolute',
    zIndex:1,
    top:0,
    left:0,
    borderRadius:50,
  },
  small_tag:{
    position:'absolute',
    zIndex:2,
    bottom:-1,
    right:2,
  },
  logo: {
		marginLeft: 12,
		width: 18,
		height: 18,
		borderColor: 'red',
		display: 'inline-block',
		marginRight: 9
	},
  logo_title: {
		color: '#333',
		fontSize: 15,
    position: 'relative',
    top: -3
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
  hr: {
		height: 1,
		border: 'none',
		backgroundColor: '#f3f3f3',
		margin: '15px 12px 0 12px'
	},
  span: {
		fontSize: 14,
		color: '#333',
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
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
		paddingTop: 10,
		paddingRight: 12,
    position: 'relative'
	},
	lessonPng: {
		width: 127,
		height: 80,
		marginRight: 12,
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
	line: {
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
  callback_status:{
    position:'absolute',
    left:0,
    top:4,
    borderRadius:'2px',
    textAlign:'center',
    width:50,
    height:16,
    lineHeight:0.8,
  }

}


export default LecturerHomePage;
