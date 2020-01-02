import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

class LiveLessonDiv extends React.Component {
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
      var imgTop
      var test
      var width
      var height
      //var liveType

      var color
      var borderColor
      var typeWidth
      var reserved
      // var liveStatusType
      //var learnNumType
      var imgStatus;
      var isReserve = false;

      // console.log('this.props.data===',this.props.data);

      if(this.props.reservedLives && this.props.reservedLives.length > 0){
        this.props.reservedLives.map((rows, idx) => {
          if(rows.id == item.id) {
            reserved = item.id
          }
        })
      }

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
        padT = 15;
        padB = 15;
        imgTop = 15;
      } else {
        padT = 0;
        padB = 15;
        imgTop = 0;
      }
      if(item.exam_mark == 1) {
        test = 'inline-block'
      } else {
        test = 'none'
      }
      if(item.id == reserved) {
        isReserve = true;//已预约
      }
      // else {
      //   liveType = '预约'
      //   color = '#f37633'
      //   borderColor = '#f37633'
      // }
      if(item.status == 0) {//尚未开始
        //liveStatusType = '尚未开始'
        imgStatus =(
          <div style={styles.img_status}>
            <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_notStarted@2x.png')} />
          </div>
        )
        //learnNumType = '人已参与'
        // if(item.id == reserved) {
        //   isReserve = true;//已预约
        //   //liveType = '已预约'
        //   // color = '#7ed321'
        //   color = '#f37633'
        //   borderColor = '#7ed321'
        // } else {
        //   //liveType = '预约'
        //   color = '#f37633'
        //   borderColor = '#f37633'
        // }
      }
      else if (item.status == 1) {//正在直播
          //learnNumType = '已预约'
          //liveStatusType = '正在直播'
          imgStatus =(
            <div style={styles.img_status}>
              <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_starting@2x.png')} />
            </div>
          )
      }
      else if(item.status == 2) {//直播结束
        //liveStatusType = '直播结束'
        imgStatus =(
          <div style={styles.img_status}>
            <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_started@2x.png')} />
          </div>
        )
        //learnNumType = '人已参与'
        //liveType = '已结束'
      }
      else if (item.status == 3) {//即将开始
        imgStatus=(
          <div style={styles.img_status}>
            <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_start@2x.png')} />
          </div>
        )
      }

      var liveSeriesImg
      const s = item.series ? item.series[0].id : item.liveSeries
      if(s == 3) {//连线CFO
        // liveSeriesImg = Dm.getUrl_img('/img/v2/icons/CFO@2x.png')
        liveSeriesImg =(
          <div style={{color:'#7F9CBF',fontSize:11,lineHeight:'20px'}}>连线CFO</div>
        )
      } else if(s == 4) {//税政通
        // liveSeriesImg = Dm.getUrl_img('/img/v2/icons/SZT@2x.png')
        liveSeriesImg =(
          <div style={{color:'#F37633',fontSize:11,lineHeight:'20px'}}>税政通</div>
        )
      } else {
        liveSeriesImg = null
      }

      var toLink;
      if(this.props.isReservation){
        toLink=`${__rootDir}/PgMyReserveDetail/${item.id}`
      }else {
        toLink = `${__rootDir}/lesson/live/${item.id}`;
      }
      return(
        <Link to={toLink} key={index} >
        <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height, marginLeft: w_width < 350 ? 10 : 12}} ref={(lesson) => this.lesson = lesson}>
            <img style={{...styles.lessonPng, width: width, height: height, marginRight: w_width < 350 ? 8 : 15}} src={item.brief_image ? item.brief_image:Dm.getUrl_img('/img/v2/icons/course_default.jpg')} />
            {isReserve ?
              <div style={{width:32,height:32,position:'absolute',zIndex:99,top:imgTop,left:0,}}><img width={32} height={32} src={Dm.getUrl_img('/img/v2/course/live_leftTop@2x.png')} /></div>
              :
              null
             }
            <div style={{...styles.imgBlack,width: width}}>
              <div style={{marginLeft:8}}>
                {new Date(item.start_time).format("MM-dd")}&nbsp;&nbsp;&nbsp;{new Date(item.start_time).format("hh:mm")}-{new Date(item.end_time).format("hh:mm")}
              </div>
            </div>
            <div style={{marginBottom: 15,}}>
              <div style={{...styles.span,fontSize: w_width < 350 ? 12 : 14}}>{imgStatus}<span style={{paddingLeft:60}}>{item.title}</span></div>
            </div>
            <div style={{position: 'absolute', display: 'inline-block', bottom: 0, marginRight: 10, width: devWidth - 39 - width}}>
              <div style={{...styles.timePng, display: liveSeriesImg ? 'block' : 'none'}}>
                {liveSeriesImg}
              </div>
              <div style={{marginLeft: liveSeriesImg ? 58 : 118, display: 'inline-block'}}>
                <img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} style={{width: 11, height: 11, marginRight: 6, position: 'relative', top: 1.3}}/>
                <span style={{fontSize: 11, color: '#999'}}>{item.num}</span>
              </div>
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
    position:'relative',
    height:40,
    lineHeight: '20px',
    width:devWidth - 180,
		fontSize: 14,
		color: '#333',
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
	},
	list: {
		overflow: 'scroll',
	},
	lessonDiv: {
	  backgroundColor: '#fff',
		paddingTop: 15,
		//paddingRight: 12,
    position: 'relative'
	},
	lessonPng: {
		marginRight: 15,
		float: 'left',
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
	},
  img_status:{
    width:50,
    height:20,
    position:'absolute',
    zIndex:5,
    left:0,
    top:0,
  }
}

export default LiveLessonDiv;
