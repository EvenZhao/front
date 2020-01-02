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

class PgExamResult extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			exam: [],
			displayNum: 0,		//切换试题索引
			catalogTitle: '',	//章节标题
			correctCount: 0,	//答对题数
			outOfHeitht: false,	//试题是否超过可视区域
			allTestDispaly: 'none',
			isLoading: true,
		};
		this.devHeight = window.innerHeight

		this.refDom = []

		this.exam_alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

		this.exam_index = 0
	}

  	_popToOnlineDetail() {
    	localStorage.setItem("CatalogIdx", this.props.location.state.catalogIdx)
    	this.props.history.go(-1)
  	}

	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-章节测试-答案解析');

		//获取试题解析
		Dispatcher.dispatch({
			actionType: 'GetExamsResult',
			resource_id: this.props.match.params.id,
			catalog_id: this.props.match.params.catalogId,
			uuid: this.props.location.state.uuid
		})
		this._getExamResult = EventCenter.on('GetExamsResultDone', this._handleGetExamResult.bind(this))
		this._outOfHeight = EventCenter.on('GetOutOfHeight', this.outOfHeight.bind(this))

	}
	
	componentWillUnmount() {
		this._getExamResult.remove()
		this._outOfHeight.remove()
	}
	
	_handleGetExamResult(re) {
		console.log('pgExamResult--',re)
		if(re) {
			var exam = re.result.list
			var correctCount = re.result.correctCount
		
			this.setState({
				exam: exam,//所有试题集合
				correctCount: correctCount,
				isMulti: '',//1：多选
				trueAnswer: [],
				correct: false,
				examInfos: [],
				displayNum: 0,//切换试题索引
				alertTitle:'',//弹窗标题
				submitExamTest:false,//是否查看解析
				isShow:false,//提示框
				testCount:0,//测试题总数
				testpaperListHieght:0,
				isAnalysis:false,
				footerHeight:50,//底部高度
				catalogTitle: exam[0].catalogTitle,//章节标题
				isLoading:false,
			}, () => {
				EventCenter.emit('GetOutOfHeight')
			})
		}

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

	nextList(e){//下一道试题
		var count = e
		if (count == this.state.exam.length) {
		  return
		}
		count = count - 1
		this.setState({
		  	displayNum: count + 1
		}, () => {
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
		}, () => {
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
				// console.log("向上");
				this.setState({
					outOfHeitht: false
				})
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
			displayNum: index,
			allTestDispaly: 'none'
		},()=>{
			this.setState({
				testpaperListHieght:this.devHeight-212,
				footerHeight:'auto',
			})
			EventCenter.emit('GetOutOfHeight')
		})
	}

	//隐藏弹框
	_hideBlackGround() {
		this.setState({
			isShow: false,
			allTestDispaly: 'none',
		})
		
	}

	render(){
		var examInfos = this.state.exam.map((item,index) => {
			var trueIdx = []	//正确答案
			var myIdx = []		//您的答案
			var mostInIdx = []	//大部分做错
	  
			for(var r=0; r<item.contents.length; r++){
				var content = item.contents[r]
			  	if(content.isAnswer) {
					trueIdx.push(r)
				}
				if(content.accountSelect) {
					myIdx.push(r)
				}
				if(content.mostIncorrect) {
					mostInIdx.push(r)
				}
			}
			var trueAnswer = trueIdx.map((trueIdx, idxExam) => {
				return(
					<div key={idxExam} style={{display: 'inline-block', color: '#2196f3'}}>
				  		{this.exam_alphabet[trueIdx]}
					</div>
			  	)
			})
			
			var myAnswer = myIdx.map((myItem, myAnswerIdx) => {
				var color
				if(item.isCorrect) {
					color = '#2196f3'
				} else {
					color = '#f69898'
				}
				return(
					<div key={myAnswerIdx} style={{display: 'inline-block', color: color}}>
				  		{this.exam_alphabet[myItem]}
					</div>
			  	)
			})
			
			var mostIncorrectAnswer = mostInIdx.map((mostItem, mostIdx) => {
				return this.exam_alphabet[mostItem]
			})
			
			//当前第在第几页
			var count = index+1;
			var isMulti = false;//单选
			if(trueAnswer.length >1){
				isMulti = true;
			}
			var chose
			var marginLeft
			//遍历每一道题的选项
			var options = item.contents.map((question, idx) => {
				var correctIco = ''
			  	if(myIdx.length > 0) {
					if(trueIdx.indexOf(idx) > -1) {
				  		chose = true
						  marginLeft = 9
						  correctIco = <img src={Dm.getUrl_img('/img/v2/icons/testRight@2x.png')} width={9} height={7}/>
					} else {
				  		chose = false
				  		marginLeft = 33
					}
			  	}
	  	  
			  	return(
					<div key={idx}>
						<div style={{fontSize:14, display: chose ? 'inline-block' : 'block', borderRadius: 30, padding: chose ? '4px 15px' : 0, marginTop: 20}}>
							{correctIco}<span style={{marginRight: 6, marginLeft: marginLeft, color: chose ? '#2196f3' : '#666'}}>{this.exam_alphabet[idx]}</span><span style={{color: chose ? '#2196f3' : '#666'}}>{question.content}</span>
						</div>
					</div>
			  	)
			})
	  
			// return(
			//   <div key={index} style={{fontSize: 15, wordBreak: 'break-all'}}>
			// 	<div style={{margin: '20px 14px 0px 14px', color: '#333'}}>{index+1}.{item.examTitle}<span style={{marginLeft: 10, color: '#666'}}>({item.isMulti == 1 ? '单选题' : '多选题'}, 共{exam.examInfos.length}题)</span></div>
			// 	  {options}
			// 	<hr style={{border: 'none', height: 1, backgroundColor: '#e5e5e5', marginTop: 22}}></hr>
			// 	<div style={{margin: '20px 20px 10px 20px'}}>正确答案是{trueAnswer}, 您的选择是{myAnswer}</div>
			// 	<div style={{margin: '0px 20px 20px 20px'}}>本题正确率为<span style={{color: '#2196f3'}}>{item.correctPer}%</span><span style={{display: haveAnswer ? 'inline-block' : 'none'}}>, 大部分选错的会员选择了<span style={{color: '#f70300'}}>{item.mostIncorrectAnswer}</span></span>。</div>
			// 	<div style={{height: 12, border: '1px solid #f3f3f3', borderLeft: 'none', borderRight: 'none', backgroundColor: '#f4f4f4', display: hrDis}}></div>
			// 		  </div>
			// )
			return(
				<div key={index} style={{paddingTop:20, height:this.devHeight-121,overflowY:'auto', display: index == this.state.displayNum ? 'block':'none'}}>
					<div ref={(ref)=>{this.refDom[index]=ref}}>
						<div style={{padding: '0 12px 50px'}}>
							<div className='clearfix' style={{fontSize:14,color:'#000'}}>
								<div style={{...styles.title_bg, marginRight:10}}><span style={{color:'#f37633'}}>{index+1}/</span>{this.state.exam.length}</div>
								<div style={{overflow:'hidden'}}>
									<span style={{color:'#000'}}>{item.title}</span><span style={{marginLeft: 10, color: '#666'}}>({isMulti ? '多选题' : '单选题'})</span>
								</div>
							</div>
							<div style={{paddingLeft:28}}>
								{options}
							</div>
						</div>
						<div style={{height: 12, border: '1px solid #f3f3f3', borderLeft: 'none', borderRight: 'none', backgroundColor: '#f4f4f4'}}></div>
						
						<div style={{backgroundColor:'#fff',padding:'0 12px 10px',fontSize:14}}>
							<div style={{marginTop:10, color:'#000'}}>
								<img src={Dm.getUrl_img('/img/v2/icons/analysis@2x.png')} height="14" width="13" />
								<span style={{display:'inline-block',marginLeft:6}}>答案解析</span>
							</div>
							<div style={{margin: '10px 0'}}>正确答案是 {trueAnswer}, 您的答案是 {myAnswer}</div>
							<div style={{margin: '0px 0 16px'}}>本题正确率为 <span style={{color: '#2196f3'}}>{item.percentage}%</span><span style={{display: mostInIdx.length>0 ? 'inline' : 'none'}}>, 大部分做错的会员选择了 <span style={{color: '#f69898'}}>{mostIncorrectAnswer}</span></span>。</div>
							<div style={{fontSize: 12}}>具体请参考课程《{item.onlineTitle}》中章节《{item.catalogTitle}》相关内容。</div>
							<div style={{fontSize:12,marginTop:5}}>{item.analysis}</div>
						</div>
					</div>
				</div>
			)
		})

		var qaNumber = this.state.exam.map((item,index)=>{
			return(
				<div key={index} onClick={this._handleQaNumberClick.bind(this, index)} style={{...styles.qaNumber, color:index==this.state.displayNum?'#fff':item.isCorrect?'#2196f3':'#f69898', borderColor:item.isCorrect?'#2196F3':'#f69898', backgroundColor:index==this.state.displayNum?(item.isCorrect?'#2196F3':'#f69898'):'#fff'}}>
					{index+1}
					{
						item.isCorrect ? 
							index==this.state.displayNum ?
								<img src={Dm.getUrl_img('/img/v2/icons/white-testRight@2x.png')} width={9} height={7} style={{position:'absolute',right:8,top:10}}/>
							:
								<img src={Dm.getUrl_img('/img/v2/icons/testRight@2x.png')} width={9} height={7} style={{position:'absolute',right:8,top:10}}/>
						:
							index==this.state.displayNum ?
								<img src={Dm.getUrl_img('/img/v2/icons/white-testWrong@2x.png')} width={7} height={7} style={{position:'absolute',right:8,top:11}}/>
							:
								<img src={Dm.getUrl_img('/img/v2/icons/testWrong@2x.png')} width={7} height={7} style={{position:'absolute',right:8,top:11}}/>
					}
				</div>
			)
		})

		return (
			<div style={{...styles.container,height:this.devHeight}}
				onTouchEnd={this.onTouchEnd.bind(this)}
				onTouchStart={this.onTouchStart.bind(this)}>
				<FullLoading isShow={this.state.isLoading}/>
			  	<div style={styles.title}>章节标题：{this.state.catalogTitle}</div>
				<div style={{color: '#333', position: 'relative'}}>
					{examInfos}
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
							  答对<span style={{fontSize:14,color:'#2196f3'}}>{this.state.correctCount || 0}</span>题/共<span style={{fontSize:14,color:'#2196f3'}}>{this.state.exam.length}</span>题
							  </span>
						  </div>
					  </div>
  
					  <div onClick={this._popToOnlineDetail.bind(this)} style={{width:p_width*(145/375),height:50,float:'left',backgroundColor: '#64baff',textAlign:'center',lineHeight:3}}>
							<span style={{fontSize:16,color:'#ffffff'}}>继续学习</span>
						</div>
				  </div>
				  {/* 题号 */}
				  <div style={{...styles.allTestPaper,display:this.state.allTestDispaly}}>
					  <div style={{width:p_width-34,marginLeft:17,paddingTop:15,lineHeight:'18px'}}>
					  <span style={{fontSize:11,color:'#666666'}}>
						  点击题号可切换答题。
					  </span>
					  </div>
						  {qaNumber}
				  </div>
			  </div>
			  {/* 蒙层 */}
			  <div style={{...styles.zzc,height:this.devHeight,display:(this.state.isShow || this.state.allTestDispaly=="block") ?'block':'none',zIndex: this.state.isShow ? '998' : '9'}} onClick={this._hideBlackGround.bind(this)}></div>
		  </div>
		  
		)
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
		width:40,
		height:30,
		lineHeight:'30px',
		border:'solid 1px #e1e1e1',
		borderRadius:2,
		fontSize:12,
		color:'#333',
		margin:'15px 0 0 20px',
		paddingLeft: 10,
		textAlign:'left',
		position: 'relative'
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

export default PgExamResult;
