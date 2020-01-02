var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;
var cx = require('classnames');
let lineheight=20;
function showLocationInfo(marker,address) {
    var opts = {
        width: 200, //信息窗口宽度
        height: 100, //信息窗口高度
        title: "" //信息窗口标题
    }
    // var addComp = rs.addressComponents;
    var addr = "举办地址：" + address;
    //alert(addr);
    var infoWindow = new BMap.InfoWindow(addr, opts); //创建信息窗口对象
    marker.openInfoWindow(infoWindow);
}
function MblogDotccMap(map) {
    //搜索
    map.panBy(point);

    local.getResults()

    local.setSearchCompleteCallback(function (searchResult) {
        var poi = searchResult.getPoi(0);
    });

}
var CRSPanelDetail_Address = React.createClass({
	propTypes:{
		city: PropTypes.object
	},
    getInitialState: function(){
        return {

        };
    },
    componentDidMount: function() {
        var map = new BMap.Map("container"); //初始化地图
        var opts = { type: BMAP_NAVIGATION_CONTROL_LARGE }; //初始化地图控件
        map.addControl(new BMap.NavigationControl(opts));
        var point = new BMap.Point(this.props.city.map_x, this.props.city.map_y); //初始化地图中心点
        var marker = new BMap.Marker(point); //初始化地图标记
        marker.disableDragging(); //标记开启拖拽
        var gc = new BMap.Geocoder();
        map.centerAndZoom(point, 15); //设置中心点坐标和地图级别
        map.addOverlay(marker); //将标记添加到地图中

    },
    componentWillUnmount: function() {
    },
	render: function(){
        // var cls_icons = cx('icons-div', {'icons-div-none': !this.state.valid_icons});
        // var cls_brief = cx('brief', {'brief-div': !this.state.valid_height});
        var style={
            width: document.body.clientWidth,
            height: document.body.clientWidth * 0.5
            // border: 1 'solid gray',
        };
		return (
			<div className="panel crs-content" onClick={this._onClickHandler}>
                <div className="panel-heading">
                    <span>会场地址</span>
                </div>
                <div className="panel-body">
                    <div className="container">{this.props.city.site}</div>
                    <div className="container">{this.props.city.address}</div>
                    <div style={style} className="map" id="container">
                    </div>
                </div>
            </div>
		);
	}
});
module.exports = CRSPanelDetail_Address;
