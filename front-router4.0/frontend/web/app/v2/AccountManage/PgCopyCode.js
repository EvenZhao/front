/*
 * Author: Joyce
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL';
import Common from '../Common';
import funcs from '../util/funcs'
import VerifyType from '../VerifyType'
import ResultAlert from '../components/ResultAlert'

var countdown;
class PgCopyCode extends React.Component {

  constructor(props) {
    super(props);

    this.state={

    }
  }

  componentWillMount() {

	}
	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略邀请码');
    console.log('this.props',this.props.location.state.type);
	}
	componentWillUnmount() {

	}

  render(){

    return(
      <div style={styles.container}>
        <div style={{fontSize:Fnt_Medium,color:Common.Light_Black,fontWeight:'bold',paddingTop:30,paddingLeft:10}}>请在下方长按选中所有文案复制后进行粘贴分享</div>
        <div style={{width:devWidth - 20,marginLeft:9,marginTop:10, border:'solid 1px #bdbdbd',padding:'10px 0 10px 0'}}>
          {this.props.location.state.type == 'bolueCode' ?
            <div style={{padding:'0 12px',fontSize:Fnt_Normal,color:Common.Light_Gray}}>
              <div>欢迎使用铂略财课（官网：www.bolue.cn，APP：https://mb.bolue.cn/dlapp）学习！
              这是我的铂略邀请码：<span style={{color:Common.Light_Black}}>{this.props.location.state.code}</span>（有效期至{this.props.location.state.expireDate}）。</div>
              <div style={{marginTop:10,fontSize:Fnt_Medium}}>您可使用以下3种方式操作：</div>
              <div style={{marginTop:10}}>1.在注册账号时，将邀请码输入【邀请码】一栏内后进行提交；</div>
              <div style={{marginTop:10}}>2.在官网登录已有账号后，页面右上角头像下拉菜单中点击【获取2天VIP体验会员】中输入邀请码并提交；</div>
              <div style={{marginTop:10}}>3.使用 铂略财课 移动端（安卓/IOS应用、微信服务号）登录已有账号后，进入【我的】-【邀请码】-【铂略邀请码】页面中输入邀请码并提交。
              成功后，即可获得铂略2天VIP 体验权限</div>
            </div>
            :
            <div style={{padding:'0 12px',fontSize:Fnt_Normal,color:Common.Light_Gray}}>
              我正在使用铂略财课（官网：www.bolue.cn，
              APP：https://mb.bolue.cn/dlapp）学习，强烈推荐你来啊！
              这是我的好友邀请码：<span style={{color:Common.Light_Black}}>{this.props.location.state.code}</span>。<br/>
              注册账号时，直接输入至【邀请码】一栏即可。
            </div>
          }
        </div>
      </div>
    )

  }

}

var styles={ 
  container:{
    width:devWidth,
    height:devHeight,
    backgroundColor:Common.Bg_White
  },

}

export default PgCopyCode;
