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

var ActionTypes = keyMirror({
    GET_DETAIL: null,
    TOGGLE_CORNER_MENU: null
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
    if(data.associations[0]) {
        r_ACCA = <Ribbon cls="ACCA" txt={data.association.name} top={v_top} />;
        v_top += 30;
    }
    return (
        <div>
        {r_free}
        {r_ACCA}
        </div>
    );
}

function makeAssocias(associations){

}

function online_info(data, onClickHandler, keyWord, onClickMenuHandler){
    var duration = data && data.duration ? data.duration : 0;
    var ribbons = makeRibbons(data);
    var title = keyWord ? FactoryTxt.highLight(keyWord, data.title) : data.title;
    var cornerMenu = onClickMenuHandler ? <span className="col-xs-4 fa fa-ellipsis-h corner-menu" onClick={onClickMenuHandler}></span> : '';
    return (
        <div className="list-group img-headed-list-item">
          <button className="list-group-item img-headed-row">
            <img src={data.brief_image} className="col-xs-5 row-head-imgB" onClick={onClickHandler}/>
            <div className="col-xs-7">
                <div className="row title" onClick={onClickHandler}>{title}</div>
                <div className="row second-info" onClick={onClickHandler}>
                    <span className="duration col-xs-11 fa"> {duration}</span>
                </div>
                <div className="row third-info">
                    <span className="col-xs-8 visitorsB fa" onClick={onClickHandler}>{data.learn_num}</span>
                    {cornerMenu}
                </div>
            </div>
            {ribbons}
          </button>
        </div>
    );
}

function offline_info(data, onClickHandler, keyWord, onClickMenuHandler){
    var start_date = data && data.start_date ? new Date(data.start_date).format(patterns.DATE) : '';
    var start_time = data && data.start_time ? new Date(data.start_time).format(patterns.TIME) : '';
    var end_time = data && data.end_time ? new Date(data.end_time).format(patterns.TIME) : '';
    var city = data && data.city ? data.city : '';
    var ribbons = makeRibbons(data);
    var title = keyWord ? FactoryTxt.highLight(keyWord, data.title) : data.title;
    var cornerMenu = onClickMenuHandler ? <span className="col-xs-4 fa fa-ellipsis-h corner-menu" onClick={onClickMenuHandler}></span> : '';
    return (
        <div className="list-group img-headed-list-item">
          <button className="list-group-item img-headed-row">
            <img src={data.brief_image} className="col-xs-5 row-head-imgB" onClick={onClickHandler}/>
            <div className="col-xs-7">
                <div className="row title" onClick={onClickHandler}>{title}</div>
                <div className="row second-info" onClick={onClickHandler}>
                    <span className="date col-xs-8">{start_date} {start_time} ~ {end_time}</span>
                    <span className="place col-xs-4">{city}</span>
                </div>
                <div className="row third-info">
                    <span className="col-xs-8 visitorsB fa" onClick={onClickHandler}>{data.learn_num}</span>
                    {cornerMenu}
                </div>
            </div>
            {ribbons}
          </button>
        </div>
    );
}

function live_info(data, onClickHandler, keyWord, onClickMenuHandler){
    var start_date = data && data.start_time ? new Date(data.start_time).format(patterns.DATE) : '';
    var start_time = data && data.start_time ? new Date(data.start_time).format(patterns.TIME) : '';
    var end_time = data && data.end_time ? new Date(data.end_time).format(patterns.TIME) : '';
    var cornerMenu = (onClickMenuHandler ? <span className="col-xs-4 fa fa-ellipsis-h corner-menu" onClick={onClickMenuHandler}></span> : '');
    var status_txt = '';
    var status_cls = {
        status: true
    };
    switch(data.live_status){
        case 'not_started': status_txt = '未开始'; assign(status_cls, {not_started: true});break;
        case 'start_soon': status_txt = '快开始'; assign(status_cls, {not_started: true});break;
        case 'on_air': status_txt = '正直播'; assign(status_cls, {on_air: true});break;
        case 'ended': status_txt = '可回放'; assign(status_cls, {ended: true});break;
    } 
    status_cls = cx(status_cls);
    var ribbons = makeRibbons(data);
    var title = keyWord ? FactoryTxt.highLight(keyWord, data.title) : data.title;
    return (
        <div className="list-group img-headed-list-item">
          <button className="list-group-item img-headed-row">
            <img src={data.brief_image} className="col-xs-5 row-head-imgB" onClick={onClickHandler}/>
            <div className="col-xs-7">
                <div className="row title" onClick={onClickHandler}>{title}</div>
                <div className="row second-info" onClick={onClickHandler}>
                    <span className="date col-xs-8">{start_date} {start_time} ~ {end_time}</span>
                    <span className="status col-xs-4">
                        <span className={status_cls}>{status_txt}</span>
                    </span>
                </div>
                <div className="row third-info">
                    <span className="col-xs-8 visitorsB fa" onClick={onClickHandler}>{data.learn_num}</span>
                    {cornerMenu}
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
            keyWord: React.PropTypes.array
        },
    	_onClickHandler: function(e){
            e.preventDefault();
            var data = this.props.data;
            Dispatcher.dispatch({
                actionType: ActionTypes.GET_DETAIL,
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
            var data = this.props.data;
            switch(data.type) {
                case 'live_info': return live_info(data, this._onClickHandler, this.props.keyWord, this._onClickMenuHandler);
                case 'online_info': return online_info(data, this._onClickHandler, this.props.keyWord, this._onClickMenuHandler);
                case 'offline_info': return offline_info(data, this._onClickHandler, this.props.keyWord, this._onClickMenuHandler);
            }
            
        }
    });
    return ImgHeadedListItem;
}
module.exports = init;

