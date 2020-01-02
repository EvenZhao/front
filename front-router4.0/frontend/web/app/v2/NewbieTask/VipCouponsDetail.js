import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
import FullLoading from '../components/FullLoading';
import ResultAlert from '../components/ResultAlert'

var countdown;
class VipCouponsDetail extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			goods:'',//商品名称
			goods_url:'',//图片路径
			discount_point:null,//商品折扣积分
			introduction:'',//商品简介
			canExchang:false,//能否兑换，true：可以，false：不可以
			discountType:null,//商品类别
			account_type:null,//账号类别
			url:null,//课程对应URL
			title:'',//弹框标题
			content:'',//弹框内容
			leftButton:'',
			rightButton:'',
			isShow:false,
			//弹框提示信息
      alert_display:'none',
      alert_title:'',
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
			alert_show:false,
		};

	}

  componentWillMount() {
		Dispatcher.dispatch({
			actionType: 'GoodsDetail',
			id:this.props.match.params.id,
		})
  }

	componentDidMount() {
    devWidth = window.screen.width;
    devHeight = window.innerHeight;
    EventCenter.emit("SET_TITLE",'铂略财课-2天VIP体验券详情');

		this.e_GoodsDetail = EventCenter.on('GoodsDetailDone',this._handleGoodsDetail.bind(this));
		this.e_ExchangeGoods = EventCenter.on('ExchangeGoodsDone',this._handleExchangeGoods.bind(this));
	}
	componentWillUnmount() {
		this.e_GoodsDetail.remove();
		this.e_ExchangeGoods.remove()
		clearInterval(countdown)
	}

	_handleGoodsDetail(re){
		console.log('体验券详情==',re);
		if(re.err){
			this.setState({
				alert_display:'block',
				alert_title:re.err,
				isShow:false,
				errStatus:0,
			},()=>{
				countdown = setInterval(()=>{
						clearInterval(countdown);
						this.setState({
							alert_display:'none',
						})
				}, 1000);
			})
			return false;
		}
		this.setState({
			account_type:re.user && re.user.account_type ? re.user.account_type : null,
		})
		if(re.result){
			this.setState({
				goods:re.result.goods,
				discount_point:re.result.discount_point,
				goods_url:re.result.goods_url,
				introduction:re.result.introduction,
				canExchang:re.result.canExchang,
				discountType:re.result.discountType,
				url:re.result.url,
			})
		}
	}

	//立即兑换
	_exchangeGoods(){
		if(this.state.canExchang){
			Dispatcher.dispatch({
				actionType: 'ExchangeGoods',
				goodsId:this.props.match.params.id,//商品ID
			})
		}
		else {
			this.setState({
				isShow:true,
				title:'提示',
				content:'您的积分不足',
				leftButton:(<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:17,color:Common.Gray,}} onClick={this._doTask.bind(this,'gotIt')}>知道了</div>),
				rightButton:(<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:17,color:Common.Activity_Text}}  onClick={this._doTask.bind(this,'gotPoint')}>去赚积分</div>)
				//'去赚积分'
			})
		}
	}

	//兑换商品返回数据
	_handleExchangeGoods(re){
		console.log('兑换商品===',re);
		if(re.err){
			this.setState({
				alert_display:'block',
				alert_title:re.err,
				isShow:false,
				errStatus:0,
			},()=>{
				countdown = setInterval(()=>{
						clearInterval(countdown);
						this.setState({
							alert_display:'none',
						})
				}, 1000);
			})
			return false;
		}
		else
		{//兑换成功

			EventCenter.emit("PointShopListDone");

			if(this.state.canExchang){//可以兑换商品
				// 0 全类别 / 1 直播 / 2 视频 / 3 线下 / 7 专题 / 10 vip体验 / 5 咨询 / 6 章节
				switch (this.state.discountType) {
					case 0:

						break;
					case 1:
					case 2:
						this.setState({
							isShow:true,
							title:'恭喜你，获得',
							content:this.state.goods,
							leftButton:(<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:17,color:Common.Gray,}} onClick={this._doTask.bind(this,'gotRecord')}>查看兑换记录</div>),
							rightButton:(<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:17,color:Common.Activity_Text}}  onClick={this._doTask.bind(this,'gotUrl')}>立即使用</div>)
						})
						break;
					 case 10:
						 this.setState({
							isShow:true,
							title:'恭喜你，获得',
							content:this.state.goods,
							leftButton:(<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:17,color:Common.Gray,}} onClick={this._doTask.bind(this,'gotRecord')}>查看兑换记录</div>),
							rightButton:(<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:17,color:Common.Activity_Text}}  onClick={this._doTask.bind(this,'gotIt')}>知道了</div>)
						 })
						break;
					default:
						break;
				}
			}else {//不能兑换商品，给出提示
				this.setState({
					isShow:true,
					title:'提示',
					content:'您的积分不足',
					leftButton:(<div style={{display: 'flex', flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',borderRight:'solid 1px #d4d4d4',fontSize:17,color:Common.Gray,}} onClick={this._doTask.bind(this,'gotIt')}>知道了</div>),
					rightButton:(<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:17,color:Common.Activity_Text}}  onClick={this._doTask.bind(this,'gotPoint')}>去赚积分</div>)
					//'去赚积分'
				})
			}
		}
	}

	_doTask(params){
		switch (params) {
			case 'gotPoint'://赚取积分
				this.setState({
					isShow:false,
				})
				this.props.history.push({pathname:`${__rootDir}/taskList`,state:{account_type:this.state.account_type}});
				break;
			case 'gotUrl'://跳转到对应的课程
				if(this.state.url){
					window.location = url;
				}
				break;
			case 'gotRecord':
			  this.props.history.push(`${__rootDir}/ExchangeRecords`);
				break;
			case 'gotIt'://关闭弹框
				this.setState({
					isShow:false,
				})
				break;
			default:
				break;
		}
	}

	render(){

    var showAlert =(
			<div style={{...styles.white_alert,paddingTop:-1}}>
				<div style={{marginTop:19,fontSize:Fnt_Large,color:Common.Black,fontWeight:'bold'}}>{this.state.title}</div>
				<div style={{ color: '#333',fontSize:Fnt_Small}}>{this.state.content}</div>
				<div style={styles.alert_bottom}>
					{this.state.leftButton}
					{this.state.rightButton}
				</div>
			</div>
		)

		let alertProps ={
			alert_display:this.state.alert_display,
			alert_title:this.state.alert_title,
			isShow:this.state.alert_show,
			errStatus:this.state.errStatus
		 }

    return(
      <div style={styles.container}>
			 <ResultAlert {...alertProps}/>
        <div style={{width:devWidth,height:189,}}>
					<img src={this.state.goods_url} width={devWidth} height={189}/>
				</div>
        <div style={{backgroundColor:Common.Bg_White,height:70,width:devWidth-30,padding:'0 15px'}}>
          <div style={{fontSize:Fnt_Medium,color:Common.Light_Black,paddingTop:17}}>兑换 {this.state.goods}</div>
          <div style={{color:'#ff6633',fontSize:Fnt_Small}}>{this.state.discount_point}积分</div>
        </div>
        <div style={{width:devWidth,height:devHeight - 269,marginTop:10,backgroundColor:Common.Bg_White,}}>
          <div style={{height:devHeight-335,padding:'0 18px'}}>
            <div style={{fontSize:Fnt_Medium,color:Common.Black,paddingTop:20}}>商品详情</div>
            <div dangerouslySetInnerHTML={{__html: this.state.introduction}} style={{fontSize:Fnt_Normal,color:Common.Light_Gray,marginTop:10}}>
            </div>
          </div>
          <div style={{height:55,paddingTop:10,borderTop:'solid 1px #e5e5e5',}}>
            <div style={styles.btn_exchange} onClick={this._exchangeGoods.bind(this)}>立即兑换</div>
          </div>
        </div>
          <div style={{display:this.state.isShow ? 'block':'none'}}>{showAlert}</div>
          <div style={{...styles.msk,display:this.state.isShow ? 'block':'none'}} onClick={this._doTask.bind(this,'gotIt')} ></div>
      </div>
    )
  }
}

var styles = {
  container:{
    width:devWidth,
    height:devHeight,
    overflowY:'auto',
  },
  btn_exchange:{
    width:devWidth - 30,
    marginLeft:15,
    height:45,
    lineHeight:'45px',
    textAlign:'center',
    fontSize:Fnt_Large,
    color:Common.Bg_White,
    backgroundImage:'linear-gradient(-65deg, #45C7FA 0%, #2196F3 96%)',
    borderRadius: 4
  },
  white_alert:{
		width:devWidth-100,
		height:118,
		backgroundColor:Common.Bg_White,
		borderRadius:12,
		position:'absolute',
		zIndex:10,
		top:(devHeight-118)/2,
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
	msk:{
    width: devWidth,
		height: devHeight,
		backgroundColor:'#000000',
		position:'absolute',
    left:0,
    top:0,
		zIndex: 5,
		opacity:0.2,
  },
}

export default VipCouponsDetail;
