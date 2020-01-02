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

//import funcs from '../util/funcs'

var skip = 0;
var countdown;
class CoursePlan extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      checkNum:0,
      planList:[],
      loadMore:true,
      isLoading:true,
    }

    this.data = ['全部','课程计划','专题计划'];
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-计划');
 
    Dispatcher.dispatch({
      actionType: 'PlanList',
      skip:0,
      limit:15,
      type:null,//type 全部不传值 / 课程计划 2 / 专题计划 7
    })

    this.e_PlanList = EventCenter.on('PlanListDone',this._handlePlanList.bind(this));
    this.e_PlanListLoadMore = EventCenter.on('PlanListLoadMoreDone',this._handlePlanListLoadMore.bind(this));
  }

  componentWillUnmount() {
    this.e_PlanList.remove()
    this.e_PlanListLoadMore.remove()
    clearInterval(countdown);
  }

  _goToPlanDetail(id){
    this.props.history.push(`${__rootDir}/CoursePlanDetail/${id}`);
  }

  render(){

    var allPlan = this.state.planList.map((item,index)=>{
      var status_text = null;//课程状态
      var status_color = '';//状态颜色标识
      if(item.status == 0){
        status_text = '未激活';
        status_color = Common.red;
      }
      else if (item.status == 1) {
        status_text = '未开始';
        status_color = Common.orange;
      }
      else if (item.status == 2) {
        status_text = '学习中';
        status_color = Common.Activity_Text;
      }
      else if (item.status == 3) {
        status_text = '已完成';
        status_color = Common.CompleteColor;
      }
      else if (item.status == 4) {
        status_text = '已结束';
        status_color = Common.OverColor;
      }
      var id =item.id;
      var schedule = 0;
      var scheduleText = 0;
        schedule = Math.floor(120/100 * (item.learnTotalTime/item.courseTotalTime*100));
        scheduleText = Math.floor((item.learnTotalTime/item.courseTotalTime)*100);
      return(
        <div key={index} onClick={this._goToPlanDetail.bind(this,id)}>
            <div style={{...styles.title,marginTop:20}}>
              {item.name}
              <span style={{color:Common.Activity_Text}}>(共{item.courseNum || 0}门课）</span>
            </div>
          <div style={{marginTop:20,}}>
            <span style={{fontSize:11,color:Common.Light_Gray,float:'left',width:60,}}>学完{scheduleText || 0 }%</span>
            <div style={styles.bar}>
              <div style={{...styles.blue_bar,width:schedule || 0,}}></div>
            </div>
            <div style={{float:'right',color:status_color,fontSize:Fnt_Normal}}>{status_text}</div>
            <div style={Common.clear}></div>
          </div>
          <div style={{...styles.line,marginTop:20,display:this.state.planList.length-1 == index ? 'none' : 'block',}}></div>
        </div>
      )
    })

    return(
      <div style={{...styles.container}}
      ref={(planList) => this.planList = planList}
      onTouchEnd={() => {this._labelScorll(this.planList)}}>
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

        <div style={{width:devWidth,paddingTop:1, height:devHeight-46,overflowY:'auto'}}>
          <div style={{display:this.state.checkNum == 0? 'block':'none',height:devHeight-46,width:devWidth-30,marginLeft:15,}}>
          {
            this.state.planList.length > 0 ?
            <div>
              {allPlan}
              <div style={{display:this.state.loadMore ? 'none':'block',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
            </div>
            :
            <div style={{marginTop:100,textAlign:'center'}}>
             <img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} width={188} height={128}/>
             <div style={{textAlign: 'center', fontSize: 14, color: '#666', marginTop: 12}}>暂无计划哦</div>
           </div>
          }
          </div>

          {/**课程计划*/}
          <div style={{display:this.state.checkNum == 1? 'block':'none',height:devHeight-46,width:devWidth-30,marginLeft:15,}}>
          {
            this.state.planList.length > 0 ?
            <div>
              {allPlan}
              <div style={{display:this.state.loadMore ? 'none':'block',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
            </div>
            :
            <div style={{marginTop:100,textAlign:'center'}}>
             <img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} width={188} height={128}/>
             <div style={{textAlign: 'center', fontSize: 14, color: '#666', marginTop: 12}}>暂无计划哦</div>
           </div>
           }
          </div>
          {/**专题计划*/}
          <div style={{display:this.state.checkNum == 2? 'block':'none',height:devHeight-46,width:devWidth-30,marginLeft:15,}}>
          {
            this.state.planList.length > 0 ?
            <div>
              {allPlan}
              <div style={{display:this.state.loadMore ? 'none':'block',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
            </div>
            :
            <div style={{marginTop:100,textAlign:'center'}}>
             <img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} width={188} height={128}/>
             <div style={{textAlign: 'center', fontSize: 14, color: '#666', marginTop: 12}}>暂无计划哦</div>
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
        actionType: 'PlanList',
        skip:0,
        limit:15,
        type:null,//type 全部不传值 / 课程计划 2 / 专题计划 7
      })
    }
    else if (index == 1) {
      Dispatcher.dispatch({
        actionType: 'PlanList',
        skip:0,
        limit:15,
        type:2,//type 全部不传值 / 课程计划 2 / 专题计划 7
      })
    }
    else if (index == 2) {
      Dispatcher.dispatch({
        actionType: 'PlanList',
        skip:0,
        limit:15,
        type:7,//type 全部不传值 / 课程计划 2 / 专题计划 7
      })
    }
  }

  _handlePlanList(re){
    if(re && re.result && re.result.data){
      skip = re.result.length;
      this.setState({
        planList:re.result.data.list || [],
        loadMore:re.result.length >= 15 ? true:false,
        isLoading:false,
      })
    }
  }
  _handlePlanListLoadMore(re){
    if(re && re.result && re.result.data){
      skip = re.result.length;
      this.setState({
        planList:re.result.data.list || [],
        loadMore:re.result.length >= 15 ? true:false,
        isLoading:false,
      },()=>{
        skip = this.state.planList.length;
      })
    }
  }

  _labelScorll(re){

    if((this.planList.scrollHeight - this.planList.scrollTop - 220) <  document.documentElement.clientHeight) {
      if (this.state.planList.length < 15) {
        return
      }
      if(this.state.checkNum == 0){
        Dispatcher.dispatch({
          actionType: 'PlanList',
          skip:skip,
          limit:15,
          type:null,//type 全部不传值 / 课程计划 2 / 专题计划 7
          LoadMore:true,
        })
      }
      else if (this.state.checkNum == 1) {
        Dispatcher.dispatch({
          actionType: 'PlanList',
          skip:skip,
          limit:15,
          type:2,//type 全部不传值 / 课程计划 2 / 专题计划 7
          LoadMore:true,
        })
      }
      else if (this.state.checkNum == 2) {
        Dispatcher.dispatch({
          actionType: 'PlanList',
          skip:skip,
          limit:15,
          type:7,//type 全部不传值 / 课程计划 2 / 专题计划 7
          LoadMore:true,
        })
      }
    }
  }

}

var styles ={
  container:{
    backgroundColor:Common.Bg_White,
    height:devHeight,
    width:devWidth,
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
    width:devWidth,
    padding:'0 10px',
    height:45,
    lineHeight:'45px',
  },
  tab:{
    width:devWidth/3,
    height:45,
    lineHeight:'45px',
    textAlign:'center',
    float:'left',
  },
  title:{
    fontSize:Fnt_Medium,
    color:Common.Black,
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
}


export default CoursePlan;
