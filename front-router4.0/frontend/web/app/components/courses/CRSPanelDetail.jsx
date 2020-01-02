var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var assign = require('object-assign');
var cx = require('classnames');
var util =  require('util'),
    f = util.format;
var CoursesStore = require('../../stores/CoursesStore');
var ActionTypes = CoursesStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var PAddress = require('./CRSPanelDetail_Address.jsx');
var PTeachers = require('./CRSPanelDetail_Teachers.jsx');
var PBrief = require('./CRSPanelDetail_Brief.jsx');
var PAssociation = require('./CRSPanelDetail_Association.jsx');
var PSectNav = require('./CRSPanelDetail_SectNav.jsx');
var Psc_refer = require('./CRSPanelDetail_sc_refer.jsx');
var Psc_chapters = require('./CRSPanelDetail_sc_chapters.jsx');
var Pd_product = require('./CRSPanelDetail_Product.jsx');
var Pd_product_course = require('./CRSPanelDetail_Product_course.jsx');
var PPrePlay = require('./CRSPanelDetail_PrePlay.jsx');
// var PanelOrder = require('./CRSPanelOrder.jsx');

var onlineVplayer;

function getDim_player(){
	return ({
		width: document.body.clientWidth * 0.98,
		height: document.body.clientWidth * 0.98 * 0.62
	});
}

function makeOnlineVplayer(lesson, dim_vdplayer){
	if(lesson.video) { 
		var video = lesson.video;
		if(lesson.type === 'online_info' && !onlineVplayer) {
			var vid = assign({}, lesson.video, dim_vdplayer);
			var width = document.body.clientWidth;
		    onlineVplayer = polyvObject('#onlineVplayer').videoPlayer(
		    	assign(
			    	{
				     'width': dim_vdplayer.width,
				     'height': dim_vdplayer.height,
				     'vid': video.vid,
				     'start': video.start || 0,
				     'end': video.end
				    }, 
				    video.start ? {'start': video.start} : {}, 
				    video.end ? {'end': video.end} : {}
			    )
		    );
		    return {__html: ''};
		}
	}
}

function makeLiveVplayer(video, dim_vdplayer) {
	// var dim_d = {
	// 	width: document.body.clientWidth,
	// 	height: document.body.clientWidth * 0.62 * 0.8
	// };
	// var dim_v = {
	// 	width: document.body.clientWidth,
	// 	height: document.body.clientWidth * 0.62 * 0.2
	// };
	return (
		<div style={dim_vdplayer}>
			{/*<div className="live_doc_player" style={dim_d} dangerouslySetInnerHTML={
				{
					__html: f(
						'<gs:doc site="linked-f.gensee.com" ctx="webcast" ownerid="e528ec1aae0c416eadc5391ead51056f" authcode="333333" " authcode="333333" uid="123456789" uname="testlinkedf" lang="zh_CN" bar="true"/>',
						''
					)
				}
			}/>*/}
			<div className="live_v_player" style={dim_vdplayer} dangerouslySetInnerHTML={
				{
					__html: f(
						'<gs:video-live  site="linked-f.gensee.com" ctx="webcast" ownerid="e528ec1aae0c416eadc5391ead51056f" authcode="333333" uid="123456789" uname="testlinkedf" lang="zh_CN" bar="true"/>',
						''
					)
				}
			}/>
		</div>
	);

}

function show_sc_this(lesson){
	var p = [];
	var teachers = '';
	if(lesson.teachers) {
		teachers = <PTeachers key="teachers" teachers={lesson.teachers}/>;
		p.push(teachers);
	}
	var brief = '';
	if(lesson.brief) {
		brief = <PBrief key="brief" brief={lesson.brief}/>;
		p.push(brief);
	}
	var association = '';
	if(lesson.associations) {
		association = <PAssociation key="association" associations={lesson.associations}/>;
		p.push(association);
	}
	var address = '';
	if(lesson.city && lesson.city.map_x && lesson.city.map_y) {
		address = <PAddress key="address" city={lesson.city}/>;
		p.push(address);
	}
	return p;
}

function show_sc_refer(lesson){
	var p = <Psc_refer ref_lessons={lesson.lessonList}/>;
	return p;
}

function show_sc_chapters(lesson){
	var p = <Psc_chapters chapters={lesson.online_catalog}/>;
	return p;
}

var CRSPanelDetail = React.createClass({
	propTypes:{
		lesson: PropTypes.object,
		user: PropTypes.object,
		isProduct_Course: PropTypes.bool,
		Product_Course:PropTypes.array,
		isProduct: PropTypes.bool,
		levelId: PropTypes.any,
		productId: PropTypes.any,
		resourceId: PropTypes.any,
		catelogId: PropTypes.any
	},
	getInitialState: function(){
        return  {
        	// lesson: this.props.lesson,
        	// order: null,
        	ProductItem: this.props.lesson,
        	sect_active: CoursesStore.DetailSects.sc_this,
        	liveVplayer: null,
        	// onlineVplayer: null,
        	currentPanel: 'CRSPanelDetail'
        };
    },
    _onTOGGLE_COLLECT: function(e){
    	var lesson = this.props.lesson;
    	Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.TOGGLE_COLLECT,
            lession: lesson,
            isCollected: lesson.isCollected
        });
    },
    // _onGET_ORDER: function(e) {
    //     Dispatcher.dispatch({
    //         actionType: CoursesStore.ActionTypes.GET_ORDER,
    //         lesson: this.props.lesson
    //     });
    // },
    _onGET_RESOURCE_CODE: function(e) {
        Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.GET_RESOURCE_CODE
        });
    },
    _onPlay_live_video: function(e) {
		var dim_vdplayer = {
			width: document.body.clientWidth,
			height: document.body.clientWidth * 0.62
		};
		this.setState({
			liveVplayer: makeLiveVplayer(this.props.lesson, dim_vdplayer)
		});
    },
    _onPlay_online_video: function(e) {
    	makeOnlineVplayer(this.props.lesson, getDim_player());
    },
    _handleDETAIL_SECT_CHANGED: function(re){
    	this.setState({
    		sect_active: re.active
    	});
    },
    _onClickBylastViewProductVideo:function(e){
    	var user  = this.props.user;
    	var lesson =this.props.lesson;
    	if(user && user.isBinded){
    		if (lesson && lesson.authority === 'payed') {
    			Dispatcher.dispatch({
		            actionType: ActionTypes.LASTVIEWPRODUCTLESSON,
		            productId: lesson.id
		        });
    		}else {
	            Dispatcher.dispatch({
	                actionType: ActionTypes.GET_ORDER,
	                product: lesson
	            });
	        }
    	}else{
    		Dispatcher.dispatch({
	            actionType: ActionTypes.GET_LOGIN,
	            lesson: lesson
	        });
    	}
    	
    },
    _handleauthority: function(re){
    	alert('如果您对本课程感兴趣，请至网站或微信进行购买。');
    },
    _handlePRODUCT_CHANGE_CHAPTER_DONE:function(re){
    	var Productdate= re && re.Productdate ? re.Productdate : '';
    	var ispaly= re && re.idx_num ? re.idx_num : '';
    	var chapter_num =re && re.chapter_num ? re.chapter_num :'';
    	var lesson = assign({}, Productdate, {
            video: re.chapter.video,
            isFree: re.chapter.isFree ? re.chapter.isFree : false
        });
        this.setState({
            ProductItem: lesson,
            IsPlay: ispaly,
            IsPlayId: lesson.id,
            Chapter_Num: chapter_num
        });
    },
    _handlePRODUCT_TOGGLE_COLLECT_DONE: function(re){
        var detail = this.state.ProductItem;
        detail.isCollected = re.isCollected;
        this.setState({
            detail: detail
        });
    },
    _onGET_COUPON: function(e) {
        Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.GET_COUPON,
            resource_type: 7
        });
    },
    componentDidMount: function() {
    	CoursesStore.addEventListener(CoursesStore.Events.DETAIL_SECT_CHANGED, this._handleDETAIL_SECT_CHANGED);
    	CoursesStore.addEventListener(CoursesStore.Events.PRODUCT_CHANGE_CHAPTER_DONE, this._handlePRODUCT_CHANGE_CHAPTER_DONE);
    	CoursesStore.addEventListener(CoursesStore.Events.PRODUCT_TOGGLE_COLLECT_DONE, this._handlePRODUCT_TOGGLE_COLLECT_DONE);
    },
    componentWillUnmount: function() {

    	CoursesStore.removeEventListener(CoursesStore.Events.DETAIL_SECT_CHANGED, this._handleDETAIL_SECT_CHANGED);
    	CoursesStore.removeEventListener(CoursesStore.Events.PRODUCT_CHANGE_CHAPTER_DONE, this._handlePRODUCT_CHANGE_CHAPTER_DONE);
		CoursesStore.removeEventListener(CoursesStore.Events.PRODUCT_TOGGLE_COLLECT_DONE, this._handlePRODUCT_TOGGLE_COLLECT_DONE);
    },
    _showProduct: function(){//Dennis
    	var lesson = this.props.lesson;
		// var cls_stared = cx('col-xs-6', 'fa', lesson.isCollected ? 'fa-star' : 'fa-star-o');
		var authority;
		var couponButtonCss = 'btn btn-primary product_study_button';
		var coupobPriceCss = 'product_price';
		var couponNewPriceCss = 'product_newProducnt';
		var isPayed;
		if (isWeiXin) {
			if (lesson && lesson.authority === 'ready') {
				couponButtonCss = 'btn btn-primary product_study_button_coupon';
				coupobPriceCss = 'product_price_coupon';
				couponNewPriceCss = 'product_newProducnt_coupon';
				isPayed = 'Payed';
			}else{
				couponButtonCss = 'btn btn-primary product_study_button';
				coupobPriceCss = 'product_price';
				couponNewPriceCss = 'product_newProducnt';
				isPayed = '';
			}
		}
		if (!isWeiXin) {
			if (lesson && lesson.authority === 'ready') {
				authority = 'payed';
			}else{
				authority = '';
			}
		}
		var p_product = '';
		var p_product_course = '';
    	var dim_vdplayer = getDim_player();
		var vplayer = (<PPrePlay style={dim_vdplayer} lesson={this.state.ProductItem ? this.state.ProductItem : ''} 
			user={this.props.user} productId={this.props.productId} levelId={this.props.levelId} ispdplayer={true} />);
			p_product_course =(
				<div className="panel product_panel product_course_panel">
					<div className="panel panel-body crs-title">
		                    <span className="col-xs-10 colL txt product_detail_title">{lesson && lesson.title ? lesson.title : ''}</span>
		                    <span className="col-xs-12 colL txt">
			                    <span className="product_oldProduct">￥{lesson && lesson.price_old ? lesson.price_old :''}</span>
			                    {
									isPayed ?  <button onClick={this._onGET_COUPON} className={couponButtonCss}>使用体验券</button> : ''
			                    }
			                    {
			                    	authority ? <button type="button" className="btn btn-primary product_study_button" onClick={this._handleauthority}>开始学习</button> :
			                    	<button type="button" className={couponButtonCss} onClick={this._onClickBylastViewProductVideo}>开始学习</button>
			                    }
			                    <span className={coupobPriceCss}>专题价:<span className={couponNewPriceCss}>￥{lesson && lesson.price ? lesson.price :''}</span></span>
		                    </span>
						</div>
					<Pd_product_course productCourse={this.props.Product_Course} resourceId={this.props.resourceId}
						catelogId={this.props.catelogId} IsPlay={this.state.IsPlay} IsPlayId={this.state.IsPlayId}
						product_lesson={lesson} user={this.props.user} Chapter_Num={this.state.Chapter_Num}/>
				</div>
			);
			p_product = (
				<div className="panel">
						<div className="panel panel-body crs-title">
		                    <span className="col-xs-10 colL txt product_detail_title">{lesson && lesson.title ? lesson.title : ''}</span>
		                    <span className="col-xs-12 colL txt">
			                    <span className="product_oldProduct">￥{lesson && lesson.price_old ? lesson.price_old :''}</span>
			                    { isPayed ? <button onClick={this._onGET_COUPON} className={couponButtonCss}>使用体验券</button> : ''}
   			                    {
			                    	authority ? <button type="button" className={couponButtonCss} onClick={this._handleauthority}>开始学习</button> :
			                    	<button type="button" className={couponButtonCss} onClick={this._onClickBylastViewProductVideo}>开始学习</button>
			                    }
			                    <span className={coupobPriceCss}>专题价:<span className={couponNewPriceCss}>￥{lesson && lesson.price ? lesson.price :''}</span></span>
		                    </span>
						</div>
					<Pd_product product={lesson && lesson.level ? lesson.level :''} lesson_product={lesson} productId={lesson && lesson.id ? lesson.id:''}/>
				</div>
			);
		return (
			<div className="crs-detail">
				<div className="top-part"> 
					{vplayer}
					{this.props.isProduct ? p_product_course : p_product}
				</div>
			</div>
		);
    },
    _showLesson: function(){
    	var lesson = this.props.lesson;

		var cls_stared = cx('col-xs-6', 'fa', lesson.isCollected ? 'fa-star' : 'fa-star-o');
		
		var p_active = '';
		switch(this.state.sect_active) {
			case CoursesStore.DetailSects.sc_this: p_active = show_sc_this(lesson); break;
			case CoursesStore.DetailSects.sc_refer: p_active = show_sc_refer(lesson); break;
			case CoursesStore.DetailSects.sc_chapters: p_active = show_sc_chapters(lesson); break;
		}
    	var dim_vdplayer = getDim_player();
		var vplayer = (<PPrePlay style={dim_vdplayer} lesson={lesson} user={this.props.user}/>);
		// switch(lesson.type) {
		// 	case 'live_info': vplayer = (<div onClick={this._onPlay_live_video} id="liveVplayer" className="player" style={dim_vdplayer}>{makeLiveVplayer(this.props.lesson, dim_vdplayer)}</div>); break;
		// 	case 'online_info': vplayer = (<div onClick={this._onPlay_online_video} id="onlineVplayer" className="player" style={dim_vdplayer} ></div>); break;
		// }
		return (
			<div className="crs-detail">
				<div className="top-part"> 
					{vplayer}
					<div className="panel titlebar">
						<div className="panel-body crs-title">
		                    <span className="col-xs-10 colL txt">{lesson.title}</span>
		                    <div className="social col-xs-2 colR">
		                    	{/*<span className="col-xs-6 fa fa-share-square-o"></span>*/}
		                    	<span className={cls_stared} onClick={this._onTOGGLE_COLLECT}></span>
		                    </div>
						</div>
					</div>
					<PSectNav active={this.state.sect_active} lesson={lesson}/>
				</div>
				<div className="bottom-part">
					{p_active}
				</div>
			</div>
		);
    },
	render: function(){
		var p = '';
		var pd = '';
		p ='';
		pd =this._showProduct();
		return (
			<div>
			{this.props.isProduct_Course ? pd : this._showLesson()}
			</div>
		);
	}
});
module.exports = CRSPanelDetail;

