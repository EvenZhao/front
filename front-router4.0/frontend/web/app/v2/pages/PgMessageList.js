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
import PgBottomMeun from '../components/PgBottomMeun';
import Common from '../Common'
import FullLoading from '../components/FullLoading';
import PgNoMessage from './PgNoMessage'

class PgMessageList extends React.Component {
	constructor(props) {
	    super(props);
      this.data=['报名','回答','评论','采纳','关注','企业公告','系统通知']//可变的菜单 '企业公告','系统通知'暂时去掉
		this.state = {
			title: 'PgHome',
			enroll_point: 0, //报名
			offlineChange_point: 0, //变更通知
			offlineRemind_point: 0, //开课提醒
			audit_point:0,//审核通知
			adopt_point: 0, //采纳
			answer_point: 0, //回答
			comment_point: 0, //评论
			focus_point: 0, //关注
			message_point: 0, //通告
			note_point: 0, //公告
			topic_lesson:[], //话题课程
			topic_question:[], //话题问答,
			message_redPoint: false, //是否显示红点
			user:{},//用于判断当前用户的类型
			invited_point: 0,
			isLoading: true,
			isMainHolder:0,// 1:主持卡人，0：非主持卡人
			isNoMessage: false,
			offlineMessageList:[],
			otherMessageList:[],
			questionMessageList:[],
		};

	}
	_handleredPointDone(re){
		console.log('_handleredPointDone',re);
		var user = re.user || {}
		if (!user.isLogined) {
			this.setState({
				isLoading: false,
				isNoMessage: true
			})
			return false
		}
		var result = re.result || {}
		if(result){
			this.setState({
				message_redPoint : result.pointIsShow,
				enroll_point: result.enroll_point, //报名
				offlineChange_point: result.offlineChange_point || 0,
				offlineRemind_point: result.offlineRemind_point || 0,
				audit_point: result.audit_point || 0,//审核通知
				adopt_point: result.adopt_point, //采纳
				answer_point: result.answer_point, //回答
				comment_point: result.comment_point, //评论
				focus_point: result.focus_point, //关注
				message_point: result.message_point, //通告
				note_point: result.note_point, //公告
				topic_lesson: result.topic_lesson || [], //话题课程
				topic_question:result.topic_question || [],
				invited_point: result.invited_point || 0,
				user: re.user || {},
				isMainHolder: re.user.isMainHolder || 0,
				isLoading: false,
				offlineMessageList: result.offlineMessageList || [],
				otherMessageList: result.otherMessageList || [],
				questionMessageList: result.questionMessageList || [],
			})
		}
	}
	componentWillMount() {
		//在PgBottomMeun中已发送请求获取红点
		// Dispatcher.dispatch({
		// 	actionType: 'redPoint'
		// })
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-消息')
		this.onredPointDone = EventCenter.on('redPointDone', this._handleredPointDone.bind(this))

	}
	componentWillUnmount() {
		this.onredPointDone.remove()

	}

	goEnrollList(type){

		switch (type) {
				case 'enroll':
				//报名通知
				this.props.history.push({pathname:`${__rootDir}/EnrollNoticeList`, state:{type}})
				break;
				case 'offlineChange':
				//变更通知
				this.props.history.push({pathname:`${__rootDir}/OfflineChangeNoticeList`, state:{type}})
				break;
				case 'offlineRemind':
				//开课提醒
				this.props.history.push({pathname:`${__rootDir}/OfflineRemindNoticeList`, state:{type}})
				break;
				//审核通知
				case 'audit':
					this.props.history.push({pathname:`${__rootDir}/ReviewNoticeList`, state:{type}})
					break;
				case 'answer':
				//回答通知
				this.props.history.push({pathname:`${__rootDir}/AnswerNoticeList`, state:{type}})
				break;
				case 'comment':
					//评论通知
					this.props.history.push({pathname:`${__rootDir}/CommentNoticeList`, state:{type}})
				break;
				case 'adopt':
					//采纳通知
					this.props.history.push({pathname:`${__rootDir}/AdoptNoticeList`, state:{type}})
				break;
				case 'focus':
					//关注通知
					this.props.history.push({pathname:`${__rootDir}/FocusNoticeList`, state:{type}})
				break;
				case 'message':
					//系统通知
					this.props.history.push({pathname:`${__rootDir}/SystemNotification`, state:{type}})
				break;
				case 'note':
					//企业公告
					this.props.history.push({pathname:`${__rootDir}/EnterpriseAnnouncement`, state:{type}})
				break;
				case 'invited':
					//邀请
					this.props.history.push({pathname:`${__rootDir}/InviteNoticeList`, state:{type}})
				break;
			default:
		}
	}

	// _goReview(){
	// 	this.props.history.push({pathname:`${__rootDir}/offlineToExamine`})
	// }

	render(){
    // newHot最新最热
    // 回答 maAnwswer@2.png 评论 maComment.@2x.png 采纳 maAdopt@2x.png 关注 maFocus@2x.png 企业 Group@2x.png 通知 maNew@2x.png
    var meuns = this.data.map((item,index)=>{//由于是5个一样的菜单，所以偷懒写了个Map循环
      var image
			var isMessage = false //判断是否有消息 默认为无 false
			var meaageNum = 0 //未读消息数量
			var mgTop = 0 //
			var type //设置跳转页面的获取数据的类型
      switch (index) {
        case 0:
				if (this.state.user.isTeacher) {
					image='/img/v2/icons/inviteMessage@2x.png'
					type = 'invited'
					item = '邀请'
					if(this.state.invited_point){
						isMessage = true
						meaageNum = this.state.invited_point
					}
				}else {
					image='/img/v2/icons/enroll@2x.png'
					type = 'enroll'
					if(this.state.enroll_point){
						isMessage = true
						meaageNum = this.state.enroll_point
					}
				}

        break;
        case 1:
          image='/img/v2/icons/maAnwswer@2x.png'
					type = 'answer'
					if(this.state.answer_point){
						isMessage = true
						meaageNum = this.state.answer_point
					}
        break;
        case 2:
          image='/img/v2/icons/maComment@2x.png'
					type = 'comment'
					if(this.state.comment_point){
						isMessage = true
						meaageNum = this.state.comment_point
					}
        break;
        case 3:
          image='/img/v2/icons/maAdopt@2x.png'
					type = 'adopt'
					if(this.state.adopt_point){
						isMessage = true
						meaageNum = this.state.adopt_point
					}
        break;
        case 4:
          image='/img/v2/icons/maFocus@2x.png'
					type = 'focus'
					if(this.state.focus_point){
						isMessage = true
						meaageNum = this.state.focus_point
					}
        break;
				case 5:
					image='/img/v2/icons/Group@2x.png'
					type = 'note'
					mgTop = 16
					if(this.state.note_point){
						isMessage = true
						meaageNum = this.state.note_point
					}
				break;
				case 6:
					image='/img/v2/icons/maNew@2x.png'
					type = 'message'
					mgTop = 16
					if(this.state.message_point){
						isMessage = true
						meaageNum = this.state.message_point
					}
				break;
      }
      return(
				<Link to={{pathname:`${__rootDir}/PgEnrollList`, state:{type}}} key={index}>
	        <div style={{...styles.div,marginTop:mgTop}} >
	          <div style={{...styles.leftDiv}}>
	            <img style={{...styles.image}} src={Dm.getUrl_img(image)} height="35" width="35"/>
	          </div>
	          <div style={{...styles.rightDiv,borderBottom:index == 4 ? 'none' : '1px solid #E5E5E5'}}>
	            <span style={{...styles.font}}>{item}</span>
	            <img style={{...styles.more}} src={Dm.getUrl_img('/img/v2/icons/more.png')} width="8" height="14"/>
							{
								isMessage ?
								<div style={{...styles.redPointDiv}}>
									<span style={{fontSize:11,color:'#FFFFFF'}}>{meaageNum}</span>
								</div>
								: null
							}
	          </div>
	        </div>
				</Link>
      )
    })
		return (
			<div style={{...styles.container}}>
				<div style={{display:this.state.isNoMessage ? 'none' :'block'}}>
				<FullLoading isShow={this.state.isLoading}/>
				<div style={{height:devHeight-50,overflowY:'auto'}}>
					<div style={{...styles.msbox,display:this.state.offlineMessageList.length > 0 ? 'block':'none'}}>
						<div style={styles.ms_title}>
							<div style={styles.ms_line}></div>
							<div style={styles.ms_titleText}>线下课</div>
						</div>
						<div style={styles.ms_content}>
							<div style={styles.ms_link} onClick={this.goEnrollList.bind(this,'enroll')}>
								<img src={Dm.getUrl_img('/img/v2/message/enroll@2x.png')} width="23" height="23"/>
								<div style={styles.conText}>报名通知</div>
								<div style={{...styles.point,display:this.state.enroll_point>0 ? 'block':'none'}}>{this.state.enroll_point}</div>
							</div>
							<div style={styles.ms_link} onClick={this.goEnrollList.bind(this,'offlineRemind')}>
								<img src={Dm.getUrl_img('/img/v2/message/offlineRemind@2x.png')} width="23" height="23"/>
								<div style={styles.conText}>开课提醒</div>
								<div style={{...styles.point,display:this.state.offlineRemind_point>0 ? 'block':'none'}}>{this.state.offlineRemind_point}</div>
							</div>
							<div style={styles.ms_link} onClick={this.goEnrollList.bind(this,'offlineChange')}>
								<img src={Dm.getUrl_img('/img/v2/message/offlineChange@2x.png')} width="23" height="23"/>
								<div style={styles.conText}>变更通知</div>
								<div style={{...styles.point,display:this.state.offlineChange_point>0 ? 'block':'none'}}>{this.state.offlineChange_point}</div>
							</div>
							<div style={{...styles.ms_link,display:this.state.isMainHolder == 1 ? 'flex':'none'}} onClick={this.goEnrollList.bind(this,'audit')}>
								<img src={Dm.getUrl_img('/img/v2/message/review@2x.png')} width="20" height="23"/>
								<div style={styles.conText}>待我审核</div>
								<div style={{...styles.point,display:this.state.audit_point > 0 ? 'block':'none'}}>{this.state.audit_point}</div>
							</div>
						</div>
					</div>

					<div style={{...styles.msbox,marginTop:10,display:this.state.questionMessageList.length > 0 ? 'block':'none'}}>
						<div style={styles.ms_title}>
							<div style={styles.ms_line}></div>
							<div style={styles.ms_titleText}>问答</div>
						</div>
						<div style={styles.ms_content}>
							{
								this.state.questionMessageList.map((item,index)=>{
									var code = item.code
									switch (code) {
										case 'invite':
											return(
												<div key={index} style={{...styles.ms_link,display:this.state.user.isTeacher == 1 ? 'flex':'none'}} onClick={this.goEnrollList.bind(this,'invited')}>
													<img src={Dm.getUrl_img('/img/v2/message/inviteMessage@2x.png')} width="21" height="20"/>
													<div style={styles.conText}>邀请通知</div>
													<div style={{...styles.point,display:this.state.invited_point > 0 ? 'block':'none'}}>{this.state.invited_point}</div>
												</div>
											)
										break;
										case 'answer':
											return(
												<div key={index} style={styles.ms_link} onClick={this.goEnrollList.bind(this,'answer')}>
													<img src={Dm.getUrl_img('/img/v2/message/maAnwswer@2x.png')} width="23" height="22"/>
													<div style={styles.conText}>回答通知</div>
													<div style={{...styles.point,display:this.state.answer_point > 0 ? 'block':'none'}}>{this.state.answer_point}</div>
												</div>
											)
										break;
										case 'comment':
											return(
												<div key={index} style={styles.ms_link} onClick={this.goEnrollList.bind(this,'comment')}>
													<img src={Dm.getUrl_img('/img/v2/message/maComment@2x.png')} width="22" height="21"/>
													<div style={styles.conText}>评论通知</div>
													<div style={{...styles.point,display:this.state.comment_point > 0 ? 'block':'none'}}>{this.state.comment_point}</div>
												</div>
											)
										break;
										case 'adopt':
											return(
												<div key={index} style={styles.ms_link} onClick={this.goEnrollList.bind(this,'adopt')}>
													<img src={Dm.getUrl_img('/img/v2/message/maAdopt@2x.png')} width="19" height="25"/>
													<div style={styles.conText}>采纳通知</div>
													<div style={{...styles.point,display:this.state.adopt_point > 0 ? 'block':'none'}}>{this.state.adopt_point}</div>
												</div>
											)
										break;
									}
								})
							}
						</div>
					</div>

					<div style={{...styles.msbox,marginTop:10,display:this.state.otherMessageList.length > 0 ? 'block':'none'}}>
						<div style={styles.ms_title}>
							<div style={styles.ms_line}></div>
							<div style={styles.ms_titleText}>其他</div>
						</div>
						<div style={styles.ms_content}>
							{
								this.state.otherMessageList.map((item,index)=>{
									var code = item.code
									switch (code) {
										case 'focus':
											return(
												<div key={index} style={{...styles.ms_link}} onClick={this.goEnrollList.bind(this,'focus')}>
													<img style={{marginTop:7}} src={Dm.getUrl_img('/img/v2/message/maFocus@2x.png')} width="24" height="16"/>
													<div style={styles.conText}>关注通知</div>
													<div style={{...styles.point,display:this.state.focus_point > 0 ? 'block':'none'}}>{this.state.focus_point}</div>
												</div>
											)
										break;
										case 'message':
											return(
												<div key={index} style={styles.ms_link} onClick={this.goEnrollList.bind(this,'message')}>
													<img style={{marginTop:3}} src={Dm.getUrl_img('/img/v2/message/maNew@2x.png')} width="21" height="18"/>
													<div style={styles.conText}>系统通知</div>
													<div style={{...styles.point,display:this.state.message_point > 0 ? 'block':'none'}}>{this.state.message_point}</div>
												</div>
											)
										break;
										case 'note':
											return(
												<div key={index} style={styles.ms_link} onClick={this.goEnrollList.bind(this,'note')}>
													<img  src={Dm.getUrl_img('/img/v2/message/Group@2x.png')} width="21" height="21"/>
													<div style={styles.conText}>企业公告</div>
													<div style={{...styles.point,display:this.state.note_point > 0 ? 'block':'none'}}>{this.state.note_point}</div>
												</div>
											)
										break;
									}
								})
							}

						</div>
					</div>
				</div>
			</div>
			<div style={{display:this.state.isNoMessage ? 'block' :'none'}}>
				<PgNoMessage />
			</div>
      <div style={{height: 'auto', width: devWidth,position:'fixed',zIndex:999,left:0,bottom:0}}>
        <PgBottomMeun type={'message'}/>
      </div>

			</div>
		);
	}
}
PgMessageList.propTypes = {

};
PgMessageList.defaultProps = {

};
var styles = {
  container:{
    height:window.innerHeight,
    width:devWidth,
  },
	msbox:{
		width:devWidth-24,
		padding:'15px 12px',
		backgroundColor:Common.Bg_White,
	},
	ms_title:{
		display:'flex',
		flex:1,
		flexDirection:'row',
		height:20,
	},
	ms_line:{
		width:4,
		height:15,
		backgroundColor:Common.Activity_Text,
		borderRadius:2,
		marginTop:3,
	},
	ms_titleText:{
		fontSize:Fnt_Normal,
		color:Common.Gray,
		marginLeft:10,
	},
	ms_content:{
		display:'flex',
		flex:1,
		flexDirection:'row',
		justiyContent:'center',
		alignItems:'center',
		flexWrap:'wrap',
	},
	ms_link:{
		display:'flex',
		width:(devWidth-24)/3,
		flexDirection:'column',
		justiyContent:'center',
		alignItems:'center',
		position:'relative',
		height:70,
		marginTop:30,
	},
	conText:{
		fontSize:Fnt_Small,
		color:Common.Black,
		marginTop:7,
	},
	point:{
		position:'absolute',
		zIndex:10,
		top:-10,
		right:(devWidth-24)/3/2-23,
		width:18,
		height:18,
		lineHeight:'18px',
		borderRadius:'50%',
		backgroundColor:Common.red,
		color:Common.Bg_White,
		fontSize:11,
		textAlign:'center',
	},




  messageListDiv:{
		marginTop:10,
    overflowY:'scroll',
    overflowX: 'hidden',
    height:window.innerHeight-60,
    width:devWidth
  },
  div:{//每个菜单的DIV
    width:devWidth,
    height:50,
    backgroundColor:'#ffffff',
    // border:'none'
  },
  leftDiv:{//左边的DIV
    width: 74,
    float: 'left',
    height: 50,
    // border: 'none'
  },
  rightDiv:{
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    borderBottomStyle: 'solid',
    width: devWidth-74,
    float: 'left',
    height: 50,
    // backgroundColor:'red'
  },
  image:{
    marginTop: 7,
    marginLeft: 18
  },
  font:{
    fontSize: 14,
    color:'#333333',
    // marginTop: 15
    position:'relative',
    top:15,
  },
  more:{
    // top:22,
    float:'right',
    marginRight:16,
    marginTop:22
  },
	redPointDiv:{
		width:15,
		height:15,
		backgroundColor:'#FF0000',
		float:'right',
		marginRight:12,
		borderRadius:18,
		textAlign:'center',
		lineHeight:0.8,
		marginTop:20
	}
};
export default PgMessageList;
