import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import {Dialog, Button, Input} from 'react-weui';
import AnswerList from '../components/AnswerList';
import Dm from '../util/DmURL'

class PgQuestionDetail extends React.Component {
	constructor(props) {
    super(props);
		this.wx_config_share_home = {
				title: '',
				desc: '',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
		this.state = {
			question: [],
			labels: [],
			isCollected: false,
			isMyQuestion: false,
			canAdopted: false,
			answer: [],
			labels: [],
			loadLength: '',
			isLogin: false
		};

	}

	_collect(){
		if(this.state.isLogin == true) {
			this.setState({
				isCollected: !this.state.isCollected
			})
			Dispatcher.dispatch({
				actionType: 'CollectQuestion',
				question_id: this.props.match.params.id
			})
		} else {
			this.props.history.push(`${__rootDir}/login`)
		}
	}

  _handleQuestionDetailDone(re) {
		if(re && re.result) {
			this.wx_config_share_home = {
					title: re.result.question.title || '',
					desc: re.result.question.content || '',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
			EventCenter.emit("SET_TITLE",re.result.question.title)
			this.setState({
				question: re.result.question,
				labels: re.result.labels,
				isCollected: re.result.isCollected,
				isMyQuestion: re.result.isMyQuestion,
				canAdopted: re.result.canAdopted,
				isLogin: re.user.isLogined
			})
			Dispatcher.dispatch({
				actionType: 'WX_JS_CONFIG',
				onMenuShareAppMessage: this.wx_config_share_home
			})
		}
  }

	_handleAnswerListDone(re) {
    if(re && re.result) {
      this.setState({
        answer: this.state.answer.concat(re.result),
				loadLength: re.result.length
      })
    }
  }

	_scroll() {
		if(this.state.answer.length > 0) {
			if( (this.answerList.scrollHeight - this.answerList.scrollTop - 220) <  document.documentElement.clientHeight) {
				if(this.state.loadLength < 15) {
					return false
				} else {
					this._loadMore()
				}
			}
		}
	}

	_loadMore() {
		Dispatcher.dispatch({
			actionType: 'AnswerList',
			id: this.props.match.params.id,
      skip: this.state.answer.length,
      limit: 15
		})
	}

  componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-问题详情页')
		this._answerList = EventCenter.on("AnswerListDone", this._handleAnswerListDone.bind(this))
		this._questionDetail = EventCenter.on("QuestionDetailDone", this._handleQuestionDetailDone.bind(this))
    Dispatcher.dispatch({
      actionType: 'QuestionDetail',
      id: this.props.match.params.id
    })
		Dispatcher.dispatch({
      actionType: 'AnswerList',
      id: this.props.match.params.id,
      skip: 0,
      limit: 15
    })

  }

  componentWillUnmount() {
    this._questionDetail.remove()
		this._answerList.remove()
  }

  render() {
		console.log('this.--------',this.state.canAdopted);
		let answerListData = {
			answer:this.state.answer,
			title:this.state.question.title || '',
			isMyQuestion:this.state.isMyQuestio || '',
			canAdopted:this.state.canAdopted,
			questionId:this.props.match.params.id,
			isLogin:this.state.isLogin,
		}
		if(this.state.labels.length > 0) {
			var labels = this.state.labels.map((item, index) => {
				return(
					<div key={index} style={{...styles.lab, marginRight: 10, marginLeft: 12}}>{item.name}</div>
				)
			})
		} else {
			var labels = <div style={{display: 'none'}}></div>
		}

    return(
      <div style={{backgroundColor: '#fff'}}>
				<div style={{padding: '20px 12px 0px 12px'}}>
					<div style={{...styles.span}}>{this.state.question.title || ''}</div>
				</div>
				<div
					style={{overflow: 'scroll', height: document.documentElement.clientHeight - 113}}
					ref={(answerList) => this.answerList = answerList}
					onTouchEnd={this._scroll.bind(this)}
				>
					{labels}
					<div dangerouslySetInnerHTML={{__html: this.state.question.content}} style={{...styles.content}}></div>
					<div style={{...styles.answer_num}}>{this.state.question.question_answer_num} 回答</div>
					<div style={{...styles.answer_num, float: 'right'}}>{new Date(this.state.question.last_time).format('yyyy-MM-dd')}</div>
					<hr style={{...styles.tab_hr, marginBottom: 10, marginTop: 10}}></hr>
					<AnswerList {...answerListData}/>
				</div>
				<div style={{...styles.bottom_label}}>
					<div style={{ paddingLeft: 12, paddingRight: 12}}>
						<div style={{display: 'inline-block', marginLeft: 10}} onClick={this._collect.bind(this)}>
							<img src={Dm.getUrl_img('/img/v2/icons/qa-collect@2x.png')} width='20px' height='20px' style={{marginTop: 8, display: this.state.isCollected ? 'none' : 'block', marginLeft: 3}}/>
							<img src={Dm.getUrl_img('/img/v2/icons/qa-collect-full@2x.png')} width='20px' height='20px' style={{marginTop: 8, display: this.state.isCollected ? 'block' : 'none', marginLeft: 3}}/>
							<span style={{fontSize: 13, color: '#666', display: this.state.isCollected ? 'none' : 'block', marginTop: 3}}>关注</span>
							<span style={{fontSize: 13, color: '#666', display: this.state.isCollected ? 'block' : 'none', marginLeft: -7, marginTop: 3}}>已关注</span>
						</div>
						<Link to={{pathname: this.state.isLogin == true ? `${__rootDir}/addAnswer` : `${__rootDir}/login`, query: null, hash: null, state: {question_id: this.props.match.params.id, isLogin: this.state.isLogin}}}>
							<div style={{float: 'right', marginTop: 13}}>
								{/*<input style={{...styles.input}} placeholder='输入您的回答...' disabled='true'></input>*/}
								<div style={{...styles.input, fontSize: 14, color: "#666", lineHeight: '30px'}}>输入您的评论</div>
							</div>
						</Link>
					</div>
				</div>
      </div>
    )
  }
}

var styles = {
  span: {
		fontSize: 14,
		color: '#333',
		marginBottom: 10,
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 1,
		// lineHeight: '20px'
	},
	lab: {
		fontSize: 11,
		color: '#999',
		marginBottom: 10,
		padding: '2px 8px',
		backgroundColor: '#e3f1fc',
		display: 'inline-block',
		borderRadius: 4
	},
	content: {
		fontSize: 13,
		color: '#666',
		marginBottom: 15,
		marginLeft: 12,
		marginRight: 12
	},
	answer_num: {
		fontSize: 13,
		color: '#999',
		display: 'inline-block',
		margin: '0px 12px'
	},
	tab_hr: {
    height: 1,
		border: 'none',
		backgroundColor: '#e5e5e5'
  },
	input: {
		width: 165,
		height: 30,
		backgroundColor: '#f6f6f6',
		borderRadius: 4,
		paddingLeft: 13,
		border:'none'
	},
	bottom_label: {
		position: 'fixed',
		zIndex: 999,
		bottom: 0,
		height: 60,
		backgroundColor: '#fff',
		width: window.screen.width
	}
}


export default PgQuestionDetail;
