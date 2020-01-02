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

class PgLoadingPlay extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      top: 0
		};
	}

	componentDidMount() {
      this._changeTop()
	}

  _changeTop() {
    if(this.state.top == 0) {
      this.setState({
        top: 12
      })
    } else {
      var load = setInterval(() => {
        clearInterval(load)
        this.setState({
          top: 0
        })
      }, 300)
    }
    setTimeout(() => {
      this._changeTop()
    }, 500)
  }

	render(){
		return (
			<div style={{textAlign: 'center'}}>
        <img src={Dm.getUrl_img(`/img/v2/icons/load@2x.png`)} style={{position: 'relative', top: this.state.top, width: 40, height: 40}}/>
        <div style={{lineHeight: '40px', display: 'inline-block', marginLeft: 12, color: '#999'}}>正在加载…</div>
			</div>
		)
	}
}

export default PgLoadingPlay;
