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

var countdown
class QuesLabelSelection extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      checkNum:null,
      //是否匿名
      isAnonymous:false,
      isChoose:false,
      QuestionLabel:[],
      checkData:[],
      labelData:[],
      isPhone: false,
      phoneHeight: 50,
      callbackNum: 0,
      phone:'',
      questionCallback: false,
      isShow: false,
      alertTitie:'提示',
      alertContext: '',
      alertButton:false,
      salesInfo:{},
      isShowErr: false,
      canUseQuestionCallback: false,
      questionId:'',
      isNoPhone: false,
      isShowErrContext:''
    }

    this.data=[]

    this.type
  }

  componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'QuestionLabel',
      // topic_id: re
    })
  }
  _handleQuestionLabelDone(re){
    var result = re.result || []
    for (var i = 0; i < result.length; i++) {
      this.data.push[false]
    }
    this.setState({
      QuestionLabel: result,
      checkData: this.data
    })
    // console.log('_handleQuestionLabelDone',re);
  }
  _handleInsertQuestion(re) {
    console.log('_handleInsertQuestion',re)
    if(re.result.result) {
      if (this.state.questionCallback) {
        this.setState({
          isShow: true,
          questionId: re.result.result.id
        })
      }else {
         this.props.history.push(`${__rootDir}/QaDetail/${re.result.result.id}`)
      }
      this.setState({
        // isShow: true
      },()=>{

      })
      // this.props.history.go(-2)
      return
    } else {
      if (re.result.err.errCode == 201) {
        this.setState({
          isShowErr: true,
          isShowErrContext:'您的电话预约专家诊断次数已用完，如需继续使用，请您联系铂略'
        })
      }
      // alert(re.result.err.errCode)
      return
    }
  }
  _handlequestionCallbackUserInfoDone(e){
    // console.log('_handlequestionCallbackUserInfoDone',e);
    if (e.err) {
      return false
    }
    var result =  e.result
    if (e.result) {
      this.setState({
        callbackNum: result.callbackNum || 0,
        phone: result.phone,
        salesInfo: result.salesInfo,
        canUseQuestionCallback: result.canUseQuestionCallback
      })
    }

  }
  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-问题标签选择');
    this._QuestionLabel = EventCenter.on('QuestionLabelDone',this._handleQuestionLabelDone.bind(this));
    this.isInsert = EventCenter.on('AddQuestionDone', this._handleInsertQuestion.bind(this))
    this._questionCallbackUserInfo = EventCenter.on('questionCallbackUserInfoDone',this._handlequestionCallbackUserInfoDone.bind(this))
    // console.log('this.props.location.state.type===',this.props.location.state.type);
    if(this.props.location.state.type == 'online') {
      this.type = 2
    } else if(this.props.location.state.type == 'live') {
      this.type = 1
    } else if(this.props.location.state.type == 'offline') {
      this.type = 3
    }
    Dispatcher.dispatch({
      actionType: 'questionCallbackUserInfo',
      // topic_id: re
    })
  }
  cancel(){
    this.setState({
      isShow: false
    })
  }
  componentWillUnmount() {
    this._QuestionLabel.remove()
    this.isInsert.remove()
    this._questionCallbackUserInfo.remove()
  }

  render(){
    var QuestionLabel =  this.state.QuestionLabel.map((item,idx)=>{
        var bg_color='#E3F1FC';
        var text_color=Common.Black;

        if(this.state.checkData[idx]){
          // console.log('this.state.checkNum',this.state.checkNum);
          bg_color = Common.Activity_Text;
          text_color = Common.Bg_White;
          // console.log('text_color',text_color);
        }

        var tag = {
          backgroundColor:bg_color,
          color:text_color,
          height:30,
          lineHeight:'30px',
          paddingLeft:15,
          paddingRight:15,
          fontSize:Fnt_Small,
          borderRadius:2,
          marginRight:20,
          marginBottom:20,
          wordBreak: 'break-all',
          float:'left',
        };

      return(
        <div style={tag} key={idx} onClick={this.ChooseLabel.bind(this,idx)}>
          {item.name}
        </div>
      )
    })
    return(
      <div style={{...styles.container}}>
        <div style={styles.label_box}>
          {QuestionLabel}
          <div style={{width:devWidth,position:'relative',bottom:10,height:25,float:'right'}}>
            <span style={{fontSize:14,color:'#A4A4A4',fontFamily:'PingFangSC-Regular',letterSpacing:'-0.34px',position:'absolute',right:25}}>最多可添加3个话题</span>
          </div>
        </div>
        <div style={{...styles.phone,marginTop:20,height:this.state.phoneHeight}}>
          <div style={{position:'absolute',top:14,left:20}}>
            <span style={{...styles.phone_text}}>电话预约专家诊断</span>
          </div>
          <img src={Dm.getUrl_img('/img/v2/icons/hyzx1@2x.png')} style={{position:'absolute',top:-8,left:14}} width={81} height={24} />
          <div style={{position:'absolute',top:34,left:20,display:this.state.isPhone ? 'block':'none'}}>
            <span style={{fontSize:11,color:'#f37633',letterSpacing:0,fontFamily:'PingFangSC-regular'}}>目前剩余可用服务{this.state.callbackNum}次</span>
          </div>
          <div style={{position:'absolute',left:160,top:12}}>
            <span style={{fontSize:12,fontFamily:'PingFangSC-Regular',color:'#999999',letterSpacing:0,}}>48小时内电话答疑</span>
          </div>
          <div style={{position:'absolute',top:16,right:20,}}>
            <div style={{float:'right',marginLeft:10,}} onClick={this.Is_Phone.bind(this)}>
              {
                this.state.isPhone?
                <img src={Dm.getUrl_img('/img/v2/icons/is_anonymous@2x.png')} width={41} height={24} />
                :
                <img src={Dm.getUrl_img('/img/v2/icons/not_anonymous@2x.png')} width={41} height={24} />
              }
            </div>
          </div>
        </div>
        <div style={{...styles.phone,display:this.state.isPhone ? 'block':'none'}}>
          <div style={{...styles.line,marginLeft:19}}></div>
          <div style={{position:'absolute',top:14,left:20}}>
            <span style={{...styles.phone_text}}>手机</span>
          </div>
          <div style={{position:'absolute',top:16,right:20,}}>
            {
              this.state.phone ?
                <span style={{...styles.phone_num}}>{this.state.phone}</span>
              :
                <div>
                  <Link to={`${__rootDir}/BindPhoneNumber`}>
                    <span style={{...styles.phone_num,marginRight:12}}>绑定手机</span>
                    <img src={Dm.getUrl_img('/img/v2/icons/right@2x.png')} width={7} height={12} />
                  </Link>
                </div>

            }
          </div>
        </div>
        <div style={{width:devWidth-24, padding: '5px 12px', lineHeight: 1}}>
          <span style={{...styles.phoneSet}}>设置电话预约专家诊断后，问题细节将对他人隐藏，邀请讲师与分享功能将关闭。</span>
        </div>
        <div style={{...styles.phone,marginTop:30}}>
          <div style={{position:'absolute',top:14,left:20}}>
            <span style={{...styles.phone_text}}>匿名提问</span>
          </div>
          <div style={{position:'absolute',top:16,right:20,}}>
            <div style={{float:'right',marginLeft:10,}} onClick={this.Is_anonymous.bind(this)}>
              {
                this.state.isAnonymous?
                <img src={Dm.getUrl_img('/img/v2/icons/is_anonymous@2x.png')} width={41} height={24} />
                :
                <img src={Dm.getUrl_img('/img/v2/icons/not_anonymous@2x.png')} width={41} height={24} />
              }
            </div>
          </div>
        </div>
        <div style={{...styles.btn_box}}>
         {
            this.state.isChoose ?
            <button onClick={this.submit.bind(this)}  style={{...styles.btn_button,backgroundColor:Common.Activity_Text,color:Common.Bg_White}} disabled={false}>提交</button>
            :
            <button style={{...styles.btn_button}} disabled={true}>提交</button>
          }
        </div>
        <div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
				<div style={{...styles.alert,display:this.state.isShow ?'block':'none'}}>
					<div style={{width:270,textAlign:'center',marginTop:17}}>
						<span style={{fontFamily:'PingFangSC-Medium',fontSize:17,color:'#030303',letterSpacing:'-0.41px'}}>{this.state.alertTitie}</span>
					</div>
					<div style={{lineHeight:'16px'}}>
						<div style={{width:256,marginLeft:12}}>
							<span style={{fontFamily:'PingFangSC-Regular',fontSize:13,color:'#030303',letterSpacing:'-0.31px'}}>我们将于48小时内安排专业老师为您提供</span>
						</div>
            <div style={{width:270,textAlign:'center'}}>
              <span style={{fontFamily:'PingFangSC-Regular',fontSize:13,color:'#030303',letterSpacing:'-0.31px'}}>电话解答服务，届时请保持电话畅通。</span>
            </div>
					</div>
					<div style={{...styles.line,marginTop:8}}></div>
					<div style={{width:270,textAlign:'center',height:45,lineHeight:3}} onClick={this.goBackkk.bind(this)}>
						<span style={{fontFamily:'PingFangSC-Regular',fontSize:17,color:'#0076ff',letterSpacing:'-0.41px',}}>知道了</span>
					</div>
				</div>
        <div style={{...styles.zzc,display:this.state.isShowErr ?'block':'none'}}></div>
        <div style={{...styles.alert,display:this.state.isShowErr ?'block':'none'}}>
          <div style={{width:270,textAlign:'center',marginTop:17}}>
            <span style={{fontFamily:'PingFangSC-Medium',fontSize:17,color:'#030303',letterSpacing:'-0.41px'}}>提示</span>
          </div>
          <div style={{lineHeight:'16px'}}>
            <div style={{width:244,height:28,marginLeft:12}}>
              <span style={{fontFamily:'PingFangSC-Regular',fontSize:13,color:'#030303',letterSpacing:'-0.31px'}}>
                {this.state.isShowErrContext}
                {
                  this.state.salesInfo.name ?
                    <span>产品顾问{this.state.salesInfo.name}</span>
                    :
                    <span>
                      客服
                    </span>
                }
              </span>
            </div>
          </div>
          <div style={{...styles.line,width:270, marginTop:14}}></div>
          {
            this.state.salesInfo.name ?
            <div style={{width:270,textAlign:'center',height:45,lineHeight:3}} onClick={this.cancelErr.bind(this)}>
              <span style={{fontFamily:'PingFangSC-Regular',fontSize:17,color:'#0076ff',letterSpacing:'-0.41px',}}>知道了</span>
            </div>
            :
            <div>
              <div style={{width:270/2,textAlign:'center',height:45,lineHeight:3,float:'left'}} onClick={this.cancelErr.bind(this)}>
                <span style={{fontFamily:'PingFangSC-Regular',fontSize:17,color:'#0076ff',letterSpacing:'-0.41px',}}>知道了</span>
              </div>
              <div style={{width:270/2,textAlign:'center',height:45,lineHeight:3,float:'left',backgroundColor:'#2196f3',borderBottomRightRadius:12}} onClick={this._applyVoucher.bind(this)}>
                <span style={{fontFamily:'PingFangSC-Regular',fontSize:17,color:'#FFFFFF',letterSpacing:'-0.41px',}}>联系客服</span>
              </div>
            </div>
          }

        </div>
        <div style={{...styles.zzc,display:this.state.isNoPhone ?'block':'none'}}></div>
        <div style={{...styles.alert,display:this.state.isNoPhone ?'block':'none'}}>
          <div style={{width:270,textAlign:'center',marginTop:17}}>
            <span style={{fontFamily:'PingFangSC-Medium',fontSize:17,color:'#030303',letterSpacing:'-0.41px'}}>{this.state.alertTitie}</span>
          </div>
          <div style={{lineHeight:'16px',height:30,marginTop:6}}>
            <div style={{width:256,textAlign:'center'}}>
              <span style={{fontFamily:'PingFangSC-Regular',fontSize:13,color:'#030303',letterSpacing:'-0.31px'}}>请先绑定手机号</span>
            </div>
          </div>
          <div style={{...styles.line,marginTop:8,width:270}}></div>
          <div style={{width:270,textAlign:'center',height:45,lineHeight:3}} onClick={this.cancelErr.bind(this)}>
            <span style={{fontFamily:'PingFangSC-Regular',fontSize:17,color:'#0076ff',letterSpacing:'-0.41px',}}>知道了</span>
          </div>
        </div>
      </div>
    )
  }
  cancelErr(){
    this.setState({
      isShowErr: false,
      isNoPhone: false
    })
  }
  goBackkk(){
    this.props.history.push(`${__rootDir}/QaDetail/${this.state.questionId}`)
  }
  _applyVoucher(){
    if(isWeiXin){
      this.props.history.push({pathname: `${__rootDir}/freeInvited`})
    }else {
      window.location.href='https://chat.live800.com/live800/chatClient/chatbox.jsp?companyID=330913&configID=125841&jid=2077907427&s=1';
    }
  }
  ChooseLabel(index){
    var checkNumber = 0
    var number = 0
    var labelData = []
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i]) {
        checkNumber = checkNumber + 1
      }
      if (checkNumber >= 3 && !this.data[index]) {
        return
      }
    }
    if (checkNumber < 3) {
      this.data[index] = !this.data[index]
    }else if (checkNumber = 3) {
      if (!this.data[index]) {
        return
      }else {
        this.data[index] = !this.data[index]
      }
    }
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i]) {
        var labels = {
          id:this.state.QuestionLabel[i].id,
          name: this.state.QuestionLabel[i].name
        }
        labelData.push(labels)
        number = number + 1
      }
    }
    // console.log('labelData',labelData);
    this.setState({
      checkData: this.data,
      isChoose: number >= 1 &&  number <= 3 ? true : false,
      labelData: labelData
    })
  }

  Is_anonymous(){
    if(this.state.isAnonymous){
      this.setState({
        isAnonymous:false,
      })
    }
    else {
      this.setState({
        isAnonymous:true,
      })
    }
  }
  Is_Phone(){
    if (this.state.canUseQuestionCallback) {
      if (this.state.callbackNum == 0) {
        this.setState({
          isShowErr: true,
          isShowErrContext:'您的电话预约专家诊断次数已用完，如需继续使用，请您联系铂略'
        })
        return false
      }
      if(this.state.isPhone){
        this.setState({
          isPhone:false,
          phoneHeight: 50,
          questionCallback: false
        })
      }
      else {
        this.setState({
          isPhone:true,
          phoneHeight: 70,
          questionCallback: true
        })
      }
    }else {
      this.setState({
        isShowErr: true,
        isShowErrContext:'本功能为尊贵会员专享，如需尊享此服务，请您联系铂略'
      })
    }

  }
  submit(re){
    // console.log('submiy===',this.state.checkData);
    if (this.state.questionCallback && !this.state.phone) {
      this.setState({
        isNoPhone: true,
      })
    }
    Dispatcher.dispatch({
      actionType: 'AddQuestion',
      resource_id:this.props.location.state.id ? this.props.location.state.id : '',
      title: this.props.location.state.answerTitle || '',
      content: this.props.location.state.answerContent || '',
      type: this.type ? this.type : '',
      label: this.state.labelData,
      anonymous: this.state.isAnonymous ? 1 : 0,
      questionCallback: this.state.questionCallback
    })
  }
}

var styles ={
  container:{
    height:window.innerHeight,
  },
  label_box:{
    paddingLeft:15,
    paddingTop:20,
    backgroundColor:Common.Bg_White,
    overflow:'hidden',
    // height:window.innerHeight-178,
    overflowY:'auto',
  },
  label:{
    backgroundColor:'#E3F1FC',
    color:Common.Black,
    height:30,
    lineHeight:'30px',
    paddingLeft:15,
    paddingRight:15,
    fontSize:Fnt_Small,
    borderRadius:2,
    marginRight:20,
    marginBottom:20,
    wordBreak: 'break-all',
    float:'left',
  },
  btn_box:{
    marginTop:40,
    backgroundColor:Common.Bg_White,
    paddingTop:10,
    paddingBottom:10,
  },
  btn_button:{
    width:window.screen.width-32,
    marginLeft:16,
    height:45,
    lineHeight:'45px',
    color:Common.Bg_White,
    fontSize:Fnt_Large,
    textAlign:'center',
    border:'none',
    borderRadius:4,
  },
  phone:{
    width: devWidth,
    backgroundColor: Common.Bg_White,
    height: 50,
    position: 'relative',
  },
  phone_text:{
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333333',
    letterSpacing: 0,
  },
  phone_num:{
    fontSize: 16,
    fontFamily: 'PingFangSC-regular',
    color: '#999999',
    letterSpacing: 0,
  },
  phoneSet:{
    fontSize: 11,
    color: '#999999',
    fontFamily: 'PingFangSC-regular',
    letterSpacing: '-0.27px',
    textAlign: 'left',
    // lineHeight: 12,
  },
  line:{
    width:devWidth-35,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4',
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
  alert:{
    width: 270,
    height: 131,
    backgroundColor:'#FFFFFF',
    borderRadius: '12px',
    position: 'absolute',
    left: (devWidth-270)/2,
    top: 190,
    zIndex: 999,
  },
  // line:{
  //   width:270,
  //   height:1,
  //   backgroundColor:'#D8D8D8',
  //   // marginLeft:20,
  //   // marginTop:8,
  //   // marginBottom: 8,
  // },
}


export default QuesLabelSelection;
