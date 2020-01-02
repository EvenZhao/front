var userAgent = window.navigator.userAgent.toLowerCase();
console.log('userAgent', userAgent);
global.isWeiXin = userAgent.indexOf('micromessenger') > -1 ? true : false;
global.isApple = userAgent.indexOf('iphone') > -1 ? true : false;
var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var keyMirror = require('keymirror');
var cx = require('classnames');
var dtfmt = require('./util/format.js');

var AppDispatcher = require('./dispatcher/LawDispatcher.js');
var LawStore = require('./stores/LawStore');
var AuthStore = require('./stores/AuthStore.js')(AppDispatcher);
// AuthStore.setUrlAuthCB('/html/law_index.html');
// var nf = require('../util/notify.js');

// var SplashScreen = require('./components/SplashScreen.jsx');
var SearchBar = require('./components/SearchBar.jsx')(AppDispatcher, LawStore);
var SearchBarFilterLaw = require('./components/law/SearchBarFilterLaw.jsx');

var PanelDetail = require('./components/law/PanelDetail.jsx');
var PanelSearchResult = require('./components/law/PanelSearchResult.jsx');
var PanelSuggest = require('./components/law/PanelSuggest.jsx');
var STLContainer = require('./components/STLContianer.jsx')(AppDispatcher);
var Container = require('./components/Contianer.jsx');

var ActionTypes = LawStore.ActionTypes;
var Events = LawStore.Events;
require('./util/PgSetup.js')(React);// init page setup

var title_txt = '铂略法规库';
var info_nomore_result = (<div className="bottom-remind-info">无更多数据</div>);
var lastTop = 0;
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

// var wx_ts = new Date().getTime();
// function initWXJs(){
//     wx.config({
//         debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//         appId: 'wx0b2319b2a367bc3f', // 必填，公众号的唯一标识
//         timestamp: wx_ts, // 必填，生成签名的时间戳
//         nonceStr: Math.random().toString(36).substr(2, 15), // 必填，生成签名的随机串
//         signature: '',// 必填，签名，见附录1
//         jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//     });
// }
var PgLaw_index = React.createClass({
    // ActionTypes: ActionTypes,
    propTypes: {},
    getInitialState: function() {
        return {
            isShowLoadingMoreMark: false,
            // isShowSplashScreen: false,
            isSwapUpLoadable: false,
            isShowNoMore: false,
            suggests: [],
            searchResults: [],
            detail: null,
            currentPanel: '',
            keyWord: null,
            filter: 'all' //just for show '_show_bottom_remind_info'
        };
    },
    _handleREQUEST_END: function(act){
        switch (act.actionType) {
            case ActionTypes.GET_DETAIL:
                scroll2Top();
                break;
            case ActionTypes.SEARCH:
                this.setState({
                    searchResults: []
                });
                scroll2Top();
            case ActionTypes.SEARCH_MORE:
            case ActionTypes.GET_LATEST:
                this.setState({
                    isShowLoadingMoreMark: false
                });
                break;
        }
    },
    _handleREQUEST_START: function(act){
        switch (act.actionType) {
            case ActionTypes.GET_DETAIL:
                this.setState({
                    // isShowSplashScreen: true,
                    // isShowLoadingMoreMark: false,
                    currentPanel: 'SplashScreen'
                });
                break;
            case ActionTypes.SEARCH:
                this.setState({
                    // isShowSplashScreen: true,
                    isShowNoMore: false,
                    isSwapUpLoadable: false,
                    currentPanel: 'SplashScreen'
                });
                break;
            case ActionTypes.SEARCH_MORE:
                this.setState({
                    isSwapUpLoadable: false
                });
            case ActionTypes.GET_LATEST:
                this.setState({
                    isShowLoadingMoreMark: true
                });
                break;
        }
    },
    _handleSEARCH_RESULT_CHANGED: function(re){
        var isSwapUpLoadable = true;
        if (re && re.results && (re.results.length - this.state.searchResults.length) < LawStore.LIMIT){
            isSwapUpLoadable = false;
        }
        this.setState({
            keyWord: re.keyWord,
            searchResults: re.results
        });

        var isShowNoMore = !isSwapUpLoadable;
        var filter = re.filter ? re.filter : filter;
        this.setState({
            _id: 1,
            isSwapUpLoadable: isSwapUpLoadable,
            isShowNoMore: isShowNoMore,
            currentPanel: 'PanelSearchResult',
            filter: filter
        });
        
        if(window.location.hash.indexOf('PanelSearchResult') === -1 ) window.location.hash = 'PanelSearchResult';
    },
    _handleGET_DETAIL_DONE: function(re){
        this.setState({
            detail: re.detail,
            currentPanel: 'PanelDetail'
        });
        if(window.location.hash.indexOf('PanelDetail') === -1) window.location.hash = 'PanelDetail' + '-' + re.detail._id;
    },
    _handleGET_LATEST_DONE: function(re){
        this.setState({
            suggests: re.results
        });
    },
    // componentWillMount: function(){
    // },
    componentDidMount: function() {
        LawStore.addEventListener(Events.REQUEST_END,  this._handleREQUEST_END);
        LawStore.addEventListener(Events.REQUEST_START,  this._handleREQUEST_START);
        LawStore.addEventListener(Events.SEARCH_RESULT_CHANGED,  this._handleSEARCH_RESULT_CHANGED);
        LawStore.addEventListener(Events.GET_DETAIL_DONE,  this._handleGET_DETAIL_DONE);
        LawStore.addEventListener(Events.GET_LATEST_DONE,  this._handleGET_LATEST_DONE);
        AppDispatcher.dispatch({
            actionType: ActionTypes.GET_LATEST
        });
        scroll2Top();
        //# init <---------
        window.onhashchange = function(event){//handle history change 
            event.preventDefault();
            var l_hash = window.location.hash.replace('#', '');
            var currentPanel = '';
            if(l_hash && l_hash.length > 0){
                var tks = l_hash.split('-');
                currentPanel = tks[0];
            }
            this.setState({
                currentPanel: currentPanel
            });
        }.bind(this);

        var init_hash = window.location.hash.replace('#', '');
        if(init_hash && init_hash.length > 0){//handle init load specified data
            var tks = init_hash.split('-');
            if(tks.length > 1){
                switch(tks[0]){
                    case 'PanelDetail': 
                        AppDispatcher.dispatch({
                            actionType: ActionTypes.GET_DETAIL,
                            _id: tks[1]
                        });
                        break;
                }
            }
        }
        //end init
        //-------------->
    },
    componentWillUnmount: function() {
        LawStore.removeEventListener(Events.REQUEST_END,  this._handleREQUEST_END);
        LawStore.removeEventListener(Events.REQUEST_START,  this._handleREQUEST_START);
        LawStore.removeEventListener(Events.SEARCH_RESULT_CHANGED,  this._handleSEARCH_RESULT_CHANGED);
        LawStore.removeEventListener(Events.GET_DETAIL_DONE,  this._handleGET_DETAIL_DONE);
        LawStore.removeEventListener(Events.GET_LATEST_DONE,  this._handleGET_LATEST_DONE);
    },
    _show_bottom_remind_info: function(){
        var tabtxt;
        switch(this.state.filter){
            case 'lawNum': tabtxt = ' "标题" '; break;
            case 'title': tabtxt = ' "全文" '; break;
            default: break;
        }
        return (
            <div className="bottom-remind-info">
                <h5 className="row"> ~ 搜索结果共 {this.state.searchResults.length} 条 ~ </h5>
                { this.state.searchResults.length < 1 && tabtxt ? <div className="row"> <span>请尝试点击</span><span className="h5">{tabtxt}</span></div> : '' }
            </div>
        );
    },
    render: function() {
        var content;
        var isPanelSearchResult = true;
        var isShowFilters = false;
        var isShowSuggest = false;
        switch(this.state.currentPanel){
            case 'PanelDetail': 
                content = 
                    <Container key="c_PanelDetail">
                        <PanelDetail data={this.state.detail} keyWord={this.state.keyWord}/>;
                    </Container>
                isPanelSearchResult = false;
                isShowFilters = false;
                break;
            case 'PanelSearchResult': 
                content = (
                    this.state.searchResults.length > 0 ? 
                    <STLContainer actionType={LawStore.ActionTypes.SEARCH_MORE} isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={isPanelSearchResult && this.state.isSwapUpLoadable}>
                        <PanelSearchResult data={this.state.searchResults} keyWord={this.state.keyWord}/>
                       { isPanelSearchResult && this.state.isShowNoMore && !this.state.isShowLoadingMoreMark ? this._show_bottom_remind_info() : '' }
                    </STLContainer>
                    : 
                    <Container key="c_bottom_remind_info">
                       { isPanelSearchResult && this.state.isShowNoMore && !this.state.isShowLoadingMoreMark ? this._show_bottom_remind_info() : '' }
                    </Container>
                );
                isShowFilters = true;
                if(this.state.isShowNoMore){
                    isShowSuggest = false;
                }
                break;
            // case 'PanelSuggest':
            //     content = '';
            //     isPanelSearchResult = false;
            //     isShowSuggest = true;
            //     isShowFilters = false;
            //     break;
            case 'SplashScreen':
                content = <div className="loading-mark-bottom"><span className="fa fa-spin fa-circle-o-notch"></span></div>;
                isShowFilters = true;
                break;
            default: 
                content = '';
                isShowSuggest = true;
                isShowFilters = false;
                isPanelSearchResult = false;
        }
        var cls = cx('law',{
            'half-height-nav': !isShowFilters
        });
        var suggests = isShowSuggest ? 
                        <Container key="c_PanelSuggest">
                            <PanelSuggest data={this.state.suggests} title="新录法规"/> 
                        </Container>
                        : '';
        return ( 
            <div className={cls}>
                <SearchBar isShowFilters={isShowFilters} logoLinkto="./law_index.html" placeholder="内容、标题、文号">
                    <SearchBarFilterLaw />
                </SearchBar>
               { content }
               { suggests }
            </div>
        );
    }
});
module.exports = PgLaw_index;
ReactDOM.render( <PgLaw_index /> ,
    document.getElementById('react')
);




