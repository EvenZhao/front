var AppDispatcher = require('../../dispatcher/LawDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var LawStore = require('../../stores/LawStore');
var ActionTypes = LawStore.ActionTypes;
var FactoryTxt = require('../FactoryTxt.js');

var PropType_data = function (props, propName, component) {
    if ( !props[propName]._id ){
        return new Error('Invalid _id!');
    }
    if ( !props[propName].title || typeof props[propName].title !== 'string' ){
        return new Error('Invalid title!');
    }
};
var Row = React.createClass({
    onclickHandler: function(e){
        e.preventDefault();
        AppDispatcher.dispatch({
            actionType: LawStore.ActionTypes.GET_DETAIL,
            _id: this.props.data._id
        });
    },
    render: function() {
        var title = ' ';
        if(this.props.keyWord){
            title = FactoryTxt.highLight(this.props.keyWord, this.props.data.title);
        }else{
            title = this.props.data.title;
        }
        return (
            <button className="list-group-item" onClick={this.onclickHandler}>
                {title}
            </button>
        );
    }
});

var PanelSearchResult = React.createClass({
	propTypes: {
        data: PropTypes.arrayOf(PropType_data),
        keyWord: PropTypes.array
	},
	getInitialState: function(){
        return {
            data: this.props.data || []
        };
    },
	render: function(){
        var data = this.props.data || [];
        var rows = data.map(function (row) {
           return (
                <Row key={row._id} data={row} keyWord={this.props.keyWord}/>
            );
        }.bind(this));
		return (
            <div className="list-group search-result">
                {rows}
            </div>
		);
	}
});
module.exports = PanelSearchResult;


