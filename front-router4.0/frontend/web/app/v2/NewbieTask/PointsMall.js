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
class PointsMall extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			pointList:[],
			pointInfo:{},
			//弹框提示信息
      alert_display:'none',
      alert_title:'',
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
			alert_show:false,
		};

	}

  componentWillMount() {
		Dispatcher.dispatch({
			actionType: 'PointShopList'
		})
  }

	componentDidMount() {
    devWidth = window.screen.width;
    devHeight = window.innerHeight;
    EventCenter.emit("SET_TITLE",'铂略财课-积分商城');

		this.e_PointShopList = EventCenter.on('PointShopListDone',this._handlePointShopList.bind(this));
	}
	componentWillUnmount() {
		this.e_PointShopList.remove()
		clearInterval(countdown)
	}

	_exchange(id){
		this.props.history.push({pathname: `${__rootDir}/VipCouponsDetail/${id}`})
	}

	_handlePointShopList(re){
		console.log('积分商城===',re);
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
		if(re.result){
			this.setState({
				pointInfo:re.result.pointInfo || {},
				pointList:re.result.pointDetail || [],
			})
		}
	}

	//兑换记录
	_goRecord(){
		this.props.history.push(`${__rootDir}/ExchangeRecords`);
	}

	render(){

		var pointList = this.state.pointList.map((item,index)=>{

			return(
				<div key={index} style={styles.list_box} onClick={this._exchange.bind(this,item.id)}>
					<div style={{width:devWidth-75,height:160,}}>
						<img src={item.goods_url} width={devWidth-75} height={160} style={{borderRadius:5}} />
					</div>
					<div style={{fontSize:Fnt_Medium,color:Common.Black,paddingTop:10}}>{item.goods}</div>
					<div style={{display:'flex',flexDirection:'row',paddingTop:5,width:devWidth-75,height:24}}>
						 <div style={{width:(devWidth-75)/2,display:'flex',alignItems:'center',height:24}}>
								<img src={Dm.getUrl_img('/img/v2/newbieTask/point@2x.png')} width={14} height={12} />
								<span style={{color:'#ff6633',marginLeft:5,fontSize:Fnt_Normal}}>{item.discount_point}积分</span>
							</div>
							<div style={{width:(devWidth-75)/2,display:'flex',justifyContent:'flex-end'}}>
								<div style={styles.btn_exchange}>我要兑换</div>
							</div>
					</div>
				</div>
			)
		})

		let alertProps ={
			alert_display:this.state.alert_display,
			alert_title:this.state.alert_title,
			isShow:this.state.alert_show,
			errStatus:this.state.errStatus
		 }

    return(
      <div style={styles.container}>
			  <ResultAlert {...alertProps}/>
				<div style={styles.top_box}>
					<div style={{...styles.top_flex,marginLeft:25}}>
							<img src={Dm.getUrl_img('/img/v2/newbieTask/point@2x.png')} width={14} height={12} />
							<span style={{color:Common.Light_Gray,marginLeft:5}}>我的积分：</span>
							<span style={{color:Common.Activity_Text}}>{this.state.pointInfo.valid_point}</span>
					</div>
					<div style={{...styles.top_flex,justifyContent:'flex-end',marginRight:15}} onClick={this._goRecord.bind(this)}>
							<img src={Dm.getUrl_img('/img/v2/newbieTask/record@2x.png')} width={14} height={15} />
							<span style={{color:Common.Black,marginLeft:5}}>兑换记录</span>
					</div>
				</div>
				<div style={{width:devWidth,height:devHeight-104,backgroundColor:Common.Bg_White,marginTop:10,paddingTop:34,overflowY:'auto'}}>
					<div style={{backgroundColor:'#d8d8d8',height:1,width:devWidth-44,marginLeft:22,position:'relative',marginBottom:30,}}>
						<div style={{fontSize:Fnt_Medium,color:Common.Black,height:22,lineHeight:'22px',width:90,backgroundColor:'#fff',textAlign:'center',position:'absolute',top:-11,left:(devWidth-90)/2}}>
						好物随心兑
						</div>
					</div>
					{pointList}
				</div>
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
	top_box:{
		width:'100%',
		height:60,
		backgroundColor:Common.Bg_White,
		display:'flex',
		flexDirection:'row',
		alignItems:'center'
	},
	top_flex:{
		width:devWidth/2,
		fontSize:Fnt_Normal,
		display:'flex',
		alignItems:'center',
	},
	list_box:{
		width:devWidth-74,
		marginLeft:22,
		//height:217,
		marginBottom:40,
		border:'solid 0.5px #ebebeb',
		borderRadius:12,
		backgroundColor:Common.Bg_White,
		padding:'15px 15px',
		boxShadow:'0px 0px 20px #ccc'
	},
	btn_exchange:{
		backgroundImage:'linear-gradient(-65deg, #45C7FA 0%, #2196F3 96%)',
		borderRadius:2,
		width:70,
		height:24,
		lineHeight:'24px',
		textAlign:'center',
		color:Common.Bg_White,
		fontSize:Fnt_Small,
		marginRight:10,
	}

}

export default PointsMall;
