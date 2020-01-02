var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var cx = require('classnames');

var CRSPanelDetail_Association = React.createClass({
	propTypes:{
		associations: PropTypes.array,
        isSelected: React.PropTypes.bool
	},
    getInitialState: function(){
        return {
            isSelected: false,
            valid_icons: true,
            valid_height: true
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
        var introduction = ReactDOM.findDOMNode(this.refs.introduction);
        var h = introduction.clientHeight;
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
        var cls_introduction = cx('association-introduction', {'association-introduction-div': !this.state.valid_height});
        var assocs = this.props.associations ? this.props.associations.map( 
            item => <div key={item.id}>
                        <div className="association-name">{item.name}</div>
                        {this.state.isSelected ? 
                            <div className="association-introduction-div" >
                               {item.introduction} 
                                <div className={cls_icons}><i className="fa fa-chevron-up"></i></div>
                            </div>
                            : <div className="association-introduction-div">
                                <div className={cls_introduction} >
                                    <div ref="introduction">{item.introduction}</div> 
                                </div>
                                <div className={cls_icons}><i className="fa fa-chevron-down"></i></div>
                            </div>
                        }
                        
                    </div>
        ) : '';
		return (
			<div className="panel crs-content" onClick={this._onClickHandler}>
                <div className="panel-heading">
                    <span>合作协会</span>
                </div>
                <div className="panel-body">
                	{assocs}
                </div>
            </div>
		);
	}
});
module.exports = CRSPanelDetail_Association;