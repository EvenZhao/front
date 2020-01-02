var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var MeStore = require('../../stores/MeStore');
var ActionTypes = MeStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var Item = require('../../components/courses/CRSImgHeadedListItem.jsx')(Dispatcher);

var PropType_data = function (props, propName, component) {
    if ( !props[propName].id ){
        return new Error('Invalid id!');
    }
    if ( !props[propName].title || typeof props[propName].title !== 'string' ){
        return new Error('Invalid title!');
    }
};

var MEPanelSearchResult = React.createClass({
    propTypes: {
        data: PropTypes.arrayOf(PropType_data),
        keyWord: React.PropTypes.array
    },
    getInitialState: function(){
        return {
            data: this.props.data || []
        };
    },
    render: function(){
        var data = this.props.data || [];
        var rows = data.map(function (item) {
           return (
                <Item key={item.id} data={item} keyWord={this.props.keyWord}/>
            );
        }.bind(this));
        return (
            <div className="list-group crs-search-result">
                {rows}
            </div>
        );
    }
});
module.exports = MEPanelSearchResult;


