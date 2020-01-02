var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var MeStore = require('../../stores/MeStore');
var ActionTypes = MeStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var PanelOrderList = require('../../components/courses/CRSPanelOrderList.jsx')(Dispatcher);
var cx = require('classnames');
var patterns = require('../patterns.js');
var dtfmt = require('../../util/format.js');

var PropType_data = function (props, propName, component) {
    if ( !props[propName].id ){
        return new Error('Invalid id!');
    }
    if ( !props[propName].title || typeof props[propName].title !== 'string' ){
        return new Error('Invalid title!');
    }
};

var MEPanelOrderResult = React.createClass({
    propTypes: {
        data: PropTypes.any,
        keyWord: React.PropTypes.any
    },
    getInitialState: function(){
        return {
            data: this.props.data || [],
            valid_Completed_status:true,
            valid_Tobepaid_status:true
        };
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    render: function(){
        var data = this.props.data || [];
        var cls_Completed_status= cx('ME_order_Completed_status_span', {'ME_order_Tobepaid_status_span': !this.state.valid_Completed_status});
        var cls_Tobepaid_status=cx('ME_order_Tobepaid_status_span', {'ME_order_Completed_status_span': !this.state.valid_Tobepaid_status});
        var rows = data.map(function (item,index) {
            var status='';
            var cls_status='';
            var order_time = item && item.order_time ? new Date(item.order_time).format(dtfmt.DATE_TIME) : '';
            if (item.isPayed) {
                status='已完成';
                cls_status=cls_Completed_status;
            }else{
                 status='待付款';
                 cls_status=cls_Tobepaid_status;
            }
           return (      
                <div className="panel" key={index}>
                    <div className="ME_pay_div">
                        <span className="ME_order_left_span">订单创建于：{order_time} </span>
                        <span className={cls_status}> {status} </span>
                    </div>
                    <PanelOrderList key={index} data={item.lessonInfo} isPayed={item.isPayed} keyWord={this.props.keyWord} orderId={item.orderId}/>
                </div>
            );
        }.bind(this));
        return (
            <div className="panel suggest">
                <div className="panel-body">
                    {rows}
                </div>
            </div>
        );
    }
});
module.exports = MEPanelOrderResult;


