import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import funcs from '../util/funcs'
import ActivityAlert from './ActivityAlert';

var t;
class CimaCourse extends React.Component {
  constructor(props) {
      super(props);
      this.wx_config_share_home = {
  				title: 'CGMA全球管理会计高级经理人认证课程',
  				desc: '顶级国际师资·国际教学资源·高端增值服务',
  				link: document.location.href + '',
  				imgUrl: Dm.getUrl_img('/img/v2/activity/cimaCourse.jpg'),
  				type: 'link'
  		}


      this.state={
        name:'',
        mobile:'',
        email:'',
        success:false,
        isShow:false,
        photoIndex:0,
      }
  }
  _handleSpecialDone(){

  }
  componentDidMount(){
    Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

    EventCenter.emit("SET_TITLE",'铂略财课-CGMA全球管理会计高级经理人认证课程');
    this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
  }

  componentWillMount(){

  }

  componentWillUnmount(){
    this._getSpecialDone.remove()
    clearTimeout(t)
  }

  changePhoto(index){
    this.setState({
      photoIndex:index,
    })
  }

  render(){

    return(
      <div style={{...styles.container}}>
        <div style={styles.nav}>
        <Link to={`${__rootDir}/activity/CimaIndex20170621`}>
          <div style={{...styles.nav_box,lineHeight:'52px',}}>首页</div>
        </Link>

          <div style={{...styles.nav_box,...styles.nav_on}}>
            <div style={{paddingTop:4}}>课程</div>
            <div>特色</div>
          </div>
        <Link to={`${__rootDir}/activity/CimaAuthority20170622`}>
          <div style={{...styles.nav_box,}}>
            <div style={{paddingTop:4}}>巨擘</div>
            <div>分享</div>
          </div>
         </Link>
         <Link to={`${__rootDir}/activity/CimaLearningMethod20170622`}>
           <div style={{...styles.nav_box}}>
             <div style={{paddingTop:4}}>学习</div>
             <div>方式</div>
           </div>
         </Link>
         <Link to={`${__rootDir}/activity/AboutCima20170622`}>
           <div style={{...styles.nav_box}}>
             <div style={{paddingTop:4}}>关于</div>
             <div>CIMA</div>
           </div>
         </Link>
         <Link to={`${__rootDir}/activity/AboutBolue20170622`}>
           <div style={{...styles.nav_box}}>
             <div style={{paddingTop:4}}>关于</div>
             <div>铂略</div>
           </div>
         </Link>
        </div>
        {/*--nav end--*/}

        <div style={{width:window.screen.width,height:window.screen.width/750*1128,marginTop:54}}>
          <img src={Dm.getUrl_img('/img/v2/activity/cima_course1.jpg?t=20180130')} width={window.screen.width} height={window.screen.width/750*1128}/>
        </div>
        <div style={{width:window.screen.width,height:window.screen.width/750*629,position:'relative'}}>
          <img src={Dm.getUrl_img('/img/v2/activity/course_big1.jpg')} width={window.screen.width} height={window.screen.width/750*629} style={{position:'absolute',left:0,top:0,zIndex:this.state.photoIndex==0 ? 4 : 1,}}/>
          <img src={Dm.getUrl_img('/img/v2/activity/course_big2.jpg')} width={window.screen.width} height={window.screen.width/750*629} style={{position:'absolute',left:0,top:0,zIndex:this.state.photoIndex==1 ? 4 : 1,}}/>
          <img src={Dm.getUrl_img('/img/v2/activity/course_big3.jpg')} width={window.screen.width} height={window.screen.width/750*629} style={{position:'absolute',left:0,top:0,zIndex:this.state.photoIndex==2 ? 4 : 1,}}/>
          <div style={styles.small_bg}>
            <div onClick={this.changePhoto.bind(this,0)} style={{...styles.small_relative,}}>
              <img src={Dm.getUrl_img('/img/v2/activity/course_small1.jpg')} width={window.screen.width/750*107} height={window.screen.width/750*157}/>
              <div style={{...styles.msk_black,opacity:this.state.photoIndex == 0 ? 0 : 0.3,}}></div>
            </div>
            <div onClick={this.changePhoto.bind(this,1)} style={{...styles.small_relative,marginLeft:window.screen.width/750*35}}>
              <img src={Dm.getUrl_img('/img/v2/activity/course_small2.jpg')} width={window.screen.width/750*107} height={window.screen.width/750*157}/>
              <div style={{...styles.msk_black,opacity:this.state.photoIndex == 1 ? 0 : 0.3,}}></div>
            </div>
            <div onClick={this.changePhoto.bind(this,2)} style={{...styles.small_relative,marginLeft:window.screen.width/750*35}}>
              <img src={Dm.getUrl_img('/img/v2/activity/course_small3.jpg')} width={window.screen.width/750*107} height={window.screen.width/750*157}/>
              <div style={{...styles.msk_black,opacity:this.state.photoIndex == 2 ? 0 : 0.3,}}></div>
            </div>
          </div>
        </div>
        <div style={{width:window.screen.width,height:window.screen.width/750*1684,}}>
          <img src={Dm.getUrl_img('/img/v2/activity/cima_course2.jpg')} width={window.screen.width} height={window.screen.width/750*1684}/>
        </div>
        <div style={{width:window.screen.width,height:window.screen.width*(774/750),position:'relative',}}>
          <img src={Dm.getUrl_img('/img/v2/activity/cima_commonbg.jpg')} style={styles.form_bg}/>
          <input type='text' value={this.state.name} placeholder={'姓名'} onChange={this._onChangeName.bind(this)} style={styles.name_text}/>
          <input type='text' value={this.state.mobile} placeholder={'手机号码'} onChange={this._onChangeMobile.bind(this)}  style={{...styles.name_text,top:window.screen.width*(266/750),}}/>
          <input type='text' value={this.state.email} placeholder={'邮箱地址'} onChange={this._onChangeEmail.bind(this)} style={{...styles.name_text,top:window.screen.width*(364/750),}}/>
          <img src={Dm.getUrl_img('/img/v2/activity/btnSubimt.png')} style={styles.btnSubimt} onClick={this.onClickSubmit.bind(this)} />
        </div>

        <ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
        <div style={{width:devWidth,height:devHeight,backgroundColor:'#000',opacity:0.5,position:'absolute',zIndex:99,left:0,top:0.5,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
      </div>
    )
  }

  //输入姓名
  _onChangeName(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    if(this.state.name && input_text.length>0){
      this.setState({
        name:input_text,
      });
    }
    else {
      this.setState({
        name:input_text,
      });
    }
  }

  //输入手机号
  _onChangeMobile(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    if(this.state.mobile && input_text.length>0){
      this.setState({
        mobile:input_text,
      });
    }
    else {
      this.setState({
        mobile:input_text,
      });
    }
  }

  //输入邮箱
  _onChangeEmail(e){
    e.preventDefault();
    var input_text = e.target.value.trim();
    this.setState({
      email:input_text,
    });
  }

  _hide(){
    this.setState({
      isShow:false,
      success:false,
      name:'',
      mobile:''
    })
  }

  //提示框
  onIsShow(re){
    this.setState({
      isShow: true,
      title: re
    },()=>{
      t = setTimeout(() => {
        this.setState({
          isShow: false,
        })
      }, 1000)
    })
  }
  //注册
  onClickSubmit(){
    if (!this.state.name) {
        this.onIsShow('姓名不能为空')
      return
    }
    if (!this.state.mobile) {
      this.onIsShow('手机号不能为空')
      return
    }

    if(!isCellPhoneAvailable(this.state.mobile)){
      this.onIsShow('请输入正确的手机号码')
      return
    }


    Dispatcher.dispatch({
      actionType: 'Special',
      name:this.state.name,
      email:this.state.email,
      phone: this.state.mobile,
      isCima:true,
      url: document.location.href + '',
      title:'学CIMA（移动端）',
    });
  }

  _handleSpecialDone(re){
    if(re.result){
      this.setState({
        success: true,
        isShow: true,
        title:'您的申请已经成功提交稍后将会有工作人员与您联系',
      });
    }
    if(re.err){
      this.setState({
        isShow: true,
        title:re.err
      });
    }
  }

}

var styles ={
  container:{
    width:window.screen.width,
    height:window.innerHeight,
    overflowX: 'hidden',
  },
  nav:{
    width:window.screen.width,
    height:54,
    textAlign:'center',
    backgroundColor:'#526669',
    overflow:'hidden',
    position:'absolute',
    top:0,
    left:0,
    zIndex:99,
  },
  nav_box:{
    float:'left',
    width:window.screen.width/6,
    color:'#fff',
    fontSize:14,
    height:52,
    borderBottomWidth:2,
    borderBottomColor:'#526669',
    borderBottomStyle:'solid',
  },
  nav_on:{
    borderBottomColor:'#ff6131',
    backgroundColor:'#46595c'
  },
  form_bg:{
    width:window.screen.width,
    height:window.screen.width*(774/750),
    position:'absolute',
    left:0,
    top:0,
    zIndex:2,
  },
  name_text:{
    position:'absolute',
    zIndex:3,
    width:window.screen.width - 183,
    paddingLeft:15,
    top:window.screen.width*(172/750),
    left:window.screen.width/750*220,
    backgroundColor:'transparent',
    height:20,
    lineHeight:'20px',
    border:'none',
    fontSize:12,
    color:'#fff',
  },
  btnSubimt:{
    position:'absolute',
    zIndex:4,
    width:window.screen.width-window.screen.width/750*250*2,
    height:window.screen.width*(53/750),
    top:window.screen.width*(449/750),
    marginLeft:window.screen.width/750*250,
  },
  small_bg:{
    position:'absolute',
    zIndex:10,
    bottom:0,
    right:window.screen.width/750*68,
    width:window.screen.width/750*395,
    height:window.screen.width/750*157,
  },
  small_relative:{
    width:window.screen.width/750*107,
    height:window.screen.width/750*157,
    float:'left',
    position:'relative'
  },
  msk_black:{
    width:window.screen.width/750*107,
    height:window.screen.width/750*157,
    backgroundColor:'#000',
    position:'absolute',
    zIndex:20,
    top:0,
  }

}

export default CimaCourse;
