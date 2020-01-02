/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import QuestionList from '../components/QuestionList';
import QuestionTeacher from '../components/QuestionTeacher';
import PgBottomMeun from '../components/PgBottomMeun';
import FullLoading from '../components/FullLoading';
import Dm from '../util/DmURL'

class PgQuestionList extends React.Component {
	constructor(props) {
    super(props);
		this.wx_config_share_home = {
				title: '问答-财税互动社区-铂略咨询',
				desc: '精彩纷呈的互动问答，不容错过的导师对话，新鲜出炉的法规解读，尽在铂略咨询！',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
		this.state = {
      tab: 'question',
      label_height: false,
			isLoading: true
		};

    this._question = ['最新','最热']

    this._isAnswer = ['全部','待回答']

    this._teacherType = ['回答数','课程数']

    this._type = ['最新']

    this._select = []
	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-问答')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
    this._chooseLabel(this._question[0], this._isAnswer[0])
    this._LabelScroll = EventCenter.on('QuestionLabelScroll', this._labelFlase.bind(this))
		this._startLoading = EventCenter.on('StartLoad', this._startLoad.bind(this))
		this._loadOverDone = EventCenter.on('QAListDone', this._loadOver.bind(this))
	}

  componentWillUnmount() {
    this._LabelScroll.remove()
		this._loadOverDone.remove()
		this._startLoading.remove()
  }

  _labelStatus() {
    this.setState({
			label_height: !this.state.label_height,
		});
  }

  _labelFlase() {
    this.setState({
			label_height: false,
		});
  }

	_startLoad() {
		this.setState({
			isLoading: true
		})
	}

	_loadOver() {
		this.setState({
			isLoading: false
		})
	}

  _changeTeacherTab(type) {
    if(type === 'teacher') {
      this.setState({
        tab: 'teacher',
        label_height: false
      }, () => {
				EventCenter.emit("SET_TITLE",'铂略财课-讲师')
				Dispatcher.dispatch({
					actionType: 'QuestionTeacher',
					skip: 0,
					limit: 15
				})
			})
    } else if(type === 'question'){
      this.setState({
        tab: 'question',
        label_height: false
      }, () => {
				EventCenter.emit("SET_TITLE",'铂略财课-问答')
				this._chooseLabel(this._question[1],this._isAnswer[0])
			})
    }
  }

  _chooseLabel(left, right) {
    this._select = [left, right]
    var sort
    var not_answer
    this.setState({
      label_left: left,
      label_right: right
    })
    if(left == this._question[0]) {
      sort = 0
    } else if(left == this._question[1]) {
      sort = 1
    }
    if(right == this._isAnswer[0]) {
      not_answer = 1
    } else if(right == this._isAnswer[1]) {
      not_answer = 0
    }
    Dispatcher.dispatch({
      actionType: 'QAList',
      sort: sort,
      not_answer: not_answer,
      skip: 0,
      limit: 15
    })
  }

	render(){
    var tabMarginLeft
    var tabMarginRight
    var labelDisable
    var tabDisable
    if(this.state.tab === 'question') {
      tabMarginLeft = 0,
      tabMarginRight = window.screen.width/2
    } else if(this.state.tab === 'teacher') {
      tabMarginLeft = window.screen.width/2,
      tabMarginRight = 0
    }

    // 左边tab
    if(this.state.tab == 'question') {
      var label_left = this._question.map((item, index) => {
        var fontColor
        if(this._select[0] == item) {
          fontColor = '#2196f3'
        } else {
          fontColor = '#666'
        }
        return(
          <span key={index} style={{marginLeft: 12, marginRight: 30, color: '#666', fontSize: 14, float: 'left', lineHeight: '39px', color: fontColor}} onClick={() => {this._chooseLabel(item, this._select[1])}}>{item}</span>
        )
      })
      var label_right = this._isAnswer.map((item, index) => {
        var fontColor
        if(this._select[1] == item) {
          fontColor = '#2196f3'
        } else {
          fontColor = '#666'
        }
        return(
          <span key={index} style={{marginRight: 12, marginLeft: 30, color: '#666', fontSize: 14, float: 'left', lineHeight: '39px', color: fontColor}} onClick={() => {this._chooseLabel(this._select[0],item)}}>{item}</span>
        )
      })
    } else {
      var label_left = this._teacherType.map((item, index) => {
        var fontColor
        if(this._select[0] == item) {
          fontColor = '#2196f3'
        } else {
          fontColor = '#666'
        }
        return(
          <span key={index} style={{marginLeft: 12, marginRight: 30, color: '#666', fontSize: 14, float: 'left', lineHeight: '39px', color: fontColor}} onClick={() => {this._chooseLabel(item, this._select[1])}}>{item}</span>
        )
      })
      var label_right = this._type.map((item, index) => {
        var fontColor
        if(this._select[1] == item) {
          fontColor = '#2196f3'
        } else {
          fontColor = '#666'
        }
        return(
          <span key={index} style={{marginRight: 12, marginLeft: 30, color: '#666', fontSize: 14, float: 'left', lineHeight: '39px', color: fontColor}} onClick={() => {this._chooseLabel(this._select[0],item)}}>{item}</span>
        )
      })
    }


    if(this._select[1] == this._isAnswer[0] || this._select[1] == '') {
      labelDisable = 'none'
    } else {
      labelDisable = 'inline-block'
    }

    if(this.state.tab == 'question') {
      tabDisable = 'block'
    } else {
      tabDisable = 'none'
    }

		return (
      <div style={{backgroundColor: '#fff'}}>
				<FullLoading isShow={this.state.isLoading}/>
        <div style={{height: 50, backgroundColor: "#fff"}}>
          <div style={{...styles.tab}}
            onClick={() => {this._changeTeacherTab('question')}}
          >
            <img src={Dm.getUrl_img("/img/v2/icons/qa_change@2x.png")} style={{display: this.state.tab === 'question' ? 'inline-block' : 'none', verticalAlign: 'sub', marginRight: 7, width: 19, height: 18}}></img>
						<img src={Dm.getUrl_img("/img/v2/icons/qa--normal.png")} style={{display: this.state.tab === 'question' ? 'none' : 'inline-block', verticalAlign: 'sub', marginRight: 7, width: 19, height: 18}}></img>
            <span style={{color: this.state.tab === 'question' ? '#2196f3' : '#999', fontSize: 15}}>问答</span>
          </div>
          <div style={{...styles.tab}}
            onClick={() => {this._changeTeacherTab('teacher')}}
          >
					<img src={Dm.getUrl_img("/img/v2/icons/teacher_choose@2x.png")} style={{display: this.state.tab === 'teacher' ? 'inline-block' : 'none', verticalAlign: 'sub', marginRight: 7, width: 17, height: 20}}></img>
					<img src={Dm.getUrl_img("/img/v2/icons/teacher@2x.png")} style={{display: this.state.tab === 'teacher' ? 'none' : 'inline-block', verticalAlign: 'sub', marginRight: 7, width: 17, height: 20}}></img>
            <span style={{color: this.state.tab === 'teacher' ? '#2196f3' : '#999', fontSize: 15}}>讲师</span>
          </div>
          <hr style={{...styles.tab_hr, marginRight: tabMarginRight, marginLeft: tabMarginLeft}}></hr>
        </div>

        <div style={{...styles.title, display: tabDisable}} onClick={this._labelStatus.bind(this)}>
          <span>{this._select[0]}</span>
          {/*<span style={{display: labelDisable}}>.</span>*/}
					<img src={Dm.getUrl_img("/img/v2/icons/circle@2x.png")} style={{display: labelDisable, width: 8, height: 8, marginLeft: 10, marginRight: 10}}/>
          <span style={{display: labelDisable}}>{this._select[1]}</span>
          <img src={Dm.getUrl_img("/img/v2/icons/down@2x.png")} style={{display: this.state.label_height ? 'none' : 'inline-block', marginLeft: 8, width: 14, height: 9}}></img>
          <img src={Dm.getUrl_img("/img/v2/icons/up@2x.png")} style={{display: this.state.label_height ? 'inline-block' : 'none', marginLeft: 8, width: 14, height: 9}}></img>
        </div>

        <div style={{height: 39, backgroundColor: '#f8f8f8', width: window.screen.width, display: this.state.label_height ? 'inline-block' : 'none'}}>
          <hr style={{height: 1, border: 'none', backgroundColor: '#e5e5e5'}}></hr>
          <div style={{display: 'inline-block', float: 'left'}}>
            {label_left}
          </div>
          <div style={{display: 'inline-block', float: 'right'}}>
            {label_right}
          </div>
        </div>


        <div style={{display: this.state.tab === 'question' ? 'inline-block' : 'none'}}>
          <QuestionList/>
        </div>

        <div style={{display: this.state.tab === 'teacher' ? 'inline-block' : 'none'}}>
          <QuestionTeacher />
        </div>

        <div style={{position: 'fixed', zIndex: 9999, bottom: 0, width: window.screen.width,height:'auto'}}>
          <PgBottomMeun type={'question'}/>
        </div>

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
  tab: {
    width: window.screen.width/2,
    textAlign: 'center',
    display: 'inline-block',
    height: 49,
    lineHeight: '49px'
  },
  tab_hr: {
    width: window.screen.width/2,
    border: '1px solid',
    borderTop: 0,
    borderColor: '#2196f3',
  },
  title: {
    height: 45,
    textAlign: 'center',
    lineHeight: '45px',
    color: '#666',
    fontSize: 15
  },
}

export default PgQuestionList;
