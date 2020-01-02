/*
 * Author: Crane Leeon
 * */
import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { dm } from '../util/DmURL';

class PgBindWeixinFromWeb extends React.Component {
	constructor(props) {
    super(props);
		this.state = {
      msg: '扫我啊',
			color: 'red'
		};
	}

  _handlebindWeixinFromWebDone(re) {
    if(re.err) {
      this.setState({
        msg: re.err,
				color: 'red'
      })
    } else {
			localStorage.setItem("credentials.code", re.result.code);
			localStorage.setItem("credentials.openid", re.result.openid);
      this.setState({
        msg: re.result.msg,
				color: 'green'
      })
    }
  }

	componentDidMount() {
    var q = dm.getCurrentUrlQuery()
		if(!q || q == null) {
			this.setState({
	      msg: 'URL缺失',
				color: 'red'
	    })
		}
    Dispatcher.dispatch({
      actionType: 'BindWeixinFromWeb',
      uuid: q.uuid,
      ts: q.ts,
      token: q.token
    })
    this.setState({
      msg: '请求发送',
			color: 'green'
    })
    this.bindWeixinFromWebDone = EventCenter.on('bindWeixinFromWebDone', this._handlebindWeixinFromWebDone.bind(this))
	}

  componentWillUnmount() {
    this.bindWeixinFromWebDone.remove()
  }

	_goToIndex() {
		this.props.history.push({pathname: `${__rootDir}/`})
	}

	render(){
		return (
			<div style={{color: this.state.color, ...style.div}} onClick={this._goToIndex.bind(this)}>
				<span style={{border: '1px solid', padding: 10, borderRadius: 50}}>{this.state.msg}</span>
			</div>
		)
	}
}

var style = {
	div: {
		textAlign: 'center',
		marginTop: devHeight / 2 - 80,
		height: 40
	}
}

export default PgBindWeixinFromWeb;
