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
import MyQaListFilter from './MyQaListFilter'


var width = window.screen.width
var innerHeight = window.innerHeight
var skip = 0
class MyPersonalized extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      //是否关注
      questionList:[]
    }
  }
  _handlemyPersonalRecommendDone(re){
    console.log('_handlemyPersonalRecommendDone=',re);
    var result = re.result || []
    skip = result.length
    this.setState({
      questionList: result.length > 1 ? result : []
    },()=>{
      if (this.state.questionList.length < 1) {//如果当前取消关注所有话题则回退到回答首页
          this.props.history.push(`${__rootDir}/Qa`)
        return null
      }
    })
  }
  _handlemyPersonalRecommendLoadMoreDone(re){
    var result = re.result || []
    this.setState({
      questionList: this.state.questionList.concat(result.questionList)
    },()=>{
      skip = this.state.questionList.length
    })
  }
  _labelScorll(re){

    if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
      console.log('LoadMore questionList');
      if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
        console.log('LoadMore questionList');
        EventCenter.emit("MyPersonalizedMore",skip)
      }
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-我的个性化推荐');
    this._getmyPersonalRecommendDone = EventCenter.on("myPersonalRecommendDone",this._handlemyPersonalRecommendDone.bind(this))
    this._getmyPersonalRecommendLoadMoreDone = EventCenter.on("myPersonalRecommendLoadMoreDone",this._handlemyPersonalRecommendLoadMoreDone.bind(this))

  }

  componentWillUnmount() {
    this._getmyPersonalRecommendDone.remove()
    this._getmyPersonalRecommendLoadMoreDone.remove()
  }

  removeHtmlTag(str) {
    if(str) {
      var str1 = str.replace(/<[^>]+>/g,"");
      var str2 = str1.replace(/&nbsp;/ig,'');
    }
    return str2;
  }

  _goPgHome(id,is_teacher){
    if(is_teacher == 1){
      this.props.history.push(`${__rootDir}/LecturerHomePage/${id}`);
    }else {
      this.props.history.push(`${__rootDir}/PersonalPgHome/${id}`);
    }

  }

  render(){
    var questionList = this.state.questionList.map((item,index)=>{

      var answer = item.answer || {}
      var user = item.answer ? item.answer.user : {}
      var is_teacher = 0;//1:讲师 0:个人
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
      if(item.answer && item.answer.user && item.answer.user.is_teacher){
        is_teacher = item.answer.user.is_teacher;
      }
      return(

          <div key={index}>
          <Link to={`${__rootDir}/QaDetail/${item.id}`} >
            <div dangerouslySetInnerHTML={{__html: item.title}} style={{...styles.title,...styles.LineClamp, fontWeight: 'bold'}}>

            </div>
            <div style={{marginTop:12, display: item.answer ? 'block' : 'none'}}>
              <div style={{float:'left',width:30,height:30,position:'relative',zIndex:1,}}>
              { answer && answer.anonymous == 0 && user.id ?
                <img src={user.photo} width={30} height={30} style={{borderRadius:15,}} onClick={this._goPgHome.bind(this,user.id,is_teacher)}/>
                :
                <img src={user.photo} width={30} height={30} style={{borderRadius:15,}}/>
               }
                <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.small_tag,display:is_teacher ==1 ? 'block':'none'}}/>
              </div>

                <div style={{paddingLeft:8,float:'left',marginTop: 5,width:devWidth-62}}>
                  <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{answer.user ? answer.user.nick_name : ''}</span>
                  <span style={{color:Common.Gray,fontSize:Fnt_Normal,marginLeft:10,}}>{answer.user ? answer.user.title : ''}</span>
                </div>

            </div>
            {
              callback_status == null ?
              <div>
                {
                  item.answer ?
                      <div style={{...styles.LineClamp,fontSize:14,color:Common.Black}}>
                      {this.removeHtmlTag(answer.content)}
                      </div>
                  :
                    <p style={{color: '#999', fontSize: 14, marginTop: 10}}>还没有答案，快来做第一个回答者吧~</p>
                }
              </div>
              :
                <div style={{width:devWidth-24,height:40,position:'relative'}}>
                  <div style={{...status,position:'absolute',borderRadius:'2px',lineHeight:0.8,textAlign:'center',top:4,width:50,height:16}}>
                    <span style={{fontSize:11}}>{stauts_text}</span>
                  </div>
                  <div style={{}}>
                    <span style={{...styles.callback_status,marginLeft:54}}>本问题已被提问者设定为电话预约专家诊断问题，回答内容仅供提问者可见</span>
                  </div>
                </div>
            }

            <div style={{...styles.line,marginTop:15,}}></div>
            </Link>
          </div>

      )
    })
    return(//MyQaListFilter
      <div
        ref={(lessonList) => this.lessonList = lessonList}
        onTouchEnd={() => {
          this._labelScorll(this.lessonList)
        }}
        style={{...styles.container}}>
          {/*问答筛选条件*/}
          <div style={{...styles.qa_tab,marginTop: this.state.teacherQADispaly ? 10 : 0,}}>
            <MyQaListFilter />
          </div>
          {/*问答列表*/}
          <div style={{paddingLeft:12,paddingRight:12,backgroundColor:Common.Bg_White,height:innerHeight,}}>
            <div
              ref={(lessonList) => this.lessonList = lessonList}
              style={{...styles.questionListDiv,height:this.state.questionListHieght}}>
              {questionList}
            </div>
          </div>
      </div>

    )
  }
}

var styles ={
  container:{
    // paddingLeft:12,
    // paddingRight:12,
    backgroundColor:Common.Bg_White,
    height:window.innerHeight,
    // width:window.screen.width,
    overflowY:'scroll',
    overflowX:'hidden'
  },
  ques_text:{
    fontSize:Fnt_Small,
    color:Common.Light_Gray,
    marginLeft:5,
    float:'left',
    marginTop:2
  },
  line:{
    width:window.screen.width-24,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4',
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
  title:{
    fontSize:Fnt_Medium,
    color:Common.Black,
    marginTop:12,
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    // height:48,
    width:window.screen.width-24,
  },
  btn_qa:{
    position:'absolute',
    width:56,
    height:56,
    bottom:85,
    left:window.screen.width/2-28,
    textAlign:'center',
  },
  qa_text:{
    color:'#fff',
    fontSize:Fnt_Medium,
    position:'absolute',
    left:0,
    bottom:0,
    zIndex:5,
    width:56,
    height:'56px',
    lineHeight:'56px',
  },
  questionListDiv:{
    width: width,
    overflowY:'scroll',
    overflowX:'hidden',
  },
  content:{
    fontSize:Fnt_Normal,
    color:Common.Black,
    width:window.screen.width-24,
    marginTop:5,
    height:40,
    lineHeight:'20px'
  },
  small_tag:{
    position:'absolute',
    zIndex:10,
    bottom:-1,
    right:2,
  },
  callback_status:{
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666666',
    letterSpacing: '-0.34px',
  }
}


export default MyPersonalized;
