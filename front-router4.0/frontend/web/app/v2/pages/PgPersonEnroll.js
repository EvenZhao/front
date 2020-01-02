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

var skip = 0
var width = window.screen.width
var countdown

class PgPersonEnroll extends React.Component {

  constructor(props) {
    super(props);
    this.focusTeacherList = []
    this.state={
      //是否关注
      extendUsers:[],
      usedNum:0,
      freeNum:this.props.location.state.freeNum,
      // authSingleCount: this.props.location.state.authSingleCount || 0,
      name:'',
      phone:'',
      position:'',
      email:'',
      display:'none',
      user: this.props.location.state.user ? this.props.location.state.user : {},
      cooperate_type: this.props.location.state.cooperate_type ? this.props.location.state.cooperate_type : 1,
      isPerson: true,//判断是否为个人账户，默认为true
      authFlag: this.props.location.state.authFlag ? this.props.location.state.authFlag : {},
      OfflineAut:{},
      freeNum:0,
      authSingleCount:0,
      mainInfo: this.props.location.state.authFlag.mainInfo ?  this.props.location.state.authFlag.mainInfo: null,
      isShowResult: false,
      id:''
    }
  }


  checkName(e){
    e.preventDefault()
    var v = e.target.value.trim();
    this.setState({
      name: v
    })
  }
  checkPhone(e){
    e.preventDefault()
    var v = e.target.value.trim();
    this.setState({
      phone: v
    })
  }
  checkPosition(e){
    e.preventDefault()
    var v = e.target.value.trim();
    this.setState({
      email: v
    })
  }
  componentWillMount() {


  }
  _handlegetCompanyUsersDone(re){
    var result= re.result || {}
    this.setState({
      companyUserList: result.companyUsers,
      extendUsers: result.extendUsers
    })
  }

  _handleenrollDone(re){
    var result= re.result || {}
    if(re.err !== null){
      this.setState({
          display:'block',
          alert_title:re.err,
          alert_icon:failure_icon,
          icon_width:failure_width,
          icon_height:failure_height,

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
    if(re.result){
      this.setState({
        // display:'block',
        // alert_title:'提交成功',
        alert_icon:success_icon,
        icon_width:suc_widthOrheight,
        icon_height:suc_widthOrheight,
        isShowResult: true,
        id: re.result.id
      })

    }
  }
  offlinEnroll(){
    this.props.history.replace({pathname:`${__rootDir}/PgOffLlineEnrollDetail/${this.state.id}`, query: null, hash: null, state:{_id:''}});
  }
  OfflineDetail(){
    this.props.history.replace({pathname:`${__rootDir}/lesson/offline/${this.props.location.state.id}`, query: null, hash: null, state:null});
  }
  componentDidMount() {
    if (this.state.user) {
      var user = this.state.user
      this.setState({
        name: user.name || '',
        phone: user.phone+'' || '',
        email: user.email || '',
        isPerson: user.type == 0 ? true : false
      })
    }
    EventCenter.emit("SET_TITLE",'铂略财课-线下课报名申请');
    this._getgetCompanyUsersDone =EventCenter.on("getCompanyUsersDone",this._handlegetCompanyUsersDone.bind(this))
    this._getenrollDone =EventCenter.on("enrollDone",this._handleenrollDone.bind(this))
  }

  componentWillUnmount() {
    this._getgetCompanyUsersDone.remove()
    this._getenrollDone.remove()
  }
  _check_invite(){

  }
  search(){

  }
  Submitl(){
    var data = []
    if (this.state.name && this.state.phone && this.state.email) {
      data = [
        {
          email: this.state.email,  //仅在个人报名时传
          name: this.state.name,
          phone: this.state.phone,
          position: this.state.user.position,
          id: this.state.user.id  //报名人id
        }
      ]
      Dispatcher.dispatch({
        actionType: 'Enroll',
        main_holder: 0,
        enroll_info: data,
        resource_id: this.props.location.state.id,
        user_type: this.state.user.type,
        lesson_type: this.state.cooperate_type
      })
    }

  }
  _labelScorll(re){
    if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {

    }
  }

  render(){
    var mainInfo = this.state.mainInfo || null
    var title
    if (!this.state.isPerson) {
      var title =(
          <span>
            请完成以下信息，以便提交给贵公司
            <span style={{fontSize:12,color:'#2196f3'}}>{mainInfo.name}</span>
            进行审核。
          </span>
      );
    }else {
      title='请完成以下信息，以便我们能尽快与您取得联系。'
    }
    // if (this.state.cooperate_type == 1) {
    //   if (!this.state.isPerson) {
    //     console.log('mainInfo',mainInfo);
    //     var title =(
    //         <span>
    //           请完成以下信息，以便提交给贵公司
    //           <span style={{fontSize:12,color:'#2196f3'}}>{mainInfo.name}</span>
    //           进行审核。
    //         </span>
    //     );
    //   }else {
    //     title='请完成以下信息，以便我们能尽快与您取得联系。'
    //   }
    // }
    // if (this.state.cooperate_type == 2) {
    //   title='本课程为合作课程，请完善信息，以便我们确定报名事宜。'
    // }
    // if (this.state.cooperate_type == 3) {
    //   title='本课程为峰会课程，请完善信息，以便我们确定报名事宜。'
    // }
    return(
    <div
    onTouchEnd={() => {
      this._labelScorll(this.lessonList)
    }}
    style={{...styles.container}}>
      <div style={{...styles.content}} ref={(lessonList) => this.lessonList = lessonList}>
      <div style={{...styles.freeDiv}}>
        <span style={{fontSize:12,color:'#666666',marginLeft:12}}>
          {title}
        </span>
      </div>
        <div style={{...styles.input_box}}>
          <div style={{width:42,height:48,paddingTop:2,float:'left',textAlign:'center'}}>
            <img src={Dm.getUrl_img('/img/v2/icons/addEnrollperson@2x.png')} width={13} height={16}/>
          </div>
          <div style={{...styles.inputDiv}}>
            <span style={{fontSize:15,color:'#333333'}}>姓名</span>
            <input readOnly={this.state.isPerson ? null :'true'} onChange={this.checkName.bind(this)} style={{...styles.input,width:width-90}} type="text"  placeholder="请输入姓名" value={this.state.name}/>
          </div>
        </div>
        <div style={{...styles.input_box}}>
          <div style={{width:42,height:46,paddingTop:4,float:'left',textAlign:'center'}}>
            <img src={Dm.getUrl_img('/img/v2/icons/addEnrollPhone@2x.png')} width={13} height={19}/>
          </div>
          <div style={{...styles.inputDiv}}>
            <span style={{fontSize:15,color:'#333333'}}>手机号码</span>
            <input onChange={this.checkPhone.bind(this)} style={{...styles.input,width:width-120}} type="number" value={this.state.phone} placeholder="请输入手机号"/>
          </div>
        </div>
        <div style={{...styles.input_box}}>
          <div style={{width:42,height:50,float:'left',textAlign:'center'}}>
            <img src={Dm.getUrl_img('/img/v2/icons/addEnrollEmail@2x.png')} width={14} height={11}/>
          </div>
          <div style={{...styles.inputDiv}}>
            <span style={{fontSize:15,color:'#333333'}}>电子邮箱</span>
            <input onChange={this.checkPosition.bind(this)} style={{...styles.input,width:width-120}} type="text" value={this.state.email} placeholder="请输入邮箱"/>
          </div>
        </div>
      </div>
      <div style={{...styles.bottomDiv}}>
        {/*<div style={{...styles.bottomFirstDiv}}>
            <div style={{width:width,float:'left',textAlign:'center'}}>
              <span style={{fontSize:14,color:'#2a2a2a'}}>
                目前剩余
                <span style={{fontSize:14,color:'#2196f3'}}>{this.state.authFlag.authTotalCount || 0}</span>{this.state.authFlag.authUnit ? '点':'次'}，
                本次应扣
                <span style={{fontSize:14,color:'#2196f3'}}>{this.state.authFlag.freeNum > 0 ? 0 : this.state.authFlag.authSingleCount || 0}</span>
                {this.state.authFlag.authUnit ? '点':'次'}
              </span>
            </div>
        </div>*/}
        {
          this.state.name && this.state.phone && this.state.email ?
          <div onClick={this.delOrCancel.bind(this)} style={{...styles.button_bg,backgroundColor:'#2196f3',}}>
            <span style={{fontSize:18,color:'#ffffff'}}>提交</span>
          </div>
          :
          <div style={{...styles.button_bg,backgroundColor:'#E1E1E1',}}>
            <span style={{fontSize:18,color:'#ffffff'}}>提交</span>
          </div>
        }

      </div>
      {/*弹框*/}
      <div style={{...Common.alertDiv,display:this.state.display}}>
        <div style={{marginBottom:14,paddingTop:15,height:30,}}>
          <img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
         </div>
         <span style={{color:Common.BG_White}}>{this.state.alert_title}</span>
       </div>
       <div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
       <div style={{...styles.alert,display:this.state.isShow ?'block':'none'}}>
         <div style={{...styles.alertFirstDiv}}>
           <div style={{width:242,marginLeft:14,height:50,marginTop:18,position:'absolute',textAlign:'center'}}>
             <span style={{fontSize:17,color:'#030303',}}>
               {this.state.alertTitle}
             </span>
           </div>
         </div>
         <div>
           <div style={{...styles.alertSecond,width:134}} onClick={this.cancel.bind(this)}>
             <span style={{fontSize:17,color:'#2196f3'}}>取消</span>
           </div>
           <div style={{...styles.alertSecond,border:'none'}} onClick={this.countersignSubmit.bind(this)}>
             <span style={{fontSize:17,color:'#2196f3'}}>确定</span>
           </div>
         </div>
       </div>
       <div style={{...styles.zzc,display:this.state.isShowResult ?'block':'none'}}></div>
       <div style={{...styles.alert,display:this.state.isShowResult ?'block':'none'}}>
         <div style={{...styles.alertFirstDiv}}>
           <div style={{width:242,marginLeft:14,height:50,marginTop:18,position:'absolute',textAlign:'center'}}>
             <span style={{fontSize:17,color:'#030303',}}>
               报名申请已提交
             </span>
             <div>
               <span style={{fontSize:14,color:'#030303',}}>
                 您可以去个人中心查看报名情况。
               </span>
             </div>
           </div>
         </div>
         <div>
           <div style={{...styles.alertSecond,width:134}} onClick={this.OfflineDetail.bind(this)}>
             <span style={{fontSize:17,color:'#999999'}}>知道了</span>
           </div>
           <div style={{...styles.alertSecond,border:'none'}} onClick={this.offlinEnroll.bind(this)}>
             <span style={{fontSize:17,color:'#2196f3'}}>点击查看</span>
           </div>
         </div>
       </div>
    </div>

    )
  }
  cancel(){//取消方法
    this.setState({
      isShow: false,
      checkNum:''
    })
  }
  countersignSubmit(re){
    this.setState({
      isShow:false
    },()=>{
      this.Submitl()
    })
  }
  delOrCancel(re){

    if(!isCellPhoneAvailable(this.state.phone)){
      this.setState({
          display:'block',
          alert_title:'请输入合法的手机号',
          alert_icon:failure_icon,
          icon_width:failure_width,
          icon_height:failure_height,

        },()=>{
          countdown = setInterval(()=>{
              clearInterval(countdown);
              this.setState({
                display:'none',
              })
          }, 1500);
        });

        return false;
      }

      if(!isEmailAvailable(this.state.email)){
        this.setState({
            display:'block',
            alert_title:'请输入合法的邮箱',
            alert_icon:failure_icon,
            icon_width:failure_width,
            icon_height:failure_height,

          },()=>{
            countdown = setInterval(()=>{
                clearInterval(countdown);
                this.setState({
                  display:'none',
                })
            }, 1500);
          });

          return false;
        }

    this.setState({
      isShow:true,
      alertTitle:'确定后将提交报名',
      // checkNum: re
    })
  }
}

var styles ={
  container:{
    height:devHeight,
  },
  top:{
    backgroundColor:'#fff',
    paddingTop:18,
    paddingBottom:18,
    paddingLeft:12,
    paddingRight:12,
  },
  input_box:{
    width:width,
    height:50,
    backgroundColor:'#ffffff',
    lineHeight:3
  },
  input:{
    width:width-80,
    border:'none',
    height:20,
    padding:'2px',
    lineHeight:'20px',
    fontSize:12,
    color:'#333',
    textAlign:'right',
  },
  inputDiv:{
    width:width-42,
    height:50,
    float:'left',
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#f3f3f3'
  },
  btn_search:{
    fontSize:Fnt_Normal,
    color:Common.Activity_Text,
    float:'right',
    border:'none',
    height:30,
    lineHeight:'30px',
    backgroundColor:Common.Bg_White,
  },
  content:{
    height:devHeight-230,
    overflowY:'auto',
    // paddingLeft:12,
    // paddingRight:12,
    // marginTop:5,
    // backgroundColor:Common.Bg_White,
  },
  title:{
    color:'#000',
    fontSize:14,
    marginTop:30,
  },

  line:{
    width:devWidth-24,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4',
  },
  companyUserDiv:{
    width:width,
    backgroundColor:'#ffffff',
    height:45,
  },
  companyUsersInfoDiv:{
    marginLeft:12,
    width:100,
    float:'left',
    marginTop:12,
    overflow:'hidden',
    height:30
  },
  bottomDiv:{
    width:width,
    height:65,
    borderTop:'solid 1px #e5e5e5',
    backgroundColor:'#ffffff',
    position:'absolute',
    bottom:0,
  },
  bottomFirstDiv:{
    height:50,
    width:width,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#e1e1e1',
    borderTopWidth:1,
    borderTopColor:'#e1e1e1',
    borderTopStyle:'solid'
  },
  freeDiv:{
    width:width,
    height:37,
    // backgroundColor:'#64BAFF',
    lineHeight:2,
    // marginBottom:12
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
  button_bg:{
    width:width-32,
    marginLeft:16,
    height:45,
    lineHeight:'45px',
    textAlign:'center',
    marginTop:10,
    borderRadius:'4px',
  }
}


export default PgPersonEnroll;
