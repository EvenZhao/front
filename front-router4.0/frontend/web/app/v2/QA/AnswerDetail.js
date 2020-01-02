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


class AnswerDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      //是否关注
      isAttention:false,
      //是否采纳
      isAdopt:false,
      isBlock:'block',
      answer:'',
      title: '',
      user: '',
      comment: [],
      content: '',
      time: '',
      user_id: '',
      loadLength: '',
      comment_num: '',
      isMyQuestion: false,
      canAdopted: false,
      isShow: false,
      isAdopt: false,
      isLogin: false,
      questionUser:'',
      isShow:false,
      ReplyNickName:'',
      newComment:'',
      item:{},
      answerData:{},
      loadMore: true,
      is_callback: this.props.location.state ? this.props.location.state.is_callback : false,
    }
    this.text =''
    this.inputText='请输入您的评论'
    this.anserReplyNick = this.props.location.state ? this.props.location.state.nickName :'';
  }

  componentWillMount() {
   
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-问答详情');

    Dispatcher.dispatch({
      actionType: 'AnswerComment',
      id: this.props.match.params.id,
      skip: 0,
      limit: 15
    })
    Dispatcher.dispatch({
      actionType: 'AnswerDetail',
      id: this.props.match.params.id,
    })
    this._getAnswerComment = EventCenter.on('AnswerCommentDone',this._handleAnswerComment.bind(this))
    this._getCommentNum = EventCenter.on("AnswerDetailDone", this._handleAnswerCommentNub.bind(this))
    this._getAnswerRes = EventCenter.on('AddAnswerCommentDone', this._handleGetAnswerRes.bind(this))

  }

  componentWillUnmount() {
    this._getAnswerComment.remove()
    this._getCommentNum.remove()
    this._getAnswerRes.remove()
  }
  _handleGetAnswerRes(re) {
    if(re.result.err) {
			// this.setState({
			// 	isShow: true
			// }, () => {
			// 	clearTimeout(this.t)
			// 	this.t = setTimeout(() => {
			// 		this.setState({
			// 			isShow: false
			// 		})
			// 	}, 1000)
			// })
    }
    if(re.result.result == true) {
      window.location.reload();
    }
  }
  scroll() {
    if( (this.answerComment.scrollHeight - this.answerComment.scrollTop - 220) <  document.documentElement.clientHeight-50) {
      if(this.state.loadLength < 15) {
        this.setState({
          loadMore: false
        })
        return
      } else {
        this._loadMore()
      }
    }
  }
  _loadMore() {
    Dispatcher.dispatch({
      actionType: 'AnswerComment',
      id: this.props.match.params.id,
      skip: this.state.comment.length,
      limit: 15
    })
  }
  _handleAnswerComment(re) {
    if(re && re.result) {
      this.setState({
        comment: this.state.comment.concat(re.result),
				loadLength: re.result.length
      })
    }
  }

  _handleAnswerCommentNub(re) {
    if(re && re.result) {
      this.setState({
        answerData:re.result.answer || {},
        comment_num: re.result.answer.answer_comment_num,
        content: re.result.answer.content,
        time: re.result.answer.last_time,
        user: re.result.answer.user,
        user_id: re.result.answer.user_id,
        isAdopt: re.result.answer.status == 1 ? true : false,
        title: re.result.question.title,
        isLogin: re.user.isLogined,
        isMyQuestion: re.result.isMyQuestion,
        canAdopted: re.result.canAdopted,
        questionUser: re.result.questionUser
      })
    }
  }

  removeHtmlTag(str) {
    if(str) {
      var str1 = str.replace(/<(?!p|\/p).*?>/g, "");  
      // var str1 = str.replace(/<[^>]+>/g,"");
      var str2 = str1.replace(/&nbsp;/ig,'');
    }
    return str2;
  }

  render(){
    var comment = this.state.comment.map((item,index)=>{
      var user = item.user_info || {}
      return(
        <div key={index}>
            <div style={{clear:'both',overflow:'hidden',paddingTop:10,}}>
            {user && user.id ?
              <div style={{position:'relative',width:30,height:30}}>
                { user.is_teacher && user.is_teacher == 1 ?
                  <Link to={`${__rootDir}/LecturerHomePage/${user.id}`}>
                    <img src={user.photo} width={30} height={30} style={{float:'left',borderRadius:'50%'}}/>
                    <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.small_tag,}}/>
                  </Link>
                  :
                  <Link to={`${__rootDir}/PersonalPgHome/${user.id}`}>
                    <img src={user.photo} width={30} height={30} style={{float:'left',borderRadius:'50%'}}/>
                  </Link>
                }
              </div>
              :
              <img src={user.photo} width={30} height={30} style={{float:'left',borderRadius:'50%'}}/>
            }

              <div style={{float:'left',marginLeft:8,marginTop:6,fontSize:Fnt_Normal,color:Common.Gray}}>
                {
                  item.to_nick_name ?
                  <span>
                    <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{user.nick_name}</span>
                    <span style={{fontSize:14,color:'#3f3f3f'}}> 回复 </span>
                    <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{item.to_nick_name}</span>
                  </span>
                  :
                  <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{user.nick_name}</span>
                }
              </div>
            </div>
            <div style={{fontSize:Fnt_Normal,color:Common.Black,marginTop:12,}}>
              {this.removeHtmlTag(item.content)}
            </div>
            <div style={{marginTop:12,overflow:'hidden',display: this.state.is_callback ? 'none':'block'}}>
              <div style={{width:50,overflow:'hidden',float:'left'}} onClick={this.Reply.bind(this,item)}>
                <img src={Dm.getUrl_img('/img/v2/icons/qaFb@2x.png')} width={14} height={15} style={{float:'left'}}/>
                <span style={{float:'left',fontSize:Fnt_Small,color:Common.Gray,marginLeft:6,marginTop:-2}}>回复</span>
              </div>
              <div style={{float:'right',fontSize:Fnt_Small,color:'#b9b9b9',}}>{new Date(item.create_time).format('yyyy-MM-dd')}</div>
            </div>
            <div style={{...styles.line,marginTop:15,}}>
            </div>
        </div>
      )
    })
    return(
    <div >
      <div style={{...styles.container,height:this.state.is_callback ? devHeight : devHeight-50,}}
      onTouchEnd={() => {this.scroll(this.lessonList)}}
      ref={(answerComment) => this.answerComment = answerComment}
      >
      <div style={{backgroundColor:Common.Bg_White,paddingBottom:10,}}>
          <div style={{paddingLeft:12,paddingRight:12,}}>
          <div style={{...styles.LineClamp,fontSize:Fnt_Medium,color:Common.Light_Black,paddingTop:10,}}>
            {this.state.title}
          </div>
          <div style={{...styles.line,marginTop:8,}}>
          </div>
          <div style={{clear:'both',overflow:'hidden',paddingTop:25,}}>
          {this.state.answerData && this.state.answerData.anonymous == 0 ?
            <div style={{float:'left',position:'relative'}}>
              { this.state.user && this.state.user.isTeacher == 1 ?
                <Link to={`${__rootDir}/LecturerHomePage/${this.state.answerData.user_id}`}>
                  <img src={this.state.user.photo} width={30} height={30} style={{float:'left',borderRadius:'50%'}}/>
                  <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.small_tag}}/>
                </Link>
                :
                <Link to={`${__rootDir}/PersonalPgHome/${this.state.answerData.user_id}`}>
                  <img src={this.state.user.photo} width={30} height={30} style={{float:'left',borderRadius:'50%'}}/>
                </Link>
              }
            </div>
            :
            <img src={this.state.user.photo || ''} width={30} height={30} style={{float:'left',borderRadius:'50%'}}/>
          }
          <div style={{width:devWidth-70,float:'left',marginTop:6,marginLeft:8,height:40,lineHeight:'20px',fontSize:Fnt_Normal,color:Common.Gray}}>
              <span>{this.state.user.nick_name}</span>
              <span style={{marginLeft:15}}>{this.state.user.title}</span>
              <span style={{marginLeft:5,fontSize:Fnt_Normal,color:Common.Light_Gray}}>回答</span>
          </div>
          </div>
          <div style={{fontSize:Fnt_Normal,color:Common.Black,marginTop:12,}} dangerouslySetInnerHTML={{__html:this.removeHtmlTag(this.state.content)}}>
          </div>
          <div style={{fontSize:Fnt_Normal,color:Common.Light_Gray,marginTop:8,paddingBottom:10,textAlign:'right'}}>
            提问者:{this.state.questionUser || ''}
          </div>
          </div>
          <div style={{height:30,lineHeight:'30px',backgroundColor:'#eee',paddingLeft:12,paddingRight:12,backgroundColor:'#eee'}}>
            <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{float:'left',marginTop:9,}}/>
            <span style={{float:'left',fontSize:Fnt_Small,color:Common.Light_Gray,marginLeft:5,}}>{this.state.comment_num || 0}评论</span>
            <div style={{float:'right',fontSize:Fnt_Small,color:Common.Light_Gray,}}>回答日期：{new Date(this.state.time).format('yyyy-MM-dd')}</div>
          </div>
        </div>

      <div style={{paddingLeft:12,paddingRight:12,paddingBottom:5,backgroundColor:Common.Bg_White,}}>
        {comment}
        <div style={{display:!this.state.loadMore ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray,marginTop:10,}}>已经到底啦~</div>
      </div>
      </div>
      <div onClick={this.Reply.bind(this,'answerNick')} style={{...styles.myPingLun,display:this.state.is_callback ? 'none':'block'}}>
        <img src={Dm.getUrl_img('/img/v2/icons/havent_qa@2x.png')} style={{height: 19, width: 16, marginLeft:(window.screen.width-16)/2, display: 'block',marginTop:7}}/>
        <div><span style={{fontSize:11,color:'#999999'}}>我要评论</span></div>
      </div>
    {/*回复弹框*/}
    <div style={{...styles.mask,display:this.state.isShow ?'block':'none'}}></div>
    <div style={{...styles.reply_box,display:this.state.isShow ?'block':'none'}}>
      <div style={{...styles.reply_title,}}>
      <img onClick={this.cancel.bind(this)} src={Dm.getUrl_img('/img/v2/icons/close@2x.png')} width={15} height={15} style={{float:'left',marginLeft:12,marginTop:14,}} />
      <div style={{textAlign:'center',width:window.screen.width-87,float:'left',fontSize:Fnt_Normal,color:Common.Gray,}}>
        对{this.state.ReplyNickName}的{this.text}
      </div>
      <div onClick={this.button.bind(this)} style={{...styles.btn_submit}}>提交</div>
      </div>
      <div style={{clear:'both'}}></div>
      <div>
        <textarea style={{...styles.content_input}} value={this.state.newComment} onChange={this._check_answer.bind(this)} placeholder={this.inputText}/>
      </div>
      <div style={{...styles.limit_text}}>
        500
      </div>
    </div>
  </div>
  )
}

Reply(e){
  var user = e.user_info || {}
  //评论
  if(e == 'answerNick'){
    this.setState({
      ReplyNickName:this.anserReplyNick,
    })
    this.text = '回答评论'
    this.inputText = '请输入您的评论'
  }
  else {
    //回复
    this.setState({
      ReplyNickName:user.nick_name,
    })
    this.text = '回复'
    this.inputText = '请输入您的回复'
  }
  this.setState({
    isShow: true,
    item: e
  })

}
button(e){
  var item = this.state.item || {}
  if (item) {
    Dispatcher.dispatch({
      actionType: 'AddAnswerComment',
      answer_id: this.props.match.params.id,
      content: this.state.newComment,
      parent_id: item.id || 0
    })
  }
}
cancel(e){
  this.setState({
    isShow: false,
    item:{},
    newComment:''
  })
}
_check_answer(e){
  e.preventDefault();
  var v = e.target.value.trim();
  this.setState({
    newComment: v
  })
}

}

var styles ={
  container:{
    backgroundColor:Common.Bg_White,
    // position:'relative',
    overflowX:'hidden',
    overflowY:'scroll'
  },
  line:{
    width:window.screen.width-24,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4',
  },
  LineClamp:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
    fontWeight: 'bold',
		// height:48,
    width:window.screen.width-24,
	},
  ques_title:{
    width:window.screen.width-24,
    height:'42px',
    lineHeight:'21px',
    fontSize:Fnt_Medium,
    color:Common.Black,
  },
  quest_con:{
    width:window.screen.width-24,
    height:'34px',
    lineHeight:'17px',
    fontSize:Fnt_Normal,
    color:Common.Black,
    marginTop:6,
    paddingBottom:10,
    marginBottom:18,
  },
  subject:{
    marginTop:12,
    paddingTop:15,
    paddingBottom:15,
    paddingLeft:12,
    paddingRight:12,
  },
  span_text: {
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
  mask:{
    backgroundColor:Common.Light_Black,
    opacity:0.3,
    position:'absolute',
    width:window.screen.width,
    height:window.innerHeight,
    zIndex:2,
    top:0,
    left:0,
    right:0,
    bottom:0,
  },
  reply_box:{
    width:window.screen.width,
    height:198,
    backgroundColor:Common.Bg_White,
    position:'absolute',
    bottom:0,
    zIndex:3,
  },
  reply_title:{
    height:42,
    lineHeight:'42px',
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#E5E5E5',
  },
  btn_submit:{
    float:'right',
    marginRight:20,
    width:40,
    lineHeight:'42px',
    height:42,
    backgroundColor:Common.Bg_White,
    color:Common.Activity_Text,
    fontSize:Fnt_Medium,
    border:'none',
  },
  content_input: {
    width: window.screen.width-24,
    resize: 'none',
    border: 'none',
    padding: '15px 12px 55px 12px',
    fontSize: 14,
    wordBreak: 'break-all',
  },
  limit_text:{
    color:'#a4a4a4',
    fontSize:Fnt_Normal,
    textAlign:'right',
    paddingRight:20,
    paddingTop:10,
    height:35,
    borderTopWidth:1,
    borderTopColor:'#e5e5e5',
    borderTopStyle:'solid',
  },
  myPingLun:{
    width:window.screen.width,
    height:50,
    position:'absolute',
    bottom:0,
    backgroundColor:"#ffffff",
    textAlign:'center',
    borderTopStyle:'solid',
    borderTopColor:'#E5E5E5',
    borderTopWidth:1,
  },
  small_tag:{
    position:'absolute',
    zIndex:10,
    bottom:-1,
    right:2,
  },

}

export default AnswerDetail;
