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


class QaList extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      qa:[],
      count:0,
      loadLength:0,
      loadMore: false
    }
    this.type = this.props.location.state.type;
    this.userId = this.props.location.state.userId;
  }

  componentWillMount() {
   
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-TA的回答');

    Dispatcher.dispatch({
      actionType: 'UserQa',
      id: this.userId,      //this.props.match.params.id
      source:'qa',
      skip:0,
      limit:15,
      type:this.type,
    })
    
    this.e_UserQa = EventCenter.on('UserQaDone',this._handleUserQaDone.bind(this));
    this.e_UserQaLoadMoreDone = EventCenter.on("UserQaLoadMoreDone",this._handleUserQaLoadMoreDone.bind(this))
  }

  componentWillUnmount() {
    this.e_UserQa.remove()
    this.e_UserQaLoadMoreDone.remove()
  }

  render(){

    var answerArry
    var questionArry
    if(this.type == 'answer'){
       answerArry = this.state.qa.map((item,index)=>{
        return(
          <Link to={`${__rootDir}/QaDetail/${item.question_id}`} key={index}>
            <div style={{marginTop:15,fontSize:Fnt_Medium,color:Common.Black,}}>{item.title}</div>
            <div>
              <img src={item.user_info !== null ? item.user_info.photo:Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={30} height={30} style={{float:'left',marginTop:13,borderRadius:15,}}/>
              <div style={{marginLeft:8,marginTop:16,float:'left',marginBottom:5,}}>
                <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{item.user_info !== null ? item.user_info.nick_name : ''}</span>
                <span style={{color:Common.Gray,fontSize:Fnt_Normal,marginLeft:10,}}>资深税务专家</span>
              </div>
              <div style={Common.clear}></div>
              <div style={{...styles.LineClamp,...styles.content}} dangerouslySetInnerHTML={{__html: item.content}}>

              </div>
            </div>
            <hr style={{backgroundColor: '#f4f4f4', height: 1, border: 'none', marginTop: 12}}/>
          </Link>
        )
      })
    }
    else {
       questionArry = this.state.qa.map((item,index)=>{
        return(
          <Link to={`${__rootDir}/QaDetail/${item.id}`} key={index}>
            <div style={{...styles.LineClamp,fontSize:Fnt_Medium,color:Common.Light_Black,marginTop:10}}>
              {item.title}
            </div>
            <div style={{height:30,lineHeight:'30px',}}>
              <img src={Dm.getUrl_img('/img/v2/icons/answer@2x.png')} width={12} height={13} style={{float:'left',marginTop:9,}}/>
              <span style={{float:'left',fontSize:Fnt_Small,color:Common.Light_Gray,marginLeft:5,}}>{item.question_answer_num}回答</span>
              <div style={{float:'right',fontSize:Fnt_Small,color:Common.Light_Gray,}}>{new Date(item.create_time).format(Common.YDATE)}</div>
            </div>
            <hr style={{backgroundColor: '#f4f4f4', height: 1, border: 'none', marginTop: 12}}/>
          </Link>
        )
      })
    }

    return(

    <div style={{width:devWidth,backgroundColor:Common.Bg_White}}>
      <div>
        {
          this.state.type =='answer' ?
          <div style={{padding: '12px 0px 0px', width: window.screen.width,}}>
            <div style={{...styles.logo_title,marginLeft:12}}>TA的回答</div>
            <div style={{...styles.count_num,}}>{this.state.count}</div>
          </div>
          :
          <div style={{padding: '12px 0px 0px', width: window.screen.width,}}>
            <div style={{...styles.logo_title,marginLeft:12}}>TA的提问</div>
            <div style={{...styles.count_num}}>{this.state.count}</div>
          </div>
         }
        <div ref={(qaList)=>this.qaList = qaList} onTouchEnd={this._labelScroll.bind(this)} style={{width:devWidth-24,height:devHeight-37,overflow:'scroll', padding:'0 12px 10px 12px', backgroundColor:Common.Bg_White}}>
          {answerArry}
          {questionArry}
        </div>
        </div>
      </div>
    )
  }

  //问答
  _handleUserQaDone(re){
    if(re && re.result){
      if(this.type == 'answer') {
        this.setState({
          qa: re.result.answer,
          count: re.result.answer_count,
          loadLength: re.result.answer.length,
          loadMore: re.result.answer.length >= 15 ? true : false
        })
      } else if(this.type == 'question') {
        this.setState({
          qa: re.result.question,
          count: re.result.question_count,
          loadLength: re.result.question.length,
          loadMore: re.result.question.length >= 15 ? true : false
        })
      }
    }
  }

  _handleUserQaLoadMoreDone(re){
    if(re && re.result){
      this.setState({
        qa:re.result.type == 'answer' ? this.state.qa.concat(re.result.answer) : this.state.qa.concat(re.result.question),
        // loadMore:re.result.answer.length = 15 ? true : false,
      },()=>{
        if(re.result.type == 'answer') {
          this.setState({
            loadLength:re.result.type == 'answer' ? this.state.qa.length:this.state.qa.length,
            loadMore:re.result.answer.length == 15 ? true : false,
          })
        } else {
          this.setState({
            loadLength:re.result.type == 'answer' ? this.state.qa.length:this.state.qa.length,
            loadMore:re.result.question.length == 15 ? true : false,
          })
        }
      })
    }
  }

  _loadMore(){
    Dispatcher.dispatch({
      actionType: 'UserQa',
      id: this.userId,      //this.props.match.params.id
      source:'qa',
      skip:this.state.loadLength,
      limit:15,
      type:this.type,
      LoadMore: true,
    })
  }

  _labelScroll() {
    console.log("SSS", this.qaList.scrollHeight, this.qaList.scrollTop, document.documentElement.clientHeight, this.state.loadMore)
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
    height:15,
    lineHeight:'15px',
    fontSize:11,
    color:Common.Bg_White,
    padding:'0 10px',
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
    lineHeight:'18px',
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
    width:window.screen.width-24,
    marginTop:5,
    height:40,
    lineHeight:'20px'
  }


}


export default QaList;
