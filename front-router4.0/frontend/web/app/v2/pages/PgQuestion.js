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
import BlackAlert from '../components/BlackAlert';
import Dm from '../util/DmURL'

class PgInput extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      title: '',
      content: '',
      chose_id: '',
      click: false,
      select: [],
      count: 0,
		};

		this.click = false
	}

  _check_title(event) {
    this.setState({
      title: event.target.value,
    }, () => {
			EventCenter.emit('CheckTitle', this.state.title)
		});
  }

  _check_content(event) {
    this.setState({
      content: event.target.value,
    }, () => {
			EventCenter.emit('CheckContent', this.state.content)
		});
  }


	componentDidMount() {
	}
	componentWillUnmount() {
	}
	render(){
		return (
      <div style={{backgroundColor: '#f4f4f4'}}>
        <div style={{paddingTop: 10, marginBottom: 13, backgroundColor: '#f4f4f4'}}>
          <input style={{...styles.title_input, webkitAppearance: 'none'}} placeholder="请输入标题" value={this.state.title} onChange={this._check_title.bind(this)}/>
        </div>
        <div style={{marginBottom: 13, height: 152}}>
          <textarea style={{...styles.content_input, webkitAppearance: 'none'}} placeholder="请输入详细内容" value={this.state.content} onChange={this._check_content.bind(this)}/>
        </div>
      </div>
		);
	}
}

class PgButton extends React.Component {
	constructor(props) {
    super(props);
		this.sendLab = [];
		this.label = {}
		this.state = {
      title: '',
      content: '',
      chose_id: '',
      click: false,
      select: [],
      count: 0,
			checkLab: [],
			checkTitle: '',
			checkContent: '',
			choose: false
		};

		this.click = false
	}

	_handleGetQuestionLabel(re) {

		this.sendLab = []

		re.map((item, index) => {
			if(item.select) {
				// question传值为id
				// this.label.id = item.id
				// console.log("SSSSSSS", this.label)
				this.sendLab.push({id: item.id})
				console.log("THIS", this.sendLab)
			}
		})
		if(this.sendLab.length > 0 && this.state.checkTitle) {
			this.setState({
				click: true
			})
		} else {
			this.setState({
				click: false
			})
		}
	}

	_handleCheckTitle(re) {
		this.setState({
			checkTitle: re
		}, () => {
			if(this.sendLab.length > 0 && this.state.checkTitle) {
				this.setState({
					click: true
				})
			} else {
				this.setState({
					click: false
				})
			}
		})
	}

	_handleCheckContent(re) {
		this.setState({
			checkContent: re
		})
	}

	_handleInsertQuestion(re) {
		console.log(re.result.result)
		if(re.result.result) {
			EventCenter.emit('BackToTop')
			return
		} else {
			alert(re.result.err)
			return
		}
	}

	_button() {
		var type
		if(this.state.click == false) {
			return
		} else if(this.state.click == true) {
			if(this.props.type == 'online') {
				type = 2
			} else if(this.props.type == 'live') {
				type = 1
			}
			Dispatcher.dispatch({
				actionType: 'AddQuestion',
				resource_id: this.props.id || '',
				title: this.state.checkTitle,
				content: this.state.checkContent,
				type: type || '',
				label: this.sendLab,
				anonymous: this.state.choose ? 1 : 0
			})
			console.log('type',type)
		}
	}

	_choose() {
		this.setState({
			choose: !this.state.choose
		})
	}

	componentDidMount() {
		this._questionLabel = EventCenter.on('QuestionLabel', this._handleGetQuestionLabel.bind(this))
		this._checkTitle = EventCenter.on('CheckTitle', this._handleCheckTitle.bind(this))
		this._checkContent = EventCenter.on('CheckContent', this._handleCheckContent.bind(this))
		this.isInsert = EventCenter.on('AddQuestionDone', this._handleInsertQuestion.bind(this))
	}
	componentWillUnmount() {
		this._questionLabel.remove()
		this._checkTitle.remove()
		this._checkContent.remove()
		this.isInsert.remove()
	}
	render(){
		return (
			<div style={{margin: '0 36px'}}>
				<button style={{...styles.button, backgroundColor: this.state.click ? '#2196f3' : '#d1d1d1'}} onClick={this._button.bind(this)}>提交</button>
				<div style={{textAlign: 'center', marginTop: 8}} onClick={() => {this._choose()}}>
					<img src={this.state.choose ? Dm.getUrl_img('/img/v2/icons/anonymous_choose@2.png') : Dm.getUrl_img('/img/v2/icons/anonymous_nochoose@2.png')} style={{width: 16, height: 16, marginRight: 8}}/>
					<span style={{position: 'relative', top: -2, color: this.state.choose ? '#2196f3' : '#666'}}>匿名</span>
				</div>
			</div>
		);
	}
}

class PgQuestion extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      title: '',
      content: '',
      chose_id: '',
      click: false,
      select: [],
      count: 0,
			isShow: false
		};

		this.click = false
	}

	_checkLabel(labs) {
		this.setState({
			checkLabel: labs
		}, () => {
			EventCenter.emit("QuestionLabel", this.state.checkLabel)
		})
	}

	_alertErr() {
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

	propToDetail() {
		this.props.history.go(-1)
	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-提问')
		this.AlertErr = EventCenter.on('AlertHide', this._alertErr.bind(this))
		this._Prop = EventCenter.on('BackToTop', this.propToDetail.bind(this))
	}
	componentWillUnmount() {
		this.AlertErr.remove()
		this._Prop.remove()
	}
	render(){
		let type = {
			type: this.props.location.state ? this.props.location.state.type : '',
			id: this.props.location.state ? this.props.location.state.id : ''
		}
		let labelType = {type: 'question'}

		return (
      <div style={{backgroundColor: '#f4f4f4', height: devHeight, overflow: 'scroll'}}>
				<BlackAlert isShow={this.state.isShow} word='最多选择三个标签'/>
        <PgInput />
        <div style={{height: 255, marginBottom: 41}}>
          <div style={{...styles.label_div}}>
            <p style={{marginBottom: 15}}>选择标签</p>
							{/*提问label记得更换！！！！！！！！*/}
              <CommentLabel {...labelType} LabelCheck={this._checkLabel.bind(this)}/>
          </div>
        </div>
				<PgButton {...type}/>
      </div>
		);
	}
}

var styles = {
  label_div: {
    height: 238,
    backgroundColor: '#fff',
    border: '1px solid',
    borderColor: '#e1e1e1',
    borderLeft: 0,
    borderRight: 0,
    padding: '15px 12px 0px 12px',
    overflow: 'scroll'
  },
  label: {
    display: 'inline-block',
    flex: 1,
    border: '1px solid',
    borderColor: '#d1d1d1',
    padding: '6px 18px',
    borderRadius: 40,
    fontSize: 13,
    color: '#666',
    marginRight: 15,
    marginBottom: 16
  },
  title_input: {
    width: devWidth-24,
    border: '1px solid',
    borderColor: '#e1e1e1',
    borderLeft: 0,
    borderRight: 0,
    padding: '16px 12px 16px 12px',
    fontSize: 14
  },
  content_input: {
    width: devWidth-24,
    resize: 'none',
    border: '1px solid',
    borderColor: '#e1e1e1',
    borderLeft: 0,
    borderRight: 0,
    padding: '16px 12px 102px 12px',
    fontSize: 14,
    wordBreak: 'break-all'
  },
  button: {
    backgroundColor: '#d1d1d1',
    borderRadius: 4,
    height: 45,
    width: devWidth-72,
    color: '#fff',
    border: 'none',
    fontSize: 15
  }
}

export default PgQuestion;
