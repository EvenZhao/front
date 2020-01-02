var React = require('react');
var PropTypes = React.PropTypes;

var SplashScreen = React.createClass({
	propTypes: {
		isShow: React.PropTypes.bool.isRequired
	},
	componentDidMount: function() {},
	componentWillUnmount: function() {},
	render: function(){
		var style = {
			display: this.props.isShow? 'block' : 'none'
		};
		return (
			<div className="splash-screen" style={style}><span className="fa fa-spin fa-spinner"></span></div>
		);
	}
});
module.exports = SplashScreen;

