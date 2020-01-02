var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var assign = require('object-assign');
var cx = require('classnames');
var util = require('util'),
    f = util.format;
var dm = require('./util/DmURL.js');
var Dispatcher = require('./dispatcher/AppDispatcher.js');
require('./util/PgSetup.js')(React);
var CoursesStore = require('./stores/CoursesStore.js');
var WapStore = require('./stores/WapStore.js');
var MeStore = require('./stores/MeStore.js');
var AuthStore = require('./stores/AuthStore.js')(Dispatcher);
var querystring = require('querystring');
var scrollHelper = require('./components/scrollHelper.js');
//pg location
var urlquery = dm.getCurrentUrlQuery();

var CourseTypes = CoursesStore.CourseTypes;
var courseType = urlquery.courseType || CourseTypes.online_info;
var url_logo = 'http://mb.bolue.cn/img/logo.jpg';


var WEBPanelfooter = require('./components/wap/WABPanelfooter.jsx');
var WABSearchBar =require('./components/wap/WABSearchBar.jsx')(Dispatcher,WapStore);
//Components
// var PLoadingMask = require('./components/PanelLoadingMask.jsx');
var SearchBar = require('./components/SearchBar.jsx')(Dispatcher, CoursesStore);
var DownloadApp = require('./components/DownloadApp.jsx');
var STLContainer = require('./components/STLContianer.jsx')(Dispatcher);
var Container = require('./components/Contianer.jsx');
var CRSPanelSuggest = require('./components/courses/CRSPanelSuggest.jsx');
var CRSPanelSearchResult = require('./components/courses/CRSPanelSearchResult.jsx');
var CRSPanelUseCoupon = require('./components/courses/CRSPanelUseCoupon.jsx');
var CRSPanelDetail = require('./components/courses/CRSPanelDetail.jsx');
var CRSPanelOrder = require('./components/courses/CRSPanelOrder.jsx');
var CRSPanelReserve = require('./components/courses/CRSPanelReserve.jsx');
var CRSPanelEnroll = require('./components/courses/CRSPanelEnroll.jsx');
var CRSPanelResourceCode = require('./components/courses/CRSPanelResourceCode.jsx');
var CRSPanelResourceCode_Redeem = require('./components/courses/CRSPanelResourceCode_Redeem.jsx');
var MEPanelRegister = isWeiXin ? require('./components/me/MEPanelRegister.jsx')(Dispatcher, MeStore) : require('./components/wap/WAPPanelRegister.jsx')(Dispatcher,WapStore);
//logic objects
var act_GET_LATEST = '';
var title = '';

var share_info = {};

var a_live_info;
var a_online_info;
var a_offline_info;
var a_product;
var pcurrentPanel = '';

function init(){
	switch(courseType) {
        case CourseTypes.offline_info: 
            title = '线下课'; 
            share_info.desc = ' 铂略现场公开课，微信一键直约报名，赶紧行动! ';
            share_info.imgUrl = dm.getUrl_home('/img/offline_info_s.png');
            a_offline_info = 'offline_info'; 
            break;
        case CourseTypes.live_info: 
            title = '直播课'; 
            share_info.desc = ' 铂略每日财税课程直播，覆盖企业众多财税问题，可免费体验哦! ';
            share_info.imgUrl = dm.getUrl_home('/img/live_info_s.png');
            a_live_info = 'live_info';
            break;
        case CourseTypes.online_info: 
            title = '视频课'; 
            share_info.desc = ' 铂略碎片化体系财税课程，微信端全新体验，猛戳进入! ';
            share_info.imgUrl = dm.getUrl_home('/img/online_info_s.png');
            a_online_info = 'online_info';
            break;
        case CourseTypes.product: 
            title = '专题课'; 
            share_info.desc = ' 铂略碎片化体系财税课程，微信端全新体验，猛戳进入! ';
            share_info.imgUrl = dm.getUrl_home('/img/online_info_s.png');
            a_product = 'product';
            break;
        default: courseType = CourseTypes.online_info; init(); return;
	}
	document.title = title;
}

init();

var last_scrollTop_latests = 0;
var last_scrollTop_searchresults = 0;
var last_scrollTop_detail = 0;
var last_scrollTop_product_detail = 0;
var lastlocation = '';
var cbFromSC401;
var logoMenu = (
    <div role="presentation" className="nav-brand col-xs-2 col-sm-2 dropdown">
        <i alt="铂略" className="dropdown-toggle fa fa-list-ul fa-2x" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"/>
        {/*<img alt="铂略" src="../img/menu.png" height="32" width="32" className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"/>*/}
        <ul className="dropdown-menu" style={{width: '10%'}}>
            {
                a_live_info ? 
                <li><img className="dropdown_menu_img" src="../img/icon_03.png" height="18" width="25" /><a className="dropdown-menu_a dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=live_inf">直播课</a></li>
                : <li> <img className="dropdown_menu_img" src="../img/icon_13.png" height="18" width="25" /><a className="dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=live_info">直播课</a></li>
            }
            {
                a_online_info ?
                <li className="li_border"><img className="dropdown_menu_img" src="../img/icon_16.png" height="18" width="25" /><a className="dropdown-menu_a dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=online_info">视频课</a></li>
                : <li className="li_border"><img className="dropdown_menu_img" src="../img/icon_06.png" height="18" width="25" /><a className="dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=online_info">视频课</a></li>
            }
            {
                a_offline_info ?
                <li><img className="dropdown_menu_img" src="../img/icon_08.png" height="18" width="25" /><a className="dropdown-menu_a dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=offline_info">线下课</a></li>
                : <li><img className="dropdown_menu_img" src="../img/icon_18.png" height="18" width="25" /><a className="dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=offline_info">线下课</a></li>

            }
            {
                a_product ?
                <li className="li_border"><img className="dropdown_menu_img" src="../img/icon_16.png" height="18" width="25" /><a className="dropdown-menu_a dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=product">专题课</a></li>
                : <li className="li_border"><img className="dropdown_menu_img" src="../img/icon_06.png" height="18" width="25" /><a className="dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=product">专题课</a></li>
            }
        </ul>
    </div>
);

var logohHome = (
    <div role="presentation" className="nav-brand col-xs-2 col-sm-1 dropdown">
        <a href="./index.html?currentPg=Pg_web_index">
            <img className="dropdown_menu_img" src="../img/web_home.png" height="30" width="30"/>
        </a>
    </div>
);

var wx_config_share_home = {
    title: '铂略资询 - ' + title,
    desc: share_info.desc,
    link: document.location.href + '',
    imgUrl: share_info.imgUrl,
    type: 'link'
};

var wx_config_share_detail = null;

function doGET_LATEST(){
    Dispatcher.dispatch({
        actionType: CoursesStore.ActionTypes.GET_LATEST,
        type: courseType
    });
}

var lastPanel = '';
var Pg_courses_index = React.createClass({
	getInitialState: function() {
        return ({
            nonceIframe: '',
            msg: '',
            backFromRegCB: null, // callback when register/bind done
            isMaskPg: false,
            isShowSearchBarBGMask: false,
            latests: [],
            searchResults: [],
            searchResultsStatus: {
                isShowLoadingMark: false,
                isSwapUpLoadable: false,
                isShowNoMore: false
            },
            latestResultsStatus: {
                isShowLoadingMark: false,
                isSwapUpLoadable: false,
                isShowNoMore: false
            },
            detail: null,
            user: null,
            order: null,
            discounts: [],
            reserve: null,
            currentPanel: 'CRSPanelSuggest',
            keyWords: null,
            isProduct: false,
            product: null
        });
    },
	propTypes: {
	},
    setTitle: function(title) {
        document.title = title;
        var $iframe = (<iframe key={'nonceIframe' + Date.now()} style={{display: 'none'}} src="../img/favicon/favicon.ico"></iframe>);
        this.setState({
            nonceIframe: $iframe
        });
    },
    _decideSwapable: function(re){
        var isSwapUpLoadable = true;
        if (re && re.results && re.results.length < CoursesStore.LIMIT){
            isSwapUpLoadable = false;
        }
        return isSwapUpLoadable;
    },
    _handleSEARCH_DONE: function(re){
        var isSwapUpLoadable = this._decideSwapable(re);
        last_scrollTop_searchresults = 0;
        this.setState({
            searchResultsStatus: {
                isSwapUpLoadable: isSwapUpLoadable,
                isShowNoMore: !isSwapUpLoadable,
                isShowLoadingMark: false
            },
            keyWords: re.keyWords,
            searchResults: re.results,
            currentPanel: 'CRSPanelSearchResult'
        });
        if(window.location.hash.indexOf('CRSPanelSearchResult') === -1 ) { window.location.hash = 'CRSPanelSearchResult'; }
    },
    _handleSEARCH_MORE_START: function(re){
        this.setState({
            searchResultsStatus: {
                isShowLoadingMark: true,
                isSwapUpLoadable: false,
                isShowNoMore: false
            }
            // currentPanel: 'CRSPanelSearchResult'
        });
    },
    _handleSEARCH_MORE_DONE: function(re){
        var isSwapUpLoadable = this._decideSwapable(re);
        var searchResults = this.state.searchResults.concat(re.results);
        this.setState({
            searchResultsStatus: {
                isSwapUpLoadable: isSwapUpLoadable,
                isShowNoMore: !isSwapUpLoadable,
                isShowLoadingMark: false
            },
            searchResults: searchResults
        });
    },
    _handleGET_LATEST_DONE: function(re){
        var isSwapUpLoadable = this._decideSwapable(re);
        last_scrollTop_latests = 0;
        this.setState({
            latestResultsStatus: {
                isSwapUpLoadable: isSwapUpLoadable,
                isShowNoMore: !isSwapUpLoadable,
                isShowLoadingMark: false
            },
            latests: re.results,
            currentPanel: 'CRSPanelSuggest'
        });
        // Dispatcher.dispatch({
        //     actionType: AuthStore.ActionTypes.WX_JS_CONFIG,
        //     onMenuShareAppMessage: wx_config_share_home
        // });
    },
    _handleGET_LATEST_MORE_START: function(re){
        this.setState({
            latestResultsStatus: {
                isShowLoadingMark: true,
                isSwapUpLoadable: false,
                isShowNoMore: false
            }
            // currentPanel: 'CRSPanelSearchResult'
        });
    },
    _handleGET_LATEST_MORE_DONE: function(re){
        var isSwapUpLoadable = this._decideSwapable(re);
        var latests = this.state.latests.concat(re.results);
        this.setState({
            latestResultsStatus: {
                isSwapUpLoadable: isSwapUpLoadable,
                isShowNoMore: !isSwapUpLoadable,
                isShowLoadingMark: false
            },
            latests: latests
        });
    },

    _handleGET_DETAIL_DONE: function(re){
        var lesson = re.result;
        var user = re.user;
        last_scrollTop_detail = 0;
        this.setState({
            detail: lesson,
            user: user,
            currentPanel: 'CRSPanelDetail'
        }, function(){
            Dispatcher.dispatch({
                actionType: CoursesStore.ActionTypes.DETAIL_SECT_CLICKED,
                active: CoursesStore.DetailSects.sc_this
            });
        });
        var phash = 'CRSPanelDetail' + '-' + re.result.id;
        if(window.location.hash.indexOf(phash) === -1) { window.location.hash = phash; }
        wx_config_share_detail = {
            title: lesson.title,
            desc: lesson.brief,
            link: document.location.href,
            imgUrl: lesson.brief_image,
            type: 'link'
            // ,
            // success: function(res) {
            //     alert(JSON.stringify(res));
            // },
            // cancel: function(res) {
            //     alert(JSON.stringify(res));
            // },
            // fail: function(res) {
            //     alert(JSON.stringify(res));
            // },
            // complete: function(res) {
            //     alert(JSON.stringify(res));
            // },
            // trigger: function(res) {
            //     alert(JSON.stringify(res));
            // }
        };
        Dispatcher.dispatch({
            actionType: AuthStore.ActionTypes.WX_JS_CONFIG,
            onMenuShareAppMessage: wx_config_share_detail
        });
    },
    _handlePRODUCT_DONE: function(re){//Dennis
        var lesson = re.result;
        var user = re.user;
        last_scrollTop_detail = 0;
        this.setState({
            product: lesson,
            user: user,
            currentPanel: 'CRSPanelProductLevelList'
        }, function(){
            // Dispatcher.dispatch({
            //     actionType: CoursesStore.ActionTypes.DETAIL_SECT_CLICKED,
            //     active: CoursesStore.DetailSects.sc_this
            // });
        });
        var phash = 'CRSPanelProductLevelList' + '-' + re.result.id;
        if(window.location.hash.indexOf(phash) === -1) { window.location.hash = phash; }
        wx_config_share_detail = {
            title: lesson.title,
            desc: lesson.brief,
            link: document.location.href,
            imgUrl: lesson.brief_image,
            type: 'link'
        };
        Dispatcher.dispatch({
            actionType: AuthStore.ActionTypes.WX_JS_CONFIG,
            onMenuShareAppMessage: wx_config_share_detail
        });
    },
    _handlePRODUCT_DETAIL_DONE: function(re){
        // console.log('tztwph',re);
        var lesson = re.result;
        var user = re.user;
        var productId = re.productId;
        var levelId = re.levelId;
        var Product = re.Product;
        var product_course = re.result.lesson;
        var resourceId = re && re.resourceId ? re.resourceId :'';
        var catelogId = re && re.catelogId ? re.catelogId :'';
        last_scrollTop_product_detail = 0;
        this.setState({
            detail: lesson,
            user: user,
            currentPanel: 'CRSPanelProductLevelListDetail',
            product_course: product_course,
            isProduct: true,
            productId: productId,
            levelId: levelId,
            resourceId: resourceId,
            catelogId: catelogId
        }, function(){
            Dispatcher.dispatch({
                actionType: CoursesStore.ActionTypes.DETAIL_SECT_CLICKED,
                active: CoursesStore.DetailSects.sc_this
            });
        });
        if (product_course && resourceId && catelogId) {
            for (var i = 0; i < product_course.length; i++) {
                if (product_course[i].id === resourceId) {
                    var catalog = product_course[i].online_catalog;
                    var Productdate = product_course[i];
                    for (var j = 0; j < catalog.length; j++) {
                        if (catalog[j].catalog_id === catelogId) {
                             Dispatcher.dispatch({
                                actionType: CoursesStore.ActionTypes.PRODUCT_CHANGE_CHAPTER,
                                chapter: catalog[j],
                                Productdate: Productdate
                            });

                        }
                    }
                }
            }
        }
        var phash = 'CRSPanelProductLevelListDetail' + '-' + productId + '-' + levelId;
        if(window.location.hash.indexOf(phash) === -1) { window.location.hash = phash; }
    },
    _handleON_PLAYOVER_DONE: function(re){
        // console.log('_handleON_PLAYOVER_DONE',re);
        var lesson = re ? re : '';
        var video = lesson.video ? lesson.video : '';
        var catalogId = video.catalog_id ? video.catalog_id :'';
        var online_catalog = lesson.online_catalog ? lesson.online_catalog :'';
        // console.log('catalogId',catalogId);
        for (var i = 0; i < online_catalog.length; i++) {
            // console.log('online_catalog[i].catalog_id',online_catalog[i].catalog_id);
            if (catalogId && catalogId === online_catalog[i].catalog_id) {
                if (i < online_catalog.length) {
                    Dispatcher.dispatch({
                        actionType: CoursesStore.ActionTypes.PRODUCT_CHANGE_CHAPTER,
                        chapter: online_catalog[i+1],
                        Productdate: lesson
                    });
                }
            }
        }
    },

    _handleLASTVIEWPRODUCTLESSON_DONE:function(re){
        // console.log('lllllllllllllllllll',re);
        Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.PRODUCT_DETAIL,
            productId: re.result.product_id,
            levelId: re.result.level_id,
            resourceId: re.result.resource_id,
            catelogId: re.result.catalog_id
        });
    },
    _handleTOGGLE_COLLECT_DONE: function(re){
        var detail = this.state.detail;
        detail.isCollected = re.isCollected;
        this.setState({
            detail: detail
        });
    },
    _handleGETEXISTORDER_DONE:function(re){
        this.setState({
            currentPanel: 'CRSPanelOrder',
            order: re.result,
            product: re.product
        });
    },
    _handleGET_ORDER_DONE: function(re){
        this.setState({
            currentPanel: 'CRSPanelOrder',
            order: re.result
        });
        if(window.location.hash.indexOf('CRSPanelOrder') === -1) { window.location.hash = 'CRSPanelOrder'; }
    },
    _handleGET_RESOURCE_CODE_DONE: function(re){
        this.setState({
            currentPanel: 'CRSPanelResourceCode',
            discounts: re.result
        });
        if(window.location.hash.indexOf('CRSPanelResourceCode') === -1) { window.location.hash = 'CRSPanelResourceCode'; }
    },
    _handleGET_REDEEM_DONE: function(re){
        this.setState({
            currentPanel: 'CRSPanelResourceCode_Redeem'
        });
        if(window.location.hash.indexOf('CRSPanelResourceCode_Redeem') === -1) { window.location.hash = 'CRSPanelResourceCode_Redeem'; }
    },
    _handleREDEEM_DONE: function(re){
        if(re.discount){
            if(re.errorMsg){
                alert(re.errorMsg);
                Dispatcher.dispatch({
                    actionType: CoursesStore.ActionTypes.GET_RESOURCE_CODE,
                    courseType: courseType
                });
                return;
            }
            CoursesStore.emit(CoursesStore.Events.SELECT_RESOURCE_CODE_DONE, {
                discounts: [re.discount]
            });
        }
    },
    _handleADD_RESOURCE_CODE_DONE: function(re){
        this.setState({
            currentPanel: 'CRSPanelResourceCode',
            discounts: [re.result.added_code].concat(this.state.discounts)
        });
        // console.log('_handleADD_RESOURCE_CODE_DONE', re.result.added_code);
    },
    _handleSELECT_RESOURCE_CODE_DONE: function(re) {
        Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.GET_ORDER,
            product: this.state.product,
            lesson: this.state.lesson,
            discounts: re.discounts
        });
    },
    _handleGET_RESERVE_DONE: function(re){
        this.setState({
            currentPanel: 'CRSPanelReserve'
        });
        if(window.location.hash.indexOf('CRSPanelReserve') === -1) { window.location.hash = 'CRSPanelReserve'; }
    },
    _handleRESERVE_DONE: function(re){
        this.setState({
            detail: re.lesson,
            currentPanel: 'CRSPanelReserve'
        });
        
    },
    _handleGET_ENROLL_DONE: function(re){
        this.setState({
            currentPanel: 'CRSPanelEnroll'
        });
        if(window.location.hash.indexOf('CRSPanelEnroll') === -1) { window.location.hash = 'CRSPanelEnroll'; }
    },
    _handleENROLL_DONE: function(re){
        this.setState({
            detail: re.lesson,
            currentPanel: 'CRSPanelDetail'
        });
        // var phash = 'CRSPanelDetail' + '-' + re.lesson.id;
        // if(window.location.hash.indexOf(phash) === -1) { window.location.hash = phash; }
    },
    _handleONLINE_CHANGE_CHAPTER_DONE: function(re){
        var lesson = assign({}, this.state.detail, {
            video: re.chapter.video,
            isFree: re.chapter.isFree ? re.chapter.isFree : false
        });
        this.setState({
            detail: lesson
        });
    },
    _handleUNIFY_ORDER_DONE: function(re){
        var order = re.order;
        this.setState({
            order: order
        });
    },
    _handlePAY_DONE: function(re){
        var order = re.order;
        // console.log('order',order);
        if(order && order.items && order.items[0]){
            var item = order.items[0];
            if(item.type === 'product') {
                Dispatcher.dispatch({
                    actionType: CoursesStore.ActionTypes.PRODUCT,
                    id: item.lessonId,
                    type: item.type
                });
            } else {
                Dispatcher.dispatch({
                    actionType: CoursesStore.ActionTypes.GET_DETAIL,
                    id: item.lessonId,
                    type: item.type
                });
            }
        } else {
            window.history.back();
        }
    },
    // _handleREQUEST_START: function(re){
    //     this.setState({
    //         isMaskPg: true
    //     });
    // },
    // _handleREQUEST_END: function(re){
    //     this.setState({
    //         isMaskPg: false
    //     });
    // },
    _handleSC401: function(act){
        lastlocation = document.location.href;
        cbFromSC401 = function(){
            document.location = lastlocation;
            document.location.reload(true);
        };
        this.setState({
            currentPanel: 'MEPanelRegister'
        });
        if(window.location.hash.indexOf('MEPanelRegister') === -1 && isWeiXin) { window.location.hash = 'MEPanelRegister'; }
    },
    _handleBIND_DONE: function(re){
        if(re.user && re.user.isBinded){
            if(cbFromSC401) {
                cbFromSC401();
            } else {
                window.history.back();
            }
        }
    },
    _handleREGISTER_DONE: function(re){
        this._handleBIND_DONE(re);
    },
    _handleSERVER_ERROR: function(re){
        alert(re.err);
    },
    initData: function(){
        var init_hash = window.location.hash.replace('#', '');
        if(init_hash && init_hash.length > 0){//handle init load specified data
            var tks = init_hash.split('-');
            if(tks && tks.length > 0){
                switch(tks[0]){
                    case 'CRSPanelDetail': 
                        if(tks.length > 1){
                            Dispatcher.dispatch({
                                actionType: CoursesStore.ActionTypes.GET_DETAIL,
                                type: courseType,
                                id: tks[1]
                            });
                        }
                        break;
                    case 'CRSPanelProductLevelList': 
                    case 'CRSPanelProductLevelListDetail': 
                        if(tks.length > 1){
                            Dispatcher.dispatch({
                                actionType: CoursesStore.ActionTypes.PRODUCT,
                                type: courseType,
                                id: tks[1]
                            });

                        }
                        break;
                    case 'CRSPanelOrder':
                        if(tks.length > 1){
                            Dispatcher.dispatch({ 
                                actionType: CoursesStore.ActionTypes.GETEXISTORDER,
                                orderId: tks[1]
                            });
                        }
                        break;
                    case 'CRSPanelUseCoupon':
                        if(tks.length > 1){
                            Dispatcher.dispatch({ 
                                actionType: CoursesStore.ActionTypes.GET_COUPON,
                                resource_type: tks[1]
                            });
                        }
                        break;
                    default: doGET_LATEST();
                }
            }
        } else {
            doGET_LATEST();
        }
        Dispatcher.dispatch({
            actionType: AuthStore.ActionTypes.WX_JS_CONFIG,
            onMenuShareAppMessage: wx_config_share_home
        });
        
    },
    updateLatestsWithCurrentDetail: function(callback){
        var detail = this.state.detail;
        if(detail){
            this.state.latests.forEach( item => {
                if(item.id === detail.id){
                    item.isReserved = detail.isReserved;
                    item.live_status = detail.live_status;
                    return false;
                }
            });
            this.setState({
                latests: this.state.latests
            }, function(){
                callback();
            });
        }
    },
    updateSearchResultsWithCurrentDetail: function(callback){
        var detail = this.state.detail;
        if(detail){
            this.state.searchResults.forEach( item => {
                if(item.id === detail.id){
                    item.isReserved = detail.isReserved;
                    item.live_status = detail.live_status;
                    return false;
                }
            });
            this.setState({
                searchResults: this.state.searchResults
            }, function(){
                callback();
            });
        }
    },
    _search_on_focus: function(){
        this.setState({
            isShowSearchBarBGMask: true
        });
    },
    _search_on_blur: function(){
        this.setState({
            isShowSearchBarBGMask: false
        });
    },
    _onScroll: function(e) {
        var target = scrollHelper//e.target;
        // console.log(target.getScrollTop());
        switch(this.state.currentPanel){
            case 'CRSPanelSearchResult': last_scrollTop_searchresults = target.getScrollTop(); break;
            case 'CRSPanelSuggest': last_scrollTop_latests = target.getScrollTop(); break;
            case 'CRSPanelDetail': last_scrollTop_detail = target.getScrollTop(); break;
        }
    },
    _handleGET_COUPON_DONE: function(re){
        // console.log('_handleGET_COUPON_DONE',re);
        var discountList = re && re.discount.discountList ? re.discount.discountList : '';
        var resource_type = re && re.resource_type ? re.resource_type : '';
        this.setState({
            currentPanel: 'CRSPanelUseCoupon',
            discountList: discountList
        });
        // if(window.location.hash.indexOf('CRSPanelUseCoupon') === -1) { window.location.hash = 'CRSPanelUseCoupon'; }
        var detail = this.state.detail || '';
        var product = this.state.product || '';
        // console.log('detail',detail);
        // console.log('product',product);
        if (detail) {
            localStorage.setItem("resourceId", detail.id);
            // console.log('detail.id',detail.id);
        }if (product) {
            // console.log('asdfghjkl',product.id);
            localStorage.setItem("resourceId", product.id);
        }
        var phash = 'CRSPanelUseCoupon' + '-' + resource_type;
        if(window.location.hash.indexOf(phash) === -1) { window.location.hash = phash; }
    },
    _handleWEIXIN_ADD_COUPON_DONE: function(re){
        console.log('_handleWEIXIN_ADD_COUPON_DONE',re);
        if (re && re.discountList) {
            var discountList = re.discountList;
            console.log('discountList',discountList);
            this.setState({
                discountList: discountList
            });
            // var resource_type = discount.type;
            // Dispatcher.dispatch({
            //     actionType: CoursesStore.ActionTypes.GET_COUPON,
            //     resource_type: resource_type
            // });
        }
        if (re.err) {
            this.setState({
                addCouponErr:re.err
            });
        }else{
            this.setState({
                addCouponErr:''
            });
        }
    },
    _handleWEIXIN_USE_COUPON_DONE: function(re){
        // console.log('_handleWEIXIN_USE_COUPON_DONE',this.state.detail);
        if (re && re.isUsed && re.resource_type == 2) {
            console.log('wx_config_share_detail',wx_config_share_detail);
            if (wx_config_share_detail) {
                window.location.href=wx_config_share_detail.link;
                window.location.reload(true);
            }
            // window.location.reload();
         }else if (re && re.isUsed && re.resource_type == 1) {
            console.log('this.state.detail',this.state.detail);
            var detail = this.state.detail || '';
            if(detail && detail.live_status === 'not_started' && !detail.isReserved) {
                this.setState({
                    currentPanel: 'CRSPanelReserve'
                });
                if(window.location.hash.indexOf('CRSPanelReserve') === -1) { window.location.hash = 'CRSPanelReserve'; }
            }else{
                var phash = 'CRSPanelDetail' + '-' + localStorage.getItem("resourceId") || '';
                if(window.location.hash.indexOf(phash) === -1) { window.location.hash = phash; }
                window.location.reload(true);
                // this.setState({
                //     currentPanel: 'CRSPanelReserve',
                //     detail:{isReserved:false}
                // });
                // if(window.location.hash.indexOf('CRSPanelReserve') === -1) { window.location.hash = 'CRSPanelReserve'; }
            }
         }else if (re && re.isUsed && re.resource_type == 7) {
            var phash = 'CRSPanelProductLevelList' + '-' + localStorage.getItem("resourceId") || '';
            if(window.location.hash.indexOf(phash) === -1) { window.location.hash = phash; }
            window.location.reload(true);
         }
    },
    _handleHIED_APP_DONE:function(){
        this.setState({
            hideAPP: true
        });
    },
    componentDidUpdate: function() {
        // var dom = ReactDOM.findDOMNode(this.refs.root);
        switch(this.state.currentPanel) {
            case 'CRSPanelSuggest':
                // var dom = ReactDOM.findDOMNode(this.refs.container_latests);
                // dom.scrollTop = last_scrollTop_latests;
                scrollHelper.setScrollTo(last_scrollTop_latests);
                // console.log('last_scrollTop_latests: ', last_scrollTop_latests);
                break;
            case 'CRSPanelSearchResult': 
                // var dom = ReactDOM.findDOMNode(this.refs.container_searchresults);
                // dom.scrollTop = last_scrollTop_searchresults;
                scrollHelper.setScrollTo(last_scrollTop_searchresults);
                break;
            case 'CRSPanelDetail': 
                // var dom = ReactDOM.findDOMNode(this.refs.container_detail);
                // dom.scrollTop = last_scrollTop_detail;
                scrollHelper.setScrollTo(last_scrollTop_detail);
                break;   
        }
    },
    componentDidMount: function() {
        AuthStore.addEventListener(AuthStore.Events.SC401, this._handleSC401);
        // CoursesStore.addEventListener('SEARCHBAR_ONFOCUS', this._search_on_focus);
        // CoursesStore.addEventListener('SEARCHBAR_ONBLUR', this._search_on_blur);
        CoursesStore.addEventListener(CoursesStore.Events.SERVER_ERROR, this._handleSERVER_ERROR);
        MeStore.addEventListener(MeStore.Events.REGISTER_DONE, this._handleREGISTER_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.BIND_DONE, this._handleBIND_DONE);
        // CoursesStore.addEventListener(CoursesStore.Events.REQUEST_START, this._handleREQUEST_START);
        // CoursesStore.addEventListener(CoursesStore.Events.REQUEST_END, this._handleREQUEST_END);
        CoursesStore.addEventListener(CoursesStore.Events.GET_LATEST_MORE_START, this._handleGET_LATEST_MORE_START);
        CoursesStore.addEventListener(CoursesStore.Events.GET_LATEST_MORE_DONE, this._handleGET_LATEST_MORE_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.GET_LATEST_DONE, this._handleGET_LATEST_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.SEARCH_MORE_START, this._handleSEARCH_MORE_START);
        CoursesStore.addEventListener(CoursesStore.Events.SEARCH_MORE_DONE, this._handleSEARCH_MORE_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.SEARCH_DONE, this._handleSEARCH_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.GET_DETAIL_DONE, this._handleGET_DETAIL_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.PRODUCT_DONE, this._handlePRODUCT_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.PRODUCT_DETAIL_DONE, this._handlePRODUCT_DETAIL_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.LASTVIEWPRODUCTLESSON_DONE, this._handleLASTVIEWPRODUCTLESSON_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.TOGGLE_COLLECT_DONE, this._handleTOGGLE_COLLECT_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.GET_ORDER_DONE, this._handleGET_ORDER_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.GETEXISTORDER_DONE, this._handleGETEXISTORDER_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.GET_RESERVE_DONE, this._handleGET_RESERVE_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.RESERVE_DONE, this._handleRESERVE_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.GET_ENROLL_DONE, this._handleGET_ENROLL_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.ENROLL_DONE, this._handleENROLL_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.GET_RESOURCE_CODE_DONE, this._handleGET_RESOURCE_CODE_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.ADD_RESOURCE_CODE_DONE, this._handleADD_RESOURCE_CODE_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.ONLINE_CHANGE_CHAPTER_DONE, this._handleONLINE_CHANGE_CHAPTER_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.PAY_DONE, this._handlePAY_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.GET_REDEEM_DONE, this._handleGET_REDEEM_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.SELECT_RESOURCE_CODE_DONE, this._handleSELECT_RESOURCE_CODE_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.REDEEM_DONE, this._handleREDEEM_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.UNIFY_ORDER_DONE, this._handleUNIFY_ORDER_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.ON_PLAYOVER_DONE, this._handleON_PLAYOVER_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.GET_COUPON_DONE,this._handleGET_COUPON_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.WEIXIN_ADD_COUPON_DONE,this._handleWEIXIN_ADD_COUPON_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.WEIXIN_USE_COUPON_DONE,this._handleWEIXIN_USE_COUPON_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.HIED_APP_DONE,this._handleHIED_APP_DONE);

        window.onhashchange = function(event){//handle history change 
            event.preventDefault();
            var currentPanel = '';
            var ori = event.newURL.split('#');
            if(ori.length > 1){
                var l_hash = ori[1];
                if(l_hash && l_hash.length > 0){
                    var tks = l_hash.split('-');
                    currentPanel = tks[0]; // 2nd level panel
                }
            }
            switch(currentPanel){ //allowed  panels
                case 'CRSPanelOrder': if(event.oldURL.indexOf('#CRSPanelResourceCode') === -1) 
                    break; //only allow return from #CRSPanelResourceCode
                case 'CRSPanelResourceCode': 
                    this.setState({
                        currentPanel: currentPanel
                    }); 
                    break;
                case 'CRSPanelLoading':
                    this.setState({
                        currentPanel: currentPanel
                    }); 
                    break;
                case 'CRSPanelDetail':
                    Dispatcher.dispatch({
                        actionType: AuthStore.ActionTypes.WX_JS_CONFIG,
                        onMenuShareAppMessage: wx_config_share_detail
                    });
                    this.setState({
                        currentPanel: 'CRSPanelDetail'
                    }); 
                    break;
                case 'CRSPanelProductLevelList'://Dennis
                    this.setState({
                        currentPanel: 'CRSPanelProductLevelList',
                        isProduct: false
                    }); 
                    // this.initData();
                    break;
                case 'CRSPanelProductLevelListDetail'://Dennis
                    this.setState({
                        currentPanel: 'CRSPanelProductLevelListDetail',
                        isProduct: true
                    }); 
                    // this.initData();
                    break;
                case 'CRSPanelUseCoupon':
                    if(tks.length > 1){
                        Dispatcher.dispatch({ 
                            actionType: CoursesStore.ActionTypes.GET_COUPON,
                            resource_type: tks[1]
                        });
                    }
                    break;
                case 'CRSPanelSearchResult': 
                    if(this.state.searchResults.length > 0){
                        this.updateSearchResultsWithCurrentDetail( () => {
                            this.setState({
                                currentPanel: 'CRSPanelSearchResult'
                            });
                        });
                    } 
                    Dispatcher.dispatch({
                        actionType: AuthStore.ActionTypes.WX_JS_CONFIG,
                        onMenuShareAppMessage: wx_config_share_home
                    });
                    break;
                case 'CRSPanelSuggest':
                case '':
                //###after refresh page on loadable panel like detailPanel, latests.length is 0, need fetch data from server
                    if(this.state.latests.length > 0){
                        if (courseType==='product') {
                            this.setState({
                                currentPanel: 'CRSPanelSuggest'
                            });
                        } else {
                            this.updateLatestsWithCurrentDetail( () => {
                                this.setState({
                                    currentPanel: 'CRSPanelSuggest'
                                });
                                    
                            });
                            this.hashBackTo = 'CRSPanelSuggest';
                        }
                        
                    } else {
                        doGET_LATEST();
                    }
                    Dispatcher.dispatch({
                        actionType: AuthStore.ActionTypes.WX_JS_CONFIG,
                        onMenuShareAppMessage: wx_config_share_home
                    });
                    break;
            }


        }.bind(this);
        // AuthStore.do_AUTHENTICATE({
        //     url_cb: document.location,
        //     noAuthCB: this.initData
        // });
        this.initData();
    },
    componentWillUnmount: function() {
        AuthStore.removeEventListener(AuthStore.Events.SC401, this._handleSC401);
        // CoursesStore.removeEventListener('SEARCHBAR_ONFOCUS', this._search_on_focus);
        // CoursesStore.removeEventListener('SEARCHBAR_ONBLUR', this._search_on_blur);
        CoursesStore.removeEventListener(CoursesStore.Events.SERVER_ERROR, this._handleSERVER_ERROR);
        MeStore.removeEventListener(MeStore.Events.REGISTER_DONE, this._handleREGISTER_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.BIND_DONE, this._handleBIND_DONE);
        // CoursesStore.removeEventListener(CoursesStore.Events.REQUEST_START, this._handleREQUEST_START);
        // CoursesStore.removeEventListener(CoursesStore.Events.REQUEST_END, this._handleREQUEST_END);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_LATEST_MORE_START, this._handleGET_LATEST_MORE_START);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_LATEST_MORE_DONE, this._handleGET_LATEST_MORE_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_LATEST_DONE, this._handleGET_LATEST_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.SEARCH_MORE_START, this._handleSEARCH_MORE_START);
        CoursesStore.removeEventListener(CoursesStore.Events.SEARCH_MORE_DONE, this._handleSEARCH_MORE_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.SEARCH_DONE, this._handleSEARCH_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_DETAIL_DONE, this._handleGET_DETAIL_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.PRODUCT_DONE, this._handlePRODUCT_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.PRODUCT_DETAIL_DONE, this._handlePRODUCT_DETAIL_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.LASTVIEWPRODUCTLESSON_DONE, this._handleLASTVIEWPRODUCTLESSON_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.TOGGLE_COLLECT_DONE, this._handleTOGGLE_COLLECT_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_ORDER_DONE, this._handleGET_ORDER_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.GETEXISTORDER_DONE, this._handleGETEXISTORDER_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_RESERVE_DONE, this._handleGET_RESERVE_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.RESERVE_DONE, this._handleRESERVE_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_ENROLL_DONE, this._handleGET_ENROLL_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.ENROLL_DONE, this._handleENROLL_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_RESOURCE_CODE_DONE, this._handleGET_RESOURCE_CODE_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.ADD_RESOURCE_CODE_DONE, this._handleADD_RESOURCE_CODE_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.ONLINE_CHANGE_CHAPTER_DONE, this._handleONLINE_CHANGE_CHAPTER_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.PAY_DONE, this._handlePAY_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_REDEEM_DONE, this._handleGET_REDEEM_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.SELECT_RESOURCE_CODE_DONE, this._handleSELECT_RESOURCE_CODE_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.REDEEM_DONE, this._handleREDEEM_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.UNIFY_ORDER_DONE, this._handleUNIFY_ORDER_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.ON_PLAYOVER_DONE, this._handleON_PLAYOVER_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.GET_COUPON_DONE,this._handleGET_COUPON_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.WEIXIN_ADD_COUPON_DONE,this._handleWEIXIN_ADD_COUPON_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.WEIXIN_USE_COUPON_DONE,this._handleWEIXIN_USE_COUPON_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.HIED_APP_DONE,this._handleHIED_APP_DONE);
    },
    _show_search_nomore_msg: function(){
        return (
            <div className="bottom-remind-info">
                <h5 className="row"> ~ 共 {this.state.searchResults.length} 条 ~ </h5>
            </div>
        );
    },
    _show_latest_nomore_msg: function(){
        return (
            <div className="bottom-remind-info">
                <h5 className="row"> ~ 共 {this.state.latests.length} 条 ~ </h5>
            </div>
        );
    },
    render: function(){ 
        var isShowSearchBar = false;
        var isShowSearchWhenBarIsOn
        if (isWeiXin) {
             isShowSearchWhenBarIsOn = (courseType !== 'product');
        }else{
            isShowSearchWhenBarIsOn = true;
        }
        pcurrentPanel = '';
        var alt_title;
        switch (this.state.currentPanel){
            case 'CRSPanelSearchResult': 
                var searchResultsStatus = this.state.searchResultsStatus;
                pcurrentPanel = (
                    <STLContainer key="c_searchresults" ref="container_searchresults" actionType={CoursesStore.ActionTypes.SEARCH_MORE} isShowLoadingMark={searchResultsStatus.isShowLoadingMark} isSwapUpLoadable={searchResultsStatus.isSwapUpLoadable}>
                        <CRSPanelSearchResult data={this.state.searchResults} keyWords={this.state.keyWords}/>
                        { searchResultsStatus.isShowNoMore ? this._show_search_nomore_msg() : '' }
                    </STLContainer>
                );
                isShowSearchBar = true;
                break;
            case 'CRSPanelDetail': 
                pcurrentPanel = (
                    <Container key="c_detail" ref="container_detail">
                        <CRSPanelDetail lesson={this.state.detail} user={this.state.user}/>
                    </Container>
                );
                isShowSearchBar = true;
                break;
            case 'CRSPanelProductLevelList': //Dennis
                // pcurrentPanel = (
                //     <Container key="c_detail" ref="container_detail">
                //         <CRSPanelDetail lesson={this.state.detail} user={this.state.user} isProduct={this.state.isProduct} isProduct_Course={true}/>
                //     </Container>
                // );
                // isShowSearchBar = true;
                // break;
            case 'CRSPanelProductLevelListDetail': //Dennis
                pcurrentPanel = (
                    <Container key="c_detail" ref="container_detail">
                        <CRSPanelDetail lesson={this.state.product} user={this.state.user} isProduct_Course={true}
                            Product_Course={this.state.product_course} isProduct={this.state.isProduct} productId={this.state.productId}
                            levelId={this.state.levelId} resourceId={this.state.resourceId} catelogId={this.state.catelogId}/>
                    </Container>
                );
                isShowSearchBar = true;
                break;
            case 'CRSPanelOrder': pcurrentPanel = (
                    <CRSPanelOrder order={this.state.order} courseType={courseType}/>
                );
                break;
            case 'CRSPanelResourceCode': pcurrentPanel = (
                    <CRSPanelResourceCode discounts={this.state.discounts} />
                );
                alt_title = '选择优惠券';
                break;
            case 'CRSPanelResourceCode_Redeem': pcurrentPanel = (
                    <CRSPanelResourceCode_Redeem type={courseType} lessonId={(this.order && this.order.items && this.order.items[0]) ? this.order.items[0].lessonId : null}/>
                );
                alt_title = '兑换优惠券';
                break;
            case 'CRSPanelReserve': 
                pcurrentPanel = (
                    <CRSPanelReserve lesson={this.state.detail} user={this.state.user}/>
                );
                break;
            case 'CRSPanelEnroll': pcurrentPanel = (
                    <CRSPanelEnroll lesson={this.state.detail} user={this.state.user}/>
                );
                break;
            case 'MEPanelRegister': pcurrentPanel = (
                    <MEPanelRegister lesson={this.state.detail}/>
                );
                break;
            case 'CRSPanelLoading': pcurrentPanel = (<h1>Loading...</h1>); break;
            case 'CRSPanelUseCoupon':
                    pcurrentPanel=(
                            <CRSPanelUseCoupon  data={this.state.discountList} addCouponErr={this.state.addCouponErr} />
                        );
            break;
            case 'CRSPanelSuggest': 
            case '':
            default: 
                var latestResultsStatus = this.state.latestResultsStatus;
                pcurrentPanel = (
                    <STLContainer key="c_latests" ref="container_latests" actionType={CoursesStore.ActionTypes.GET_LATEST_MORE} isShowLoadingMark={latestResultsStatus.isShowLoadingMark} isSwapUpLoadable={latestResultsStatus.isSwapUpLoadable}>
                        <CRSPanelSuggest data={this.state.latests} title={'最新' + title}/>
                        { latestResultsStatus.isShowNoMore ? this._show_latest_nomore_msg() : '' }
                    </STLContainer>
                );
                isShowSearchBar = true;
                break;
        }
        if(lastPanel !== this.state.currentPanel) {//if panel changed
            lastPanel = this.state.currentPanel;
        }
        if(alt_title){
            document.title = alt_title;
        }else{
            document.title = title;
        }
        if (isWeiXin) {
    		var cls = cx(isShowSearchBar ? 'half-height-nav' : 'no-nav', 'crs'); 
        }else{
            isShowSearchBar = true;
            var cls = cx(isShowSearchBar ? 'half-height-nav' : 'no-nav', 'crs'); 
            // console.log(cls);
        }
        // var LoadingMask = this.state.isMaskPg ? <PLoadingMask /> : '';
        var searchBarBGMask = this.state.isShowSearchBarBGMask ? <div className="searchBarBGMask"></div> : '';
        var detailTop;
        var webSearchTop;
        if (isApple && (this.state.currentPanel === 'CRSPanelDetail')) {
            detailTop = cx(this.state.hideAPP ? '' :'detail-content-top');
            webSearchTop = cx(this.state.hideAPP ? '': 'web-search-top');
        }
        return (
			<div className={cls} onScroll={this._onScroll} onTouchEnd={this._onScroll}>
                 { (this.state.currentPanel === 'CRSPanelDetail') ?
                    <DownloadApp lesson={this.state.detail}/>:''
                }
                {isShowSearchBar && isWeiXin ? <SearchBar logoMenu={logoMenu} lesson={this.state.detail} isShowSearchWhenBarIsOn={isShowSearchWhenBarIsOn} searchParams={{type: courseType}} isShowFilters={false} logoLinkto={f('./courses_index.html?courseType=%s', courseType)} placeholder="搜课程" /> : ''}
               <div className={webSearchTop}>
                   {
                        isWeiXin ? '' :
                        <WABSearchBar logoMenu={logoMenu} logohHome={logohHome}
                             isShowSearchWhenBarIsOn={isShowSearchWhenBarIsOn} searchParams={{type: courseType}}
                            isShowFilters={false} logoLinkto={f('./courses_index.html?courseType=%s', courseType)} 
                            placeholder="输入您感兴趣的课程" />
                    }
                </div>
                <div className={isApple && (this.state.currentPanel === 'CRSPanelDetail') ? detailTop: ''} >
                    {pcurrentPanel}
                </div>
                <div className="bottom-placeholder"><h1>{this.state.msg}</h1></div>
                {/*LoadingMask*/}
                {searchBarBGMask}
                {this.state.nonceIframe}
                { isWeiXin ? '': <WEBPanelfooter / >}
            </div>
		);
	}
});

module.exports = Pg_courses_index;
// ReactDOM.render( <Pg_courses_index />,
//     document.getElementById('react')
// );




