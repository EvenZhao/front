var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var WapStore = require('../../stores/WapStore');
var ActionTypes = WapStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var Item = require('./WAPPanelCoupon.jsx');

var WAPPanelCouponResult = React.createClass({
    propTypes: {
        data: PropTypes.array,
        keyWords: React.PropTypes.array,
        showAddCoupon: React.PropTypes.any,
        coupons: React.PropTypes.string,
        err: React.PropTypes.any,
        status: React.PropTypes.any
    },
    getInitialState: function(){
        var message =  this.props.coupons
        return {
            data: this.props.data || []
        };
    },
    _addCoupons: function(e){
        e.preventDefault();
        //定位input框中的值
        var v = jQuery('.ins').val();
        console.log('vvvvvv',v);
        this.setState({
            coupons: v
        }, function(){
            if (this.state.coupons === ''){
                console.log('222222222');
                return;
            }else{
                console.log('3333333333');
                Dispatcher.dispatch({
                    actionType: WapStore.ActionTypes.ADD_COUPONS,
                    coupons: this.state.coupons,
                    showAddCoupon: false
                });
            }
        });
    },
    _wrongCoupons: function(e){
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.SHOW_DIV,
            err: true
        });
    },
    _trueCoupons: function(e){
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.SHOW_DIV,
            status: true
        });
    },
    _cancelDiv: function(e){
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.SHOW_DIV,
            showAddCoupon: false
        });
    },
    _clickBlock: function(e){
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.SHOW_DIV,
            showAddCoupon: false,
            err: true,
            status: true
        });
    },
    render: function(){
        var data = this.props.data || [];
        console.log('data',data);
        var rows = data.map(function (item, index) {
           return (
                <Item key={index} data={item} keyWords={this.props.keyWords}/> 
            );
        }.bind(this));
        var showCoupon;
        if (this.props.showAddCoupon) {
            console.log(this.props.showAddCoupon);
            showCoupon = 'all showall';
            jQuery(".ins").val('');
        }else{
            showCoupon = 'all';
        }
        var err;
        if(this.props.err === '您输入的优惠券不存在' || this.props.err === '您输入的优惠券已经过期' || this.props.err === '您已经添加过该优惠券'){
            err = 'showWrong showalls';
        }else{
            err = 'showWrong';
        }
        var status;
        if(this.props.status === null){
            status = 'showTrue showallTrue';
        }else{
            status = 'showTrue';
        }
        return (
            <div className="wap-coupon">
                {rows}
            <div className="allDiv">
                <div className={showCoupon}>
                    <div className="over" onClick={this._clickBlock}>
                    </div>
                <div className="both">
                    <div className="show">
                        <p className="word">请输入您的优惠券券号:</p>
                        <div className="in">
                            <input className="ins" type="text"/>
                        </div>
                        <div className="out">
                            <input className="btnclose" type="button" value="提交" onClick={this._addCoupons} />
                            <input className="btncloseCancel" type="button" value="取消" onClick={this._cancelDiv}/>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            {/*优惠券错误*/}
            <div className="allWrong">
                <div className={err}>
                    <div className="overWrong" onClick={this._clickBlock}>
                    </div>
                <div className="both">
                    <div className="showWrongDiv">
                        <p className="wordWrong">对不起,<br />您输入的优惠券无效，<br />请检查之后重新输入。</p>
                        <div className="outWrong">
                            <input className="btncloseWrong" type="button" value="确定" onClick={this._wrongCoupons}/>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            {/*优惠券正确*/}
            <div className="allTrue">
                <div className={status}>
                    <div className="overTrue" onClick={this._clickBlock}>
                    </div>
                <div className="both">
                    <div className="showTrueDiv">
                        <p className="wordTrue">您输入的优惠券<br />已经添加到您的账户中,<br />请查看确认。</p>
                        <div className="outTrue">
                            <input className="btncloseTrue" type="button" value="确定" onClick={this._trueCoupons}/>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        );
    }
});
module.exports = WAPPanelCouponResult;


