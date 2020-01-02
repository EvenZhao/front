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

class PgLawDetail extends React.Component {
	constructor(props) {
    super(props);
		this.wx_config_share_home = {
				title: '法规号-法规库-铂略咨询',
				desc: '财税人必备的政策法规速查手册',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
		this.state = {
      // lawLastestList:[],
      title: '',
      ori_law_num: '',
      created_date: '',
      content: [],
      id:'',
			searchKeyWord: '',
			isLoading: true
		};

	}
  _handlelawDetailDone(re){
    console.log('_handlelawDetailDone',re);
    var result = re.result || {}
		this.wx_config_share_home = {
				title: result.title || '',
				desc: result.content[0] || '',
				link: document.location.href + '',
				imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
				type: 'link'
		};
		EventCenter.emit("SET_TITLE",result.title)
    this.setState({
      // lawLastestList:
      title: result.title,
      ori_law_num: result.ori_law_num,
      created_date: result.created_date,
      content: result.content || [],
      id: result._id,
			isLoading: false
    },()=>{
			Dispatcher.dispatch({
				actionType: 'WX_JS_CONFIG',
				onMenuShareAppMessage: this.wx_config_share_home
			})
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
		var lawSearchKeWord =	localStorage.getItem("lawSearchKeWord")
		if (lawSearchKeWord) {
			this.setState({
				searchKeyWord: lawSearchKeWord
			})
		}
    Dispatcher.dispatch({
      actionType: 'LawDetail',
      id: this.props.match.params.id
    })
  }
	_onSearch(re){
		if (this.state.searchKeyWord) {
			localStorage.setItem("lawSearchKeWord", this.state.searchKeyWord);
			this.bigDiv.focus()
			this.props.history.push({pathname: `${__rootDir}/PgLawSearch`})
		}
	}
	componentDidMount() {
		isReload = 'PgLawDetail'
    EventCenter.emit("SET_TITLE",'铂略财课-法规库')
		backNotloadIndex = 'PgLawDetail'
    this._getlawDetailDone = EventCenter.on('LawDetailDone',this._handlelawDetailDone.bind(this))
	}
	componentWillUnmount() {
    this._getlawDetailDone.remove()

	}


	render(){
		var splitWords =	localStorage.getItem("splitWords")
		var lawSearchKeWord =	localStorage.getItem("lawSearchKeWord")
		var created_date = new Date(this.state.created_date).format("yyyy-MM-dd")
		var context
    var content = this.state.content.map((item,index)=>{
			context = item.replace(new RegExp('&nbsp;', 'g'),'')
			context = context.replace(new RegExp('&ldquo;', 'g'),'')
			context = context.replace(new RegExp('&rdquo;', 'g'),'')
			if (!lawSearchKeWord || !splitWords) {
				context = <span dangerouslySetInnerHTML={ { __html: context } } />
			}else {
				context = FactoryTxt.highLight(splitWords, context);
			}
      return(
        <div style={{width: window.screen.width-24,marginLeft:12,marginTop:12}} key={index}>
          <span style={{fontSize:14,color:'#333333'}}>{context}</span>
        </div>
      )
    })
    return(
      <div style={{width: window.screen.width,height:document.documentElement.clientHeight, display: 'flex', flexDirection: 'column'}}>
        <div style={{...styles.div}} ref={(bigDiv) => this.bigDiv = bigDiv}>
				<FullLoading isShow={this.state.isLoading}/>
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
          <div style={{...styles.lawLastestListDiv}}>
            <div style={{...styles.lawLastestListTitle}}>
              <span style={{fontSize:15,color:'#333333'}}>{this.state.title}</span>
            </div>
            <div style={{width:window.screen.width-24,height:16}}>
              <div style={{width:(window.screen.width)/2-24,height:16,float:'left'}}>
                <span style={{fontSize:12,color:'#999999'}}>{this.state.ori_law_num}</span>
              </div>
              <div style={{width:(window.screen.width)/2-24,height:16,float:'right'}}>
                <span style={{fontSize:12,color:'#999999',float:'right'}}>{created_date}</span>
              </div>
            </div>
          </div>
          <hr style={{border: 'none', height: 1, backgroundColor: '#f3f3f3',margin:'0px 12px'}}/>
          {content}
					<div style={{height: 10, border: '1px solid #e1e1e1', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', backgroundColor: '#f4f4f4', marginTop: 10}}></div>
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
    width: devWidth,
		flex: 1,
    backgroundColor:'#ffffff',
		overflowY:'scroll',
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
    width: window.screen.width-24,
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

export default PgLawDetail;
