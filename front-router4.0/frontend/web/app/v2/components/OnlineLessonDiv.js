import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from '../pages/ListFilterPanel'
import Star from '../components/star';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common'

class OnlineLessonDiv extends React.Component {
  constructor(props) {
    super(props);

		this.state = {
      index:0,
    }
  }

  _remind(id,index){
      Dispatcher.dispatch({
        actionType: 'SetOnlineRemind',
        id:id,
      })
      EventCenter.emit('showRemindDone', index);
  }

  _isGo(isShow,id){
    console.log('isShow:',isShow)
    if(isShow == undefined || isShow == true){//非即将上线跳转到详情 如果等于undefined说明数据里面没有这个字段默认为已经上线的课程
      this.props.history.push({pathname:`${__rootDir}/lesson/online/${id}`});
    }
  }

  render() {

    // console.log('render:',this.props.data)

    var lesson_list = this.props.data.map((item, index) => {
      let w_width = devWidth
      let w_height = devHeight
      var free;
      var padT;
      var padB;
      var test;
      var width;
      var height;
      var bottom_left
      var div_height

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
      if(w_width < 375) {
        bottom_left = w_width - width - 18 - 66
        div_height = 26
      } else if(w_width == 375) {
        bottom_left = w_width - width - 27 - 66
        div_height = 32
      } else if(w_width > 375) {
        bottom_left = w_width - width - 27 - 78
        div_height = 34
      }
      let starOverScore = {
        right: 6,
        star: item.star,
        canChange: false,
        score: item.star,
        propScore: item.star, //外部传数 （固定分数）
  			scoreShow: false,
  			width: 11,
  			height: 11
      }
      //item.isShow(false:即将上线,true:非即将上线)
      //item.showRemind(false:未设置上线提醒，true:设置提醒成功背景变灰)

      var date ='';
      var date_text='';
      if(item.plan_release_date){
        date = new Date(item.plan_release_date).format('yyyy');
        var year = new Date().getFullYear();//年份
        if(date == year){
          date_text = (new Date(item.plan_release_date).getMonth()+1)+'月'
        }
        else {
          date_text = new Date(item.plan_release_date).format('yyyy年M月')
        }
      }

      return(
        <div key={index} style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height}} onClick={this._isGo.bind(this,item.isShow,item.id)}>
            <img style={{...styles.lessonPng, width: width, height: height, marginRight: w_width < 350 ? 8 : 15, marginLeft: w_width < 350 ? 10 : 12}} src={item.brief_image ? item.brief_image :Dm.getUrl_img('/img/v2/icons/course_default.jpg')} />
            <div style={{height: div_height}}>
              <span style={{...styles.span, fontSize: w_width < 350 ? 12 : 14}}>{item.title}</span>
            </div>
            {item.isShow == false ?
              <div style={styles.comming_soon}>
                <div style={styles.commint_text}>
                {item.plan_release_date ?
                  <span>预计{date_text}上线</span>
                  :
                  <span>即将上线</span>
                }
                </div>
                <div style={{...styles.comming_box}}>
                {item.showRemind ?
                  <div style={styles.online_remain}>
                    上线提醒
                    <div style={{...styles.on_remain}}></div>
                  </div>
                  :
                  <div style={styles.online_remain} onClick={this._remind.bind(this,item.id,index)}>
                    上线提醒
                  </div>
                 }
                </div>
              </div>
              :
              <div>
                <div style={{position: 'relative', top: -2, display: 'inline-block'}}>
                  <Star {...starOverScore}/>
                </div>
                <span style={{fontSize: 11, position: 'relative', top: 0, color: '#999'}}>{item.star && item.star.toString().split('.').length > 1 ? item.star : item.star + '.0' }</span>
                <div style={{position: 'absolute', display: 'inline-block', bottom: 0, left: bottom_left, height: 16}}>
                  {/*<div style={{...styles.timePng}}></div>*/}
                  <img src={item.isFree ? Dm.getUrl_img('/img/v2/icons/isFree@2x.png') : Dm.getUrl_img('/img/v2/icons/isNotFree@2x.png')} style={{...styles.isFreePng, marginRight: item.has_exam ? 7 : 50}} />
                  <img src={Dm.getUrl_img('/img/v2/icons/new_test@2x.png')} style={{float: 'left', width: 15, height: 14, marginRight: 26, display: item.has_exam ? 'block' : 'none'}}/>
                  <div style={{...styles.line}}>|</div>
                  <img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} style={{...styles.learnNum}} />
                  <span style={{fontSize: 11, color: '#999', position: 'relative', top: -7, marginLeft: 6}}>{item.learn_num}</span>
                  {/*<span style={{...styles.chapter}}>共{item.catalog_num}章</span>*/}
                  {/*<div style={{...styles.isTest, display: test}}>测</div>*/}
                </div>
              </div>
            }
        </div>
      )
    });
    return(
      <div style={{width:devWidth,}}>
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
		lineHeight: '17px'
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
	isFreePng: {
		width: 38,
		height: 14,
		float: 'left',
		marginRight: 7,
	},
  learnNum: {
    width: 10,
    height: 10,
    float: 'left',
    position: 'relative',
    top: 2,
    marginLeft: 24
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
		fontSize: 11,
		color: '#666',
		lineHeight: '13px',
		padding: 1,
		borderRadius: 4,
		float: 'left',
		border: '1px solid #e5e5e5',
		marginLeft: 7,
	},
  comming_soon:{
    height:20,
    marginTop:12,
    display:'flex',
    flexDirection:'row',
    flex:1,
    alignItems:'center',
  },
  commint_text:{
    fontSize:13,
    color:Common.Activity_Text,
    display:'flex',
    flexDirection:'row',
    flex:1,
    alignItems:'center',
  },
  comming_box:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end',
    flex:1,
    fontSize:11,
    color:Common.Bg_White,
  },
  online_remain:{
    width:63,
    height:18,
    border:'solid 1px #f37633',
    textAlign:'center',
    lineHeight:'18px',
    position:'relative',
    fontSize:11,
    color:'#f37633',
    borderRadius:2,
  },
  on_remain:{
    width:12,
    height:12,
    position:'absolute',
    bottom:0,
    right:0,
    backgroundImage:'url('+Dm.getUrl_img('/img/v2/icons/icon_reminded@2x.png')+')',
    backgroundRepeat:'no-repeat',
    backgroundSize:'cover',
  }
}

export default OnlineLessonDiv;
