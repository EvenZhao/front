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
import TeacherLesson from '../components/TeacherLesson';
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import LiveLessonDiv from '../components/LiveLessonDiv';
import OfflineLessonDiv from '../components/OfflineLessonDiv';
import Loading from '../components/Loading';
import Dm from '../util/DmURL'


class PgTeacherDetail extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      isOpen: false,
      teacher_tab: 'lesson',
			teacher_lesson: [],
			live_lesson: [],
			online_lesson: [],
			offline_lesson: [],
			teacher_question: [],
			count: '',
			loadLength: '',
			isShow: false,
			isOver: false,
			detail: ''
		};
  }

  _changeTeacherContent() {
    if(this.state.isOpen) {
      this.setState({
        isOpen: false
      })
    } else {
      this.setState({
        isOpen: true
      })
    }
  }

  _changeTeacherTab(type) {
    if(type === 'lesson') {
      this.setState({
        teacher_tab: 'lesson'
      })
			Dispatcher.dispatch({
				actionType: 'TeacherLesson',
				id: this.props.match.params.id
			})
    } else if(type === 'question'){
      this.setState({
        teacher_tab: 'question',
				teacher_question: []
      })
			Dispatcher.dispatch({
				actionType: 'TeacherQuestion',
				id: this.props.match.params.id,
				skip: 0,
				limit: 15
			})
    }
  }

	_handleTeacherLesson(re) {
		console.log("RE",re)
		if(re && re.result) {
			this.setState({
				teacher_lesson: re.result,
				live_lesson: re.result.live_lesson,
				online_lesson: re.result.online_lesson,
				offline_lesson: re.result.offline_lesson,
				count: re.result.count,
				detail: re.result.detail
			})
		}
	}

	_handleTeacherQuestion(re) {
		if(re && re.result) {
			this.setState({
				teacher_question: this.state.teacher_question.concat(re.result),
				loadLength: re.result.length
			})
		}
	}

	_labelScroll() {
		if( (this.questionList.scrollHeight - this.questionList.scrollTop - 220) <  document.documentElement.clientHeight) {
			if(this.state.loadLength < 15) {
				this.setState({
					isShow: false,
					isOver: true
				})
				return false
			} else {
				this._loadMore()
				this.setState({
					isShow: true,
					isOver: false
				})
			}
		}
	}

	_labelUp() {
		this.setState({
			isOpen: false
		})
	}

	_loadMore() {
		Dispatcher.dispatch({
			actionType: 'TeacherQuestion',
			id: this.props.match.params.id,
			skip: this.state.teacher_question.length,
			limit: 15
		})
	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-讲师详情页')
		this._getTeacherLesson = EventCenter.on("TeacherLessonDone", this._handleTeacherLesson.bind(this))
		this._getTeacherQuestion = EventCenter.on("TeacherQuestionDone", this._handleTeacherQuestion.bind(this))
		this._changeTeacherTab('lesson')
	}

	componentWillUnmount() {
		this._getTeacherLesson.remove()
		this._getTeacherQuestion.remove()
	}

  render() {
    var tabMarginLeft
    var tabMarginRight
    let screenWidth = devWidth
    if(this.state.teacher_tab === 'lesson') {
      tabMarginLeft = 0,
      tabMarginRight = screenWidth/2
    } else if(this.state.teacher_tab === 'question') {
      tabMarginLeft = screenWidth/2,
      tabMarginRight = 0
    }

		let onlineProps = {
			data: this.state.online_lesson,
		}

		let liveProps = {
			data: this.state.live_lesson
		}

		let offlineProps = {
			data: this.state.offline_lesson
		}

		var list = this.state.teacher_question.map((item, index) => {
      var marginTop
			var hr
      if(index == 0) {
        marginTop = 5
      } else {
        marginTop = 20
      }
			if(index+1 == this.state.teacher_question.length) {
				hr = 'none'
			} else {
				hr = 'block'
			}
      return(
        <div key={index}>
				<Link to={`${__rootDir}/QaDetail/${item.id}`}>
          <div style={{margin: '0px 12px 10px 12px', marginTop: marginTop, width: screenWidth-24}}>
            <p style={{...styles.span}}>{item.title}</p>
            <div style={{...styles.div_bottom, display: 'inline-block'}}>{item.question_answer_num} 回答</div>
            <div style={{...styles.div_bottom, float: 'right', display: 'inline-block'}}>{new Date(item.create_time).format('yyyy-MM-dd')}</div>
          </div>
          <hr style={{...styles.hr, display: hr}}></hr>
				</Link>
        </div>
      )
    })

		var img_url
		var detail_height
		var introduction_height
		var check_div_display
    let detail = this.state.detail
		if(detail && detail.introduction) {
			if(detail.introduction.length == 0) {
				img_url = Dm.getUrl_img(`/img/v2/icons/teacher_info_bg_havent@2x.png`)
				detail_height = 96
				introduction_height = 0
				check_div_display = 'none'
			} else {
				if(this.state.isOpen == true) {
					img_url = Dm.getUrl_img(`/img/v2/icons/teacher_info_bg@2x.png`)
					detail_height = 328
					introduction_height = 196
					check_div_display = 'block'
				} else {
					img_url = Dm.getUrl_img(`/img/v2/icons/teacher_info_bg_close@2x.png`)
					detail_height = 164
					introduction_height = 35
					check_div_display = 'block'
				}
			}
		}
    return (
      <div style={{backgroundColor: '#fff'}}>
        <div style={{height: this.state.isOpen ? 328 : 164}}>
          {/*<div style={{height: this.state.isOpen ? 328 : 164, width: '100%', position: 'absolute', opacity: 0.5, backgroundColor: 'black', overflow: 'srcoll'}}></div>*/}
					<img src={img_url} style={{height: detail_height, width: screenWidth, position: 'absolute', overflow: 'srcoll'}}/>
          <img src={detail.photo} style={{marginTop: 14, marginLeft: 20, borderRadius: 50, width: 60, height: 60, position: 'relative'}}/>
          <div style={{position: 'relative', display: 'inline-block', marginLeft: 14, top: -11}}>
            <p style={{color: '#fff', fontSize: 15}}>{detail.name}</p>
            <span style={{color: '#d9d9d9', fontSize: 12, display: 'flex', overflow: 'hidden', width: screenWidth - 108, height: 20}}>{`${detail.company} ${detail.position}`}</span>
          </div>
          <div style={{margin: '10px 14px 0px 14px', height: introduction_height, overflow: 'scroll', position: 'relative'}}>
            <p style={this.state.isOpen ? styles.teacher_content_open : styles.teacher_content}>
              {detail.introduction}
            </p>
          </div>
          <div style={{width: '100%', textAlign: 'center', position: 'relative', display: check_div_display}} onClick={this._changeTeacherContent.bind(this)}>
            {/*<div style={{textAlign: 'center', display: this.state.isOpen ? 'none' : 'inline-block'}}>V</div>*/}
						<img src={Dm.getUrl_img(`/img/v2/icons/arrow---up-@2x.png`)} style={{textAlign: 'center', display: this.state.isOpen ? 'none' : 'inline-block', width: 12, height: 15}}/>
						<img src={Dm.getUrl_img(`/img/v2/icons/arrow---down@2x.png`)} style={{textAlign: 'center', display: this.state.isOpen ? 'inline-block' : 'none', width: 12, height: 15}}/>
            {/*<div style={{textAlign: 'center', display: this.state.isOpen ? 'inline-block' : 'none'}}>^</div>*/}
          </div>
        </div>

        <div style={{height: 45, backgroundColor: "#fff"}}>
          <div style={{width: screenWidth/2, textAlign: 'center', display: 'inline-block', height: 44, lineHeight: '44px'}}
            onClick={() => {this._changeTeacherTab('lesson')}}
          >
            <span style={{color: this.state.teacher_tab === 'lesson' ? '#2196f3' : '#999', fontSize: 15}}>TA的课程</span>
          </div>
          <div style={{width: screenWidth/2, textAlign: 'center', display: 'inline-block', height: 44, lineHeight: '44px'}}
            onClick={() => {this._changeTeacherTab('question')}}
          >
            <span style={{color: this.state.teacher_tab === 'question' ? '#2196f3' : '#999', fontSize: 15}}>TA的问答</span>
          </div>
          <hr style={{width: screenWidth/2, border: '1px solid', borderTop: 0, borderColor: '#2196f3', marginRight: tabMarginRight, marginLeft: tabMarginLeft}}></hr>
        </div>

        <div style={{display: this.state.teacher_tab === 'lesson' ? 'inline-block' : 'none', height: devHeight - 209, overflow: 'scroll'}}
					onTouchMove={this._labelUp.bind(this)}
				>
					<Link to={{pathname: `${__rootDir}/teacher/lesson/list/online`, query: null, hash: null, state: {id: this.props.match.params.id}}}>
						<div style={{padding: '12px 0px 0px', width: screenWidth, height: 18, display: this.state.online_lesson.length > 0 ? 'block' : 'none'}}>
							<img src={Dm.getUrl_img('/img/v2/icons/online@2x.png')} style={{...styles.logo, width: 22}}/>
							<span style={{...styles.logo_title}}>视频课</span>
							<div style={{...styles.count_num}}>{this.state.count.onlineCount}</div>
							<img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.online_lesson.length > 0 ? 'block' : 'none'}}/>
						</div>
					</Link>
					<OnlineLessonDiv {...onlineProps}/>
					<hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.online_lesson.length > 0 ? 'block' : 'none'}}></hr>
					<Link to={{pathname: `${__rootDir}/teacher/lesson/list/live`, query: null, hash: null, state: {id: this.props.match.params.id}}}>
						<div style={{padding: '12px 0px 0px', width: screenWidth, display: this.state.live_lesson.length > 0 ? 'block' : 'none'}}>
							<img src={Dm.getUrl_img('/img/v2/icons/live@2x.png')} style={{...styles.logo}}/>
							<span style={{...styles.logo_title}}>直播课</span>
							<div style={{...styles.count_num}}>{this.state.count.liveCount}</div>
							<img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.live_lesson.length > 0 ? 'block' : 'none'}}/>
						</div>
					</Link>
					<LiveLessonDiv {...liveProps}/>
					<hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.live_lesson.length > 0 ? 'block' : 'none'}}></hr>
					<Link to={{pathname: `${__rootDir}/teacher/lesson/list/offline`, query: null, hash: null, state: {id: this.props.match.params.id}}}>
						<div style={{padding: '12px 0px 0px', width: screenWidth, height: 24, display: this.state.offline_lesson.length > 0 ? 'block' : 'none'}}>
							<img src={Dm.getUrl_img('/img/v2/icons/offline@2x.png')} style={{...styles.logo, width: 23, height: 23}}/>
							<span style={{...styles.logo_title}}>线下课</span>
							<div style={{...styles.count_num}}>{this.state.count.offlineCount}</div>
							<img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{float: 'right', marginRight: 12, width: 10, height: 15, display: this.state.offline_lesson.length > 0 ? 'block' : 'none'}}/>
						</div>
					</Link>
					<OfflineLessonDiv {...offlineProps}/>
					<hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3', margin: '0px 12px', display: this.state.offline_lesson.length > 0 ? 'block' : 'none'}}></hr>
        </div>

        <div
					style={{display: this.state.teacher_tab === 'question' ? 'inline-block' : 'none', height: devHeight - 209, overflow: 'scroll', width: '100%'}}
					ref={(questionList) => this.questionList = questionList}
					onTouchEnd={this._labelScroll.bind(this)}
				>
					{list}
					<Loading isShow={this.state.isShow}/>
					<div style={{height: 40, display: this.state.isOver == true && this.state.isShow == false && this.state.teacher_question.length > 0 ? 'block' : 'none', textAlign: 'center'}}>共{this.state.teacher_question.length}条</div>

					<div style={{display: this.state.teacher_question.length == 0 ? 'block' : 'none'}}>
						<img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} style={{width: 230, height: 170, marginLeft: screenWidth / 2 - 115, marginTop: 20}}/>
						<div style={{textAlign: 'center', fontSize: 14, color: '#666'}}>暂无相关数据~</div>
					</div>

				</div>

      </div>
    );
  }
}

var styles = {
	count_num: {
		border: '1px solid #d1d1d1',
		height: 11,
		padding: '2px 10px',
		display: 'inline-block',
		fontSize: 12,
		color: '#d1d1d1',
		lineHeight: '11px',
		position: 'relative',
		top: -5,
		marginLeft: 8,
		borderRadius: 8
	},
  teacher_content: {
    color: '#d9d9d9',
    fontSize: 12,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    textOverflow:'ellipsis',
    overflow: 'hidden'
  },
  teacher_content_open: {
    color: '#d9d9d9',
    fontSize: 12,
  },
	logo: {
		marginLeft: 12,
		width: 18,
		height: 18,
		borderColor: 'red',
		display: 'inline-block',
		marginRight: 9
	},
  logo_title: {
		color: '#333',
		fontSize: 15,
    position: 'relative',
    top: -3
	},
	div_bottom: {
		marginTop: 8,
		color: '#999',
		fontSize: 14,
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
	hr: {
		height: 1,
		border: 'none',
		backgroundColor: '#f3f3f3',
		marginTop: 15,
		margin: '0px 12px'
	}
}

export default PgTeacherDetail;
