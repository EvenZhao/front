/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import Common from '../Common';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

var countdown;
class PgSetPosition extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			position: '',
			buttonColor:false,
			display:'none',
			errDisplay:'none',
			isVisible:false,
		};
		this.key = this.props.location.state.key;
	}
	_onChangeNiceName(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (v.length > 0) {
			this.setState({
				buttonColor: (v == this.state.position) ? false : true,
				position: v,

			})
		}else {
			this.setState({
				position: v,
				buttonColor: false
			})
		}

	}
	_handleupdAccountBasicInfoDone(re){

		if (re.result && re.result.isSuccess) {
			this.setState({
				display:'block'
			})
			countdown = setInterval(function(){
					clearInterval(countdown);

					if(this.key == 'completeInfo'){
						completeFlag = true;
						companyFlag = true;
						this.props.history.push(`${__rootDir}/CompleteInfo`);
					}
					else {
						this.props.history.push(`${__rootDir}/PgSetInfo`);
					}
			}, 1500);
		}else if (re.err) {
			this.setState({
				errDisplay:'block'
			})
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							errDisplay: 'none'
					});
			}, 1500);
		}
	}
	_onUpdateNiceName(re){
		this.setState({
			isVisible:false,
		});
    Dispatcher.dispatch({
      actionType: 'updAccountBasicInfo',
      position: this.state.position,
      updtype:'position',
      positionId: 251
    })
	}

	componentWillMount() {
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getUserAccount'
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-其他')
		// this._updNickNameDone = EventCenter.on('updNickNameDone', this._handleupdNickNameDone.bind(this))
		this._getupdAccountBasicInfoDone = EventCenter.on('updAccountBasicInfoDone', this._handleupdAccountBasicInfoDone.bind(this))

	}
	componentWillUnmount() {
		// this._updNickNameDone.remove()
		this._getupdAccountBasicInfoDone.remove()
		completeFlag = true;
		companyFlag = true;
	}
	render(){
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.div,marginTop:15}}>
          <input style={{...styles.input}} value={this.state.position} placeholder="职位名称"
					onChange={this._onChangeNiceName.bind(this)} onFocus={this.inputOnfocus.bind(this)}/>
				{
					this.state.isVisible ?
					<div style={{...styles.clear}} onClick={this._clear.bind(this)}>
						<img src={Dm.getUrl_img('/img/v2/icons/clear-button@2x.png')} style={{width:14,height:14,}} />
					</div>
					:
					null
				}
				</div>
        <div style={{...styles.buttonDiv}}>
					{
						this.state.buttonColor ?
						<div onClick={this._onUpdateNiceName.bind(this)} style={{...styles.button,backgroundColor:'#2196f3'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>确定</span>
						</div>
						:
						<div style={{...styles.button,backgroundColor:'#d1d1d1'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>确定</span>
						</div>
					}
        </div>
				<div style={{...styles.alertDiv,display:this.state.display}}>
					<div style={{marginBottom:14,paddingTop:15,height:40,}}>

					</div>
					<span>职位修改成功</span>
				</div>
				<div style={{...styles.errAlertDiv,display:this.state.errDisplay}}>
					<span>昵称重复，重新输入。~</span>
				</div>
			</div>
		);
	}

inputOnfocus(){
	this.setState({
		isVisible:true,
	})
}

_clear(){
	this.setState({
		position:'',
		buttonColor:false,
	})
}



}
var styles = {
  container:{
    backgroundColor:'#f4f4f4',
    height:window.innerHeight,
    width:window.screen.width,
  },
  div:{
    height: '50px',
    width: '100%',
    backgroundColor:'#ffffff',
		borderBottomStyle:'solid',
		borderBottomWidth:1,
		borderBottomColor:'#E5E5E5',
		borderTopStyle:'solid',
		borderTopWidth:1,
		borderTopColor:'#E5E5E5',
  },
  input:{
    width:window.screen.width -24,
		marginLeft: 12,
		height:'20px',
		border:0,
		marginTop:15,
		fontSize:Fnt_Medium,
		color:Common.gray,
  },
  buttonDiv:{
    width:'100%',
    height:50,
    textAlign:'center',
    marginTop:40,
  },
  button:{
    width:window.screen.width*0.8,
    height:45,
    textAlign:'center',
    lineHeight:2.5,
    borderRadius:6,
    marginLeft:35,
  },
	alertDiv:{
		position:'absolute',
		top:170,
		backgroundColor:'#000',
		opacity:0.7,
		fontSize:15,
		color:'#ffffff',
		width:190,
		height:104,
		left: (window.screen.width-170)/2,
		textAlign:'center',
		borderRadius:10,
	},
	errAlertDiv:{
		position:'absolute',
		top:170,
		backgroundColor:'#626262',
		fontSize:15,
		color:'#ffffff',
		width:180,
		height:28,
		left: (window.screen.width-180)/2,
		textAlign:'center',
		borderRadius:4,
		lineHeight:2
	},
	clear:{
    position:'absolute',
    width:20,
    height:20,
    right:10,
    top:30,
  }
};
export default PgSetPosition;
