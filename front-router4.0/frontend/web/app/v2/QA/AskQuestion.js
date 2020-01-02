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


var times = 0;
function getStrleng(str,maxstrlen){
  var myLen = 0;
  var  i = 0;
  for(;(i<str.length)&&(myLen<=maxstrlen);i++){
    if(str.charCodeAt(i)>0&&str.charCodeAt(i)<128)
      myLen++;
    else
      myLen+=2;
  }
  return myLen;
}

function Trim(str)
 {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}


class AskQuestion extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      //是否匿名
      isAnonymous:false,
      answerTitle:'',
      answerContent:'',
      answerNum:0,
      contentNum: 0,
      //提问实时搜索返回数据集合
      questions:[],
      isShow:false,
      //输入框是否获取焦点
      focus:false,
      // boxTop:0,
      isUp:false,
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-提问');
    this.e_SearchQaTitle = EventCenter.on('SearchQaTitleDone',this._handleSearchQaTitleDone.bind(this))
  }

  componentWillUnmount() {
    this.e_SearchQaTitle.remove()
    window.onresize = ''
  }

  _handleSearchQaTitleDone(result){
    // console.log('result===',result);
    var {err,result} = result;
    if(err || !result){
      return;
    }

    this.setState({
      questions:result.details || [],
      isShow:(result.details && result.details.length > 0) ? true:false,
    })
  }

  //跳转到问题详情页
  _goDeail(questionId){
    this.props.history.push({pathname:`${__rootDir}/QaDetail/${questionId}`});
  }
  //关闭提问搜索弹框
  _close(){
    this.setState({
      isShow:false,
    })
  }

  render(){
    var _questions = this.state.questions.map((item,index)=>{
        return(
          <div key={index} style={styles.row} onClick={this._goDeail.bind(this,item.question_id)}>
            <div style={{overflow:'hidden'}}>
              <div style={{...styles.qa_title,...styles.LineClamp}}>{item.question_title}</div>
              <div style={{float:'right',fontSize:14,color:'#999'}}>{item.question_aNum}个回答</div>
            </div>
            {index == this.state.questions.length -1 ?
              null
              :
              <div style={{...styles.line}}></div>
            }
          </div>
        )
    })

    return(
      <div style={{...styles.container}} onTouchEnd={() => {this._labelScorll(this.qsList)}}>
        <div style={{...styles.reply_box}}>
          <div style={{clear:'both'}}></div>
          <div style={{position:'relative'}}>
            <textarea className="qaTittle" style={{...styles.content_input,color:'#333',fontSize:18,height:66}}
            placeholder="写下您的问题"
            value={this.state.answerTitle}
            onChange={this._check_answer.bind(this)}
            onKeyUp={this._check_answer.bind(this)}
            onFocus={this._onFocus.bind(this)}
            onBlur={this._onBlur.bind(this)}
            ref ={(contentInput)=>this.contentInput=contentInput}
            />
             <div style={{...styles.limit_text,borderBottom:'solid 1px #f3f3f3',paddingBottom:10,height:20}}>
                <span >{this.state.answerNum}/100</span>
             </div>
           </div>

          <div style={{...styles.resultBox, display:this.state.isShow ? 'block':'none'}}>
            <div style={{padding:'10px 14px',height:20, color:'#999',fontSize:14,overflow:'hidden'}}>
              <span>您的问题可能已经有答案</span>
              <span style={{float:'right',color:'#2196f3'}} onClick={this._close.bind(this)}>关闭</span>
            </div>
            <div style={{...styles.line,marginLeft:14,marginTop:0}}></div>
            <div style={styles.boxList}
            ref={(qsList)=>{this.qsList=qsList}}>
              {_questions}
            </div>
          </div>
          <div style={{...styles.btn_box,zIndex:3,bottom:0}}>
           {
              Trim(this.state.answerTitle) ?
              <div style={{...styles.btn_button,backgroundColor:Common.Activity_Text,color:Common.Bg_White}} disabled={false} onClick={this._nextStep.bind(this)}>下一步</div>
              :
              <div style={{...styles.btn_button,backgroundColor:'#E1E1E1'}} disabled={true}>下一步</div>
            }
          </div>

          <div>
            <textarea style={{...styles.content_input}}
            value={this.state.answerContent}
            onChange={this._content.bind(this)}
            placeholder="该问题是在什么背景和条件下产生的(选填)"
            onFocus={this._onFocus.bind(this)}
            onBlur={this._onBlur.bind(this)}
            ref={(content_input)=>this.content_input = content_input}
            />
          </div>
          <div style={styles.anonymous_box}>
           <div style={{...styles.limit_text}}>
              {this.state.contentNum}/1000
           </div>
          </div>
        </div>

        {/*<div style={{...styles.btn_box}}>
         {
            Trim(this.state.answerTitle) ?
              <Link to={{pathname: `${__rootDir}/QuesLabelSelection`, query: null, hash: null,
              state:{answerTitle: this.state.answerTitle,answerContent:this.state.answerContent, id:this.props.location.state ? this.props.location.state.id : '', type: this.props.location.state ? this.props.location.state.type : ''}}}>
                <div style={{...styles.btn_button,backgroundColor:Common.Activity_Text,color:Common.Bg_White}} disabled={false}>下一步</div>
              </Link>
            :
              <div style={{...styles.btn_button,backgroundColor:'#E1E1E1'}} disabled={true}>下一步</div>
          }
        </div>
        */}
      </div>

    )
  }

  _nextStep(){
    this.props.history.push(
      {pathname: `${__rootDir}/QuesLabelSelection`,
        state:{
           answerTitle: this.state.answerTitle,
           answerContent:this.state.answerContent,
           id:this.props.location.state ? this.props.location.state.id : '',
           type: this.props.location.state ? this.props.location.state.type : ''
          }
      })
  }

  _check_answer(e){
    var _keyWord = e.target.value || ''
    var strLength =0;
    //字符数最多为100个
    if(_keyWord.length>100){
      return;
    }

    if(Trim(_keyWord).length >= 2 ){
        strLength = _keyWord.length;
        if(times){
          clearTimeout(times);
          times = 0;
        }
        times = setTimeout(function(){
           Dispatcher.dispatch({
             actionType: 'SearchQaTitle',
             keyWord: _keyWord,
           })
         },1000)
      }
      else {
        strLength = _keyWord.length;
        this.setState({
          isShow:false
        })
      }
      this.setState({
        answerTitle:_keyWord,
        answerNum:strLength
      });
  }

  _content(e){
    var answerContent = e.target.value ||'';
    var maxstrLen = 0;
    if(answerContent.length >1000){
      return;
    }

    if(Trim(answerContent).length != 0 ){
      maxstrLen = answerContent.length;
    }
    this.setState({
      answerContent:answerContent,
      contentNum:maxstrLen,
    });
  }

  _onFocus(){
    this.setState({
      focus:true,
    })
  }

  _onBlur(){
    this.contentInput.blur();
    this.content_input.blur();
    this.setState({
      focus:false,
    })
  }

  //页面滚动让键盘收起，即让输入框失去焦点
  _labelScorll(){
    if (this.qsList.scrollTop > 0){
      this.contentInput.blur();
      this.content_input.blur();
      this.setState({
        focus:false,
      })
    }
  }

}

var styles ={
  container:{
    // position:'relative',
    height:devHeight,
    // backgroundColor:'#fff'
  },
  reply_box:{
    width:devWidth,
    backgroundColor:Common.Bg_White,
  },
  content_input: {
    width: devWidth-30,
    height:160,
    resize: 'none',
    border: 'none',
    padding: '15px',
    fontSize: 16,
    color:'#999',
    wordBreak: 'break-all',
  },
  limit_text:{
    color:'#a4a4a4',
    fontSize:Fnt_Normal,
    textAlign:'right',
    paddingRight:15,
    height:35,
  },
  anonymous_box:{
    overflow:'hidden',
    height:35,
    lineHeight:'35px',
    borderBottom:'solid 1px #f3f3f3',
  },
  btn_box:{
    paddingTop:10,
    paddingBottom:10,
    borderBottom:'solid 1px #E5E5E5',
    backgroundColor:Common.Bg_White,
    width:devWidth,
    position:'fixed',
    zIndex:1,
    left:0,
    bottom:devHeight-254
  },
  btn_button:{
    width:devWidth-32,
    marginLeft:16,
    height:45,
    lineHeight:'45px',
    color:Common.Bg_White,
    fontSize:Fnt_Large,
    textAlign:'center',
    border:'none',
    borderRadius:4,
  },
  resultBox:{
    width:window.screen.width,
    height:window.innerHeight - 126,
    paddingBottom:15,
    backgroundColor:'#f7f7f7',
    border:'solid 1px #E7E7E7',
    position:'absolute',
    left:0,
    top:126,
    zIndex:2,
  },
  boxList:{
    width:window.screen.width - 24,
    height:window.innerHeight - 240,
    marginLeft:14,
    overflowY:'auto'
  },
  row:{
    width:window.screen.width - 30,
    borderBottom:'solid 1px ddd',
    padding:'10px 0',
    lineHeight:'28px',
    fontSize:16,
    color:'#333',
    overflow:'hidden'
  },
  qa_title:{
    float:'left',
    fontSize:16,
    color:'#333',
    lineHeight:'20px',
    width:window.screen.width - 108,
  },
  line:{
    width:window.screen.width - 28,
    borderBottom:'solid 1px #ddd',
    height:0,
    marginTop:15,
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

export default AskQuestion;
