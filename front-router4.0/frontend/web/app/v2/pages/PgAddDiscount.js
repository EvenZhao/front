/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ProductTop from '../components/ProductTop'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import ProductLessonDiv from '../components/ProductLessonDiv';
import Alert from '../components/Alert';
import PromptBox from '../components/PromptBox';
import Dm from '../util/DmURL'


class PgAddDiscount extends React.Component {
	constructor(props) {
    super(props);
    this.id = ''
    this.data = []
		this.state = {
			listHeight: devHeight-42.5,
			discountCode: '',
			buttonColor: false,
			context: '',
			display:'none'
		};
	}

  _handledaddDiscountDone(re){
		if (re.err) {
			this.setState({
			  // context: '您输入的券号不正确请确认后重新输入。',
			  display: 'block',
			})
			var	countdown = setInterval(()=>{
					clearInterval(countdown);
					this.setState({
							display: 'none'
					});
			}, 1500);
			return false
		}
    if (re.result) {
      var result = re.result;
      console.log('_handledMyDiscountDone',result);
			// this.setState({
			//   context: '兑换成功',
			//   display: 'block',
			// })
			// var	countdown = setInterval(function(){
			// 		clearInterval(countdown);
			// 		this.setState({
			// 				display: 'none'
			// 		});
			// }.bind(this), 2000);
			// var url=`${__rootDir}/PgMyDiscount`;
			// this.props.history.push(url);
			this.props.history.go(-1);
    }

  }
	_onChangeAddDiscountCode(e){
		e.preventDefault();
		var v = e.target.value.trim();
		this.setState({
			discountCode: v,
			buttonColor: true
		})
	}
	_onBlurChangeButton(){
		if (this.state.discountCode) {
			this.setState({
				buttonColor: true
			})
		}else {
			this.setState({
				buttonColor: false
			})
		}
	}
	_onaddDiscount(e){
		console.log('_onaddDiscount');
		Dispatcher.dispatch({
      actionType: 'addDiscount',
      discountCode: this.state.discountCode,
    })
	}
	componentWillMount() {


	}
	componentDidMount() {
    this._getaddDiscountDone = EventCenter.on('addDiscountDone',this._handledaddDiscountDone.bind(this));
	}
	componentWillUnmount() {
    this._getaddDiscountDone.remove();
	}
	render(){
		return (
			<div style={{...styles.div}}>
				<div style={{backgroundColor:'#ffffff', width: devWidth, marginTop: 12}}>
	        <div style={{fontSize:13, color:'#333333', marginLeft:20, width:devWidth, paddingTop:16}}>
						<span>请输入卡券号:</span>
	        </div>
					<div style={{marginLeft:20, marginTop:13, paddingBottom: 16}}>
						<input style={{width:devWidth - 60, height: 40, paddingLeft: 12, border: '1px solid #dfdfdf', borderRadius: 2}} placeholder="券号不区分大小写" onChange={this._onChangeAddDiscountCode.bind(this)} value={this.state.discountCode} onBlur={this._onBlurChangeButton.bind(this)}/>
					</div>
				</div>
				<div>
					{
						this.state.buttonColor ? <div onClick={this._onaddDiscount.bind(this)} style={{...styles.buttonDiv,backgroundColor:'#2196f3'}}><span style={{fontSize:14,color:'#ffffff'}}>兑换</span></div>
						:<div style={{...styles.buttonDiv,backgroundColor:'#d1d1d1'}}><span style={{fontSize:14,color:'#ffffff'}}>兑换</span></div>
					}
				</div>
				<div style={{...styles.mainDiv,top:100,display:this.state.display}}>
					<div style={{...styles.imgDiv}}>
						<img src={Dm.getUrl_img('/img/v2/icons/fault.png')} height="45" width="45"/>
					</div>
					<div style={{...styles.fontDiv}}>
						<span>您输入的券号不正确</span>
					</div>
					<div style={{...styles.fontDiv}}>
						<span>请确认后重新输入。</span>
					</div>
				</div>
			</div>
		);
	}
}

var styles = {
  div:{
    height: devHeight,
    width: devWidth,
		position:'fixed',
		top: 0,
		bottom: 0,
  },
  buttonDiv:{
		width:300,
		height:45,
		// backgroundColor:'#d1d1d1',
		borderRadius:6,
		marginTop:40,
    marginLeft: (devWidth - 300)/2,
		textAlign:'center',
    lineHeight:2.5
  },
	mainDiv:{
		height:120,
		width:200,
		backgroundColor:'#373737',
		borderRadius:6,
		textAlign:'center',
		opacity: 0.8,
		position:'absolute',
		left:(window.screen.width - 200)/2,
	},
	imgDiv:{
		// marginTop:15,
		width:'100%',
		height:45,
		position: 'relative',
		top: 15,
	},
	fontDiv:{
		position: 'relative',
		fontSize:16,
		color:'#ffffff',
		top:24,
	},
};

export default PgAddDiscount;
