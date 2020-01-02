/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from './ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import OnlineListFilter from '../pages/PgOnlineListFilter';
import LiveLessonDiv from '../components/LiveLessonDiv';
import LiveListFilter from '../pages/PgLiveListFilter';
import OfflineLessonDiv from '../components/OfflineLessonDiv';
import OfflineListFilter from '../pages/PgOfflineListFilter';
import Loading from '../components/Loading';
import FullLoading from '../components/FullLoading';
import NoteAlert from '../components/NoteAlert'
import ResultAlert from '../components/ResultAlert'
import Dm from '../util/DmURL'

var t

// import scrollHelper from '../../components/scrollHelper.js';

function isInteger(obj) { //判断是否为整数
 return parseInt(obj, 10) === obj
}

var countdown = 0;
class PgOnlineList extends React.Component {
	constructor(props) {
    super(props);
    this.id = ''
    this.data = []
    this.x_map = ''
    this.y_map = ''
    this.map = ''
    this.wx_config_share_home = {
      title: '铂略咨询-财税领域实战培训供应商',
      desc: '企业财务管理培训,财务培训课程,税务培训课程',
      link: document.location.href + '',
      imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
      type: 'link'
    };
		this.state = {
			listHeight: devHeight-46,
      data: [],
      plan_release_date:null,//即将上线日期
			loadLength: -1,
			isShow: false,
			Msg: '',
			isOver: false,
			canNotLoad: false,
			isLoading: true,
			fetchNum: 0,
			reservedLives: [],
      mapCity: '',
      isRemind:false,
      //弹框提示信息
      alert_display:'none',
      alert_title:'',
      isShow:false,
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
		};
	}

	_labelScorll() {
		if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
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
				if(this.props.match.params.type == 'online') {
	        this._loadOnlineMore()
	      } else if(this.props.match.params.type == 'live') {
	        this._loadLiveMore()
	      } else if(this.props.match.params.type == 'offline') {
	        this._loadOfflineMore()
	      }
				this.setState({
					isShow: true,
					isOver: false
				})
			}
		}
	}

  _loadOnlineMore() {
    var status = {}
    status = {
      skip: this.state.data.length,
      limit: 15
    }
    const les_status = {...status}
    Dispatcher.dispatch({
      actionType: 'OnlineLoadListLoadMore',
      les_status
    })
  }

  _loadLiveMore() {
    var status = {}
    status = {
      skip: this.state.data.length,
      limit: 15
    }
    const les_status = {...status}
    Dispatcher.dispatch({
      actionType: 'LiveListLoadMore',
      les_status
    })
  }

  _loadOfflineMore() {
    var status = {}
    status = {
      skip: this.state.data.length,
      limit: 15
    }
    const les_status = {...status}
    Dispatcher.dispatch({
      actionType: 'OfflineListLoadMore',
      les_status
    })
  }
	_getBackLoadData(re){
		this.backNotload={
			label: backNotloadLabel,
			list: re
		}
		backNotload = this.backNotload
	}
  _handleOnlineLoadListMoreDone(re) {
    console.log('re1111111111==',re);
    // if(re.err){
    //   console.log('err');
    //   return false;
    // }
    if(re.result){
      this.setState({data: []}, ()=>{
        this.setState({
          data: [].concat(re.result),
    			loadLength: re.result.length,
    			isShow: false,
    			isOver: false,
    			canNotLoad: false,
    			isLoading: false
        },()=>{
    			this._getBackLoadData(this.state.data)
    		})
      })
    }
	}

  _handleOnlineLoadMore(re){
    console.log('re2222222==',re);
    // if(re.err){
    //   console.log('err');
    //   return false;
    // }
    if(re.result){
      this.setState({
        data: this.state.data.concat(re.result),
        loadLength: re.result.length,
        isShow: false,
        isOver: false,
        canNotLoad: false
      },()=>{
        this._getBackLoadData(this.state.data)
      })
    }
  }

  _handleLiveListDone(re) {
    // console.log('_handleLiveListDone==2222',re);
    if(!re || re.err){
      return;
    }
    this.setState({
			reservedLives: re.reservedLives ? re.reservedLives : [],
      data: this.data.concat(re.result),
			loadLength: re.result.length,
			isShow: false,
			isOver: false,
			canNotLoad: false,
			isLoading: false,
			fetchNum: re.fetchNum
    }, () => {
			this._getBackLoadData(this.state.data)
			if(this.state.fetchNum == 1 && this.state.data.length == 0) {
				EventCenter.emit('LiveLabelChange')
			}
		})
	}

  _handleLiveListLoadDone(re){
    this.setState({
      data: this.state.data.concat(re.result),
			loadLength: re.result.length,
			isShow: false,
			isOver: false,
			canNotLoad: false,
    },()=>{
			this._getBackLoadData(this.state.data)
		})

  }

  _handleOfflineListDone(re) {
    console.log('_handleOfflineListDone--',re);
    if(re.err){
      return;
    }
    this.setState({
      data: this.data.concat(re.result),
			loadLength: re.result.length,
			isShow: false,
			isOver: false,
			canNotLoad: false,
			isLoading: false
    },()=>{
			this._getBackLoadData(this.state.data)

		})
	}

  _handleOfflineListLoadDone(re){
    this.setState({
      data: this.state.data.concat(re.result),
			loadLength: re.result.length,
			isShow: false,
			isOver: false,
			canNotLoad: false
    },()=>{
			this._getBackLoadData(this.state.data)
		})
  }

	_handleOnlineCanNotLoad() {
		this.setState({
			canNotLoad: true
		})
	}

  _handleSetOnlineRemind(re){
    console.log('_handleSetOnlineRemind--',re);
    if(re.err){
      this.setState({
        alert_display:'block',
        alert_title:re.err,
        isShow:false,
        errStatus:0,
      },()=>{
        countdown = setInterval(()=>{
            clearInterval(countdown);
            this.setState({
              alert_display:'none',
            })
        }, 1500);
      })
      return false;
    }

    if(!re.user.isLogined){//未登录就跳转到登录页面
      this.props.history.push(`${__rootDir}/login`);
      return false;
    }

    if(re.result){
      this.setState({
        isRemind:true,
      })
    }
  }

  _handleHideAlert(){
    this.setState({
      isRemind:false,
    })
  }
  _handleshowRemindDone(re){
    var newData = this.state.data || []
    if (newData.length < 1) {return false}
    newData[re].showRemind = true

    this.setState({
      data: newData,
      plan_release_date:this.state.data[re].plan_release_date,
    })
  }
	componentWillMount() {

	}
	componentDidMount() {
    // clearTimeout(t)
		var type
		if(this.props.match.params.type == 'online') {
			type = '铂略财课-视频课'
      this.wx_config_share_home = {
        title: '视频课-铂略咨询',
        desc: '铂略碎片化体系财税课程，全新体验，猛戳进入！',
        link: document.location.href + '',
        imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
        type: 'link'
      };
		} else if(this.props.match.params.type == 'live') {
      this.wx_config_share_home = {
          title: '直播课-铂略咨询',
          desc: '铂略每日财税课程直播，覆盖企业众多财税问题，快来免费体验吧！',
          link: document.location.href + '',
          imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
          type: 'link'
      };
			type = '铂略财课-直播课'
		} else if(this.props.match.params.type == 'offline') {
      this.wx_config_share_home = {
          title: '线下课-铂略咨询',
          desc: '铂略现场公开课，一键直约报名，赶紧行动！',
          link: document.location.href + '',
          imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
          type: 'link'
      };
			type = '铂略财课-线下课'
		}
    Dispatcher.dispatch({
      actionType: 'WX_JS_CONFIG',
      onMenuShareAppMessage: this.wx_config_share_home
    })

		if (backNotloadIndex == 'PgDetail') {

			this.setState({
				data: backNotload.list,
				isLoading: false,
				loadLength: (isInteger(backNotload.list.length/15) || (backNotload.list.length/15) > 0) ? backNotload.list.length : 0
			})
			setTimeout(()=>{
				this.lessonList.scrollTop= backNotloadTop;
			} , 50)
		}

		EventCenter.emit("SET_TITLE",type)
    this._getOnlineLessonList = EventCenter.on('OnlineLoadListMoreDone',this._handleOnlineLoadListMoreDone.bind(this))
    this._loadOnlineLoadMore = EventCenter.on('OnlineLoadListLoadMoreDone', this._handleOnlineLoadMore.bind(this))
    this._getLiveList = EventCenter.on('LiveListDone', this._handleLiveListDone.bind(this))
    this._loadLiveLoadMore = EventCenter.on('LiveListLoadMoreDone', this._handleLiveListLoadDone.bind(this))
    this._getOfflineList = EventCenter.on('OfflineListDone', this._handleOfflineListDone.bind(this))
    this._loadOfflineLoadMore = EventCenter.on('OfflineListLoadMoreDone', this._handleOfflineListLoadDone.bind(this))
		this._onlineCanNotLoad = EventCenter.on('CanNotLoad', this._handleOnlineCanNotLoad.bind(this))
    this._setOnlineRemind = EventCenter.on('SetOnlineRemindDone',this._handleSetOnlineRemind.bind(this));
    this._HideAlert = EventCenter.on('HideAlert',this._handleHideAlert.bind(this));
    this.getshowRemindDone = EventCenter.on('showRemindDone',this._handleshowRemindDone.bind(this));

    // this._getMap = EventCenter.on('GetMap', this._handleGetMap.bind(this))
	}
	componentWillUnmount() {
    // clearTimeout(t)
    this._getOnlineLessonList.remove()
    this._loadOnlineLoadMore.remove()
    this._getLiveList.remove()
    this._loadLiveLoadMore.remove()
    this._getOfflineList.remove()
    this._loadOfflineLoadMore.remove()
		this._onlineCanNotLoad.remove()
    this._setOnlineRemind.remove()
    this._HideAlert.remove()
    this.getshowRemindDone.remove()
		backNotloadTop = this.lessonList.scrollTop
    clearInterval(countdown)
	}

	render(){
    let les = {
      les: this.props.match.params.type
		}

		let onlineDataLength = {
			data: this.state.data.length
		}

		let props = {
			data: this.state.data,
		}
    let onlinePops = {
      data: this.state.data,
      history: this.props.history,
    }
    var lessonDiv
		var listFilter
		if(this.props.match.params.type === 'online') {
			listFilter = <OnlineListFilter {...onlineDataLength}/>
			lessonDiv = <OnlineLessonDiv {...onlinePops}/>
		} else if(this.props.match.params.type === 'live') {
			lessonDiv = <LiveLessonDiv  {...props} reservedLives={this.state.reservedLives}/>
      listFilter = <LiveListFilter  {...onlineDataLength}/>
		} else if(this.props.match.params.type === 'offline') {
      lessonDiv = <OfflineLessonDiv {...props} />
      listFilter = <OfflineListFilter  {...onlineDataLength}/>
    }

    let alertProps ={
      alert_display:this.state.alert_display,
      alert_title:this.state.err,
      isShow:this.state.isShow,
      errStatus:this.state.errStatus
    }

    let noteProps = {
      plan_release_date:this.state.plan_release_date,
      isShow:this.state.isRemind,
    }

		return (
			<div style={{backgroundColor: '#fff',width:devWidth,height:devHeight}}>
				<FullLoading isShow={this.state.isLoading}/>
        <ResultAlert {...alertProps}/>
        <NoteAlert {...noteProps} />
        <div style={{...styles.mask,display:this.state.isRemind ? 'block':'none'}} onClick={this._handleHideAlert.bind(this)}></div>
        {/*<ListFilterPanel {...les}/>*/}
				{/*{listFilter}*/}
        {/*{this.state.mapCity}*/}
        <div style={{position:'fixed',top:0,left:0,zIndex:999}}>
          {listFilter ? listFilter : <ListFilterPanel {...les}/>}
        </div>
				<div style={{display: this.state.data.length == 0 ? 'block' : 'none', marginTop: 20, height: this.state.listHeight}}>
					<img src={Dm.getUrl_img('/img/v2/icons/null@2x.png')} style={{width: 280, height: 190, marginLeft: window.screen.width / 2 - 140, marginTop: 20}}/>
					<div style={{fontSize: 16, color: '#666', textAlign: 'center'}}>暂无相关数据~</div>
				</div>
	      <div style={{...styles.list,height: this.state.listHeight,display: this.state.data.length < 1 ? 'none' : 'block'}} ref={(lessonList) => this.lessonList = lessonList}
					onTouchEnd={() => {this._labelScorll()}}>
					<div style={{paddingTop:10,}}>{lessonDiv}</div>
					<div style={{height: 40, display: this.state.isOver == true && this.state.isShow == false && this.state.data.length > 0 ? 'block' : 'none', textAlign: 'center'}} onClick={this._labelScorll.bind(this)}>共{this.state.data.length}条</div>
					<Loading isShow={this.state.isShow}/>
	      </div>
			</div>
		);
	}
}

var styles = {
	list: {
		// height: 667,
		overflow: 'scroll',
		backgroundColor: '#fff',
    marginTop:46,
	},
  mask:{
		width: devWidth,
		height: devHeight,
		backgroundColor: '#000',
		opacity: 0.2,
		position: 'absolute',
		zIndex: 998,
	},
};

export default PgOnlineList;
