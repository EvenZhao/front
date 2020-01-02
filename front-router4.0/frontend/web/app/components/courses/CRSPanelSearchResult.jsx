var Dispatcher = require('../../dispatcher/AppDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var CoursesStore = require('../../stores/CoursesStore');
var ActionTypes = CoursesStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');
var Item = require('./CRSImgHeadedListItem.jsx')(Dispatcher);

var PropType_data = function (props, propName, component) {
    if ( !props[propName].id ){
        return new Error('Invalid id!');
    }
    if ( !props[propName].title || typeof props[propName].title !== 'string' ){
        return new Error('Invalid title!');
    }
};
// var Row = React.createClass({
//     onclickHandler: function(e){
//         e.preventDefault();
//         Dispatcher.dispatch({
//             actionType: CoursesStore.ActionTypes.GET_DETAIL,
//             id: this.props.data.id
//         });
//     },
//     render: function() {
//         var title = ' ';
//         if(this.props.keyWords){
//             title = FactoryTxt.highLight(this.props.keyWords, this.props.data.title);
//         }else{
//             title = this.props.data.title;
//         }
//         return (
//             <button className="list-group-item" onClick={this.onclickHandler}>
//                 {title}
//             </button>
//         );
//     }
// });

var CRSPanelSearchResult = React.createClass({
    propTypes: {
        data: PropTypes.arrayOf(PropType_data),
        keyWords: React.PropTypes.array
    },
    getInitialState: function(){
        return {
            data: this.props.data || []
        };
    },
    render: function(){
        var data = this.props.data || [];
        var rows = data.map(function (item, index) {
           return (
                <Item key={index} data={item} keyWords={this.props.keyWords}/>
            );
        }.bind(this));
        return (
            <div className="list-group crs-search-result">
                {rows}
            </div>
        );
    }
});
module.exports = CRSPanelSearchResult;


