import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import ActivityAlert from './ActivityAlert';
import funcs from '../util/funcs'

var t;
class CimaLearningMethod extends React.Component {
  constructor(props) {
      super(props);
      this.wx_config_share_home = {
  				title: '反转教学·互联网时代下国际领先的教学方式',
  				desc: '每天30MIN，离成为商业领袖更近一点',
  				link: document.location.href + '',
  				imgUrl: Dm.getUrl_img('/img/v2/activity/cimaLearn.jpg'),
  				type: 'link'
  		}
      this.state={
        name:'',
        mobile:'',
        email:'',
        success:false,
        isShow:false,
      }
  }
  _handleSpecialDone(){

  }
  componentDidMount(){
    Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

    EventCenter.emit("SET_TITLE",'铂略财课-反转教学·互联网时代下国际领先的教学方式');
    this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
  }

  componentWillMount(){

  }

  componentWillUnmount(){
    this._getSpecialDone.remove()
    clearTimeout(t)
  }

  render(){

    return(
      <div style={{...styles.container}}>
        <div style={styles.nav}>
        <Link to={`${__rootDir}/activity/CimaIndex20170621`}>
          <div style={{...styles.nav_box,lineHeight:'52px',}}>首页</div>
        </Link>
        <Link to={`${__rootDir}/activity/CimaCourse20170621`}>
          <div style={{...styles.nav_box,}}>
            <div style={{paddingTop:4}}>课程</div>
            <div>特色</div>
          </div>
        </Link>
        <Link to={`${__rootDir}/activity/CimaAuthority20170622`}>
          <div style={{...styles.nav_box,}}>
            <div style={{paddingTop:4}}>巨擘</div>
            <div>分享</div>
          </div>
         </Link>
          <div style={{...styles.nav_box,...styles.nav_on}}>
            <div style={{paddingTop:4}}>学习</div>
            <div>方式</div>
          </div>
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

        <div style={{width:window.screen.width,height:window.screen.width*(2362/750),marginTop:54}}>
          <img src={Dm.getUrl_img('/img/v2/activity/cima_learn.jpg?t=20180130')} width={window.screen.width} height={window.screen.width*(2362/750)}/>
        </div>
        <div style={{width:window.screen.width,height:window.screen.width*(774/750),position:'relative',}}>
          <img src={Dm.getUrl_img('/img/v2/activity/cima_commonbg.jpg')} style={styles.form_bg}/>
          <input type='text' value={this.state.name} placeholder={'姓名'} onChange={this._onChangeName.bind(this)} style={styles.name_text}/>
          <input type='text' value={this.state.mobile} placeholder={'手机号码'} onChange={this._onChangeMobile.bind(this)}  style={{...styles.name_text,top:window.screen.width*(266/750),}}/>
          <input type='text' value={this.state.email} placeholder={'邮箱地址'} onChange={this._onChangeEmail.bind(this)} style={{...styles.name_text,top:window.screen.width*(364/750),}}/>
          <img src={Dm.getUrl_img('/img/v2/activity/btnSubimt.png')} style={styles.btnSubimt} onClick={this.onClickSubmit.bind(this)} />
        </div>

        <ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
        <div style={{width:window.screen.width,height:window.innerHeight,backgroundColor:'#000',opacity:0.5,position:'absolute',zIndex:99,left:0,top:0.5,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
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

  _hide(){
    this.setState({
      isShow:false,
      success:false,
      name:'',
      mobile:''
    })
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


}

export default CimaLearningMethod;
