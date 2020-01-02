var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var scrollHelper = require('./scrollHelper.js');


/*
*#STLContainer - SwapToLoadContainer #
*/
var STLContainer;
function init(dispatcher){
    var Dispatcher = dispatcher;
    STLContainer = React.createClass({
        statics: {
        },
    	propTypes: {
    		actionType: React.PropTypes.string,
    		isShowLoadingMark: React.PropTypes.bool,
            isSwapUpLoadable: React.PropTypes.bool
    	},
        _onTouch_scroll: function(e) {
            // alert(this.props.isSwapUpLoadable);
            if (this.props.isSwapUpLoadable){
                // if (e.currentTarget) {
                //     var target = e.currentTarget;
                    // console.log('target.scrollHeight: ', (scrollHelper.getScrollHeight()));
                    // console.log('target.scrollTop: ', (scrollHelper.getScrollTop()));
                    // console.log('l: ', ( scrollHelper.getScrollHeight() - scrollHelper.getScrollTop() - 10 ));
                    // console.log('target.clientHeight: ' + scrollHelper.getClientHeight());
                    // if ( (target.scrollHeight -  target.scrollTop - 10) < target.clientHeight ) {
                    if( ( scrollHelper.getScrollHeight() - scrollHelper.getScrollTop() - 100 ) < scrollHelper.getClientHeight() ) {
                        Dispatcher.dispatch({
                            actionType: this.props.actionType
                        });
                    }
                // }
            }
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
            var txtOfLoad = isWeiXin && isApple ? '向上拖拽加载更多' : '点击加载更多';
    		return (
    			<div className="content container-fluid stl-container" style={style} onTouchEnd={this._onTouch_scroll} >
    				{this.props.children}
                    {this.props.isSwapUpLoadable ? <div className="bottom-remind-info">{txtOfLoad}</div> : ''}
    				{this.props.isShowLoadingMark ? <div className="loading-mark-bottom"><span className="fa fa-spin fa-circle-o-notch"></span></div> : ''}
    			</div>
    		);
    	}
    });
    return STLContainer;
}
module.exports = init;

