import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';

import { Link } from 'react-router-dom';

import Common from '../Common';


class LoginAlert extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
		};

	}

	_backToDetail() {
		EventCenter.emit("BackToCenter")
	}
  componentWillMount() {
  }
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	render(){
    return(
      <div style={{...styles.bookDiv, display: this.props.isShow ? 'block' : 'none'}}>
        <p style={{...styles.bookTitle}}>提示</p>
        <p style={{textAlign: 'center', color: '#333', fontSize: 13, marginTop: 10, marginBottom: 13}}>亲您还未登录哟</p>
        <hr style={{...styles.hr}}></hr>
				<div style={{display: 'inline-block'}}>
					<div style={{...styles.button}} onClick={this._backToDetail.bind(this)}><span>取消</span></div>
          <div style={{...styles.cutHr}}></div>
          <div style={{...styles.button, fontWeight: 'bold'}}>
            <Link to={`${__rootDir}/login`}>
              <span style={{color:'#2196f3'}}>去登录</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

var styles = {
  bookDiv: {
    position: 'absolute',
    zIndex: 999,
    top: (devHeight - 150)/2,
    width: 270,
    height: 127,
    backgroundColor: '#fff',
    marginLeft: (devWidth - 270)/2,
    borderRadius: 12
  },
  bookTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 16
  },
  hr: {
    marginTop: 4,
    border: 'none',
    height: 1,
    backgroundColor: '#d3d3d3'
  },
	button: {
    width: 269 / 2,
    textAlign: 'center',
    marginTop: 8,
    color: '#2196f3',
    display: 'inline-block',
    position: 'relative',
		fontSize: 14,
    top: -15
  },
  cutHr: {
    borderLeft: '1px solid #d3d3d3',
    height: 42,
    display: 'inline-block'
  }
}

export default LoginAlert;
