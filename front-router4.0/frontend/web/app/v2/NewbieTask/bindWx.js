import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

var urlll = document.location.href; // 获取当前url链接
var ttt = urlll.split('activity')[1]


class bindWx extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      isShow: false,
			result: {},
		};

	}

	_handlegetThirdAccount(re){
		var result= re.result || {}
		console.log(result);
		this.setState({
			result: result
		})
	}
	_handlecompleteTask(re){
		console.log('_handlecompleteTask',re);
		if (re.result) {
			this.props.history.push(`${__rootDir}/focusOnWX`)
		}
		//清空完善资料本地存储数据
		
	}
  componentWillMount() {

  }

	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-绑定微信')
		this.e_getThirdAccount = EventCenter.on('getThirdAccountDone',this._handlegetThirdAccount.bind(this));
		this.e_completeTask = EventCenter.on('completeTaskDone',this._handlecompleteTask.bind(this));
		this.e_thirdBindWx = EventCenter.on('thirdBindWxDone',this._handlethirdBindWx.bind(this));

		Dispatcher.dispatch({
      actionType: 'getThirdAccount',
    })
	}
	componentWillUnmount() {
		this.e_getThirdAccount.remove()
		this.e_completeTask.remove()
		this.e_thirdBindWx.remove()
	}
  keep(){
		this.setState({
			isShow:false
		})
	}
	_handlethirdBindWx(re){
		if (re.err) {
			this.setState({
				isShow: true
			})
		}
		if (re.result) {
			Dispatcher.dispatch({
	      actionType: 'getThirdAccount',
	    })
		}
		console.log('_handlethirdBindWx',re);
	}
	completeTask(){
		var newbieTaskIndex = localStorage.getItem("newbieTaskIndex");
		if (newbieTaskIndex) {
			newbieTaskIndex = JSON.parse(newbieTaskIndex)
			Dispatcher.dispatch({
				actionType: 'completeTask',
				num: 3,
				taskId: newbieTaskIndex[2].id,
			})
		}
	}
	thirdBindWx(){
		Dispatcher.dispatch({
			actionType: 'thirdBindWx',
			code: localStorage.getItem("credentials.code") || ''
		})
	}
	render(){
		var result = this.state.result || {}
    return(
			<div style={{...styles.div}}>
        <div style={{width:devWidth,position:'absolute',top:41,textAlign:'center',display:result.flag ? 'none' :'block'}}>
          <span style={{fontSize:16,color:'#333333'}}>点击绑定微信，完成该任务</span>
        </div>
        <div style={{position:'absolute',top:110,left:(devWidth-90)/2,}}>
					{
						result.flag ?
						<img style={{borderRadius:'18px'}} src={result.figure_url} height="90" width="90"/>
						:
						<img onClick={this.thirdBindWx.bind(this)} src={Dm.getUrl_img('/img/v2/newbieTask/WeChat@2x.png')} height="90" width="90"/>
					}
        </div>
        <div style={{width:devWidth,position:'absolute',top:210,textAlign:'center'}}>
					{
						result.flag ?
						<span style={{fontSize:16,color:'#333333'}}>已绑定{result.nick_name}</span>
						:
						<span style={{fontSize:16,color:'#333333'}}>绑定微信</span>
					}
        </div>
				{
					result.flag ?
					<div onClick={this.completeTask.bind(this)} style={{...styles.button,backgroundColor:'#2196F3'}}>
						<span style={{fontSize:18,color:'#FFFFFF'}}>下一步</span>
					</div>
					:
					<div style={{...styles.button}}>
						<span style={{fontSize:18,color:'#FFFFFF'}}>下一步</span>
					</div>
				}

        <div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
        <div style={{...styles.alert,display:this.state.isShow ?'block':'none'}}>
          <div style={{...styles.alertTop}}>
            <div style={{}}>
              <span style={{fontSize:16,color:'#030303'}}>绑定失败</span>
            </div>
            <div style={{width:246,marginLeft:12,lineHeight:1.2}}>
              <span style={{fontSize:13,color:'#333333'}}>抱歉，一个微信号只能关联绑定一个铂略账号。您的微信账号已关联绑定过其他铂略账号，
              您可联系客服解除绑定。解除绑定后，再登录本账号进行绑定操作。</span>
            </div>
          </div>
          <div style={{...styles.divLine}}></div>
          <div style={{display:'flex',height:42}}>
            <div style={{flex:1,textAlign:'center',marginTop:8}} onClick={this.keep.bind(this)}>
              <span style={{fontSize:17,color:'#666666',fontFamily:'pingfangsc-regular'}}>知道了</span>
            </div>
            <div style={{width:0.5,height:42,backgroundColor:'#D8D8D8',opacity:0.78}}></div>
            <div style={{flex:1,textAlign:'center',marginTop:8}} onClick={this.keep.bind(this)}>
							<Link to={{pathname:`${__rootDir}/freeInvited`, state:null}}>
	              <span style={{fontSize:17,color:'#2196f3',fontFamily:'pingfangsc-regular'}}>联系客服</span>
							</Link>
            </div>
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
  textAlign:'center',
  },
  button:{
    width: devWidth-30,
    height: 45,
    borderRadius:'4px',
    backgroundColor:'#d1d1d1',
    left:15,
    bottom:24,
    position:'absolute',
    textAlign:'center',
    lineHeight:2.5
  },
  alert:{
    width: 270,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    position:'absolute',
    left: (devWidth-270)/2,
    zIndex:999,
    top:182,
  },
  alertTop:{
    width:270,
    textAlign:'center',
    height:101,
    overflowY:'scroll',
    overflowX:'hidden',
		marginTop:16
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

}

export default bindWx;
