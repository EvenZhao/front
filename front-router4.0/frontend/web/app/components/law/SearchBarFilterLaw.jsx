var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var keyMirror = require('keymirror');
var AppDispatcher = require('../../dispatcher/LawDispatcher');

var FILTER = keyMirror({
    all: null,
    title: null,
    lawNum: null

});

var ActionTypes = keyMirror({
	FILTERING: null

});

var SearchBarFilterLaw = React.createClass({
	ActionTypes: ActionTypes,
	propTypes:{
	},
	getInitialState: function(){
        return  {
        	filter: FILTER.all
        };
    },
    _onClick_filter: function(e) {
        var v = e.target.id;
        this.setState({
            filter: v
        }, function() {
            AppDispatcher.dispatch({
	            actionType: ActionTypes.FILTERING,
	            filter: v
	        });
        });
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    clsFilter: function(filter) {
        return cx({
            'btn': true,
            'col-xs-4': true,
            'fa': true,
            active: this.state.filter === filter
        });
    },
	render: function(){
		return (
			<div className="navbar-form navbar-left filters">
                <div className="col-xs-12 btn-group container-fluid filter-group" role="group" aria-label="">
                    <div type="button" className={this.clsFilter(FILTER.all)} id={FILTER.all} onClick={this._onClick_filter} >全文</div>
                    <div type="button" className={this.clsFilter(FILTER.title)} id={FILTER.title} onClick={this._onClick_filter} >标题</div>
                    <div type="button" className={this.clsFilter(FILTER.lawNum)} id={FILTER.lawNum} onClick={this._onClick_filter} >文号</div>
                </div>
            </div>
		);
	}
});
module.exports = SearchBarFilterLaw;


