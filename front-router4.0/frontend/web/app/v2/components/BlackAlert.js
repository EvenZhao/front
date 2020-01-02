/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Common from '../Common';


class BlackAlert extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}
	render(){
		return (
			<div style={{display: this.props.isShow ? 'block' : 'none', position: 'absolute', textAlign: 'center', borderRadius: 8, top: devHeight / 2 - 50, left: '50%', marginLeft:'-30%', width: '60%', lineHeight:'20px', padding:'10px',boxSizing: 'border-box', backgroundColor: '#000', opacity: 0.8}}>
	<div style={{color: '#fff'}} dangerouslySetInnerHTML={{__html: this.props.word}}></div>
			</div>
		)
	}
}

export default BlackAlert;
