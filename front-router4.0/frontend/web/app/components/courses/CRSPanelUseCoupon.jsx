var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var CoursesStore = require('../../stores/CoursesStore');
var ActionTypes = CoursesStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var cx = require('classnames');
var Item = require('./CRSPanelUseCouponItem.jsx');

var CRSPanelUseCoupon = React.createClass({
    propTypes: {
        data: PropTypes.array,
        addCouponErr: PropTypes.string
    },
    getInitialState: function(){
        return {
            data: this.props.data || [],
            addCouponCode: false,
            warnCodenull: false,
            couponStatus: true
        };
    },
    _onDiscountCodeChange: function(e){
        if (this.props.addCouponErr) {
            this.setState({
                couponStatus: false
            });
        }else{
            this.setState({
                couponStatus: true
            });
        }
        e.preventDefault();
        var v = e.target.value;
        this.setState({
            discountCode: v,
            warnCodenull: false,
            addCouponErr: false
        });
    },
    _handeAddCoupon: function(){
        this.setState({
            addCouponCode: true
        });
    },
    _handeSubmitCoupon: function(){
        var init_hash = window.location.hash.replace('#', '');
        var resource_type;
        if(init_hash && init_hash.length > 0){//handle init load specified data
            var tks = init_hash.split('-');
            if(tks && tks.length > 0){
                var resource_type = tks[1] || '';
            }
        }
        var data = this.props.data || [];
        if (this.state.discountCode) {
            this.setState({
                couponStatus: true
            });
            Dispatcher.dispatch({
                actionType: CoursesStore.ActionTypes.WEIXIN_ADD_COUPON,
                discountCode: this.state.discountCode,
                resource_type: resource_type
            });
        }else{
            this.setState({
                warnCodenull: true
            });
        }
    },
    render: function(){
        var data = this.props.data || [];
        var cls_code_warn=cx('warn-div', {'Warn-div-none': !this.state.warnCodenull});
        var cls_code_err=cx('warn-div', {'Warn-div-none': !this.state.couponStatus});
        var rows = data.map(function (item, index) {
           return (
                <Item key={index} data={item} keyWords={this.props.keyWords}/>
            );
        }.bind(this));
        var noCoupon;
        if (data.length < 1) {
                noCoupon = (
                    <div className="bottom-remind-info">
                        <h5 className="row"> ~ 共 0 条 ~ </h5>
                    </div>
                );
        }else{
            noCoupon = '';
        }
        return (
            <div className="list-group crs-search-result coupon">
                <div className="add-coupon-div">
                    {
                        this.state.addCouponCode ? 
                            <div>
                                <input className="add-coupon-input col-xs-8" placeholder="请输入体验券兑换码" value={this.state.discountCode} onChange={this._onDiscountCodeChange}/>
                                <button className="btn submit-coupon-button" onClick={this._handeSubmitCoupon}>提交</button>
                                <div className={cls_code_warn}><span>请输入体验券兑换码</span></div>
                                <div className={cls_code_err}><span>{this.props.addCouponErr}</span></div>
                            </div>
                        :
                            <div>
                                <button className="btn add-button" onClick={this._handeAddCoupon}>+ 新增体验券</button>
                            </div>   
                    }
                </div>
                {rows}
                {noCoupon}
            </div>
        );
    }
});
module.exports = CRSPanelUseCoupon;


