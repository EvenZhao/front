import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import {dm} from '../util/DmURL';
import OnlineLessonDiv from '../components/OnlineLessonDiv';
import LiveLessonDiv from '../components/LiveLessonDiv';
import Common from '../Common';
//import funcs from '../util/funcs'

var skip = 0;
class ChoiceCourse extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      checkNum:0,
      loadMore:true,
      type:null,
      courseList:[],
      // onlineList:[],
      // liveList:[],
    }

    this.data = ['视频课','直播课'];
  }

  componentWillMount() {
   
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-选课');

    Dispatcher.dispatch({
			actionType: 'LessonList',
      type:2,//1.直播，2.视频
      limit:15,
      skip:0,
		})

    this.e_LessonList = EventCenter.on('LessonListDone',this._handleLessonList.bind(this))
    this.e_LessonListLoadMore = EventCenter.on('LessonListLoadMoreDone',this._handleLoadMore.bind(this))
  }

  componentWillUnmount() {
    this.e_LessonList.remove()
    this.e_LessonListLoadMore.remove()
  }

  _handleLessonList(re){
    console.log('==_handleLessonList==',re);
    if(re.err){

      return false;
    }
    this.setState({
      type:re.type || null,
    })
    if(re.result){
      this.setState({
        courseList:re.result || [],
        loadMore:re.result.length >= 15 ? true:false,
      })
      // if(re.type == 1){
      //   this.setState({
      //     liveList:re.result || [],
      //   })
      // }
      // else if (re.type == 2) {
      //   this.setState({
      //     onlineList:re.result || [],
      //   })
      // }
    }
  }

  _handleLoadMore(re){
    if(re.err){
      return;
    }
    this.setState({
      courseList:this.state.courseList.concat(re.result),
      loadMore:re.result.length >= 15 ? true:false,
    },()=>{
      skip = this.state.courseList.length;
    });
  }

  ChooseTab(index){
    this.setState({
      checkNum:index,
      courseList:[]
    })
    if(index == 0){//视频
      Dispatcher.dispatch({
  			actionType: 'LessonList',
        type:2,//1.直播，2.视频
        limit:15,
        skip:0,
  		})
    }
    else {
      Dispatcher.dispatch({
  			actionType: 'LessonList',
        type:1,//1.直播，2.视频
        limit:15,
        skip:0,
  		})
    }
  }

_labelScorll(){
  if((this.courseList.scrollHeight - this.courseList.scrollTop - 220) <  devHeight) {
     if (this.state.courseList.length < 15) {
       return
     }
     if(this.state.checkNum == 0){
       Dispatcher.dispatch({
         actionType: 'LessonList',
         type:2,//1.直播，2.视频
         limit:15,
         skip:skip,
         LoadMore:true,
       })
     }
     else {
       Dispatcher.dispatch({
         actionType: 'LessonList',
         type:1,//1.直播，2.视频
         limit:15,
         skip:skip,
         LoadMore:true,
       })
     }
    }
}


  render(){
    var toLink;
    if (this.state.checkNum == 0) {

      toLink = `${__rootDir}/list/online`;
    }else{

      toLink = `${__rootDir}/list/live`;
    }

    var listNull = (
      <div>
        <div style={{textAlign:'center',paddingTop:70}}>
          <img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
        </div>
        <div style={{marginTop:51,textAlign:'center'}}>
          <span style={{fontSize:15,color:'#999999'}}>暂无收藏哦，快去预约课程吧~</span>
        </div>
        <Link to={toLink}>
          <div style={{...styles.collecButton}}>
            <span style={{fontSize:16,color:'#666666'}}>去选课</span>
          </div>
        </Link>
      </div>
    )

    let onlineProps = {
      data: this.state.courseList || [],
    }
    let liveProps = {
      data: this.state.courseList || []
    }
    return(
     <div style={styles.container}
     ref={(courseList)=> this.courseList = courseList}
       onTouchEnd={() => {this._labelScorll(this.courseList)}}>
      <div style={styles.tab_box}>
        <div style={styles.tab_con}>
           {
             this.data.map((item,index)=>{
               var text_color = Common.Light_Black;
               var border_color = '#F4F4F4';
               var border_width = 0;

               if(this.state.checkNum == index){
                  text_color = Common.Activity_Text;
                  border_color = Common.Activity_Text;
                  border_width = 1;
               }

               var tab_text = {
                 display:'inline-block',
                 padding:'0 10px',
                 height:45,
                 lineHeight:'45px',
                 textAlign:'center',
                 fontSize:Fnt_Medium,
                 color:text_color,
                 borderBottomStyle:'solid',
                 borderBottomWidth:border_width,
                 borderBottomColor:border_color,
               }
               return(
                 <div key={index} style={styles.tab} onClick={this.ChooseTab.bind(this,index)}>
                    <div style={tab_text}>{item}</div>
                 </div>
               )
             })
           }
        </div>
      </div>

    <div style={{width:devWidth,height:devHeight-96,overflowY:'auto'}}>
      {/*视频课*/}
      <div style={{display:this.state.checkNum == 0 ? 'block':'none',}}>
        {this.state.type == 2 && this.state.courseList.length>0 ?
          <div>
            <OnlineLessonDiv {...onlineProps}/>
            <div style={{display:this.state.loadMore ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray,marginTop:10,}}>已经到底啦~</div>
          </div>
          :
          listNull
        }
      </div>

      {/*直播课*/}
      <div style={{display:this.state.checkNum == 1 ? 'block':'none'}}>
        {this.state.type == 1 && this.state.courseList.length>0 ?
          <div>
            <LiveLessonDiv {...liveProps}/>
            <div style={{display:this.state.loadMore ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray,marginTop:10,}}>已经到底啦~</div>
          </div>
          :
          listNull
        }
      </div>
    </div>
    <Link to={toLink} style={{display:this.state.courseList.length>0 ? 'block':'none'}}>
      <div style={styles.add_box}>
        <div style={styles.add_img}>
          <img src={Dm.getUrl_img('/img/v2/icons/choice_course@2x.png')} width="16" height="18"/>
        </div>
        <div style={styles.add_lesson}>
          去选课
        </div>
      </div>
    </Link>
  </div>
    )
  }

}

var styles={
  container:{
    width:devWidth,
    height:devHeight,
    backgroundColor:Common.Bg_White,
    position:'relative',
  },
  tab_box:{
    height:45,
    borderBottomColor:'#F4F4F4',
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    position:'relative',
  },
  tab_con:{
    position:'absolute',
    left:0,
    bottom:0,
    padding:'0 10px',
    width:devWidth,
    height:45,
    lineHeight:'45px',
  },
  tab:{
    width:devWidth/2,
    height:45,
    lineHeight:'45px',
    textAlign:'center',
    float:'left',
  },
  collecButton:{
    width: 120,
    height: 39,
    border: '1px solid',
    borderRadius: 25,
    borderColor: '#666666',
    marginLeft: (window.screen.width-120)/2,
    lineHeight: 2.5,
    marginTop: 22,
    textAlign:'center',
  },
  add_box:{
    position:'absolute',
    zIndex:99,
    left:0,
    bottom:0,
    width:devWidth,
    height:49,
    borderTop:'solid 1px #E5E5E5',
    backgroundColor:'#fff',
    display:'flex',
    flex:1,
  },
  add_img:{
    display:'flex',
    flex:1,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'flex-end',
  },
  add_lesson:{
    display:'flex',
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    lineHeight:'49px',
    color:Common.Activity_Text,
    fontSize:Fnt_Normal,
    marginLeft:5,
  }
}


export default ChoiceCourse;
