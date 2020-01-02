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
import PromptBox from '../components/PromptBox';

var DEFAULT_FREEZETIME= 60;
var countdown;
class PgSetPassword extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			oldPass: '',
      newPass:'',
			buttonColor:false,
			display:'none',
			errDisplay:'none',
			isSmsSent: true,
			display:'none',
			context:'',
			seePw: false
		};

	}
	_onChangeOldPass(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.newPass && v.length > 0) {
			this.setState({
				buttonColor:true,
				oldPass: v,
			})
		}else {
			this.setState({
				oldPass: v,
				buttonColor: false
			})
		}
	}

  _onChangeNewPass(e){
    e.preventDefault();
    var v = e.target.value.trim();
    if (this.state.oldPass && v.length > 0) {
      this.setState({
        buttonColor: true,
        newPass: v,
      })
    }else {
      this.setState({
        newPass: v,
        buttonColor: false
      })
    }
  }

	_onCanSeePw() {
		this.setState({
			seePw: !this.state.seePw
		})
	}

	_handleupdateAccountPwDone(re){
		console.log('_handleupdateAccountPhoneDone',re);
		if (re.err) {
			this.setState({
				display:'block',
				context: re.err
			})
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
			return false;
		}
		if (re && re.result) {
			var result = re.result || {}
			if (result.isSuccess) {
				this.setState({
					display:'block',
					context: '密码修改成功'
				})
				countdown = setInterval(()=>{
						clearInterval(countdown);
					window.history.back()
				}, 1500);
				return false;
			}
		}
	}
	_updateAccountPass(){
		Dispatcher.dispatch({
			actionType: 'updateAccountPw',
			oldPw: this.state.oldPass,
			newPw: this.state.newPass
		})
	}
	componentWillMount() {
	
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-修改密码')
		this._getupdateAccountPwDone = EventCenter.on('updateAccountPwDone', this._handleupdateAccountPwDone.bind(this))

	}
	componentWillUnmount() {
		this._getupdateAccountPwDone.remove()

	}
	render(){
		var content= {
			top:100,
			context:this.state.context,
			display:this.state.display,
		}
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.div}}>
					<span style={{fontSize:16,color:'#333333',marginLeft:12}}>原始密码</span>
					<input type="password" style={{...styles.input}} value={this.state.oldPass} placeholder="请输入原始密码" onChange={this._onChangeOldPass.bind(this)}/>
        </div>
				<hr style={{height: 1, border: 'none', backgroundColor: '#f3f3f3'}}/>
        <div style={{...styles.div}}>
					<span style={{fontSize:16,color:'#333333',marginLeft:12}}>新密码</span>
					<input type={this.state.seePw ? 'text' : 'password'} style={{...styles.input,width:window.screen.width*0.6}} value={this.state.newPass} placeholder="请输入新密码" onChange={this._onChangeNewPass.bind(this)}/>
					<img src={this.state.seePw ? Dm.getUrl_img('/img/v2/icons/can_see_pw@2x.png') : Dm.getUrl_img('/img/v2/icons/cannt_see_pw@2x.png')} onClick={this._onCanSeePw.bind(this)} style={{float: 'right', width: 20, height: 16, position: 'relative', top: 24, marginRight: 12}}/>
				</div>
        <div style={{...styles.buttonDiv}}>
					{
						this.state.buttonColor ?
						<div onClick={this._updateAccountPass.bind(this)} style={{...styles.button,backgroundColor:'#2196f3'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>确定</span>
						</div>
						:
						<div style={{...styles.button,backgroundColor:'#d1d1d1'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>确定</span>
						</div>
					}
        </div>
				<PromptBox {...content}/>
			</div>
		);
	}
}

var styles = {
  container:{
    backgroundColor:'#f4f4f4',
    height:devHeight - 10,
    width:devWidth,
		marginTop: 10
  },
  div:{
    height: '65px',
    width: '100%',
    backgroundColor:'#ffffff',
    lineHeight:4,
  },
  input:{
    width:devWidth*0.6,
		marginLeft: 20,
		height: 30,
		fontSize: 16,
		border:0,
		color: '#333'
  },
  buttonDiv:{
    width:'100%',
    height:50,
    textAlign:'center',
    marginTop:40,
  },
  button:{
    width:devWidth*0.8,
    height:45,
    textAlign:'center',
    lineHeight: '45px',
    borderRadius:2,
    marginLeft:35,
  },
	alertDiv:{
		position:'absolute',
		top:170,
		backgroundColor:'#626262',
		fontSize:15,
		color:'#ffffff',
		width:105,
		height:28,
		left: (devWidth-105)/2,
		textAlign:'center',
		borderRadius:4,
		lineHeight:2
	},
	errAlertDiv:{
		position:'absolute',
		top:170,
		backgroundColor:'#626262',
		fontSize:15,
		color:'#ffffff',
		width:180,
		height:28,
		left: (devWidth-180)/2,
		textAlign:'center',
		borderRadius:4,
		lineHeight:2
	},
	codeButton:{
		width: 90,
		height: 35,
		backgroundColor: '#E5E5E5',
		float: 'left',
		textAlign: 'center',
		marginTop: 12,
		lineHeight: 2,
		borderRadius: 2
	}
};
export default PgSetPassword;
