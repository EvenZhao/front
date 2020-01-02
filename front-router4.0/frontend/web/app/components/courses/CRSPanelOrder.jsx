var React = require('react');
var PropTypes = React.PropTypes;
var Dispatcher = require('../../dispatcher/AppDispatcher.js');
var cx = require('classnames');
var CoursesStore = require('../../stores/CoursesStore.js');
var DiscountTypes = CoursesStore.DiscountTypes;

function getLessonName(lessonType) {
    switch(lessonType) {
        case 'product': return '专题课';
        case 'online_info': return '视频课';
        case 'offline_info': return '线下课';
        case 'live_info': return '直播课';
    }
}

function getLessonSymbol(lessonType) {
    switch(lessonType) {
        case 'product': return '专';
        case 'online_info': return '视';
        case 'offline_info': return '线';
        case 'live_info': return '直';
    }
}

var PUseDiscount = React.createClass({
	propTypes:{
		onClick: PropTypes.func,
		discount: PropTypes.object,
		changeable: PropTypes.bool
	},
	getInitialState: function(){
        return  {
        	
        };
    },
    _onClick: function(e){
    	if(this.props.onClick) {
    		this.props.onClick();
    	}
    },
    componentDidMount: function() {
    	// CoursesStore.addEventListener(CoursesStore.Events.ADD_RESOURCE_CODE_DONE, this._handleADD_RESOURCE_CODE_DONE);
    },
    componentWillUnmount: function() {
    	// CoursesStore.removeEventListener(CoursesStore.Events.ADD_RESOURCE_CODE_DONE, this._handleADD_RESOURCE_CODE_DONE);
    },
	render: function(){
        var head = '';
		var price = '';
		var discount = this.props.discount;
		switch(discount.discountType) {
            case DiscountTypes.trail: 
                head = getLessonName(discount.lessonType) + '体验';
                break;
            case DiscountTypes.money: 
                var money_arr = (discount.equal_money + '').split('.');
                var money = money_arr[0] ? money_arr[0] : discount.equal_money;
                head = '现金'; 
                price = <span className="price"><span className="currency-symbol">- ¥</span>{money}</span>;
                break;
        }
		return (
			<div className="panel btn-panel use-discount" onClick={this._onClick}>
                <div className="panel-body ">
                	<div className="container col-xs-12">
	                	<div className="col-xs-6 head">{head}<span className="coupon-symbol">券</span></div>
	                	<div className="col-xs-5 tail">{price}</div>
	                	{ this.props.changeable ? <i className="col-xs-1 fa fa-2x fa-angle-right angle "/> : '' }
                	</div>
                </div>
			</div>
		);
	}
});

var CRSPanelOrder = React.createClass({
	propTypes:{
		order: PropTypes.object,
		courseType: PropTypes.string
	},
	_onPAY: function(){
		Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.PAY,
            order: this.props.order
        });
	},
	_onUNIFY_ORDER: function(){
		Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.UNIFY_ORDER,
            order: this.props.order
        });
	},
	_onGET_RESOURCE_CODE: function(){
		// var unified = this.props.order.order_status === 1 ? true : false;
		// if(unified) { // already unified
		// 	return;
		// }
		Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.GET_RESOURCE_CODE,
            courseType: this.props.courseType
        });
	},
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    _showItems: function() {
    	var order = this.props.order;
		return (
			(order && order.items) ? order.items.map(function(item, index){
				return (
					<div key={index} className="panel item">
		                <div className="panel-body">
		                	<div className="row">
								<img className="col-xs-5 img" src={item.brief_image} alt=""/>
								<div className="col-xs-7 right-txt">
									<div className="title">{item.title}</div>
									<div className="price">¥{item.price}</div>
								</div>
							</div>
		                </div>
					</div>
				);
			}) : []
		);
    },
	render: function(){
		var order = this.props.order;
		var items = this._showItems();
		var discount = (order.discounts && order.discounts[0]) ? order.discounts[0] : null;
		var unified = false;
		var changeable = false;
		switch(this.props.order.order_status){
			case 0: changeable = true; break;
			case 1: unified = true; break;
		}
		var puseDiscount = discount ? 
				<PUseDiscount discount={discount} onClick={changeable ? this._onGET_RESOURCE_CODE : null} /> 
				: (<div className="panel btn-panel use-discount discount-not-chosen" onClick={changeable ? this._onGET_RESOURCE_CODE : null}>
		                <div className="panel-body ">
		                	<div className="container col-xs-12">
								<div className="col-xs-6 txt"><i className="fa fa-ticket"/>&nbsp;&nbsp;使用优惠券</div>
			                	<div className="col-xs-5"></div>
			                	{changeable ? <i className="col-xs-1 fa fa-2x fa-angle-right angle " /> : ''}
		                	</div>
		                </div>
					</div>);
		var btn_affirm = unified ? <div className="btn btn-primary col-xs-3" onClick={this._onPAY}>支付</div> : <div className="btn btn-primary col-xs-3" onClick={this._onUNIFY_ORDER}>确认下单</div> ;
		var lbl_total_price = '总金额: ';
		if(unified) {
			btn_affirm = <div className="btn btn-primary col-xs-8" onClick={this._onPAY}>支付</div>;
			lbl_total_price = '应付总额: ';
		} else if (changeable) {
			btn_affirm = <div className="btn btn-primary col-xs-8" onClick={this._onUNIFY_ORDER}>确认下单</div> ;
		} else {
			btn_affirm = '';
		}
		var cls = cx('content', 'order', {unchangeable: !changeable});
		return (
			<div className={cls}>
				{items}
				{puseDiscount}
				<div className="panel total">
	                <div className="panel-body">
	                	<div className="container">
							<div className="col-xs-4">{lbl_total_price}</div>
							<div className="col-xs-4 ori-price">&nbsp;&nbsp;¥{order.totalPrice}&nbsp;&nbsp;</div>
							<div className="col-xs-4 total-price">¥{order.newTotalPrice}</div>
						</div>
						<div className="container col-xs-12">
							<div className="col-xs-12 auth-date">{order.auth_date || ''}</div>
							<div className="col-xs-6"></div>
							<div className="col-xs-6 right">{ btn_affirm }</div>
						</div>
	                </div>
				</div>
			</div>
		);
	}
});
module.exports = CRSPanelOrder;


