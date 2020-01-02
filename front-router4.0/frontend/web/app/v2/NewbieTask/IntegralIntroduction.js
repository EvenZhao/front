import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';
import FullLoading from '../components/FullLoading';


class IntegralIntroduction extends React.Component {
	constructor(props) {
    super(props);
		this.state = {

		};

	}

  componentWillMount() {

  }

	componentDidMount() {
    devWidth = window.screen.width;
    devHeight = window.innerHeight;
    EventCenter.emit("SET_TITLE",'铂略财课-积分介绍');
	}
	componentWillUnmount() {

	}

	render(){

    return(
      <div style={styles.container}>
        <div style={styles.box}>
          <div style={{padding:'25px 27px 20px 27px',width:devWidth-54,}}>
					<div style={{display:'flex',flexDirection:'row',height:20,alignItems:'center'}}>
              <span style={{color:Common.Activity_Text,fontSize:Fnt_Large}}>Q</span><span style={{color:Common.Black,fontSize:Fnt_Medium,marginLeft:5}}>积分的用途？</span>
            </div>
						<div style={{marginTop:7,display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
              <span style={{color:Common.Activity_Text,fontSize:Fnt_Large}}>A</span>
              <span style={{color:Common.Gray,fontSize:Fnt_Normal,marginLeft:5,paddingTop:2}}>积分可以用来兑换积分商城中的卡券或其他礼品。</span>
            </div>
          </div>
        </div>
        <div style={styles.box}>
          <div style={{padding:'25px 27px 20px 27px',width:devWidth-54,}}>
					<div style={{display:'flex',flexDirection:'row',height:20,alignItems:'center'}}>
              <span style={{color:Common.Activity_Text,fontSize:Fnt_Large}}>Q</span><span style={{color:Common.Black,fontSize:Fnt_Medium,marginLeft:5}}>如何获得积分？</span>
            </div>
						<div style={{marginTop:7,display:'flex',flexDirection:'row',alignItems:'flex-start'}}>
              <span style={{color:Common.Activity_Text,fontSize:Fnt_Large}}>A</span>
              <span style={{color:Common.Gray,fontSize:Fnt_Normal,marginLeft:5,paddingTop:2}}>完成积分任务即可赚取积分哦~</span>
            </div>
          </div>
        </div>
        <div style={{...styles.box,borderBottom:'none',}}>
          <div style={{padding:'25px 27px 20px 27px',width:devWidth-54,}}>
            <div style={{display:'flex',flexDirection:'row',height:20,alignItems:'center'}}>
              <span style={{color:Common.Activity_Text,fontSize:Fnt_Large}}>Q</span>
              <span style={{color:Common.Black,fontSize:Fnt_Medium,marginLeft:5,}}>积分有有效期吗？</span>
            </div>
            <div style={{marginTop:7,width:devWidth,overflow:'hidden'}}>
              <span style={{color:Common.Activity_Text,fontSize:Fnt_Large,float:'left'}}>A</span>
              <div style={{color:Common.Gray,fontSize:Fnt_Normal,marginLeft:5,paddingTop:2,float:'left',width:devWidth-74}}>
								积分是有有效期的，通过完成积分任务获取的积分
                有效期为获得之日起至次年的12月31日，如在2017
                年9月30日获得一批积分，则该批积分失效日期为
                2018年12月31日。
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

var styles = {
  container:{
    width:devWidth,
    height:devHeight,
    overflowY:'auto',
    backgroundColor:Common.Bg_White,
  },
  box:{
    borderBottom:'solid 1px #f1f1f1',
    width:devWidth,
  }
}

export default IntegralIntroduction;
