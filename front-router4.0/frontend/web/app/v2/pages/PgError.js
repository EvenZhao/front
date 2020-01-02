import Dispatcher from '../AppDispatcher';
import React from 'react';
const PropTypes = React.PropTypes;
import EventCenter from '../EventCenter';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Dm from '../util/DmURL'



class PgError extends React.Component {
	constructor(props) {
    super(props);
    this.phone = '',
		this.wx_config_share_home = {
		    title: '铂略咨询-财税领域实战培训供应商',
		    desc: '企业财务管理培训,财务培训课程,税务培训课程',
		    link: 'https://mb.bolue.cn/',
		    imgUrl: Dm.getUrl_img('/img/v2/icons/bolueLogo.png'),
		    type: 'link'
		};
		this.state = {

		};

	}

	gotoDownLoad(re){

	}

  componentWillMount() {

  }

	componentDidMount() {
		Dispatcher.dispatch({
			actionType: 'WX_JS_CONFIG',
			onMenuShareAppMessage: this.wx_config_share_home
		})
	}
	componentWillUnmount() {
	}

	render(){

    return(
			<div style={{...styles.div}}>
				<div style={{...styles.content}}>
					<div>
						<img src={Dm.getUrl_img(`/img/v2/icons/downloadLogo@2x.png`)} width="48" height="48" />
					</div>
					<div>
						<span style={{...styles.font}}>404</span>
					</div>
					<div>
						<Link to={`${__rootDir}/`}>
							<span style={{fontSize:14,color:'#2196f3'}}>进入首页</span>
						</Link>
					</div>
				</div>
			</div>
    )
  }
}

var styles = {
  div:{
    width: window.screen.width,
    height: window.innerHeight,
    backgroundColor:'#FFFFFF',
    // position:'absolute',
  },
	content:{
		width: window.screen.width,
		position:'relative',
		top:window.innerHeight/3,
		textAlign:'center',

	},
	font:{
		fontFamily:'fantasy',
		fontSize:70,
		color:'#2196f3'
	}

}

export default PgError;
