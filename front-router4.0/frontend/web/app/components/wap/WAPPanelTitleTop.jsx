var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var WapStore = require('../../stores/WapStore');
var ActionTypes = WapStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var cx = require('classnames');
var patterns = require('../patterns.js');
var dtfmt = require('../../util/format.js');

function backTop (argument) {
    window.history.go(-1);
}

var WAPPanelTitleTop = React.createClass({
    propTypes: {
       titleTop: React.PropTypes.any
    },
    getInitialState: function(){
        return {
            
        };
    },
    _handBackTop: function(){
        backTop();
    },
    _handcomputer: function(){
        window.location.href="www.bolue.cn"
    },
    _handAddCoupon: function(){
        console.log('_handAddCoupon');
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.SHOW_DIV,
            showAddCoupon: true,
            err: true,
            status: true
        });
    },
    componentDidMount: function() {
        console.log('ssssssssss',this.props.titleTop);
    },
    componentWillUnmount: function() {
    },
    render: function(){
        var coupon_clx;
        if (this.props.titleTop === '我的优惠券') {
            coupon_clx = 'add-coupon';
        }else{
            coupon_clx = 'add-coupon-none';
        }
        return (
            <div className="wap-title-top">
                <span className="back" onClick={this._handBackTop}>
                    <img src="../img/top_back.png" height="25" width="14"/>
                    返回
                </span>
                <span className="title">{this.props.titleTop}</span>
                <span className={coupon_clx} onClick={this._handAddCoupon}>新增优惠券</span>
            </div>
        );
    }
});
module.exports = WAPPanelTitleTop;


