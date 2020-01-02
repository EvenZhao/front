var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');

var Ribbon = React.createClass({
	propTypes:{
		txt: React.PropTypes.string.isRequired,
		cls: React.PropTypes.string.isRequired,
		top: React.PropTypes.number.isRequired
	},
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
	render: function(){
	    var styles = {
	        top: this.props.top 
	    };
	    var cls = cx('ribbon', this.props.cls);
		return (
			<div className={cls} style={styles}>
               <div className="theribbon">{this.props.txt}</div>
               <div className="ribbon-background"></div>
            </div>
		);
	}
});
module.exports = Ribbon;