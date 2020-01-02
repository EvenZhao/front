import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import {Dialog, Button, Input} from 'react-weui';
import BlackAlert from '../components/BlackAlert';

class PgAddAnswerComment extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      answer: '',
			isShow: false
		};
    this.click = false
	}

  componentDidMount() {
    console.log(this.props.location.state.answer_id)
		EventCenter.emit("SET_TITLE",'铂略财课-评论')
    this._getAnswerRes = EventCenter.on('AddAnswerCommentDone', this._handleGetAnswerRes.bind(this))
  }

  componentWillUnmount() {
    this._getAnswerRes.remove()
  }

  _handleGetAnswerRes(re) {
    console.log(re)
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
    if(this.state.answer.length > 0) {
      Dispatcher.dispatch({
        actionType: 'AddAnswerComment',
        answer_id: this.props.location.state.answer_id,
        content: this.state.answer,
        parent_id: this.props.location.state.parent_id
      })
    } else {
      return
    }
  }

  _check_answer(event) {
    this.setState({
      answer: event.target.value,
    });
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
          <textarea style={{...styles.content_input}} value={this.state.answer} onChange={this._check_answer.bind(this)} placeholder="请输入您的评论..."/>
        </div>
        <div style={{margin: '0 36px'}}>
  				<button style={{...styles.button, backgroundColor: this.click ? '#2196f3' : '#d1d1d1'}} onClick={this._button.bind(this)}>提交</button>
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
    // borderColor: '#e1e1e1',
    // borderLeft: 0,
    // borderRight: 0,
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


export default PgAddAnswerComment;
