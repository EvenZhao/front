import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import Common from '../Common';


class ReserveAlert extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
		};

	}

	_propAlert(){
    if(this.props.type == 'mySelf') {
      EventCenter.emit("PropToCenter")
    } else if (this.props.type == 'otherSelf') {
      EventCenter.emit("HideAlert")
    }
	}
	_backToDetail() {
		EventCenter.emit("BackToOffline")
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
        <p style={{...styles.bookTitle}}>报名成功</p>
        <p style={{textAlign: 'center', color: '#333', fontSize: 13, marginTop: 10, marginBottom: 13}}>{this.props.title}</p>
        <hr style={{...styles.hr}}></hr>
				<div style={{display: 'inline-block'}}>
					<div style={{...styles.button}} onClick={this._backToDetail.bind(this)}><span>取消</span></div>
          <div style={{...styles.cutHr}}></div>
          <div style={{...styles.button, fontWeight: 'bold'}} onClick={this._propAlert.bind(this)}><span>{this.props.rightButton}</span></div>
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
  input: {
    margin: '15px 13px',
    height: 30,
    width: 270 - 40,
    border: '1px solid #d3d3d3',
    paddingLeft: 12
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

export default ReserveAlert;
