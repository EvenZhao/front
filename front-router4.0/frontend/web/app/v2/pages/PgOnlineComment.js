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
import CommentLabel from '../components/CommentLabel';
import BlackAlert from '../components/BlackAlert';

class ComponentStar extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
      w_width: devWidth,
      title: '',
      content: '',
      chose_id: '',
      select: [],
      count: 0,
			checkStar: 5,
		};

    this.count = 0

		this.star = ''
	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-评价')
	}
	componentWillUnmount() {
	}

	_checkStar(star) {
		this.setState({
			checkStar: star
		}, () => {
			EventCenter.emit("StarScore", this.state.checkStar)
		})
	}

	render(){
    let starStatus = {
      right: 8,
      star: 5,
      canChange: true,
      score: 5,
      propScore: null,
      scoreShow: true,
      width: 32,
      height: 30,
    }
		return (
      <div style={{backgroundColor:'#fff'}}>
        <div style={{...styles.top_div}}>
				{/*
					<span style={{fontSize: 14, color: '#333', lineHeight: '48px', marginRight: 16}}>评分</span>
					*/}
					<div style={{textAlign:'center',fontSize:Fnt_Normal,color:'#666',paddingTop:14,}}>为课程评分</div>
          <div style={{marginTop:14,marginLeft:52,width:devWidth-104,}}>
						<Star {...starStatus} StarCheck={this._checkStar.bind(this)}/>
					</div>
        </div>
      </div>
		);
	}
}

class ComponentInput extends React.Component {
	constructor(props) {
    super(props);
		this.sendLab = []
		this.state = {
      w_width: devWidth,
      title: '',
      content: '',
      chose_id: '',
      select: [],
      getStar: 5,
			getLabel: [],
			click: false,
		};

    this.count = 0

		this.star = ''
	}

	_handleGetStar(re) {
		this.setState({
			getStar: re
		})
	}

	_handleGetLabel(re) {
		this.sendLab = []
		re.map((item, index) => {
			if(item.select) {
				this.sendLab.push({name:item.name, id:item.id})
			}
		})
		if(this.sendLab.length > 0) {
			this.setState({
				getLabel: re,
				click: true
			})
		} else {
			this.setState({
				getLabel: re,
				click: false
			})
		}
	}

	_check_content(event) {
    this.setState({
      content: event.target.value,
    });
  }

	_button() {
		if(this.state.click == false) {
			return
		} else if(this.state.click == true) {
			Dispatcher.dispatch({
				actionType: 'AddComment',
				resourceId: this.props.id,
				star: this.state.getStar,
				content: this.state.content,
				label: this.sendLab
			})
		}
	}

	_handleIsInsert(re) {
		// if()
		console.log("RE", re)
		if(re.result.result) {
			EventCenter.emit('PropToOnlineDetail')
			return
		} else {
			alert(re.result.err)
			return
		}
	}

	componentDidMount() {
		this._getStar = EventCenter.on("StarScore", this._handleGetStar.bind(this))
		this._getLabel =  EventCenter.on("LabelChoose", this._handleGetLabel.bind(this))
		this._isInsert = EventCenter.on('AddCommentDone', this._handleIsInsert.bind(this))
	}
	componentWillUnmount() {
		this._getStar.remove()
		this._getLabel.remove()
		this._isInsert.remove()
		clearTimeout(this.t)
	}

	render(){
		return (
			<div>
				<div style={{backgroundColor:'#fff',padding:'15px 0'}}>
					<textarea style={{...styles.content_input, webkitAppearance: 'none'}} placeholder="请输入您对课程的评价~" value={this.state.content}  onChange={this._check_content.bind(this)}/>
				</div>
				<div style={{backgroundColor:'#fff',padding:'10px 0',marginTop:10,}}>
					<button style={{...styles.button, backgroundColor: this.state.click ? '#2196f3' : '#d1d1d1'}} onClick={this._button.bind(this)}>提交</button>
				</div>
			</div>
		);
	}
}

class PgOnlineComment extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
      w_width: devWidth,
      title: '',
      content: '',
      click: false,
      select: [],
			checkLabel: [],
			star: '',
			isShow: false
		};

    this.count = 0

		this.star = ''
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
		this.AlertErr = EventCenter.on('AlertHide', this._alertErr.bind(this))
		this._Prop = EventCenter.on('PropToOnlineDetail', this.propToDetail.bind(this))
	}
	componentWillUnmount() {
		this.AlertErr.remove()
		this._Prop.remove()
	}

	_checkLabel(labs) {
		this.setState({
			checkLabel: labs
		}, () => {
			EventCenter.emit("LabelChoose", this.state.checkLabel)
		})
	}

	render(){
    let label = {label: this.state.label}
		let id = {id: this.props.match.params.id}
		let labelType = {type: 'comment'}

		return (
      <div style={{backgroundColor: '#f4f4f4', height: devHeight, overflow: 'scroll'}}>
				<BlackAlert isShow={this.state.isShow} word='最多选择三个标签'/>
				<ComponentStar />
        <div>
          <div style={{...styles.label_div}}>
          {/*
  <p style={{marginBottom: 15}}>选择标签</p>
						*/}
              <CommentLabel {...labelType} LabelCheck={this._checkLabel.bind(this)}/>
          </div>
        </div>
				<ComponentInput {...id}/>
      </div>
		);
	}
}

var styles = {
  top_div: {
    height: 100,
  },
  label_div: {
    backgroundColor: '#fff',
		borderTopWidth:1,
		borderTopColor:'#f3f3f3',
		borderTopStyle:'solid',
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
    width: devWidth-64,
		marginLeft:15,
		marginRight:25,
    resize: 'none',
    border: '1px solid #E5E5E5',
    padding: '16px 12px 52px 12px',
    fontSize: 14,
    wordBreak: 'break-all'
  },
  button: {
    backgroundColor: '#d1d1d1',
    borderRadius: 4,
    height: 45,
    width: devWidth-32,
		marginLeft:16,
    color: '#fff',
    border: 'none',
    fontSize: 18
  }
}

export default PgOnlineComment;
