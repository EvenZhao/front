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
import SearchResultOnline from '../components/SearchResultOnline';
import SearchResultLive from '../components/SearchResultLive';
import SearchResultOffline from '../components/SearchResultOffline';
import SearchResultType from '../components/SearchResultType'
import SearchResultProduct from '../components/SearchResultProduct'
import SearchResultQuestion from '../components/SearchResultQuestion'
import Dm from '../util/DmURL'
import Loading from '../components/Loading';
import FullLoading from '../components/FullLoading';
import LoadFailure from '../components/LoadFailure'
import NoteAlert from '../components/NoteAlert'
import ResultAlert from '../components/ResultAlert'

// import scrollHelper from '../../components/scrollHelper.js';
var skip = 0;//定义初始skip
var limit = 15;//定数初始limit
class PgSearchResult extends React.Component {
	constructor(props) {
		super(props);
		this.wx_config_share_home = {
			title: '搜索-铂略咨询',
			desc: '快速搜索财税内容，开启财税工作新纪元！',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link'
		};
		this.id = ''
		this.data = ['综合', '视频', '问答', '直播', '线下', '专题']//搜索页面筛选条件
		this.state = {
			listHeight: devHeight - 42.5,
			changeLabelNum: 0,//默认筛选条件为第一个
			changeLabelName: '综合',
			changeLabelDivDisplay: false,//筛选条件标签
			labelsDivDispaly: true,//遮罩层标签
			keyWord: '',
			online: [],
			offline_info: [],
			live_info: [],
			product: [],
			question: [],
			hotLabelListDate: [],
			searchTotal: 0,
			live_count: 0, //某门课程共搜到多少条数据
			offline_count: 0,
			online_count: 0,
			product_count: 0,
			question_count: 0,
			myKeyWordData: [],//我的搜索
			isLoading: true,
			isShow: false,
			canNotLoad: false,
			loadLength: '',
			canScroll: false,
			searchIdx: 0,
			loadType: false,
			isChooseLabel: true,
			reservedLives: [],
			req_err: false,
			remindId: [],
			isRemind: false,
			//弹框提示信息
			alert_display: 'none',
			alert_title: '',
			isShow: false,
			errStatus: 0,//0:返回错误信息,1:显示其他提示信息
			loadText: false,
			plan_release_date: null,//即将上线日期
			//会员:1
			vipPriceFlag:null,
		};
	}

	_onChangeSearchKeyword(e){
		e.preventDefault();
		var v = e.target.value.trim();
		// if (v.length > 0) {
			this.setState({
				labelsDivDispaly: true,
				keyWord: v,
			})
		// }else {
		// 	this.setState({
		// 		keyWord: v,
		// 		labelsDivDispaly: true
		// 	})
		// }
	}

	//返回设置过上线提醒的课程id数组
	_handleGetAccountOnlineRemind(re){
		console.log('_handleGetAccountOnlineRemind===',re);
		if(re.err){
			return false;
		}
		if(re.results.length > 0){
			//本地存储已经设置上线的课程ID
			this.setState({
				remindId:re.results
			})
		}
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

	_handleshowRemindDone(index){
		if(!this.state.online || this.state.online.length < 1){
			return false;
		}
		var newData = this.state.online
    newData[index].showRemind = true
		this.state.remindId.push(newData[index].ori.id)
    this.setState({
      online: newData,
			remindId:this.state.remindId,
			plan_release_date:this.state.online[index].ori.plan_release_date,
    })
	}

	_handleHideAlert(){
    this.setState({
      isRemind:false,
    })
  }

  _handleSearchDone(re) {
		console.log('====_handleSearchDone==',re);
		 var result =re.result || {}
		 var loadType
			if(this.state.isChooseLabel == true) {
				loadType = false
			} else if(this.state.isChooseLabel == false){
				if(this.state.searchIdx == 0) {
					loadType = true
				} else if(this.state.searchIdx == 1) {
					if(re.result.online_count == re.result.online.length) {
						loadType = false
					} else {
						loadType = true
					}
				} else if(this.state.searchIdx == 2) {
					if(re.result.question_count == re.result.question.length) {
						loadType = false
					} else {
						loadType = true
					}
				} else if(this.state.searchIdx == 3) {
					if(re.result.live_count == re.result.live.length) {
						loadType = false
					} else {
						loadType = true
					}
				} else if(this.state.searchIdx == 4) {
					if(re.result.offline_count == re.result.offline.length) {
						loadType = false
					} else {
						loadType = true
					}
				} else if(this.state.searchIdx == 5) {
					if(re.result.product_count == re.result.product.length) {
						loadType = false
					} else {
						loadType = true
					}
				}
			}
		 if (result) {
			 this.setState({
	      //  data: this.data.concat(re.result),
				// 	loadLength: re.result.length
				reservedLives: result.reservedLives || [],
				online: result.online || [],
				offline_info:result.offline || [],
				live_info:result.live || [],
				product:result.product || [],
				question: result.question || [],
				searchTotal: result.total_count || 0,
				live_count:result.live_count ||  0,
				offline_count:result.offline_count || 0,
				online_count:result.online_count || 0,
				product_count:result.product_count || 0,
				question_count:result.question_count || 0,
				isLoading: false,
				canNotLoad: false,
				canScroll: false,
				loadType: loadType,
				vipPriceFlag:result.vipPriceFlag,
			})
		 }
	}
	_handleSearchMoreDone(re){
		var result =re.result || {}
		var type = re.type || ''
		switch (type) {//根据不同的类型做不同的loadmore
			case 'online_info':
				this.setState({//判断一下如果当前数组长度为3则重置
				 online: this.state.online.length == 3 ? result.online : this.state.online.concat(result.online),
				 offline_info: [],
				 live_info: [],
				 product:[],
				 question:[],
				 searchTotal: result.total_count || 0,
				 online_count:result.online_count || 0,
				 isLoading: false,
				 isShow: false,
				 canNotLoad: false,
				 loadLength: re.result,
				 canScroll: true
			 }, () => {
				 this.setState({
					 loadType: re.result.online_count == this.state.online.length ? false : true,
					//  canScroll: re.result.online_count == this.state.online.length ? false : true,
				 })
			 })
			break;
			case 'question':
				this.setState({//判断一下如果当前数组长度为3则重置
					 online: [],
					 offline_info: [],
					 live_info: [],
					 product:[],
					 question: this.state.question.length == 3 ? result.question : this.state.question.concat(result.question),
					 searchTotal: result.total_count || 0,
					 question_count:result.question_count || 0,
					 isLoading: false,
					 isShow: false,
					 canNotLoad: false,
					 loadLength: re.result,
					 canScroll: true
				}, () => {
					this.setState({
						loadType: re.result.question_count == this.state.question.length ? false : true,
						//  	canScroll: re.result.online_count == this.state.online.length ? false : true,
					})
				})
			break;
			case 'live_info':
				this.setState({//判断一下如果当前数组长度为3则重置
					 online: [],
					 offline_info: [],
					 live_info: this.state.live_info.length == 3 ? result.live : this.state.live_info.concat(result.live),
					 product:[],
					 question: [],
					 searchTotal: result.total_count || 0,
					 live_count:result.live_count || 0,
					 isLoading: false,
					 isShow: false,
					 canNotLoad: false,
					 loadLength: re.result,
					 canScroll: true
				}, () => {
					this.setState({
						loadType: re.result.live_count == this.state.live_info.length ? false : true,
						//  	canScroll: re.result.online_count == this.state.online.length ? false : true,
					})
				})
			break;
			case 'offline_info':
				this.setState({//判断一下如果当前数组长度为3则重置
					 online: [],
					 offline_info: this.state.offline_info.length ==3 ? result.offline : this.state.offline_info.concat(result.offline),
					 live_info: [],
					 product:[],
					 question: [],
					 searchTotal: result.total_count || 0,
					 offline_count:result.offline_count || 0,
					 isLoading: false,
					 isShow: false,
					 canNotLoad: false,
					 loadLength: re.result,
					 canScroll: true
				}, () => {
					this.setState({
						loadType: re.result.offline_count == this.state.offline_info.length ? false : true,
						//  	canScroll: re.result.online_count == this.state.online.length ? false : true,
					})
				})
			break;
			case 'product':
				this.setState({//判断一下如果当前数组长度为3则重置
					 online: [],
					 offline_info: [],
					 live_info: [],
					 product: this.state.product.length == 3 ? result.product : this.state.product.concat(result.product),
					 question: [],
					 searchTotal: result.total_count || 0,
					 product_count:result.product_count || 0,
					 isLoading: false,
					 isShow: false,
					 canNotLoad: false,
					 loadLength: re.result,
					 canScroll: true
				}, () => {
					this.setState({
						loadType: re.result.product_count == this.state.product.length ? false : true,
						//  	canScroll: re.result.online_count == this.state.online.length ? false : true,
					})
				})
			break;
		}
	}
	_changeLabelName(re){//切换筛选条件
		var type;
		var lim = 15;
		switch (re) {
			case 0:
				type ='all'
				lim = 3   //如果当前type为all则limit为3
			break;
			case 1:
				type ='online_info'
			break;
			case 2:
				type ='question';
			break;
			case 3:
				type ='live_info'
			break;
			case 4:
				type ='offline_info'
			break;
			case 5:
				type ='product'
			break;
			default: type ='all'
		}

		this.setState({
			changeLabelNum: re,
			changeLabelName: this.data[re],
			changeLabelDivDisplay:false, //!this.state.changeLabelDivDisplay,
			isLoading: true,
			canScroll: true,
			searchIdx: re,
			loadType: true,
			online:[],
			offline_info:[],
			live_info:[],
			product:[],
			question:[],
			isChooseLabel: re == 0 ? true : false
		}, () => {
			Dispatcher.dispatch({
				actionType: 'Search',
				keyWord: this.state.keyWord,
				searchType:type,
				skip: 0,
				limit: lim
			})
		})
	}
	_changeLabelDivDisplay(re){//是否打开条件筛选框
		this.setState({
			changeLabelDivDisplay: !this.state.changeLabelDivDisplay //true,
		})

	}
	_handlehotLabelListDone(re){//热门标签列表返回值
		if (re && re.result) {
			this.setState({
				hotLabelListDate: re.result || [],
				isLoading: false,
				canScroll: false,
				loadType: false
			})
		}
	}

	_doSearchMore(tp){
		var type;
		if(this.state.loadType == false || this.state.canNotLoad == true) {
			return
		}
		if(this.state.canScroll == true && this.state.canNotLoad == false) {
			if((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
				switch (tp) {//搜索结果loadmore查询根据不同的类型查询不同的type
					case 1:
						type ='online_info'
						skip = this.state.online.length == 3 ? 0 : this.state.online.length
					break;
					case 2:
						type ='question'
						skip = this.state.question.length == 3 ? 0 : this.state.question.length
					break;
					case 3:
						type ='live_info'
						skip = this.state.live_info.length == 3 ? 0 : this.state.live_info.length
					break;
					case 4:
						type ='offline_info'
						skip = this.state.offline_info.length == 3 ? 0 : this.state.offline_info.length
					break;
					case 5:
						type ='product'
						skip = this.state.product.length == 3 ? 0 : this.state.product.length
					break;
					default: type ='online_info'
				}

				if (tp) {
					Dispatcher.dispatch({//调用加载更多的方法
						actionType: 'Search',
						keyWord: this.state.keyWord,
						searchType: type,
						skip: skip,
						limit: 15,
						loadMore: true//标记用于判断是够调用loadmore方法
					})
					this.setState({//点击更多的时候切换掉筛选框的值
						changeLabelNum: tp,
						changeLabelName: this.data[tp],
						isShow: true,
						loadType: true
					})
				}
			}
		} else {
			switch (tp) {//搜索结果loadmore查询根据不同的类型查询不同的type
				case 1:
				type ='online_info'
				skip = this.state.online.length == 3 ? 0 : this.state.online.length
				break;
				case 2:
				type ='question'
				skip = this.state.question.length == 3 ? 0 : this.state.question.length
				break;
				case 3:
				type ='live_info'
				skip = this.state.live_info.length == 3 ? 0 : this.state.live_info.length
				break;
				case 4:
				type ='offline_info'
				skip = this.state.offline_info.length == 3 ? 0 : this.state.offline_info.length
				break;
				case 5:
				type ='product'
				skip = this.state.product.length == 3 ? 0 : this.state.product.length
				break;
				default: type ='online_info'
			}

			if (tp) {
				Dispatcher.dispatch({//调用加载更多的方法
					actionType: 'Search',
					keyWord: this.state.keyWord,
					searchType: type,
					skip: skip,
					limit: 15,
					loadMore: true//标记用于判断是够调用loadmore方法
				})
				this.setState({//点击更多的时候切换掉筛选框的值
					changeLabelNum: tp,
					changeLabelName: this.data[tp],
					isShow: true
				})
			}
		}
	}
	getSearchType(){
		var lim = 15;
		var type
		switch (this.state.changeLabelNum) {
			case 0:
				type ='all'
				lim = 3   //如果当前type为all则limit为3
			break;
			case 1:
				type ='online_info'
			break;
			case 2:
				type ='question'
			break;
			case 3:
				type ='live_info'
			break;
			case 4:
				type ='offline_info'
			break;
			case 5:
				type ='product'
			break;
			default: type ='all'
		}
		var obj={
			type: type,
			limit: lim
		}
		return obj
	}
	_doSearch(e){
			// skip = 0 //重置skip
		if (this.state.keyWord) {
			if (this.state.myKeyWordData.length < 10) { //判断一下当前临时数组的长度，目前保留数组长度为10
				this.state.myKeyWordData.push(this.state.keyWord)
			}else {
				this.state.myKeyWordData[0] = this.state.keyWord
			}
			var unique = {};//去掉数组中相同的值
			this.state.myKeyWordData.forEach(function(gpa){ unique[ JSON.stringify(gpa) ] = gpa });
			this.state.myKeyWordData = Object.keys(unique).map(function(u){return JSON.parse(u) });
			localStorage.setItem("myKeyWordData", JSON.stringify(this.state.myKeyWordData));
			var obj = this.getSearchType()
			Dispatcher.dispatch({
				actionType: 'Search',
				keyWord: this.state.keyWord,
				searchType:obj.type || 'all',
				skip: 0,
				limit: obj.limit || 3
			})
			this.setState({
				isLoading: true,
				labelsDivDispaly: false
			})
		}
	}
	_hotLabelSearch(re){  //热门标签搜索
		var obj = this.getSearchType()
		if (re) {
			Dispatcher.dispatch({
				actionType: 'Search',
				keyWord: re,
				searchType:obj.type || 'all',
				skip: 0,
				limit: obj.type == 'all' ? 3 : 15
			})
			this.setState({
				keyWord: re,
				labelsDivDispaly: false,
				isLoading: true
			})
		}
	}
	_handleSearchTimeout(){
		this.setState({
			req_err:true,
		})
	}
	_ClearSearchWord(re){  //清楚掉本地我的搜索记录
		localStorage.removeItem("myKeyWordData")
		this.setState({
			myKeyWordData:[]
		})
	}
	_handleClickSearchMore(re) {
		this.lessonList.scrollTop = 0
		this.setState({
			searchIdx: re,
			loadType: true
		}, () => {
			this._doSearchMore(re)
		})
	}
	_handleCanNotLoad() {
		this.setState({
			canNotLoad: true
		})
	}
	componentWillMount() {
		Dispatcher.dispatch({
			actionType: 'GetAccountOnlineRemind',
		})

		Dispatcher.dispatch({
			actionType: 'hotLabelList',
		})

		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})

		this.e_GetAccountOnlineRemind = EventCenter.on('GetAccountOnlineRemindDone',this._handleGetAccountOnlineRemind.bind(this))
	}
	componentDidMount() {

		EventCenter.emit("SET_TITLE",'铂略财课-搜索')
		var SEARCH_DATA =	localStorage.getItem("myKeyWordData") //把本地的搜索记录暂时放进临时变量中
		if (SEARCH_DATA === null) {
			//  return;
		 }else {
			 var json = JSON.parse(SEARCH_DATA);
			 this.setState({
				 myKeyWordData: json
			 })
		 }

    this._getSearchDone = EventCenter.on('SearchDone',this._handleSearchDone.bind(this))
		this._gethotLabelListDone = EventCenter.on('hotLabelListDone',this._handlehotLabelListDone.bind(this))
		this._getSearchMoreDone = EventCenter.on('SearchMoreDone',this._handleSearchMoreDone.bind(this))
		this._clickSearchMore = EventCenter.on('SearchLoadMore', this._handleClickSearchMore.bind(this))
		this._canNotLoad = EventCenter.on('canNotLoad', this._handleCanNotLoad.bind(this))
		this._setOnlineRemind = EventCenter.on('SetOnlineRemindDone',this._handleSetOnlineRemind.bind(this));
		this.getshowRemindDone = EventCenter.on('showRemindDone',this._handleshowRemindDone.bind(this));
		this._HideAlert = EventCenter.on('HideAlert',this._handleHideAlert.bind(this));
		this.e_SearchTimeout = EventCenter.on('SearchTimeout',this._handleSearchTimeout.bind(this));

	}
	componentWillUnmount() {
		this.e_GetAccountOnlineRemind.remove()
    this._getSearchDone.remove()
		this._gethotLabelListDone.remove()
		this._getSearchMoreDone.remove()
		this._clickSearchMore.remove()
		this._canNotLoad.remove()
		this.e_SearchTimeout.remove()
		this._setOnlineRemind.remove()
		this.getshowRemindDone.remove()
		this._HideAlert.remove()
	}
	changeonFocus(e){
		this.setState({
			labelsDivDispaly: true
		})
	}
	render(){

		let online = {
			data: this.state.online,
			online_count: this.state.online_count,
			loadType: this.state.loadType,
			isShow: this.state.isShow,
			history: this.props.history,
			remindIdArray:this.state.remindId,
		}
		let onlineTitle ={
			type:'online',
			total_count: this.state.online_count,
		}
		let liveInfo = {
			data: this.state.live_info,
			live_count: this.state.live_count,
			loadType: this.state.loadType,
			isShow: this.state.isShow,
			reservedLives: this.state.reservedLives
		}
		let liveInfoTitle ={
			type:'live',
			total_count: this.state.live_count
		}
		let product = {
			data:this.state.product,
			product_count: this.state.product_count,
			loadType: this.state.loadType,
			isShow: this.state.isShow,
			vipPriceFlag:this.state.vipPriceFlag
		}
		let productTitle ={
			type:'product',
			total_count: this.state.product_count
		}
		let offline = {
			data: this.state.offline_info,
			offline_count: this.state.offline_count,
			loadType: this.state.loadType,
			isShow: this.state.isShow
		}
		let offlineTitle ={
			type:'offline',
			total_count: this.state.offline_count
		}
		let question ={
			data: this.state.question,
			question_count: this.state.question_count,
			loadType: this.state.loadType,
			isShow: this.state.isShow,
		}
		let questionTitle ={
			type:'question',
			total_count: this.state.question_count
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

		var changeLabel = this.data.map((item,index)=>{//把筛选条件数组循环遍历出来
			var labelsColor;//定义高亮颜色变量
			if (this.state.changeLabelNum == index) {//点击时改变颜色
				labelsColor='#2196f3';
			}else {
				labelsColor='#666666';
			}
			return(
				<div key={index} style={{...styles.changeLabelName}} onClick={this._changeLabelName.bind(this,index)}>
					<div style={{marginLeft:20}}>
						<span style={{fontSize:14,color:labelsColor}}>{item}</span>
					</div>
				</div>
			)
		})
		var hotLabel = this.state.hotLabelListDate.map((item,index)=>{
			var keyWords = item.keyword
			if (index >= 10) {
				return
			}
			return(
				<div style={{...styles.hotSearchKeyword}} key={index} onClick={this._hotLabelSearch.bind(this,keyWords)}>
					<span style={{fontSize:14,color:'#333333'}}>{item.keyword}</span>
				</div>
			)
		})
		var myLabel = this.state.myKeyWordData.map((item,index)=>{
			var keyWords = item;
			return(
				<div style={{...styles.myKeyWord}} key={index} onClick={this._hotLabelSearch.bind(this,keyWords)}>
					<div style={{float:'left',marginLeft:32,marginTop:10,marginRight:15}}>
						<img src={Dm.getUrl_img('/img/v2/icons/time2@2x.png')} width={13} height={13} />
					</div>
					<div style={{lineHeight:2.5}}>
						<span style={{fontSize:15,color:'#666666'}}>{item}</span>
					</div>
				</div>
			)
		})
		return (
		<div>
		{
			this.state.req_err ?
			<LoadFailure/>
			:
			<div style={{...styles.div}}>
				<FullLoading isShow={this.state.isLoading}/>
				<NoteAlert {...noteProps} />
				<ResultAlert {...alertProps}/>
				<div style={{...styles.mask,display:this.state.isRemind ? 'block':'none'}} onClick={this._handleHideAlert.bind(this)}></div>
        <div style={{height:50,width:devWidth,paddingTop:12}}>
          <div style={{...styles.inputDiv, marginLeft: 12}}>
            <div style={{float:'left',marginLeft:16,marginTop:8,marginRight:10}}>
              <img src={Dm.getUrl_img('/img/v2/icons/search.png')} />
            </div>
            <div style={{marginTop:3}}>
              <input style={{...styles.input}} value={this.state.keyWord} onFocus={this.changeonFocus.bind(this)} onChange={this._onChangeSearchKeyword.bind(this)} placeholder="搜索相关课程，法规或回答"/>
            </div>
          </div>
          <div style={{marginTop:5,width:48,float:'right'}} onClick={this._doSearch.bind(this)}>
            <span style={{fontSize:15,color:'#666666'}}>搜索</span>
          </div>
					<div></div>
        </div>
				<div style={{...styles.labelsDiv,display:this.state.labelsDivDispaly ? 'block':'none'}}>
					<div style={{...styles.hotSearchDiv}}>
						<div style={{width:devWidth,height:36,lineHeight:3.5}}>
							<img style={{marginLeft:18,marginRight:12}} src={Dm.getUrl_img('/img/v2/icons/hoticon.png')} />
							<span style={{fontSize:16,color:'#333333'}}>热门搜索</span>
						</div>
						<div style={{width:(devWidth - 36),height:146,overflow:'scroll',marginLeft:18}}>
							{hotLabel}
						</div>
					</div>
					<div>
						{myLabel}
						<div style={{...styles.clearKeyWord,display: this.state.myKeyWordData.length > 0 ? 'block' :'none'}} onClick={this._ClearSearchWord.bind(this)}>
							<span style={{fontSize:15,color:'#2196f3'}}>清除搜索历史</span>
						</div>
					</div>
				</div>
        <div style={{width:'100%',height:40,backgroundColor:'#f2f2f2',lineHeight:2.5,overflow:'hidden'}}>
          <div style={{float:'left',marginLeft:21}}>
            <span style={{fontSize:15,color:'#333333'}}>共找到<span style={{color:'#2196f3'}}>{this.state.searchTotal}</span>个相关课程</span>
          </div>
          <div style={{marginRight:21,float:'right'}} onClick={this._changeLabelDivDisplay.bind(this)}>
            <span style={{fontSize:15,color:'#2196f3'}}>{this.state.changeLabelName}</span>
						{
							this.state.changeLabelDivDisplay ?
							<img style={{marginLeft:6}} src={Dm.getUrl_img('/img/v2/icons/down.png')} />
							: <img style={{marginLeft:6}} src={Dm.getUrl_img('/img/v2/icons/up.png')} />
						}
          </div>
        </div>

			<div style={{width:devWidth,height:devHeight-102,overflowY:'auto'}}
			ref={(lessonList) => this.lessonList = lessonList} onTouchEnd={() => {this._doSearchMore(this.state.searchIdx)}}>
				<div style={{width:'100%',height:210,display:this.state.changeLabelDivDisplay ? 'block':'none',position:'absolute',zIndex:9999999}}>
					{changeLabel}
				</div>
				<div>
					<div style={{display: this.state.online.length > 0 ? 'block' : 'none'}}>
						<SearchResultType {...onlineTitle}/>
						<SearchResultOnline {...online}/>
					</div>
					<div style={{display: this.state.question.length > 0 ? 'block' : 'none'}}>
						<SearchResultType {...questionTitle}/>
						<SearchResultQuestion {...question}/>
					</div>
					<div style={{display: this.state.live_info.length > 0 ? 'block' : 'none'}}>
						<SearchResultType {...liveInfoTitle}/>
						<SearchResultLive {...liveInfo} />
					</div>
					<div style={{display: this.state.offline_info.length > 0 ? 'block' : 'none'}}>
						<SearchResultType {...offlineTitle}/>
						<SearchResultOffline {...offline}/>
					</div>
					<div style={{display: this.state.product.length > 0 ? 'block' : 'none'}}>
						<SearchResultType {...productTitle}/>
						<SearchResultProduct {...product}/>
					</div>
				</div>
			</div>
			</div>
			}
		</div>
		);
	}
}

var styles = {
  div:{
    height: devHeight,
    width: devWidth,
    backgroundColor:'#ffffff',
  },
  inputDiv:{
    width:devWidth * 0.8,
    height:35,
    backgroundColor:'#f5f5f5',
    float:'left',
    borderRadius:6,
    marginRight:12,
  },
  input:{
    backgroundColor:'#f5f5f5',
    border:'none',
    width:devWidth * 0.59
  },
  hotSearchDiv:{
    width:'100%',
    height:193,
    backgroundColor:'#f2f2f2',
  },
  hotSearchKeyword:{
    backgroundColor:'#f4f4f4',
    paddingLeft:12,
    paddingRight:12,
    textAlign:'center',
    height:33,
    listHeight:2,
    borderRadius:6,
    float:'left',
    marginRight:15,
    marginTop:15,
    lineHeight:2,
		borderTopColor:'d1d1d1',
		borderTopStyle:'soild',
		borderTopWidth:1,
  },
	changeLabelName:{
		width:'100%',
		height:35,
		backgroundColor:'#f9f9f9',
		lineHeight:'35px',
		borderBottomWidth:1,
		borderBottomColor:'#f3f3f3',
		borderBottomStyle:'solid',
	},
	labelsDiv:{
		height: devHeight,
    width: devWidth,
		position:'absolute',
		backgroundColor:'#fafafa',
		zIndex:9999
	},
	clearKeyWord:{
		height:50,
		width:'100%',
		textAlign:'center',
		// backgroundColor:'#f3f3f3',
		lineHeight:3
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

export default PgSearchResult;
