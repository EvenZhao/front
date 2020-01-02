var Dispatcher;
var React = require('react');
var URL = require('url');
var PropTypes = React.PropTypes;
var keyMirror = require('keymirror');
var cx = require('classnames');
var assign = require('object-assign');
var dtfmt = require('../../util/format.js');
var patterns = require('../patterns.js');
var Ribbon = require('../Ribbon.jsx');
var FactoryTxt = require('../FactoryTxt.js');
var url_nophoto = 'http://www.bolue.cn/images/bot_qrcode.png';

var dm = require('../../util/DmURL');

var ActionTypes = keyMirror({
    GET_DETAIL: null,
    TOGGLE_CORNER_MENU: null,
    PRODUCT: null
});

function makeRibbons(data){
    var v_top = 0;
    var r_free = '';
    if(data.isFree) {
        r_free = <Ribbon cls="free" txt="免费" top={v_top} />;
        v_top += 30;
    }
    var r_ACCA = '';
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

function live_info(data, onClickHandler, keyWords, onClickMenuHandler){
    var status_txt = '';
    var ribbons = makeRibbons(data);
    var start_date = data && data.start_date ? data.start_date : '';
    var title = keyWords ? FactoryTxt.highLight(keyWords, data.title) : data.title;
    var style_img = {
        background: "url(" + (data.brief_image ? data.brief_image : url_nophoto) + ")"
    };
    return (
        <div className="list-div col-xs-12">
          <div className="div" onClick={onClickHandler}>
            <div style={style_img} className="row-head-img" >
            </div>
            <div className="title">
                <div className="">{title}</div>
            </div>
            <div className="time">
                <div className="">{start_date}</div>
            </div>
            {ribbons}
          </div>
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
            keyWords: React.PropTypes.array
        },
    	_onClickHandler: function(e){
            e.preventDefault();
            var data = this.props.data;
            console.log('data:',data);
            if (data.type === 1) {
                var urll = URL.parse(dm.getUrl_home('/html/index.html?currentPg=courses_index&courseType=live_info#CRSPanelDetail'+ '-'+data.id), true); 
                // history.replaceState({}, 'WAP首页', dm.getCurrentUrlWithNocache());
                window.location = URL.format(urll);
            }else if (data.type === 2) {
                var urll = URL.parse(dm.getUrl_home('/html/index.html?currentPg=courses_index&courseType=online_info#CRSPanelDetail'+ '-'+data.id), true); 
                // history.replaceState({}, 'WAP首页', dm.getCurrentUrlWithNocache());
                window.location = URL.format(urll);
            }
            // Dispatcher.dispatch({
            //     actionType: ActionTypes.GET_DETAIL,
            //     id: data.id,
            //     type: data.type
            // });
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
            // console.log('data',data);
            switch(data.type) {
                case 1: return live_info(data, this._onClickHandler, this.props.keyWords, this._onClickMenuHandler);
                // case 2: return online_info(data, this._onClickHandler, this.props.keyWords, this._onClickMenuHandler);
                default : return live_info(data, this._onClickHandler, this.props.keyWords, this._onClickMenuHandler);
            }
            
        }
    });
    return ImgHeadedListItem;
}
module.exports = init;

