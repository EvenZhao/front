import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from '../pages/ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

class OfflineLessonDiv extends React.Component {
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
      var statuText = '';
      var statuColor = '';
      var imgStatus;

      // console.log('this.props.data===',this.props.data);

      if(item.isFree) {
        free = "inline-block"
      } else {
        free = "none"
      }
      if(index == 0) {
        padT = 15;
        padB = 15;
      } else {
        padT = 0;
        padB = 15;
      }
      if(item.exam_mark === 1) {
        test = 'inline-block'
      } else {
        test = 'none'
      }
      switch (item.disp_status) {
        case 1:
          // statuText = '正在报名';
          // statuColor = '#F37633';
          imgStatus =(
            <span style={styles.img_status}>
              <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_signUp@2x.png')} />
            </span>
           )
        break;
        case 2:
          // statuText = '报名已满';
          // statuColor = '#0097FA';
          imgStatus =(
            <span style={styles.img_status}>
              <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_signFull@2x.png')} />
            </span>
           )
        break;
        case 3:
          // statuText = '课程结束';
          // statuColor = '#999999';
          imgStatus =(
            <span style={styles.img_status}>
              <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_end@2x.png')} />
            </span>
           )
        break;
        case 4:
          // statuText = '报名截止';
          // statuColor = '#ff0000';
          imgStatus =(
            <span style={styles.img_status}>
              <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_signDone@2x.png')} />
            </span>
           )
        break;
        case 5:
          // statuText = '已参课';
          // statuColor = '#F69898'
        break;
        case 6:
          // statuText = '未参课';
          // statuColor = '#9AB2CF'
        break;
        case 7:
          // statuText = '报名失败';
          // statuColor = '#ff0000'
        break;
        default:
      }

      if(w_width != 375) {
        width = (w_width / 375)*127
        height = width / 1.58
      } else {
        width = 127
        height = 80
      }
      return(
        <Link to={`${__rootDir}/lesson/offline/${item.id}`} key={index}>
        <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height}} ref={(lesson) => this.lesson = lesson}>
            <div style={{...styles.lessonPng,width: width, height: height,marginRight: w_width < 350 ? 8 : 15, marginLeft: w_width < 350 ? 10 : 12}}>
              <img style={{width: width, height: height, }} src={item.brief_image ? item.brief_image:Dm.getUrl_img('/img/v2/icons/course_default.jpg')} />
              {item.isReserved ?
              <div style={{width:32,height:32,position:'absolute',zIndex:99,top:0,left:0,}}><img width={32} height={32} src={Dm.getUrl_img('/img/v2/course/offline_leftTop@2x.png')} /></div>
              :
              null
              }
              {/*<div style={{...styles.offline_tag,backgroundColor:statuColor,}}>{statuText}</div>*/}
              <div style={{...styles.imgBlack,width: width}}>
                {item.isSameDay ?
                  <div style={{marginLeft:8}}>
                    {new Date(item.start_time).format("MM-dd")}&nbsp;&nbsp;&nbsp;{new Date(item.start_time).format("hh:mm")}-{new Date(item.end_time).format("hh:mm")}
                  </div>
                  :
                  <div style={{marginLeft:8}}>
                    {new Date(item.start_time).format("MM-dd")} 至 {new Date(item.end_time).format("MM-dd")}
                  </div>
                }
              </div>
            </div>
            <div style={{marginBottom: 15}}>
              <span style={{...styles.span, fontSize: w_width < 350 ? 12 : 14}}>{imgStatus}<span style={{paddingLeft:60}}>{item.title}</span></span>
            </div>
            <div style={{position: 'absolute', display: 'inline-block', bottom: 0}}>
              {/*<img src={Dm.getUrl_img('/img/v2/icons/time@2x.png')} style={{...styles.timePng}} />
              <span style={{...styles.lessonTime,marginRight: item.isSameDay ? 14 : 5}}>{item.isSameDay ? new Date(item.start_time).format("yyyy-MM-dd") : new Date(item.start_time).format("yyyy-MM-dd") +" 至 "+ new Date(item.end_time).format("MM-dd")}</span>
              <div style={{...styles.line}}>|</div>*/}
              <div style={{...styles.isTest}}>
                <img src={Dm.getUrl_img('/img/v2/course/offline_address@2x.png')} style={{...styles.placePng}} />
                {item.city}
              </div>
            </div>
        </div>
        </Link>
      )
    })
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
    height:40,
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		lineHeight: '20px',
    position:'relative',
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
    position:'relative',
		width: 127,
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
  placePng: {
		width: 11,
		height: 11,
		float: 'left',
		marginRight: 7,
    marginTop:3,
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
		fontSize: 12,
		color: '#999',
		lineHeight: '20px',
	},
  offline_tag:{
    width:50,
    height:20,
    lineHeight:'20px',
    fontSize:11,
    color:'#fff',
    textAlign:'center',
    position:'absolute',
    zIndex:10,
    top:0,
    right:0,
  },
  imgBlack: {
    position: 'absolute',
    bottom: 0,
    height: 20,
    backgroundImage:'linear-gradient(-180deg, rgba(51,51,51,0.05) 0%, rgba(0,0,0,0.70) 100%)',
    color: '#fff',
    fontSize: 11,
    lineHeight: '20px',
  },
  img_status:{
    width:50,
    height:20,
    display:'inline-block',
    position:'absolute',
    zIndex:2,
    left:0,
    top:0,
  }
}

export default OfflineLessonDiv;
