import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Common from '../Common'

class NoteAlert extends React.Component {
	constructor(props) {
    super(props);

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
		var date = '';//日期
		var date_text = '';
		if(this.props.plan_release_date){
			date = new Date(this.props.plan_release_date).format('yyyy');
			var year = new Date().getFullYear();
			if(date == year){
				date_text = (new Date(this.props.plan_release_date).getMonth()+1)+'月';//月份
			}
			else {
				date_text = new Date(this.props.plan_release_date).format('yyyy年M月')
			}

		}

		var showAlert =(
			<div style={{...styles.white_alert,paddingTop:-1}}>
				<div style={{marginTop:25,fontSize:17,color:Common.Black,fontWeight:'bold'}}>设置提醒成功</div>
				<div style={{ color: '#333',fontSize:Fnt_Normal}}>
				{this.props.plan_release_date ?
					<div>该课程预计<span style={{color:'#2196f3'}}>{date_text}</span>上线，届时<div>您将会收到通知提醒。</div></div>
					:
					<div>该课程正式上线时，您将会<div>收到通知提醒。</div></div>
				}
        </div>
				<div style={styles.alert_bottom}>
					<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:17,color:'#0076ff'}} onClick={this._hideAlert.bind(this)} >知道了</div>
				</div>
			</div>
		)



		var couponShow = (
			<div style={{...styles.white_alert,paddingTop:-1}}>
				<div style={{marginTop:20,fontSize:Fnt_Large,color:Common.Black,fontWeight:'bold'}}>VIP会员专享</div>
				<div style={{ color: '#333',fontSize:Fnt_Medium,lineHeight:'20px',}}>很抱歉，本课程为VIP会员专享，</div>
				<div style={{ color: '#333',fontSize:Fnt_Medium,lineHeight:'20px',}}>您目前无法观看后续内容</div>

				<div style={styles.alert_bottom}>
					<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:Fnt_Medium,color:Common.Activity_Text}}>使用优惠券
					</div>
					<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:Fnt_Medium,color:Common.Gray}} onClick={this._hideAlert.bind(this)} >联系客服</div>
				</div>
			</div>
		)

    return(
      <div style={{display: this.props.isShow ? 'block' : 'none'}}>
        {showAlert}
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

export default NoteAlert;
