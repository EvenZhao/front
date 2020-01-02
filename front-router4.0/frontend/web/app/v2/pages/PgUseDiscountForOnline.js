/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import DiscountAlert from '../components/DiscountAlert';


class PgUseDiscountForOnline extends React.Component {
	constructor(props) {
    super(props);
    this.id = ''
    this.data = []
		this.state = {
			listHeight: devHeight-42.5,
			discountList: [],
			isShow: false,
			code: ''
		};
	}

	useDiscount(code) {
		this.setState({
			isShow: true,
			code: code
		})
	}

  _handledMyCanUseDiscountDone(re){
    if (re.result) {
      var result = re.result;
      this.setState({
        discountList: result.discountList,
      })
    }
  }

	_handleHideAlert() {
		this.setState({
			isShow: false
		})
	}

	_handleUseDiscount() {
		Dispatcher.dispatch({
			actionType: 'UseDiscount',
			resource_id: this.props.match.params.id,
			resource_type: this.props.match.params.type,
			code: this.state.code
		})
	}

	_handleUseDiscountDone(re) {
		console.log("RE", re)
		this.props.history.go(-1)
	}

	_hideBlackGround() {
		this.setState({
			isShow: false
		})
	}

	componentWillMount() {

	}
	componentDidMount() {
		Dispatcher.dispatch({
			actionType: 'MyCanUseDiscount',
			resource_type: this.props.match.params.type,
			resource_id: this.props.match.params.id
		})
    this._getMyCanUseDiscountDone = EventCenter.on('MyCanUseDiscountDone',this._handledMyCanUseDiscountDone.bind(this));
		this._hideAlert = EventCenter.on('HideAlert', this._handleHideAlert.bind(this))
		this._useDiscount = EventCenter.on('UseDiscount', this._handleUseDiscount.bind(this))
		this._UseDiscountDone = EventCenter.on('UseDiscountDone', this._handleUseDiscountDone.bind(this))
	}
	componentWillUnmount() {
    this._getMyCanUseDiscountDone.remove();
		this._hideAlert.remove()
		this._useDiscount.remove()
		this._UseDiscountDone.remove()
	}
	render(){
		var discountList;
		var discountInvalidList;
		var discountInvalidListTitle;
		if (this.state.discountList.length > 0) {
			discountList = this.state.discountList.map((item,index)=>{
				var status = item.status
				var discount_type= item.chineseLessonType
				// if (item.status == '有效') {
				// 	status= '未使用'
				// } else {
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
				// if (item.discount_type=='体验券') {
				// 	if(this.props.match.params.type == 2) {
				// 		discount_type = '视频课'
				// 	} else if(this.props.match.params.type ==1) {
				// 		discount_type = '直播课'
				// 	}
				// }else if (item.discount_type=='现金券'){
				// 	discount_type = '￥'+ item.equal_money
				// }
				return(
					<div key={index} style={{...styles.discountDiv}} onClick={() => {this.useDiscount(item.code)}}>
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
							<span style={{...styles.commonDiv,fontSize:12,color:'#999999',WebkitLineClamp: 1,}}>有效期至：{item.end_use_time ? new Date(item.end_use_time).format("yyyy年MM月dd日") : '--'}</span>
						</div>
					</div>
					</div>
				);
			})
		}

		return (
			<div style={{...styles.div}}>
				<div style={{height: devHeight, width: devWidth, backgroundColor: '#000', opacity: 0.5, position: 'absolute', zIndex: 1, display: this.state.isShow ? 'block' : 'none'}} onClick={this._hideBlackGround.bind(this)}></div>
				<DiscountAlert isShow={this.state.isShow}/>
				{
					this.state.discountList.length < 1 ?
						<div style={{textAlign:'center',paddingTop:70}}>
							<div>
								<img className="" src={Dm.getUrl_img('/img/v2/icons/null.png')} />
							</div>
							<div>
								<span style={{fontSize:13,color:'#333333'}}>~暂无优惠券~</span>
							</div>
							<div style={{...styles.addDiv}}>
								<Link to={`${__rootDir}/PgAddDiscount`}><span style={{fontSize:16,color:'#666666'}}>立即添加</span></Link>
							</div>
						</div>
					:
					<div>
						{discountList}
					</div>
				}
				<div style={{...styles.addDiscountDiv}}>
					<img style={{marginTop:20,marginLeft:(devWidth-85)/2}} src={Dm.getUrl_img("/img/v2/icons/add.png")} />
					<Link to={`${__rootDir}/PgAddDiscount`}><span style={{fontSize:14,color:'#2196f3',marginTop:18,marginLeft:8,position:'absolute'}}>添加优惠券</span></Link>
				</div>
			</div>
		);
	}
}

var styles = {
  div:{
    height: devHeight-50,
    width: devWidth,
    backgroundColor:'#ffffff',
		overflow:'scroll'
  },
  addDiv:{
    height:40,
    width:150,
    // borderTopLeftRadius:6,
    // borderBottomLeftRadius:6,
    // borderTopRightRadius:6,
    // borderBottomRightRadius:6,
    borderRadius:28,
    borderColor:'#666666',
    border:'1px solid',
    marginLeft: (devWidth - 140)/2,
    marginTop:27,
    lineHeight: '36px',

  },
	discountDiv:{
		height:125,
		width:devWidth-24,
		backgroundColor:'#f7f7f7',
		marginLeft:12,
		marginBottom:15,
		marginTop: 12
	},
	statusDiv:{
		textAlign:'center',
		marginTop:12,
		width:63,
		height:23,
		border:'1px solid',
		borderColor:'#2196f3',
		borderRadius:3,
	},
	commonDiv:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
	},
	addDiscountDiv:{
		width:'100%',
		height:50,
		backgroundColor:'#f7f7f7',
		position:'absolute',
		bottom:0,
		// textAlign:'center'
	}
};

export default PgUseDiscountForOnline;
