var userAgent = window.navigator.userAgent.toLowerCase();
console.log('userAgent', userAgent);
global.isWeiXin = userAgent.indexOf('micromessenger') > -1 ? true : false;
global.isApple = userAgent.indexOf('iphone') > -1 ? true : false;
//##Main Entry
var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var Dispatcher = require('./dispatcher/AppDispatcher.js');
var assign = require('object-assign');
var cx = require('classnames');
var util = require('util'),
    f = util.format;
var dm = require('./util/DmURL.js');
var URL = require('url');

var AppStore = require('./stores/AppStore.js');
var AuthStore = require('./stores/AuthStore.js')(Dispatcher);
var CoursesStore = require('./stores/CoursesStore.js');
var WapStore = require('./stores/WapStore');

var Pg_courses_index = require('./courses_index.js');
var Pg_me_index = require('./me_index.js');
var Pg_web_index = require('./web_index.js');
var WAPPanelRegister = require('./components/wap/WAPPanelRegister.jsx')(Dispatcher,WapStore);

var PLoadingMask = require('./components/PanelLoadingMask.jsx');

var urlquery = dm.getCurrentUrlQuery();
global.specialCode = urlquery.specialCode || '';
if (specialCode) {
    localStorage.setItem("specialCode",specialCode);
}

var currentPgBeforeLogin;

var Pg_index = React.createClass({
	getInitialState: function(){
        return  {
        	isMaskPg: false,
			currentPg: ''
        };
    },
    initData: function(){
    	this.setState({
    		currentPg: urlquery.currentPg || 'Pg_web_index'
    	});
    },
    _handleGET_DETAIL_DONE: function(re){

		if (re  && re.result && this.state.currentPg === 'me_index') {
		    var urll = URL.parse(dm.getUrl_home('/html/index.html?currentPg=courses_index&courseType='+re.result.type+'#CRSPanelDetail'+ '-'+re.result.id), true);
		    window.location = URL.format(urll);
		}
    },
    _handlePRODUCT_DONE: function(re){
		if (re  && re.result && this.state.currentPg === 'me_index') {
		    var urll = URL.parse(dm.getUrl_home('/html/index.html?currentPg=courses_index&courseType='+re.result.type+'#CRSPanelProductLevelList'+ '-'+re.result.id), true);
		    window.location = URL.format(urll);
		}
    },
    _handleLOGIN: function(e){
        //TODO: set currentPg = Login
    },
    _handleWAP_UNLOGIN_DONE: function(re) {
        currentPgBeforeLogin = this.state.currentPg;
        this.setState({
            currentPg: 'WAPPanelRegister'
        });
        if(window.location.hash.indexOf('WAPPanelRegister') === -1) { window.location.hash = 'WAPPanelRegister'; }

    },
    // _handleWAP_REGISTER_DONE: function(re){
    //     var user = re && re.user ? re.user : '';
    //     if (user && user.is_logined) {
    //         // window.location.reload();
    //         localStorage.setItem("user_image", user.photo);
    //         localStorage.setItem("user", JSON.stringify(user));
    //         if (Dispatcher.lastErr403Payload && Dispatcher.lastErr403Payload.actionType !== 'CHANGE_USERINFO') {
    //             console.log('Dispatcher.lastErr403Payload',Dispatcher.lastErr403Payload);
    //             Dispatcher.dispatch(Dispatcher.lastErr403Payload);
    //             if(currentPgBeforeLogin) {
    //                 this.setState({
    //                     currentPg: currentPgBeforeLogin
    //                 });
    //             }
    //         } else {
    //             var ll = window.location.search.split('&');
    //             // ll.replace('?','');
    //             console.log('no ?',ll);
    //             if (ll && ll.length > 1) {
    //                 if (ll[0] === '?currentPg=courses_index') {
    //                      window.location.reload();
    //                 }
    //             }else{
    //                 Dispatcher.dispatch({
    //                     actionType: WapStore.ActionTypes.WAP_GET_LIVE
    //                 });
    //                 this.setState({
    //                     currentPg: 'Pg_web_index'
    //                 });
    //             }
    //         }
    //     }
    // },
    _handleWAP_LOGIN_DONE: function(re){
        var user = re && re.user ? re.user : '';
        if (user && user.isLogined) {
            // window.location.reload();
            localStorage.setItem("user_image", user.photo);
            localStorage.setItem("user", JSON.stringify(user));
            if (Dispatcher.lastErr403Payload && Dispatcher.lastErr403Payload.actionType !== 'CHANGE_USERINFO') {
                console.log('Dispatcher.lastErr403Payload',Dispatcher.lastErr403Payload);
                Dispatcher.dispatch(Dispatcher.lastErr403Payload);
                if(currentPgBeforeLogin) {
                    this.setState({
                        currentPg: currentPgBeforeLogin
                    });
                }
            } else {
                var q = dm.getCurrentUrlQuery()
                switch (q.currentPg) {
                    case 'courses_index':
                        window.onhashchange = function(event){
                            window.location.reload();
                            return;
                        };
                        history.back();
                        break;
                    case 'Pg_web_index':
                    default:
                        Dispatcher.dispatch({
                            actionType: WapStore.ActionTypes.WAP_GET_LIVE
                        });
                        this.setState({
                            currentPg: 'Pg_web_index'
                        });
                }
            }
        }
    },
    _handleWAP_GET_LIVE_DONE: function(re){
        this.setState({
            currentPg: 'Pg_web_index'
        });
    },
    _handleREQUEST_START: function(re){
        this.setState({
            isMaskPg: true
        });
    },
    _handleREQUEST_END: function(re){
        this.setState({
            isMaskPg: false
        });
    },
    _handleWAP_SEARCH_DONE: function(re){
        var ll = window.location.search.split('&');
                // ll.replace('?','');
        // console.log('no ?',ll);
        if (ll && ll.length > 1) {
            if (ll[0] === '?currentPg=courses_index') {
                var urll = URL.parse(dm.getUrl_home('/html/index.html?currentPg=Pg_web_index#WAPPanelSearchResult'), true);
                window.location = URL.format(urll);
            }
        }
    },
    _handleSET_TITLE: function(title) {
        console.log('_handleSET_TITLE',title);
        document.title = title;
        var $iframe = (<iframe key={'nonceIframe' + Date.now()} style={{display: 'none'}} src="../img/favicon/favicon.ico"></iframe>);
        this.setState({
            nonceIframe: $iframe
        });
    },
    componentDidMount: function() {
        AppStore.addEventListener(AppStore.Events.REQUEST_START, this._handleREQUEST_START);
        AppStore.addEventListener(AppStore.Events.REQUEST_END, this._handleREQUEST_END);
        AppStore.addEventListener(AppStore.Events.SET_TITLE, this._handleSET_TITLE);
    	CoursesStore.addEventListener(CoursesStore.Events.GET_DETAIL_DONE, this._handleGET_DETAIL_DONE);
        CoursesStore.addEventListener(CoursesStore.Events.PRODUCT_DONE, this._handlePRODUCT_DONE);
        WapStore.addEventListener(WapStore.Events.WAP_UNLOGIN_DONE,this._handleWAP_UNLOGIN_DONE);
        WapStore.addEventListener(WapStore.Events.WAP_LOGIN_DONE,this._handleWAP_LOGIN_DONE);
        WapStore.addEventListener(WapStore.Events.WAP_GET_LIVE_DONE, this._handleWAP_GET_LIVE_DONE);
        WapStore.addEventListener(WapStore.Events.WAP_REGISTER_DONE, this._handleWAP_LOGIN_DONE);
        WapStore.addEventListener(WapStore.Events.WAP_SEARCH_DONE, this._handleWAP_SEARCH_DONE);

        if(isWeiXin){
        	AuthStore.do_AUTHENTICATE({
                url_cb: document.location,
                noAuthCB: this.initData
            });

        } else {
            WapStore.addEventListener(WapStore.Events.LOGIN, this._handleLOGIN);
            AuthStore.addEventListener(AuthStore.Events.SC403, this._handleWAP_UNLOGIN_DONE);
            this.initData();
        }
    },
    componentWillUnmount: function() {
        AppStore.removeEventListener(AppStore.Events.REQUEST_START, this._handleREQUEST_START);
        AppStore.removeEventListener(AppStore.Events.REQUEST_END, this._handleREQUEST_END);
        AppStore.removeEventListener(AppStore.Events.SET_TITLE, this._handleSET_TITLE);
    	CoursesStore.removeEventListener(CoursesStore.Events.GET_DETAIL_DONE, this._handleGET_DETAIL_DONE);
        CoursesStore.removeEventListener(CoursesStore.Events.PRODUCT_DONE, this._handlePRODUCT_DONE);
        WapStore.removeEventListener(WapStore.Events.WAP_UNLOGIN_DONE,this._handleWAP_UNLOGIN_DONE);
        WapStore.removeEventListener(WapStore.Events.WAP_LOGIN_DONE,this._handleWAP_LOGIN_DONE);
        WapStore.removeEventListener(WapStore.Events.WAP_GET_LIVE_DONE, this._handleWAP_GET_LIVE_DONE);
        WapStore.removeEventListener(WapStore.Events.WAP_REGISTER_DONE, this._handleWAP_LOGIN_DONE);
        WapStore.removeEventListener(WapStore.Events.WAP_SEARCH_DONE, this._handleWAP_SEARCH_DONE);

        if(isWeiXin){

        } else {
            WapStore.removeEventListener(WapStore.Events.LOGIN, this._handleLOGIN);
            AuthStore.removeEventListener(AuthStore.Events.SC403, this._handleWAP_UNLOGIN_DONE);
        }

    },
	render: function(){
		var LoadingMask = this.state.isMaskPg ? <PLoadingMask /> : '';
		var pg = null;
		switch(this.state.currentPg) {
			case 'courses_index': pg = <Pg_courses_index />; break;
			case 'me_index': pg = <Pg_me_index />; break;
            case 'WAPPanelRegister': pg = <WAPPanelRegister />; break;
            case 'Pg_web_index': pg = <Pg_web_index />; break;
			default: pg = '';
		}
		return (
			<div>
				{pg}
				{LoadingMask}
			</div>
		);
	}
});

module.exports = Pg_index;
ReactDOM.render( <Pg_index />,
	document.getElementById('react')
);
