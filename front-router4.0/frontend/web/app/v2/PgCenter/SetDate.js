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
import DatePicker from 'react-mobile-datepicker';

var countdown;
class SetDate extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      startOn:false,
      endOn:false,
      start_current:false,
      end_current:false,
      time: new Date(),
      isOpen: false,
      startTime:new Date(),
      endTime:new Date(),
      flag:0,
      //弹框是否显示
      display:'none',
      //弹框提示信息
      alert_title:'',
      //弹框的图标
      alert_icon:'',
      icon_width:0,
      icon_height:0,
      msg:'',
      isMsg:false,
    }

    this.id = this.props.location.state.id;
    this.name = this.props.location.state.name;

  }

  componentWillMount() {

  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-设置时间');
    this.e_updatePlan = EventCenter.on('UpdatePlanDone',this._handleUpdatePlanDone.bind(this));
  }

  componentWillUnmount() {
    this.e_updatePlan.remove()
    clearInterval(countdown)
  }

  _handleUpdatePlanDone(re){
    if(re.err){
      this.setState({
        msg:re.err,
        isMsg:true,
      })
     }
     else
     {
        if(re.result.flag == 0){
          var id = this.id;
          this.props.history.push(`${__rootDir}/CoursePlanDetail/${id}`)
         }
         else {
            if(re.result.msg){
              this.setState({
                msg:re.result.msg,
                isMsg:true,
               })
             }
             else {
              this.setState({
                msg:'设置时间失败！',
                isMsg:true,
              })
            }
         }
     }
   }

  handleClick = (item) => {
    if(item == 'start'){
      if(this.state.start_current){
        this.setState({
          start_current:false,
        })
      }
      else {
        this.setState({
          start_current:true,
        })
      }

    }
    else if (item == 'end') {
      if(this.state.end_current){
        this.setState({
          end_current:false,
        })
      }
      else {
        this.setState({
          end_current:true,
        })
      }
    }
  }

  _selectedDate(item){
    if(item == 'start'){
      this.setState({
        isOpen: true,
        flag:0,
        time:this.state.startTime,
      })
    }
    else if (item == 'end') {
      this.setState({
        isOpen: true,
        flag:1,
        time:this.state.endTime,
      })
    }
  }

    handleCancel = () => {
        this.setState({ isOpen: false });
    }

    handleSelect = (time) => {
        if(this.state.flag == 0){
          this.setState({ startTime:time, isOpen: false,startOn:true,});
        }
        else if (this.state.flag == 1) {
          this.setState({ endTime:time, isOpen: false,endOn:true,});
        }
    }

    //完成
    _complete(){
      //提示框,当开始时间跟结束时间的显示还是设置时，提示设置时间
      //开始时间
      var startTime = new Date(this.state.startTime).format('yyyy-MM-dd');
      //当天时间
      var currentTime = new Date().format('yyyy-MM-dd');
      //结束时间
      var endTime = new Date(this.state.endTime).format('yyyy-MM-dd');

      if(this.state.startOn == false || this.state.endOn == false){
        this.setState({
          msg:'请设置时间',
          isMsg:true,
        })
        return false;
      }
      else if(startTime < currentTime)
      {
        this.setState({
          msg:'开始时间不能早于今天哦~',
          isMsg:true,
        })
        return false;
       }
       else if (startTime > endTime) {
         this.setState({
           msg:'开始时间不能晚于结束时间哦~',
           isMsg:true,
         })
         return false;
       }

      Dispatcher.dispatch({
        actionType:'UpdatePlan',
        id:this.id,
        startTime:new Date(this.state.startTime).format(Common.YDATE),
        endTime:new Date(this.state.endTime).format(Common.YDATE),
        plan_title:this.name,//this.name
      })
    }

    _hideAlert(){
      this.setState({
        isMsg:false,
      })
    }

  render(){

    return(
      <div style={{...styles.container}}>
        <div style={{...styles.set_box,marginTop:15,fontSize:Fnt_Medium,color:Common.Light_Black}}>
          {this.name}
        </div>
        <div style={{...styles.set_box,marginTop:15,}}>
          <img src={Dm.getUrl_img('/img/v2/icons/remind@2x.png')} width={15} height={16} style={{float:'left',marginRight:10,marginTop:13,}}/>
          <div style={{fontSize:Fnt_Normal,color:Common.Black,float:'left'}}>计划开始时间</div>
        </div>
        {
          this.state.startOn ?
          <div style={{...styles.set_box,paddingLeft:40,color:Common.Activity_Text,fontSize:Fnt_Medium}} onClick={this._selectedDate.bind(this,'start')}>
               {new Date(this.state.startTime).format(Common.LDATE)}
               <img src={Dm.getUrl_img('/img/v2/icons/fold@2x.png')} width={8} height={14} style={{float:'right',marginRight:10,marginTop:13,}}/>
          </div>
          :
          <div style={{...styles.set_box,paddingLeft:40,color:Common.Black,fontSize:Fnt_Medium}} onClick={this._selectedDate.bind(this,'start')}>
               <span>设置</span>
               <img src={Dm.getUrl_img('/img/v2/icons/Unfolded@2x.png')} width={14} height={8} style={{float:'right',marginRight:10,marginTop:16,}}/>
          </div>
        }

        <div style={{...styles.set_box,marginTop:15,}}>
          <img src={Dm.getUrl_img('/img/v2/icons/remind@2x.png')} width={15} height={16} style={{float:'left',marginRight:10,marginTop:13,}}/>
          <div style={{fontSize:Fnt_Normal,color:Common.Black,float:'left'}}>计划结束时间</div>
        </div>
        {
          this.state.endOn ?
          <div style={{...styles.set_box,paddingLeft:40,color:Common.Activity_Text,fontSize:Fnt_Medium}} onClick={this._selectedDate.bind(this,'end')}>
               {new Date(this.state.endTime).format(Common.LDATE)}
               <img src={Dm.getUrl_img('/img/v2/icons/fold@2x.png')} width={8} height={14} style={{float:'right',marginRight:10,marginTop:13,}}/>
          </div>
          :
          <div style={{...styles.set_box,paddingLeft:40,color:Common.Black,fontSize:Fnt_Medium}} onClick={this._selectedDate.bind(this,'end')}>
               <span>设置</span>
               <img src={Dm.getUrl_img('/img/v2/icons/Unfolded@2x.png')} width={14} height={8} style={{float:'right',marginRight:10,marginTop:16,}}/>
          </div>
        }
        {/*
          this.state.endOn ?
          <div style={{...styles.set_box,paddingLeft:40,color:Common.Activity_Text,fontSize:Fnt_Medium}} onClick={this._selectedDate.bind(this,'end')}>
            {new Date(this.state.endTime).format(Common.LDATE)}
          </div>
          :
          null
        */}
        <div style={{marginTop:15,}}>
          <DatePicker
            value={this.state.time}
            isOpen={this.state.isOpen}
            onSelect={this.handleSelect}
            onCancel={this.handleCancel} />
        </div>
        <div style={{...styles.button_box}}>
          <div style={{...styles.btn_complete}} onClick={this._complete.bind(this)}>
            完成
          </div>
        </div>
        {/*弹框*/}
        <div style={{...Common.alertDiv,display:this.state.display}}>
          <div style={{marginBottom:14,paddingTop:15,height:30,}}>
            <img src={Dm.getUrl_img('/img/v2/icons/' + this.state.alert_icon)} width={this.state.icon_width} height={this.state.icon_height}/>
           </div>
           <span style={{color:Common.BG_White}}>{this.state.alert_title}</span>
        </div>

        <div style={{...styles.white_alert,paddingTop:-1,display:this.state.isMsg ? 'block':'none'}}>
          <div dangerouslySetInnerHTML={{__html: this.state.msg}} style={{ color: '#333',fontSize:Fnt_Normal,paddingTop:10,lineHeight:'20px'}}></div>
  				<div style={styles.alert_bottom}>
  					<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:17,color:Common.Activity_Text}}  onClick={this._hideAlert.bind(this)}>知道了</div>
  				</div>
  			</div>
        <div style={{...styles.mask,display:this.state.isMsg ? 'block':'none'}} onClick={this._hideAlert.bind(this)}></div>

      </div>
    )}

}

var styles ={
  container:{
    width:window.screen.width,
    position:'relative',
  },
  line:{
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#F4F4F4',
    width:window.screen.width,
    marginTop:25,
  },
  set_box:{
    height:43,
    lineHeight:'43px',
    padding:'0 12px',
    backgroundColor:Common.Bg_White,
    borderTopColor:'#E5E5E5',
    borderBottomColor:'#E5E5E5',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderTopStyle:'solid',
    borderBottomStyle:'solid',
  },
  button_box:{
    backgroundColor:Common.Bg_White,
    padding:'10px 0',
    width:window.screen.width,
    position:'fixed',
    zIndex:2,
    left:0,
    bottom:0,
  },
  btn_complete:{
    backgroundColor:'#2196F3',
    height:45,
    lineHeight:'45px',
    color:Common.Bg_White,
    fontSize:Fnt_Large,
    textAlign:'center',
    borderRadius:4,
    width:window.screen.width-30,
    marginLeft:15,
    border:'none',
  },
  white_alert:{
    width:270,
    height:104,
    backgroundColor:Common.Bg_White,
    borderRadius:12,
    position:'fixed',
    zIndex:1000,
    top:'40%',
    left:(window.screen.width-270)/2,
    textAlign:'center',
  },
  alert_bottom:{
    position:'absolute',
    zIndex:201,
    bottom:0,
    left:0,
    width:devWidth-100,
    height:42,
    borderTopStyle:'solid',
    borderTopWidth:1,
    borderTopColor:'#d4d4d4',
    display:'flex',
    flex:1,
  },
  mask:{
    width:window.screen.width,
    height:window.innerHeight,
    backgroundColor:'#000',
    opacity:0.2,
    position:'fixed',
    left:0,
    top:0,
    zIndex:99,
  }
}


export default SetDate;
