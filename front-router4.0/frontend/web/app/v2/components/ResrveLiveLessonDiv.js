import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';

class ResrveLiveLessonDiv extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
    }
  }
  render() {
    let w_width = devWidth
    let w_height = devHeight
    var lesson_list = this.props.data.map((item, index) => {
      var free
      var padT
      var padB
      var test
      var width
      var height
      var liveType
      var color
      var borderColor
      var typeWidth
      if(w_width != 375) {
        width = (w_width / 375)*127
        height = width / 1.58
      } else {
        width = 127
        height = 80
      }
      if(item.isFree) {
        free = ""
      } else {
        free = "none"
      }
      if(index == 0) {
        padT = 15,
        padB = 15
      } else {
        padT = 0,
        padB = 15
      }
      if(item.exam_mark === 1) {
        test = 'inline-block'
      } else {
        test = 'none'
      }
      if(item.live_status === 0) {
        liveType = '已预约'
        color = '#7ed321'
        borderColor = '#7ed321'
      } else if(item.live_status === 2) {
        liveType = '已结束'
        color = '#999'
        borderColor = '#999'
      } else {
        liveType = '直播中'
        color = '#2196f3'
        borderColor = '#2196f3'
      }

      return(
        <Link to={`${__rootDir}/PgMyReserveDetail/${item.id}`} key={index} >
        <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height, marginLeft: w_width < 350 ? 10 : 12}} ref={(lesson) => this.lesson = lesson}>
            <img style={{...styles.lessonPng, width: width, height: height, marginRight: w_width < 350 ? 8 : 15}} src={item.brief_image} />
            <div style={{...styles.isFree, display: free}}>免费</div>
            <div style={{marginBottom: 15}}>
              <span style={{...styles.span, fontSize: w_width < 350 ? 12 : 14}}>{item.title}</span>
            </div>
            <div style={{position: 'absolute', display: 'inline-block', bottom: 0, marginRight: 10}}>
              <div style={{...styles.timePng}}>
                {new Date(item.start_time).format("yyyy-MM-dd")}
                <span style={{marginLeft: 9}}>
                  {new Date(item.start_time).format("hh:mm")}-
                </span>
                <span>
                  {new Date(item.end_time).format("hh:mm")}
                </span>
              </div>
              <div style={{...styles.isTest, color: color, borderColor: borderColor, width: w_width < 350 ? 38 : 42, padding: w_width < 350 ? 1 : 2, marginLeft: w_width < 350 ? 7 : 14}}>{liveType}</div>
            </div>
        </div>
        </Link>
      )
    });
    return(
      <div>
        {lesson_list}
      </div>
    )
  }
}

var styles = {
  span: {
		fontSize: 14,
		color: '#333',
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		lineHeight: '20px'
	},
	list: {
		// height: 667,
		overflow: 'scroll',
	},
	lessonDiv: {
		// height: 80,
	  backgroundColor: '#fff',
		paddingTop: 15,
		paddingRight: 12,
    position: 'relative'
	},
	lessonPng: {
		// width: 127,
		// height: 80,
		// border: '1px solid',
		// marginLeft: 12,
		marginRight: 15,
		float: 'left',
	},
	isFree: {
		position: 'absolute',
    width: 29,
    height: 14,
    borderColor: '#2196F3',
    border:'1px solid',
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#2196f3',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: '14px'
	},
	timePng: {
    color: '#999',
    fontSize: 11,
		float: 'left',
	},
	lessonTime: {
		fontSize: 12,
		color: '#666',
		float: 'left',
		lineHeight: '16px',
		marginRight: 14,
	},
	line: {
		float: 'left',
		lineHeight: '14px',
		color: '#e5e5e5',
		height: 22,
		width: 1
	},
	chapter: {
		fontSize: 12,
		color: '#666',
		float: 'left',
		lineHeight: '16px',
	  marginLeft: 14,
	},
	isTest: {
    position: 'relative',
    top: -3,
		fontSize: 11,
    textAlign: 'center',
    width: 42,
		lineHeight: '13px',
		padding: 2,
		borderRadius: 50,
		float: 'right',
		border: '1px solid',
		// marginLeft: 14,
	},
}

export default ResrveLiveLessonDiv;
