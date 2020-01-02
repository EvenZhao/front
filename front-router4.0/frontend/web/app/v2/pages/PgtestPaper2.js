/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import Dm from '../util/DmURL';
import FullLoading from '../components/FullLoading';

var countdown;
var width = window.screen.width
var height = window.innerHeight
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
      testpaperList:[],
      displayNum: 0,//切换试题索引
			answerList:[],
			answerNum: 0,//已做题的数量
			isShow: false,
			alertTitle:'',
			twoChoose: true,
			examIds:[],
			testId:this.props.location.state.testId || '',
			isAnswer: false,
			testpaperListHieght:height - 101,//101
			allTestDispaly:'none',
			isAnalysis: this.props.location.state.isAnalysis ? true : false,//是否为答案解析
			analysis:[],
			totalScore: 0,
			plan:{},
			isLoading: true
		};
	}
	_handlegetPlanExamDone(re){
		console.log('_handlegetPlanExamDone',re);
    var data = re.result.data || {}
    this.setState({
      	testpaperList: data.list || [],
		plan: data.plan
    },()=>{
			var testpaperList = this.state.testpaperList || []
			var answerList = []
			var examIds = []
			for (var i = 0; i < testpaperList.length; i++) {
				answerList[i] = []
				examIds[i] = testpaperList[i].id || ''
			}
			this.setState({
				answerList: answerList,
				examIds: examIds,
				testId: data.testId,
				isLoading:false
			})
		})
	}
	_handlesubmitExamTestDone(re){
		console.log('_handlesubmitExamTestDone',re);
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
			<span>您本次得分：<span style={{fontSize:17,color:'#ff0000'}}>{data.totalScore}</span></span>
		)
		this.setState({
			submitExamTest: true,
			alertTitle: title,
			isShow: true
		})
		//getTestResult
		// Dispatcher.dispatch({//getUserAccountDone
		// 	actionType: 'getTestResult',
		// 	testId: this.state.testId,
		// })
	}
	componentWillMount() {
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

		//getExamResult
	}
	_handlegetTestResultDone(re){
		console.log('_handlegetTestResultDone',re);
	}
	_handlegetExamResultDone(re){
		console.log('_handlegetExamResultDone',re);
		var data = re.result.data || {}
		var test = data.test || {}
		if (!data) {
			return
		}
		this.setState({
			testpaperList: data.list,
			isAnalysis: true,
			totalScore: test ? test.totalScore : 0
		},()=>{
			var testpaperList = this.state.testpaperList || []
			var analysis = []
			var answerNum = 0
			for (var i = 0; i < testpaperList.length; i++) {
				analysis[i] = testpaperList[i].correct
				if (testpaperList[i].correct) {
					answerNum = answerNum + 1
				}
			}
			this.setState({
				analysis: analysis,
				answerNum: answerNum
			})
		})

	}
	goToAnalysis(){
		Dispatcher.dispatch({//getUserAccountDone
			actionType: 'getExamResult',
			testId: this.state.testId,
		},()=>{
			this.setState({
				isShow: false,
				allTestDispaly: 'none'
			})
		})
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-课后测试')
		this._getgetPlanExamDone = EventCenter.on('getPlanExamDone', this._handlegetPlanExamDone.bind(this))
		this._getsubmitExamTestDone = EventCenter.on('submitExamTestDone',this._handlesubmitExamTestDone.bind(this))
		this._GetgetTestResultDone = EventCenter.on('getTestResultDone',this._handlegetTestResultDone.bind(this))
		this._getgetExamResultDone = EventCenter.on('getExamResultDone',this._handlegetExamResultDone.bind(this))
	}
	componentWillUnmount() {
		this._getgetPlanExamDone.remove()
		this._getsubmitExamTestDone.remove()
		this._GetgetTestResultDone.remove()
		this._getgetExamResultDone.remove()
	}
  nextList(e){//下一道试题
    var count = e
    if (count == 10) {
      return
    }
    count = count - 1
    this.setState({
      displayNum: count + 1
    })
  }
  backList(e){//回退
    var count = e
    if (count == 1) {
      return
    }
    count = count - 1
    this.setState({
      displayNum: count - 1
    })
  }
	gotoTestPaper(e){
		this.setState({
			displayNum: e
		})
	}
	onClickAnswer(type,index,id){//index,第几道题的选择，idx为答案的ID
		var answerList = this.state.answerList || []
		if (type == 1) {//单选
			if (answerList[index][0] !== id) { //判断如果选择的ID与之前的不一样则换掉最新的
				answerList[index] = [id]
			}else {//如果一样 就为空
				answerList[index] = []
			}
		}else if (type == 2) {//多选
			// console.log('9999999999999999',type+'----'+index+'--==='+id);
			var same = false
			if (answerList[index].length < 1) { //如果数组长度小于1 则说明 当前没有选择，直接赋值就好
				answerList[index] = [id]
			}else {
				for (var i = 0; i < answerList[index].length; i++) {//先循环遍历，如果有一样的就直接删掉
					if (answerList[index][i] == id) {
						answerList[index].splice(i,1)
						// return
						same = true
					}
				}
				if (!same) {//如果上面循环过程中有一样的，则不往下走
					for (var i = 0; i < answerList[index].length; i++) {
						if (answerList[index][i] !== id) {
							answerList[index].push(id)
						}
					}
				}
			}
		}
		this.setState({
			answerList: answerList,

		},()=>{
			var answerNum = 0
			var answerLists = this.state.answerList || []

			for (var i = 0; i < answerLists.length; i++) {
				if (answerLists[i].length > 0) {
					answerNum = answerNum + 1
				}
			}
			this.setState({
				answerNum: answerNum
			})
		})
	}
	onTouchStart(ev){
		// var touch = event.targetTouches[0];
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
					// alert("没滑动");
					break;
			case 1:
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
	render(){
		//testWrong 错 //testRight
    //upTextPaper 上可点 //upNoTextPaper 上不可点 //downTextPaper 下可点 //downNoTextPaper
    var testpaperList = this.state.testpaperList.map((item,index)=>{
      var type = item.type || 1
      var length = this.state.testpaperList.length
      var count = index + 1
      var contents = item.contents || []
			var answerList = this.state.answerList[index] || []
			var isAnswer = [] //正确答案
			var accountSelect = [] //我的选择
			var mostIncorrect = [] //大部分人选择
			var percentage = this.state.isAnalysis ? item.percentage : 0 //百分比
			var onlineTitle =  this.state.isAnalysis ? item.onlineTitle : ''//解析视频的标题
			var catalogTitle =  this.state.isAnalysis ? item.catalogTitle : ''// 解析视频课的章节标题
			var analysis = this.state.isAnalysis ? item.analysis : '' //解析内容
      var contentsList = contents.map((ite,idx)=>{
				var border = false
				var img
				var imgWidth
				var imgHeight
				if (item.type == 1 ) {
					if (answerList[0] == ite.id) {
						border = true
					}
				}else {
					for (var i = 0; i < answerList.length; i++) {
						if (answerList[i] == ite.id) {
							border = true
						}
					}
				}
        var abc
        if (idx == 0) {abc = 'A'}
        if (idx == 1) {abc = 'B'}
        if (idx == 2) {abc = 'C'}
        if (idx == 3) {abc = 'D'}
        if (idx == 4) {abc = 'E'}
				if (idx == 5) {abc = 'F'}
				if (idx == 6) {abc = 'G'}
				if (this.state.isAnalysis) {//判断一下当前是否为答案解析
					if (ite.isAnswer) {
						isAnswer.push(abc)
						img = '/img/v2/icons/testRight@2x.png'
						imgWidth = 9
						imgHeight = 7
					}else {
						img = '/img/v2/icons/testWrong@2x.png'
						imgWidth = 6
						imgHeight = 6
					}
					if (ite.accountSelect) {
						accountSelect.push(abc)
					}
					if (ite.mostIncorrect) {
						mostIncorrect.push(abc)
					}
				}
        return(
          <div key={idx} onClick={this.state.isAnalysis ? '' : this.onClickAnswer.bind(this,item.type,index,ite.id)} style={{...styles.checkAnswer,border: border ? '1px solid #2196f3' : '',}}>
						{
							this.state.isAnalysis && ite.isAnswer ?
								<img style={{marginRight:5}} src={Dm.getUrl_img(img)} width={imgWidth} height={imgHeight}/>
								:	<span style={{marginRight:imgWidth*2}}> </span>
						}
            <span style={{fontSize:14,color:'#666666',marginLeft:4}}>{abc}</span>
            <span style={{fontSize:14,color:'#666666'}}> {ite.content}</span>
          </div>
        )
      })
      return(
        <div style={{...styles.testpaperList,height:this.state.testpaperListHieght,display: index == this.state.displayNum ? 'block':'none'}} key={index}>
					<div style={{width:width,marginBottom:12,backgroundColor:'#ffffff'}}>
	          <div style={{width:width-20,marginLeft:10}}>
	            <div style={{...styles.num,lineHeight:1}}>
	              <span style={{fontSize:12,color:'#f37633'}}>{count}/</span>
	              <span style={{fontSize:12,color:'#151515'}}>{length}</span>
	            </div>
	            <div style={{float:'left',width:width - 80,marginBottom:20}}>
	              <span style={{fontSize:14,color:'#000000'}}>{item.title}</span>
	              <span style={{fontSize:14,color:'#666666'}}>({type == 1 ? '单选题':'多选题'})</span>
	            </div>
	         </div>

	          <div style={{clear:'both',overflow:'hidden'}}></div>
	          <div>
	            {contentsList}
						</div>
	            <div style={{position:'absolute',top: (height-21)/2,left:10}} onClick={this.backList.bind(this,count)}>
	              <img src={count == 1 ? Dm.getUrl_img('/img/v2/icons/upNoTextPaper@2x.png') : Dm.getUrl_img('/img/v2/icons/upTextPaper@2x.png')} height="21" width="12" />
	            </div>
	            <div style={{position:'absolute',top: (height-21)/2,right:10}} onClick={this.nextList.bind(this,count)}>
	              <img src={count == length ? Dm.getUrl_img('/img/v2/icons/downNoTextPaper@2x.png') : Dm.getUrl_img('/img/v2/icons/downTextPaper@2x.png')} height="21" width="12" />
	            </div>
						</div>
						<div style={{width:width,height:12,backgroundColor:'#F4F4F4',display: this.state.isAnalysis ? 'block':'none'}}></div>
						<div style={{...styles.answerDetail,display: this.state.isAnalysis ? 'block':'none'}}>
							<div style={{...styles.answerDiv,marginTop:25}}>
								<img style={{marginRight:5}} src={Dm.getUrl_img('/img/v2/icons/analysis@2x.png')} width={14} height={14}/>
								<span style={{fontSize:14,color:'#000000'}}>答案解析</span>
							</div>
							<div style={{...styles.answerDiv}}>
								<span style={{fontSize:14,color:'#333333'}}>正确答案是</span>
								<span style={{fontSize:14,color:'#2196f3'}}>{isAnswer}</span>
								<span style={{fontSize:14,color:'#333333'}}>，您的答案是</span>
								<span style={{fontSize:14,color:'#f37633'}}>{accountSelect}</span>
							</div>
							<div style={{...styles.answerDiv}}>
								<span style={{fontSize:14,color:'#333333'}}>本题正确率为</span>
								<span style={{fontSize:14,color:'#2196f3'}}>{percentage}%</span>
								<span style={{fontSize:14,color:'#333333'}}>，大部分做题的会员选择了</span>
								<span style={{fontSize:14,color:'#f37633'}}>{mostIncorrect}</span>
							</div>
							<div style={{...styles.answerDiv}}>
								<span style={{fontSize:12,color:'#333333'}}>具体请参考课程《{onlineTitle}》中章节《{catalogTitle}》相关内容</span>
							</div>
							<div style={{...styles.answerDiv}}>
								<span style={{fontSize:12,color:'#333333'}}>{analysis}</span>
							</div>
						</div>
        </div>
      )
		})
		
		var answerLists = this.state.answerList || []
		return (
			<div style={{...styles.container}}
				onTouchEnd={this.onTouchEnd.bind(this)}
				onTouchStart={this.onTouchStart.bind(this)}
			>
				<FullLoading isShow={this.state.isLoading}/>
        <div style={{...styles.top}}>
          <span style={{fontSize:14,color:'#333333',marginLeft:12,position:'relative',top:16}}>{this.state.plan.name || ''}</span>
        </div>
        <div style={{...styles.testpaper,height:this.state.testpaperListHieght}}>
            {testpaperList}
        </div>
        <div style={{...styles.bottomDiv}}>
          <div style={{width:width*(230/375),height:50,float:'left',backgroundColor:'#f4f4f4'}}>
            <div style={{...styles.allTest}} onClick={this.allDisplay.bind(this)}>
              <img src={Dm.getUrl_img('/img/v2/icons/allTest@2x.png')} width={16} height={16}/>
            </div>
            <div style={{...styles.total}}>
              <span style={{fontSize:14,color:'#333333'}}>
                {this.state.isAnalysis ? '答对':'已做'}<span style={{fontSize:14,color:'#2196f3'}}>{this.state.answerNum || 0}</span>题/共<span style={{fontSize:14,color:'#2196f3'}}>{this.state.testpaperList.length}</span>题
              </span>
            </div>
          </div>
					{this.state.isAnalysis ?
						<div style={{width:width*(145/375),height:50,float:'left',lineHeight:3,backgroundColor:'#F4F4F4'}}>
							<span style={{fontSize:14,color:'#333333'}}>本次得分：
								<span style={{fontSize:14,color:"red"}}>{this.state.totalScore || 0}</span>分
							</span>
						</div>
						:
						<div onClick={this.button.bind(this)} style={{width:width*(145/375),height:50,float:'left',backgroundColor:'#64baff',textAlign:'center',lineHeight:3}}>
							<span style={{fontSize:16,color:'#ffffff'}}>提交</span>
						</div>
					}

        </div>
        <div style={{...styles.allTestPaper,display:this.state.allTestDispaly}}>
          <div style={{width:width-34,marginLeft:17,marginBottom:6}}>
            <span style={{fontSize:11,color:'#666666'}}>
							点击题号可切换答题，<span style={{color:"#000000"}}>灰色</span>底色为未答题目，<span style={{color:"#2196f3"}}>蓝色</span>底色的为已答题目。
						</span>
          </div>
					<div style={{width:width-40,marginLeft:20}}>
						{

							this.state.testpaperList.map((item,index)=>{
								var count = index +1
								var marginLeft = 20
								var border = '1px solid #E1E1E1' //默认的边框颜色
								var font_color = '#333333' //默认的字体颜色
								var img = '/img/v2/icons/testWrong@2x.png'
								var imgWidth = 6
								var	imgHeight = 6
								if (answerLists.length > 1 && !this.state.isAnalysis) { //判断当前数组的存在
									if (answerLists[index].length > 0) {//判断一下当前试题是否已做
										border = '1px solid #2196f3'
										font_color = '#2196f3'
									}
									if (this.state.displayNum ==  index) {//判断一下当前的试题是否是选中的
										border = '1px solid #f37633'
										font_color = '#f37633'
									}
								}
								if (index == 0 || index == 5) {
									marginLeft = 0
								}
								if (this.state.analysis[index] && this.state.isAnalysis) {
										img = '/img/v2/icons/testRight@2x.png'
										imgWidth = 9
										imgHeight = 7
										border = '1px solid #2196f3'
										font_color = '#2196f3'
								}else if (!this.state.analysis[index] && this.state.isAnalysis) {
									border = '1px solid #f37633'
									font_color = '#f37633'
								}
								return(
									<div onClick={this.gotoTestPaper.bind(this,index)} style={{...styles.onlyTestNum,marginLeft:marginLeft,border:border}} key={index}>
										<span style={{fontSize:12,color:font_color}}>{count}</span>
										{
											this.state.isAnalysis ?
												<img style={{marginLeft:16}} src={Dm.getUrl_img(img)} width={imgWidth} height={imgHeight}/>
											:''
										}
									</div>
								)
							})
						}
					</div>
        </div>
				<div style={{...styles.zzc,display:this.state.isShow ?'block':'none'}}></div>
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
								<div style={{...styles.alertSecond,border:'none'}} onClick={this.cancel.bind(this)}>
									<span style={{fontSize:17,color:'#2196f3'}}>知道了</span>
								</div>
							</div>
							:
							<div>{
							this.state.twoChoose ?
							<div>
								<div style={{...styles.alertSecond,width:134}} onClick={this.cancel.bind(this)}>
									<span style={{fontSize:17,color:'#666666'}}>再检查一下</span>
								</div>
								<div style={{...styles.alertSecond,border:'none'}} onClick={this.countersign.bind(this)}>
									<span style={{fontSize:17,color:'#2196f3'}}>确定提交</span>
								</div>
							</div>
							:
							<div style={{textAlign:'center',width:270,marginTop:12}} onClick={this.iKonw.bind(this)}>
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
	cancel(){
		this.setState({
			isShow: false,
			submitExamTest: false
		})
	}
	countersign(){//submitExamTest
		this.setState({
			isShow:false
		},()=>{
			Dispatcher.dispatch({
				actionType: 'submitExamTest',
				id: this.state.testId,
				examIds: this.state.examIds,
				contentIds: this.state.answerList,
			})
		})
	}
	button(){
		if (this.state.answerNum == this.state.testpaperList.length) {//判断试题有没有做完
			this.setState({
				isShow: true,
				alertTitle:'确认提交试卷？',
				twoChoose: true
			})
		}else {
			this.setState({
				isShow: true,
				alertTitle:'请完成所有答题后再进行提交',
				twoChoose: false
			})
		}
	}
	iKonw(){
		this.setState({
			isShow: false,
			twoChoose: true
		})
	}
	allDisplay(){
		if (this.state.allTestDispaly == 'block') {
			this.setState({
				allTestDispaly:'none',
			},()=>{
				this.setState({
					testpaperListHieght:height-101
				})
			})
		}else {
			this.setState({
				allTestDispaly:'block'
			},()=>{
				this.setState({
					testpaperListHieght:height-212
				})
			})
		}
	}
}
var styles = {
  container:{
    backgroundColor:'#ffffff',
    height: height,
    width: width,
  },
  top:{
    height:51,
    width:width,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4'
  },
  testpaper:{
    // height: height-210,
    width: width,
		overflowY:'scroll',
		overflowX:'hidden'
  },
  bottomDiv:{
    width: width,
    height: 50,
		// backgroundColor:'#ffffff'
  },
  testpaperList:{
    // height: height-210,
    width: width,
    paddingTop:25,
		// backgroundColor:'#F4F4F4'
  },
  num:{
		height:18,
		padding:'5px 0',
    width:50,
    backgroundColor:'#f3f3f3',
    float:'left',
    marginRight:10,
    borderRadius:'8px',
    textAlign:'center'
  },
  allTest:{
    width:(width*(230/375))*(56/(width*(230/375))),
    height:50,
    borderRight:'1px solid',
    borderColor:'#E5E5E5',
    textAlign:'center',
    lineHeight:3,
    float:'left'
  },
  total:{
    width:width*(230/375)-(width*(230/375))*(56/(width*(230/375)))-1,
    height:50,
    float:'left',
    textAlign:'center',
    lineHeight:3
  },
	checkAnswer:{
		borderRadius:'10px',
		marginLeft:54,
		marginBottom:30,
		width:width-70,
	},
	alert:{
    width:270,
    height:131,
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
    width: devWidth,
    height: devHeight,
    backgroundColor:'#cccccc',
    position:'absolute',
    opacity: 0.5,
    zIndex: 998,
    top:0,
  },
	allTestPaper:{
		height: 110,
		width: width,
		overflowX:'hidden',
		overflowY:'scroll',
	},
	onlyTestNum:{
		height:20,
		padding:'5px 0',
		float:'left',
		width: (width-130)/5,
		textAlign:'center',
		marginBottom: 15,
		lineHeight: 1,
		borderRadius:'2px'
	},
	answerDetail:{
		width:width,
		height: 180,
		// backgroundColor:'#ffffff'
	},
	answerDiv:{
		width: width-32,
		marginLeft: 16,
	}
};
export default PgtestPaper;
