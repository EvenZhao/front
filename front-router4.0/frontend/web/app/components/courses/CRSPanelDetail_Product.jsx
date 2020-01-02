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
        isSelected: React.PropTypes.any,
        productId :React.PropTypes.any,
        lesson_product: React.PropTypes.object
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
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: ActionTypes.PRODUCT_DETAIL,
            productId: this.props.productId,
            levelId: this.props.data.id,
            Product: this.props.lesson_product
        });
    },
    render: function(){
        var data = this.props.data;
        var course_num = data && data.course_num ? data.course_num : 0;
        var video_num = data && data.video_num ? data.video_num : 0;
        var cls = cx('panel', 'chapter','selected','product_panel', {'selected': this.props.isSelected});
        return (
            <div className={cls} onClick={this._onClickHandler}>
                <div className="panel-body product_panel">
                    <div className="container">
                        <span className="idx_num col-xs-2">{data.sequence}</span>
                        <span className="title col-xs-8 product_title_color">{data.title}</span>
                    </div>
                    <div>
                        <span className="idx_num col-xs-2">阶段</span>
                        <span className="product_course_num"><img className="level_img" src="../img/video.png" height="12" width="17" />{course_num}个课程</span>
                        <span className="product_video_num"><img className="level_img" src="../img/video2.png" height="12" width="17" />{video_num}个章节</span>
                    </div>
                </div>
            </div>
        );
    }
});

var CRSPanelDetail_Product = React.createClass({
	propTypes: {
		product: React.PropTypes.any,
        productId: React.PropTypes.any,
        lesson_product: React.PropTypes.object
	},
    getDefaultProps: function(){
        return {
            product: []
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
		var items = this.props.product.map(function(item, index){
            var count = index + 1;
            var isSelected = (this.state.selected === count);
			return (
                <Item key={count} productId={this.props.productId} lesson_product={this.props.lesson_product}  data={item} isSelected={isSelected}/>
            );
		}.bind(this));
		return (
            <div className="container-fluid sc_chapters">
                {items}
            </div>
		);
	}
});
module.exports = CRSPanelDetail_Product;

