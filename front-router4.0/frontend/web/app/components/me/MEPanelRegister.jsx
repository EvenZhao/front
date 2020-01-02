var Dispatcher;
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var dtfmt = require('../../util/format.js');
var patterns = require('../patterns.js');
var keyMirror = require('keymirror');

var Events = keyMirror({
    BIND_DONE:null,
    REGISTER_DONE:null,
    GET_REGISTER_CODE_DONE:null
});


var ActionTypes = keyMirror({
    BIND:null,
    REGISTER:null,
    GET_REGISTER_CODE:null
});
var testmobile = /^[0-9]{0,13}$/g;

var testphone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

var registerCode_input = /^([0-9]{0,6})$/;

var testmail = /^(\w)+(\.\w+)*@(.)+((\.\w+)+)$/;

var DEFAULT_FREEZETIME = 60;

var countdown;// countdown intervalObj

function getTheState(){
    return {
        mobile: '',
        newPwd:'',
        valid_mobile: true,
        valid_mobile_warn: false,
        valid_mobile_error:false,
        valid_registerCode: true,
        valid_registerCode_warn: false,
        valid_newpwd: true,
        valid_newpwd_warn: false,
        phone: '',
        valid_phone: true,
        valid_phone_warn: false,
        password: '',
        valid_password:true,
        valid_password_warn: false,
        registerCode:'',
        isSmsSent: false,
        ChangeRegisterDiv: true,
        ChangeBindDiv:false,
        valid_phone_user_warn: false,
        valid_phone_fail_warn: false,
        valid_bind_fail_warn: false,
        err_message: '',
        valid_phone_eamil_error:false
    };
}
var MEPanelRegister;
function init(dispatcher,store){
    if (MEPanelRegister) {
        return MEPanelRegister;
    }
    Dispatcher = dispatcher;
    var Store = store;
    MEPanelRegister = React.createClass({
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
        _onRegisterPhoneChange: function(e){
            e.preventDefault();
            var v = e.target.value.trim();
            var divfalse=false;
            if (v.search(testmobile) > -1) {
                this.setState({
                    mobile: v, //need ori str without be trimed to display only
                    valid_mobile: v.length === 0 || v.search(testmobile) > -1,
                    valid_mobile_warn:divfalse,
                    valid_phone_fail_warn:false,
                    valid_phone_user_warn:false,
                    valid_mobile_error:false
                });
            }
        },
        _onRegisterPassWordChange: function(e){
            e.preventDefault();
            var v = e.target.value.trim();
            var divfalse=false;
            this.setState({
                newPwd: e.target.value,
                valid_newpwd:true,
                valid_newpwd_warn:divfalse,
                valid_phone_fail_warn:false,
                valid_phone_user_warn:false,
                valid_mobile_error:false
            });
        },
        _onChange_registerCode: function(e){
            e.preventDefault();
            var v = e.target.value.trim();
            var divfalse=false;
            if (v.search(registerCode_input) > -1) {
                this.setState({
                    registerCode: v, //need ori str without be trimed to display only
                    valid_registerCode:v.length === 0 || v.search(registerCode_input) > -1,
                    valid_registerCode_warn:divfalse,
                    valid_phone_fail_warn:false,
                    valid_phone_user_warn:false,
                    valid_mobile_error:false
                });
            }
        },
         _onBindPhoneChange: function(e){
            e.preventDefault();
            var v = e.target.value.trim();
            var divfalse=false;
                this.setState({
                    phone: v, //need ori str without be trimed to display only
                    valid_phone: true,
                    valid_phone_warn: divfalse,
                    valid_bind_fail_warn:false,
                    valid_phone_eamil_error:false,
                    valid_password_warn:false,
                    valid_password:true
                });
        },
        _onBindPassWordChange: function(e){
            e.preventDefault();
            var v = e.target.value.trim();
            var divfalse=false;
            this.setState({
                password: e.target.value,
                valid_password:true,
                valid_password_warn:divfalse,
                valid_bind_fail_warn:false,
                valid_phone_eamil_error:false,
                valid_phone_warn:false,
                valid_phone:true
            });
        },
        _onClick_btnSendCode: function(e){
            e.preventDefault();
            if (this.state.mobile.search(testphone) > -1) {
                this.setState({
                    valid_mobile:true,
                    valid_mobile_error:false
                });
            }else{
                this.setState({
                    valid_mobile:false,
                    valid_mobile_error:true,
                    valid_mobile_warn: false,
                    valid_registerCode_warn:false,
                    valid_newpwd_warn:false,
                    cls_phone_user_warn:false
                });
                return false;
            }
            if(!this.state.isSmsSent){
                //freeze bt & countdown
                this.setState({
                    isSmsSent: true,
                    freezeTime: DEFAULT_FREEZETIME
                });
                countdown = setInterval(function(){
                    if( this.state.freezeTime > 0 ){
                        this.setState({
                            freezeTime: this.state.freezeTime - 1
                        });
                    } else {
                        clearInterval(countdown);
                        this.setState({
                            isSmsSent: false
                        });
                    }
                }.bind(this), 1000);
                //actual sent to server
                Dispatcher.dispatch({
                    actionType: ActionTypes.GET_REGISTER_CODE,
                    telephone: this.state.mobile
                });

            }
        },
        _onChange: function(){
            this.setState(getTheState());
        },
        _onChangeChangeRegister:function(){
            // console.log('_onChangeChangeRegister');
            var _ChangeRegisterDiv=false;
            var _ChangeBindDiv=true;
            this.setState({
                ChangeRegisterDiv: _ChangeRegisterDiv
            });
        },
        _onChangeChangeBinding:function(){
            // console.log('_onChangeChangeBinding');
            var _ChangeRegisterDiv=true;
            var _ChangeBindDiv=false;
            this.setState({
                ChangeRegisterDiv: _ChangeRegisterDiv
            });
        },
        _onClickBySubmit: function(e){
            var validmobile = true;
            var _validmobile = false;
            if (this.state.mobile) {
                this.setState({
                    valid_mobile: validmobile,
                    valid_mobile_warn:_validmobile
                });
                 if (this.state.mobile.search(testphone) > -1) {
                    this.setState({
                        valid_mobile:true,
                        valid_mobile_error:false
                    });
                }else{
                    this.setState({
                        valid_mobile:false,
                        valid_mobile_warn:false,
                        valid_mobile_error:true,
                        valid_registerCode_warn:false,
                        valid_newpwd_warn:false
                    });
                        return false;
                }
            }else{
                 this.setState({
                    valid_mobile: _validmobile,
                    valid_mobile_warn:validmobile,
                    valid_mobile_error:false,
                    valid_registerCode_warn:false,
                    valid_newpwd_warn:false,
                    cls_phone_user_warn:false
                });
                this.refs.telephone.focus();
                return false;
            }
             if (this.state.registerCode) {
                this.setState({
                    valid_registerCode: validmobile,
                    valid_registerCode_warn:_validmobile
                });
            }else{
                 this.setState({
                    valid_registerCode: _validmobile,
                    valid_registerCode_warn:validmobile,
                    valid_mobile_error:false,
                    valid_newpwd_warn:false,
                    cls_phone_user_warn:false
                });
                this.refs.registerCode.focus();
                return false;
            }
            if (this.state.newPwd) {
                this.setState({
                    valid_newpwd: validmobile,
                    valid_newpwd_warn:_validmobile
                });
            }else{
                 this.setState({
                    valid_newpwd: _validmobile,
                    valid_newpwd_warn:validmobile,
                    valid_mobile_error:false,
                    valid_registerCode_warn:false,
                    cls_phone_user_warn:false
                });
                this.refs.password.focus();
                return false;
            }

            Dispatcher.dispatch({
                actionType: ActionTypes.REGISTER,
                userName:this.state.mobile,
                registerCode:this.state.registerCode,
                pw:this.state.newPwd
            });
        },
        _onClickByBangDing: function(e){
            // console.log('_onClickByBangDing');
            var validmobile = true;
            var _validmobile = false;
            if (this.state.phone) {
                this.setState({
                    valid_phone: validmobile,
                    valid_phone_warn: _validmobile,
                    // valid_phone_eamil_error:false,
                    valid_password_warn:false
                });
                if (this.state.phone.search(testphone) > -1 || this.state.phone.search(testmail) > -1) {
                     // console.log('格式正确');
                    this.setState({
                        valid_phone: validmobile,
                        valid_phone_warn: _validmobile,
                        valid_phone_eamil_error:false,
                        valid_password_warn:false
                    });
                }else{
                     // console.log('格式错误');
                    this.setState({
                        valid_phone: _validmobile,
                        valid_phone_warn:false,
                        valid_phone_eamil_error:true
                    });
                    return false;
                }
            }else{
                 this.setState({
                    valid_phone: _validmobile,
                    valid_phone_warn:validmobile
                });
                 this.refs.phone.focus();
                return false;
            }
            if (this.state.password) {
                this.setState({
                    valid_password: validmobile,
                    valid_password_warn:_validmobile
                });
            }else{
                 this.setState({
                    valid_password: _validmobile,
                    valid_password_warn:validmobile
                });
                this.refs.confirmpwd.focus();
                return false;
            }
            Dispatcher.dispatch({
                actionType: ActionTypes.BIND,
                userName:this.state.phone,
                pw:this.state.password
            });

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
        _handleBIND_DONE:function(re){
            if (re.err) {
                this.setState({
                    valid_bind_fail_warn: true,
                    err_message: re.err
                });
            }
        },
        _handleREGISTER_DONE:function(re){
            if (re.err) {
                this.setState({
                   valid_phone_fail_warn: true,
                   err_message: re.err
                });
            }
        },
        componentDidMount: function() {
           store.addEventListener(this.Events.BIND_DONE,this._handleBIND_DONE);
           store.addEventListener(this.Events.REGISTER_DONE,this._handleREGISTER_DONE);
           store.addEventListener(this.Events.GET_REGISTER_CODE_DONE,this._handleGETREGISTERCODE_DONE);
        },
        componentWillUnmount: function() {
            clearInterval(countdown);
            store.removeEventListener(this.Events.BIND_DONE,this._handleBIND_DONE);
            store.removeEventListener(this.Events.REGISTER_DONE,this._handleREGISTER_DONE);
            store.removeEventListener(this.Events.GET_REGISTER_CODE_DONE,this._handleGETREGISTERCODE_DONE);
        },
    	render: function(){
            var cls_mobile = cx('form-group', {'has-error': !this.state.valid_mobile});
            var cls_mobile_warn=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_mobile_warn});
            var cls_mobile_error=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_mobile_error});
            var cls_newpwd=cx('form-group', {'has-error': !this.state.valid_newpwd});
            var cls_newpwd_warn=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_newpwd_warn});
            var cls_registerCode=cx('form-group ', {'has-error': !this.state.valid_registerCode});
            var cls_registerCode_warn=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_registerCode_warn});
            var cls_phone = cx('form-group', {'has-error': !this.state.valid_phone});
            var cls_password=cx('form-group', {'has-error': !this.state.valid_password});
            var cls_phone_warn=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_phone_warn});
            var cls_phone_user_warn=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_phone_user_warn});
            var cls_phone_fail_warn=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_phone_fail_warn});
            var cls_bind_fail_warn=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_bind_fail_warn});
            var cls_password_warn=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_password_warn});
            var cls_phone_eamil_error=cx('form-group ME-inline-input-group-warn', {'Me-Warn-div-none': !this.state.valid_phone_eamil_error});
            var div = this.state.ChangeRegisterDiv ?
                                (
                                    <div className="ME_register_main_div panel">
                                        <div className="ME_register_icon_div">
                                           <img alt="铂略" src="../img/logo_03.png" height="60" width="186"/>
                                        </div>
                                        <div className="ME_register_div" >
                                            <div className={cls_phone}>
                                                <div className="icon-input-head">
                                                    <i className="fa fa-1x fa-user"></i>
                                                    <input type="text" className="form-control ME_register_div_input" id="phone" ref="phone" value={this.state.phone} onChange={this._onBindPhoneChange} onBlur={this._onBlur_phone}  placeholder="手机号/邮箱" />
                                                </div>
                                            </div>
                                            <div className={cls_phone_warn}>
                                                    请输入手机号码或邮箱！
                                            </div>
                                            <div className={cls_phone_eamil_error}>
                                                    您输入的格式有误！
                                            </div>
                                            <div className="icon-input-head">
                                                <div className={cls_password}>
                                                    <i className="fa fa-1x fa-lock"></i>
                                                    <input type="password" className="form-control ME_register_div_input" id="confirmpwd" ref="confirmpwd" placeholder="密码" value={this.state.password} onChange={this._onBindPassWordChange}/>
                                                </div>
                                            </div>

                                            <div className={cls_password_warn} >
                                                    请输入您的密码！
                                            </div>
                                            <div className={cls_bind_fail_warn}>
                                                    {this.state.err_message}
                                            </div>
                                            <div className="ME_button_div">
                                                  <button type="button" className="btn btn-primary ME_btn_submit" onClick={this._onClickByBangDing}>绑定</button>
                                            </div>
                                            <div className="ME_tishi_div">
                                                <a className="" onClick={this._onChangeChangeRegister}>没有帐号？速去注册</a>
                                            </div>
                                            </div>
                                    </div>)
                                :
                                        (
                                            <div className="ME_register_main_div panel">
                                                <div className="ME_register_icon_div">
                                                   <img alt="铂略" src="../img/logo_03.png" height="60" width="186"/>
                                                </div>
                                                <div className="ME_register_div">
                                                <div className={cls_mobile}>
                                                    <div className="icon-input-head">
                                                        <i className="fa fa-1x fa-user"></i>
                                                        <input type="text" className="form-control ME_register_none_boerder_input"  style={{width: '100%'}} id="telephone" ref="telephone" value={this.state.mobile}  placeholder="手机号" onChange={this._onRegisterPhoneChange}/>
                                                    </div>
                                                </div>
                                                <div className={cls_mobile_warn} >
                                                    请输入您的手机号码！
                                                </div>
                                                <div className={cls_mobile_error} >
                                                    您输入的格式有误！
                                                </div>
                                                <div className={cls_phone_user_warn} >
                                                    {this.state.err_message}
                                                </div>
                                                <div className="form-inline">
                                                    <div className={cls_registerCode}>
                                                        <div className="inline-input-group ">
                                                            <div className="icon-input-head" style={{width: '100%'}} >
                                                                <i className="fa fa-1x fa-key"></i>
                                                                <input type="text" className="form-control typeahead ME_float" ref="registerCode" style={{width: '50%'}} id="registerCode" value={this.state.registerCode} placeholder="验证码" onChange={this._onChange_registerCode} />
                                                                {
                                                                    this.state.isSmsSent ?
                                                                    <input className="form-control ME_btnSendCode_btn ME_btnSendCode ME_register_none_boerder_input" style={{width: '50%'}} id="freezeTime" value={this.state.freezeTime+'秒'} readOnly />
                                                                    : <input className="form-control ME_btnSendCode_btn ME_btnSendCode_one ME_register_none_boerder_input" style={{width: '50%'}} id="btnSendCode" onClick={this._onClick_btnSendCode} value="获取验证码" readOnly />
                                                                }
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={cls_registerCode_warn}>
                                                    请输入您的验证码！
                                                </div>
                                                <div className={cls_newpwd}>
                                                    <div className="icon-input-head">
                                                        <i className="fa fa-1x fa-lock"></i>
                                                        <input type="password" className="form-control ME_register_none_boerder_input" style={{width: '100%'}}  ref="password" value={this.state.newPwd} onChange={this._onRegisterPassWordChange} placeholder="密码" />
                                                    </div>
                                                </div>
                                                <div className={cls_newpwd_warn} id="">
                                                    请输入您的密码！
                                                </div>
                                                <div className={cls_phone_fail_warn} id="">
                                                    {this.state.err_message}
                                                </div>
                                                <div className="ME_button_div">
                                                      <button type="button" className="btn btn-primary ME_btn_submit" onClick={this._onClickBySubmit}>注册</button>

                                                </div>
                                                <div className="ME_tishi_div">
                                                    <a className="" onClick={this._onChangeChangeBinding}>已有帐号？速去绑定</a>
                                                </div>
                                            </div>
                                        </div>);

    		return (
                <div className="panel register">
                        {div}
                </div>
    		);
    	}
    });
    return MEPanelRegister;
}
module.exports = init;
