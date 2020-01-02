var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var CoursesStore = require('../../stores/CoursesStore');
var ActionTypes = CoursesStore.ActionTypes;
var dm = require('../../util/DmURL.js');
var util =  require('util'),
    f = util.format;
var url_headimg_default = dm.getUrl_home('/img/account_def1.png');

var TeacherItem = React.createClass({
	propTypes: {
		teacher: React.PropTypes.object,
		col: React.PropTypes.string,
		idx_num: React.PropTypes.number,
		isSelected: React.PropTypes.bool
	},
	getDefaultProps: function(){
        return {
            isSelected: false
        };
    },
    getInitialState: function(){
        return ({
            photo_when_err: null
        });
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    _onPhotoError: function(e){
    	this.setState({
    		photo_when_err: url_headimg_default
    	});
    },
	render: function(){
		var teacher = this.props.teacher;
		var cls = cx(this.props.col || 'col-xs-3', 'media', 'teacher');
		return (
			<div className={cls}>
				<div className="media-left">
	            	<img className="media-object photo" src={this.state.photo_when_err || teacher.photo || url_headimg_default} onError={this._onPhotoError}/>
				</div>
            	<div className="media-body info">
	            	<div className="media-heading name">{teacher.name}</div>
	            	<div className="">{teacher.position}</div>
	            	<div className="">{teacher.company}</div>
            	</div>
                    <div className="introduction">
                        {teacher.introduction}
                    </div>
			</div>
			
		);
	}
});
module.exports = TeacherItem;

var Teachers = React.createClass({
	propTypes: {
		teachers: React.PropTypes.array
	},
	getDefaultProps: function(){
        return {
            teachers: []
        };
    },
	getInitialState: function(){
        return ({
            selected: false
        });
    },
     _onClickHandler: function(re){
     	if (this.state.selected) {
     		this.setState({
	            selected: false
	        });
     	}else{
     		this.setState({
	            selected: true
	        });
     	}
    },
    componentDidMount: function() {
    	// CoursesStore.addEventListener(CoursesStore.Events.ONLINE_CHANGE_TEACHERS_DONE, this._handleONLINE_CHANGE_TEACHERS_DONE);
    },
    componentWillUnmount: function() {
    	// CoursesStore.addEventListener(CoursesStore.Events.ONLINE_CHANGE_TEACHERS_DONE, this._handleONLINE_CHANGE_TEACHERS_DONE);
    },
	render: function(){
		var teachers = '';
		var style = {};
        var teachers_style = {};
        var cls_icons = cx('fa fa-chevron-up', {'fa fa-chevron-down': !this.state.selected});
        // var cls_teachers = cx('icons-div', {'icons-div-none': !this.state.valid_icons});
		// console.log('kkdsdjhsjdjksjk',this.props.teachers.length);
        if (this.state.selected) {
             teachers_style={
                height: 'auto'
            } 
        } else {
            teachers_style = {
                height: 86
            }
             // overflow-y: hidden;
        }
		if(this.props.teachers) {
			var len = this.props.teachers.length;
			var col = f('col-xs-%d', (12 / len));
			if (this.props.teachers.length > 1) {
				style = {
					width: document.body.clientWidth * 0.85 * len
				};
			}
			if (this.props.teachers.length === 1) {
				style = {
					width: document.body.clientWidth * 0.93 * len
				};
			}
			
			teachers = this.props.teachers.map(function (item, index) {
				var count = index + 1;
	            var isSelected = (this.state.selected === count);
	            return (
	           		<TeacherItem key={count} idx_num={count} teacher={item} col={col} isSelected={isSelected}/>

	            );
	        }.bind(this));
		}
		return (
			<div className="panel crs-content" onClick={this._onClickHandler}>
                <div className="panel-heading">
                    <span>讲师介绍</span>
                </div>
                <div className="panel-body">
                	<div className="teachers" style={teachers_style} >
                		<div className="row-fluid" style={style}>
                			{teachers}
                		</div>
                	</div>
                    <div className="icons-div"><i className={cls_icons}></i></div>
                </div>
            </div>
		);
	}
});
module.exports = Teachers;

