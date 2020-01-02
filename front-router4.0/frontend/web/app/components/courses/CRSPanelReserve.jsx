var React = require('react');
var PropTypes = React.PropTypes;
var patterns = require('../patterns.js');
var Dispatcher = require('../../dispatcher/AppDispatcher.js');
var CoursesStore = require('../../stores/CoursesStore.js');

var cx = require('classnames');
var testmobile = /^[0-9]{0,13}$/g;
var CRSPanelReserve = React.createClass({
	propTypes:{
		lesson: PropTypes.object, //lesson
		user: PropTypes.object
	},
	getInitialState: function() {
		var user = this.props.user;
        return ({
        	mobile: (user && user.phone ? user.phone : ''),
        	valid_mobile: true,
        	valid_mobile_warn:false
        });
    },
	_onPhoneChange: function(e){
		var v = e.target.value.trim();
        if (v.search(testmobile) > -1) {
	        this.setState({
	            mobile: v //need ori str without be trimed to display only
	        });
        }
	},
	_onGET_ORDER: function(e){
		Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.GET_ORDER,
            lesson: this.props.lesson,
        	mobile: this.state.mobile
        });
	},
	_onRESERVE: function(e){
		if (this.state.mobile) {
			this.setState({
	            valid_mobile:true,
	            valid_mobile_warn:false
	        });
		}else{
			this.setState({
	            valid_mobile:false,
	            valid_mobile_warn:true
	        });
	        return false;
		}
		Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.RESERVE,
            lesson: this.props.lesson,
        	mobile: this.state.mobile
        });
	},
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    _showReserve: function(){
    	var lesson = this.props.lesson;
    	var cls_mobile = cx('form-group col-xs-12', {'has-error': !this.state.valid_mobile});
    	// var cls_mobile_warn = cx('form-group inline-input-group-warn', {'Warn-div-none': !this.state.valid_mobile_warn});
    	return (
    		<div className="panel do">
                <div className="panel-body">
					<div className="container form">
						<div className={cls_mobile}>
							<div className="icon-input-head">
								<i className="fa fa-2x fa-mobile"></i>
								<input type="number" className="form-control mobile fa" placeholder="请输入您的手机号" value={this.state.mobile} onChange={this._onPhoneChange}/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="btn btn-primary col-xs-offset-4 col-xs-4" onClick={this._onRESERVE}>预约</div>
                	</div>
                </div>
			</div>
    	);
    },
    _showFinished: function(){
    	// console.log('_showFinished', this.props.lesson);
    	var lesson = this.props.lesson;
    	var start_date = lesson && lesson.start_time ? new Date(lesson.start_time).format(patterns.DATE) : '';
	    var start_time = lesson && lesson.start_time ? new Date(lesson.start_time).format(patterns.TIME) : '';
	    var end_time = lesson && lesson.end_time ? new Date(lesson.end_time).format(patterns.TIME) : '';
    	return (
    		<div className="finished">
	    		<div className="panel tip">
	                <div className="panel-body">
						<div className="container">
							<div className="">预约成功！我们会在直播开始前15分钟发短信提醒您。</div>
	                	</div>
	                </div>
				</div>
				<div className="panel toPay">
	                <div className="panel-body">
						<div className="container">
							<div className="">直播时间为 {start_date} {start_time} ~ {end_time}</div>
	                	</div>
	                	<div className="container">
							{/*<div className="col-xs-8 txt">请在直播前完成</div>
							<div className="btn btn-primary col-xs-4" onClick={this._onGET_ORDER}>购买</div>*/}
	                	</div>
	                </div>
				</div>
    		</div>
    	);
    },
	render: function(){
		var lesson = this.props.lesson;
		var p = '';
		if(lesson.isReserved) {
			p = this._showFinished();
		} else {
			p = this._showReserve();
		}

		return (
			<div className="content reserve">
				{p}
			</div>
		);
	}
});
module.exports = CRSPanelReserve;


