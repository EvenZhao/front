var React = require('react');
var PropTypes = React.PropTypes;
var Dispatcher = require('../../dispatcher/AppDispatcher.js');
var assign = require('object-assign');
var cx = require('classnames');
var CoursesStore = require('../../stores/CoursesStore');
var DetailSects = CoursesStore.DetailSects;

var CRSPanelDetail_SectNav = React.createClass({
	propTypes:{
		active: PropTypes.string,
        lesson: PropTypes.object
	},
	getDefaultProps: function(){
		return {
			active: DetailSects.sc_this
		};
	},
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    _onClick_filter: function(e){
    	var v = e.target.id;
        this.setState({
            active: v
        }, function() {
            Dispatcher.dispatch({
	            actionType: CoursesStore.ActionTypes.DETAIL_SECT_CLICKED,
	            active: v
	        });
        });
    },
    clsFilter: function(filter, withCata) {
        return cx(
                'btn',
                withCata ? 'col-xs-4' : 'col-xs-6',
                {active: this.props.active === filter }
            );
    },
	render: function(){
        var lesson = this.props.lesson;
        var withCata = lesson.online_catalog ? true : false; 
		return (
			<div className="sect-nav container">
                <div type="button" className={this.clsFilter(DetailSects.sc_this, withCata)} id={DetailSects.sc_this} onClick={this._onClick_filter} >课程详情</div>
                { withCata ? <div type="button" className={this.clsFilter(DetailSects.sc_chapters, withCata)} id={DetailSects.sc_chapters} onClick={this._onClick_filter} >章节目录</div> : ''}
                <div type="button" className={this.clsFilter(DetailSects.sc_refer, withCata)} id={DetailSects.sc_refer} onClick={this._onClick_filter} >相关课程</div>
            </div>
		);
	}
});
module.exports = CRSPanelDetail_SectNav;

