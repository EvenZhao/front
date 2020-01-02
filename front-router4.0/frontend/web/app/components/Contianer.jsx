var React = require('react');
var PropTypes = React.PropTypes;



function scroll2Top(){
    if (document.documentElement && document.documentElement.scrollTop) {
        document.documentElement.scrollTop = 0;
    } else if (document.body) {
        document.body.scrollTop = 0;
    }
}

/*
*#Container - SwapToLoadContainer #
*/
var Container = React.createClass({
    statics: {
        scroll2Top: scroll2Top
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
	render: function(){
        var style = {};
        if (!isWeiXin) {
            style = {
                'marginTop': '0px !important'
            }
        };
		return (
			<div className="content container-fluid my-container" style={style}>
				{this.props.children}
			</div>
		);
	}
});
module.exports = Container;

