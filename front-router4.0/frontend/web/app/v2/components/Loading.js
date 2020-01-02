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

var load
var t

class Loading extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      top: 0
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
			<div style={{textAlign: 'center', height: this.props.isShow == true ? 50 : 0, display: this.props.isShow == true ? 'block' : 'none'}}>
				<img src={Dm.getUrl_img(`/img/v2/icons/load@2x.png`)} style={{position: 'relative', top: this.state.top, width: 26, height: 26}}/>
				<div style={{display: 'inline-block', marginLeft: 12, color: '#999', position: 'relative', top: 6}}>正在加载…</div>
			</div>
		)
	}
}

export default Loading;
