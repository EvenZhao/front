var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var assign = require('object-assign');
var cx = require('classnames');
var util =  require('util'),
    f = util.format;
var URL = require('url');
var dm = require('./util/DmURL.js');
var Dispatcher = require('./dispatcher/AppDispatcher.js');
require('./util/PgSetup.js')(React);
var CoursesStore = require('./stores/CoursesStore.js');
var AuthStore = require('./stores/AuthStore.js')(Dispatcher);
//pg location

var urlquery = dm.getCurrentUrlQuery();

function getDim_player(){
	return ({
		width: document.body.clientWidth,
		height: document.body.clientWidth * 0.62
	});
}

function reloadpg(){
	document.location.reload(true);
}

var Live = React.createClass({
	propTypes:{
	},
	getInitialState: function(){

        return  {

        };
    },
    componentDidMount: function() {
    	// window.addEventListener("orientationchange", reloadpg, false);
    	var url = URL.parse(dm.getUrl_home('/courses_index.js?courseType=live_info'));
    	AuthStore.do_AUTHENTICATE({
            url_cb: url,
            noAuthCB: function(){
		    	Dispatcher.dispatch({actionType: CoursesStore.ActionTypes.ADD_JOIN, lesson: {type: 'live_info', id: urlquery.lessonId}});
            }
        });
    },
    componentWillUnmount: function() {
    	// window.removeEventListener("orientationchange", reloadpg, false);
    },

	render: function(){
		var dim_vdplayer = getDim_player();
		var dim_layout = assign({}, dim_vdplayer, {
			height: dim_vdplayer.height * 2.3
		});
		return (
			<div className="live_v_player_container">
				{/*<div className="live_doc_player" style={dim_vdplayer} dangerouslySetInnerHTML={
					{
						__html: f(
							'<gs:doc site="linked-f.gensee.com" ctx="webcast" ownerid="%s" authcode="%s" uid="123456789" uname="testlinkedf" lang="zh_CN" bar="true"/>',
							urlquery.vid,
							urlquery.authcode

						)
					}
				}/>*/}
				<div className="live_v_player" style={dim_vdplayer} dangerouslySetInnerHTML={
					{
						__html: f(
							'<gs:video-live  site="linked-f.gensee.com" ctx="webcast" ownerid="%s" authcode="%s" uname="%s" lang="zh_CN" bar="true"></gs:video-live>',
							urlquery.vid,
							urlquery.authcode,
							urlquery.uname
						)
					}
				}/>
			</div>
		);
	}
});
module.exports = Live;
ReactDOM.render( <Live /> ,
    document.getElementById('react')
);


