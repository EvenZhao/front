/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import Dm from '../util/DmURL';
import FullLoading from '../components/FullLoading';


var p_width = window.screen.width
var p_height = window.innerHeight
var startX
var startY

//返回角度
function GetSlideAngle(dx, dy) {
	return Math.atan2(dy, dx) * 180 / Math.PI;
}

//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
function GetSlideDirection(startX, startY, endX, endY) {
	var dy = startY - endY;
	var dx = endX - startX;
	var result = 0;

	//如果滑动距离太短
	if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
			return result;
	}

	var angle = GetSlideAngle(dx, dy);
	if(angle >= -45 && angle < 45) {
			result = 4;
	}else if (angle >= 45 && angle < 135) {
			result = 1;
	}else if (angle >= -135 && angle < -45) {
			result = 2;
	}
	else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
			result = 3;
	}

	return result;
}

class PgtestPaper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type: this.props.location.state.type,//1计划2任务
			exam: [],//所有试题集合
			isMulti: '',//1：多选
			examIds:[],//所有题目id
			selectId: [],//存储选中选项的id
			trueAnswer: [],
			correct: false,
			examInfos: [],
			displayNum: 0,//切换试题索引
			alertTitle:'',//弹窗标题
			submitExamTest:false,//是否查看解析
			isShow:false,//提示框
			testId:this.props.location.state.testId || '',
			testCount:0,//测试题总数
			testpaperListHieght:0,
			isAnalysis:this.props.location.state.isAnalysis ? true : false,//是否为答案解析
			answerNum:0,//答题数
			footerHeight:50,//底部高度
			answerList:[],//记录选择的题目
			isOk:false,//是否继续提交，
			title:'',//标题
			outOfHeitht: false, //试题是否超过可视区域
			allTestDispaly: 'none',
			isLoading: true,
			
		};
		this.devHeight = window.innerHeight

		this.refDom = []

    	this.exam_alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

		this.exam_index = 0

		this.sendExam = []

		this.numLength = 0

		this.user_answer = []
	}

	componentWillMount() {
		p_height = window.innerHeight
		if (this.state.isAnalysis) {
			Dispatcher.dispatch({//getUserAccountDone
				actionType: 'getExamResult',
				testId: this.state.testId,
			})
		}else {
			Dispatcher.dispatch({//getUserAccountDone
				actionType: 'getPlanExam',
				type: this.state.type,
				resourceId: this.props.location.state.id,
			})
		}
	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",this.state.type==1?'计划习题':'任务测试');

		this._getgetPlanExamDone = EventCenter.on('getPlanExamDone', this._handlegetPlanExamDone.bind(this))
		this._getsubmitExamTestDone = EventCenter.on('submitExamTestDone',this._handlesubmitExamTestDone.bind(this))

	
		//this._getExam = EventCenter.on('GetExamsDone', this._handleGetExam.bind(this))
		//this._postExam = EventCenter.on('PostExamResultDone', this._handlePostExam.bind(this));
		this._outOfHeight = EventCenter.on('GetOutOfHeight', this.outOfHeight.bind(this))

		// const {clientHeight} = this.refDom;
	}
	componentWillUnmount() {
		this._getgetPlanExamDone.remove()
		this._getsubmitExamTestDone.remove()

		this._outOfHeight.remove()
	}

	//获取计划测试题
	_handlegetPlanExamDone(re) {
		console.log('PgtestPaper--',re)

		var data = re.result.data || {}
		var exam = data.list || {}
		var examIds = []
		for (var i = 0; i < exam.length; i++) {
			examIds[i] = exam[i].id || ''
		}
		this.setState({
			exam: exam,
			examIds: examIds,
			title: this.state.type == 1 ? data.plan.name : data.task.name,
			isLoading:false,
		}, () => {
			// this.state.examContent.map((item, index) => {
			// 	if(item.answer == true) {
			// 		this.state.trueAnswer.push(item.contentId)
			// 	}
			// 	this.setState({
			// 		trueAnswer: this.state.trueAnswer
			// 	})
			// })
			EventCenter.emit('GetOutOfHeight')
		})
	}

	//做题，选中选项
	_selected(contentId,isMulti,index,item){
		console.log("isMulti:",isMulti)
		if(isMulti){//多选			
			let optionIds = this.state.selectId[index] ? this.state.selectId[index] : []
			if(optionIds.indexOf(contentId) > -1){
				optionIds.splice(optionIds.indexOf(contentId), 1)
			}
			else{
				optionIds.push(contentId)
			}
			this.state.selectId[index] = optionIds;
		}
		else{
			this.state.selectId[index] = [contentId];
		}
		
		//记录已经做过的题目
		if(this.state.answerList.indexOf(item)==-1){
			this.state.answerList.push(item)
		}else if(this.state.selectId[index].length == 0) {	//多选题清空选项
			this.state.answerList.splice(this.state.answerList.indexOf(item), 1)
		}
		
		this.setState({
			selectId:this.state.selectId,
			answerList:this.state.answerList,
			answerNum:this.state.answerList.length
		},()=>{
			console.log("selectId:",this.state.selectId)
			console.log("this.state.answerList:",this.state.answerList)
		})
	}

	nextList(e){//下一道试题
    	var count = e
    	if (count == this.state.exam.length) {
      		return
    	}
    	count = count - 1
    	this.setState({
      		displayNum: count + 1
    	}, ()=>{
			EventCenter.emit('GetOutOfHeight')
		})
	}
	//退回上一题
  	backList(e){
    	var count = e
    	if (count == 1) {
      		return
    	}
    	count = count - 1
    	this.setState({
      		displayNum: count - 1
    	}, ()=>{
			EventCenter.emit('GetOutOfHeight')
		})
	}

	onTouchStart(ev){
		startX = ev.touches[0].pageX;
		startY = ev.touches[0].pageY;
	}
	onTouchEnd(ev){
		var endX
		var endY
		endX = ev.changedTouches[0].pageX;
		endY = ev.changedTouches[0].pageY;
		 var direction = GetSlideDirection(startX, startY, endX, endY);
		 switch(direction) {
			case 0:
					// console.log("没滑动");
					break;
			case 1:
					this.setState({
						outOfHeitht: false
					})
					// console.log("向上");
					break;
			case 2:
					// console.log("向下");
					break;
			case 3:
					var count = this.state.displayNum + 1
					this.nextList(count)
					break;
			case 4:
					var count = this.state.displayNum + 1
					this.backList(count)
					break;
			default:
		}
	}

	//底部题号展开
	_showQaNumber(){
		if (this.state.allTestDispaly == 'block') {
			this.setState({
				allTestDispaly:'none',
			},()=>{
				this.setState({
					testpaperListHieght:this.devHeight-101,
					footerHeight:50,
				})
			})
		}else {
			this.setState({
				allTestDispaly:'block'
			},()=>{
				this.setState({
					testpaperListHieght:this.devHeight-212,
					footerHeight:'auto',
				})
			})
		}
	}

	//底部题号点击
	_handleQaNumberClick(index){
		this.setState({
			displayNum: index
		},()=>{
			this.setState({
				allTestDispaly:'none',
			},()=>{
				this.setState({
					testpaperListHieght:this.devHeight-101,
					footerHeight:50,
				})
			})
			EventCenter.emit('GetOutOfHeight')
		})
	}

	//是否超过可视区域，显示向上箭头
	outOfHeight(){
		var contentHeight = this.refDom[this.state.displayNum].clientHeight
		if(contentHeight + 20 > this.devHeight - 101) {
			this.setState({
				outOfHeitht: true
			})
		}else {
			this.setState({
				outOfHeitht: false
			})
		}
	}

	//提交试题后回调
	_handlesubmitExamTestDone(re) {
		if(re) {			
			console.log('_handlesubmitExamTestDone', re)
			var data = re.result.data || {}
			if (re.err !== null) {
				return
			}
			if (re.result.msg !== '') {
				return
			}
			if (!data) {
				return
			}
			var title = (
				<span>您本次得分：<span style={{fontSize:17,lineHeight:'50px',color:'#ff0000'}}>{data.totalScore}</span>分</span>
			)
			this.setState({
				isShow: true,
				submitExamTest:true,
				alertTitle:title,
				uuid: re.result
			})
		}
	}

	//“知道了” => 继续学习
	_popToOnlineDetail() {
		this.props.history.go(-1)
	}

	//隐藏弹框
	_hideBlackGround() {
		//正确率的弹框不允许点击蒙层隐藏
		if(!this.state.submitExamTest){
			this.setState({
				isShow: false,
				allTestDispaly: 'none',
			})
		}
		
	}

	//提交
	_submit(){
		if(this.state.answerList.length == this.state.exam.length){//题目已经做完
			this.setState({
				isOk:true,
				isShow:true,
				alertTitle:'确认提交试卷？'
			})
		}
		else{
			//给出提示
			// this.setState({
			// 	isShow: true,
			// 	alertTitle:'请完成所有答题后再进行提交',
			// })
			return
		}
	}

	//查看解析
	goToAnalysis(){
		this.props.history.replace({pathname: `${__rootDir}/PgtestPaperResult/${this.state.testId}`, query: null, hash: null, state: {type: this.state.type}})

	}

	//再次确认
	countersign(){
		this.setState({
			isShow:false
		},()=>{
			// var examInfos = this.state.exam.map((item, index) => {
			// 	var correct = false;
			// 	var true_answer = item.answers.sort().toString()
			// 	var select_answer = this.state.selectId[index].sort().toString()
			// 	if(true_answer == select_answer) {
			// 		correct = true
			// 	} else {
			// 		correct = false
			// 	}
			// 	return{
			// 		examId: item.examId,
			// 		answer: this.state.selectId[index],
			// 		correct: correct
			// 	}					
			// })
			// this.setState({
			// 	examInfos: examInfos
			// },()=>{
			// 	//题目已做完，提交，发送请求
			// 	Dispatcher.dispatch({
			// 		actionType: 'PostExamResult',
			// 		resource_id: this.props.match.params.id,
			// 		catalog_id: this.props.match.params.catalogId,
			// 		enterpriseTask: this.state.enterpriseTask,
			// 		examInfos: this.state.examInfos
			// 	})
				
			// })

			Dispatcher.dispatch({
				actionType: 'submitExamTest',
				id: this.state.testId,
				examIds: this.state.examIds,
				contentIds: this.state.selectId,
			})
		})
	}

	radomCommit(){
		var selectId=[], examId=[]
		this.state.exam.map((item, index) => {
			selectId.push([item.contents[0].id])		
		})
		//题目已做完，提交，发送请求
		Dispatcher.dispatch({
			actionType: 'submitExamTest',
			id: this.state.testId,
			examIds: this.state.examIds,
			contentIds: selectId,
		})
		
	}

	//取消弹框
	cancel(){
		this.setState({
			isShow:false
		})
	}
	
	render(){

    	var exam = this.state.exam.map((item, index) => {
			//当前第在第几页
			var count = index+1;
			var isMulti = item.type==1?false:true;//单选
			
			//遍历每一道题的选项
			var options = item.contents.map((option,idx)=>{
				var choose = false;
				var optionIds = this.state.selectId[index] ? this.state.selectId[index] : []
				if(isMulti){
					if(optionIds.indexOf(option.id) > -1 ){
						choose = true;
					}
				}
				else{
					if(optionIds == option.id ){
						choose = true;
					}
				}
				return(
					<div key={idx} onClick={this._selected.bind(this,option.id,isMulti,index,item)}>
						<div style={{lineHeight:'30px',display:'inline-block',padding:'0 15px 0 5px', fontSize:14,color: choose ?'#2196f3':'#666',marginTop:20,borderRadius:16,border:choose ? 'solid 1px #2196f3':'solid 1px transparent'}} 
							>
							{this.exam_alphabet[idx]}<span style={{marginLeft:6}}>{option.content}</span>
						</div>
					</div>
				)
			})

			return(
				<div key={index} style={{paddingTop:20, height:this.devHeight-121,overflowY:'auto', display: index == this.state.displayNum ? 'block':'none'}}>
					<div ref={(ref)=>{this.refDom[index]=ref}}>
						<div className='clearfix' style={{fontSize:14,color:'#000'}}>
							<div style={{...styles.title_bg, marginRight:10}}><span style={{color:'#f37633'}}>{index+1}/</span>{this.state.exam.length}</div>
							<div style={{overflow:'hidden'}}>
							<span style={{color:'#000'}}>{item.title}</span><span style={{marginLeft: 10, color: '#666'}}>({isMulti ? '多选题' : '单选题'})</span>
							</div>
						</div>
						<div style={{paddingLeft: 55, paddingBottom: 16}}>
							{options}
						</div>
					</div>
					<div style={{position:'absolute',top: (this.devHeight-101-10)/2,left:10}} onClick={this.backList.bind(this,count)}>
						<img src={count == 1 ? Dm.getUrl_img('/img/v2/icons/upNoTextPaper@2x.png') : Dm.getUrl_img('/img/v2/icons/upTextPaper@2x.png')} height="21" width="12" />
					</div>
					<div style={{position:'absolute',top: (this.devHeight-101-10)/2,right:10}} onClick={this.nextList.bind(this,count)}>
						<img src={count == this.state.exam.length ? Dm.getUrl_img('/img/v2/icons/downNoTextPaper@2x.png') : Dm.getUrl_img('/img/v2/icons/downTextPaper@2x.png')} height="21" width="12" />
					</div>
				</div>
			)
		})

		var qaNumber = this.state.exam.map((item,index)=>{
			return(
					<div key={index} onClick={this._handleQaNumberClick.bind(this, index)} style={{...styles.qaNumber, color:index==this.state.displayNum?'#fff':(this.state.selectId[index]&&this.state.selectId[index].length>0)?'#2196F3':'#333', borderColor:index==this.state.displayNum||(this.state.selectId[index]&&this.state.selectId[index].length>0)?'#2196F3':'#E1E1E1', backgroundColor:index==this.state.displayNum?'#2196F3':'#fff'}}>{index+1}</div>
			)
		})

		return (
  		<div style={{...styles.container, height: this.devHeight}}
				onTouchEnd={this.onTouchEnd.bind(this)}
				onTouchStart={this.onTouchStart.bind(this)}>
			<FullLoading isShow={this.state.isLoading}/>
			<div style={styles.title}>学习{this.state.type == 1 ? '计划' : '任务'}：{this.state.title}</div>
				<div style={{padding: '0 12px', color: '#333', position: 'relative'}}>
					{exam}
					{this.state.outOfHeitht ? 
						<div style={{height: 30, textAlign: 'center', position: 'absolute', bottom: 0, left: 0, width: p_width}}><img src={Dm.getUrl_img('/img/v2/icons/testUp@2x.gif')} height="30" width="15" /></div>
					:
						''
					}
				</div>
				<div style={{...styles.footer,height:this.state.footerHeight}}>
					<div style={{...styles.bottomDiv}}>
						<div style={{width:p_width*(230/375),height:50,float:'left',backgroundColor:'#f4f4f4'}}>
							<div style={{...styles.allTest}} onClick={this._showQaNumber.bind(this)}>
								<img src={Dm.getUrl_img('/img/v2/icons/allTest@2x.png')} width={16} height={16}/>
							</div>
							<div style={{...styles.total}}>
								<span style={{fontSize:14,color:'#333333'}}>
									{this.state.isAnalysis ? '答对':'已做'}<span style={{fontSize:14,color:'#2196f3'}}>{this.state.answerNum || 0}</span>题/共<span style={{fontSize:14,color:'#2196f3'}}>{this.state.exam.length}</span>题
								</span>
							</div>
						</div>
				
						{this.state.isAnalysis ?
							<div style={{width:p_width*(145/375),height:50,float:'left',lineHeight:3,backgroundColor:'#F4F4F4'}}>
								<span style={{fontSize:14,color:'#333333'}}>本次得分：
									<span style={{fontSize:14,color:"red"}}>{this.state.totalScore || 0}</span>分
								</span>
							</div>
							:
							<div onClick={this._submit.bind(this)} style={{width:p_width*(145/375),height:50,float:'left',backgroundColor: (this.state.answerNum!=0 && this.state.answerNum==this.state.exam.length)?'#64baff':'#d1d1d1',textAlign:'center',lineHeight:3}}>
								<span style={{fontSize:16,color:'#ffffff'}}>提交</span>
							</div>
						}
					</div>
			{/* 题号 */}
			<div style={{...styles.allTestPaper,display:this.state.allTestDispaly}}>
				<div style={{width:p_width-34,marginLeft:17,paddingTop:15,lineHeight:'18px'}}>
					<span style={{fontSize:11,color:'#666666'}}>
						点击题号可切换答题，<span style={{color:"#000000"}}>灰色</span>边框为未答题，<span style={{color:"#2196f3"}}>蓝色</span>边框的为已答题。
					</span>
				</div>
				{qaNumber}
			</div>
			</div>

			{/* 蒙层 */}
			<div style={{...styles.zzc,height:this.devHeight,display:(this.state.isShow || this.state.allTestDispaly=="block") ?'block':'none',zIndex: this.state.isShow ? '998' : '9'}} onClick={this._hideBlackGround.bind(this)}></div>

			<div style={{...styles.alert,display:this.state.isShow ?'block':'none'}}>
					<div style={{...styles.alertFirstDiv}}>
						<div style={{width:242,marginLeft:14,height:50,marginTop:18,position:'absolute',textAlign:'center'}}>
							<span style={{fontSize:17,color:'#030303',}}>
								{this.state.alertTitle}
							</span>
						</div>
					</div>
					
					<div>
						{
							this.state.submitExamTest ?
							<div>
								<div style={{...styles.alertSecond,width:134}} onClick={this.goToAnalysis.bind(this)}>
									<span style={{fontSize:17,color:'#ff0000'}}>查看解析</span>
								</div>
								<div style={{...styles.alertSecond,border:'none'}} onClick={this._popToOnlineDetail.bind(this)}>
									<span style={{fontSize:17,color:'#0076ff'}}>知道了</span>
								</div>
							</div>
							:
							<div>{
							this.state.isOk ?
							<div>
								<div style={{...styles.alertSecond,width:134}} onClick={this.cancel.bind(this)}>
									<span style={{fontSize:17,color:'#666666'}}>再检查一下</span>
								</div>
								<div style={{...styles.alertSecond,border:'none'}} onClick={this.countersign.bind(this)}>
									<span style={{fontSize:17,color:'#0076ff'}}>确定提交</span>
								</div>
							</div>
							:
							<div style={{textAlign:'center',width:270,marginTop:12}} onClick={this.cancel.bind(this)}>
								<span style={{color:'#2196F3',fontSize:17}}>知道了</span>
							</div>
						}
							</div>
						}

					</div>
				</div>


		  </div>
		);
	}
}

var styles = {
	container:{
    	backgroundColor:'#ffffff',
    	// height: p_height,
		width: p_width,
		position:'relative'
	},
	footer:{
		width:p_width,
		position:'fixed',
		left:0,
		bottom:0,
		backgroundColor:'#fff',
		zIndex: 10,
	},
	qaNumber:{
		display:'inline-block',
		width:50,
		height:30,
		lineHeight:'30px',
		border:'solid 1px #e1e1e1',
		borderRadius:2,
		fontSize:12,
		color:'#333',
		margin:'15px 0 0 20px',
		textAlign:'center'
	},
	title_bg:{
		backgroundColor:'#f3f3f3',
		height:20,
		minWidth:42,
		textAlign:'center',
		lineHeight:'20px',
		borderRadius:8,
		padding:'0 4px',
		float:'left'
	},
  top:{
    height:51,
    width:p_width,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4'
  },
  testpaper:{
    // height: height-210,
    width: p_width,
		overflowY:'scroll',
		overflowX:'hidden'
  },
  bottomDiv:{
    width: p_width,
    height: 50,
		// backgroundColor:'#ffffff'
  },
  testpaperList:{
    // height: height-210,
    width: p_width,
    paddingTop:25,
		// backgroundColor:'#F4F4F4'
  },
  num:{
    height:18,
    width:50,
    backgroundColor:'#f3f3f3',
    float:'left',
    marginRight:10,
    borderRadius:'8px',
    textAlign:'center'
  },
  allTest:{
    width:(p_width*(230/375))*(56/(p_width*(230/375))),
    height:50,
    borderRight:'1px solid',
    borderColor:'#E5E5E5',
    textAlign:'center',
    lineHeight:3,
    float:'left'
  },
  total:{
    width:p_width*(230/375)-(p_width*(230/375))*(56/(p_width*(230/375)))-1,
    height:50,
    float:'left',
    textAlign:'center',
    lineHeight:3
  },
	checkAnswer:{
		borderRadius:'10px',
		marginLeft:54,
		marginBottom:30,
		width:p_width-70,
	},
alert:{
    width:270,
    // height:131,
    backgroundColor:'#ffffff',
    borderRadius:'12px',
    position:'absolute',
    top: 211,
    zIndex:999,
    left: (devWidth-270)/2
  },
alertFirstDiv:{
    width:270,
    height:84,
    borderBottomWidth:0.5,
    borderBottomColor:'#D4D4D4',
    borderBottomStyle:'solid',
    // padding:'20px 14px 0px 14px'
  },
  alertFirstDiv2:{
    width:270,
    height:106,
    borderBottomWidth:0.5,
    borderBottomColor:'#D4D4D4',
    borderBottomStyle:'solid',
    // padding:'20px 14px 0px 14px'
  },
  alertSecond:{
    width:135,
    height:45,
    textAlign:'center',
    borderRightWidth:1,
    borderRightColor:'#D4D4D4',
    borderRightStyle:'solid',
    float:'left',
    lineHeight:3
  },
  zzc:{
    width: p_width,
    // height: p_height,
    backgroundColor:'#000',
		position:'absolute',
		left:0,
		top:0,
    opacity: 0.3,
    zIndex: 998,
  },
	allTestPaper:{
		maxHeight: 412,
		width: p_width,
		overflowX:'hidden',
		overflowY:'scroll',
		paddingBottom:20
	},
	onlyTestNum:{
		height:18,
		float:'left',
		width: (p_width-130)/5,
		textAlign:'center',
		marginBottom: 15,
		lineHeight: 1,
		borderRadius:'2px'
	},
	answerDetail:{
		width:p_width,
		height: 180,
		// backgroundColor:'#ffffff'
	},
	answerDiv:{
		width: p_width-32,
		marginLeft: 16,
	},
	button: {
		padding: "12px 60px",
		borderRadius: 40,
		fontSize: 15,
		color: '#fff',
		width: 45,
		margin: '0 auto',
		textAlign: 'center'
	},
	title:{
		fontSize:14,
		color:'#333',
		padding:'15px 12px 15px 12px',
		borderBottom:'solid 1px #f4f4f4'
	}
}

export default PgtestPaper;
