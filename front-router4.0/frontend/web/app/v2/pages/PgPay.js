/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

var countdown;
class PgPay extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			nick_name: '',
			buttonColor:false,
			display:'none',
			errDisplay:'none'
		};

	}
	_onChangeNiceName(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.nick_name && v.length > 0) {
			this.setState({
				buttonColor: (v == this.state.nick_name) ? false : true,
				nick_name: v,

			})
		}else {
			this.setState({
				nick_name: v,
				buttonColor: false
			})
		}

	}
	_onBlurChangeButton(){
		if (this.state.nickname) {
			this.setState({
				buttonColor: true
			})
		}else {
			this.setState({
				buttonColor: false
			})
		}
	}
	_handlemakeOrderPayWeixinDone(re){
		console.log('_handlemakeOrderPayWeixinDone',re);
	}
	_onUpdateNiceName(re){
    Dispatcher.dispatch({
      actionType: 'makeOrderPayWeixin',
      resource_id: 9005
    })
	}
	componentWillMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-昵称修改')
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getUserAccount'
		})
	}
	componentDidMount() {
		this._updNickNameDone = EventCenter.on('makeOrderPayWeixinDone', this._handlemakeOrderPayWeixinDone.bind(this))

	}
	componentWillUnmount() {
		this._updNickNameDone.remove()
	}
	render(){
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.buttonDiv}}>
					<div onClick={this._onUpdateNiceName.bind(this)} style={{...styles.button,backgroundColor:'#2196f3'}}>
							<span style={{fontSize:16,color:'#ffffff'}}>确定</span>
					</div>
        </div>
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
    width:window.screen.width -24,
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
    borderRadius:6,
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
	}
};
export default PgPay;
