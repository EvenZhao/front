import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import {dm} from '../util/DmURL';
import Common from '../Common';
import BlackAlert from '../components/BlackAlert';
import funcs from '../util/funcs'


class AnswerQuestion extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      //是否匿名
      isAnonymous: false,
      answer: this.props.location.state ? this.props.location.state.answerContent : '',
      answerContent: this.props.location.state ? this.props.location.state.answerContent : '',
      isShow: false,  //是否显示黑色弹框
      alertWord: ''   //黑色弹框文案
    }
  }

  componentWillMount() {
    // console.log('componentWillMount',this.props)
  }
  _handleGetAnswerRes(re){
    if(re.result.result == true) {
      this.props.history.go(-1)
    }else {
      this.setState({
        isShow: true,
        alertWord: re.result.err
      }, () => {
				clearTimeout(this.t)
				this.t = setTimeout(() => {
					this.setState({
						isShow: false
					})
				}, 2000)
			})
    }
  }
  componentDidMount() {
    EventCenter.emit("SET_TITLE",this.props.location.state.title || '');
    if (this.props.location.state && this.props.location.state.answerContent) {
      this.setState({
        isAnonymous: true,
      })
    }
    this._getAnswerRes = EventCenter.on('AddAnswerDone', this._handleGetAnswerRes.bind(this))

  }

  componentWillUnmount() {
    this._getAnswerRes.remove()
  }
  removeHtmlTag(str) {
    if(str) {
      var str1 = str.replace(/<[^>]+>/g,"");
      var str2 = str1.replace(/&nbsp;/ig,'');
    }
    return str2;
  }
  _button() {
    Dispatcher.dispatch({
      actionType: 'AddAnswer',
      question_id: this.props.location.state.question_id,
      content: this.state.answer,
      anonymous: this.state.isAnonymous ? 1 : 0
    })
  }
  render(){
    var answer = this.removeHtmlTag(this.state.answer || '')
    return(
      <div style={{...styles.container}}>
        <BlackAlert isShow={this.state.isShow} word={this.state.alertWord}/>
        <div style={{...styles.reply_box}}>
        {/*
          <div style={{...styles.LineClamp,marginLeft:62,fontSize:Fnt_Large,color:Common.Light_Black,}}>
            随着经济的快速发展，企业的票据业务金额正在？随着经济的快速
          </div>
        */}
          <div style={{clear:'both'}}></div>
          <div>
            <textarea style={{...styles.content_input}} value={answer} onChange={this._check_answer.bind(this)} placeholder="请输入您的回答"/>
          </div>
          <div style={styles.anonymous_box}>
             <div style={{float:'left',color:'#a4a4a4',marginLeft:15,display:this.state.answerContent ? 'none':'block'}}>
               匿名
              </div>
              <div style={{float:'left',marginLeft:10,marginLeft:15,marginTop:7,display:this.state.answerContent ? 'none':'block'}} onClick={this.Is_anonymous.bind(this)}>
                {
                  this.state.isAnonymous?
                  <img src={Dm.getUrl_img('/img/v2/icons/is_anonymous@2x.png')} width={41} height={24} />
                  :
                  <img src={Dm.getUrl_img('/img/v2/icons/not_anonymous@2x.png')} width={41} height={24} />
                 }
               </div>
               <div style={{...styles.limit_text}}>
                  1000
                </div>
          </div>
          <div style={{...styles.btn_box}}>
           {
              this.state.answer ?
              <div onClick={this._button.bind(this)} style={{...styles.btn_button,backgroundColor:Common.Activity_Text,color:Common.Bg_White}} disabled={false}>提交</div>
              :
              <div style={{...styles.btn_button}} disabled={true}>提交</div>
            }
        </div>
        </div>
      </div>

    )
  }

  _check_answer(e){
    this.setState({
      answer:e.target.value,
    })
  }

  Is_anonymous(){
    if(this.state.isAnonymous){
      this.setState({
        isAnonymous:false,
      })
    }
    else {
      this.setState({
        isAnonymous:true,
      })
    }
  }
}

var styles ={
  container:{
    backgroundColor:Common.Bg_White,
    height:window.innerHeight,
  },
  reply_box:{
    width:window.screen.width,
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    height:48,
    lineHeight:'48px',
    width:window.screen.width-124,
  },
  anonymous_box:{
    overflow:'hidden',
    height:35,
    lineHeight:'35px',
    marginTop:10,
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
    width: window.screen.width-30,
    resize: 'none',
    border: 'none',
    padding: '15px 15px 225px 15px',
    fontSize: 14,
    wordBreak: 'break-all',
  },
  limit_text:{
    color:'#a4a4a4',
    fontSize:Fnt_Normal,
    textAlign:'right',
    paddingRight:15,
    height:35,
    borderTopWidth:1,
    borderTopColor:'#e5e5e5',
    borderTopStyle:'solid',
  },
  btn_box:{
    paddingTop:10,
    paddingBottom:10,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#E5E5E5'
  },
  btn_button:{
    width:window.screen.width-32,
    marginLeft:16,
    height:45,
    lineHeight:'45px',
    color:Common.Bg_White,
    fontSize:Fnt_Large,
    textAlign:'center',
    border:'none',
    borderRadius:4,
    backgroundColor:'#e1e1e1',
  },


}


export default AnswerQuestion;
