import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from '../pages/ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

class EnrollOfflineLessonDiv extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
    }
  }
  render() {
    var lesson_list = this.props.data.map((item, index) => {
      let w_width = devWidth
      let w_height = devHeight
      var free;
      var padT;
      var padB;
      var test;
      var width;
      var height;
      if(item.isFree) {
        free = "inline-block"
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
      if(w_width != 375) {
        width = (w_width / 375)*127
        height = width / 1.58
      } else {
        width = 127
        height = 80
      }
      return(
        <Link to={`${__rootDir}/PgMyEnrollDetail/${item.id}`} key={index}>
        <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height}} ref={(lesson) => this.lesson = lesson}>
            <img style={{...styles.lessonPng, width: width, height: height, marginRight: w_width < 350 ? 8 : 15, marginLeft: w_width < 350 ? 10 : 12}} src={item.brief_image} />
            <div style={{marginBottom: 15}}>
              <span style={{...styles.span, fontSize: w_width < 350 ? 12 : 14}}>{item.title}</span>
            </div>
            <div style={{position: 'absolute', display: 'inline-block', bottom: 0}}>
              {/*<div style={{...styles.timePng}}></div>*/}
              <img src={Dm.getUrl_img('/img/v2/icons/time2@2x.png')} style={{...styles.timePng}} />
              <span style={{...styles.lessonTime}}>{item.isSameDay ? new Date(item.start_time).format("yyyy-MM-dd") : new Date(item.start_time).format("yyyy-MM-dd") +" ~ "+ new Date(item.end_time).format("MM-dd")}</span>
              <div style={{...styles.line}}>|</div>
              <img src={Dm.getUrl_img('/img/v2/icons/offline_list_address@2x.png')} style={{...styles.placePng}} />
              <div style={{...styles.isTest}}>{item.city}</div>
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
		height: 80,
	  backgroundColor: '#fff',
		paddingTop: 15,
		paddingRight: 12,
    position: 'relative'
	},
	lessonPng: {
		width: 127.5,
		height: 80,
		// border: '1px solid',
		marginLeft: 12,
		marginRight: 15,
		float: 'left',
	},
	isFree: {
		fontSize: 11,
		color: "#2196f3",
		border: '1px solid',
		borderColor: '#2196f3',
		borderRadius: '4px',
		float: 'left',
		marginRight: 9,
		paddingLeft: 5,
		paddingRight: 5,
	},
	timePng: {
		width: 15,
		height: 15,
		float: 'left',
		// border: '1px solid',
		marginRight: 7,
	},
  placePng: {
		width: 13,
		height: 15,
		float: 'left',
    marginLeft: 9,
		// border: '1px solid',
		marginRight: 7,
	},
	lessonTime: {
		fontSize: 12,
		color: '#999',
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
		fontSize: 11,
		color: '#999',
		lineHeight: '16px',
		float: 'left',
	},
}

export default EnrollOfflineLessonDiv;
