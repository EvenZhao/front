import Dispatcher from '../AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Loading from '../components/Loading';
import Common from '../Common';

class SearchResultQuestion extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
    }
  }

  _loadMore() {
    if(this.props.question_count <= 3) {
      return
    } else {
      EventCenter.emit('SearchLoadMore', 2)
    }
  }

  render() {

    let w_width = devWidth
    let w_height = devHeight
    var canLoadMore
    if(this.props.question_count == this.props.data.length) {
      canLoadMore = false
    } else {
      canLoadMore = true
    }
    var lesson_list = this.props.data.map((item, index) => {
      // item = item.ori
      var marginTop
      var hr
      marginTop = 20;

      var answer = item.answer ? item.answer : {}
      var user = item.answer ? item.answer.user : {}
      var callback_status = item.callback_status
      var status = {}
      var stauts_text = ''
      if (callback_status !== null) {//电话预约专家诊断问题类型 (0: 待回电 / 1: 已回电 / 2: 追问待回 / 3: 追问已回)
        switch (callback_status) {
         case 0:
           stauts_text = '待回电'
           status = {
             backgroundColor: '#fff6c8',
             color: '#ED9D18',
           }
         break;
         case 1:
           stauts_text = '已回电'
           status = {
             backgroundColor: '#d3eafd',
             color: '#33A2FB',
             // opacity: 0.2
           }
         break;
         case 2:
           stauts_text = '追问待回'
           status = {
             backgroundColor: '#fff6c8',
             color: '#ED9D18',
           }
         break;
         case 3:
           stauts_text = '追问已回'
           status = {
             backgroundColor: '#d3eafd',
             color: '#33A2FB',
             // opacity: 0.2,
           }
         break;
        }
      }
      var is_teacher = 0;//1:讲师 0:个人
      if(item.answer && item.answer.user && item.answer.user.is_teacher){
        is_teacher = item.answer.user.is_teacher;
      }


      return(
        <div key={index}>
				<Link to={`${__rootDir}/QaDetail/${item.id}`}>
          <div>
            <div dangerouslySetInnerHTML={{__html: item.title}} style={{...styles.title,...styles.LineClamp}}>

            </div>
            <div style={{marginTop:12, display: item.answer ? 'block' : 'none'}}>
              <div style={{float:'left',width:30,height:30,position:'relative',zIndex:1,}}>
                <img src={ item.answer && item.answer.user ? item.answer.user.photo : Dm.getUrl_img('/img/v2/icons/default_photo@2x.png')} width={30} height={30} style={{borderRadius:15,}}/>
                <img src={Dm.getUrl_img('/img/v2/icons/lec_small@2x.png')} width={11} height={11} style={{...styles.small_tag,display:is_teacher ==1 ? 'block':'none'}}/>
              </div>

              <div style={{marginLeft:8,marginTop:5,float:'left',marginBottom:5,}}>
                <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>{user.nick_name}</span>
                <span style={{color:Common.Gray,fontSize:Fnt_Normal,marginLeft:10,}}>{user.title}</span>
              </div>
            </div>
            {
              callback_status == null ?
              <div>
                {
                  item.answer ?
                    <div style={{...styles.LineClamp,fontSize:14,color:Common.Black,height:40,}} dangerouslySetInnerHTML={{__html:answer.content}}></div>
                  :
                    <p style={{color: '#999', fontSize: 14, marginTop: 10}}>还没有答案，快来做第一个回答者吧~</p>
                }
              </div>
              :
                <div style={{width:devWidth-24,height:40,position:'relative'}}>
                  <div style={{...status,position:'absolute',borderRadius:'2px',lineHeight:0.8,textAlign:'center',top:4,width:50,height:16}}>
                    <span style={{fontSize:11}}>{stauts_text}</span>
                  </div>
                  <div style={{}}>
                    <span style={{...styles.callback_status,marginLeft:54}}>本问题已被提问者设定为电话预约专家诊断问题，回答内容仅供提问者可见</span>
                  </div>
                </div>
            }

            <div style={{...styles.line,marginTop:12,}}></div>
          </div>
				</Link>
          <hr style={{height: 1, border: 'none', backgroundColor: '#f3f3f3', display: index+1 == this.props.data.length ? 'none' : 'block', margin: '0px 12px'}}/>
        </div>
      )
    });
    var More = <span>更多<img src={Dm.getUrl_img('/img/v2/icons/more_down@2x.png')} style={{width: 16, height: 8, marginLeft: 8}}/></span>
    return(
      <div style={{paddingLeft:12,paddingRight:12,backgroundColor:Common.Bg_White,width:devWidth-24,marginTop:10,}}>
        {lesson_list}
        {this.props.loadType ?
          <Loading isShow={this.props.isShow}/> :
          <div style={{fontSize: 14, color: '#333', textAlign: 'center', marginBottom: 10}} onClick={this._loadMore.bind(this)}>
          {canLoadMore ?
            More
            :
            <div>
            {this.props.question_count>3 ?
              '已经到底啦~'
              :
              null
            }
            </div>
          }
          </div>}
      </div>
    )
  }
}

var styles = {
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
  small_tag:{
    position:'absolute',
    zIndex:10,
    bottom:-1,
    right:2,
  },
  line:{
    width:devWidth-24,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4',
  },
  LineClamp:{
		textOverflow:'ellipsis',
		whiteSpace:'normal',
		overflow:'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
    width:devWidth-24,
	},
  title:{
    fontSize:Fnt_Medium,
    color:Common.Black,
    marginTop:15,
    fontWeight: 'bold',
    // height:40,
    lineHeight:'20px',
  },
  callback_status:{
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666666',
    letterSpacing: '-0.34px',
  }
}

export default SearchResultQuestion;
