import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

class Alert extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
		};

	}

  componentWillMount() {
  }

	componentDidMount() {
	}
	componentWillUnmount() {
	}

  _hideAlert() {
    EventCenter.emit("HideAdoptAlert")
  }

  _adoptAnswer() {
    EventCenter.emit("_adoptAnswer")
  }

	render(){
    return(
      <div style={{...styles.bookDiv, display: this.props.isShow ? 'block' : 'none', height: 127}}>
        <p style={{...styles.bookTitle}}>该回答解决了您的问题吗?</p>
        <p style={{textAlign: 'center', color: '#333', fontSize: 13, marginTop: 10, marginBottom: 13}}>(采纳后将不可撤销)</p>
        <hr style={{...styles.hr}}></hr>
        <div style={{display: 'inline-block'}}>
          <div style={{...styles.button}} onClick={this._hideAlert.bind(this)}><span>我再看看</span></div>
          <div style={{...styles.cutHr}}></div>
          <div style={{...styles.button}} onClick={this._adoptAnswer.bind(this)}><span>采纳</span></div>
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
    height: 150,
    backgroundColor: '#fff',
    marginLeft: (devWidth - 270)/2,
    borderRadius: 12
  },
  bookTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontColor: '#333',
    // fontWeight: 'bold',
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
    top: -15
  },
  cutHr: {
    borderLeft: '1px solid #d3d3d3',
    height: 42,
    display: 'inline-block'
  }
}

export default Alert;
