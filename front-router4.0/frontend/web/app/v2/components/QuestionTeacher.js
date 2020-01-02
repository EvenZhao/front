import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import FullLoading from '../components/FullLoading';
import Loading from '../components/Loading';
import Common from '../Common';


class QuestionTeacher extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      teacherList: [],
			loadLength: '',
			canNotLoad: false,
			isShow: false,
			isOver: false
		};

	}

  _handleGetQATeacher(re) {
    this.setState({
      teacherList: re.result,
			loadLength: re.result.length,
			canNotLoad: false,
			// isLoading: false
    })
  }

  _labelScroll() {
		if( (this.teacherList.scrollHeight - this.teacherList.scrollTop - 220) <  document.documentElement.clientHeight) {
			if(this.state.canNotLoad == true) {
				return
			}
			if(this.state.loadLength < 15) {
				this.setState({
					isShow: false,
					isOver: true,
				})
				return
			} else if(this.state.loadLength == 0) {
				this.setState({
					isShow: false,
					// isOver: true
				})
				return
			} else {
				this.setState({
					isShow: true,
					isOver: false
				}, () => {
					this._loadMore()
				})
			}
		}
	}

	_loadMore() {
    Dispatcher.dispatch({
      actionType: 'QuestionTeacherLoadMore',
      skip: this.state.teacherList.length,
      limit: 15
    })
	}

	_handleLoadMore(re) {
		this.setState({
			teacherList: this.state.teacherList.concat(re.result),
			loadLength: re.result.length,
			canNotLoad: false,
			isShow: false,
			isOver: false,
		})
	}

	_handleCanNotLoad() {
		this.setState({
			canNotLoad: true
		})
	}

	componentWillMount() {
	}

  componentDidMount() {
		EventCenter.emit('StartLoad')
    this._getQATeacher = EventCenter.on('QuestionTeacherDone', this._handleGetQATeacher.bind(this))
		this._getQAListLoadMore = EventCenter.on('QuestionTeacherLoadMoreDone', this._handleLoadMore.bind(this))
		this._CanNotLoad = EventCenter.on('CanNotLoad', this._handleCanNotLoad.bind(this))
  }

	componentWillUnmount() {
		this._getQATeacher.remove()
		this._getQAListLoadMore.remove()
		this._CanNotLoad.remove()
	}

  render() {

    var list = this.state.teacherList.map((item, index) => {
      var marginTop
			var hr
      var label
      if(index == 0) {
        marginTop = 5
      } else {
        marginTop = 20
      }
			if(index+1 == this.state.teacherList.length) {
				hr = 'none'
			} else {
				hr = 'block'
			}

      if(item.label_name && item.label_name.length > 0) {
        var label = item.label_name.map((lab,idx) => {
					if(idx > 2) {
						return
					}
          return(
            <div key={idx} style={{...styles.lab}}>
	            {lab}
            </div>
          )
        })
      } else {
        var label = <div style={{display: 'none'}}></div>
      }
      return(
        <div key={index}>
				<Link to={{pathname: `${__rootDir}/teacher/${item.account_id}`, query: null, hash: null, state: item}}>
          <img src={item.photo} style={{marginTop: 14, marginLeft: 12, borderRadius: 50, width: 43, height: 43, position: 'relative'}}/>
          <div style={{position: 'relative', display: 'inline-block', marginLeft: 14, top: item.title ? -3 : -15, width: devWidth - 86}}>
            <p style={{color: '#333', fontSize: 13}}>{item.name}</p>
            {/*<span style={{color: '#999', fontSize: 12, marginRight: 10}}>{item.position}</span>*/}
            <span style={{color: '#999', fontSize: 12}}>{item.title}</span>
            <img src={Dm.getUrl_img('/img/v2/icons/more@2x.png')} style={{width: 10, height: 16, float: 'right', position: 'relative', top: -6}}/>
          </div>
				</Link>
          <div style={{ marginLeft: 12, display: item.label_name.length > 0 ? 'flex' : 'none'}}>
            <div style={{fontSize: 12, color: "#999", marginRight: 10, marginTop: 5}}>擅长领域:</div>
            <div style={{flex: 2}}>
              {label}
            </div>
          </div>
          <hr style={{border: 'none', height: 1, margin: '7px 12px 1px', backgroundColor: '#f3f3f3', display: hr}}></hr>
        </div>
      )

    })

		var top

		if(isWeiXin) {
			top = 176
			} else {
			// return false;
			top = 112
		}

    return(
				<div
					ref={(teacherList) => this.teacherList = teacherList}
          style={{overflow: 'scroll', height: devHeight - top}}
          onTouchEnd={this._labelScroll.bind(this)}
				>
					{/*<FullLoading isShow={this.state.isLoading}/>*/}
					{list}
					<div style={{height: 30, lineHeight: '30px', display: this.state.isOver == true && this.state.isShow == false && this.state.teacherList.length > 0 ? 'block' : 'none', textAlign: 'center'}}>共{this.state.teacherList.length}位</div>
					<Loading isShow={this.state.isShow}/>
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
    left: devWidth/2-28,
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
	},
  lab: {
    height: 23,
    fontSize: 12,
    color: '#666',
    display: 'inline-block',
    padding: '0px 12px',
    backgroundColor: '#e2f2fc',
    borderRadius: 4,
    lineHeight: '23px',
    marginRight: 15,
    marginBottom: 8
  }
}

export default QuestionTeacher;
