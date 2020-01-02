var React = require('react');
var PropTypes = React.PropTypes;
var Dispatcher = require('../../dispatcher/AppDispatcher');
var CoursesStore = require('../../stores/CoursesStore');
var ActionTypes = CoursesStore.ActionTypes;
var dtfmt = require('../../util/format.js');
var patterns = require('../patterns.js');
var assign = require('object-assign');
var util =  require('util'),
    f = util.format;
var DiscountTypes = CoursesStore.DiscountTypes;
var CRSPanelResourceCode_DiscountTypeTab = require('./CRSPanelResourceCode_DiscountTypeTab.jsx');

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

var Item = React.createClass({
	propTypes:{
		data: PropTypes.object,
        discountType: PropTypes.string
	},
	_onSELECT_RESOURCE_CODE: function(){
        CoursesStore.emit(CoursesStore.Events.SELECT_RESOURCE_CODE_DONE, {
            discounts: [assign({}, this.props.data, {discountType: this.props.discountType})]
        });
	},
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
	render: function(){
		var data = this.props.data;
		var end_time = new Date(data.end_use_time).format(patterns.LDATE);
		var now = Date.now();
		var expiration = <div className="end_time">{ now > data.end_time ? <span className="expired">已过期</span> : f('有效期至 ', end_time)}</div>;
        var desc = '';
        var head = '';

        
        switch(this.props.discountType) {
            case DiscountTypes.trail: 
                desc = getLessonName(data.lessonType) + '体验券';
                head = <span className="big-txt">{getLessonSymbol(data.lessonType)}</span>;
                break;
            case DiscountTypes.money: 
                var money_arr = (data.equal_money + '').split('.');
                var money = money_arr[0] ? money_arr[0] : data.equal_money;
                head = <span className="big-txt"><span className="currency-symbol">¥</span>{money}</span>;
                desc = '现金券'; 
                break;
        }

		return (
			<div className="list-group resource-code-item" onClick={this._onSELECT_RESOURCE_CODE}>
	          <div className="list-group-item container">
	            <div className="col-xs-4 left-head">{head}</div>
	            <div className="col-xs-8 right-content">
                   <div className="desc">{desc}</div>
                   {expiration}
                </div>
	          </div>
	        </div>
		);
	}
});

var testdiscountCode = /^.{0,10}$/g;
var CRSPanelResourceCode = React.createClass({
	propTypes:{
		active: PropTypes.string,
		discounts: PropTypes.object,
		discountCode: PropTypes.string
	},
	getInitialState: function(){
        return  {
        	active: this.props.active || DiscountTypes.money,
        	discountCode: ''
        };
    },
    _onNewcodeChange: function(e) {
    	var v = e.target.value.trim();
        if (v.search(testdiscountCode) > -1) {
	        this.setState({
	            discountCode: v 
	        });
        }
    },
    _onADD_RESOURCE_CODE: function(e){
    	var discountCode = this.state.discountCode;
    	if(discountCode && discountCode.length > 0){
		    Dispatcher.dispatch({
		        actionType: CoursesStore.ActionTypes.ADD_RESOURCE_CODE,
		        discountCode: this.state.discountCode
		    });
    	}

    },
    _onKeyUp_discountCode: function(e) {
        if (e.keyCode === 13) {
            this._onADD_RESOURCE_CODE();
        }
    },
    _onNoDiscount: function(e) {
        CoursesStore.emit(CoursesStore.Events.SELECT_RESOURCE_CODE_DONE, {
            discounts: []
        });
    },
    _onGET_REDEEM: function(e) {
    	Dispatcher.dispatch({
	        actionType: CoursesStore.ActionTypes.GET_REDEEM
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

	render: function(){
		var count = 0;
		var active_discounts = this.props.discounts[this.state.active];
		var p = active_discounts ? active_discounts.map(
			item => <Item key={count++} data={item} discountType={this.state.active}/>
		) : ''; 
		return (
			<div className="content resource-code">
				<div className="panel btn-panel" onClick={this._onGET_REDEEM}>
	                <div className="panel-body ">
	                	<div className="container col-xs-12">
		                	<div className="col-xs-11 txt"><i className="fa fa-exchange"/>&nbsp;&nbsp;兑换优惠券</div>
		                	<i className="col-xs-1 fa fa-2x fa-angle-right angle "/>
	                	</div>
	                </div>
				</div>
                <div className="panel btn-panel no-discount" onClick={this._onNoDiscount}>
                    <div className="panel-body">
                        <div className="container center-label col-xs-12">
                            <span className="">不使用优惠券</span>
                        </div>
                    </div>
                </div>
				<CRSPanelResourceCode_DiscountTypeTab />
				<div className="panel resource-code-list">
					<div className="panel-body">
						{p}
					</div>
				</div>
			</div>
		);
	}
});
module.exports = CRSPanelResourceCode;
