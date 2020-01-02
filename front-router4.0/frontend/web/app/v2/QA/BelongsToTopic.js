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


class BelongsToTopic extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      //是否关注
      isAttention:false,
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-所属话题');
  }

  componentWillUnmount() {
  }

  render(){
    return(
      <div style={{...styles.container}}>
        <div style={{height:100,overflow:'hidden'}}>
          <img src={Dm.getUrl_img('/img/v2/icons/acc_standards@2x.png')} width={60} height={60} style={{float:'left',marginTop:20,}}/>
          <div style={{marginLeft:8,float:'left',}}>
            <div style={{...styles.title}}>会计准则与财务报表</div>
            <div style={{float:'left',width:(window.screen.width-178)/2}}>
              <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{float:'left',marginTop:5}}/>
              <span style={{...styles.ques_text}}>
                10个问题
              </span>
            </div>
            <div style={{float:'left'}}>
              <img src={Dm.getUrl_img('/img/v2/icons/people@2x.png')} width={12} height={11} style={{float:'left',marginTop:6,}}/>
              <div style={{...styles.ques_text}}>
                100人关注
              </div>
            </div>
          </div>
          {
            this.state.isAttention ?
            <button style={{...styles.btn_attention,backgroundColor:'#d1d1d1'}} disabled={true}>已关注</button>
            :
            <button style={{...styles.btn_attention}} disabled={false}><span style={{color:Common.Bg_White,fontSize:20}}>+</span> 关注</button>
          }
        </div>
        <div style={{...styles.line,}}></div>




      </div>

    )
  }
}

var styles ={
  container:{
    paddingLeft:12,
    paddingRight:12,
    backgroundColor:Common.Bg_White,
    height:devHeight,
  },
  title:{
    color:'#000',
    fontSize:14,
    marginTop:30,
  },
  ques_text:{
    fontSize:Fnt_Small,
    color:Common.Light_Gray,
    marginLeft:5,
    float:'left',
    marginTop:2
  },
  line:{
    width:devWidth-24,
    borderBottomStyle:'solid',
    borderBottomWidth:1,
    borderBottomColor:'#F4F4F4',
  },
  btn_attention:{
    width:80,
    height:'30px',
    lineHeight:'28px',
    textAlign:'center',
    fontSize:Fnt_Normal,
    color:Common.Bg_White,
    borderRadius:2,
    backgroundColor:Common.Activity_Text,
    float:'right',
    marginTop:35,
    border:'none',
  }

}


export default BelongsToTopic;
