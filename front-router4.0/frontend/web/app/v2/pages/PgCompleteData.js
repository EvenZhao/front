/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

class PgCompleteData extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			phone: '',
			password: '',
			buttonColor: false,
		};

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
	componentDidMount() {
	}
	componentWillUnmount() {
	}
	render(){
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.div,marginTop:10}}>
          <div style={{...styles.middle}}>头像<input type="file"/></div>
        </div>
        <div style={{...styles.div,marginTop:10,borderBottomWidth:1,borderColor:'#f4f4f4',borderStyle:'solid',borderLeft:'none' }}>
          <div style={{...styles.titlediv}}>昵称<input type="text"/></div>
        </div>
        <div style={{...styles.div,borderBottomWidth:1,borderColor:'#f4f4f4',borderStyle:'solid',borderLeft:'none',borderTop:'none' }}>
          <div style={{...styles.titlediv}}>公司<input type="text"/></div>
        </div>
        <div style={{...styles.div,borderBottomWidth:1,borderColor:'#f4f4f4',borderStyle:'solid',borderLeft:'none',borderTop:'none'}}>
          <div style={{...styles.titlediv}}>邮箱<input type="text"/></div>
        </div>
        <div style={{...styles.div}}>
          <div style={{...styles.titlediv}}>职业<input type="text"/></div>
        </div>
        <div style={{...styles.div,marginTop:10,textAlign:'center',}}>
          <div style={{...styles.middle,color:'#2196f3'}}>提交</div>
        </div>
			</div>
		);
	}
}
PgCompleteData.propTypes = {

};
PgCompleteData.defaultProps = {

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

  },
  middle:{
    marginLeft:12,
  }
};
export default PgCompleteData;
