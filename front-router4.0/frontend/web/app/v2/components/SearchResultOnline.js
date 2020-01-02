import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import ListFilterPanel from '../pages/ListFilterPanel'
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Loading from '../components/Loading';
import Star from '../components/star';
import Common from '../Common'

var remindIdArray = [];
class SearchResultOnline extends React.Component {
  constructor(props) {
    super(props);
    this.catalogNumData = [] //定义catalog的数组
		this.state = {
      catalogNum: 0,
      catalogNumData: [],
      cata_index:0,
    }
    this.order_id = 0;
    this.isRemind = [];
  }
  componentWillMount() {

  }
  componentDidMount() {
    // if (this.catalogNumData.length >0 ) {
    //   console.log('iiiii',0);
    //   this.setState({
    //     catalogNumData: this.catalogNumData || []
    //   })
    // }
    // this._getSearchDone = EventCenter.on('SearchDone',this._handleSearchDone.bind(this))
  }
  componentWillUnmount() {
    // this._getSearchDone.remove()
  }
  _changeCataLog(re,ra){
    this.catalogNumData[re] = ra
    this.setState({
      catalogNumData: this.catalogNumData
    })
  }

  _loadMore() {
    if(this.props.online_count <= 3) {
      return
    } else {
      // element.scrollTo(0,0)
      EventCenter.emit('SearchLoadMore', 1)
    }
  }
  _goDetail(id,re){
    var catalogIdx = 0;
    if(re){
      catalogIdx = re - 1
    }
    this.props.history.push({pathname: `${__rootDir}/lesson/online/${id}`, query: null, hash: null, state: { catalogIdx: catalogIdx}})
  }
  _remind(id,index){
      Dispatcher.dispatch({
        actionType: 'SetOnlineRemind',
        id:id,
      })
      EventCenter.emit('showRemindDone', index);
  }

  render() {
    remindIdArray =this.props.remindIdArray;

    if (this.state.catalogNumData.length < 1) { // 初始数组的长度
      for (var i = 0; i < this.props.data.length; i++) {
        this.catalogNumData[i] = 0
      }
    }
    var canLoadMore
    if(this.props.online_count == this.props.data.length) {
      canLoadMore = false
    } else {
      canLoadMore = true
    }
    var catalog
    var lesson_list = this.props.data.map((item, index) => {
      item = item.ori;
      catalog = item.catalog || []
      var checkNum; //记录选中的某个章节的下标
      let w_width = devWidth
      let w_height = devHeight
      var free;
      var padT;
      var padB;
      var test;
      var width;
      var height;
      var bottom_left
      if(item.isFree) {
        free = "inline-block"
      } else {
        free = "none"
      }

      let starOverScore = {
        right: 6,
        star: item.star,
        canChange: false,
        score: item.star,
        propScore: item.star, //外部传数 （固定分数）
  			scoreShow: false,
  			width: 11,
  			height: 11
      }

      if(index == 0) {
        padT = 15,
        padB = 15
      } else {
        padT = 0,
        padB = 15
      }
      if(item.exam_mark === 1) {
        test = 'inline-block'
      } else {
        test = 'none'
      }
      if(w_width != 375) {
        width = (w_width / 375)*127
        height = width / 1.58
      } else {
        width = 127
        height = 80
      }
      if(w_width < 375) {
        bottom_left = w_width - width - 18 - 66
      } else if(w_width == 375) {
        bottom_left = w_width - width - 27 - 66
      } else if(w_width > 375) {
        bottom_left = w_width - width - 27 - 78
      }
      var catalogNum = catalog.map((cata,idx)=>{
        var fontColor;
        var divColor;
        var marginLeft;
        if (idx == 0) {
          marginLeft = 0
        }else {
          marginLeft = 18
        }
        var cataindex= index

        if ((this.state.catalogNumData.length > 0 ? this.state.catalogNumData[index] : this.catalogNumData[index]) == idx) {
            checkNum = cata.order_id
            fontColor = '#ffffff';
            divColor = '#2196f3';
        }else {
            fontColor = '#333333';
            divColor = '#e6e6e6';
        }

        return (
          <div style={{...styles.catalogNum,backgroundColor:divColor,marginLeft:marginLeft}} onClick={this._changeCataLog.bind(this,index,idx)} key={idx}>
            <span style={{fontSize:13,color:fontColor}}>{cata.order_id}</span>
          </div>
        )
      })
      var catalogContext = catalog.map((ctext,indx)=>{
        var disCont;
        if ((this.state.catalogNumData.length > 0 ? this.state.catalogNumData[index] : this.catalogNumData[index]) == indx) {
            disCont ='block'
        }else {
            disCont ='none'
        }
        var contentCatalogNumDis
        if(catalog.length == 1) {
          contentCatalogNumDis = 'inline-block'
        } else {
          contentCatalogNumDis = 'none'
        }

        return(
          <div style={{display:disCont,marginTop:6}} key={indx}>
            <div style={{display: contentCatalogNumDis, float: 'left', marginTop: 4, marginRight: 8}}>
            {catalogNum}
            </div>
            <div style={{...styles.contentTitleDiv,height:20}}>
              <span style={{fontSize:13,color:'#999999'}}>{ctext.title}</span>
            </div>
            <div style={{...styles.contentDiv,marginTop:12}} onClick={this._goDetail.bind(this,item.id,checkNum)} >
              <span style={{fontSize:12,color:'#999999'}}>{ctext.content}</span>
            </div>
          </div>
        )
      })
      var display
      if(catalog.length == 1) {
        display = 'none'
      } else {
        display = 'block'
      }

      for(var i =0;i<remindIdArray.length;i++){
         if(item.id == remindIdArray[i]){
           this.isRemind[index] = true;//表示已经设置过提醒,this.isRemind[index] = false; 表示未设置过提醒
          }
       }

       var date ='';
       var date_text='';
       if(item.plan_release_date){
         date = new Date(item.plan_release_date).format('yyyy');
         var year = new Date().getFullYear();//年份
         if(date == year){
           date_text = (new Date(item.plan_release_date).getMonth()+1)+'月'
         }
         else {
           date_text = new Date(item.plan_release_date).format('yyyy年M月')
         }
       }

      return(
        <div key={index}>
        {item.status == 0 ?
          <div>
            <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height}} ref={(lesson) => this.lesson = lesson}>
                <img style={{...styles.lessonPng, width: width, height: height, marginRight: w_width < 350 ? 8 : 15, marginLeft: w_width < 350 ? 10 : 12}} src={item.brief_image} />
                <div>
                  <span style={{...styles.span, fontSize: w_width < 350 ? 12 : 14}}>{item.title}</span>
                </div>
                <div style={styles.comming_soon}>
                  <div style={styles.commint_text}>
                  {item.plan_release_date ?
                    <span>预计{date_text}上线</span>
                    :
                    <span>即将上线</span>
                  }
                  </div>
                  <div style={{...styles.comming_box}}>
                  { this.isRemind[index] ?
                    <div style={styles.online_remain}>
                      上线提醒
                      <div style={{...styles.on_remain}}></div>
                    </div>
                    :
                    <div style={styles.online_remain} onClick={this._remind.bind(this,item.id,index)}>
                      上线提醒
                    </div>
                  }
                  </div>
                </div>
            </div>
          </div>
          :
          <div  onClick={this._goDetail.bind(this,item.id,checkNum)}>
            <div style={{...styles.lessonDiv, paddingTop: padT, marginBottom: padB, height: height}} ref={(lesson) => this.lesson = lesson}>
                <img style={{...styles.lessonPng, width: width, height: height, marginRight: w_width < 350 ? 8 : 15, marginLeft: w_width < 350 ? 10 : 12}} src={item.brief_image} />
                <div>
                  {/*<span style={{...styles.isFree, display: free}}>免费</span>*/}
                  <span style={{...styles.span, fontSize: w_width < 350 ? 12 : 14}}>{item.title}</span>
                </div>
                <div>
                  <div style={{overflow:'hidden',height:20,lineHeight:'20px' }}>
                    <div style={{float:'left'}}><Star {...starOverScore}/></div>
                    <span style={{fontSize: 11,color: '#999',float:'left',marginTop:6}}>{item.star.toString().split('.').length > 1 ? item.star : item.star + '.0' }</span>
                  </div>
                  <div style={{position: 'absolute', display: 'inline-block', bottom: 0, left: bottom_left, height: 16}}>
                    <img src={item.isFree ? Dm.getUrl_img('/img/v2/icons/isFree@2x.png') : Dm.getUrl_img('/img/v2/icons/isNotFree@2x.png')} style={{...styles.isFreePng, marginRight: item.has_exam ? 7 : 50}} />
                    <img src={Dm.getUrl_img('/img/v2/icons/new_test@2x.png')} style={{float: 'left', width: 15, height: 14, marginRight: 26, display: item.has_exam ? 'block' : 'none'}}/>
                    <div style={{...styles.line}}>|</div>
                    <img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} style={{...styles.learnNum}} />
                    <span style={{fontSize: 11, color: '#999', position: 'relative', top: -7, marginLeft: 6}}>{item.learn_num}</span>
                  </div>
                </div>
            </div>
          </div>
          }
          <div style={{...styles.catalogDiv,display: catalog.length > 0 ? 'block' :'none'}}>
            <div style={{width:devWidth-24,height:18, display: display}}>
              {catalogNum}
            </div>
            <div>
              {catalogContext}
            </div>
          </div>
          <hr style={{height: 1, border: 'none', backgroundColor: '#f3f3f3', margin: '15px 12px', display: index+1 == this.props.data.length ? 'none' : 'block'}}/>

        </div>
      )
    });

    var More = <span>更多<img src={Dm.getUrl_img('/img/v2/icons/more_down@2x.png')} style={{width: 16, height: 8, marginLeft: 8}}/></span>

    return(
      <div>
        {lesson_list}
        {this.props.loadType ?
          <Loading isShow={this.props.isShow}/>
          :
          <div style={{fontSize: 14, color: '#333', textAlign: 'center', marginBottom: 10, marginTop: 8}} onClick={this._loadMore.bind(this)}>
          {canLoadMore ?
            More
            :
            <div>
              {this.props.online_count > 3 ?
                '已经到底啦~'
                :
                null
              }
            </div>

          }
            </div>}

        <hr style={{height: 1, border: 'none', backgroundColor: '#e5e5e5'}}/>
      </div>
    )
  }
}

var styles = {
  span: {
		fontSize: 14,
		color: '#333',
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
		lineHeight: '20px'
	},
	list: {
		// height: 667,
		overflow: 'scroll',
	},
	lessonDiv: {
		height: 80,
	  backgroundColor: '#fff',
		paddingTop: 15,
		paddingRight: 12,
    position: 'relative'
	},
	lessonPng: {
		width: 127.5,
		height: 80,
		// border: '1px solid',
		marginLeft: 12,
		marginRight: 15,
		float: 'left',
	},
	isFree: {
		fontSize: 11,
		color: "#2196f3",
		border: '1px solid',
		borderColor: '#2196f3',
		borderRadius: '4px',
		float: 'left',
		marginRight: 9,
		paddingLeft: 5,
		paddingRight: 5,
	},
	timePng: {
		width: 15,
		height: 15,
		float: 'left',
		// border: '1px solid',
		marginRight: 7,
	},
	lessonTime: {
		fontSize: 12,
		color: '#666',
		float: 'left',
		lineHeight: '16px',
		marginRight: 14,
	},
	line: {
		float: 'left',
		lineHeight: '14px',
		color: '#e5e5e5',
		height: 22,
		width: 1
	},
	chapter: {
		fontSize: 12,
		color: '#666',
		float: 'left',
		lineHeight: '16px',
	  marginLeft: 14,
	},
	isTest: {
		fontSize: 11,
		color: '#666',
		lineHeight: '13px',
		padding: 1,
		borderRadius: 4,
		float: 'left',
		border: '1px solid #e5e5e5',
		marginLeft: 7,
	},
  catalogNum:{
    float:'left',
    // backgroundColor:'#e6e6e6',
    borderRadius:10,
    height:17,
    width:17,
    textAlign: 'center',
    lineHeight: 1,
  },
  contentTitleDiv:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
  },
  contentDiv:{
    backgroundColor:'#f2f8fa',
    height:49,
    // width:window.screen.width,
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    paddingLeft: 8,
    paddingRight: 8,
  },
  catalogDiv:{
    width:devWidth -24,
    // height:118,
    overflow:'scroll',
    backgroundColor:'#ffffff',
    marginLeft:12,
  },
  isFreePng: {
		width: 38,
		height: 14,
		float: 'left',
		marginRight: 7,
	},
  learnNum: {
    width: 10,
    height: 10,
    float: 'left',
    position: 'relative',
    top: 2,
    marginLeft: 24
  },
  comming_soon:{
    height:20,
    marginTop:12,
    display:'flex',
    flexDirection:'row',
    flex:1,
    alignItems:'center',
  },
  commint_text:{
    fontSize:13,
    color:Common.Activity_Text,
    display:'flex',
    flexDirection:'row',
    flex:1,
    alignItems:'center',
  },
  comming_box:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end',
    flex:1,
    fontSize:11,
    color:Common.Bg_White,
  },
  online_remain:{
    width:63,
    height:18,
    border:'solid 1px #f37633',
    textAlign:'center',
    lineHeight:'18px',
    position:'relative',
    fontSize:11,
    color:'#f37633',
    borderRadius:2,
  },
  on_remain:{
    width:12,
    height:12,
    position:'absolute',
    bottom:0,
    right:0,
    backgroundImage:'url('+Dm.getUrl_img('/img/v2/icons/icon_reminded@2x.png')+')',
    backgroundRepeat:'no-repeat',
    backgroundSize:'cover',
  }
}

export default SearchResultOnline;
