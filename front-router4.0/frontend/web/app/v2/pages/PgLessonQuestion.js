/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

var skip = 0;
class PgLessonQuestion extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      question: [],
      req_length: '',
			loadmore:true,
		};
	}

	_handleOnlineCommentList(re) {
		var req = re.result
		this.setState({
			question: req,
			req_length: req.length,
			loadmore: req.length >= 15 ? true : false,
		},()=>{
				skip = this.state.question.length
		})
	}
	_handleLoadMore(re){
		var req = re.result
		this.setState({
			question: this.state.question.concat(req),
			req_length: req.length,
			loadmore: req.length >= 15 ? true : false,
		},()=>{
			skip = this.state.question.length
		})
	}

	_loadMore() {
    var type
    if(this.props.match.params.type == 'online') {
      type = 2
    } else if(this.props.match.params.type == 'live') {
      type = 1
    } else {
      type = 3
    }
		Dispatcher.dispatch({
      actionType: "QAList",
			resource_id: this.props.match.params.id,
      resource_type: type,
			skip: skip,
			limit: 15,
			LoadMore:true,
		})
	}

	_labelScorll() {
		if( (this._question.scrollHeight - this._question.scrollTop - 20) <  document.documentElement.clientHeight) {
			if(this.state.LoadMore) {
				return false
			} else {
				this._loadMore()
			}
		}
	}

	componentWillMount() {
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-问答列表')
    var type
    if(this.props.match.params.type == 'online') {
      type = 2
    } else if(this.props.match.params.type == 'live') {
      type = 1
    } else {
      type = 3
    }
    Dispatcher.dispatch({
			actionType: "QAList",
			resource_id: this.props.match.params.id,
      resource_type: type,
			skip: 0,
			limit: 15
		})
		this.commentList = EventCenter.on("QAListDone", this._handleOnlineCommentList.bind(this))
		this.loadMore = EventCenter.on('QAListLoadMoreDone', this._handleLoadMore.bind(this))
	}
	componentWillUnmount() {
		this.commentList.remove()
		this.loadMore.remove()
	}
	removeHtmlTag(str) {
		if(str) {
			var str1 = str.replace(/<[^>]+>/g,"");
			var str2 = str1.replace(/&nbsp;/ig,'');
		}
		return str2;
	}
	render(){
    var list = this.state.question.map((item, index) => {
      var marginTop
			var hr
			if(index+1 == this.state.question.length) {
				hr = 'none'
			} else {
				hr = 'block'
			}
			var title = this.removeHtmlTag(item.title)
      return(
        <div key={index}>
				<Link to={`${__rootDir}/QaDetail/${item.id}`}>
          <div style={{margin: '0px 12px 15px 12px', marginTop: 20, width: devWidth-24}}>
            <p style={{...styles.span}} dangerouslySetInnerHTML={{__html: title}}></p>
            <div style={{...styles.div_bottom, display: 'inline-block'}}>{item.question_answer_num} 回答</div>
            <div style={{...styles.div_bottom, float: 'right', display: 'inline-block'}}>{new Date(item.last_time).format('yyyy-MM-dd')}</div>
          </div>
          <hr style={{...styles.hr, display: hr}}></hr>
				</Link>
        </div>
      )
    })

		return (
			<div style={{...styles.big_div}} ref={(_question) => this._question = _question} onTouchEnd={() => {
				this._labelScorll()
			}}>
			{ this.state.question.length > 0 ?
				list
				:
				<div style={{marginTop: 20}}>
					<img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')}/>
					<div style={{textAlign: 'center', fontSize: 14, color: '#666', marginTop: 12}}>暂无数据,返回上页添加第一条问题~</div>
				</div>
			}
			<div style={{display:!this.state.loadMore ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray,marginTop:10,}}>已经到底啦~</div>
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
	label: {
    width: devWidth-75,
    top: -20,
    position: 'relative',
    display: 'inline-block',
    left: 65,
	},
  span: {
		fontSize: 15,
		color: '#333',
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		lineHeight: '20px'
	},
	div_bottom: {
		marginTop: 8,
		color: '#999',
		fontSize: 14,
	},
	hr: {
		height: 1,
		border: 'none',
		backgroundColor: '#f3f3f3',
		marginTop: 15,
		margin: '0px 12px'
	}
}

export default PgLessonQuestion;
