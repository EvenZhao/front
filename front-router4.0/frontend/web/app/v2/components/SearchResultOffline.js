import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from '../pages/ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Loading from '../components/Loading';

class SearchResultOffline extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
    }
  }

  _loadMore() {
    if(this.props.offline_count <= 3) {
      return
    } else {
      EventCenter.emit('SearchLoadMore', 4)
    }
  }

  render() {
    var canLoadMore
    if(this.props.offline_count == this.props.data.length) {
      canLoadMore = false
    } else {
      canLoadMore = true
    }
    var lesson_list = this.props.data.map((item, index) => {
      item = item.ori
      let w_width = devWidth
      let w_height = devHeight
      var free;
      var padT;
      var padB;
      var test;
      var width;
      var height;

      var imgStatus;
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

      if(item.disp_status == 1 ){//正在报名
        imgStatus =(
          <div style={styles.img_status}>
            <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_signUp@2x.png')} />
          </div>
         )
      }
      else if (item.disp_status == 2) {//报名已满
        imgStatus =(
          <div style={styles.img_status}>
            <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_signFull@2x.png')} />
          </div>
         )
      }
      else if(item.disp_status == 3) {//课程结束
        imgStatus =(
          <div style={styles.img_status}>
            <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_end@2x.png')} />
          </div>
         )
      }
      else if (item.disp_status == 4) {//报名截止
        imgStatus =(
          <div style={styles.img_status}>
            <img width={50} height={20} src={Dm.getUrl_img('/img/v2/course/offline_signDone@2x.png')} />
          </div>
         )
      }

      var address = item.address || null
      return(
        <Link to={`${__rootDir}/lesson/offline/${item.id}`} key={index}>
        <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height}} ref={(lesson) => this.lesson = lesson}>
        <div style={{...styles.lessonPng,width: width, height: height,marginRight: w_width < 350 ? 8 : 15, marginLeft: w_width < 350 ? 10 : 12}}>
          <img style={{width: width, height: height, }} src={item.brief_image ? item.brief_image :Dm.getUrl_img('/img/v2/icons/course_default.jpg')} />
          {/*<div style={{...styles.offline_tag,backgroundColor:statuColor,}}>{statuText}</div>*/}
          {item.isReserved ?
            <div style={{width:32,height:32,position:'absolute',zIndex:99,top:0,left:0,}}><img width={32} height={32} src={Dm.getUrl_img('/img/v2/course/offline_leftTop@2x.png')} /></div>
            :
            null
          }
          {/*<div style={{...styles.offline_tag,backgroundColor:statuColor,}}>{statuText}</div>*/}
          <div style={{...styles.imgBlack,width: width}}>
            {new Date(item.start_time).format("MM-dd") == new Date(item.end_time).format("MM-dd") ?
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
              <div style={{...styles.span, fontSize: w_width < 350 ? 12 : 14}}>
                {imgStatus}<span style={{paddingLeft:60}}>{item.title}</span>
              </div>
            </div>
            <div style={{position: 'absolute', display: 'inline-block', bottom: 0}}>
              <div style={{...styles.isTest}}>
                <img src={Dm.getUrl_img('/img/v2/course/offline_address@2x.png')} style={{...styles.placePng}} />
                {address ? address.cityname : null}
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
            {this.props.offline_count > 3 ?
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
		fontSize: 12,
		color: '#999',
		lineHeight: '16px',
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
    position:'absolute',
    zIndex:2,
    left:0,
    top:0,
  }
}

export default SearchResultOffline;
