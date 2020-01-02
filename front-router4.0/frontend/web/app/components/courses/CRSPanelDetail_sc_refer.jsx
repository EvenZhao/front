var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var Store = require('../../stores/CoursesStore');
var ActionTypes = Store.ActionTypes;
var Item = require('./CRSImgHeadedListItem.jsx')(Dispatcher);

var CRSPanelDetail_sc_refer = React.createClass({
	propTypes: {
		ref_lessons: React.PropTypes.array
	},
    getDefaultProps: function(){
        return {
            ref_lessons: []
        };
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
	render: function(){
		var items = this.props.ref_lessons.map(function(item, index){
			return (
                <Item key={index} data={item} />
            );
		});
		return (
            <div className="container-fluid sc_refer">
    			<div className="panel">
                    <div className="panel-body">
                        {items}
                    </div>
                </div>
            </div>
		);
	}
});
module.exports = CRSPanelDetail_sc_refer;

