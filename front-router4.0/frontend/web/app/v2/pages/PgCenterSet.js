/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

class PgCenterSet extends React.Component {
	constructor(props) {
	    super(props);
			this.wx_config_share_home = {
					title: '设置-铂略咨询',
					desc: '铂略咨询-财税领域实战培训供应商',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
		this.state = {
			title: 'PgHome',
			phone: '',
			password: '',
			buttonColor: false,
			user:{},
		};

	}

	logOut() {
		if(isWeiXin) {
			Dispatcher.dispatch({
				actionType: 'LogOut'
			})
		} else {
			localStorage.removeItem('credentials.openid')
			localStorage.removeItem('credentials.code')
			this.props.history.push(`${__rootDir}/PgCenter`)
		}
	}

	_onChangeLoginPhone(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.password && v.length > 0) {
			this.setState({
				phone: v,
				buttonColor: true
			})
		}else {
			this.setState({
				phone: v,
				buttonColor: false
			})
		}

	}
	_onChangeLoginPass(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.phone && v.length > 0) {
			this.setState({
				password: v,
				buttonColor: true
			})
		}else {
			this.setState({
				password: v,
				buttonColor: false
			})
		}

	}
	_onBlurChangeButton(){
		if (this.state.phone && this.state.password) {
			this.setState({
				buttonColor: true
			})
		}else {
			this.setState({
				buttonColor: false
			})
		}
	}
	_handlegetUserAccountDone(re){

		if (re && re.user) {
			this.setState({
				user: re.user || {}
			})
		}
	}

	_handleLogOut(re) {
		if(re.err) {
			alert(re.err)
			return
		}
		if(re && re.result) {
			if(re.result.isLogout == true) {
				this.props.history.push(`${__rootDir}/PgCenter`)
				// this.props.history.push(`${__rootDir}/login`)
			} else {
				alert('登出失败')
			}
		}
	}
	_gotoSetInfo(re){
		this.props.history.push(`${__rootDir}/PgSetInfo`)
	}
	componentWillMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-设置')
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getUserAccount'
		})
	}
	componentDidMount() {
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		this._getUserAccountDone = EventCenter.on('getUserAccountDone', this._handlegetUserAccountDone.bind(this))
		this._logOut = EventCenter.on('LogOutDone', this._handleLogOut.bind(this));

	}
	componentWillUnmount() {
		this._getUserAccountDone.remove()
	}
	render(){
		var user = this.state.user || {}

		return (
			<div style={{...styles.container}}>
        <div style={{...styles.div,marginTop:10}} onClick={this._gotoSetInfo.bind(this)}>
	        <div style={{...styles.middle}}>
	            <div style={{...styles.imageDiv}}>
								<img style={{borderRadius: 35}} src={this.state.user.user_image} height="44" width="44"/>
							</div>
							<div style={{marginLeft:20,float:'left'}}>
								<span style={{fontSize:14,color:'#333',}}>{this.state.user.nick_name}</span>
							</div>
							<div style={{...styles.more}}>
								<img src={Dm.getUrl_img('/img/v2/icons/more.png')}/>
							</div>
	        </div>
        </div>


				{/*
					user.type == 1 ?
					<div style={{...styles.div,marginTop:10,borderBottomWidth:1,borderColor:'#f4f4f4',borderStyle:'solid',borderLeft:'none' }}>
						<div style={{...styles.titlediv}}>
							<span style={{fontSize:15,color:'#999999'}}>修改手机</span>
						</div>
					</div>
					:
					<Link to={`${__rootDir}/PgSetPhone`}>
						<div style={{...styles.div,marginTop:10,borderBottomWidth:1,borderColor:'#f4f4f4',borderStyle:'solid',borderLeft:'none' }}>
							<div style={{...styles.titlediv}}>
								<span style={{fontSize:15,color:'#666666'}}>修改手机</span>
							</div>
							<div style={{...styles.more}}>
								<img src={Dm.getUrl_img('/img/v2/icons/more.png')}/>
							</div>
						</div>
					</Link>
				*/}
				{/*
					user.type == 1 ?
					<div style={{...styles.div,borderBottomWidth:1,borderColor:'#f4f4f4',borderStyle:'solid',borderLeft:'none',borderTop:'none' }}>
						<div style={{...styles.titlediv}}>
							<span style={{fontSize:15,color:'#999999'}}>修改邮箱</span>
						</div>
					</div>
					:
					<Link to={`${__rootDir}/PgSetEmail`}>
						<div style={{...styles.div,borderBottomWidth:1,borderColor:'#f4f4f4',borderStyle:'solid',borderLeft:'none',borderTop:'none' }}>
							<div style={{...styles.titlediv}}>
								<span style={{fontSize:15,color:'#666666'}}>修改邮箱</span>
							</div>
							<div style={{...styles.more}}><img src={Dm.getUrl_img('/img/v2/icons/more.png')}/></div>
						</div>
					</Link>
				*/}
			{/*	<Link to={`${__rootDir}/PgSetPassword`}>
	        <div style={{...styles.div}}>
	          <div style={{...styles.titlediv}}>
							<span style={{fontSize:15,color:'#666666'}}>修改密码</span>
						</div>
						<div style={{...styles.more}}><img src={Dm.getUrl_img('/img/v2/icons/more.png')}/></div>
	        </div>
				</Link>
			*/}
			<Link to={{pathname: `${__rootDir}/AccountManage`, query: null, hash: null, state:{user: this.state.user}}}>
				<div style={{...styles.div,marginTop:15}}>
					<div style={{...styles.titlediv}}>
						<span style={{fontSize:14,color:'#666666'}}>账号管理</span>
					</div>
					<div style={{...styles.more}}><img src={Dm.getUrl_img('/img/v2/icons/more.png')}/></div>
				</div>
			</Link>
				<Link to={`${__rootDir}/PgAdvice`}>
	        <div style={{...styles.div,marginTop:15}}>
	          <div style={{...styles.titlediv}}>
							<span style={{fontSize:14,color:'#666666'}}>意见反馈</span>
						</div>
						<div style={{...styles.more}}><img src={Dm.getUrl_img('/img/v2/icons/more.png')}/></div>
	        </div>
				</Link>
        <div style={{...styles.div,marginTop:10,textAlign:'center',}} onClick={this.logOut.bind(this)}>
          <div style={{...styles.middle,color:'#2196f3'}}>{isWeiXin ? '解除绑定':'退出登录'}</div>
        </div>
				<div style={{textAlign: 'center', paddingTop: 8}}>
    			<p>V{bolueVer}</p>
				</div>
				<div style={{textAlign: 'center', backgroundColor: '#eee', paddingTop: 8,display: __DEBUG__ ? 'block' :'none'}}>
					<p>{Dm.getUrl_api()}</p>
				</div>
			</div>
		);
	}
}
PgCenterSet.propTypes = {

};
PgCenterSet.defaultProps = {

};
var styles = {
  container:{
    backgroundColor:'#f4f4f4',
    height:'100%',
    width:'100%',
  },
  div:{
    height: '50px',
    width: '100%',
    backgroundColor:'#ffffff',
    lineHeight:3,
  },
  titlediv:{
    fontSize: 15,
    marginLeft: 12,
    float: 'left',
  },
  middle:{
    marginLeft:12,
  },
  imageDiv:{
    height: 44,
    width: 44,
    // borderRadius: 35,
    // backgroundColor:'yellow',
    // marginLeft: 18,
    marginRight: 13,
    float:'left',
    marginTop:2,
  },
	more:{
		float: 'left',
		position: 'absolute',
		right: 16,
		// marginTop: 12,
	},
};
export default PgCenterSet;