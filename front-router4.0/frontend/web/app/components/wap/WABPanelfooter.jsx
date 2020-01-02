var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var MeStore = require('../../stores/MeStore');
var ActionTypes = MeStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var cx = require('classnames');
var patterns = require('../patterns.js');
var dtfmt = require('../../util/format.js');
var AuthStore = require('../../stores/AuthStore.js')(Dispatcher);


function backTop (argument) {
    var speed=200;//滑动的速度
        jQuery('body,html').animate({ scrollTop: 0 }, speed);
        return false;
}

var WEBPanelfooter = React.createClass({
    propTypes: {
       
    },
    getInitialState: function(){
        return {
            
        };
    },
    _handBackTop: function(){
        backTop();
    },
    _handcomputer: function(){
        window.location.href="www.bolue.cn"
    },
    _handleLOGIN: function(){
        AuthStore.emit(AuthStore.Events.SC403);
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    render: function(){
        return (
            <div className="web-footer">
                <div>
                    {
                        isWeiXin ? '':
                        <div className="">
                            <span className="span-color" onClick={this._handleLOGIN}>登陆</span><span>丨</span><span className="span-color" onClick={this._handleLOGIN}>注册</span><span>丨</span>  <span>400-689-0679</span> <span>丨</span> <span className="span-color" onClick={this._handBackTop}>回到顶部</span> 
                        </div>
                    }
                    {
                        isWeiXin ? '':
                        <div className="compot">
                            <span><a href="http://www.bolue.cn">电脑版</a></span> <span>丨</span><span>触屏版</span> <span>丨</span><span>APP下载</span>
                        </div>
                    }
                </div>
                 <div>
                    <div className="">
                        <span className=""> © 2013 - 2016 www.bolue.cn All Rights Reversed.</span> 
                    </div>
                    <div className="">
                        <span>铂略企业管理咨询(上海)有限公司</span>
                    </div>
                    <div className="">
                        <span>沪ICP备13020075号</span>
                    </div>
                </div>

            </div>
        );
    }
});
module.exports = WEBPanelfooter;


