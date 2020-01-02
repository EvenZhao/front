/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import WeUI from 'react-weui';
import Star from '../components/star';
import CommentList from '../components/CommentList';
import Dm from '../util/DmURL'

class PgOnlineCommentList extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
      w_width: devWidth,
			commit: [],
			req_length: '',
		};
	}

	_handleOnlineCommentList(re) {
		console.log(re)
		var req = re.result
		this.setState({
			commit: this.state.commit.concat(req),
			req_length: req.length
		})
	}

	_loadMore() {
		Dispatcher.dispatch({
			actionType: "OnlineCommentList",
			id: this.props.match.params.id,
			skip: this.state.commit.length,
			limit: 15
		})
	}

	_labelScorll() {
		if( (this._comment.scrollHeight - this._comment.scrollTop - 220) <  document.documentElement.clientHeight) {
			if(this.state.req_length < 15) {
				return false
			} else {
				EventCenter.emit("CommentLoadMore")
			}
		}
	}

	componentWillMount() {
		Dispatcher.dispatch({
			actionType: "OnlineCommentList",
			id: this.props.match.params.id,
			skip: 0,
			limit: 15
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-评价')
		this.commentList = EventCenter.on("OnlineCommentListDone", this._handleOnlineCommentList.bind(this))
		this._loadMore = EventCenter.on('CommentLoadMore', this._loadMore.bind(this))
	}
	componentWillUnmount() {
		this.commentList.remove()
		this._loadMore.remove()
	}
	render(){
		let lab = {
			comList: this.state.commit,
			isList: true,
			space: true
		}

		return (
			<div style={{...styles.big_div}} ref={(_comment) => this._comment = _comment} onTouchEnd={() => {
				this._labelScorll()
			}}>
				<CommentList {...lab}/>
				<div style={{marginTop: 20, display: this.state.commit.length > 0 ? 'none' : 'block'}}>
					<img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')}/>
					<div style={{textAlign: 'center', fontSize: 14, color: '#666', marginTop: 12}}>暂无数据,返回上页添加第一条评论~</div>
				</div>
			</div>
		);
	}
}

var styles = {
	big_div: {
    backgroundColor: '#fff',
    height: devHeight,
    overflow: 'scroll'
  },
  teacher_img: {
		width: 43,
		height: 43,
		borderRadius: 50,
		display: 'inline-block',
		marginRight: 10
	},
  teacher_hr_margin: {
		backgroundColor: '#f3f3f3',
		border: 'none',
		height: 1,
		marginBottom: 15,
		marginTop: 15,
		marginLeft: 12,
		marginRight: 12
	},
	teacher_hr: {
		backgroundColor: '#e5e5e5',
		border: 'none',
		height: 1,
		marginBottom: 15,
		marginTop: 15
	},
	label: {
    width: devWidth-75,
    top: -20,
    position: 'relative',
    display: 'inline-block',
    left: 65,
	}
}

export default PgOnlineCommentList;
