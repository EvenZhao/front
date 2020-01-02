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


class LectureQa extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      //是否关注
      checkNum: 0,
      topic:true,
      isAttention:false,
    }
    this.tab_box = ['我的邀请','我的提问','我的回答']
  }

  componentWillMount() {
  }

  componentDidMount() {
    EventCenter.emit("SET_TITLE",'问答，我的提问（讲师）');
  }

  componentWillUnmount() {
  }

  render(){

    return(
      <div>
        <div style={{...styles.lecture_bg}}>
          <img src={Dm.getUrl_img('/img/v2/icons/lecture_bg@2x.png')} style={styles.bg}/>
          <div style={styles.lecture_top}>
            <div style={{padding:'15px 20px 10px 20px'}}>
              <div style={{float:'left',position:'relative',}}>
                <img src={Dm.getUrl_img('/img/v2/icons/acc_standards@2x.png')} width={68} height={68} style={{float:'left',}}/>
              </div>
              <div style={{float:'left',marginLeft:15,marginTop:25}}>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>铂略会员</div>
                <div style={styles.tag}>注册会员</div>
              </div>
              <div style={Common.clear}></div>
              <div style={{marginTop:15}}>
                {
                  this.state.topic ?
                  <div>
                    <div style={{float:'left',color:'#E1E1E0',fontSize:Fnt_Small}}>关注话题：</div>
                    <div style={styles.lec_label}>
                      内控与合规
                    </div>
                    <div style={styles.lec_label}>
                      税务战略与管理
                    </div>
                    <Link>
                      <img src={Dm.getUrl_img('/img/v2/icons/lec_more@2x.png')} width={20} height={16} style={{float:'left',}}/>
                    </Link>
                    <div style={Common.clear}></div>
                  </div>
                  :
                  <div style={{fontSize:Fnt_Small,color:'#E1E1E0'}}>关注话题：此用户很懒，还未关注任何话题</div>
                }
              </div>
            </div>
            <div>
              <div style={{float:'left',width:window.screen.width/3,textAlign:'center'}}>
                <div style={{fontSize:13,color:'#AEAEAE'}}>关注</div>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>0</div>
              </div>
              <div style={{float:'left',width:window.screen.width/3,textAlign:'center'}}>
                <div style={{fontSize:13,color:'#AEAEAE'}}>问答</div>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>100</div>
              </div>
              <div style={{float:'left',width:window.screen.width/3,textAlign:'center'}}>
                <div style={{fontSize:13,color:'#AEAEAE'}}>课时</div>
                <div style={{fontSize:Fnt_Medium,color:Common.Bg_White,}}>90</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.tab_box}>
          <div style={styles.tab_position}>
          {
            this.tab_box.map((item,idx)=>{
              var tab_color = Common.Light_Gray;
              var borderBottomColor = '#f3f3f3';
              if (this.state.checkNum==idx) {
                tab_color = Common.Activity_Text;
                borderBottomColor = Common.Activity_Text;
              }

              var tab = {
                height:'44px',
                width:window.screen.width/3,
                textAlign:'center',
                fontSize:Fnt_Normal,
                float:'left',
                color:tab_color,
                borderBottomStyle:'solid',
                borderBottomWidth:2,
                borderBottomColor:borderBottomColor,
              }
              return(
                <div key={idx} onClick={this._clickTab.bind(this,idx)} style={tab}>
                  {item}
                </div>
              )
            })
          }
          </div>
        </div>

        <div style={{width:window.screen.width,height:window.innerHeight-226,backgroundColor:Common.Bg_White, overflowY:'auto',}}>
          <div style={{height:window.innerHeight-226}}>
            {/*课程*/}
            <div style={{display:this.state.checkNum == 0 ? 'block':'none'}}>
              课程同上之前版本一致
            </div>

            {/*问答 无回答只显示提问，无提问只显示回答*/}
            <div style={{display:this.state.checkNum == 1 ? 'block':'none',}}>
              {/*TA的回答*/}
            <div style={{width:window.screen.width-24, padding:'12px 12px 10px 12px', backgroundColor:Common.Bg_White}}>

              <div style={{marginTop:15,fontSize:Fnt_Medium,color:Common.Black,}}>随着经济的快速发展，企业的票据业务金额世世</div>
              <div>
                <img src={Dm.getUrl_img('/img/v2/icons/')} width={29} height={30} style={{float:'left',marginTop:13,}}/>
                <div style={{marginLeft:8,marginTop:16,float:'left',marginBottom:5,}}>
                  <span style={{color:Common.Gray,fontSize:Fnt_Normal,}}>王珲</span>
                  <span style={{color:Common.Gray,fontSize:Fnt_Normal,marginLeft:10,}}>资深税务专家</span>
                </div>
                <div style={Common.clear}></div>
                <div style={{fontSize:Fnt_Normal,color:Common.Black,marginTop:5,lineHeight:'20px'}}>
                  随着经济的快速发展，企业的票据业务金额正在？随着经济的快速发...
                </div>
              </div>
           </div>
          </div>

          <div style={{display:this.state.checkNum == 2 ? 'block':'none',}}>
            <div style={{height:115,padding:'5px 12px 12px 10px'}}>
              <div style={{height:60,overflow:'hidden',marginTop:15,}}>
                <img src={Dm.getUrl_img('/img/v2/icons/acc_standards@2x.png')} width={60} height={60} style={{float:'left',}}/>
                <div style={{marginLeft:8,float:'left',}}>
                  <div style={{...styles.title}}>王老师</div>
                  <div style={{color:Common.Black,fontSize:Fnt_Small}}>铂略 CFO</div>
                </div>
                {
                  this.state.isAttention ?
                  <button style={{...styles.btn_attention,backgroundColor:'#d1d1d1'}} disabled={true}>已关注</button>
                  :
                  <button style={{...styles.btn_attention}} disabled={false}><span style={{color:Common.Bg_White,fontSize:20}}>+</span> 关注</button>
                }
              </div>
              <div style={{marginTop:10,}}>
                <div style={{width:(window.screen.width-24)/3,float:'left',}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/t_ques@2x.png')} width={12} height={13} style={{float:'left',marginTop:10,}}/>
                  <span style={{fontSize:11,color:'#2A2A2A',marginLeft:5,float:'left',marginTop:6,}}>101个问题</span>
                </div>
                <div style={{width:(window.screen.width-24)/3,float:'left',}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/icon_sub@2x.png')} width={13} height={13} style={{float:'left',marginTop:10,}}/>
                  <span style={{fontSize:11,color:'#2A2A2A',marginLeft:5,float:'left',marginTop:6,}}>80个课程</span>
                </div>
                <div style={{width:(window.screen.width-24)/3,float:'left',}}>
                  <img src={Dm.getUrl_img('/img/v2/icons/expression@2x.png')} width={12} height={12} style={{float:'left',marginTop:10,}}/>
                  <span style={{fontSize:11,color:'#2A2A2A',marginLeft:5,float:'left',marginTop:6,}}>99%满意度</span>
                </div>
              </div>
            </div>
            <div style={{...styles.line,width:window.screen.width-24,}}></div>


          </div>
          </div>
        </div>

    </div>

    )
  }

  _clickTab(idx){
    this.setState({
      checkNum: idx,
    })
  }

}

var styles = {
  lecture_bg:{
    height:180,
    width:window.screen.width,
    position:'relative',
  },
  bg:{
    width:window.screen.width,
    height:180,
    position:'absolute',
    zIndex:1,
    top:0,
    left:0,
  },
  lecture_top:{
    width:window.screen.width,
    height:180,
    position:'absolute',
    zIndex:10,
    top:0,
    left:0,
  },
  tag:{
    height:15,
    lineHeight:'15px',
    fontSize:11,
    color:Common.Bg_White,
    padding:'0 10px',
    backgroundColor:Common.orange,
    borderRadius:8,
  },
  lec_label:{
    height:16,
    lineHeight:'16px',
    borderRadius:8,
    marginRight:14,
    float:'left',
    fontSize:11,
    color:Common.Black,
    padding:'0 10px',
    backgroundColor:'#E3F1FC',
  },
  line:{
    borderBottomWidth:1,
    borderBottomStyle:'solid',
    borderBottomColor:'#F4F4F4',
    width:window.screen.width,
    marginTop:15,
  },
  short_line:{
    height:11,
    width:1,
    backgroundColor:'#E5E5E5',
  },
  tab_box:{
    position:'relative',
    width:window.screen.width,
    height:'44px',
    lineHeight:'44px',
    borderBottomStyle:'solid',
    borderBottomWidth:2,
    borderBottomColor:'#F3F3F3',
    backgroundColor:Common.Bg_White,
    textAlign:'center',
  },
  tab_position:{
    position:'absolute',
    height:'44px',
    bottom:0,
    left:0,
  },
  count_num:{
    height:20,
    lineHeight:'20px',
    padding:'0 10px',
    borderRadius:8,
    border:'solid 1px #F3F3F3',
    color:'#cacaca',
    fontSize:Fnt_Normal,
    float:'left',
    marginTop:2,
  },
  LineClamp:{
    textOverflow:'ellipsis',
    whiteSpace:'normal',
    overflow:'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  logo_title: {
		color: '#333',
		fontSize: Fnt_Medium,
    float:'left',
    marginRight:10,
	},
  title:{
    color:'#000',
    fontSize:14,
    marginTop:12,
  },
  ques_text:{
    fontSize:Fnt_Small,
    color:Common.Light_Gray,
    marginLeft:5,
    float:'left',
    marginTop:2
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
    marginTop:15,
    border:'none',
  }



}


export default LectureQa;
