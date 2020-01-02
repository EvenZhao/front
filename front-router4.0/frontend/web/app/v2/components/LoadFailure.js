import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common'

class LoadFailure extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
		};

	}

	//刷新页面
  _refresh(){
		window.location.reload()
  }
	render(){
    return(
      <div style={{...styles.container,}}>
				<div style={{width:devWidth,height:63,paddingTop:100,textAlign:'center'}}>
					<img src={Dm.getUrl_img('/img/v2/icons/load_failure@2x.png')} width="160" height="63"/>
				</div>
				<div style={{width:devWidth, display:'flex',flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
					<div style={{fontSize: Fnt_Normal,color:Common.Black}}>糟糕，加载失败~</div>
					<div style={{fontSize: Fnt_Normal,color:Common.Activity_Text,marginTop:12}}>去检查网络</div>
				</div>
				<div style={{width:devWidth,display:'flex',flexDirection:'row',justifyContent:'center',height:40,marginTop:28}}>
					<div style={styles.refresh} onClick={this._refresh.bind(this)}>
						点击刷新
					</div>
				</div>
			</div>
    )
  }
}

var styles = {
  container:{
		width:devWidth,
		height:devHeight,
		backgroundColor:Common.Bg_White,
	},
  refresh:{
		width:118,
		height:38,
		lineHeight:'38px',
		border:'solid 1px #666',
		backgroundColor:Common.Bg_White,
		fontSize:Fnt_Medium,
		color:Common.Gray,
		borderRadius:40,
		textAlign:'center',
	}
}

export default LoadFailure;
