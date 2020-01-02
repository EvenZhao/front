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

var notReview_skip = 0;
var audited_skip = 0;
class PendingReview extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      tabIndex:0,
      //待审核
      NotReviewLessonCount:0,
      NotReviewlessonList:[],
      loadMore_notReview:true,
      //已审核
      AuditedLessonCount:0,
      AuditedLessonList:[],
      loadMore_Audited:true,
      isLoading:true,
      area:'',//权益地区
      point:null,//剩余点数
      num:null,//剩余次数
      freeNum:null,//免费参课人数
    }
    this.data = ['报名审核','审核记录',];
  }

  componentWillMount() {
    Dispatcher.dispatch({
      actionType:'AuditLessonList',
      status:0,//待审核：0，已审核：1
      skip:0,
      limit:15,
    })
    Dispatcher.dispatch({
      actionType:'AuditLessonList',
      status:1,//待审核：0，已审核：1
      skip:0,
      limit:15,
    })
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-审核');
    this.e_AuditLessonList = EventCenter.on('AuditLessonListDone',this._handleAuditLessonList.bind(this));
    this.e_AuditLessonListReview = EventCenter.on('AuditLessonListReviewDone',this._handleAuditLessonListReview.bind(this));
    this.e_NotReviewLessonLoadMore = EventCenter.on('NotReviewLessonLoadMoreDone',this._handleNotReviewLessonLoadMore.bind(this));
    this.e_AuditLessonLoadMore = EventCenter.on('AuditLessonLoadMoreDone',this._handleAuditLessonLoadMore.bind(this));
  }

  componentWillUnmount() {
    this.e_AuditLessonList.remove()
    this.e_AuditLessonListReview.remove()
    this.e_NotReviewLessonLoadMore.remove();
    this.e_AuditLessonLoadMore.remove()
  }

  _changeTab(index){
    this.setState({
      tabIndex:index,
    })
  }

  //待审核
  _handleAuditLessonList(re){
    console.log('re----',re);
    if(re.err){
      return;
    }
    if(re.result){
      var result = re.result;
      notReview_skip = result.lessonList.length;
      this.setState({
        NotReviewLessonCount:result.lessonCount,
        NotReviewlessonList:result.lessonList || [],
        loadMore_notReview:result.lessonList.length >= 15 ? true:false,
        isLoading:false,
        area:result.cityName || '',
        point:result.point || null,
        num:result.num || null,
        freeNum:result.freeNum || 0,
      })
    }
  }
  //待审核加载更多
  _handleNotReviewLessonLoadMore(re){
    if(re.result){
      var result = re.result;
      this.state({
        NotReviewlessonList:this.state.NotReviewlessonList.concat(result.lessonList),
        loadMore_notReview:result.lessonList.length >= 15 ? true:false,
        isLoading:false,
      },()=>{
        notReview_skip = this.state.NotReviewlessonList.length;
      })
    }
  }

  //已审核
  _handleAuditLessonListReview(re){
    console.log('--Review--',re);
    if(re.err){
      return;
    }
    if(re.result){
      var result = re.result;
      audited_skip = result.lessonList.length;
      this.setState({
        AuditedLessonCount:result.lessonCount,
        AuditedLessonList:result.lessonList || [],
        loadMore_Audited:result.lessonList.length > 15 ? true:false,
        isLoading:false,
        area:result.cityName || '',
        point:result.point || null,
        num:result.num || null,
        freeNum:result.freeNum || 0,
      })
    }
  }
  //已审核加载更多
  _handleAuditLessonLoadMore(re){
    if(re.result){
      var result = re.result;
      this.setState({
        AuditedLessonList:this.state.AuditedLessonList.concat(result.lessonList),
        loadMore_Audited:result.lessonList.length > 15 ? true:false,
        isLoading:false,
      },()=>{
        audited_skip = this.state.AuditedLessonList.length;
      })
    }
  }

  //加载更多
  _labelScroll(){
    if((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  devHeight) {
      if (this.state.NotReviewlessonList.length < 15) {
        return
      }

      if(this.state.AuditedLessonList.length < 15){
        return
      }
      if(this.state.tabIndex == 0){
        Dispatcher.dispatch({
          actionType:'AuditLessonList',
          status:0,//待审核：0，已审核：1
          skip:notReview_skip,
          limit:15,
          LoadMore_notReview:true,
        })
      }else {
        Dispatcher.dispatch({
          actionType:'AuditLessonList',
          status:1,//待审核：0，已审核：1
          skip:audited_skip,
          limit:15,
          LoadMore_Audited:true,
        })
      }
    }
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

    var tab = this.data.map((item,index)=>{
      var color = Common.Light_Black;
      var borderColor = '';
      if(this.state.tabIndex === index){
        color = Common.Activity_Text;
        borderColor = 'solid 1px #2196F3';
      }
      return(
        <div style={{...styles.tab_con}} key={index}>
          <div style={{...styles.tab_text,borderBottom:borderColor,color:color}}  onClick={this._changeTab.bind(this,index)}>
            {item}({index == 0 ? this.state.NotReviewLessonCount : this.state.AuditedLessonCount})
          </div>
        </div>
      )
    })

    //待审核列表
    var notReviewList = this.state.NotReviewlessonList.map((item,index)=>{
      return(
        <Link to={`${__rootDir}/PendingReviewDetail/${item.id}`} key={index}>
          <div style={styles.rev_listbox}>
            <img src={Dm.getUrl_img('/img/v2/icons/review_course@2x.png')} width="13" height="13" style={{marginTop:3}}/>
            <div style={styles.rev_con}>
              <div style={styles.title}>{item.title}</div>
              <div style={styles.con_text}>时间：{item.isSameDay ? new Date(item.start_time).format("yyyy-MM-dd"):new Date(item.start_time).format("yyyy-MM-dd") +" ~ "+ new Date(item.end_time).format("MM-dd")}</div>
              <div style={styles.con_text}>地址：{item.address ? item.address.address:''}</div>
              <div style={styles.pd_num}>
                待审核{item.personalCount}人
              </div>
            </div>
           </div>
       </Link>
      )
    })
    //已审核列表
    var auditedList = this.state.AuditedLessonList.map((item,index)=>{
      return(
        <Link to={`${__rootDir}/ReviewDetail/${item.id}`} key={index}>
          <div style={styles.rev_listbox}>
            <img src={Dm.getUrl_img('/img/v2/icons/review_course@2x.png')} width="13" height="13" style={{marginTop:3}}/>
            <div style={styles.rev_con}>
              <div style={styles.title}>{item.title}</div>
              <div style={styles.con_text}>时间：{item.isSameDay ? new Date(item.start_time).format("yyyy-MM-dd"):new Date(item.start_time).format("yyyy-MM-dd") +" ~ "+ new Date(item.end_time).format("MM-dd")}</div>
              <div style={styles.con_text}>地址：{item.address ? item.address.address:''}</div>
              <div style={{...styles.pd_num,color:'#22bb2c'}}>
                已审核{item.personalCount}人
              </div>
            </div>
           </div>
        </Link>
      )
    })

    return(
      <div style={styles.container}>
      <FullLoading isShow={this.state.isLoading}/>
        <div style={styles.tab_box}>
          <div style={styles.tab_absolute}>{tab}</div>
        </div>
        <div style={styles.top_box}>
          <div style={styles.area_box}>
            <div style={styles.area}>
              <img src={Dm.getUrl_img('/img/v2/icons/area@2x.png')} width="12" height="16"/>
              <span style={{marginLeft:8}}>权益地区：{this.state.area}</span>
            </div>
            <div style={{...styles.area,flex:1}}>
              <img src={Dm.getUrl_img('/img/v2/icons/attendance@2x.png')} width="13" height="15"/>
              <span style={{marginLeft:8}}>免费参课：{this.state.freeNum}</span>
            </div>
          </div>
          <div style={styles.area_box}>
            <div style={styles.area}>
              <img src={Dm.getUrl_img('/img/v2/icons/point@2x.png')} width="12" height="16" />
              <span style={{marginLeft:8}}>剩余点数：</span>
            </div>
          </div>
        </div>
        <div style={styles.search_box}
          onTouchEnd={this._labelScroll.bind(this)}>
        </div>
        <div style={styles.lesson_list}
        ref={(lessonList) => this.lessonList = lessonList}
        >
          <div style={{display:this.state.tabIndex == 0 ? 'block':'none'}}>
              {this.state.NotReviewlessonList.length > 0 ?
                notReviewList
                :
                listNull
               }
               <div style={{display:this.state.NotReviewlessonList.length >0 && this.state.loadMore_notReview == false ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
          </div>
          <div style={{display:this.state.tabIndex == 1 ? 'block':'none'}}>
            {this.state.AuditedLessonList.length > 0 ?
              auditedList
              :
              listNull
             }
             <div style={{display:this.state.AuditedLessonList.length >0 && this.state.loadMore_Audited == false ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
          </div>
        </div>
      </div>
    )
  }
}

var styles ={
  container:{
    height:devHeight,
    width:devWidth,
  },
  tab_box:{
    width:'100%',
    height:45,
    borderBottom:'solid 1px #d8d8d8',
    backgroundColor:Common.Bg_White,
    position:'relative',
  },
  tab_absolute:{
    position:'absolute',
    left:0,
    bottom:0,
    zIndex:10,
    width:devWidth,
    height:45,
    display:'flex',
    flex:1,
    flexDirection:'row',
  },
  tab_con:{
    width:'50%',
    height:45,
    fontSize:Fnt_Medium,
    display:'flex',
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },
  tab_text:{
    display:'inline-block',
    height:45,
    lineHeight:'45px',
  },
  top_box:{
    height:60,
    backgroundColor:Common.Bg_White,
  },
  area_box:{
    width:devWidth-34,
    paddingLeft:17,
    display:'flex',
    flexDirection:'row',
    height:30,
    alignItems:'center',
  },
  area:{
    display:'flex',
    flexDirection:'row',
    flex:1.5,
    alignItems:'center',
    fontSize:Fnt_Small,
    color:Common.Black,
  },
  search_box:{
    width:devWidth,
    height:45,
    backgroundColor:'#F4F8FB'
  },
  lesson_list:{
    width:devWidth,
    height:devHeight- 151,
    overflowY:'auto',
  },
  rev_listbox:{
    backgroundColor:Common.Bg_White,
    width:devWidth - 24,
    padding:'20px 12px 15px 12px',
    display:'flex',
    flexDirection:'row',
    flex:1,
    marginTop:10,
  },
  rev_con:{
    width:devWidth - 41,
    marginLeft:4,
    display:'flex',
    flexDirection:'column',
  },
  title:{
    fontSize:Fnt_Normal,
    color:Common.Light_Black,
    lineHeight:'20px',
  },
  con_text:{
    fontSize:Fnt_Small,
    color:Common.Gray,
    marginTop:10,
  },
  pd_num:{
    fontSize:Fnt_Normal,
    color:Common.orange,
    lineHeight:'24px',
    marginTop:10,
    textAlign:'right',
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

export default PendingReview;
