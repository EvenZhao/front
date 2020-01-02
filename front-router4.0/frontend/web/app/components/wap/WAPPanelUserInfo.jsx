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

var WAPPanelUserInfo = React.createClass({
       propTypes: {
        data : React.PropTypes.object
    },
    getInitialState: function(){
        return {
            showSign:'',
            has_sign:'',
            sign_day:''
        };
    },
    _ManageUser: function(){
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.GET_ACCOUNT
        });
    },
    _MyCoupon: function(){
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.WAP_MYCONPON
        });
    },
    _handleSign: function(){
        console.log('this.props.data',this.props.data);
        var data = this.props.data || [];
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.SIGN,
            activityCode:data.activityCode,
            accountId: data.account_id,
            accountLevel: data.level,
            showSign: true
        });
    },
    _handleNoSign: function(){
        Dispatcher.dispatch({
            actionType: WapStore.ActionTypes.SIGN_NO,
            showSign: false
        });
    },
    _handleSIGN_NO_DONE: function(re){
        this.setState({
            showSign: false
        });
    },
    _handleSIGN_DONE: function(re){
        console.log('_handleSIGN_DONE',re);
        if (re && re.result) {
            this.setState({
                showSign: true,
                sign_day: re.result,
                has_sign: true
            });
        }
    },
    _handleSIGN_STATUS_DONE: function(re){
        console.log('_handleSIGN_STATUS_DONE',re);
        if (re) {
            this.setState({
                has_sign: re.result
            });
        }
    },
    componentDidMount: function() {
        WapStore.addEventListener(WapStore.Events.SIGN_DONE,this._handleSIGN_DONE);
        WapStore.addEventListener(WapStore.Events.SIGN_STATUS_DONE,this._handleSIGN_STATUS_DONE);
        WapStore.addEventListener(WapStore.Events.SIGN_NO_DONE,this._handleSIGN_NO_DONE);
    },
    componentWillUnmount: function() {
        WapStore.removeEventListener(WapStore.Events.SIGN_DONE,this._handleSIGN_DONE);
        WapStore.removeEventListener(WapStore.Events.SIGN_STATUS_DONE,this._handleSIGN_STATUS_DONE);
        WapStore.removeEventListener(WapStore.Events.SIGN_NO_DONE,this._handleSIGN_NO_DONE);
    },
    render: function(){
        if(!this.props.data) {
            return <div/>;
        }
        var err = 'showWrong';
        if (this.state.showSign) {
            err ='showWrong showall';
        }else{
            err = 'showWrong';
        }
        return (
            <div className="web-user">
                <div className="web-user-top">
                    <div className="div-second">
                        <div>
                            <img className="img-div" src={this.props.data.user_image} height="90px" width="90px"/>
                        </div>
                        <div className="nickname-div">
                            <span>{this.props.data.nick_name}</span>
                        </div>
                        <div className="level-div">
                            <span>{this.props.data.auth}</span>
                            <a onClick={this._ManageUser}>
                                <span className="span-img"><img src="../img/set_up.png" height="18px" width="18px"/></span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="web-user-meun">
                    <span className=""><div>积分</div><div>{this.props.data.point || 0}</div></span>
                    <span className=""><div>余额</div><div>{this.props.data.money || 0}</div></span>
                    <span className=""><div>优惠券</div><div>{this.props.data.discount || 0}</div></span>
                    <span className=""><div>待支付订单</div><div>{this.props.data.wait_pay_order || 0}</div></span>
                </div>
                <div className="web-user-img">
                    <span className="col-xs-3"><a href="./index.html?currentPg=me_index&changePanelType=MECenter"><img src="../img/user-class.png" height="65px" width="65px"/></a></span>
                    <span className="col-xs-3"><a href="./index.html?currentPg=me_index&changePanelType=MEPanelOrderResult"><img src="../img/user-order.png" height="65px" width="65px"/></a></span>
                    <span className="col-xs-3" onClick={this._MyCoupon}><img src="../img/user-price.png" height="65px" width="65px"/></span>
                    {
                        this.state.has_sign ?
                            <span className="col-xs-3" ><img src="../img/user-yqd.png" height="65px" width="65px"/></span> :
                             <span className="col-xs-3" onClick={this._handleSign}><img src="../img/user-qd.png" height="65px" width="65px"/></span>
                    }
                </div>

                <div className="allWrong">
                    <div className={err}>
                        <div className="overWrong" onClick={this._clickBlock}>
                        </div>
                    <div className="both">
                        <div className="showWrongDiv">
                            <p className="wordWrong">您已连续签到{this.state.sign_day || 0}天。</p>
                            <div className="outWrong">
                                <input className="btncloseWrong" type="button" value="确定" onClick={this._handleNoSign}/>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

            </div>
        );
    }
});
module.exports = WAPPanelUserInfo;


