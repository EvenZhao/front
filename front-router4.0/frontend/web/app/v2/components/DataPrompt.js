import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';

import { Link } from 'react-router-dom';

import Common from '../Common'

/*课程资料有更新的消息通知弹框*/

class DataPrompt extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
		};

	}

	_hideAlert(){
		EventCenter.emit("HideAlert")
	}

  componentWillMount() {
  }
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	render(){

    return(
      <div style={{...styles.white_alert,paddingTop:-1,display: this.props.isShow ? 'block' : 'none'}}>
        <div style={{marginTop:25,fontSize:Fnt_Large,color:Common.Black}}>提示</div>
        <div style={{ color: '#333',fontSize:Fnt_Medium}}>
          目前仅电脑端支持资料下载功能，
          <div>请使用电脑访问铂略网站下载。</div>
        </div>
        <div style={{fontSize:Fnt_Medium,color:Common.Activity_Text}}>www.bolue.cn</div>
        <div style={styles.alert_bottom}>
          <div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Activity_Text}} onClick={this._hideAlert.bind(this)}>知道了</div>
        </div>
      </div>
    )
  }
}

var styles = {
	white_alert:{
		width:devWidth-100,
		height:200,
		backgroundColor:Common.Bg_White,
		borderRadius:12,
		position:'absolute',
		zIndex:1000,
		top:180,
		left:50,
		textAlign:'center',
	},
	alert_bottom:{
		position:'absolute',
		zIndex:201,
		bottom:0,
		left:0,
		width:devWidth-100,
		height:42,
		borderTopStyle:'solid',
		borderTopWidth:1,
		borderTopColor:'#d4d4d4',
		display:'flex',
		flex:1,
	},
}

export default DataPrompt;
