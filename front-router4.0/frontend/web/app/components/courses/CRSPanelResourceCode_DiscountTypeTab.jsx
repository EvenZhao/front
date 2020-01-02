var React = require('react');
var PropTypes = React.PropTypes;
var Dispatcher = require('../../dispatcher/AppDispatcher.js');
var assign = require('object-assign');
var cx = require('classnames');
var CoursesStore = require('../../stores/CoursesStore');
var DiscountTypes = CoursesStore.DiscountTypes;

var CRSPanelResourceCode_DiscountTypeTab = React.createClass({
	propTypes:{
		active: PropTypes.string
	},
	getInitialState: function(){
		return {
			active: this.props.active || DiscountTypes.money
		};
	},
    _onClick_filter: function(e){
        var v = e.target.id;
        this.setState({
            active: v
        }, function() {
            Dispatcher.dispatch({
                actionType: CoursesStore.ActionTypes.DISCOUNT_TAB_CHANGE,
                active: v
            });
        });
    },
    _handleDISCOUNT_TAB_CHANGE_DONE: function(re){
        this.setState({
            active: re.active
        });
    },
    componentDidMount: function() {
        CoursesStore.addEventListener(CoursesStore.Events.DISCOUNT_TAB_CHANGE_DONE, this._handleDISCOUNT_TAB_CHANGE_DONE);
    },
    componentWillUnmount: function() {
        CoursesStore.removeEventListener(CoursesStore.Events.DISCOUNT_TAB_CHANGE_DONE, this._handleDISCOUNT_TAB_CHANGE_DONE);
    },
    clsFilter: function(filter) {
        return cx(
                'btn',
                // 'col-xs-6',
                'col-xs-12',
                {active: this.state.active === filter }
            );
    },
	render: function(){
		return (
			<div className="tab-nav container">
                {/*<div type="button" className={this.clsFilter(DiscountTypes.trail)} id={DiscountTypes.trail} onClick={this._onClick_filter} >体验券</div>*/}
                <div type="button" className={this.clsFilter(DiscountTypes.money)} id={DiscountTypes.money} onClick={this._onClick_filter} >现金券</div> 
            </div>
		);
	}
});
module.exports = CRSPanelResourceCode_DiscountTypeTab;

