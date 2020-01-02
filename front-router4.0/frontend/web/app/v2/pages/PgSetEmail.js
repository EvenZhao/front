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
class PgSetEmail extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			email: '',
      password:'',
			buttonColor:false,
			display:'none',
			errDisplay:'none',
			isSmsSent: true,
			display:'none',
			context:''
		};

	}
	_onChangeEmail(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.password && v.length > 0) {
			this.setState({
				buttonColor:true,
				email: v,

			})
		}else {
			this.setState({
				email: v,
				buttonColor: false
			})
		}

	}
  _onChangePass(e){
    e.preventDefault();
    var v = e.target.value.trim();
    if (this.state.email && v.length > 0) {
      this.setState({
        buttonColor: true,
        password: v,

      })
    }else {
      this.setState({
        password: v,
        buttonColor: false
      })
    }

  }
	_handleupdateAccountEmailDone(re){
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
					context: '邮箱修改成功'
				})
				countdown = setInterval(()=>{
						clearInterval(countdown);
						// this.setState({
						// 		display: 'none'
						// });
					window.history.back()
				}, 1500);
				return false;
			}
		}
	}
	_updateAccountEmail(){
		Dispatcher.dispatch({
			actionType: 'updateAccountEmail',
			email: this.state.email,
			pw: this.state.password
		})
	}
	componentWillMount() {
		// Dispatcher.dispatch({//getUserAccountDone
		// 	actionType: 'getUserAccount'
		// })
	}
	componentDidMount() {
		this._getupdateAccountEmailDone = EventCenter.on('updateAccountEmailDone', this._handleupdateAccountEmailDone.bind(this))

	}
	componentWillUnmount() {
		this._getupdateAccountEmailDone.remove()

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
          <img style={{marginLeft:12}} src={Dm.getUrl_img('/img/v2/icons/phone@2x.png')} height="15" width="19"/>
					<input style={{...styles.input}} value={this.state.email} placeholder="请输入邮箱" onChange={this._onChangeEmail.bind(this)}/>
        </div>
        <div style={{...styles.div}}>
					<div style={{float:'left'}}>
						<img style={{marginLeft:12}} src={Dm.getUrl_img('/img/v2/icons/phone@2x.png')} height="15" width="19"/>
					</div>
					<div style={{float:'left'}}>
						<input style={{...styles.input}} value={this.state.password} placeholder="密码" onChange={this._onChangePass.bind(this)}/>
					</div>
        </div>
        <div style={{...styles.buttonDiv}}>
					{
						this.state.buttonColor ?
						<div onClick={this._updateAccountEmail.bind(this)} style={{...styles.button,backgroundColor:'#2196f3'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>提交绑定</span>
						</div>
						:
						<div style={{...styles.button,backgroundColor:'#d1d1d1'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>提交绑定</span>
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
    height:'100%',
    width:'100%',
  },
  div:{
    height: '65px',
    width: '100%',
    backgroundColor:'#ffffff',
    lineHeight:4,
  },
  input:{
    width:window.screen.width*0.85,
		marginLeft: 12,
		border:0
  },
  buttonDiv:{
    width:'100%',
    height:50,
    textAlign:'center',
    marginTop:40,
  },
  button:{
    width:window.screen.width*0.8,
    height:45,
    textAlign:'center',
    lineHeight:2.5,
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
		left: (window.screen.width-105)/2,
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
		left: (window.screen.width-180)/2,
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
export default PgSetEmail;
