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

var skip = 0;
var countdown;
class TopicCenter extends React.Component {

  constructor(props) {
    super(props);
    this.isAttentionList =[]
    this.wx_config_share_home = {
        title: '话题中心',
        desc: '',
        link: document.location.href + '',
        imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
        type: 'link'
    };
    this.state={
      //是否关注
      isAttention:false,
      topicCenterList:[],
      isAttentionList:this.isAttentionList,
      //弹框是否显示
      display:'none',
      //弹框提示信息
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
      lastFoucuIndex:null,
      loadmore:true,
      isLoading:true,
    }
  }
  _handletopicCenterDone(re){
    var result = re.result || []
    for (var i = 0; i < result.length; i++) {//isFocus
      if (result[i].isFocus) {
        this.isAttentionList[i] = true

      }else {
        this.isAttentionList[i] = false
      }
      // result[i]
    }
    skip = result.length
    this.setState({
      topicCenterList: result,
      isAttentionList:this.isAttentionList,
      loadmore:result.length >= 15 ? true:false,
      isLoading:false,
    })
  }
  _handletopicCenterLoadMoreDone(re){

    var result = re.result || []
    var leng = this.isAttentionList.length
    for (var i = 0; i < result.length; i++) {//循环输入是否关注的点
      if (result[i].isFocus) {
        this.isAttentionList[leng+i] = true
      }else {
        this.isAttentionList[leng+i]= false
      }
    }
    this.setState({
      topicCenterList: this.state.topicCenterList.concat(result),
      isAttentionList:this.isAttentionList,
      loadmore:result.length >= 15 ? true:false,
      isLoading:false,
    },()=>{
      skip = this.state.topicCenterList.length
    })
  }
  _labelScorll(re){

    if((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
      if (this.state.topicCenterList.length < 15) {
        return
      }
      Dispatcher.dispatch({
        actionType: 'topicCenter',
        user_id: this.props.location.state ? this.props.location.state.user_id : '',
        skip: skip,
        limit: 15,
        LoadMore: true,
        taskId: null
      })
    }
  }
  isFocusTopicCenter(re,idx){
      Dispatcher.dispatch({
        actionType: 'focusTopic',
        topic_id: re
      })
      this.isAttentionList[idx]= !this.isAttentionList[idx]
      this.setState({
        isAttentionList: this.isAttentionList,
        lastFoucuIndex:idx,
      })
  }
  /**
   * 选择话题
   * @author markwang
  * version 2019-04-04T13:56:08+0800
   * @blog https://www.qdfuns.com/u/26090.html
   * @example no example
   * @modification list 2019-04-04 本月需求：去掉关注话题5个数量限制
   */
  handlefocusTopicDone(re){
    if(re.err){
      var idx = this.state.lastFoucuIndex
      this.isAttentionList[idx]= !this.isAttentionList[idx]
      this.setState({
          display:'block',
          // alert_title:'最多只能关注5个话题',
          alert_title:'操作失败',
          alert_icon:failure_icon,
          icon_width:failure_width,
          icon_height:failure_height,
          isAttentionList: this.isAttentionList
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
    else {
      this.setState({
        lastFoucuIndex:null
      })
    }
  }
  componentWillMount() {

    Dispatcher.dispatch({
      actionType: 'topicCenter',
      question_id:this.props.location.state ? this.props.location.state.question_id : '',
      user_id:this.props.location.state ? this.props.location.state.user_id : '',
      source:'qa',
      skip:0,
      limit:15,
      taskId: null,
    })
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-话题中心');
    this._gettopicCenterDone = EventCenter.on("topicCenterDone",this._handletopicCenterDone.bind(this))
    this._gettopicCenterLoadMoreDone = EventCenter.on("topicCenterLoadMoreDone",this._handletopicCenterLoadMoreDone.bind(this))
    this._getfocusTopicDone =EventCenter.on("focusTopicDone",this.handlefocusTopicDone.bind(this))
  }

  componentWillUnmount() {
    this._gettopicCenterDone.remove()
    this._gettopicCenterLoadMoreDone.remove()
    this._getfocusTopicDone.remove()
    clearInterval(countdown)
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

    var topicCenterList = this.state.topicCenterList.map((item,index)=>{
      return(
        <div key={index}>
            <div style={{height:100,overflow:'hidden'}}>
              <Link to={`${__rootDir}/TopicDetail/${item.id}`}>
                <img src={item.icon!=='' ? item.icon : Dm.getUrl_img('/img/v2/icons/topic_default@2x.png')} width={60} height={60} style={{float:'left',marginTop:20,}}/>
              </Link>
              <div style={{marginLeft:8,float:'left',}}>
              <Link to={`${__rootDir}/TopicDetail/${item.id}`}>
                <div style={{...styles.LineClamp,...styles.title,}}>{item.name}</div>
                <div style={{float:'left',width:(window.screen.width-178)/2}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{float:'left',marginTop:5}}/>
                  <span style={{...styles.ques_text}}>
                    {item.topic_question_num || 0}个问题
                  </span>
                </div>
              </Link>
                <div style={{float:'left'}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} width={12} height={11} style={{float:'left',marginTop:6,}}/>
                  <div style={{...styles.ques_text}}>
                    {item.topic_user_num}人关注
                  </div>
                </div>
              </div>
              {
                this.state.isAttentionList[index] ?
                <div onClick={this.isFocusTopicCenter.bind(this,item.id,index)} style={{...styles.btn_attention,backgroundColor:'#d1d1d1'}}>已关注</div>
                :
                <div onClick={this.isFocusTopicCenter.bind(this,item.id,index)} style={{...styles.btn_attention}}><span style={{color:Common.Bg_White,fontSize:20}}>+</span> 关注</div>
              }
            </div>
            <div style={{...styles.line,}}></div>

        </div>
      )
    })
    return(
      <div
        ref={(lessonList) => this.lessonList = lessonList}
        onTouchEnd={() => {this._labelScorll(this.lessonList)}}
        style={{...styles.container}}>
        <FullLoading isShow={this.state.isLoading}/>
        {
          this.state.topicCenterList.length >0 ?
          topicCenterList
          :
          listNull
        }
        <div style={{display:this.state.loadmore ? 'none':'block',height:30,lineHeight:'30px',textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>


        {/*弹框*/}
        <div style={{...Common.alertDiv,display:this.state.display}}>
          <div style={{marginBottom:14,paddingTop:15,height:30,}}>
            <img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
           </div>
           <span style={{color:Common.BG_White}}>{this.state.alert_title}</span>
        </div>
      </div>

    )
  }
}

var styles ={
  container:{
    paddingLeft:12,
    paddingRight:12,
    backgroundColor:Common.Bg_White,
    height:window.innerHeight,
    // width:window.screen.width,
    overflowY:'scroll',
    overflowX:'hidden'
  },
  title:{
    color:'#000',
    fontSize:14,
    marginTop:30,
    width:devWidth - 172,
    height:20,
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
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
  }

}


export default TopicCenter;
