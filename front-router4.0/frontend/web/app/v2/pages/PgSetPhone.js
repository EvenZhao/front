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
class PgSetPhone extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			phone: '',
			buttonColor:false,
		};
	}
	_handlegetUserAccountDone(re){
		console.log('_handlegetUserAccountDone',re);
		if (re && re.user) {
			var user = re.user
			this.setState({
				user: re.user || {},
				phone: user.phone || '',
			})
		}
	}
	componentWillMount() {
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getUserAccount'
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-修改绑定')
		this._getUserAccountDone = EventCenter.on('getUserAccountDone', this._handlegetUserAccountDone.bind(this))
	}
	componentWillUnmount() {
		this._getUserAccountDone.remove()
	}
	render(){
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.div}}>
          <span style={{fontSize:16,color:'#999999',marginLeft:12}}>已绑定手机号：{this.state.phone || ''}</span>
        </div>
        <div style={{...styles.buttonDiv}}>
          <Link to={`${__rootDir}/PgUpdatePhone`}>
  					<div style={{...styles.button,backgroundColor:'#2196f3'}}>
  							<span style={{fontSize:16,color:'#ffffff'}}>修改绑定</span>
  					</div>
          </Link>
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
		marginLeft: 12
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

};
export default PgSetPhone;
