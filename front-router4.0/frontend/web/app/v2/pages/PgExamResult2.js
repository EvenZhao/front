/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from './ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';

class PgExamResult extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      examInfo: [],
      userAnswer: [],
      myAnswer: []
		};

    this.exam_alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

		this.exam_index = 0

	}

  _popToOnlineDetail() {
    localStorage.setItem("CatalogIdx", this.props.location.state.catalogIdx)
    this.props.history.go(-2)
  }


	componentDidMount() {
    var exam = this.props.location.state.exam
    var user_answer = this.props.location.state.user_answer
    var myAnswer = []
    for(var i=0; i<user_answer.length; i++) {
      for(var r=0; r<user_answer[i].answer.length; r++) {
        myAnswer.push(user_answer[i].answer[r])
      }
    }

    this.setState({
      userAnswer: user_answer,
      myAnswer: myAnswer
    })
	}
	render(){
    var exam = this.props.location.state.exam
    var user_answer = this.props.location.state.user_answer
    var chose
    var hrDis
    var marginLeft
    var haveAnswer

    var examInfos = exam.examInfos.map((item,index) => {
      if(index+1 == exam.examInfos.length) {
        hrDis = 'none'
      } else {
        hrDis = 'block'
      }

      var trueIdx = []
      var myIdx = []
      if(item.mostIncorrectAnswer != '') {
        haveAnswer = true
      } else {
        haveAnswer = false
      }

      for(var r=0; r<exam.examInfos[index].examContent.length; r++){
        if(exam.examInfos[index].examContent[r].answer == true) {
          trueIdx.push(r)
        }
      }

      console.log(user_answer)
      for(var i=0; i<user_answer[index].answer.length; i++) {
        for(var r=0; r<exam.examInfos[index].examContent.length; r++){
          if(exam.examInfos[index].examContent[r].contentId == user_answer[index].answer[i]) {
            myIdx.push(r)
          }
        }
      }

      var trueAnswer = trueIdx.map((trueIdx, idxExam) => {
        return(
          <div key={idxExam} style={{display: 'inline-block', color: '#2196f3'}}>
            {this.exam_alphabet[trueIdx]}
          </div>
        )
      })

      var myAnswer = myIdx.map((myItem, myAnswerIdx) => {
        var color
        if(trueIdx.sort().toString() == myIdx.toString()) {
          color = '#2196f3'
        } else {
          color = '#f70300'
        }
        return(
          <div key={myAnswerIdx} style={{display: 'inline-block', color: color}}>
            {this.exam_alphabet[myItem]}
          </div>
        )
      })


      var examQuestion = item.examContent.map((question, idx) => {
        if(this.state.myAnswer.length > 0) {
          if(item.answers.indexOf(question.contentId) > -1) {
            chose = true
            marginLeft = 12
          } else {
            chose = false
            marginLeft = 28
          }
        }


        return(
          <div key={idx} style={{display: chose ? 'inline-block' : 'block', border: chose ? '1px solid #2196f3': 'none', borderRadius: 30, padding: chose ? '4px 15px' : 0, margin: '18px 12px 0px 28px', marginLeft: marginLeft}}>
            <span style={{marginRight: 6, color: chose ? '#2196f3' : '#666'}}>{this.exam_alphabet[idx]}</span><span style={{color: chose ? '#2196f3' : '#666'}}>{question.content}</span>
          </div>
        )
      })

      return(
        <div key={index} style={{fontSize: 15, wordBreak: 'break-all'}}
        >
          <div style={{margin: '20px 14px 0px 14px', color: '#333'}}>{index+1}.{item.examTitle}<span style={{marginLeft: 10, color: '#666'}}>({item.isMulti == 1 ? '单选题' : '多选题'}, 共{exam.examInfos.length}题)</span></div>
            {examQuestion}
          <hr style={{border: 'none', height: 1, backgroundColor: '#e5e5e5', marginTop: 22}}></hr>
          <div style={{margin: '20px 20px 10px 20px'}}>正确答案是{trueAnswer}, 您的选择是{myAnswer}</div>
          <div style={{margin: '0px 20px 20px 20px'}}>本题正确率为<span style={{color: '#2196f3'}}>{item.correctPer}%</span><span style={{display: haveAnswer ? 'inline-block' : 'none'}}>, 大部分选错的会员选择了<span style={{color: '#f70300'}}>{item.mostIncorrectAnswer}</span></span>。</div>
          <div style={{height: 12, border: '1px solid #f3f3f3', borderLeft: 'none', borderRight: 'none', backgroundColor: '#f4f4f4', display: hrDis}}></div>
				</div>
      )
    })


		return (
			<div style={{backgroundColor: '#fff', height: devHeight, overflow: 'scroll'}}>
        <div style={{height: 58, lineHeight: '58px', marginLeft: 12, fontSize: 18, fontWeight: 'bold', color: '#2196f3'}}>答题情况</div>
        <hr style={{border: 'none', height: 1, backgroundColor: '#e5e5e5'}}></hr>
        {examInfos}
        <div style={{...styles.button}} onClick={this._popToOnlineDetail.bind(this)}>
          继续学习
        </div>
			</div>
		)
	}
}

var styles = {
  button: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#2196f3',
    width: 150,
    height: 45,
    border: 'none',
    borderRadius: 30,
    margin: '0 auto',
    lineHeight: '45px',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30
  }
}

export default PgExamResult;
