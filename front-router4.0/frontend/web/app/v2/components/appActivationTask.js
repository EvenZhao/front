import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';

// var urlll = document.location.href; // 获取当前url链接
// var ttt = urlll.split('activity')[1]


class appActivationTask extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
			mainHolderActivateHint:false
		};

	}

	gotoDownLoad(re){
		setTimeout( function(){ window.location="https://mb.bolue.cn/dlapp"; } , 1000);
	}

  componentWillMount() {

  }
	handleIsMainHolderActivateHint(re){
		this.setState({
			mainHolderActivateHint:re
		})
	}
	componentDidMount() {
		// console.log('mainHolderActivateHint',this.state.mainHolderActivateHint);
		this._getmainHolderActivateHint = EventCenter.on('mainHolderActivateHintDone',this.handleIsMainHolderActivateHint.bind(this))

	}
	componentWillUnmount() {
		this._getmainHolderActivateHint.remove()
	}

	render(){
    return(
			<div style={{...styles.div,display:this.state.mainHolderActivateHint ? 'block' :'none'}}>
        <div style={{...styles.zzc}}></div>
        <div style={{...styles.ActivationTask}}>
          <div style={{marginTop:14}}>
            <span style={{fontSize:17,color:'#030303'}}>很抱歉</span>
          </div>
          <div style={{}}>
            <span style={{fontSize:17,color:'#030303'}}>您尚未完成APP激活任务</span>
          </div>
          <div style={{marginTop:8}}>
            <span style={{fontSize:12,color:'#666666'}}>请登录铂略财课APP完成账号激活后，重新</span>
          </div>
          <div style={{}}>
            <span style={{fontSize:12,color:'#666666'}}>刷新本页，即可开始学习。</span>
          </div>
          <div style={{devWidth:270,height:1,backgroundColor:'#4d4d4d',marginTop:8}}></div>
          <div style={{marginTop:12}} onClick={this.gotoDownLoad.bind(this)}>
            <span style={{fontSize:16,color:'#0076ff'}}>前往下载</span>
          </div>
        </div>
			</div>
    )
  }
}

var styles = {
  div:{
    // width: devWidth,
    // height: devHeight,
  },
	zzc:{
		width: devWidth,
		height: devHeight,
		backgroundColor:'#000000',
		position:'absolute',
		zIndex: 9999999,
		opacity:0.2,
		top:0,
		textAlign:'center',
	},
  ActivationTask:{
    width: 270,
    height: 151,
    backgroundColor:'#ffffff',
    borderRadius:'12px',
    textAlign:'center',
    position:'absolute',
    zIndex: 99999991,
    top: 268,
    left: (devWidth-270)/2,
    lineHeight:1.2,
  }
}

export default appActivationTask;
