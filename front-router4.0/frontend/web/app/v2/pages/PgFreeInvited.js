/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common'


class PgFreeInvited extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
		};
	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-小铂')
		devWidth = window.screen.width;
    devHeight = window.innerHeight;
	}
	//(devHeight / 2) - [(devWidth / 2) / 2]
	render(){
		return (
			<div style={{width:devWidth,height:devHeight}}>
				<div style={{textAlign:'center'}}>
					<img src={Dm.getUrl_img('/img/v2/icons/webwxgetmsgimg.png')} style={{marginTop:(devHeight - devWidth / 2)/2 , width: devWidth / 2, height: devWidth / 2}}/>
					<div style={{marginTop:20,fontSize:18}}>长按识别二维码添加客服</div>
				</div>
			</div>
		)
	}
}

export default PgFreeInvited;
