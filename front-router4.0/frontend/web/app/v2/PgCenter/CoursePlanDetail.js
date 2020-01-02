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
import ResultAlert from '../components/ResultAlert'


var skip = 0;
var countdown
class CoursePlanDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      plan: {},
      details: [],
      courseNum:0,
      resourceId: '',
      test: {},
      alertTitle:'',
      loadMore:true,
      null_course:false,
      showDiv:false,
      //弹框提示信息
      alert_display:'none',
      alert_title:'',
      isShow:false,
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
      isFlag: 'none',//该课程是否下线 默认未下线
    }
  }

  componentWillMount() {
   
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-计划详情');

    Dispatcher.dispatch({
      actionType: 'PlanDetail',
      id:this.props.match.params.id,
    })

    Dispatcher.dispatch({
      actionType: 'CourseList',
      id:this.props.match.params.id,
      skip:0,
      limit:15,
    })
    
    this.e_PlanDetail = EventCenter.on('PlanDetailDone',this._handlePlanListDone.bind(this));
    this.e_CourseList = EventCenter.on('CourseListDone',this._handleCourseListDone.bind(this));
    this.e_CourseListLoadMore = EventCenter.on('CourseListLoadMoreDone',this._handleCourseListLoadMoreDone.bind(this));
  }

  componentWillUnmount() {
    this.e_PlanDetail.remove()
    this.e_CourseList.remove()
    this.e_CourseListLoadMore.remove()
  }

  goToOnlineDetail(id,status,isShow){
    if (isShow == 0) {
      //弹框提示
      this.setState({
        isFlag:'block',
      },()=>{
        countdown = setInterval(()=>{
            clearInterval(countdown);
            this.setState({
              isFlag:'none',
            })
        }, 1500);
      })
      return false;
    }
    if(status == 0){//此课程尚未上线，不可以进入详情页
      //弹框提示
      this.setState({
        alert_display:'block',
        alert_title:'此课程尚未上线',
        isShow:false,
        errStatus:0,
      },()=>{
        countdown = setInterval(()=>{
            clearInterval(countdown);
            this.setState({
              alert_display:'none',
            })
        }, 1500);
      })
      return false;
    }
    else {
      this.props.history.push(`${__rootDir}/lesson/online/${id}`)
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

    var schedule = 0;
    var scheduleText = 0;
    schedule = Math.floor(120/100 * (this.state.plan.learnTotalTime/this.state.plan.courseTotalTime)*100);
    scheduleText = Math.floor(this.state.plan.learnTotalTime/this.state.plan.courseTotalTime*100);
    var details = this.state.details.map((item,index)=>{
      var status_text = null;//课程状态
      var status_color = '';//状态颜色标识
      switch (item.status) {
        case 0:
        case 1:
          status_text = '开始学习';
          status_color = Common.red;
          break;
        case 2:
          status_text = '继续学习';
          status_color = Common.orange;
          break;
        case 3:
          status_text = '已学完';
          status_color = Common.Activity_Text;
          break;
        case 4:
          status_text = '未完成';
          status_color = Common.orange;
          break;
        default:
          break;
       }

      let alertProps ={
        alert_display:this.state.alert_display,
        alert_title:this.state.alert_title,
        isShow:this.state.isShow,
        errStatus:this.state.errStatus
      }

      var bar_width = 0;
      bar_width = Math.floor(item.learnPercent*120/100);

        return(
          <div onClick={this.goToOnlineDetail.bind(this,item.id,item.status,item.isShow)} key={index}>
          <ResultAlert {...alertProps}/>
          <div style={{marginTop:15,}}>
            <div style={{position:'relative',float:'left',width:127,height:80,}}>
              <img src={item.briefImage || item.defaultImage} width={127} height={80} style={{position:'absolute',zIndex:1,left:0,top:0,}}/>
              <div style={styles.msk}></div>
              <div style={{position:'absolute',zIndex:3,top:40,left:5,}}>
                <div style={{fontSize:11,color:Common.Bg_White,}}>已学习{item.learnPercent}%</div>
                <div style={{...styles.bar,marginLeft:0,top:0}}>
                  <div style={{...styles.blue_bar,width:bar_width,}}></div>
                </div>
                <div style={Common.clear}></div>
               </div>
              </div>
              <div style={{float:'left',marginLeft:10,width:window.screen.width-161,}}>
                <div style={{...styles.LineClamp,...styles.title}}>{item.title}</div>
                <div style={{color:Common.Light_Gray,marginTop:15,}}>
                  <span style={{fontSize:11,float:'left'}}>共{item.catalogNum}章</span>
                  <span style={{fontSize:Fnt_Small,float:'right',color:status_color}}>{status_text}</span>
                  <div style={Common.clear}></div>
                </div>
              </div>
          </div>
          <div style={Common.clear}></div>
          </div>
        )
    })
    return(
      <div style={{...styles.container}}>
        <div style={{width:window.screen.width,height:130,position:'relative'}}>
          <img src={Dm.getUrl_img('/img/v2/icons/lecture_bg@2x.png')} style={styles.bg}/>
          <div style={{position:'absolute',left:0,top:0,zIndex:2,}}>
          <div style={{padding:'20px',width:window.screen.width-40}}>
              <div style={{fontSize:Fnt_Medium,color:Common.Bg_White}}>{this.state.plan.name}<span style={{color:Common.Activity_Text}}>(共{this.state.plan.courseNum}门课）</span></div>
                <div style={{marginTop:20,float:'left'}}>
                  <span style={{fontSize:11,color:Common.Light_Gray,float:'left',width:60}}>学完{scheduleText || 0}%</span>
                  <div style={{...styles.bar,float:'left',}}>
                    <div style={{...styles.blue_bar,width:schedule || 0}}></div>
                  </div>
                </div>
                {
                  this.state.plan.status == 0 ?
                   <div>
                     <div style={{...styles.set}} onClick={this.SetPlan.bind(this)}>
                       <img src={Dm.getUrl_img('/img/v2/icons/plan_set@2x.png')} width={15} height={15} style={{float:'left',marginRight:5,marginTop:5,}}/>
                       <span style={{float:'left'}}>设置学习时间</span>
                     </div>
                  </div>
                  : null
                 }
                 {
                  this.state.plan.status == 4 ?
                  <Link to={{pathname:`${__rootDir}/SetDate`,query: null, hash: null, state:{id:this.state.plan.id,name:this.state.plan.name}}}>
                    <div style={{...styles.set,backgroundColor:Common.orange}}>
                      <span style={{float:'left'}}>设置时间重新学习</span>
                    </div>
                  </Link>
                  :
                  null
                }
                <div style={Common.clear}></div>
          </div>
          </div>
        </div>
        <div style={{width:window.screen.width-30,paddingLeft:20,paddingTop:25,height:90}}>
          <div>
            <img src={Dm.getUrl_img('/img/v2/icons/plan_calendar@2x.png')} width={16} height={17} style={{float:'left',marginRight:5,marginTop:2,}}/>
            <div style={{float:'left',fontSize:Fnt_Large,marginLeft:9,color:Common.Black,lineHeight:'normal',}}>
              开始:{this.state.plan.startTime ? new Date(this.state.plan.startTime.split(' ')[0]).format('yyyy年MM月dd日') : '未设置'}


            </div>
            <div style={Common.clear}></div>
          </div>
          <div style={{marginTop:25}}>
            <img src={Dm.getUrl_img('/img/v2/icons/plan_calendar@2x.png')} width={16} height={17} style={{float:'left',marginRight:5,marginTop:2,}}/>
            <div style={{float:'left',fontSize:Fnt_Large,marginLeft:9,color:Common.orange,lineHeight:'normal',}}>截止:
              {this.state.plan.endTime ? new Date(this.state.plan.endTime.split(' ')[0]).format('yyyy年MM月dd日') : '未设置'}
            </div>
            <div style={Common.clear}></div>
          </div>
        </div>
        {
          this.state.plan.courseNum > 0 && this.state.test ?
            <div onClick={this.gotoTestPaper.bind(this)} style={{width:window.screen.width,height:40,backgroundColor:'#F6FBFB'}}>
              <img src={Dm.getUrl_img('/img/v2/icons/testPaper@2x.png')} width={15} height={18} style={{float:'left',marginRight:9,marginTop:13,marginLeft:20}}/>
              <span style={{fontSize:14,color:'#000000',marginTop:13,float:'left'}}>课后测试题</span>
              <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} width={8} height={14} style={{float:'right',marginRight:9,marginTop:13,marginLeft:8}}/>
              {this.state.plan.status == 0 ?
                <span style={{fontSize:12,color:'#999999',float:'right',marginTop:11}}>激活后可查看</span>
                :''
              }
              {
                this.state.plan.status !== 0 && this.state.test.testNum < 1 ?
                  <span style={{fontSize:12,color:'#999999',float:'right',marginTop:11}}>去做题</span>
                  :<span style={{fontSize:12,color:'#999999',float:'right',marginTop:11}}>查看</span>
              }
            </div>
          :
          null
        }
        <div style={{...styles.line,marginTop:0}}></div>
        <div style={{padding:'5px 12px 0 12px',width:window.screen.width-24,height:this.state.plan.courseNum > 0 && this.state.test ? window.innerHeight-316:window.innerHeight-276,overflowY:'auto'}}
        ref={(planList) => this.planList = planList}
        onTouchEnd={() => {this._labelScorll(this.planList)}}>
        {
          this.state.details.length > 0 && this.state.courseNum > 0 ?
          <div>
            {details}
            <div style={{display:this.state.loadMore ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
          </div>
          :
          <div style={{paddingTop:1,textAlign:'center',}}>
            <img src={Dm.getUrl_img('/img/v2/icons/null_course@2x.png')} width={146} height={88} style={{marginTop:35}}/>
            <div style={{fontSize:Fnt_Normal,color:Common.Black,marginTop:25}}>
              很抱歉，目前移动端暂不支持加课，
              <div>请移步至铂略PC官网进行操作。</div>
            </div>
          </div>
         }
         <div style={{...styles.plan_alert,display:this.state.showDiv ? 'block':'none'}}>
            <div style={{height:50,lineHeight:'50px'}}>您需要加入课程</div>
            <div style={{...styles.bottom}} onClick={this.close.bind(this)}>知道了</div>
         </div>
         <div style={{...styles.div_msk,display:this.state.showDiv ? 'block':'none'}} onClick={this.close.bind(this)}></div>
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
            <div style={{...styles.alertSecond,border:'none'}} onClick={this.goToTest.bind(this)}>
              <span style={{fontSize:17,color:'#2196f3'}}>重新测试</span>
            </div>
          </div>
        </div>
        <div style={{...styles.isFlag,display:this.state.isFlag}}>
          <span style={{fontSize:14,color:'#FFFFFF',fontFamily:'pingfangsc-regular'}}>该课程已下架</span>
        </div>
      </div>
    )
  }

SetPlan(){
  if(this.state.plan.courseNum > 0){
    this.props.history.push({pathname:`${__rootDir}/SetDate`,query: null, hash: null, state:{id:this.state.plan.id,name:this.state.plan.name}});
  }else {
    //提示--您需要加入课程
    this.setState({
      showDiv:true,
    })
  }
}

_handlePlanListDone(re){
  this.setState({
    plan:re.result.data.plan || {},
    test: re.result.data.test,
    alertTitle: re.result.data.plan.name || '',
    courseNum:re.result.data.plan.courseNum || 0,
  })
}

_handleCourseListDone(re){
  console.log('_handleCourseListDone====',re);
  if(re && re.result && re.result.data && re.result.data.details){
    skip = re.result.data.details.length;
    this.setState({
      details:re.result.data.details,
      loadMore:re.result.data.details.length >= 15 ? true:false,
    })
  }
}
_handleCourseListLoadMoreDone(re){
  if(re && re.result && re.result.data && re.result.data.details){
    this.setState({
      details:re.result.data.details,
      loadMore:re.result.data.details.length >= 15 ? true:false,
    },()=>{
      skip = this.state.details.length;
    })
  }
}
 goToAnalysis(){
   this.props.history.push({pathname:`${__rootDir}/PgtestPaperResult/${this.state.test.id}`, hash: null, query: null, state: {type: 1}});
 }
  goToTest(){
    this.props.history.push({pathname:`${__rootDir}/PgtestPaper`, hash: null, query: null, state: {id: this.state.test ?  this.state.test.resourceId : '',testId: this.state.test ? this.state.test.id : '', type: 1}});
  }
  cancel(){
    this.setState({
      isShow:false
    })
  }
gotoTestPaper(e){
  // 未做题直接跳转做题页面，做过以后出弹框
  if (this.state.plan.status == 0 || !this.state.test) {
    return
  }
  if (this.state.test.testNum < 1) {
    this.props.history.push({pathname:`${__rootDir}/PgtestPaper`, hash: null, query: null, state: {id: this.state.test ?  this.state.test.resourceId : '',testId: this.state.test ? this.state.test.id : '',type:1}});
    return
  }
  this.setState({
    isShow:true
  })
}
close(){
  this.setState({
    showDiv:false,
  })
}
_labelScorll(re){

 if((this.planList.scrollHeight - this.planList.scrollTop - 220) <  document.documentElement.clientHeight) {
    if (this.state.details.length < 15) {
      return
    }

    Dispatcher.dispatch({
      actionType: 'CourseList',
      id:this.props.location.state.id,
      skip:skip,
      limit:15,
      LoadMore:true,
    })
   }
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
  set:{
    backgroundColor:'#2196F3',
    fontSize:Fnt_Normal,
    color:Common.Bg_White,
    height:26,
    lineHeight:'26px',
    padding:'0 10px',
    display:'inline-block',
    float:'right',
    marginTop:15,
    borderRadius:2,
  },
  line:{
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#F4F4F4',
    width:devWidth,
    marginTop:25,
  },
  msk:{
    backgroundColor:Common.Light_Black,
    opacity:0.5,
    position:'absolute',
    zIndex:2,
    left:0,
    top:0,
    width:127,
    height:80,
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  title:{
    height:40,
    lineHeight:'20px',
    width:devWidth - 161,
    fontSize:Fnt_Normal,
    color:Common.Light_Black,
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
  plan_alert:{
    width:200,
    height:100,
    position:'absolute',
    zIndex:20,
    left:(devWidth-200)/2,
    top:(devHeight-100)/2,
    backgroundColor:'#fff',
    borderRadius:12,
    textAlign:'center',
  },
  bottom:{
    width:200,
    height:39,
    lineHeight:'39px',
    borderTopColor:'#f3f3f3',
    borderTopWidth:1,
    borderTopStyle:'solid',
    textAlign:'center',
    fontSize:17,
    color:'#0076FF',
  },
  div_msk:{
    position:'absolute',
    zIndex:10,
    width:devWidth,
    height:devHeight,
    top:0,
    left:0,
    backgroundColor:'#000',
    opacity:0.2,
  },
  isFlag:{
    position: 'absolute',
    zIndex: 9999,
    width: 240,
    height: 40,
    borderRadius:'2px',
    left: (devWidth-240)/2,
    top: (devHeight-40)/2,
    textAlign: 'center',
    lineHeight: 2.5,
    backgroundColor: '#000000',
    opacity: 0.7,
  }
}


export default CoursePlanDetail;
