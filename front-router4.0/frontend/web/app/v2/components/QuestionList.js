import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import FullLoading from '../components/FullLoading';
import Dm from '../util/DmURL'

class QuestionList extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      questionList: [],
      ballHide: false,
			loadLength: '',
			isShow: false,
			canNotLoad: false,
			isOver: false,
			isLogin: false
			// isLoading: true
		};

	}

  _handleGetQAList(re) {
		console.log('re',re)
    this.setState({
      questionList: re.result,
			loadLength: re.result.length,
			isLogin: re.user.isLogined,
			isShow: false,
			isOver: false
    })
  }

  _labelScroll() {
		// this.setState({
		// 	ballHide: false
		// })
		if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
			if(this.state.canNotLoad == true) {
				this.setState({
					isShow: true,
					isOver: false
				})
				return
			}
			if(this.state.loadLength < 15) {
				this.setState({
					isShow: false,
					isOver: true
				})
				return
			} else {
				this._loadMore()
			}
		}
    EventCenter.emit("QuestionLabelScroll")
	}

  _ballType(event) {
		clearTimeout(this.t)
    this.t = setTimeout(() => {
			this.setState({
				ballHide: false
			})
		}, 200)

  }

	_hideBall() {
		this.setState({
      ballHide: true
    })
	}

	_loadMore() {
		Dispatcher.dispatch({
			actionType: 'QAListLoadMore',
      skip: this.state.questionList.length,
      limit: 15
		})
	}

	_handleLoadMore(re) {
		this.setState({
			questionList: this.state.questionList.concat(re.result),
			loadLength: re.result.length,
			isShow: false,
			canNotLoad: false
		})
	}

	_canNotLoad() {
		this.setState({
			canNotLoad: true
		})
	}

	removeHtmlTag(str) {
    if(str) {
      var str1 = str.replace(/<[^>]+>/g,"");
			var str2 = str1.replace(/&nbsp;/ig,'');
    }
    return str2;
	}

	componentWillMount() {
	}

  componentDidMount() {
		EventCenter.emit('StartLoad')
    this._getQAList = EventCenter.on('QAListDone', this._handleGetQAList.bind(this))
		this._getQAListLoadMore = EventCenter.on('QAListLoadMoreDone', this._handleLoadMore.bind(this))
		this._canNotLoad = EventCenter.on('CanNotLoad', this._canNotLoad.bind(this))
  }

	componentWillUnmount() {
		this._getQAList.remove()
		this._getQAListLoadMore.remove()
		this._canNotLoad.remove()
	}

  render() {
    var list = this.state.questionList.map((item, index) => {
      var marginTop
			var hr
      if(index == 0) {
        marginTop = 5
      } else {
        marginTop = 20
      }
			if(index+1 == this.state.questionList.length) {
				hr = 'none'
			} else {
				hr = 'block'
			}
			var title = this.removeHtmlTag(item.title)
      return(
        <div key={index}>
				<Link to={`${__rootDir}/QaDetail/${item.id}`}>
          <div style={{margin: '0px 12px 15px 12px', marginTop: marginTop, width: window.screen.width-24}}>
            <p style={{...styles.span}}>{title}</p>
            <div style={{...styles.div_bottom, display: 'inline-block'}}>{item.question_answer_num} 回答</div>
            <div style={{...styles.div_bottom, float: 'right', display: 'inline-block'}}>{new Date(item.create_time).format('yyyy-MM-dd')}</div>
          </div>
          <hr style={{...styles.hr, display: hr}}></hr>
				</Link>
        </div>
      )
    })

    return(
			<div>
				<div
					ref={(lessonList) => this.lessonList = lessonList}
					style={{overflow: 'scroll', height: document.documentElement.clientHeight-160}}
					onTouchEnd={this._labelScroll.bind(this)}
					onScroll={this._ballType.bind(this)}
					onTouchStart={this._hideBall.bind(this)}
				>
					{/*<FullLoading isShow={this.state.isLoading}/>*/}
					<div style={{display: this.state.loadLength == 0 ? 'block' : 'none', marginTop: 20, height: this.state.listHeight,textAlign:'center'}}>
						<img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} style={{width: 188, height: 128, marginTop: 100}}/>
						<div style={{fontSize: 16, color: '#666', textAlign: 'center'}}>暂无相关数据~</div>
					</div>
					{list}
					<Loading isShow={this.state.isShow}/>
					<div style={{height: 40, display: this.state.isOver == true && this.state.isShow == false ? 'block' : 'none', textAlign: 'center'}}>共{this.state.questionList.length}条</div>
				</div>

				<Link to={this.state.isLogin ? `${__rootDir}/question` : `${__rootDir}/login`}>
					<div style={{...styles.ball, display: this.state.ballHide ? 'none' : 'inline-block'}}>提问</div>
				</Link>
			</div>

    )
  }
}

var styles = {
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
  ball: {
    width: 56,
    height: 56,
    position: 'absolute',
    bottom: 83,
    textAlign: 'center',
    lineHeight: '56px',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#2196f3',
    borderRadius: 50,
    left: window.screen.width/2-28,
		opacity: 0.8
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

export default QuestionList;
