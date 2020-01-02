import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Common from '../Common'

class LiveAlert extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
		};

	}

	_hideAlert(){
		EventCenter.emit("HideAlert")
	}
	_applyVoucher(){
		EventCenter.emit("ApplyVoucher")
	}
	_useDiscount() {
		EventCenter.emit("PropToDiscount")
	}
	//加入学习
	_addLesson(){
		Dispatcher.dispatch({
			actionType: 'AddLesson',
			id: this.props.id,
			type: this.props.type,
			isUsePoint:true,
		})
	}

  componentWillMount() {
  }
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	render(){

		var showAlert =(
			<div style={{...styles.white_alert,paddingTop:-1}}>
				<div style={{marginTop:25,fontSize:Fnt_Large,color:Common.Black}}>提示</div>
				<div style={{ color: '#333',fontSize:Fnt_Medium}}>很抱歉，本课程开课时间已超出您的VIP体验期限。</div>
				<div style={styles.alert_bottom}>
					<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:Fnt_Medium,color:Common.Activity_Text}} onClick={this._applyVoucher.bind(this)}>联系客服</div>
					<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Gray}}  onClick={this._useDiscount.bind(this)}>使用体验券</div>
				</div>
			</div>
		)

		var addShow = (
			<div style={{...styles.white_alert,paddingTop:-1}}>
				<div style={{marginTop:25,fontSize:Fnt_Medium,color:Common.Black}}>是否加入到您的选课？</div>
				<div style={{ color: '#333',fontSize:Fnt_Medium}}>目前剩余<span style={{color:Common.Activity_Text}}>{this.props.resource_count}</span>门课</div>
				<div style={styles.alert_bottom}>
					<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:Fnt_Medium,color:Common.Activity_Text}} onClick={this._addLesson.bind(this)}>加入选课</div>
					<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Gray}}  onClick={this._hideAlert.bind(this)}>取消</div>
				</div>
			</div>
		)

		var couponShow = (
			<div style={{...styles.white_alert,paddingTop:-1}}>
				<div style={{marginTop:20,fontSize:Fnt_Large,color:Common.Black,fontWeight:'bold'}}>提示</div>
				<div style={{ color: '#333',fontSize:Fnt_Medium,lineHeight:'20px',}}>您尚未获得此直播课观看权限</div>
				<div style={styles.alert_bottom}>
					<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:Fnt_Medium,color:Common.Activity_Text}} onClick={this._useDiscount.bind(this)}>使用体验券
					</div>
					<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Gray}} onClick={this._applyVoucher.bind(this)} >联系客服</div>
				</div>
			</div>
		)

    return(
      <div style={{display: this.props.isShow ? 'block' : 'none'}}>

				{
					this.props.usePoint == 0 ?
					couponShow
					:
					null
				}
				{this.props.usePoint == 1 ?
					addShow
					:
					null
				}
				{this.props.usePoint == 2 ?
					showAlert
					:
					null
				}

      </div>
    )
  }
}

var styles = {
	white_alert:{
		width:devWidth-100,
		height:150,
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

export default LiveAlert;
