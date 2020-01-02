var React = require('react');
// var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var assign = require('object-assign');
var cx = require('classnames');
var util =  require('util'),
    f = util.format;
var dm = require('./util/DmURL.js');
var Dispatcher = require('./dispatcher/AppDispatcher.js');
require('./util/PgSetup.js')(React);
var UnBindStore = require('./stores/UnBindStore.js');
var AuthStore = require('./stores/AuthStore.js')(Dispatcher);
var WapStore = require('./stores/WapStore.js');
var courseType = dm.getCurrentUrlQuery().courseType;
var currentPg = dm.getCurrentUrlQuery().currentPg;
var WABSearchBar =require('./components/wap/WABSearchBar.jsx')(Dispatcher,WapStore);
var ActionTypes = UnBindStore.ActionTypes;
var WEBPanelSuggest = require('./components/wap/WABPanelSuggest.jsx');
var WEBPanelfooter = require('./components/wap/WABPanelfooter.jsx');
var WABPanelHomeTop = require('./components/wap/WABPanelHomeTop.jsx');
var WAPPanelHomeMeun = require('./components/wap/WAPPanelHomeMeun.jsx');
var WAPPanelUserInfo = require('./components/wap/WAPPanelUserInfo.jsx');
var WAPPanelUserManage = require('./components/wap/WAPPanelUserManage.jsx');
var WAPPanelUserLesson = require('./components/me/MECenter.jsx');
var WAPPanelSafety = require('./components/wap/WAPPanelSafety.jsx');
var WAPPanelSearchResult = require('./components/wap/WAPPanelSearchResult.jsx');
var STLContainer = require('./components/STLContianer.jsx')(Dispatcher);
var WAPPanelTitleTop =require('./components/wap/WAPPanelTitleTop.jsx');
var WAPPanelCoupon = require('./components/wap/WAPPanelCouponResult.jsx');
var currentPg = dm.getCurrentUrlQuery().currentPg;

var title = '';
function init(){
	//TODO: 1.设 title， 2.初始化
    switch(currentPg){
        case 'Pg_web_index':
            title = 'WAP首页';
        break;
    }
    document.title = title;
}
init();


var logoMenu = (
    <div role="presentation" className="nav-brand col-xs-2 col-sm-1 dropdown padding-left">
        <i alt="铂略" className="dropdown-toggle fa fa-list-ul fa-2x logo-meun-size" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"/>
         <ul className="dropdown-menu" style={{width: '10%'}}>
                {/*a_live_info ?*/} 
                <li><img className="dropdown_menu_img" src="../img/icon_03.png" height="18" width="25" /><a className="dropdown-menu_a dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=live_info">直播课</a></li>
                 {/*: <li> <img className="dropdown_menu_img" src="../img/icon_13.png" height="18" width="25" /><a className="dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=live_info">直播课</a></li>*/}
            
            
               {/* a_online_info ?*/}
                <li className="li_border"><img className="dropdown_menu_img" src="../img/icon_16.png" height="18" width="25" /><a className="dropdown-menu_a dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=online_info">视频课</a></li>
                {/*: <li className="li_border"><img className="dropdown_menu_img" src="../img/icon_06.png" height="18" width="25" /><a className="dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=online_info">视频课</a></li>*/}
            
            
                {/*a_offline_info ?*/}
                <li><img className="dropdown_menu_img" src="../img/icon_08.png" height="18" width="25" /><a className="dropdown-menu_a dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=offline_info">线下课</a></li>
                {/*: <li><img className="dropdown_menu_img" src="../img/icon_18.png" height="18" width="25" /><a className="dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=offline_info">线下课</a></li>*/}

            
            
                {/*a_product ?*/}
                <li className="li_border"><img className="dropdown_menu_img" src="../img/icon_16.png" height="18" width="25" /><a className="dropdown-menu_a dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=product">专题课</a></li>
                {/*: <li className="li_border"><img className="dropdown_menu_img" src="../img/icon_06.png" height="18" width="25" /><a className="dropdown-menu_title" href="./index.html?currentPg=courses_index&courseType=product">专题课</a></li>*/}
            
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

// function doGET_WAPLIST(){
//     Dispatcher.dispatch({
//         actionType: CoursesStore.ActionTypes.WAP_GET_LIVE
//     });
// }

var pcurrentPanel = '';
var Pg_wap_index = React.createClass({
	getInitialState: function() {
        return assign({
            //TODO: states
            suggests: [],
            latests: [],
            userinfo: {},
            login:{},
            user_image: null,
            // courseType: courseType,
            backPanel:'',
            isShowLoadingMoreMark: false,
            isSwapUpLoadable: false,
            keyWord: null,
            isPanelSearchResult:false,
            online_info_list:'',
            onlineType: 'h',
            searchResults: '',
            keyWords: null,
            courseType: courseType,
            titleTop: '',
            showAddCoupon: '',
            coupons: '',
            err: '',
            status: ''
        }, dm.getCredentials());

    },
	propTypes:{
	},
    _handleWAP_GET_LIVE_DONE: function(re){
        var user = re && re.user ? re.user : '';
        var result = re && re.result ? re.result : '';
        // var live_info = result.live_info;
        var live_info_list = result.live_info;
        var online_info_list = result.online_info;
        var adv_info = result.adv_info;
        var user_image = result.user_image ? result.user_image :'';
        localStorage.setItem("user_image", user_image);
        // localStorage.setItem("user", JSON.stringify(user));
        this.setState({
            latests: live_info_list,
            online_info: online_info_list,
            adv_info: adv_info,
            user_image: user_image,
            user: user,
            courseType: 'home',
            titleTop: ''
        });
        window.location.hash = '';
    },

    //获取个人信息(个人中心)
    _handleGET_USERINFO_DONE: function(re){
        var user = re.result;
        var user_image =user.user_image;
        // console.log('_handleGET_ACCOUNT_DONE',user.user_info);
        // 拿取数据userinfo（用户信息）
        if (re && re.result) {
            this.setState({
                userinfo: user.user_info,
                courseType: 'user',
                titleTop:'',
                user: re.user,
                user_image: user_image
            });
            Dispatcher.dispatch({
                actionType: WapStore.ActionTypes.SIGN_STATUS,
                activityCode: user.user_info.activityCode,
                accountId:user.user_info.account_id,
                accountLevel:user.user_info.level
        });
        }

        if(window.location.hash.indexOf('WAPPanelUserInfo') === -1) { window.location.hash = 'WAPPanelUserInfo'; }
    },

    //获取个人信息(账户管理)
    _handleGET_ACCOUNT_DONE: function(re){
        // console.log('_handleGET_ACCOUNT_DONE',re);
        var user = re.result;
        var login = re.user;
        //拿取数据login（登录状态）
        //拿取数据userinfo（用户信息）
        this.setState({
            login: login,
            userinfo: user.user_info,
            courseType: 'manage',
            titleTop: '账户管理'
        });
        if(window.location.hash.indexOf('WAPPanelUserManage') === -1) { window.location.hash = 'WAPPanelUserManage'; }
    },

    //修改个人信息
    _handleCHANGE_USERINFO_DONE: function(re){
        // console.log('_handleCHANGE_USERINFO_DONE',re);
        var userinfo = assign({}, this.state.userinfo, re.result);
        this.setState({
            userinfo: userinfo
        });
    },

    //修改头像
    _handleCHANGE_USERIMAGE_DONE: function(re){
        // console.log('_handleCHANGE_USERIMAGE_DONE',re);
        this.setState({
            //返回图片路径
            userinfo: re.result,
            user_image: re.result.user_image
        });
        localStorage.setItem("user_image", re.result.user_image);
        // console.log('userinfo',re.result);
    },

    //跳转修改密码页面
    _handleGET_PASSWORD_DONE: function(re){
        // console.log('_handleGET_PASSWORD_DONE',re);
        var user = re.result;
        //拿取数据userinfo（用户信息）
        this.setState({
            userinfo: user.userinfo,
            courseType: 'password',
            titleTop:'修改密码'
        });
        if(window.location.hash.indexOf('WAPPanelSafety') === -1) { window.location.hash = 'WAPPanelSafety'; }
    },
    //注销
    _handleLOG_OUT_DONE: function(re){
        // console.log('_handleLOG_OUT_DONE',re);
    },
    _handleWAP_CHANGE_ONLICE_TYPE_DONE: function(re){
        if (re && re.onlineType) {
            this.setState({
                onlineType: re.onlineType
            });     
        }
    },

    _handleWAP_CHANGE_SEARCH_TYPE_DONE: function(re){
        // if(re && re.wapsearchType){
        //     this.setState({
        //         wapsearchType: re.wapsearchType
        //     });
        // }
    },
    _handleWAP_SEARCH_DONE: function(re){
        // console.log('_handleWAP_SEARCH_DONE:',re);
        var searchContent = re && re.data.content ? re.data.content : '';
        var keyWords = re && re.keyWord ? re.keyWord : '';
        var wapChangeType = re.wapChangeType ? re.wapChangeType :'';

        if (re && searchContent) {
            this.setState({
                searchResults: searchContent,
                keyWords: keyWords,
                courseType: 'search',
                titleTop:''
            });
        }
        if(window.location.hash.indexOf('WAPPanelSearchResult') === -1) { window.location.hash = 'WAPPanelSearchResult'; }
    },

    _handleWAP_MYCONPON: function(re){
        // console.log('_handleWAP_MYCONPON',re);
        var discountList = re && re.result && re.result.discountList ? re.result.discountList :'';
        if (re && re.result && discountList) {
            this.setState({
                discountList: discountList,
                courseType: 'coupon',
                titleTop: '我的优惠券'
            });    
        }
        if(window.location.hash.indexOf('WAPPanelCoupon') === -1) { window.location.hash = 'WAPPanelCoupon'; }
    },

    //新增优惠券点击事件
    _handleSHOW_DIV_DONE: function(re){
        // console.log('_handleSHOW_DIV_DONE!!!!!!!!!!!!!!!!!!!!00000000000!',re);
        if (re) {
            this.setState({
                showAddCoupon: re.showAddCoupon,
                err: re.err,
                status: re.status
            });
        }
    },

    //新增优惠券
    _handleADD_COUPONS_DONE: function(re){
        // console.log('_handleADD_COUPONS_DONE',re);
        var coupons = re.coupons;
        var err = re.err;
        var status = re.err;
        var showAddCoupon = re.showAddCoupon
        if(status === null){
            // console.log('yesssssssssssss',status);
            this.setState({
                status: status,
                showAddCoupon: showAddCoupon
            });
        }
        if(err === "您输入的优惠券不存在" || err === "您输入的优惠券已经过期" || err === "您已经添加过该优惠券"){
        // console.log('errrrrrrrrrrrr',err);
            this.setState({
                err: err,
                showAddCoupon: showAddCoupon
            });
        }else{
            this.setState({
                coupons: coupons,
                showAddCoupon: showAddCoupon
            });
        }
    },
    initData: function(){
        var init_hash = window.location.hash.replace('#', '');
        if(init_hash && init_hash.length > 0){//handle init load specified data
            var tks = init_hash.split('-');
            if(tks && tks.length > 0){
                // console.log("tks!!!!!!!!!!!!!!!!!!",tks[0]);
                switch(tks[0]){
                    case 'WAPPanelUserInfo': 
                    // console.log('WAPPanelUserInfoWAPPanelUserInfoWAPPanelUserInfo');
                        if(tks.length > 0){
                            Dispatcher.dispatch({
                                actionType: WapStore.ActionTypes.GET_USERINFO
                            });
                        }
                        break;
                    case 'WAPPanelUserManage': 
                        if(tks.length > 0){
                            Dispatcher.dispatch({
                                actionType: WapStore.ActionTypes.GET_ACCOUNT
                            });

                        }
                        break;
                    case 'WAPPanelSafety': 
                        if(tks.length > 0){
                            Dispatcher.dispatch({
                                actionType: WapStore.ActionTypes.GET_PASSWORD
                            });

                        }
                        break;
                    case 'WAPPanelCoupon': 
                        if(tks.length > 0){
                            Dispatcher.dispatch({
                                actionType: WapStore.ActionTypes.WAP_MYCONPON
                            });
                        }
                        break;
                    case 'WAPPanelSearchResult':
                        // console.log('WAPPanelSearchResult');
                         Dispatcher.dispatch({
                            actionType: WapStore.ActionTypes.WAP_SEARCH,
                            keyWord: localStorage.getItem("WapkeyWord"),
                            searchType: 'online_info'
                        });
                    break;
                    case '':
                        if(tks.length > 0){
                            Dispatcher.dispatch({ 
                                actionType: WapStore.ActionTypes.WAP_GET_LIVE
                            });
                        }
                        break;
                        default:
                            Dispatcher.dispatch({
                                actionType: WapStore.ActionTypes.WAP_GET_LIVE
                            });
                    // default: doGET_LATEST();
                }
            }
        } else {
            // doGET_LATEST();
            Dispatcher.dispatch({
                actionType: WapStore.ActionTypes.WAP_GET_LIVE
            });
        }
        // console.log("222222222222222222");
    },
    componentDidMount: function() {
        WapStore.addEventListener(WapStore.Events.WAP_GET_LIVE_DONE, this._handleWAP_GET_LIVE_DONE);
        WapStore.addEventListener(WapStore.Events.GET_USERINFO_DONE, this._handleGET_USERINFO_DONE);
        WapStore.addEventListener(WapStore.Events.GET_ACCOUNT_DONE, this._handleGET_ACCOUNT_DONE);
        WapStore.addEventListener(WapStore.Events.CHANGE_USERINFO_DONE, this._handleCHANGE_USERINFO_DONE);
        WapStore.addEventListener(WapStore.Events.CHANGE_USERIMAGE_DONE, this._handleCHANGE_USERIMAGE_DONE);
        WapStore.addEventListener(WapStore.Events.GET_PASSWORD_DONE, this._handleGET_PASSWORD_DONE);
        WapStore.addEventListener(WapStore.Events.LOG_OUT_DONE, this._handleLOG_OUT_DONE);
        WapStore.addEventListener(WapStore.Events.WAP_CHANGE_ONLICE_TYPE_DONE, this._handleWAP_CHANGE_ONLICE_TYPE_DONE);
        WapStore.addEventListener(WapStore.Events.WAP_SEARCH_DONE, this._handleWAP_SEARCH_DONE);
        WapStore.addEventListener(WapStore.Events.WAP_CHANGE_SEARCH_TYPE_DONE, this._handleWAP_CHANGE_SEARCH_TYPE_DONE);
        WapStore.addEventListener(WapStore.Events.WAP_MYCONPON_DONE,this._handleWAP_MYCONPON);
        WapStore.addEventListener(WapStore.Events.SHOW_DIV_DONE,this._handleSHOW_DIV_DONE);
        WapStore.addEventListener(WapStore.Events.ADD_COUPONS_DONE,this._handleADD_COUPONS_DONE);
        // if(courseType === 'user'){
        //     Dispatcher.dispatch({
        //         actionType: WapStore.ActionTypes.GET_USERINFO
        //     });
        // }
        // if(courseType === 'manage'){
        //     Dispatcher.dispatch({
        //         actionType: WapStore.ActionTypes.GET_ACCOUNT
        //     });
        // }
        // if(courseType === 'lesson'){
        //     Dispatcher.dispatch({
        //         actionType: WapStore.ActionTypes.GET_LESSON
        //     });
        // }
        // if(courseType === 'password'){
        //     Dispatcher.dispatch({
        //         actionType: WapStore.ActionTypes.GET_PASSWORD
        //     });
        // }
        window.onhashchange = function(event){//handle history change 
            // event.preventDefault();
            var currentPanel = '';
            var ori = event.newURL.split('#');
            if(ori.length > 1){
                var l_hash = ori[1];
                if(l_hash && l_hash.length > 0){
                    var tks = l_hash.split('-');
                    currentPanel = tks[0]; // 2nd level panel
                }
            }
            //allowed  panels
            switch(currentPanel){
                case 'WAPPanelUserInfo': 
                    Dispatcher.dispatch({
                         actionType: WapStore.ActionTypes.GET_USERINFO
                    });
                    break;
                case 'WAPPanelUserManage': 
                    Dispatcher.dispatch({
                        actionType: WapStore.ActionTypes.GET_ACCOUNT
                    });
                    break;
                case 'WAPPanelSafety': 
                    Dispatcher.dispatch({
                         actionType: WapStore.ActionTypes.GET_PASSWORD
                    });
                    break;
                case 'WAPPanelCoupon': 
                    Dispatcher.dispatch({
                        actionType: WapStore.ActionTypes.WAP_MYCONPON
                    });
                    break;
                case 'LOG_OUT':
                    window.location.hash = '';
                    Dispatcher.dispatch({
                        actionType: WapStore.ActionTypes.WAP_GET_LIVE
                    });
                    break;
                // case 'WAPPanelRegister': 
                //     alert("Back to WAPPanelRegister");//按返回如是登陆页跳首页
                case '':
                //###after refresh page on loadable panel like detailPanel, latests.length is 0, need fetch data from server
                    Dispatcher.dispatch({
                        actionType: WapStore.ActionTypes.WAP_GET_LIVE
                    });
                    break;

            }


        }.bind(this);
        this.initData();
        //init data
        // console.log("111111111111111111111111");
        // Dispatcher.dispatch({
        //     actionType: WapStore.ActionTypes.WAP_GET_LIVE,
        // });
        
        
    },
    componentWillUnmount: function() {
        WapStore.removeEventListener(WapStore.Events.WAP_GET_LIVE_DONE, this._handleWAP_GET_LIVE_DONE);
        WapStore.removeEventListener(WapStore.Events.GET_USERINFO_DONE, this._handleGET_USERINFO_DONE);
        WapStore.removeEventListener(WapStore.Events.GET_ACCOUNT_DONE, this._handleGET_ACCOUNT_DONE);
        WapStore.removeEventListener(WapStore.Events.CHANGE_USERINFO_DONE, this._handleCHANGE_USERINFO_DONE);
        WapStore.removeEventListener(WapStore.Events.CHANGE_USERIMAGE_DONE, this._handleCHANGE_USERIMAGE_DONE);
        WapStore.removeEventListener(WapStore.Events.GET_PASSWORD_DONE, this._handleGET_PASSWORD_DONE);
        WapStore.removeEventListener(WapStore.Events.LOG_OUT_DONE, this._handleLOG_OUT_DONE);
        WapStore.removeEventListener(WapStore.Events.WAP_CHANGE_ONLICE_TYPE_DONE, this._handleWAP_CHANGE_ONLICE_TYPE_DONE);
        WapStore.removeEventListener(WapStore.Events.WAP_SEARCH_DONE, this._handleWAP_SEARCH_DONE);
        WapStore.removeEventListener(WapStore.Events.WAP_CHANGE_SEARCH_TYPE_DONE, this._handleWAP_CHANGE_SEARCH_TYPE_DONE);
        WapStore.removeEventListener(WapStore.Events.WAP_MYCONPON_DONE,this._handleWAP_MYCONPON);
        WapStore.removeEventListener(WapStore.Events.SHOW_DIV_DONE,this._handleSHOW_DIV_DONE);
        WapStore.removeEventListener(WapStore.Events.ADD_COUPONS_DONE,this._handleADD_COUPONS_DONE);
    },
	render: function(){
        var isShowSearchWhenBarIsOn = (courseType !== 'product');
        pcurrentPanel = '';
        switch(this.state.courseType){
            case 'home': 
                pcurrentPanel = (
                    <div>
                        <WABPanelHomeTop adv_info={this.state.adv_info}/>
                        <WAPPanelHomeMeun />
                        <WEBPanelSuggest data={this.state.latests} title={'直播课堂'} />
                        <WEBPanelSuggest data={this.state.latests} onlineType={this.state.onlineType} title={'视频课堂'} online_info={this.state.online_info}/>
                    </div>
                );
            break;
            case 'user':
                pcurrentPanel = (
                    <div>
                        <WAPPanelUserInfo data={this.state.userinfo}/>
                    </div>
                );
            break;
            case 'manage':
                pcurrentPanel = (
                    <div>
                        <WAPPanelUserManage data={this.state.userinfo} login={this.state.login}/>
                    </div>
                );
            break;
            case 'lesson':
                pcurrentPanel = (
                    <div>
                        <WAPPanelUserLesson data={this.state.userinfo}/>
                    </div>
                );
            break;
            case 'password':
                pcurrentPanel = (
                    <div>
                        <WAPPanelSafety data={this.state.userinfo}/>
                    </div>
                );
            break;
            case 'search':
                pcurrentPanel = (
                    <div>
                        <WAPPanelSearchResult data={this.state.searchResults} keyWords={this.state.keyWords}/>
                    </div>
                );
            break;
            case 'coupon':
                pcurrentPanel = (
                    <WAPPanelCoupon data = {this.state.discountList} showAddCoupon={this.state.showAddCoupon} coupons={this.state.coupons} err={this.state.err} status={this.state.status}/>
                );
            break;

            default :
                pcurrentPanel = (
                    <div>
                        <WABPanelHomeTop adv_info={this.state.adv_info}/>
                        <WAPPanelHomeMeun />
                        <WEBPanelSuggest data={this.state.latests} title={'直播课堂'} />
                        <WEBPanelSuggest data={this.state.latests} title={'视频课堂'} onlineType={this.state.onlineType} online_info={this.state.online_info}/>
                    </div>
                );
        }
        return (
			<div>
                    { this.state.titleTop ? <WAPPanelTitleTop titleTop={this.state.titleTop}/> :
                        <WABSearchBar logoMenu={logoMenu} logohHome={logohHome} user_image={this.state.user_image}
                        user={this.state.user} isShowSearchWhenBarIsOn={isShowSearchWhenBarIsOn} searchParams={{type: courseType}}
                        isShowFilters={false} logoLinkto={f('./courses_index.html?courseType=%s', courseType)} 
                        placeholder="输入您感兴趣的课程" />
                    }
                    {pcurrentPanel}
                    {this.state.courseType==='register' ? '': <WEBPanelfooter />}
                
            </div>
		);
	}
});

module.exports = Pg_wap_index;



