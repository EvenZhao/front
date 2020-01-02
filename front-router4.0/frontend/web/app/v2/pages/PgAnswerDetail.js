import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import AdoptAlert from '../components/AdoptAlert';

class PgAnswerDetail extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      answer: '',
      title: '',
      user: '',
      comment: [],
			content: '',
			time: '',
			user_id: '',
			loadLength: '',
			comment_num: '',
			isMyQuestion: false,
			canAdopted: false,
			isShow: false,
			isAdopt: false,
			isLogin: false,
		};
	}

  _handleAnswerComment(re) {
    if(re && re.result) {
      this.setState({
        comment: this.state.comment.concat(re.result),
				loadLength: re.result.length
      })
    }
  }

	_handleAnswerCommentNub(re) {
		console.log("RE",re)
		if(re && re.result) {
			this.setState({
				comment_num: re.result.answer.answer_comment_num,
				content: re.result.answer.content,
				time: re.result.answer.last_time,
				user: re.result.answer.user,
				user_id: re.result.answer.user_id,
				isAdopt: re.result.answer.status == 1 ? true : false,
				title: re.result.question.title,
				isLogin: re.user.isLogined,
				isMyQuestion: re.result.isMyQuestion,
				canAdopted: re.result.canAdopted
			})
		}
	}

	_handleHideAdoptAnswer() {
		this.setState({
			isShow: false
		})
	}

	_handleSendAdoptAnswer() {
		this.setState({
			isShow: false,
			isAdopt: true
		}, () => {
			Dispatcher.dispatch({
				actionType: 'AdoptAnswer',
				id: this.props.location.state.answer.id,
				question_id: this.props.location.state.questionId
			})
		})
	}

	_handleAdoptAnswer(re) {
		console.log(re)
	}

	_scroll() {
		if( (this.answerComment.scrollHeight - this.answerComment.scrollTop - 120) <  document.documentElement.clientHeight) {
			if(this.state.loadLength < 15) {
				return
			} else {
				this._loadMore()
			}
		}
	}

	_loadMore() {
		Dispatcher.dispatch({
      actionType: 'AnswerComment',
      id: this.props.location.state.answer.id,
      skip: this.state.comment.length,
      limit: 15
    })
	}

	_adoptAnswer() {
		if(this.state.isAdopt) {
			return
		} else {
			this.setState({
				isShow: true
			})
		}
	}

  componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-回答详情页')
    this._getAnswerComment = EventCenter.on('AnswerCommentDone',this._handleAnswerComment.bind(this))
		this._getCommentNum = EventCenter.on("AnswerDetailDone", this._handleAnswerCommentNub.bind(this))
		this._hideAdoptAnswer = EventCenter.on("HideAdoptAlert", this._handleHideAdoptAnswer.bind(this))
		this._sendAdoptAnswer = EventCenter.on("_adoptAnswer", this._handleSendAdoptAnswer.bind(this))
		this._handleAdoptAnswer = EventCenter.on("AdoptAnswerDone", this._handleAdoptAnswer.bind(this))
    Dispatcher.dispatch({
      actionType: 'AnswerComment',
      id: this.props.match.params.id,
      skip: 0,
      limit: 15
    })
		Dispatcher.dispatch({
			actionType: 'AnswerDetail',
			id: this.props.match.params.id,
		})
  }
	removeHtmlTag(str) {
		if(str) {
			var str1 = str.replace(/<[^>]+>/g,"");
			var str2 = str1.replace(/&nbsp;/ig,'');
		}
		return str2;
	}
	componentWillUnmount() {
    this._getAnswerComment.remove()
		this._getCommentNum.remove()
		this._hideAdoptAnswer.remove()
		this._sendAdoptAnswer.remove()
		this._handleAdoptAnswer.remove()
	}

  render() {
    var comment_dis
		var to_name
    if(this.state.comment.length > 0) {
      comment_dis = 'block'
      var comment = this.state.comment.map((item, index) => {
        var hr
        var marginTop
        if(index+1 == this.state.comment.length) {
          hr = 'none'
        } else {
          hr = 'block'
        }
        if(index == 0) {
          marginTop = 17
        } else {
          marginTop = 0
        }
				if(item.to_nick_name != null) {
					to_name = 'inline-block'
				} else {
					to_name = 'none'
				}
				var content = this.removeHtmlTag(item.content)
				console.log('content-----------',content);
        return(
          <div key={index} style={{marginTop: marginTop}}>
            <div style={{margin: '0px 12px 10px 12px'}}>
              <img src={item.user_info.photo} style={{width: 26, height: 26, borderRadius: 50}}/>
              <div style={{...styles.nick_name}}>{item.user_info.nick_name}</div>
							<div style={{...styles.nick_name, color: '#999', display: to_name}}>回复</div>
							<div style={{...styles.nick_name, display: to_name}}>{item.to_nick_name}</div>
              <div style={{...styles.content}}>{content}</div>
						<Link to={{pathname: this.state.isLogin ? `${__rootDir}/addAnswerComment` : `${__rootDir}/login`, query: null, hash: null, state: {answer_id: this.props.match.params.id, parent_id: item.id}}}>
              <div style={{...styles.comment ,display: 'inline-block'}}>回复</div>
						</Link>
              <div style={{...styles.comment, float: 'right'}}>{new Date(item.create_time).format('yyyy-MM-dd')}</div>
            </div>
            <hr style={{...styles.tab_hr, margin: '0px 12px 10px', display: hr}}></hr>
          </div>
        )
      })
    } else {
      comment_dis = 'none'
      var comment = <div style={{display: 'none'}}></div>
    }

    return(
      <div style={{backgroundColor: '#fff'}}>
			<div style={{height: devHeight, width: devWidth, backgroundColor: '#000', opacity: 0.5, position: 'absolute', zIndex: 1, display: this.state.isShow ? 'block' : 'none'}}></div>
				<AdoptAlert isShow={this.state.isShow}/>
        <div style={{padding: '20px 12px'}}>
          <div style={{...styles.span}}>{this.state.title}</div>
        </div>
        <hr style={{...styles.hr}}></hr>
        <div
					style={{height: devHeight-126, overflow: 'scroll'}}
					ref={(answerComment) => this.answerComment = answerComment}
					onTouchEnd={this._scroll.bind(this)}
				>
          <div style={{margin: '0px 12px 10px 12px'}}>
            <img src={this.state.user.photo} style={{width: 26, height: 26, borderRadius: 50}}/>
            <div style={{...styles.nick_name}}>{this.state.user.nick_name} <span style={{fontSize: 15, color: '#666'}}>回答</span></div>
            <div style={{...styles.content}} dangerouslySetInnerHTML={{__html: this.state.content}}></div>
            <div style={{...styles.comment}}>{this.state.comment_num} 评论</div>
            <img style={{marginRight: 10, display: 'inline-block', width: 15, height: 13}} src={Dm.getUrl_img('/img/v2/icons/qa-comment@2x.png')}></img>
            <div style={{...styles.bottom_label, float: 'right'}}>{new Date(this.state.time).format('yyyy-MM-dd')}</div>
          </div>
          <div style={{width: devWidth < 350 ? 250 : 290, marginLeft: devWidth < 350 ? 40 : 45, border:'1px solid #e5e5e5', display: comment_dis, borderRadius: 2, marginBottom: 11}}>
            <em style={{display:'block', width:30, height:16, fontSize:30, overflow:'hidden', position:'relative', marginLeft:13, marginTop:-16,color:'#e8e8e8',fontStyle:'normal'}}>&#9670;</em>
            <span style={{display:'block', width:30, height:16, fontSize:30, overflow:'hidden', position:'relative', marginLeft:13, marginTop:-14,color:'white'}}>&#9670;</span>

						{comment}

          </div>
        </div>

        <div style={{...styles.bottom_div}}>
					<hr style={{height: 1, border: 'none', backgroundColor: '#f3f3f3'}}/>
					<div style={{ paddingLeft: 12, paddingRight: 12}} onClick={this._adoptAnswer.bind(this)}>
						<div style={{display: this.state.canAdopted ? 'inline-block' : 'none'}}>
							<img src={this.state.isAdopt ? Dm.getUrl_img('/img/v2/icons/adopt@2x.png') : Dm.getUrl_img('/img/v2/icons/unadopt@2x.png')} width='20px' height='20px' style={{marginTop: 8, display: 'block', marginLeft: this.state.isAdopt ? 10 : 3}}/>
              {/*<img src= width='20px' height='20px' style={{marginTop: 8, display: 'none', marginLeft: 3}}/>*/}
							<span style={{fontSize: 13, color: this.state.isAdopt ? '#2196f3' : '#666'}}>{this.state.isAdopt ? '已采纳' : '采纳'}</span>
						</div>
					</div>
					<Link to={{pathname: this.state.isLogin ? `${__rootDir}/addAnswerComment` : `${__rootDir}/login`, query: null, hash: null, state: {answer_id: this.props.match.params.id, parent_id: 0, isLogin: this.state.isLogin}}}>
						<div style={{float: 'right', marginTop: 13}}>
							{/*<input style={{...styles.input}} placeholder='输入您的评论...' disabled='true'></input>*/}
							<div style={{...styles.input, fontSize: 14, color: "#666", lineHeight: '30px'}}>输入您的评论</div>
						</div>
					</Link>
				</div>
      </div>
    )
  }
}

var styles = {
  span: {
		fontSize: 14,
		color: '#333',
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 1,
		lineHeight: '20px'
	},
  content: {
		fontSize: 14,
		color: '#666',
		marginBottom: 10,
    marginLeft: 33,
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		// WebkitLineClamp: 3,
		lineHeight: '20px'
	},
  nick_name: {
		display: 'inline-block',
    fontSize: 14,
    color: '#000',
    position: 'relative',
    top: -7,
    marginLeft: 6
	},
  bottom_label: {
		fontSize: 14,
    color: '#999',
	},
	comment: {
		fontSize: 14,
    color: '#999',
    marginRight: 10,
    display: 'inline-block',
    marginLeft: 34
	},
	hr: {
		height: 1,
		border: 'none',
		backgroundColor: '#f3f3f3',
    marginBottom: 10
	},
  bottom_div: {
		position: 'fixed',
		zIndex: 999,
		bottom: 0,
		height: 55,
		backgroundColor: '#fff',
		width: devWidth,
  },
  input: {
		width: 165,
		height: 30,
		backgroundColor: '#f6f6f6',
		borderRadius: 4,
		paddingLeft: 13,
		border:'none',
		marginRight: 12
	},
  tab_hr: {
    height: 1,
		border: 'none',
		backgroundColor: '#e5e5e5'
  },
  answer_num: {
		fontSize: 14,
		color: '#999',
		display: 'inline-block',
		margin: '0px 12px'
	},
}

export default PgAnswerDetail;
