import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import Common from '../Common'
/*考试功能相关消息通知弹框*/
class DataPrompt3 extends React.Component {
	constructor(props) {
    	super(props);
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
      <div>
      	<div style={{...styles.white_alert,paddingTop:-1,display: this.props.isShow ? 'block' : 'none'}}>
	        <div style={{marginTop:25,fontSize:Fnt_Large,color:Common.Black}}>提示</div>
	        <div style={{ color: '#333',fontSize:Fnt_Medium, marginTop:'20px'}}>
	          本功能目前仅供PC与APP端使用，
	          <div>请前往PC或APP端进行操作。</div>
	        </div>
	        <div style={styles.alert_bottom}>
	          <div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Activity_Text}} onClick={this._hideAlert.bind(this)}>知道了</div>
	        </div>
	     </div>
		<div style={{ ...styles.msk, display: this.props.isShow ? 'block' : 'none' }} onClick={this._hideAlert.bind(this)}></div>
      </div>
    )
  }
}

var styles = {
	msk: {
		width: devWidth,
		height: devHeight,
		backgroundColor: '#000000',
		position: 'fixed',
		zIndex: 999,
		opacity: 0.2,
		top: 0,
		textAlign: 'center',
	},
	white_alert:{
		width:devWidth-100,
		height:200,
		backgroundColor:Common.Bg_White,
		borderRadius:12,
		position:'fixed',
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

export default DataPrompt3;
