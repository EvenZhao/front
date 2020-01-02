/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import PromptBox from '../components/PromptBox';
import Dm from '../util/DmURL'

var countdown

class PgAdvice extends React.Component {
	constructor(props) {
	    super(props);
			this.wx_config_share_home = {
					title: '意见反馈-铂略咨询',
					desc: '铂略咨询-财税领域实战培训供应商',
					link: document.location.href + '',
					imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
					type: 'link'
			};
		this.state = {
			title: 'PgHome',
			feedback: '',
			contact:'',
			buttonColor:false,
			context:'',
			display:'none'
		};

	}
	_onChangeFeedback(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.contact && v.length > 0) {
			this.setState({
				feedback: v,
				buttonColor: true
			})
		}else {
			this.setState({
				feedback: v,
				buttonColor: false
			})
		}

	}
	_onChangeContact(e){
		e.preventDefault();
		var v = e.target.value.trim();
		if (this.state.feedback && v.length > 0) {
			this.setState({
				contact: v,
				buttonColor: true
			})
		}else {
			this.setState({
				contact: v,
				buttonColor: false
			})
		}

	}
	_handleaddFeedbackDone(re){
		console.log('_handleaddFeedbackDone',re);
		if (re.err) {
			this.setState({
				display:'block',
				context: re.err,
				buttonColor:true,
			})
			countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
			return false;
		}
		var result = re.result || {}
		if (result && result.isSuccess) {
			this.setState({
				display:'block',
				context: '意见反馈成功'
			})
			countdown = setInterval(()=>{
					clearInterval(countdown);
					// this.setState({
					// 		display: 'none'
					// });
					window.history.back()
			}, 1500);
			return false;
		}
	}
	_addAdvice(){
		Dispatcher.dispatch({
			actionType: 'addFeedback',
			feedback: this.state.feedback,
			contact: this.state.contact
		})
		this.setState({
			buttonColor:false,
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-意见反馈')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		this._getaddFeedbackDone = EventCenter.on('addFeedbackDone', this._handleaddFeedbackDone.bind(this))
	}
	componentWillUnmount() {
		this._getaddFeedbackDone.remove()
	}
	render(){
		var content= {
			top:100,
			context:this.state.context,
			display:this.state.display,
		}
		return (
			<div style={{...styles.container}}>
        <div style={{...styles.div}} className="PgAdviceTextarea">
          <textarea style={{...styles.input}} value={this.state.feedback} placeholder="请输入你想要提的意见" onChange={this._onChangeFeedback.bind(this)}/>
        </div>
        <div className="PgAdviceInput" style={{width:'100%',height:48,backgroundColor:'#ffffff',marginTop:12,lineHeight:3}}>
          <span style={{fontSize:15,color:'#333333',marginLeft:12}}>联系方式</span>
          <input onChange={this._onChangeContact.bind(this)}  style={{width:'70%',marginLeft:20,border:0,height:24,lineHeight:'24px',verticalAlign:'middle', fontSize:12}} value={this.state.contact} placeholder="QQ/手机/邮箱"/>
        </div>
        <div style={{...styles.buttonDiv}} >
					{
						this.state.buttonColor ?
						<div onClick={this._addAdvice.bind(this)} style={{...styles.button,backgroundColor:'#2196f3'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>提交</span>
						</div>
						:
						<div style={{...styles.button,backgroundColor:'#d1d1d1'}}>
								<span style={{fontSize:16,color:'#ffffff'}}>提交</span>
						</div>
					}

        </div>
				<PromptBox {...content}/>
			</div>
		);
	}
}
var styles = {
  container:{
    backgroundColor:'#f4f4f4',
    height:'100%',
    width:'100%',
  },
  div:{
    height: '168px',
    width: '100%',
    backgroundColor:'#ffffff',
    lineHeight:4,
  },
  input:{
    width:'100%',
    height:168,
		border:0
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
    marginLeft:(window.screen.width-window.screen.width*0.8)/2,
  }
};
export default PgAdvice;
