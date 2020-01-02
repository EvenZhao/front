var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var dtfmt = require('../../util/format.js');
var Store = require('../../stores/CoursesStore');
var ActionTypes = Store.ActionTypes;
var patterns = require('../patterns.js');
var Item = require('./CRSImgHeadedListItem.jsx')(Dispatcher);

function getTheState(){
    return {

    };
}

var CRSPanelSuggest = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		title: React.PropTypes.string
	},
	getInitialState: function(){
        return getTheState();
    },
    _onChange: function(){
        this.setState(getTheState());
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
	render: function(){
		var items = this.props.data.map(function(item, index){
			return (
                <Item key={index} data={item} />
            );
		});
		return (
			<div className="panel suggest">
                <div className="panel-heading">{this.props.title}</div>
                <div className="panel-body">
                    {items}
                </div>
            </div>
		);
	}
});
module.exports = CRSPanelSuggest;

