import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import {dm} from '../util/DmURL';
import FullLoading from '../components/FullLoading';
import Common from '../Common';
import funcs from '../util/funcs'


class MyQa extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      checkNum:0,
      qa:[],
      isLoading:true,
    }

    //this.data = ['我的邀请','我的提问','我的回答',];
    this.data = ['我的提问','我的回答',];
  }

  componentWillMount() {
   
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-问答');
    
    Dispatcher.dispatch({
      actionType: 'MyQA',
      type: 1
    })
    this.e_MyQA = EventCenter.on('MyQADone',this._handleMyQADone.bind(this));
  }

  componentWillUnmount() {
    this.e_MyQA.remove()
  }
  _goLecturerPage(anonymous,id,isTeacher){
      if (anonymous) {
        return false
      }
      if(isTeacher == 1){
        //跳转到讲师主页
        this.props.history.push(`${__rootDir}/LecturerHomePage/${id}`);
      }else {

        this.props.history.push(`${__rootDir}/PersonalPgHome/${id}`);
      }

  }
  render(){


   if(this.state.checkNum+1 == 2){
    var answer = this.state.qa.map((item,index)=>{

      var is_teacher = 0;//1:讲师 0:个人

      if(item && item.user){
        is_teacher = item.user.isTeacher;
      }

      return(
        <div key={index}>
          <Link to={ `${__rootDir}/QaDetail/${item.id}`}>
            <div style={{marginTop:15,fontSize:Fnt_Medium,color:Common.Black,}} dangerouslySetInnerHTML={{__html: item.title || ''}}></div>
          </Link>
          <div>
            <div style={{float:'left',width:30,height:30,position:'relative',marginTop:13,}}onClick={this._goLecturerPage.bind(this,item.anonymous,item.user_id,is_teacher)}>
              <img src={item.user && item.user.photo ? item.user.photo : Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={30} height={30} style={{borderRadius:15,}}/>
              <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.small_tag,display:is_teacher == 1 ? 'block':'none'}}/>
            </div>
            <Link to={ `${__rootDir}/QaDetail/${item.id}`}>
              <div style={{marginLeft:8,marginTop:16,float:'left',marginBottom:5,}} >
                <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{ item.user && item.user.nick_name ? item.user.nick_name : ''}</span>
                <span style={{color:Common.Gray,fontSize:Fnt_Normal,marginLeft:10,}}>{item.user && item.user.title ? item.user.title:''}</span>
              </div>
              <div style={Common.clear}></div>
              {
                item.answer && item.answer.content ?
                <div style={{...styles.LineClamp,...styles.content}} dangerouslySetInnerHTML={{__html: item.answer.content }}>
                </div>
                :
                null
              }
            </Link>
          </div>
          <div style={{...styles.line,display:this.state.qa.length-1 == index ? 'none':'block'}}></div>
        </div>
      )
    })
  }
  else if (this.state.checkNum+1 == 1) {
    var question = this.state.qa.map((item,index)=>{
     return(
       <div key={index}>
        <Link to={`${__rootDir}/QaDetail/${item.id}`}>
           <div dangerouslySetInnerHTML={{__html: item.title || ''}} style={{...styles.LineClamp,fontSize:Fnt_Medium,color:Common.Light_Black,marginTop:10}}>

           </div>
          </Link>
         <div style={{height:30,lineHeight:'30px',}}>
           <img src={Dm.getUrl_img('/img/v2/icons/answer@2x.png')} width={12} height={13} style={{float:'left',marginTop:9,}}/>
           <span style={{float:'left',fontSize:Fnt_Small,color:Common.Light_Gray,marginLeft:5,}}>{item.question_answer_num}回答</span>
           <div style={{float:'right',fontSize:Fnt_Small,color:Common.Light_Gray,}}>{new Date(item.last_time).format(Common.YDATE)}</div>
         </div>
         <div style={{...styles.line,display:this.state.qa.length-1 == index ? 'none':'block'}}></div>
       </div>
     )
   })
  }

    return(
      <div style={{...styles.container}}>
      <FullLoading isShow={this.state.isLoading}/>
        <div style={styles.tab_box}>
          <div style={styles.tab_con}>
             {
               this.data.map((item,index)=>{
                 var text_color = Common.Light_Black;
                 var border_color = '#F4F4F4';
                 var border_width = 0;

                 if(this.state.checkNum == index){
                    text_color = Common.Activity_Text;
                    border_color = Common.Activity_Text;
                    border_width = 1;
                 }

                 var tab_text = {
                   display:'inline-block',
                   height:45,
                   lineHeight:'45px',
                   textAlign:'center',
                   fontSize:Fnt_Medium,
                   color:text_color,
                   borderBottomStyle:'solid',
                   borderBottomWidth:border_width,
                   borderBottomColor:border_color,
                 }
                 return(
                   <div key={index} style={styles.tab} onClick={this.ChooseTab.bind(this,index)}>
                      <div style={tab_text}>{item}</div>
                   </div>
                 )
               })
             }
          </div>
        </div>

        <div style={{width:devWidth,paddingTop:10,overflowY:'auto',height:devHeight-56,}}>
          {/**我的提问*/}
          <div style={{display:this.state.checkNum == 0? 'block':'none',marginLeft:15,width:devWidth-30}}>
            {
              this.state.qa.length > 0 ?
              question
              :
              <div style={{textAlign:'center',paddingTop:70}}>
                <div>
                  <img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
                </div>
                <div style={{marginTop:51}}>
                  <span style={{fontSize:13,color:'#333333'}}>暂无提问哦，快去提问吧~</span>
                </div>
              </div>
            }

          </div>
          {/**我的回答*/}
          <div style={{display:this.state.checkNum == 1? 'block':'none',marginLeft:15,width:devWidth-30}}>
            {
              this.state.qa.length > 0 ?
              answer
              :
              <div style={{textAlign:'center',paddingTop:70}}>
                <div>
                  <img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
                </div>
                <div style={{marginTop:51}}>
                  <span style={{fontSize:13,color:'#333333'}}>暂无回答哦，快去回答吧~</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
  ChooseTab(index){
    this.setState({
      checkNum:index,
    });
    if(index == 0){
      Dispatcher.dispatch({
        actionType: 'MyQA',
        type: index+1
      })
    }
    else if (index == 1) {
      Dispatcher.dispatch({
        actionType: 'MyQA',
        type: index+1,
      })
    }

  }


_handleMyQADone(re){
  if(re && re.results){
    this.setState({
      qa:re.results || [],
      isLoading:false,
    })
  }

}



}

var styles ={
  container:{
    backgroundColor:Common.Bg_White,
    height:window.innerHeight,
  },
  line:{
    width:window.screen.width-24,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4',
  },
  tab_box:{
    height:45,
    borderBottomColor:'#F4F4F4',
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    position:'relative',
  },
  tab_con:{
    position:'absolute',
    left:0,
    bottom:0,
    width:window.screen.width,
    height:45,
    lineHeight:'45px',
  },
  tab:{
    width:window.screen.width/2,
    height:45,
    lineHeight:'45px',
    textAlign:'center',
    float:'left',
  },
  title:{
    fontSize:Fnt_Medium,
    color:Common.Black,
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
    zIndex:2,
    bottom:-1,
    right:2,
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },

}

export default MyQa;
