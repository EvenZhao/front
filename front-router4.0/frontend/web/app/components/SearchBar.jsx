var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var keyMirror = require('keymirror');
var assign = require('object-assign');

var ActionTypes = keyMirror({
    SEARCH: null,
    SEARCH_PROMPT: null

});

var FILTER = keyMirror({
    all: null
});

var Events = keyMirror({
    FILTERED: null,
    SEARCHBAR_ONFOCUS: null,
    SEARCHBAR_ONBLUR: null,
    SEARCH_PROMPT_DONE: null,
    HIED_APP_DONE: null
});

var typeahead;

var SearchBar;
function init(dispatcher, store){
    var Dispatcher = dispatcher;
    var Store = store;
    SearchBar = React.createClass({
        ActionTypes: ActionTypes,
        Events: Events,
        propTypes: {
            isShowSearchWhenBarIsOn: React.PropTypes.bool,
            isShowFilters: React.PropTypes.bool,
            logoLinkto: React.PropTypes.string,
            placeholder: React.PropTypes.string,
            searchParams: React.PropTypes.object,
            logoMenu: React.PropTypes.object,
            lesson: React.PropTypes.object
        },
        getDefaultProps: function() {
            return {
                isShowFilters: false,
                isShowSearchWhenBarIsOn: true,
                placeholder: '',
                logoLinkto: '#'
            };
        },
        getInitialState: function() {
            return {
                words: [],
                keyWord: '',
                filter: FILTER.all,
                hideAPP: false
            };
        },
        _onSubmit: function(e) {
            e.preventDefault();
        },
        _onChange_keyWord: function(e) {
            // e.preventDefault();
            Store.emit(Events.SEARCHBAR_ONFOCUS);
            var v = e.target.value;
            if (v.length > 15) {
                v = v.substr(0, 15);
            }
            this.setState({
                keyWord: e.target.value //need ori str without be trimed to display only
            }, function() {
                var w = this.state.keyWord;
                // console.log(w.length);
                if (w && w.length > 1) {
                    if (typeahead) { typeahead.typeahead("lookup"); }//active prompt
                }
            });
        },
        _onKeyUp_keyWord: function(e) {
            if (e.keyCode === 13) {
                this.doSearch();
            }
        },
        _onClick_filter: function(e) {
            var v = e.filter;//e.target.id;
            this.setState({
                filter: v
            }, function() {
                this.doSearch();
            });
        },
        _handlePROMPT_DONE: function(re) {
            this.setState({
                words: re.words
            }, function() {
                typeahead = jQuery('input.typeahead').typeahead({
                    afterSelect: function(item) {
                        this.setState({
                            keyWord: item.name
                        });
                    }.bind(this),
                    source: this.state.words,
                    limit: 5
                });
                typeahead.typeahead("lookup"); //active prompt
            });
        },
        _onFocus: function(e){
            Store.emit(Events.SEARCHBAR_ONFOCUS);
        },
        _onBLur: function(e){
            Store.emit(Events.SEARCHBAR_ONBLUR);
        },
        handleHIED_APP_DONE: function(re){
            this.setState({
                hideAPP: true
            });
        },
        componentDidMount: function() {
            Store.on(Events.SEARCH_PROMPT_DONE, this._handlePROMPT_DONE);
            Store.on(Events.FILTERED, this._onClick_filter);
            Store.on(Events.HIED_APP_DONE,this.handleHIED_APP_DONE);
            Dispatcher.dispatch({
                actionType: ActionTypes.SEARCH_PROMPT
            });
        },
        componentWillUnmount: function() {
            Store.removeListener(Events.SEARCH_PROMPT_DONE, this._handlePROMPT_DONE);
            Store.removeListener(Events.FILTERED, this._onClick_filter);
            Store.removeListener(Events.HIED_APP_DONE,this.handleHIED_APP_DONE);
        },
        //actions
        doSearch: function() {
            if (this.state.keyWord && this.state.keyWord.trim().length > 0) {
                Store.emit(Events.SEARCHBAR_ONBLUR);
                Dispatcher.dispatch(assign({
                    actionType: ActionTypes.SEARCH,
                    keyWord: this.state.keyWord.trim(),
                    filter: this.state.filter
                }, this.props.searchParams ? this.props.searchParams : {}));
            }
        },
        //helpers
    	render: function(){
            var filtersBar;
            if (this.props.isShowFilters) {
                filtersBar = (
                    this.props.children || ''
                );
            } else {
                filtersBar = '';
            }
            var logo = this.props.logoMenu ? this.props.logoMenu 
            : (<a className="nav-brand col-xs-2 col-sm-2" href={this.props.logoLinkto}>
                    <img alt="铂略" src="../img/favicon/favicon-32x32.png" height="32" width="32"/>
                </a>);
            var cls;
            if (isWeiXin && this.props.lesson && (this.props.searchParams.type !== 'product')) {//去掉是否在微信上这个判断条件 isApple && 
                cls = cx(this.state.hideAPP ? 'navbar navbar-default navbar-fixed-top' : 'navbar navbar-default navbar-fixed-top navbar-top'); 
            }else{
                cls= cx('navbar navbar-default navbar-fixed-top');
            }
    		return (
    			<nav className={cls} role="search">
                    <div className="navbar-form navbar-left container-fluid searchbar">
                        {logo}
                        <div className="form-group col-xs-10 col-sm-10 search">
                        {
                            this.props.isShowSearchWhenBarIsOn ?
                            <form className="input-group search-input" onSubmit={this._onSubmit}>
                                <input type="search" className="form-control typeahead" data-provide='typehead' placeholder={this.props.placeholder} value={this.state.keyWord} onBlur={this._onBLur} onFocus={this._onFocus} onChange={this._onChange_keyWord} onKeyUp={this._onKeyUp_keyWord}/>
                                <button type="button" className="btn input-group-addon fa fa-search" onClick={this.doSearch}></button>
                            </form> : ''
                        }
                        </div>
                    </div>
                    {filtersBar}
                </nav>
    		);
    	}
    });
    return SearchBar;
}

module.exports = init;


