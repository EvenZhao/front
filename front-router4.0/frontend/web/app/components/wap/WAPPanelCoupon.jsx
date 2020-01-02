var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var MeStore = require('../../stores/MeStore');
var WapStore = require('../../stores/WapStore');
var ActionTypes = MeStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var cx = require('classnames');
var patterns = require('../patterns.js');
var dtfmt = require('../../util/format.js');

function use_coupon(data){
    var discount_type = data && data.discount_type ? data.discount_type :'';//优惠券类型(中文）
    var chineseLessonType =data && data.chineseLessonType ? data.chineseLessonType :'';//适用课程类型（中文）
    var status = data && data.status ? data.status :''; //状态：有效，已使用，过期，转赠，冻结
    var equal_money = data && data.equal_money ? data.equal_money :''; //优惠金额（现金券场合)
    // var end_use_time = data.end_use_time ? data.end_use_time :''; //截止使用日期
    var means = data.means ? data.means : ''; //获取方式
    var title = data.title ? data.title : ''; //标题
    var code = data.code ? data.code :''; //优惠券编码
    var end_use_time = data && data.end_use_time ? new Date(data.end_use_time).format(patterns.LDATE + patterns.TIME) : '';//截止使用日期
    var status_cx;
    switch(status){
        case '有效':
            status_cx='coupon-div-left coupon-div-left-bggreen';
        break;
        case '已使用':
            status_cx='coupon-div-left coupon-div-left-bg';
        break;
        case '过期':
            status_cx='coupon-div-left coupon-div-left-bggray';
        break;
        default :status_cx='coupon-div-left coupon-div-left-bggreen';
    }
    var Type_Or_Moeny;
    switch(discount_type){
        case '体验券':
            Type_Or_Moeny = chineseLessonType;
        break;
        case '现金券':
            Type_Or_Moeny = '￥'+equal_money;
        break;
    }
    return(
        <div className="coupon-div">
            <div className={status_cx}>
                <div><span className="span-coupon-type">{discount_type}</span></div>
                <div><span className="span-course-type">{Type_Or_Moeny}</span></div>
                <div className="div-border"></div>
                <div><span className="span-coupon-status">{status}</span></div>
            </div>
            <div className="coupon-div-right">
                <div><span className="span-coupon-title">{title}</span></div>
                <div><span className="span-coupon-get">{means}</span></div>
                <div><span className="span-coupon-num">券号:{code}</span></div>
                <div><span className="span-coupon-time">本券在{end_use_time}前有效</span></div>
            </div>
        </div>
    );
}

var WAPPanelCoupon = React.createClass({
    propTypes: {
       data : React.PropTypes.object
    },
    getInitialState: function(){
        return {
            
        };
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    render: function(){
        var data = this.props.data;
        return use_coupon(data);
    }
});
module.exports = WAPPanelCoupon;


