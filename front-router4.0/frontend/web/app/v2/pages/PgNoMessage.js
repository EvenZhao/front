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
class PgNoMessage extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {


		};
	}

  _handleredPointDone(re){
		// console.log('_handleredPointDone-----',re);
    // var user = re.user || {}
		// if (!user.isLogined) {
		// 	return false
		// }
    // if (user.isLogined) {
    //   this.props.history.replace(`${__rootDir}/PgMessageList`)
    //   return
    // }
  }
	componentWillMount() {

	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-消息')
    this.onredPointDone = EventCenter.on('redPointDone', this._handleredPointDone.bind(this))
	}
	componentWillUnmount() {
    this.onredPointDone.remove()
	}
	render(){
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.div}}>
          <span style={{fontSize:30,color:'#999999'}}>没有收到新消息</span>
        </div>
        <div style={{...styles.buttonDiv}}>
          <Link to={`${__rootDir}/login`}>
  					<div style={{...styles.button}}>
  							<span style={{fontSize:16,color:'#666666'}}>登录</span>
  					</div>
          </Link>
        </div>
			</div>
		);
	}
}

var styles = {
  container:{
    backgroundColor:'#FFFFFF',
    height: window.innerHeight-50,
    width: window.screen.width,
  },
  div:{
    position:'absolute',
    top: 210,
    width: window.screen.width,
    textAlign:'center'
  },
  buttonDiv:{
    width:'100%',
    height:50,
    textAlign:'center',
    marginTop:40,
    position:'absolute',
    top: 256,
    left: (window.screen.width-120)/2
  },
  button:{
    width:120,
    height:39,
    textAlign:'center',
    lineHeight:2.5,
    borderRadius:'40px',
    border:'1px solid #666666'
    // marginLeft:35,
  },

};
export default PgNoMessage;
