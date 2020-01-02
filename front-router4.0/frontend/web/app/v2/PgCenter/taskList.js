import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
import Task from './Task'
import FullLoading from '../components/FullLoading';
import ResultAlert from '../components/ResultAlert'

var countdown;
class taskList extends React.Component {
	constructor(props) {
    super(props);
		//通用任务图标数组
    this.imageData=['/img/v2/newbieTask/xinshouRW@2x.png','/img/v2/newbieTask/invite_user@2x.png','/img/v2/newbieTask/online@2x.png','/img/v2/newbieTask/reservation_live@2x.png','/img/v2/newbieTask/liveInfo@2x.png','/img/v2/newbieTask/point_offline@2x.png']
		//网页图标数组
		this.webImgArray = ['/img/v2/newbieTask/read_infomation@2x.png','/img/v2/newbieTask/experience@2x.png','/img/v2/newbieTask/read_notes@2x.png']
		//手机端任务图标数组
		this.mobileImgArray = ['/img/v2/newbieTask/online@2x.png','/img/v2/newbieTask/liveInfo@2x.png','/img/v2/newbieTask/point_offline@2x.png','/img/v2/newbieTask/share_product@2x.png']
		this.state = {
      taskTab: true,
			// hasTab:false,
      dailyData: [],//系统任务数组
			isPerson: false,
			isLoading: true,
			scrollTop:0,
			tasklistHeight:devHeight,
			listHeight:0,
			signCount:0,//签到天数
			isSeverDays:false,
			days:5,
			taskType:0,//签到规则：0，网页任务：2
			isShow:false,//是否显示弹框
			accountPoint:{},//积分
			signTask:{},//签到
			isSuccess:false,//是否签到成功
			signPoint:null,
			//弹框提示信息
      alert_display:'none',
      alert_title:'',
      errStatus:0,//0:返回错误信息,1:显示其他提示信息
			alert_show:false,
		};
		this.sign_array = [1,2,3,4,5,6,7]
	}

  componentWillMount() {

  }

	componentDidMount() {
		var account_type = null;
		if(this.props.location.state && this.props.location.state.account_type){
			account_type = this.props.location.state.account_type;
		}
		if (account_type == 1) {//员工账号，显示顶部tab
			this.setState({
				tasklistHeight:devHeight - 48,
			},()=>{
				this.setState({
					listHeight:this.state.tasklistHeight
				})
			})
			//判断是否从个人中心跳转过来签到的,显示积分任务这个tab
			if(this.props.location.state.source && this.props.location.state.source =='pageCenter'){
				this.setState({
						isPerson:false,
						taskTab:false,
						isLoading: true,
				},()=>{
					Dispatcher.dispatch({
						actionType: 'TaskList',
						// skip:0,
						// limit:15,
						taskStatus:'daily',
					})
					EventCenter.emit("SET_TITLE",'铂略财课-积分任务');
				})
			 }
			 else {//显示企业任务tab，并发送请求
				 this.setState({
					 isPerson:false,
					 taskTab:true,
					 isLoading: true,
				 },()=>{
					 Dispatcher.dispatch({
						actionType: 'TaskList',
						skip:0,
						limit:15,
						taskStatus:'company',
					})
					EventCenter.emit("SET_TITLE",'铂略财课-企业任务');
				 })
			 }
		}else {//个人账号
			this.setState({
				isPerson: true,
				taskTab: false,
				tasklistHeight:devHeight,
			},()=>{
				this.setState({
					listHeight:this.state.tasklistHeight,
				})
				Dispatcher.dispatch({
					actionType: 'TaskList',
					// skip:0,
					// limit:15,
					taskStatus:'daily',
				})
				EventCenter.emit("SET_TITLE",'铂略财课-积分任务');
			})
		}

    this.e_TaskList = EventCenter.on('TaskListDone',this._handleTaskListDone.bind(this));
		this.doSignDone = EventCenter.on('DoSignDone', this._handleDoSign.bind(this))
	}

	componentWillUnmount() {
    this.e_TaskList.remove()
		this.doSignDone.remove()
		clearInterval(countdown)
	}

	_handleTaskListDone(re){
		console.log('_handleTaskListDone000000',re);
		if (re.err) {
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
			// skip = re.result.length;
			this.setState({
				dailyData:re.result.data && re.result.data.list ? re.result.data.list : [],
				isLoading: false,
				accountPoint:re.result.data && re.result.data.accountPoint ? re.result.data.accountPoint : {},
				signTask:re.result.data && re.result.data.signTask ? re.result.data.signTask : {},
			},()=>{
				//等待页面数据加载完毕再调签到接口
				if(this.props.location.state.source && this.props.location.state.source =='pageCenter'){
					if(this.state.signTask.status == 2){//未签到
						Dispatcher.dispatch({
							actionType: 'DoSign'
						})
					}
				}
			});
		}
	}

  taskTab(e){
    this.setState({
        taskTab: (e == 1) ? true : false,
				isLoading: true,
    },()=>{
			Dispatcher.dispatch({
        actionType: 'TaskList',
        skip:0,
        limit:15,
        taskStatus: this.state.taskTab ? 'company' :'daily',
			})
		})
  }

	_handleDoSign(re){
		console.log('re----签到--',re);
		if (re.err) {
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
			//刷新页面,重新调一次数据
			// window.location.reload();
			this.setState({
				isSuccess:true,
				signPoint:re.result.signPoint,
				signCount:re.result.signCount,
			},()=>{
				if(this.state.signCount > 0){
					if(this.state.signCount%7 == 0){//签到7天
						this.setState({
							isSeverDays:true,
						})
					}
					else {
						this.setState({
							isSeverDays:false,
						})
					}
				}
			})
			Dispatcher.dispatch({
				actionType: 'TaskList',
				skip:0,
				limit:15,
				taskStatus:'daily',
			})
		}
	}

	doTask(code){
		switch (code) {//判断图标
			case 'XS12345':
			this.props.history.push(`${__rootDir}/newbieTaskIndex`)
			break;
			case 'PS12345':

			break;
			case 'RCRW1':
			this.props.history.push(`${__rootDir}/list/online`)
			break;
			case 'ZB12345':
			this.props.history.push(`${__rootDir}/list/live`)
			break;
			case 'XX12345':
			this.props.history.push(`${__rootDir}/list/offline`)
			break;
			default:
				break;
		}
	}
	//签到
	doSign() {
		Dispatcher.dispatch({
			actionType: 'DoSign'
		})
	}

	//关闭签到成功弹框
	_closed(){
		this.setState({
			isSuccess:false,
		})
	}

	//签到规则
	_signRule(){
		this.setState({
			taskType:0,
			isShow:true,
		})
	}
	//做任务
	_doTask(finishType){
			this.setState({
				taskType:2,
				isShow:true,
			})
	}

	//跳转到对应的做任务页面
	_toLink(jumpUrl){
		var urlArray = jumpUrl.split('/');
		//https://后的第一个／
		var urlIndex = jumpUrl.indexOf('//')	
			urlIndex = jumpUrl.indexOf('/', urlIndex+2)
		var param = jumpUrl.substring(urlIndex);
		//获取url中要跳转页面的名称，并跳转
		this.props.history.push(`${__rootDir}`+param)
	}

	_hideAlert(){
		this.setState({
			isShow:false,
		})
	}

	_labelScorll(){
		if(this.taskList.scrollTop < 60){
			this.setState({
				scrollTop:0,
				listHeight:this.state.tasklistHeight - 175
			})
		}
		else {
			this.setState({
				scrollTop:1,
				listHeight:this.state.tasklistHeight - 60
			})
		}

	}

	render(){
		//签到
		var finishNum = this.state.signTask.finishNum;//签到天数
		var status = this.state.signTask.status;//status:1 已签到，2：未签到
		if(status == 1){//已签到
			if(finishNum%7 == 0){
				finishNum = 7;//签到7天
			}else {
				finishNum = finishNum%7;//取余
			}
		}
		else{//未签到
			if(finishNum%7 == 0){
				finishNum = 0;//一次都没签到
			}else
			{
				finishNum = finishNum%7;//取余
			}
		}

		var signUp = this.sign_array.map((item,index)=>{
			return(
				<div key={index} style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
				{index <= (finishNum-1) ?
					<div style={{width:30,height:30}}>
						<img style={{marginRight:10,}} src={Dm.getUrl_img('/img/v2/newbieTask/sign_up@2x.png')} width="30" height="30"/>
					</div>
					:
					<div>
						{index == 6 ?
							<div style={{borderRadius:'50%',margin:'0 1px',border:'solid 1px #ffc056',width:23,height:25,paddingLeft:7,paddingTop:5}}>
								<img style={{marginRight:10,}} src={Dm.getUrl_img('/img/v2/newbieTask/seventh_day@2x.png')} width="17" height="22"/>
							</div>
							:
							<div style={{...styles.sign_day,}}><span>{item}天</span></div>
						}

					</div>
				}
					<div style={{...styles.signUp_line,display:index == 6 ? 'none':'block',backgroundColor:index <= (finishNum-2) ? '#fdc73b':'#d8d8d8'}}></div>
				</div>
			)
		})

		//弹框，签到规则及网页任务提示
		var title,content;//标题，内容
		if(this.state.taskType == 0){//签到规则
			title = '签到规则'
			content =(
				<div>
					每日签到，奖励 10 积分<br/>
					日限1次<br/>
					每连续签到至第7天，奖励7倍积分
				</div>
			)
		}else{//网页任务提示
			title = '提示';
			content =(
				<div>
				本任务为网页任务<br/>
				请使用电脑访问铂略网站完成。<br/>
				www.bolue.cn
				</div>
			)
		}

		var showAlert =(
			<div style={{...styles.white_alert,paddingTop:-1}}>
				<div style={{marginTop:19,fontSize:Fnt_Large,color:Common.Black,fontWeight:'bold'}}>{title}</div>
				<div style={{textAlign:'center',color:'#333',fontSize:12}}>
					{content}
				</div>
				<div style={styles.alert_bottom}>
					<div style={{display: 'flex',flex:1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', lineHeight: '42px',fontSize:17,color:Common.Activity_Text}}  onClick={this._hideAlert.bind(this)}>知道了</div>
				</div>
			</div>
		)

		//finishType 1:通用，2:网页，3:移动端
		var taskTitle;
		var list = [];
		var imageUrl;
		var thresholdNum = null;
		var taskButton;
		var finishType;
		var content,content_str,first_str;
		var firstArry = []
		var keyArry = []
 		var strArry = []
    var task_list = this.state.dailyData.map((item,index)=>{
			finishType = item.finishType;
			switch (item.finishType){//判断图标
        case 1:
       		taskTitle =(
						<div style={{width:devWidth,height:60,paddingTop:15, textAlign:'center',display:'flex',flexDirection:'row',alignItems:'center',marginBottom:15}}>
							<div style={{marginLeft:14,fontSize:Fnt_Large,color:Common.Light_Black,fontWeight:'bold',width:120,textAlign:'left'}}>通用任务</div>
	            <span style={{fontSize:14,color:'#657383',width:devWidth-234,marginRight:13}}>做任务，轻松拿积分</span>
							<div style={{width:66,marginRight:14,display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
								<img src={Dm.getUrl_img('/img/v2/newbieTask/people@2x.png')} width="66" height="59"/>
							</div>
	          </div>
					)
        	break;
				case 3:
					taskTitle = (
						<div style={{height:70,width:devWidth-14,marginLeft:14,marginBottom:15}}>
							<div style={{fontSize:Fnt_Large,color:Common.Light_Black,fontWeight:'bold',paddingTop:40}}>手机端任务</div>
						</div>
					)
					break;
        case 2:
					taskTitle = (
						<div style={{height:70,width:devWidth-14,marginLeft:14,marginBottom:15}}>
							<div style={{fontSize:Fnt_Large,color:Common.Light_Black,fontWeight:'bold',paddingTop:40}}>网页任务</div>
						</div>
					)
          break;
        default:
					break;
      }
			if(item.taskList){
				list = item.taskList;
			}
			return(
				<div key={index}>
					{taskTitle}
					<div>
					{
						list.map((list,idx)=>{
							if(list.thresholdNum == null){
								thresholdNum = 0;
							}else {
								thresholdNum = list.thresholdNum;
							}

							if(list.status == 1){//已完成
								taskButton = (
									<div style={styles.btn_complete}>已完成</div>
								)
							}else {//做任务
								taskButton = (
									<div style={styles.btn_doTask}>做任务</div>
								)
							}

							//根据code判断图标,finishType 1:通用，2:网页，3:移动端
							if(finishType == 1){//通用任务
								switch (list.code) {//判断图标
					        case 'XS12345':
					          imageUrl = this.imageData[0]
					        	break;
					        case 'YQHY':
					          imageUrl = this.imageData[1]
					        	break;
					        case 'RCRW1':
					          imageUrl = this.imageData[2]
					        	break;
					        case 'ZB12345':
					          imageUrl = this.imageData[3]
					        	break;
					        case 'GKZBK':
					          imageUrl = this.imageData[4]
					        	break;
									case 'CJXXK':
					          imageUrl = this.imageData[5]
					        	break;
					        default:
										break;
					      }
							}else if (finishType == 2) {//网页任务
								switch (list.code) {//判断图标
									case 'RCRW2':
										imageUrl = this.webImgArray[0]
										break;
									case 'JLXD':
										imageUrl = this.webImgArray[1]
										break;
									case 'YDBJ':
										imageUrl = this.webImgArray[2]
										break;
									default:
										break;
								}
							}else if (finishType == 3) {//移动端任务
								switch (list.code) {//判断图标
									case 'FXSPK':
										imageUrl = this.mobileImgArray[0]
										break;
									case 'FXZBK':
										imageUrl = this.mobileImgArray[1]
										break;
									case 'FXXXK':
										imageUrl = this.mobileImgArray[2]
										break;
									case 'FXZTK':
										imageUrl = this.mobileImgArray[3]
										break;
									default:
										break;
								}
							}

							//解析content,取出point
							if(list.content){
								content_str = list.content.split('[');
								if(content_str.length > 1){
									firstArry = content_str.slice(1);//移除数组中第一个
									first_str = content_str.splice(0,1);//返回数组中移除的第一个元素的value
									var key,second_str;

									firstArry.map((array,index)=>{
										key = array.split(']')[0];
										second_str = array.split(']')[1];
										keyArry.push(key);
										strArry.push(second_str);
									})
									for(var i=0;i<keyArry.length;i++){
										if(list[keyArry[i]] == null){
											list[keyArry[i]] = '';
										}
										content += list[keyArry[i]] + strArry[i];
										var point = list[keyArry[i]];
										var last_str = strArry[i];
										content=(
											<div>
												{first_str}<span style={{color:'#fcda80'}}> {point} </span>{last_str}
											</div>
										)
									 }
								}
							}

						return(
							<div key={idx}>
							 {list.status == 1 ?
								<div style={styles.list_box}>
									<div style={styles.big_ico}>
										<img src={Dm.getUrl_img(imageUrl)} width={50} height={50} />
									</div>
									<div style={styles.right_box}>
										<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:25}}>
											<span style={{...styles.complete_title,width:135}}>{list.name}</span>
											{list.thresholdNum > -1 ?
												<div style={{...styles.complete_text,width:(devWidth-182)/3}}>完成<span style={{color:list.finishNum > 0 ? Common.Activity_Text:'#c3c3c3'}}>{list.finishNum}</span>/{list.thresholdNum}</div>
												:
												<div style={{...styles.complete_text,width:(devWidth-182)/3}}>不限次</div>
											}
											<div style={{width:70,display:'flex',flexDirection:'row',justifyContent:'flex-end',marginRight:15}}>
												{taskButton}
											</div>
										</div>
										<div style={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
											<img src={Dm.getUrl_img('/img/v2/newbieTask/point@2x.png')} width={14} height={12} style={{marginTop:2}} />
											<span style={{color:'#c3c3c3',fontSize:Fnt_Small,marginLeft:10}}>{content}</span>
										</div>
									</div>
								</div>
								:
							 <div>
							 {item.finishType == 2 ?
								 <div style={styles.list_box} onClick={this._doTask.bind(this,item.finishType)}>
									<div style={styles.big_ico}>
										<img src={Dm.getUrl_img(imageUrl)} width={50} height={50} />
									</div>
									<div style={styles.right_box}>
										<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:25}}>
											<span style={{...styles.complete_title,width:135}}>{list.name}</span>
											{list.thresholdNum > -1 ?
												<div style={{...styles.complete_text,width:(devWidth-182)/3}}>完成<span style={{color:list.finishNum > 0 ? Common.Activity_Text:'#c3c3c3'}}>{list.finishNum}</span>/{list.thresholdNum}</div>
												:
												<div style={{...styles.complete_text,width:(devWidth-182)/3}}>不限次</div>
											}
											<div style={{width:70,display:'flex',flexDirection:'row',justifyContent:'flex-end',marginRight:15}}>
												{taskButton}
											</div>
										</div>
										<div style={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
											<img src={Dm.getUrl_img('/img/v2/newbieTask/point@2x.png')} width={14} height={12} style={{marginTop:2}} />
											<span style={{color:'#c3c3c3',fontSize:Fnt_Small,marginLeft:10}}>{content}</span>
										</div>
									</div>
								</div>
								:
								<a href={list.url}>
								<div style={styles.list_box}>
									<div style={styles.big_ico}>
										<img src={Dm.getUrl_img(imageUrl)} width={50} height={50} />
									</div>
									<div style={styles.right_box}>
										<div style={{display:'flex',flexDirection:'row',alignItems:'center',height:25}}>
											<span style={{...styles.complete_title,width:135}}>{list.name}</span>
											{list.thresholdNum > -1 ?
												<div style={{...styles.complete_text,width:(devWidth-182)/3}}>完成<span style={{color:list.finishNum > 0 ? Common.Activity_Text:'#c3c3c3'}}>{list.finishNum}</span>/{list.thresholdNum}</div>
												:
												<div style={{...styles.complete_text,width:(devWidth-182)/3}}>不限次</div>
											}
											<div style={{width:70,display:'flex',flexDirection:'row',justifyContent:'flex-end',marginRight:15}}>
												{taskButton}
											</div>
										</div>
										<div style={{display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
											<img src={Dm.getUrl_img('/img/v2/newbieTask/point@2x.png')} width={14} height={12} style={{marginTop:2}} />
											<span style={{color:'#c3c3c3',fontSize:Fnt_Small,marginLeft:10}}>{content}</span>
										</div>
									</div>
								</div>
								</a>
							 }
							 </div>
							}
							</div>
							)
					})
				}
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

		 var str = this.state.accountPoint.validPoint + '';
		 var leftNum = 0;
		 var fontNum = 0;
		 if(!isApple){
			 if(str.length > 2){
				 leftNum = 15;
				 fontNum = 14;
			 }else {
				 leftNum = 25;
 				 fontNum = 18;
			 }
		 }else {
			 leftNum = 25;
 			 fontNum = 18;
		 }

    return(
			<div style={{...styles.container}}
			onScroll={() => {this._labelScorll(this)}}
			>
				<ResultAlert {...alertProps}/>
				<FullLoading isShow={this.state.isLoading}/>
				{
					this.state.isPerson ?
						null
						:
						<div style={{...styles.taskTab}}>
							<div style={{...styles.tabDiv}} onClick={this.taskTab.bind(this,1)}>
								<span style={{fontSize:18,color:'#000000'}}>企业任务</span>
								{
									this.state.taskTab ?
										<div style={{...styles.tabLine}}></div>
										:
										null
								}
							</div>
							<div style={{...styles.tabDiv}} onClick={this.taskTab.bind(this,2)}>
								<span style={{fontSize:18,color:'#000000'}}>积分任务</span>
								{
									!this.state.taskTab ?
										<div style={{...styles.tabLine}}></div>
										:
										null
								}
							</div>
						</div>
					}
        <div style={{...styles.companyTask,display:this.state.taskTab ? 'block':'none'}}>
          <Task />
        </div>

				<div style={{...styles.companyTask,backgroundColor:'#f3f7fa',display:this.state.taskTab ? 'none':'block',
				height:this.state.tasklistHeight}}
				>
				<div style={{height:this.state.scrollTop > 0 ? 60:175}}>
				{this.state.scrollTop == 0 ?
					<div style={{...styles.top_box,}}>
						<div style={{display:'flex',flexDirection:'row',height:123,width:devWidth,position:'relative'}}>
							<div style={{marginLeft:leftNum,display:'flex',alignItems:'center',width:devWidth}}>
								<img src={Dm.getUrl_img('/img/v2/newbieTask/point@2x.png')} width={14} height={12} />
								<span style={{color:Common.Bg_White,marginLeft:5,fontSize:fontNum}}>{this.state.accountPoint.validPoint}</span>
								<span style={{color:Common.Bg_White,fontSize:11,marginLeft:3}}>积分</span>
								<div>
									<Link to={{pathname:`${__rootDir}/Pointsdetails`,state:{account_type: this.props.location.state ? this.props.location.state.account_type : null}}}>
										<span style={{color:Common.Bg_White,fontSize:11,textDecoration:'underline',marginLeft:5,float:'right'}}>明细</span>
									</Link>
								</div>
							</div>
							<div style={{width:80,display:'flex',alignItems:'center',justifyContent:'center',marginRight:30}}>
								{this.state.signTask.status == 1 ?
										<div style={styles.signUp}>
											<div style={{paddingTop:10}}>已签到获得</div>
											<div style={{fontSize:Fnt_Medium}}>{this.state.signTask.point}积分</div>
										</div>
										:
										<div style={styles.no_signUp} onClick={this.doSign.bind(this)}>立即签到</div>
								 }
							</div>
							<div style={{display:'flex',justifyContent:'flex-end',width:80,alignItems:'center',marginRight:40}}>
								<Link to={`${__rootDir}/PointsMall`}><div style={styles.btn_point}>积分商城</div></Link>
							</div>
							<div style={styles.rule} onClick={this._signRule.bind(this)}>签到规则</div>
						</div>
						<div style={styles.signUp_bg}>
							<div style={{...styles.circle, backgroundColor:finishNum > 0 ? '#fdc73b':'#d8d8d8'}}></div>
							<div style={{...styles.signUp_line,width:18,backgroundColor:finishNum > 0 ? '#fdc73b':'#d8d8d8'}}></div>
							{signUp}
						</div>
					</div>
					:
					<div style={{...styles.points_mall,}}>
						<div style={{marginLeft:25,display:'flex',alignItems:'center',width:devWidth-145}}>
							<img src={Dm.getUrl_img('/img/v2/newbieTask/point@2x.png')} width={14} height={12} />
							<span style={{color:Common.Bg_White,marginLeft:5,fontSize:Fnt_Large}}>{this.state.accountPoint.validPoint}</span>
							<span style={{color:Common.Bg_White,fontSize:11,marginLeft:3}}>积分</span>
							<Link to={`${__rootDir}/Pointsdetails`}><span style={{color:Common.Bg_White,fontSize:11,textDecoration:'underline',marginLeft:5}}>明细</span></Link>
						</div>
						<div style={{display:'flex',justifyContent:'flex-end',width:80,alignItems:'center',marginRight:40}}>
							<Link to={`${__rootDir}/PointsMall`}><div style={styles.btn_point}>积分商城</div></Link>
						</div>
					</div>
				}
				</div>

        <div style={{height:this.state.listHeight,overflowY:'auto',overflowX:'hidden'}} ref={(taskList) => this.taskList = taskList}>
					{task_list}
				</div>
        </div>
				<div style={{display:this.state.isShow ? 'block':'none'}}>{showAlert}</div>
				<div onClick={this._hideAlert.bind(this)} style={{...styles.msk,display:this.state.isShow ? 'block':'none'}}></div>

				{/*签到成功*/}
				<div style={{...styles.signUp_alert,display:this.state.isSuccess ? 'block':'none'}}>
					<div style={{width:344,height:369,position:'relative'}}>
						<div style={styles.close} onClick={this._closed.bind(this)}></div>
						<div style={{fontSize:Fnt_Normal,color:'#FF6633',display:this.state.isSeverDays ? 'block':'none',paddingTop:260,textAlign:'center'}}>连续签到7天，奖励7倍积分！</div>
						<div style={{fontSize:Fnt_Normal,color:Common.Gray,width:344,lineHeight:'24px',textAlign:'center',paddingTop:this.state.isSeverDays ? 10 : 260}}>恭喜获得<span style={{color:'#ff6633',fontSize:20}}>{this.state.signPoint}</span>积分</div>
					</div>
				</div>
				<div style={{...styles.msk,opacity:0.7,display:this.state.isSuccess ? 'block':'none'}} onClick={this._closed.bind(this)}></div>
			</div>
    )
  }
}

var styles = {
  container:{
    width:devWidth,
    height: devHeight,
    backgroundColor:'#F4F4F4',
  },
  taskTab:{
    display: 'flex',
    height: 46,
    backgroundColor:'#FFFFFF',
    position:'relative',
    borderBottomWidth:1,
    borderBottomColor:'#D8D8D8',
    borderBottomStyle:'solid',
  },
  tabDiv:{
    flex: 1,
    alignItems:'center',
    width: devWidth/2,
    textAlign:'center',
    marginTop: 13
  },
  tabLine:{
    width:72,
    height:2,
    backgroundColor:'#2196F3',
    marginLeft: (devWidth/2 - 72)/2,
    position:'absolute',
    top: 45
  },
  companyTask:{
    height:devHeight-48,
    width:devWidth,
    overflowY:'auto',
    overflowX:'hidden',
		position:'relative'
  },
  dailyDiv:{
    width: devWidth-26,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 2px 4px 0 #e6e6e6',
    marginBottom: 10,
    marginLeft: 13,
		position:'relative',
  },
  buttom:{
    height: 25,
    width: 80,
    borderRadius: '100px',
    textAlign: 'center',
  },
	top_box:{
		width:devWidth,
		position:'relative',
		height:175,
		display:'flex',
		flexDirection:'row',
		backgroundImage:'linear-gradient(269deg, #4DC1F9 0%, #5EA7F1 51%, #46ACFF 100%)',
	},
	points_mall:{
		width:devWidth,
		height:60,
		display:'flex',
		flexDirection:'row',
		backgroundImage:'linear-gradient(269deg, #4DC1F9 0%, #5EA7F1 51%, #46ACFF 100%)',
	},
	btn_point:{
		width:78,
		height:28,
		lineHeight:'28px',
		textAlign:'center',
		fontSize:Fnt_Normal,
		color:Common.Bg_White,
		borderRadius:40,
		border:'solid 1px #fff'
	},
	no_signUp:{
		width:75,
		height:75,
		lineHeight:'75px',
		textAlign:'center',
		border:'solid 4px #fff',
		backgroundImage:'linear-gradient(-90deg, #FFAB1E 1%, #FFA348 100%)',
		borderRadius:'50%',
		fontSize:16,
		color:'#fff',
	},
	signUp:{
		width:75,
		height:75,
		textAlign:'center',
		backgroundColor:'#6ab4ff',
		border:'solid 4px #cbe8ff',
		boxShadow:'0 2px 4px 0 rgba(235,235,235,0.5)',
		borderRadius:'50%',
		fontSize:12,
		color:'#fff',
		display:'flex',
		flexDirection:'column',
		justifyContent:'center'
	},
	rule:{
		width:56,
		height:20,
		textAlign:'center',
		lineHeight:'20px',
		color:'#fff',
		fontSize:11,
		backgroundColor:'#5499DD',
		borderRadius:10,
		position:'absolute',
		right:40,
		bottom:5
	},
	signUp_bg:{
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/newbieTask/signUp_bg@2x.png')+')',
		backgroundRepeat:'no-repeat',
		backgroundSize:'cover',
		width:devWidth,
		height:53,
		position:'absolute',
		left:0,
		bottom:0,
		display:'flex',
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center'
	},
	circle:{
		width:10,
		height:10,
		borderRadius:'50%',
		backgroundColor:'#d8d8d8'
	},
	signUp_line:{
		backgroundColor:'#d8d8d8',
		width:14,
		height:3,
	},
	sign_day:{
		width:30,
		height:30,
		borderRadius:'50%',
		border:'solid 1px #e1e1e1',
		fontSize:12,
		color:'#fff',
		textAlign:'center',
		lineHeight:'30px',
		margin:'0 1px'
	},
	white_alert:{
		width:devWidth-100,
		height:155,
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
	list_box:{
		height:80,
		width:devWidth-25,
		marginLeft:13,
		backgroundColor:'#fff',
		boxShadow:'0 2px 4px 0 #E6E6E6',
		borderRadius: 8,
		marginBottom:10,
		display:'flex',
		flexDirection:'row',
		alignItems:'center',
	},
	big_ico:{
		width:50,
		height:50,
		display:'flex',
		flexDirection:'row',
		paddingLeft:10,
	},
	right_box:{
		width:devWidth - 97,
		display:'flex',
		flexDirection:'column',
		justifyContent:'center',
		marginLeft:12,
	},
	btn_complete:{
		width:70,
		height:25,
		lineHeight:'25px',
		textAlign:'center',
		fontSize:Fnt_Normal,
		color:Common.Bg_White,
		borderRadius:100,
		backgroundImage:'linear-gradient(90deg, #1FCCF7 0%, #1BAFF8 100%)'
	},
	complete_title:{
		fontSize:Fnt_Medium,
		color:Common.Light_Black,
		display:'flex',
		flexDirection:'row'
	},
	complete_text:{
		fontSize:11,
		color:'#c3c3c3',
		display:'flex',
		flexDirection:'row',
		justifyContent:'flex-end',
		marginRight:15
	},
	btn_doTask:{
		width:68,
		height:23,
		border:'solid 1px #f37633',
		lineHeight:'23px',
		textAlign:'center',
		fontSize:Fnt_Normal,
		color:'#f37633',
		borderRadius:100,
	},
	signUp_alert:{
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/newbieTask/sign_box@2x.png')+')',
		backgroundRepeat:'no-repeat',
		backgroundSize:'cover',
		width:344,
		height:369,
		position:'absolute',
		zIndex:10,
		left:(devWidth-344)/2,
		top:30,
	},
	close:{
		backgroundImage:'url('+Dm.getUrl_img('/img/v2/newbieTask/close@2x.png')+')',
		backgroundRepeat:'no-repeat',
		backgroundSize:'cover',
		width:30,
		height:30,
		position:'absolute',
		zIndex:15,
		right:23,
		bottom:250,
	}
}

export default taskList;
