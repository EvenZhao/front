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


class PendingReviewDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      accountCount:0,
      offlineInfo:{},
      accountList:[],
      address:{},
      auth:{},
      checkAll:false,
      checkList:[],
    }
    this.checkList = [];
    this.data = ['审核通过','未通过/关闭']
  }

  componentWillMount() {
    Dispatcher.dispatch({
      actionType:'PendingAuditDetail',
      id:this.props.match.params.id,
    })
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-线下课报名审核详情');
    this.e_PendingAuditDetail = EventCenter.on('PendingAuditDetailDone',this._handlePendingAuditDetail.bind(this));
  }

  componentWillUnmount() {
    this.e_PendingAuditDetail.remove()
  }

  _handlePendingAuditDetail(re){
    console.log('_handlePendingAuditDetail===',re);
    if(re.err){

      return false;
    }
    if(re.result){
      var result = re.result;
      for(var i=0;i<result.accountList.length;i++){
        this.checkList[i] = false;
      }

      console.log('==this.checkList==',this.checkList);
      this.setState({
        accountCount:result.accountCount,
        offlineInfo:result.offlineInfo||{},
        accountList:result.accountList,
        auth:result.offlineInfo ? result.offlineInfo.auth : {},
        address:result.offlineInfo ? result.offlineInfo.address : {},
        checkList:this.checkList,
      })
    }
  }

  //全选
  _checkAll(){
    if(this.state.checkAll){//选中状态点击就取消
      this.setState({
        checkAll:false,
      })
      for(var i=0;i<this.state.accountList.length;i++){
        this.checkList[i] = false;
      }
      this.setState({
        checkList:this.checkList,
      })
    }else {
      this.setState({//未选中状态下点击后选中
        checkAll:true,
      })
      for(var i=0;i<this.state.accountList.length;i++){
        this.checkList[i] = true;
      }
      this.setState({
        checkList:this.checkList,
      })
    }
  }

  _isCheck(index){//当前区域选中或者取消
    console.log('--index--',this.checkList[index]);
    if(this.checkList[index])
    {
      this.checkList[index] = false;
    }
    else
    {
      this.checkList[index] = true;
    }
    this.setState({
      checkList:this.checkList,
    })
  }
  //通过
  _pass(){

  }
  //拒绝
  _refuse(){

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

    var accountList = this.state.accountList.map((item,index)=>{
      console.log('this.state.checkList[index]',this.state.checkList[index]);
      return(
        <div key={index} style={styles.employee_box} onClick={this._isCheck.bind(this,index)}>
          <div style={styles.employee_top}>
            <div style={styles.name}>
              {this.state.checkList[index] ?
                <img src={Dm.getUrl_img('/img/v2/icons/review_ck@2x.png')} width={14} height={14} />
                :
                <img src={Dm.getUrl_img('/img/v2/icons/review_notck@2x.png')} width={14} height={14} />
              }
              <span style={{marginLeft:6}}>{item.name}</span>
            </div>
            <div style={styles.apply_time}>申请时间：{new Date(item.post_date).format('yyyy-MM-dd')}</div>
           </div>
           <div style={{...styles.employee_info,marginTop:10}}>手机号码<span style={{marginLeft:10}}>{item.phone}</span></div>
           <div style={styles.employee_info}>电子邮件<span style={{marginLeft:10}}>{item.email}</span></div>
           <div style={styles.employee_info}>目前职位<span style={{marginLeft:10}}>{item.position}</span></div>
           <div style={{display:'flex',flexDirection:'row',flex:1,}}>
              <div style={{...styles.employee_info,display:'flex',flexDirection:'row',flex:1,}}>上级领导<span style={{marginLeft:10}}>{item.boss_name}</span></div>
              <div style={styles.not_review}>待审核</div>
           </div>
        </div>
      )
    })
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

    //to={`${__rootDir}/lesson/offline/${item.id}`}
    return(
      <div style={styles.container}>
        <div style={styles.top_bg}>
          <img src={Dm.getUrl_img('/img/v2/icons/attention@2x.png')} width={15} height={15} />
          <div style={{fontSize:Fnt_Small,color:Common.Bg_White,marginLeft:4,}}>{top_text}</div>
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
         <div style={styles.offline_box}>
           <div style={styles.offline_bigbox}>
             <div style={{...styles.offline_con,justifyContent:'flex-start'}}>
             <img src={Dm.getUrl_img('/img/v2/icons/review_employee@2x.png')} width={18} height={18} style={{marginTop:3}} />
             <div style={styles.big_title}>待审核员工<span style={{color:Common.Activity_Text}}>({this.state.accountCount})</span></div>
             </div>
             <div style={{...styles.offline_con,justifyContent:'flex-end',color:Common.Activity_Text,fontSize:Fnt_Normal}}>
                <span onClick={this._checkAll.bind(this)}>
                {this.state.checkAll ?
                  '取消'
                  :
                  '全选'
                 }
                </span>
             </div>
           </div>
          </div>
          {accountList}
        <div style={{...styles.footer,bottom:50,borderBottom:'solid 0.5px #e1e1e1'}}>
          <div style={styles.remaining}>目前剩余<span style={{color:Common.Activity_Text}}>14</span>点，本次应扣<span style={{color:Common.Activity_Text}}>12</span>点</div>
          <div style={styles.count}>
            <img src={Dm.getUrl_img('/img/v2/icons/addEnrollperson@2x.png')} width={13} height={16} style={{marginRight:7,marginBottom:2,}} />
            已选<span style={{color:Common.orange}}>3</span>人
          </div>
        </div>
        <div style={styles.footer}>
          <div style={{...styles.pass,backgroundColor:Common.Activity_Text,color:Common.Bg_White}} onClick={this._pass.bind(this)}>通过</div>
          <div style={{...styles.pass,backgroundColor:Common.Bg_White,color:Common.Black}} onClick={this._refuse.bind(this)}>拒绝</div>
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
  remaining:{
    display:'flex',
    flexDirection:'row',
    flex:1.7,
    alignItems:'center',
    paddingLeft:20,
    fontSize:Fnt_Normal,
    color:Common.Gray,
  },
  count:{
    display:'flex',
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    fontSize:Fnt_Normal,
    color:Common.Black,
    borderLeft:'solid 1px #e1e1e1',
    height:25,
  },
  footer:{
    backgroundColor:Common.Bg_White,
    width:devWidth,
    display:'flex',
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    height:50,
    position:'fixed',
    left:0,
    bottom:0,
    zIndex:999,
  },
  pass:{
    width:devWidth/2,
    height:50,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    fontSize:Fnt_Medium,
  }
}

export default PendingReviewDetail;
