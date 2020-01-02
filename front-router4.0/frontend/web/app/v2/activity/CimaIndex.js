import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import ActivityAlert from './ActivityAlert';
import PolyvVideo from '../components/PolyvVideo';
import Common from '../Common';
import funcs from '../util/funcs'

var t;
var countdown;
var width = devWidth
class CimaIndex extends React.Component {
  constructor(props) {
      super(props);
      this.wx_config_share_home = {
  				title: 'CGMA全球管理会计高级经理人认证课程',
  				desc: '只为培养顶级商业领袖',
  				link: document.location.href + '',
  				imgUrl: Dm.getUrl_img('/img/v2/activity/cimaIndex.jpg'),
  				type: 'link'
  		}
      this.state={
        name:'',
        mobile:'',
        email:'',
        success:false,
        isShow:false,
        marginValue:0,
        video:null,
        videoShow:false,
        displayNum:0,
        player_show:true,
      }
      this.index = 0;
      this.data = ['cima_indexpic1.jpg','cima_indexpic2.jpg','cima_indexpic3.jpg','cima_indexpic4.jpg','cima_indexpic5.jpg','cima_indexpic6.jpg'];
      this.Silder = ['1','2','3','4','5','6']
  }
  _handleSpecialDone(){

  }
  componentDidMount(){

    Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
    Dispatcher.dispatch({
      actionType: 'PolySign',
      vid: '9b038edc8773e202d45b2c9ba7391295_9',
      catalog_id: null,
      isFree: true,
      resource_id: null,
    })
    countdown = setInterval(function(){
      var displayNum = this.state.displayNum
      if (displayNum == 5) {
        displayNum = 0
      }else {
        displayNum= displayNum+1
      }
			this.setState({
        displayNum: displayNum
      })
		}.bind(this), 2000);
    EventCenter.emit("SET_TITLE",'铂略财课-CGMA全球管理会计高级经理人认证课程');
    this._getSpecialDone = EventCenter.on('SpecialDone', this._handleSpecialDone.bind(this))
    this._getSign = EventCenter.on('PolySignDone', this._handleSign.bind(this))

  }

  componentWillMount(){

  }

  componentWillUnmount(){
    this._getSpecialDone.remove()
    this._getSign.remove()
    clearInterval(countdown);
    clearTimeout(t)
  }

  _player(){
    this.setState({
      player_show:false,
    },()=>{
      EventCenter.emit("InitPolyvPlayer")
    })

  }

  _handleSign(re) {
		if(re.result.length < 1 || this.state.isLogin == false) {
			return
		}

		this.video = {}
		this.video =
		Object.assign(
			{},
			this.video,
			re.result,
      {
				title_img: '',
				isFree: true,
				type: 'online_info',
				catalog_id: null,
				resource_id: null,
			 }
			)
		if (!this.video || !this.video.sign) {return}
		this.setState({
			video: null
		}, () => {
				this.setState({
					video: this.video,
					videoShow: true
				}, () => {

					// t = window.setTimeout(() => {
					// 	EventCenter.emit("InitPolyvPlayer")
					// }, 2000);
			})
		})
	}

  render(){
    var Silder = this.Silder.map((item,index)=>{
      var imageOne=this.data[index]
      var count = index + 1
      if (count == 6) {
        count = 0
      }
      var imageTwo = this.data[count]
      return(
        <div key={index} style={{width:width,display: this.state.displayNum == index ? 'block' : 'none'}}>
          <img height="150" width={width/2} src={Dm.getUrl_img('/img/v2/activity/'+imageOne)} style={{width:(devWidth-115)/2,marginRight:15,float:'left',height:devWidth*(314/750)}}/>
          <img height="150" width={width/2} src={Dm.getUrl_img('/img/v2/activity/'+imageTwo)} style={{width:(devWidth-115)/2,marginRight:15,float:'left',height:devWidth*(314/750)}}/>
        </div>
      )
    })
    return(
      <div style={{...styles.container}}>
        <div style={styles.nav}>
          <div style={{...styles.nav_box,lineHeight:'52px',...styles.nav_on}}>首页</div>
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
    <div style={{width:devWidth, height:devWidth*(3141/750),position:'relative',zIndex:1,marginTop:54,}}>
      <img src={Dm.getUrl_img('/img/v2/activity/cima_index1.jpg?t=20180130')} width={devWidth} height={devWidth/750*3141}/>
      <div style={{position:'absolute',zIndex:3,top:devWidth*(740/750),left:25,width:devWidth - 50,height:devWidth*(314/750)}}>
        <img src={Dm.getUrl_img('/img/v2/activity/cima_leftArrow.jpg')} style={{...styles.left_arrow,left:0,}} onClick={this.changePic.bind(this,1)}/>
        <img src={Dm.getUrl_img('/img/v2/activity/cima_rightArrow.jpg')} style={{...styles.left_arrow,right:0,}} onClick={this.changePic.bind(this,2)}/>

        <div style={{overflow:'hidden',width:devWidth,height:devWidth*(314/750),marginLeft:20,}}>
          <div ref={(picBox) => this.picBox = picBox} style={{marginLeft:this.state.marginValue}}>
          {Silder}
          </div>
        </div>
      </div>
    </div>

    <div style={{width:devWidth,height:devWidth/750*447,position:'relative'}}>
      <img src={Dm.getUrl_img('/img/v2/activity/cima_index2.jpg')} width={devWidth} height={devWidth/750*447} style={{position:'absolute',zIndex:2,left:0,top:0,}}/>
      <img src={Dm.getUrl_img('/img/v2/activity/cima_player.png')} width={devWidth - 75} height={devWidth/750*331} style={{...styles.msk_player,display:this.state.player_show ? 'block':'none'}} onClick={this._player.bind(this)}/>

      <div style={{position:'absolute',zIndex:3,marginTop:devWidth/750*30,paddingLeft:37,display:this.state.player_show ? 'none':'block'}}>
       <PolyvVideo video={this.state.video} videoShow={this.state.videoShow} width={devWidth - 75}
       height={devWidth/750*447 - (devWidth/750*40)*2}
       />
      </div>
    </div>
    <div style={{width:devWidth,height:devWidth*(452/750),}}>
      <img src={Dm.getUrl_img('/img/v2/activity/cima_index3.jpg')} width={devWidth} height={devWidth*(452/750)}/>
    </div>
    <div style={{width:devWidth,height:devWidth*(774/750),position:'relative',}}>
      <img src={Dm.getUrl_img('/img/v2/activity/cima_commonbg.jpg?t=20180130')} style={styles.form_bg}/>
      <input type='text' value={this.state.name} placeholder={'姓名'} onChange={this._onChangeName.bind(this)} style={styles.name_text}/>
      <input type='text' value={this.state.mobile} placeholder={'手机号码'} onChange={this._onChangeMobile.bind(this)}  style={{...styles.name_text,top:devWidth*(266/750),}}/>
      <input type='text' value={this.state.email} placeholder={'邮箱地址'} onChange={this._onChangeEmail.bind(this)} style={{...styles.name_text,top:devWidth*(364/750),}}/>
      <img src={Dm.getUrl_img('/img/v2/activity/btnSubimt.png')} style={styles.btnSubimt} onClick={this.onClickSubmit.bind(this)} />
    </div>

    <ActivityAlert success={this.state.success} isShow={this.state.isShow} title={this.state.title} />
    <div style={{width:devWidth,height:devHeight,backgroundColor:'#000',opacity:0.5,position:'absolute',zIndex:99,left:0,top:0.5,display:this.state.isShow ?'block':'none'}} onClick={this._hide.bind(this)}></div>
  </div>
    )
  }

  changePic(type){
    var displayNum = this.state.displayNum
    if (type==1) {
      if (displayNum == 0) {
        displayNum = 5
      }else {
        displayNum = displayNum -1
      }
    }
    if (type==2) {
      if (displayNum == 5) {
        displayNum = 0
      }else {
        displayNum = displayNum + 1
      }
    }
    this.setState({
      displayNum: displayNum
    })
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
    width:devWidth,
    height:window.innerHeight,
    overflowX: 'hidden',
  },
  nav:{
    width:devWidth,
    height:54,
    textAlign:'center',
    backgroundColor:'#526669',
    overflow:'hidden',
    position:'absolute',
    zIndex:10,
    top:0,
    left:0,
  },
  nav_box:{
    float:'left',
    width:devWidth/6,
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
    width:devWidth,
    height:devWidth*(774/750),
    position:'absolute',
    left:0,
    top:0,
    zIndex:2,
  },
  name_text:{
    position:'absolute',
    zIndex:3,
    width:devWidth - 183,
    paddingLeft:15,
    top:devWidth*(172/750),
    left:devWidth/750*220,
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
    width:devWidth-devWidth/750*250*2,
    height:devWidth*(53/750),
    top:devWidth*(449/750),
    marginLeft:devWidth/750*250,
  },
  left_arrow:{
    position:'absolute',
    zIndex:5,
    width:devWidth*(21/750),
    height:devWidth*(26/750),
    top:devWidth*(150/750),
  },
  msk_player:{
    position:'absolute',
    zIndex:3,
    left:37,
    top:devWidth/750*30
  }

}

export default CimaIndex;
