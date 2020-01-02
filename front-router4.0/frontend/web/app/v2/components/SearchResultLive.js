import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Loading from '../components/Loading';

class SearchResultLive extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
    }
  }

  _loadMore() {
    if(this.props.live_count <= 3) {
      return
    } else {
      EventCenter.emit('SearchLoadMore', 3)
    }
  }

  render() {
    let w_width = devWidth
    let w_height = devHeight
    var canLoadMore
    if(this.props.live_count == this.props.data.length) {
      canLoadMore = false
    } else {
      canLoadMore = true
    }

    var lesson_list = this.props.data.map((item, index) => {
      item = item.ori
      var free;
      var padT;
      var padB;
      var test;
      var width;
      var height;
      var imgTop = 0;
      //var liveType;
      var color;
      var borderColor;
      var typeWidth;
      var reserved;
      var liveStatusType
      var isReserve = false;
      var imgStatus;
      if(this.props.reservedLives && this.props.reservedLives.length > 0) {
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
      if(item.exam_mark === 1) {
        test = 'inline-block'
      } else {
        test = 'none'
      }
      if(item.id == reserved) {
        isReserve = true;//已预约
      }
      if(item.status == 0) {
        // liveStatusType = '尚未开始'
        imgStatus =(
          <div style={styles.img_status}>
            <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_notStarted@2x.png')} />
          </div>
        )
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
        imgStatus =(
          <div style={styles.img_status}>
            <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/live_start@2x.png')} />
          </div>
         )
      }
      var liveSeriesImg;
      var series = item.series ? item.series[0].id : null;
      if(series == 3) {
        liveSeriesImg =(
          <div style={{color:'#7F9CBF',fontSize:11,lineHeight:'20px'}}>连线CFO</div>
        )
      } else if(series == 4) {
        liveSeriesImg =(
          <div style={{color:'#F37633',fontSize:11,lineHeight:'20px'}}>税政通</div>
        )
      } else {
        liveSeriesImg = null
      }

      return(
      <Link to={`${__rootDir}/lesson/live/${item.id}`} key={index} >
        <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height, marginLeft: w_width < 350 ? 10 : 12}} ref={(lesson) => this.lesson = lesson}>
          <img style={{...styles.lessonPng, width: width, height: height, marginRight: w_width < 350 ? 8 : 15}} src={item.brief_image ? item.brief_image:Dm.getUrl_img('/img/v2/icons/course_default.jpg')} />
          {isReserve ?
            <div style={{width:32,height:32,position:'absolute',zIndex:99,top:imgTop,left:0,}}><img width={32} height={32} src={Dm.getUrl_img('/img/v2/course/live_leftTop@2x.png')} /></div>
            :
            null
           }
        <div style={{...styles.imgBlack,paddingLeft:8,width:width - 8}}>{new Date(item.start_time).format("MM-dd")}&nbsp;&nbsp;&nbsp;{new Date(item.start_time).format("hh:mm")}-{new Date(item.end_time).format("hh:mm")}</div>
        <div style={{marginBottom: 15}}>
          <div style={{...styles.span, fontSize: w_width < 350 ? 12 : 14}}>{imgStatus}<span style={{paddingLeft:60}}>{item.title}</span></div>
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
    var More = <span>更多<img src={Dm.getUrl_img('/img/v2/icons/more_down@2x.png')} style={{width: 16, height: 8, marginLeft: 8}}/></span>
    return(
      <div>
        {lesson_list}
        {this.props.loadType ?
          <Loading isShow={this.props.isShow}/>
          :
         <div style={{fontSize: 14, color: '#333', textAlign: 'center', marginBottom: 10}} onClick={this._loadMore.bind(this)}>
         {canLoadMore ?
           More
           :
           <div>
            {this.props.live_count > 3 ?
              '已经到底啦~'
              :
              null
            }
           </div>

         }
        </div>}
        <hr style={{height: 1, border: 'none', backgroundColor: '#e5e5e5'}}/>
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
		lineHeight: '20px',
    position:'relative'
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
    position: 'relative',
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
		// marginLeft: 14,
	},
  img_status:{
    width:50,
    height:20,
    position:'absolute',
    zIndex:2,
    left:0,
    top:0,
  }
}

export default SearchResultLive;
