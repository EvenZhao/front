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

var skip = 0;
var limit = 15;
var countdown
class InviteTeacher extends React.Component {

  constructor(props) {
    super(props);
    this.focusTeacherList = []
    this.state={
      //是否关注
      isAttention:false,
      searchValue:'',
      teacherList:[],
      isSearch: false,
      display:'none',
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
      lastInvitedNum:'',
      canNotLoad: false,
      loadmore: true,
      isShow: false,
      isOver: false,
      isLoading: true,

    }
  }

  _handleteacherListDone(re){
    console.log('_handleteacherListDone',re);
    var result = re.result || []
    skip = result.length || 0
    for (var i = 0; i < result.length; i++) {//循环输入是否关注的点
      if (result[i].isInvited) {
        this.focusTeacherList[i] = true
      }else {
        this.focusTeacherList[i]= false
      }
    }
    this.setState({
      teacherList: result,
      focusTeacherList: this.focusTeacherList,
      loadmore: result.length >= 15 ? true : false,
    })
  }
  _handleteacherListLoadMoreDone(re){
    console.log('_handleteacherListLoadMoreDone',re+'dsdsd'+this.state.teacherList.length);
    var result = re.result || []
    var leng = this.focusTeacherList.length
    for (var i = 0; i < result.length; i++) {//循环输入是否关注的点
      if (result[i].isInvited) {
        this.focusTeacherList[leng+i] = true
      }else {
        this.focusTeacherList[leng+i]= false
      }
    }
    this.setState({
      teacherList: this.state.teacherList.concat(result),
      focusTeacherList: this.focusTeacherList,
      loadmore: result.length >= 15 ? true : false,
    },()=>{
      skip = this.state.teacherList.length
    })
  }
  invitedTeacher(re,idx){
    Dispatcher.dispatch({
      actionType: 'invitedTeacher',
      invite_id: re,
      question_id: this.props.location.state.id
    })
    this.focusTeacherList[idx]= !this.focusTeacherList[idx]
    this.setState({
      focusTeacherList: this.focusTeacherList,
      lastInvitedNum: idx
    })
  }
  componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'teacherList',
      question_id: this.props.location.state.id,
      skip: 0,
      limit: 15
    })
  }
  _handleinvitedTeacherDone(re){
    console.log('_handleinvitedTeacherDone',re);
    if(re.err){
      var idx = this.state.lastInvitedNum
      if (this.focusTeacherList[idx]) {
        this.focusTeacherList[idx] = false
      }else {
        this.focusTeacherList[idx] = true
      }

      this.setState({
        display:'block',
        alert_title:re.err,
        alert_icon:failure_icon,
        icon_width:failure_width,
        icon_height:failure_height,
        isDisabled:true,
        focusTeacherList: this.focusTeacherList,
        lastInvitedNum:''
      },()=>{
        countdown = setInterval(()=>{
            clearInterval(countdown);
            this.setState({
              display:'none',
            })
        }, 1500);
      });
      return;
    }
    if (re.result) {
      this.setState({
        lastInvitedNum:'',
        loadmore: result.length >= 15 ? true : false,
      })
    }
  }
  _handlesearchTeacherDone(re){
    console.log('_handlesearchTeacherDone',re);
    var result = re.result || []
    skip = result.length || 0
    for (var i = 0; i < result.length; i++) {//循环输入是否关注的点
      if (result[i].isInvited) {
        this.focusTeacherList[i] = true
      }else {
        this.focusTeacherList[i]= false
      }
    }
    this.setState({
      teacherList: result,
      focusTeacherList: this.focusTeacherList
    })
  }
  _handlesearchTeacherLoadMoreDone(re){
    console.log('_handlesearchTeacherLoadMoreDone',re);
    var result = re.result || []
    var leng = this.focusTeacherList.length
    for (var i = 0; i < result.length; i++) {//循环输入是否关注的点
      if (result[i].isInvited) {
        this.focusTeacherList[leng+i] = true
      }else {
        this.focusTeacherList[leng+i]= false
      }
    }
    this.setState({
      teacherList: this.state.teacherList.concat(result),
      focusTeacherList: this.focusTeacherList,
      loadmore: result.length >= 15 ? true : false,
    },()=>{
      skip = this.state.teacherList.length
    })
  }
  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-邀请讲师');
    this._getteacherListDone = EventCenter.on("teacherListDone", this._handleteacherListDone.bind(this))
    this._getteacherListLoadMoreDone = EventCenter.on("teacherListLoadMoreDone",this._handleteacherListLoadMoreDone.bind(this))
    this._getinvitedTeacherDone =EventCenter.on("invitedTeacherDone",this._handleinvitedTeacherDone.bind(this))
    this._getsearchTeacherDone = EventCenter.on("searchTeacherDone",this._handlesearchTeacherDone.bind(this))
    this._getsearchTeacherLoadMoreDone = EventCenter.on("searchTeacherLoadMoreDone",this._handlesearchTeacherLoadMoreDone.bind(this))
  }

  componentWillUnmount() {
    this._getteacherListDone.remove()
    this._getteacherListLoadMoreDone.remove()
    this._getinvitedTeacherDone.remove()
    this._getsearchTeacherDone.remove()
    this._getsearchTeacherLoadMoreDone.remove()

  }
  _labelScorll(re){
    if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
      console.log('LoadMore questionList');
      if (this.state.isSearch) {
        Dispatcher.dispatch({
          actionType: 'searchTeacher',
          name: this.state.searchValue,
          question_id: this.props.location.state.id,
          skip: skip,
          limit: 15,
          LoadMore: true
        })
      }else {
        Dispatcher.dispatch({
          actionType: 'teacherList',
          question_id: this.props.location.state.id,
          skip: skip,
          limit: 15,
          LoadMore: true,
        })
      }
    }
  }
  _check_invite(e){
    this.setState({
      searchValue:e.target.value
    })
  }
  searchTeacher(re){
    Dispatcher.dispatch({
      actionType: 'searchTeacher',
      name: this.state.searchValue,
      question_id: this.props.location.state.id
    })
    this.setState({//判断如果当前状态为搜索，则加载更多的调用搜索
      isSearch: true
    })
  }
  render(){

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
    var teacherList = this.state.teacherList.map((item,index)=>{
      var label = item.label.map((it,idx)=>{
        if(idx > 1){
          return;
        }
        return(
          <div key={idx} style={{...styles.tag}}>{it.name}</div>
        )
      })

      return(
        <div style={{}} key={index}>
          <div style={{overflow:'hidden',}}>
          <Link to={`${__rootDir}/LecturerHomePage/${item.id}`}>
            <img src={item.photo} width={60} height={60} style={{float:'left',marginTop:20,borderRadius:'100px'}}/>
            <div style={{marginLeft:8,float:'left',}}>
              <div style={{...styles.title}}>{item.nick_name}</div>
              <div style={{fontSize:Fnt_Small,color:Common.Light_Gray}}>{item.position}</div>
            </div>
          </Link>
            {
              this.state.focusTeacherList[index] ?
              <div onClick={this.invitedTeacher.bind(this,item.id,index)} style={{...styles.btn_attention,backgroundColor:'#d1d1d1'}} disabled={true}>已邀请</div>
              :
              <div onClick={this.invitedTeacher.bind(this,item.id,index)} style={{...styles.btn_attention}} disabled={false}>邀请</div>
            }
          </div>
            <div style={{marginTop:9,}}>
              <span style={{color:Common.Light_Gray,fontSize:Fnt_Small,float:'left',marginRight:5,}}>擅长领域:</span>
              {label}
            </div>
            <div style={{clear:'both'}}></div>
            <div>
              <div style={{...styles.line,marginTop:15,}}></div>
            </div>
            {/*弹框*/}
            <div style={{...Common.alertDiv,display:this.state.display}}>
              <div style={{marginBottom:14,paddingTop:15,height:30,}}>
                <img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
               </div>
               <span style={{color:Common.BG_White}}>{this.state.alert_title}</span>
             </div>
        </div>
      )
    })
    return(
    <div
    onTouchEnd={() => {
      this._labelScorll(this.lessonList)
    }}
    style={{...styles.container}}>
      <div style={{...styles.top,}}>
        <div style={{...styles.input_box}}>
          <img src={Dm.getUrl_img('/img/v2/icons/searchTeacher@2x.png')} width={15} height={15}
          style={{float:'left',marginTop:7,marginLeft:13,marginRight:9,}}/>
          <input placeholder="请输入讲师姓名" type='text' onChange={this._check_invite.bind(this)} style={{...styles.input}} value={this.state.searchValue}/>
        </div>
        <button onClick={this.searchTeacher.bind(this)} style={{...styles.btn_search}}>搜索</button>
        <div style={{clear:'both'}}></div>
      </div>

      <div style={{...styles.content}} ref={(lessonList) => this.lessonList = lessonList}>
        { this.state.teacherList.length > 0 ?
          teacherList
          :
          listNull
        }
        <div style={{display:this.state.loadmore ? 'none':'block',height:30,lineHeight:'30px',textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
      </div>
    </div>

    )
  }
}

var styles ={
  container:{
    height:window.innerHeight,
  },
  top:{
    backgroundColor:'#fff',
    paddingTop:18,
    paddingBottom:18,
    paddingLeft:12,
    paddingRight:12,
  },
  input_box:{
    width:window.screen.width-67,
    height:30,
    borderStyle:'solid',
    borderWidth:1,
    borderColor:'#EAEAEA',
    borderRadius:15,
    float:'left',
  },
  input:{
    width:window.screen.width-120,
    height:20,
    lineHeight:'20px',
    marginTop:5,
    border:'none',
    float:'left',
    fontSize:Fnt_Small,
  },
  btn_search:{
    fontSize:Fnt_Normal,
    color:Common.Activity_Text,
    float:'right',
    border:'none',
    height:30,
    lineHeight:'30px',
    backgroundColor:Common.Bg_White,
  },
  content:{
    height:window.innerHeight-69,
    overflowY:'auto',
    paddingLeft:12,
    paddingRight:12,
    marginTop:5,
    backgroundColor:Common.Bg_White,
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
  tag:{
    height:20,
    lineHeight:'20px',
    fontSize:11,
    paddingLeft:8,
    paddingRight:8,
    float:'left',
    backgroundColor:'#E3F1FC',
    color:Common.Black,
    marginRight:15,
    borderRadius:8,
  }


}


export default InviteTeacher;
