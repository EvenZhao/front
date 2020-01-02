var React = require('react');
var PropTypes = React.PropTypes;
var keyMirror = require('keymirror');
var assign = require('object-assign');
var cx = require('classnames');
var util =  require('util'),
    f = util.format;
var URL = require('url');
var querystring = require('querystring');
var dm = require('../../util/DmURL');
var patterns = require('../patterns.js');
var Dispatcher = require('../../dispatcher/AppDispatcher');
var CoursesStore = require('../../stores/CoursesStore');

var AuthStore = require('../../stores/AuthStore.js')(Dispatcher);
let url_nophoto = 'http://www.bolue.cn/images/bot_qrcode.png';

var Events = keyMirror({
	INIT_ONLINE_PLAYER: null,
	INIT_PRODUCT_PLAYER: null,
	ON_PLAYOVER_DONE: null
});

function reloadpg(){
	document.location.reload(true);
}

var CRSPanelDetail_PrePlay = React.createClass({
	propTypes: {
		ad: PropTypes.object,
		style: PropTypes.object,
		lesson: PropTypes.any,
		user: PropTypes.object,
		productId: PropTypes.any,
		levelId: PropTypes.any,
		ispdplayer: PropTypes.bool
	},
	getDefaultProps: function() {
		return ({
			ad: {
				img: 'http://www.bolue.cn/resourceimages/730c8efe9a38424eab1bf0f9dddbabc2.png'
			}
		});
	},
	getInitialState: function(){
		return ({
			isShowAd: false,
			isPlaying: false,
			onlineVplayer: null,
			ishidden: true
		});
	},
	_handleONLINE_CHANGE_CHAPTER_DONE: function(re){
		this.setState({
			isPlaying: false,
			onlineVplayer: null
		}, function(){
			window.setTimeout(function(){
	            CoursesStore.emit(Events.INIT_ONLINE_PLAYER, null);
	    	}, 500);
		});
	},
	_handlePRODUCT_CHANGE_CHAPTER_DONE: function(re){
		console.log('re',re);
		this.setState({
			isPlaying: false,
			onlineVplayer: null
		}, function(){
			window.setTimeout(function(){
	            CoursesStore.emit(Events.INIT_PRODUCT_PLAYER, null);
	    	}, 500);
		});
	},
    componentDidMount: function() {
    	CoursesStore.addEventListener(CoursesStore.Events.ONLINE_CHANGE_CHAPTER_DONE, this._handleONLINE_CHANGE_CHAPTER_DONE);
    	CoursesStore.addEventListener(CoursesStore.Events.PRODUCT_CHANGE_CHAPTER_DONE, this._handlePRODUCT_CHANGE_CHAPTER_DONE);
    	CoursesStore.addEventListener(Events.INIT_ONLINE_PLAYER, this._init_online_player);
    	CoursesStore.addEventListener(Events.INIT_PRODUCT_PLAYER, this._init_product_player);
    	// window.addEventListener("orientationchange", reloadpg, false);
    	var ispdplayer =this.props.ispdplayer;
    	if (!ispdplayer) {
	    	window.setTimeout(function(){
	            CoursesStore.emit(Events.INIT_ONLINE_PLAYER, null);
	    	}, 500);
    	}
    },
    componentWillUnmount: function() {
        CoursesStore.removeEventListener(CoursesStore.Events.ONLINE_CHANGE_CHAPTER_DONE, this._handleONLINE_CHANGE_CHAPTER_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.PRODUCT_CHANGE_CHAPTER_DONE, this._handlePRODUCT_CHANGE_CHAPTER_DONE);
    	CoursesStore.removeEventListener(Events.INIT_ONLINE_PLAYER, this._init_online_player);
    	CoursesStore.removeEventListener(Events.INIT_PRODUCT_PLAYER, this._init_product_player);
    	// window.removeEventListener("orientationchange", reloadpg, false);
    },
    _onGET_ORDER: function(e) {
        Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.GET_ORDER,
            lesson: this.props.lesson
        });
    },
    _onGET_RESERVE: function(e) {
    	if (this.props.user.isBinded) {
    		Dispatcher.dispatch({
	            actionType: CoursesStore.ActionTypes.GET_RESERVE,
	            lesson: this.props.lesson
	        });
    	} else {
    		AuthStore.emit(AuthStore.Events.SC401);
    	}

    },
    _onGET_ENROLL: function(e) {
    	var user  = this.props.user;
    	if(user && user.isBinded){
	        Dispatcher.dispatch({
	            actionType: CoursesStore.ActionTypes.GET_ENROLL,
	            lesson: this.props.lesson
	        });
    	} else {
    		this._onGET_LOGIN();
    	}
    },
	_onTOGGLE_COLLECT: function(e){
    	var lesson = this.props.lesson;
    	Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.PRODUCT_TOGGLE_COLLECT,
            lession: lesson,
            isCollected: lesson.isCollected
        });
    },
	_onTOGGLE_HIDDEN: function(e){
    	if (this.state.ishidden) {
    		this.setState({
    			ishidden: false
    		});
    	} else {
    		this.setState({
    			ishidden: true
    		});
    	}
    },
    _onGET_LOGIN: function(e) {
        Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.GET_LOGIN,
            lesson: this.props.lesson
        });
    },
    makeMask_sub_live_info_reserve: function(){
    	var lesson = this.props.lesson;
    	var start_date = lesson && lesson.start_time ? new Date(lesson.start_time).format(patterns.DATE) : '';
	    var start_time = lesson && lesson.start_time ? new Date(lesson.start_time).format(patterns.TIME) : '';
	    var end_time = lesson && lesson.end_time ? new Date(lesson.end_time).format(patterns.TIME) : '';
    	var bt = (<div className="btn btn-primary" onClick={this._onGET_RESERVE}>我要预约</div>);
    	switch(lesson.live_status){
    		case 'not_started':
    			return (
		    		<div className="mask-half">
		    			<div className="col-xs-8 txt-info">
		    				<div className="row"> {start_date}{start_time}~{end_time}</div>
		    				<div className="row">直播开始前15分钟发短信提醒</div>
		    			</div>
		    			<div className="col-xs-4 right-btn">
			    			{bt}
		    			</div>
					</div>
				);
	    	default: return this.makeMask_sub_order();
    	}
    },
    makeMask_sub_live_info_already_reserved: function(){
    	var lesson = this.props.lesson;
    	var start_date = lesson && lesson.start_time ? new Date(lesson.start_time).format(patterns.DATE) : '';
	    var start_time = lesson && lesson.start_time ? new Date(lesson.start_time).format(patterns.TIME) : '';
	    var end_time = lesson && lesson.end_time ? new Date(lesson.end_time).format(patterns.TIME) : '';
		return (
    		<div className="mask-half">
    			<div className="col-xs-8 txt-info">
    				<div className="row"> {start_date}{start_time}~{end_time}</div>
    				<div className="row">直播开始前15分钟发短信提醒</div>
    			</div>
    			<div className="col-xs-4 right-btn">
    				<div className="btn btn-success">已预约</div>
    			</div>
			</div>
		);
    },
    makeMask_sub_product: function(){
    	var lesson = this.props.lesson;
    	var instroduction = lesson && lesson.instroduction ? lesson.instroduction : '';
    	var learn_num = lesson && lesson.learn_num ? lesson.learn_num : '';
    	var cls_stared = cx('right', 'fa', lesson.isCollected ? 'fa-star full-star' : 'fa-star-o');
    	var cls_product =cx(this.state.ishidden ? 'mask-product-half':'mask-product-full');
		return (
    		<div className={cls_product}>
    			<div className="col-xs-12 txt-info">
	    				<div className="row" onClick={this._onTOGGLE_HIDDEN}>{instroduction}</div>
	    				<div className="s">
		    				<div className="visitors fa ">{learn_num}</div>
		    				<div className="social colR right">
		                    	<span className={cls_stared} onClick={this._onTOGGLE_COLLECT}></span>
		                    </div>

	    				</div>
    			</div>
			</div>
		);
    },
    _onGET_COUPON: function(e) {
    	var lesson = this.props.lesson || [];
    	var resource_type;
    	switch(lesson.type){
    		case 'live_info':
	    		resource_type = 1;
    		break;
    		case 'online_info':
	    		resource_type = 2;
    		break;
    	}
        Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.GET_COUPON,
            resource_type: resource_type
        });
    },
    makeMask_sub_order: function(){
    	var lesson = this.props.lesson;
    	var user  = this.props.user;
    	if(user && user.isBinded){
			return (
	    		<div className="mask-half">
		    		{
		    			isWeiXin ?
			    			<div>
				    			<div className="col-xs-8 txt-info">
				    				<div className="row">本课程为收费课程 仅对已付费会员开放 </div>
				    			</div>
				    			<div className="col-xs-4 right-btn">
					    			<button onClick={this._onGET_COUPON} className="btn btn-primary">使用体验券</button>
				    			</div>
			    			</div>
		    			:
			    			<div className="col-xs-12 txt-info">
			    				<div className="row">本课程为收费课程 仅对已付费会员开放 </div>
			    			</div>
		    		}
	    			{/*<div className="col-xs-4 right-btn">
		    			<div className="btn btn-primary" onClick={this._onGET_ORDER}>购买</div>
	    			</div>	*/}
				</div>
			);
    	} else {
	        return (
	        	<div className="mask-full">
    				<div className="row center-middle">
	    				<div className="row">
	    					<div className="col-xs-offset-3 col-xs-6">本课程为会员专享</div>
	    				</div>
	    				<div className="row">
		    				<div className="col-xs-offset-4 col-xs-4">
			    				<div className="btn btn-primary" onClick={this._onGET_LOGIN}>会员登录</div>
		    				</div>
	    				</div>
    				</div>
				</div>
        	);
    	}

    },
    _init_online_player: function(){
    	var lesson = this.props.lesson;
    	if( (lesson.type === 'online_info' || (lesson.type === 'live_info' && lesson.live_status === 'ended'))
    		&& (lesson.isFree || lesson.authority === 'payed')){
	    	var style = this.props.style;
				var video = lesson.video;
	    		if(video && video.vid) {
			    	this.setState({
			    		isPlaying: true
			    	}, function(){
						try {
							var pl = polyvObject('#playerplaceholder').videoPlayer(
											    	{
														'width': style.width,
														'height': style.height,
														'vid': video.vid,
													    'ts': '' + video.ts || '',
														'sign': video.sign || '',
														'flashvars':
														assign(
															{
																'autoplay': '0'
															},
														    video.start ? {'watchStartTime': '' + video.start } : {},
														    video.end ? {'watchEndTime': '' + video.end } : {}
													    )
												    }
											    );
							pl.s2j_onPlayStart = function(){
						    	this._play_online();
							}.bind(this);
							pl.s2j_onVideoPause = function(){
						    	this.setState({
						    		isShowAd: true
						    	});
							}.bind(this);
							pl.s2j_onVideoPlay = function(){
						    	this.setState({
						    		isShowAd: false
						    	});
							}.bind(this);

							this.setState({
								onlineVplayer: pl
							}, function(){
							});
						} catch(ex) {

						}
			    	});
				}
    	}
    },
    _init_product_player: function(){
    	var lesson = this.props.lesson;
    	console.log('lesson.video',lesson);
    	if(lesson.type === 'online_info' || (lesson.type === 'live_info' && lesson.live_status === 'ended')){
	    	var style = this.props.style;
				var video = lesson.video;
	    		if(video && video.vid) {
			    	this.setState({
			    		isPlaying: true
			    	}, function(){
						try {
							var pl = polyvObject('#playerplaceholder').videoPlayer(
											    	{
														'width': style.width,
														'height': style.height,
														'vid': video.vid,
													    'ts': '' + video.ts || '',
														'sign': video.sign || '',
														'flashvars':
														assign(
															{
																'autoplay': '0'
															},


														    video.start ? {'watchStartTime': '' + video.start } : {},
														    video.end ? {'watchEndTime': '' + video.end } : {}
													    )
												    }
											    );
							pl.s2j_onPlayStart = function(){
						    	this._play_online();
							}.bind(this);
							pl.s2j_onPlayOver = function(){
						    	this._play_onlineOver();
								CoursesStore.emit(Events.ON_PLAYOVER_DONE,lesson);
							}.bind(this);
							pl.s2j_onVideoPause = function(){
						    	this.setState({
						    		isShowAd: true
						    	});
							}.bind(this);
							pl.s2j_onVideoPlay = function(){
						    	this.setState({
						    		isShowAd: false
						    	});
							}.bind(this);

							this.setState({
								onlineVplayer: pl
							}, function(){
							});
						} catch(ex) {

						}
			    	});
				}
    	}
    },
    _play_live: function(){
    	var lesson = this.props.lesson;
    	var user  = this.props.user;
    	var video = lesson.video;
    	var url = URL.parse(dm.getUrl_home('/html/live.html'), true);
    	if (user) {
	        url.search = '?'+querystring.stringify(assign({}, {
	            lessonId: lesson.id,
	            authcode: video.authcode,
	            vid: video.vid,
	            start: video.start,
	            end: video.end,
	            currentPath: location.pathname,
	            uname: (user.accountId || '' )+ (user.name || ''),
                uid: Date.now()
	        }));
	        window.location = URL.format(url);
    	}
    },
    _play_online: function(){
    	Dispatcher.dispatch({actionType: CoursesStore.ActionTypes.ADD_JOIN,
	    	lesson: this.props.lesson,
	    	productId: this.props.productId,
	    	levelId: this.props.levelId,
	    	joinStatus: '1'
	    });
    },
    _play_onlineOver: function(){
    	Dispatcher.dispatch({actionType: CoursesStore.ActionTypes.ADD_JOIN,
	    	lesson: this.props.lesson,
	    	productId: this.props.productId,
	    	levelId: this.props.levelId,
	    	joinStatus: '2'
	    });
    },
    makeMask_sub_play: function(){
    	var lesson = this.props.lesson;
    	var video = lesson.video;
    	switch (lesson.type) {
	        case 'live_info':
	            return (
		    		<div className="mask-full">
			    		<div className="row center-middle">
			    			<div className="col-xs-offset-4 col-xs-4">
				    			<div className="fa fa-4x fa-play" onClick={this._play_live}></div>
			    			</div>
			    		</div>
					</div>
				);
	        case 'online_info':
	        	return '';
	    }
    },
    makeMask_live_info: function() {
    	var lesson = this.props.lesson;
    	switch(lesson.live_status) {
    		case 'not_started':
    			// !!!暂时在购买功能开始前屏蔽非付费会员
    			if(!lesson.isReserved && !lesson.isFree && lesson.authority !== 'payed'){
    				return this.makeMask_sub_order();
    			}
    			// !!!---end
    			if(!lesson.isReserved){
	    			return this.makeMask_sub_live_info_reserve();
	    		}
	    		if(lesson.isFree || lesson.authority === 'payed'){
			    	return this.makeMask_sub_live_info_already_reserved();
		    	}
		    	return this.makeMask_sub_order();
    		case 'start_soon':
    		case 'on_air':
    			if(lesson.isFree || lesson.authority === 'payed'){
	    			return this.makeMask_sub_play();
		    	}
		    	return this.makeMask_sub_order();
			case 'ended':
				if(lesson.isFree || lesson.authority === 'payed'){
			    	return '';
		    	}
		    	return this.makeMask_sub_order();
    	}
    },
    makeMask_online_info: function() {
    	var lesson = this.props.lesson;
    	var ispdplayer =this.props.ispdplayer;
    	if (ispdplayer) {
    		return this.makeMask_sub_product();
    	}
    	if(lesson.isFree){
    		return this.makeMask_sub_play();
    	}
    	switch(lesson.authority){
    		case 'payed':
    			return this.makeMask_sub_play();
			default: return this.makeMask_sub_order();
	    }
    },
    makeMask_offline_info: function() {
    	var lesson = this.props.lesson;
    	var start_date = lesson && lesson.start_time ? new Date(lesson.start_time).format(patterns.LDATE) : '';
	    var start_time = lesson && lesson.start_time ? new Date(lesson.start_time).format(patterns.TIME) : '';
	    var end_time = lesson && lesson.end_time ? new Date(lesson.end_time).format(patterns.TIME) : '';
	    var address = lesson.city && lesson.city.site ? lesson.city.site : '';
    	if (lesson.isExpired) {
    		return (
    			<div className="mask-half">
					<div className="col-xs-8 txt-info">
						<div className="row">{start_date}{start_time}~{end_time}</div>
						<div className="row">{address}</div>
					</div>
					<div className="col-xs-4 right-btn">
		    			<div className="btn btn-warning">已举办</div>
	    			</div>
				</div>
			);
    	}
    	var p = (
    		<div className="mask-half">
				<div className="col-xs-8 txt-info">
					<div className="row">{start_date}{start_time}~{end_time}</div>
					<div className="row">{address}</div>
				</div>
				<div className="col-xs-4 right-btn">
	    			<button className="btn btn-primary" onClick={this._onGET_ENROLL}>我要报名</button>
				</div>
			</div>
		);
    	switch(lesson.authority){
    		case 'payed':
    		case 'enrolled':
	    		return (
	    			<div className="mask-half">
		    			<div className="col-xs-8 txt-info">
		    				<div className="row">{start_date}{start_time}~{end_time}</div>
		    				<div className="row">{address}</div>
		    			</div>
		    			<div className="col-xs-4 right-btn">
			    			<div className="btn btn-success">已报名</div>
		    			</div>
					</div>
    			);
	    	default:
	    		return p;
    	}
    },
	render: function(){
		var lesson = this.props.lesson;
		var style = this.props.style;
		var img = <div id="playerplaceholder" className="playerplaceholder" style={style}/>;
		var mask = '';
		if(!this.state.isPlaying) {
			switch ( lesson.type ){
				case 'live_info': mask = this.makeMask_live_info(); break;
				case 'offline_info': mask = this.makeMask_offline_info(); break;
				case 'online_info': mask = this.makeMask_online_info(); break;
				default : mask = this.makeMask_online_info();
			}
			img = <img src={lesson.brief_image || url_nophoto} style={style}/>;
		}
		var ad_style = {
			height: style.height * 0.7,
			width: style.width * 0.7,
			top: style.height * 0.15 + 52,
			left: style.width * 0.15
		};
		var ad = this.state.isShowAd ?
			(<div className="player-Ad" style={ad_style}>
				<img src={this.props.ad.img} style={ad_style}/>
			</div>)
			: '';
		return (
			<div style={style}>
				<div className="player" style={style}>
					{img}
					{mask}
				</div>
				{/*ad*/}
			</div>
		);
	}
});
module.exports = CRSPanelDetail_PrePlay;
