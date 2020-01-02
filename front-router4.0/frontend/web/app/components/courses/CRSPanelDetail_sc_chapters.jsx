var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var CoursesStore = require('../../stores/CoursesStore');
var ActionTypes = CoursesStore.ActionTypes;
var Item = React.createClass({
    propTypes:{
        data: React.PropTypes.object,
        idx_num: React.PropTypes.number,
        isSelected: React.PropTypes.bool
    },
    getDefaultProps: function(){
        return {
            isSelected: false
        };
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    _onClickHandler: function(e){
        console.log('this.props.datasssssssssssssssss',this.props.data);
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: ActionTypes.ONLINE_CHANGE_CHAPTER,
            chapter: this.props.data,
            idx_num: this.props.idx_num
        });
    },
    render: function(){
        var data = this.props.data;
        var cls = cx('panel', 'chapter', {'selected': this.props.isSelected});
        return (
            <div className={cls} onClick={this._onClickHandler}>
                <div className="panel-body">
                    <div className="container">
                        <span className="idx_num col-xs-1">{this.props.idx_num}</span>
                        <span className="title col-xs-8">{data.title}</span>
                        <div className="right col-xs-2">
                            <span className="duration">
                            {data.duration}
                            </span>
                        </div>
                    </div>
                    
                    {this.props.isSelected ? 
                        <div className="container">
                            <span className="content_head col-xs-1">&nbsp;</span>
                            <div className="content_div col-xs-11">
                                {data.content}
                            </div>
                        </div>
                        : ''
                    }
                </div>
            </div>
        );
    }
});

var CRSPanelDetail_sc_chapters = React.createClass({
	propTypes: {
		chapters: React.PropTypes.array
	},
    getDefaultProps: function(){
        return {
            chapters: []
        };
    },
    getInitialState: function(){
        return ({
            selected: 1
        });
    },
    _handleONLINE_CHANGE_CHAPTER_DONE: function(re){
        this.setState({
            selected: re.idx_num
        });
    },
    componentDidMount: function() {
        CoursesStore.addEventListener(CoursesStore.Events.ONLINE_CHANGE_CHAPTER_DONE, this._handleONLINE_CHANGE_CHAPTER_DONE);
    },
    componentWillUnmount: function() {
        CoursesStore.removeEventListener(CoursesStore.Events.ONLINE_CHANGE_CHAPTER_DONE, this._handleONLINE_CHANGE_CHAPTER_DONE);
    },
	render: function(){
        // var count = 0;
		var items = this.props.chapters.map(function(item, index){
            var count = index + 1;
            var isSelected = (this.state.selected === count);
			return (
                <Item key={count} idx_num={count} data={item} isSelected={isSelected}/>
            );
		}.bind(this));
		return (
            <div className="container-fluid sc_chapters">
                {items}
            </div>
		);
	}
});
module.exports = CRSPanelDetail_sc_chapters;

