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
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import LiveLessonDiv from '../components/LiveLessonDiv';
import OfflineLessonDiv from '../components/OfflineLessonDiv';
import Dm from '../util/DmURL'

class PgMyQuestion extends React.Component {
	constructor(props) {
    super(props);
		this.wx_config_share_home = {
				title: '我的问答-铂略咨询',
				desc: '铂略咨询-财税领域实战培训供应商',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
    this.id = ''
    this.titleData = ['提问','回答','关注']
		this.state = {
      titleSelectNum: 0,
      onelist: [],
      twolist: [],
      thirdlist: [],
			type: 1
		};
	}

  _handleMyQADone(re){
    console.log('_handleMyQADone',re);
		var results = re.results || [];
		if (this.state.type == 1) {
			this.setState({
        onelist: results.length >0 ? results : [],
      })
		}else if (this.state.type == 2) {
			this.setState({
        twolist: results.length >0 ? results : [],
      })
		}else if (this.state.type == 3) {
			this.setState({
        thirdlist: results.length >0 ? results : [],
      })
		}
  }
  _onSelectedMeun(re){
    this.setState({
      titleSelectNum: re,
			type: re+1
    })
    Dispatcher.dispatch({
      actionType: 'MyQA',
      type: re+1
    })
  }
	removeHtmlTag(str) {
    if(str) {
      var str1 = str.replace(/<[^>]+>/g,"");
			var str2 = str1.replace(/&nbsp;/ig,'');
    }
    return str2;
	}
	componentWillMount() {
    Dispatcher.dispatch({
      actionType: 'MyQA',
      type: 1
    })
	}
	componentDidMount() {
		EventCenter.emit("SET_TITLE",'铂略财课-我的问答')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
    this._getMyQADone = EventCenter.on('MyQADone',this._handleMyQADone.bind(this));
	}
	componentWillUnmount() {
    this._getMyQADone.remove();
	}
	render(){
    var lessonDiv;
		var toLink;
		var nullText;
		var buttonText;
		if (this.state.titleSelectNum == 0) {
			toLink = `${__rootDir}/questionList`
			nullText = '您还没有提问过哦~'
			buttonText ='去提问'
		}else if (this.state.titleSelectNum == 1) {
			toLink = `${__rootDir}/questionList`
			nullText ='您还没有回答过任何问题哦~'
			buttonText ='去回答'
		}
		else if (this.state.titleSelectNum == 2) {
			toLink= `${__rootDir}/questionList`
			nullText = '您还没有关注过任何问答~'
			buttonText ='去关注'
		}
		var listNull = (
			<div style={{textAlign:'center',paddingTop:70}}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{marginTop:51}}>
					<span style={{fontSize:15,color:'#999999'}}>{nullText}</span>
				</div>
				<Link to={toLink}>
					<div style={{...styles.collecButton}}>
						<span style={{fontSize:16,color:'#666666'}}>{buttonText}</span>
					</div>
				</Link>
			</div>
		)
    var title = this.titleData.map((item,index)=>{
      return(
        <div style={this.state.titleSelectNum == index ? styles.meunTitleDivSelected : styles.meunTitleDiv} key={index} onClick={this._onSelectedMeun.bind(this,index)}>
          <span>{item}</span>
        </div>
      )
    })
		var onelist = this.state.onelist.map((item,index)=>{
			var q_last_timenew = new Date(item.last_time).format("yyyy-MM-dd")
			var title = this.removeHtmlTag(item.title)
			var marginTop
			var hr

			if(index+1 == this.state.onelist.length) {
				hr = 'none'
			} else {
				hr = 'block'
			}
			return(
				<div key={index}>
				<Link to={`${__rootDir}/QaDetail/${item.id}`}>
          <div style={{margin: '15px 12px', width: devWidth-24}}>
            <p style={{...styles.span}}>{title}</p>
            <div style={{...styles.div_bottom, display: 'inline-block'}}>{item.question_answer_num} 回答</div>
            <div style={{...styles.div_bottom, float: 'right', display: 'inline-block'}}>{q_last_timenew}</div>
          </div>
          <hr style={{...styles.hr, display: hr}}></hr>
				</Link>
        </div>
			)
		})
		var twolist = this.state.twolist.map((item,index)=>{
			var q_last_timenew = new Date(item.last_time).format("yyyy-MM-dd")
			var title = this.removeHtmlTag(item.title)
			var hr

			if(index+1 == this.state.twolist.length) {
				hr = 'none'
			} else {
				hr = 'block'
			}
			return(
				// <Link key={index} to={`${__rootDir}/questionDetail/${item.id}`}>
				// <div style={{...styles.oneDiv,height:130,}}>
				// 	<div style={{width:window.screen.width-24,height:20,marginTop:8}}>
				// 		<span style={{...styles.LineClamp,fontSize:15,color:'#333333',height:20,WebkitLineClamp:1}}>{item.title}</span>
				// 	</div>
				// 	<div style={{width:window.screen.width-24,height:65,marginTop:8}}>
				// 		<span style={{...styles.LineClamp,fontSize:14,color:'#999999',height:65,WebkitLineClamp:3}}>{item.a_content}</span>
				// 	</div>
				// 	<div style={{marginTop:8}}>
				// 		<div style={{float:'left'}}>
				// 			<span style={{fontSize:14,color:'#999999'}}>{item.answer_comment_num} 评论</span>
				// 		</div>
				// 		<div style={{float:'right'}}>
				// 			<span style={{fontSize:14,color:'#999999'}}>{q_last_timenew}</span>
				// 		</div>
				// 	</div>
				// </div>
				// </Link>
				<div key={index}>
						<div style={{margin: '20px 12px'}}>
						<Link to={`${__rootDir}/QaDetail/${item.id}`}>
						<div>
							<div style={{...styles.span}}>{title}</div>
							<div style={{...styles.answer_span}}>{item.a_content}</div>
						</div>
						</Link>
							<div style={{...styles.comment}}>{item.answer_comment_num} 评论</div>
							<div style={{...styles.bottom_label, float: 'right'}}>{new Date(item.last_time).format('yyyy-MM-dd')}</div>
						</div>
						<hr style={{...styles.tab_hr, marginBottom: 10, display: hr}}></hr>
				</div>
			)
		})
		var thirdlist = this.state.thirdlist.map((item,index)=>{
			var q_last_timenew = new Date(item.last_time).format("yyyy-MM-dd")
			var title = this.removeHtmlTag(item.title)
			var hr
			return(
				// <Link key={index} to={`${__rootDir}/questionDetail/${item.id}`}>
				// <div style={{...styles.oneDiv,height:95,}}>
				// 	<div style={{width:window.screen.width-24,height:40,marginTop:8}}>
				// 		<span style={{...styles.LineClamp,fontSize:15,color:'#333333',height:45,WebkitLineClamp:2}}>{item.title}</span>
				// 	</div>
				// 	<div style={{marginTop:12}}>
				// 		<div style={{float:'left'}}>
				// 			<span style={{fontSize:14,color:'#999999'}}>{item.question_answer_num} 回答</span>
				// 		</div>
				// 		<div style={{float:'right'}}>
				// 			<span style={{fontSize:14,color:'#999999'}}>{q_last_timenew}</span>
				// 		</div>
				// 	</div>
				// </div>
				// </Link>
				<div key={index}>
				<Link to={`${__rootDir}/QaDetail/${item.id}`}>
          <div style={{margin: '15px 12px', width: devWidth-24}}>
            <p style={{...styles.span}}>{title}</p>
            <div style={{...styles.div_bottom, display: 'inline-block'}}>{item.question_answer_num} 回答</div>
            <div style={{...styles.div_bottom, float: 'right', display: 'inline-block'}}>{q_last_timenew}</div>
          </div>
          <hr style={{...styles.hr, display: hr}}></hr>
				</Link>
        </div>
			)
		})
		if(this.state.titleSelectNum == 0) {
			if (this.state.onelist.length < 1) {
				lessonDiv = listNull
			}else {
				lessonDiv = onelist
			}
		} else if(this.state.titleSelectNum == 1) {
			if (this.state.twolist.length < 1) {
				lessonDiv = listNull
			}else {
				lessonDiv = twolist
			}
		} else if(this.state.titleSelectNum == 2) {
			if (this.state.thirdlist.length < 1) {
				lessonDiv = listNull
			}else {
				lessonDiv = thirdlist
			}
		}
		return (
			<div style={{...styles.div}}>
				<div style={{backgroundColor:'#ffffff',width:'100%',height:50}}>
          {title}
				</div>
        <div style={{...styles.lessonDiv,}}>
          {lessonDiv}
        </div>
			</div>
		);
	}
}

var styles = {
  div:{
    height: devHeight,
    width: devWidth,
    // backgroundColor:'#ffffff',
  },
	comment: {
		fontSize: 14,
    color: '#999',
    marginRight: 10,
    display: 'inline-block',
	},
  lessonDiv:{
    height: devHeight-50,
    width:'100%',
    backgroundColor:'#ffffff',
    overflow:'scroll'
  },
  meunTitleDiv:{
    width:devWidth/3,
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
    width:devWidth/3,
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
	span: {
		fontSize: 15,
		color: '#333',
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		lineHeight: '20px'
	},
	answer_span: {
		fontSize: 14,
		color: '#666',
		marginBottom: 8,
		textOverflow:'ellipsis',
		wordBreak: 'break-word',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 3,
		lineHeight: '22px'
	},
	div_bottom: {
		marginTop: 8,
		color: '#999',
		fontSize: 14,
	},
	hr: {
		height: 1,
		border: 'none',
		backgroundColor: '#f3f3f3',
		marginTop: 15,
		margin: '0px 12px'
	},
	bottom_label: {
		fontSize: 14,
    color: '#999',
	},
	tab_hr: {
    height: 1,
		border: 'none',
		backgroundColor: '#f3f3f3',
		margin: '0px 12px'
  },
};

export default PgMyQuestion;
