var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var CoursesStore = require('../../stores/CoursesStore');
var WapStore = require('../../stores/WapStore');
var ActionTypes = CoursesStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var cx = require('classnames');
var patterns = require('../patterns.js');
var dtfmt = require('../../util/format.js');

function use_coupon(data,onClickHandler,onClickUseCouponAlert,onClickNoCouponAlert,alert){
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
    var err = 'showWrong';
    if (alert) {
        err ='showWrong showalls';
    }else{
        err = 'showWrong';
    }
    return(
        <div>
            <div className="coupon-div" onClick={onClickUseCouponAlert}>
                <div className={status_cx}>
                    <div><span className="span-coupon-type">{discount_type}</span></div>
                    <div><span className="span-course-type">{Type_Or_Moeny}</span></div>
                    <div className="div-border"></div>
                    <div><span className="span-coupon-status">{status}</span></div>
                </div>
                <div className="coupon-div-right">
                    <div><span className="span-coupon-title">{title}</span></div>
                    <div><span className="span-coupon-get">{means}</span></div>
                    <div><span className="span-coupon-num">{code}</span></div>
                    <div><span className="span-coupon-time">本券在{end_use_time}前有效</span></div>
                </div>
            </div>
            <div className="allWrong">
                    <div className={err}>
                        <div className="overWrong">
                        </div>
                    <div className="both">
                        <div className="showWrongDiv">
                            <p className="wordWrong">您确定使用该优惠券吗</p>
                            <div className="outWrong">
                                <input className="btncloseWrong" type="button" value="确定" onClick={onClickHandler}/>
                                <input className="btncloseWrong" type="button" value="取消" onClick={onClickNoCouponAlert}/>
                            </div>
                        </div>
                    </div>
                    </div>
            </div>
        </div>
    );
}

var CRSPanelUseCouponItem = React.createClass({
    propTypes: {
       data : React.PropTypes.object
    },
    getInitialState: function(){
        return {
            
        };
    },
    _onClickHandler: function(e){
        e.preventDefault();
        var data = this.props.data || [];
        if (this.state.alert) {
            this.setState({
                alert: false
            });
        }
        Dispatcher.dispatch({
            actionType: ActionTypes.WEIXIN_USE_COUPON,
            resource_id: localStorage.getItem("resourceId") || '',
            resource_type: data.type,
            discountCode: data.code
        });
    },
    _onClickUseCouponAlert: function(e){
        this.setState({
            alert: true
        });
        // Dispatcher.dispatch({
        //     actionType: ActionTypes.WEIXIN_COUPON_ALERT,
        //     alert: true
        // });
    },
    _onClickNoCouponAlert: function(e){
        this.setState({
            alert: false
        });
        // Dispatcher.dispatch({
        //     actionType: ActionTypes.WEIXIN_COUPON_ALERT,
        //     alert: true
        // });
    },
    _handleWEIXIN_COUPON_ALERT_DONE: function(re){
        this.setState({
            alert: true
        });
    },
    componentDidMount: function() {
        CoursesStore.addEventListener(CoursesStore.Events.WEIXIN_COUPON_ALERT_DONE,this._handleWEIXIN_COUPON_ALERT_DONE);
    },
    componentWillUnmount: function() {
        CoursesStore.removeEventListener(CoursesStore.Events.WEIXIN_COUPON_ALERT_DONE,this._handleWEIXIN_COUPON_ALERT_DONE);
    },
    render: function(){
        var data = this.props.data;
        return use_coupon(data,this._onClickHandler,this._onClickUseCouponAlert,this._onClickNoCouponAlert,this.state.alert);
    }
});
module.exports = CRSPanelUseCouponItem;


