import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

class ActivityAlert extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
		};

	}
  _propAlert(re){
    window.location="https://mb.bolue.cn";
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
        <p style={{...styles.bookTitle}}>{this.props.success ? '提交成功' :'提交失败'}</p>
        <p style={{textAlign: 'center', color: '#333', fontSize: 13, marginTop: 10, marginBottom: 13}}>{this.props.title}</p>
        {
          this.props.success ?
          <div style={{display: 'inline-block',width:270,textAlign:'center'}}>
            <div style={{...styles.button, fontWeight: 'bold'}} onClick={this._propAlert.bind(this)}>
              <span>确定</span></div>
          </div>
          : null
        }
      </div>
    )
  }
}

var styles = {
  bookDiv: {
    position: 'absolute',
    zIndex: 999,
    bottom: (devHeight - 150)/2,
		left:0,
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
    color: '#fff',
    display: 'inline-block',
    position: 'relative',
    fontSize: 14,
    top: -15,
    backgroundColor:'#2196f3',
    borderRadius:6
  },
  cutHr: {
    borderLeft: '1px solid #d3d3d3',
    height: 42,
    display: 'inline-block'
  }
}

export default ActivityAlert;
