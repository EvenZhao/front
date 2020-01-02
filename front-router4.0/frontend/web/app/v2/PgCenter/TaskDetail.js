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


class TaskDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      isDeadline:false,
      taskInfo:{},
      taskList:[],
      isComplete:false,//任务是否完成
      planType:false,
      test:{},
      isShow: false,
      alertTitle:'',
    }

    this.taskId = this.props.match.params.id;
  }

  componentWillMount() {

    Dispatcher.dispatch({
      actionType: 'TaskDetail',
      task_id:this.taskId,
    })
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-任务详情');
    this.e_TaskDetail = EventCenter.on('TaskDetailDone',this._handleTaskDetailDone.bind(this));
  }

  componentWillUnmount() {
    this.e_TaskDetail.remove()
  }
  gotoTestPaper(e){
    console.log('this.state.test.source',this.state.test.score);
    if (this.state.test.num == 0) {
      this.goToTest()
      return
    }
    this.setState({
      isShow:true
    })
    
  }
  goToAnalysis(){
    this.props.history.push({pathname:`${__rootDir}/PgtestPaperResult/${this.state.test.id }`, hash: null, query: null, state: {type: 2}});
  }
  goToTest(){
    this.props.history.push({pathname:`${__rootDir}/PgtestPaper`, hash: null, query: null, state: {id: this.state.taskInfo ?  this.state.taskInfo.id : '',testId: this.state.test ? this.state.test.id : '',isAnalysis: false, type: 2}});
  }
  cancel(){
    this.setState({
      isShow:false
    })
  }
  render(){
    var task_status = '';
    var task_color = '';
    if(this.state.isComplete){
      task_status = '已完成';
      task_color = Common.orange;
    }
    else {
      if(this.state.planType){
        task_status = '进行中';
        task_color = Common.Activity_Text;
      }
      else {
        task_status = '未完成';
        task_color = Common.red;
      }
    }

    return(
      <div style={{...styles.container}}>
        <div style={{width:window.screen.width,height:130,position:'relative'}}>
          <img src={Dm.getUrl_img('/img/v2/icons/lecture_bg@2x.png')} style={styles.bg}/>
          <div style={{position:'absolute',left:0,top:0,zIndex:2,}}>
          <div style={{padding:'30px',width:window.screen.width-40}}>
            <div style={{fontSize:Fnt_Medium,color:Common.Bg_White}}>{this.state.taskInfo.name}</div>
            <div style={{marginTop:20}}>
              <img src={Dm.getUrl_img('/img/v2/icons/online_study@2x.png')} style={{width:60,height:14,float:'left',marginTop:4,}}/>
              <div style={styles.top_text}>任务截止:{new Date(this.state.taskInfo.end_time).format('yyyy年MM月dd日')}</div>
              <div style={{color:task_color,fontSize:Fnt_Normal,float:'left',marginLeft:20}}>{task_status}</div>
            </div>
            <div style={Common.clear}></div>
          </div>
          </div>
        </div>

        <div style={{height:90,padding:'20px 15px 0 15px',width:window.screen.width-30}}>
          <div style={{fontSize:Fnt_Normal,color:Common.Gray}}>
            {new Date(this.state.taskInfo.start_time).format(Common.DATE_TIME)} 发布了新任务【{this.state.taskInfo.name}】
          </div>
        </div>
        {
          this.state.test && this.state.isComplete ?
          /* this.state.test ? */
            <div onClick={this.gotoTestPaper.bind(this)} style={{width:window.screen.width,height:40,backgroundColor:'#F6FBFB'}}>
              <img src={Dm.getUrl_img('/img/v2/icons/testPaper@2x.png')} width={15} height={18} style={{float:'left',marginRight:9,marginTop:13,marginLeft:20}}/>
              <span style={{fontSize:14,color:'#000000',marginTop:13,float:'left'}}>课后测试题</span>
              <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width={8} height={14} style={{float:'right',marginRight:9,marginTop:13,marginLeft:8}}/>
              {
                 this.state.test && this.state.test.num < 1 ?
                  <span style={{fontSize:12,color:'#999999',float:'right',marginTop:11}}>去做题</span>
                  :<span style={{fontSize:12,color:'#999999',float:'right',marginTop:11}}>查看</span>
              }
            </div>
            :
            null
         }

        <div style={{...styles.list,height:this.state.test ? (devHeight-300):(devHeight-260)}}>

          {/*视频任务*/}

            <div>
            {
              this.state.taskList.map((item,index)=>{
                var course_status = '';
                var status_color = '';
                if(item.is_complete){
                  course_status = '已学完';
                  status_color = Common.Activity_Text;
                }
                else {
                  if(item.plan_type){
                    course_status = '继续学习';
                    status_color = Common.orange;
                  }
                  else {
                    course_status = '未完成';
                    status_color = Common.red;
                  }
                }

              if(item.resource_type == 2){
                return(
                  <Link to={`${__rootDir}/lesson/online/${item.id}`} key={index}>
                    <div style={{overflow:'hidden',clear:'both',marginTop:15,}}>
                      <div style={{position:'relative',float:'left',width:127,height:80,}}>
                         <img src={item.brief_image} width={127} height={80} style={{position:'absolute',zIndex:1,left:0,top:0,}}/>
                       </div>
                       <div style={{float:'left',marginLeft:10,width:window.screen.width-161,}}>
                         <div style={{...Common.LineClamp,WebkitLineClamp: 2,height:36,lineHeight:'18px',fontSize:Fnt_Normal,color:Common.Light_Black}}>{item.title}</div>
                         <div style={{color:Common.Light_Gray,marginTop:15,}}>
                           <span style={{fontSize:11,float:'left'}}>共{item.catalog_num}章</span>
                           <span style={{fontSize:Fnt_Small,float:'right',color:status_color}}>{course_status}</span>
                           <div style={Common.clear}></div>
                         </div>
                       </div>
                    </div>
                  </Link>
                )
              }
              else {
                var liveSeriesImg = null;
                if(item.live_series == 3) {
                  liveSeriesImg = Dm.getUrl_img('/img/v2/icons/CFO@2x.png')
                } else if(item.live_series == 4) {
                  liveSeriesImg = Dm.getUrl_img('/img/v2/icons/SZT@2x.png')
                } else {
                  liveSeriesImg = null
                }

                var liveStatusType = null;
                var status_bg = null;
                if(item.live_status === 0){
                  liveStatusType = '尚未开始'
                  status_bg = Common.orange;

                } else if(item.live_status === 2) {
                  liveStatusType = '直播结束'
                  status_bg = Common.Light_Gray;
                } else {
                  liveStatusType = '正在直播'
                  status_bg = Common.Activity_Text;
                }

                return(
                <Link to={`${__rootDir}/lesson/live/${item.id}`} key={index}>
                  <div style={{overflow:'hidden',clear:'both',marginTop:15,}}>
                      <div style={{position:'relative',float:'left',width:127,height:80,}}>
                         <img src={item.brief_image} width={127} height={80} style={{position:'absolute',zIndex:1,left:0,top:0,}}/>
                         <div style={{...styles.status,backgroundColor:status_bg}}>{liveStatusType}</div>
                         <div style={{...styles.time_bg}}>
                         {new Date(item.start_time).format(Common.MD_TIME)}-{new Date(item.end_time).format(Common.TIME)}
                         </div>
                       </div>
                       <div style={{float:'left',marginLeft:10,width:window.screen.width-161,}}>
                         <div style={{...Common.LineClamp,WebkitLineClamp: 2,height:36,lineHeight:'18px',fontSize:Fnt_Normal,color:Common.Light_Black}}>{item.title}</div>
                         <div style={{color:Common.Light_Gray,marginTop:15,}}>
                           <img src={liveSeriesImg} style={{width: 60, height: 14, marginTop: 2,float:'left'}}/>
                           <span style={{fontSize:Fnt_Small,float:'right',color:status_color}}>{course_status}</span>
                           <div style={Common.clear}></div>
                         </div>
                       </div>
                  </div>
                </Link>
                )
              }
            })
          }
          </div>

        </div>
        <div onClick={this.cancel.bind(this)} style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
        <div style={{...styles.alert,display:this.state.isShow ?'block':'none'}}>
          <div style={{...styles.alertFirstDiv}}>
            <div style={{width:242,marginLeft:14,height:50,marginTop:18,position:'absolute',textAlign:'center'}}>
              <span style={{fontSize:17,color:'#030303',}}>
                {this.state.alertTitle}
              </span>
            </div>
          </div>
          <div>
            <div  style={{...styles.alertSecond,width:134}} onClick={this.goToAnalysis.bind(this)}>
              <span style={{fontSize:17,color:'#ff0000'}}>查看解析</span>
            </div>
            {
              (this.state.test && this.state.test.score < 60 && this.state.test.num == 1)?
                <div style={{...styles.alertSecond,border:'none'}} onClick={this.goToTest.bind(this)}>
                  <span style={{fontSize:17,color:'#2196f3'}}>强化练习</span>
                </div>
              :
                <div style={{...styles.alertSecond,border:'none'}} onClick={this.cancel.bind(this)}>
                  <span style={{fontSize:17,color:'#2196f3'}}>取消</span>
                </div>
            }
          </div>
        </div>
      </div>
    )
  }

_handleTaskDetailDone(re){
  if(re.err || re.result == null){

    return;
  }
  this.setState({
    taskInfo:re.result.task_info,
    isComplete:re.result.is_complete,
    planType:re.result.plan_type,
    taskList:re.result.lessonList,
    test: re.result.test || null,
    alertTitle: re.result.task_info.name
  })
}

}

var styles ={
  container:{
    backgroundColor:Common.Bg_White,
    height:devHeight,
  },
  bg:{
    width:devWidth,
    height:130,
    position:'absolute',
    zIndex:1,
    top:0,
    left:0,
  },
  top_text:{
    float:'left',
    fontSize:Fnt_Normal,
    color:Common.Bg_White,
    marginLeft:15,
  },

  line:{
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#F4F4F4',
    width:devWidth,
    marginTop:25,
  },
  list:{
    marginTop:5,
    padding:'0 12px',
    width:window.screen.width-24,
    borderTopStyle:'solid',
    borderTopWidth:15,
    borderTopColor:'#eee',
    height:devHeight-260,
    overflowY:'auto',
  },
  status:{
    position:'absolute',
    zIndex:2,
    top:0,
    right:0,
    width:50,
    height:20,
    lineHeight:'20px',
    color:Common.Bg_White,
    fontSize:11,
  },
  time_bg:{
    position:'absolute',
    zIndex:3,
    bottom: 0,
    left:0,
    height: 20,
    lineHeight:'20px',
    opacity: 0.4,
    color: Common.Bg_White,
    textAlign:'center',
    width: 127,
    fontSize:11,
    backgroundColor:Common.Light_Black,
  },
  alert:{
    width:270,
    height:131,
    backgroundColor:'#ffffff',
    borderRadius:'12px',
    position:'absolute',
    top: 211,
    zIndex:999,
    left: (devWidth-270)/2
  },
  alertFirstDiv:{
    width:270,
    height:84,
    borderBottomWidth:0.5,
    borderBottomColor:'#D4D4D4',
    borderBottomStyle:'solid',
    // padding:'20px 14px 0px 14px'
  },
  alertSecond:{
    width:135,
    height:45,
    textAlign:'center',
    borderRightWidth:1,
    borderRightColor:'#D4D4D4',
    borderRightStyle:'solid',
    float:'left',
    lineHeight:3
  },
  zzc:{
    width: devWidth,
    height: devHeight,
    backgroundColor:'#cccccc',
    position:'absolute',
    opacity: 0.5,
    zIndex: 998,
    top:0,
  },
}


export default TaskDetail;
