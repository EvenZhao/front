var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var MeStore = require('../../stores/MeStore');
var ActionTypes = MeStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var cx = require('classnames');
var patterns = require('../patterns.js');
var dtfmt = require('../../util/format.js');

var WAPPanelHomeMeun = React.createClass({
    propTypes: {
       
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
        return (
            <div className="web-home-meun">
                <div className="">
                   <span className="col-xs-3"><a href="./index.html?currentPg=courses_index&courseType=live_info"><img src="../img/live.png" height="65px" width="65px"/></a></span>
                   <span className="col-xs-3"><a href="./index.html?currentPg=courses_index&courseType=online_info"><img src="../img/onlive.png" height="65px" width="65px"/></a></span>
                   <span className="col-xs-3"><a href="./index.html?currentPg=courses_index&courseType=offline_info"><img src="../img/offlive.png" height="65px" width="65px"/></a></span>
                   <span className="col-xs-3"><a href="./index.html?currentPg=courses_index&courseType=product"><img src="../img/product.png" height="65px" width="65px"/></a></span>
                </div>
            </div>
        );
    }
});
module.exports = WAPPanelHomeMeun;


