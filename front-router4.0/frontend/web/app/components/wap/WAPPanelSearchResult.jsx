var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var WapStore = require('../../stores/WapStore');
var ActionTypes = WapStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var Item = require('./WAPPanelSearchListItem.jsx')(Dispatcher);
var STLContainer = require('../../components/STLContianer.jsx')(Dispatcher);

var PropType_data = function (props, propName, component) {
    if ( !props[propName].id ){
        return new Error('Invalid id!');
    }
    if ( !props[propName].title || typeof props[propName].title !== 'string' ){
        return new Error('Invalid title!');
    }
};

var WAPPanelSearchResult = React.createClass({
    propTypes: {
        data: PropTypes.any,
        keyWords: React.PropTypes.any,
        searchType: React.PropTypes.string
    },
    getInitialState: function(){
        return {
            data: this.props.data || [],
            isShowLoadingMoreMark: false,
            isSwapUpLoadable: true,
            searchChangeType: 'online',
            WapSearchMore: '',
            isShowNoMore: false
        };
    },
    _onClickChangeLiveType: function(e){
        this.setState({
            searchChangeType: 'live'
        });
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: ActionTypes.WAP_SEARCH,
            keyWord: this.props.keyWords,
            filter: this.state.filter,
            searchType: 'live_info'
        });
    },
    _onClickChangeOnType: function(e){
        this.setState({
            searchChangeType: 'online'
        });
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: ActionTypes.WAP_SEARCH,
            keyWord: this.props.keyWords,
            searchType: 'online_info'
        });
    },
    _onClickChangeOffType: function(e){
        this.setState({
            searchChangeType: 'offline'
        });
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: ActionTypes.WAP_SEARCH,
            keyWord: this.props.keyWords,
            searchType: 'offline_info'
        });
    },
    _handleWAP_SEARCH_MORE_DONE: function(re){
        console.log('_handleWAP_SEARCH_MORE_DONE',re);
        if (re && re.resultdata && re.WapSearchMoreType) {
            this.setState({
                WapSearchMore: re.resultdata,
                WapSearchMoreType : re.WapSearchMoreType
            });
        }
        if (this.props.data.live_count  && this.props.data.live_count  === this.state.WapSearchMore.length) {
            this.setState({
                isSwapUpLoadable: false,
                isShowNoMore: true
            });
        }
        if (this.props.data.online_count && this.props.data.online_count === this.state.WapSearchMore.length) {
            this.setState({
                isSwapUpLoadable: false,
                isShowNoMore: true
            });
        }
        if (this.props.data.offline_count && this.props.data.offline_count === this.state.WapSearchMore.length) {
            this.setState({
                isSwapUpLoadable: false,
                isShowNoMore: true
            });
        }
    },
    _handleREQUEST_START: function(re){
        this.setState({
            isShowLoadingMoreMark: true,
            isSwapUpLoadable:false,
            isShowNoMore: false
        });
    },
    _handleREQUEST_END:function (re){
        this.setState({
            isShowLoadingMoreMark: false,
            isSwapUpLoadable:true

        });
    },
    componentDidMount: function() {
        WapStore.addEventListener(WapStore.Events.WAP_SEARCH_MORE_DONE, this._handleWAP_SEARCH_MORE_DONE);
        WapStore.addEventListener(WapStore.Events.REQUEST_START, this._handleREQUEST_START);
        WapStore.addEventListener(WapStore.Events.REQUEST_END, this._handleREQUEST_END);
        if (!this.props.data.live_count && !this.props.data.online_count && !this.props.data.offline_count) {
            this.setState({
                isSwapUpLoadable: false,
                isShowNoMore: true
            });
        }
    },
    componentWillUnmount: function() {
        WapStore.removeEventListener(WapStore.Events.WAP_SEARCH_MORE_DONE, this._handleWAP_SEARCH_MORE_DONE);
        WapStore.removeEventListener(WapStore.Events.REQUEST_START, this._handleREQUEST_START);
        WapStore.removeEventListener(WapStore.Events.REQUEST_END, this._handleREQUEST_END);
    },
    _show_search_nomore_msg: function(){
        return (
            <div className="bottom-remind-info">
                <h5 className="row"> ~ 共 {this.state.WapSearchMore.length} 条 ~ </h5>
            </div>
        );
    },
    render: function(){
        var data = this.props.data || [];
        var live = data.live|| [];
        var live_count = data.live_count || [];
        var online = data.online || [];
        var online_count = data.online_count || [];
        var offline = data.offline || [];
        var offline_count = data.offline_count || [];
        var rows;
        var searchTitle;
        switch(this.state.searchChangeType){
            case 'live':
                searchTitle=(
                    <div>
                        <span className="span-title-left col-xs-4" onClick={this._onClickChangeOnType}>视频课</span>
                        <span className="col-xs-4 span-title-click" onClick={this._onClickChangeLiveType}>直播课</span>
                        <span className="span-title-right col-xs-4" onClick={this._onClickChangeOffType}>线下课</span>
                    </div>
                );
                if (this.state.WapSearchMore && this.state.WapSearchMoreType === 'live_info') {
                    live = this.state.WapSearchMore;
                }
                rows = live.map(function (item, index) {
                    return (
                        <Item key={index} data={item} dataType={'live'} keyWords={this.props.keyWords}/>
                    );
                }.bind(this));

            break;
            case 'online':
                searchTitle=(
                    <div>
                        <span className="span-title-left span-title-click col-xs-4" onClick={this._onClickChangeOnType}>视频课</span>
                        <span className="col-xs-4" onClick={this._onClickChangeLiveType}>直播课</span>
                        <span className="span-title-right col-xs-4" onClick={this._onClickChangeOffType}>线下课</span>
                    </div>
                );
                if (this.state.WapSearchMore && this.state.WapSearchMoreType === 'online_info') {
                    online = this.state.WapSearchMore;
                }
                rows = online.map(function (item, index) {
                    return (
                        <Item key={index} data={item} dataType={'online'}  keyWords={this.props.keyWords}/>
                    );
                }.bind(this));

            break;
            case 'offline':
                searchTitle=(
                    <div>
                        <span className="span-title-left col-xs-4" onClick={this._onClickChangeOnType}>视频课</span>
                        <span className="col-xs-4" onClick={this._onClickChangeLiveType}>直播课</span>
                        <span className="span-title-right col-xs-4 span-title-click" onClick={this._onClickChangeOffType}>线下课</span>
                    </div>
                );
                if (this.state.WapSearchMore && this.state.WapSearchMoreType === 'offline_info') {
                    offline = this.state.WapSearchMore;
                }
                rows = offline.map(function (item, index) {
                    return (
                        <Item key={index} data={item} dataType={'offline'}  keyWords={this.props.keyWords}/>
                    );
                }.bind(this));


            break;
        }
        return (
            <div className="wap-search">
            <div><span>和 "{this.props.keyWords}" 有关课程</span></div>
                <div className="wap-search-title">{searchTitle}</div>
                <div className="list-group crs-search-result">
                    <STLContainer actionType={WapStore.ActionTypes.WAP_SEARCH_MORE}  isShowLoadingMark={this.state.isShowLoadingMoreMark} isSwapUpLoadable={this.state.isSwapUpLoadable}>
                        {rows}
                        {this.state.isShowNoMore ? this._show_search_nomore_msg() : ''}
                    </STLContainer>
                </div>
            </div>
        );
    }
});
module.exports = WAPPanelSearchResult;


