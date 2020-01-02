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
import FullLoading from '../components/FullLoading';

var skip = 0
class TeacherCenter extends React.Component {

  constructor(props) {
    super(props);
    this.focusTeacherList = []
    this.wx_config_share_home = {
        title: '讲师中心',
        desc: '',
        link: document.location.href + '',
        imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
        type: 'link'
    };
    this.state={
      teacherList: [],
      focusTeacherList:[],
      isLoading:true,
    }
  }
  _handleteacherListDone(re){
    console.log('_handleteacherListDone==',re);
    var result = re.result || []
    skip = result.length || 0
    for (var i = 0; i < result.length; i++) {//循环输入是否关注的点
      if (result[i].isCollected) {
        this.focusTeacherList[i] = true
      }else {
        this.focusTeacherList[i]= false
      }
    }
    this.setState({
      teacherList: result,
      focusTeacherList: this.focusTeacherList,
      isLoading:false,
    })
  }
  _labelScorll(re){

    if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
      console.log('LoadMore questionList');
      Dispatcher.dispatch({
        actionType: 'teacherList',
        skip: skip,
        limit: 15,
        LoadMore: true
      })
    }
  }
  _handleteacherListLoadMoreDone(re){
    console.log('_handleteacherListLoadMoreDone',re+'dsdsd'+this.state.teacherList.length);
    var result = re.result || []
    var leng = this.focusTeacherList.length
    for (var i = 0; i < result.length; i++) {//循环输入是否关注的点
      if (result[i].isCollected) {
        this.focusTeacherList[leng+i] = true
      }else {
        this.focusTeacherList[leng+i]= false
      }
    }
    this.setState({
      teacherList: this.state.teacherList.concat(result),
      focusTeacherList: this.focusTeacherList,
      isLoading:false,
    },()=>{
      skip = this.state.teacherList.length
    })
  }
  _handlefocusTeacherDone(re){//取消 或者关注事件 返回值
    console.log('_handlefocusTeacherDone',re);
  }
  focusTeacher(re,idx){//关注或者取消关注事件
    console.log('focusTeacher',re+'ddddd'+idx);
    Dispatcher.dispatch({
      actionType: 'focusTeacher',
      teacher_id: re
    })

    this.focusTeacherList[idx]= !this.focusTeacherList[idx]
    this.setState({
      focusTeacherList: this.focusTeacherList
    })
  }
  componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-讲师中心');
    Dispatcher.dispatch({
      actionType: 'teacherList',
    })
    this._getteacherListDone = EventCenter.on("teacherListDone", this._handleteacherListDone.bind(this))
    this._getteacherListLoadMoreDone = EventCenter.on("teacherListLoadMoreDone",this._handleteacherListLoadMoreDone.bind(this))
    this._getfocusTeacherDone = EventCenter.on("focusTeacherDone",this._handlefocusTeacherDone.bind(this))
  }

  componentWillUnmount() {
    this._getteacherListDone.remove()
    this._getteacherListLoadMoreDone.remove()
    this._getfocusTeacherDone.remove()
  }

  render(){
    var teacherList = this.state.teacherList.map((item,index)=>{
      var id = item.id;
      return(
        <div key={index}>
          <div style={{height:115,}}>
            <div style={{height:60,marginTop:15,}}>
            <Link to={`${__rootDir}/LecturerHomePage/${id}`}>
              <div style={{float:'left',position:'relative',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/lec_big@2x.png')} width={14} height={14} style={{...styles.tag,}}/>
                <img src={item.photo} width={60} height={60} style={{borderRadius:'50%'}}/>
              </div>
              <div style={{marginLeft:8,float:'left',width: devWidth - 186}}>
                <div style={{...styles.title}}>{item.nick_name}</div>
                <div style={{...styles.LineClamp,color:Common.Black,fontSize:Fnt_Small,width: devWidth - 186,height:36,lineHeight:'18px'}}>{item.title}</div>
              </div>
            </Link>
              {
                this.state.focusTeacherList[index] ?
                <div onClick={this.focusTeacher.bind(this,item.id,index)} style={{...styles.btn_attention,backgroundColor:'#d1d1d1',lineHeight:'32px'}} >已关注</div>
                :
                <div onClick={this.focusTeacher.bind(this,item.id,index)} style={{...styles.btn_attention}} disabled={false}><span style={{fontSize: 16}}>+</span> 关注</div>
              }
            </div>
          <Link to={`${__rootDir}/LecturerHomePage/${id}`}>
            <div style={{marginTop:10,}}>
              <div style={{width:(window.screen.width-24)/3,float:'left',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{float:'left',marginTop:9,}}/>
                <span style={{fontSize:11,color:'#2A2A2A',marginLeft:5,float:'left',marginTop:6,}}>{item.answerNum}个问题</span>
              </div>
              <div style={{width:(window.screen.width-24)/3,float:'left',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/icon_sub@2x.png')} width={13} height={13} style={{float:'left',marginTop:9,}}/>
                <span style={{fontSize:11,color:'#2A2A2A',marginLeft:5,float:'left',marginTop:6,}}>{item.lessonNum}个课程</span>
              </div>
              <div style={{width:(window.screen.width-24)/3,float:'left',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/expression@2x.png')} width={12} height={12} style={{float:'left',marginTop:9,}}/>
                <span style={{fontSize:11,color:'#2A2A2A',marginLeft:5,float:'left',marginTop:6,}}>{item.satisfaction}%满意度</span>
              </div>
            </div>
            </Link>
          </div>
          <div style={{...styles.line,}}></div>

        </div>
      )
    })


    return(
      <div
        ref={(lessonList) => this.lessonList = lessonList}
        onTouchEnd={() => {this._labelScorll(this.lessonList)}}
        style={{...styles.container,paddingTop:5,}}>

        <FullLoading isShow={this.state.isLoading}/>
          {teacherList}
      </div>

    )
  }
}

var styles ={
  container:{
    paddingLeft:12,
    paddingRight:12,
    backgroundColor:Common.Bg_White,
    height:devHeight,
    overflowY:'scroll',
    overflowX:'hidden'
  },
  title:{
    color:'#000',
    fontSize:14,
    marginTop:7,
  },
  ques_text:{
    fontSize:Fnt_Small,
    color:Common.Light_Gray,
    marginLeft:5,
    float:'left',
    marginTop:2
  },
  line:{
    width:devWidth-24,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4',
  },
  btn_attention:{
    width:80,
    height:'30px',
    lineHeight:'30px',
    textAlign:'center',
    fontSize:Fnt_Normal,
    color:Common.Bg_White,
    borderRadius:2,
    backgroundColor:Common.Activity_Text,
    float:'right',
    marginTop:15,
    border:'none',
  },
  tag:{
    position:'absolute',
    zIndex:2,
    bottom:10,
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


export default TeacherCenter;
