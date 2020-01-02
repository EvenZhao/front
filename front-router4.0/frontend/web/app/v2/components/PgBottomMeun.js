/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import FullLoading from '../components/FullLoading';

class PgBottomMeun extends React.Component {
	constructor(props) {
	    super(props);
		this.state = {
			title: 'PgHome',
			hasNewYearIcos: false, //是否有新年图标：新年图标需要特殊的显示样式
			isMessPoint:false,//消息是否显示红点
			isPgCenterPoint:false,//个人中心是否显示红点
      thirdIcons: [],
			isLoading: true,
		};

	}

	componentWillMount() {

	}
	_handleindexIconDone(re){
		// console.log('_handleindexIconDone============',re);
		if (re.err) {
			return
		}
		var result = re.result
		this.setState({
			isLoading: false,
			thirdIcons: result.thirdIcons
		})
		if (result.thirdIcons && result.thirdIcons.length >= 12) {
			this.setState({
				hasNewYearIcos: true
			})
		}
	}
	componentDidMount() {
		this.onredPointDone = EventCenter.on('redPointDone', this._handleredPointDone.bind(this))
		this._getindexIconDoneDone = EventCenter.on('indexIconDone',this._handleindexIconDone.bind(this))

		Dispatcher.dispatch({
			actionType: 'redPoint'
		})
		Dispatcher.dispatch({
			actionType: 'indexIcon'
		})
	}
	componentWillUnmount() {
		this.onredPointDone.remove()
		this._getindexIconDoneDone.remove()
	}

	_handleredPointDone(re){

		if(re.err){

			return false;
		}
		if(re.result){
			this.setState({
				isMessPoint:re.result.pointIsShow,
				isPgCenterPoint:re.result.centerPointIsShow,
			})

		}

	}

	render(){
		var end = ''
		if (this.state.hasNewYearIcos) {
			var thirdIcons = this.state.thirdIcons || []
			end = thirdIcons[0].image;
		}
		return (
			<div style={{...styles.container, height: this.state.hasNewYearIcos ? '60px' : '50px', backgroundImage:'url('+ end +')',backgroundSize:'cover'}}>
				<FullLoading isShow={this.state.isLoading}/>
			<hr style={{border: 'none', height: 0.5, backgroundColor: '#e5e5e5',}}/>
			<Link to={`${__rootDir}/`}>
				{
					this.state.hasNewYearIcos ?
					<div style={{...styles.div}}>
						<div style={{marginTop: '6px'}}><img src={this.props.type == 'index' ? thirdIcons[6].image : thirdIcons[1].image} height="30" /></div>
						<div style={{fontSize: 12,lineHeight:'21px', color: this.props.type == 'index' ? '#FFCD7C' : '#FFD1D1'}}>首页</div>
					</div>
					:
					<div style={{...styles.div}}>
						<div style={{...styles.icon}}><img src={this.props.type == 'index' ? Dm.getUrl_img('/img/v2/icons/home-click@2x.png') : Dm.getUrl_img('/img/v2/icons/home@2x.png')} height="20"  /></div>
						<div style={{fontSize: 12, lineHeight:'23px',color: this.props.type == 'index' ? '#2196f3' : '#333'}}>首页</div>
					</div>
				}
			</Link>
			<Link to={`${__rootDir}/PgLawLastest`}>
				{
					this.state.hasNewYearIcos ?
						<div style={{...styles.div}}>
							<div style={{marginTop: '6px'}}><img src={this.props.type == 'law' ? thirdIcons[7].image : thirdIcons[2].image} height="30"  /></div>
							<div style={{fontSize: 12, lineHeight:'21px',color: this.props.type == 'law' ? '#FFCD7C' : '#FFD1D1'}}>法规库</div>
						</div>
					:
						<div style={{...styles.div}}>
							<div style={{...styles.icon}}><img src={this.props.type == 'law' ? Dm.getUrl_img("/img/v2/icons/law@2x.png") : Dm.getUrl_img("/img/v2/icons/law-normal@2x.png")} height="20" /></div>
							<div style={{fontSize: 12, lineHeight:'23px',color: this.props.type == 'law' ? '#2196f3' : '#333'}}>法规库</div>
						</div>
				}

			</Link>
			<Link to={`${__rootDir}/Qa`}>
			{
				this.state.hasNewYearIcos ?
					<div style={{...styles.div}}>
						<div style={{marginTop: '6px'}}><img src={this.props.type == 'Qa' ? thirdIcons[8].image : thirdIcons[3].image} height="30" /></div>
						<div style={{fontSize: 12, lineHeight:'21px', color: this.props.type == 'Qa' ? '#FFCD7C' : '#FFD1D1'}}>问答</div>
					</div>
				:
					<div style={{...styles.div}}>
						<div style={{...styles.icon}}><img src={this.props.type == 'Qa' ? Dm.getUrl_img("/img/v2/icons/q-a@2x.png") : Dm.getUrl_img("/img/v2/icons/QA@2x.png")} height="20"  /></div>
						<div style={{fontSize: 12, lineHeight:'23px', color: this.props.type == 'Qa' ? '#2196f3' : '#333'}}>问答</div>
					</div>
			}

			</Link>
			<Link to={`${__rootDir}/PgMessageList`}>
			{
				this.state.hasNewYearIcos ?
					<div style={{...styles.div}}>
						{
							this.state.isMessPoint ?
							<div style={{...styles.yellowPoint,width:8,height:8}}></div>
							:
							null
						}
						<div style={{marginTop: '6px'}}><img src={this.props.type == 'message' ? thirdIcons[9].image : thirdIcons[4].image}  height="30" /></div>
						<div style={{fontSize: 12, lineHeight:'21px', color: this.props.type == 'message' ? '#FFCD7C' : '#FFD1D1'}}>消息</div>
					</div>
				:
					<div style={{...styles.div}}>
						{
							this.state.isMessPoint ?
							<div style={{...styles.redPoint}}></div>
							:
							null
						}
						<div style={{...styles.icon}}><img src={this.props.type == 'message' ? Dm.getUrl_img("/img/v2/icons/home_messageOn@2x.png") : Dm.getUrl_img("/img/v2/icons/home_message@2x.png")}  height="20" /></div>
						<div style={{fontSize: 12, lineHeight:'23px', color: this.props.type == 'message' ? '#2196f3' : '#333'}}>消息</div>
					</div>
			}
			</Link>
			<Link to={`${__rootDir}/PgCenter`}>
			{
				this.state.hasNewYearIcos ?
				<div style={{...styles.div}}>
					{
						this.state.isPgCenterPoint ?
						<div style={{...styles.yellowPoint}}></div>
						:
						null
					}
					<div style={{marginTop: '6px'}}><img src={this.props.type == 'my' ? thirdIcons[10].image : thirdIcons[5].image} height="30"  /></div>
					<div style={{fontSize: 12, lineHeight:'21px', color: this.props.type == 'my' ? '#FFCD7C' : '#FFD1D1'}}>我</div>
				</div>
				:
				<div style={{...styles.div}}>
					{
						this.state.isPgCenterPoint ?
						<div style={{...styles.redPoint}}></div>
						:
						null
					}
					<div style={{...styles.icon}}><img src={this.props.type == 'my' ? Dm.getUrl_img("/img/v2/icons/user2@2x.png") : Dm.getUrl_img("/img/v2/icons/user@2x.png")} height="20"  /></div>
					<div style={{fontSize: 12, lineHeight:'23px', color: this.props.type == 'my' ? '#2196f3' : '#333'}}>我</div>
				</div>
			}
			</Link>
			</div>
		);
	}
}
PgBottomMeun.propTypes = {

};
PgBottomMeun.defaultProps = {

};
var styles = {
  container:{
    height: 50,
	width:'100%',
	lineHeight:1,
    backgroundColor:'#ffffff',
		// borderTopColor:'#808080',
		// borderTopWidth:0.5,
		// borderTopStyle:'solid'
  },
  div:{
    width:'20%',
    float:'left',
    textAlign:'center',
    fontSize:16,
    color:'#333333'
  },
	icon:{
		marginTop:8,
	},
	redPoint:{
		width:8,
		height:8,
		backgroundColor:'#FF0000',
		borderRadius:'100px',
		position:'absolute',
		marginTop:9,
		marginLeft:50
	},
	yellowPoint: {
		width:8,
		height:8,
		backgroundColor:'#F8E71C',
		borderRadius:'100px',
		position:'absolute',
		marginTop:9,
		marginLeft:50
	}
};
export default PgBottomMeun;
