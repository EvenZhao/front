import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import {Dialog, Button, Input} from 'react-weui';
import BlackAlert from '../components/BlackAlert';
import Dm from '../util/DmURL'

class PgAddAnswer extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      answer: '',
			isShow: false,
			choose: false
		};
    this.click = false
	}

  componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-回复')
    this._getAnswerRes = EventCenter.on('AddAnswerDone', this._handleGetAnswerRes.bind(this))
  }

  componentWillUnmount() {
    this._getAnswerRes.remove()
  }

  _handleGetAnswerRes(re) {
    if(re.result.err) {
			this.setState({
				isShow: true
			}, () => {
				clearTimeout(this.t)
				this.t = setTimeout(() => {
					this.setState({
						isShow: false
					})
				}, 1000)
			})
    }
    if(re.result.result == true) {
      this.props.history.go(-1)
    }
  }

  _button() {
		if(this.state.answer.length < 0) {
			return
		} else {
			Dispatcher.dispatch({
				actionType: 'AddAnswer',
				question_id: this.props.location.state.question_id,
				content: this.state.answer,
				anonymous: this.state.choose ? 1 : 0
			})
		}
  }

  _check_answer(event) {
    this.setState({
      answer: event.target.value,
    });
  }

	_choose() {
		this.setState({
			choose: !this.state.choose
		})
	}

  render() {
    if(this.state.answer.length > 0) {
      this.click = true
    } else {
      this.click = false
    }
    return(
      <div style={{marginTop: 12}}>
				<BlackAlert isShow={this.state.isShow} word='请检查内容'/>
        <div style={{marginBottom: 36}}>
          <textarea style={{...styles.content_input}} value={this.state.answer} onChange={this._check_answer.bind(this)} placeholder="请输入您的回复..."/>
        </div>
        <div style={{margin: '0 36px'}}>
  				<button style={{...styles.button, backgroundColor: this.click ? '#2196f3' : '#d1d1d1'}} onClick={this._button.bind(this)}>提交</button>
					<div style={{textAlign: 'center', marginTop: 8}} onClick={() => {this._choose()}}>
						<img src={this.state.choose ? Dm.getUrl_img('/img/v2/icons/anonymous_choose@2.png') : Dm.getUrl_img('/img/v2/icons/anonymous_nochoose@2.png')} style={{width: 16, height: 16, marginRight: 8}}/>
						<span style={{position: 'relative', top: -2, color: this.state.choose ? '#2196f3' : '#666'}}>匿名</span>
					</div>
				</div>
      </div>
    )
  }
}

var styles = {
  content_input: {
    width: window.screen.width-24,
    resize: 'none',
    border: 'none',
    padding: '16px 12px 102px 12px',
    fontSize: 14,
    wordBreak: 'break-all'
  },
  button: {
    backgroundColor: '#d1d1d1',
    borderRadius: 4,
    height: 45,
    width: window.screen.width-72,
    color: '#fff',
    border: 'none',
    fontSize: 15
  }
}


export default PgAddAnswer;
