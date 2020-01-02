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

class ReviewDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      accountCount:0,
      offlineInfo:{},
      accountList:[],
      address:{},
      auth:{},
      isUnfolded:false,//筛选条件默认收起
      label_text:'所有状态',
      isDisplay:false,
    }

    this.label =[{id:null,type:'所有状态'},{id:3,type:'待参课'},{id:4,type:'审核未通过'},
    {id:5,type:'已参课'},{id:6,type:'未参课'},{id:7,type:'超时未审核'},
    {id:8,type:'超时未付款'},{id:9,type:'待付款'},{id:10,type:'取消报名'}]
  }

  componentWillMount() {
    Dispatcher.dispatch({
      actionType:'AuditDetail',
      id:this.props.match.params.id,
      label_id:null,//null为所有状态
    })
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-线下课报名审核详情');
    this.e_AuditDetail = EventCenter.on('AuditDetailDone',this._handleAuditDetail.bind(this));
  }

  componentWillUnmount() {
    this.e_AuditDetail.remove()
  }

  //获取数据源
  _handleAuditDetail(re){
    console.log('---_handleAuditDetail---',re);
    if(re.err){
      return false;
    }
    if(re.result){
      var result = re.result;
      this.setState({
        accountCount:result.accountCount,
        offlineInfo:result.offlineInfo||{},
        accountList:result.accountList,
        auth:result.offlineInfo ? result.offlineInfo.auth : {},
        address:result.offlineInfo ? result.offlineInfo.address : {},
      })
    }
  }

  //展开筛选条件
  _unfolded(){
    this.setState({
      isUnfolded:true,
      isDisplay:true,
    })
  }
  //隐藏遮罩层
  _hide(){
    this.setState({
      isUnfolded:false,
      isDisplay:false,
    })
  }
  //label筛选
  _selectLabel(index){
    var labelIndex = null;
    if(index == 0){
      labelIndex = null;
    }
    else {
      labelIndex = index + 2;
    }
    Dispatcher.dispatch({
      actionType:'AuditDetail',
      id:this.props.match.params.id,
      label_id:labelIndex,//null为所有状态
    })
    this.setState({
      label_text:this.label[index].type,
      isUnfolded:false,
      isDisplay:false,
    })
    console.log('==isUnfolded',this.state.isUnfolded);
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

    //筛选下拉列表
    var labelList=this.label.map((item,index)=>{

      return(
        <div key={index} style={styles.label_selected} onClick={this._selectLabel.bind(this,index)}>{item.type}</div>
      )
    })

    var top_text,unit, auth,authFlag,authSingleCount,freeNum;
    auth = this.state.auth;
    authFlag = auth && auth.data ? auth.data.authFlag:null;
    authSingleCount = auth && auth.data ? auth.data.authSingleCount:0;
    freeNum = auth && auth.data ? auth.data.freeNum : 0;
    switch (authFlag) {
      case 1:
        //扣钱
        unit = '元/人';
        top_text = '本课程参与价格 '+authSingleCount+unit;
        break;
      case 5:
        //扣次显示免费名额
        unit = '点/人';
        top_text = '本课程免费参与'+freeNum+'人，'+'超出后价格'+authSingleCount+unit;
        break;
      case 7:
        //扣点不显示免费名额
        unit = '点/人';
        freeNum = 0;
        top_text = '本课程超出后价格'+authSingleCount+unit;
        break;
      case 6:
        //扣次
        unit = '元/人次';
        top_text = '本课程免费参与数'+freeNum+'人，'+'超出后价格'+authSingleCount+unit;
        break;
      case 8:
        //扣次
        unit = '元/人次';
        freeNum = 0;
        top_text = '本课程超出后价格'+authSingleCount+unit;
        break;
      case 10:
        //只能用免费名额
        top_text = '本次课程免费参与数'+freeNum +'人';
        break;
    }

    var disp_status,statuText,statuColor;
    disp_status =this.state.offlineInfo.disp_status || null;

    if(disp_status == 1 ){
      statuText = '正在报名';
      statuColor = '#F37633'
    }
    else if (disp_status == 2) {
      statuText = '报名已满';
      statuColor = '#0097FA'
    }
    else if(disp_status == 3) {
      statuText = '课程结束';
      statuColor = '#999999'
    }
    else if (disp_status == 4) {
      statuText = '报名截止';
      statuColor = '#ff0000'
    }

    var isSameDay = false;//是否跨天显示时间
    var start_time,end_time,time_str;
    isSameDay = this.state.offlineInfo.isSameDay;
    start_time = this.state.offlineInfo ? new Date(this.state.offlineInfo.start_time).format("yyyy-MM-dd") : '';
    end_time = this.state.offlineInfo ? new Date(this.state.offlineInfo.end_time).format("MM-dd") : '';

    if(isSameDay){
      time_str = start_time;
    }else {
      time_str = start_time+' 至 '+end_time;
    }

    var accountList = this.state.accountList.map((item,index)=>{
      var status = item.status;
      var status_text,status_color;
      switch (status) {
        case 3:
          //待参课
          status_text = '待参课';
          status_color = Common.Activity_Text;
          break;
        case 4:
          status_text = '审核未通过';
          status_color = '#ff4642';
          break;
        case 5:
          //已参课
          status_text = '已参课';
          status_color = '#29c931';
          break;
        case 6:
          //未参课
          status_text = '未参课';
          status_color = '#76gaa2';
          break;
        case 7:
          //超时未审核
          status_text = '超时未审核';
          status_color = '#ff4642';
          break;
        case 8:
          //超时未付款
          status_text = '超时未付款';
          status_color = '#ff4642';
          break;
        case 9:
          //待付款
          status_text = '待付款';
          status_color = Common.orange;
          break;
        case 10:
          //取消审核
          status_text = '取消报名';
          status_color = '#2395b0';
          break;
        }
      return(
        <div key={index} style={styles.employee_box} >
          <div style={styles.employee_top}>
            <div style={styles.name}>
              <span>{item.name}</span>
            </div>
            <div style={styles.apply_time}>申请时间：{new Date(item.post_date).format('yyyy-MM-dd')}</div>
           </div>
           <div style={{...styles.employee_info,marginTop:10}}>手机号码<span style={{marginLeft:10}}>{item.phone}</span></div>
           <div style={styles.employee_info}>电子邮件<span style={{marginLeft:10}}>{item.email}</span></div>
           <div style={styles.employee_info}>目前职位<span style={{marginLeft:10}}>{item.position}</span></div>
           <div style={{display:'flex',flexDirection:'row',flex:1,}}>
              <div style={{...styles.employee_info,display:'flex',flexDirection:'row',flex:1,}}>上级领导<span style={{marginLeft:10}}>{item.boss_name}</span></div>
              <div style={{...styles.not_review,color:status_color}}>{status_text}</div>
           </div>
        </div>
      )
    })

    return(
      <div style={styles.container}>
        <div style={{...styles.mask,display:this.state.isDisplay ? 'block':'none'}} onClick={this._hide.bind(this)}></div>
        <div style={styles.top_bg}>
          <img src={Dm.getUrl_img('/img/v2/icons/attention@2x.png')} width={15} height={15} />
          <div style={{fontSize:Fnt_Small,color:Common.Bg_White,marginLeft:4,}}>000</div>
        </div>
        <div style={styles.offline_box}>
          <div style={styles.offline_bigbox}>
            <div style={{...styles.offline_con,justifyContent:'flex-start'}}>
            <img src={Dm.getUrl_img('/img/v2/icons/review_offline@2x.png')} width={23} height={18} style={{marginTop:3}} />
            <span style={styles.big_title}>线下课信息</span>
            </div>
            <div style={{...styles.offline_con,justifyContent:'flex-end'}}><Link style={{fontSize:Fnt_Normal,color:Common.Black}}>查看详情</Link></div>
          </div>
         </div>
         <Link >
           <div style={{...styles.lessonDiv}}>
             <div style={{...styles.lessonPng,}}>
               <img style={{width: 127, height: 80, }} src={this.state.offlineInfo.brief_image ? this.state.offlineInfo.brief_image : Dm.getUrl_img('/img/v2/icons/big_default.jpeg')} />
               <div style={{...styles.offline_tag,backgroundColor:statuColor,}}>{statuText}</div>
             </div>
             <div style={styles.lessonTitle}>
                <div style={{...styles.LineClamp,width:devWidth-175,fontSize:Fnt_Normal,color:Common.Light_Black,height:40}}>{this.state.offlineInfo.title}</div>
                <div style={{fontSize:11,color:Common.Gray}}>时间：{time_str}</div>
                <div style={{fontSize:11,color:Common.Gray}}>地址：{this.state.address ? this.state.address.address:'' }</div>
             </div>
           </div>
         </Link>
         <div style={styles.label_box}>
            <div style={styles.label_display} onClick={this._unfolded.bind(this)}>
              <span>{this.state.label_text}</span>
              {this.state.isUnfolded ?
                <img src={Dm.getUrl_img('/img/v2/icons/Triangle_up@2x.png')} width={8} height={6} style={{marginLeft:10}} />
                :
                <img src={Dm.getUrl_img('/img/v2/icons/Triangle_down@2x.png')} width={8} height={6} style={{marginLeft:10}} />
              }
            </div>
            <div style={{...styles.label_absolute,display:this.state.isUnfolded ? 'block':'none'}}>{labelList}</div>
         </div>
         {accountList}
      </div>
      )
    }
}

var styles ={
  container:{
    height:devHeight,
    width:devWidth,
    position:'relative'
  },
  top_bg:{
    width:devWidth-12,
    paddingLeft:12,
    height:28,
    backgroundColor:'#64baff',
    display:'flex',
    flexDirection:'row',
    flex:1,
    alignItems:'center',
  },
  offline_box:{
    width:devWidth-24,
    paddingLeft:12,
    position:'relative',
    marginTop:10,
  },
  offline_bigbox:{
    width:devWidth-24,
    height:44,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
  },
  offline_con:{
    display:'flex',
    flexDirection:'row',
    flex:1
  },
  big_title:{
    fontSize:Fnt_Medium,
    color:Common.Black,
    marginLeft:8,
  },
  lessonDiv: {
	  width:devWidth-24,
    height:80,
    padding:'20px 0',
    marginLeft:12,
	  backgroundColor: '#fff',
    position: 'relative',
    display:'flex',
    flexDirection:'row',
    flex:1,
    marginBottom:12,
	},
  lessonPng: {
    position:'relative',
		width: 127,
		height: 80,
		display:'flex',
    flexDirection:'row',
    marginLeft:9,
	},
  offline_tag:{
    width:50,
    height:20,
    lineHeight:'20px',
    fontSize:11,
    color:'#fff',
    textAlign:'center',
    position:'absolute',
    zIndex:10,
    top:0,
    right:0,
  },
  lessonTitle:{
    display:'flex',
    flexDirection:'column',
    width:devWidth-175,
    marginLeft:14,
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  label_box:{
    position:'relative',
    marginBottom:15,
  },
  label_display:{
    backgroundColor:'#f4f8fb',
    height:45,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    fontSize:14,
    color:Common.Gray,
    position:'relative',
    zIndex:999,
  },
  label_absolute:{
    width:devWidth,
    position:'absolute',
    top:45,
    left:0,
    zIndex:999,
  },
  label_selected:{
    backgroundColor:'#f9f9f9',
    height:40,
    lineHeight:'40px',
    borderBottom:'solid 1px #f3f3f3',
    width:devWidth-12,
    paddingLeft:12,
    fontSize:Fnt_Normal,
    color:Common.Black,
  },
  mask:{
		width: devWidth,
		height: devHeight,
		backgroundColor: '#000',
		opacity: 0.3,
		position: 'absolute',
		zIndex: 99,
	},
  employee_box:{
    backgroundColor:Common.Bg_White,
    width:devWidth-64,
    marginLeft:12,
    padding:'0 20px',
    height:135,
    borderRadius:4,
    marginBottom:12,
  },
  employee_top:{
    height:35,
    paddingTop:2,
    display:'flex',
    flexDirection:'row',
    flex:1,
    borderBottom:'solid 1px #d8d8d8',
    alignItems:'center',
  },
  name:{
    display:'flex',
    flexDirection:'row',
    flex:1,
    fontSize:Fnt_Normal,
    color:Common.Black,
    alignItems:'center',
  },
  apply_time:{
    display:'flex',
    flexDirection:'row',
    flex:1,
    justifyContent:'flex-end',
    paddingRight:5,
    fontSize:Fnt_Small,
    color:Common.Black
  },
  employee_info:{
    fontSize:Fnt_Small,
    color:Common.Gray,
  },
  not_review:{
    display:'flex',
    flexDirection:'row',
    flex:1,
    justifyContent:'flex-end',
    fontSize:Fnt_Normal,
    color:Common.orange,
  },

}

export default ReviewDetail;
