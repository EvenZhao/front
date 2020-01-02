import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ProductTop from '../components/ProductTop'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import ProductLessonDiv from '../components/ProductLessonDiv';
import Alert from '../components/Alert';
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import LiveLessonDiv from '../components/LiveLessonDiv';
import OfflineLessonDiv from '../components/OfflineLessonDiv';
import Dm from '../util/DmURL'

class PgMyCollect extends React.Component {
	constructor(props) {
    super(props);
		this.wx_config_share_home = {
				title: '我的收藏-铂略咨询',
				desc: '铂略咨询-财税领域实战培训供应商',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
    this.id = ''
    this.titleData = ['视频课','直播课','专题课','线下课']
		this.state = {
      titleSelectNum: 0,
      live_info_list: [],
      offline_info_list: [],
      online_info_list: [],
      product_list: [],
			reservedLives: []
		};
	}

  _handleMyCollectDone(re){

    if (re.result) {
      var result = re.result;
      this.setState({
				reservedLives: re.reservedLives ? re.reservedLives : [],
        live_info_list: result.live_info_list.length >0 ? result.live_info_list : [],
        offline_info_list: result.offline_info_list.length > 0 ? result.offline_info_list : [],
        online_info_list: result.online_info_list.length >0 ?result.online_info_list : [],
        product_list: result.product_list.length > 0 ? result.product_list : [],
      })
    }
  }
	_onaddDiscount(e){
		Dispatcher.dispatch({
      actionType: 'addDiscount',
      discountCode: this.state.discountCode,
    })
	}
  _onSelectedMeun(re){
    this.setState({
      titleSelectNum: re
    })
  }
	componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'MyCollect'
    })
	}
	componentDidMount() {
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE",'铂略财课-我的收藏')
    this._getMyCollectDone = EventCenter.on('MyCollectDone',this._handleMyCollectDone.bind(this));
	}
	componentWillUnmount() {
    this._getMyCollectDone.remove();
	}
	render(){
    var lessonDiv;
		var toLink;
		if (this.state.titleSelectNum == 0) {
			toLink = `${__rootDir}/list/online`
		}else if (this.state.titleSelectNum == 1) {
			toLink = `${__rootDir}/list/live`
		}
		else if (this.state.titleSelectNum == 2) {
			toLink=`${__rootDir}/PgProductList`
		}
		else if (this.state.titleSelectNum == 3) {
			toLink=`${__rootDir}/list/offline`
		}
		var listNull = (
			<div style={{textAlign:'center',paddingTop:70}}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{marginTop:51}}>
					<span style={{fontSize:15,color:'#999999'}}>暂无收藏哦，快去收藏课程吧~</span>
				</div>
				<Link to={toLink}>
					<div style={{...styles.collecButton}}>
						<span style={{fontSize:16,color:'#666666'}}>去收藏</span>
					</div>
				</Link>
			</div>
		)
    if(this.state.titleSelectNum == 0) {
      let props = {
        data: this.state.online_info_list,
      }
      if (props.data.length < 1) {
        lessonDiv = listNull
      }else {
        lessonDiv = <OnlineLessonDiv {...props}/>
      }
    } else if(this.state.titleSelectNum == 1) {
      let props = {
        data: this.state.live_info_list,
      }
      if (props.data.length < 1) {
        lessonDiv = listNull
      }else {
        lessonDiv = <LiveLessonDiv  {...props} reservedLives={this.state.reservedLives}/>
      }
    } else if(this.state.titleSelectNum == 2) {
      let props = {
        data: this.state.product_list,
      }
      if (props.data.length < 1) {
        lessonDiv = listNull
      }else {
        lessonDiv = <ProductLessonDiv {...props} />
      }
    }else if(this.state.titleSelectNum == 3) {
      let props = {
        data: this.state.offline_info_list,
      }
      if (props.data.length < 1) {
        lessonDiv = listNull
      }else {
        lessonDiv = <OfflineLessonDiv {...props} />
      }
    }
    var title = this.titleData.map((item,index)=>{
      return(
        <div style={this.state.titleSelectNum == index ? styles.meunTitleDivSelected : styles.meunTitleDiv} key={index} onClick={this._onSelectedMeun.bind(this,index)}>
          <span>{item}</span>
        </div>
      )
    })
		return (
			<div style={{...styles.div}}>
				<div style={{backgroundColor:'#ffffff',width:'100%',height:50}}>
          {title}
				</div>
        <div style={{...styles.lessonDiv,}}>
          {lessonDiv}
        </div>
			</div>
		);
	}
}

var styles = {
  div:{
    height: devHeight,
    width: devWidth,
    // backgroundColor:'#ffffff',
  },
  lessonDiv:{
    height: devHeight,
    width:'100%',
    backgroundColor:'#ffffff',
    overflow:'scroll'
  },
  meunTitleDiv:{
    width:devWidth/4,
    height:50,
    float:'left',
    textAlign:'center',
    fontSize:15,
    color:'#999999',
    lineHeight: 3,
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#F3F3F3',
  },
  meunTitleDivSelected:{
    width:devWidth/4,
    height:50,
    float:'left',
    textAlign:'center',
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#2196f3',
    color:'#2196f3',
    fontSize:15,
    lineHeight: 3
  },
  collecButton:{
    width: 120,
    height: 39,
    border: '1px solid',
    borderRadius: 25,
    borderColor: '#666666',
    marginLeft: (devWidth-120)/2,
    lineHeight: 2.5,
    marginTop: 22,
  }
};

export default PgMyCollect;
