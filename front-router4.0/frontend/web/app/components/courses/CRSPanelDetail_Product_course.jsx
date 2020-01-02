var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var CoursesStore = require('../../stores/CoursesStore');
var ActionTypes = CoursesStore.ActionTypes;
var PTeachers = require('./CRSPanelDetail_Teachers.jsx');
var PBrief = require('./CRSPanelDetail_Brief.jsx');
var PAssociation = require('./CRSPanelDetail_Association.jsx');
var PAddress = require('./CRSPanelDetail_Address.jsx');

function show_pd_this(lesson){
    var p = [];
    var teachers = '';
    if(lesson.teachers) {
        teachers = <PTeachers key="teachers" teachers={lesson.teachers}/>;
        p.push(teachers);
    }
    var brief = '';
    if(lesson.brief) {
        brief = <PBrief key="brief" brief={lesson.brief}/>;
        p.push(brief);
    }
    var association = '';
    if(lesson.associations) {
        association = <PAssociation key="association" associations={lesson.associations}/>;
        p.push(association);
    }
    var address = '';
    if(lesson.city && lesson.city.map_x && lesson.city.map_y) {
        address = <PAddress key="address" city={lesson.city}/>;
        p.push(address);
    }
    return p;
}


var ProductItem = React.createClass({
    propTypes:{
        data: React.PropTypes.object,
        ProductDate:React.PropTypes.object,
        count: React.PropTypes.number,
        length: React.PropTypes.number,
        catelogId: React.PropTypes.any,
        resourceId: React.PropTypes.any,
        idx_num: React.PropTypes.number,
        product_lesson: React.PropTypes.object,
        user: React.PropTypes.object,
        IsChapter: React.PropTypes.any,
        Ch_Num: React.PropTypes.number
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
    _onClickHandler_PrePlay: function(e){
        var product = this.props.product_lesson;
        var user= this.props.user;
        if (user && user.isBinded) {
            if (isWeiXin) {
                if (product && product.authority === 'payed') {
                    Dispatcher.dispatch({
                        actionType: ActionTypes.PRODUCT_CHANGE_CHAPTER,
                        chapter: this.props.data,
                        idx_num: this.props.idx_num,
                        Productdate:this.props.ProductDate,
                        chapter_num: this.props.Ch_Num
                    });
                    document.body.scrollTop = 0;
                }else {
                    Dispatcher.dispatch({
                        actionType: ActionTypes.GET_ORDER,
                        product: product
                    });
                }
            }else{
                if (product && product.authority === 'payed') {
                    Dispatcher.dispatch({
                        actionType: ActionTypes.PRODUCT_CHANGE_CHAPTER,
                        chapter: this.props.data,
                        idx_num: this.props.idx_num,
                        Productdate:this.props.ProductDate,
                        chapter_num: this.props.Ch_Num
                    });
                    document.body.scrollTop = 0;
                }else {
                    alert('如果您对本课程感兴趣，请至网站或微信进行购买。');
                }
            }
        }else{
            Dispatcher.dispatch({
                actionType: ActionTypes.GET_LOGIN,
                lesson: product
            });


            
        }
        
    },
    render: function(){
        var data = this.props.data;
        var left_border='';
        var cls = cx('panel', 'chapter', {'selected': this.props.isSelected});
        var join_round='';
        switch(data.joinStatus){
            case 0: 
                join_round=(
                    <img className="level_img" src="../img/round.png" height="12" width="17" />
                );
            break;
            case 1: 
                join_round=(
                    <img className="level_img" src="../img/half_round.png" height="12" width="17" />
                );
            break;
            case 2: 
                join_round=(
                    <img className="level_img" src="../img/round_over.png" height="12" width="17" />
                );
            break;
        }
        if (this.props.length === 1 || this.props.count === this.props.length) {
                left_border='';
            } else {
                left_border=(
                    <div className="left_border_div">
                    </div>
                );
            }
        return (
            <div className="product_div" key={this.props.count}>
                    <div className="product_course_div">
                        <div className="left_round">
                            <span className="span">{join_round}
                            </span>
                        </div>
                        <div className="left">
                            <span className=""onClick={this._onClickHandler_PrePlay}>       
                                {this.props.IsChapter ? <span className="chapter_span">{this.props.count}</span> : <span className="span">{this.props.count}</span>}
                                {this.props.IsChapter ? <span className="product_title_chapter">{data.title}</span> : <span className="product_title">{data.title}</span>}
                            </span>
                        </div>
                        <div className="right">
                            <span className="duration">
                                {data.duration}
                            </span>
                        </div>
                    </div>
                    {left_border}
            </div>
        );
    }
});

var Item = React.createClass({
    propTypes:{
        data: React.PropTypes.object,
        isSelected: React.PropTypes.any,
        catelogId: React.PropTypes.any,
        resourceId: React.PropTypes.any,
        resourcedata: React.PropTypes.object,
        IsPlay: React.PropTypes.any,
        idx_num: React.PropTypes.number,
        product_lesson:React.PropTypes.object,
        user: React.PropTypes.object,
        Chapter_Num: React.PropTypes.any

    },
    getDefaultProps: function(){
        return {
            isSelected: false
        };
    },
    getInitialState: function(){
        return ({
            selected: true,
            selected_detail: false,
            isSelected_chapter: this.props.Chapter_Num ? this.props.Chapter_Num : 0
        });
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    _onClickHandler: function(e){
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: ActionTypes.PRODUCT_ONCHANGE_INDEX,
            chapter: this.props.data,
            idx_num: this.props.idx_num
        });
        this.setState({
            selected_detail: false,
            selected:true
        });
    },
    _onClickHandlerDetail: function(e){
        if (this.state.selected_detail) {
            this.setState({
                selected_detail: false,
                selected: true
            });
        }else{
            this.setState({
                selected_detail: true,
                selected: false
            });
        }
    },
    render: function(){
        var data = this.props.data;
        var catalog_num= this.props.data.online_catalog.length;
        var duration = data && data.duration ? data.duration :''; 
        var pd_active = show_pd_this(data);
        var catalog = (
                <div className="container" onClick={this._onClickHandler}>
                    <span className="product_video_num"><img className="level_img" src="../img/video2.png" height="12" width="17" />{catalog_num}个章节</span>
                    <span className="product_video_num"><img className="level_img" src="../img/time.png" height="12" width="17" />{duration}</span>
                </div>
            );
        var cls = cx('panel', 'chapter','selected', 'chapter-marign',{'selected_color': this.props.isSelected});
        var cls_detail = cx('',{'pd_change_detail': !this.props.isSelected});

        var detail_img=(
                <span className="product_title_img" onClick={this._onClickHandlerDetail}>
                    <img className="level_img" src="../img/detail.png" height="16" width="18" />
                </span>
            );
        var up_detail_img=(
                <span className="product_title_img" onClick={this._onClickHandlerDetail}>
                    <img className="level_img" src="../img/up_detail.png" height="16" width="18" />
                </span>
            );
        var items = this.props.data.online_catalog.map(function(item,index){
            var count= index+1;
            var length= this.props.data.online_catalog.length;
            var ischapter;
            if (this.props.IsPlay) {
                ischapter = (this.props.Chapter_Num === count);
            }
            return (
                <ProductItem key={count} data={item} ProductDate={data} count={count} length={length} 
                catelogId={this.props.catelogId} resourceId={this.props.resourceId} idx_num={this.props.idx_num}
                resourcedata={data} product_lesson={this.props.product_lesson} user={this.props.user} IsChapter={ischapter} Ch_Num={count}/>
            );
        }.bind(this));
        return (
            <div className={cls}>
                <div className="panel-body">
                    <div className="container">
                        {this.props.IsPlay ? <span className="title_font_awson"><i className="fa fa-volume-up"></i></span> : ''}
                        <span className="title title_font_size col-xs-11" onClick={this._onClickHandler}>{data.title}</span>
                        <span className={cls_detail}>
                        {this.state.selected ? detail_img : ''}
                        {this.state.selected_detail ? up_detail_img :''}
                       </span>
                    </div>
                    {this.props.isSelected ? '' : catalog}
                    <div className={cls_detail}>
                        {this.state.selected ? items : pd_active}
                    </div>
                </div>
            </div>
        );
    }
});

var CRSPanelDetail_Product_course = React.createClass({
	propTypes: {
		productCourse: React.PropTypes.array,
        resourceId: React.PropTypes.any,
        catelogId: React.PropTypes.any,
        IsPlay: React.PropTypes.any,
        IsPlayId: React.PropTypes.number,
        product_lesson:React.PropTypes.object,
        user: React.PropTypes.object,
        Chapter_Num: React.PropTypes.any
	},
    getDefaultProps: function(){
        return {
            product: []
        };
    },
    getInitialState: function(){
        return ({
            selected: 0
        });
    },
    _handlePRODUCT_ONCHANGE_INDEX_DONE: function(re){
        this.setState({
            selected: re.idx_num
        });
    },
    componentDidMount: function() {
        CoursesStore.addEventListener(CoursesStore.Events.PRODUCT_ONCHANGE_INDEX_DONE, this._handlePRODUCT_ONCHANGE_INDEX_DONE);
    },
    componentWillUnmount: function() {
        CoursesStore.removeEventListener(CoursesStore.Events.PRODUCT_ONCHANGE_INDEX_DONE, this._handlePRODUCT_ONCHANGE_INDEX_DONE);
    },
	render: function(){
        // var count = 0;
		var items = this.props.productCourse.map(function(item, index){
            var count = index + 1;
            var isSelected;
            var ispaly;
            if (this.props.resourceId && this.props.resourceId ===item.id && this.state.selected === 0) {
                isSelected = count;
                // ispaly = (this.props.IsPlay === count)
                ispaly =count;
            }else {
                isSelected = (this.state.selected === count);
                if (this.props.IsPlayId === item.id) {
                    ispaly = (this.props.IsPlay === count);
                }
            }
			return (
                <Item key={count} idx_num={count} data={item} isSelected={isSelected} 
                   resourceId={this.props.resourceId} catelogId={this.props.catelogId} IsPlay={ispaly}
                   product_lesson={this.props.product_lesson} user={this.props.user} Chapter_Num={this.props.Chapter_Num}/>
            );
		}.bind(this));
		return (
            <div className="container-fluid sc_chapters">
                {items}
            </div>
		);
	}
});
module.exports = CRSPanelDetail_Product_course;

