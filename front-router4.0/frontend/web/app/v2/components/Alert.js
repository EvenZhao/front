import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

class Alert extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
      phone: '',
		};

	}

  componentWillMount() {
  }

	componentDidMount() {
	}
	componentWillUnmount() {
	}

  _check_phone(event) {
    this.setState({
      phone: event.target.value,
    });
  }

  _chooseType(choose, phone) {
		if(choose != 'confirm') {
			this.setState({
				phone: ''
			})
		}
		if(choose == 'confirm') {
			Dispatcher.dispatch({
				actionType: 'LiveReserve',
				resource_id: this.props.resource_id,
				resource_type: 1,
				title: this.props.title,
				phone: this.state.phone
			})
		}
    this.props.ChooseType(choose, this.state.phone)
		EventCenter.emit('HideMask');
  }

	render(){
    if(this.props.content == 'input' || this.props.reload) {
      this.content = (
				<input placeholder="请输入手机号" style={{...styles.input}} value={this.state.phone} onChange={this._check_phone.bind(this)}/>
			)
    } else{
      this.content =(
				<div style={{textAlign: 'center', color: '#333', fontSize: 13, marginTop: 10, marginBottom: 13,padding:'0 10px 0 10px'}}>
					{this.props.content}
					<div>{this.props.bookContenttwo}</div>
				</div>
				)
    }
    let height = 150
    return(
      <div style={{...styles.bookDiv, display: this.props.show ? 'block' : 'none', height: height}}>
        <p style={{...styles.bookTitle}}>{this.props.bookTitle}</p>
        {this.content}
        <hr style={{...styles.hr}}></hr>
        <div style={{display: 'inline-block'}}>
          <div style={{...styles.button}} onClick={() => {this._chooseType('cancel', this.state.phone)}}><span style={{color:'#999'}}>知道了</span></div>
          <div style={{...styles.cutHr}}></div>
          <div style={{...styles.button}} onClick={() => {this._chooseType(this.props.rightButton, this.state.phone)}}><span>{this.props.buttonValue}</span></div>
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
    top: -15
  },
  cutHr: {
    borderLeft: '1px solid #d3d3d3',
    height: 42,
    display: 'inline-block'
  }
}

export default Alert;
