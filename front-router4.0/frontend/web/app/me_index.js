var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var assign = require('object-assign');
var cx = require('classnames');
var util =  require('util'),
    f = util.format;
var dm = require('./util/DmURL.js');
var Dispatcher = require('./dispatcher/AppDispatcher.js');
require('./util/PgSetup.js')(React);
var MeStore = require('./stores/MeStore.js');
var AppStore = require('./stores/AppStore.js');
var AuthStore = require('./stores/AuthStore.js')(Dispatcher);
// var url_auth_cb = f('/html/me_index.html?changePanelType=%s', changePanelType);
// AuthStore.setUrlAuthCB(url_auth_cb);
// AuthStore.setUrlAuthCB(document.location);
var MEPanelSafety = require('./components/me/MEPanelSafety.jsx');
var MEPanelOrderResult =require('./components/me/MEPanelOrderResult.jsx');
var MEPanelRegister =require('./components/me/MEPanelRegister.jsx')(Dispatcher,MeStore);
var MECenter = require('./components/me/MECenter.jsx');
var MEPanelUnBind =require('./components/me/MEPanelUnBind.jsx')(Dispatcher,MeStore);
var ActionTypes = MeStore.ActionTypes;
var STLContainer = require('./components/STLContianer.jsx')(Dispatcher);
var urlquery = dm.getCurrentUrlQuery();
var changePanelType = urlquery.changePanelType;

//Components


//logic objects


var title = '';
// function init(){
// 	//TODO: 1.设 title， 2.初始化
//     switch(changePanelType) {
//         case 'MECenter': 
//             title = '会员中心'; 
//             break;
//         case 'MEPanelSafety': 
//             title = '修改密码'; 
//             break;
//         case 'MEPanelOrderResult': 
//             title = '我的订单'; 
//             break;
//         case 'MEPanelUnBind': 
//             title = '解除绑定'; 
//             break;
//     }
//     console.log('title',title);
//     document.title = title;
// }
// init();

function scroll2Top(){
    var lastScrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) { 
        lastScrollTop = document.documentElement.scrollTop;
        document.documentElement.scrollTop = 0; 
    } else if (document.body) {
        lastScrollTop = document.body.scrollTop;
        document.body.scrollTop = 0; 
    } 
    return lastScrollTop;
}

var Pg_me_index = React.createClass({
	getInitialState: function() {
        return ({
            user: null,
            nonceIframe: '',
            suggests: [],
            currentPanel: '',
            backPanel:'',
            isShowLoadingMoreMark: false,
            isSwapUpLoadable: false,
            keyWord: null,
            isPanelSearchResult:false
        });
    },
	propTypes:{
	},
    _handleGET_ORDER_DONE: function(re){
        if (re && re.results && (re.results.length) < MeStore.ORDER_LIMIT){
            this.setState({
                isSwapUpLoadable:false
            });
        }else{
            this.setState({
                isSwapUpLoadable:true
            });
        }
        if (re.results.length===0) {
            this.setState({
                isPanelSearchResult: true
            });
        }else{
            this.setState({
                isPanelSearchResult: false
            });
        }
        this.setState({
            suggests: re.results
        });
    },
    _show_bottom_remind_info: function(){
        return (
            <div className="bottom-remind-info">
                <h5 className="row"> ~ 搜索结果共 {this.state.suggests.length} 条 ~ </h5>
            </div>
        );
    },
    _handleSEARCH_ORDER_RESULT_MORE_DONE:function(re){
         if (re && re.results && (re.results.length - this.state.suggests.length) < MeStore.ORDER_LIMIT){
            this.setState({
                isSwapUpLoadable:false
            });
        }else{
            this.setState({
                isSwapUpLoadable:true
            });
        }
        this.setState({
            suggests: re.results
        });
    },
    _handleGET_DETAIL_DONE: function(re){
        this.setState({
            detail: re.result,
            currentPanel: 'PanelDetail'
        });
       // if(window.location.hash.indexOf('PanelDetail') === -1) window.location.href = 'courses_index.html?courseType='+re.result.type+'#CRSPanelDetail' + '-' + re.result.id;
    },
    _handleREQUEST_START: function(act){
      
        switch (act.actionType) {
            case ActionTypes.SEARCH_ORDER_RESULT_MORE:
                this.setState({
                    isShowLoadingMoreMark: true,
                    isSwapUpLoadable:false
                });
                break;
        }
    },
     _handleREQUEST_END: function(act){
        switch (act.actionType) {
            case ActionTypes.SEARCH_ORDER_RESULT_MORE:
           
                this.setState({
                    isShowLoadingMoreMark: false,
                    isSwapUpLoadable:true
                });
                break;
        }
    },
    _handleSC401: function(act){
        this.setState({
                currentPanel:'MEPanelRegister',
                backPanel:changePanelType
            });
    },
    _handleME_REGISTER_DONE:function(re){
        this._handleBIND_DONE(re);
    },
    _handleUNBIND_DONE:function(re){
        if (re.detail.isUnBinded) {
            this.setState({
                currentPanel:'MEPanelRegister',
                backPanel:changePanelType
            });
        }
    },
    _handleBIND_DONE:function(re){
        if (re.user) {
            this.setState({
                user: re.user,
                currentPanel: this.state.backPanel
            }, function(){
                if (this.state.currentPanel === 'MECenter') {
                    var nickName = this.state.user.nickName;
                    if(nickName) {
                        // this.setTitle(nickName);
                        AppStore.emit(AppStore.Events.SET_TITLE,nickName);
                    }
                }
                if (this.state.currentPanel === 'MEPanelUnBind') {
                        this.setState({
                        nickName:re.user.nickName,
                        photo:re.user.photo,
                        phone: re.user.phone,
                        email: re.user.email,
                        name: re.user.name,
                        levelName: re.user.levelName,
                        customerStaffName: re.user.customerStaffName,
                        customerStaffPhone: re.user.customerStaffPhone,
                        customerStaffEmail: re.user.customerStaffEmail
                    });
 
                }

            });
        }
        if (this.state.backPanel==='MEPanelOrderResult') {
            Dispatcher.dispatch({
                actionType: MeStore.ActionTypes.SEARCH_ORDER_RESULT
            });
        }
    },
    // setTitle: function(title) {
    //     document.title = title;
    //     var $iframe = (<iframe key={'nonceIframe' + Date.now()} style={{display: 'none'}} src="/favicon.ico"></iframe>);
    //     this.setState({
    //         nonceIframe: $iframe
    //     });
    // },
    _handleSHOW_USER_DONE:function(re){
        if (re.user && re.user.isBinded === true) {
            this.setState({
                user: re.user,
                currentPanel: changePanelType
            }, function(){
                if (changePanelType === 'MEPanelOrderResult') {
                    Dispatcher.dispatch({
                        actionType: MeStore.ActionTypes.SEARCH_ORDER_RESULT
                    });
                    return;
                }
                if (changePanelType === 'MECenter') {
                    var nickName = this.state.user.nickName;
                    if(nickName) {
                        // this.setTitle(nickName);
                        AppStore.emit(AppStore.Events.SET_TITLE,nickName);
                    }
                    return;
                }
                if (changePanelType === 'MEPanelUnBind') {
                    this.setState({
                        nickName:re.user.nickName,
                        photo:re.user.photo,
                        phone: re.user.phone,
                        email: re.user.email,
                        name: re.user.name,
                        levelName: re.user.levelName,
                        customerStaffName: re.user.customerStaffName,
                        customerStaffPhone: re.user.customerStaffPhone,
                        customerStaffEmail: re.user.customerStaffEmail
                    });
                    return;
                }
            });
        }else{
            this.setState({
                currentPanel:'MEPanelRegister',
                backPanel:changePanelType
            });
        }
        
    },
    componentDidMount: function() {
        AuthStore.addEventListener(AuthStore.Events.SC401, this._handleSC401);
        MeStore.addEventListener(MeStore.Events.REQUEST_START, this._handleREQUEST_START);
        MeStore.addEventListener(MeStore.Events.REQUEST_END, this._handleREQUEST_END);
        MeStore.addEventListener(MeStore.Events.SEARCH_ORDER_DONE, this._handleGET_ORDER_DONE);
        MeStore.addEventListener(MeStore.Events.GET_DETAIL_DONE, this._handleGET_DETAIL_DONE);
        MeStore.addEventListener(MeStore.Events.SEARCH_ORDER_RESULT_MORE_DONE, this._handleSEARCH_ORDER_RESULT_MORE_DONE);
        MeStore.addEventListener(MeStore.Events.REGISTER_DONE,this._handleME_REGISTER_DONE);
        MeStore.addEventListener(MeStore.Events.BIND_DONE, this._handleBIND_DONE);
        MeStore.addEventListener(MeStore.Events.SHOW_USER_DONE, this._handleSHOW_USER_DONE);
        MeStore.addEventListener(MeStore.Events.UNBIND_DONE, this._handleUNBIND_DONE);
        if (changePanelType) {
            switch(changePanelType) {
            case 'MECenter': 
                title = '会员中心'; 
                break;
            case 'MEPanelSafety': 
                title = '修改密码'; 
                break;
            case 'MEPanelOrderResult': 
                title = '我的订单'; 
                break;
            case 'MEPanelUnBind': 
                title = '解除绑定'; 
                break;
            }
            AppStore.emit(AppStore.Events.SET_TITLE,title);
        }
        // this.setState({
        //         currentPanel: changePanelType
        // });
        //TODO: 注册events
     //    if(!this.state.openid && this.state.code){
    	// 	Dispatcher.dispatch({
	    //         actionType: AuthStore.ActionTypes.AUTHENTICATE
	    //     });
    	// }
        scroll2Top();
        window.onhashchange = function(event){//handle history change 
            event.preventDefault();
            var l_hash = window.location.hash.replace('#', '');
            var currentPanel = '';
            if (l_hash && l_hash.length > 0){
                var tks = l_hash.split('-');
                currentPanel = tks[0];
            }
            this.setState({
                currentPanel: currentPanel
            });
        }.bind(this);
        // AuthStore.do_AUTHENTICATE({
        //     url_cb: document.location,
        //     noAuthCB: function(){
        //         Dispatcher.dispatch({
        //             actionType: MeStore.ActionTypes.SHOW_USER
        //         });
        //     }
        // });
        Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.SHOW_USER
        });
    },
    componentWillUnmount: function() {
        MeStore.removeEventListener(MeStore.Events.REQUEST_START, this._handleREQUEST_START);
        MeStore.removeEventListener(MeStore.Events.REQUEST_END, this._handleREQUEST_END);
        MeStore.removeEventListener(MeStore.Events.GET_LATEST_MyCOLLECTION, this._handleGET_ORDER_DONE);
        MeStore.removeEventListener(MeStore.Events.GET_DETAIL_DONE, this._handleGET_DETAIL_DONE);
        MeStore.removeEventListener(MeStore.Events.SEARCH_ORDER_RESULT_MORE_DONE, this._handleSEARCH_ORDER_RESULT_MORE_DONE);
        MeStore.removeEventListener(MeStore.Events.ME_REGISTER_DONE,this._handleME_REGISTER_DONE);
        MeStore.removeEventListener(MeStore.Events.BINDONE, this._handleBINDONE);
        MeStore.removeEventListener(MeStore.Events.UNBIND_DONE, this._handleUNBIND_DONE);
        MeStore.removeEventListener(MeStore.Events.SHOW_USER_DONE, this._handleSHOW_USER_DONE);
        //TODO: 注销 events
    },
	render: function(){ 
        //TODO: render逻辑判断
        var currentPanel = '';
        switch (this.state.currentPanel){
            case 'MEPanelOrderResult':
                currentPanel = (
                    <STLContainer key="container_orderhresult" ref="container_orderhresult" actionType={MeStore.ActionTypes.SEARCH_ORDER_RESULT_MORE} isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}>
                        <MEPanelOrderResult data={this.state.suggests} keyWord={this.state.keyWord}/>
                        {this.state.isPanelSearchResult ? this._show_bottom_remind_info(): ''}
                    </STLContainer>
                );
                break;
            case 'MEPanelSafety': 
                currentPanel = (
                    <MEPanelSafety />
                );
                break;
            case 'MECenter': 
                currentPanel = (
                    <MECenter/>
                );
                break;
            case 'MEPanelRegister': 
                currentPanel = (
                    <MEPanelRegister/>
                );
                break;
            case 'MEPanelUnBind': 
                currentPanel = (
                    <MEPanelUnBind  nickName={this.state.nickName} photo={this.state.photo} phone={this.state.phone}
                    email={this.state.email} name={this.state.name} levelName={this.state.levelName} customerStaffName={this.state.customerStaffName}
                    customerStaffPhone={this.state.customerStaffPhone} customerStaffEmail={this.state.customerStaffEmail}/>
                );
                break;
            case 'NOPanel': 
                currentPanel = '';
                break;
            // default: currentPanel = (            
            //        <MECenter />
            //     );
        }
		var cls = cx('me no-nav'); //根div class指定
        return (
			<div className={cls}>
             {currentPanel}
             {this.state.nonceIframe}
            </div>
		);
	}
});

module.exports = Pg_me_index 
// ReactDOM.render(<Pg_me_index />,
//     document.getElementById('react')
// );


