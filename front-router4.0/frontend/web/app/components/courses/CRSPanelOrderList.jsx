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
var CoursesStore = require('../../stores/CoursesStore.js');
var URL = require('url');
var dm = require('../../util/DmURL');

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


function product(data, onClickHandler, keyWords, onClickMenuHandler){
    var level_num = data && data.level_num ? data.level_num : 0;
    var course_num = data && data.course_num ? data.course_num : 0;
    var ribbons = makeRibbons(data);
    var title = keyWords ? FactoryTxt.highLight(keyWords, data.title) : data.title;
    var cornerMenu = '';//(onClickMenuHandler ? <span className="col-xs-2 fa fa-ellipsis-h corner-menu" onClick={onClickMenuHandler}></span> : '');
    var associations = makeAssocias(data.associations);
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

var PanelOrderList;
function init(dispatcher){
    if(PanelOrderList) {
        return PanelOrderList;
    }
    Dispatcher = dispatcher;
    PanelOrderList = React.createClass({
        propTypes: {
            data: React.PropTypes.any,
            keyWords: React.PropTypes.any,
            orderId: React.PropTypes.string,
            isPayed: React.PropTypes.bool
        },
        _onClickHandlerProduct: function(e){
            var orderId = this.props.orderId;
            var data = this.props.data;
            var isPayed = this.props.isPayed;
            if (isPayed) {
                var urll = URL.parse(dm.getUrl_home('/html/courses_index.html?courseType=product#CRSPanelProductLevelList'+ '-'+data.lessonId), true); 
            }else{
                var urll = URL.parse(dm.getUrl_home('/html/courses_index.html?courseType=product#CRSPanelOrder'+ '-'+orderId), true);
            }
            console.log();
            window.location = URL.format(urll);
        },
        _onClickMenuHandler: function(e){
            e.preventDefault();
            var data = this.props.data;
            Dispatcher.dispatch({
                actionType: CoursesStore.ActionTypes.TOGGLE_CORNER_MENU,
                lesson: data
            });
        },
        render: function() {
            var data = this.props.data;

             return product(data, this._onClickHandlerProduct, this.props.keyWords, this._onClickMenuHandler);
        }
    });
    return PanelOrderList;
}
module.exports = init;

