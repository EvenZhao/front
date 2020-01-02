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
var MeStore = require('./stores/MeStore.js');
var AuthStore = require('./stores/AuthStore.js')(Dispatcher);
// var url_auth_cb = f('/html/me_index.html?changePanelType=%s', changePanelType);
// AuthStore.setUrlAuthCB(url_auth_cb);
// AuthStore.setUrlAuthCB(document.location);
var changePanelType = dm.getCurrentUrlQuery().changePanelType;
var MEPanelRegister =require('./components/me/MEPanelRegister.jsx')(Dispatcher,MeStore);
var MEPanelUnBind =require('./components/me/MEPanelUnBind.jsx')(Dispatcher,UnBindStore);
var ActionTypes = UnBindStore.ActionTypes;
var urlquery = dm.getCurrentUrlQuery();


var title = '';
function init(){
	//TODO: 1.设 title， 2.初始化
    title = '注册绑定';
    document.title = title;
}
init();

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

var Pg = React.createClass({
	getInitialState: function() {
        return assign({
            //TODO: states
            suggests: [],
            currentPanel: changePanelType,
            backPanel:'',
            isShowLoadingMoreMark: false,
            isSwapUpLoadable: false,
            keyWord: null,
            isPanelSearchResult:false
        }, dm.getCredentials());
    },
	propTypes:{
	},
    _handleAUTHENTICATE_SUCCEED: function(re){

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
        if (re.user) {
            this.setState({
                currentPanel:'MEPanelUnBind',
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
    },
    _handleBIND_DONE:function(re){
        if (re.user) {
            this.setState({
                currentPanel:'MEPanelUnBind',
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
    },
    _handleSHOW_USER_DONE:function(re){
        if (re.user.isBinded) {
            if (re.user) {
                this.setState({
                    nickName:re.user.nickName,
                    photo:re.user.photo,
                    phone: re.user.phone,
                    email: re.user.email,
                    name: re.user.name,
                    levelName: re.user.levelName,
                    customerStaffName: re.user.customerStaffName,
                    customerStaffPhone: re.user.customerStaffPhone,
                    customerStaffEmail: re.user.customerStaffEmail,
                    currentPanel:'MEPanelUnBind'
                });
            }
        }else{
            this.setState({
                currentPanel:'MEPanelRegister'
            });
        }
        
    },
    _handleUNBIND_DONE:function(re){
        // console.log('rrere',re);
        if (re.detail.isUnBinded) {
            // console.log("解绑成功");
            this.setState({
                currentPanel:'MEPanelRegister'
            });
        }else{
            // console.log('解绑失败sss');
            // this.setState({
            //     currentPanel:'MEPanelRegister'
            // });
        }
    },
    componentDidMount: function() {
    	AuthStore.addEventListener(AuthStore.Events.AUTHENTICATE_SUCCEED, this._handleAUTHENTICATE_SUCCEED);
        AuthStore.addEventListener(AuthStore.Events.SC401, this._handleSC401);
        UnBindStore.addEventListener(UnBindStore.Events.REQUEST_START, this._handleREQUEST_START);
        UnBindStore.addEventListener(UnBindStore.Events.REQUEST_END, this._handleREQUEST_END);
        UnBindStore.addEventListener(UnBindStore.Events.REGISTER_DONE,this._handleME_REGISTER_DONE);
        UnBindStore.addEventListener(UnBindStore.Events.BIND_DONE, this._handleBIND_DONE);
        UnBindStore.addEventListener(UnBindStore.Events.SHOW_USER_DONE, this._handleSHOW_USER_DONE);
        UnBindStore.addEventListener(UnBindStore.Events.UNBIND_DONE, this._handleUNBIND_DONE);
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
        AuthStore.do_AUTHENTICATE({
            url_cb: document.location,
            noAuthCB: function(){
                Dispatcher.dispatch({
                    actionType: UnBindStore.ActionTypes.SHOW_USER
                });
            }
        });

    },
    componentWillUnmount: function() {
    	AuthStore.removeEventListener(AuthStore.Events.AUTHENTICATE_SUCCEED, this._handleAUTHENTICATE_SUCCEED);
        AuthStore.removeEventListener(AuthStore.Events.SC401, this._handleSC401);
        UnBindStore.removeEventListener(UnBindStore.Events.REQUEST_START, this._handleREQUEST_START);
        UnBindStore.removeEventListener(UnBindStore.Events.REQUEST_END, this._handleREQUEST_END);
        UnBindStore.removeEventListener(UnBindStore.Events.REGISTER_DONE,this._handleME_REGISTER_DONE);
        UnBindStore.removeEventListener(UnBindStore.Events.BINDONE, this._handleBIND_DONE);
        UnBindStore.removeEventListener(UnBindStore.Events.SHOW_USER_DONE, this._handleSHOW_USER_DONE);
        UnBindStore.removeEventListener(UnBindStore.Events.UNBIND_DONE, this._handleUNBIND_DONE);
        //TODO: 注销 events
    },
	render: function(){ 
        //TODO: render逻辑判断
        var currentPanel = '';
        switch (this.state.currentPanel){
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
            default: currentPanel = '';
        }
		var cls = cx('me no-nav'); //根div class指定
        return (
			<div className={cls}>
             {currentPanel}
            </div>
		);
	}
});

module.exports = Pg;
// ReactDOM.render(<Pg />,
//     document.getElementById('react')
// );


