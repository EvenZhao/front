import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
import funcs from '../util/funcs'

var countdown;

class GetKnowledgeCard extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			name: '',
			phone: '',
			isButton: false,
			isPost: false,
			isPhoneErr:false,
		};

	}



  componentWillMount() {


  }
	_handleknowledgeCard(e){
		console.log('_handleknowledgeCard',e);
		if (e.err) {
			return false
		}
		if (typeof e.result == 'boolean') {
			this.props.history.go(-1)
		}
		var result = e.result || {}
		this.setState({
			name: result.contact_name || '',
			phone: result.contact_phone || '',
			isPost: result.isPost,
		},()=>{
			this.checkButton()
		})

	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-索取实战笔记')
		this._knowledgeCard = EventCenter.on('knowledgeCardDone', this._handleknowledgeCard.bind(this))

		Dispatcher.dispatch({
			actionType: 'knowledgeCard',
			resource_id: this.props.match.params.id,
		})

	}
	componentWillUnmount() {
		this._knowledgeCard.remove()
	}
	_onChangeName(e){
		e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      name:val,
    },()=>{
      this.checkButton()
    });
	}
	_onChangePhone(e){
		e.preventDefault();
    var val = e.target.value.trim();

    this.setState({
      phone:val,
    },()=>{
      this.checkButton()
    });
	}
	checkButton(){
		this.setState({
			isButton: this.state.name && this.state.phone && !this.state.isPost ? true : false
		})
	}
	_onSubmit(){
		if(isCellPhoneAvailable(this.state.phone)) {
			Dispatcher.dispatch({
				actionType: 'knowledgeCard',
				resource_id: this.props.match.params.id,
				contact_name: this.state.name,
				contact_phone: this.state.phone,
			})
		}else {
			this.setState({
				isPhoneErr: true,
			},()=>{
				countdown = setInterval(()=>{
						clearInterval(countdown);
						this.setState({
								isPhoneErr: false
						});
				}, 2000);
			})
		}
	}
	render(){

    return(
			<div style={{...styles.div}}>
				<div style={{...styles.top}}>
					<span style={{...styles.topFont}}>请留下您的联系方式，以便后续工作人员联系。</span>
				</div>
				<div style={{...styles.inputDiv}}>
					<div style={{position:'relative',height:50}}>
						<img src={Dm.getUrl_img('/img/v2/icons/userName@2x.png')} style={{width:13,height:16,marginLeft:13,position:'absolute',top:18}} />
						<span style={{...styles.inputText,position:'absolute',top:16,left:24}}>姓名</span>
						<input style={{width:devWidth-120,marginTop:16,border:'none',fontSize:16,textAlign:'right',position:'absolute',right:12}} onBlur={this.checkButton.bind(this)} onChange={this._onChangeName.bind(this)} value={this.state.name} placeholder='请输入姓名' type="text" />
					</div>
					<div style={{width:devWidth-42,height:0,border:'1px solid #f3f3f3',marginLeft:42}}></div>
					<div style={{position:'relative',height:49}}>
						<img src={Dm.getUrl_img('/img/v2/icons/phone_num@2x.png')} style={{width:13,height:19,marginLeft:13,position:'absolute ',top:16}} />
						<span style={{...styles.inputText,position:'absolute',top:14,left:24}}>手机号码</span>
						<input style={{width:devWidth-120,marginTop:16,border:'none',fontSize:16,textAlign:'right',position:'absolute',right:12}} onBlur={this.checkButton.bind(this)} onChange={this._onChangePhone.bind(this)} value={this.state.phone} placeholder='请输入手机号' type="number"/>
					</div>
				</div>
				{
					this.state.isButton ?
						<div style={{...styles.button,backgroundImage:'linear-gradient(65deg,#45C7FA 0%,#2196f3 96%)',}} onClick={this._onSubmit.bind(this)}>
							<span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular',letterSpacing:'-0.43px'}}>提交</span>
						</div>
					:
						<div style={{...styles.button,backgroundColor:'#D1D1D1'}}>
							<span style={{fontSize:18,color:'#FFFFFF',fontFamily:'pingfangsc-regular',letterSpacing:'-0.43px'}}>提交</span>
						</div>
				}
			<div style={{width:devWidth,marginTop:80}}>
				<div style={{width:devWidth,textAlign:'center'}}>
					<span style={{fontSize:16,color:'#333333',fontFamily:'PingFangSC-regular',letterSpacing:'-0.44px'}}>
						<span style={{color:'#979797'}}>—  </span>
							什么是实战笔记？
						<span style={{color:'#979797'}}>—</span>
					</span>
				</div>
				<div style={{width:314,marginLeft:(devWidth-314)/2}}>
					<span style={{...styles.context}}>您的学习备忘录，提炼课程精华，归纳操作要点，速查重点内容。</span>
				</div>
				<div style={{width:314,marginLeft:(devWidth-314)/2}}>
					<span style={{...styles.context}}>根据不同课程，采用内容精选，财务工具模型，实用模板，法规速查表，案例汇总等不同形式。</span>
				</div>
			</div>
			<div style={{...styles.phoneErr,display: this.state.isPhoneErr ? 'block':'none'}}>
				<span style={{fontSize:14,color:'#FFFFFF',fontFamily:'pingfangsc-regular',letterSpacing:'-0.34px',}}>手机号码格式不正确</span>
			</div>
			</div>
    )
  }
}

var styles = {
	div:{
		width: devWidth,
		height: devHeight,
		backgroundColor:'#f4f4f4',
	},
	top:{
		height: 40,
		width: devWidth,
		lineHeight: 2.5
	},
	topFont:{
		fontSize: 12,
		color: '#999999',
		fontFamily: 'PingFangSC-regular',
		letterSpacing: '-0.20px',
		marginLeft: 12,
	},
	inputDiv:{
		height: 100,
		width: devWidth,
		backgroundColor:'#FFFFFF',
		border:'1px solid #e5e5e5',
	},
	button:{
		height:45,
		width: devWidth-32,
		marginLeft: 16,
		borderRadius:'4px',
		textAlign:'center',
		marginTop: 60,
		lineHeight: 2.5,
	},
	inputText:{
		fontSize: 15,
		color: '#333333',
		fontFamily: 'PingFangSC-Regular',
		letterSpacing: '-0.36px',
		marginLeft: 16,
		// textAlign:'right'
	},
	phoneErr:{
		width: 150,
		height: 30,
		backgroundColor: '#000000',
		borderRadius: '5px',
		opacity: 0.7,
		position:'absolute',
		left: (devWidth-150)/2,
		top: 154,
		textAlign: 'center',
		lineHeight: 1.8
	},
	context:{
		fontSize: 14,
		color: '#666666',
		fontFamily:'PingFangSC-regular',
		letterSpacing:'0.2px',
		lineHeight:'25px'
	}

}

export default GetKnowledgeCard;
