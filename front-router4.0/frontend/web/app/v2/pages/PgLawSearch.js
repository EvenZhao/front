import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import PgBottomMeun from '../components/PgBottomMeun';
import Dm from '../util/DmURL'
import FactoryTxt from '../FactoryTxt';
import FullLoading from '../components/FullLoading';
import Loading from '../components/Loading';

var limit = 15;
var skip = 0
class PgLawSearch extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      searchResultList: [],
      law_count: 0,
      splitWords: '',
      searchKeyWord: '',
			loadmore: true,
			isLoading: true,
			isShow: false,
			isOver: false
		};

	}
  _handleSearchLawlDone(re){
    console.log('_handleSearchLawlDone',re);
    var result = re.result
		localStorage.setItem("splitWords", result.splitWords);
		if(result && result.law) {
			this.setState({
				searchResultList: result.law,
				law_count: result.law_count,
				splitWords: result.splitWords,
				loadmore: result.law.length >= limit ? true : false,
				isLoading: false
			})
		} else {
			this.setState({
				isLoading: false
			})
		}
  }
	_handleSearchLawlMoreDone(re){
		var result = re.result || {}
		this.setState({
			searchResultList: this.state.searchResultList.concat(result.law),
			// law_count: result.law_count,
			// splitWords: result.splitWords,
			loadmore: result.law.length >= limit ? true : false,
			isShow: false
		})
	}
  _onChangeSearchKeyword(e){
    e.preventDefault();
    var v = e.target.value.trim();
    this.setState({
      searchKeyWord: v,
    })
  }
  _onSearch(re){
    if (this.state.searchKeyWord) {
			localStorage.setItem("lawSearchKeWord", this.state.searchKeyWord);
			this.lessonList.focus()
			this.setState({
				isLoading: true
			}, () => {
				Dispatcher.dispatch({
					actionType: 'SearchLaw',
					keyWord: this.state.searchKeyWord,
					skip: 0,
					limit: limit,
				})
			})
    }
  }
	_gotoLoadMore(re){
		skip= this.state.searchResultList.length //获取当前数组的长度
		Dispatcher.dispatch({
			actionType: 'SearchLaw',
			keyWord: this.state.searchKeyWord,
			skip: skip,
			limit: limit,
			loadmore: true
		})
	}
	_loadMore() {
		if( (this.lessonList.scrollHeight - this.lessonList.scrollTop - 220) <  document.documentElement.clientHeight) {
			if(this.state.searchResultList.length == 0) {
				return
			}
			if(this.state.loadmore == true) {
				this.setState({
					isShow: true,
					isOver: false
				}, () => {
					this._gotoLoadMore()
				})
			} else {
				this.setState({
					isShow: false,
					isOver: true
				})
			}
		}
	}
  componentWillMount() {
    var lawSearchKeWord =	localStorage.getItem("lawSearchKeWord")
    if (lawSearchKeWord) {
      this.setState({
        searchKeyWord: lawSearchKeWord
      })
      Dispatcher.dispatch({
        actionType: 'SearchLaw',
        keyWord: lawSearchKeWord,
        skip: 0,
        limit: limit,
      })
    }
  }
	_goLawDetail(re){
		this.props.history.push({pathname: `${__rootDir}/PgLawDetail/${re}`})
	}
	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-法规库')
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
    this._getSearchLawlDone = EventCenter.on('SearchLawlDone',this._handleSearchLawlDone.bind(this))
		this._getSearchLawlMoreDone = EventCenter.on('SearchLawlMoreDone',this._handleSearchLawlMoreDone.bind(this))
	}
	componentWillUnmount() {
    this._getSearchLawlDone.remove()
		this._getSearchLawlMoreDone.remove()
	}

	render(){
    var searchResultList = this.state.searchResultList.map((item,index)=>{
			var created_date = new Date(item.created_date).format("yyyy-MM-dd")
			var title;
			if (this.state.splitWords) {
				title = FactoryTxt.highLight(this.state.splitWords, item.title);
			}
      return(
				<div key={index} onClick={this._goLawDetail.bind(this,item._id)}>
	        <div style={{...styles.lawLastestListDiv}}>
	          <div style={{...styles.lawLastestListTitle}}>
	            <span style={{fontSize:15,color:'#333333'}}>{title}</span>
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
      <div style={{width: window.screen.width,height:window.innerHeight, display: 'flex', flexDirection: 'column'}}>
        <div style={{...styles.div}} onTouchEnd={this._loadMore.bind(this)} ref={(lessonList) => this.lessonList = lessonList}>
					<FullLoading isShow={this.state.isLoading}/>
          <div style={{...styles.searchDiv}}>
            <div style={{...styles.searchInputDiv}}>
              <img style={{...styles.searchImage}} src={Dm.getUrl_img('/img/v2/icons/search@2x.png')} width="19" height="19"/>
              <input style={{...styles.input}}  value={this.state.searchKeyWord} onChange={this._onChangeSearchKeyword.bind(this)} placeholder="请输入内容或文号"/>
            </div>
            <div style={{...styles.searchTextDiv}} onClick={this._onSearch.bind(this)}>
              <span style={{fontSize:15,color:'#666666'}}>搜索</span>
            </div>
          </div>
          <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3',}}/>
          <div style={{width:window.screen.width,height:40,backgroundColor: '#f2f2f2'}}>
            <div style={{position: 'relative',top:10}}>
              <span style={{fontSize:16,color:'#333333',marginLeft:12,}}>
                共找到<span style={{color:'#2196f3'}}>{this.state.law_count}</span>个相关内容
              </span>
            </div>
          </div>
          <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3',margin:'0px 12px'}}/>
          {searchResultList}
					{
						this.state.loadmore ?
						<Loading isShow={this.state.isShow}/>
						:
						<div style={{height: 40, textAlign: 'center'}}>共{this.state.law_count}条</div>
					}
        </div>
				<div style={{height: 'auto', width: window.screen.width}}>
	        <PgBottomMeun  type={'law'}/>
				</div>
      </div>
    )
  }
}

var styles = {
  div:{
    width: window.screen.width,
		flex: 1,
    backgroundColor:'#ffffff',
		height:window.innerHeight-50,
		overflowY:'auto',
		overflowX: 'hidden',
  },
  searchDiv:{
    width: window.screen.width-24,
    height: 65,
    marginLeft: 12
  },
  searchInputDiv:{
    width: window.screen.width*0.81,
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
    width: window.screen.width * 0.6,
    marginLeft: 12,
    marginTop: 10,
    position: 'absolute'
  },
  lawLastestListDiv:{
    width: window.screen.width-24,
    height: 107,
    marginLeft: 12,
		paddingTop:12
  },
  lawLastestListTitle:{
    width:window.screen.width-24,
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

export default PgLawSearch;
