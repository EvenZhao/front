import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import PgBottomMeun from '../components/PgBottomMeun';
import Dm from '../util/DmURL'
import FullLoading from '../components/FullLoading';
import LoadFailure from '../components/LoadFailure'
import Common from '../Common'

class PgLawLastest extends React.Component {
	constructor(props) {
    super(props);
		this.backNotload={
			labels:'',
			list:[]
		}
		this.wx_config_share_home = {
				title: '法规库-铂略咨询',
				desc: '财税人必备的政策法规速查手册',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
		this.state = {
      lawLastestList:[],
			searchKeyWord: '',
			isLoading: false,
			req_err: false,//用来判断是否请求超时加载失败
		};

	}
  _handleLawLastestDone(re){
    console.log('_handleLawLastestDone',re);
    var result = re.result || []

    this.setState({
      lawLastestList: result,
			isLoading: false
    })
  }

//请求超时处理
_handleLawLastestTimeout(){
	this.setState({
		req_err:true,
	})
}

	_onChangeSearchKeyword(e){
		e.preventDefault();
		var v = e.target.value.trim();
		this.setState({
			searchKeyWord: v,
		})
	}
  componentWillMount() {
		localStorage.setItem("lawSearchKeWord", '');
		localStorage.setItem("splitWords", '');

  }
	_onSearch(re){
		if (this.state.searchKeyWord) {
			localStorage.setItem("lawSearchKeWord", this.state.searchKeyWord);
			this.bigDiv.focus()
			this.props.history.push({pathname: `${__rootDir}/PgLawSearch`})
		}
	}
	_goLawDetail(re){
		this.props.history.push({pathname: `${__rootDir}/PgLawDetail/${re}`})
	}
	componentDidMount() {
		if (backNotload && backNotloadIndex == 'PgLawDetail') {
			console.log('backNotload~~~~~',backNotload);
			this.setState({
	      lawLastestList: backNotload.list,
				isLoading: false
	    })
			setTimeout(()=>{
				console.log('this.bigDiv',this.bigDiv.scrollHeight);
				this.bigDiv.scrollTop= backNotloadTop;
			} , 50)
			backNotload = ''
			backNotloadIndex = ''
		}else {
			Dispatcher.dispatch({
			 actionType: 'LawLastest'
		 })
		}
		// isFirst = false
		// }
		// window.scrollTo(0,300)
		// window.scrollTo(0,document.body.scrollHeight);	// window.onload=function (){window.scroll(0, document.body.scrollHeight)}
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
    EventCenter.emit("SET_TITLE",'铂略财课-法规库')
    this._getLawLastestDone = EventCenter.on('LawLastestDone',this._handleLawLastestDone.bind(this))
		this._LawLastestTimeout = EventCenter.on('LawLastestTimeout',this._handleLawLastestTimeout.bind(this));
	}
	componentWillUnmount() {
    this._getLawLastestDone.remove()
		this._LawLastestTimeout.remove()
		this.backNotload={
			labels:'',
			list: this.state.lawLastestList || []
		}
		backNotload = this.backNotload
		backNotloadTop = this.bigDiv.scrollTop
	}

	render(){

    var lawLastestList = this.state.lawLastestList.map((item,index)=>{
			var created_date = new Date(item.created_date).format("yyyy-MM-dd")
      return(
				<div key={index} onClick={this._goLawDetail.bind(this,item._id)}>
	        <div style={{...styles.lawLastestListDiv}}>
	          <div style={{...styles.lawLastestListTitle}}>
	            <span style={{fontSize:15,color:'#333333'}}>{item.title}</span>
	          </div>
	          <div style={{width:window.screen.width-24,height:16}}>
							<div style={{width:(window.screen.width)/2-24,height:16,float:'left'}}>
								<span style={{fontSize:12,color:'#999999'}}>{item.ori_law_num}</span>
							</div>
							<div style={{width:(window.screen.width)/2-24,height:16,float:'right'}}>
								<span style={{fontSize:12,color:'#999999',float:'right'}}>{created_date}</span>
							</div>
	          </div>
	        </div>
					<hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3',margin:'0px 12px'}}/>
				</div>
      )
    })

    return(
			<div style={{width: devWidth,height:devHeight}}>
			{
				this.state.req_err ?
				<LoadFailure/>
				:
	      <div style={{width: devWidth,height:devHeight-50, display: 'flex', flexDirection: 'column'}}>
					<FullLoading isShow={this.state.isLoading}/>
	        <div style={{...styles.div}} ref={(bigDiv) => this.bigDiv = bigDiv}>
	          <div style={{...styles.searchDiv}}>
	            <div style={{...styles.searchInputDiv}}>
	              <img style={{...styles.searchImage}} src={Dm.getUrl_img('/img/v2/icons/search@2x.png')} width="19" height="19"/>
	              <input style={{...styles.input}} value={this.state.searchKeyWord} onChange={this._onChangeSearchKeyword.bind(this)} placeholder="请输入内容或文号"/>
	            </div>
	            <div style={{...styles.searchTextDiv}} onClick={this._onSearch.bind(this)}>
	              <span style={{fontSize:15,color:'#666666'}}>搜索</span>
	            </div>
	          </div>
	          <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3',}}/>
	          <div style={{width:window.screen.width-24,marginLeft:12,height:46}}>
	            <div style={{width:4,height:18,backgroundColor:'#2196f3',borderRadius:2,float:'left',marginRight:12,position: 'relative',top:14}}></div>
	            <div style={{position: 'relative',top:12}}>
	              <span style={{fontSize:16,color:'#333333'}}>新录法规</span>
	            </div>
	          </div>
	          <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3',margin:'0px 12px'}}/>
						{lawLastestList}
						<div style={{height: 40, textAlign: 'center',paddingTop:10,color:'#999',fontSize:13}}>当前已到最底部</div>
	        </div>
					<div style={{height: 'auto', width: devWidth,position:'fixed',zIndex:999,left:0,bottom:0}}>
		        <PgBottomMeun  type={'law'}/>
					</div>
	      </div>
			}
			</div>
    )
  }
}

var styles = {
  div:{
    width: devWidth,
		height:devHeight-60,
    backgroundColor:'#ffffff',
		flex: 1,
		overflowY:'auto',
		overflowX: 'hidden',
  },
  searchDiv:{
    width: devWidth-24,
    height: 65,
    marginLeft: 12
  },
  searchInputDiv:{
    width: devWidth*0.81,
    height: 35,
    backgroundColor:'#F5F5F5',
    borderRadius:82,
    position: 'relative',
    top: 12,
    float: 'left'
    // marginTop: 13
  },
  searchTextDiv:{
    position: 'relative',
    top: 18,
    float: 'right'
  },
  searchImage:{
    marginLeft:12,
    marginTop: 8
  },
  input:{
    backgroundColor: '#f5f5f5',
    border: 'none',
    width: devWidth * 0.6,
    marginLeft: 12,
    marginTop: 10,
    position: 'absolute'
  },
  lawLastestListDiv:{
    width: devWidth-24,
    height: 107,
    marginLeft: 12,
		paddingTop:12
  },
  lawLastestListTitle:{
    width:devWidth-24,
    height:76,
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    // WebkitLineClamp: 1,
  },
};

export default PgLawLastest;
