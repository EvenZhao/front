var React = require('react');
var PropTypes = React.PropTypes;
var patterns = require('../patterns.js');
var assign = require('object-assign');
var cx = require('classnames');
var util =  require('util'),
    f = util.format;
var Dispatcher = require('../../dispatcher/AppDispatcher.js');
var CoursesStore = require('../../stores/CoursesStore.js');

var testmobile = /^[0-9]{0,13}$/g;
var testphone =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/; ///^[0-9]{11}$|^[0-9]{13}$/g;
var testname = /^.{0,12}$/g;
var testemail = /^(\w)+(\.\w+)*@(.)+((\.\w+)+)$/;

var testposition = /^.{0,20}$/g;
var testcompany = /^.{0,20}$/g;

var CRSPanelEnroll = React.createClass({
	propTypes:{
		lesson: PropTypes.object, //lesson
		user: PropTypes.object
	},
	getInitialState: function() {
		var user = this.props.user;
        return ({
        	name: user.name || '',
        	valid_name: true,
        	mobile: user.mobile || '',
        	valid_mobile: true,
        	email: user.email || '',
        	valid_email: true,
        	position: user.position || '',
        	valid_position: true,
        	company: user.company || '',
        	valid_company: true,
        	valid_email_fail_warn:false,
        	err_message: ''
        });
    },
	_onMobileChange: function(e){
		e.preventDefault();
		var v = e.target.value.trim();
        if (v.search(testmobile) > -1) {
	        this.setState({
	            mobile: v,
	            valid_mobile: v.length === 0 || v.search(testmobile) > -1
	        });
        }
	},
	_onNameChange: function(e){
		e.preventDefault();
		var v = e.target.value;
        if (v.search(testname) > -1) {
	        this.setState({
	            name: v,
	            valid_name: v.length === 0 || v.search(testname) > -1
	        });
        }
	},
	_onMailChange: function(e){
		e.preventDefault();
		var v = e.target.value.trim();
	        this.setState({
	            email: v,
	            valid_email: true
	        });
       
	},
	_onPositionChange: function(e){
		e.preventDefault();
		var v = e.target.value;
        if (v.search(testposition) > -1) {
	        this.setState({
	            position: v,
	            valid_position: v.length === 0 || v.search(testposition) > -1
	        });
        }
	},
	_onCompanyChange: function(e){
		e.preventDefault();
		var v = e.target.value;
        if (v.search(testcompany) > -1) {
	        this.setState({
	            company: v,
	            valid_company: v.length === 0 || v.search(testcompany) > -1
	        });
        }
	},
	_onENROLL: function(e){
		e.preventDefault();
		if (!this.state.name) {
			this.setState({
                which_err: 'name'
            });
            this.refs.name.focus();
            return;
		}
		if (this.state.mobile.search(testphone) < 0 ) {
			this.setState({
                which_err: 'mobile'
            });
            this.refs.mobile.focus();
            return;
		}
		if (this.state.email.search(testemail) < 0) {
			this.setState({
                which_err: 'email'
            });
            this.refs.email.focus();
            return;
		}
		if (!this.state.position) {
			this.setState({
                which_err: 'position'
            });
            this.refs.position.focus();
            return;
		}
		if (!this.state.company) {
			this.setState({
                which_err: 'company'
            });
            this.refs.company.focus();
            return;
		}
		this.setState({
            which_err: ''
        });
		Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.ENROLL,
            lesson: this.props.lesson,
        	enroll: this.state
        });
	},
	_handleENROLL_DONE:function(re){
		if (re.err) {
            this.setState({
               valid_email_fail_warn: true,
               err_message: re.err
            });
        }
	},
    componentDidMount: function() {
    	CoursesStore.addEventListener(CoursesStore.Events.ENROLL_ERROR, this._handleENROLL_DONE);
    },
    componentWillUnmount: function() {
    	CoursesStore.removeEventListener(CoursesStore.Events.ENROLL_ERROR, this._handleENROLL_DONE);
    },
    _showP: function(){
    	var lesson = this.props.lesson;
    	var cls_email = 'form-group col-xs-12';
    	var cls_name = 'form-group col-xs-12';
    	var cls_mobile = 'form-group col-xs-12';
    	var cls_position = 'form-group col-xs-12';
    	var cls_company = 'form-group col-xs-12';
    	var cls_email_fail_warn=cx('form-group inline-input-group-warn', {'Warn-div-none': !this.state.valid_email_fail_warn});
    	var err_msg_name = '';
    	var err_msg_phone ='';
    	var err_msg_email ='';
    	var err_msg_position ='';
    	var err_msg_company ='';
    	switch(this.state.which_err){
    		case "name": 
	    		var err_msg_name = (
	                <div className="form-group inline-input-group-warn col-xs-12">
	                    请输入您的姓名
	                </div>
				);
				cls_name = cx('form-group col-xs-12', 'has-error');
	    		break;
    		case "mobile": 
	    		var err_msg_phone = (
	                <div className="form-group inline-input-group-warn col-xs-12">
	                    您输入的手机格式有误。
	                </div>
				);
				cls_mobile =cx('form-group col-xs-12', 'has-error');
	    		break;
	    	case "email": 
	    		var err_msg_email = (
	                <div className="form-group inline-input-group-warn col-xs-12">
	                    您输入的邮箱格式有误。
	                </div>
				);
				cls_email =cx('form-group col-xs-12', 'has-error');
	    		break;
	    	case "position": 
	    		var err_msg_position = (
	                <div className="form-group inline-input-group-warn col-xs-12">
	                    请输入您的职位
	                </div>
				);
				cls_position =cx('form-group col-xs-12', 'has-error');
	    		break;
	    	case "company": 
	    		var err_msg_company = (
	                <div className="form-group inline-input-group-warn col-xs-12">
	                    请输入您的公司
	                </div>
				);
				cls_company =cx('form-group col-xs-12', 'has-error');
	    		break;
    	}
    	
    	return (
    		<div className="panel info-form">
                <div className="panel-body">
					<div className="container form">
						<div className={cls_name}>
							<div className="icon-input-head">
								<i className="fa fa-user"></i>
								<input type="text" className="form-control name"ref="name" placeholder="请输入您的姓名" value={this.state.name} onChange={this._onNameChange}/>
							</div>
						</div>
						{err_msg_name}
						<div className={cls_mobile}>
							<div className="icon-input-head">
								<i className="fa fa-2x fa-mobile"></i>
								<input type="text" className="form-control mobile" ref="mobile" placeholder="请输入您的手机号" value={this.state.mobile} onChange={this._onMobileChange}/>
							</div>
						</div>
						{err_msg_phone}
						<div className={cls_email}>
							<div className="icon-input-head">
								<i className="fa fa-envelope-o"></i>
								<input type="text" className="form-control mail" ref="email" placeholder="请输入您的邮箱" value={this.state.email} onChange={this._onMailChange}/>
							</div>
						</div>
						{err_msg_email}

						<div className={cls_position}>
							<div className="icon-input-head">
								<i className="fa fa-certificate"></i>
								<input type="text" className="form-control position" ref="position" placeholder="请输入您的职位" value={this.state.position} onChange={this._onPositionChange}/>
							</div>
						</div>
						{err_msg_position}
						<div className={cls_company}>
							<div className="icon-input-head">
								<i className="fa fa-copyright"></i>
								<input type="text" className="form-control company" ref="company" placeholder="请输入您的公司" value={this.state.company} onChange={this._onCompanyChange}/>
							</div>
						</div>
						{err_msg_company}
	                    <div className={cls_email_fail_warn} id="">
                                {this.state.err_message}
                        </div>
					</div>
					<div className="row">
						<div className="btn btn-primary col-xs-offset-4 col-xs-4" onClick={this._onENROLL}>提交</div>
                	</div>
					<div className="container foot-msg">如果要为他人报名，请通过PC端网站进行。</div>
                </div>
			</div>
    	);
    },
	render: function(){
		// var lesson = this.props.lesson;
		var p = this._showP();
		return (
			<div className="content enroll">
				<div className="panel tip">
	                <div className="panel-body">
						<div className="container">
							<div className="">请填写您的报名信息，我们会尽快联系您。</div>
	                	</div>
	                </div>
				</div>
				{p}
			</div>
		);
	}
});
module.exports = CRSPanelEnroll;


