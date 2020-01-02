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
class ExchangeRecords extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
			recordList:[],
			loadLength:0,
      loadMore: false,
			//弹框提示信息
      alert_display:'none',
      alert_title:'',
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
			alert_show:false,
		};

	}

  componentWillMount() {
		Dispatcher.dispatch({
			actionType: 'PointExchange',
			skip:0,
			limit:20,
		})
  }

	componentDidMount() {
    devWidth = window.screen.width;
    devHeight = window.innerHeight;
    EventCenter.emit("SET_TITLE",'铂略财课-兑换记录');

		this.e_pointExchange = EventCenter.on('PointExchangeDone',this._handlePointExchange.bind(this))
		this.e_pointExchangeLoadMore = EventCenter.on("PointExchangeLoadMoreDone",this._handlePointExchangeLoadMoreDone.bind(this))

	}
	componentWillUnmount() {
		this.e_pointExchange.remove()
		this.e_pointExchangeLoadMore.remove()
		clearInterval(countdown)
	}

	_handlePointExchange(re){
		console.log('兑换记录===',re);
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
				}, 1500);
			})
			return false;
		}

		if(re.result){
			this.setState({
				recordList:re.result || [],
				loadLength: re.result.length,
				loadMore: re.result.length >= 20 ? true : false
			})
		}
	}

	_loadMore(){
		Dispatcher.dispatch({
			actionType: 'PointExchange',
			skip:this.state.loadLength,
      limit:20,
			LoadMore: true,
		})
	}

	//加载更多
	_handlePointExchangeLoadMoreDone(re){
		if(re.err){

			return false;
		}
		if(re.result){
			this.setState({
				recordList:this.state.recordList.concat(re.result) || [],
				loadMore: re.result.length >= 20 ? true : false
			},()=>{
				this.setState({
					loadLength: this.state.recordList.length,
				})
			})
		}
	}

	//加载更多
	_labelScroll(){
		if((this.pageList.scrollHeight - this.pageList.scrollTop - 220) <  document.documentElement.clientHeight) {
			if(this.state.loadMore) {
        this._loadMore();
			} else {
				return false;
			}
		}
	}

	render(){

    var listNull = (
			<div style={{textAlign:'center',paddingTop:185}}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{marginTop:25}}>
					<span style={{fontSize:15,color:'#999999'}}>暂无内容</span>
				</div>
			</div>
		)

		let alertProps ={
			alert_display:this.state.alert_display,
			alert_title:this.state.alert_title,
			isShow:this.state.alert_show,
			errStatus:this.state.errStatus
		 }

		 var recordList = this.state.recordList.map((item,index)=>{

			 return(
				 <div style={{...styles.list_box,borderBottom:index == this.state.recordList.length-1 ? 'none':'solid 1px #f1f1f1'}} key={index}>
           <div style={{width:80,height:50,backgroundColor:Common.Activity_Text}}>
					 		<img src={item.goods_url} width={80} height={50} />
					 </div>
           <div style={{marginLeft:8,width:(devWidth-118)/2}}>
              <div style={{fontSize:Fnt_Medium,color:Common.Light_Black}}>{item.goods}</div>
              <div style={{color:'#ff6633',fontSize:Fnt_Small,display:item.end_use_time ? 'block':'none'}}>{item.end_use_time ? new Date(item.end_use_time).format('yyyy-MM-dd'):null} 到期</div>
           </div>
           <div style={{width:(devWidth-118)/2,display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
             <div style={{color:Common.Light_Gray,fontSize:Fnt_Small}}>{new Date(item.create_time).format('yyyy-MM-dd')}</div>
             <div style={{fontSize:Fnt_Small,color:'#fdc73b'}}>{item.exchange_point}积分</div>
           </div>
         </div>
			 )
		 })

    return(
      <div style={styles.container}
			ref={(pageList)=>this.pageList = pageList}
			onTouchEnd={this._labelScroll.bind(this)}
			>
				<ResultAlert {...alertProps}/>
				{this.state.recordList.length > 0 ?
					<div>
						{recordList}
						<div style={{display:this.state.loadMore ? 'none':'block',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray,marginTop:10,}}>已经到底啦~</div>
					</div>
					:
					listNull
				}
      </div>
    )
  }
}

var styles = {
  container:{
    width:devWidth,
    height:devHeight,
    overflowY:'auto',
    backgroundColor:Common.Bg_White,
  },
  list_box:{
    width:devWidth-30,
    padding:'20px 0',
    marginLeft:15,
    borderBottom:'solid 1px #f1f1f1',
    display:'flex',
    flexDirection:'row',
  }
}

export default ExchangeRecords;
