var Dispatcher;
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var dtfmt = require('../../util/format.js');
var patterns = require('../patterns.js');
var keyMirror = require('keymirror');
var dm = require('../../util/DmURL.js');
var url_member_default = dm.getUrl_home('/img/bind_02.png');

var Events = keyMirror({
    BIND_DONE:null,
    REGISTER_DONE:null,
    GET_REGISTER_CODE_DONE:null,
    UNBIND_DONE:null,
    SHOW_USER_DONE:null
});


var ActionTypes = keyMirror({
    BIND:null,
    REGISTER:null,
    GET_REGISTER_CODE:null,
    UNBIND:null,
    SHOW_USER:null
});

var DEFAULT_FREEZETIME = 60;

var countdown;// countdown intervalObj

function getTheState(){
    return {
        valid_exitbind_warn:false,
        nickName: React.PropTypes.string,
        photo: React.PropTypes.string,
        phone: React.PropTypes.string,
        email: React.PropTypes.string,
        name: React.PropTypes.string,
        levelName: React.PropTypes.string,
        customerStaffName: React.PropTypes.string,
        customerStaffPhone: React.PropTypes.string,
        customerStaffEmail: React.PropTypes.string
    };
}
var MEPanelUnBind;
function init(dispatcher,store){
    if (MEPanelUnBind) {
        return MEPanelUnBind;
    }
    Dispatcher = dispatcher;
    var Store = store;
    MEPanelUnBind = React.createClass({
        ActionTypes: ActionTypes,
        Events:Events,
    	propTypes: {
    		// data: React.PropTypes.array.isRequired,
    		// title: React.PropTypes.string
            isShowExitBindMark: React.PropTypes.bool
    	},
    	getInitialState: function(){
            return getTheState();
        },
        _onChange: function(){
            this.setState(getTheState());
        },
        _handleBIND_DONE:function(re){
            if (re.detail.nickName) {
                // this.setState({
                //     nickName:re.detail.nickName
                // });
            }
        },
        _handleGETREGISTERCODE_DONE:function(re){
            if (re.detail) {
                this.setState({
                       valid_phone_user_warn:false
                    });

            }
            if (re.err) {
                this.setState({
                    valid_phone_user_warn: true,
                    err_message: re.err,
                    isSmsSent:false
                }); 
             }
        },
        _handleUNBIND_DONE:function(re){
            if (re.detail.isUnBinded) {
                // alert('解绑成功');
                // window.history.go(-1);
        }else{
            this.setState({
                valid_exitbind_warn:true       
            });
        }
        },
        _onClickExitBinD:function(){
            Dispatcher.dispatch({
                actionType: ActionTypes.UNBIND
            });
        },
        _handleSHOW_USER_DONE:function(re){
            
        },
        componentDidMount: function() {
           store.addEventListener(this.Events.BIND_DONE,this._handleBIND_DONE);
           store.addEventListener(this.Events.SHOW_USER_DONE,this._handleSHOW_USER_DONE);
           store.addEventListener(this.Events.UNBIND_DONE,this._handleUNBIND_DONE);
        },
        componentWillUnmount: function() {
           store.removeEventListener(this.Events.BIND_DONE,this._handleBIND_DONE);
           store.removeEventListener(this.Events.UNBIND_DONE,this._handleUNBIND_DONE);
           store.removeEventListener(this.Events.SHOW_USER_DONE,this._handleSHOW_USER_DONE);
        },
    	render: function(){
            var cls_exitbind_warn=cx('ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_exitbind_warn});
            var exit_bind=(
                <div className="ME_register_main_div panel">
                    <div className="ME_exit_bind_icon_div">
                        <div className="ME_exit_bind_title_div">
                            <div> 尊敬的{this.props.nickName || '铂略会员'}</div>
                            <div>您的铂略帐号已绑定！</div>
                        </div>
                        <div height="30">
                           <img className="ME_unbind_img_left" alt="铂略" src="../img/150.png" height="60" width="60" />
                           <img className="ME_unbind_img_middle" alt="铂略" src="../img/bind_01.png" height="42" width="56"/>
                           <img className="ME_unbind_img_right" alt="铂略" src={this.props.photo || url_member_default} height="60" width="60"/>
                        </div>
                    </div>

                    <div className="ME_register_div" > 
                        <div className="ME_bind_member_one"><span>手机:{this.props.phone || '未完善'}</span></div>
                        <div className="ME_bind_member"><span>邮箱:{this.props.email || '未完善'}</span></div>
                        <div className="ME_bind_member"><span>姓名:{this.props.name || '未完善'}</span></div>
                        <div className="ME_bind_member"><span>昵称:{this.props.nickName || '未完善'}</span></div>
                        <div className="ME_bind_member"><span>会员级别:{this.props.levelName || '未完善'}</span></div>
                        {this.props.customerStaffName ? <div className="ME_bind_member"><span>学服:{this.props.customerStaffName || ''}</span></div> :''}
                        {this.props.customerStaffPhone ? <div className="ME_bind_member"><span>学服电话:{this.props.customerStaffPhone || ''}</span></div> :''}
                        {this.props.customerStaffEmail ? <div className="ME_bind_member"><span>学服邮箱:{this.props.customerStaffEmail || ''}</span></div> :''}
                        <div className="ME_bind_vip_div">
                            <span>请将此页面截图发送给粉铂</span>
                        </div>
                        <div>
                            <img className="ME_bind_vip_img" src="../img/linkedffenbo.jpg"/>
                        </div>
                        <div className={cls_exitbind_warn} id="oldpwd_div">
                            解绑失败请联系客服！
                        </div>            
                        <div className="ME_button_div">
                              <button type="button" className="btn btn-primary ME_btn_submit" onClick={this._onClickExitBinD}>解除绑定</button>
                        </div>
                    </div>
                </div>
            );

    		return (
                <div className="panel register">
                        {exit_bind}
                </div>
    		);
    	}
    });
    return MEPanelUnBind;
}
module.exports = init;

