var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var MeStore = require('../../stores/MeStore');
var ActionTypes = MeStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var cx = require('classnames');
var patterns = require('../patterns.js');
var dtfmt = require('../../util/format.js');



function reden(){
    // jQuery(function() {
        
    // })
        var bannerSlider = new Slider(jQuery('#banner_tabs'), {
            time: 5000,
            delay: 400,
            event: 'hover',
            auto: true,
            mode: 'fade',
            controller: jQuery('#bannerCtrl'),
            activeControllerCls: 'active'
        });
        jQuery('#banner_tabs .flex-prev').click(function() {
            bannerSlider.prev()
        });
        jQuery('#banner_tabs .flex-next').click(function() {
            bannerSlider.next()
        });
}



var WABPanelHomeTop = React.createClass({
    items: [],
    propTypes: {
       adv_info: React.PropTypes.array
    },
    getInitialState: function(){
        return {
            
        };
    },
    componentDidMount: function() {
        var adv_info = this.props.adv_info || [];
        setTimeout(function(){
            reden();
        }, 1000); 
        
    },
    componentWillUnmount: function() {
    },
    render: function(){
        var adv_info = this.props.adv_info || [];
        var style= {
            position: 'absolute',
            left: '0px',
            top: '0px'
        };
        if (adv_info) {
            this.items = adv_info.map(function(item, index){
                var count = index + 1;
                return (
                    <li key={index} style={style}>
                        <a title={item.title} target="_blank" href={item.link}>
                            <img alt=""  src={item.brief_image} width="100%" height="180px;"/>
                        </a>
                    </li>
                );
            }); 
        }
        var sort =  adv_info.map(function(item, index){
            var count = index + 1;
            return (
                <li key={count}><a>{count}</a></li>
            );
        });
        // reden();
        return (
            <div className="web-home-top">
                <div className="div-second">
                    <div id="banner_tabs" className="flexslider">
                        <ul className="slides">
                           {this.items}   
                        </ul>
                        <ul className="flex-direction-nav">
                            <li><a className="flex-prev" href="javascript:;">Previous</a></li>
                            <li><a className="flex-next" href="javascript:;">Next</a></li>
                        </ul>
                        <ol id="bannerCtrl" className="flex-control-nav flex-control-paging">
                            {sort}
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = WABPanelHomeTop;


