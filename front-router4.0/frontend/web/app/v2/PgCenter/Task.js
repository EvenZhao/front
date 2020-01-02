import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import {dm} from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'

var skip = 0;
class Task extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      isDeadline:false,
      taskArry:[],
      loadMore:true,
    }
  }

  componentWillMount() {


  }

  componentDidMount() {

    this.e_TaskList = EventCenter.on('TaskListDone',this._handleTaskListDone.bind(this));
    this.e_TaskListLoadMore = EventCenter.on('TaskListLoadMoreDone',this._handleTaskListLoadMoreDone.bind(this))
  }

  componentWillUnmount() {
    this.e_TaskList.remove()
    this.e_TaskListLoadMore.remove()
  }

  render(){

    var listNull = (
			<div style={{textAlign:'center',paddingTop:70}}>
				<div>
					<img src={Dm.getUrl_img('/img/v2/icons/null.png')} />
				</div>
				<div style={{marginTop:51}}>
					<span style={{fontSize:13,color:'#333333'}}>暂无数据~</span>
				</div>
			</div>
		)

    return(
      <div style={styles.container}
      ref={(taskList)=> this.taskList = taskList}
      onTouchEnd={() => {this._labelScorll(this.taskList)}}>

      { this.state.taskArry.length > 0 ?
        <div style={{}}>
          {this.state.taskArry.map((item,index)=>{
            var task_status = '';
            var task_color = '';
            var isLine = 'block';
            if(item.is_complete == true){
              task_status = '已完成';
              task_color = Common.orange;
            }
            else {
              if(item.plan_type == true){
                task_status = '进行中';
                task_color = Common.Activity_Text;
              }else {
                task_status = '未完成';
                task_color = Common.red;
              }
            }

            if(index == this.state.taskArry.length-1){
              isLine = 'none';
            }
            else {
              isLine = 'block';
            }
            var id = item.id;
            return(
              <div key={index}>
                <Link to={`${__rootDir}/TaskDetail/${id}`}>
                  <div style={{...styles.title,paddingTop:20,fontWeight:'bold'}}>
                    {item.name}
                  </div>
                </Link>
                <div style={{marginTop:10}}>
                  <div style={{fontSize:Fnt_Normal,color:Common.Gray,float:'left'}}>{item.create_name}</div>
                  <div style={{float:'right',color:task_color,fontSize:Fnt_Normal}}>{task_status}</div>
                  <div style={Common.clear}></div>
                </div>
                <div style={{...styles.line,display:isLine}}></div>
              </div>
              )
            })
          }
        <div style={{display:this.state.loadMore ? 'block':'none',height:30,lineHeight:'30px',marginTop:10,textAlign:'center',fontSize:Fnt_Normal,color:Common.Gray}}>已经到底啦~</div>
      </div>
      :
      listNull
      }
      </div>
    )
  }

_handleTaskListDone(re){
  if(re.err){
    return;
  }
  if(re.result){
    skip = re.result.length;
    this.setState({
      taskArry:re.result || [],
      loadMore:re.result.length >= 15 ? true:false,
    });
  }
}

_handleTaskListLoadMoreDone(re){
  if(re.err){
    return;
  }
  this.setState({
    taskArry:re.result.contact(this.state.taskArry),
    loadMore:re.result.length >= 15 ? true:false,
  },()=>{
    skip = this.state.taskArry.length;
  });
}

_labelScorll(){
  if((this.taskList.scrollHeight - this.taskList.scrollTop - 220) <  document.documentElement.clientHeight) {
     if (this.state.taskArry.length < 15) {
       return
     }
     Dispatcher.dispatch({
       actionType: 'TaskList',
       skip:skip,
       limit:15,
       LoadMore:true,
     })
    }
}

}

var styles ={
  container:{
    backgroundColor:Common.Bg_White,
    height:devHeight,
    width:devWidth-24,
    padding:'0 12px',
    overflowY:'auto',
  },
  title:{
    fontSize:Fnt_Normal,
    color:Common.Black,
  },
  line:{
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#F4F4F4',
    width:devWidth-24,
    marginTop:15,
  },

}


export default Task;
