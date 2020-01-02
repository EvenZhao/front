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
import LiveLessonDiv from '../components/LiveLessonDiv';
import FullLoading from '../components/FullLoading';
import Dm from '../util/DmURL'
import Common from '../Common';



var limit = 15;//定数初始limit
var liveSkip = 0;
var myEnrollSkip = 0;
var isInvited = 0;
var skip = 0;

class PgLiveReserveEnrollList extends React.Component {
	constructor(props) {
    super(props);
    this.id = ''

		this.state = {

			type: 3,
			liveList:[],
			myEnrollList:[],
			liveMore:true,
			myEnrollLabelType:[],
			isLoading:true,
		};
	}

	componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'myReserveEnrollList',
      resource_type: 1,
			type:null,
			skip: 0,
			limit: limit,
    })
	}


	componentDidMount() {
		isReservation = true;

		EventCenter.emit("SET_TITLE",'铂略财课-直播参与')
    this._getmyReserveEnrollListDone = EventCenter.on('myReserveEnrollListDone',this._handlemyReserveEnrollListDone.bind(this));
		this._getmyReserveEnrollListMoreDone = EventCenter.on('myReserveEnrollListMoreDone',this._handlemyReserveEnrollListMoreDone.bind(this));


	}
	componentWillUnmount() {
    this._getmyReserveEnrollListDone.remove();
		this._getmyReserveEnrollListMoreDone.remove();

	}


	_handlemyReserveEnrollListDone(re){
		var results = re.result || [];
		var user = re.user || {}
		 skip = results.length || 0;
			this.setState({
				liveList: results.length >0 ? results : [],
				liveMore: results.length >=limit ? true : false,
				isLoading:false,
			})
	}

	_handlemyReserveEnrollListMoreDone(re){
		var results = re.result || [];
		skip = this.state.liveList.concat(results).length || 0
		this.setState({
			liveList: results.length >0 ? this.state.onelist.concat(results) : this.state.liveList,
			liveMore: results.length >=limit ? true : false,
			isLoading:false,
		})
	}

	_labelScorll(re){
		if((this.myEnrollList.scrollHeight - this.myEnrollList.scrollTop - 220) <  document.documentElement.clientHeight) {
      if (this.state.myEnrollList.length < 15) {
        return
      }
			Dispatcher.dispatch({
				actionType: 'myReserveEnrollList',
				resource_type: re,
				type:null,
				skip: skip,
				limit: limit,
				loadmore: true //标记用于判断是够调用loadmore方法
			})
	}
}

	render(){
    var lessonDiv;
		var toLink;
		var loadmore;
		var myEnrollList;

			toLink = `${__rootDir}/list/live`;

		var listNull = (
			<div style={{textAlign:'center',paddingTop:70}}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{marginTop:51}}>
					<span style={{fontSize:15,color:'#999999'}}>暂无收藏哦，快去预约课程吧~</span>
				</div>
				<Link to={toLink}>
					<div style={{...styles.collecButton}}>
						<span style={{fontSize:16,color:'#666666'}}>去预约</span>
					</div>
				</Link>
			</div>
		)

		let data = {
			data: this.state.liveList || [],
			isReservation:isReservation,
		}
		if (this.state.liveList.length < 1) {
			lessonDiv = listNull
		}else {
			lessonDiv = <LiveLessonDiv {...data}/>
		}

	return (
		<div style={{...styles.div}} ref={(myEnrollList) => this.myEnrollList = myEnrollList}
		onTouchEnd={() => {this._labelScorll(this.myEnrollList)}}>
		<FullLoading isShow={this.state.isLoading}/>
     <div style={{...styles.lessonDiv,height:devHeight-50}}>
  		{lessonDiv}
  		<div style={{display:this.state.liveList.length >0 && this.state.liveMore == false ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
    </div>
    </div>
    );
  }
}

var styles = {
  div:{
    height: devHeight,
    width: devWidth,
    backgroundColor:'#ffffff',
  },
  title:{
    fontSize:Fnt_Medium,
    color:Common.Black,
  },
  lessonDiv:{
    height: devHeight-50,
    width:'100%',
    backgroundColor:'#ffffff',
    overflow:'scroll'
  },
  meunTitleDiv:{
    width:devWidth/2,
    height:50,
    float:'left',
    textAlign:'center',
    fontSize:15,
    color:'#999999',
    lineHeight: 3,
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#F3F3F3',
  },
  meunTitleDivSelected:{
    width:devWidth/2,
    height:50,
    float:'left',
    textAlign:'center',
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#2196f3',
    color:'#2196f3',
    fontSize:15,
    lineHeight: 3
  },
  collecButton:{
    width: 120,
    height: 39,
    border: '1px solid',
    borderRadius: 25,
    borderColor: '#666666',
    marginLeft: (devWidth-120)/2,
    lineHeight: 2.5,
    marginTop: 22,
  },
	LineClamp:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		// lineHeight:20,
		// WebkitLineClamp: 1,
	},
	oneDiv:{
		width:devWidth-24,
		marginLeft:12,
		borderBottomWidth:1,
		borderBottomStyle:'solid',
		borderBottomColor:'#F3F3F3',
	},
	msk:{
		width:127,
		height:80,
		backgroundColor:'#000',
		opacity:0.5,
		position:'absolute',
		left:0,
		top:0,
	},
	source:{
		position:'absolute',
		bottom:0,
		left:0,
		height:20,
		lineHeight:'20px',
		fontSize:11,
		color:Common.Bg_White,
		padding:'0 8px'
	},

};

export default PgLiveReserveEnrollList;
