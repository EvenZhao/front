/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'
import Common from '../Common';


var load
var t

class FullLoading extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      top: 0,
		};

	}

	componentDidMount() {
		clearInterval(load)
		clearTimeout(t)
    this._changeTop()
	}

	componentWillUnmount() {
		clearInterval(load)
		clearTimeout(t)
	}

  _changeTop() {
    if(this.state.top == 0) {
      this.setState({
        top: 12
      })
    } else {
      load = setInterval(() => {
        clearInterval(load)
        this.setState({
          top: 0
        })
      }, 300)
    }
    t = setTimeout(() => {
      this._changeTop()
    }, 500)
  }

	render(){
		return (
			<div style={{display: this.props.isShow ? 'block' : 'none'}}>
        <div style={{height: devHeight, width: devWidth, backgroundColor: '#fff', opacity:1, position: 'absolute', zIndex: 9999999, display: this.props.isShow ? 'block' : 'none'}}></div>
        <div style={{position: 'absolute', zIndex: 99999999, top: devHeight / 2 - 34, left: devWidth / 2 - 64}}>
          <img src={Dm.getUrl_img(`/img/v2/icons/load@2x.png`)} style={{position: 'relative', top: this.state.top, width: 34, height: 34}}/>
  				<div style={{display: 'inline-block', marginLeft: 12, color: '#333', position: 'relative', top: 3}}>正在加载…</div>
        </div>
			</div>
		)
	}
}

export default FullLoading;
