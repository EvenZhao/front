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
import CommentLabel from '../components/CommentLabel';

class PgExam2 extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			exam: [],
			examContent: [],
			examTitle: '',
			examMulti: '',
			selectId: [],
			trueAnswer: [],
			correct: false,
			userAnswer: [],
			examInfos: [],
			enterpriseTask: false,
			examDetail: '',
			answers:[]
		};

    this.exam_alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

		this.exam_index = 0

		this.sendExam = []

		this.numLength = 0

		this.user_answer = []
	}

	_check_answer() {
		var correct
		var true_answer = this.state.trueAnswer.sort().toString()
		var select_answer = this.state.selectId.sort().toString()
		if(true_answer == select_answer) {
			correct = true
		} else {
			correct = false
		}
		this.setState({
			correct: correct
		})
	}

  _press(id, index) {
		if(this.state.examMulti == 1) {
			this.state.selectId = []
			this.state.selectId.push(id)
			this.setState({
				selectId: this.state.selectId
			})
		} else {
			let exist = this.state.selectId.indexOf(id)
			if (exist > -1) {
				this.state.selectId.splice(exist, 1)
			} else {
				this.state.selectId.push(id)
			}
			this.setState({
				selectId: this.state.selectId
			})
		}
		this._check_answer()
  }

	_nextOrCommit() {

		var exam_num
		var user_answer = {}
		if(this.state.selectId.length > 0) {
			user_answer.examId = this.state.examId
			user_answer.correct = this.state.correct
			user_answer.answer = this.state.selectId
			this.state.examInfos.push(user_answer)
			this.setState({
				examInfos: this.state.examInfos
			})
			if(this.exam_index == this.state.exam.length) {
				Dispatcher.dispatch({
					actionType: 'PostExamResult',
					resource_id: this.props.match.params.id,
					catalog_id: this.props.match.params.catalogId,
					enterpriseTask: this.state.enterpriseTask,
					examInfos: this.state.examInfos
				})
				return
			} else {
				exam_num = this.exam_index++
				var isMulti
				if (this.state.exam[exam_num].answers.length > 1) { //根据答案去区分单选还是多选
					isMulti = 2
				}else {
					isMulti = 1
				}
				console.log('isMulti-----',isMulti);
				this.setState({
					examContent: this.state.exam[exam_num].examContent,
					examTitle: this.state.exam[exam_num].examTitle,
					examMulti: isMulti,
					examId: this.state.exam[exam_num].examId,
					selectId: [],
					trueAnswer: []
				}, () => {
					this.state.examContent.map((item, index) => {
						if(item.answer == true) {
							this.state.trueAnswer.push(item.contentId)
						}
						this.setState({
							trueAnswer: this.state.trueAnswer
						})
					})
				})
			}
		} else {
			return
		}
	}

	_handlePostExam(re) {
		if(re) {
			this.props.history.push({pathname: `${__rootDir}/examDetail/${this.props.match.params.id}/${this.props.match.params.catalogId}`, query: null, hash: null, state: {user_answer: this.state.examInfos, exam: this.state.examDetail, catalogIdx: this.props.location.state.catalogIdx}})
		}
	}

	_handleGetExam(re) {
		console.log(re)
		var exam = re.results[0].examInfos
		var isMulti
		if (exam[0].answers.length > 1) {//根据答案去区分单选还是多选
			isMulti = 2
		}else {
			isMulti = 1
		}
		this.exam_index++
		this.setState({
			examDetail: re.results[0],
			exam: re.results[0].examInfos,
			examId: exam[0].examId,
			enterpriseTask: re.results[0].enterpriseTask,
			examContent: exam[0].examContent,
			examTitle: exam[0].examTitle,
			examMulti: isMulti,
			trueAnswer: []
		}, () => {
			this.state.examContent.map((item, index) => {
				if(item.answer == true) {
					this.state.trueAnswer.push(item.contentId)
				}
				this.setState({
					trueAnswer: this.state.trueAnswer
				})
			})
		})
	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-章节测试')
		Dispatcher.dispatch({
			actionType: 'GetExams',
			resource_id: this.props.match.params.id,
			catalog_id: this.props.match.params.catalogId
		})
		this._getExam = EventCenter.on('GetExamsDone', this._handleGetExam.bind(this))
		this._postExam = EventCenter.on('PostExamResultDone', this._handlePostExam.bind(this))
	}
	componentWillUnmount() {
		this._getExam.remove()
		this._postExam.remove()
	}
	render(){
    var exam = this.state.examContent.map((item, index) => {
			if(this.state.selectId.indexOf(item.contentId) > -1) {
				item.chose = true
			} else {
				item.chose = false
			}
      return(
        <div key={index} style={{margin: "20px 28px", fontSize: 15, wordBreak: 'break-all', color: item.chose ? '#2196f3' : '#666'}}
          onClick = {() => {
            this._press(item.contentId, index)
          }}
        >
					<div style={{display: 'inline-block', border: item.chose ? '1px solid #2196f3': 'none', borderRadius: 30, padding: item.chose ? '4px 15px' : 0}}>
						<span style={{marginRight: 6}}>{this.exam_alphabet[index]}</span><span>{item.content}</span>
					</div>
				</div>
      )
    })
		return (
      <div style={{backgroundColor: '#fff', height: devHeight, overflow: 'auto'}}>
				<div style={styles.title}>章节标题：{/*this.props.location.state.catalogTitle || ''*/}</div>
				<div style={{marginTop: 20, padding: '0 12px 0 12px', color: '#333'}}>{this.exam_index}.{this.state.examTitle}<span style={{marginLeft: 10, color: '#666'}}>({this.state.examMulti == 1 ? '单选题' : '多选题'}, 共{this.state.exam.length}题)</span></div>
        {exam}
        <hr style={{marginTop: 10, marginBottom: 30, backgroundColor: '#e4e4e4', border: 0, height:1}}></hr>
        <div style={{backgroundColor: this.state.selectId.length > 0 ? '#2196f3' : '#d1d1d1', ...styles.button}} onClick={this._nextOrCommit.bind(this)}>{this.state.exam.length == this.exam_index ? '提交' : '下一题'}</div>
      </div>
		);
	}
}

var styles = {
	button: {
		padding: "12px 60px",
		borderRadius: 40,
		fontSize: 15,
		color: '#fff',
		width: 45,
		margin: '0 auto',
		textAlign: 'center'
	},
	title:{
		fontSize:14,
		color:'#333',
		padding:'15px 12px 15px 12px',
		borderBottom:'solid 1px #f4f4f4'
	}
}

export default PgExam2;
