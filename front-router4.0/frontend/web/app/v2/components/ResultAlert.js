import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Common from '../Common'
import Dm from '../util/DmURL'

class ResultAlert extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
		};

	}

  componentWillMount() {
  }
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	render(){
		//返回结果成功提示信息图标--成功:success@2x.png,失败:failure@2x.png
		//errStatus  0:返回错误信息,1:显示其他提示信息
		var successAlert =(
			<div style={{...Common.alertDiv,}}>
				<div style={{paddingTop:15,}}>
					<img src={Dm.getUrl_img('/img/v2/icons/success@2x.png')} width={42} height={42}/>
				 </div>
				 <span style={{color:Common.BG_White}}>{this.props.alert_title}</span>
			 </div>
		)

		var failureAlert = (
			<div style={{...Common.alertDiv}}>
				<div style={{paddingTop:15,}}>
					<img src={Dm.getUrl_img('/img/v2/icons/failure@2x.png')} width={22} height={23}/>
				 </div>
				 <span style={{color:Common.BG_White}}>{this.props.alert_title}</span>
			 </div>
		)

    return(
			<div style={{display:this.props.alert_display}}>
			
				{this.props.errStatus == 0 ?
					failureAlert
					:
					successAlert
				}
			</div>
    )
  }
}

export default ResultAlert;
