var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var Dispatcher = require('../dispatcher/AppDispatcher.js');
var CoursesStore = require('../stores/CoursesStore.js');
/*
*#Container - SwapToLoadContainer #
*/
var DownloadApp = React.createClass({
    propTypes:{
        lesson: PropTypes.object
    },
    getInitialState: function() {
        return {
            hideAPP: false,
            hideShare: false
        };
    },
    componentDidMount: function() {
        if (this.props.lesson && this.props.lesson.type !=='product') {};
    },
    componentWillUnmount: function() {
        this._doCloseApp();
    },
    _doWonloadApp: function(){
        if (isWeiXin) {
            this.setState({
                hideShare: true
            });
        }else{
            // var lesson = this.props.lesson || [];
            // var urll = 'com.linked-f.app://lesson/'+lesson.type+'/'+lesson.id
            // alert(urll);
            // window.open(urll); 
            setTimeout( function(){ window.location="http://mb.bolue.cn/dlapp"; } , 1500);   
        }
    },
    _doCloseApp: function(){
            Dispatcher.dispatch({
                actionType: CoursesStore.ActionTypes.HIED_APP
            });
            this.setState({
                hideAPP: true
            });
    },
    _hideShare:function(){
        this.setState({
            hideShare: false
        });
    },
	render: function(){
        var lesson = this.props.lesson || [];
        var url = 'com.linked-f.app://lesson/'+lesson.type+'/'+lesson.id
        var cls= cx(this.state.hideAPP ? 'downloadapp downloadapp-hide':'downloadapp');
        var clsShare = cx(this.state.hideShare ? 'downloadapp-share ':' downloadapp-hide downloadapp-share');
        var clszzc = cx(this.state.hideShare? 'downloadapp-zzc':'downloadapp-zzc downloadapp-hide');
		return (
            <div>
    			<div className={cls}>
                    <div className="left-div" onClick={this._doCloseApp}>
                        <i className="fa fa-times ion" aria-hidden="true"></i>
                    </div>
                    <div className="left-div">
                        <span className="span-left" onClick={this._doCloseApp}>铂略</span>
                        <span className="span-right">bolue.cn</span>
                    </div>
    				<div className="right-div" onClick={this._doWonloadApp}>
                        <span className="span-right">
                            <i className="fa fa-mobile span-left" aria-hidden="true"></i>
                            {isApple ? <a href={url}>点击APP中打开</a> : <a>点击APP中打开</a>}
                        </span>
                    </div>
    			</div>
                <div className={clsShare} onMouseLeave={this._hideShare}>
                    <div className="div-top">请点击右上角的「...」按钮<i className="fa fa-level-up li-up" aria-hidden="true"></i></div>
                    <div>选择「在浏览器中打开」后再次尝试~</div>
                </div>
                <div className={clszzc} onTouchEnd={isApple && isWeiXin ? this._hideShare :''}>

                </div>
            </div>
		);
	}
});
module.exports = DownloadApp;

