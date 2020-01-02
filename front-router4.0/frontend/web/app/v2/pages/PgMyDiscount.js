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
import Dm from '../util/DmURL'

class PgMyDiscount extends React.Component {
	constructor(props) {
		super(props);
		this.wx_config_share_home = {
			title: '优惠券-铂略咨询',
			desc: '铂略咨询-财税领域实战培训供应商',
			link: document.location.href + '',
			imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
			type: 'link'
		};
		this.id = ''
		this.data = []
		this.state = {
			listHeight: devHeight - 42.5,
			discountInvalidList: [],
			discountList: [],
		};
	}

	_handledMyDiscountDone(re) {
		console.log('体验券===', re);
		if (re.result) {
			var result = re.result;
			this.setState({
				discountInvalidList: result.discountInvalidList,
				discountList: result.discountList,
			})
		}
	}

	componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'MyDiscount',
      // id: this.props.match.params.id
    })

	}
	componentDidMount() {
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
		EventCenter.emit("SET_TITLE",'铂略财课-卡券')
    this._getMyDiscountDone = EventCenter.on('MyDiscountDone',this._handledMyDiscountDone.bind(this));
	}
	componentWillUnmount() {
    this._getMyDiscountDone.remove();
	}
	goToDetail(item){
		if (item.resource_id) {//首先判断是否有课程ID,如果有 则跳转对应的详情页面
			if (item.resource_type == 1) {
				this.props.history.push(`${__rootDir}/lesson/live/${item.resource_id}`);
			}else if (item.resource_type == 2) {
				this.props.history.push(`${__rootDir}/lesson/online/${item.resource_id}`);
			}else if (item.resource_type == 7) {//productDetail
				this.props.history.push(`${__rootDir}/productDetail/${item.resource_id}`);
			}
		}else {
			if (item.type == 1) {
				this.props.history.push(`${__rootDir}/list/live`);
			}else if (item.type == 2) {
				this.props.history.push(`${__rootDir}/list/online`);
			}else if (item.type == 7) {//PgProductList
				this.props.history.push(`${__rootDir}/PgProductList`);
			}else {
				this.props.history.push(`${__rootDir}/`);
			}
		}
	}

	//已使用过的体验券跳转到对应课程详情
	_goLink(item){
		//首先判断是否有课程ID,如果有 则跳转对应的详情页面
		if (item.status =='已使用' && item.resource_id) {
			if (item.resource_type == 1) {
				//直播课
				this.props.history.push(`${__rootDir}/lesson/live/${item.resource_id}`);
			}else if (item.resource_type == 2) {
				//视频课
				this.props.history.push(`${__rootDir}/lesson/online/${item.resource_id}`);
			}else if (item.resource_type == 7) {
				//专题课
				this.props.history.push(`${__rootDir}/productDetail/${item.resource_id}`);
			}
		}
	}
	render(){
		var discountList;
		var discountInvalidList;
		var discountInvalidListTitle;
		if (this.state.discountList.length > 0) {
			discountList = this.state.discountList.map((item,index)=>{
				var status=item.status
				var discount_type;
				// if (item.status == '有效') {
				// 	status= '可使用'
				// }else {
				// 	status= '已使用'
				// }

			 if (item.discount_type_int==1) {//体验券
					//item.type == 0 全类别：直播课/视频课
					//item.type == 1 直播课
					//item.type == 2 视频课
					discount_type = item.chineseLessonType;

				}else if (item.discount_type_int==2){//现金券
					discount_type = '￥'+ item.equal_money
				}

				return(
					<div key={index} style={{...styles.discountDiv}} onClick={this.goToDetail.bind(this,item)}>
						<div style={{float:'left',height:125,width:5,backgroundColor:'#2196f3',borderTopLeftRadius:'6px',borderBottomLeftRadius:'6px'}}></div>
						<div style={{width:106,height:125,float:'left',marginLeft:6}}>
							<div style={{marginLeft:6}}>
								<span style={{fontSize:12,color:'#999'}}>{item.discount_type}</span>
							</div>
							<div style={{textAlign:'center',marginTop:20,}}>
								<span style={{fontSize:18,color:'#000',fontWeight:'bold'}}>{discount_type}</span>
							</div>
							<div style={{...styles.statusDiv,marginLeft:18}}>
								<span style={{fontSize:13,color:'#2196f3'}}>{status}</span>
							</div>
						</div>
						<div style={{width:6,height:125,float:'left',marginRight:20}}>
							<img src={Dm.getUrl_img('/img/v2/icons/splitLine@2x.png')} width="6" height="123" />
						</div>
						<div style={{height:125,paddingTop:12,}}>
							<div style={{}}>
								<span style={{...styles.commonDiv,fontSize:12,color: item.lessonTitle ? '#999999':'#000000',WebkitLineClamp: 2,lineHeight:1.2}}>{item.title}</span>
							</div>
							<div style={{height:20,lineHeight:1.3,paddingTop:item.lessonTitle ? 4 : 0}}>
								<span style={{...styles.commonDiv,fontSize:14,color:'#000000',WebkitLineClamp: 1,}}>{item.lessonTitle}</span>
							</div>
							<div>
								<span style={{...styles.commonDiv,fontSize:12,color:'#999999',WebkitLineClamp: 1,}}>券号：{item.code}</span>
							</div>
							<div>
								<span style={{...styles.commonDiv,fontSize:12,color:'#999999',WebkitLineClamp: 1,}}>来自：{item.means}</span>
							</div>
							<div>
								<span style={{...styles.commonDiv,fontSize:12,color:'#999999',WebkitLineClamp: 1,}}>有效期至：{item.end_use_time ? new Date(item.end_use_time).format("yyyy-MM-dd") : '--'}</span>
							</div>
						</div>
					</div>
				);
			})
		}
		if (this.state.discountInvalidList.length > 0) {
			discountInvalidListTitle = (
				<div style={{width:'100%',textAlign:'center',marginTop:20}}>
					<span style={{fontSize:13,color:'#999999',}}>————————已使用已过期的券————————</span>
				</div>
			)
		var	discountInvalidList = this.state.discountInvalidList.map((item,index)=>{

				var status = item.status
				var discount_type;
				// if (item.status == '有效') {
				// 	status= '已过期'
				// }else {
				// 	status= '已使用'
				// }

				if (item.discount_type_int==1) {//体验券
 					//item.type == 0 全类别：直播课/视频课
 					//item.type == 1 直播课
 					//item.type == 2 视频课
 					discount_type = item.chineseLessonType;
 				}else if (item.discount_type_int==2){//现金券
 					discount_type = '￥'+ item.equal_money
 				}

				return(
					<div key={index} style={{...styles.discountDiv}} onClick={this._goLink.bind(this,item)}>
						<div style={{float:'left',height:125,width:5,backgroundColor:'#999',borderTopLeftRadius:'6px',borderBottomLeftRadius:'6px'}}></div>
						<div style={{width:106,height:125,float:'left',marginLeft:6}}>
							<div style={{marginLeft:6}}>
								<span style={{fontSize:12,color:'#999999'}}>{item.discount_type}</span>
							</div>
							<div style={{textAlign:'center',marginTop:20,}}>
								<span style={{fontSize:16,color:'#000',fontWeight:'bold'}}>{discount_type}</span>
							</div>
							<div style={{...styles.statusDiv,marginLeft:18,borderColor:'#999999',}}>
								<span style={{fontSize:13,color:'#999999'}}>{status}</span>
							</div>
						</div>
						<div style={{width:6,height:125,float:'left',marginRight:20}}>
							<img src={Dm.getUrl_img('/img/v2/icons/splitLine@2x.png')} width="6" height="123" />
						</div>
						<div style={{height:125,paddingTop:12}}>
							<div style={{}}>
								<span style={{...styles.commonDiv,fontSize:12,color: item.lessonTitle ? '#999999':'#000000',WebkitLineClamp: 2,lineHeight:1.2}}>{item.title}</span>
							</div>
							<div style={{height:20,lineHeight:1.3,paddingTop: item.lessonTitle ? 4 : 0}}>
								<span style={{...styles.commonDiv,fontSize:14,color:'#000000',WebkitLineClamp: 1,}}>{item.lessonTitle}</span>
							</div>
							<div>
								<span style={{...styles.commonDiv,fontSize:12,color:'#999999',WebkitLineClamp: 1,}}>券号:{item.code}</span>
							</div>
							<div>
								<span style={{...styles.commonDiv,fontSize:12,color:'#999999',WebkitLineClamp: 1,}}>来自:{item.means}</span>
							</div>
							<div>
								<span style={{...styles.commonDiv,fontSize:12,color:'#999999',WebkitLineClamp: 1,}}>有效期至:{item.end_use_time ? new Date(item.end_use_time).format("yyyy-MM-dd") : '--'}</span>
							</div>
						</div>
					</div>
				);
			})
		}
		return (
			<div style={{...styles.div,height: this.state.discountList.length >0 || this.state.discountInvalidList.length >0 ? devHeight-50 : devHeight}}>
				{
					this.state.discountInvalidList.length < 1 && this.state.discountList.length < 1 ?
						<div style={{textAlign:'center',paddingTop:70}}>
							<div>
								<img src={Dm.getUrl_img('/img/v2/icons/null.png')}/>
							</div>
							<div>
								<span style={{fontSize:13,color:'#333333'}}>~暂无卡券~</span>
							</div>
							<div style={{...styles.addDiv}}>
								<Link to={`${__rootDir}/PgAddDiscount`}><span style={{fontSize:16,color:'#666666'}}>立即添加</span></Link>
							</div>
						</div>
					:
					<div>
						{discountList}
						{discountInvalidListTitle}
						{discountInvalidList}
					</div>
				}
				<div style={{...styles.addDiscountDiv,display: this.state.discountList.length >0 || this.state.discountInvalidList.length >0 ? 'block':'none'}}>
					<img style={{marginTop:20,marginLeft:(devWidth-85)/2}} src={Dm.getUrl_img('/img/v2/icons/add.png')} />
					<Link to={`${__rootDir}/PgAddDiscount`}><span style={{fontSize:14,color:'#2196f3',marginTop:18,marginLeft:8,position:'absolute'}}>添加卡券</span></Link>
				</div>
			</div>
		);
	}
}

var styles = {
	div: {
		width: devWidth,
		backgroundColor: '#ffffff',
		overflow: 'scroll'
	},
	addDiv: {
		height: 40,
		width: 150,
		// borderTopLeftRadius:6,
		// borderBottomLeftRadius:6,
		// borderTopRightRadius:6,
		// borderBottomRightRadius:6,
		borderRadius: 28,
		borderColor: '#666666',
		border: '1px solid',
		marginLeft: (devWidth - 140) / 2,
		marginTop: 27,
		lineHeight: '36px',
		border: 0,
	},
	discountDiv: {
		height: 125,
		width: devWidth - 24,
		backgroundColor: '#f7f7f7',
		marginLeft: 12,
		// marginBottom:15,
		marginTop: 20
	},
	statusDiv: {
		textAlign: 'center',
		marginTop: 12,
		width: 63,
		height: 23,
		border: '1px solid',
		borderColor: '#2196f3',
		borderRadius: 3,
	},
	commonDiv: {
		textOverflow: 'ellipsis',
		whiteSpace: 'normal',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		fontFamily: 'pingfangsc-regular'
	},
	addDiscountDiv: {
		width: '100%',
		height: 50,
		backgroundColor: '#f7f7f7',
		position: 'absolute',
		bottom: 0,
		// textAlign:'center'
	}
};

export default PgMyDiscount;
