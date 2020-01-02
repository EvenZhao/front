var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var cx = require('classnames');
let lineheight=20;

var CRSPanelDetail_Summary = React.createClass({
	propTypes:{
		brief: PropTypes.string,
        isSelected: React.PropTypes.bool
	},
    getInitialState: function(){
        return {
            isSelected: false,
            valid_icons: true,
            valid_height:true
        };
    },
    _onClickHandler: function(){
        if (this.state.isSelected) {
            this.setState({
                isSelected:false
            });
        } else {
            this.setState({
                isSelected:true
            });
        }
    },
    _onHandlerHeight :function(){
        // var h = jQuery("#brief").height();
        var brief = ReactDOM.findDOMNode(this.refs.brief);
        var h = brief.clientHeight;
        if (h < 70) {
            this.setState({
                valid_icons: false,
                isSelected :true,
                valid_height :false
            });
        } else {
            this.setState({
                valid_icons: true,
                isSelected :false,
                valid_height :true
            });
        }
    },
    componentDidMount: function() {
        {this._onHandlerHeight()}

    },
    componentWillUnmount: function() {
    },

	render: function(){
        var cls_icons = cx('icons-div', {'icons-div-none': !this.state.valid_icons});
        var cls_brief = cx('brief', {'brief-div': !this.state.valid_height});
		return (
			<div className="panel crs-content" onClick={this._onClickHandler}>
                <div className="panel-heading">
                    <span>课程介绍</span>
                </div>
                <div className="panel-body">
                    { this.state.isSelected ?
                    	<div className="brief-div" >
                            {this.props.brief}
                            <div className={cls_icons}><i className="fa fa-chevron-up"></i></div>
                        </div>
                        : <div className="brief-div" onClick={this._onClickHandler}>
                            <div className={cls_brief}>
                                <div  ref="brief">
                                    {this.props.brief}
                                </div>
                            </div>
                            <div className={cls_icons}><i className="fa fa-chevron-down"></i></div>
                        </div>
                    }
                </div>
            </div>
		);
	}
});
module.exports = CRSPanelDetail_Summary;