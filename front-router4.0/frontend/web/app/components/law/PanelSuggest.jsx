var AppDispatcher = require('../../dispatcher/LawDispatcher');
var React = require('react');
var PropTypes = React.PropTypes;
var dtfmt = require('../../util/format.js');
var LawStore = require('../../stores/LawStore');
var ActionTypes = LawStore.ActionTypes;

function getTheState(){
    return {

    };
}

var Item = React.createClass({
	onclickHandler: function(e){
        e.preventDefault();
        AppDispatcher.dispatch({
            actionType: LawStore.ActionTypes.GET_DETAIL,
            _id: this.props.data._id
        });
    },
    render: function() {
        var created_date = new Date(this.props.data.created_date).format(dtfmt.DATE);
        return (
            <div className="list-group">
              <button className="list-group-item" onClick={this.onclickHandler}>
                <h4 className="list-group-item-heading summary">{this.props.data.title}</h4>
                <p className="list-group-item-text summary-info row">
                    <span className="num-tag col-xs-8">{this.props.data.ori_law_num}</span>
                    <span className="date col-xs-4">{created_date}</span>
                </p>
              </button>
            </div>
        );
    }
});

var PanelSuggest = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		title: React.PropTypes.string
	},
	getInitialState: function(){
        return getTheState();
    },
    _onChange: function(){
        this.setState(getTheState());
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
	render: function(){
		var items = this.props.data.map(function(item){
			return (
                <Item key={item._id} data={item} />
            );
		});
		return (
			<div className="panel suggest">
                <div className="panel-heading">{this.props.title}</div>
                <div className="panel-body">
                    {items}
                </div>
            </div>
		);
	}
});
module.exports = PanelSuggest;

