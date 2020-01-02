import React from 'react';
import WeUI from 'react-weui';
import Dispatcher from '../AppDispatcher';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

class CommentLabel extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
      chose_id: '',
      labs : [],
      selectId: [],
      alertHide: true
    }

    this.count = 0
  }

  _handleGetCommentLabel(re) {
    console.log(re)
    this.setState({
      labs: re.result
    })
  }

  _handleGetQuestionLabel(re) {
    this.setState({
      labs: re.result
    })
  }

  componentWillMount() {
  }

  componentDidMount() {
    if(this.props.type == 'comment') {
      Dispatcher.dispatch({
        actionType: 'CommentLabel'
      })
    } else if(this.props.type == 'question') {
      Dispatcher.dispatch({
        actionType: 'QuestionLabel',
        personal:null,
      })
    }
    this._getLabel = EventCenter.on('CommentLabelDone', this._handleGetCommentLabel.bind(this))
    this._getQuestionLabel = EventCenter.on('QuestionLabelDone', this._handleGetQuestionLabel.bind(this))
  }

  componentWillUnmount() {
    this._getLabel.remove()
    this._getQuestionLabel.remove()
  }

  _click(id, item) {
    // this.setState({
    //   chose_id: id
    // })
    let exist = this.state.selectId.indexOf(id)
    if (exist > -1) {
      this.state.selectId.splice(exist, 1)
    } else {
      if(this.state.selectId.length > 2) {
        EventCenter.emit('AlertHide')
        return
      }
      this.state.selectId.push(id)
    }
    this.setState({
      selectId: this.state.selectId
    })
    this.props.LabelCheck(this.state.labs)
  }

  render() {
    var lab = this.state.labs.map((item, index) => {
      if(this.state.selectId.indexOf(item.id) > -1) {
        item.select = true
      } else {
        item.select = false
      }
      return(
        <div key={index} style={{...styles.label, backgroundColor: item.select ? '#2196f3' : '#E3F1FC', color: item.select ? '#fff' : '#333'}} onClick={()=>{
          this._click(item.id, item)
        }}>{item.name}</div>
      )
    })

    return (
    	<div>
        {lab}
      </div>
    );
  }
}

var styles = {
  label: {
    display: 'inline-block',
    flex: 1,
    height:30,
    lineHeight:'30px',
    padding: '0 14px',
    borderRadius: 2,
    fontSize: 14,
    color: '#333',
    marginRight: 15,
    marginBottom: 15
  },
}

export default CommentLabel;
