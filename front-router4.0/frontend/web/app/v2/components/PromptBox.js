import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'

class PromptBox extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.state = {
      phone: '',
		};

	}

  componentWillMount() {
  }

	componentDidMount() {
	}
	componentWillUnmount() {
	}

	render(){
    return(
      <div style={{...styles.mainDiv,top:this.props.top,display:this.props.display}}>
        <div style={{...styles.imgDiv}}>
          <img src={Dm.getUrl_img('/img/v2/icons/fault.png')} height="45" width="45"/>
        </div>
        <div style={{...styles.fontDiv}}>
          <span>{this.props.context}</span>
        </div>
      </div>
    )
  }
}

var styles = {
  mainDiv:{
    height:100,
    width:200,
    backgroundColor:'#373737',
    borderRadius:6,
    textAlign:'center',
    opacity: 0.8,
    position:'absolute',
    left:(window.screen.width - 200)/2,
  },
  imgDiv:{
    // marginTop:15,
    width:'100%',
    height:45,
    position: 'relative',
    top: 15,
  },
  fontDiv:{
    position: 'relative',
    fontSize:16,
    color:'#ffffff',
    top:24,
  },
}

export default PromptBox;
