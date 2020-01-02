var React = require('react');
var PropTypes = React.PropTypes;
var Dispatcher = require('../../dispatcher/AppDispatcher.js');
var CoursesStore = require('../../stores/CoursesStore');
var ActionTypes = CoursesStore.ActionTypes;
var dtfmt = require('../../util/format.js');
var patterns = require('../patterns.js');
var util =  require('util'),
    f = util.format;
var cx = require('classnames');

var testcode = /^.{1,15}$/g;

var CRSPanelResourceCode_Redeem = React.createClass({
	propTypes:{
		lessonId: PropTypes.string,
		type: PropTypes.string
		
	},
	getInitialState: function(){
        return  {
        	discount: null,
        	discountCode: '',
        	valid_discountCode: false
        };
    },
    _onREDEEM: function(re){
    	Dispatcher.dispatch({
            actionType: CoursesStore.ActionTypes.REDEEM,
            param: {
            	discountCode: this.state.discountCode,
            	lessonId: this.props.lessonId,
				type: this.props.type
            }
        });
    },
    _onDiscountCodeChange: function(e){
    	e.preventDefault();
		var v = e.target.value || '';
		var valid_discountCode = false;
        if (v.search(testcode) > -1) {
	        valid_discountCode = true;
        }
        var state = {
            valid_discountCode: valid_discountCode
        };
        if(v.length < 15){
            state.discountCode = v;
        }
        this.setState( state );
    },
    componentDidMount: function() {
    	// CoursesStore.addEventListener(CoursesStore.Events.REDEEM_DONE, this._handleREDEEM_DONE);
    },
    componentWillUnmount: function() {
    	// CoursesStore.removeEventListener(CoursesStore.Events.REDEEM_DONE, this._handleREDEEM_DONE);
    },
	render: function(){
    	var cls_btn = cx('btn', 'col-xs-12', this.state.valid_discountCode ? 'btn-primary' : '');
		return (
			<div className="content">
				<div className="panel info-form">
	                <div className="panel-body code" >
						<div className="container form" >
							<div className="form-group col-xs-12">
								<div className="icon-input-head">
									<i className="fa fa-exchange"></i>
									<input type="text" className="form-control" ref="name" placeholder="兑换码"  onChange={this._onDiscountCodeChange} value={this.state.discountCode}/>
								</div>
							</div>
							<div className="form-group col-xs-12">
								<button className={cls_btn} disabled={!this.state.valid_discountCode} type="submit" onClick={this.state.valid_discountCode ? this._onREDEEM : null}>兑换</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
module.exports = CRSPanelResourceCode_Redeem;