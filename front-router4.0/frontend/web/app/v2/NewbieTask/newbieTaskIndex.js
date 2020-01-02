import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

var countdown

class newbieTaskIndex extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			isShow: false,
			taskFinish: false,
			perfectInfo: {},
			chooseTopic: {},
			bingwx: {},
			foucsWx: {},
			user: {},
			isDown: false,
			keeping: false,
		};

	}

  componentWillMount() {

  }
	finish(){
		this.setState({
			isShow:true
		})
	}
	keep(){
		this.setState({
			isShow:false
		})
	}
	taskFinish(){
		this.setState({
			taskFinish: true,
			isShow: false
		},()=>{
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
						taskFinish:false,
					},()=>{
						this.props.history.go(-1)
					})
			}, 1500)
		})
	}
	doTask(){
		if (this.state.taskData.length > 0) {
			var taskData = this.state.taskData
			for (var i = 0; i < taskData.length; i++) {
				if (!taskData[i].isComplete) {
					switch (i) {
						case 0:
							this.props.history.push(`${__rootDir}/perfectData`)
						break;
						case 1:
							this.props.history.push(`${__rootDir}/chooseTopic`)
						break;
						case 2:
							this.props.history.push(`${__rootDir}/bindWx`)
						break;
						case 3:
							this.props.history.push(`${__rootDir}/focusOnWX`)
						break;
						default:
					}
					return
				}

			}
		}
	}
	_handleAccountActivation(re){
		console.log('_handleAccountActivation=',re)
		if (re.user.isLogined) {
			var result= re.result || []
			this.setState({
				taskData:result || [],
				perfectInfo: result[0],
				chooseTopic: result[1],
				bingwx: result[2],
				foucsWx: result[3],
				user: re.user,
			},()=>{
				if (this.state.perfectInfo.isComplete && this.state.chooseTopic.isComplete && this.state.bingwx.isComplete && this.state.foucsWx.isComplete) {
					this.setState({
						isDown: true
					})
				}
				if (this.state.perfectInfo.isComplete || this.state.chooseTopic.isComplete || this.state.bingwx.isComplete || this.state.foucsWx.isComplete) {
					this.setState({
						keeping: true
					})
				}
				localStorage.setItem("newbieTaskIndex", JSON.stringify(result));
			})
		}
	}
	componentDidMount() {
		localStorage.removeItem("bindInfo")
		localStorage.removeItem("perfectInfo")
    EventCenter.emit("SET_TITLE",'铂略财课-新手任务')
		this.e_accountActivation = EventCenter.on('accountActivationDone',this._handleAccountActivation.bind(this));
		Dispatcher.dispatch({
      actionType: 'accountActivation',
    })
	}
	componentWillUnmount() {
		this.e_accountActivation.remove()
	}

	render(){

    return(
			<div style={{...styles.div}}>
        <div style={{...styles.bgm,width:devWidth,height:devHeight * (199/667),}}>
				<div style={{position:'absolute',left:devWidth/2-10,top:(devHeight * (199/667))*(93/(devHeight * (199/667)))}}>
					<div>
						<span style={{fontSize:14,color:'#d2d2d2',fontFamily:'pingfangsc-regular'}}>新手必经之路</span>
					</div>
					<div>
						<span style={{fontSize:18,color:'#ffffff',fontFamily:'pingfangsc-regular'}}>轻松获取奖励！</span>
					</div>
				</div>
        </div>
        <div style={{...styles.tabDiv,marginTop:30}}>
          <img style={{...styles.icon}} src={Dm.getUrl_img('/img/v2/newbieTask/wanshanxinxi@2x.png')} width={40} height={40} />
          <div style={{...styles.title}}><span style={{...styles.tabText}}>完善基本信息</span></div>
          <div style={{...styles.status}}>
						{
							this.state.perfectInfo.isComplete ?
								<span style={{fontSize:14,color:'#f37633'}}>已完成</span>
							:
								<span style={{fontSize:14,color:'#666666'}}>未完成</span>
						}
					</div>
        </div>
        <div style={{...styles.tabDiv}}>
          <img style={{...styles.icon}} src={Dm.getUrl_img('/img/v2/newbieTask/xuanzehuati@2x.png')} width={40} height={40} />
          <div style={{...styles.title}}><span style={{...styles.tabText}}>选择话题</span></div>
          <div style={{...styles.status}}>
					{
						this.state.chooseTopic.isComplete ?
						<span style={{fontSize:14,color:'#f37633'}}>已完成</span>
						:
						<span style={{fontSize:14,color:'#666666'}}>未完成</span>
					}
					</div>
        </div>
        <div style={{...styles.tabDiv}}>
          <img style={{...styles.icon}} src={Dm.getUrl_img('/img/v2/newbieTask/weixinbangding@2x.png')} width={40} height={40} />
          <div style={{...styles.title}}><span style={{...styles.tabText}}>绑定微信</span></div>
          <div style={{...styles.status}}>
					{
						this.state.bingwx.isComplete ?
							<span style={{fontSize:14,color:'#f37633'}}>已完成</span>
						:
							<span style={{fontSize:14,color:'#666666'}}>未完成</span>
					}
					</div>
        </div>
        <div style={{...styles.tabDiv}}>
          <img style={{...styles.icon}} src={Dm.getUrl_img('/img/v2/newbieTask/fuwuhao@2x.png')} width={40} height={40} />
          <div style={{...styles.title}}><span style={{...styles.tabText}}>关注微信服务号</span></div>
          <div style={{...styles.status}}>
					{
						this.state.foucsWx.isComplete ?
							<span style={{fontSize:14,color:'#f37633'}}>已完成</span>
						:
							<span style={{fontSize:14,color:'#666666'}}>未完成</span>
					}
					</div>
        </div>
				{
					this.state.isDown ?
					<div style={{...styles.buttomDiv,backgroundColor:'#D1D1D1'}}>
	          <span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular',}}>任务已完成</span>
	        </div>
					:
					<div style={{...styles.buttomDiv}} onClick={this.doTask.bind(this)}>
						{
							this.state.keeping ?
								<span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular',}}>继续做任务</span>
							:
								<span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular',}}>开始做任务</span>
						}
					</div>
				}

        <div style={{width:devWidth,textAlign:'center',marginTop:12}}>
          <span style={{fontSize:14,color:'#666666'}} onClick={this.finish.bind(this)}>跳过</span>
        </div>
				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
				<div style={{...styles.alert,display:this.state.isShow ?'block':'none'}}>
					<div style={{...styles.alertTop}}>
						<div style={{}}>
							<span style={{fontSize:17,color:'#030303'}}>提示</span>
						</div>
						<div style={{}}>
							<span style={{fontSize:14,color:'#030303'}}>您尚未完成新手任务，</span>
						</div>
						<div style={{}}>
							<span style={{fontSize:14,color:'#030303'}}>是否真的需要终止？</span>
						</div>
					</div>
					<div style={{...styles.divLine}}></div>
					<div style={{display:'flex',}}>
						<div style={{flex:1,textAlign:'center',marginTop:8}} onClick={this.taskFinish.bind(this)}>
							<span style={{fontSize:17,color:'#666666',fontFamily:'pingfangsc-regular'}}>确认终止</span>
						</div>
						<div style={{width:0.5,height:43,backgroundColor:'#D8D8D8',opacity:0.78}}></div>
						<div style={{flex:1,textAlign:'center',marginTop:8}} onClick={this.keep.bind(this)}>
							<span style={{fontSize:17,color:'#0076ff',fontFamily:'pingfangsc-regular'}}>继续任务</span>
						</div>
					</div>
				</div>
				<div style={{...styles.zzc,display:this.state.isDown ?'block':'none'}}></div>
				<div style={{...styles.alert,display:this.state.isDown ?'block':'none'}}>
					<div style={{...styles.alertTop,lineHeight:1}}>
						<div style={{marginTop:14}}>
							<span style={{fontSize:17,color:'#030303'}}>完成任务</span>
						</div>
						{
							this.state.user.showVip ?
							<span>
								<div style={{marginTop:4}}>
									<span style={{fontSize:14,color:'#030303'}}>您已完成所有新手任务</span>
								</div>
								<div style={{marginTop:6}}>
									<span style={{fontSize:14,color:'#030303'}}>并获得2天VIP会员体验权限 +{this.state.user.point || 0}积分奖励</span>
								</div>
							</span>
							:
							<span>
								<div style={{marginTop:4}}>
									<span style={{fontSize:14,color:'#030303'}}>您已完成所有新手任务，并成功</span>
								</div>
								<div style={{marginTop:6}}>
									<span style={{fontSize:14,color:'#030303'}}>获取{this.state.user.point || 0}积分奖励</span>
								</div>
							</span>
						}

					</div>
					<div style={{...styles.divLine}}></div>
					<div style={{display:'flex',}}>
						<div style={{flex:1,textAlign:'center',marginTop:8}} onClick={this.goToStudy.bind(this)}>
							<span style={{fontSize:17,color:'#2196F3',fontFamily:'pingfangsc-regular'}}>开始学习</span>
						</div>
					</div>
				</div>
				<div style={{...styles.taskFinish,display:this.state.taskFinish ? 'block':'none'}}>
					<span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular'}}>当前任务已终止</span>
				</div>
			</div>
    )
  }
	goToStudy(){
		this.props.history.push(`${__rootDir}/`)
	}
}

var styles = {
  div:{
    height: devHeight,
    width: devWidth,
    backgroundColor: '#f4f4f4',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
	bgm:{
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/newbieTask/bg2@2x.png')+')',
		backgroundSize:'cover',
		position:'relative',
	},
  topImage:{
    width: devWidth,
    height: devHeight * (199/667),
  },
  tabDiv:{
    width: devWidth,
    height: 70,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
    position:'relative',
  },
  tabText:{
    fontSize: 16,
    color: '#000000'
  },
  buttomDiv:{
    width: devWidth-26,
    marginLeft: 13,
    marginTop: 20,
    height: 45,
    backgroundColor: '#2196F3',
    textAlign: 'center',
    letterSpacing: '-0.43px',
    borderRadius: '4px',
    lineHeight: 2.5
  },
  icon:{
    float:'left',
    marginTop:15,
    marginLeft:23
  },
  title:{
    float:'left',
    marginTop:24,
    marginLeft:13
  },
  status:{
    float:'right',
    marginTop:25,
    marginRight:33
  },
	alert:{
		width: 270,
		height: 135,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		position:'absolute',
		left: (devWidth-270)/2,
		zIndex:999,
		top:209
	},
	alertTop:{
		width:270,
		textAlign:'center',
		height:90,
		overflowY:'scroll',
		overflowX:'hidden'
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
	divLine:{
		width: 270,
		height: 0.5,
		backgroundColor: '#D8D8D8',
		opacity:0.78
	},
	taskFinish:{
		width: 190,
		height: 40,
		backgroundColor: '#000000',
		opacity: 0.7,
		borderRadius: '10px',
		position: 'absolute',
		top: (devHeight-40)/2,
		left: (devWidth-190)/2,
		textAlign:'center',
		lineHeight: 2.3,
	}
}

export default newbieTaskIndex;
