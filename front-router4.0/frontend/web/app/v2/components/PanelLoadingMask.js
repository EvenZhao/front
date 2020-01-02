var React = require('react');
var PropTypes = React.PropTypes;

var PanelLoadingMask = React.createClass({
	propTypes:{
	},
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },

	render: function(){
		var style = {
			// paddingTop: document.body.clientHeight
		};
		return (
			<div className="loading-mask" style={style}>
				<i className="fa fa-3x fa-spin fa-circle-o-notch"/>
			</div>
		);
	}
});
module.exports = PanelLoadingMask;
