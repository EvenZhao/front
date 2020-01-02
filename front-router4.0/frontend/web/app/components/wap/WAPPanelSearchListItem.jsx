var Dispatcher;
var React = require('react');
var PropTypes = React.PropTypes;
var keyMirror = require('keymirror');
var cx = require('classnames');
var assign = require('object-assign');
var dtfmt = require('../../util/format.js');
var patterns = require('../patterns.js');
var Ribbon = require('../Ribbon.jsx');
var FactoryTxt = require('../FactoryTxt.js');
var url_nophoto = 'http://www.bolue.cn/images/bot_qrcode.png';
var WapStore = require('../../stores/WapStore');
var URL = require('url');

var dm = require('../../util/DmURL');


var ActionTypes = keyMirror({
    GET_DETAIL: null,
    TOGGLE_CORNER_MENU: null,
    PRODUCT: null,
    WAP_CATALOG_NUM: null
});

function makeRibbons(data){
    var v_top = 0;
    var r_free = '';
    if(data.isFree) {
        r_free = <Ribbon cls="free" txt="免费" top={v_top} />;
        v_top += 30;
    }
    // var r_new = '';
    // if(data.isNew) {
    //     r_new = <Ribbon cls="new" txt="最新" top={v_top} />;
    //     v_top += 30;
    // }
    var r_ACCA = '';
    // if(data.association) {
    //     r_ACCA = <Ribbon cls="ACCA" txt={data.association.name} top={v_top} />;
    //     v_top += 30;
    // }
    return (
        <div>
        {r_free}
        {r_ACCA}
        </div>
    );
}

function makeAssocias(associations){
    var assocs = associations ? associations.map( 
        item => <div key={item.id} className="col-xs-3 tag">{item.name}</div>
    ) : '';
    return (
        <div className="col-xs-10 associations">
            {assocs}
        </div>
    );
}


function product(data, onClickHandler, keyWords, onClickMenuHandler){
    // var duration = data && data.duration ? data.duration : 0;    //章节
    // var label_name = data && data.label_name ? data.label_name : ''; 
    var level_num = data && data.level_num ? data.level_num : 0;
    var course_num = data && data.course_num ? data.course_num : 0;
    var ribbons = makeRibbons(data);
    var title = keyWords ? FactoryTxt.highLight(keyWords, data.title) : data.title;
    var cornerMenu = '';//(onClickMenuHandler ? <span className="col-xs-2 fa fa-ellipsis-h corner-menu" onClick={onClickMenuHandler}></span> : '');
    var associations = makeAssocias(data.associations);
    // var star = parseFloat(data.star);
    var style_img = {
        background: "url(" + (data.brief_image ? data.brief_image : url_nophoto) + ")"
    };
    return (
        <div className="list-group img-headed-list-item">
          <button className="list-group-item img-headed-row" onClick={onClickHandler}>
            <div style={style_img} className="col-xs-5 row-head-img product_info" >
                <div className="learn_num">
                    <div className="visitors fa">{data.learn_num}</div>
                </div>
            </div>
            <div className="col-xs-7 row-right">
                <div className="row title" >{title}</div>
                <div className="row third-info">
                    {associations}
                    {cornerMenu}
                </div>
                <div className="row second-info" >
                    <span className="level fa"><img className="level_img" src="../img/level.png" height="14" width="19" />{level_num}个阶段</span>
                    <span className="course"><img className="level_img" src="../img/video.png" height="12" width="19" />{course_num}个课程</span>
                </div>
            </div>
            {ribbons}
          </button>
        </div>
    );
}

var WAPPanelSearchCatalogContentItem = React.createClass({
    propTypes: {
       data: React.PropTypes.any,
       isSelected: React.PropTypes.any
    },
    getInitialState: function(){
        return {
            
        };
    },
    _handleWAP_CATALOG_NUM_DONE: function(re){
        // console.log('_handleWAP_CATALOG_NUM_DONE',re);
        if (re && re.chapter) {
            this.setState({
                catalog_number: re.chapter,
                caralogId :re.caralogId
            });
        }
    },
    componentDidMount: function() {
         WapStore.addEventListener(WapStore.Events.WAP_CATALOG_NUM_DONE, this._handleWAP_CATALOG_NUM_DONE);
    },
    componentWillUnmount: function() {
         WapStore.removeEventListener(WapStore.Events.WAP_CATALOG_NUM_DONE, this._handleWAP_CATALOG_NUM_DONE);
    },
    render: function(){
        var data = this.props.data || [];
        var content = data.map(function (item, index) {
            var isSelected = (this.state.catalog_number === item.order_id && this.state.caralogId === item.id);
            var cls = cx('catalog-content', {'catalog-selected': isSelected})
            var catalog_content = item.content ? item.content : '';
            var title = item.title ? item.title : '';
            return (
                <div className={cls} key={index}>
                    <div><span dangerouslySetInnerHTML={ { __html: title } } /></div>
                    <div className="catalog-content-div">
                        <span dangerouslySetInnerHTML={ { __html: catalog_content } } />
                    </div>
                </div>
            );
        }.bind(this))
        return (
            <div>
                {content}
            </div>
        );
    }
});




var WAPPanelSearchCatalogNumItem = React.createClass({
    propTypes: {
       catalog_num: React.PropTypes.any,
       caralogId: React.PropTypes.any
    },
    getInitialState: function(){
        return {
            
        };
    },
    _handleChangeCatalog: function(){
        Dispatcher.dispatch({
            actionType: ActionTypes.WAP_CATALOG_NUM,
            chapter: this.props.catalog_num,
            caralogId: this.props.caralogId
        });
    },
    _handleWAP_CATALOG_NUM: function(re){
        if (re && re.chapter) {
            this.setState({
                catalog_number: re.chapter,
                caralogId :re.caralogId
            });
        }
    },
    componentDidMount: function() {
        WapStore.addEventListener(WapStore.Events.WAP_CATALOG_NUM_DONE, this._handleWAP_CATALOG_NUM);
    },
    componentWillUnmount: function() {
        WapStore.removeEventListener(WapStore.Events.WAP_CATALOG_NUM_DONE, this._handleWAP_CATALOG_NUM);
    },
    render: function(){
        var catalog_num = this.props.catalog_num || [];
        var caralog_id = this.props.caralogId || [];
        var isSelected = (catalog_num === this.state.catalog_number && caralog_id === this.state.caralogId);
        var cls = cx('', {'selected-span': isSelected})
        return (
             <span className={cls} onClick={this._handleChangeCatalog}>{catalog_num}</span>
        );
    }
});


var WAPPanelSearchCatalogItem = React.createClass({
    propTypes: {
       data: React.PropTypes.any
    },
    getInitialState: function(){
        return {
            
        };
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    render: function(){
        var data = this.props.data || [];
        var span = data.map(function (item, index) {
            var catalog_num = item.order_id ? item.order_id : '';
            var caralogId = item.id ? item.id :'';
            return (
                <WAPPanelSearchCatalogNumItem key={index} catalog_num={catalog_num} caralogId={caralogId}/>
            );
        }.bind(this));
        return (
            <div>
                <div className="catalog-num">{span}</div>
                <WAPPanelSearchCatalogContentItem  data={data}/>
            </div>
        );
    }
});


function online_info(data, onClickHandler, keyWords, onClickMenuHandler){
    var duration = data && data.duration ? data.duration : 0;
    var label_name = data && data.label_name ? data.label_name : '';
    var ribbons = makeRibbons(data);
    var title = keyWords ? FactoryTxt.highLight(keyWords, data.title) : data.title;
    var cornerMenu = '';//(onClickMenuHandler ? <span className="col-xs-2 fa fa-ellipsis-h corner-menu" onClick={onClickMenuHandler}></span> : '');
    var associations = makeAssocias(data.associations);
    var catalog = data && data.catalog ? data.catalog : '';
    // var star = parseFloat(data.star);
    var style_img = {
        background: "url("+'http://www.bolue.cn/' + (data.brief_image ? data.brief_image : url_nophoto) + ")"
    };
    return (
        <div className="list-group img-headed-list-item">
          <button className="list-group-item img-headed-row" onClick={onClickHandler}>
            <div style={style_img} className="col-xs-5 row-head-img online_info" >
                {/*<div className="learn_num">
                    <div className="visitors fa">{data.learn_num}</div>
                </div>*/}
            </div>
            <div className="col-xs-7 row-right">
                <div className="row title">{title}</div>
                <div className="row third-info">
                    {associations}
                    {cornerMenu}
                </div>
                <div className="row second-info" >
                    <span className="duration col-xs-11 fa"> {duration}章节</span>
                </div>
            </div>
            {ribbons}
          </button>
          <WAPPanelSearchCatalogItem data={catalog} />
        </div>
    );
}

function offline_info(data, onClickHandler, keyWords, onClickMenuHandler){
    // var start_date = data && data.start_date ? new Date(data.start_date).format(patterns.DATE) : '';
    // var start_time = data && data.start_time ? new Date(data.start_time).format(patterns.TIME) : '';
    // var end_time = data && data.end_time ? new Date(data.end_time).format(patterns.TIME) : '';
    var startDate = data.startDate;
    var city = data && data.city && data.city.city_name ? data.city : '';
    var ribbons = makeRibbons(data);
    var title = keyWords ? FactoryTxt.highLight(keyWords, data.title) : data.title;
    var cornerMenu = '';//(onClickMenuHandler ? <span className="col-xs-2 fa fa-ellipsis-h corner-menu" onClick={onClickMenuHandler}></span> : '');
    var associations = makeAssocias(data.associations);
    var style_img = {
        background: "url("+'http://www.bolue.cn/' + (data.brief_image ? data.brief_image : url_nophoto) + ")"
    };
    return (
        <div className="list-group img-headed-list-item">
          <button className="list-group-item img-headed-row" onClick={onClickHandler}>
            <div style={style_img} className="col-xs-5 row-head-img offline_info"  >
                {/*<div className="learn_num">
                    <div className="visitors fa">{data.learn_num}</div>
                </div>*/}
            </div>
            <div className="col-xs-7 row-right">
                <div className="row title" >{title}</div>
                <div className="row third-info">
                    {associations}
                    {cornerMenu}
                </div>
                <div className="row second-info" >
                    <span className="date col-xs-8">{startDate}</span>
                    <span className="place col-xs-4">{city.city_name}</span>
                </div>
            </div>
            {ribbons}
          </button>
        </div>
    );
}

function live_info(data, onClickHandler, keyWords, onClickMenuHandler){
    var start_date = data && data.start_time ? new Date(data.start_time).format(patterns.LDATE) : '';
    var start_time = data && data.start_time ? new Date(data.start_time).format(patterns.TIME) : '';
    var end_time = data && data.end_time ? new Date(data.end_time).format(patterns.TIME) : '';
    var cornerMenu = '';//(onClickMenuHandler ? <span className="col-xs-2 fa fa-ellipsis-h corner-menu" onClick={onClickMenuHandler}></span> : '');
    var status_txt = '';
    var status_cls = {};
    switch(data.live_status){
        case 'not_started': 
            status_txt = data.isReserved ? '已预约' : '未开始'; 
            assign(status_cls, {not_started: true}); break;
        case 'start_soon': //status_txt = '快开始'; assign(status_cls, {not_started: true}); break;
        case 'on_air': status_txt = '直播中'; assign(status_cls, {on_air: true}); break;
        case 'ended': status_txt = '可回放'; assign(status_cls, {ended: true}); break;
    } 
    status_cls = cx(status_cls);
    var ribbons = makeRibbons(data);
    var title = keyWords ? FactoryTxt.highLight(keyWords, data.title) : data.title;
    var associations = makeAssocias(data.associations);
    var style_img = {
        background: "url("+'http://www.bolue.cn/' + (data.brief_image ? data.brief_image : url_nophoto) + ")"
    };
    return (
        <div className="list-group img-headed-list-item">
          <button className="list-group-item img-headed-row" onClick={onClickHandler}>
            <div style={style_img} className="col-xs-5 row-head-img live_info"  >
            </div>
            <div className="col-xs-7 row-right">
                <div className="row title" >{title}</div>
                <div className="row third-info">
                    {associations}
                    {cornerMenu}
                </div>
                <div className="row second-info" >
                    <span className="date">
                        <span className="">{start_date} {start_time}~{end_time}</span>
                    </span>
                </div>
                <div className="row second-info">
                    <span className="status col-xs-12">
                        <span className={status_cls}>{status_txt}</span>
                    </span>
                </div>
            </div>
            {ribbons}
          </button>
        </div>
    );
}

var ImgHeadedListItem;
function init(dispatcher){
    if(ImgHeadedListItem) {
        return ImgHeadedListItem;
    }
    Dispatcher = dispatcher;
    ImgHeadedListItem = React.createClass({
        ActionTypes: ActionTypes,
        propTypes: {
            data: React.PropTypes.object.isRequired,
            keyWords: React.PropTypes.any,
            dataType: React.PropTypes.string
        },
        _onClickHandler: function(e){
            e.preventDefault();
            var data = this.props.data.ori;
            console.log('datadatadatadata',data);
            if (data.type === 1) {
                var urll = URL.parse(dm.getUrl_home('/html/index.html?currentPg=courses_index&courseType=live_info#CRSPanelDetail'+ '-'+data.id), true); 
                window.location = URL.format(urll);
            }else if (data.type === 2) {
                var urll = URL.parse(dm.getUrl_home('/html/index.html?currentPg=courses_index&courseType=online_info#CRSPanelDetail'+ '-'+data.id), true); 
                window.location = URL.format(urll);
            }else if (data.type === 3) {
                var urll = URL.parse(dm.getUrl_home('/html/index.html?currentPg=courses_index&courseType=offline_info#CRSPanelDetail'+ '-'+data.id), true); 
                window.location = URL.format(urll);
            }
            // Dispatcher.dispatch({
            //     actionType: ActionTypes.GET_DETAIL,
            //     id: data.id,
            //     type: data.type
            // });
        },
        _onClickHandlerProduct: function(e){
            e.preventDefault();
            var data = this.props.data;
            // console.log('data',data);
            Dispatcher.dispatch({
                actionType: ActionTypes.PRODUCT,
                id: data.id,
                type: data.type
            });
        },
        _onClickMenuHandler: function(e){
            e.preventDefault();
            var data = this.props.data;
            Dispatcher.dispatch({
                actionType: ActionTypes.TOGGLE_CORNER_MENU,
                lesson: data
            });
        },
        render: function() {
            var data = this.props.data.ori;
            var dataType = this.props.dataType;
            switch(dataType) {
                case 'live': return live_info(data, this._onClickHandler, this.props.keyWords, this._onClickMenuHandler);
                case 'online': return online_info(data, this._onClickHandler, this.props.keyWords, this._onClickMenuHandler);
                case 'offline': return offline_info(data, this._onClickHandler, this.props.keyWords, this._onClickMenuHandler);
                default: return online_info(data, this._onClickHandler, this.props.keyWords, this._onClickMenuHandler);
            }
            
        }
    });
    return ImgHeadedListItem;
}
module.exports = init;

