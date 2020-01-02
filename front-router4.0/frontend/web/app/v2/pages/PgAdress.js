/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from './ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';

class PgAdress extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
		};
	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-地图')
    var map = new BMap.Map("allmap"); //初始化地图
    var opts = { type: BMAP_NAVIGATION_CONTROL_LARGE }; //初始化地图控件
    map.addControl(new BMap.NavigationControl(opts));
    var point = new BMap.Point(this.props.location.state.map_x, this.props.location.state.map_y); //初始化地图中心点
    var marker = new BMap.Marker(point); //初始化地图标记
    marker.disableDragging(); //标记开启拖拽
    var gc = new BMap.Geocoder();
    map.centerAndZoom(point, 15); //设置中心点坐标和地图级别
    map.addOverlay(marker); //将标记添加到地图中
	}
	render(){
		return (
			<div id='allmap' style={{...styles.map}}></div>
		)
	}
}

var styles = {
  map: {
    width: devWidth,
    height: devHeight,
    overflow: 'hidden',
    margin:0,
    fontFamily:"微软雅黑",
  }
}

export default PgAdress;
