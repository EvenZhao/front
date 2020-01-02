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
import ProductLessonDiv from '../components/ProductLessonDiv';
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import LiveLessonDiv from '../components/LiveLessonDiv';
import OfflineLessonDiv from '../components/OfflineLessonDiv';
import FullLoading from '../components/FullLoading';
import Loading from '../components/Loading';

var skip=0;
var limit = 15;
class MyAttention extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      checkNum:0,
      count:{},
      liveList:[],
      onlineList:[],
      offlineList:[],
      productList:[],
      question:[],
      teacherList:[],
      focusTeacherList:[],
      loadmore: true,
      isLoading:true,
      isShow: true,
      length: 0,
      reservedLives:[],
      vipPriceFlag:null
    }
    this.focusTeacherList = [];
    this.data = ['课程','问答','讲师'];
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-我的关注');
    //type 类型 lesson: 课程 / question: 问答 / teacher: 讲师
    Dispatcher.dispatch({
      actionType:'MyFocus',
      type:'lesson',
      skip:0,
      limit:15,
    });
    this.e_MyFocus = EventCenter.on('MyFocusDone',this._handleMyFocusDone.bind(this));
    this.e_focusTeacher = EventCenter.on('focusTeacherDone',this._handlefocusTeacher.bind(this));
    this.e_MyFocusLoadMore = EventCenter.on('UserQaLoadMoreDone',this._handleMyFocusLoadMoreDone.bind(this));
  }

  componentWillUnmount() {
    this.e_MyFocus.remove()
    this.e_focusTeacher.remove()
    this.e_MyFocusLoadMore.remove()
  }

  ChooseTab(index){
    // skip = 0
    this.setState({
      checkNum:index,
      isShow: true,
      length: 0,
      teacherList:[]
    });
    if(index == 0){
      Dispatcher.dispatch({
        actionType:'MyFocus',
        type:'lesson',
        skip:0,
        limit:15,
      });
    }
    else if (index == 1) {
      Dispatcher.dispatch({
        actionType:'MyFocus',
        type:'question',
        skip:0,
        limit:15,
      });
    }
    else if (index == 2) {
      Dispatcher.dispatch({
        actionType:'MyFocus',
        type:'teacher',
        skip:0,
        limit:15,
      });
    }
  }

  focusTeacher(teacher_id,idx){//关注或者取消关注事件
    Dispatcher.dispatch({
      actionType: 'focusTeacher',
      teacher_id: teacher_id,
    })

    this.focusTeacherList[idx]= !this.focusTeacherList[idx]
    this.setState({
      focusTeacherList: this.focusTeacherList
    })
  }

  _handlefocusTeacher(re){

  }

  _handleMyFocusDone(re){
    console.log('_handleMyFocusDone:',re)
    if(re && re.result){
      this.setState({
        count:this.state.checkNum == 0 ? re.result.count : this.state.count,
        liveList:this.state.checkNum == 0 ? re.result.live_info_list || [] : this.state.liveList,
        onlineList:this.state.checkNum == 0 ? re.result.online_info_list : [],
        offlineList:this.state.checkNum == 0 ? re.result.offline_info_list || [] : this.state.offlineList,
        productList:this.state.checkNum == 0 ? re.result.product_list || [] : this.state.productList,
        question:this.state.checkNum == 1 ? re.result.question || [] : this.state.question,
        teacherList:this.state.checkNum == 2 ? this.state.teacherList.concat(re.result)  || [] : this.state.teacherList,
        isLoading:false,
        isShow: false,
        reservedLives:re.reservedLives || [],
        vipPriceFlag:this.state.checkNum == 0 && re.user && re.user.vipPriceFlag ? re.user.vipPriceFlag : null,
      },()=>{
        if (this.state.checkNum == 1) {
          skip = re.result.question.length
          this.setState({
            loadmore: skip  >= 15 ? false : true
          })
        }else if (this.state.checkNum == 2) {
          skip = this.state.teacherList.length
        }
      })
      if(this.state.checkNum == 2){
        var result = this.state.teacherList;
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
          loadmore:result.length >= 15 ? false : true,
          isLoading:false,
          isShow: false
        })
      }
    }
  }

  _handleMyFocusLoadMoreDone(re){
    if(re && re.result){
      this.setState({
        count:this.state.checkNum == 0 ? re.result.count : this.state.count,
        liveList:this.state.checkNum == 0 ? re.result.live_info_list || [] : this.state.liveList,
        onlineList:this.state.checkNum == 0 ? re.result.online_info_list || [] : this.state.onlineList,
        offlineList:this.state.checkNum == 0 ? re.result.offline_info_list || [] : this.state.offlineList,
        productList:this.state.checkNum == 0 ? re.result.product_list || [] : this.state.productList,
        question:this.state.checkNum == 1 ? this.state.question.concat(re.result.question) || [] : this.state.question,
        teacherList:this.state.checkNum == 2 ? this.state.teacherList.concat(re.result) || [] : this.state.teacherList,
        isLoading:false,
        isShow: false
      },()=>{
        if (this.state.checkNum == 1) {
          skip = re.result.question.length
          this.setState({
            loadmore: skip  >= 15 ? false : true
          })
        }
        if(this.state.checkNum == 2){

          skip = re.result.length
          var result = this.state.teacherList;
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
            loadmore:re.result.length >= 15 ? false : true,
            isLoading:false,
            isShow: false
          },()=>{
          })
        }
      })


    }
  }

_labelScorll(re){
  if((this.attentionList.scrollHeight - this.attentionList.scrollTop - 220) <  document.documentElement.clientHeight) {
      this.setState({
        isShow: false
      })
     if(this.state.checkNum == 0){
       if((this.state.liveList.length + this.state.onlineList.length + this.state.offlineList.length + this.state.productList.length) < 15){
         return;
       }
       Dispatcher.dispatch({
         actionType:'MyFocus',
         type:'lesson',
         skip:skip,
         limit:15,
         LoadMore:true,
       });
     }
     else if (this.state.checkNum == 1) {
       if(!skip || skip < 15){
         return;
       }
       Dispatcher.dispatch({
         actionType:'MyFocus',
         type:'question',
         skip:skip,
         limit:15,
         LoadMore:true,
       });
     }
     else if (this.state.checkNum == 2) {
       if (!skip || skip < 15) {
         return
       }
       Dispatcher.dispatch({
         actionType:'MyFocus',
         type:'teacher',
         skip:skip,
         limit:15,
         LoadMore:true,
       });
     }
    }
}


  render(){
    var listNull = (
      <div style={{textAlign:'center',paddingTop:70,display: this.state.isShow ? 'none' : 'block'}}>
        <div>
          <img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
        </div>
        <div style={{marginTop:51}}>
          <span style={{fontSize:13,color:'#333333'}}>暂无关注哦，快去关注吧~</span>
        </div>
      </div>
    )
    let screenWidth = window.screen.width;
    let onlineProps = {
      data: this.state.onlineList,
      history: this.props.history,
    }
    let liveProps = {
      data: this.state.liveList
    }
    let offlineProps = {
      data: this.state.offlineList
    }
    let productProps = {
      data: this.state.productList,
      vipPriceFlag:this.state.vipPriceFlag,
    }

    var question = this.state.question.map((item,index)=>{
      var is_teacher = 0;//1:讲师 0:个人
      if(item.answer && item.answer.user){
        is_teacher = item.answer.user.is_teacher;
      }

      return(
        <div key={index}>
          <Link to={ `${__rootDir}/QaDetail/${item.id}`}>
            <div style={{...styles.LineClamp,width:window.screen.width-24, marginTop:15,fontSize:Fnt_Medium,color:Common.Black,}}>{item.title || ''}</div>
          </Link>
          {
            item.answer ?
            <div>
              <div style={{float:'left',width:30,height:30,position:'relative',zIndex:1,marginTop:13,}}>
                <img src={item.answer && item.answer.user ? item.answer.user.photo : Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={30} height={30} style={{borderRadius:15,}}/>
                <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.small_tag,display:is_teacher ==1 ? 'block':'none'}}/>
              </div>
              <div style={{marginLeft:8,marginTop:16,float:'left',marginBottom:5,}}>
                <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{item.answer && item.answer.user ? item.answer.user.nick_name : ''}</span>
                <span style={{color:Common.Gray,fontSize:Fnt_Normal,marginLeft:10,}}>{item.answer && item.answer.user ? item.answer.user.title:''}</span>
              </div>
              <div style={Common.clear}></div>
              { item.answer ?
                <div style={{...styles.LineClamp,...styles.content}} dangerouslySetInnerHTML={{__html:item.answer.content}}></div>
                :
                null
              }
            </div>
            :
            <div>
              <p style={{color: '#999', fontSize: 14, marginTop: 10}}>还没有答案，快来做第一个回答者吧~</p>
            </div>
          }

          <div style={{...styles.line,display:this.state.question.length-1 == index ? 'none':'block'}}></div>
        </div>
      )
    })

    var teacherList = this.state.teacherList.map((item,index)=>{
      return(
        <div key={index}>
          <div style={{height:115,position:'relative'}}>
          <Link to={`${__rootDir}/LecturerHomePage/${item.id}`}>
            <div style={{height:60,overflow:'hidden',marginTop:15,}}>
              <div style={{position:'relative',width:60,height:60, float:'left',}}>
                <img src={item.photo} width={60} height={60} style={{borderRadius:'30px',}}/>
                <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.big_tag,}}/>
              </div>
              <div style={{marginLeft:8,float:'left',}}>
                <div style={{...styles.title}}>{item.nick_name}</div>
                <div style={{...styles.LineClamp,...styles.position_text}}>{item.company} {item.position}</div>
              </div>

            </div>
            <div style={{marginTop:10,}}>
              <div style={{width:(window.screen.width-24)/3,float:'left',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{float:'left',marginTop:10,}}/>
                <span style={{fontSize:11,color:'#2A2A2A',marginLeft:5,float:'left',marginTop:6,}}>{item.answerNum}个问题</span>
              </div>
              <div style={{width:(window.screen.width-24)/3,float:'left',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/icon_sub@2x.png')} width={13} height={13} style={{float:'left',marginTop:10,}}/>
                <span style={{fontSize:11,color:'#2A2A2A',marginLeft:5,float:'left',marginTop:6,}}>{item.lessonNum}个课程</span>
              </div>
              <div style={{width:(window.screen.width-24)/3,float:'left',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/expression@2x.png')} width={12} height={12} style={{float:'left',marginTop:10,}}/>
                <span style={{fontSize:11,color:'#2A2A2A',marginLeft:5,float:'left',marginTop:6,}}>{item.satisfaction}%满意度</span>
              </div>
            </div>
            </Link>
            <div style={{position:'absolute',zIndex:10,right:12,top:0,}}>
            {
              this.state.focusTeacherList[index] ?
              <div onClick={this.focusTeacher.bind(this,item.id,index)} style={{...styles.btn_attention,backgroundColor:'#d1d1d1'}} >已关注</div>
              :
              <div onClick={this.focusTeacher.bind(this,item.id,index)} style={{...styles.btn_attention}} disabled={false}><span style={{color:Common.Bg_White,fontSize:20}}>+</span> 关注</div>
             }
            </div>
          </div>
          <div style={{...styles.line,}}></div>
        </div>
      )
    })
    return(
      <div style={{...styles.container}} ref={(attentionList) => this.attentionList = attentionList}
      onTouchEnd={() => {this._labelScorll(this.attentionList)}}>
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
                   padding:'0 10px',
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
        <div>
          <div style={{display:this.state.checkNum == 0? 'block':'none',height:window.innerHeight-56,overflowY:'auto'}}>

          {this.state.count && this.state.count.onlineCount >0  || this.state.count.liveCount > 0 || this.state.count.offlineCount > 0 || this.state.count.productCount > 0?
          <div>
          {
            this.state.count && this.state.count.onlineCount >0 ?
            <div>
               <Link to={{pathname: `${__rootDir}/teacher/lesson/list/online`, query: null, hash: null, state: {id: this.props.match.params.id}}}>
                <div style={{padding: '12px 0px 0px', width: screenWidth, height: 26, display: this.state.count.onlineCount > 0 ? 'block' : 'none'}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/online@2x.png')} style={{...styles.logo, width: 22,height:16}}/>
                  <span style={{...styles.logo_title}}>视频课</span>
                  <div style={{...styles.count_num}}>{this.state.count.onlineCount}</div>
                  <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.count.onlineCount > 2 ? 'block' : 'none'}}/>
                </div>
              </Link>
              <OnlineLessonDiv {...onlineProps}/>
              <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.count.onlineCount > 2? 'block' : 'none'}}></hr>
            </div>
            :
            null
          }

           {
             this.state.count && this.state.count.liveCount > 0 ?
             <div>
               <Link to={{pathname: `${__rootDir}/teacher/lesson/list/live`, query: null, hash: null, state: {id: this.props.match.params.id}}}>
                 <div style={{padding: '12px 0px 0px', width: screenWidth, display: this.state.count !== null && this.state.count.liveCount > 0 ? 'block' : 'none'}}>
                   <img src={Dm.getUrl_img('/img/v2/icons/live@2x.png')} style={{...styles.logo}}/>
                   <span style={{...styles.logo_title}}>直播课</span>
                   <div style={{...styles.count_num}}>{this.state.count !== null && this.state.count.liveCount}</div>
                   <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display:this.state.count !== null && this.state.count.liveCount > 2 ? 'block' : 'none'}}/>
                 </div>
               </Link>
               <LiveLessonDiv {...liveProps} reservedLives={this.state.reservedLives}/>
               <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display:this.state.count !== null && this.state.count.liveCount > 0 ? 'block' : 'none'}}></hr>
             </div>
             :
             null
           }
         {
           this.state.count && this.state.count.offlineCount > 0 ?
           <div>
             <Link to={{pathname: `${__rootDir}/teacher/lesson/list/offline`, query: null, hash: null, state: {id: this.props.match.params.id}}}>
               <div style={{padding: '12px 0px 0px', width: screenWidth, height: 26, display: this.state.count.offlineCount > 0 ? 'block' : 'none'}}>
                 <img src={Dm.getUrl_img('/img/v2/icons/offline@2x.png')} style={{...styles.logo, width: 23, height: 23}}/>
                 <span style={{...styles.logo_title}}>线下课</span>
                 <div style={{...styles.count_num}}>{this.state.count.offlineCount}</div>
                 <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.count.offlineCount > 2 ? 'block' : 'none'}}/>
               </div>
             </Link>
             <OfflineLessonDiv {...offlineProps}/>
             <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.count.offlineCount > 0 ? 'block' : 'none'}}></hr>
           </div>
           :
           null
         }
         {
           this.state.count  && this.state.count.productCount > 0 ?
           <div>
             <Link to={{pathname: `${__rootDir}/teacher/lesson/list/product`, query: null, hash: null, state: {id: this.props.match.params.id}}}>
               <div style={{padding: '12px 0px 0px', width: screenWidth, height: 26, display: this.state.count.productCount > 0 ? 'block' : 'none'}}>
                 <img src={Dm.getUrl_img('/img/v2/icons/product@2x.png')} style={{...styles.logo, width: 23, height: 23}}/>
                 <span style={{...styles.logo_title}}>专题课</span>
                 <div style={{...styles.count_num}}>{this.state.count.productCount}</div>
                 <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.count.productCount > 2 ? 'block' : 'none'}}/>
               </div>
             </Link>
             <ProductLessonDiv {...productProps}/>
             <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.count.productCount > 0 ? 'block' : 'none'}}></hr>
           </div>
           :
           null
         }
        </div>
        :
        listNull
        }
        </div>

          {/**问答*/}
          <div style={{display:this.state.checkNum == 1? 'block':'none',height:window.innerHeight-56,overflowY:'auto'}}>
            <div style={{width:window.screen.width-24,paddingLeft:12,}}>
              {
                this.state.question.length > 0 ?
                <div>
                  {question }
                  <div style={{display:this.state.loadmore ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
                </div>
                :
                listNull
              }
            </div>
          </div>
          {/**讲师*/}
          <div style={{display:this.state.checkNum == 2? 'block':'none',height:window.innerHeight-56,overflowY:'auto'}}>
            <div style={{width:window.screen.width-24,paddingLeft:12,}}>
              {this.state.teacherList.length > 0 ? teacherList : listNull}
              <div style={{display:this.state.loadmore ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
            </div>
          </div>
        </div>
        <Loading isShow={this.state.isShow}/>
      </div>
    )
  }
}

var styles ={
  container:{
    backgroundColor:Common.Bg_White,
    height:window.innerHeight,
  },
  line:{
    width:devWidth-24,
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
    padding:'0 10px',
    width:devWidth,
    height:45,
    lineHeight:'45px',
  },
  tab:{
    width:window.screen.width/3,
    height:45,
    lineHeight:'45px',
    textAlign:'center',
    float:'left',
  },
  title:{
    fontSize:Fnt_Normal,
    color:Common.Black,
  },
  position_text:{
    color:Common.Black,
    fontSize:Fnt_Small,
    height:36,
    lineHeight:'18px',
    width:devWidth - 185,
  },
  bar:{
    width:120,
    height:5,
    backgroundColor:'#E5E5E5',
    borderRadius:8,
    position:'relative',
    zIndex:1,
    float:'left',
    marginTop:8,
    marginLeft:5,
  },
  blue_bar:{
    width:60,
    height:5,
    backgroundColor:'#64BBFF',
    borderRadius:8,
    position:'absolute',
    left:0,
    top:0,
    zIndex:2,
  },
  logo:{
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
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  content:{
    fontSize:Fnt_Normal,
    color:Common.Black,
    width:window.screen.width-24,
    marginTop:5,
    height:40,
    lineHeight:'20px'
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
    marginTop:15,
    float:'right',
    border:'none',
  },
  small_tag:{
    position:'absolute',
    zIndex:10,
    bottom:-1,
    right:2,
  },
  big_tag:{
    position:'absolute',
    zIndex:10,
    bottom:4,
    right:2,
  },
}


export default MyAttention;
