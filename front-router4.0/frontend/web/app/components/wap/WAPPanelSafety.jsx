var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var dtfmt = require('../../util/format.js');
var MeStore = require('../../stores/MeStore');
var ActionTypes = MeStore.ActionTypes;
var patterns = require('../patterns.js');


function getTheState(){
    return {
        oldPw:'',
        newPw:'',
        confirmpwd:'',
        valid_oldPw:true,
        valid_newPw:true,
        valid_confirmpwd:true,
        valid_oldPw_warn:false,
        valid_newPw_warn:false,
        valid_confirmpwd_warn:false,
        valid_NewConfpwd_warn:false,
        valid_bind_fail_warn: false,
        err_message: ''
    };
}

var MEPanelSafety = React.createClass({
	propTypes: {
		// data: React.PropTypes.array.isRequired,
		// title: React.PropTypes.string
	},
	getInitialState: function(){
        return getTheState();
    },
    _onChange: function(){
        this.setState(getTheState());
    },
    onChange_oldPw: function(e){
        e.preventDefault();
        var v = e.target.value.trim();
        var divfalse=false;
        var divtrue=true;
        this.setState({
            oldPw: v,
            valid_oldPw:divtrue,
            valid_oldPw_warn:divfalse,
            valid_bind_fail_warn:false
        });
    },
    onChange_newPw: function(e){
        e.preventDefault();
        var v = e.target.value.trim();
        var divfalse=false;
         var divtrue=true;
        this.setState({
            newPw: v,
            valid_newPw:divtrue,
            valid_newPw_warn:divfalse,
            valid_bind_fail_warn:false,
            valid_newPwNew: true,
            valid_newPwNew_warn: false
        });
    },
    onChange_cconfirmpwd:function(e){
        e.preventDefault();
        var v = e.target.value.trim();
        var divfalse=false;
        var divtrue=true;
        this.setState({
            confirmpwd: v,
            valid_confirmpwd:divtrue,
            valid_confirmpwd_warn:divfalse,
            valid_bind_fail_warn:false,
            valid_confirmpwdNew: true,
            valid_confirmpwdNew_warn: false
        });
    },
    _onClickBySubmit: function(e){
        var validmobile = true;
        var _validmobile = false;
        var password = /^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,16}$/;
        if (this.state.oldPw) {
            this.setState({
                valid_oldPw: validmobile,
                valid_oldPw_warn:_validmobile
            });
        }else{
             this.setState({
                valid_oldPw: _validmobile,
                valid_oldPw_warn:validmobile
            });
            this.refs.oldPw.focus();
            return false;
        }

        //新密码判断
        if (password.test(this.state.newPw)) {
            this.setState({
                valid_newPw: validmobile,
                valid_newPw_warn:_validmobile
            });
        }else if(this.state.newPw === ''){
             this.setState({
                valid_newPw: _validmobile,
                valid_newPw_warn:validmobile
            });
            this.refs.newPw.focus();
            return false;
        }else{
            this.setState({
                valid_newPwNew: _validmobile,
                valid_newPwNew_warn: validmobile
            });
            this.refs.newPw.focus();
            return false;
        }

        //确认新密码判断
        if (password.test(this.state.confirmpwd)) {
            this.setState({
                valid_confirmpwd: validmobile,
                valid_confirmpwd_warn:_validmobile
            });
        }
        else if(this.state.confirmpwd === ''){
             this.setState({
                valid_confirmpwd: _validmobile,
                valid_confirmpwd_warn:validmobile
            });
            this.refs.confirmpwd.focus();
            return false;
        }
        // else{
        //     this.setState({
        //         valid_confirmpwdNew: _validmobile,
        //         valid_confirmpwdNew_warn: validmobile
        //     });
        //     this.refs.confirmpwd.focus();
        //     return false;
        // }

        //两次新密码判断
        if ((this.state.newPw)===(this.state.confirmpwd)) {
            this.setState({
                valid_confirmpwd: validmobile,
                valid_NewConfpwd_warn:_validmobile
            });
        }else{
             this.setState({
                valid_confirmpwd: _validmobile,
                valid_NewConfpwd_warn:validmobile
            });
            this.refs.confirmpwd.focus();
            return false;
        }

            Dispatcher.dispatch({
            actionType: MeStore.ActionTypes.CHANGE_PASSWORD,
            oldPw: this.state.oldPw,
            newPw: this.state.newPw
            });    
    },
    _handleGET_Changepwdresult:function(re){
        console.log('reeeeeeeeeeeeeeeeeeeee',re);
        if (re.detail) {
            alert('修改成功');
            window.history.go(-1);
        }
        if(re.err){
            this.setState({
                valid_bind_fail_warn: true,
                err_message: re.err
            }); 
        }
    },
    componentDidMount: function() {
        MeStore.addEventListener(MeStore.Events.CHANGE_PWD,  this._handleGET_Changepwdresult);
    },
    componentWillUnmount: function() {
        MeStore.removeEventListener(MeStore.Events.CHANGE_PWD,  this._handleGET_Changepwdresult);
    },
	render: function(){
        var cls_oldPw = cx('form-group ME-inline-input-group', {'has-error': !this.state.valid_oldPw});
        var cls_oldPw_warn=cx('form-group ME-inline-input-group-warn password-page-warn', {'Me-Warn-div-none': !this.state.valid_oldPw_warn});
        var cls_newPw = cx('form-group ME-inline-input-group', {'has-error': !this.state.valid_newPw});
        var cls_newPw_warn=cx('form-group ME-inline-input-group-warn password-page-warn', {'Me-Warn-div-none': !this.state.valid_newPw_warn});
        var cls_newPwNew_warn=cx('form-group ME-inline-input-group-warn password-page-warn', {'Me-Warn-div-none': !this.state.valid_newPwNew_warn});
        var cls_confirmpwd = cx('form-group ME-inline-input-group', {'has-error': !this.state.valid_confirmpwd});
        var cls_confirmpwd_warn=cx('form-group ME-inline-input-group-warn password-page-warn', {'Me-Warn-div-none': !this.state.valid_confirmpwd_warn});
        var cls_confirmpwdNew_warn=cx('form-group ME-inline-input-group-warn password-page-warn', {'Me-Warn-div-none': !this.state.valid_confirmpwdNew_warn});
        var cls_NewConfpwd_warn=cx('form-group ME-inline-input-group-warn password-page-warn', {'Me-Warn-div-none': !this.state.valid_NewConfpwd_warn});
		var cls_bind_fail_warn=cx('form-group ME-inline-input-group-warn password-page-warn', {'Me-Warn-div-none': !this.state.valid_bind_fail_warn});
        return (
            <div className="change_div panel register">
            <div className="main_div ">
    			<div className="form form-horizontal">
                    <div className={cls_oldPw}>
                        <div className="icon-input-head change-password first-input">
                            <i className="fa fa-1x fa-lock"></i>
                            <input type="password" className="form-control ME_register_div_input password_input" ref="oldPw" id="oldpwd" value={this.state.oldPw} onChange={this.onChange_oldPw} placeholder="请输入您的当前密码"/>
                        </div>
                    </div>
                    <div className={cls_oldPw_warn} id="oldpwd_div">
                       
                        请输入您的当前密码！
                        
                    </div>
                    <div className={cls_newPw}>
                       <div className="icon-input-head change-password">
                        <i className="fa fa-1x fa-lock"></i>
                            <input type="password" className="form-control ME_register_div_input password_input" ref="newPw" id="newpwd" value={this.state.newPw} onChange={this.onChange_newPw}  placeholder="新的密码"/>
                        </div>
                    </div>
                    <div className={cls_newPw_warn} id="newpwd_div">
                       
                        请您输入新的密码！
                        
                    </div>
                    <div className={cls_newPwNew_warn} id="newpwd_div">
                       
                        请输入6-16位新密码，至少包含数字、字母或符号中的两种
                        
                    </div>
                    <div className={cls_confirmpwd}>
                        <div className="icon-input-head change-password last-input">
                            <i className="fa fa-1x fa-lock"></i>
                            <input type="password" className="form-control ME_register_div_input password_input" ref="confirmpwd" id="confirmpwd" placeholder="确认密码" onChange={this.onChange_cconfirmpwd} />
                        </div>
                    </div>
                    <div className={cls_confirmpwd_warn} id="confirmpwd_div"> 
                        请输入您的确认密码！
                    </div>
                    <div className={cls_NewConfpwd_warn} id="confirmpwd_div_two">   
                        两次输入的密码不一致,请检查！
                    </div>
                   {/* <div className={cls_confirmpwdNew_warn} id="confirmpwd_div">
                       
                        请输入6-16位新密码，至少包含数字、字母或符号中的两种
                        
                    </div>*/}
                    <div className={cls_bind_fail_warn}>
                        {this.state.err_message}
                    </div>
                    <div className="ME-btn_div">
                          <button type="button" className="btn btn-primary ME-btn_submit" onClick={this._onClickBySubmit}>确定</button>
                    </div>
                </div>
       
            </div>
            </div>
		);
	}
});
module.exports = MEPanelSafety;

