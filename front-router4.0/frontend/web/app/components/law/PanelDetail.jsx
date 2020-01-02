var React = require('react');
var PropTypes = React.PropTypes;
var dtfmt = require('../../util/format.js');
var FactoryTxt = require('../FactoryTxt.js');

function getTheState(){
    return {

    };
}

var PanelDetail = React.createClass({
	propTypes: {
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
        var created_date = ' ';
        var content = ' ';
        var content_arr = [];
        var title = ' ';
        var ori_law_num = ' ';
        if(this.props.data){
            if(this.props.data.created_date) { created_date = new Date(this.props.data.created_date).format(dtfmt.DATE); }
            if(this.props.data.content) { content_arr = this.props.data.content; }
            if(content_arr.length > 0) {
                content = content_arr.map(function(currentValue, index, array){
                    if(currentValue && currentValue.length > 0){
                        if(this.props.keyWord){
                            currentValue = FactoryTxt.highLight(this.props.keyWord, currentValue);
                            return (<p key={index}>{currentValue}</p>);
                        }else{
                            // if(this.props.data.isNasty){
                            //     return (<p key={index}>{currentValue}</p>);
                            // }else{
                            return (<p key={index} dangerouslySetInnerHTML={ { __html: currentValue } }></p>);
                            // }
                        }
                    }
                }.bind(this));
            }
            if(this.props.data.title) {
                if(this.props.keyWord){
                    title = FactoryTxt.highLight(this.props.keyWord, this.props.data.title);
                }else{
                    title = this.props.data.title;
                }
            }
            if(this.props.data.ori_law_num){
                if(this.props.keyWord){
                    ori_law_num = FactoryTxt.highLight(this.props.keyWord, this.props.data.ori_law_num + '');
                }else{
                    ori_law_num = this.props.data.ori_law_num;
                }
            }
        }
        return (
			<div className="panel detail">
                <div className="panel-heading">
                    <span className="title">{title}</span>
                    <div className="title-info col-xs-12">
                        <span className="col-xs-12 law-num">{ori_law_num}</span>
                    </div>
                    <div className="title-info col-xs-12">
                        <span className="col-xs-8 law-date">{created_date}</span>
                        <span className="col-xs-4 org-name">铂略咨询</span>
                    </div>
                </div>
                <div className="panel-body">
                    {content}
                    {/*<div className="body-info">
                        <span className="col-xs-12 from-src">财务部</span>
                        <span className="col-xs-12 date">2015-07-17</span>
                    </div>*/}
                </div>
                {/*<div className="panel-footer">
                    <div className="attachment">
                        <span className="prefix col-xs-12">附件：</span>
                        <span className="title col-xs-12">国务院国发[1986]21号文件</span>
                        <span className="body">
                            财政部关于对深圳、珠海、汕头、厦门经济特区内联企业征收所得税问题的通知 (86)财税字122号 1986-05-28 为了支持经济特区发展，做好外引内联工作，促进经济特区向外向型转变，引进先进技术，扩大产品出口，根据1986年2月7日国务院国发[1986]21号文件“关于对内联企业税收的优惠办法”的精神，现对在深圳、珠海、汕头、厦门经济特区内经营的内联企业征收所得税问题通知如下。
                        </span>
                    </div>
                </div> */}
            </div>
		);
	}
});
module.exports = PanelDetail;
