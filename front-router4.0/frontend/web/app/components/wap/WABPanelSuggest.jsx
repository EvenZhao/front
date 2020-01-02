var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var cx = require('classnames');
var assign = require('object-assign');
var dtfmt = require('../../util/format.js');
var Store = require('../../stores/WapStore');
var ActionTypes = Store.ActionTypes;
var patterns = require('../patterns.js');
var Item = require('./WABImgHeadedListItem.jsx')(Dispatcher);

function getTheState(){
    return {

    };
}

var WABPanelSuggest = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		title: React.PropTypes.string,
        onlineType : React.PropTypes.string,
        online_info: React.PropTypes.object
	},
	getInitialState: function(){
        return getTheState();
    },
    _onChange: function(){
        this.setState(getTheState());
    },
    _onClickChangeHotType: function(e){
        // console.log(' onlineType: h');
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: ActionTypes.WAP_CHANGE_ONLICE_TYPE,
            onlineType: 'h'
        });
    },
    _onClickChangeNewType: function(e){
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: ActionTypes.WAP_CHANGE_ONLICE_TYPE,
            onlineType: 'n'
        });
    },
    _onClickChangeFreeType: function(e){
        e.preventDefault();
        Dispatcher.dispatch({
            actionType: ActionTypes.WAP_CHANGE_ONLICE_TYPE,
            onlineType: 'f'
        });
    },
    componentDidMount: function() {
        // console.log('online_info',this.props.data);
    },
    componentWillUnmount: function() {
        // console.log('online_info',this.props.data);

    },
	render: function(){
            // console.log('ttttt2222222222tttttt',this.props.onlineType);
            var online = this.props.online_info ? this.props.online_info : '';
            var hotest =  online.hotest ? online.hotest : '';
            var newest = online.newest ? online.newest : '';
            var free = online.free ? online.free : '';
            // console.log('newest',newest);
            // console.log('hotest',hotest);
            // console.log('free',free);
            // console.log('onlineType',this.props.onlineType);
            var onlineButton = '';
            var onlineItem;
            switch(this.props.onlineType){
                case 'h' :
                    onlineButton = (
                        <div className="button-div">
                            <span className="span-click" onClick={this._onClickChangeHotType}>最热</span>
                            <span onClick={this._onClickChangeNewType}>最新</span>
                            <span onClick={this._onClickChangeFreeType}>免费</span> 
                        </div>
                    );
                    if (hotest) {  
                        onlineItem = hotest.map(function(item, index){
                            return (
                                <Item key={index} data={item} />
                            );
                        });
                    }
                break;
                case 'n' :
                    onlineButton = (
                        <div className="button-div">
                            <span onClick={this._onClickChangeHotType}>最热</span>
                            <span className="span-click" onClick={this._onClickChangeNewType}>最新</span>
                            <span onClick={this._onClickChangeFreeType}>免费</span> 
                        </div>
                    );
                    if (newest) {  
                        onlineItem = newest.map(function(item, index){
                            return (
                                <Item key={index} data={item} />
                            );
                        });
                    }
                break;
                case 'f' :
                     onlineButton = (
                        <div className="button-div">
                            <span onClick={this._onClickChangeHotType}>最热</span>
                            <span onClick={this._onClickChangeNewType}>最新</span>
                            <span className="span-click" onClick={this._onClickChangeFreeType}>免费</span> 
                        </div>
                    );
                    if (free) { 
                         onlineItem = free.map(function(item, index){
                            return (
                                <Item key={index} data={item} />
                            );
                        });
                    }
                break;

            }
        var items = this.props.data.map(function(item, index){
			return (
                <Item key={index} data={item} />
            );
		});
		return (
			<div className="wap-home-list">
                <div className="panel-heading">{this.props.title}
                     {this.props.onlineType ? 
                        <a href="./index.html?currentPg=courses_index&courseType=online_info">
                        <img className="image" src="../img/more_list.png" height="23" width="13"/></a>
                         : <a href="./index.html?currentPg=courses_index&courseType=live_info">
                         <img className="image" src="../img/more_list.png" height="23" width="13"/></a> 
                     }
                </div>
                {
                    this.props.onlineType ? onlineButton   : ''     
                }
                <div className="panel-body">
                    {onlineItem ? onlineItem : items}
                </div>
            </div>
		);
	}
});
module.exports = WABPanelSuggest;

