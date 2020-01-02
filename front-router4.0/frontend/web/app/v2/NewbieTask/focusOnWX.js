import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';



class focusOnWX extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			status:false
		};

	}

  componentWillMount() {

  }
	_handlegetSubscribeStatus(re){
		console.log('_handlegetSubscribeStatus',re);
		if (re.result) {
			this.setState({
				status: true
			})
		}
	}
	componentDidMount() {
		localStorage.removeItem("bindInfo")
		// localStorage.removeItem("perfectInfo")
		var newbieTaskIndex = localStorage.getItem("newbieTaskIndex");
		if (newbieTaskIndex) {
			newbieTaskIndex = JSON.parse(newbieTaskIndex)
			Dispatcher.dispatch({
				actionType: 'getSubscribeStatus',
				taskId: newbieTaskIndex[3].id,
			})
		}
		EventCenter.emit("SET_TITLE",'铂略财课-关注微信服务号');
		this.e_getSubscribeStatus = EventCenter.on('getSubscribeStatusDone',this._handlegetSubscribeStatus.bind(this));

	}
	componentWillUnmount() {
		this.e_getSubscribeStatus.remove()
	}
	focusOnWX(){
		this.props.history.push(`${__rootDir}/newbieTaskIndex`)
	}
	render(){

    return(
			<div style={{...styles.div}}>
				<div style={{marginTop:21}}>
					<span style={{fontSize:16,color:'#333333',marginLeft:12}}>第一步打开微信客户端，点击头部右上角搜索；</span>
				</div>
				<div style={{width:devWidth,textAlign:'center',marginTop:6}}>
					{
						isApple ?
						<img src={Dm.getUrl_img('/img/v2/newbieTask/ios1@2x.png')} width={188} height={99} />
						:
						<img src={Dm.getUrl_img('/img/v2/newbieTask/android1@2x.png')} width={211} height={110} />
					}
				</div>
				<div>
					<span style={{fontSize:16,color:'#333333',marginLeft:12}}>第二步选择【公众号】并输入“铂略财课”进行搜索；</span>
				</div>
				<div style={{width:devWidth,textAlign:'center',marginTop:8}}>
					{
						isApple ?
						<img src={Dm.getUrl_img('/img/v2/newbieTask/ios2@2x.png')} width={206} height={86} />
						:
						<img src={Dm.getUrl_img('/img/v2/newbieTask/android2@2x.png')} width={206} height={86} />
					}
				</div>
				<div>
					<span style={{fontSize:16,color:'#333333',marginLeft:12}}>第三步点击“关注”操作。</span>
				</div>
				<div style={{width:devWidth,textAlign:'center',marginTop:6}}>
					{
						isApple ?
						<img src={Dm.getUrl_img('/img/v2/newbieTask/ios3@2x.png')} width={232} height={114} />
						:
						<img src={Dm.getUrl_img('/img/v2/newbieTask/android3@2x.png')} width={232} height={114} />
					}
				</div>
				<div>
					<span style={{fontSize:16,color:'#333333',marginLeft:12}}>第四部 进入铂略财课公众号，点击微课堂</span>
				</div>
				<div style={{width:devWidth,textAlign:'center',marginTop:12}}>
					{
						isApple ?
						<img src={Dm.getUrl_img('/img/v2/newbieTask/ios4@2x.png')} width={287} height={110} />
						:
						<img src={Dm.getUrl_img('/img/v2/newbieTask/android4@2x.png')} width={287} height={110} />
					}
				</div>
				{
					this.state.status ?
					<div onClick={this.focusOnWX.bind(this)} style={{...styles.button,marginTop:22,backgroundColor:'#2196F3'}}>
						<span style={{fontSize:18,color:'#FFFFFF',}}>完成激活</span>
					</div>
					:
					<div style={{...styles.button,marginTop:22}}>
						<span style={{fontSize:18,color:'#FFFFFF',}}>完成激活</span>
					</div>
				}

			</div>
    )
  }
}

var styles = {
  div:{
    width: devWidth,
    height: devHeight,
    backgroundColor: '#FFFFFF',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
	button:{
		width: devWidth-24,
		height: 45,
		backgroundColor:'#BDBDBD',
		borderRadius:'4px',
		marginLeft: 12,
		textAlign: 'center',
		lineHeight: 2.5,
		marginBottom: 21,
	}
}

export default focusOnWX;
