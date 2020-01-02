import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';




class PgAnserByPhone extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      phone:'',
      callbackNum: 0,
			isShow: false,
			isPhoneShow: false,
			salesInfo:{},
		};

	}

  componentWillMount() {


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
				salesInfo: result.salesInfo
      })
    }
  }
	_handlepostQuestionCallbackDone(re){
		if (re.err) {
			this.setState({
				isPhoneShow: true
			})
		}
		if (re.result) {
			this.setState({
				isShow: true,
			})
		}
	}
	_toback(){
		this.setState({
			isShow: false,
			isPhoneShow: false,
		},()=>{
			this.props.history.push({pathname:`${__rootDir}/QaDetail/${this.props.match.params.id}`});
		})
	}
	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-设置电话预约专家诊断');
    this._questionCallbackUserInfo = EventCenter.on('questionCallbackUserInfoDone',this._handlequestionCallbackUserInfoDone.bind(this))
		this._postQuestionCallback = EventCenter.on('postQuestionCallbackDone',this._handlepostQuestionCallbackDone.bind(this))

    Dispatcher.dispatch({
      actionType: 'questionCallbackUserInfo',
    })
	}
	componentWillUnmount() {
    this._questionCallbackUserInfo.remove()
		this._postQuestionCallback.remove()
	}
	ButtomSubmit(){
		Dispatcher.dispatch({
      actionType: 'postQuestionCallback',
			callbackType: 0,
			questionId: this.props.match.params.id,
    })
	}
	render(){

    return(
			<div style={{...styles.div}}>
        <div style={{...styles.top}}>

        </div>
        <div style={{...styles.second}}>
          <img src={Dm.getUrl_img('/img/v2/icons/phone@2x.png')} style={{position:'absolute',top:16,left:12}} width={15} height={19} />
          <div style={{position:'absolute',top:14,left:39}}>
            <span style={{...styles.font,fontSize:16,color:'#333333',letterSpacing:0}}>手机</span>
          </div>
          <div style={{position:'absolute',top:14,right:30,}}>
						{
							this.state.phone ?
							<span style={{...styles.font,color:'#999999',fontSize:16,letterSpacing:0}}>{this.state.phone}</span>
							:
							<Link to={`${__rootDir}/BindPhoneNumber`}>
								<span style={{...styles.font,color:'#999999',fontSize:16,letterSpacing:0}}>绑定手机</span>
							</Link>
						}
          </div>
        </div>
        <div style={{...styles.three}}>
          <div style={{width:devWidth,marginTop:12}}>
            <span style={{...styles.font,color:'#f37633',letterSpacing:0,marginLeft:12}}>目前剩余可用服务{this.state.callbackNum}次</span>
          </div>
          <div style={{width:devWidth-24, padding: '0 12px'}}>
            <span style={{...styles.font,color:'#999999',letterSpacing:'-0.27px'}}>设置电话预约专家诊断后，问题细节将对他人隐藏，邀请讲师与分享功能将关闭。</span>
          </div>
        </div>
        <div style={{...styles.four}} onClick={this.ButtomSubmit.bind(this)}>
          <div style={{...styles.button}}>
            <span style={{...styles.buttonFont}}>提交</span>
          </div>
        </div>
				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
				<div style={{...styles.alert,display:this.state.isShow ?'block':'none'}}>
					<div style={{width:270,textAlign:'center',marginTop:17}}>
						<span style={{fontFamily:'PingFangSC-Medium',fontSize:17,color:'#030303',letterSpacing:'-0.41px'}}>设置成功</span>
					</div>
					<div style={{lineHeight:'12px'}}>
						<div style={{width:270,textAlign:'center'}}>
							<span style={{fontFamily:'PingFangSC-Regular',fontSize:13,color:'#030303',letterSpacing:'-0.31px'}}>我们将于48小时内安排专业老师为您提供</span>
						</div>
						<div style={{width:270,textAlign:'center'}}>
							<span style={{fontFamily:'PingFangSC-Regular',fontSize:13,color:'#030303',letterSpacing:'-0.31px'}}>电话解答服务，届时请保持电话畅通。</span>
						</div>
					</div>
					<div style={{...styles.line,marginTop:14}}></div>
					<div style={{width:270,textAlign:'center',height:45,lineHeight:3}} onClick={this._toback.bind(this)}>
						<span style={{fontFamily:'PingFangSC-Regular',fontSize:17,color:'#0076ff',letterSpacing:'-0.41px',}}>知道了</span>
					</div>
				</div>
				<div style={{...styles.zzc,display:this.state.isPhoneShow ?'block':'none'}}></div>
				<div style={{...styles.alert,display:this.state.isPhoneShow ?'block':'none'}}>
					<div style={{width:270,textAlign:'center',marginTop:17}}>
						<span style={{fontFamily:'PingFangSC-Medium',fontSize:17,color:'#030303',letterSpacing:'-0.41px'}}>您的服务次数已用完</span>
					</div>
					<div style={{lineHeight:'12px'}}>
						<div style={{width:270,textAlign:'center'}}>
							<span style={{fontFamily:'PingFangSC-Regular',fontSize:13,color:'#030303',letterSpacing:'-0.31px'}}>如需继续使用</span>
						</div>
						<div style={{width:270,textAlign:'center'}}>
							<span style={{fontFamily:'PingFangSC-Regular',fontSize:13,color:'#030303',letterSpacing:'-0.31px'}}>请联系铂略产品顾问{this.state.salesInfo ? this.state.salesInfo.name :''}</span>
						</div>
					</div>
					<div style={{...styles.line,marginTop:14}}></div>
					<div style={{width:270,textAlign:'center',height:45,lineHeight:3}} onClick={this._toback.bind(this)}>
						<span style={{fontFamily:'PingFangSC-Regular',fontSize:17,color:'#0076ff',letterSpacing:'-0.41px',}}>知道了</span>
					</div>
				</div>
			</div>
    )
  }
}

var styles = {
  div:{
    width: devWidth,
    height: devHeight,
    backgroundColor:'#f4f4f4',
  },
  top:{
    width: devWidth,
    height: 70,
    // backgroundColor:'#fffbed',
    // opacity: 0.55,
    marginTop: 26,
		backgroundImage: 'url('+Dm.getUrl_img('/img/v2/icons/banner1@2x.png')+')',
		backgroundSize: 'cover',
		position:'relative',
		// backgroundAttachment: 'fixed',
  },
  second:{
    width: devWidth,
    height: 50,
    backgroundColor:'#FFFFFF',
    position:'relative',
    marginTop: 25,
  },
  three:{
    width: devWidth,
    // textAlign: 'center',

  },
  font:{
    fontSize:11,
    fontFamily:'PingFangSC-regular',
  },
  four:{
    width: devWidth,
    height: 66,
    backgroundColor:'#FFFFFF',
    border:'1px solid #E5E5E5',
    marginTop: 80
  },
  button:{
    width: devWidth-32,
    marginLeft: 16,
    height: 45,
    backgroundColor: '#2196f3',
    textAlign: 'center',
    borderRadius: '4px',
    marginTop: 11,
    lineHeight: 2.5,
  },
  buttonFont:{
    fontFamily:'PingFangSC-regular',
    fontSize: 18,
    color:'#FFFFFF',
    letterSpacing: '-0.43px',
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
	zzc:{
		width: devWidth,
		height: devHeight,
		backgroundColor:'#cccccc',
		position:'absolute',
		opacity: 0.5,
		zIndex: 998,
		top:0,
	},
	alertButton:{
		width: devWidth,
		height: 45,
	},
	line:{
		width:270,
		height:1,
		backgroundColor:'#D8D8D8',
		// marginLeft:20,
		// marginTop:8,
		// marginBottom: 8,
	},
}

export default PgAnserByPhone;
