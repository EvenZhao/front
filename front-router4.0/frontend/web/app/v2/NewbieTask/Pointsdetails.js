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
var skip = 0;
class Pointsdetails extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			point:1,
			pointInfo:{},//积分信息
			pointDetail:[],//积分明细列表
			loadmore:true,
			account_type:null,
			//弹框提示信息
      alert_display:'none',
      alert_title:'',
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
			alert_show:false,

		};

	}

  componentWillMount() {
		Dispatcher.dispatch({
			actionType: 'AccountPointDetail',
			skip:0,
			limit:20,
		})
  }

	componentDidMount() {
    devWidth = window.screen.width;
    devHeight = window.innerHeight;
    EventCenter.emit("SET_TITLE",'铂略财课-积分明细');
		this.e_AccountPointDetail = EventCenter.on('AccountPointDetailDone',this._handleAccountPointDetail.bind(this))
		this.e_AccountPointDetailLoadMore = EventCenter.on('AccountPointDetailLoadMoreDone',this._handleAccountPointDetailLoadMore.bind(this))
	}
	componentWillUnmount() {
		this.e_AccountPointDetail.remove()
		this.e_AccountPointDetailLoadMore.remove()
	}

	_handleAccountPointDetail(re){
		console.log('积分明细===',re);
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
			skip = re.result.pointDetail.length;
			this.setState({
				account_type:re.result.user && re.result.user.account_type ? re.result.user.account_type:null,
				pointInfo:re.result.pointInfo || {},
				pointDetail:re.result.pointDetail || [],
				loadmore:re.result.pointDetail.length >= 20 ? true:false,
			})
		}
	}

	//更多
	_handleAccountPointDetailLoadMore(re){
		console.log('积分明细=111==',re);
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
				pointDetail:this.state.pointDetail.concat(re.result.pointDetail),
				loadmore:re.result.pointDetail.length >= 20 ? true:false,
			},()=>{
				skip = this.state.pointDetail.length;
			})
		}
	}

	//加载更多
	_labelScorll(re){
		if((this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {

			if (this.state.loadmore) {
				Dispatcher.dispatch({
					actionType: 'AccountPointDetail',
					skip:skip,
					limit:20,
					LoadMore: true,
				})
			}
			else {
				return false;
			}
		}
	}

	//去赚积分
	_getPoints(){
		this.props.history.push({pathname:`${__rootDir}/taskList`,state:{account_type:this.state.account_type}});
	}

	render(){
		var listNull = (
			<div style={{textAlign:'center',paddingTop:114}}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{marginTop:51}}>
					<span style={{fontSize:15,color:'#999999'}}>暂无内容</span>
				</div>
				<div style={styles.get_point} onClick={this._getPoints.bind(this)}>去赚积分</div>
			</div>
		)

		var pointDetail = this.state.pointDetail.map((item,index)=>{

			return(
				<div style={{...styles.list_box,borderBottom:index == this.state.pointDetail.length -1 ? 'none' : 'solid 1px #f1f1f1'}} key={index}>
					<div style={{fontSize:Fnt_Medium,display:'flex',flexDirection:'row',alignItems:'center'}}>
						<div style={{color:Common.Light_Black,width:(devWidth-30)/5*4}}>{item.change_reseaon}</div>
						<div style={{color:item.change_point > 0 ? Common.Activity_Text : Common.red,width:(devWidth-30)/5,display:'flex',justifyContent:'flex-end'}}>
						{item.change_point > 0 ?
							<span>+{item.change_point}</span>
							:
							item.change_point
						}
						</div>
					</div>
					<div style={{fontSize:Fnt_Small,color:Common.Light_Gray}}>{item.update_time ? new Date(item.update_time).format('yyyy-MM-dd'):''}</div>
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
      <div style={styles.container} onTouchEnd={this._labelScorll.bind(this)}>
				<ResultAlert {...alertProps}/>
        <div style={{height:90,backgroundColor:Common.Bg_White,position:'relative'}}>
					<Link to={`${__rootDir}/IntegralIntroduction`}><span style={{fontSize:Fnt_Small,color:Common.Gray,position:'absolute',right:10,top:12}}>积分介绍</span></Link>
					<div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
							<img src={Dm.getUrl_img('/img/v2/newbieTask/point@2x.png')} width={14} height={12} style={{marginTop:8}} />
							<span style={{color:Common.Activity_Text,marginLeft:5,fontSize:36}}>{this.state.pointInfo.valid_point}</span>
							<span style={{color:Common.Light_Gray,fontSize:11,marginLeft:5,marginTop:10}}>积分</span>
					</div>
					{this.state.pointInfo.overdue_time ?
						<div style={{textAlign:'center',fontSize:11,color:Common.Light_Gray}}>{this.state.pointInfo.overdue_point}积分将在{new Date(this.state.pointInfo.overdue_time).format('yyyy年MM月dd日')}过期</div>
						:
						null
					}
				</div>
        <div style={{marginTop:10,height:devHeight - 100,backgroundColor:Common.Bg_White,overflowY:'auto'}}
					ref={(lessonList) => this.lessonList = lessonList}
					>
					{ this.state.pointDetail.length > 0 ?
						<div >
							{pointDetail}
							<div style={{display:this.state.loadmore ? 'none':'block',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray,marginTop:10,}}>已经到底啦~</div>
						</div>
							:
						listNull
					}
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
	list_box:{
		width:devWidth - 30,
		marginLeft:15,
		padding:'20px 0',
		borderBottom:'solid 1px #f1f1f1'
	},
	get_point:{
		width:118,
		height:38,
		lineHeight:'38px',
		border:'solid 1px #666',
		borderRadius:40,
		textAlign:'center',
		fontSize:16,
		color:'#666',
		marginTop:25,
		marginLeft:(devWidth-118)/2
	}
}

export default Pointsdetails;
