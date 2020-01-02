import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';




class AttentionPlease extends React.Component {
	constructor(props) {
    super(props);
		this.state = {

		};

	}
  componentWillMount() {


  }

	componentDidMount() {
    EventCenter.emit("SET_TITLE",'铂略财课-铂略提示');

	}
	componentWillUnmount() {
	}

	render(){

    return(
			<div style={{...styles.div}}>
        <div style={{...styles.top}}>
          <img src={Dm.getUrl_img('/img/v2/icons/logo@2x.png')} width={132} height={132} style={{}}/>
        </div>
        <div style={{...styles.second,top:288,height:20}}>
          <span style={{...styles.font,fontSize:14,color:'#999999'}}>您当前访问的网址目前仅支持电脑端访问</span>
        </div>
        <div style={{...styles.second,top:314,height:22}}>
          <span style={{...styles.font,fontSize:16,color:'#333333'}}>请使用电脑访问该网址</span>
        </div>
			</div>
    )
  }
}

var styles = {
  div:{
    width: devWidth,
    height: devHeight,
    backgroundColor: '#FFFFFF',
  },
  top:{
    width: 132,
    height: 132,
    position:'absolute',
    top: 140,
    left: (devWidth-132)/2,

  },
  second:{
    width: devWidth,
    textAlign: 'center',
    position:'absolute'
  },
  font:{
    fontFamily:'PingFangSC-Regular',
    letterSpacing: 0
  }

}

export default AttentionPlease;
